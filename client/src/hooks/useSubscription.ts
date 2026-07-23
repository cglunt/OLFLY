/**
 * useSubscription — RevenueCat in-app purchase hook
 *
 * On Android (native): initialises RevenueCat, checks the "plus" entitlement,
 * and exposes purchase / restore helpers.
 *
 * On web / during development: falls back to the user.plusActive DB field so
 * the rest of the app works without a RevenueCat API key.
 *
 * Setup checklist (do once per store, before shipping):
 *   1. Create a RevenueCat account → new project "Olfly"
 *   2. Create the subscription products in each store console:
 *        - Google Play Console → Monetize → Subscriptions
 *        - App Store Connect → Monetization → Subscriptions (one subscription group)
 *        - olfly_plus_monthly  ($6.99 / month)
 *        - olfly_plus_annual   ($49.99 / year)
 *   3. Import those products into RevenueCat; create entitlement "plus"
 *      and offering "default" with the $rc_monthly and $rc_annual packages.
 *   4. Copy the platform public API keys from the RevenueCat dashboard into .env:
 *        VITE_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxx
 *        VITE_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxx
 *      (they are baked into the web bundle at build time — rebuild after changing)
 *   5. Run: npx cap sync android  /  npx cap sync ios
 *   6. Rebuild and test on a real device (Play closed track / TestFlight sandbox).
 */

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { useAuth } from '@/lib/useAuth';
import { useToast } from '@/hooks/use-toast';

// ── Constants ────────────────────────────────────────────────────────────────

/** Must match the entitlement ID you create in the RevenueCat dashboard */
const PLUS_ENTITLEMENT = 'plus';

/** Must match the subscription product IDs in Google Play Console / App Store Connect */
export const RC_PRODUCTS = {
  monthly: 'olfly_plus_monthly',
  annual:  'olfly_plus_annual',
} as const;

const RC_ANDROID_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY as string | undefined;
const RC_IOS_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY as string | undefined;

/** RevenueCat public API key for the platform we're running on */
const RC_API_KEY = Capacitor.getPlatform() === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;

// ── Module-level SDK state ───────────────────────────────────────────────────
// RevenueCat must be configured once per app launch, not once per hook mount
// (the hook is used by several pages). The shared promise lets purchase/restore
// wait for — or trigger — configuration, and it resets on failure so a
// transient error at cold start can be retried on the next call.

type PurchasesApi = (typeof import('@revenuecat/purchases-capacitor'))['Purchases'];

let configurePromise: Promise<{ Purchases: PurchasesApi }> | null = null;
let configuredUid: string | null = null;
/** Last known entitlement, so remounts don't flash the paywall while re-checking */
let cachedIsPlus: boolean | null = null;

// NOTE: the promise resolves with the plugin WRAPPED in an object. Resolving
// with the plugin proxy directly hangs forever on iOS: await checks .then on
// the resolved value, Capacitor's proxy turns that into a native call named
// "then", which rejects "not implemented on ios" and the promise never settles.
function configurePurchases(uid: string): Promise<{ Purchases: PurchasesApi }> {
  if (!configurePromise || configuredUid !== uid) {
    configuredUid = uid;
    configurePromise = (async () => {
      const { Purchases, LOG_LEVEL } = await import('@revenuecat/purchases-capacitor');
      await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
      await Purchases.configure({
        apiKey: RC_API_KEY!,
        appUserID: uid, // link to Firebase UID so server webhook can sync
      });
      return { Purchases };
    })();
    configurePromise.catch(() => {
      configurePromise = null;
      configuredUid = null;
    });
  }
  return configurePromise;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface SubscriptionState {
  /** true if the user has an active Plus entitlement */
  isPlus: boolean;
  /** true while RevenueCat is initialising or processing a purchase */
  isLoading: boolean;
  /** true when running inside the Android/iOS app (native billing available) */
  isNative: boolean;
  /** Initiate the $6.99/month purchase flow */
  purchaseMonthly: () => Promise<void>;
  /** Initiate the $49.99/year purchase flow */
  purchaseAnnual: () => Promise<void>;
  /** Restore previously purchased subscriptions */
  restorePurchases: () => Promise<void>;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useSubscription(): SubscriptionState {
  const { user: firebaseUser } = useAuth();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const isNative = Capacitor.isNativePlatform();

  // Only show the initial loading state when we have no cached answer yet;
  // on remounts the cached entitlement renders immediately and refreshes quietly.
  const [isLoading, setIsLoading] = useState(isNative && !!RC_API_KEY && cachedIsPlus === null);
  const [rcIsPlus, setRcIsPlus] = useState(cachedIsPlus ?? false);

  const applyCustomerInfo = useCallback((customerInfo: { entitlements: { active?: Record<string, unknown> } }) => {
    const hasPlus = PLUS_ENTITLEMENT in (customerInfo.entitlements.active ?? {});
    cachedIsPlus = hasPlus;
    setRcIsPlus(hasPlus);
    return hasPlus;
  }, []);

  // ── Initialise RevenueCat on native ──────────────────────────────────────
  useEffect(() => {
    if (!isNative || !RC_API_KEY || !firebaseUser?.uid) return;

    let cancelled = false;

    (async () => {
      try {
        // Dynamic import (inside configurePurchases) so the web build never
        // tries to resolve native modules
        const { Purchases } = await configurePurchases(firebaseUser.uid);
        const { customerInfo } = await Purchases.getCustomerInfo();
        if (!cancelled) applyCustomerInfo(customerInfo);
      } catch (err) {
        console.warn('[RevenueCat] init error:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isNative, firebaseUser?.uid, applyCustomerInfo]);

  // ── Purchase helper ───────────────────────────────────────────────────────
  const purchase = useCallback(async (period: 'monthly' | 'annual') => {
    if (!isNative || !RC_API_KEY) {
      toast({ title: 'Billing not available', description: 'Subscribe from the Olfly app on your iPhone or Android device.' });
      return;
    }
    if (!firebaseUser?.uid) {
      toast({ title: 'Please sign in', description: 'Sign in to your account before subscribing.' });
      return;
    }
    try {
      setIsLoading(true);
      // Waits for (or retries) SDK configuration, so a failed cold-start init
      // doesn't leave purchases running against an unconfigured SDK
      const { Purchases } = await configurePurchases(firebaseUser.uid);

      const offeringsResult = await Purchases.getOfferings();
      const productId = RC_PRODUCTS[period];
      const rcPackageType = period === 'annual' ? 'ANNUAL' : 'MONTHLY';
      // Match by standard package type first (store-agnostic), then by product
      // id — Google Play ids can arrive suffixed with the base plan (`id:plan`)
      const pkg = offeringsResult.current?.availablePackages.find(
        (p: any) =>
          p.packageType === rcPackageType ||
          p.product.identifier === productId ||
          p.product.identifier.startsWith(`${productId}:`)
      );
      if (!pkg) throw new Error(`No ${period} package found in RevenueCat offering`);

      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      const hasPlus = applyCustomerInfo(customerInfo);

      if (hasPlus) {
        toast({ title: 'Welcome to Olfly Plus! 🎉', description: 'Full access is now unlocked.' });
      }
    } catch (err: any) {
      // userCancelled is not an error — don't show a toast
      if (!err?.userCancelled) {
        toast({ title: 'Purchase failed', description: err?.message ?? 'Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isNative, firebaseUser?.uid, applyCustomerInfo, toast]);

  const purchaseMonthly = useCallback(() => purchase('monthly'), [purchase]);
  const purchaseAnnual  = useCallback(() => purchase('annual'),  [purchase]);

  // ── Restore purchases ─────────────────────────────────────────────────────
  const restorePurchases = useCallback(async () => {
    if (!isNative || !RC_API_KEY) {
      toast({ title: 'Nothing to restore', description: 'Open the app on your device to restore purchases.' });
      return;
    }
    if (!firebaseUser?.uid) {
      toast({ title: 'Please sign in', description: 'Sign in to your account before restoring purchases.' });
      return;
    }
    try {
      setIsLoading(true);
      const { Purchases } = await configurePurchases(firebaseUser.uid);
      const { customerInfo } = await Purchases.restorePurchases();
      const hasPlus = applyCustomerInfo(customerInfo);
      toast({
        title: hasPlus ? 'Purchases restored!' : 'No active subscription found',
        description: hasPlus ? 'Olfly Plus is active.' : 'Contact support if you think this is wrong.',
      });
    } catch (err: any) {
      toast({ title: 'Restore failed', description: err?.message ?? 'Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [isNative, firebaseUser?.uid, applyCustomerInfo, toast]);

  // ── Derived Plus status ───────────────────────────────────────────────────
  // Live RevenueCat entitlement when available, with the DB field (kept in
  // sync by the server webhook) as a fallback — so an RC outage or a fresh
  // offline launch doesn't lock a paying subscriber out on native, and web
  // keeps working without an RC key.
  const isPlus = rcIsPlus || (user?.plusActive ?? false);

  return { isPlus, isLoading, isNative, purchaseMonthly, purchaseAnnual, restorePurchases };
}

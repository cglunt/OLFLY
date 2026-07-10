/**
 * UpgradePrompt — full-screen paywall shown when a free user hits a Plus-gated page.
 *
 * Usage:
 *   const { isPlus, isLoading, purchaseMonthly, purchaseAnnual, restorePurchases } = useSubscription();
 *   if (!isPlus) return <UpgradePrompt ... />;
 */

import { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';

const STORE_NAME = Capacitor.getPlatform() === 'ios' ? 'the App Store' : 'Google Play';

interface UpgradePromptProps {
  /** The Plus feature the user was trying to access — shown in the header */
  featureName: string;
  /** Short description of what this screen unlocks */
  featureDescription: string;
  onPurchaseMonthly: () => Promise<void>;
  onPurchaseAnnual: () => Promise<void>;
  onRestore: () => Promise<void>;
  isLoading: boolean;
  /** Called by the Back button; defaults to navigating home */
  onBack?: () => void;
}

const PLUS_FEATURES = [
  'Full progress history & charts',
  'Recovery timeline',
  'Symptom journal with history',
  'Custom scent library',
  'Exportable personal reports',
  'Cloud sync across devices',
];

type BillingPeriod = 'monthly' | 'annual';

export function UpgradePrompt({
  featureName,
  featureDescription,
  onPurchaseMonthly,
  onPurchaseAnnual,
  onRestore,
  isLoading,
  onBack,
}: UpgradePromptProps) {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<BillingPeriod>('annual');

  const handleUpgrade = async () => {
    if (selected === 'annual') {
      await onPurchaseAnnual();
    } else {
      await onPurchaseMonthly();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c1d] flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <button
          onClick={onBack ?? (() => setLocation('/launch'))}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-10 gap-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center mx-auto shadow-lg shadow-[#6d45d2]/30">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{featureName}</h1>
            <p className="text-white/50 text-sm mt-1">{featureDescription}</p>
          </div>
        </div>

        {/* Features list */}
        <div className="bg-[#3b1645]/60 rounded-2xl p-5 space-y-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            Everything in Olfly Plus
          </p>
          {PLUS_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-white/80 text-sm">{f}</span>
            </div>
          ))}
        </div>

        {/* Pricing options */}
        <div className="space-y-3">
          {/* Annual — recommended */}
          <button
            onClick={() => setSelected('annual')}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
              selected === 'annual'
                ? 'border-[#ac41c3] bg-[#ac41c3]/10'
                : 'border-white/10 bg-[#3b1645]/40'
            }`}
          >
            {selected === 'annual' && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ac41c3] to-[#6d45d2] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                BEST VALUE
              </div>
            )}
            <div className="flex items-center justify-between pr-16">
              <div>
                <p className="text-white font-semibold">Annual</p>
                <p className="text-white/40 text-xs mt-0.5">Save 40% — billed once a year</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">$49.99</p>
                <p className="text-white/40 text-xs">/ year</p>
              </div>
            </div>
          </button>

          {/* Monthly */}
          <button
            onClick={() => setSelected('monthly')}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              selected === 'monthly'
                ? 'border-[#ac41c3] bg-[#ac41c3]/10'
                : 'border-white/10 bg-[#3b1645]/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Monthly</p>
                <p className="text-white/40 text-xs mt-0.5">Flexible — cancel anytime</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">$6.99</p>
                <p className="text-white/40 text-xs">/ month</p>
              </div>
            </div>
          </button>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold text-base rounded-2xl shadow-lg shadow-[#6d45d2]/30 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={18} className="mr-2" />
                Upgrade to Plus
              </>
            )}
          </Button>

          <button
            onClick={onRestore}
            disabled={isLoading}
            className="w-full text-white/30 hover:text-white/50 text-sm transition-colors py-1"
          >
            Restore previous purchase
          </button>
        </div>

        <p className="text-center text-white/20 text-xs px-4">
          Payments handled securely by {STORE_NAME}. Subscriptions renew automatically
          unless cancelled at least 24 hours before the end of the period — cancel anytime
          in your store account settings. Launch pricing subject to change.
          Olfly does not guarantee results.
        </p>
        <p className="text-center text-white/30 text-xs">
          <button onClick={() => setLocation('/legal/terms')} className="underline hover:text-white/50">
            Terms of Use
          </button>
          {' · '}
          <button onClick={() => setLocation('/legal/privacy')} className="underline hover:text-white/50">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}

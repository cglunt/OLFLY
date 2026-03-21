type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

// ── Platform detection ────────────────────────────────────────────────────────

/**
 * Returns true when running inside a Capacitor native app (iOS or Android).
 * Safe to call before Capacitor is installed — returns false gracefully on web.
 */
function isNativePlatform(): boolean {
  return (
    typeof (window as any).Capacitor !== 'undefined' &&
    (window as any).Capacitor.isNativePlatform?.() === true
  );
}

/**
 * Returns the Capacitor platform string ('ios' | 'android') or null on web.
 */
function getNativePlatform(): 'ios' | 'android' | null {
  if (!isNativePlatform()) return null;
  return (window as any).Capacitor?.getPlatform?.() ?? null;
}

/**
 * Dynamically imports @capacitor/push-notifications.
 * Returns null if the package is not yet installed (safe before Capacitor setup).
 */
async function getCapacitorPush() {
  if (!isNativePlatform()) return null;
  try {
    const mod = await import(/* @vite-ignore */ '@capacitor/push-notifications');
    return mod.PushNotifications;
  } catch {
    console.warn('[Notifications] @capacitor/push-notifications not installed yet');
    return null;
  }
}

const FCM_TOKEN_KEY = 'olfly_fcm_token';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a VAPID base64url public key to a Uint8Array for pushManager.subscribe() */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ── Service Worker & Web Push ─────────────────────────────────────────────────

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return null;
  }
}

/**
 * Subscribes the current device to push notifications.
 * - Native (Capacitor): registers for FCM/APNs, sends the device token to the server.
 * - Web: uses VAPID Web Push via the service worker.
 * Returns true on success.
 */
export async function subscribeToPushNotifications(): Promise<boolean> {
  // ── Native path ────────────────────────────────────────────────────────────
  if (isNativePlatform()) {
    const PushNotifications = await getCapacitorPush();
    if (!PushNotifications) return false;

    return new Promise((resolve) => {
      // Remove any stale listeners before adding new ones
      PushNotifications.removeAllListeners().then(() => {
        // Registration succeeded — send the FCM token to the server
        PushNotifications.addListener('registration', async (tokenData: { value: string }) => {
          try {
            const platform = getNativePlatform() ?? 'android';
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            const token = tokenData.value;

            // Cache locally so unsubscribe can reference it without a plugin call
            localStorage.setItem(FCM_TOKEN_KEY, token);

            const res = await fetch('/api/push/register-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ token, platform, timezone }),
            });
            resolve(res.ok);
          } catch (err) {
            console.error('[Notifications] FCM token registration error:', err);
            resolve(false);
          }
        });

        PushNotifications.addListener('registrationError', (err: unknown) => {
          console.error('[Notifications] FCM registrationError:', err);
          resolve(false);
        });

        PushNotifications.register();
      });
    });
  }

  // ── Web path ───────────────────────────────────────────────────────────────
  try {
    const reg = await registerServiceWorker();
    if (!reg) return false;

    const permission = Notification.permission;
    if (permission !== 'granted') return false;

    const keyRes = await fetch('/api/push/vapid-public-key');
    if (!keyRes.ok) return false;
    const { publicKey } = await keyRes.json();
    if (!publicKey) return false;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    const subJson = subscription.toJSON();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keys: subJson.keys,
        timezone,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Push subscription error:', err);
    return false;
  }
}

/**
 * Unsubscribes the current device from push notifications and notifies the server.
 */
export async function unsubscribeFromPushNotifications(): Promise<void> {
  // ── Native path ────────────────────────────────────────────────────────────
  if (isNativePlatform()) {
    try {
      const token = localStorage.getItem(FCM_TOKEN_KEY);
      if (!token) return;

      await fetch('/api/push/register-token', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });
      localStorage.removeItem(FCM_TOKEN_KEY);
    } catch (err) {
      console.error('[Notifications] FCM unsubscribe error:', err);
    }
    return;
  }

  // ── Web path ───────────────────────────────────────────────────────────────
  try {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;

    const endpoint = sub.endpoint;
    await sub.unsubscribe();

    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ endpoint }),
    });
  } catch (err) {
    console.error('Push unsubscribe error:', err);
  }
}

interface ReminderSettings {
  remindersEnabled: boolean;
  morningTime: string;
  eveningTime: string;
  permissionStatus: NotificationPermissionStatus;
}

const STORAGE_KEY = 'olfly_reminder_settings';
const PERMISSION_KEY = 'olfly_notification_permission';

export function isNotificationSupported(): boolean {
  // Native Capacitor apps always support notifications via FCM/APNs
  if (isNativePlatform()) return true;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) return 'unsupported';
  // On native, the permission status is async (requires plugin call), so we
  // read the last-known value cached in localStorage after requestPermission().
  if (isNativePlatform()) {
    return (localStorage.getItem(PERMISSION_KEY) as NotificationPermissionStatus) || 'default';
  }
  return Notification.permission as NotificationPermissionStatus;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) return 'unsupported';

  // ── Native path ────────────────────────────────────────────────────────────
  if (isNativePlatform()) {
    const PushNotifications = await getCapacitorPush();
    if (!PushNotifications) return 'unsupported';
    try {
      const result = await PushNotifications.requestPermissions();
      const status: NotificationPermissionStatus =
        result.receive === 'granted' ? 'granted' : 'denied';
      localStorage.setItem(PERMISSION_KEY, status);
      return status;
    } catch (error) {
      console.error('[Notifications] requestPermissions error:', error);
      return 'denied';
    }
  }

  // ── Web path ───────────────────────────────────────────────────────────────
  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(PERMISSION_KEY, permission);
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function getReminderSettings(): ReminderSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  const defaults: ReminderSettings = {
    remindersEnabled: false,
    morningTime: '08:00',
    eveningTime: '20:00',
    permissionStatus: getNotificationPermission(),
  };
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...defaults, ...parsed, permissionStatus: getNotificationPermission() };
    } catch {
      return defaults;
    }
  }
  return defaults;
}

export function saveReminderSettings(settings: Partial<ReminderSettings>): void {
  const current = getReminderSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function showNotification(title: string, body: string): void {
  if (getNotificationPermission() !== 'granted') return;
  
  try {
    new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'olfly-reminder',
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

let morningTimeout: ReturnType<typeof setTimeout> | null = null;
let eveningTimeout: ReturnType<typeof setTimeout> | null = null;

function getNextReminderTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(hours, minutes, 0, 0);
  
  if (reminder <= now) {
    reminder.setDate(reminder.getDate() + 1);
  }
  
  return reminder;
}

export function scheduleReminders(morningTime: string, eveningTime: string): void {
  cancelReminders();
  
  if (getNotificationPermission() !== 'granted') return;
  
  const morningDate = getNextReminderTime(morningTime);
  const eveningDate = getNextReminderTime(eveningTime);
  
  const now = Date.now();
  
  morningTimeout = setTimeout(() => {
    showNotification(
      'Time for your smell training',
      'Your scents are waiting. A quick session helps rebuild your senses.'
    );
    scheduleReminders(morningTime, eveningTime);
  }, morningDate.getTime() - now);
  
  eveningTimeout = setTimeout(() => {
    showNotification(
      'Quick reset',
      'A few minutes of smell training can help. Ready when you are.'
    );
    scheduleReminders(morningTime, eveningTime);
  }, eveningDate.getTime() - now);
}

export function cancelReminders(): void {
  if (morningTimeout) {
    clearTimeout(morningTimeout);
    morningTimeout = null;
  }
  if (eveningTimeout) {
    clearTimeout(eveningTimeout);
    eveningTimeout = null;
  }
}

export function getNextReminderDisplay(morningTime: string, eveningTime: string): string | null {
  const [mH, mM] = morningTime.split(':').map(Number);
  const [eH, eM] = eveningTime.split(':').map(Number);
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const morningMinutes = mH * 60 + mM;
  const eveningMinutes = eH * 60 + eM;
  
  const formatTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };
  
  if (currentMinutes < morningMinutes) {
    return formatTime(mH, mM);
  } else if (currentMinutes < eveningMinutes) {
    return formatTime(eH, eM);
  } else {
    return formatTime(mH, mM);
  }
}

// TODO: Future calendar integration
// Feature flag for calendar sync - do not implement yet
export const CALENDAR_SYNC_ENABLED = false;

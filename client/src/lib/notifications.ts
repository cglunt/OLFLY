type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

interface ReminderSettings {
  remindersEnabled: boolean;
  morningTime: string;
  eveningTime: string;
  permissionStatus: NotificationPermissionStatus;
}

const STORAGE_KEY = 'olfly_reminder_settings';
const PERMISSION_KEY = 'olfly_notification_permission';

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionStatus;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) return 'unsupported';
  
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

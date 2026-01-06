import chimeSound from '@assets/sounds/chime.mp3';
import notificationSound from '@assets/sounds/notification.mp3';

export function playChime(soundEnabled: boolean = true) {
  if (!soundEnabled) return;
  const audio = new Audio(chimeSound);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playNotification(soundEnabled: boolean = true) {
  if (!soundEnabled) return;
  const audio = new Audio(notificationSound);
  audio.volume = 0.6;
  audio.play().catch(() => {});
}

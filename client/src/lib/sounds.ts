import chimeSound from '@assets/sounds/chime.mp3';
import notificationSound from '@assets/sounds/notification.mp3';
import restBreathSound from '@assets/sounds/rest-breath.mp3';

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

let restAudio: HTMLAudioElement | null = null;

export function playRestBreath(soundEnabled: boolean = true): HTMLAudioElement | null {
  if (!soundEnabled) return null;
  stopRestBreath();
  restAudio = new Audio(restBreathSound);
  restAudio.volume = 0.5;
  restAudio.loop = true;
  restAudio.play().catch(() => {});
  return restAudio;
}

export function pauseRestBreath() {
  if (restAudio) {
    restAudio.pause();
  }
}

export function resumeRestBreath() {
  if (restAudio) {
    restAudio.play().catch(() => {});
  }
}

export function stopRestBreath() {
  if (restAudio) {
    restAudio.pause();
    restAudio.currentTime = 0;
    restAudio = null;
  }
}

export function getRestAudio(): HTMLAudioElement | null {
  return restAudio;
}

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

let restAudioInstance: HTMLAudioElement | null = null;

export function playRestBreath(soundEnabled: boolean = true): HTMLAudioElement | null {
  if (!soundEnabled) return null;
  
  if (restAudioInstance) {
    restAudioInstance.pause();
    restAudioInstance.currentTime = 0;
  }
  
  restAudioInstance = new Audio(restBreathSound);
  restAudioInstance.volume = 0.25;
  restAudioInstance.loop = true;
  restAudioInstance.play().catch(() => {});
  return restAudioInstance;
}

export function pauseRestBreath() {
  if (restAudioInstance && !restAudioInstance.paused) {
    restAudioInstance.pause();
  }
}

export function resumeRestBreath() {
  if (restAudioInstance && restAudioInstance.paused) {
    restAudioInstance.play().catch(() => {});
  }
}

export function stopRestBreath() {
  if (restAudioInstance) {
    restAudioInstance.pause();
    restAudioInstance.currentTime = 0;
    restAudioInstance = null;
  }
}

export function getRestAudio(): HTMLAudioElement | null {
  return restAudioInstance;
}

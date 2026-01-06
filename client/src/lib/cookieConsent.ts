export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'olfly_cookie_consent';

export function getDefaultPreferences(): CookiePreferences {
  return {
    essential: true,
    analytics: false,
    marketing: false,
  };
}

export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function getCookiePreferences(): CookiePreferences | null {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        essential: true,
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true,
      };
    }
  } catch (e) {
    console.error('Error reading cookie preferences:', e);
  }
  return null;
}

export function setCookiePreferences(preferences: CookiePreferences): boolean {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    return true;
  } catch (e) {
    console.error('Error saving cookie preferences:', e);
    return false;
  }
}

export function hasConsent(category: keyof CookiePreferences): boolean {
  if (category === 'essential') return true;
  const prefs = getCookiePreferences();
  if (!prefs) return false;
  return prefs[category] === true;
}

export function hasUserConsented(): boolean {
  if (!isStorageAvailable()) return false;
  return getCookiePreferences() !== null;
}

export function acceptAllCookies(): CookiePreferences {
  const prefs: CookiePreferences = {
    essential: true,
    analytics: true,
    marketing: true,
  };
  setCookiePreferences(prefs);
  loadConsentedScripts(prefs);
  return prefs;
}

export function savePreferences(prefs: CookiePreferences): void {
  prefs.essential = true;
  setCookiePreferences(prefs);
  loadConsentedScripts(prefs);
}

interface TrackerEntry {
  loader: () => void;
  executed: boolean;
}

const pendingTrackers: {
  analytics: TrackerEntry[];
  marketing: TrackerEntry[];
} = {
  analytics: [],
  marketing: [],
};

export function registerTracker(category: 'analytics' | 'marketing', loader: () => void): void {
  const entry: TrackerEntry = { loader, executed: false };
  
  if (hasConsent(category)) {
    entry.executed = true;
    loader();
  }
  
  pendingTrackers[category].push(entry);
}

function loadConsentedScripts(prefs: CookiePreferences): void {
  if (prefs.analytics) {
    pendingTrackers.analytics.forEach(entry => {
      if (!entry.executed) {
        entry.executed = true;
        entry.loader();
      }
    });
  }
  if (prefs.marketing) {
    pendingTrackers.marketing.forEach(entry => {
      if (!entry.executed) {
        entry.executed = true;
        entry.loader();
      }
    });
  }
}

export function initializeTrackers(): void {
  const prefs = getCookiePreferences();
  if (prefs) {
    loadConsentedScripts(prefs);
  }
}

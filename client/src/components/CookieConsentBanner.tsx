import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, Settings } from 'lucide-react';
import { 
  getCookiePreferences, 
  getDefaultPreferences, 
  acceptAllCookies, 
  savePreferences,
  isStorageAvailable,
  type CookiePreferences 
} from '@/lib/cookieConsent';

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function CookieConsentBanner({ forceOpen = false, onClose }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences());

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      const prefs = getCookiePreferences() || getDefaultPreferences();
      setPreferences(prefs);
      return;
    }
    
    if (!isStorageAvailable()) {
      return;
    }
    
    const existingPrefs = getCookiePreferences();
    if (!existingPrefs) {
      setIsVisible(true);
    }
  }, [forceOpen]);

  const handleAcceptAll = useCallback(() => {
    acceptAllCookies();
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  const handleSavePreferences = useCallback(() => {
    savePreferences(preferences);
    setShowPreferences(false);
    setIsVisible(false);
    onClose?.();
  }, [preferences, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showPreferences) {
      setShowPreferences(false);
    }
  }, [showPreferences]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {showPreferences ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowPreferences(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
            role="dialog"
            aria-labelledby="cookie-preferences-title"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="cookie-preferences-title" className="text-xl font-bold text-white">Cookie Preferences</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Close preferences"
                data-testid="button-close-preferences"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#3b1645] rounded-xl">
                <div>
                  <p className="font-medium text-white">Essential</p>
                  <p className="text-white/60 text-sm">Required for the website to function</p>
                </div>
                <Switch checked={true} disabled className="opacity-50" data-testid="switch-essential" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#3b1645] rounded-xl">
                <div>
                  <p className="font-medium text-white">Analytics</p>
                  <p className="text-white/60 text-sm">Help us understand how you use Olfly</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                  className="data-[state=checked]:bg-[#ac41c3]"
                  data-testid="switch-analytics"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#3b1645] rounded-xl">
                <div>
                  <p className="font-medium text-white">Marketing</p>
                  <p className="text-white/60 text-sm">Personalize ads and measure campaigns</p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                  className="data-[state=checked]:bg-[#ac41c3]"
                  data-testid="switch-marketing"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              <a href="/cookie-policy" className="hover:text-white/70 underline">Learn more about cookies</a>
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-4xl mx-auto bg-[#1a1a2e] rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie size={24} className="text-[#ac41c3] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm md:text-base">
                    We use cookies to improve your experience and analyze site traffic. You can accept all cookies or manage your preferences.
                  </p>
                  <a href="/cookie-policy" className="text-[#ac41c3] text-sm hover:underline mt-1 inline-block">
                    Learn more
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                <Button
                  onClick={() => setShowPreferences(true)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full px-5"
                  data-testid="button-manage-preferences"
                >
                  <Settings size={16} className="mr-2" />
                  Manage preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-5"
                  data-testid="button-accept-all"
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton() {
  const [showBanner, setShowBanner] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowBanner(true)}
        className="text-white/40 hover:text-white/70 text-sm underline transition-colors"
        data-testid="button-cookie-settings"
      >
        Cookie Settings
      </button>
      {showBanner && (
        <CookieConsentBanner forceOpen={true} onClose={() => setShowBanner(false)} />
      )}
    </>
  );
}

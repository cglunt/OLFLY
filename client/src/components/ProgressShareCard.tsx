import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { playNotification } from '@/lib/sounds';

interface ProgressShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'statement' | 'milestone' | 'moment';
  title: string;
  subtitle?: string;
  soundEnabled?: boolean;
}

export function ProgressShareCard({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  subtitle,
  soundEnabled = true 
}: ProgressShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
      });
      const link = document.createElement('a');
      link.download = `olfly-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      playNotification(soundEnabled);
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
    setIsGenerating(false);
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `olfly-${type}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Olfly Progress',
          text: title,
        });
        playNotification(soundEnabled);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to share:', err);
      handleDownload();
    }
    setIsGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0c0c1d] rounded-2xl p-4 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Share Progress</h3>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-center mb-4 overflow-hidden rounded-xl">
              <div 
                ref={cardRef}
                className="w-[270px] h-[270px] flex flex-col items-center justify-center p-8 text-center"
                style={{
                  background: 'linear-gradient(135deg, #1A0F35 0%, #2B215B 100%)',
                }}
              >
                <div 
                  className="flex-1 flex items-center justify-center"
                  style={{ maxWidth: '90%' }}
                >
                  <p 
                    className="font-bold text-white leading-tight"
                    style={{ 
                      fontSize: title.length > 50 ? '16px' : title.length > 30 ? '20px' : '24px' 
                    }}
                  >
                    {title}
                  </p>
                </div>
                {subtitle && (
                  <p className="text-white/60 text-xs mt-2">{subtitle}</p>
                )}
                <div className="mt-auto pt-4">
                  <p 
                    className="text-xs font-medium"
                    style={{
                      background: 'linear-gradient(90deg, #DF37FF, #A259FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Olfly • Wake up your super sniffer
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 bg-[#3b1645] hover:bg-[#4a1c57] text-white rounded-xl h-11"
                data-testid="button-download-card"
              >
                <Download size={18} className="mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white rounded-xl h-11"
                data-testid="button-share-card"
              >
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

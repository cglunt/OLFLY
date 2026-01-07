import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { playNotification } from '@/lib/sounds';
import topMiaImg from '@assets/top-mia.png';
import lowerGinaImg from '@assets/Lower_Gina@2x_1767069623166.png';
import lowerLiuImg from '@assets/Lower_Liu@2x_1767069623166.png';

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
        height: 1920,
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
        height: 1920,
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
                className="w-[180px] h-[320px] relative overflow-hidden"
                style={{
                  background: '#0c0c1d',
                }}
              >
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex flex-col items-center pt-6 px-4 z-10">
                    <div className="relative mb-2">
                      <div 
                        className="w-10 h-10 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at center, #0c0c1d 30%, #6d45d2 60%, #db2faa 100%)',
                          boxShadow: '0 0 20px rgba(109, 69, 210, 0.5)',
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-0.5 mb-3">
                      <span 
                        className="text-sm font-bold"
                        style={{
                          background: 'linear-gradient(90deg, #6d45d2, #9b6dff)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        OLF
                      </span>
                      <span className="text-sm font-bold text-white/90">LY</span>
                    </div>
                    
                    <h2 
                      className="text-white font-black text-center leading-none"
                      style={{
                        fontSize: title.length > 30 ? '22px' : title.length > 20 ? '26px' : '32px',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {title}
                    </h2>
                    
                    {subtitle && (
                      <p 
                        className="text-white/60 text-xs mt-1.5 uppercase tracking-widest"
                      >
                        {subtitle}
                      </p>
                    )}
                    
                    {!subtitle && (
                      <p className="text-white/60 text-xs mt-1.5 uppercase tracking-widest">
                        Smell Training
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-1 relative mt-4">
                    <img 
                      src={[topMiaImg, lowerGinaImg, lowerLiuImg][Math.floor(Date.now() / 1000) % 3]} 
                      alt="" 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-auto object-contain"
                      style={{
                        maxHeight: '180px',
                        width: 'auto',
                      }}
                    />
                  </div>
                  
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 z-10">
                    <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">Share</span>
                    <div className="flex -space-x-1">
                      <ChevronRight size={12} className="text-white/80" />
                      <ChevronRight size={12} className="text-white/60" />
                      <ChevronRight size={12} className="text-white/40" />
                    </div>
                  </div>
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

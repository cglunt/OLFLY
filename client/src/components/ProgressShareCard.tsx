import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { playNotification } from '@/lib/sounds';
import lowerGinaImg from '@assets/Lower_Gina@2x_1767069623166.png';

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
          className="fixed inset-0 z-50 flex flex-col bg-[#0c0c1d]"
        >
          <div className="flex justify-between items-center p-4 shrink-0">
            <h3 className="text-white font-bold">Share Progress</h3>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div 
            ref={cardRef}
            className="flex-1 flex flex-col bg-[#0c0c1d] relative"
          >
            <div className="flex flex-col items-center pt-12 px-6">
              <div className="relative mb-4">
                <div 
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, #0c0c1d 30%, #6d45d2 60%, #db2faa 100%)',
                    boxShadow: '0 0 30px rgba(109, 69, 210, 0.5)',
                  }}
                />
              </div>
              <div className="flex items-center gap-1 mb-8">
                <span 
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #6d45d2, #9b6dff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  OLF
                </span>
                <span className="text-xl font-bold text-white/90">LY</span>
              </div>
              
              <h2 
                className="text-white font-black text-center leading-tight mb-4"
                style={{
                  fontSize: title.length > 30 ? '32px' : title.length > 20 ? '40px' : '48px',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h2>
              
              <p className="text-white/60 text-base mt-2">
                {subtitle || 'Smell Training'}
              </p>
              
              <button 
                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-full text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <img 
                src={lowerGinaImg} 
                alt="" 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[280px] h-auto object-contain"
              />
            </div>
          </div>

          <div className="flex gap-3 p-4 shrink-0">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-[#3b1645] hover:bg-[#4a1c57] text-white rounded-xl h-12"
              data-testid="button-download-card"
            >
              <Download size={18} className="mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white rounded-xl h-12"
              data-testid="button-share-card"
            >
              <Share2 size={18} className="mr-2" />
              Share
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

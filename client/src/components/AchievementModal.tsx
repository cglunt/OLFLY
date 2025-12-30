import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Copy, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { StreakShareCard, ImprovementShareCard, MilestoneShareCard } from './ShareCard';
import type { UnlockedAchievement, AchievementStats } from '@/lib/achievements';

interface AchievementModalProps {
  achievement: UnlockedAchievement | null;
  stats: AchievementStats;
  onClose: () => void;
  userName?: string;
}

export function AchievementModal({ achievement, stats, onClose, userName }: AchievementModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!achievement) return null;

  const CardComponent = 
    achievement.shareTemplateType === 'streak' ? StreakShareCard :
    achievement.shareTemplateType === 'improvement' ? ImprovementShareCard :
    MilestoneShareCard;

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
      });
      
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `olfly-${achievement.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    setIsExporting(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      handleDownload();
      return;
    }
    
    setIsExporting(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      
      const file = new File([blob], `olfly-${achievement.id}.png`, { type: 'image/png' });
      
      await navigator.share({
        title: `I earned "${achievement.title}" on Olfly!`,
        text: achievement.description,
        files: [file],
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        handleDownload();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={!!achievement} onOpenChange={() => onClose()}>
      <DialogContent className="bg-[#1a1a2e] border-white/10 text-white max-w-md mx-auto p-0 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="p-8 text-center bg-gradient-to-b from-[#2B215B] to-[#1a1a2e]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="text-8xl mb-6"
            >
              {achievement.icon}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {achievement.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg"
            >
              {achievement.description}
            </motion.p>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-center text-white/60 text-sm">
              Share your achievement with friends!
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={handleShare}
                disabled={isExporting}
                className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white flex flex-col items-center gap-2 py-6 h-auto"
                data-testid="button-share"
              >
                <Share2 size={20} />
                <span className="text-xs">Share</span>
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={isExporting}
                className="bg-[#3b1645] hover:bg-[#4a1c57] text-white flex flex-col items-center gap-2 py-6 h-auto"
                data-testid="button-download"
              >
                <Download size={20} />
                <span className="text-xs">Download</span>
              </Button>
              
              <Button
                onClick={handleCopy}
                disabled={isExporting}
                className="bg-[#3b1645] hover:bg-[#4a1c57] text-white flex flex-col items-center gap-2 py-6 h-auto"
                data-testid="button-copy"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/10"
              data-testid="button-not-now"
            >
              Not now
            </Button>
          </div>
        </div>
        
        <div className="fixed -left-[9999px] top-0">
          <CardComponent
            ref={cardRef}
            achievement={achievement}
            stats={stats}
            userName={userName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

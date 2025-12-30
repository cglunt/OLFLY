import { forwardRef } from 'react';
import type { UnlockedAchievement, AchievementStats } from '@/lib/achievements';

interface ShareCardProps {
  achievement: UnlockedAchievement;
  stats: AchievementStats;
  userName?: string;
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 60;
  const width = 200;
  const stepX = width / (data.length - 1);
  
  const points = data.map((val, i) => ({
    x: i * stepX,
    y: height - ((val - min) / range) * height,
  }));
  
  const pathD = points.reduce((acc, p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
  );
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DF37FF" />
          <stop offset="100%" stopColor="#A259FF" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="url(#sparklineGradient)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export const StreakShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ achievement, stats, userName }, ref) => (
    <div
      ref={ref}
      className="w-[1080px] h-[1080px] bg-[#1A0F35] flex flex-col items-center justify-center p-16"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="bg-[#2B215B] rounded-[48px] p-16 w-full h-full flex flex-col items-center justify-between">
        <div className="text-center">
          <div className="text-[120px] mb-8">{achievement.icon}</div>
          <h1 className="text-white text-[72px] font-bold mb-4">{achievement.title}</h1>
          <p className="text-white/70 text-[36px]">{achievement.description}</p>
        </div>
        
        <div className="flex flex-col items-center gap-8">
          <div className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-[32px] px-16 py-8">
            <span className="text-white text-[96px] font-bold">{stats.currentStreak}</span>
            <span className="text-white/90 text-[48px] ml-4">days</span>
          </div>
          <p className="text-white/60 text-[32px]">Consistency pays off.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <div className="text-left">
            <p className="text-white text-[28px] font-bold">
              <span className="text-[#DF37FF]">OLF</span>LY
            </p>
            <p className="text-white/50 text-[20px]">Wake up your super sniffer</p>
          </div>
        </div>
      </div>
    </div>
  )
);
StreakShareCard.displayName = 'StreakShareCard';

export const ImprovementShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ achievement, stats, userName }, ref) => (
    <div
      ref={ref}
      className="w-[1080px] h-[1080px] bg-[#1A0F35] flex flex-col items-center justify-center p-16"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="bg-[#2B215B] rounded-[48px] p-16 w-full h-full flex flex-col items-center justify-between">
        <div className="text-center">
          <div className="text-[120px] mb-8">{achievement.icon}</div>
          <h1 className="text-white text-[72px] font-bold mb-4">{achievement.title}</h1>
          <p className="text-white/70 text-[36px]">{achievement.description}</p>
        </div>
        
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="transform scale-[2.5]">
            <MiniSparkline data={stats.sparklineData} />
          </div>
          {stats.monthlyChange !== null && (
            <div className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-[32px] px-16 py-6">
              <span className="text-white text-[64px] font-bold">
                +{Math.round(stats.monthlyChange)}%
              </span>
              <span className="text-white/90 text-[32px] ml-4">this month</span>
            </div>
          )}
          <p className="text-white/60 text-[32px]">Your nose is leveling up.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <div className="text-left">
            <p className="text-white text-[28px] font-bold">
              <span className="text-[#DF37FF]">OLF</span>LY
            </p>
            <p className="text-white/50 text-[20px]">Wake up your super sniffer</p>
          </div>
        </div>
      </div>
    </div>
  )
);
ImprovementShareCard.displayName = 'ImprovementShareCard';

export const MilestoneShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ achievement, stats, userName }, ref) => (
    <div
      ref={ref}
      className="w-[1080px] h-[1080px] bg-[#1A0F35] flex flex-col items-center justify-center p-16"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="bg-[#2B215B] rounded-[48px] p-16 w-full h-full flex flex-col items-center justify-between">
        <div className="text-center">
          <div className="text-[140px] mb-8">{achievement.icon}</div>
          <h1 className="text-white text-[72px] font-bold mb-4">{achievement.title}</h1>
          <p className="text-white/70 text-[36px]">{achievement.description}</p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-[#1A0F35] rounded-[24px] px-12 py-8 text-center">
              <p className="text-[#DF37FF] text-[48px] font-bold">{stats.currentStreak}</p>
              <p className="text-white/60 text-[24px]">Day Streak</p>
            </div>
            <div className="bg-[#1A0F35] rounded-[24px] px-12 py-8 text-center">
              <p className="text-[#A259FF] text-[48px] font-bold">{stats.current7DayAvg.toFixed(1)}</p>
              <p className="text-white/60 text-[24px]">Avg Intensity</p>
            </div>
          </div>
          <p className="text-white/60 text-[32px]">Slow progress is still progress.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <div className="text-left">
            <p className="text-white text-[28px] font-bold">
              <span className="text-[#DF37FF]">OLF</span>LY
            </p>
            <p className="text-white/50 text-[20px]">Wake up your super sniffer</p>
          </div>
        </div>
      </div>
    </div>
  )
);
MilestoneShareCard.displayName = 'MilestoneShareCard';

export function ShareCardPreview({ achievement, stats, userName }: ShareCardProps) {
  const CardComponent = 
    achievement.shareTemplateType === 'streak' ? StreakShareCard :
    achievement.shareTemplateType === 'improvement' ? ImprovementShareCard :
    MilestoneShareCard;
  
  return (
    <div className="transform scale-[0.25] origin-top-left">
      <CardComponent achievement={achievement} stats={stats} userName={userName} />
    </div>
  );
}

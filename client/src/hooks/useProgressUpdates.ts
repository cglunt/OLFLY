import { useState, useEffect, useMemo } from 'react';
import type { Session } from '@shared/schema';

export const SUPPORT_STATEMENTS = [
  "Healing is not linear.",
  "Small signals matter.",
  "Consistency over perfection.",
  "Progress can be quiet.",
  "Showing up counts.",
  "Every sniff builds new pathways.",
  "Trust the process.",
  "You are doing important work.",
];

export interface JourneyMilestone {
  id: string;
  label: string;
  days: number;
  reached: boolean;
  reachedDate?: string;
}

export interface ProgressMoment {
  id: string;
  type: 'first_notice' | 'monthly_improvement' | 'scent_highlight' | 'consistency';
  title: string;
  detail: string;
  createdAt: string;
  dataSnapshot?: any;
}

const MILESTONE_DEFINITIONS = [
  { id: '7_days', label: '7 days since you started', days: 7 },
  { id: '30_days', label: '30 days since you started', days: 30 },
  { id: '3_months', label: '3 months into your recovery journey', days: 90 },
  { id: '6_months', label: '6 months into your recovery journey', days: 180 },
  { id: '1_year', label: '1 year since you started', days: 365 },
];

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function computeNewMoments(sessions: Session[], existingMoments: ProgressMoment[]): ProgressMoment[] {
  const newMoments: ProgressMoment[] = [];
  if (sessions.length === 0) return newMoments;

  const existingIds = new Set(existingMoments.map(m => m.id));
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentSessions = sessions.filter(s => new Date(s.createdAt) >= thirtyDaysAgo);
  const previousSessions = sessions.filter(s => {
    const date = new Date(s.createdAt);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  });

  const getAvgIntensity = (sessionList: Session[]) => {
    if (sessionList.length === 0) return 0;
    let total = 0;
    let count = 0;
    sessionList.forEach(s => {
      Object.values(s.scentRatings).forEach(r => {
        total += r as number;
        count++;
      });
    });
    return count > 0 ? total / count : 0;
  };

  const currentAvg = getAvgIntensity(recentSessions);
  const previousAvg = getAvgIntensity(previousSessions);

  const monthKey = `monthly_${now.getFullYear()}_${now.getMonth()}`;
  if (!existingIds.has(monthKey)) {
    if (previousSessions.length > 0 && currentAvg > previousAvg) {
      const improvement = Math.round(((currentAvg - previousAvg) / Math.max(previousAvg, 1)) * 100);
      if (improvement > 0) {
        newMoments.push({
          id: monthKey,
          type: 'monthly_improvement',
          title: `Smell clarity increased by ${improvement}% this month.`,
          detail: 'Based on your recent sessions',
          createdAt: now.toISOString(),
          dataSnapshot: { currentAvg, previousAvg, improvement },
        });
      }
    } else if (recentSessions.length > 0 && previousSessions.length === 0) {
      newMoments.push({
        id: monthKey,
        type: 'monthly_improvement',
        title: 'This month you built your baseline.',
        detail: 'Your first 30 days of data collection',
        createdAt: now.toISOString(),
      });
    }
  }

  const scentTotals: Record<string, { recent: number[]; previous: number[] }> = {};
  recentSessions.forEach(s => {
    Object.entries(s.scentRatings).forEach(([scent, rating]) => {
      if (!scentTotals[scent]) scentTotals[scent] = { recent: [], previous: [] };
      scentTotals[scent].recent.push(rating as number);
    });
  });
  previousSessions.forEach(s => {
    Object.entries(s.scentRatings).forEach(([scent, rating]) => {
      if (!scentTotals[scent]) scentTotals[scent] = { recent: [], previous: [] };
      scentTotals[scent].previous.push(rating as number);
    });
  });

  let bestScent = '';
  let bestImprovement = 0;
  Object.entries(scentTotals).forEach(([scent, data]) => {
    if (data.recent.length > 0 && data.previous.length > 0) {
      const recentAvg = data.recent.reduce((a, b) => a + b, 0) / data.recent.length;
      const prevAvg = data.previous.reduce((a, b) => a + b, 0) / data.previous.length;
      const improvement = recentAvg - prevAvg;
      if (improvement > bestImprovement) {
        bestImprovement = improvement;
        bestScent = scent;
      }
    }
  });

  const scentKey = `scent_highlight_${now.getFullYear()}_${now.getMonth()}`;
  if (bestScent && bestImprovement > 0 && !existingIds.has(scentKey)) {
    const formattedScent = bestScent.charAt(0).toUpperCase() + bestScent.slice(1);
    newMoments.push({
      id: scentKey,
      type: 'scent_highlight',
      title: `${formattedScent} improved the most this month.`,
      detail: 'Based on your recent sessions',
      createdAt: now.toISOString(),
      dataSnapshot: { scent: bestScent, improvement: bestImprovement },
    });
  }

  const sessionsThisMonth = recentSessions.length;
  const consistencyKey = `consistency_${now.getFullYear()}_${now.getMonth()}`;
  if (sessionsThisMonth >= 3 && !existingIds.has(consistencyKey)) {
    newMoments.push({
      id: consistencyKey,
      type: 'consistency',
      title: `Consistency is paying off. You practiced ${sessionsThisMonth} times this month.`,
      detail: 'Based on your recent sessions',
      createdAt: now.toISOString(),
      dataSnapshot: { sessionCount: sessionsThisMonth },
    });
  }

  Object.entries(scentTotals).forEach(([scent, data]) => {
    const hasRecentPositive = data.recent.some(r => r > 0);
    const allPreviousZero = data.previous.length === 0 || data.previous.every(r => r === 0);
    const firstNoticeKey = `first_notice_${scent}`;
    if (hasRecentPositive && allPreviousZero && data.previous.length > 0 && !existingIds.has(firstNoticeKey)) {
      const formattedScent = scent.charAt(0).toUpperCase() + scent.slice(1);
      newMoments.push({
        id: firstNoticeKey,
        type: 'first_notice',
        title: `First time noticing ${formattedScent} again.`,
        detail: 'A meaningful moment in your recovery',
        createdAt: now.toISOString(),
      });
    }
  });

  return newMoments;
}

export function useProgressUpdates(sessions: Session[]) {
  const [favoriteStatements, setFavoriteStatements] = useState<string[]>(() => 
    getStorageItem('olflyFavoriteStatements', [])
  );
  
  const [startDate, setStartDate] = useState<string | null>(() => 
    getStorageItem('olflyStartDate', null)
  );

  const [progressMoments, setProgressMoments] = useState<ProgressMoment[]>(() =>
    getStorageItem('olflyProgressMoments', [])
  );

  useEffect(() => {
    if (!startDate && sessions.length > 0) {
      const firstSession = [...sessions].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )[0];
      const date = new Date(firstSession.createdAt).toISOString();
      setStartDate(date);
      setStorageItem('olflyStartDate', date);
    }
  }, [sessions, startDate]);

  useEffect(() => {
    if (sessions.length === 0) return;
    
    const newMoments = computeNewMoments(sessions, progressMoments);
    if (newMoments.length > 0) {
      const updatedMoments = [...progressMoments, ...newMoments];
      setProgressMoments(updatedMoments);
      setStorageItem('olflyProgressMoments', updatedMoments);
    }
  }, [sessions]);

  const toggleFavorite = (statement: string) => {
    setFavoriteStatements(prev => {
      const newFavs = prev.includes(statement)
        ? prev.filter(s => s !== statement)
        : [...prev, statement];
      setStorageItem('olflyFavoriteStatements', newFavs);
      return newFavs;
    });
  };

  const journeyMilestones: JourneyMilestone[] = useMemo(() => {
    if (!startDate) return MILESTONE_DEFINITIONS.map(m => ({ ...m, reached: false }));
    
    const start = new Date(startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return MILESTONE_DEFINITIONS.map(m => {
      const reached = daysSinceStart >= m.days;
      const reachedDate = reached 
        ? new Date(start.getTime() + m.days * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      return { ...m, reached, reachedDate };
    });
  }, [startDate]);

  const daysSinceStart = useMemo(() => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate]);

  const sortedMoments = useMemo(() => {
    return [...progressMoments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [progressMoments]);

  return {
    supportStatements: SUPPORT_STATEMENTS,
    favoriteStatements,
    toggleFavorite,
    journeyMilestones,
    progressMoments: sortedMoments,
    startDate,
    daysSinceStart,
  };
}

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@shared/schema';
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  evaluateAchievements,
  calculateAchievementStats,
  type UnlockedAchievement,
  type AchievementStats,
  type Achievement,
} from '@/lib/achievements';

interface UseAchievementsReturn {
  unlockedAchievements: UnlockedAchievement[];
  lockedAchievements: Achievement[];
  stats: AchievementStats;
  newAchievement: UnlockedAchievement | null;
  dismissNewAchievement: () => void;
  checkForNewAchievements: () => void;
}

export function useAchievements(sessions: Session[]): UseAchievementsReturn {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<UnlockedAchievement | null>(null);
  const [stats, setStats] = useState<AchievementStats>({
    currentStreak: 0,
    last30DaysAvg: 0,
    previous30DaysAvg: 0,
    monthlyChange: null,
    personalBest7DayAvg: 0,
    previousBest7DayAvg: 0,
    current7DayAvg: 0,
    hasImproved: false,
    isNewPersonalBest: false,
    sparklineData: [],
  });

  useEffect(() => {
    const unlocked = getUnlockedAchievements();
    setUnlockedAchievements(unlocked);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      const newStats = calculateAchievementStats(sessions);
      setStats(newStats);
    }
  }, [sessions]);

  const checkForNewAchievements = useCallback(() => {
    const newlyUnlocked = evaluateAchievements(sessions);
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(getUnlockedAchievements());
      setNewAchievement(newlyUnlocked[0]);
    }
  }, [sessions]);

  useEffect(() => {
    if (sessions.length > 0) {
      checkForNewAchievements();
    }
  }, [sessions, checkForNewAchievements]);

  const dismissNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const lockedAchievements = ACHIEVEMENTS.filter(
    a => !unlockedAchievements.some(u => u.id === a.id)
  );

  return {
    unlockedAchievements,
    lockedAchievements,
    stats,
    newAchievement,
    dismissNewAchievement,
    checkForNewAchievements,
  };
}

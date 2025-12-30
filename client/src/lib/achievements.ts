import type { Session } from "@shared/schema";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'improvement';
  icon: string;
  threshold?: number;
  shareTemplateType: 'streak' | 'improvement' | 'milestone';
}

export interface UnlockedAchievement extends Achievement {
  unlockedAt: string;
  value?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'streak_3', title: 'Warm Up', description: '3 day training streak', category: 'streak', icon: '🔥', threshold: 3, shareTemplateType: 'streak' },
  { id: 'streak_7', title: 'Getting Serious', description: '7 day training streak', category: 'streak', icon: '⚡', threshold: 7, shareTemplateType: 'streak' },
  { id: 'streak_14', title: 'Habit Locked', description: '14 day training streak', category: 'streak', icon: '🔒', threshold: 14, shareTemplateType: 'streak' },
  { id: 'streak_30', title: 'Super Sniffer', description: '30 day training streak', category: 'streak', icon: '👃', threshold: 30, shareTemplateType: 'streak' },
  { id: 'streak_60', title: 'Nose Ninja', description: '60 day training streak', category: 'streak', icon: '🥷', threshold: 60, shareTemplateType: 'streak' },
  { id: 'streak_90', title: 'Scent Sensei', description: '90 day training streak', category: 'streak', icon: '🧘', threshold: 90, shareTemplateType: 'streak' },
  { id: 'first_improvement', title: 'First Spark', description: 'First intensity improvement detected', category: 'improvement', icon: '✨', shareTemplateType: 'improvement' },
  { id: 'monthly_improvement', title: 'Smell Signal Rising', description: 'Monthly improvement achieved', category: 'improvement', icon: '📈', shareTemplateType: 'improvement' },
  { id: 'personal_best', title: 'New Personal Best', description: 'Highest average intensity in 7 days', category: 'improvement', icon: '🏆', shareTemplateType: 'milestone' },
  { id: 'baseline_month', title: 'Progress You Can Feel', description: 'First full month of training', category: 'improvement', icon: '🌱', shareTemplateType: 'milestone' },
];

const STORAGE_KEY = 'olfly_achievements';

export function getUnlockedAchievements(): UnlockedAchievement[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(achievements: UnlockedAchievement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
}

export function unlockAchievement(achievement: Achievement, value?: number): UnlockedAchievement | null {
  const unlocked = getUnlockedAchievements();
  if (unlocked.some(a => a.id === achievement.id)) return null;
  
  const newAchievement: UnlockedAchievement = {
    ...achievement,
    unlockedAt: new Date().toISOString(),
    value,
  };
  
  unlocked.push(newAchievement);
  saveUnlockedAchievements(unlocked);
  return newAchievement;
}

function getSessionsByDate(sessions: Session[]): Map<string, Session[]> {
  const map = new Map<string, Session[]>();
  sessions.forEach(session => {
    if (!session.completed) return;
    const date = new Date(session.createdAt).toDateString();
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(session);
  });
  return map;
}

function calculateStreak(sessions: Session[]): number {
  const sessionsByDate = getSessionsByDate(sessions);
  const dates = Array.from(sessionsByDate.keys())
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());
  
  if (dates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  const todayStr = today.toDateString();
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toDateString();
  
  if (!sessionsByDate.has(todayStr) && !sessionsByDate.has(yesterdayStr)) {
    return 0;
  }
  
  if (!sessionsByDate.has(todayStr)) {
    checkDate = yesterdayDate;
  }
  
  while (true) {
    const dateStr = checkDate.toDateString();
    if (sessionsByDate.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

function getAverageIntensity(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const allRatings: number[] = [];
  sessions.forEach(s => {
    if (s.completed && s.scentRatings) {
      allRatings.push(...Object.values(s.scentRatings) as number[]);
    }
  });
  if (allRatings.length === 0) return 0;
  return allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
}

function getSessionsInRange(sessions: Session[], daysAgo: number, daysEnd: number = 0): Session[] {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysAgo);
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() - daysEnd);
  
  return sessions.filter(s => {
    const sessionDate = new Date(s.createdAt);
    return sessionDate >= startDate && sessionDate <= endDate && s.completed;
  });
}

function get7DayWindowAverages(sessions: Session[]): number[] {
  const averages: number[] = [];
  const sortedSessions = [...sessions]
    .filter(s => s.completed)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  if (sortedSessions.length < 7) return [];
  
  for (let i = 6; i < sortedSessions.length; i++) {
    const windowSessions = sortedSessions.slice(i - 6, i + 1);
    const avg = getAverageIntensity(windowSessions);
    averages.push(avg);
  }
  
  return averages;
}

export interface AchievementStats {
  currentStreak: number;
  last30DaysAvg: number;
  previous30DaysAvg: number;
  monthlyChange: number | null;
  personalBest7DayAvg: number;
  previousBest7DayAvg: number;
  current7DayAvg: number;
  hasImproved: boolean;
  isNewPersonalBest: boolean;
  sparklineData: number[];
}

export function calculateAchievementStats(sessions: Session[]): AchievementStats {
  const currentStreak = calculateStreak(sessions);
  
  const last30Sessions = getSessionsInRange(sessions, 30, 0);
  const previous30Sessions = getSessionsInRange(sessions, 60, 30);
  
  const last30DaysAvg = getAverageIntensity(last30Sessions);
  const previous30DaysAvg = getAverageIntensity(previous30Sessions);
  
  let monthlyChange: number | null = null;
  if (previous30DaysAvg > 0) {
    monthlyChange = ((last30DaysAvg - previous30DaysAvg) / previous30DaysAvg) * 100;
  }
  
  const last7Sessions = getSessionsInRange(sessions, 7, 0);
  const previous7Sessions = getSessionsInRange(sessions, 14, 7);
  const current7DayAvg = getAverageIntensity(last7Sessions);
  const prev7DayAvg = getAverageIntensity(previous7Sessions);
  
  const hasImproved = prev7DayAvg > 0 && current7DayAvg > prev7DayAvg;
  
  const olderSessions = sessions.filter(s => {
    const sessionDate = new Date(s.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sessionDate < sevenDaysAgo && s.completed;
  });
  
  const olderWindowAverages = get7DayWindowAverages(olderSessions);
  const hasPriorData = olderSessions.length >= 7;
  const previousBest7DayAvg = olderWindowAverages.length > 0 ? Math.max(...olderWindowAverages) : 0;
  
  const allWindowAverages = get7DayWindowAverages(sessions);
  const personalBest7DayAvg = allWindowAverages.length > 0 ? Math.max(...allWindowAverages) : 0;
  
  const isNewPersonalBest = current7DayAvg > 0 && 
    hasPriorData && 
    current7DayAvg > previousBest7DayAvg;
  
  const sparklineData = last30Sessions
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(s => {
      const ratings = Object.values(s.scentRatings) as number[];
      return ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    });
  
  return {
    currentStreak,
    last30DaysAvg,
    previous30DaysAvg,
    monthlyChange,
    personalBest7DayAvg,
    previousBest7DayAvg,
    current7DayAvg,
    hasImproved,
    isNewPersonalBest,
    sparklineData,
  };
}

export function evaluateAchievements(sessions: Session[]): UnlockedAchievement[] {
  const stats = calculateAchievementStats(sessions);
  const newlyUnlocked: UnlockedAchievement[] = [];
  
  const streakAchievements = ACHIEVEMENTS.filter(a => a.category === 'streak' && a.threshold);
  for (const achievement of streakAchievements) {
    if (stats.currentStreak >= achievement.threshold!) {
      const unlocked = unlockAchievement(achievement, stats.currentStreak);
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  
  if (stats.hasImproved) {
    const firstImprovement = ACHIEVEMENTS.find(a => a.id === 'first_improvement');
    if (firstImprovement) {
      const unlocked = unlockAchievement(firstImprovement);
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  
  if (stats.monthlyChange !== null && stats.monthlyChange > 0) {
    const monthlyImprovement = ACHIEVEMENTS.find(a => a.id === 'monthly_improvement');
    if (monthlyImprovement) {
      const unlocked = unlockAchievement(monthlyImprovement, Math.round(stats.monthlyChange));
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  
  if (stats.isNewPersonalBest) {
    const personalBest = ACHIEVEMENTS.find(a => a.id === 'personal_best');
    if (personalBest) {
      const unlocked = unlockAchievement(personalBest, stats.current7DayAvg);
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  
  const last30Sessions = getSessionsInRange(sessions, 30, 0);
  if (last30Sessions.length >= 20 && stats.previous30DaysAvg === 0) {
    const baselineMonth = ACHIEVEMENTS.find(a => a.id === 'baseline_month');
    if (baselineMonth) {
      const unlocked = unlockAchievement(baselineMonth);
      if (unlocked) newlyUnlocked.push(unlocked);
    }
  }
  
  return newlyUnlocked;
}

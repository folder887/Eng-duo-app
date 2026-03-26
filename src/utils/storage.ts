import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROGRESS: 'lingualeap_user_progress',
  USER_STATS: 'lingualeap_user_stats',
};

export interface UserProgress {
  completedLessons: string[];
  currentLevel: number;
  totalXp: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  lessonScores: Record<string, number>;
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  bestStreak: number;
  joinDate: string;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  currentLevel: 0,
  totalXp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  lessonScores: {},
};

const defaultStats: UserStats = {
  totalLessonsCompleted: 0,
  totalWordsLearned: 0,
  bestStreak: 0,
  joinDate: new Date().toISOString().split('T')[0],
};

export async function getUserProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    if (data) {
      const progress = JSON.parse(data) as UserProgress;
      // Check and update streak
      const today = new Date().toISOString().split('T')[0];
      const lastActive = progress.lastActiveDate;
      const dayDiff = Math.floor(
        (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayDiff > 1) {
        progress.streak = 0;
      }
      return progress;
    }
    return defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch {
    // silently fail
  }
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_STATS);
    return data ? JSON.parse(data) : defaultStats;
  } catch {
    return defaultStats;
  }
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
  } catch {
    // silently fail
  }
}

export async function completeLesson(
  lessonId: string,
  xpEarned: number,
  wordsLearned: number,
  score: number
): Promise<UserProgress> {
  const progress = await getUserProgress();
  const stats = await getUserStats();
  const today = new Date().toISOString().split('T')[0];

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    stats.totalLessonsCompleted += 1;
  }

  progress.totalXp += xpEarned;
  progress.lessonScores[lessonId] = Math.max(progress.lessonScores[lessonId] || 0, score);
  progress.currentLevel = Math.floor(progress.totalXp / 50);

  if (progress.lastActiveDate !== today) {
    const lastActive = progress.lastActiveDate;
    const dayDiff = Math.floor(
      (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayDiff === 1) {
      progress.streak += 1;
    } else if (dayDiff > 1) {
      progress.streak = 1;
    }
  } else if (progress.streak === 0) {
    progress.streak = 1;
  }

  progress.lastActiveDate = today;
  stats.totalWordsLearned += wordsLearned;
  stats.bestStreak = Math.max(stats.bestStreak, progress.streak);

  await saveUserProgress(progress);
  await saveUserStats(stats);

  return progress;
}

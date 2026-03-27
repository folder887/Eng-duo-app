import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, UserStats } from './storage';

const KEYS = {
  UNLOCKED: 'lingualeap_achievements_unlocked',
};

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  reward: number;
  check: (progress: UserProgress, stats: UserStats) => boolean;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Lessons
  { id: 'first_lesson', icon: '🌟', title: 'First Steps', titleRu: 'Первые шаги', description: 'Complete your first lesson', descriptionRu: 'Пройди первый урок', reward: 10, check: (_, s) => s.totalLessonsCompleted >= 1 },
  { id: 'five_lessons', icon: '📖', title: 'Bookworm', titleRu: 'Книжный червь', description: 'Complete 5 lessons', descriptionRu: 'Пройди 5 уроков', reward: 25, check: (_, s) => s.totalLessonsCompleted >= 5 },
  { id: 'ten_lessons', icon: '📚', title: 'Scholar', titleRu: 'Учёный', description: 'Complete 10 lessons', descriptionRu: 'Пройди 10 уроков', reward: 50, check: (_, s) => s.totalLessonsCompleted >= 10 },
  { id: '25_lessons', icon: '🎓', title: 'Graduate', titleRu: 'Выпускник', description: 'Complete 25 lessons', descriptionRu: 'Пройди 25 уроков', reward: 100, check: (_, s) => s.totalLessonsCompleted >= 25 },
  { id: 'all_lessons', icon: '👑', title: 'Grandmaster', titleRu: 'Грандмастер', description: 'Complete all lessons', descriptionRu: 'Пройди все уроки', reward: 500, check: (_, s) => s.totalLessonsCompleted >= 35 },

  // Streaks
  { id: 'streak_3', icon: '🔥', title: 'On Fire', titleRu: 'В огне', description: '3-day streak', descriptionRu: 'Серия 3 дня', reward: 15, check: (p) => p.streak >= 3 },
  { id: 'streak_7', icon: '🔥', title: 'Week Warrior', titleRu: 'Недельный воин', description: '7-day streak', descriptionRu: 'Серия 7 дней', reward: 30, check: (p) => p.streak >= 7 },
  { id: 'streak_14', icon: '💪', title: 'Dedicated', titleRu: 'Преданный', description: '14-day streak', descriptionRu: 'Серия 14 дней', reward: 50, check: (p) => p.streak >= 14 },
  { id: 'streak_30', icon: '⚡', title: 'Unstoppable', titleRu: 'Неудержимый', description: '30-day streak', descriptionRu: 'Серия 30 дней', reward: 100, check: (p) => p.streak >= 30 },
  { id: 'streak_60', icon: '🌋', title: 'Inferno', titleRu: 'Инферно', description: '60-day streak', descriptionRu: 'Серия 60 дней', reward: 200, check: (p) => p.streak >= 60 },
  { id: 'streak_100', icon: '🏆', title: 'Legendary', titleRu: 'Легенда', description: '100-day streak', descriptionRu: 'Серия 100 дней', reward: 500, check: (p) => p.streak >= 100 },

  // XP
  { id: 'xp_100', icon: '💫', title: 'Getting Started', titleRu: 'Начало пути', description: 'Earn 100 XP', descriptionRu: 'Набери 100 XP', reward: 10, check: (p) => p.totalXp >= 100 },
  { id: 'xp_500', icon: '✨', title: 'Rising Star', titleRu: 'Восходящая звезда', description: 'Earn 500 XP', descriptionRu: 'Набери 500 XP', reward: 25, check: (p) => p.totalXp >= 500 },
  { id: 'xp_1000', icon: '💎', title: 'Diamond', titleRu: 'Бриллиант', description: 'Earn 1000 XP', descriptionRu: 'Набери 1000 XP', reward: 50, check: (p) => p.totalXp >= 1000 },
  { id: 'xp_5000', icon: '🌟', title: 'Superstar', titleRu: 'Суперзвезда', description: 'Earn 5000 XP', descriptionRu: 'Набери 5000 XP', reward: 200, check: (p) => p.totalXp >= 5000 },

  // Perfect scores
  { id: 'perfect_1', icon: '🎯', title: 'Sharpshooter', titleRu: 'Снайпер', description: 'Get 100% on a lesson', descriptionRu: 'Получи 100% в уроке', reward: 15, check: (p) => Object.values(p.lessonScores).some(s => s === 100) },
  { id: 'perfect_5', icon: '🏹', title: 'Perfectionist', titleRu: 'Перфекционист', description: '5 perfect lessons', descriptionRu: '5 уроков на 100%', reward: 50, check: (p) => Object.values(p.lessonScores).filter(s => s === 100).length >= 5 },
  { id: 'perfect_10', icon: '🎪', title: 'Flawless', titleRu: 'Безупречный', description: '10 perfect lessons', descriptionRu: '10 уроков на 100%', reward: 100, check: (p) => Object.values(p.lessonScores).filter(s => s === 100).length >= 10 },

  // Words
  { id: 'words_50', icon: '💬', title: 'Talkative', titleRu: 'Разговорчивый', description: 'Learn 50 words', descriptionRu: 'Выучи 50 слов', reward: 25, check: (_, s) => s.totalWordsLearned >= 50 },
  { id: 'words_100', icon: '📝', title: 'Wordsmith', titleRu: 'Словесник', description: 'Learn 100 words', descriptionRu: 'Выучи 100 слов', reward: 50, check: (_, s) => s.totalWordsLearned >= 100 },
  { id: 'words_500', icon: '📕', title: 'Walking Dictionary', titleRu: 'Ходячий словарь', description: 'Learn 500 words', descriptionRu: 'Выучи 500 слов', reward: 200, check: (_, s) => s.totalWordsLearned >= 500 },

  // Levels
  { id: 'level_5', icon: '🚀', title: 'Liftoff', titleRu: 'Взлёт', description: 'Reach level 5', descriptionRu: 'Достигни 5 уровня', reward: 30, check: (p) => p.currentLevel >= 5 },
  { id: 'level_10', icon: '🎓', title: 'Expert', titleRu: 'Эксперт', description: 'Reach level 10', descriptionRu: 'Достигни 10 уровня', reward: 75, check: (p) => p.currentLevel >= 10 },
  { id: 'level_20', icon: '🧙', title: 'Wizard', titleRu: 'Волшебник', description: 'Reach level 20', descriptionRu: 'Достигни 20 уровня', reward: 150, check: (p) => p.currentLevel >= 20 },
];

async function getUnlockedIds(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.UNLOCKED);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

async function saveUnlockedIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.UNLOCKED, JSON.stringify(ids));
}

export async function unlockAchievement(id: string): Promise<void> {
  const ids = await getUnlockedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    await saveUnlockedIds(ids);
  }
}

export async function getAchievements(): Promise<(Achievement & { unlocked: boolean })[]> {
  const ids = await getUnlockedIds();
  return ALL_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: ids.includes(a.id),
  }));
}

export async function checkAchievements(progress: UserProgress, stats: UserStats): Promise<Achievement[]> {
  const ids = await getUnlockedIds();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (!ids.includes(achievement.id) && achievement.check(progress, stats)) {
      ids.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    await saveUnlockedIds(ids);
  }

  return newlyUnlocked;
}

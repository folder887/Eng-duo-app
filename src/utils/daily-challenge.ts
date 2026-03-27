import AsyncStorage from '@react-native-async-storage/async-storage';
import { units, Question } from '../data/lessons';

const KEYS = {
  CHALLENGE: 'lingualeap_daily_challenge',
  STREAK: 'lingualeap_daily_streak',
  LAST_DATE: 'lingualeap_daily_last_date',
};

export interface DailyChallenge {
  date: string;
  type: 'speed_round' | 'mistake_review' | 'new_words' | 'mixed';
  questions: Question[];
  xpBonus: number;
  completed: boolean;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export async function getDailyChallenge(): Promise<DailyChallenge> {
  const today = getToday();

  try {
    const stored = await AsyncStorage.getItem(KEYS.CHALLENGE);
    if (stored) {
      const challenge: DailyChallenge = JSON.parse(stored);
      if (challenge.date === today) return challenge;
    }
  } catch {}

  // Generate new challenge
  const dateSeed = parseInt(today.replace(/-/g, ''), 10);
  const rng = seededRandom(dateSeed);
  const types: DailyChallenge['type'][] = ['speed_round', 'new_words', 'mixed', 'speed_round'];
  const type = types[Math.floor(rng() * types.length)];

  // Collect all questions from all lessons
  const allQuestions: Question[] = [];
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      allQuestions.push(...lesson.questions);
    }
  }

  // Pick 8 random questions
  const shuffled = allQuestions.sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 8);

  const challenge: DailyChallenge = {
    date: today,
    type,
    questions: selected,
    xpBonus: type === 'speed_round' ? 20 : 15,
    completed: false,
  };

  await AsyncStorage.setItem(KEYS.CHALLENGE, JSON.stringify(challenge));
  return challenge;
}

export async function completeDailyChallenge(score: number): Promise<void> {
  const today = getToday();

  try {
    const stored = await AsyncStorage.getItem(KEYS.CHALLENGE);
    if (stored) {
      const challenge: DailyChallenge = JSON.parse(stored);
      challenge.completed = true;
      await AsyncStorage.setItem(KEYS.CHALLENGE, JSON.stringify(challenge));
    }
  } catch {}

  // Update streak
  const lastDate = await AsyncStorage.getItem(KEYS.LAST_DATE);
  const streakStr = await AsyncStorage.getItem(KEYS.STREAK);
  let streak = streakStr ? parseInt(streakStr, 10) : 0;

  if (lastDate) {
    const last = new Date(lastDate);
    const now = new Date(today);
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  await AsyncStorage.setItem(KEYS.STREAK, streak.toString());
  await AsyncStorage.setItem(KEYS.LAST_DATE, today);
}

export async function getDailyChallengeStreak(): Promise<number> {
  try {
    const streakStr = await AsyncStorage.getItem(KEYS.STREAK);
    return streakStr ? parseInt(streakStr, 10) : 0;
  } catch { return 0; }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  REVIEWS: 'lingualeap_spaced_reviews',
};

export interface WordReview {
  wordId: string;
  word: string;
  translation: string;
  correctCount: number;
  incorrectCount: number;
  nextReviewDate: string;
  easeFactor: number;
  interval: number;
}

async function getReviews(): Promise<WordReview[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

async function saveReviews(reviews: WordReview[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
}

export async function addMistake(wordId: string, word: string, translation: string): Promise<void> {
  const reviews = await getReviews();
  const existing = reviews.find(r => r.wordId === wordId);

  if (existing) {
    existing.incorrectCount += 1;
    existing.nextReviewDate = new Date().toISOString().split('T')[0];
    existing.interval = 1;
  } else {
    reviews.push({
      wordId,
      word,
      translation,
      correctCount: 0,
      incorrectCount: 1,
      nextReviewDate: new Date().toISOString().split('T')[0],
      easeFactor: 2.5,
      interval: 1,
    });
  }

  await saveReviews(reviews);
}

export async function getWordsForReview(): Promise<WordReview[]> {
  const reviews = await getReviews();
  const today = new Date().toISOString().split('T')[0];
  return reviews.filter(r => r.nextReviewDate <= today);
}

export async function recordReviewResult(wordId: string, correct: boolean): Promise<void> {
  const reviews = await getReviews();
  const review = reviews.find(r => r.wordId === wordId);
  if (!review) return;

  if (correct) {
    review.correctCount += 1;
    // SM-2 algorithm
    review.easeFactor = Math.max(1.3, review.easeFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)));
    if (review.interval === 1) {
      review.interval = 1;
    } else if (review.interval <= 2) {
      review.interval = 6;
    } else {
      review.interval = Math.round(review.interval * review.easeFactor);
    }
  } else {
    review.incorrectCount += 1;
    review.interval = 1;
    review.easeFactor = Math.max(1.3, review.easeFactor - 0.2);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + review.interval);
  review.nextReviewDate = nextDate.toISOString().split('T')[0];

  await saveReviews(reviews);
}

export async function getMistakeStats(): Promise<{ totalWords: number; dueToday: number; mastered: number }> {
  const reviews = await getReviews();
  const today = new Date().toISOString().split('T')[0];
  return {
    totalWords: reviews.length,
    dueToday: reviews.filter(r => r.nextReviewDate <= today).length,
    mastered: reviews.filter(r => r.interval >= 21).length,
  };
}

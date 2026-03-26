import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { units } from '../src/data/lessons';
import { getUserProgress, UserProgress } from '../src/utils/storage';

interface FlashCard {
  original: string;
  translation: string;
  pronunciation?: string;
}

export default function PracticeScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const p = await getUserProgress();
    setProgress(p);

    // Collect words from completed lessons
    const learnedWords: FlashCard[] = [];
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (p.completedLessons.includes(lesson.id)) {
          for (const word of lesson.words) {
            learnedWords.push({
              original: word.original,
              translation: word.translation,
              pronunciation: word.pronunciation,
            });
          }
        }
      }
    }

    // Shuffle
    const shuffled = learnedWords.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (!progress) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyTitle}>Пока нет слов для практики</Text>
        <Text style={styles.emptyText}>
          Пройдите хотя бы один урок, чтобы начать практиковать слова
        </Text>
      </View>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.completeIcon}>🎉</Text>
        <Text style={styles.completeTitle}>Практика завершена!</Text>
        <Text style={styles.completeScore}>
          Результат: {score.correct}/{score.total}
        </Text>
        <TouchableOpacity style={styles.restartButton} onPress={loadData}>
          <Text style={styles.restartText}>Начать заново</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const card = cards[currentIndex];

  const handleAnswer = (known: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (known ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.counter}>
        {currentIndex + 1} / {cards.length}
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowAnswer(!showAnswer)}
        activeOpacity={0.9}
      >
        <Text style={styles.cardWord}>{card.original}</Text>
        {card.pronunciation && (
          <Text style={styles.cardPronunciation}>[{card.pronunciation}]</Text>
        )}
        {showAnswer ? (
          <View style={styles.answerSection}>
            <View style={styles.answerDivider} />
            <Text style={styles.cardTranslation}>{card.translation}</Text>
          </View>
        ) : (
          <Text style={styles.tapHint}>Нажмите, чтобы увидеть перевод</Text>
        )}
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.answerButton, styles.dontKnowButton]}
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.dontKnowText}>Не знаю 😕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.answerButton, styles.knowButton]}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.knowText}>Знаю! 😊</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 40,
  },
  counter: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 24,
    marginTop: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    minHeight: 250,
    justifyContent: 'center',
  },
  cardWord: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
  },
  cardPronunciation: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  answerSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  answerDivider: {
    height: 2,
    backgroundColor: Colors.divider,
    width: '80%',
    marginBottom: 16,
  },
  cardTranslation: {
    ...Typography.h2,
    color: Colors.primary,
    textAlign: 'center',
  },
  tapHint: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  dontKnowButton: {
    backgroundColor: Colors.error + '15',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  knowButton: {
    backgroundColor: Colors.success + '15',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  dontKnowText: {
    ...Typography.button,
    color: Colors.error,
  },
  knowText: {
    ...Typography.button,
    color: Colors.success,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  completeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  completeTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 12,
  },
  completeScore: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  restartText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});

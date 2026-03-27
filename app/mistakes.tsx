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
import {
  getWordsForReview,
  recordReviewResult,
  getMistakeStats,
  WordReview,
} from '../src/utils/spaced-repetition';

export default function MistakesScreen() {
  const [words, setWords] = useState<WordReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });
  const [stats, setStats] = useState({ totalWords: 0, dueToday: 0, mastered: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const reviewWords = await getWordsForReview();
    const mistakeStats = await getMistakeStats();
    setWords(reviewWords);
    setStats(mistakeStats);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionResults({ correct: 0, total: 0 });
    setIsComplete(false);
  };

  if (words.length === 0 && !isComplete) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>Нет слов для повторения</Text>
        <Text style={styles.emptyText}>
          Когда вы допустите ошибки в уроках, они появятся здесь для повторения
        </Text>
        {stats.totalWords > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Статистика</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Всего слов в базе:</Text>
              <Text style={styles.statsValue}>{stats.totalWords}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Выучено:</Text>
              <Text style={[styles.statsValue, { color: Colors.success }]}>{stats.mastered}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  if (isComplete) {
    return (
      <View style={styles.center}>
        <Text style={styles.completeIcon}>🎉</Text>
        <Text style={styles.completeTitle}>Повторение завершено!</Text>
        <Text style={styles.completeScore}>
          {sessionResults.correct}/{sessionResults.total} правильно
        </Text>
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Точность:</Text>
            <Text style={[styles.statsValue, { color: Colors.primary }]}>
              {sessionResults.total > 0
                ? Math.round((sessionResults.correct / sessionResults.total) * 100)
                : 0}%
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.restartBtn} onPress={loadData}>
          <Text style={styles.restartText}>Повторить ещё раз</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const word = words[currentIndex];

  const handleResult = async (correct: boolean) => {
    await recordReviewResult(word.wordId, correct);
    setSessionResults((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowAnswer(false);

    if (currentIndex + 1 >= words.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.counter}>
        {currentIndex + 1} / {words.length}
      </Text>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {words.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentIndex && styles.dotDone,
              i === currentIndex && styles.dotCurrent,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowAnswer(!showAnswer)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardBadge}>
            Ошибок: {word.incorrectCount} | Верно: {word.correctCount}
          </Text>
        </View>
        <Text style={styles.cardWord}>{word.word}</Text>
        {showAnswer ? (
          <View style={styles.answerSection}>
            <View style={styles.answerDivider} />
            <Text style={styles.cardTranslation}>{word.translation}</Text>
          </View>
        ) : (
          <Text style={styles.tapHint}>Нажмите, чтобы увидеть перевод</Text>
        )}
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.answerBtn, styles.wrongBtn]}
            onPress={() => handleResult(false)}
          >
            <Text style={styles.wrongText}>Ещё учу 📖</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.answerBtn, styles.correctBtn]}
            onPress={() => handleResult(true)}
          >
            <Text style={styles.correctText}>Помню! ✅</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, alignItems: 'center', flexGrow: 1 },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.background, padding: 40,
  },
  counter: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 12, marginTop: 8 },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.progressBg },
  dotDone: { backgroundColor: Colors.success },
  dotCurrent: { backgroundColor: Colors.primary, width: 24 },
  card: {
    backgroundColor: Colors.glass, borderRadius: 24, padding: 32, width: '100%',
    alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 24, elevation: 5, minHeight: 260, justifyContent: 'center',
  },
  cardHeader: { position: 'absolute', top: 16, right: 16 },
  cardBadge: { ...Typography.small, color: Colors.textLight, backgroundColor: Colors.divider, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardWord: { ...Typography.h1, color: Colors.text, textAlign: 'center', fontSize: 32 },
  answerSection: { alignItems: 'center', width: '100%', marginTop: 20 },
  answerDivider: { height: 2, backgroundColor: Colors.divider, width: '80%', marginBottom: 20 },
  cardTranslation: { ...Typography.h2, color: Colors.primary, textAlign: 'center' },
  tapHint: { ...Typography.caption, color: Colors.textLight, marginTop: 24 },
  buttonsRow: { flexDirection: 'row', marginTop: 24, gap: 12, width: '100%' },
  answerBtn: { flex: 1, paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 2 },
  wrongBtn: { backgroundColor: Colors.error + '10', borderColor: Colors.error },
  correctBtn: { backgroundColor: Colors.success + '10', borderColor: Colors.success },
  wrongText: { ...Typography.button, color: Colors.error },
  correctText: { ...Typography.button, color: Colors.success },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { ...Typography.h2, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  emptyText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  statsCard: {
    backgroundColor: Colors.glass, borderRadius: 16, padding: 20, width: '100%',
    marginTop: 24, borderWidth: 1, borderColor: Colors.glassBorder,
  },
  statsTitle: { ...Typography.h3, color: Colors.text, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statsLabel: { ...Typography.body, color: Colors.textSecondary },
  statsValue: { ...Typography.bodyBold, color: Colors.text },
  completeIcon: { fontSize: 80, marginBottom: 16 },
  completeTitle: { ...Typography.h1, color: Colors.text, marginBottom: 12 },
  completeScore: { ...Typography.h3, color: Colors.primary, marginBottom: 24 },
  restartBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, marginTop: 16 },
  restartText: { ...Typography.button, color: '#FFFFFF' },
});

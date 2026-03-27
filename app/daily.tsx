import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import {
  getDailyChallenge,
  completeDailyChallenge,
  getDailyChallengeStreak,
  DailyChallenge,
} from '../src/utils/daily-challenge';

export default function DailyScreen() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [streak, setStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadChallenge();
    }, [])
  );

  const loadChallenge = async () => {
    const c = await getDailyChallenge();
    const s = await getDailyChallengeStreak();
    setChallenge(c);
    setStreak(s);
    setCurrentQ(0);
    setSelected(null);
    setIsCorrect(null);
    setCorrectCount(0);
    setStarted(false);
  };

  if (!challenge) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (challenge.completed) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneIcon}>✅</Text>
        <Text style={styles.doneTitle}>Задание выполнено!</Text>
        <Text style={styles.doneSubtitle}>
          Приходите завтра за новым заданием
        </Text>
        <View style={styles.streakCard}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>дней подряд</Text>
        </View>
      </View>
    );
  }

  const challengeTypeNames: Record<string, string> = {
    speed_round: '⚡ Быстрый раунд',
    mistake_review: '🔄 Работа над ошибками',
    new_words: '📚 Новые слова',
    mixed: '🎲 Смешанное задание',
  };

  if (!started) {
    return (
      <View style={styles.center}>
        <View style={styles.challengeCard}>
          <Text style={styles.challengeIcon}>🎯</Text>
          <Text style={styles.challengeType}>
            {challengeTypeNames[challenge.type] || 'Задание дня'}
          </Text>
          <Text style={styles.challengeTitle}>Ежедневное задание</Text>
          <Text style={styles.challengeDesc}>
            {challenge.questions.length} вопросов • +{challenge.xpBonus} бонус XP
          </Text>
          <View style={styles.streakMini}>
            <Text style={styles.streakMiniText}>🔥 Серия: {streak} дней</Text>
          </View>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => setStarted(true)}
          >
            <Text style={styles.startText}>Начать</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Quiz in progress
  if (currentQ >= challenge.questions.length) {
    // Complete
    const score = Math.round((correctCount / challenge.questions.length) * 100);
    const handleFinish = async () => {
      await completeDailyChallenge(score);
      Alert.alert('Отлично!', `Вы заработали ${challenge.xpBonus} бонусных XP!`);
      await loadChallenge();
    };

    return (
      <View style={styles.center}>
        <Text style={styles.resultIcon}>{score >= 80 ? '🌟' : score >= 50 ? '👍' : '📖'}</Text>
        <Text style={styles.resultTitle}>
          {score >= 80 ? 'Превосходно!' : score >= 50 ? 'Хорошо!' : 'Можно лучше!'}
        </Text>
        <Text style={styles.resultScore}>
          {correctCount}/{challenge.questions.length} правильно ({score}%)
        </Text>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishText}>Получить +{challenge.xpBonus} XP</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = challenge.questions[currentQ];

  const handleCheck = () => {
    if (!selected) return;
    const correct = selected.toLowerCase() === q.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    setCurrentQ((c) => c + 1);
    setSelected(null);
    setIsCorrect(null);
  };

  return (
    <ScrollView style={styles.quizContainer} contentContainerStyle={styles.quizContent}>
      <View style={styles.quizHeader}>
        <Text style={styles.quizCounter}>{currentQ + 1}/{challenge.questions.length}</Text>
        <View style={styles.quizProgress}>
          <View style={[styles.quizProgressFill, { width: `${(currentQ / challenge.questions.length) * 100}%` }]} />
        </View>
      </View>

      <Text style={styles.quizPrompt}>{q.prompt}</Text>
      {q.sentence && <Text style={styles.quizSentence}>{q.sentence}</Text>}

      <View style={styles.optionsContainer}>
        {q.options?.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              isCorrect === null && selected === opt && styles.optionSelected,
              isCorrect !== null && opt.toLowerCase() === q.correctAnswer.toLowerCase() && styles.optionCorrect,
              isCorrect !== null && selected === opt && !isCorrect && styles.optionWrong,
            ]}
            onPress={() => isCorrect === null && setSelected(opt)}
            disabled={isCorrect !== null}
          >
            <Text style={[
              styles.optionText,
              isCorrect === null && selected === opt && styles.optionTextSelected,
              isCorrect !== null && opt.toLowerCase() === q.correctAnswer.toLowerCase() && styles.optionTextCorrect,
              isCorrect !== null && selected === opt && !isCorrect && styles.optionTextWrong,
            ]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isCorrect !== null && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackOk : styles.feedbackBad]}>
          <Text style={styles.feedbackText}>
            {isCorrect ? '✅ Правильно!' : `❌ Ответ: ${q.correctAnswer}`}
          </Text>
        </View>
      )}

      <View style={styles.bottomBtn}>
        {isCorrect === null ? (
          <TouchableOpacity
            style={[styles.checkBtn, !selected && styles.checkBtnDisabled]}
            onPress={handleCheck}
            disabled={!selected}
          >
            <Text style={styles.checkText}>Проверить</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.checkText}>Далее</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 32 },
  loadingText: { ...Typography.body, color: Colors.textSecondary },
  doneIcon: { fontSize: 64, marginBottom: 16 },
  doneTitle: { ...Typography.h1, color: Colors.text, marginBottom: 8 },
  doneSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  streakCard: {
    backgroundColor: Colors.glass, borderRadius: 20, padding: 24, alignItems: 'center',
    marginTop: 32, borderWidth: 1, borderColor: Colors.glassBorder, width: '100%',
  },
  streakFire: { fontSize: 48 },
  streakNum: { ...Typography.h1, color: Colors.streakOrange, fontSize: 48 },
  streakLabel: { ...Typography.body, color: Colors.textSecondary },
  challengeCard: {
    backgroundColor: Colors.glass, borderRadius: 24, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.glassBorder, width: '100%',
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 24, elevation: 5,
  },
  challengeIcon: { fontSize: 56, marginBottom: 12 },
  challengeType: { ...Typography.caption, color: Colors.primary, marginBottom: 8 },
  challengeTitle: { ...Typography.h1, color: Colors.text, marginBottom: 8 },
  challengeDesc: { ...Typography.body, color: Colors.textSecondary, marginBottom: 20 },
  streakMini: { backgroundColor: Colors.streakOrange + '15', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 24 },
  streakMiniText: { ...Typography.bodyBold, color: Colors.streakOrange },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 48,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  startText: { ...Typography.button, color: '#FFFFFF', fontSize: 18 },
  resultIcon: { fontSize: 72, marginBottom: 16 },
  resultTitle: { ...Typography.h1, color: Colors.text, marginBottom: 8 },
  resultScore: { ...Typography.h3, color: Colors.primary, marginBottom: 32 },
  finishBtn: { backgroundColor: Colors.success, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40 },
  finishText: { ...Typography.button, color: '#FFFFFF' },
  quizContainer: { flex: 1, backgroundColor: Colors.background },
  quizContent: { padding: 24, flexGrow: 1 },
  quizHeader: { marginBottom: 24 },
  quizCounter: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  quizProgress: { height: 8, backgroundColor: Colors.progressBg, borderRadius: 4, overflow: 'hidden' },
  quizProgressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  quizPrompt: { ...Typography.h2, color: Colors.text, marginBottom: 8 },
  quizSentence: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: 16, fontSize: 18 },
  optionsContainer: { gap: 12, marginTop: 8, flex: 1 },
  option: {
    backgroundColor: Colors.glass, borderRadius: 16, padding: 18,
    borderWidth: 2, borderColor: Colors.border,
  },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  optionCorrect: { borderColor: Colors.success, backgroundColor: Colors.success + '15' },
  optionWrong: { borderColor: Colors.error, backgroundColor: Colors.error + '15' },
  optionText: { ...Typography.body, color: Colors.text, textAlign: 'center' },
  optionTextSelected: { color: Colors.primary, fontWeight: '600' },
  optionTextCorrect: { color: Colors.success, fontWeight: '700' },
  optionTextWrong: { color: Colors.error, fontWeight: '600' },
  feedback: { padding: 16, borderRadius: 12, marginTop: 16 },
  feedbackOk: { backgroundColor: Colors.success + '15' },
  feedbackBad: { backgroundColor: Colors.error + '15' },
  feedbackText: { ...Typography.bodyBold, textAlign: 'center' },
  bottomBtn: { marginTop: 24, paddingBottom: 16 },
  checkBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  checkBtnDisabled: { backgroundColor: Colors.progressBg },
  nextBtn: { backgroundColor: Colors.success, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  checkText: { ...Typography.button, color: '#FFFFFF' },
});

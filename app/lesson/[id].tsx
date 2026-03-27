import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { ProgressBar } from '../../src/components/ProgressBar';
import { units, Question, Lesson } from '../../src/data/lessons';
import { completeLesson, getUserProgress } from '../../src/utils/storage';
import { addMistake } from '../../src/utils/spaced-repetition';
import { checkAchievements } from '../../src/utils/achievements';
import { checkSubscription } from '../../src/utils/subscription';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lesson = useMemo(() => {
    for (const unit of units) {
      for (const l of unit.lessons) {
        if (l.id === id) return l;
      }
    }
    return null;
  }, [id]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));

  if (!lesson) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Урок не найден</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const questions = lesson.questions;
  const progress = questions.length > 0 ? currentQuestion / questions.length : 0;
  const question = questions[currentQuestion];

  const handleSelectAnswer = (answer: string) => {
    if (isCorrect !== null) return;
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!selectedAnswer || !question) return;

    const correct = selectedAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setHearts((prev) => prev - 1);
      // Track mistake for spaced repetition
      const word = lesson.words.find(w =>
        w.original.toLowerCase() === question.correctAnswer.toLowerCase() ||
        w.translation.toLowerCase() === question.correctAnswer.toLowerCase()
      );
      if (word) {
        addMistake(word.id, word.original, word.translation);
      }
      // Shake animation on wrong answer
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = async () => {
    if (currentQuestion + 1 >= questions.length || hearts <= 0) {
      // Lesson complete
      const score = Math.round((correctCount + (isCorrect ? 0 : 0)) / questions.length * 100);
      const finalCorrect = correctCount + (isCorrect ? 0 : 0);
      const finalScore = Math.round(((isCorrect ? correctCount : correctCount) / questions.length) * 100);

      if (finalScore >= 60) {
        await completeLesson(lesson.id, lesson.xpReward, lesson.words.length, finalScore);
      }
      setIsComplete(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  if (isComplete) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= 60;

    return (
      <SafeAreaView style={styles.completeContainer}>
        <Text style={styles.completeEmoji}>{passed ? '🎉' : '😢'}</Text>
        <Text style={styles.completeTitle}>
          {passed ? 'Урок пройден!' : 'Попробуйте ещё раз'}
        </Text>
        <Text style={styles.completeSubtitle}>
          {passed
            ? `Вы заработали ${lesson.xpReward} XP!`
            : 'Нужно минимум 60% правильных ответов'}
        </Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Правильных ответов</Text>
            <Text style={styles.scoreValue}>{correctCount}/{questions.length}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Результат</Text>
            <Text style={[styles.scoreValue, { color: passed ? Colors.success : Colors.error }]}>
              {finalScore}%
            </Text>
          </View>
          {passed && (
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>XP заработано</Text>
              <Text style={[styles.scoreValue, { color: Colors.xpGold }]}>+{lesson.xpReward}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: passed ? Colors.success : Colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.continueButtonText}>
            {passed ? 'Продолжить' : 'Вернуться'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarWrapper}>
          <ProgressBar progress={progress} height={10} />
        </View>
        <View style={styles.heartsContainer}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.heartCount}>{hearts}</Text>
        </View>
      </View>

      {/* Question */}
      <Animated.View style={[styles.questionSection, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.questionType}>
          {question.type === 'multiple_choice' && 'Выберите правильный ответ'}
          {question.type === 'translate' && 'Переведите'}
          {question.type === 'fill_blank' && 'Заполните пропуск'}
        </Text>
        <Text style={styles.questionPrompt}>{question.prompt}</Text>
        {question.sentence && (
          <Text style={styles.questionSentence}>{question.sentence}</Text>
        )}
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options?.map((option, index) => {
          const isOptionCorrect = option.toLowerCase() === question.correctAnswer.toLowerCase();
          const isSelectedWrong = option === selectedAnswer && !isCorrect;
          const isSelected = option === selectedAnswer;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                isCorrect !== null && isOptionCorrect && styles.optionCorrect,
                isCorrect !== null && isSelectedWrong && styles.optionWrong,
                isCorrect === null && isSelected && styles.optionSelected,
              ]}
              onPress={() => handleSelectAnswer(option)}
              disabled={isCorrect !== null}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                isCorrect !== null && isOptionCorrect && styles.optionTextCorrect,
                isCorrect !== null && isSelectedWrong && styles.optionTextWrong,
                isCorrect === null && isSelected && styles.optionTextSelected,
              ]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {isCorrect !== null && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackEmoji}>{isCorrect ? '✅' : '❌'}</Text>
          <Text style={[styles.feedbackText, isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong]}>
            {isCorrect ? 'Правильно!' : `Правильный ответ: ${question.correctAnswer}`}
          </Text>
        </View>
      )}

      {/* Bottom button */}
      <View style={styles.bottomSection}>
        {isCorrect === null ? (
          <TouchableOpacity
            style={[styles.checkButton, !selectedAnswer && styles.checkButtonDisabled]}
            onPress={handleCheck}
            disabled={!selectedAnswer}
          >
            <Text style={styles.checkButtonText}>Проверить</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: isCorrect ? Colors.success : Colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.checkButtonText}>
              {currentQuestion + 1 >= questions.length ? 'Завершить' : 'Далее'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.progressBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  progressBarWrapper: {
    flex: 1,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartIcon: {
    fontSize: 16,
  },
  heartCount: {
    ...Typography.bodyBold,
    color: Colors.heartRed,
  },
  questionSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  questionType: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionPrompt: {
    ...Typography.h2,
    color: Colors.text,
  },
  questionSentence: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
    fontSize: 18,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    flex: 1,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '15',
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: Colors.success,
    fontWeight: '700',
  },
  optionTextWrong: {
    color: Colors.error,
    fontWeight: '600',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  feedbackCorrect: {
    backgroundColor: Colors.success + '15',
  },
  feedbackWrong: {
    backgroundColor: Colors.error + '15',
  },
  feedbackEmoji: {
    fontSize: 20,
  },
  feedbackText: {
    ...Typography.bodyBold,
    flex: 1,
  },
  feedbackTextCorrect: {
    color: Colors.success,
  },
  feedbackTextWrong: {
    color: Colors.error,
  },
  bottomSection: {
    padding: 24,
    paddingBottom: 32,
  },
  checkButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkButtonDisabled: {
    backgroundColor: Colors.progressBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  completeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  completeEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  completeTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  completeSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  scoreValue: {
    ...Typography.h3,
    color: Colors.text,
  },
  continueButton: {
    backgroundColor: Colors.success,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});

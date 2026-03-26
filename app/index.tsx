import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { StatsBar } from '../src/components/StatsBar';
import { LessonButton } from '../src/components/LessonButton';
import { ProgressBar } from '../src/components/ProgressBar';
import { units } from '../src/data/lessons';
import { getUserProgress, UserProgress } from '../src/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProgress = useCallback(async () => {
    const p = await getUserProgress();
    setProgress(p);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  if (!progress) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  const totalLessons = units.reduce((sum, u) => sum + u.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const overallProgress = totalLessons > 0 ? completedCount / totalLessons : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatsBar
        xp={progress.totalXp}
        streak={progress.streak}
        hearts={progress.hearts}
        level={progress.currentLevel}
      />

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Общий прогресс</Text>
          <Text style={styles.progressValue}>
            {completedCount}/{totalLessons} уроков
          </Text>
        </View>
        <ProgressBar progress={overallProgress} height={10} />
      </View>

      {units.map((unit) => (
        <View key={unit.id} style={styles.unitContainer}>
          <View style={styles.unitHeader}>
            <Text style={styles.unitTitle}>{unit.titleRu}</Text>
            <Text style={styles.unitDescription}>{unit.description}</Text>
          </View>
          <View style={styles.lessonsGrid}>
            {unit.lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isLocked = progress.currentLevel < lesson.requiredLevel;
              const score = progress.lessonScores[lesson.id];

              // Zigzag pattern for lesson positioning
              const offset = index % 3 === 1 ? 50 : index % 3 === 2 ? -50 : 0;

              return (
                <View key={lesson.id} style={[styles.lessonWrapper, { marginLeft: offset }]}>
                  <LessonButton
                    icon={lesson.icon}
                    title={lesson.titleRu}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    score={score}
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  progressValue: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  unitContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  unitHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
  },
  unitTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  unitDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  lessonsGrid: {
    alignItems: 'center',
  },
  lessonWrapper: {
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});

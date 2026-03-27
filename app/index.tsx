import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { units } from '../src/data/lessons';
import { getUserProgress, UserProgress } from '../src/utils/storage';
import { checkSubscription } from '../src/utils/subscription';

export default function HomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const loadProgress = useCallback(async () => {
    const [p, prem] = await Promise.all([getUserProgress(), checkSubscription()]);
    setProgress(p);
    setIsPremium(prem);
  }, []);

  useFocusEffect(useCallback(() => { loadProgress(); }, [loadProgress]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  if (!progress) {
    return <View style={styles.loading}><Text style={styles.loadingText}>Загрузка...</Text></View>;
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
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <StatItem icon="⭐" value={progress.totalXp} label="XP" />
        <View style={styles.statDivider} />
        <StatItem icon="🔥" value={progress.streak} label="Серия" />
        <View style={styles.statDivider} />
        <StatItem icon="❤️" value={isPremium ? '∞' : progress.hearts} label="Жизни" />
        <View style={styles.statDivider} />
        <StatItem icon="🏆" value={progress.currentLevel} label="Уровень" />
      </View>

      {/* Overall Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Общий прогресс</Text>
          <Text style={styles.progressValue}>{completedCount}/{totalLessons}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${overallProgress * 100}%` }]} />
        </View>
      </View>

      {/* Units and Lessons */}
      {units.map((unit) => {
        const unitCompleted = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
        const unitTotal = unit.lessons.length;
        const unitProgress = unitTotal > 0 ? unitCompleted / unitTotal : 0;

        return (
          <View key={unit.id} style={styles.unitContainer}>
            <View style={[styles.unitHeader, { borderLeftColor: unit.color }]}>
              <View style={styles.unitTitleRow}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitTitle}>{unit.titleRu}</Text>
                  <Text style={styles.unitDesc}>{unit.description}</Text>
                </View>
                <Text style={styles.unitCount}>{unitCompleted}/{unitTotal}</Text>
              </View>
              <View style={styles.unitProgress}>
                <View style={[styles.unitProgressFill, { width: `${unitProgress * 100}%`, backgroundColor: unit.color }]} />
              </View>
            </View>

            <View style={styles.lessonsPath}>
              {unit.lessons.map((lesson, index) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isLocked = progress.currentLevel < lesson.requiredLevel;
                const score = progress.lessonScores[lesson.id];
                const isNext = !isCompleted && !isLocked &&
                  (index === 0 || progress.completedLessons.includes(unit.lessons[index - 1]?.id));

                // Zigzag positioning
                const offset = index % 3 === 1 ? 60 : index % 3 === 2 ? -60 : 0;

                return (
                  <View key={lesson.id} style={[styles.lessonNode, { marginLeft: offset }]}>
                    {index > 0 && <View style={[styles.pathLine, isCompleted ? styles.pathLineDone : null]} />}
                    <TouchableOpacity
                      style={[
                        styles.lessonCircle,
                        isCompleted && styles.lessonCompleted,
                        isLocked && styles.lessonLocked,
                        isNext && styles.lessonNext,
                      ]}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                      disabled={isLocked}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.lessonEmoji}>
                        {isLocked ? '🔒' : lesson.icon}
                      </Text>
                    </TouchableOpacity>
                    <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
                      {lesson.titleRu}
                    </Text>
                    {isCompleted && score !== undefined && (
                      <View style={styles.starsRow}>
                        {[1, 2, 3].map((star) => (
                          <Text key={star} style={styles.star}>
                            {score >= star * 33 ? '⭐' : '☆'}
                          </Text>
                        ))}
                      </View>
                    )}
                    {isNext && (
                      <View style={styles.nextBadge}>
                        <Text style={styles.nextBadgeText}>НАЧАТЬ</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function StatItem({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { ...Typography.body, color: Colors.textSecondary },

  // Stats Bar
  statsBar: {
    flexDirection: 'row', backgroundColor: Colors.glass, borderRadius: 18,
    marginHorizontal: 16, marginVertical: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { fontSize: 18, marginBottom: 2 },
  statValue: { ...Typography.bodyBold, color: Colors.text, fontSize: 17 },
  statLabel: { ...Typography.small, color: Colors.textSecondary, fontSize: 10 },
  statDivider: { width: 1, backgroundColor: Colors.divider, marginVertical: 4 },

  // Progress
  progressSection: { marginHorizontal: 16, marginBottom: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { ...Typography.bodyBold, color: Colors.text },
  progressValue: { ...Typography.caption, color: Colors.textSecondary },
  progressBar: { height: 10, backgroundColor: Colors.progressBg, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.progressFill, borderRadius: 5 },

  // Units
  unitContainer: { marginTop: 16, paddingHorizontal: 16 },
  unitHeader: {
    backgroundColor: Colors.glass, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.glassBorder, borderLeftWidth: 4,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  unitTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  unitIcon: { fontSize: 28, marginRight: 12 },
  unitInfo: { flex: 1 },
  unitTitle: { ...Typography.h3, color: Colors.text },
  unitDesc: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  unitCount: { ...Typography.caption, color: Colors.textSecondary },
  unitProgress: { height: 6, backgroundColor: Colors.progressBg, borderRadius: 3, overflow: 'hidden' },
  unitProgressFill: { height: '100%', borderRadius: 3 },

  // Lesson Path
  lessonsPath: { alignItems: 'center', paddingVertical: 16 },
  lessonNode: { alignItems: 'center', marginVertical: 4 },
  pathLine: { width: 3, height: 20, backgroundColor: Colors.progressBg, marginBottom: 4 },
  pathLineDone: { backgroundColor: Colors.success },
  lessonCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.glass, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.border,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  lessonCompleted: {
    backgroundColor: Colors.success + '15', borderColor: Colors.success,
    shadowColor: Colors.success,
  },
  lessonLocked: {
    backgroundColor: Colors.progressBg, borderColor: Colors.border,
    shadowOpacity: 0, elevation: 0, opacity: 0.5,
  },
  lessonNext: {
    borderColor: Colors.primary, borderWidth: 3,
    shadowColor: Colors.primary, shadowOpacity: 0.4,
  },
  lessonEmoji: { fontSize: 30 },
  lessonTitle: { ...Typography.caption, color: Colors.text, marginTop: 6, textAlign: 'center' },
  lessonTitleLocked: { color: Colors.textLight },
  starsRow: { flexDirection: 'row', marginTop: 4, gap: 2 },
  star: { fontSize: 14 },
  nextBadge: {
    backgroundColor: Colors.primary, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 6,
  },
  nextBadgeText: { ...Typography.small, color: '#FFF', fontWeight: '800', fontSize: 10, letterSpacing: 1 },
});

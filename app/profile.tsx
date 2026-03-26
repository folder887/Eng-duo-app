import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { ProgressBar } from '../src/components/ProgressBar';
import { getUserProgress, getUserStats, UserProgress, UserStats } from '../src/utils/storage';

export default function ProfileScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const p = await getUserProgress();
        const s = await getUserStats();
        setProgress(p);
        setStats(s);
      })();
    }, [])
  );

  if (!progress || !stats) {
    return (
      <View style={styles.center}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  const xpForNextLevel = (progress.currentLevel + 1) * 50;
  const xpInCurrentLevel = progress.totalXp - progress.currentLevel * 50;
  const levelProgress = xpInCurrentLevel / 50;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🧑‍🎓</Text>
        </View>
        <Text style={styles.username}>Ученик</Text>
        <Text style={styles.joinDate}>
          С нами с {new Date(stats.joinDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Уровень {progress.currentLevel}</Text>
          <Text style={styles.levelXp}>
            {xpInCurrentLevel} / 50 XP
          </Text>
        </View>
        <ProgressBar progress={levelProgress} height={14} fillColor={Colors.xpGold} />
        <Text style={styles.levelHint}>
          До уровня {progress.currentLevel + 1} осталось {50 - xpInCurrentLevel} XP
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard icon="⭐" value={progress.totalXp.toString()} label="Всего XP" color={Colors.xpGold} />
        <StatCard icon="🔥" value={progress.streak.toString()} label="Текущая серия" color={Colors.streakOrange} />
        <StatCard icon="🏆" value={stats.bestStreak.toString()} label="Лучшая серия" color={Colors.primary} />
        <StatCard icon="📚" value={stats.totalLessonsCompleted.toString()} label="Уроков пройдено" color={Colors.success} />
        <StatCard icon="💬" value={stats.totalWordsLearned.toString()} label="Слов изучено" color={Colors.accent} />
        <StatCard icon="❤️" value={progress.hearts.toString()} label="Жизней" color={Colors.heartRed} />
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Достижения</Text>
        <View style={styles.achievementsList}>
          <Achievement
            icon="🌟"
            title="Первые шаги"
            description="Пройди первый урок"
            unlocked={stats.totalLessonsCompleted >= 1}
          />
          <Achievement
            icon="🔥"
            title="На огне"
            description="Набери серию из 3 дней"
            unlocked={stats.bestStreak >= 3}
          />
          <Achievement
            icon="📖"
            title="Книжный червь"
            description="Пройди 5 уроков"
            unlocked={stats.totalLessonsCompleted >= 5}
          />
          <Achievement
            icon="💎"
            title="Бриллиант"
            description="Набери 500 XP"
            unlocked={progress.totalXp >= 500}
          />
          <Achievement
            icon="🎓"
            title="Выпускник"
            description="Достигни 10 уровня"
            unlocked={progress.currentLevel >= 10}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Achievement({ icon, title, description, unlocked }: { icon: string; title: string; description: string; unlocked: boolean }) {
  return (
    <View style={[styles.achievement, !unlocked && styles.achievementLocked]}>
      <Text style={styles.achievementIcon}>{unlocked ? icon : '🔒'}</Text>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !unlocked && styles.achievementTitleLocked]}>
          {title}
        </Text>
        <Text style={styles.achievementDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  username: {
    ...Typography.h2,
    color: Colors.text,
  },
  joinDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  levelCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  levelXp: {
    ...Typography.bodyBold,
    color: Colors.xpGold,
  },
  levelHint: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 14,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '46%',
    flexGrow: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 16,
  },
  achievementsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  achievementTitleLocked: {
    color: Colors.textSecondary,
  },
  achievementDesc: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

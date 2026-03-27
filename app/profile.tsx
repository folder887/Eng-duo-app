import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { getUserProgress, getUserStats, UserProgress, UserStats } from '../src/utils/storage';
import { getCurrentUser, signOut, UserAccount } from '../src/utils/auth';
import { checkSubscription } from '../src/utils/subscription';

export default function ProfileScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [p, s, u, prem] = await Promise.all([
          getUserProgress(),
          getUserStats(),
          getCurrentUser(),
          checkSubscription(),
        ]);
        setProgress(p);
        setStats(s);
        setUser(u);
        setIsPremium(prem);
      })();
    }, [])
  );

  if (!progress || !stats) {
    return <View style={styles.center}><Text>Загрузка...</Text></View>;
  }

  const xpInCurrentLevel = progress.totalXp - progress.currentLevel * 50;
  const levelProgress = xpInCurrentLevel / 50;

  const handleSignOut = () => {
    Alert.alert('Выход', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          setUser(null);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, isPremium && styles.avatarPremium]}>
          <Text style={styles.avatarEmoji}>{user?.avatarEmoji || '🧑‍🎓'}</Text>
          {isPremium && (
            <View style={styles.crownBadge}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{user?.username || 'Ученик'}</Text>
        {user?.email && <Text style={styles.email}>{user.email}</Text>}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ Premium</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        {!user && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/auth')}>
            <Text style={styles.actionIcon}>🔐</Text>
            <Text style={styles.actionLabel}>Войти</Text>
          </TouchableOpacity>
        )}
        {!isPremium && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPremium]}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.actionIcon}>👑</Text>
            <Text style={styles.actionLabel}>Premium</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/achievements')}>
          <Text style={styles.actionIcon}>🏆</Text>
          <Text style={styles.actionLabel}>Ачивки</Text>
        </TouchableOpacity>
        {user && (
          <TouchableOpacity style={styles.actionBtn} onPress={handleSignOut}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionLabel}>Выйти</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Уровень {progress.currentLevel}</Text>
          <Text style={styles.levelXp}>{xpInCurrentLevel} / 50 XP</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${levelProgress * 100}%` }]} />
        </View>
        <Text style={styles.levelHint}>
          До уровня {progress.currentLevel + 1} осталось {50 - xpInCurrentLevel} XP
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard icon="⭐" value={progress.totalXp} label="Всего XP" color={Colors.xpGold} />
        <StatCard icon="🔥" value={progress.streak} label="Серия дней" color={Colors.streakOrange} />
        <StatCard icon="🏆" value={stats.bestStreak} label="Лучшая серия" color={Colors.primary} />
        <StatCard icon="📚" value={stats.totalLessonsCompleted} label="Уроков" color={Colors.success} />
        <StatCard icon="💬" value={stats.totalWordsLearned} label="Слов" color={Colors.accent} />
        <StatCard icon="❤️" value={isPremium ? '∞' : progress.hearts} label="Жизни" color={Colors.heartRed} />
      </View>

      {/* Premium CTA */}
      {!isPremium && (
        <TouchableOpacity
          style={styles.premiumCTA}
          onPress={() => router.push('/subscription')}
          activeOpacity={0.85}
        >
          <View style={styles.premiumCTAContent}>
            <Text style={styles.premiumCTAIcon}>👑</Text>
            <View style={styles.premiumCTAInfo}>
              <Text style={styles.premiumCTATitle}>Получите Premium</Text>
              <Text style={styles.premiumCTADesc}>Бесконечные жизни и эксклюзивный контент</Text>
            </View>
          </View>
          <Text style={styles.premiumCTAArrow}>→</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 16 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.glass, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, borderWidth: 3, borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 4,
  },
  avatarPremium: { borderColor: Colors.xpGold, borderWidth: 3 },
  avatarEmoji: { fontSize: 44 },
  crownBadge: { position: 'absolute', top: -8, right: -8 },
  crownText: { fontSize: 22 },
  username: { ...Typography.h2, color: Colors.text },
  email: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  premiumBadge: {
    backgroundColor: Colors.xpGold + '20', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 4, marginTop: 8,
  },
  premiumText: { ...Typography.caption, color: Colors.xpGold, fontWeight: '700' },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 12,
    paddingHorizontal: 20, marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: Colors.glass, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder, minWidth: 72,
  },
  actionPremium: { backgroundColor: Colors.xpGold + '10', borderColor: Colors.xpGold + '30' },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionLabel: { ...Typography.small, color: Colors.text, fontWeight: '600' },
  levelCard: {
    backgroundColor: Colors.glass, marginHorizontal: 20, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 3, marginBottom: 16,
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  levelTitle: { ...Typography.h3, color: Colors.text },
  levelXp: { ...Typography.bodyBold, color: Colors.xpGold },
  progressBar: {
    height: 14, backgroundColor: Colors.progressBg, borderRadius: 7, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.xpGold, borderRadius: 7 },
  levelHint: { ...Typography.small, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 14, gap: 12,
  },
  statCard: {
    backgroundColor: Colors.glass, borderRadius: 14, padding: 16, width: '46%', flexGrow: 1,
    borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.glassBorder,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { ...Typography.h2, color: Colors.text },
  statLabel: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  premiumCTA: {
    marginHorizontal: 20, marginTop: 20, backgroundColor: 'rgba(108, 99, 255, 0.08)',
    borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.primary + '30',
  },
  premiumCTAContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  premiumCTAIcon: { fontSize: 32, marginRight: 14 },
  premiumCTAInfo: { flex: 1 },
  premiumCTATitle: { ...Typography.bodyBold, color: Colors.primary },
  premiumCTADesc: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  premiumCTAArrow: { fontSize: 24, color: Colors.primary },
});

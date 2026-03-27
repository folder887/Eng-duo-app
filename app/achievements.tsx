import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../src/constants/colors';
import { Typography } from '../src/constants/typography';
import { getAchievements, Achievement } from '../src/utils/achievements';

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<(Achievement & { unlocked: boolean })[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
    }, [])
  );

  const loadAchievements = async () => {
    const all = await getAchievements();
    setAchievements(all);
    setUnlockedCount(all.filter((a) => a.unlocked).length);
  };

  const totalCount = achievements.length;
  const progress = totalCount > 0 ? unlockedCount / totalCount : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>Достижения</Text>
        <Text style={styles.subtitle}>
          {unlockedCount} из {totalCount} разблокировано
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Achievement Grid */}
      <View style={styles.grid}>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </View>
    </ScrollView>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement & { unlocked: boolean } }) {
  const scaleAnim = new Animated.Value(1);

  return (
    <Animated.View
      style={[
        styles.card,
        !achievement.unlocked && styles.cardLocked,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={[styles.iconContainer, achievement.unlocked && styles.iconUnlocked]}>
        <Text style={styles.icon}>
          {achievement.unlocked ? achievement.icon : '🔒'}
        </Text>
      </View>
      <Text style={[styles.cardTitle, !achievement.unlocked && styles.cardTitleLocked]}>
        {achievement.titleRu}
      </Text>
      <Text style={styles.cardDesc}>{achievement.descriptionRu}</Text>
      {achievement.reward > 0 && (
        <View style={[styles.rewardBadge, !achievement.unlocked && styles.rewardLocked]}>
          <Text style={styles.rewardText}>+{achievement.reward} XP</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  trophy: { fontSize: 56, marginBottom: 8 },
  title: { ...Typography.h1, color: Colors.text },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: 4, marginBottom: 16 },
  progressBar: {
    width: '100%', height: 12, backgroundColor: Colors.progressBg,
    borderRadius: 6, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.xpGold, borderRadius: 6,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12,
  },
  card: {
    width: '48%', backgroundColor: Colors.glass, borderRadius: 20, padding: 18,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2, marginBottom: 4,
  },
  cardLocked: { opacity: 0.5 },
  iconContainer: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.progressBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  iconUnlocked: {
    backgroundColor: Colors.xpGold + '25',
  },
  icon: { fontSize: 28 },
  cardTitle: { ...Typography.caption, color: Colors.text, textAlign: 'center', fontWeight: '700', marginBottom: 4 },
  cardTitleLocked: { color: Colors.textSecondary },
  cardDesc: { ...Typography.small, color: Colors.textSecondary, textAlign: 'center', lineHeight: 16 },
  rewardBadge: {
    backgroundColor: Colors.xpGold + '20', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 8,
  },
  rewardLocked: { backgroundColor: Colors.progressBg },
  rewardText: { ...Typography.small, color: Colors.xpGold, fontWeight: '700' },
});

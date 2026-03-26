import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface StatsBarProps {
  xp: number;
  streak: number;
  hearts: number;
  level: number;
}

export function StatsBar({ xp, streak, hearts, level }: StatsBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.statIcon}>⭐</Text>
        <Text style={styles.statValue}>{xp}</Text>
        <Text style={styles.statLabel}>XP</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.statIcon}>🔥</Text>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Серия</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.statIcon}>❤️</Text>
        <Text style={styles.statValue}>{hearts}</Text>
        <Text style={styles.statLabel}>Жизни</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.statIcon}>🏆</Text>
        <Text style={styles.statValue}>{level}</Text>
        <Text style={styles.statLabel}>Уровень</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
});

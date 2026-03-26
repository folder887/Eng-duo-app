import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface LessonButtonProps {
  icon: string;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
  score?: number;
  onPress: () => void;
}

export function LessonButton({ icon, title, isCompleted, isLocked, score, onPress }: LessonButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.completed,
        isLocked && styles.locked,
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, isCompleted && styles.iconCompleted, isLocked && styles.iconLocked]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.title, isLocked && styles.titleLocked]} numberOfLines={1}>
        {title}
      </Text>
      {isCompleted && score !== undefined && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}%</Text>
        </View>
      )}
      {isLocked && (
        <Text style={styles.lockIcon}>🔒</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    marginVertical: 8,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: Colors.primaryDark,
  },
  iconCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.successDark,
    shadowColor: Colors.success,
  },
  iconLocked: {
    backgroundColor: Colors.progressBg,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    ...Typography.caption,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  titleLocked: {
    color: Colors.textLight,
  },
  completed: {},
  locked: {
    opacity: 0.6,
  },
  scoreContainer: {
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  scoreText: {
    ...Typography.small,
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  lockIcon: {
    fontSize: 16,
    marginTop: 4,
  },
});

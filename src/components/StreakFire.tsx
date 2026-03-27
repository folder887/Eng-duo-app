import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type StreakSize = 'small' | 'large';

interface StreakFireProps {
  streak: number;
  size?: StreakSize;
}

function getStreakColor(streak: number): string {
  if (streak >= 100) return '#FF3D00';
  if (streak >= 30) return '#FF6D00';
  if (streak >= 7) return Colors.streakOrange;
  return Colors.xpGold;
}

function getGlowColor(streak: number): string {
  if (streak >= 100) return 'rgba(255, 61, 0, 0.35)';
  if (streak >= 30) return 'rgba(255, 109, 0, 0.3)';
  if (streak >= 7) return 'rgba(255, 150, 0, 0.25)';
  return 'rgba(255, 200, 0, 0.2)';
}

export function StreakFire({ streak, size = 'large' }: StreakFireProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  const isSmall = size === 'small';
  const emojiSize = isSmall ? 28 : 48;
  const countSize = isSmall ? Typography.caption : Typography.h2;
  const streakColor = getStreakColor(streak);
  const glowColor = getGlowColor(streak);

  useEffect(() => {
    const pulseSpeed = streak >= 100 ? 800 : streak >= 30 ? 1000 : 1200;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: pulseSpeed * 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: pulseSpeed * 0.8,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [streak]);

  const fireEmoji = streak >= 100 ? '🔥🔥🔥' : streak >= 30 ? '🔥🔥' : '🔥';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      {/* Glow effect behind the fire */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: glowColor,
            opacity: glowAnim,
            width: isSmall ? 50 : 80,
            height: isSmall ? 50 : 80,
            borderRadius: isSmall ? 25 : 40,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.fireEmoji,
          { fontSize: emojiSize, transform: [{ scale: pulseAnim }] },
        ]}
      >
        {fireEmoji}
      </Animated.Text>
      <Text style={[countSize, styles.count, { color: streakColor }]}>
        {streak}
      </Text>
      {!isSmall && (
        <Text style={styles.label}>
          {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  containerSmall: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 0,
  },
  glow: {
    position: 'absolute',
  },
  fireEmoji: {
    textAlign: 'center',
  },
  count: {
    fontWeight: '800',
    marginTop: 4,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface AnimatedProgressProps {
  progress: number; // 0 to 1
  height?: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
}

export function AnimatedProgress({
  progress,
  height = 14,
  showLabel = false,
  label,
  color,
}: AnimatedProgressProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const fillColor = color || Colors.progressFill;
  const percentage = Math.round(clampedProgress * 100);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={styles.label}>{label}</Text>
          )}
          {showLabel && (
            <Text style={styles.percentage}>{percentage}%</Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.container,
          { height, borderRadius: height / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolation,
              borderRadius: height / 2,
              backgroundColor: fillColor,
            },
          ]}
        >
          {/* Gradient-like effect using layered views */}
          <View style={[styles.gradientLayer1, { borderRadius: height / 2 }]} />
          <View style={[styles.gradientLayer2, { borderRadius: height / 2 }]} />
          <View style={[styles.shineEffect, { borderRadius: height / 2 }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    ...Typography.caption,
    color: Colors.text,
  },
  percentage: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  container: {
    width: '100%',
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: 0,
    height: '50%',
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    top: '50%',
    height: '50%',
  },
  shineEffect: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

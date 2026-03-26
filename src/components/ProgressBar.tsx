import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  fillColor?: string;
  backgroundColor?: string;
}

export function ProgressBar({
  progress,
  height = 12,
  fillColor = Colors.progressFill,
  backgroundColor = Colors.progressBg,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

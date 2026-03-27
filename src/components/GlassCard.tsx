import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
  onPress?: () => void;
  intensity?: number; // 0-1 for glass opacity
}

export function GlassCard({
  children,
  style,
  color,
  onPress,
  intensity = 0.72,
}: GlassCardProps) {
  const shadowColor = color || Colors.glassShadow;
  const backgroundColor = `rgba(255, 255, 255, ${intensity})`;

  const cardStyle: ViewStyle = {
    backgroundColor,
    shadowColor,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.overlay} />
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, cardStyle, style]}>
      <View style={styles.overlay} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.glassOverlay,
    borderRadius: 20,
  },
});

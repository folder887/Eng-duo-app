import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  emoji: string;
  size?: AvatarSize;
  isPremium?: boolean;
  onPress?: () => void;
}

const SIZE_MAP: Record<AvatarSize, { container: number; emoji: number; crown: number; ring: number }> = {
  small: { container: 40, emoji: 18, crown: 12, ring: 2 },
  medium: { container: 60, emoji: 28, crown: 16, ring: 3 },
  large: { container: 90, emoji: 42, crown: 22, ring: 4 },
};

export function Avatar({
  emoji,
  size = 'medium',
  isPremium = false,
  onPress,
}: AvatarProps) {
  const dim = SIZE_MAP[size];
  const containerSize = dim.container;
  const borderRadius = containerSize / 2;

  const circleStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius,
  };

  const ringStyle: ViewStyle | null = isPremium
    ? {
        borderWidth: dim.ring,
        borderColor: Colors.xpGold,
        shadowColor: Colors.xpGold,
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }
    : null;

  const content = (
    <View style={[styles.container, circleStyle, ringStyle]}>
      <View style={[styles.glassCircle, circleStyle]}>
        <View style={[styles.overlay, { borderRadius }]} />
        <Text style={[styles.emoji, { fontSize: dim.emoji }]}>{emoji}</Text>
      </View>
      {isPremium && (
        <View style={[styles.crownBadge, { top: -dim.crown / 2 }]}>
          <Text style={{ fontSize: dim.crown }}>👑</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCircle: {
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.glassOverlay,
  },
  emoji: {
    textAlign: 'center',
  },
  crownBadge: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
});

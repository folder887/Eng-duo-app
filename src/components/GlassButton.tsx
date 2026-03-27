import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'glass';
type ButtonSize = 'small' | 'medium' | 'large';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: string;
  size?: ButtonSize;
}

const VARIANT_COLORS: Record<ButtonVariant, { bg: string; border: string; text: string; shadow: string; bottomBorder: string }> = {
  primary: {
    bg: Colors.primary,
    border: 'rgba(255, 255, 255, 0.25)',
    text: Colors.textOnPrimary,
    shadow: Colors.primaryDark,
    bottomBorder: Colors.primaryDark,
  },
  secondary: {
    bg: Colors.gradientEnd,
    border: 'rgba(255, 255, 255, 0.25)',
    text: Colors.textOnPrimary,
    shadow: '#8B6FD6',
    bottomBorder: '#8B6FD6',
  },
  success: {
    bg: Colors.success,
    border: 'rgba(255, 255, 255, 0.25)',
    text: Colors.textOnPrimary,
    shadow: Colors.successDark,
    bottomBorder: Colors.successDark,
  },
  danger: {
    bg: Colors.error,
    border: 'rgba(255, 255, 255, 0.25)',
    text: Colors.textOnPrimary,
    shadow: '#CC3C3C',
    bottomBorder: '#CC3C3C',
  },
  glass: {
    bg: Colors.glass,
    border: Colors.glassBorder,
    text: Colors.primary,
    shadow: Colors.glassShadow,
    bottomBorder: 'rgba(108, 99, 255, 0.15)',
  },
};

const SIZE_STYLES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  small: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 14, iconSize: 14 },
  medium: { paddingVertical: 14, paddingHorizontal: 28, fontSize: 16, iconSize: 18 },
  large: { paddingVertical: 18, paddingHorizontal: 36, fontSize: 18, iconSize: 22 },
};

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  size = 'medium',
}: GlassButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colors = VARIANT_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
    shadowColor: colors.shadow,
    borderBottomColor: colors.bottomBorder,
    borderBottomWidth: 3,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        {variant !== 'glass' && <View style={styles.glassOverlay} />}
        {icon && (
          <Text style={[styles.icon, { fontSize: sizeStyle.iconSize }]}>{icon}</Text>
        )}
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: sizeStyle.fontSize },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.glassOverlay,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    ...Typography.button,
  },
});

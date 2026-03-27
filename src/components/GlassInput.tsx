import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface GlassInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: string;
  error?: string;
}

export function GlassInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  error,
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = error
    ? Colors.error
    : borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.glassBorder, Colors.primary],
      });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          { borderColor },
          isFocused && styles.focused,
          error ? styles.errorBorder : null,
        ]}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glass,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  focused: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 12,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 16,
  },
});

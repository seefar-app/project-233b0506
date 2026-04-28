import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'gradient' | 'outline';
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  style,
  padding = 'md',
}) => {
  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const paddingStyles = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
  };

  const containerStyle: ViewStyle[] = [
    styles.base,
    { padding: paddingStyles[padding] },
    variant === 'elevated' && styles.elevated,
    variant === 'outline' && styles.outline,
    style,
  ];

  if (variant === 'gradient') {
    const content = (
      <LinearGradient
        colors={['rgba(30, 27, 75, 0.9)', 'rgba(49, 46, 129, 0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.gradient, { padding: paddingStyles[padding] }, style]}
      >
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
          {content}
        </Pressable>
      );
    }
    return content;
  }

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          ...containerStyle,
          { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
});
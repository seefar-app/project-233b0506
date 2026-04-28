import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'card';
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'default',
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const backgroundColors = {
    default: colors.background,
    secondary: colors.backgroundSecondary,
    card: colors.card,
  };

  return (
    <View
      style={[{ backgroundColor: backgroundColors[variant] }, style]}
      {...props}
    />
  );
};
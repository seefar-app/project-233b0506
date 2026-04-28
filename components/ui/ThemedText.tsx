import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'secondary' | 'muted' | 'primary' | 'accent';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'default',
  weight = 'normal',
  size = 'base',
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const textColors = {
    default: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    primary: colors.primary,
    accent: colors.accent,
  };

  const fontWeights = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  };

  const fontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  };

  return (
    <Text
      style={[
        {
          color: textColors[variant],
          fontWeight: fontWeights[weight],
          fontSize: fontSizes[size],
        },
        style,
      ]}
      {...props}
    />
  );
};
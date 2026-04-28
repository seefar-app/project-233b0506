import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
}) => {
  const variantStyles = {
    default: { bg: '#334155', text: '#cbd5e1' },
    success: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' },
    warning: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    error: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
    info: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    accent: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  };

  const sizeStyles = {
    sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
    md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
  };

  const colors = variantStyles[variant];
  const sizing = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize: sizing.fontSize },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
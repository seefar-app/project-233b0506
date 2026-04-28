import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const sizes = {
    sm: 8,
    md: 12,
    lg: 16,
  };

  const colors = {
    online: '#10b981',
    offline: '#64748b',
    busy: '#ef4444',
    pending: '#fbbf24',
  };

  useEffect(() => {
    if (pulse && (status === 'online' || status === 'pending')) {
      const animation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.5,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [pulse, status]);

  const currentSize = sizes[size];

  return (
    <View style={styles.container}>
      {pulse && (status === 'online' || status === 'pending') && (
        <Animated.View
          style={[
            styles.pulse,
            {
              width: currentSize,
              height: currentSize,
              borderRadius: currentSize / 2,
              backgroundColor: colors[status],
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            width: currentSize,
            height: currentSize,
            borderRadius: currentSize / 2,
            backgroundColor: colors[status],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
  },
  dot: {
    borderWidth: 2,
    borderColor: '#0f172a',
  },
});
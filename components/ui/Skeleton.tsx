import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PropertyCardSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <Skeleton width="100%" height={200} borderRadius={16} />
    <View style={styles.cardContent}>
      <Skeleton width="70%" height={24} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={16} style={{ marginBottom: 8 }} />
      <View style={styles.row}>
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} style={{ marginLeft: 8 }} />
        <Skeleton width={60} height={20} borderRadius={10} style={{ marginLeft: 8 }} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#334155',
  },
  cardSkeleton: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
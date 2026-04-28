import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy';
  verified?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  showStatus = false,
  status = 'offline',
  verified = false,
  style,
}) => {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const currentSize = sizes[size];
  const fontSize = currentSize * 0.4;

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const statusColors = {
    online: '#10b981',
    offline: '#64748b',
    busy: '#ef4444',
  };

  return (
    <View style={[styles.container, { width: currentSize, height: currentSize }, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: currentSize, height: currentSize, borderRadius: currentSize / 2 }]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: currentSize, height: currentSize, borderRadius: currentSize / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
      {showStatus && (
        <View
          style={[
            styles.status,
            {
              backgroundColor: statusColors[status],
              width: currentSize * 0.3,
              height: currentSize * 0.3,
              borderRadius: currentSize * 0.15,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
      {verified && (
        <View
          style={[
            styles.verified,
            {
              width: currentSize * 0.35,
              height: currentSize * 0.35,
              borderRadius: currentSize * 0.175,
              right: -2,
              bottom: -2,
            },
          ]}
        >
          <Text style={{ fontSize: currentSize * 0.2 }}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#334155',
  },
  fallback: {
    backgroundColor: '#4c1d95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '700',
  },
  status: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  verified: {
    position: 'absolute',
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
});
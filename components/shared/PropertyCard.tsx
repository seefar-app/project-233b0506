import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/store/useStore';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'compact' | 'featured';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  variant = 'default',
}) => {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useStore();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const favorite = isFavorite(property.id);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/property/${property.id}`);
  };

  const handleFavorite = async (e: any) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(property.id);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  if (variant === 'compact') {
    return (
      <Pressable onPress={handlePress}>
        <Animated.View style={[styles.compactCard, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.compactImage}
            contentFit="cover"
          />
          <View style={styles.compactContent}>
            <Text style={styles.compactPrice}>{formatPrice(property.price)}</Text>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.compactAddress} numberOfLines={1}>
              {property.city}, {property.state}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          <View style={styles.priceTag}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.priceGradient}
            >
              <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
            </LinearGradient>
          </View>
          <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? '#ef4444' : '#ffffff'}
            />
          </Pressable>
          {property.status !== 'listed' && (
            <View style={styles.statusBadge}>
              <Badge
                label={property.status === 'pending' ? 'Under Contract' : 'Sold'}
                variant={property.status === 'sold' ? 'success' : 'warning'}
              />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#94a3b8" />
            <Text style={styles.address} numberOfLines={1}>
              {property.address}, {property.city}
            </Text>
          </View>
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="bed-outline" size={16} color="#8b5cf6" />
              <Text style={styles.featureText}>{property.bedrooms} beds</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="water-outline" size={16} color="#8b5cf6" />
              <Text style={styles.featureText}>{property.bathrooms} baths</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="resize-outline" size={16} color="#8b5cf6" />
              <Text style={styles.featureText}>{property.sqft.toLocaleString()} sqft</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  priceGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 4,
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginLeft: 4,
  },
  compactCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    width: 200,
    marginRight: 12,
  },
  compactImage: {
    width: '100%',
    height: 140,
  },
  compactContent: {
    padding: 12,
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 2,
  },
  compactAddress: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
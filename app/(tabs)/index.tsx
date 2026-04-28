import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { PropertyCardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useLocation } from '@/hooks/useLocation';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { properties, featuredProperties, isLoading, fetchProperties } = useStore();
  const location = useLocation();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  const handleSearch = () => {
    router.push('/(tabs)/search');
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={['#1e1b4b', '#312e81', '#4c1d95']}
            style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.greetingRow}>
                <View>
                  <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
                  <Text style={styles.userName}>{user?.name || 'Welcome'}</Text>
                </View>
                <Pressable onPress={() => router.push('/(tabs)/profile')}>
                  <Avatar
                    source={user?.avatar}
                    name={user?.name}
                    size="lg"
                    showStatus
                    status="online"
                  />
                </Pressable>
              </View>

              <Pressable onPress={handleSearch} style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#94a3b8" />
                <Text style={styles.searchPlaceholder}>Search for properties...</Text>
                <View style={styles.filterButton}>
                  <Ionicons name="options" size={18} color="#8b5cf6" />
                </View>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            <StatCard
              icon="home"
              value={properties.length.toString()}
              label="Available"
              color="#8b5cf6"
            />
            <StatCard
              icon="heart"
              value="12"
              label="Saved"
              color="#ef4444"
            />
            <StatCard
              icon="calendar"
              value="3"
              label="Tours"
              color="#10b981"
            />
            <StatCard
              icon="document-text"
              value="1"
              label="Offers"
              color="#fbbf24"
            />
          </ScrollView>
        </Animated.View>

        {/* Map Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Nearby</Text>
            <Pressable onPress={() => setShowMap(!showMap)} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>{showMap ? 'Hide Map' : 'View Map'}</Text>
              <Ionicons name={showMap ? 'chevron-up' : 'chevron-down'} size={16} color="#8b5cf6" />
            </Pressable>
          </View>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                showsUserLocation
              >
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    coordinate={{ latitude: property.lat, longitude: property.lng }}
                    onPress={() => router.push(`/property/${property.id}`)}
                  >
                    <View style={styles.mapMarker}>
                      <LinearGradient
                        colors={['#8b5cf6', '#7c3aed']}
                        style={styles.markerGradient}
                      >
                        <Text style={styles.markerPrice}>
                          ${(property.price / 1000).toFixed(0)}K
                        </Text>
                      </LinearGradient>
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>
          )}
        </View>

        {/* Featured Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <Pressable onPress={() => router.push('/(tabs)/search')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={16} color="#8b5cf6" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <View key={i} style={styles.featuredCard}>
                    <PropertyCardSkeleton />
                  </View>
                ))
              : featuredProperties.map((property) => (
                  <View key={property.id} style={styles.featuredCard}>
                    <PropertyCard property={property} variant="compact" />
                  </View>
                ))}
          </ScrollView>
        </View>

        {/* Recent Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Listings</Text>
            <Badge label="NEW" variant="accent" />
          </View>

          {isLoading
            ? [1, 2, 3].map((i) => <PropertyCardSkeleton key={i} />)
            : properties.slice(0, 5).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      {user?.role !== 'buyer' && (
        <Pressable
          style={[styles.fab, { bottom: 100 + insets.bottom }]}
          onPress={() => router.push('/listing/create')}
        >
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    gap: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#94a3b8',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
    alignItems: 'center',
  },
  markerGradient: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  markerPrice: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredScroll: {
    paddingRight: 20,
  },
  featuredCard: {
    marginRight: 0,
  },
  fab: {
    position: 'absolute',
    right: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
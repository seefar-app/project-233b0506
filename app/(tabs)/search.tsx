import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useStore } from '@/store/useStore';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { PropertyCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLocation } from '@/hooks/useLocation';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const location = useLocation();
  const {
    searchResults,
    searchFilters,
    isSearching,
    searchProperties,
    setSearchFilters,
    clearSearchFilters,
  } = useStore();

  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(searchFilters);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchProperties({ query });
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleApplyFilters = () => {
    setSearchFilters(tempFilters);
    searchProperties(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    clearSearchFilters();
    setTempFilters({
      query: '',
      minPrice: 0,
      maxPrice: 10000000,
      minBeds: 0,
      maxBeds: 10,
      minBaths: 0,
      maxBaths: 10,
      propertyTypes: [],
      amenities: [],
      minSqft: 0,
      maxSqft: 20000,
      sortBy: 'newest',
    });
    setShowFilters(false);
  };

  const propertyTypes = ['house', 'apartment', 'condo', 'townhouse', 'land'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'beds', label: 'Most Bedrooms' },
    { value: 'sqft', label: 'Largest' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search location, property..."
              placeholderTextColor="#64748b"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options" size={22} color="#8b5cf6" />
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list"
                size={18}
                color={viewMode === 'list' ? '#ffffff' : '#94a3b8'}
              />
              <Text
                style={[
                  styles.toggleText,
                  viewMode === 'list' && styles.toggleTextActive,
                ]}
              >
                List
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, viewMode === 'map' && styles.toggleActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons
                name="map"
                size={18}
                color={viewMode === 'map' ? '#ffffff' : '#94a3b8'}
              />
              <Text
                style={[
                  styles.toggleText,
                  viewMode === 'map' && styles.toggleTextActive,
                ]}
              >
                Map
              </Text>
            </Pressable>
          </View>

          <Text style={styles.resultsCount}>
            {searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'}
          </Text>
        </View>
      </View>

      {/* Results */}
      {viewMode === 'list' ? (
        <Animated.ScrollView
          style={[styles.listContainer, { opacity: fadeAnim }]}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {isSearching ? (
            [1, 2, 3].map((i) => <PropertyCardSkeleton key={i} />)
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search" size={48} color="#64748b" />
              </View>
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filters
              </Text>
              <Button
                title="Clear Filters"
                onPress={handleResetFilters}
                variant="outline"
                size="md"
              />
            </View>
          ) : (
            searchResults.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </Animated.ScrollView>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            }}
            showsUserLocation
          >
            {searchResults.map((property) => (
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

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.filterModal, { paddingTop: insets.top + 20 }]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={28} color="#f8fafc" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.filterContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInput}>
                  <Text style={styles.priceInputLabel}>Min</Text>
                  <Text style={styles.priceValue}>
                    ${(tempFilters.minPrice / 1000).toFixed(0)}K
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceInput}>
                  <Text style={styles.priceInputLabel}>Max</Text>
                  <Text style={styles.priceValue}>
                    ${(tempFilters.maxPrice / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10000000}
                step={50000}
                value={tempFilters.maxPrice}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, maxPrice: value })
                }
                minimumTrackTintColor="#8b5cf6"
                maximumTrackTintColor="#334155"
                thumbTintColor="#8b5cf6"
              />
            </View>

            {/* Bedrooms */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Bedrooms</Text>
              <View style={styles.optionRow}>
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <Pressable
                    key={num}
                    style={[
                      styles.optionButton,
                      tempFilters.minBeds === num && styles.optionButtonActive,
                    ]}
                    onPress={() => setTempFilters({ ...tempFilters, minBeds: num })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempFilters.minBeds === num && styles.optionTextActive,
                      ]}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Bathrooms</Text>
              <View style={styles.optionRow}>
                {[0, 1, 2, 3, 4].map((num) => (
                  <Pressable
                    key={num}
                    style={[
                      styles.optionButton,
                      tempFilters.minBaths === num && styles.optionButtonActive,
                    ]}
                    onPress={() => setTempFilters({ ...tempFilters, minBaths: num })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempFilters.minBaths === num && styles.optionTextActive,
                      ]}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <View style={styles.typeRow}>
                {propertyTypes.map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.typeButton,
                      tempFilters.propertyTypes.includes(type) && styles.typeButtonActive,
                    ]}
                    onPress={() => {
                      const types = tempFilters.propertyTypes.includes(type)
                        ? tempFilters.propertyTypes.filter((t) => t !== type)
                        : [...tempFilters.propertyTypes, type];
                      setTempFilters({ ...tempFilters, propertyTypes: types });
                    }}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        tempFilters.propertyTypes.includes(type) && styles.typeTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortRow}>
                {sortOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.sortButton,
                      tempFilters.sortBy === option.value && styles.sortButtonActive,
                    ]}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, sortBy: option.value as any })
                    }
                  >
                    <Text
                      style={[
                        styles.sortText,
                        tempFilters.sortBy === option.value && styles.sortTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.filterActions, { paddingBottom: insets.bottom + 20 }]}>
            <Button
              title="Reset"
              onPress={handleResetFilters}
              variant="outline"
              size="lg"
              fullWidth
            />
            <View style={{ height: 12 }} />
            <Button
              title="Apply Filters"
              onPress={handleApplyFilters}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#f8fafc',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleActive: {
    backgroundColor: '#8b5cf6',
  },
  toggleText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  resultsCount: {
    fontSize: 14,
    color: '#94a3b8',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  mapContainer: {
    flex: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerPrice: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  filterModal: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    alignItems: 'center',
  },
  priceInputLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  priceDivider: {
    width: 32,
    height: 2,
    backgroundColor: '#334155',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  optionText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  typeText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#a78bfa',
  },
  sortRow: {
    gap: 10,
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  sortText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  sortTextActive: {
    color: '#a78bfa',
  },
  filterActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
});
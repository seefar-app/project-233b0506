import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MapCardProps {
  latitude: number;
  longitude: number;
  title?: string;
  onPress?: () => void;
  height?: number;
}

export const MapCard: React.FC<MapCardProps> = ({
  latitude,
  longitude,
  title,
  onPress,
  height = 150,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }}>
          <View style={styles.marker}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.markerGradient}
            >
              <Ionicons name="home" size={16} color="#ffffff" />
            </LinearGradient>
          </View>
        </Marker>
      </MapView>
      {onPress && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Ionicons name="expand-outline" size={20} color="#ffffff" />
            <Text style={styles.overlayText}>View on Map</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  overlayText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '600',
  },
});
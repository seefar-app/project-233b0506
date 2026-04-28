import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 34.0522,
    longitude: -118.2437,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          if (mounted) {
            setLocation(prev => ({
              ...prev,
              loading: false,
              error: 'Location permission denied',
            }));
          }
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (mounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to get location',
          }));
        }
      }
    };

    getLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return location;
}
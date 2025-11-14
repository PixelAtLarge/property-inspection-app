import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const MapScreen = ({route}: Props) => {
  const {inspection} = route.params;
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        setLoading(false);
      },
      error => {
        console.log(error);
        Alert.alert(
          'Location Error',
          'Unable to get current location. Please check location permissions.',
        );
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Property Location</Text>
        <Text style={styles.subtitle}>Property ID: {inspection.propertyId}</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>📍</Text>
        <Text style={styles.mapPlaceholderSubtext}>Interactive Map</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>

      {loading ? (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Getting location...</Text>
        </View>
      ) : location ? (
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Current GPS Coordinates:</Text>
          <Text style={styles.locationText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}>
            <Text style={styles.refreshButtonText}>Refresh Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Location unavailable</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}>
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.featuresPanel}>
        <Text style={styles.featuresTitle}>Planned Map Features:</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Interactive property map</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Plat map overlay</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Flood plain data</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Neighboring properties</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>•</Text>
          <Text style={styles.featureText}>Property boundaries</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  locationInfo: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresPanel: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 20,
    color: '#3b82f6',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default MapScreen;

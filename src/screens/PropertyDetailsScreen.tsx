import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  MapPinIcon,
  HomeIcon as HomeIconOutline,
  ChevronLeftIcon,
  HeartIcon,
  Square2StackIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CubeIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {useFavorites} from '../context/FavoritesContext';
import {loadInspections} from '../services/storageService';

type Props = NativeStackScreenProps<RootStackParamList, 'PropertyDetails'>;

const {width} = Dimensions.get('window');

const PropertyDetailsScreen = ({route, navigation}: Props) => {
  const {propertyId, imageIndex, address, clientName, fakePropertyId, isFavorited} = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastInspectionDate, setLastInspectionDate] = useState<string | null>(null);
  const {toggleFavorite, isFavorited: checkIsFavorited} = useFavorites();
  const isBookmarked = checkIsFavorited(propertyId);

  // Reload inspection date when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLastInspectionDate();
    }, [propertyId])
  );

  const loadLastInspectionDate = async () => {
    try {
      const inspections = await loadInspections();
      // Find the most recent inspection for this property
      const propertyInspections = inspections.filter(
        inspection => inspection.propertyId === propertyId
      );

      if (propertyInspections.length > 0) {
        // Sort by inspection date descending and get the most recent
        const sortedInspections = propertyInspections.sort((a, b) => {
          const dateA = new Date(a.inspectionDate).getTime();
          const dateB = new Date(b.inspectionDate).getTime();
          return dateB - dateA;
        });

        const mostRecent = sortedInspections[0];
        const date = new Date(mostRecent.inspectionDate);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
        setLastInspectionDate(formattedDate);
      } else {
        setLastInspectionDate(null);
      }
    } catch (error) {
      console.error('Error loading last inspection date:', error);
      setLastInspectionDate(null);
    }
  };

  // Property images - using the same images as HomeScreen
  const propertyImages = [
    require('../assets/images/property1.jpg'),
    require('../assets/images/property2.jpg'),
    require('../assets/images/property3.jpg'),
    require('../assets/images/property4.jpg'),
    require('../assets/images/property5.jpg'),
    require('../assets/images/property6.jpg'),
  ];

  // Get the specific image for this property
  const mainPropertyImage = propertyImages[imageIndex % propertyImages.length];

  // Map property IDs to unique office building names
  const getOfficeBuildingName = (propId: string) => {
    const buildingNames: {[key: string]: string} = {
      '2550 Van Ness Ave': 'Van Ness Executive Plaza',
      '456 Oak Ave': 'Oak Street Corporate Center',
      '789 Pine Blvd': 'Pine Boulevard Tower',
      '1425 Market St': 'Market Street Business Hub',
      '3210 Fillmore St': 'Fillmore Financial Complex',
      '875 Lombard St': 'Lombard Professional Suites',
    };
    return buildingNames[propId] || 'Prestige Grand Office';
  };

  // Map property IDs to unit counts
  const getUnitCount = (propId: string) => {
    const unitCounts: {[key: string]: number} = {
      '2550 Van Ness Ave': 24,
      '456 Oak Ave': 18,
      '789 Pine Blvd': 32,
      '1425 Market St': 28,
      '3210 Fillmore St': 42,
      '875 Lombard St': 36,
    };
    return unitCounts[propId] || 20;
  };

  return (
    <View style={styles.container}>
      {/* Property Image */}
      <View style={styles.imageContainer}>
        <Image
          source={mainPropertyImage}
          style={styles.propertyImage}
          resizeMode="cover"
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={24} color="#1e3a5f" />
        </TouchableOpacity>

        {/* Bookmark Button */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => toggleFavorite(propertyId)}>
          {isBookmarked ? (
            <HeartIconSolid size={24} color="#ef4444" />
          ) : (
            <HeartIcon size={24} color="#64748b" />
          )}
        </TouchableOpacity>

        {/* Image Indicators */}
        <View style={styles.imageIndicators}>
          {propertyImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Property Details Card */}
      <View style={styles.detailsCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.propertyTitle}>{getOfficeBuildingName(propertyId)}</Text>

          <View style={[styles.infoRow, {marginBottom: 8}]}>
            <View style={styles.infoItem}>
              <MapPinIcon size={16} color="#fff" />
              <Text style={styles.infoText}>{address || '123 Main St, San Francisco, CA'}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, {marginBottom: 8}]}>
            <View style={styles.infoItem}>
              <BriefcaseIcon size={16} color="#fff" />
              <Text style={styles.infoText}>{clientName || 'Prestige Property Group'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <CalendarIcon size={16} color="#fff" />
              <Text style={styles.infoText}>Last Inspected: {lastInspectionDate || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.{' '}
            <Text style={styles.readMore}>Read More...</Text>
          </Text>

          {/* Features */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.features}>
            <View style={styles.featureChip}>
              <Square2StackIcon size={20} color="#1e3a5f" />
              <Text style={styles.featureText}>3480 Sq. Ft</Text>
            </View>
            <View style={styles.featureChip}>
              <CalendarIcon size={20} color="#1e3a5f" />
              <Text style={styles.featureText}>Built 1998</Text>
            </View>
            <View style={styles.featureChip}>
              <BuildingOfficeIcon size={20} color="#1e3a5f" />
              <Text style={styles.featureText}>Office</Text>
            </View>
            <View style={styles.featureChip}>
              <CubeIcon size={20} color="#1e3a5f" />
              <Text style={styles.featureText}>{getUnitCount(propertyId)} Units</Text>
            </View>
          </ScrollView>

          <View style={styles.scrollSpacer} />
        </ScrollView>

        {/* Price and Action - Fixed at bottom */}
        <View style={styles.bottomSection}>
          <View>
            <Text style={styles.price}>$3,250,000</Text>
            <Text style={styles.priceLabel}>
              As of {new Date().toLocaleDateString('en-US')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={() =>
              navigation.navigate('InspectionDetail', {
                address: address || '123 Main St, San Francisco, CA',
                propertyId: propertyId,
                clientName: clientName || 'Prestige Property Group',
              })
            }>
            <Text style={styles.unlockButtonText}>Inspect Property</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  imageContainer: {
    width: width,
    height: 400,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#1e3a5f',
  },
  detailsCard: {
    flex: 1,
    marginTop: -30,
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  propertyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  description: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
  readMore: {
    color: '#1e3a5f',
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#1e3a5f',
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  unlockButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  scrollSpacer: {
    height: 20,
  },
});

export default PropertyDetailsScreen;

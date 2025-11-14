import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  HomeIcon,
  HeartIcon as HeartIconOutline,
  PlusCircleIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {Inspection} from '../types';
import {loadInspections} from '../services/storageService';
import {useFavorites} from '../context/FavoritesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RecentInspections'>;

const RecentInspectionsScreen = ({navigation}: Props) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const {favoritedProperties, toggleFavorite} = useFavorites();

  useEffect(() => {
    loadInspectionsData();
  }, []);

  const loadInspectionsData = async () => {
    try {
      const data = await loadInspections();
      // Convert date strings back to Date objects
      const inspectionsWithDates = data.map(inspection => ({
        ...inspection,
        inspectionDate: new Date(inspection.inspectionDate),
        createdAt: new Date(inspection.createdAt),
        updatedAt: new Date(inspection.updatedAt),
      }));

      // Sort inspections: completed at top, then by most recent
      const sortedInspections = inspectionsWithDates.sort((a, b) => {
        // Completed inspections go to the top
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;

        // Within same status, sort by most recent updatedAt
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });

      setInspections(sortedInspections);
    } catch (error) {
      console.error('Error loading inspections:', error);
    }
  };

  const propertyImages = [
    require('../assets/images/property1.jpg'),
    require('../assets/images/property2.jpg'),
    require('../assets/images/property3.jpg'),
    require('../assets/images/property4.jpg'),
  ];

  const getPropertyImage = (index: number) => {
    return propertyImages[index % propertyImages.length];
  };

  const getPropertyPrice = (propertyId: string) => {
    const prices: {[key: string]: string} = {
      '2550 Van Ness Ave': '$3,450,000',
      '456 Oak Ave': '$3,200,000',
      '789 Pine Blvd': '$2,650,000',
      '1425 Market St': '$2,950,000',
    };
    return prices[propertyId] || '$2,800,000';
  };

  const getFakePropertyId = (addressOrId: string) => {
    const fakeIds: {[key: string]: string} = {
      '2550 Van Ness Ave': 'PROP-2024-104',
      '456 Oak Ave': 'PROP-2024-102',
      '789 Pine Blvd': 'PROP-2024-103',
      '1425 Market St': 'PROP-2024-105',
    };
    return fakeIds[addressOrId] || 'PROP-2024-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'synced':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const openInspection = (inspection: Inspection) => {
    navigation.navigate('InspectionDetail', {
      inspectionId: inspection.id,
      propertyId: getFakePropertyId(inspection.propertyId),
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Inspections</Text>
        <Text style={styles.headerSubtitle}>
          {inspections.length}{' '}
          {inspections.length === 1 ? 'inspection' : 'inspections'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {inspections.map((inspection, index) => (
          <TouchableOpacity
            key={inspection.id}
            style={styles.inspectionCard}
            onPress={() => openInspection(inspection)}>
            <View style={styles.imageContainer}>
              <Image
                source={getPropertyImage(index)}
                style={styles.inspectionImage}
                resizeMode="cover"
              />
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>
                  {getPropertyPrice(inspection.propertyId)}
                </Text>
              </View>
            </View>
            <View style={styles.inspectionInfo}>
              <View style={styles.inspectionDetails}>
                <View style={styles.propertyContainer}>
                  <View style={styles.propertyRow}>
                    <MapPinIcon size={14} color="#64748b" />
                    <Text style={styles.propertyAddress} numberOfLines={1}>
                      {(inspection.address || inspection.propertyId).split(',')[0]}
                    </Text>
                  </View>
                  <Text style={styles.propertyAddressSecondary} numberOfLines={1}>
                    {(inspection.address || inspection.propertyId).split(',').slice(1).join(',').trim()}
                  </Text>
                </View>
                <View style={styles.inspectorRow}>
                  <BriefcaseIcon size={14} color="#64748b" />
                  <Text style={styles.inspectorName} numberOfLines={1}>
                    {inspection.inspectorName || 'Property Services Inc'}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <CheckCircleIcon size={14} color="#64748b" />
                  <Text style={styles.dateText} numberOfLines={1}>
                    {inspection.inspectionDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => {
                toggleFavorite(inspection.propertyId);
              }}
              onStartShouldSetResponder={() => true}
              onResponderGrant={() => {
                toggleFavorite(inspection.propertyId);
              }}
              onResponderTerminationRequest={() => false}>
              {favoritedProperties.has(inspection.propertyId) ? (
                <HeartIconSolid size={24} color="#ef4444" />
              ) : (
                <HeartIconOutline size={24} color="#64748b" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BlurView
        style={styles.bottomNavBar}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white">
        <View style={styles.navInnerContainer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}>
            <View style={styles.navIconActive}>
              <HomeIcon size={28} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Favorites')}>
            <HeartIconOutline size={28} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('InspectionDetail', {})}>
            <PlusCircleIcon size={32} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <ClipboardDocumentCheckIcon size={28} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Profile')}>
            <UserIcon size={28} color="#64748b" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a5f',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inspectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  inspectionImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 14,
    textAlignVertical: 'center',
  },
  inspectionInfo: {
    flex: 1,
    padding: 16,
  },
  inspectionDetails: {
    flex: 1,
  },
  propertyContainer: {
    gap: 2,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    flex: 1,
  },
  propertyAddressSecondary: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    marginLeft: 18,
  },
  inspectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  inspectorName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    flex: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 24,
    overflow: 'hidden',
  },
  navInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3a5f',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default RecentInspectionsScreen;

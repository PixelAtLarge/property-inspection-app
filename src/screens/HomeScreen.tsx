import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Inspection} from '../types';
import {loadInspections, saveInspection} from '../services/storageService';
import NetInfo from '@react-native-community/netinfo';
import BottomNavBar, {NavTab} from '../components/navigation/BottomNavBar';
import {
  DocumentTextIcon,
  CameraIcon,
  CubeTransparentIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {FONTS} from '../constants/fonts';
import {useFavorites} from '../context/FavoritesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<'notes' | 'photos' | 'measurements'>('measurements');
  const {favoritedProperties, toggleFavorite, isFavorited} = useFavorites();

  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Reload inspections when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInspectionsData();
    }, [])
  );

  const loadInspectionsData = async () => {
    try {
      const data = await loadInspections();
      console.log('Loaded inspections from storage:', data.length);

      // Load actual inspections from storage
      const inspectionsWithDates = data.map(inspection => ({
        ...inspection,
        inspectionDate: new Date(inspection.inspectionDate),
        createdAt: new Date(inspection.createdAt),
        updatedAt: new Date(inspection.updatedAt),
      }));

      setInspections(inspectionsWithDates);
    } catch (error) {
      console.error('Error loading inspections:', error);
      Alert.alert('Error', 'Failed to load inspections');
    }
  };

  const createNewInspection = () => {
    navigation.navigate('InspectionDetail', {});
  };

  const getActionContent = (inspection: Inspection) => {
    switch (selectedAction) {
      case 'notes':
        return 'Notes Added';
      case 'photos':
        const photoCount = inspection.photos.length;
        const videoCount = 0; // Add video count when available
        return `${photoCount} Photos + ${videoCount} Videos`;
      case 'measurements':
        const measurementCount = inspection.floorPlan?.rooms.length || 0;
        return `${measurementCount} Measurements`;
      default:
        return 'Notes Added';
    }
  };

  const openInspection = (inspectionId: string, propertyId?: string) => {
    navigation.navigate('InspectionDetail', {
      inspectionId,
      propertyId: propertyId ? getFakePropertyId(propertyId) : undefined,
    });
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
    return status.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPropertyPrice = (propertyId: string) => {
    const prices: {[key: string]: string} = {
      '2550 Van Ness Ave': '$3,450,000',
      '456 Oak Ave': '$3,200,000',
      '789 Pine Blvd': '$2,650,000',
      '1425 Market St': '$2,950,000',
    };
    return prices[propertyId] || '$0';
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

  // Don't filter the main content - search dropdown is an overlay
  // The home screen content should remain static when searching
  console.log('Total inspections:', inspections.length);

  // Static list of nearby properties (always available to inspect)
  const nearbyProperties = [
    {
      id: 'nearby_1',
      propertyId: '2550 Van Ness Ave',
      address: '2550 Van Ness Ave, San Francisco, CA 94109',
      inspectorName: 'Prestige Property Group',
    },
    {
      id: 'nearby_2',
      propertyId: '456 Oak Ave',
      address: '456 Oak Ave, San Francisco, CA 94102',
      inspectorName: 'Bay Area Investments',
    },
    {
      id: 'nearby_3',
      propertyId: '789 Pine Blvd',
      address: '789 Pine Blvd, San Francisco, CA 94108',
      inspectorName: 'Pacific Realty Partners',
    },
  ];

  console.log('Recent inspections to display:', inspections.length);

  // Use local property images
  const propertyImages = [
    require('../assets/images/property1.jpg'),
    require('../assets/images/property2.jpg'),
    require('../assets/images/property3.jpg'),
  ];

  const profileImage = require('../assets/images/profile_pic.jpg');
  const property4Image = require('../assets/images/property4.jpg');
  const property5Image = require('../assets/images/property5.jpg');
  const property6Image = require('../assets/images/property6.jpg');

  const getPropertyImage = (index: number) => {
    return propertyImages[index % propertyImages.length];
  };

  // Fake search results
  const searchResults = [
    {
      id: 'search_1',
      address: '456 Oak Avenue, San Francisco, CA',
      propertyId: 'PROP-2024-001',
      price: '$2,850,000',
      clientName: 'Oak Avenue Properties',
    },
    {
      id: 'search_2',
      address: '567 Maple Lane, San Francisco, CA',
      propertyId: 'PROP-2024-104',
      price: '$3,100,000',
      clientName: 'Maple Properties LLC',
    },
    {
      id: 'search_3',
      address: '890 Birch Court, San Francisco, CA',
      propertyId: 'PROP-2024-205',
      price: '$2,650,000',
      clientName: 'Birch Court Ventures',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Site360</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}>
            <Image
              source={profileImage}
              style={styles.profileImage}
              resizeMode="cover"
            />
            {!isOnline && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={{marginLeft: 12}}>
              <MagnifyingGlassIcon size={20} color="#64748b" />
            </View>
          </View>
        </View>
      </View>

      {/* Overlay to close dropdown when tapping outside */}
      {searchQuery.length > 0 && (
        <TouchableWithoutFeedback onPress={() => setSearchQuery('')}>
          <View style={styles.searchOverlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Search Results Dropdown */}
      {searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={result.id}
              style={styles.searchResultItem}
              onPress={() => {
                setSearchQuery('');
                navigation.navigate('PropertyDetails', {
                  propertyId: result.propertyId,
                  imageIndex: index + 3, // property4.jpg (3), property5.jpg (4), property6.jpg (5)
                  address: result.address,
                  clientName: result.clientName,
                  isFavorited: favoritedProperties.has(result.propertyId),
                });
              }}>
              <Image
                source={index === 0 ? property4Image : index === 1 ? property5Image : property6Image}
                style={styles.searchResultImage}
                resizeMode="cover"
              />
              <View style={styles.searchResultInfo}>
                <Text style={styles.searchResultAddress} numberOfLines={1}>
                  {result.address}
                </Text>
                <Text style={styles.searchResultId}>{result.propertyId}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nearby Properties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NearbyProperties')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentScroll}>
            {nearbyProperties.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentCard}
                onPress={() =>
                  navigation.navigate('PropertyDetails', {
                    propertyId: item.propertyId,
                    imageIndex: index,
                    address: item.address,
                    clientName: item.inspectorName,
                    fakePropertyId: getFakePropertyId(item.propertyId),
                    isFavorited: favoritedProperties.has(item.propertyId),
                  })
                }>
                <View style={styles.recentCardImage}>
                  <Image
                    source={getPropertyImage(index)}
                    style={styles.placeholderImage}
                    resizeMode="cover"
                  />
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>
                      {getPropertyPrice(item.propertyId)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.propertyId);
                    }}>
                    {favoritedProperties.has(item.propertyId) ? (
                      <HeartIconSolid size={24} color="#ef4444" />
                    ) : (
                      <HeartIcon size={24} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.recentCardInfo}>
                  <Text style={styles.recentCardTitle} numberOfLines={1}>
                    {item.propertyId}
                  </Text>
                  <Text style={styles.recentCardSubtitle} numberOfLines={1}>
                    {item.inspectorName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Inspections Section */}
        <View style={[styles.section, {paddingTop: 0, paddingBottom: 125}]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Inspections</Text>
            <TouchableOpacity onPress={() => navigation.navigate('YourInspections')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {inspections.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <ClipboardDocumentCheckIcon size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No inspections yet</Text>
              <Text style={styles.emptyStateText}>
                Start inspecting properties to see them here
              </Text>
            </View>
          ) : (
            inspections.slice(0, 3).map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() =>
                  navigation.navigate('InspectionDetail', {
                    inspectionId: item.id,
                    propertyId: getFakePropertyId(item.propertyId),
                  })
                }>
                <View style={styles.featuredImageContainer}>
                  <Image
                    source={getPropertyImage(index)}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>
                      {getPropertyPrice(item.propertyId)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.propertyId);
                    }}>
                    {favoritedProperties.has(item.propertyId) ? (
                      <HeartIconSolid size={24} color="#ef4444" />
                    ) : (
                      <HeartIcon size={24} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.featuredInfo}>
                  <View style={styles.featuredHeader}>
                    <View style={{flex: 1}}>
                      <Text style={styles.recentCardTitle} numberOfLines={1}>
                        {(item.address || item.propertyId).split(',')[0]}
                      </Text>
                      <Text style={styles.recentCardSubtitle} numberOfLines={1}>
                        {item.inspectorName || 'Property Services Inc'}
                      </Text>
                    </View>
                    <View style={styles.inspectedBadge}>
                      <CheckIcon size={16} color="#10b981" />
                      <Text style={styles.inspectedText}>
                        {item.inspectionDate.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuredActions}>
                    <View style={styles.actionButton}>
                      <DocumentTextIcon
                        size={20}
                        color={item.notes && item.notes.length > 0 ? "#1e3a5f" : "#cbd5e1"}
                      />
                    </View>
                    <View style={styles.actionButton}>
                      <CameraIcon
                        size={20}
                        color={item.photos && item.photos.length > 0 ? "#1e3a5f" : "#cbd5e1"}
                      />
                    </View>
                    <View style={styles.actionButton}>
                      <CubeTransparentIcon
                        size={20}
                        color={item.floorPlan?.rooms && item.floorPlan.rooms.length > 0 ? "#1e3a5f" : "#cbd5e1"}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() =>
                        navigation.navigate('InspectionDetail', {
                          inspectionId: item.id,
                          propertyId: getFakePropertyId(item.propertyId),
                        })
                      }>
                      <Text style={styles.detailsButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab="home"
        onNavigate={(tab: NavTab) => {
          switch (tab) {
            case 'home':
              // Already on home
              break;
            case 'favorites':
              navigation.navigate('Favorites');
              break;
            case 'create':
              createNewInspection();
              break;
            case 'inspections':
              navigation.navigate('YourInspections');
              break;
            case 'profile':
              navigation.navigate('Profile');
              break;
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#1e3a5f',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: '#fff',
    lineHeight: 38,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: 32,
    height: 32,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#1e3a5f',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 56,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1e293b',
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 24,
  },
  filterScroll: {
    marginHorizontal: -20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: 12,
  },
  filterPillActive: {
    backgroundColor: '#1e3a5f',
    borderColor: '#1e3a5f',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  filterTextActive: {
    color: '#1e3a5f',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#1e3a5f',
  },
  recentScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  recentCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentCardImage: {
    position: 'relative',
  },
  placeholderImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e2e8f0',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 14,
    textAlignVertical: 'center',
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
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
  recentCardInfo: {
    padding: 16,
  },
  recentCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  recentCardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  recentCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a5f',
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredImageContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
  },
  featuredInfo: {
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  featuredStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featuredStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  inspectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  inspectedText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#10b981',
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredPhotos: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  featuredDate: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  detailsButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  emptyStateCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
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
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 170,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  searchResultId: {
    fontSize: 13,
    color: '#64748b',
  },
  searchResultPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a5f',
  },
});

export default HomeScreen;

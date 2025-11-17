import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  HeartIcon as HeartIconOutline,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {useFavorites} from '../context/FavoritesContext';
import BottomNavBar, {NavTab} from '../components/navigation/BottomNavBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const FavoritesScreen = ({navigation}: Props) => {
  const {favoritedProperties, toggleFavorite} = useFavorites();

  // Mock data for favorited properties
  const properties = [
    {
      id: '2550 Van Ness Ave',
      address: '2550 Van Ness Ave, San Francisco, CA 94109',
      price: '$3,450,000',
      clientName: 'Prestige Property Group',
      imageIndex: 0,
    },
    {
      id: '456 Oak Ave',
      address: '456 Oak Ave, San Francisco, CA',
      price: '$3,200,000',
      clientName: 'Bay Area Investments',
      imageIndex: 1,
    },
    {
      id: '789 Pine Blvd',
      address: '789 Pine Blvd, San Francisco, CA',
      price: '$2,650,000',
      clientName: 'Pacific Realty Partners',
      imageIndex: 2,
    },
    {
      id: '1425 Market St',
      address: '1425 Market St, San Francisco, CA 94103',
      price: '$2,950,000',
      clientName: 'Metro Property Group',
      imageIndex: 3,
    },
    // Search result properties
    {
      id: 'PROP-2024-001',
      address: '456 Oak Avenue, San Francisco, CA',
      price: '$2,850,000',
      clientName: 'Oak Avenue Properties',
      imageIndex: 3,
    },
    {
      id: 'PROP-2024-104',
      address: '567 Maple Lane, San Francisco, CA',
      price: '$3,100,000',
      clientName: 'Maple Properties LLC',
      imageIndex: 4,
    },
    {
      id: 'PROP-2024-205',
      address: '890 Birch Court, San Francisco, CA',
      price: '$2,650,000',
      clientName: 'Birch Court Ventures',
      imageIndex: 5,
    },
  ];

  const propertyImages = [
    require('../assets/images/property1.jpg'),
    require('../assets/images/property2.jpg'),
    require('../assets/images/property3.jpg'),
    require('../assets/images/property4.jpg'),
    require('../assets/images/property5.jpg'),
    require('../assets/images/property6.jpg'),
  ];

  const favoritedPropertiesList = properties.filter(prop =>
    favoritedProperties.has(prop.id)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favoritedPropertiesList.length} {favoritedPropertiesList.length === 1 ? 'property' : 'properties'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {favoritedPropertiesList.length === 0 ? (
          <View style={styles.emptyState}>
            <HeartIconOutline size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
              Start adding properties to your favorites to see them here
            </Text>
          </View>
        ) : (
          favoritedPropertiesList.map((property, index) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              onPress={() =>
                navigation.navigate('PropertyDetails', {
                  propertyId: property.id,
                  imageIndex: property.imageIndex,
                  address: property.address,
                  isFavorited: true,
                })
              }>
              <View style={styles.imageContainer}>
                <Image
                  source={propertyImages[property.imageIndex % propertyImages.length]}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{property.price}</Text>
                </View>
              </View>
              <View style={styles.propertyInfo}>
                <View style={styles.propertyDetails}>
                  <View style={styles.addressContainer}>
                    <View style={styles.addressRow}>
                      <MapPinIcon size={14} color="#64748b" />
                      <Text style={styles.propertyAddress} numberOfLines={1}>
                        {property.address.split(',')[0]}
                      </Text>
                    </View>
                    <Text style={styles.propertyAddressSecondary} numberOfLines={1}>
                      {property.address.split(',').slice(1).join(',').trim()}
                    </Text>
                  </View>
                  <View style={styles.clientRow}>
                    <BriefcaseIcon size={14} color="#64748b" />
                    <Text style={styles.clientName} numberOfLines={1}>
                      {property.clientName}
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <CheckCircleIcon size={14} color="#64748b" />
                    <Text style={styles.dateText} numberOfLines={1}>
                      N/A
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => {
                  toggleFavorite(property.id);
                }}
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => {
                  toggleFavorite(property.id);
                }}
                onResponderTerminationRequest={() => false}>
                <HeartIconSolid size={24} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab="favorites"
        onNavigate={(tab: NavTab) => {
          switch (tab) {
            case 'home':
              navigation.navigate('Home');
              break;
            case 'favorites':
              // Already on favorites
              break;
            case 'create':
              navigation.navigate('InspectionDetail', {});
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
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a5f',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    flexGrow: 1,
    padding: 20,
  },
  propertyCard: {
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
  propertyImage: {
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
  propertyInfo: {
    flex: 1,
    padding: 16,
  },
  propertyDetails: {
    flex: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  addressContainer: {
    gap: 2,
  },
  addressRow: {
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
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  clientName: {
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default FavoritesScreen;

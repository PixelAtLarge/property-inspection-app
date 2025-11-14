import React from 'react';
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
import {useFavorites} from '../context/FavoritesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyProperties'>;

const NearbyPropertiesScreen = ({navigation}: Props) => {
  const {favoritedProperties, toggleFavorite} = useFavorites();

  // All nearby properties - same data as HomeScreen
  const properties = [
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
    {
      id: '3210 Fillmore St',
      address: '3210 Fillmore St, San Francisco, CA 94123',
      price: '$4,100,000',
      clientName: 'Golden Gate Properties',
      imageIndex: 6,
    },
    {
      id: '875 Lombard St',
      address: '875 Lombard St, San Francisco, CA 94133',
      price: '$3,750,000',
      clientName: 'Coastal Realty Group',
      imageIndex: 7,
    },
  ];

  const propertyImages = [
    require('../assets/images/property1.jpg'),
    require('../assets/images/property2.jpg'),
    require('../assets/images/property3.jpg'),
    require('../assets/images/property4.jpg'),
    require('../assets/images/property5.jpg'),
    require('../assets/images/property6.jpg'),
    require('../assets/images/property7.jpg'),
    require('../assets/images/property8.jpg'),
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Properties</Text>
        <Text style={styles.headerSubtitle}>
          {properties.length} {properties.length === 1 ? 'property' : 'properties'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {properties.map((property, index) => (
          <TouchableOpacity
            key={property.id}
            style={styles.propertyCard}
            onPress={() =>
              navigation.navigate('PropertyDetails', {
                propertyId: property.id,
                imageIndex: property.imageIndex,
                address: property.address,
                isFavorited: favoritedProperties.has(property.id),
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
              {favoritedProperties.has(property.id) ? (
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

export default NearbyPropertiesScreen;

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  EllipsisHorizontalCircleIcon,
} from 'react-native-heroicons/outline';
import {Inspection} from '../types';
import {loadInspections, clearAllData} from '../services/storageService';
import {useFavorites} from '../context/FavoritesContext';
import BottomNavBar, {NavTab} from '../components/navigation/BottomNavBar';
import PropertyCard from '../components/property/PropertyCard';

type Props = NativeStackScreenProps<RootStackParamList, 'YourInspections'>;

const YourInspectionsScreen = ({navigation}: Props) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {favoritedProperties, toggleFavorite} = useFavorites();

  // Reload inspections when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInspectionsData();
    }, [])
  );

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

  const handleClearList = async () => {
    try {
      await clearAllData();
      setInspections([]);
      setDropdownVisible(false);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Inspections</Text>
            <TouchableOpacity onPress={toggleDropdown}>
              <EllipsisHorizontalCircleIcon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {inspections.length}{' '}
            {inspections.length === 1 ? 'property' : 'properties'}
          </Text>
        </View>
      </View>

      {/* Dropdown Menu */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
        animationType="fade">
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleClearList}>
                  <Text style={styles.dropdownItemText}>Clear list</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {inspections.length === 0 ? (
          <View style={styles.emptyState}>
            <ClipboardDocumentCheckIcon size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No inspections yet</Text>
            <Text style={styles.emptyStateText}>
              Start inspecting properties to see them here
            </Text>
          </View>
        ) : (
          inspections.map((inspection, index) => (
            <PropertyCard
              key={inspection.id}
              id={inspection.id}
              address={inspection.address || inspection.propertyId}
              price={getPropertyPrice(inspection.propertyId)}
              imageSource={getPropertyImage(index)}
              isFavorited={favoritedProperties.has(inspection.propertyId)}
              onPress={() => openInspection(inspection)}
              onToggleFavorite={() => toggleFavorite(inspection.propertyId)}
              variant="horizontal"
              inspectorName={inspection.inspectorName}
              inspectionDate={inspection.inspectionDate}
              status={inspection.status}
            />
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab="inspections"
        onNavigate={(tab: NavTab) => {
          switch (tab) {
            case 'home':
              navigation.navigate('Home');
              break;
            case 'favorites':
              navigation.navigate('Favorites');
              break;
            case 'create':
              navigation.navigate('InspectionDetail', {});
              break;
            case 'inspections':
              // Already on inspections
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
});

export default YourInspectionsScreen;

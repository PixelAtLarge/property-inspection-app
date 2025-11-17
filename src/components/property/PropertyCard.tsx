import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  HeartIcon as HeartIconOutline,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CameraIcon,
  CubeTransparentIcon,
} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {CheckIcon} from 'react-native-heroicons/solid';

export type PropertyCardVariant = 'horizontal' | 'vertical' | 'featured';

export interface PropertyCardProps {
  id: string;
  address: string;
  price: string;
  imageSource: ImageSourcePropType;
  isFavorited: boolean;
  onPress: () => void;
  onToggleFavorite: (e?: any) => void;
  variant?: PropertyCardVariant;

  // Optional fields based on variant
  clientName?: string;
  inspectorName?: string;
  inspectionDate?: Date;
  propertyId?: string;

  // For featured variant - inspection details
  notes?: string;
  photos?: any[];
  floorPlan?: {
    rooms?: any[];
  };

  // For horizontal variant - status
  status?: 'completed' | 'in-progress' | 'draft';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  address,
  price,
  imageSource,
  isFavorited,
  onPress,
  onToggleFavorite,
  variant = 'horizontal',
  clientName,
  inspectorName,
  inspectionDate,
  propertyId,
  notes,
  photos,
  floorPlan,
  status,
}) => {
  const renderHorizontalCard = () => (
    <TouchableOpacity style={styles.horizontalCard} onPress={onPress}>
      <View style={styles.horizontalImageContainer}>
        <Image source={imageSource} style={styles.horizontalImage} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{price}</Text>
        </View>
      </View>
      <View style={styles.horizontalInfo}>
        <View style={styles.horizontalDetails}>
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <MapPinIcon size={14} color="#64748b" />
              <Text style={styles.addressText} numberOfLines={1}>
                {address.split(',')[0]}
              </Text>
            </View>
            <Text style={styles.addressSecondary} numberOfLines={1}>
              {address.split(',').slice(1).join(',').trim()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <BriefcaseIcon size={14} color="#64748b" />
            <Text style={styles.infoText} numberOfLines={1}>
              {clientName || inspectorName || 'Property Services Inc'}
            </Text>
          </View>
          {inspectionDate && (
            <View style={styles.infoRow}>
              <CheckCircleIcon size={14} color="#64748b" />
              <Text style={styles.infoText} numberOfLines={1}>
                {inspectionDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={onToggleFavorite}
        onStartShouldSetResponder={() => true}
        onResponderGrant={onToggleFavorite}
        onResponderTerminationRequest={() => false}>
        {isFavorited ? (
          <HeartIconSolid size={24} color="#ef4444" />
        ) : (
          <HeartIconOutline size={24} color="#64748b" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderVerticalCard = () => (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress}>
      <View style={styles.verticalImageContainer}>
        <Image source={imageSource} style={styles.verticalImage} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{price}</Text>
        </View>
        <TouchableOpacity
          style={styles.verticalFavoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}>
          {isFavorited ? (
            <HeartIconSolid size={24} color="#ef4444" />
          ) : (
            <HeartIconOutline size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.verticalInfo}>
        <Text style={styles.verticalTitle} numberOfLines={1}>
          {propertyId || address.split(',')[0]}
        </Text>
        <Text style={styles.verticalSubtitle} numberOfLines={1}>
          {inspectorName || clientName || 'Property Services Inc'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedCard = () => (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <View style={styles.featuredImageContainer}>
        <Image source={imageSource} style={styles.featuredImage} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{price}</Text>
        </View>
        <TouchableOpacity
          style={styles.verticalFavoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}>
          {isFavorited ? (
            <HeartIconSolid size={24} color="#ef4444" />
          ) : (
            <HeartIconOutline size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.featuredInfo}>
        <View style={styles.featuredHeader}>
          <View style={{flex: 1}}>
            <Text style={styles.verticalTitle} numberOfLines={1}>
              {address.split(',')[0]}
            </Text>
            <Text style={styles.verticalSubtitle} numberOfLines={1}>
              {inspectorName || clientName || 'Property Services Inc'}
            </Text>
          </View>
          {inspectionDate && (
            <View style={styles.inspectedBadge}>
              <CheckIcon size={16} color="#10b981" />
              <Text style={styles.inspectedText}>
                {inspectionDate.toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.featuredActions}>
          <View style={styles.actionButton}>
            <DocumentTextIcon
              size={20}
              color={notes && notes.length > 0 ? '#1e3a5f' : '#cbd5e1'}
            />
          </View>
          <View style={styles.actionButton}>
            <CameraIcon
              size={20}
              color={photos && photos.length > 0 ? '#1e3a5f' : '#cbd5e1'}
            />
          </View>
          <View style={styles.actionButton}>
            <CubeTransparentIcon
              size={20}
              color={
                floorPlan?.rooms && floorPlan.rooms.length > 0
                  ? '#1e3a5f'
                  : '#cbd5e1'
              }
            />
          </View>
          <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  switch (variant) {
    case 'vertical':
      return renderVerticalCard();
    case 'featured':
      return renderFeaturedCard();
    case 'horizontal':
    default:
      return renderHorizontalCard();
  }
};

const styles = StyleSheet.create({
  // Horizontal Card Styles (YourInspections, Favorites)
  horizontalCard: {
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
  horizontalImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalInfo: {
    flex: 1,
    padding: 16,
  },
  horizontalDetails: {
    flex: 1,
  },
  addressContainer: {
    gap: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    flex: 1,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
    marginLeft: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  infoText: {
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

  // Vertical Card Styles (HomeScreen Nearby)
  verticalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: 200,
    overflow: 'hidden',
  },
  verticalImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  verticalImage: {
    width: '100%',
    height: '100%',
  },
  verticalFavoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  verticalInfo: {
    padding: 12,
  },
  verticalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  verticalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '400',
  },

  // Featured Card Styles (HomeScreen Recent Inspections)
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredInfo: {
    padding: 16,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  inspectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  inspectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Shared Styles
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
});

export default PropertyCard;

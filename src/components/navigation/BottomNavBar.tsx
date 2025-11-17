import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {
  HomeIcon,
  HeartIcon,
  PlusCircleIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
} from 'react-native-heroicons/outline';

export type NavTab = 'home' | 'favorites' | 'create' | 'inspections' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({activeTab, onNavigate}) => {
  const iconColor = '#64748b';
  const activeIconColor = '#fff';
  const iconSize = 28;
  const plusIconSize = 32;

  return (
    <BlurView
      style={styles.bottomNavBar}
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor="white">
      <View style={styles.navInnerContainer}>
        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('home')}>
          {activeTab === 'home' ? (
            <View style={styles.navIconActive}>
              <HomeIcon size={iconSize} color={activeIconColor} />
            </View>
          ) : (
            <HomeIcon size={iconSize} color={iconColor} />
          )}
        </TouchableOpacity>

        {/* Favorites */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('favorites')}>
          {activeTab === 'favorites' ? (
            <View style={styles.navIconActive}>
              <HeartIcon size={iconSize} color={activeIconColor} />
            </View>
          ) : (
            <HeartIcon size={iconSize} color={iconColor} />
          )}
        </TouchableOpacity>

        {/* Create/Add */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('create')}>
          <PlusCircleIcon size={plusIconSize} color={iconColor} />
        </TouchableOpacity>

        {/* Inspections */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('inspections')}>
          {activeTab === 'inspections' ? (
            <View style={styles.navIconActive}>
              <ClipboardDocumentCheckIcon size={iconSize} color={activeIconColor} />
            </View>
          ) : (
            <ClipboardDocumentCheckIcon size={iconSize} color={iconColor} />
          )}
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('profile')}>
          {activeTab === 'profile' ? (
            <View style={styles.navIconActive}>
              <UserIcon size={iconSize} color={activeIconColor} />
            </View>
          ) : (
            <UserIcon size={iconSize} color={iconColor} />
          )}
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
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

export default BottomNavBar;

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
  ShieldCheckIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  FlagIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon as HomeIconOutline,
  HeartIcon,
  PlusCircleIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({navigation}: Props) => {
  const profileImage = require('../assets/images/profile_pic.jpg');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={profileImage}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.profileName}>Grace Lee</Text>
          <View style={styles.locationContainer}>
            <MapPinIcon size={16} color="#9ca3af" />
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>
          <View style={styles.locationContainer}>
            <UsersIcon size={16} color="#9ca3af" />
            <Text style={styles.locationText}>Property Tax Practice</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <UserIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <ShieldCheckIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <LockClosedIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Privacy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Login')}>
              <View style={styles.menuLeft}>
                <ArrowRightOnRectangleIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Policies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Policies</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <QuestionMarkCircleIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Help & Support</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <InformationCircleIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Terms and Policies</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <FlagIcon size={24} color="#64748b" />
                <Text style={styles.menuText}>Report a Problem</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />
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
            <HomeIconOutline size={28} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Favorites')}>
            <HeartIcon size={28} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('InspectionDetail', {})}>
            <PlusCircleIcon size={32} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('YourInspections')}>
            <ClipboardDocumentCheckIcon size={28} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconActive}>
              <UserIcon size={28} color="#fff" />
            </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 32,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuValue: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  spacer: {
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

export default ProfileScreen;

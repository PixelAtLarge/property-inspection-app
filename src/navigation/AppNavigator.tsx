import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import InspectionDetailScreen from '../screens/InspectionDetailScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PropertyDetailsScreen from '../screens/PropertyDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import NearbyPropertiesScreen from '../screens/NearbyPropertiesScreen';
import RecentInspectionsScreen from '../screens/RecentInspectionsScreen';
import YourInspectionsScreen from '../screens/YourInspectionsScreen';
import {Inspection} from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
  InspectionDetail: {inspectionId?: string; address?: string; propertyId?: string};
  Map: {inspection: Inspection};
  Profile: undefined;
  PropertyDetails: {propertyId: string; imageIndex: number; address?: string; fakePropertyId?: string; isFavorited?: boolean};
  Favorites: undefined;
  NearbyProperties: undefined;
  RecentInspections: undefined;
  YourInspections: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e3a5f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InspectionDetail"
          component={InspectionDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{title: 'Property Map'}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PropertyDetails"
          component={PropertyDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NearbyProperties"
          component={NearbyPropertiesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecentInspections"
          component={RecentInspectionsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="YourInspections"
          component={YourInspectionsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

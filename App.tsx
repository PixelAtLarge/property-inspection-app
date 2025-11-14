/**
 * Property Inspection Mobile App
 * MVP Phase 1
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {FavoritesProvider} from './src/context/FavoritesContext';

function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
        <AppNavigator />
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

export default App;

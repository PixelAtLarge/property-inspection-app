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
import ErrorBoundary from './src/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <FavoritesProvider>
          <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
          <AppNavigator />
        </FavoritesProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;

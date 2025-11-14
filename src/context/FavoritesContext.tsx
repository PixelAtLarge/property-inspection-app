import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextType {
  favoritedProperties: Set<string>;
  toggleFavorite: (propertyId: string) => void;
  isFavorited: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const FAVORITES_STORAGE_KEY = '@favorites';

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [favoritedProperties, setFavoritedProperties] = useState<Set<string>>(
    new Set(),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveFavorites();
    }
  }, [favoritedProperties, isLoaded]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoritedProperties(new Set(parsed));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveFavorites = async () => {
    try {
      const array = Array.from(favoritedProperties);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(array));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (propertyId: string) => {
    setFavoritedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const isFavorited = (propertyId: string) => {
    return favoritedProperties.has(propertyId);
  };

  return (
    <FavoritesContext.Provider
      value={{favoritedProperties, toggleFavorite, isFavorited}}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

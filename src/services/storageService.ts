import AsyncStorage from '@react-native-async-storage/async-storage';
import {Inspection, SyncQueue} from '../types';

const INSPECTIONS_KEY = '@inspections';
const SYNC_QUEUE_KEY = '@sync_queue';

// Load all inspections from local storage
export const loadInspections = async (): Promise<Inspection[]> => {
  try {
    const data = await AsyncStorage.getItem(INSPECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading inspections:', error);
    return [];
  }
};

// Save a single inspection
export const saveInspection = async (inspection: Inspection): Promise<void> => {
  try {
    const inspections = await loadInspections();
    const index = inspections.findIndex(i => i.id === inspection.id);

    if (index >= 0) {
      inspections[index] = inspection;
    } else {
      inspections.push(inspection);
    }

    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(inspections));
  } catch (error) {
    console.error('Error saving inspection:', error);
    throw error;
  }
};

// Get a single inspection by ID
export const getInspection = async (
  id: string,
): Promise<Inspection | null> => {
  try {
    const inspections = await loadInspections();
    return inspections.find(i => i.id === id) || null;
  } catch (error) {
    console.error('Error getting inspection:', error);
    return null;
  }
};

// Delete an inspection
export const deleteInspection = async (id: string): Promise<void> => {
  try {
    const inspections = await loadInspections();
    const filtered = inspections.filter(i => i.id !== id);
    await AsyncStorage.setItem(INSPECTIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting inspection:', error);
    throw error;
  }
};

// Sync queue operations
export const addToSyncQueue = async (item: SyncQueue): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    queue.push(item);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    throw error;
  }
};

export const getSyncQueue = async (): Promise<SyncQueue[]> => {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sync queue:', error);
    return [];
  }
};

export const updateSyncQueueItem = async (
  id: string,
  updates: Partial<SyncQueue>,
): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    const index = queue.findIndex(item => item.id === id);

    if (index >= 0) {
      queue[index] = {...queue[index], ...updates};
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (error) {
    console.error('Error updating sync queue item:', error);
    throw error;
  }
};

export const removeSyncQueueItem = async (id: string): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    const filtered = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing sync queue item:', error);
    throw error;
  }
};

// Clear all data (useful for testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([INSPECTIONS_KEY, SYNC_QUEUE_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

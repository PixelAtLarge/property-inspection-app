// Core data types for Property Inspection App

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Inspection {
  id: string;
  propertyId: string;
  address?: string;
  inspectorName: string;
  inspectionDate: Date;
  status: 'draft' | 'in-progress' | 'completed' | 'synced';
  notes: string;
  photos: Photo[];
  floorPlan?: FloorPlan;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface Photo {
  id: string;
  uri: string;
  caption?: string;
  tags?: string[];
  location?: {
    room?: string;
    area?: string;
  };
  floorPlanPosition?: {
    x: number;
    y: number;
  };
  timestamp: Date;
  synced: boolean;
}

export interface FloorPlan {
  id: string;
  imageUri?: string;
  rooms: Room[];
  dimensions?: {
    width: number;
    height: number;
    unit: 'feet' | 'meters';
  };
}

export interface Room {
  id: string;
  name: string;
  dimensions?: {
    width: number;
    length: number;
    unit: 'feet' | 'meters';
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'plat' | 'flood' | 'neighboring' | 'custom';
  data: any;
  visible: boolean;
}

export interface SyncQueue {
  id: string;
  type: 'inspection' | 'photo' | 'report';
  data: any;
  status: 'pending' | 'uploading' | 'failed' | 'completed';
  retryCount: number;
  createdAt: Date;
  lastAttemptAt?: Date;
}

export interface Report {
  id: string;
  inspectionId: string;
  generatedAt: Date;
  format: 'pdf' | 'html';
  uri?: string;
}

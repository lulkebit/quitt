import { ObjectId } from 'mongodb';

export interface SmokingData {
  cigarettesPerDay: number;
  smokingStartYear: number;
  quitDate: Date;
  cigarettePrice: number; // Price per pack
  cigarettesPerPack: number;
  reasonsToQuit: string[];
  healthGoals?: string;
  previousQuitAttempts: number;
  motivationLevel: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = very high
}

// Craving related types
export interface CravingEntry {
  _id?: ObjectId;
  userId: ObjectId;
  intensity: number; // 1-10
  timestamp: Date;
  situation?: string;
  trigger?: string;
  location?: string;
  emotion?: string;
  copingStrategy?: string;
  distraction?: string;
  duration?: number; // in minutes
  notes?: string;
}

export interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'physical' | 'mental' | 'social' | 'activity';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  situation?: string[];
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DistractionActivity {
  id: string;
  title: string;
  description: string;
  category: 'creative' | 'physical' | 'social' | 'mindful' | 'productive';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  location: 'home' | 'outdoor' | 'anywhere';
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  smokingData: SmokingData;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  smokingData: SmokingData;
} 
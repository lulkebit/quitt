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
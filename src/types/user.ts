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

// Gamification System Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'health' | 'savings' | 'social' | 'streak';
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: number;
  unit: 'days' | 'euros' | 'cigarettes' | 'streaks' | 'months';
  unlockedAt?: Date;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  streakHistory: Date[];
  milestones: number[]; // Days reached (7, 30, 100, etc.)
}

export interface LevelSystem {
  currentLevel: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  levelTitle: string;
  levelDescription: string;
}

export interface VirtualReward {
  id: string;
  title: string;
  description: string;
  category: 'treat' | 'experience' | 'item' | 'upgrade';
  cost: number; // in saved euros
  icon: string;
  isPurchased: boolean;
  purchasedAt?: Date;
  isAvailable: boolean;
  requiredLevel?: number;
}

export interface GamificationData {
  achievements: Achievement[];
  streak: StreakData;
  level: LevelSystem;
  virtualRewards: VirtualReward[];
  totalRewardsEarned: number;
  totalMoneySpent: number;
  lastActivityDate: Date;
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
  gamificationData?: GamificationData;
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
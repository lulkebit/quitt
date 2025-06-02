'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GamificationData, Achievement, VirtualReward } from '@/types/user';
import { useAuth } from './AuthContext';
import {
  initializeGamificationData,
  updateAchievements,
  updateStreak,
  calculateTotalXP,
  calculateCurrentLevel,
  purchaseVirtualReward
} from '@/lib/gamification';
import { calculateSmokingStatistics } from '@/lib/smokingStats';

interface GamificationContextType {
  gamificationData: GamificationData | null;
  loading: boolean;
  error: string | null;
  refreshGamificationData: () => void;
  purchaseReward: (rewardId: string) => Promise<{ success: boolean; message: string }>;
  getNewlyUnlockedAchievements: () => Achievement[];
  markAchievementsAsViewed: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewedAchievements, setViewedAchievements] = useState<Set<string>>(new Set());

  const refreshGamificationData = async () => {
    if (!user?.smokingData) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate current stats
      const stats = calculateSmokingStatistics(user.smokingData);
      
      // Initialize or update gamification data
      let updatedData: GamificationData;
      
      if (!user.gamificationData) {
        // Initialize new gamification data
        updatedData = initializeGamificationData(user.smokingData);
      } else {
        // Update existing gamification data
        const totalXP = calculateTotalXP(stats.daysSinceQuit);
        const level = calculateCurrentLevel(totalXP);
        const streak = updateStreak(user.gamificationData.streak, stats.daysSinceQuit);
        const achievements = updateAchievements(
          user.gamificationData.achievements,
          stats.daysSinceQuit,
          stats.moneySaved,
          stats.cigarettesNotSmoked,
          stats.daysSinceQuit
        );

        updatedData = {
          ...user.gamificationData,
          achievements,
          streak,
          level,
          lastActivityDate: new Date()
        };
      }

      setGamificationData(updatedData);

      // Here you would typically save to database
      // await updateUserGamificationData(user._id, updatedData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const purchaseReward = async (rewardId: string): Promise<{ success: boolean; message: string }> => {
    if (!gamificationData || !user?.smokingData) {
      return { success: false, message: 'Keine Daten verfügbar' };
    }

    const stats = calculateSmokingStatistics(user.smokingData);
    const result = purchaseVirtualReward(gamificationData, rewardId, stats.moneySaved);

    if (result.success && result.updatedData) {
      setGamificationData(result.updatedData);
      // Here you would save to database
      // await updateUserGamificationData(user._id, result.updatedData);
    }

    return { success: result.success, message: result.message };
  };

  const getNewlyUnlockedAchievements = (): Achievement[] => {
    if (!gamificationData) return [];

    return gamificationData.achievements.filter(
      achievement => 
        achievement.isUnlocked && 
        achievement.unlockedAt &&
        !viewedAchievements.has(achievement.id)
    ).sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    });
  };

  const markAchievementsAsViewed = () => {
    if (!gamificationData) return;

    const newViewedAchievements = new Set(viewedAchievements);
    gamificationData.achievements
      .filter(a => a.isUnlocked)
      .forEach(a => newViewedAchievements.add(a.id));
    
    setViewedAchievements(newViewedAchievements);
  };

  useEffect(() => {
    if (user && user.smokingData) {
      refreshGamificationData();
    }
  }, [user]);

  const value: GamificationContextType = {
    gamificationData,
    loading,
    error,
    refreshGamificationData,
    purchaseReward,
    getNewlyUnlockedAchievements,
    markAchievementsAsViewed
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
} 
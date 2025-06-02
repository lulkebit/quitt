'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import AchievementBadges from './AchievementBadges';
import StreakCounter from './StreakCounter';
import LevelSystem from './LevelSystem';
import VirtualRewards from './VirtualRewards';

interface GamificationOverviewProps {
  className?: string;
}

export default function GamificationOverview({ className = '' }: GamificationOverviewProps) {
  const { gamificationData, getNewlyUnlockedAchievements, markAchievementsAsViewed } = useGamification();

  const newAchievements = getNewlyUnlockedAchievements();

  if (!gamificationData) {
    return (
      <div className={className}>
        <div className="space-y-8">
          {/* Loading State */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="h-32 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl p-6 shadow-2xl border border-green-200 max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-4xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Neues Abzeichen freigeschaltet!
              </h3>
              <div className="space-y-2 mb-4">
                {newAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="font-medium text-gray-700">{achievement.title}</span>
                  </div>
                ))}
                {newAchievements.length > 3 && (
                  <div className="text-sm text-gray-500">
                    und {newAchievements.length - 3} weitere...
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={markAchievementsAsViewed}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors duration-200"
              >
                Ansehen
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Hero Section - Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Deine Gamification-Erfolge
            </h1>
            <p className="text-gray-600">
              Verfolge deine Fortschritte und sammle Belohnungen
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Level */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50"
            >
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-blue-600">
                {gamificationData.level.currentLevel}
              </div>
              <div className="text-sm text-gray-600">
                Aktuelles Level
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50"
            >
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600">
                {gamificationData.streak.currentStreak}
              </div>
              <div className="text-sm text-gray-600">
                Tage Serie
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-purple-600">
                {gamificationData.achievements.filter(a => a.isUnlocked).length}
              </div>
              <div className="text-sm text-gray-600">
                Abzeichen
              </div>
            </motion.div>

            {/* Rewards */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50"
            >
              <div className="text-2xl mb-2">🎁</div>
              <div className="text-2xl font-bold text-green-600">
                {gamificationData.totalRewardsEarned}
              </div>
              <div className="text-sm text-gray-600">
                Belohnungen
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Streak Counter and Level System Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StreakCounter />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LevelSystem />
          </motion.div>
        </div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AchievementBadges />
        </motion.div>

        {/* Virtual Rewards Shop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <VirtualRewards />
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200">
            <span className="text-2xl">💪</span>
            <span className="font-medium text-gray-700">
              Du machst fantastische Fortschritte!
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
            Jeder rauchfreie Tag bringt dich deinen Zielen näher und verdient eine Belohnung
          </p>
        </motion.div>
      </div>
    </div>
  );
} 
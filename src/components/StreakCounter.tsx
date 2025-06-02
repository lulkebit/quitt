'use client';

import { motion } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateSmokingStatistics } from '@/lib/smokingStats';

interface StreakCounterProps {
  className?: string;
}

export default function StreakCounter({ className = '' }: StreakCounterProps) {
  const { gamificationData } = useGamification();
  const { user } = useAuth();

  if (!gamificationData || !user?.smokingData) {
    return (
      <div className={className}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-20 bg-gray-100 rounded-xl mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-100 rounded-xl"></div>
              <div className="h-16 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateSmokingStatistics(user.smokingData);
  const { streak } = gamificationData;

  // Calculate streak fire intensity based on current streak
  const getStreakIntensity = (streakDays: number) => {
    if (streakDays >= 100) return 'text-purple-500';
    if (streakDays >= 30) return 'text-red-500';
    if (streakDays >= 14) return 'text-orange-500';
    if (streakDays >= 7) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getStreakMessage = (streakDays: number) => {
    if (streakDays >= 365) return 'Legendäre Serie! 🏆';
    if (streakDays >= 100) return 'Jahrhundert-Serie! 💎';
    if (streakDays >= 30) return 'Monats-Champion! 👑';
    if (streakDays >= 14) return 'Zwei-Wochen-Held! ⭐';
    if (streakDays >= 7) return 'Wochen-Warrior! 🔥';
    if (streakDays >= 3) return 'Guter Start! 💪';
    if (streakDays >= 1) return 'Du schaffst das! 🌟';
    return 'Jeden Tag zählt! 💚';
  };

  // Calculate next milestone
  const milestoneTargets = [7, 14, 30, 60, 90, 100, 180, 365, 500, 1000];
  const nextMilestone = milestoneTargets.find(target => target > streak.currentStreak);
  const daysToNextMilestone = nextMilestone ? nextMilestone - streak.currentStreak : 0;

  // Progress to next milestone
  const lastMilestone = milestoneTargets.reverse().find(target => target <= streak.currentStreak) || 0;
  milestoneTargets.reverse(); // Reset order
  
  const milestoneProgress = nextMilestone 
    ? ((streak.currentStreak - lastMilestone) / (nextMilestone - lastMilestone)) * 100
    : 100;

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Streak Counter
          </h2>
          <div className="text-2xl">🔥</div>
        </div>

        {/* Main Streak Display */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
            className="relative"
          >
            {/* Fire Animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className={`text-8xl mb-4 ${getStreakIntensity(streak.currentStreak)}`}
            >
              🔥
            </motion.div>

            {/* Current Streak Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <span className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {streak.currentStreak}
              </span>
              <div className="text-lg text-gray-600 mt-1">
                Tag{streak.currentStreak !== 1 ? 'e' : ''} in Serie
              </div>
            </motion.div>

            {/* Streak Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-xl inline-block"
            >
              {getStreakMessage(streak.currentStreak)}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Longest Streak */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
          >
            <div className="text-2xl text-blue-600 mb-2">🏆</div>
            <div className="text-2xl font-bold text-blue-700">
              {streak.longestStreak}
            </div>
            <div className="text-sm text-blue-600">
              Längste Serie
            </div>
          </motion.div>

          {/* Total Check-ins */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
          >
            <div className="text-2xl text-green-600 mb-2">✅</div>
            <div className="text-2xl font-bold text-green-700">
              {streak.streakHistory.length}
            </div>
            <div className="text-sm text-green-600">
              Check-ins
            </div>
          </motion.div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-semibold text-purple-700">
                  Nächster Meilenstein
                </div>
                <div className="text-sm text-purple-600">
                  {nextMilestone} Tage Serie
                </div>
              </div>
              <div className="text-2xl">🎯</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-purple-600 mb-1">
                <span>{lastMilestone}</span>
                <span>{daysToNextMilestone} Tage verbleibend</span>
                <span>{nextMilestone}</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestoneProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Achieved Milestones */}
        {streak.milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Erreichte Meilensteine
            </h3>
            <div className="flex flex-wrap gap-2">
              {streak.milestones.map((milestone, index) => (
                <motion.div
                  key={milestone}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 
                           px-3 py-2 rounded-lg text-sm font-medium text-orange-700
                           flex items-center space-x-2"
                >
                  <span>🎉</span>
                  <span>{milestone} Tage</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pt-4 border-t border-gray-100"
        >
          <div className="text-sm text-gray-600">
            Bleib dran und erweitere deine Serie! 💪
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Jeder Tag bringt dich deinem Ziel näher
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
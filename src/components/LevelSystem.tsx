'use client';

import { motion } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import { LEVEL_THRESHOLDS } from '@/lib/gamification';

interface LevelSystemProps {
  className?: string;
}

export default function LevelSystem({ className = '' }: LevelSystemProps) {
  const { gamificationData } = useGamification();

  if (!gamificationData) {
    return (
      <div className={className}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-32 bg-gray-100 rounded-xl mb-4"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const { level } = gamificationData;
  const currentLevelData = LEVEL_THRESHOLDS.find(l => l.level === level.currentLevel);
  const nextLevelData = LEVEL_THRESHOLDS.find(l => l.level === level.currentLevel + 1);

  // Calculate XP progress for current level
  const currentLevelXP = currentLevelData?.xpRequired || 0;
  const nextLevelXP = nextLevelData?.xpRequired || currentLevelXP;
  const xpForCurrentLevel = level.totalXp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = xpNeededForLevel > 0 ? (xpForCurrentLevel / xpNeededForLevel) * 100 : 100;

  const getLevelColor = (levelNum: number) => {
    if (levelNum >= 10) return 'from-purple-600 to-pink-600';
    if (levelNum >= 8) return 'from-indigo-600 to-purple-600';
    if (levelNum >= 6) return 'from-blue-600 to-indigo-600';
    if (levelNum >= 4) return 'from-green-600 to-blue-600';
    if (levelNum >= 2) return 'from-yellow-600 to-green-600';
    return 'from-gray-600 to-yellow-600';
  };

  const getLevelIcon = (levelNum: number) => {
    if (levelNum >= 10) return '👑';
    if (levelNum >= 8) return '💎';
    if (levelNum >= 6) return '🏆';
    if (levelNum >= 4) return '⭐';
    if (levelNum >= 2) return '🌟';
    return '✨';
  };

  const getLevelBenefits = (levelNum: number) => {
    const benefits = [];
    if (levelNum >= 2) benefits.push('🎁 Erweiterte Belohnungen');
    if (levelNum >= 3) benefits.push('🎬 Premium Erlebnisse');
    if (levelNum >= 4) benefits.push('🍳 Exklusive Aktivitäten');
    if (levelNum >= 5) benefits.push('🧘‍♀️ Wellness-Belohnungen');
    if (levelNum >= 6) benefits.push('🏃‍♀️ Fitness-Tracker verfügbar');
    if (levelNum >= 8) benefits.push('⌚ Premium Gadgets');
    if (levelNum >= 10) benefits.push('🏞️ Luxus-Erlebnisse');
    return benefits;
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Level System
          </h2>
          <div className="text-2xl">{getLevelIcon(level.currentLevel)}</div>
        </div>

        {/* Current Level Display */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
            className="relative"
          >
            {/* Level Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              {getLevelIcon(level.currentLevel)}
            </motion.div>

            {/* Level Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl font-bold text-gray-600">Level</span>
                <span className={`text-5xl font-bold bg-gradient-to-r ${getLevelColor(level.currentLevel)} bg-clip-text text-transparent`}>
                  {level.currentLevel}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {level.levelTitle}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {level.levelDescription}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-600">
              Erfahrungspunkte (XP)
            </div>
            <div className="text-sm text-gray-500">
              {level.totalXp} XP total
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(level.currentLevel)}`}
              />
            </div>
            
            {/* XP Numbers */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{currentLevelXP} XP</span>
              {nextLevelData ? (
                <span>
                  {xpForCurrentLevel} / {xpNeededForLevel} XP 
                  ({level.xpToNextLevel} bis Level {level.currentLevel + 1})
                </span>
              ) : (
                <span>Max Level erreicht!</span>
              )}
              <span>{nextLevelXP} XP</span>
            </div>
          </div>
        </motion.div>

        {/* Next Level Preview */}
        {nextLevelData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-semibold text-purple-700">
                  Nächstes Level
                </div>
                <div className="text-sm text-purple-600">
                  Level {nextLevelData.level}: {nextLevelData.title}
                </div>
              </div>
              <div className="text-2xl">{getLevelIcon(nextLevelData.level)}</div>
            </div>
            <div className="text-sm text-purple-600">
              {nextLevelData.description}
            </div>
          </motion.div>
        )}

        {/* Level Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Deine Level-Vorteile
          </h3>
          <div className="space-y-2">
            {getLevelBenefits(level.currentLevel).map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="text-green-600">✅</div>
                <div className="text-sm font-medium text-green-700">
                  {benefit}
                </div>
              </motion.div>
            ))}
            
            {getLevelBenefits(level.currentLevel).length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                Erreiche Level 2 für deine ersten Vorteile! 🎁
              </div>
            )}
          </div>
        </motion.div>

        {/* Level Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-50 p-4 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Level-Übersicht
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {LEVEL_THRESHOLDS.slice(0, 10).map((levelData, index) => (
              <motion.div
                key={levelData.level}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.05 }}
                className={`
                  text-center p-2 rounded-lg border-2 transition-all duration-200
                  ${levelData.level <= level.currentLevel
                    ? `bg-gradient-to-br ${getLevelColor(levelData.level).replace('from-', 'from-').replace('to-', 'to-').replace('-600', '-100')} border-green-300`
                    : 'bg-gray-100 border-gray-200'
                  }
                `}
              >
                <div className={`text-lg ${levelData.level <= level.currentLevel ? 'filter-none' : 'grayscale opacity-50'}`}>
                  {getLevelIcon(levelData.level)}
                </div>
                <div className={`text-xs font-medium ${levelData.level <= level.currentLevel ? 'text-green-700' : 'text-gray-500'}`}>
                  {levelData.level}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center pt-4 border-t border-gray-100 mt-4"
        >
          <div className="text-sm text-gray-600">
            {level.currentLevel >= 10 
              ? 'Du hast das Maximum erreicht! 🎉'
              : 'Sammle XP durch deine rauchfreien Tage! 💪'
            }
          </div>
          {level.currentLevel < 10 && (
            <div className="text-xs text-gray-400 mt-1">
              Noch {level.xpToNextLevel} XP bis zum nächsten Level
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
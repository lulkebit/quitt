'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/user';
import { useGamification } from '@/contexts/GamificationContext';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

function AchievementBadge({ achievement, onClick }: AchievementBadgeProps) {
  const getBadgeColors = (type: Achievement['type'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        icon: 'text-gray-400',
        text: 'text-gray-500'
      };
    }

    switch (type) {
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          border: 'border-amber-200',
          icon: 'text-amber-600',
          text: 'text-amber-700'
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-300',
          icon: 'text-gray-600',
          text: 'text-gray-700'
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          icon: 'text-yellow-600',
          text: 'text-yellow-700'
        };
      case 'platinum':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-300',
          icon: 'text-purple-600',
          text: 'text-purple-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          text: 'text-gray-700'
        };
    }
  };

  const colors = getBadgeColors(achievement.type, achievement.isUnlocked);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ 
        scale: achievement.isUnlocked ? 1.05 : 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl border-2 cursor-pointer
        transition-all duration-300 hover:shadow-lg
        ${colors.bg} ${colors.border}
        ${achievement.isUnlocked ? 'shadow-sm' : ''}
      `}
    >
      {/* Unlock Animation */}
      {achievement.isUnlocked && achievement.unlockedAt && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, times: [0, 0.5, 1] }}
          className="absolute inset-0 bg-yellow-200 rounded-2xl"
        />
      )}

      <div className="relative z-10">
        {/* Badge Icon */}
        <div className="text-center mb-3">
          <div className={`text-4xl mb-2 ${achievement.isUnlocked ? 'filter-none' : 'grayscale'}`}>
            {achievement.icon}
          </div>
          <div className="flex justify-center">
            {achievement.isUnlocked ? (
              <div className={`
                w-2 h-2 rounded-full ${colors.icon.replace('text-', 'bg-')}
                shadow-sm
              `} />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </div>
        </div>

        {/* Badge Content */}
        <div className="text-center">
          <h3 className={`font-semibold text-sm mb-1 ${colors.text}`}>
            {achievement.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {achievement.description}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${achievement.isUnlocked 
                  ? colors.icon.replace('text-', 'bg-')
                  : 'bg-gray-400'
                }
              `}
            />
          </div>

          {/* Progress Text */}
          <div className="text-xs text-gray-400">
            {achievement.isUnlocked ? (
              <span className={`font-medium ${colors.text}`}>
                Freigeschaltet!
              </span>
            ) : (
              <span>
                {achievement.progress} / {achievement.maxProgress}
              </span>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <div className={`
            px-2 py-1 rounded-md text-xs font-medium
            ${colors.bg} ${colors.border} ${colors.text}
          `}>
            {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface AchievementBadgesProps {
  className?: string;
}

export default function AchievementBadges({ className = '' }: AchievementBadgesProps) {
  const { gamificationData } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  if (!gamificationData) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'Alle', icon: '🏆' },
    { id: 'milestone', label: 'Meilensteine', icon: '🎯' },
    { id: 'health', label: 'Gesundheit', icon: '❤️' },
    { id: 'savings', label: 'Ersparnisse', icon: '💰' },
    { id: 'streak', label: 'Serien', icon: '🔥' }
  ];

  const filteredAchievements = gamificationData.achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = gamificationData.achievements.filter(a => a.isUnlocked).length;
  const totalCount = gamificationData.achievements.length;

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Erfolge & Abzeichen
            </h2>
            <p className="text-sm text-gray-500">
              {unlockedCount} von {totalCount} Abzeichen freigeschaltet
            </p>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray={`${(unlockedCount / totalCount) * 100}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${(unlockedCount / totalCount) * 100}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-green-600">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 flex items-center space-x-2
                ${selectedCategory === category.id
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Achievement Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {selectedAchievement.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedAchievement.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedAchievement.description}
                  </p>
                  
                  {selectedAchievement.isUnlocked ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <div className="text-green-600 font-medium text-sm">
                        ✅ Freigeschaltet!
                      </div>
                      {selectedAchievement.unlockedAt && (
                        <div className="text-green-500 text-xs mt-1">
                          {new Date(selectedAchievement.unlockedAt).toLocaleDateString('de-DE')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="text-gray-600 font-medium text-sm mb-2">
                        Fortschritt: {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAchievement(null)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium
                             hover:bg-gray-200 transition-colors duration-200"
                  >
                    Schließen
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
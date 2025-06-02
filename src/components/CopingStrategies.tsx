'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Star, RefreshCw } from 'lucide-react';
import { COPING_STRATEGIES, getCopingStrategiesByTimeAndSituation } from '@/lib/cravingData';
import { CopingStrategy } from '@/types/user';

interface CopingStrategiesProps {
  className?: string;
}

export default function CopingStrategies({ className = '' }: CopingStrategiesProps) {
  const [currentStrategies, setCurrentStrategies] = useState<CopingStrategy[]>([]);
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const refreshStrategies = () => {
    const timeOfDay = getTimeOfDay();
    setCurrentTimeOfDay(timeOfDay);
    const strategies = getCopingStrategiesByTimeAndSituation(timeOfDay);
    // Shuffle and take 3 strategies
    const shuffled = [...strategies].sort(() => Math.random() - 0.5);
    setCurrentStrategies(shuffled.slice(0, 3));
  };

  useEffect(() => {
    refreshStrategies();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breathing':
        return '🫁';
      case 'physical':
        return '🏃';
      case 'mental':
        return '🧠';
      case 'social':
        return '👥';
      case 'activity':
        return '🎯';
      default:
        return '💡';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing':
        return 'from-blue-400 to-blue-500';
      case 'physical':
        return 'from-green-400 to-green-500';
      case 'mental':
        return 'from-purple-400 to-purple-500';
      case 'social':
        return 'from-pink-400 to-pink-500';
      case 'activity':
        return 'from-orange-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimeOfDayText = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning':
        return 'Morgen';
      case 'afternoon':
        return 'Nachmittag';
      case 'evening':
        return 'Abend';
      case 'night':
        return 'Nacht';
      default:
        return 'Jederzeit';
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bewältigungsstrategien</h3>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Für den {getTimeOfDayText(currentTimeOfDay)}</span>
            </p>
          </div>
        </div>
        <motion.button
          onClick={refreshStrategies}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Neue Strategien laden"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(strategy.category)} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(strategy.category)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{strategy.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(strategy.difficulty)}`}>
                          {strategy.difficulty === 'easy' ? 'Einfach' : strategy.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {strategy.duration} Min.
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (strategy.difficulty === 'easy' ? 3 : strategy.difficulty === 'medium' ? 2 : 1)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {strategy.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-4 py-3 bg-gradient-to-r ${getCategoryColor(strategy.category)} text-white rounded-xl font-medium text-sm hover:shadow-md transition-all duration-300`}
                >
                  Strategie anwenden
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentStrategies.length === 0 && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Lade Bewältigungsstrategien...</p>
        </div>
      )}
    </div>
  );
} 
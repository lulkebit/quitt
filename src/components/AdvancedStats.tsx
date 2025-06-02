'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  addYears,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { SmokingData } from '@/types/user';
import { SmokingStatistics } from '@/lib/smokingStats';

interface AdvancedStatsProps {
  smokingData: SmokingData;
  stats: SmokingStatistics;
}

interface AdvancedMetric {
  label: string;
  value: string;
  unit: string;
  icon: string;
  comparison?: string;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

export default function AdvancedStats({ smokingData, stats }: AdvancedStatsProps) {
  const quitDate = useMemo(() => new Date(smokingData.quitDate), [smokingData.quitDate]);
  
  const advancedMetrics = useMemo(() => {
    const today = new Date();
    const costPerCigarette = smokingData.cigarettePrice / smokingData.cigarettesPerPack;
    
    // Calculate weekly, monthly, yearly savings
    const weeklySavings = 7 * smokingData.cigarettesPerDay * costPerCigarette;
    const monthlySavings = 30 * smokingData.cigarettesPerDay * costPerCigarette;
    const yearlySavings = 365 * smokingData.cigarettesPerDay * costPerCigarette;
    
    // Calculate time periods
    const weeksSinceQuit = differenceInWeeks(today, quitDate);
    const monthsSinceQuit = differenceInMonths(today, quitDate);
    const yearsSinceQuit = differenceInYears(today, quitDate);
    
    // Calculate life extension (rough estimate)
    const cigarettesAvoided = stats.cigarettesNotSmoked;
    const minutesGained = cigarettesAvoided * 11; // Each cigarette = ~11 minutes lost
    const hoursGained = minutesGained / 60;
    const daysGained = hoursGained / 24;
    
    // Calculate potential future savings
    const futureYear = addYears(today, 1);
    const potentialYearlySavings = 365 * smokingData.cigarettesPerDay * costPerCigarette;
    
    // Calculate carbon footprint saved (rough estimate)
    const carbonSaved = cigarettesAvoided * 0.014; // ~14g CO2 per cigarette
    
    const metrics: AdvancedMetric[] = [
      {
        label: 'Lebenszeit gewonnen',
        value: daysGained.toFixed(1),
        unit: 'Tage',
        icon: '⏱️',
        comparison: `${Math.round(hoursGained)} Stunden`,
        color: 'green',
      },
      {
        label: 'Wöchentliche Ersparnis',
        value: weeklySavings.toFixed(0),
        unit: '€',
        icon: '💰',
        comparison: `${(weeklySavings * 52).toFixed(0)}€ pro Jahr`,
        color: 'blue',
      },
      {
        label: 'Zigaretten pro Woche',
        value: (smokingData.cigarettesPerDay * 7).toString(),
        unit: 'vermieden',
        icon: '🚭',
        comparison: `${(smokingData.cigarettesPerDay * 365).toLocaleString('de-DE')} pro Jahr`,
        color: 'purple',
      },
      {
        label: 'CO₂ Ersparnis',
        value: carbonSaved.toFixed(1),
        unit: 'kg',
        icon: '🌱',
        comparison: 'Umweltbeitrag',
        color: 'green',
      },
      {
        label: 'Durchschnitt pro Tag',
        value: (stats.moneySaved / Math.max(stats.daysSinceQuit, 1)).toFixed(2),
        unit: '€',
        icon: '📊',
        comparison: 'Tägliche Ersparnis',
        color: 'orange',
      },
      {
        label: 'Nikotinfreiheit',
        value: Math.min(100, (stats.daysSinceQuit / 365) * 100).toFixed(0),
        unit: '%',
        icon: '❤️',
        comparison: 'Körperliche Erholung',
        color: 'red',
      },
    ];

    return metrics;
  }, [smokingData, stats, quitDate]);

  // Calculate streak quality
  const streakQuality = useMemo(() => {
    const consistency = Math.min(100, (stats.daysSinceQuit / 365) * 100);
    let quality: 'excellent' | 'good' | 'fair' | 'starting' = 'starting';
    let message = '';
    
    if (consistency >= 75) {
      quality = 'excellent';
      message = 'Außergewöhnliche Leistung!';
    } else if (consistency >= 50) {
      quality = 'good';
      message = 'Sehr gute Fortschritte!';
    } else if (consistency >= 25) {
      quality = 'fair';
      message = 'Guter Anfang!';
    } else {
      quality = 'starting';
      message = 'Jeder Tag zählt!';
    }
    
    return { consistency, quality, message };
  }, [stats.daysSinceQuit]);

  // Milestones progress
  const milestonesProgress = useMemo(() => {
    const milestones = [
      { name: '1 Woche', days: 7, icon: '🎯' },
      { name: '1 Monat', days: 30, icon: '🏆' },
      { name: '3 Monate', days: 90, icon: '⭐' },
      { name: '6 Monate', days: 180, icon: '💎' },
      { name: '1 Jahr', days: 365, icon: '👑' },
      { name: '2 Jahre', days: 730, icon: '🎖️' },
    ];

    return milestones.map(milestone => ({
      ...milestone,
      achieved: stats.daysSinceQuit >= milestone.days,
      progress: Math.min(100, (stats.daysSinceQuit / milestone.days) * 100),
    }));
  }, [stats.daysSinceQuit]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="space-y-6"
    >
      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advancedMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} />
        ))}
      </div>

      {/* Streak Quality */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Streak-Qualität</h3>
          <span className="text-2xl">🔥</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Konstanz</span>
            <span className="font-semibold text-gray-900">
              {streakQuality.consistency.toFixed(0)}%
            </span>
          </div>
          
          <div className="relative">
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${streakQuality.consistency}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className={`h-full rounded-full ${
                  streakQuality.quality === 'excellent' 
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : streakQuality.quality === 'good'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                    : streakQuality.quality === 'fair'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                    : 'bg-gradient-to-r from-gray-500 to-gray-400'
                }`}
              />
            </div>
          </div>
          
          <p className={`text-sm font-medium ${
            streakQuality.quality === 'excellent' 
              ? 'text-green-600'
              : streakQuality.quality === 'good'
              ? 'text-blue-600'
              : streakQuality.quality === 'fair'
              ? 'text-yellow-600'
              : 'text-gray-600'
          }`}>
            {streakQuality.message}
          </p>
        </div>
      </motion.div>

      {/* Milestones Progress */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Meilenstein-Fortschritt</h3>
          <span className="text-2xl">🎯</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {milestonesProgress.map((milestone, index) => (
            <MilestoneCard key={index} milestone={milestone} />
          ))}
        </div>
      </motion.div>

      {/* Health Recovery Timeline */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Gesundheits-Erholung</h3>
          <span className="text-2xl">❤️</span>
        </div>
        
        <div className="space-y-4">
          {stats.healthImprovements.slice(0, 5).map((improvement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                improvement.achieved 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                improvement.achieved ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    improvement.achieved ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {improvement.timeframe}
                  </span>
                  {improvement.achieved && (
                    <span className="text-green-600 text-sm">✓</span>
                  )}
                </div>
                <p className={`text-sm ${
                  improvement.achieved ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {improvement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface MetricCardProps {
  metric: AdvancedMetric;
  index: number;
}

function MetricCard({ metric, index }: MetricCardProps) {
  const colorClasses = {
    green: 'from-green-50 to-green-100 border-green-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
    red: 'from-red-50 to-red-100 border-red-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[metric.color]} rounded-2xl p-6 border`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{metric.icon}</span>
        <h4 className="font-medium text-gray-700 text-sm">{metric.label}</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
          <span className="text-sm text-gray-600">{metric.unit}</span>
        </div>
        
        {metric.comparison && (
          <p className="text-xs text-gray-500">{metric.comparison}</p>
        )}
      </div>
    </motion.div>
  );
}

interface MilestoneCardProps {
  milestone: {
    name: string;
    days: number;
    icon: string;
    achieved: boolean;
    progress: number;
  };
}

function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all duration-200 ${
        milestone.achieved 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="text-center space-y-2">
        <span className="text-2xl block">{milestone.icon}</span>
        <h4 className={`font-medium text-sm ${
          milestone.achieved ? 'text-green-800' : 'text-gray-600'
        }`}>
          {milestone.name}
        </h4>
        
        <div className="relative w-12 h-12 mx-auto">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={milestone.achieved ? '#e5e7eb' : '#f3f4f6'}
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={milestone.achieved ? '#10b981' : '#6b7280'}
              strokeWidth="3"
              strokeDasharray={`${(milestone.progress / 100) * 126} 126`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-semibold ${
              milestone.achieved ? 'text-green-600' : 'text-gray-600'
            }`}>
              {Math.round(milestone.progress)}%
            </span>
          </div>
        </div>
        
        {milestone.achieved && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Erreicht
          </span>
        )}
      </div>
    </motion.div>
  );
} 
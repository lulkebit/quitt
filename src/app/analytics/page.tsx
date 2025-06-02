'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSmokingStatistics, SmokingStatistics } from '@/lib/smokingStats';
import PageLayout from '@/components/shared/PageLayout';
import StatCard from '@/components/shared/StatCard';
import DataVisualization from '@/components/DataVisualization';
import CalendarView from '@/components/CalendarView';
import AdvancedStats from '@/components/AdvancedStats';

type ViewMode = 'charts' | 'calendar' | 'advanced';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SmokingStatistics | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('charts');

  useEffect(() => {
    if (user?.smokingData) {
      const statistics = calculateSmokingStatistics(user.smokingData);
      setStats(statistics);
    }
  }, [user]);

  if (!stats) {
    return null;
  }

  const analyticsIcon = (
    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
  );

  return (
    <PageLayout 
      title="Analytics" 
      showBackButton={true}
      navigationIcon={analyticsIcon}
    >
      {/* Header */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Deine Fortschritts-Analytics
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Detaillierte Einblicke in deinen Weg zu einem rauchfreien Leben
        </p>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div 
        variants={fadeInUp}
        className="flex justify-center mb-8"
      >
        <div className="flex gap-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <motion.button
            onClick={() => setViewMode('charts')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              viewMode === 'charts'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Diagramme
          </motion.button>
          <motion.button
            onClick={() => setViewMode('calendar')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              viewMode === 'calendar'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Kalender
          </motion.button>
          <motion.button
            onClick={() => setViewMode('advanced')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              viewMode === 'advanced'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Erweitert
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          title="Tage rauchfrei"
          value={stats.daysSinceQuit.toString()}
          icon="🗓️"
          color="green"
        />
        <StatCard
          title="Geld gespart"
          value={`${stats.moneySaved.toFixed(0)}€`}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Zigaretten vermieden"
          value={stats.cigarettesNotSmoked.toLocaleString('de-DE')}
          icon="🚭"
          color="purple"
        />
        <StatCard
          title="Gesundheit"
          value={`${stats.healthImprovements.filter(h => h.achieved).length}/${stats.healthImprovements.length}`}
          icon="❤️"
          color="red"
        />
      </motion.div>

      {/* Main Content Area */}
      {user?.smokingData && (
        <AnimatePresence mode="wait">
          {viewMode === 'charts' ? (
            <motion.div
              key="charts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DataVisualization smokingData={user.smokingData} stats={stats} />
            </motion.div>
          ) : viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView smokingData={user.smokingData} stats={stats} />
            </motion.div>
          ) : (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedStats smokingData={user.smokingData} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </PageLayout>
  );
} 
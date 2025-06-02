'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSmokingStatistics, SmokingStatistics } from '@/lib/smokingStats';
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SmokingStatistics | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('charts');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.smokingData) {
      const statistics = calculateSmokingStatistics(user.smokingData);
      setStats(statistics);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="sticky top-0 z-50 backdrop-blur-apple bg-white/80 border-b border-gray-200/50"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.button
                onClick={() => router.push('/')}
                className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </motion.button>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Analytics
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                {user.firstName}
              </span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Ihre Fortschritts-Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Detaillierte Einblicke in Ihren Weg zu einem rauchfreien Leben
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
          <SummaryCard
            title="Tage rauchfrei"
            value={stats.daysSinceQuit.toString()}
            icon="🗓️"
            color="green"
          />
          <SummaryCard
            title="Geld gespart"
            value={`${stats.moneySaved.toFixed(0)}€`}
            icon="💰"
            color="blue"
          />
          <SummaryCard
            title="Zigaretten vermieden"
            value={stats.cigarettesNotSmoked.toLocaleString('de-DE')}
            icon="🚭"
            color="purple"
          />
          <SummaryCard
            title="Gesundheit"
            value={`${stats.healthImprovements.filter(h => h.achieved).length}/${stats.healthImprovements.length}`}
            icon="❤️"
            color="red"
          />
        </motion.div>

        {/* Main Content Area */}
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
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView smokingData={user.smokingData} stats={stats} />
            </motion.div>
          ) : (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedStats smokingData={user.smokingData} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'red';
}

function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  const colorClasses = {
    green: 'from-green-50 to-green-100 border-green-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    red: 'from-red-50 to-red-100 border-red-200',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-medium text-gray-700 text-sm">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
} 
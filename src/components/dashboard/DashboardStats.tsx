'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SmokingStatistics, formatCurrency, formatNumber } from '@/lib/smokingStats';
import StatCard from '@/components/shared/StatCard';

interface DashboardStatsProps {
  stats: SmokingStatistics;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const router = useRouter();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={fadeInUp}
        className="text-center py-8"
      >
        <motion.h2 
          className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-4"
          variants={fadeInUp}
        >
          {stats.daysSinceQuit}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 mb-2"
          variants={fadeInUp}
        >
          Tag{stats.daysSinceQuit !== 1 ? 'e' : ''} rauchfrei
        </motion.p>
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          icon={<MoneyIcon />}
          title="Geld gespart"
          value={formatCurrency(stats.moneySaved)}
          color="green"
          onClick={() => router.push('/analytics')}
        />
        <StatCard
          icon={<CigaretteIcon />}
          title="Zigaretten vermieden"
          value={formatNumber(stats.cigarettesNotSmoked)}
          color="blue"
          onClick={() => router.push('/analytics')}
        />
        <StatCard
          icon={<HeartIcon />}
          title="Gesundheitsfortschritt"
          value={`${stats.healthImprovements.filter(h => h.achieved).length}/${stats.healthImprovements.length}`}
          color="purple"
          subtitle="Verbesserungen erreicht"
        />
      </motion.div>

      {/* Next Milestone */}
      {stats.nextMilestone && (
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nächster Meilenstein</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-xl font-semibold text-green-600 mb-1">
                {stats.nextMilestone.name}
              </p>
              <p className="text-gray-600 text-sm">
                {stats.nextMilestone.description}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className="text-3xl font-bold text-gray-900">
                {stats.nextMilestone.daysRemaining}
              </p>
              <p className="text-sm text-gray-500">
                Tag{stats.nextMilestone.daysRemaining !== 1 ? 'e' : ''} verbleibend
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${
                    ((stats.nextMilestone.daysRequired - stats.nextMilestone.daysRemaining) /
                      stats.nextMilestone.daysRequired) * 100
                  }%`
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.button
          onClick={() => router.push('/analytics')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-left border border-blue-200/50 hover:border-blue-300/50 transition-all duration-200"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Detaillierte Analytics</h3>
          <p className="text-sm text-gray-600">Tiefe Einblicke in deinen Fortschritt</p>
        </motion.button>

        <motion.button
          onClick={() => router.push('/gamification')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-left border border-purple-200/50 hover:border-purple-300/50 transition-all duration-200"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Erfolge & Belohnungen</h3>
          <p className="text-sm text-gray-600">Level, Abzeichen und Belohnungen</p>
        </motion.button>

        <motion.button
          onClick={() => router.push('/cravings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 text-left border border-red-200/50 hover:border-red-300/50 transition-all duration-200"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verlangen Management</h3>
          <p className="text-sm text-gray-600">Bewältigungsstrategien & Tracking</p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Icons
function MoneyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
}

function CigaretteIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
} 
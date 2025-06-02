'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  calculateSmokingStatistics, 
  formatCurrency, 
  formatNumber, 
  getMotivationalMessage,
  SmokingStatistics 
} from '@/lib/smokingStats';
import CravingDashboard from '@/components/CravingDashboard';

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SmokingStatistics | null>(null);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Apple Style */}
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
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Quitt
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                Hallo, {user.firstName}
              </span>
              <motion.button
                onClick={() => router.push('/settings')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                title="Einstellungen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Abmelden
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <AnimatePresence>
          {stats && (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Hero Section */}
              <motion.div
                variants={fadeInUp}
                className="text-center py-12"
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
                <motion.p 
                  className="text-gray-500 max-w-md mx-auto text-balance"
                  variants={fadeInUp}
                >
                  {getMotivationalMessage(stats.daysSinceQuit)}
                </motion.p>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <StatCard
                  icon={<MoneyIcon />}
                  title="Geld gespart"
                  value={formatCurrency(stats.moneySaved)}
                  color="green"
                />
                <StatCard
                  icon={<CigaretteIcon />}
                  title="Zigaretten vermieden"
                  value={formatNumber(stats.cigarettesNotSmoked)}
                  color="blue"
                />
                <StatCard
                  icon={<HeartIcon />}
                  title="Jahre geraucht"
                  value={stats.yearsSmoked.toString()}
                  color="purple"
                />
                <StatCard
                  icon={<TrendIcon />}
                  title="Versuche zuvor"
                  value={user.smokingData.previousQuitAttempts.toString()}
                  color="orange"
                />
              </motion.div>

              {/* Next Milestone */}
              {stats.nextMilestone && (
                <motion.div
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow duration-300"
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

              {/* Health Improvements */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Gesundheitliche Verbesserungen</h3>
                <div className="space-y-4">
                  {stats.healthImprovements.slice(0, 6).map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex items-center group"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                        improvement.achieved 
                          ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {improvement.achieved ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-3 h-3 bg-current rounded-full"></div>
                        )}
                      </div>
                      <div className={`flex-1 ${improvement.achieved ? 'text-gray-900' : 'text-gray-500'}`}>
                        <p className="font-medium text-sm">{improvement.timeframe}</p>
                        <p className="text-sm text-gray-600">{improvement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Craving Management */}
              <CravingDashboard />

              {/* Motivation Section */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Ihre Motivation</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Gründe für das Aufhören:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.smokingData.reasonsToQuit.map((reason, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors duration-200"
                        >
                          {reason}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {user.smokingData.healthGoals && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Ihre Gesundheitsziele:</p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {user.smokingData.healthGoals}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Motivationslevel:</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: level * 0.1, duration: 0.3 }}
                          className={`w-8 h-8 rounded-full transition-all duration-300 ${
                            level <= user.smokingData.motivationLevel
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Component for statistics cards
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
      </div>
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

function TrendIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

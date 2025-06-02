'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateSmokingStatistics, SmokingStatistics, getMotivationalMessage } from '@/lib/smokingStats';
import PageLayout from '@/components/shared/PageLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import CravingDashboard from '@/components/CravingDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SmokingStatistics | null>(null);

  useEffect(() => {
    if (user?.smokingData) {
      const statistics = calculateSmokingStatistics(user.smokingData);
      setStats(statistics);
    }
  }, [user]);

  return (
    <PageLayout title="Quitt">
      {stats && (
        <div className="space-y-8">
          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {getMotivationalMessage(stats.daysSinceQuit)}
            </p>
          </motion.div>

          {/* Main Dashboard Stats */}
          <DashboardStats stats={stats} />

          {/* Health Improvements Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Gesundheitliche Verbesserungen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.healthImprovements.slice(0, 4).map((improvement, index) => (
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

          {/* Craving Management Quick Access */}
          <CravingDashboard />

          {/* Motivation Section */}
          {user?.smokingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Deine Motivation</h3>
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
                    <p className="text-sm font-medium text-gray-600 mb-3">Deine Gesundheitsziele:</p>
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
          )}
        </div>
      )}
    </PageLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Brain, Zap, BarChart3 } from 'lucide-react';
import { useCravings } from '@/lib/hooks/useCravings';
import PageLayout from '@/components/shared/PageLayout';
import StatCard from '@/components/shared/StatCard';
import CravingTracker from '@/components/CravingTracker';
import CopingStrategies from '@/components/CopingStrategies';
import DistractionActivities from '@/components/DistractionActivities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

export default function CravingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { cravings, stats, reportCraving, submitting } = useCravings();
  
  const [activeTab, setActiveTab] = useState('tracker');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const cravingIcon = (
    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
      <AlertTriangle className="w-5 h-5 text-white" />
    </div>
  );

  const tabs = [
    { id: 'tracker', label: 'Verlangen melden', icon: AlertTriangle },
    { id: 'strategies', label: 'Bewältigungsstrategien', icon: Brain },
    { id: 'activities', label: 'Ablenkungsaktivitäten', icon: Zap },
    { id: 'history', label: 'Verlangen Historie', icon: BarChart3 }
  ];

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 text-green-700';
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <PageLayout 
      title="Verlangen Management" 
      showBackButton={true}
      navigationIcon={cravingIcon}
    >
      <motion.div
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header Stats */}
        {stats && (
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatCard
              icon="📊"
              title="Heute"
              value={stats.cravingsToday.toString()}
              color="blue"
            />
            <StatCard
              icon="🎯"
              title="Ø Intensität"
              value={stats.avgIntensityToday.toFixed(1)}
              color="orange"
            />
            <StatCard
              icon="📅"
              title="Diese Woche"
              value={stats.cravingsThisWeek.toString()}
              color="purple"
            />
            <StatCard
              icon="🔥"
              title="Häufigster Auslöser"
              value={stats.topTriggers.length > 0 ? stats.topTriggers[0].count.toString() : '0'}
              color="red"
            />
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200/60"
        >
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                <div className="max-w-2xl mx-auto">
                  <CravingTracker onReport={reportCraving} submitting={submitting} />
                </div>
              </div>
            )}
            
            {activeTab === 'strategies' && (
              <CopingStrategies />
            )}
            
            {activeTab === 'activities' && (
              <DistractionActivities />
            )}
            
            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Verlangen Historie</h3>
                {cravings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📈</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Verlangen bisher</h3>
                    <p className="text-gray-600">
                      Wenn du das nächste Mal Verlangen hast, melde es hier um es zu verfolgen.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cravings.slice(0, 10).map((craving) => (
                      <motion.div
                        key={craving._id?.toString() || Math.random()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(craving.intensity)}`}>
                              Intensität {craving.intensity}/10
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTime(new Date(craving.timestamp))}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {craving.trigger && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {craving.trigger}
                              </span>
                            )}
                            {craving.situation && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {craving.situation}
                              </span>
                            )}
                            {craving.emotion && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                {craving.emotion}
                              </span>
                            )}
                            {craving.location && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {craving.location}
                              </span>
                            )}
                          </div>
                          {craving.notes && (
                            <p className="text-sm text-gray-600 mt-2">{craving.notes}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
} 
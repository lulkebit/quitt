'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Brain, Zap, BarChart3, ArrowLeft } from 'lucide-react';
import { useCravings } from '@/lib/hooks/useCravings';
import CravingTracker from '@/components/CravingTracker';
import CopingStrategies from '@/components/CopingStrategies';
import DistractionActivities from '@/components/DistractionActivities';

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

export default function CravingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cravings, stats, reportCraving, submitting, fetchCravings } = useCravings();
  
  const [activeTab, setActiveTab] = useState('tracker');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Verlangen Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Header Stats */}
          {stats && (
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.cravingsToday}</div>
                  <div className="text-sm text-gray-500 mt-1">Heute</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.avgIntensityToday.toFixed(1)}</div>
                  <div className="text-sm text-gray-500 mt-1">Ø Intensität</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.cravingsThisWeek}</div>
                  <div className="text-sm text-gray-500 mt-1">Diese Woche</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.topTriggers.length > 0 ? stats.topTriggers[0].count : 0}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Häufigster Auslöser</div>
                </div>
              </div>
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
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Noch keine Verlangen gemeldet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cravings.map((craving) => (
                        <motion.div
                          key={craving._id?.toString()}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIntensityColor(craving.intensity)}`}>
                                {craving.intensity}/10
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTime(new Date(craving.timestamp))}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {craving.situation && (
                              <div>
                                <span className="font-medium text-gray-700">Situation:</span>
                                <p className="text-gray-600">{craving.situation}</p>
                              </div>
                            )}
                            {craving.trigger && (
                              <div>
                                <span className="font-medium text-gray-700">Auslöser:</span>
                                <p className="text-gray-600">{craving.trigger}</p>
                              </div>
                            )}
                            {craving.emotion && (
                              <div>
                                <span className="font-medium text-gray-700">Gefühl:</span>
                                <p className="text-gray-600">{craving.emotion}</p>
                              </div>
                            )}
                            {craving.location && (
                              <div>
                                <span className="font-medium text-gray-700">Ort:</span>
                                <p className="text-gray-600">{craving.location}</p>
                              </div>
                            )}
                          </div>
                          
                          {craving.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="font-medium text-gray-700 text-sm">Notizen:</span>
                              <p className="text-gray-600 text-sm mt-1">{craving.notes}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
} 
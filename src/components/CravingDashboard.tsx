'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { useCravings } from '@/lib/hooks/useCravings';
import CravingTracker from './CravingTracker';
import { useRouter } from 'next/navigation';

interface CravingDashboardProps {
  className?: string;
}

export default function CravingDashboard({ className = '' }: CravingDashboardProps) {
  const { stats, reportCraving, submitting } = useCravings();
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Verlangen Management</h3>
            <p className="text-sm text-gray-500">Heute und diese Woche</p>
          </div>
        </div>
        <motion.button
          onClick={() => router.push('/cravings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          title="Vollständige Verlangen-Ansicht"
        >
          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </motion.button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">
              {stats.cravingsToday}
            </div>
            <div className="text-xs text-gray-500 mt-1">Heute</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">
              {stats.avgIntensityToday.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ø Intensität</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">
              {stats.cravingsThisWeek}
            </div>
            <div className="text-xs text-gray-500 mt-1">Diese Woche</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <CravingTracker onReport={reportCraving} submitting={submitting} />
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => router.push('/cravings?tab=strategies')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl text-sm font-medium hover:shadow-sm transition-all duration-300"
          >
            Bewältigungsstrategien
          </motion.button>
          <motion.button
            onClick={() => router.push('/cravings?tab=activities')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-xl text-sm font-medium hover:shadow-sm transition-all duration-300"
          >
            Ablenkungsaktivitäten
          </motion.button>
        </div>
      </div>

      {/* Top Trigger */}
      {stats && stats.topTriggers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Häufigster Auslöser</p>
              <p className="text-lg font-semibold text-gray-900">{stats.topTriggers[0]._id}</p>
            </div>
            <div className="flex items-center text-gray-500">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">{stats.topTriggers[0].count}x</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 
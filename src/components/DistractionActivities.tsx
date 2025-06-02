'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, Filter, Clock } from 'lucide-react';
import { DISTRACTION_ACTIVITIES, getDistractionActivitiesByLocation, getQuickActivities } from '@/lib/cravingData';
import { DistractionActivity } from '@/types/user';

interface DistractionActivitiesProps {
  className?: string;
}

export default function DistractionActivities({ className = '' }: DistractionActivitiesProps) {
  const [activities, setActivities] = useState<DistractionActivity[]>([]);
  const [filter, setFilter] = useState<'all' | 'quick' | 'home' | 'anywhere'>('quick');
  const [selectedActivity, setSelectedActivity] = useState<DistractionActivity | null>(null);

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = () => {
    let filteredActivities: DistractionActivity[] = [];
    
    switch (filter) {
      case 'quick':
        filteredActivities = getQuickActivities();
        break;
      case 'home':
        filteredActivities = getDistractionActivitiesByLocation('home');
        break;
      case 'anywhere':
        filteredActivities = getDistractionActivitiesByLocation('anywhere');
        break;
      default:
        filteredActivities = DISTRACTION_ACTIVITIES;
    }
    
    // Shuffle and limit to 6 activities
    const shuffled = [...filteredActivities].sort(() => Math.random() - 0.5);
    setActivities(shuffled.slice(0, 6));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'creative':
        return '🎨';
      case 'physical':
        return '💪';
      case 'social':
        return '👥';
      case 'mindful':
        return '🧘';
      case 'productive':
        return '✅';
      default:
        return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creative':
        return 'from-pink-400 to-rose-500';
      case 'physical':
        return 'from-green-400 to-emerald-500';
      case 'social':
        return 'from-blue-400 to-indigo-500';
      case 'mindful':
        return 'from-purple-400 to-violet-500';
      case 'productive':
        return 'from-orange-400 to-amber-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'home':
        return '🏠';
      case 'outdoor':
        return '🌳';
      case 'anywhere':
        return '📍';
      default:
        return '📍';
    }
  };

  const startActivity = (activity: DistractionActivity) => {
    setSelectedActivity(activity);
    // Here you could add timer functionality or tracking
  };

  const filterButtons = [
    { key: 'quick', label: 'Schnell', icon: Zap },
    { key: 'home', label: 'Zuhause', icon: MapPin },
    { key: 'anywhere', label: 'Überall', icon: Filter },
    { key: 'all', label: 'Alle', icon: Clock }
  ];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ablenkungsaktivitäten</h3>
            <p className="text-sm text-gray-500">Schnelle Hilfe bei Verlangen</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {filterButtons.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => setFilter(key as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === key
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {activities.map((activity, index) => (
            <motion.div
              key={`${filter}-${activity.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative group cursor-pointer"
              onClick={() => startActivity(activity)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(activity.category)} rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{getLocationIcon(activity.location)}</span>
                    <Clock className="w-3 h-3" />
                    <span>{activity.duration}m</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{activity.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-full mt-4 py-2 bg-gradient-to-r ${getCategoryColor(activity.category)} text-white rounded-lg text-sm font-medium text-center transition-all duration-300`}
                >
                  Jetzt starten
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Lade Aktivitäten...</p>
        </div>
      )}

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{getCategoryIcon(selectedActivity.category)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedActivity.title}</h3>
                <p className="text-gray-600 mb-6">{selectedActivity.description}</p>
                
                <div className="flex items-center justify-center space-x-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedActivity.duration} Minuten</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedActivity.location === 'home' ? 'Zuhause' : selectedActivity.location === 'outdoor' ? 'Draußen' : 'Überall'}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedActivity(null)}
                  className={`w-full py-4 bg-gradient-to-r ${getCategoryColor(selectedActivity.category)} text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300`}
                >
                  Aktivität starten
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  isAfter,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { SmokingData } from '@/types/user';
import { SmokingStatistics } from '@/lib/smokingStats';

interface CalendarViewProps {
  smokingData: SmokingData;
  stats: SmokingStatistics;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSmokeFree: boolean;
  daysSinceQuit: number;
  streak: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.02
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export default function CalendarView({ smokingData, stats }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const quitDate = useMemo(() => new Date(smokingData.quitDate), [smokingData.quitDate]);

  // Generate calendar data for current month
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(date => {
      const daysSinceQuit = Math.max(0, Math.floor(
        (date.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)
      ));

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        isSmokeFree: !isBefore(date, quitDate) && !isAfter(date, new Date()),
        daysSinceQuit,
        streak: daysSinceQuit > 0 ? daysSinceQuit : 0,
      };
    });
  }, [currentDate, quitDate]);

  // Generate year overview data
  const yearData = useMemo(() => {
    const year = currentDate.getFullYear();
    const months = [];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      const smokeFreeDays = daysInMonth.filter(date => 
        !isBefore(date, quitDate) && !isAfter(date, new Date())
      ).length;

      months.push({
        date: monthDate,
        name: format(monthDate, 'MMM', { locale: de }),
        smokeFreeDays,
        totalDays: daysInMonth.length,
        percentage: (smokeFreeDays / daysInMonth.length) * 100,
      });
    }

    return months;
  }, [currentDate, quitDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const getDayColor = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return 'text-gray-300';
    if (day.isToday && day.isSmokeFree) return 'bg-green-500 text-white';
    if (day.isToday) return 'bg-gray-200 text-gray-900';
    if (day.isSmokeFree) return 'bg-green-100 text-green-800 border-green-200';
    if (isBefore(day.date, quitDate)) return 'bg-red-50 text-red-600 border-red-100';
    return 'text-gray-400';
  };

  const getDayStyles = (day: CalendarDay) => {
    const baseStyles = 'w-full h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 border';
    
    if (!day.isCurrentMonth) {
      return `${baseStyles} text-gray-300 border-transparent`;
    }
    
    if (day.isToday && day.isSmokeFree) {
      return `${baseStyles} bg-green-500 text-white border-green-500 shadow-md`;
    }
    
    if (day.isToday) {
      return `${baseStyles} bg-blue-500 text-white border-blue-500 shadow-md`;
    }
    
    if (day.isSmokeFree) {
      return `${baseStyles} bg-green-100 text-green-800 border-green-200 hover:bg-green-200`;
    }
    
    if (isBefore(day.date, quitDate)) {
      return `${baseStyles} bg-red-50 text-red-600 border-red-100`;
    }
    
    return `${baseStyles} text-gray-400 border-gray-100 hover:bg-gray-50`;
  };

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Kalender-Übersicht
        </h2>
        <p className="text-gray-600">
          Ihre rauchfreien Tage im Überblick
        </p>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div variants={fadeInUp} className="flex justify-center">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <motion.button
            onClick={() => setViewMode('month')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monatsansicht
          </motion.button>
          <motion.button
            onClick={() => setViewMode('year')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'year'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Jahresansicht
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'month' ? (
          <motion.div
            key="month"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => navigateMonth('prev')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <h3 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy', { locale: de })}
              </h3>

              <motion.button
                onClick={() => navigateMonth('next')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="h-10 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-7 gap-2"
            >
              {calendarData.map((day, index) => (
                <motion.div
                  key={day.date.toISOString()}
                  variants={scaleIn}
                  className={getDayStyles(day)}
                  title={
                    day.isSmokeFree 
                      ? `Rauchfrei seit ${day.daysSinceQuit} Tagen`
                      : isBefore(day.date, quitDate)
                      ? 'Vor dem Rauchstopp'
                      : 'Zukünftiger Tag'
                  }
                >
                  {format(day.date, 'd')}
                  {day.isSmokeFree && day.daysSinceQuit % 7 === 0 && day.daysSinceQuit > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-sm text-gray-600">Rauchfrei</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Heute (rauchfrei)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-100 rounded"></div>
                <span className="text-sm text-gray-600">Vor Rauchstopp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Wochen-Meilenstein</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="year"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            {/* Year Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentDate.getFullYear()}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Jahresübersicht der rauchfreien Tage
              </p>
            </div>

            {/* Year Grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {yearData.map((month, index) => (
                <motion.div
                  key={month.name}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setCurrentDate(month.date);
                    setViewMode('month');
                  }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-green-200 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {month.name}
                    </h4>
                    
                    {/* Progress Circle */}
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#f3f4f6"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeDasharray={`${(month.percentage / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {Math.round(month.percentage)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>{month.smokeFreeDays}/{month.totalDays} Tage</p>
                      <p className="text-green-600 font-medium">rauchfrei</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Year Summary */}
            <motion.div 
              variants={fadeInUp}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {yearData.reduce((acc, month) => acc + month.smokeFreeDays, 0)}
                  </p>
                  <p className="text-sm text-green-700">Rauchfreie Tage</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(yearData.reduce((acc, month) => acc + month.percentage, 0) / 12)}%
                  </p>
                  <p className="text-sm text-blue-700">Durchschnitt</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.floor(stats.daysSinceQuit / 7)}
                  </p>
                  <p className="text-sm text-purple-700">Wochen rauchfrei</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h4 className="font-semibold text-green-800">Aktuelle Serie</h4>
          </div>
          <p className="text-3xl font-bold text-green-900 mb-1">
            {stats.daysSinceQuit}
          </p>
          <p className="text-green-700 text-sm">Tage in Folge</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-blue-800">Nächster Meilenstein</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900 mb-1">
            {stats.nextMilestone ? `${stats.nextMilestone.daysRemaining}` : '🎉'}
          </p>
          <p className="text-blue-700 text-sm">
            {stats.nextMilestone ? `Tage bis ${stats.nextMilestone.name}` : 'Alle erreicht!'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h4 className="font-semibold text-purple-800">Erfolgsrate</h4>
          </div>
          <p className="text-3xl font-bold text-purple-900 mb-1">
            {Math.round((stats.daysSinceQuit / Math.max(stats.daysSinceQuit + 1, 30)) * 100)}%
          </p>
          <p className="text-purple-700 text-sm">der letzten 30 Tage</p>
        </div>
      </motion.div>
    </motion.div>
  );
} 
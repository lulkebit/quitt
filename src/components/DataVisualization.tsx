'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { SmokingStatistics } from '@/lib/smokingStats';
import { SmokingData } from '@/types/user';

interface DataVisualizationProps {
  smokingData: SmokingData;
  stats: SmokingStatistics;
}

type TimeRange = 'week' | 'month' | '3months' | 'year';
type ChartType = 'savings' | 'cigarettes' | 'health' | 'overview';

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

export default function DataVisualization({ smokingData, stats }: DataVisualizationProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  const [selectedChart, setSelectedChart] = useState<ChartType>('overview');

  // Generate historical data based on quit date and current statistics
  const chartData = useMemo(() => {
    const quitDate = new Date(smokingData.quitDate);
    const today = new Date();
    const costPerCigarette = smokingData.cigarettePrice / smokingData.cigarettesPerPack;
    
    let interval: Date[];
    let formatString: string;
    
    switch (selectedTimeRange) {
      case 'week':
        interval = eachDayOfInterval({
          start: subDays(today, 7),
          end: today
        });
        formatString = 'EEE';
        break;
      case 'month':
        interval = eachDayOfInterval({
          start: subDays(today, 30),
          end: today
        });
        formatString = 'dd.MM';
        break;
      case '3months':
        interval = eachWeekOfInterval({
          start: subMonths(today, 3),
          end: today
        });
        formatString = 'dd.MM';
        break;
      case 'year':
        interval = eachMonthOfInterval({
          start: subMonths(today, 12),
          end: today
        });
        formatString = 'MMM';
        break;
      default:
        interval = eachDayOfInterval({
          start: subDays(today, 30),
          end: today
        });
        formatString = 'dd.MM';
    }

    return interval.map(date => {
      const daysSinceQuit = Math.max(0, Math.floor(
        (date.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)
      ));
      
      const cigarettesAvoided = daysSinceQuit * smokingData.cigarettesPerDay;
      const moneySaved = cigarettesAvoided * costPerCigarette;
      
      // Health improvements progress (0-100%)
      const healthProgress = Math.min(100, (daysSinceQuit / 365) * 100);
      
      return {
        date: format(date, formatString, { locale: de }),
        fullDate: format(date, 'dd.MM.yyyy', { locale: de }),
        moneySaved: moneySaved,
        cigarettesAvoided: cigarettesAvoided,
        healthProgress: healthProgress,
        daysSinceQuit: daysSinceQuit,
      };
    }).filter(data => data.daysSinceQuit >= 0);
  }, [selectedTimeRange, smokingData, stats]);

  // Weekly/Monthly report data
  const reportData = useMemo(() => {
    const now = new Date();
    const weekAgo = subWeeks(now, 1);
    const monthAgo = subMonths(now, 1);
    const costPerCigarette = smokingData.cigarettePrice / smokingData.cigarettesPerPack;
    
    const weeklyData = {
      period: 'Diese Woche',
      cigarettesAvoided: 7 * smokingData.cigarettesPerDay,
      moneySaved: 7 * smokingData.cigarettesPerDay * costPerCigarette,
      healthGain: '7 Tage ohne Giftstoffe',
    };
    
    const monthlyData = {
      period: 'Dieser Monat',
      cigarettesAvoided: 30 * smokingData.cigarettesPerDay,
      moneySaved: 30 * smokingData.cigarettesPerDay * costPerCigarette,
      healthGain: 'Deutlich bessere Lungenkapazität',
    };
    
    return { weekly: weeklyData, monthly: monthlyData };
  }, [smokingData]);

  // Health trend data
  const healthTrendData = useMemo(() => {
    return stats.healthImprovements.map((improvement, index) => ({
      name: improvement.timeframe,
      achievement: improvement.achieved ? 100 : 0,
      description: improvement.description,
      color: improvement.achieved ? '#10b981' : '#e5e7eb',
    }));
  }, [stats.healthImprovements]);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 'week', label: '7 Tage' },
    { value: 'month', label: '30 Tage' },
    { value: '3months', label: '3 Monate' },
    { value: 'year', label: '1 Jahr' },
  ];

  const chartOptions: { value: ChartType; label: string; icon: string }[] = [
    { value: 'overview', label: 'Übersicht', icon: '📊' },
    { value: 'savings', label: 'Ersparnisse', icon: '💰' },
    { value: 'cigarettes', label: 'Zigaretten', icon: '🚭' },
    { value: 'health', label: 'Gesundheit', icon: '❤️' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Euro') || entry.name.includes('Geld') 
                ? `${entry.value.toFixed(2)}€` 
                : entry.name.includes('Prozent') || entry.name.includes('Gesundheit')
                ? `${entry.value.toFixed(1)}%`
                : `${entry.value.toLocaleString('de-DE')}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'savings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}€`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="moneySaved"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#savingsGradient)"
                name="Geld gespart"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'cigarettes':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="cigarettesAvoided" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Zigaretten vermieden"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'health':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="healthProgress"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                name="Gesundheitsfortschritt"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default: // overview
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}€`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="moneySaved"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Geld gespart (€)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cigarettesAvoided"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Zigaretten vermieden"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

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
          Datenvisualisierung
        </h2>
        <p className="text-gray-600">
          Verfolgen Sie Ihren Fortschritt mit detaillierten Einblicken
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Chart Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Diagramm-Typ
            </label>
            <div className="flex flex-wrap gap-2">
              {chartOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSelectedChart(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedChart === option.value
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.icon} {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Time Range Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Zeitraum
            </label>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {timeRangeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSelectedTimeRange(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTimeRange === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {chartOptions.find(opt => opt.value === selectedChart)?.label} - 
            {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}
          </h3>
        </div>
        {renderChart()}
      </motion.div>

      {/* Weekly/Monthly Reports */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Wöchentlicher Report"
          data={reportData.weekly}
          color="blue"
          icon="📅"
        />
        <ReportCard
          title="Monatlicher Report"
          data={reportData.monthly}
          color="green"
          icon="📊"
        />
      </motion.div>

      {/* Health Trends */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gesundheitstrends
          </h3>
          <p className="text-gray-600 text-sm">
            Ihre gesundheitlichen Verbesserungen im Überblick
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthTrendData.map((item, index) => (
            <HealthTrendCard
              key={index}
              title={item.name}
              description={item.description}
              achieved={item.achievement === 100}
              color={item.color}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ReportCardProps {
  title: string;
  data: {
    period: string;
    cigarettesAvoided: number;
    moneySaved: number;
    healthGain: string;
  };
  color: 'blue' | 'green';
  icon: string;
}

function ReportCard({ title, data, color, icon }: ReportCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
    green: {
      bg: 'from-green-50 to-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
    },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color].bg} rounded-2xl p-6 border ${colorClasses[color].border}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className={`text-lg font-semibold ${colorClasses[color].text}`}>
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">Zigaretten vermieden</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.cigarettesAvoided.toLocaleString('de-DE')}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Geld gespart</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.moneySaved.toFixed(2)}€
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Gesundheitsgewinn</p>
          <p className="text-sm font-medium text-gray-800">
            {data.healthGain}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface HealthTrendCardProps {
  title: string;
  description: string;
  achieved: boolean;
  color: string;
}

function HealthTrendCard({ title, description, achieved, color }: HealthTrendCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all duration-200 ${
        achieved 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            achieved ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
        <h4 className={`font-medium ${
          achieved ? 'text-green-800' : 'text-gray-600'
        }`}>
          {title}
        </h4>
      </div>
      <p className={`text-sm ${
        achieved ? 'text-green-700' : 'text-gray-500'
      }`}>
        {description}
      </p>
      {achieved && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Erreicht
          </span>
        </div>
      )}
    </motion.div>
  );
} 
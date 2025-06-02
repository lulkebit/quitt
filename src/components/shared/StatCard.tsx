'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  onClick?: () => void;
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

export default function StatCard({ 
  icon, 
  title, 
  value, 
  color, 
  subtitle,
  onClick 
}: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const CardComponent = onClick ? motion.button : motion.div;

  return (
    <CardComponent
      variants={scaleIn}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-all duration-300 w-full text-left"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </CardComponent>
  );
} 
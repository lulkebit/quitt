'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VirtualReward } from '@/types/user';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateSmokingStatistics, formatCurrency } from '@/lib/smokingStats';

interface VirtualRewardCardProps {
  reward: VirtualReward;
  availableMoney: number;
  userLevel: number;
  onPurchase: (rewardId: string) => void;
  disabled?: boolean;
}

function VirtualRewardCard({ 
  reward, 
  availableMoney, 
  userLevel, 
  onPurchase, 
  disabled = false 
}: VirtualRewardCardProps) {
  const canAfford = availableMoney >= reward.cost;
  const hasRequiredLevel = !reward.requiredLevel || userLevel >= reward.requiredLevel;
  const canPurchase = canAfford && hasRequiredLevel && reward.isAvailable && !reward.isPurchased;

  const getCategoryColor = (category: VirtualReward['category']) => {
    switch (category) {
      case 'treat':
        return {
          bg: 'from-orange-50 to-red-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          icon: 'text-orange-600'
        };
      case 'experience':
        return {
          bg: 'from-purple-50 to-pink-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          icon: 'text-purple-600'
        };
      case 'item':
        return {
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: 'text-blue-600'
        };
      case 'upgrade':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: 'text-green-600'
        };
      default:
        return {
          bg: 'from-gray-50 to-slate-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-600'
        };
    }
  };

  const colors = getCategoryColor(reward.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ 
        scale: reward.isPurchased ? 1 : 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      className={`
        relative p-4 rounded-2xl border-2 transition-all duration-300
        ${reward.isPurchased 
          ? 'bg-gray-50 border-gray-200 opacity-75' 
          : `bg-gradient-to-br ${colors.bg} ${colors.border} hover:shadow-lg`
        }
        ${disabled ? 'pointer-events-none opacity-50' : ''}
      `}
    >
      {/* Purchase Indicator */}
      {reward.isPurchased && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Level Requirement Badge */}
      {reward.requiredLevel && (
        <div className="absolute top-2 left-2">
          <div className={`
            px-2 py-1 rounded-md text-xs font-medium
            ${hasRequiredLevel 
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }
          `}>
            Level {reward.requiredLevel}
          </div>
        </div>
      )}

      <div className="text-center">
        {/* Reward Icon */}
        <div className="text-4xl mb-3">{reward.icon}</div>

        {/* Reward Info */}
        <h3 className={`font-semibold text-lg mb-2 ${reward.isPurchased ? 'text-gray-500' : colors.text}`}>
          {reward.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
          {reward.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className={`text-2xl font-bold ${reward.isPurchased ? 'text-gray-400' : colors.text}`}>
            {formatCurrency(reward.cost)}
          </div>
          <div className="text-xs text-gray-500">
            gesparte Euros
          </div>
        </div>

        {/* Purchase Button */}
        <motion.button
          whileHover={canPurchase ? { scale: 1.02 } : {}}
          whileTap={canPurchase ? { scale: 0.98 } : {}}
          onClick={() => canPurchase && onPurchase(reward.id)}
          disabled={!canPurchase || disabled}
          className={`
            w-full py-3 rounded-xl font-medium text-sm transition-all duration-200
            ${reward.isPurchased
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : canPurchase
                ? `bg-gradient-to-r ${colors.bg.replace('50', '500')} text-white hover:shadow-md`
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {reward.isPurchased 
            ? '✅ Gekauft'
            : !hasRequiredLevel
              ? `Level ${reward.requiredLevel} erforderlich`
              : !canAfford
                ? 'Nicht genug Geld'
                : 'Kaufen'
          }
        </motion.button>

        {/* Purchase Date */}
        {reward.isPurchased && reward.purchasedAt && (
          <div className="text-xs text-gray-400 mt-2">
            Gekauft am {new Date(reward.purchasedAt).toLocaleDateString('de-DE')}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface VirtualRewardsProps {
  className?: string;
}

export default function VirtualRewards({ className = '' }: VirtualRewardsProps) {
  const { gamificationData, purchaseReward } = useGamification();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!gamificationData || !user?.smokingData) {
    return (
      <div className={className}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateSmokingStatistics(user.smokingData);
  const availableMoney = stats.moneySaved - gamificationData.totalMoneySpent;

  const categories = [
    { id: 'all', label: 'Alle', icon: '🛍️' },
    { id: 'treat', label: 'Genuss', icon: '🍰' },
    { id: 'experience', label: 'Erlebnisse', icon: '🎨' },
    { id: 'item', label: 'Gegenstände', icon: '🎁' },
    { id: 'upgrade', label: 'Upgrades', icon: '⚡' }
  ];

  const filteredRewards = gamificationData.virtualRewards.filter(
    reward => selectedCategory === 'all' || reward.category === selectedCategory
  );

  const purchasedCount = gamificationData.virtualRewards.filter(r => r.isPurchased).length;
  const totalSpent = gamificationData.totalMoneySpent;

  const handlePurchase = async (rewardId: string) => {
    setPurchasing(rewardId);
    setPurchaseMessage(null);

    try {
      const result = await purchaseReward(rewardId);
      
      setPurchaseMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });

      // Clear message after 3 seconds
      setTimeout(() => setPurchaseMessage(null), 3000);
    } catch (error) {
      setPurchaseMessage({
        type: 'error',
        text: 'Ein Fehler ist aufgetreten'
      });
      setTimeout(() => setPurchaseMessage(null), 3000);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Belohnungs-Shop
            </h2>
            <p className="text-sm text-gray-500">
              {purchasedCount} Belohnungen gekauft · {formatCurrency(totalSpent)} ausgegeben
            </p>
          </div>
          
          {/* Available Money */}
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(availableMoney)}
            </div>
            <div className="text-sm text-gray-500">
              verfügbar
            </div>
          </div>
        </div>

        {/* Purchase Message */}
        <AnimatePresence>
          {purchaseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                mb-6 p-4 rounded-xl border
                ${purchaseMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <div>
                  {purchaseMessage.type === 'success' ? '✅' : '❌'}
                </div>
                <div className="font-medium">
                  {purchaseMessage.text}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 flex items-center space-x-2
                ${selectedCategory === category.id
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Rewards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <AnimatePresence>
            {filteredRewards.map((reward) => (
              <VirtualRewardCard
                key={reward.id}
                reward={reward}
                availableMoney={availableMoney}
                userLevel={gamificationData.level.currentLevel}
                onPurchase={handlePurchase}
                disabled={purchasing === reward.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.moneySaved)}
            </div>
            <div className="text-sm text-gray-500">
              Gesamt gespart
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(availableMoney)}
            </div>
            <div className="text-sm text-gray-500">
              Verfügbar
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {purchasedCount}
            </div>
            <div className="text-sm text-gray-500">
              Belohnungen
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="text-center pt-4 border-t border-gray-100 mt-4">
          <div className="text-sm text-gray-600">
            Belohne dich für deine Erfolge! 🎉
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Du verdienst es, deine gesparten Euros zu genießen
          </div>
        </div>
      </div>
    </div>
  );
} 
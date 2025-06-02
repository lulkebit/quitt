import { 
  Achievement, 
  StreakData, 
  LevelSystem, 
  VirtualReward, 
  GamificationData,
  SmokingData 
} from '@/types/user';

// Achievement Definitions
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'isUnlocked' | 'progress' | 'maxProgress' | 'unlockedAt'>[] = [
  // Milestone Achievements
  {
    id: 'first-day',
    title: 'Erster Tag',
    description: 'Den ersten Tag rauchfrei geschafft!',
    icon: '🌟',
    category: 'milestone',
    type: 'bronze',
    requirement: 1,
    unit: 'days'
  },
  {
    id: 'week-warrior',
    title: 'Wochen-Krieger',
    description: 'Eine ganze Woche ohne Zigaretten!',
    icon: '🏆',
    category: 'milestone',
    type: 'silver',
    requirement: 7,
    unit: 'days'
  },
  {
    id: 'month-master',
    title: 'Monats-Meister',
    description: 'Einen ganzen Monat rauchfrei!',
    icon: '👑',
    category: 'milestone',
    type: 'gold',
    requirement: 30,
    unit: 'days'
  },
  {
    id: 'hundred-hero',
    title: '100-Tage Held',
    description: '100 Tage ohne Zigaretten - unglaublich!',
    icon: '💎',
    category: 'milestone',
    type: 'platinum',
    requirement: 100,
    unit: 'days'
  },
  {
    id: 'year-legend',
    title: 'Jahres-Legende',
    description: 'Ein ganzes Jahr rauchfrei - du bist eine Legende!',
    icon: '🎉',
    category: 'milestone',
    type: 'platinum',
    requirement: 365,
    unit: 'days'
  },

  // Health Achievements
  {
    id: 'breathing-better',
    title: 'Besser Atmen',
    description: 'Deine Lunge erholt sich bereits!',
    icon: '🫁',
    category: 'health',
    type: 'bronze',
    requirement: 3,
    unit: 'days'
  },
  {
    id: 'taste-returner',
    title: 'Geschmack Zurück',
    description: 'Geschmack und Geruch verbessern sich!',
    icon: '👅',
    category: 'health',
    type: 'silver',
    requirement: 14,
    unit: 'days'
  },
  {
    id: 'circulation-champion',
    title: 'Kreislauf-Champion',
    description: 'Deine Durchblutung verbessert sich!',
    icon: '❤️',
    category: 'health',
    type: 'gold',
    requirement: 90,
    unit: 'days'
  },

  // Savings Achievements
  {
    id: 'first-euro',
    title: 'Erster Euro',
    description: 'Du hast deinen ersten Euro gespart!',
    icon: '💰',
    category: 'savings',
    type: 'bronze',
    requirement: 1,
    unit: 'euros'
  },
  {
    id: 'fifty-saver',
    title: '50€ Sparer',
    description: '50€ gespart - das ist schon was!',
    icon: '💸',
    category: 'savings',
    type: 'silver',
    requirement: 50,
    unit: 'euros'
  },
  {
    id: 'hundred-hero-money',
    title: '100€ Held',
    description: '100€ gespart - fantastisch!',
    icon: '💎',
    category: 'savings',
    type: 'gold',
    requirement: 100,
    unit: 'euros'
  },
  {
    id: 'thousand-master',
    title: '1000€ Meister',
    description: '1000€ gespart - unglaublich!',
    icon: '🏦',
    category: 'savings',
    type: 'platinum',
    requirement: 1000,
    unit: 'euros'
  },

  // Streak Achievements
  {
    id: 'streak-starter',
    title: 'Streak-Starter',
    description: 'Deine erste 7-Tage Serie!',
    icon: '🔥',
    category: 'streak',
    type: 'bronze',
    requirement: 7,
    unit: 'streaks'
  },
  {
    id: 'streak-keeper',
    title: 'Streak-Keeper',
    description: '30 Tage in Folge - beeindruckend!',
    icon: '⚡',
    category: 'streak',
    type: 'silver',
    requirement: 30,
    unit: 'streaks'
  },
  {
    id: 'streak-legend',
    title: 'Streak-Legende',
    description: '100 Tage Serie - du bist unstoppbar!',
    icon: '🌟',
    category: 'streak',
    type: 'gold',
    requirement: 100,
    unit: 'streaks'
  }
];

// Virtual Rewards Definitions
export const VIRTUAL_REWARDS_DEFINITIONS: VirtualReward[] = [
  // Treats
  {
    id: 'coffee-treat',
    title: 'Premium Kaffee',
    description: 'Gönn dir einen besonderen Kaffee',
    category: 'treat',
    cost: 5,
    icon: '☕',
    isPurchased: false,
    isAvailable: true
  },
  {
    id: 'book-treat',
    title: 'Neues Buch',
    description: 'Ein spannendes Buch für entspannte Stunden',
    category: 'treat',
    cost: 15,
    icon: '📚',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 2
  },
  {
    id: 'cinema-treat',
    title: 'Kinobesuch',
    description: 'Ein toller Filmabend im Kino',
    category: 'experience',
    cost: 12,
    icon: '🎬',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 3
  },
  {
    id: 'spa-day',
    title: 'Wellness-Tag',
    description: 'Ein entspannender Tag im Spa',
    category: 'experience',
    cost: 80,
    icon: '🧘‍♀️',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 5
  },

  // Items
  {
    id: 'water-bottle',
    title: 'Trinkflasche',
    description: 'Eine schöne Trinkflasche für mehr Wasser',
    category: 'item',
    cost: 20,
    icon: '🍃',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 2
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness-Tracker',
    description: 'Überwache deine Gesundheit',
    category: 'item',
    cost: 150,
    icon: '⌚',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 8
  },

  // Experiences
  {
    id: 'weekend-trip',
    title: 'Wochenendausflug',
    description: 'Ein schöner Kurztrip als Belohnung',
    category: 'experience',
    cost: 200,
    icon: '🏞️',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 10
  },
  {
    id: 'cooking-class',
    title: 'Kochkurs',
    description: 'Lerne neue, gesunde Rezepte',
    category: 'experience',
    cost: 60,
    icon: '👨‍🍳',
    isPurchased: false,
    isAvailable: true,
    requiredLevel: 4
  }
];

// Level System
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Neuling', description: 'Du beginnst deine Reise' },
  { level: 2, xpRequired: 100, title: 'Einsteiger', description: 'Erste Schritte gemeistert' },
  { level: 3, xpRequired: 250, title: 'Fortgeschritten', description: 'Du machst gute Fortschritte' },
  { level: 4, xpRequired: 500, title: 'Experte', description: 'Du kennst dich schon aus' },
  { level: 5, xpRequired: 800, title: 'Meister', description: 'Wahre Meisterschaft' },
  { level: 6, xpRequired: 1200, title: 'Champion', description: 'Ein echter Champion' },
  { level: 7, xpRequired: 1700, title: 'Veteran', description: 'Langjährige Erfahrung' },
  { level: 8, xpRequired: 2300, title: 'Elite', description: 'Zur Elite gehörig' },
  { level: 9, xpRequired: 3000, title: 'Legende', description: 'Eine wahre Legende' },
  { level: 10, xpRequired: 4000, title: 'Grandmaster', description: 'Höchste Meisterschaft erreicht' }
];

// XP Calculation Functions
export function calculateDailyXP(daysSinceQuit: number): number {
  // Base XP per day
  let xp = 10;
  
  // Bonus for milestones
  if (daysSinceQuit % 7 === 0) xp += 20; // Weekly bonus
  if (daysSinceQuit % 30 === 0) xp += 50; // Monthly bonus
  if (daysSinceQuit % 100 === 0) xp += 100; // Major milestone bonus
  
  return xp;
}

export function calculateTotalXP(daysSinceQuit: number): number {
  let totalXP = 0;
  
  for (let day = 1; day <= daysSinceQuit; day++) {
    totalXP += calculateDailyXP(day);
  }
  
  return totalXP;
}

export function calculateCurrentLevel(totalXP: number): LevelSystem {
  let currentLevel = 1;
  let currentLevelData = LEVEL_THRESHOLDS[0];
  
  for (const level of LEVEL_THRESHOLDS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level.level;
      currentLevelData = level;
    } else {
      break;
    }
  }
  
  const nextLevelData = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpToNextLevel = nextLevelData.xpRequired - totalXP;
  
  return {
    currentLevel,
    xp: totalXP - currentLevelData.xpRequired,
    xpToNextLevel: Math.max(0, xpToNextLevel),
    totalXp: totalXP,
    levelTitle: currentLevelData.title,
    levelDescription: currentLevelData.description
  };
}

// Achievement Calculation
export function updateAchievements(
  currentAchievements: Achievement[],
  daysSinceQuit: number,
  moneySaved: number,
  cigarettesNotSmoked: number,
  currentStreak: number
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const existing = currentAchievements.find(a => a.id === def.id);
    let progress = 0;
    let isUnlocked = false;
    
    switch (def.unit) {
      case 'days':
        progress = daysSinceQuit;
        break;
      case 'euros':
        progress = Math.floor(moneySaved);
        break;
      case 'cigarettes':
        progress = cigarettesNotSmoked;
        break;
      case 'streaks':
        progress = currentStreak;
        break;
    }
    
    isUnlocked = progress >= def.requirement;
    
    return {
      ...def,
      isUnlocked,
      progress: Math.min(progress, def.requirement),
      maxProgress: def.requirement,
      unlockedAt: isUnlocked && !existing?.isUnlocked ? new Date() : existing?.unlockedAt
    };
  });
}

// Streak Management
export function updateStreak(
  streakData: StreakData | undefined,
  daysSinceQuit: number
): StreakData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!streakData) {
    return {
      currentStreak: daysSinceQuit,
      longestStreak: daysSinceQuit,
      lastCheckIn: today,
      streakHistory: [today],
      milestones: daysSinceQuit >= 7 ? [7] : []
    };
  }
  
  const updatedMilestones = [...streakData.milestones];
  
  // Check for new milestones
  const milestoneTargets = [7, 14, 30, 60, 90, 100, 180, 365];
  for (const target of milestoneTargets) {
    if (daysSinceQuit >= target && !updatedMilestones.includes(target)) {
      updatedMilestones.push(target);
    }
  }
  
  return {
    currentStreak: daysSinceQuit,
    longestStreak: Math.max(streakData.longestStreak, daysSinceQuit),
    lastCheckIn: today,
    streakHistory: [...streakData.streakHistory, today],
    milestones: updatedMilestones.sort((a, b) => a - b)
  };
}

// Initialize Gamification Data
export function initializeGamificationData(smokingData: SmokingData): GamificationData {
  const daysSinceQuit = Math.floor(
    (new Date().getTime() - new Date(smokingData.quitDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const moneySaved = (daysSinceQuit * smokingData.cigarettesPerDay * smokingData.cigarettePrice) / smokingData.cigarettesPerPack;
  const cigarettesNotSmoked = daysSinceQuit * smokingData.cigarettesPerDay;
  
  const totalXP = calculateTotalXP(daysSinceQuit);
  const level = calculateCurrentLevel(totalXP);
  const streak = updateStreak(undefined, daysSinceQuit);
  const achievements = updateAchievements([], daysSinceQuit, moneySaved, cigarettesNotSmoked, daysSinceQuit);
  
  return {
    achievements,
    streak,
    level,
    virtualRewards: VIRTUAL_REWARDS_DEFINITIONS.map(reward => ({ ...reward })),
    totalRewardsEarned: 0,
    totalMoneySpent: 0,
    lastActivityDate: new Date()
  };
}

// Purchase Virtual Reward
export function purchaseVirtualReward(
  gamificationData: GamificationData,
  rewardId: string,
  moneySaved: number
): { success: boolean; message: string; updatedData?: GamificationData } {
  const reward = gamificationData.virtualRewards.find(r => r.id === rewardId);
  
  if (!reward) {
    return { success: false, message: 'Belohnung nicht gefunden' };
  }
  
  if (reward.isPurchased) {
    return { success: false, message: 'Belohnung bereits gekauft' };
  }
  
  if (!reward.isAvailable) {
    return { success: false, message: 'Belohnung nicht verfügbar' };
  }
  
  if (reward.requiredLevel && gamificationData.level.currentLevel < reward.requiredLevel) {
    return { success: false, message: `Level ${reward.requiredLevel} erforderlich` };
  }
  
  const availableMoney = moneySaved - gamificationData.totalMoneySpent;
  
  if (availableMoney < reward.cost) {
    return { success: false, message: 'Nicht genug gesparte Euros' };
  }
  
  const updatedRewards = gamificationData.virtualRewards.map(r =>
    r.id === rewardId
      ? { ...r, isPurchased: true, purchasedAt: new Date() }
      : r
  );
  
  const updatedData: GamificationData = {
    ...gamificationData,
    virtualRewards: updatedRewards,
    totalRewardsEarned: gamificationData.totalRewardsEarned + 1,
    totalMoneySpent: gamificationData.totalMoneySpent + reward.cost,
    lastActivityDate: new Date()
  };
  
  return {
    success: true,
    message: `${reward.title} erfolgreich gekauft!`,
    updatedData
  };
} 
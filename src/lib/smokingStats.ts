import { SmokingData } from '@/types/user';

export interface SmokingStatistics {
  daysSinceQuit: number;
  cigarettesNotSmoked: number;
  moneySaved: number;
  yearsSmoked: number;
  totalCigarettesSmoked: number;
  totalMoneySpent: number;
  healthImprovements: HealthImprovement[];
  nextMilestone: Milestone | null;
}

export interface HealthImprovement {
  timeframe: string;
  description: string;
  achieved: boolean;
  daysRequired: number;
}

export interface Milestone {
  name: string;
  description: string;
  daysRequired: number;
  daysRemaining: number;
}

const HEALTH_IMPROVEMENTS: Omit<HealthImprovement, 'achieved'>[] = [
  {
    timeframe: '20 Minuten',
    description: 'Herzfrequenz und Blutdruck normalisieren sich',
    daysRequired: 0.014, // ~20 minutes
  },
  {
    timeframe: '12 Stunden',
    description: 'Kohlenmonoxid-Spiegel im Blut sinkt auf normal',
    daysRequired: 0.5,
  },
  {
    timeframe: '2 Wochen',
    description: 'Durchblutung verbessert sich, Lungenfunktion steigt',
    daysRequired: 14,
  },
  {
    timeframe: '1 Monat',
    description: 'Husten und Kurzatmigkeit verringern sich',
    daysRequired: 30,
  },
  {
    timeframe: '3 Monate',
    description: 'Zilien in der Lunge regenerieren sich',
    daysRequired: 90,
  },
  {
    timeframe: '1 Jahr',
    description: 'Risiko für Herzerkrankungen halbiert sich',
    daysRequired: 365,
  },
  {
    timeframe: '5 Jahre',
    description: 'Schlaganfallrisiko entspricht dem eines Nichtrauchers',
    daysRequired: 365 * 5,
  },
  {
    timeframe: '10 Jahre',
    description: 'Lungenkrebsrisiko halbiert sich',
    daysRequired: 365 * 10,
  },
  {
    timeframe: '15 Jahre',
    description: 'Herzerkrankungsrisiko entspricht dem eines Nichtrauchers',
    daysRequired: 365 * 15,
  },
];

const MILESTONES: Omit<Milestone, 'daysRemaining'>[] = [
  {
    name: '1 Tag',
    description: 'Der erste Tag ohne Zigarette!',
    daysRequired: 1,
  },
  {
    name: '1 Woche',
    description: 'Eine ganze Woche rauchfrei!',
    daysRequired: 7,
  },
  {
    name: '1 Monat',
    description: 'Ein ganzer Monat ohne Zigaretten!',
    daysRequired: 30,
  },
  {
    name: '3 Monate',
    description: 'Drei Monate rauchfrei - eine große Leistung!',
    daysRequired: 90,
  },
  {
    name: '6 Monate',
    description: 'Halbes Jahr geschafft!',
    daysRequired: 180,
  },
  {
    name: '1 Jahr',
    description: 'Ein ganzes Jahr rauchfrei - fantastisch!',
    daysRequired: 365,
  },
  {
    name: '2 Jahre',
    description: 'Zwei Jahre ohne Zigaretten!',
    daysRequired: 365 * 2,
  },
  {
    name: '5 Jahre',
    description: 'Fünf Jahre rauchfrei - ein neues Leben!',
    daysRequired: 365 * 5,
  },
];

export function calculateSmokingStatistics(
  smokingData: SmokingData,
  currentDate: Date = new Date()
): SmokingStatistics {
  const quitDate = new Date(smokingData.quitDate);
  const daysSinceQuit = Math.max(0, Math.floor(
    (currentDate.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)
  ));

  // Calculate years smoked
  const yearsSmoked = new Date().getFullYear() - smokingData.smokingStartYear;
  
  // Calculate total cigarettes smoked before quitting
  const totalCigarettesSmoked = yearsSmoked * 365 * smokingData.cigarettesPerDay;
  
  // Calculate cigarettes not smoked since quitting
  const cigarettesNotSmoked = daysSinceQuit * smokingData.cigarettesPerDay;
  
  // Calculate money saved
  const costPerCigarette = smokingData.cigarettePrice / smokingData.cigarettesPerPack;
  const moneySaved = cigarettesNotSmoked * costPerCigarette;
  
  // Calculate total money spent on smoking before quitting
  const totalMoneySpent = totalCigarettesSmoked * costPerCigarette;
  
  // Calculate health improvements
  const healthImprovements: HealthImprovement[] = HEALTH_IMPROVEMENTS.map(improvement => ({
    ...improvement,
    achieved: daysSinceQuit >= improvement.daysRequired,
  }));
  
  // Find next milestone
  const nextMilestone = MILESTONES
    .filter(milestone => daysSinceQuit < milestone.daysRequired)
    .sort((a, b) => a.daysRequired - b.daysRequired)[0];
  
  const nextMilestoneWithRemaining: Milestone | null = nextMilestone
    ? {
        ...nextMilestone,
        daysRemaining: nextMilestone.daysRequired - daysSinceQuit,
      }
    : null;

  return {
    daysSinceQuit,
    cigarettesNotSmoked,
    moneySaved,
    yearsSmoked,
    totalCigarettesSmoked,
    totalMoneySpent,
    healthImprovements,
    nextMilestone: nextMilestoneWithRemaining,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE').format(num);
}

export function getMotivationalMessage(daysSinceQuit: number): string {
  if (daysSinceQuit === 0) {
    return 'Heute ist der Tag! Sie schaffen das!';
  } else if (daysSinceQuit < 7) {
    return 'Großartig! Jeder Tag zählt. Bleiben Sie stark!';
  } else if (daysSinceQuit < 30) {
    return 'Fantastisch! Sie sind auf dem besten Weg!';
  } else if (daysSinceQuit < 90) {
    return 'Unglaublich! Sie haben bereits so viel erreicht!';
  } else if (daysSinceQuit < 365) {
    return 'Wow! Sie sind ein echter Nichtraucher geworden!';
  } else {
    return 'Herzlichen Glückwunsch! Sie sind ein Vorbild für andere!';
  }
} 
import { CopingStrategy, DistractionActivity } from '@/types/user';

export const COPING_STRATEGIES: CopingStrategy[] = [
  {
    id: 'deep-breathing',
    title: 'Tiefe Atmung',
    description: 'Atme langsam und tief durch die Nase ein und durch den Mund aus',
    category: 'breathing',
    timeOfDay: 'any',
    duration: 5,
    difficulty: 'easy'
  },
  {
    id: 'cold-water',
    title: 'Kaltes Wasser trinken',
    description: 'Trinke ein großes Glas kaltes Wasser langsam',
    category: 'physical',
    timeOfDay: 'any',
    duration: 3,
    difficulty: 'easy'
  },
  {
    id: 'walk-around',
    title: 'Kurzer Spaziergang',
    description: 'Gehe 5-10 Minuten an der frischen Luft spazieren',
    category: 'physical',
    timeOfDay: 'any',
    duration: 10,
    difficulty: 'easy'
  },
  {
    id: 'visualization',
    title: 'Positive Visualisierung',
    description: 'Stelle dir vor, wie stolz du auf dich sein wirst',
    category: 'mental',
    timeOfDay: 'any',
    duration: 5,
    difficulty: 'medium'
  },
  {
    id: 'call-friend',
    title: 'Freund anrufen',
    description: 'Rufe einen unterstützenden Freund oder Familienangehörigen an',
    category: 'social',
    timeOfDay: 'any',
    duration: 15,
    difficulty: 'easy'
  },
  {
    id: 'meditation',
    title: 'Kurze Meditation',
    description: 'Meditiere 5-10 Minuten mit einer App oder geführt',
    category: 'mental',
    timeOfDay: 'any',
    duration: 10,
    difficulty: 'medium'
  },
  {
    id: 'hand-exercises',
    title: 'Handübungen',
    description: 'Bewege deine Hände und Finger, um die Gewohnheit zu durchbrechen',
    category: 'physical',
    timeOfDay: 'any',
    duration: 3,
    difficulty: 'easy'
  },
  {
    id: 'motivational-reminder',
    title: 'Motivationserinnerung',
    description: 'Lies deine persönlichen Gründe fürs Aufhören durch',
    category: 'mental',
    timeOfDay: 'any',
    duration: 2,
    difficulty: 'easy'
  }
];

export const DISTRACTION_ACTIVITIES: DistractionActivity[] = [
  {
    id: 'sudoku',
    title: 'Sudoku lösen',
    description: 'Löse ein Sudoku-Rätsel auf deinem Handy',
    category: 'mindful',
    duration: 15,
    difficulty: 'medium',
    location: 'anywhere'
  },
  {
    id: 'push-ups',
    title: 'Liegestütze machen',
    description: 'Mache 10-20 Liegestütze oder so viele wie möglich',
    category: 'physical',
    duration: 5,
    difficulty: 'medium',
    location: 'home'
  },
  {
    id: 'sketch',
    title: 'Schnelle Skizze',
    description: 'Zeichne etwas in deiner Umgebung oder aus dem Gedächtnis',
    category: 'creative',
    duration: 10,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'podcast',
    title: 'Podcast hören',
    description: 'Höre einen interessanten Podcast oder Hörbuch',
    category: 'mindful',
    duration: 20,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'organize',
    title: 'Aufräumen',
    description: 'Räume einen kleinen Bereich auf oder organisiere etwas',
    category: 'productive',
    duration: 15,
    difficulty: 'easy',
    location: 'home'
  },
  {
    id: 'text-friend',
    title: 'Nachricht schreiben',
    description: 'Schreibe einer Person, mit der du länger nicht gesprochen hast',
    category: 'social',
    duration: 10,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'stretching',
    title: 'Stretching',
    description: 'Mache einige Dehnungsübungen oder Yoga-Posen',
    category: 'physical',
    duration: 10,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'journal',
    title: 'Tagebuch schreiben',
    description: 'Schreibe deine Gedanken und Gefühle auf',
    category: 'mindful',
    duration: 15,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'music',
    title: 'Musik hören',
    description: 'Höre deine Lieblingsmusik oder entdecke neue Songs',
    category: 'mindful',
    duration: 15,
    difficulty: 'easy',
    location: 'anywhere'
  },
  {
    id: 'learn-something',
    title: 'Etwas Neues lernen',
    description: 'Schaue ein kurzes Lernvideo oder lies einen interessanten Artikel',
    category: 'productive',
    duration: 20,
    difficulty: 'medium',
    location: 'anywhere'
  }
];

export function getCopingStrategiesByTimeAndSituation(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
  situation?: string
): CopingStrategy[] {
  return COPING_STRATEGIES.filter(strategy => 
    strategy.timeOfDay === 'any' || strategy.timeOfDay === timeOfDay
  );
}

export function getDistractionActivitiesByLocation(
  location: 'home' | 'outdoor' | 'anywhere'
): DistractionActivity[] {
  return DISTRACTION_ACTIVITIES.filter(activity => 
    activity.location === 'anywhere' || activity.location === location
  );
}

export function getQuickActivities(): DistractionActivity[] {
  return DISTRACTION_ACTIVITIES.filter(activity => activity.duration <= 10);
} 
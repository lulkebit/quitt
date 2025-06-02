'use client';

import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/shared/PageLayout';
import GamificationOverview from '@/components/GamificationOverview';

export default function GamificationPage() {
  const { user } = useAuth();

  const gamificationIcon = (
    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    </div>
  );

  return (
    <PageLayout 
      title="Gamification" 
      showBackButton={true}
      navigationIcon={gamificationIcon}
    >
      <GamificationOverview />
    </PageLayout>
  );
} 
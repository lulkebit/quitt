'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  navigationActions?: React.ReactNode;
  navigationIcon?: React.ReactNode;
  requireAuth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl';
}

export default function PageLayout({
  title,
  children,
  showBackButton = false,
  backUrl = '/',
  navigationActions,
  navigationIcon,
  requireAuth = true,
  maxWidth = '6xl'
}: PageLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, requireAuth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return null;
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        title={title}
        showBackButton={showBackButton}
        backUrl={backUrl}
        actions={navigationActions}
        icon={navigationIcon}
      />
      
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-6 lg:px-8 py-8`}>
        {children}
      </main>
    </div>
  );
} 
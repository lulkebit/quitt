'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  calculateSmokingStatistics, 
  formatCurrency, 
  formatNumber, 
  getMotivationalMessage,
  SmokingStatistics 
} from '@/lib/smokingStats';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SmokingStatistics | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.smokingData) {
      const statistics = calculateSmokingStatistics(user.smokingData);
      setStats(statistics);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Quitt Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Willkommen, {user.firstName} {user.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {stats && (
            <>
              {/* Motivational Header */}
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white mb-6">
                <h2 className="text-3xl font-bold mb-2">
                  {stats.daysSinceQuit} Tag{stats.daysSinceQuit !== 1 ? 'e' : ''} rauchfrei!
                </h2>
                <p className="text-lg opacity-90">
                  {getMotivationalMessage(stats.daysSinceQuit)}
                </p>
              </div>

              {/* Main Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Geld gespart</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.moneySaved)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Nicht gerauchte Zigaretten</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.cigarettesNotSmoked)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Jahre geraucht</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.yearsSmoked}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Versuche zuvor</p>
                      <p className="text-2xl font-semibold text-gray-900">{user.smokingData.previousQuitAttempts}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              {stats.nextMilestone && (
                <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nächster Meilenstein</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-medium text-blue-600">{stats.nextMilestone.name}</p>
                      <p className="text-gray-600">{stats.nextMilestone.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.nextMilestone.daysRemaining}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tag{stats.nextMilestone.daysRemaining !== 1 ? 'e' : ''} verbleibend
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((stats.nextMilestone.daysRequired - stats.nextMilestone.daysRemaining) /
                              stats.nextMilestone.daysRequired) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Health Improvements */}
              <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gesundheitliche Verbesserungen</h3>
                <div className="space-y-4">
                  {stats.healthImprovements.slice(0, 6).map((improvement, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${
                        improvement.achieved 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {improvement.achieved ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        )}
                      </div>
                      <div className={improvement.achieved ? 'text-gray-900' : 'text-gray-500'}>
                        <p className="font-medium">{improvement.timeframe}</p>
                        <p className="text-sm">{improvement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ihre Motivation</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Gründe für das Aufhören:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.smokingData.reasonsToQuit.map((reason, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {user.smokingData.healthGoals && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Ihre Gesundheitsziele:</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                        {user.smokingData.healthGoals}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Motivationslevel:</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-8 h-8 rounded ${
                            level <= user.smokingData.motivationLevel
                              ? 'bg-yellow-400'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
              <h1 className="text-xl font-semibold text-gray-900">
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dashboard Platzhalter
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Willkommen in Ihrem Quitt Dashboard! Dies ist ein einfacher 
                Platzhalter-Text, der später durch echte Inhalte ersetzt wird.
              </p>
              
              {/* Placeholder Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Statistiken
                  </h3>
                  <p className="text-gray-600">
                    Hier werden später Ihre wichtigsten Statistiken angezeigt.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Letzte Aktivitäten
                  </h3>
                  <p className="text-gray-600">
                    Eine Übersicht über Ihre letzten Aktivitäten wird hier erscheinen.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Schnellaktionen
                  </h3>
                  <p className="text-gray-600">
                    Häufig verwendete Aktionen werden hier verfügbar sein.
                  </p>
                </div>
              </div>
              
              {/* User Info */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Ihre Kontoinformationen
                </h3>
                <div className="text-blue-800">
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>E-Mail:</strong> {user.email}</p>
                  <p><strong>Registriert am:</strong> {new Date(user.createdAt).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SmokingData } from '@/types/user';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

export default function Settings() {
  const { user, logout, updateUser, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    smokingData: {
      cigarettesPerDay: 0,
      smokingStartYear: new Date().getFullYear() - 1,
      quitDate: new Date(),
      cigarettePrice: 0,
      cigarettesPerPack: 20,
      reasonsToQuit: [] as string[],
      healthGoals: '',
      previousQuitAttempts: 0,
      motivationLevel: 3 as 1 | 2 | 3 | 4 | 5
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.smokingData) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        smokingData: {
          ...user.smokingData,
          quitDate: new Date(user.smokingData.quitDate),
          healthGoals: user.smokingData.healthGoals || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('smokingData.')) {
      const smokingField = field.replace('smokingData.', '');
      setFormData(prev => ({
        ...prev,
        smokingData: {
          ...prev.smokingData,
          [smokingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleReasonsChange = (reasons: string[]) => {
    setFormData(prev => ({
      ...prev,
      smokingData: {
        ...prev.smokingData,
        reasonsToQuit: reasons
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage and context
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUser(updatedUser);
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert('Fehler beim Speichern: ' + error.error);
      }
    } catch (error) {
      alert('Netzwerkfehler beim Speichern der Daten');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const reasonOptions = [
    'Gesundheit',
    'Geld sparen',
    'Familie',
    'Sport/Fitness',
    'Aussehen',
    'Geruch',
    'Andere'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="sticky top-0 z-50 backdrop-blur-apple bg-white/80 border-b border-gray-200/50"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <button 
                onClick={() => router.push('/')}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Quitt - Einstellungen
                </h1>
              </button>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Zurück
              </motion.button>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Abmelden
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Einstellungen
            </h2>
            <p className="text-gray-600">
              Verwalten Sie Ihre persönlichen Daten und Rauchgewohnheiten
            </p>
          </div>

          {/* Personal Data Section */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Persönliche Daten
              </h3>
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors duration-200"
                >
                  Bearbeiten
                </motion.button>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isSaving ? 'Speichern...' : 'Speichern'}
                  </motion.button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.email}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Smoking Data Section */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Rauchgewohnheiten
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cigarettes per day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zigaretten pro Tag (früher)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.smokingData.cigarettesPerDay}
                    onChange={(e) => handleInputChange('smokingData.cigarettesPerDay', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.smokingData?.cigarettesPerDay || 0}</p>
                )}
              </div>

              {/* Smoking start year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jahr des Rauchbeginns
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={formData.smokingData.smokingStartYear}
                    onChange={(e) => handleInputChange('smokingData.smokingStartYear', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.smokingData?.smokingStartYear || new Date().getFullYear()}</p>
                )}
              </div>

              {/* Quit date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aufhördatum
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.smokingData.quitDate.toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('smokingData.quitDate', new Date(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.smokingData?.quitDate ? new Date(user.smokingData.quitDate).toLocaleDateString('de-DE') : 'Nicht gesetzt'}
                  </p>
                )}
              </div>

              {/* Cigarette price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preis pro Packung (€)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={formData.smokingData.cigarettePrice}
                    onChange={(e) => handleInputChange('smokingData.cigarettePrice', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.smokingData?.cigarettePrice?.toFixed(2) || '0.00'} €</p>
                )}
              </div>

              {/* Cigarettes per pack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zigaretten pro Packung
                </label>
                {isEditing ? (
                  <select
                    value={formData.smokingData.cigarettesPerPack}
                    onChange={(e) => handleInputChange('smokingData.cigarettesPerPack', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={20}>20</option>
                    <option value={19}>19</option>
                    <option value={25}>25</option>
                    <option value={30}>30</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{user.smokingData?.cigarettesPerPack || 20}</p>
                )}
              </div>

              {/* Previous quit attempts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorherige Aufhörversuche
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.smokingData.previousQuitAttempts}
                    onChange={(e) => handleInputChange('smokingData.previousQuitAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user.smokingData?.previousQuitAttempts || 0}</p>
                )}
              </div>

              {/* Motivation level */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivationslevel (1 = niedrig, 5 = sehr hoch)
                </label>
                {isEditing ? (
                  <select
                    value={formData.smokingData.motivationLevel}
                    onChange={(e) => handleInputChange('smokingData.motivationLevel', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={1}>1 - Niedrig</option>
                    <option value={2}>2 - Eher niedrig</option>
                    <option value={3}>3 - Mittel</option>
                    <option value={4}>4 - Hoch</option>
                    <option value={5}>5 - Sehr hoch</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.smokingData?.motivationLevel || 3} - {
                      (user.smokingData?.motivationLevel || 3) === 1 ? 'Niedrig' :
                      (user.smokingData?.motivationLevel || 3) === 2 ? 'Eher niedrig' :
                      (user.smokingData?.motivationLevel || 3) === 3 ? 'Mittel' :
                      (user.smokingData?.motivationLevel || 3) === 4 ? 'Hoch' : 'Sehr hoch'
                    }
                  </p>
                )}
              </div>

              {/* Reasons to quit */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gründe für das Aufhören
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {reasonOptions.map((reason) => (
                      <label key={reason} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.smokingData.reasonsToQuit.includes(reason)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleReasonsChange([...formData.smokingData.reasonsToQuit, reason]);
                            } else {
                              handleReasonsChange(formData.smokingData.reasonsToQuit.filter(r => r !== reason));
                            }
                          }}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user.smokingData?.reasonsToQuit || []).map((reason) => (
                      <span
                        key={reason}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Health goals */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gesundheitsziele
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.smokingData.healthGoals || ''}
                    onChange={(e) => handleInputChange('smokingData.healthGoals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Beschreiben Sie Ihre gesundheitlichen Ziele..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.smokingData?.healthGoals || 'Keine Gesundheitsziele angegeben'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SmokingData } from '@/types/user';

const COMMON_QUIT_REASONS = [
  'Gesundheit verbessern',
  'Geld sparen',
  'Familie/Kinder',
  'Sport und Fitness',
  'Geruch loswerden',
  'Vorbild sein',
  'Unabhängigkeit',
  'Arztemfehlung'
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [smokingData, setSmokingData] = useState<SmokingData>({
    cigarettesPerDay: 0,
    smokingStartYear: new Date().getFullYear() - 10,
    quitDate: new Date(),
    cigarettePrice: 7.0,
    cigarettesPerPack: 20,
    reasonsToQuit: [],
    healthGoals: '',
    previousQuitAttempts: 0,
    motivationLevel: 3 as const,
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSmokingDataChange = (field: keyof SmokingData, value: any) => {
    setSmokingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReasonToggle = (reason: string) => {
    setSmokingData(prev => ({
      ...prev,
      reasonsToQuit: prev.reasonsToQuit.includes(reason)
        ? prev.reasonsToQuit.filter(r => r !== reason)
        : [...prev.reasonsToQuit, reason]
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Bitte füllen Sie alle Felder aus');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwörter stimmen nicht überein');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Passwort muss mindestens 6 Zeichen lang sein');
        return;
      }
    }
    
    if (currentStep === 2) {
      // Validate smoking data
      if (smokingData.cigarettesPerDay <= 0) {
        setError('Bitte geben Sie eine gültige Anzahl Zigaretten pro Tag an');
        return;
      }
      
      if (smokingData.smokingStartYear < 1950 || smokingData.smokingStartYear > new Date().getFullYear()) {
        setError('Bitte geben Sie ein gültiges Jahr an');
        return;
      }
    }
    
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (smokingData.reasonsToQuit.length === 0) {
      setError('Bitte wählen Sie mindestens einen Grund aus');
      setLoading(false);
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      smokingData: smokingData,
    });
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Ein Fehler ist aufgetreten');
    }
    
    setLoading(false);
  };

  if (user) {
    return null; // Will redirect to dashboard
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Vorname
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Vorname"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nachname
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nachname"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="E-Mail-Adresse"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Passwort (mindestens 6 Zeichen)"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Passwort bestätigen
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Passwort bestätigen"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Ihre Rauchgewohnheiten
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Diese Informationen helfen uns, personalisierte Statistiken zu erstellen
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Wie viele Zigaretten rauchen Sie pro Tag?
        </label>
        <input
          type="number"
          min="1"
          max="100"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={smokingData.cigarettesPerDay}
          onChange={(e) => handleSmokingDataChange('cigarettesPerDay', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          In welchem Jahr haben Sie angefangen zu rauchen?
        </label>
        <input
          type="number"
          min="1950"
          max={new Date().getFullYear()}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={smokingData.smokingStartYear}
          onChange={(e) => handleSmokingDataChange('smokingStartYear', parseInt(e.target.value) || new Date().getFullYear())}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Wann möchten Sie mit dem Rauchen aufhören?
        </label>
        <input
          type="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={smokingData.quitDate.toISOString().split('T')[0]}
          onChange={(e) => handleSmokingDataChange('quitDate', new Date(e.target.value))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preis pro Packung (€)
          </label>
          <input
            type="number"
            step="0.10"
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={smokingData.cigarettePrice}
            onChange={(e) => handleSmokingDataChange('cigarettePrice', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Zigaretten pro Packung
          </label>
          <input
            type="number"
            min="1"
            max="50"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={smokingData.cigarettesPerPack}
            onChange={(e) => handleSmokingDataChange('cigarettesPerPack', parseInt(e.target.value) || 20)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Wie oft haben Sie bereits versucht aufzuhören?
        </label>
        <input
          type="number"
          min="0"
          max="50"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={smokingData.previousQuitAttempts}
          onChange={(e) => handleSmokingDataChange('previousQuitAttempts', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Wie motiviert sind Sie? (1 = wenig, 5 = sehr motiviert)
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleSmokingDataChange('motivationLevel', level)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border ${
                smokingData.motivationLevel === level
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Ihre Motivation
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Warum möchten Sie mit dem Rauchen aufhören?
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gründe für das Aufhören (mehrere auswählbar)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_QUIT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => handleReasonToggle(reason)}
              className={`p-3 text-sm font-medium rounded-md border text-left ${
                smokingData.reasonsToQuit.includes(reason)
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gesundheitsziele (optional)
        </label>
        <textarea
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="z.B. Bessere Ausdauer beim Sport, weniger Husten..."
          value={smokingData.healthGoals}
          onChange={(e) => handleSmokingDataChange('healthGoals', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Neues Konto erstellen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oder{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              melden Sie sich bei Ihrem bestehenden Konto an
            </Link>
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-blue-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2 text-xs text-gray-500">
              <span>Schritt {currentStep} von 3</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="group relative flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Zurück
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
              >
                Weiter
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ml-auto"
              >
                {loading ? 'Wird erstellt...' : 'Konto erstellen'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 
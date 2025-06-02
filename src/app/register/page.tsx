'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  'Arztempfehlung'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const slideVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    };
  }
};

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
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
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setDirection(-1);
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
    return null;
  }

  const renderStep1 = () => (
    <motion.div
      key="step1"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Persönliche Informationen</h3>
        <p className="text-gray-600 text-sm">Erstellen Sie Ihr Quitt Konto</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Vorname
          </label>
          <motion.div
            animate={{ scale: focusedField === 'firstName' ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="Max"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
            />
          </motion.div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Nachname
          </label>
          <motion.div
            animate={{ scale: focusedField === 'lastName' ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="Mustermann"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
            />
          </motion.div>
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          E-Mail-Adresse
        </label>
        <motion.div
          animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="max@beispiel.de"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </motion.div>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Passwort
        </label>
        <motion.div
          animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Mindestens 6 Zeichen"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </motion.div>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Passwort bestätigen
        </label>
        <motion.div
          animate={{ scale: focusedField === 'confirmPassword' ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Passwort wiederholen"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ihre Rauchgewohnheiten</h3>
        <p className="text-gray-600 text-sm">Helfen Sie uns, personalisierte Statistiken zu erstellen</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zigaretten pro Tag
        </label>
        <input
          type="number"
          min="1"
          max="100"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={smokingData.cigarettesPerDay}
          onChange={(e) => handleSmokingDataChange('cigarettesPerDay', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beginn des Rauchens (Jahr)
        </label>
        <input
          type="number"
          min="1950"
          max={new Date().getFullYear()}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={smokingData.smokingStartYear}
          onChange={(e) => handleSmokingDataChange('smokingStartYear', parseInt(e.target.value) || new Date().getFullYear())}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gewünschtes Aufhördatum
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={smokingData.quitDate.toISOString().split('T')[0]}
          onChange={(e) => handleSmokingDataChange('quitDate', new Date(e.target.value))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preis pro Packung (€)
          </label>
          <input
            type="number"
            step="0.10"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            value={smokingData.cigarettePrice}
            onChange={(e) => handleSmokingDataChange('cigarettePrice', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zigaretten pro Packung
          </label>
          <input
            type="number"
            min="1"
            max="50"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            value={smokingData.cigarettesPerPack}
            onChange={(e) => handleSmokingDataChange('cigarettesPerPack', parseInt(e.target.value) || 20)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bisherige Aufhörversuche
        </label>
        <input
          type="number"
          min="0"
          max="50"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={smokingData.previousQuitAttempts}
          onChange={(e) => handleSmokingDataChange('previousQuitAttempts', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Motivationslevel
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.button
              key={level}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSmokingDataChange('motivationLevel', level)}
              className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all duration-200 ${
                smokingData.motivationLevel === level
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {level}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">1 = wenig motiviert, 5 = sehr motiviert</p>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ihre Motivation</h3>
        <p className="text-gray-600 text-sm">Was motiviert Sie, mit dem Rauchen aufzuhören?</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gründe für das Aufhören
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_QUIT_REASONS.map((reason, index) => (
            <motion.button
              key={reason}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleReasonToggle(reason)}
              className={`p-4 text-sm font-medium rounded-xl border text-left transition-all duration-200 ${
                smokingData.reasonsToQuit.includes(reason)
                  ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  smokingData.reasonsToQuit.includes(reason)
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {smokingData.reasonsToQuit.includes(reason) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {reason}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Persönliche Gesundheitsziele (optional)
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
          placeholder="z.B. Bessere Ausdauer beim Sport, weniger Husten, mehr Energie..."
          value={smokingData.healthGoals}
          onChange={(e) => handleSmokingDataChange('healthGoals', e.target.value)}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sm:mx-auto sm:w-full sm:max-w-lg"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Neues Konto erstellen
          </h2>
          <p className="text-gray-600">
            Starten Sie Ihre rauchfreie Reise
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                animate={{
                  scale: step === currentStep ? 1.1 : 1,
                  backgroundColor: step <= currentStep ? '#22c55e' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">Schritt {currentStep} von 3</span>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          variants={itemVariants}
          className="bg-white py-8 px-6 shadow-lg rounded-2xl border border-gray-200/60"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Steps */}
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
            <div className="min-h-[400px] relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Zurück
                </motion.button>
              ) : (
                <div />
              )}
              
              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  Weiter
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Wird erstellt...
                    </>
                  ) : (
                    'Konto erstellen'
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Login Link */}
        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-gray-600">
            Bereits ein Konto?{' '}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
            >
              Jetzt anmelden
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 
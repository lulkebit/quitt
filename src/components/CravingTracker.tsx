'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, X, CheckCircle } from 'lucide-react';

interface CravingTrackerProps {
  onReport: (cravingData: {
    intensity: number;
    situation?: string;
    trigger?: string;
    location?: string;
    emotion?: string;
    notes?: string;
  }) => Promise<void>;
  submitting: boolean;
}

export default function CravingTracker({ onReport, submitting }: CravingTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [situation, setSituation] = useState('');
  const [trigger, setTrigger] = useState('');
  const [location, setLocation] = useState('');
  const [emotion, setEmotion] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onReport({
        intensity,
        situation: situation || undefined,
        trigger: trigger || undefined,
        location: location || undefined,
        emotion: emotion || undefined,
        notes: notes || undefined
      });
      
      // Reset form
      setIntensity(5);
      setSituation('');
      setTrigger('');
      setLocation('');
      setEmotion('');
      setNotes('');
      setIsOpen(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error reporting craving:', error);
    }
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return 'from-green-400 to-green-500';
    if (value <= 6) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-red-500';
  };

  const getIntensityText = (value: number) => {
    if (value <= 3) return 'Schwach';
    if (value <= 6) return 'Mittel';
    return 'Stark';
  };

  return (
    <>
      {/* Quick Report Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-3"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">Verlangen melden</span>
      </motion.button>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verlangen erfolgreich gemeldet</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Verlangen melden</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Intensity Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Intensität: {intensity}/10 ({getIntensityText(intensity)})
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, 
                          #10b981 0%, #10b981 ${(intensity <= 3 ? intensity * 33.33 : 0)}%, 
                          #f59e0b ${(intensity > 3 && intensity <= 6 ? (intensity - 3) * 33.33 : 0)}%, 
                          #ef4444 ${(intensity > 6 ? (intensity - 6) * 25 : 0)}%, 
                          #e5e7eb ${intensity * 10}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Quick Context Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Situation (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['Zuhause', 'Arbeit', 'Unterwegs', 'Sozialer Anlass'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSituation(option)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          situation === option
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Oder eigene Situation eingeben..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Trigger */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Auslöser (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['Stress', 'Langeweile', 'Gewohnheit', 'Andere rauchen'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTrigger(option)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          trigger === option
                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    placeholder="Oder eigenen Auslöser eingeben..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Emotion */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gefühl (optional)
                  </label>
                  <input
                    type="text"
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    placeholder="Wie fühlen Sie sich gerade?"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Zusätzliche Notizen (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Weitere Details oder Gedanken..."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${getIntensityColor(intensity)} hover:shadow-lg`
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Wird gemeldet...</span>
                    </div>
                  ) : (
                    'Verlangen melden'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 
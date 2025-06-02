import { useState, useEffect, useCallback } from 'react';
import { CravingEntry } from '@/types/user';

interface CravingStats {
  cravingsToday: number;
  avgIntensityToday: number;
  cravingsThisWeek: number;
  topTriggers: Array<{ _id: string; count: number }>;
  hourlyDistribution: Array<{ _id: number; count: number }>;
}

export function useCravings() {
  const [cravings, setCravings] = useState<CravingEntry[]>([]);
  const [stats, setStats] = useState<CravingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchCravings = useCallback(async (days: number = 30) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/cravings?days=${days}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cravings');
      }
      
      const data = await response.json();
      setCravings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/cravings/stats', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const reportCraving = useCallback(async (cravingData: {
    intensity: number;
    situation?: string;
    trigger?: string;
    location?: string;
    emotion?: string;
    notes?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cravings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cravingData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to report craving');
      }
      
      const newCraving = await response.json();
      setCravings(prev => [newCraving, ...prev]);
      
      // Refresh stats after reporting
      await fetchStats();
      
      return newCraving;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchCravings();
    fetchStats();
  }, [fetchCravings, fetchStats]);

  return {
    cravings,
    stats,
    loading,
    submitting,
    error,
    fetchCravings,
    fetchStats,
    reportCraving
  };
} 
// hooks/useSalesStatistics.ts

import { useState, useEffect } from 'react';
import { Period, StatisticsResponse } from '@/types/statisticsTypes';
import { getSalesStatistics } from '@/services/statisticsService';

interface UseSalesStatisticsProps {
  period: Period;
  date: string; // Formato: 'YYYY-MM-DD'
}

export const useSalesStatistics = ({ period, date }: UseSalesStatisticsProps) => {
  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const stats = await getSalesStatistics(period, date);
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Error desconocido.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [period, date]);

  return { data, isLoading, error };
};

// services/statisticsService.ts

import { Period, StatisticsResponse, StatisticsErrorResponse } from '@/types/statisticsTypes';

/**
 * Obtiene las estadísticas de ventas según el período y la fecha proporcionados.
 * @param period El período para el cual se desean las estadísticas ('day', 'week', 'month', 'year').
 * @param date La fecha de referencia en formato 'YYYY-MM-DD'.
 * @returns Una promesa que resuelve con los datos de ventas o rechaza con un error.
 */
export const getSalesStatistics = async (
  period: Period,
  date: string
): Promise<StatisticsResponse> => {
  const response = await fetch(`/api/statistics?period=${period}&date=${date}`);

  if (!response.ok) {
    const errorData: StatisticsErrorResponse = await response.json();
    throw new Error(errorData.error || 'Error al obtener las estadísticas de ventas.');
  }

  const data: StatisticsResponse = await response.json();
  return data;
};

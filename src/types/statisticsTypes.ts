// types/statisticsTypes.ts

export type Period = 'day' | 'week' | 'month' | 'year';

export interface SalesData {
  id: number;
  nombre: string;
  totalSold: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
}

export interface Totals {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface StatisticsResponse {
  period: Period;
  date: string; // Formato: 'YYYY-MM-DD'
  sales: SalesData[];
  totals: Totals;
}

export interface StatisticsErrorResponse {
  error: string;
}

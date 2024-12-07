// components/SalesStatistics.tsx

'use client';

// components/SalesStatistics.tsx

import React, { useState } from 'react';
import { useSalesStatistics } from '@/hooks/useSalesStatistics';
import { Period } from '@/types/statisticsTypes';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';


// Registrar los elementos necesarios de Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesStatistics: React.FC = () => {
  const [period, setPeriod] = useState<Period>('day');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  });

  const { data, isLoading, error } = useSalesStatistics({ period, date });

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  // Preparar los datos para el gráfico de Ingresos vs Costos
  const chartDataRevenueCost = {
    labels: data?.sales.map((item) => item.nombre) || [],
    datasets: [
      {
        label: 'Ingresos',
        data: data?.sales.map((item) => item.totalRevenue) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Verde
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Costos',
        data: data?.sales.map((item) => item.totalCost) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Rojo
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsRevenueCost = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Preparar los datos para el gráfico de Ganancias
  const chartDataProfit = {
    labels: data?.sales.map((item) => item.nombre) || [],
    datasets: [
      {
        label: 'Ganancia',
        data: data?.sales.map((item) => item.profit) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Azul
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsProfit = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Preparar los datos para mostrar los totales
  const totalRevenue = data?.totals.totalRevenue || 0;
  const totalCost = data?.totals.totalCost || 0;
  const totalProfit = data?.totals.totalProfit || 0;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Ventas</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="font-medium">
            Fecha:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Período:</span>
          <button
            onClick={() => handlePeriodChange('day')}
            className={`px-4 py-2 rounded ${
              period === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Día
          </button>
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-4 py-2 rounded ${
              period === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-4 py-2 rounded ${
              period === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-4 py-2 rounded ${
              period === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {isLoading && <SkeletonLoader />}

      {error && (
        <div className="text-red-500 mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {data && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Ventas del {period} {data.date}
          </h3>
          {data.sales.length === 0 ? (
            <p>No hay ventas registradas para este período.</p>
          ) : (
            <div>
              {/* Gráfico de Ingresos vs Costos */}
              <Bar data={chartDataRevenueCost} options={chartOptionsRevenueCost} />

              {/* Gráfico de Ganancias */}
              <Bar data={chartDataProfit} options={chartOptionsProfit} className="mt-6" />

              {/* Tabla de Ventas */}
              <table className="w-full mt-6 table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left">Producto</th>
                    <th className="border-b px-4 py-2 text-right">Cantidad Vendida</th>
                    <th className="border-b px-4 py-2 text-right">Ingresos</th>
                    <th className="border-b px-4 py-2 text-right">Costos</th>
                    <th className="border-b px-4 py-2 text-right">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sales.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b px-4 py-2">{item.nombre}</td>
                      <td className="border-b px-4 py-2 text-right">{item.totalSold}</td>
                      <td className="border-b px-4 py-2 text-right">${item.totalRevenue}</td>
                      <td className="border-b px-4 py-2 text-right">${item.totalCost}</td>
                      <td className="border-b px-4 py-2 text-right">${item.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales Generales */}
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h4 className="text-lg font-semibold mb-2">Totales Generales</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="font-medium">Total Ingresos: <span className="text-green-600">${totalRevenue}</span></p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Total Costos: <span className="text-red-600">${totalCost}</span></p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Total Ganancias: <span className="text-blue-600">${totalProfit}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesStatistics;

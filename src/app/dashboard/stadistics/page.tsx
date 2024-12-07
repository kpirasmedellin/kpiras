// app/dashboard/statistics/page.tsx

'use client';

import React from 'react';
import SalesStatistics from '@/components/salesStadistics';

const StatisticsPage: React.FC = () => {
  return (
    <div className="flex">
      {/* Contenido Principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <SalesStatistics />
      </main>
    </div>
  );
};

export default StatisticsPage;

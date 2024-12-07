// app/api/statistics/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

/**
 * Helper function to calculate the start and end dates based on the period.
 */
const calculateDateRange = (period: string, referenceDate: Date): { startDate: Date; endDate: Date } => {
  let startDate: Date;
  let endDate: Date;

  switch (period.toLowerCase()) {
    case 'day':
      startDate = new Date(referenceDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(referenceDate);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'week':
      // Asumiendo que la semana empieza el lunes
      const dayOfWeek = referenceDate.getDay(); // 0 (domingo) - 6 (sábado)
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajuste para que la semana empiece el lunes
      startDate = new Date(referenceDate);
      startDate.setDate(referenceDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      break;

    case 'month':
      startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
      break;

    case 'year':
      startDate = new Date(referenceDate.getFullYear(), 0, 1);
      endDate = new Date(referenceDate.getFullYear() + 1, 0, 1);
      break;

    default:
      throw new Error('Parámetro "period" inválido. Valores permitidos: day, week, month, year.');
  }

  return { startDate, endDate };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period'); // 'day', 'week', 'month', 'year'
    const dateStr = searchParams.get('date'); // 'YYYY-MM-DD'

    // Validación de parámetros
    if (!period || !dateStr) {
      return NextResponse.json(
        { error: 'Faltan parámetros "period" o "date".' },
        { status: 400 }
      );
    }

    const referenceDate = new Date(dateStr);
    if (isNaN(referenceDate.getTime())) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use "YYYY-MM-DD".' },
        { status: 400 }
      );
    }

    let startDate: Date;
    let endDate: Date;

    try {
      const range = calculateDateRange(period, referenceDate);
      startDate = range.startDate;
      endDate = range.endDate;
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    // Consulta a la base de datos para obtener las ventas agregadas por producto
    const sales = await prisma.$queryRaw<
      Array<{
        productId: number;
        nombre: string;
        totalSold: number;
        totalRevenue: number;
        totalCost: number;
        profit: number;
      }>
    >`
      SELECT 
        ip."productId", 
        p.nombre, 
        SUM(ip.cantidad) AS "totalSold",
        SUM(ip.precio * ip.cantidad) AS "totalRevenue",
        SUM(ip.costo * ip.cantidad) AS "totalCost",
        SUM((ip.precio - ip.costo) * ip.cantidad) AS "profit"
      FROM 
        "InvoiceProducts" ip
      JOIN 
        "Product" p ON ip."productId" = p.id
      JOIN 
        "Invoice" i ON ip."invoiceId" = i.id
      WHERE 
        i.fecha >= ${startDate} AND i.fecha < ${endDate} AND i.estado = 'FACTURADO'
      GROUP BY 
        ip."productId", p.nombre
      ORDER BY 
        "profit" DESC;
    `;

    const formattedSales = sales.map((item) => ({
      id: item.productId,
      nombre: item.nombre,
      totalSold: Number(item.totalSold),
      totalRevenue: Number(item.totalRevenue),
      totalCost: Number(item.totalCost),
      profit: Number(item.profit),
    }));

    // Calcular los totales generales
    const totalRevenue = formattedSales.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const totalCost = formattedSales.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalProfit = formattedSales.reduce((acc, curr) => acc + curr.profit, 0);

    return NextResponse.json({
      period,
      date: dateStr,
      sales: formattedSales,
      totals: {
        totalRevenue,
        totalCost,
        totalProfit,
      },
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

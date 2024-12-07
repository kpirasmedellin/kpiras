import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toZonedTime, format } from 'date-fns-tz';

const prisma = new PrismaClient();

// POST: Crear Invoice
export async function POST(req: NextRequest) {
  try {
    const {
      clientId,
      products,
      descuento,
      total,
      estado,
      observaciones,
      turnoId,
      fecha, // Se espera que `fecha` venga del cliente en formato ISO
    } = await req.json();

    // Si la fecha no es proporcionada, usar la fecha actual
    const fechaDate = fecha ? new Date(fecha) : new Date();

    // Convertir la fecha al horario de Colombia (zona horaria "America/Bogota")
    const colombiaDate = toZonedTime(fechaDate, 'America/Bogota');

    // Mostrar la fecha en consola para verificar
    console.log('Fecha en zona horaria de Colombia:', format(colombiaDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Bogota' }));

    const newInvoice = await prisma.invoice.create({
      data: {
        clientId: clientId || null,
        descuento: descuento || 0,
        total,
        estado,
        observaciones: observaciones || '',
        turnoId: turnoId || null,
        fecha: colombiaDate, // Usar la fecha convertida
        InvoiceProducts: {
          create: products.map((prod: { id: number; cantidad: number; costo: number; precio: number }) => ({
            productId: prod.id,
            cantidad: prod.cantidad,
            costo: prod.costo,
            precio: prod.precio,
          })),
        },
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error al crear Invoice:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

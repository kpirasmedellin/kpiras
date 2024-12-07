// app/api/invoice/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Crear Invoice
export async function POST(req: NextRequest) {
  try {
    const { clientId, products, descuento, total, estado, observaciones, turnoId, fecha } = await req.json();


    const newInvoice = await prisma.invoice.create({
      data: {
        clientId: clientId || null,
        descuento: descuento || 0,
        total,
        estado,
        observaciones: observaciones || '',
        turnoId: turnoId || null,
        fecha, // Establecer la fecha correcta
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

// GET: Obtener Invoices
export async function GET(req: NextRequest) {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        InvoiceProducts: {
          include: { product: true }, // Incluye detalles del producto
        },
      },
    });
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error('Error al obtener Invoices:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

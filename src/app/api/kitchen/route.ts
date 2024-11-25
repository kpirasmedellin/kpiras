import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { clientId, products, observaciones } = await req.json();

    console.log('Datos recibidos en /api/kitchen:', { clientId, products, observaciones });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un producto' },
        { status: 400 }
      );
    }

    const newKitchen = await prisma.kitchen.create({
      data: {
        clientId: clientId || null,
        observaciones,
        KitchenProducts: {
          create: products.map((prod: { id: number; cantidad: number; costo: number; precio: number }) => ({
            productId: prod.id,
            cantidad: prod.cantidad,
            costo: prod.costo,
            precio: prod.precio,
          })),
        },
      },
    });

    console.log('Ticket de cocina creado:', newKitchen);
    return NextResponse.json(newKitchen, { status: 201 });
  } catch (error) {
    console.error('Error al crear ticket de cocina:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET: Obtener Kitchens
export async function GET(req: NextRequest) {
  try {
    const kitchens = await prisma.kitchen.findMany({
      include: {
        client: true,
        KitchenProducts: {
          include: { product: true }, // Incluye detalles del producto
        },
      },
    });
    return NextResponse.json(kitchens, { status: 200 });
  } catch (error) {
    console.error('Error al obtener Kitchens:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener productos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriaId = searchParams.get('categoriaId');

    const products = await prisma.product.findMany({
      where: categoriaId ? { categoriaId: parseInt(categoriaId, 10) } : undefined,
      include: {
        categoria: true, // Incluye los datos de la categoría relacionada
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear producto
export async function POST(req: NextRequest) {
  try {
    const { nombre, urlImagen, costo, precio, categoriaId } = await req.json();

    if (!nombre || !costo || !precio || !categoriaId) {
      return NextResponse.json({ error: 'Datos faltantes' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        nombre,
        urlImagen,
        costo,
        precio,
        categoriaId,
        estado: "ACTIVO", // Estado predeterminado

      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH: Actualizar producto
export async function PATCH(req: NextRequest) {
  try {
    const { id, nombre, urlImagen, costo, precio, estado } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID del producto requerido' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(urlImagen && { urlImagen }),
        ...(costo && { costo }),
        ...(precio && { precio }),
        ...(estado && { estado }),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

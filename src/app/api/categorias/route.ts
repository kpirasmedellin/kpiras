import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener categorías
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        productos: true, // Incluye los productos relacionados con la categoría
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear categoría
export async function POST(req: NextRequest) {
    try {
      const { nombre, estado = "ACTIVO" } = await req.json(); // Asigna "ACTIVO" por defecto
  
      if (!nombre) {
        return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
      }
  
      const newCategory = await prisma.category.create({
        data: {
          nombre,
          estado, // "ACTIVO" se utilizará si no se proporciona un estado
        },
      });
  
      return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
  

// PATCH: Actualizar categoría
export async function PATCH(req: NextRequest) {
  try {
    const { id, nombre, estado } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID de la categoría requerido' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(estado && { estado }),
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

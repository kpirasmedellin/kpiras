import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener producto por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { categoria: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH: Actualizar producto por ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);
    const { nombre, urlImagen, costo, precio, estado } = await req.json();

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
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

// DELETE: Eliminar producto por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Producto eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

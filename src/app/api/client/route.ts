import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener Clients
export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      include: { kitchens: true, invoices: true },
    });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error al obtener Clients:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear Client
export async function POST(req: NextRequest) {
  try {
    const { nombre, telefono, direccion } = await req.json();

    const newClient = await prisma.client.create({
      data: { nombre, telefono, direccion },
    });
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error al crear Client:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH: Actualizar Client
export async function PATCH(req: NextRequest) {
  try {
    const { id, nombre, telefono, direccion } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID del Client requerido' }, { status: 400 });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: { nombre, telefono, direccion },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar Client:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

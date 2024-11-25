import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener Turnos
export async function GET(req: NextRequest) {
  try {
    const turnos = await prisma.turno.findMany({
      include: { invoices: true },
    });
    return NextResponse.json(turnos, { status: 200 });
  } catch (error) {
    console.error('Error al obtener Turnos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear Turno
export async function POST(req: NextRequest) {
  try {
    const { codigo, horaInicio, estado } = await req.json();

    const newTurno = await prisma.turno.create({
      data: { codigo, horaInicio, estado },
    });
    return NextResponse.json(newTurno, { status: 201 });
  } catch (error) {
    console.error('Error al crear Turno:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH: Actualizar Turno
export async function PATCH(req: NextRequest) {
  try {
    const { id, horaFin, estado } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID del Turno requerido' }, { status: 400 });
    }

    const updatedTurno = await prisma.turno.update({
      where: { id },
      data: { horaFin, estado },
    });

    return NextResponse.json(updatedTurno, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar Turno:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

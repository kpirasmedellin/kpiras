import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  correo: z.string().email('Correo electrónico inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
});

const prisma = new PrismaClient();

// Asegurarnos de que JWT_SECRET exista y sea string
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { correo: validatedData.correo },
      include: {
        company: {
          select: {
            id: true,
            nombre: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (user.estado === 'DESACTIVADO') {
      return NextResponse.json(
        { error: 'Usuario desactivado' },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.contrasena,
      user.contrasena
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const tokenPayload = {
      userId: user.id,
      rol: user.rol,
      companyId: user.companyId,
    } as const;

    // Crear el token
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '8h',
      algorithm: 'HS256',
    });

    // Crear la respuesta y establecer la cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        company: user.company,
      },
    });

    // Establecer el token como una cookie
    response.cookies.set("token", token, {
      httpOnly: true,     // Solo accesible en el servidor
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      maxAge: 8 * 60 * 60, // 8 horas en segundos
      path: "/",           // Disponible en todas las rutas
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

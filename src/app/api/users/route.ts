import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Definir la interfaz para el payload del JWT
interface JwtPayload {
  userId: number;
  rol: 'ADMINISTRADOR' | 'CAJERO';
  companyId: number;
}

// Schema de validación para los datos de usuario
const userSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['ADMINISTRADOR', 'CAJERO']),
  companyId: z.number().int().positive('ID de compañía requerido'),
});

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

// Función para verificar el token y el rol
async function verifyTokenAndRole(authHeader: string | null, requiredRole?: 'ADMINISTRADOR' | 'CAJERO') {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Token de autorización requerido');
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verificar y decodificar el token con el tipo correcto
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    
    // Validar la estructura del payload
    if (!isValidJwtPayload(decoded)) {
      throw new Error('Token inválido: estructura incorrecta');
    }

    if (requiredRole && decoded.rol !== requiredRole) {
      throw new Error('No tiene permisos suficientes');
    }

    return decoded;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

// Función para validar la estructura del payload
function isValidJwtPayload(payload: unknown): payload is JwtPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'userId' in payload &&
    'rol' in payload &&
    'companyId' in payload &&
    typeof payload.userId === 'number' &&
    ['ADMINISTRADOR', 'CAJERO'].includes(payload.rol as string) &&
    typeof payload.companyId === 'number'
  );
}
// POST - Crear usuario
export async function POST(req: NextRequest) {
  try {
    // Validar el cuerpo de la solicitud
    const body = await req.json();
    const validatedData = userSchema.parse(body);
    
    // Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({
      where: { correo: validatedData.correo }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 409 }
      );
    }

    // Verificar que la compañía existe
    const company = await prisma.company.findUnique({
      where: { id: validatedData.companyId }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'La compañía especificada no existe' },
        { status: 404 }
      );
    }

    const usersCount = await prisma.user.count();
    if (usersCount > 0) {
      const authHeader = req.headers.get('authorization');
      await verifyTokenAndRole(authHeader, 'ADMINISTRADOR');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.contrasena, salt);

    const newUser = await prisma.user.create({
      data: {
        nombre: validatedData.nombre,
        correo: validatedData.correo,
        contrasena: passwordHash,
        rol: usersCount === 0 ? 'ADMINISTRADOR' : validatedData.rol,
        estado: 'ACTIVO',
        companyId: validatedData.companyId,
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        estado: true,
        company: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de usuario inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: error instanceof Error ? 401 : 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
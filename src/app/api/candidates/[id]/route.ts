// RUTA: src/app/api/admin/candidates/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Middleware para verificar que es admin
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return { error: 'No autenticado', status: 401 };
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return { error: 'Token inválido', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user || user.role !== 'admin') {
    return { error: 'Acceso denegado - Solo administradores', status: 403 };
  }

  return { user };
}

/**
 * GET /api/admin/candidates/[id]
 * Obtener un candidato específico
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const candidateId = parseInt(id);

    if (isNaN(candidateId)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        experiences: {
          orderBy: { fechaInicio: 'desc' }
        }
      }
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }

    // Calcular edad
    let edad = null;
    if (candidate.fechaNacimiento) {
      const today = new Date();
      const birth = new Date(candidate.fechaNacimiento);
      edad = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        edad--;
      }
    }

    return NextResponse.json({
      success: true,
      data: { ...candidate, edad }
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener candidato' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/candidates/[id]
 * Actualizar candidato
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const candidateId = parseInt(id);

    if (isNaN(candidateId)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar que existe
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!existingCandidate) {
      return NextResponse.json(
        { success: false, error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      telefono,
      sexo,
      fechaNacimiento,
      universidad,
      carrera,
      nivelEstudios,
      profile,
      seniority,
      cvUrl,
      portafolioUrl,
      linkedinUrl,
      source,
      notas,
      status,
      experiences // Array de experiencias (opcional, para reemplazar)
    } = body;

    // Si cambia el email, verificar que no exista
    if (email && email !== existingCandidate.email) {
      const emailExists = await prisma.candidate.findUnique({
        where: { email }
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Ya existe un candidato con ese email' },
          { status: 409 }
        );
      }
    }

    // Calcular años de experiencia si se envían experiencias
    let añosExperiencia = existingCandidate.añosExperiencia;
    if (experiences && experiences.length > 0) {
      const today = new Date();
      let totalMonths = 0;

      for (const exp of experiences) {
        const start = new Date(exp.fechaInicio);
        const end = exp.fechaFin ? new Date(exp.fechaFin) : today;
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }

      añosExperiencia = Math.round(totalMonths / 12);
    }

    // Actualizar candidato
    const updateData: any = {
      ...(nombre && { nombre }),
      ...(apellidoPaterno && { apellidoPaterno }),
      ...(apellidoMaterno !== undefined && {
        apellidoMaterno: apellidoMaterno || null
      }),
      ...(email && { email }),
      ...(telefono !== undefined && { telefono: telefono || null }),
      ...(sexo !== undefined && { sexo: sexo || null }),
      ...(fechaNacimiento !== undefined && {
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null
      }),
      ...(universidad !== undefined && { universidad: universidad || null }),
      ...(carrera !== undefined && { carrera: carrera || null }),
      ...(nivelEstudios !== undefined && {
        nivelEstudios: nivelEstudios || null
      }),
      ...(profile !== undefined && { profile: profile || null }),
      ...(seniority !== undefined && { seniority: seniority || null }),
      ...(cvUrl !== undefined && { cvUrl: cvUrl || null }),
      ...(portafolioUrl !== undefined && {
        portafolioUrl: portafolioUrl || null
      }),
      ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl || null }),
      ...(source !== undefined && { source: source || 'manual' }),
      ...(notas !== undefined && { notas: notas || null }),
      ...(status !== undefined && { status }),
      añosExperiencia
    };

    // Si se envían experiencias, eliminar las viejas y crear nuevas
    if (experiences) {
      await prisma.experience.deleteMany({
        where: { candidateId }
      });

      if (experiences.length > 0) {
        await prisma.experience.createMany({
          data: experiences.map((exp: any) => ({
            candidateId,
            empresa: exp.empresa,
            puesto: exp.puesto,
            ubicacion: exp.ubicacion || null,
            fechaInicio: new Date(exp.fechaInicio),
            fechaFin: exp.fechaFin ? new Date(exp.fechaFin) : null,
            esActual: exp.esActual || false,
            descripcion: exp.descripcion || null
          }))
        });
      }
    }

    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: updateData,
      include: {
        experiences: {
          orderBy: { fechaInicio: 'desc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Candidato actualizado exitosamente',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar candidato' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/candidates/[id]
 * Eliminar candidato
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const candidateId = parseInt(id);

    if (isNaN(candidateId)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar que existe
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar (cascade eliminará las experiencias)
    await prisma.candidate.delete({
      where: { id: candidateId }
    });

    return NextResponse.json({
      success: true,
      message: 'Candidato eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar candidato' },
      { status: 500 }
    );
  }
}

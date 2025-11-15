import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas las vacantes activas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const jobType = searchParams.get('jobType') || '';

    // Construir filtros
    const where: any = {
      status: status
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva vacante
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      company,
      location,
      salary,
      jobType,
      isRemote,
      description,
      requirements,
      companyId,
      companyRating,
      expiresAt
    } = body;

    // Validaciones básicas
    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !jobType ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Faltan campos requeridos: title, company, location, salary, jobType, description'
        },
        { status: 400 }
      );
    }

    // Crear vacante
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salary,
        jobType,
        isRemote: isRemote || false,
        description,
        requirements: requirements || null,
        companyId: companyId || null,
        companyRating: companyRating || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: 'active'
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Vacante creada exitosamente',
        data: job
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

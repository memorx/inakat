// RUTA: src/app/api/pricing/calculate/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/pricing/calculate
 * Calcula el costo en créditos de una vacante según la matriz de precios
 *
 * Body: { profile, seniority, workMode, location? }
 * Response: { credits, found, pricing }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile, seniority, workMode, location } = body;

    // Validar campos requeridos
    if (!profile || !seniority || !workMode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos requeridos: profile, seniority, workMode'
        },
        { status: 400 }
      );
    }

    // Buscar en la matriz de precios
    // Primero intentar con location específica
    let pricing = await prisma.pricingMatrix.findFirst({
      where: {
        profile,
        seniority,
        workMode,
        location: location || null,
        isActive: true
      }
    });

    // Si no encuentra con location, buscar sin location
    if (!pricing && location) {
      pricing = await prisma.pricingMatrix.findFirst({
        where: {
          profile,
          seniority,
          workMode,
          location: null,
          isActive: true
        }
      });
    }

    if (!pricing) {
      // Si no hay precio definido, usar un valor por defecto
      return NextResponse.json({
        success: true,
        found: false,
        credits: 5, // Valor por defecto
        message: 'No se encontró precio específico, usando valor por defecto',
        query: { profile, seniority, workMode, location }
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      credits: pricing.credits,
      pricing: {
        id: pricing.id,
        profile: pricing.profile,
        seniority: pricing.seniority,
        workMode: pricing.workMode,
        location: pricing.location
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    return NextResponse.json(
      { success: false, error: 'Error al calcular precio' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pricing/calculate
 * Obtener los valores disponibles para la matriz de precios
 */
export async function GET() {
  try {
    // Obtener valores únicos de la matriz
    const profiles = await prisma.pricingMatrix.findMany({
      where: { isActive: true },
      select: { profile: true },
      distinct: ['profile']
    });

    const seniorities = await prisma.pricingMatrix.findMany({
      where: { isActive: true },
      select: { seniority: true },
      distinct: ['seniority']
    });

    const workModes = await prisma.pricingMatrix.findMany({
      where: { isActive: true },
      select: { workMode: true },
      distinct: ['workMode']
    });

    const locations = await prisma.pricingMatrix.findMany({
      where: { isActive: true, location: { not: null } },
      select: { location: true },
      distinct: ['location']
    });

    return NextResponse.json({
      success: true,
      options: {
        profiles: profiles.map((p) => p.profile),
        seniorities: seniorities.map((s) => s.seniority),
        workModes: workModes.map((w) => w.workMode),
        locations: locations.map((l) => l.location).filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Error fetching pricing options:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener opciones' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Filter by category name if provided
    const where = category
      ? { category: { name: category } }
      : {};

    const entries = await prisma.business.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { category: true }, // optional: fetch category info too
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching yellow book entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

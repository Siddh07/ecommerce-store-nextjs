// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const products = await prisma.product.findMany({
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// ✅ ADD THIS BELOW THE GET FUNCTION
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Read the data sent from the form

    // 1. Validation: Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { title: body.title }
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'Product already exists' }, { status: 400 });
    }

    // 2. Create the Product
    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price), // Convert string "99.99" to number
        category: body.category,
        thumbnail: body.thumbnail,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
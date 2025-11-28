// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Clear old data (Safety first!)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    // 2. Fetch from DummyJSON
    const res = await fetch('https://dummyjson.com/products?limit=100');
    const data = await res.json();
    const products = data.products;

    // 3. Save to SQLite
    for (const product of products) {
      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          category: product.category,
          rating: product.rating,
          stock: product.stock,
        },
      });
    }

    return NextResponse.json({ message: `Success! Seeded ${products.length} products.` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
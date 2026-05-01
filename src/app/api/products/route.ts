import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const products = await prisma.product.findMany({
    where,
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const product = await prisma.product.create({
    data: {
      title: body.title,
      slug,
      type: body.type,
      description: body.description || "",
      price: body.price ? parseInt(body.price) : 0,
      originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
      imageUrl: body.imageUrl || null,
      gradient: body.gradient || "linear-gradient(135deg, #667eea, #764ba2)",
      badge: body.badge || null,
      material: body.material || null,
      sizes: body.sizes || null,
      inStock: body.inStock !== false,
      ...(body.additionalImages?.length > 0 && {
        images: {
          create: body.additionalImages.map((img: { url: string; label?: string }, i: number) => ({
            url: img.url,
            label: img.label || null,
            sortOrder: i,
          })),
        },
      }),
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  // Delete old additional images if new ones provided
  if (body.additionalImages !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: body.id } });
  }

  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      price: body.price ? parseInt(body.price) : 0,
      originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
      imageUrl: body.imageUrl,
      gradient: body.gradient,
      badge: body.badge || null,
      material: body.material,
      sizes: body.sizes,
      inStock: body.inStock,
      ...(body.additionalImages?.length > 0 && {
        images: {
          create: body.additionalImages.map((img: { url: string; label?: string }, i: number) => ({
            url: img.url,
            label: img.label || null,
            sortOrder: i,
          })),
        },
      }),
    },
    include: { images: true },
  });
  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

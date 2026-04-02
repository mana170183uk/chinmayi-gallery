import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/artworks/[id] - get a single artwork by slug or id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const artwork = await prisma.artwork.findFirst({
    where: {
      OR: [{ slug: id }, { id }],
    },
  });

  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }

  return NextResponse.json(artwork);
}

// PUT /api/artworks/[id] - update an artwork
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const slug = body.title
    ? body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : undefined;

  const artwork = await prisma.artwork.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(slug && { slug }),
      ...(body.category && { category: body.category }),
      ...(body.medium && { medium: body.medium }),
      ...(body.dimensions && { dimensions: body.dimensions }),
      ...(body.year && { year: parseInt(body.year) }),
      ...(body.price && { price: parseInt(body.price) }),
      ...(body.framedPrice !== undefined && { framedPrice: body.framedPrice ? parseInt(body.framedPrice) : null }),
      ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null }),
      ...(body.description && { description: body.description }),
      ...(body.gradient && { gradient: body.gradient }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.aspectRatio && { aspectRatio: body.aspectRatio }),
      ...(body.badge !== undefined && { badge: body.badge || null }),
      ...(body.collection && { collection: body.collection }),
      ...(body.featured !== undefined && { featured: body.featured }),
    },
  });

  return NextResponse.json(artwork);
}

// DELETE /api/artworks/[id] - delete an artwork
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.artwork.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

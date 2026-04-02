import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/artworks - list all artworks with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const collection = searchParams.get("collection");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort");
  const limit = searchParams.get("limit");

  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;
  if (collection) where.collection = collection;
  if (featured === "true") where.featured = true;

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };
  if (sort === "newest") orderBy = { year: "desc" };

  const artworks = await prisma.artwork.findMany({
    where,
    orderBy,
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(artworks);
}

// POST /api/artworks - create a new artwork
export async function POST(request: NextRequest) {
  const body = await request.json();

  const slug = body.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const artwork = await prisma.artwork.create({
    data: {
      title: body.title,
      slug,
      category: body.category,
      medium: body.medium,
      dimensions: body.dimensions,
      year: parseInt(body.year),
      price: body.price ? parseInt(body.price) : 0,
      framedPrice: body.framedPrice ? parseInt(body.framedPrice) : null,
      originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
      description: body.description,
      gradient: body.gradient,
      imageUrl: body.imageUrl || null,
      aspectRatio: body.aspectRatio || "3/4",
      badge: body.badge || null,
      collection: body.collection || body.category,
      featured: body.featured || false,
    },
  });

  return NextResponse.json(artwork, { status: 201 });
}

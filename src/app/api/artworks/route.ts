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
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const baseSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure slug uniqueness — append suffix if collision
    let slug = baseSlug || `artwork-${Date.now()}`;
    let suffix = 1;
    while (await prisma.artwork.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    const artwork = await prisma.artwork.create({
      data: {
        title: body.title,
        slug,
        category: body.category || "contemporary",
        medium: body.medium || "Mixed Media",
        dimensions: body.dimensions || "",
        year: body.year ? parseInt(body.year) : new Date().getFullYear(),
        price: body.price ? parseInt(body.price) : 0,
        framedPrice: body.framedPrice ? parseInt(body.framedPrice) : null,
        originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
        description: body.description || "",
        gradient: body.gradient || "linear-gradient(135deg, #667eea, #764ba2)",
        imageUrl: body.imageUrl || null,
        aspectRatio: body.aspectRatio || "3/4",
        badge: body.badge || null,
        collection: body.collection || body.category || "contemporary",
        featured: body.featured || false,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create artwork";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

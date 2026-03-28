import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Get artwork counts per collection
  const withCounts = await Promise.all(
    collections.map(async (col) => {
      const count = await prisma.artwork.count({
        where: { collection: col.slug },
      });
      return { ...col, count };
    })
  );

  return NextResponse.json(withCounts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const collection = await prisma.collection.create({
    data: {
      slug,
      title: body.title,
      description: body.description || "",
      gradient: body.gradient || "linear-gradient(135deg, #667eea, #764ba2)",
      sortOrder: body.sortOrder || 0,
    },
  });

  return NextResponse.json(collection, { status: 201 });
}

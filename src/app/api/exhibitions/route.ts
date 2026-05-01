import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    });
    return NextResponse.json(exhibitions);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const exhibition = await prisma.exhibition.create({
      data: {
        year: body.year || "",
        title: body.title || "",
        venue: body.venue || "",
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(exhibition, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const exhibition = await prisma.exhibition.update({
      where: { id: body.id },
      data: {
        year: body.year,
        title: body.title,
        venue: body.venue,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(exhibition);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.exhibition.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

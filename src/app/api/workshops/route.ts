import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(workshops);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workshop = await prisma.workshop.create({
      data: {
        title: body.title || "",
        date: body.date || "",
        description: body.description || "",
        imageUrl: body.imageUrl || null,
        location: body.location || null,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const workshop = await prisma.workshop.update({
      where: { id: body.id },
      data: {
        title: body.title,
        date: body.date,
        description: body.description,
        imageUrl: body.imageUrl || null,
        location: body.location || null,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(workshop);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.workshop.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.text) {
      return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.role || "",
        text: body.text,
        avatar: (body.avatar || body.name.charAt(0)).toUpperCase(),
        avatarGradient: body.avatarGradient || "linear-gradient(135deg, #667eea, #764ba2)",
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.update({
      where: { id: body.id },
      data: {
        name: body.name,
        role: body.role || "",
        text: body.text,
        avatar: (body.avatar || body.name.charAt(0)).toUpperCase(),
        avatarGradient: body.avatarGradient || "linear-gradient(135deg, #667eea, #764ba2)",
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

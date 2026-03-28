import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      role: body.role,
      text: body.text,
      avatar: body.name.charAt(0).toUpperCase(),
      avatarGradient: body.avatarGradient || "linear-gradient(135deg, #667eea, #764ba2)",
      sortOrder: body.sortOrder || 0,
    },
  });
  return NextResponse.json(testimonial, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { artwork: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: body.id },
      data: {
        status: body.status,
        ...(body.shippingAddress !== undefined && { shippingAddress: body.shippingAddress || null }),
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

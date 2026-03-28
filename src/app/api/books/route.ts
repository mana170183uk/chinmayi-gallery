import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const book = await prisma.book.create({
    data: {
      title: body.title,
      slug,
      author: body.author || "Chinmayi",
      description: body.description || "",
      price: body.price ? parseInt(body.price) : null,
      imageUrl: body.imageUrl || null,
      pdfUrl: body.pdfUrl || null,
      amazonUrl: body.amazonUrl || null,
      gradient: body.gradient || "linear-gradient(135deg, #667eea, #764ba2)",
      badge: body.badge || null,
      pages: body.pages ? parseInt(body.pages) : null,
      isbn: body.isbn || null,
      publishYear: body.publishYear ? parseInt(body.publishYear) : null,
      inStock: body.inStock !== false,
    },
  });

  return NextResponse.json(book, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const book = await prisma.book.update({
    where: { id: body.id },
    data: {
      title: body.title,
      author: body.author,
      description: body.description,
      price: body.price ? parseInt(body.price) : null,
      imageUrl: body.imageUrl,
      pdfUrl: body.pdfUrl,
      amazonUrl: body.amazonUrl,
      gradient: body.gradient,
      badge: body.badge || null,
      pages: body.pages ? parseInt(body.pages) : null,
      isbn: body.isbn,
      publishYear: body.publishYear ? parseInt(body.publishYear) : null,
      inStock: body.inStock,
    },
  });
  return NextResponse.json(book);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.book.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

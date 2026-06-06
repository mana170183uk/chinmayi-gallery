import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const book = await prisma.book.create({
      data: {
        title: body.title,
        slug,
        author: body.author || "Chinmayi",
        description: body.description || "",
        price: body.price ? parseInt(body.price) : null,
        originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
        imageUrl: body.imageUrl || null,
        pdfUrl: body.pdfUrl || null,
        amazonUrl: body.amazonUrl || null,
        gradient: body.gradient || "linear-gradient(135deg, #667eea, #764ba2)",
        badge: body.badge || null,
        pages: body.pages ? parseInt(body.pages) : null,
        isbn: body.isbn || null,
        publishYear: body.publishYear ? parseInt(body.publishYear) : null,
        inStock: body.inStock !== false,
        ...(body.additionalImages?.length > 0 && {
          images: {
            create: body.additionalImages.map((img: { url: string; label?: string }, i: number) => ({
              url: img.url,
              label: img.label || null,
              sortOrder: i,
            })),
          },
        }),
      },
      include: { images: true },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.additionalImages !== undefined) {
      await prisma.bookImage.deleteMany({ where: { bookId: body.id } });
    }

    const book = await prisma.book.update({
      where: { id: body.id },
      data: {
        title: body.title,
        author: body.author,
        description: body.description,
        price: body.price ? parseInt(body.price) : null,
        originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
        imageUrl: body.imageUrl,
        pdfUrl: body.pdfUrl,
        amazonUrl: body.amazonUrl,
        gradient: body.gradient,
        badge: body.badge || null,
        pages: body.pages ? parseInt(body.pages) : null,
        isbn: body.isbn,
        publishYear: body.publishYear ? parseInt(body.publishYear) : null,
        inStock: body.inStock,
        ...(body.additionalImages?.length > 0 && {
          images: {
            create: body.additionalImages.map((img: { url: string; label?: string }, i: number) => ({
              url: img.url,
              label: img.label || null,
              sortOrder: i,
            })),
          },
        }),
      },
      include: { images: true },
    });
    return NextResponse.json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import BooksClient from "@/components/BooksClient";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  let books: Record<string, unknown>[] = [];
  try { books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } }); } catch {}
  return <BooksClient books={JSON.parse(JSON.stringify(books))} />;
}

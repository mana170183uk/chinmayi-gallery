"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { addToCart } from "@/lib/store";

interface BookImage {
  id: string;
  url: string;
  label?: string | null;
  sortOrder: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price?: number | null;
  imageUrl?: string | null;
  pdfUrl?: string | null;
  amazonUrl?: string | null;
  gradient: string;
  badge?: string | null;
  pages?: number | null;
  isbn?: string | null;
  publishYear?: number | null;
  images?: BookImage[];
}

function BookCard({ book, index }: { book: Book; index: number }) {
  const allImages: BookImage[] = [
    ...(book.imageUrl ? [{ id: "main", url: book.imageUrl, label: "Cover", sortOrder: -1 }] : []),
    ...(book.images || []),
  ];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeImage = allImages[selectedIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="rounded-xl overflow-hidden border group transition-all hover:-translate-y-2"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--art-shadow)" }}
    >
      {/* Cover Image (or selected thumbnail) */}
      <div className="relative aspect-[3/4] overflow-hidden" style={{ background: book.gradient }}>
        {activeImage && (
          <img
            src={activeImage.url}
            alt={activeImage.label || book.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        {book.badge && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
            style={{
              background: book.badge === "bestseller" ? "var(--gold)" : "var(--emerald)",
              color: book.badge === "bestseller" ? "#1A1830" : "#fff",
            }}
          >
            {book.badge}
          </span>
        )}
        {activeImage?.label && selectedIdx > 0 && (
          <div
            className="absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-medium backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
          >
            {activeImage.label}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only when there are extra images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
          {allImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIdx(i)}
              className="flex-shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all"
              style={{
                borderColor: selectedIdx === i ? "var(--gold)" : "var(--border)",
                opacity: selectedIdx === i ? 1 : 0.6,
              }}
              title={img.label || `View ${i + 1}`}
            >
              <img src={img.url} alt={img.label || ""} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-6">
        <h3 className="font-[Cormorant_Garamond] text-[22px] font-semibold mb-1">{book.title}</h3>
        <p className="text-[13px] mb-3" style={{ color: "var(--gold)" }}>by {book.author}</p>
        <p className="text-[14px] line-clamp-3 mb-4 leading-relaxed" style={{ color: "var(--text2)" }}>{book.description}</p>

        <div className="flex gap-4 mb-4 text-[12px]" style={{ color: "var(--text3)" }}>
          {book.pages && <span>{book.pages} pages</span>}
          {book.publishYear && <span>{book.publishYear}</span>}
          {book.isbn && <span>ISBN: {book.isbn}</span>}
        </div>

        {book.price && (
          <div className="font-semibold text-[18px] mb-4" style={{ color: "var(--gold)" }}>
            £{book.price.toLocaleString()}
          </div>
        )}

        <div className="flex gap-2 mb-2">
          {book.price && book.price > 0 ? (
            <button
              onClick={() =>
                addToCart(
                  {
                    id: book.id,
                    kind: "book",
                    title: book.title,
                    price: book.price as number,
                    imageUrl: book.imageUrl,
                    subtitle: `by ${book.author}`,
                  },
                  "book"
                )
              }
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-md text-[13px] font-bold tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
            >
              Add to Cart
            </button>
          ) : null}
          <Link
            href={`/contact?subject=Book%20Enquiry&item=${encodeURIComponent(book.title)}`}
            className="flex-1 inline-flex items-center justify-center py-3 rounded-md text-[12px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Make an Enquiry
          </Link>
        </div>

        {(book.amazonUrl || book.pdfUrl) && (
          <div className="flex gap-3 text-[12px] mt-2" style={{ color: "var(--text3)" }}>
            {book.amazonUrl && (
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--gold)] transition-colors"
              >
                Buy on Amazon &rarr;
              </a>
            )}
            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--gold)] transition-colors"
              >
                Download PDF &rarr;
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function BooksClient({ books }: { books: Book[] }) {
  return (
    <section className="min-h-screen pt-44 pb-24 px-6 md:px-14 relative z-[1]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
          <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Library
        </div>
        <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">Books</h1>
        <p className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
          Art books, catalogues, and written works by Chinmayi
        </p>
      </motion.div>

      {books.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--text3)" }}>
          <div className="text-5xl mb-4">📚</div>
          <p>No books yet</p>
          <p className="text-[13px] mt-2">Check back soon for new publications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

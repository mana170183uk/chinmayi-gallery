"use client";

import { motion } from "framer-motion";

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
}

export default function BooksClient({ books }: { books: Book[] }) {
  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-14 relative z-[1]">
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
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="rounded-xl overflow-hidden border group transition-all hover:-translate-y-2"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--art-shadow)" }}
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden" style={{ background: book.gradient }}>
                {book.imageUrl && (
                  <img src={book.imageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                )}
                {book.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10" style={{ background: book.badge === "bestseller" ? "var(--gold)" : "var(--emerald)", color: book.badge === "bestseller" ? "#1A1830" : "#fff" }}>
                    {book.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-[Cormorant_Garamond] text-[22px] font-semibold mb-1">{book.title}</h3>
                <p className="text-[13px] mb-3" style={{ color: "var(--gold)" }}>by {book.author}</p>
                <p className="text-[14px] line-clamp-3 mb-4 leading-relaxed" style={{ color: "var(--text2)" }}>{book.description}</p>

                {/* Details */}
                <div className="flex gap-4 mb-4 text-[12px]" style={{ color: "var(--text3)" }}>
                  {book.pages && <span>{book.pages} pages</span>}
                  {book.publishYear && <span>{book.publishYear}</span>}
                  {book.isbn && <span>ISBN: {book.isbn}</span>}
                </div>

                {/* Price */}
                {book.price && (
                  <div className="font-semibold text-[18px] mb-4" style={{ color: "var(--gold)" }}>
                    £{book.price.toLocaleString()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {book.amazonUrl && (
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
                    >
                      🛒 Buy on Amazon
                    </a>
                  )}
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-md text-[13px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      style={{ borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      📄 Download PDF
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

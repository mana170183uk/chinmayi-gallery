"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeImage = allImages[selectedIdx];
  const extraCount = Math.max(allImages.length - 1, 0);

  // Preload every image so swapping is instant (no blank flicker between paints)
  useEffect(() => {
    allImages.forEach((img) => {
      const i = new window.Image();
      i.src = img.url;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="rounded-xl overflow-hidden border group transition-all hover:-translate-y-2"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--art-shadow)" }}
    >
      {/* Cover image area — clicking it opens the full-screen lightbox.
          The active page is rendered as ONE <img>, with all other pages
          painted as transparent background-image layers behind it. That
          way the visible card is always a single composited image (no
          flicker from React swapping the <img> src, no hover-scale on
          inactive layers fighting with opacity, no z-index race). */}
      <div className="relative aspect-[3/4] overflow-hidden" style={{ background: book.gradient }}>
        {/* Behind-the-scenes preloaded layers. Pointer-events disabled so
            they never intercept the user's click and never get hovered. */}
        {allImages.map((img, i) => (
          i !== selectedIdx && (
            <div
              key={img.id}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${img.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0,
              }}
            />
          )
        ))}

        {/* Active page. Re-rendering this <img> on selectedIdx change is
            instant because all sources are preloaded in useEffect above. */}
        {activeImage && (
          <img
            key={activeImage.id}
            src={activeImage.url}
            alt={activeImage.label || book.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ zIndex: 1 }}
          />
        )}

        {/* The whole cover area is one big click target that opens lightbox.
            Sitting above the image with z-2, but transparent. */}
        <button
          type="button"
          aria-label={`View ${book.title} full size`}
          onClick={() => allImages.length > 0 && setLightboxOpen(true)}
          className="absolute inset-0 w-full h-full cursor-zoom-in"
          style={{ zIndex: 2, background: "transparent" }}
        />

        {book.badge && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase pointer-events-none"
            style={{
              background: book.badge === "bestseller" ? "var(--gold)" : "var(--emerald)",
              color: book.badge === "bestseller" ? "#1A1830" : "#fff",
              zIndex: 3,
            }}
          >
            {book.badge}
          </span>
        )}
        {extraCount > 0 && (
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md pointer-events-none"
            style={{ background: "rgba(0,0,0,0.55)", color: "#fff", zIndex: 3 }}
          >
            +{extraCount} {extraCount === 1 ? "page" : "pages"}
          </span>
        )}
        {activeImage?.label && selectedIdx > 0 && (
          <div
            className="absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-medium backdrop-blur-md pointer-events-none"
            style={{ background: "rgba(0,0,0,0.6)", color: "white", zIndex: 3 }}
          >
            {activeImage.label}
          </div>
        )}
      </div>

      {/* Thumbnail strip — clicking a thumbnail just SWITCHES the page
          shown above (no lightbox). The user can browse pages in place
          and only open the lightbox by clicking the cover or a second
          time on the active thumbnail. */}
      {allImages.length > 1 && (
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--gold)" }}>
            Look inside &mdash; tap a page to preview
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                type="button"
                key={img.id}
                onClick={() => {
                  if (selectedIdx === i) {
                    // Second tap on the active thumb opens the lightbox.
                    setLightboxOpen(true);
                  } else {
                    setSelectedIdx(i);
                  }
                }}
                className="flex-shrink-0 w-16 h-20 rounded overflow-hidden border-2 transition-all cursor-pointer"
                style={{
                  borderColor: selectedIdx === i ? "var(--gold)" : "var(--border)",
                  opacity: selectedIdx === i ? 1 : 0.75,
                }}
                title={selectedIdx === i ? "Tap again to zoom" : (img.label || `View page ${i + 1}`)}
                aria-label={selectedIdx === i ? `Zoom into page ${i + 1}` : `Show page ${i + 1}`}
                aria-pressed={selectedIdx === i}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex flex-col items-center justify-center cursor-zoom-out"
            style={{ background: "rgba(0,0,0,0.97)" }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              className="absolute top-3 right-3 w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-3xl sm:text-2xl transition-all hover:bg-white/10 z-10"
              style={{ background: "rgba(0,0,0,0.4)" }}
              aria-label="Close preview"
            >
              &times;
            </button>
            <img
              src={activeImage.url}
              alt={activeImage.label || book.title}
              className="max-w-[95vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}
                    className="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
                    style={{ borderColor: selectedIdx === i ? "var(--gold)" : "rgba(255,255,255,0.3)" }}
                  >
                    <img src={img.url} alt={img.label || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
    <section className="min-h-screen pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-14 relative z-[1]">
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

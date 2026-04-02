"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addToCart, toggleWishlist } from "@/lib/store";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/data/artworks";

interface Props {
  artwork: Artwork;
  related: Artwork[];
}

export default function ArtworkDetailClient({ artwork, related }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="min-h-screen pt-24 pb-24 relative z-[1]">
      {/* Breadcrumb */}
      <div className="px-6 md:px-14 mb-8 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text3)" }}>
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-[var(--gold)] transition-colors">Art Gallery</Link>
          <span>/</span>
          <span style={{ color: "var(--text)" }}>{artwork.title}</span>
        </motion.div>
      </div>

      <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          {/* Image - clickable for full view */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div
              className="rounded-2xl overflow-hidden border relative group cursor-zoom-in"
              style={{ boxShadow: "var(--art-glow), var(--art-shadow)", borderColor: "var(--border2)" }}
              onClick={() => setLightboxOpen(true)}
            >
              <div className="art-gradient relative" style={{ background: artwork.gradient, aspectRatio: artwork.aspectRatio || "3/4", minHeight: "500px" }}>
                {artwork.imageUrl && <img src={artwork.imageUrl} alt={artwork.title} className="absolute inset-0 w-full h-full object-contain" />}
              </div>
              {/* Zoom hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full text-[13px] font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                  🔍 Click to view full size
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-3" style={{ color: "var(--gold)" }}>
              {artwork.category} &bull; {artwork.year}
            </div>
            <h1 className="font-[Playfair_Display] text-[clamp(32px,4vw,48px)] font-bold mb-3">{artwork.title}</h1>
            <div className="text-[15px] italic mb-1" style={{ color: "var(--text2)" }}>{artwork.medium}</div>
            <div className="text-[14px] mb-8" style={{ color: "var(--text3)" }}>{artwork.dimensions}</div>

            <div className="mb-2">
              {artwork.badge === "sold" ? (
                <div className="font-[Playfair_Display] text-[38px] font-bold" style={{ color: "var(--rose)" }}>Sold</div>
              ) : artwork.price || artwork.framedPrice ? (
                <div className="space-y-1">
                  {artwork.price > 0 && (
                    <div className="flex items-baseline gap-3">
                      <span className="text-[13px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Unframed</span>
                      <span className="font-[Playfair_Display] text-[32px] font-bold" style={{ color: "var(--gold)" }}>£{artwork.price.toLocaleString()}</span>
                      {artwork.originalPrice && <span className="text-[16px] line-through font-normal" style={{ color: "var(--text3)" }}>£{artwork.originalPrice.toLocaleString()}</span>}
                    </div>
                  )}
                  {artwork.framedPrice && artwork.framedPrice > 0 && (
                    <div className="flex items-baseline gap-3">
                      <span className="text-[13px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Framed</span>
                      <span className="font-[Playfair_Display] text-[32px] font-bold" style={{ color: "var(--gold)" }}>£{artwork.framedPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-[Playfair_Display] text-[22px]" style={{ color: "var(--text3)" }}>Contact for price</div>
              )}
            </div>
            <div className="text-[12px] mb-8" style={{ color: "var(--text3)" }}>Certificate of Authenticity included</div>

            {artwork.badge !== "sold" && (
              <div className="flex gap-3 items-center flex-wrap mb-10">
                <button onClick={() => addToCart(artwork)} className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>Add to Cart</button>
                <button className="px-8 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Make an Offer</button>
                <button onClick={() => toggleWishlist(artwork.id)} className="w-[52px] h-[52px] rounded-lg inline-flex items-center justify-center border text-[20px] transition-all hover:border-[var(--rose)] hover:text-[var(--rose)]" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>♡</button>
              </div>
            )}

            <div className="border-t pt-8 mb-8" style={{ borderColor: "var(--border)" }}>
              <h4 className="text-[18px] font-semibold mb-4">About This Artwork</h4>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--text2)" }}>{artwork.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Medium", value: artwork.medium },
                { label: "Dimensions", value: artwork.dimensions },
                { label: "Year", value: String(artwork.year) },
                { label: "Category", value: artwork.category },
              ].map((d) => (
                <div key={d.label} className="p-4 rounded-lg border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>{d.label}</div>
                  <div className="text-[14px] capitalize">{d.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-8" style={{ borderColor: "var(--border)" }}>
              {["✓ Certificate of Authenticity included", "✓ Museum-grade materials and archival varnish", "✓ Professionally packaged for safe delivery"].map((item) => (
                <div key={item} className="text-[13px]" style={{ color: "var(--text2)" }}>{item}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Works */}
      {related.length > 0 && (
        <div className="px-6 md:px-14 mt-24 max-w-[1400px] mx-auto">
          <h3 className="text-[28px] font-semibold mb-8 text-center">More Like This</h3>
          <div className="masonry-grid">
            {related.map((art, i) => <ArtworkCard key={art.id} artwork={art} index={i} />)}
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center cursor-zoom-out"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:bg-white/10 z-10"
            >
              &times;
            </button>

            {/* Title bar */}
            <div className="absolute top-6 left-6 z-10">
              <h3 className="text-white text-[20px] font-[Cormorant_Garamond] font-semibold">{artwork.title}</h3>
              <p className="text-white/50 text-[13px]">{artwork.medium} &bull; {artwork.dimensions}</p>
            </div>

            {/* Full-size image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[90vw] max-h-[85vh] rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "0 0 100px rgba(212,168,67,0.15)" }}
            >
              {artwork.imageUrl ? (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="max-w-[90vw] max-h-[85vh] object-contain"
                  style={{ display: "block" }}
                />
              ) : (
                <div
                  className="art-gradient"
                  style={{
                    background: artwork.gradient,
                    width: "70vw",
                    height: "70vh",
                  }}
                />
              )}
            </motion.div>

            {/* Price and action at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
              {artwork.price > 0 && (
                <span className="text-white font-[Playfair_Display] text-[22px] font-bold" style={{ color: "var(--gold)" }}>
                  £{artwork.price.toLocaleString()}
                </span>
              )}
              {artwork.badge !== "sold" && (
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(artwork); setLightboxOpen(false); }}
                  className="px-8 py-3 rounded-md font-bold text-[12px] tracking-wider uppercase transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

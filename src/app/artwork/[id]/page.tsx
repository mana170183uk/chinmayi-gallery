"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { artworks } from "@/data/artworks";
import { addToCart, toggleWishlist } from "@/lib/store";
import ArtworkCard from "@/components/ArtworkCard";

export default function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const artwork = artworks.find((a) => a.slug === id);

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Artwork Not Found</h1>
          <Link href="/gallery" className="underline" style={{ color: "var(--gold)" }}>
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const related = artworks
    .filter((a) => a.category === artwork.category && a.id !== artwork.id)
    .slice(0, 4);

  return (
    <section className="min-h-screen pt-24 pb-24 relative z-[1]">
      {/* Breadcrumb */}
      <div className="px-6 md:px-14 mb-8 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text3)" }}>
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-[var(--gold)] transition-colors">Gallery</Link>
          <span>/</span>
          <span style={{ color: "var(--text)" }}>{artwork.title}</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-24"
          >
            <div className="rounded-2xl overflow-hidden border relative group" style={{ boxShadow: "var(--art-glow), var(--art-shadow)", borderColor: "var(--border2)" }}>
              <div className="art-gradient" style={{ background: artwork.gradient, aspectRatio: artwork.aspectRatio, minHeight: "400px" }} />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                🔍 Click to zoom
              </div>
            </div>

            {/* View in Room Mockup */}
            <div className="mt-6 rounded-xl overflow-hidden border p-8 text-center" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div className="text-[12px] tracking-wider uppercase font-semibold mb-4" style={{ color: "var(--gold)" }}>View in a Room</div>
              <div className="relative mx-auto" style={{ maxWidth: "400px" }}>
                <div className="w-full aspect-[16/10] rounded-lg flex items-center justify-center" style={{ background: "var(--bg3)" }}>
                  <div className="w-2/5 rounded border" style={{ background: artwork.gradient, aspectRatio: artwork.aspectRatio, maxHeight: "120px", borderColor: "var(--border2)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} />
                </div>
                <div className="mt-2 text-[11px]" style={{ color: "var(--text3)" }}>Simulated room view — actual size may vary</div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-3" style={{ color: "var(--gold)" }}>
              {artwork.category} &bull; {artwork.year}
            </div>

            <h1 className="font-[Playfair_Display] text-[clamp(32px,4vw,48px)] font-bold mb-3">
              {artwork.title}
            </h1>

            <div className="text-[15px] italic mb-1" style={{ color: "var(--text2)" }}>
              {artwork.medium}
            </div>
            <div className="text-[14px] mb-8" style={{ color: "var(--text3)" }}>
              {artwork.dimensions}
            </div>

            {/* Price */}
            <div className="font-[Playfair_Display] text-[38px] font-bold mb-2" style={{ color: "var(--gold)" }}>
              {artwork.badge === "sold" ? (
                <span className="text-[var(--rose)]">Sold</span>
              ) : (
                <>
                  £{artwork.price.toLocaleString()}
                  {artwork.originalPrice && (
                    <span className="text-[18px] line-through ml-3 font-normal" style={{ color: "var(--text3)" }}>
                      £{artwork.originalPrice.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="text-[12px] mb-8" style={{ color: "var(--text3)" }}>
              Free shipping worldwide &bull; Certificate of Authenticity included
            </div>

            {/* Actions */}
            {artwork.badge !== "sold" && (
              <div className="flex gap-3 items-center flex-wrap mb-10">
                <button
                  onClick={() => addToCart(artwork)}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
                >
                  Add to Cart
                </button>
                <button
                  className="px-8 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                >
                  Make an Offer
                </button>
                <button
                  onClick={() => toggleWishlist(artwork.id)}
                  className="w-[52px] h-[52px] rounded-lg inline-flex items-center justify-center border text-[20px] transition-all hover:border-[var(--rose)] hover:text-[var(--rose)]"
                  style={{ borderColor: "var(--border)", color: "var(--text2)" }}
                >
                  ♡
                </button>
              </div>
            )}

            {/* Description */}
            <div className="border-t pt-8 mb-8" style={{ borderColor: "var(--border)" }}>
              <h4 className="text-[18px] font-semibold mb-4">About This Artwork</h4>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--text2)" }}>
                {artwork.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Medium", value: artwork.medium },
                { label: "Dimensions", value: artwork.dimensions },
                { label: "Year", value: artwork.year.toString() },
                { label: "Category", value: artwork.category },
              ].map((d) => (
                <div key={d.label} className="p-4 rounded-lg border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>{d.label}</div>
                  <div className="text-[14px] capitalize">{d.value}</div>
                </div>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="space-y-3 border-t pt-8" style={{ borderColor: "var(--border)" }}>
              {[
                "✓ Certificate of Authenticity included",
                "✓ Museum-grade materials and archival varnish",
                "✓ Free worldwide shipping with insurance",
                "✓ 14-day money-back guarantee",
                "✓ Professionally packaged for safe delivery",
              ].map((item) => (
                <div key={item} className="text-[13px]" style={{ color: "var(--text2)" }}>
                  {item}
                </div>
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
            {related.map((art, i) => (
              <ArtworkCard key={art.id} artwork={art} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/data/artworks";

export default function SoldClient({ artworks }: { artworks: Artwork[] }) {
  return (
    <section className="min-h-screen pt-36 pb-24 px-6 md:px-14 relative z-[1]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
          <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Past Works
        </div>
        <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-semibold mb-4">Sold Collection</h1>
        <p className="text-[16px] max-w-[640px] mx-auto" style={{ color: "var(--text2)" }}>
          A showcase of artworks that have found their forever homes. Each piece tells a story of connection
          between the artist&apos;s vision and the collector&apos;s heart.
        </p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Link href="/gallery" className="inline-flex items-center px-6 py-2.5 rounded-md text-[12px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            ← Browse Available Work
          </Link>
          <Link href="/contact" className="inline-flex items-center px-6 py-2.5 rounded-md text-[12px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
            Commission a Similar Piece
          </Link>
        </div>
        <p className="text-[14px] mt-6" style={{ color: "var(--text3)" }}>
          {artworks.length} sold {artworks.length === 1 ? "painting" : "paintings"}
        </p>
      </motion.div>

      {artworks.length > 0 ? (
        <div className="masonry-grid max-w-[1440px] mx-auto">
          {artworks.map((art, i) => (
            <ArtworkCard key={art.id} artwork={art} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20" style={{ color: "var(--text3)" }}>
          <div className="text-5xl mb-4">🎨</div>
          <p className="text-[15px]">No sold works to display yet.</p>
          <p className="text-[13px] mt-2">Sold paintings will appear here once they find their new homes.</p>
        </div>
      )}
    </section>
  );
}

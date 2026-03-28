"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { collections, artworks } from "@/data/artworks";

export default function CollectionsPage() {
  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-14 relative z-[1]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
          <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Browse by Theme
        </div>
        <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">Collections</h1>
        <p className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
          Explore artwork grouped by mood, style and subject matter
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {collections.map((col, i) => {
          const count = artworks.filter((a) => a.collection === col.id).length;
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={`/gallery?collection=${col.id}`}>
                <div className="rounded-2xl overflow-hidden relative border group cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl" style={{ aspectRatio: "3/4", borderColor: "var(--border)" }}>
                  <div className="absolute inset-0" style={{ background: col.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 transition-all">
                    <div className="text-[11px] tracking-[2px] uppercase font-semibold mb-2" style={{ color: "var(--gold)" }}>
                      {count} Artworks
                    </div>
                    <h3 className="text-[28px] text-white mb-2">{col.title}</h3>
                    <p className="text-[14px] text-white/70 mb-4">{col.description}</p>
                    <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-wider uppercase text-white/80 group-hover:text-[var(--gold)] transition-colors">
                      View Collection →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

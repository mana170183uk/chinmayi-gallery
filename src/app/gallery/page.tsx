"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artworks, categories } from "@/data/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GalleryContent() {
  const searchParams = useSearchParams();
  const collectionFilter = searchParams.get("collection");
  const [activeFilter, setActiveFilter] = useState(collectionFilter || "all");
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let list = activeFilter === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeFilter || a.collection === activeFilter);

    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => b.year - a.year);

    return list;
  }, [activeFilter, sortBy]);

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-14 relative z-[1]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
          <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Browse Collection
        </div>
        <h1 className="text-[clamp(36px,5vw,56px)] font-semibold mb-4">The Gallery</h1>
        <p className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
          {filtered.length} original artworks available for your collection
        </p>
      </motion.div>

      {/* Filters & Sort */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 max-w-[1440px] mx-auto">
        <div className="flex gap-2.5 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-[12.5px] font-medium tracking-wide border transition-all capitalize ${
                activeFilter === cat
                  ? "border-[var(--gold)] text-[#1A1830]"
                  : "border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              }`}
              style={{
                background: activeFilter === cat ? "var(--gold)" : "transparent",
                color: activeFilter === cat ? "#1A1830" : "var(--text2)",
              }}
            >
              {cat === "all" ? "All Works" : cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg text-[13px] border outline-none cursor-pointer transition-colors"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <option value="default">Sort by: Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </motion.div>

      {/* Grid */}
      <div className="masonry-grid max-w-[1440px] mx-auto">
        {filtered.map((art, i) => (
          <ArtworkCard key={art.id} artwork={art} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: "var(--text3)" }}>
          <div className="text-5xl mb-4">🎨</div>
          <p>No artworks found in this category</p>
        </div>
      )}
    </section>
  );
}

export default function GalleryPage() {
  return (
    <Suspense>
      <GalleryContent />
    </Suspense>
  );
}

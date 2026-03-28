"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import { addToCart, toggleWishlist, getState } from "@/lib/store";

interface Props {
  artwork: Artwork;
  index: number;
}

export default function ArtworkCard({ artwork, index }: Props) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (artwork.badge !== "sold") addToCart(artwork);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(artwork.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
    >
      <Link href={`/artwork/${artwork.slug}`}>
        <motion.div
          className="rounded-xl overflow-hidden relative cursor-pointer border group"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--art-shadow)",
          }}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.4 }}
        >
          {/* Badges */}
          {artwork.badge === "sold" && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "var(--rose)" }}>
              Sold
            </span>
          )}
          {artwork.badge === "new" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "var(--emerald)" }}>
              New
            </span>
          )}
          {artwork.badge === "featured" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase z-10"
              style={{ background: "var(--gold)", color: "#1A1830" }}>
              Featured
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center text-white text-sm transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.5)" }}
              title="Add to Wishlist"
            >
              ♡
            </button>
            {artwork.badge !== "sold" && (
              <button
                onClick={handleAddToCart}
                className="w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center text-white text-sm transition-all hover:scale-110"
                style={{ background: "rgba(0,0,0,0.5)" }}
                title="Add to Cart"
              >
                🛒
              </button>
            )}
          </div>

          {/* Art Image */}
          <div
            className="art-gradient"
            style={{
              background: artwork.gradient,
              aspectRatio: artwork.aspectRatio,
            }}
          />

          {/* Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <h4 className="text-[17px] text-white font-[Cormorant_Garamond] font-semibold mb-1.5">
              {artwork.title}
            </h4>
            <div className="flex justify-between items-center text-[12px] text-white/65">
              <span>{artwork.medium}</span>
              <span className="font-semibold text-[15px]" style={{ color: "var(--gold)" }}>
                {artwork.badge === "sold"
                  ? "Sold"
                  : `£${artwork.price.toLocaleString()}`}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

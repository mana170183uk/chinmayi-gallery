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
          {artwork.badge === "unavailable" && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "#6b7280" }}>
              Unavailable
            </span>
          )}
          {artwork.badge === "new" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.6)" }}>
              New
            </span>
          )}
          {(artwork.category === "print" || artwork.category === "prints") && artwork.badge !== "sold" && artwork.badge !== "unavailable" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "#3b82f6", boxShadow: "0 0 12px rgba(59,130,246,0.5)" }}>
              Print
            </span>
          )}
          {(!artwork.badge || artwork.badge === "featured") && artwork.category !== "print" && artwork.category !== "prints" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "#22c55e", boxShadow: "0 0 12px rgba(34,197,94,0.5)" }}>
              Available
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
          <div className="relative" style={{ background: artwork.imageUrl ? "var(--bg-card)" : artwork.gradient }}>
            {artwork.imageUrl ? (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-auto block"
                loading="lazy"
              />
            ) : (
              <div className="art-gradient" style={{ aspectRatio: artwork.aspectRatio || "3/4" }} />
            )}
          </div>

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
                  : artwork.price
                    ? `£${artwork.price.toLocaleString()}`
                    : "Contact for Price"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

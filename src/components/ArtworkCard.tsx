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
          {(artwork.badge === "nfs" || artwork.badge === "unavailable") && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded text-[10px] font-semibold tracking-wider uppercase z-10"
              style={{ background: "rgba(120,120,128,0.5)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)" }}>
              NFS
            </span>
          )}
          {artwork.badge === "new" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10"
              style={{ background: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.6)" }}>
              New
            </span>
          )}
          {(artwork.category === "print" || artwork.category === "prints") && artwork.badge !== "sold" && artwork.badge !== "nfs" && artwork.badge !== "unavailable" && (
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

          {/* Always-visible title strip — stronger gradient + text shadow for legibility */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3 pt-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.7) 50%, rgba(0,0,0,0))" }}
          >
            <h4
              className="text-[15px] font-[Cormorant_Garamond] font-semibold leading-tight line-clamp-1"
              style={{ color: "#ffffff", textShadow: "0 2px 6px rgba(0,0,0,0.85)" }}
            >
              {artwork.title}
            </h4>
            <div className="flex justify-between items-center text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span className="truncate pr-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>{artwork.medium}</span>
              <span className="font-semibold text-[13px] whitespace-nowrap" style={{ color: "#FFD66B", textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                {artwork.badge === "sold"
                  ? "Sold"
                  : artwork.price
                    ? `£${artwork.price.toLocaleString()}`
                    : "Contact"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

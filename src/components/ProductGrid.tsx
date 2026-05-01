"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProductImage {
  id: string;
  url: string;
  label?: string | null;
  sortOrder: number;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price?: number | null;
  originalPrice?: number | null;
  imageUrl?: string | null;
  gradient: string;
  badge?: string | null;
  material?: string | null;
  sizes?: string | null;
  inStock: boolean;
  images?: ProductImage[];
}

export default function ProductGrid({ products, emptyMessage }: { products: Product[]; emptyMessage: string }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: "var(--text3)" }}>
        <div className="text-5xl mb-4">🛍️</div>
        <p>{emptyMessage}</p>
        <p className="text-[13px] mt-2">Check back soon for new additions</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1440px] mx-auto">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
        >
          <Link href={`/product/${p.slug}`}>
            <div
              className="rounded-xl overflow-hidden border group transition-all hover:-translate-y-2 cursor-pointer"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--art-shadow)" }}
            >
              {/* Image - full size, no cropping */}
              <div className="relative overflow-hidden" style={{ background: p.gradient }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div style={{ aspectRatio: "3/4" }} />
                )}
                {p.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-white z-10 ${p.badge === "sold" || !p.inStock ? "bg-[var(--rose)]" : p.badge === "new" ? "bg-[var(--emerald)]" : ""}`} style={p.badge === "featured" ? { background: "var(--gold)", color: "#1A1830" } : {}}>
                    {!p.inStock ? "Sold Out" : p.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-[Cormorant_Garamond] text-[18px] font-semibold mb-1 group-hover:text-[var(--gold)] transition-colors">{p.title}</h3>
                {p.material && <p className="text-[12px] mb-2" style={{ color: "var(--text3)" }}>{p.material}</p>}
                <p className="text-[13px] line-clamp-2 mb-3" style={{ color: "var(--text2)" }}>{p.description}</p>
                {p.sizes && <p className="text-[11px] mb-3" style={{ color: "var(--text3)" }}>Sizes: {p.sizes}</p>}
                <div className="flex items-center justify-between">
                  <div>
                    {p.price ? (
                      <>
                        <span className="font-semibold text-[16px]" style={{ color: "var(--gold)" }}>£{p.price.toLocaleString()}</span>
                        {p.originalPrice && <span className="text-[13px] line-through ml-2" style={{ color: "var(--text3)" }}>£{p.originalPrice.toLocaleString()}</span>}
                      </>
                    ) : (
                      <span className="text-[13px]" style={{ color: "var(--text3)" }}>Contact for price</span>
                    )}
                  </div>
                  {p.inStock && (
                    <span className="px-4 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase transition-all hover:shadow-lg" style={{ background: "var(--gold)", color: "#1A1830" }}>
                      View
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

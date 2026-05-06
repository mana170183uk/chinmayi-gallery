"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  type: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  gradient: string;
  badge?: string | null;
  material?: string | null;
  sizes?: string | null;
  inStock: boolean;
  images?: ProductImage[];
}

const typeLabels: Record<string, { label: string; href: string }> = {
  jewellery: { label: "Jewellery", href: "/jewellery" },
  clothing: { label: "Clothing", href: "/clothing" },
  "home-decor": { label: "Home Decor", href: "/home-decor" },
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const allImages = [
    ...(product.imageUrl ? [{ id: "main", url: product.imageUrl, label: "Main", sortOrder: -1 }] : []),
    ...(product.images || []),
  ];
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizeList = product.sizes ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const typeMeta = typeLabels[product.type] || { label: product.type, href: "/" };

  return (
    <section className="min-h-screen pt-32 pb-24 relative z-[1]">
      {/* Breadcrumb */}
      <div className="px-6 md:px-14 mb-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text3)" }}>
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <span>/</span>
          <Link href={typeMeta.href} className="hover:text-[var(--gold)] transition-colors">{typeMeta.label}</Link>
          <span>/</span>
          <span style={{ color: "var(--text)" }}>{product.title}</span>
        </div>
      </div>

      <div className="px-6 md:px-14 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Main image */}
            <div
              className="rounded-2xl overflow-hidden border relative group cursor-zoom-in"
              style={{ boxShadow: "var(--art-glow), var(--art-shadow)", borderColor: "var(--border2)" }}
              onClick={() => setLightboxOpen(true)}
            >
              <div style={{ background: product.gradient }}>
                {allImages.length > 0 ? (
                  <img src={allImages[selectedImage]?.url} alt={product.title} className="w-full h-auto block" />
                ) : (
                  <div style={{ aspectRatio: "3/4" }} />
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full text-[13px] font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                  Click to view full size
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: selectedImage === i ? "var(--gold)" : "var(--border)",
                      opacity: selectedImage === i ? 1 : 0.6,
                    }}
                  >
                    <img src={img.url} alt={img.label || `View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-3" style={{ color: "var(--gold)" }}>
              {typeMeta.label}
            </div>
            <h1 className="font-[Playfair_Display] text-[clamp(32px,4vw,48px)] font-bold mb-3">{product.title}</h1>
            {product.material && (
              <div className="text-[15px] italic mb-1" style={{ color: "var(--text2)" }}>{product.material}</div>
            )}

            {/* Price */}
            <div className="mb-6 mt-4">
              {product.badge === "sold" || !product.inStock ? (
                <div className="font-[Playfair_Display] text-[38px] font-bold" style={{ color: "var(--rose)" }}>Sold Out</div>
              ) : product.price ? (
                <div className="flex items-baseline gap-3">
                  <span className="font-[Playfair_Display] text-[32px] font-bold" style={{ color: "var(--gold)" }}>£{product.price.toLocaleString()}</span>
                  {product.originalPrice && <span className="text-[16px] line-through" style={{ color: "var(--text3)" }}>£{product.originalPrice.toLocaleString()}</span>}
                </div>
              ) : (
                <div className="font-[Playfair_Display] text-[22px]" style={{ color: "var(--text3)" }}>Contact for price</div>
              )}
            </div>

            {/* Sizes */}
            {sizeList.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[13px] uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--text3)" }}>Select Size</h4>
                <div className="flex gap-2 flex-wrap">
                  {sizeList.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-5 py-2.5 rounded-lg text-[13px] font-medium border transition-all"
                      style={{
                        background: selectedSize === size ? "var(--gold)" : "transparent",
                        borderColor: selectedSize === size ? "var(--gold)" : "var(--border)",
                        color: selectedSize === size ? "#1A1830" : "var(--text)",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            {product.inStock && product.badge !== "sold" && (
              <div className="flex gap-3 items-center flex-wrap mb-10">
                <button className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                  Add to Cart
                </button>
                <button className="px-8 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                  Make an Enquiry
                </button>
              </div>
            )}

            {/* Description */}
            <div className="border-t pt-8 mb-8" style={{ borderColor: "var(--border)" }}>
              <h4 className="text-[18px] font-semibold mb-4">About This Product</h4>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--text2)" }}>{product.description}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Type", value: typeMeta.label },
                ...(product.material ? [{ label: "Material", value: product.material }] : []),
                ...(product.sizes ? [{ label: "Sizes", value: product.sizes }] : []),
              ].map((d) => (
                <div key={d.label} className="p-4 rounded-lg border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>{d.label}</div>
                  <div className="text-[14px] capitalize">{d.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-8" style={{ borderColor: "var(--border)" }}>
              {["14-day money-back guarantee", "Professionally packaged for safe delivery"].map((item) => (
                <div key={item} className="text-[13px] flex items-center gap-2" style={{ color: "var(--text2)" }}>
                  <span style={{ color: "var(--emerald)" }}>&#10003;</span> {item}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--gold)" }}>Postage</div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text2)" }}>
                Postal charges are not included. Free delivery within Essex. A minimal charge applies for other locations in the UK and other countries.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex flex-col items-center justify-center cursor-zoom-out"
            style={{ background: "rgba(0,0,0,0.97)" }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:bg-white/10 z-10"
            >
              &times;
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100vw", height: "100vh", padding: "8px" }}
            >
              <img
                src={allImages[selectedImage]?.url}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
                style={{ display: "block" }}
              />
            </motion.div>

            {/* Bottom nav for multiple images */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                    className="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
                    style={{ borderColor: selectedImage === i ? "var(--gold)" : "rgba(255,255,255,0.3)" }}
                  >
                    <img src={img.url} alt={img.label || `${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-[5]" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
              <h3 className="text-white text-[16px] font-[Cormorant_Garamond] font-semibold">{product.title}</h3>
              {product.price > 0 && (
                <span className="font-[Playfair_Display] text-[20px] font-bold" style={{ color: "var(--gold)" }}>
                  £{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

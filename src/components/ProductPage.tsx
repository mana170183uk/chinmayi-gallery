"use client";

import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  gradient: string;
  badge?: string | null;
  material?: string | null;
  sizes?: string | null;
  inStock: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  label: string;
  products: Product[];
  emptyMessage: string;
}

export default function ProductPage({ title, subtitle, label, products, emptyMessage }: Props) {
  return (
    <section className="min-h-screen pt-28 pb-24 px-6 md:px-14 relative z-[1]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
          <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> {label}
        </div>
        <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">{title}</h1>
        <p className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>{subtitle}</p>
      </motion.div>
      <ProductGrid products={products} emptyMessage={emptyMessage} />
    </section>
  );
}

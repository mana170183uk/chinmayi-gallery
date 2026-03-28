"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getState,
  subscribe,
  setCartOpen,
  removeFromCart,
  getCartTotal,
} from "@/lib/store";
import type { Artwork } from "@/data/artworks";

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const unsub = subscribe(() => {
      const s = getState();
      setOpen(s.cartOpen);
      setItems(s.cart);
      setTotal(getCartTotal());
    });
    return unsub;
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1500] bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-[400px] h-screen z-[1501] flex flex-col border-l"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-5 flex justify-between items-center border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="text-[22px]">Your Cart</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-[22px] transition-colors hover:text-[var(--rose)]"
                style={{ color: "var(--text2)" }}
              >
                &times;
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="text-center py-16" style={{ color: "var(--text3)" }}>
                  <div className="text-5xl mb-4 opacity-50">🛍️</div>
                  <p>Your cart is empty</p>
                  <p className="text-[13px] mt-2">
                    Browse the gallery to find your perfect piece
                  </p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div
                    key={item.artwork.id}
                    className="flex gap-4 py-4 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-20 h-20 rounded-lg flex-shrink-0"
                      style={{ background: item.artwork.gradient }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-[Cormorant_Garamond] text-[16px] font-semibold truncate">
                        {item.artwork.title}
                      </div>
                      <div className="text-[12px] mt-1" style={{ color: "var(--text3)" }}>
                        {item.artwork.medium}
                      </div>
                      <div className="font-semibold mt-2" style={{ color: "var(--gold)" }}>
                        £{item.artwork.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.artwork.id)}
                      className="text-[16px] self-start transition-colors hover:text-[var(--rose)]"
                      style={{ color: "var(--text3)" }}
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center mb-5">
                <span className="text-[14px]" style={{ color: "var(--text2)" }}>
                  Total
                </span>
                <strong
                  className="font-[Playfair_Display] text-[24px]"
                  style={{ color: "var(--gold)" }}
                >
                  £{total.toLocaleString()}
                </strong>
              </div>
              <button
                className="w-full py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--gold), var(--gold2))",
                  color: "#1A1830",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

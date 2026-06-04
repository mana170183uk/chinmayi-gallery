"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  getState,
  subscribe,
  getCartTotal,
  setCartOpen,
  removeFromCart,
  type CartLineItem,
} from "@/lib/store";

interface CartItem {
  item: CartLineItem;
  quantity: number;
}

export const dynamic = "force-dynamic";

const FLAT_SHIPPING = 5; // £5 flat for non-Essex UK orders

// Essex postcode area prefixes — based on Royal Mail postcode areas that
// cover Essex (Chelmsford, Colchester, Southend, Ilford, Romford).
// Source / safe list — keep in sync with /shipping-returns and orders API.
const ESSEX_POSTCODE_PREFIXES = ["CM", "CO", "SS", "IG", "RM"] as const;

function isEssexPostcode(postcode: string): boolean {
  if (!postcode) return false;
  const p = postcode.trim().toUpperCase().replace(/\s+/g, "");
  return ESSEX_POSTCODE_PREFIXES.some((prefix) => p.startsWith(prefix));
}

function calcShipping(subtotal: number, postcode: string): { cost: number; reason: string } {
  if (isEssexPostcode(postcode)) return { cost: 0, reason: "FREE — local Essex delivery" };
  if (subtotal >= 75) return { cost: 0, reason: "FREE — UK orders over £75" };
  if (!postcode.trim()) return { cost: FLAT_SHIPPING, reason: `Estimated £${FLAT_SHIPPING} — confirm with your postcode` };
  return { cost: FLAT_SHIPPING, reason: `£${FLAT_SHIPPING} standard UK delivery` };
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<"review" | "details" | "payment" | "submitted">("review");
  const [customer, setCustomer] = useState({ name: "", email: "", address: "", postcode: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const sync = () => {
      const s = getState();
      setItems(s.cart);
      setTotal(getCartTotal());
      setHydrated(true);
    };
    sync();
    const unsub = subscribe(sync);
    return () => { unsub(); };
  }, []);

  // Generate a friendly payment reference once order is "submitted"
  useEffect(() => {
    if (step === "submitted" && !reference) {
      setReference(`CHN-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    }
  }, [step, reference]);

  const placeOrder = async () => {
    if (!customer.name || !customer.email || !customer.address || !customer.postcode) {
      setError("Please fill in your name, email, shipping address and postcode.");
      return;
    }
    setError("");
    setSubmitting(true);
    const shipping = calcShipping(total, customer.postcode);
    const grandTotal = total + shipping.cost;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          shippingAddress: `${customer.address}, ${customer.postcode.toUpperCase()}`,
          postcode: customer.postcode.toUpperCase(),
          items: items.map((ci) => ({
            id: ci.item.id,
            kind: ci.item.kind,
            title: ci.item.title,
            price: ci.item.price,
            quantity: ci.quantity,
          })),
          subtotal: total,
          shipping: shipping.cost,
          shippingReason: shipping.reason,
          total: grandTotal,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Could not place your order. Please try again or contact us.");
        setSubmitting(false);
        return;
      }
      setStep("submitted");
    } catch {
      setError("Could not place your order. Please try again or contact us.");
    }
    setSubmitting(false);
  };

  return (
    <section className="min-h-screen pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-14 relative z-[1]">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Checkout
          </div>
          <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">
            {step === "submitted" ? "Order Received" : "Complete Your Order"}
          </h1>
        </div>

        {/* Step indicator */}
        {step !== "submitted" && (
          <div className="flex items-center justify-center gap-3 mb-12 text-[12px] font-semibold tracking-wider uppercase" style={{ color: "var(--text3)" }}>
            <span style={{ color: step === "review" ? "var(--gold)" : "var(--text3)" }}>1. Review</span>
            <span>—</span>
            <span style={{ color: step === "details" ? "var(--gold)" : "var(--text3)" }}>2. Your details</span>
            <span>—</span>
            <span style={{ color: step === "payment" ? "var(--gold)" : "var(--text3)" }}>3. Payment</span>
          </div>
        )}

        {/* Empty cart (only after hydration completes — avoids the flash) */}
        {hydrated && items.length === 0 && step !== "submitted" && (
          <div className="text-center py-20 rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="text-5xl mb-4 opacity-60">🛍️</div>
            <p className="text-[16px] mb-2" style={{ color: "var(--text2)" }}>Your cart is empty.</p>
            <Link href="/gallery" className="inline-block mt-4 px-6 py-2.5 rounded-md text-[12px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              Browse the Gallery
            </Link>
          </div>
        )}
        {!hydrated && step === "review" && (
          <div className="text-center py-20" style={{ color: "var(--text3)" }}>Loading your cart...</div>
        )}

        {/* Step 1 — Review */}
        {step === "review" && items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8 lg:gap-10">
            <div>
              <h2 className="font-[Playfair_Display] text-[24px] font-semibold mb-6">Items in your order</h2>
              <div className="space-y-4">
                {items.map((ci) => (
                  <div key={`${ci.item.kind}-${ci.item.id}`} className="flex gap-4 p-4 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "var(--bg2)" }}>
                      {ci.item.imageUrl && <img src={ci.item.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-[Cormorant_Garamond] text-[18px] font-semibold">{ci.item.title}</div>
                      {ci.item.subtitle && <div className="text-[12px]" style={{ color: "var(--text3)" }}>{ci.item.subtitle}</div>}
                      <div className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text3)" }}>
                        {ci.item.kind === "product" ? "Product" : ci.item.kind === "book" ? "Book" : "Artwork"}
                        {ci.quantity > 1 && ` · Qty ${ci.quantity}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: "var(--gold)" }}>£{(ci.item.price * ci.quantity).toLocaleString()}</div>
                      <button onClick={() => removeFromCart(ci.item.id, ci.item.kind)} className="text-[11px] mt-2 hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border h-fit" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold text-[16px] mb-4">Order Summary</h3>
              {(() => {
                const shipping = calcShipping(total, customer.postcode);
                const isFree = shipping.cost === 0;
                return (
                  <>
                    <div className="flex justify-between text-[14px] mb-2">
                      <span style={{ color: "var(--text2)" }}>Subtotal</span>
                      <span>£{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[14px] mb-1">
                      <span style={{ color: "var(--text2)" }}>Shipping</span>
                      <span style={{ color: isFree ? "var(--emerald)" : "var(--text)" }}>
                        {isFree ? "FREE" : `£${shipping.cost.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-[11px] mb-4" style={{ color: "var(--text3)" }}>{shipping.reason}</p>
                    <div className="border-t pt-4 flex justify-between" style={{ borderColor: "var(--border)" }}>
                      <span className="font-semibold">Total</span>
                      <strong className="font-[Playfair_Display] text-[24px]" style={{ color: "var(--gold)" }}>£{(total + shipping.cost).toLocaleString()}</strong>
                    </div>
                  </>
                );
              })()}
              <button
                onClick={() => setStep("details")}
                className="w-full mt-6 py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
              >
                Continue
              </button>
              <button
                onClick={() => { setCartOpen(false); window.location.href = "/gallery"; }}
                className="w-full mt-3 py-2.5 rounded-md text-[12px] border transition-all hover:border-[var(--gold)]"
                style={{ borderColor: "var(--border)", color: "var(--text2)" }}
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Customer details */}
        {step === "details" && items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto">
            <h2 className="font-[Playfair_Display] text-[24px] font-semibold mb-2">Your details</h2>
            <p className="text-[13px] mb-6" style={{ color: "var(--text3)" }}>
              We use these only to fulfil your order and reply with the payment reference.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Full Name *</label>
                <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Email *</label>
                <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Shipping Address *</label>
                <textarea rows={3} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} required placeholder="Street, town, country" className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Postcode *</label>
                <input
                  value={customer.postcode}
                  onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                  required
                  placeholder="e.g. CM1 1AB"
                  className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none uppercase focus:border-[var(--gold)]"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
                {customer.postcode && (
                  <p className="text-[11px] mt-2" style={{ color: isEssexPostcode(customer.postcode) ? "var(--emerald)" : "var(--text3)" }}>
                    {isEssexPostcode(customer.postcode) ? "Essex postcode — free local delivery" : "Outside Essex — £5 standard UK delivery (free over £75)"}
                  </p>
                )}
              </div>
              {error && (
                <div className="text-[13px] p-3 rounded-lg border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.4)", color: "var(--rose)" }}>
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep("review")} className="px-6 py-3 rounded-md text-[12px] font-semibold tracking-wider uppercase border" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>Back</button>
                <button
                  onClick={() => {
                    if (!customer.name || !customer.email || !customer.address || !customer.postcode) {
                      setError("Please fill in your name, email, shipping address and postcode.");
                      return;
                    }
                    setError("");
                    setStep("payment");
                  }}
                  className="flex-1 py-3 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Payment (bank transfer) */}
        {step === "payment" && items.length > 0 && (() => {
          const shipping = calcShipping(total, customer.postcode);
          const grandTotal = total + shipping.cost;
          return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto">
            <h2 className="font-[Playfair_Display] text-[24px] font-semibold mb-2">Pay by UK bank transfer</h2>
            <p className="text-[14px] mb-6" style={{ color: "var(--text2)" }}>
              Please send <strong style={{ color: "var(--gold)" }}>£{grandTotal.toLocaleString()}</strong> to the
              account below using the payment reference we&apos;ll send to your email. Your order will be
              despatched as soon as the transfer arrives.
            </p>

            {/* Order summary with shipping */}
            <div className="p-5 rounded-xl border mb-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex justify-between text-[14px] mb-2">
                <span style={{ color: "var(--text2)" }}>Subtotal</span>
                <span>£{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] mb-1">
                <span style={{ color: "var(--text2)" }}>Shipping</span>
                <span style={{ color: shipping.cost === 0 ? "var(--emerald)" : "var(--text)" }}>
                  {shipping.cost === 0 ? "FREE" : `£${shipping.cost.toLocaleString()}`}
                </span>
              </div>
              <p className="text-[11px] mb-3" style={{ color: "var(--text3)" }}>{shipping.reason}</p>
              <div className="border-t pt-3 flex justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="font-semibold">Total to pay</span>
                <strong className="font-[Playfair_Display] text-[20px]" style={{ color: "var(--gold)" }}>£{grandTotal.toLocaleString()}</strong>
              </div>
            </div>

            <div className="p-6 rounded-xl border space-y-3" style={{ background: "var(--bg-card)", borderColor: "var(--gold)", boxShadow: "0 0 24px rgba(212,168,67,0.08)" }}>
              <h3 className="text-[11px] uppercase tracking-[3px] font-semibold mb-3" style={{ color: "var(--gold)" }}>Bank Details</h3>
              <div className="grid grid-cols-[140px_1fr] gap-y-2 text-[14px]">
                <span style={{ color: "var(--text3)" }}>Account Name</span>
                <span className="font-semibold">Chinmayi Rekha Nath</span>
                <span style={{ color: "var(--text3)" }}>Sort Code</span>
                <span className="font-mono">40-25-31</span>
                <span style={{ color: "var(--text3)" }}>Account Number</span>
                <span className="font-mono">41697455</span>
                <span style={{ color: "var(--text3)" }}>Amount</span>
                <span className="font-semibold" style={{ color: "var(--gold)" }}>£{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[12px] mt-4" style={{ color: "var(--text3)" }}>
              For international orders, please contact us at <a href="mailto:chinmayi_n@yahoo.com" style={{ color: "var(--gold)" }}>chinmayi_n@yahoo.com</a> for alternative payment options.
            </p>

            {error && (
              <div className="text-[13px] p-3 rounded-lg border mt-4" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.4)", color: "var(--rose)" }}>
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <button onClick={() => setStep("details")} className="px-6 py-3 rounded-md text-[12px] font-semibold tracking-wider uppercase border" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>Back</button>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="flex-1 py-3 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
              >
                {submitting ? "Placing order..." : "Confirm Order"}
              </button>
            </div>
          </motion.div>
          );
        })()}

        {/* Step 4 — Submitted */}
        {step === "submitted" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="font-[Playfair_Display] text-[28px] font-semibold mb-3">Thank you, {customer.name.split(" ")[0] || "friend"}!</h2>
            <p className="text-[15px] mb-8" style={{ color: "var(--text2)" }}>
              Your order has been received. A confirmation email is on its way to <strong style={{ color: "var(--text)" }}>{customer.email}</strong> with the bank transfer details and your payment reference.
            </p>

            <div className="p-6 rounded-xl border text-left space-y-3 mb-8" style={{ background: "var(--bg-card)", borderColor: "var(--gold)" }}>
              <h3 className="text-[11px] uppercase tracking-[3px] font-semibold mb-3" style={{ color: "var(--gold)" }}>Payment Reference (please include with your transfer)</h3>
              <div className="font-mono text-[20px] font-bold" style={{ color: "var(--gold)" }}>{reference}</div>
              <div className="border-t pt-4 grid grid-cols-[140px_1fr] gap-y-2 text-[14px]" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text3)" }}>Account Name</span>
                <span className="font-semibold">Chinmayi Rekha Nath</span>
                <span style={{ color: "var(--text3)" }}>Sort Code</span>
                <span className="font-mono">40-25-31</span>
                <span style={{ color: "var(--text3)" }}>Account Number</span>
                <span className="font-mono">41697455</span>
                <span style={{ color: "var(--text3)" }}>Amount</span>
                <span className="font-semibold" style={{ color: "var(--gold)" }}>£{(total + calcShipping(total, customer.postcode).cost).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[13px]" style={{ color: "var(--text3)" }}>
              Once the payment arrives we&apos;ll despatch your order and email tracking details (if applicable).
            </p>
            <Link href="/" className="inline-block mt-8 px-8 py-3 rounded-md text-[12px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              Back to Home
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

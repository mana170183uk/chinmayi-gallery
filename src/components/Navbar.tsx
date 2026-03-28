"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getState, subscribe, toggleTheme, setCartOpen } from "@/lib/store";

const links = [
  { label: "Gallery", href: "/gallery" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsub = subscribe(() => {
      const s = getState();
      setCartCount(s.cart.length);
      setTheme(s.theme);
    });
    const s = getState();
    setCartCount(s.cart.length);
    setTheme(s.theme);
    return () => { unsub(); };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 md:px-14 transition-all duration-500 backdrop-blur-2xl border-b ${
          scrolled ? "h-[60px] shadow-lg" : "h-[72px]"
        }`}
        style={{
          background: "var(--nav-bg)",
          borderColor: "var(--border)",
        }}
      >
        {/* Brand */}
        <Link href="/" className="flex flex-col cursor-pointer group">
          <span
            className="font-[Playfair_Display] text-[22px] font-bold tracking-wider leading-tight transition-colors"
            style={{ color: "var(--gold)" }}
          >
            Chinmayi
          </span>
          <span
            className="text-[10.5px] font-medium tracking-[5px] uppercase mt-[1px] transition-colors"
            style={{ color: "var(--text2)" }}
          >
            Gallery
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium tracking-[0.8px] uppercase relative group transition-colors"
              style={{ color: "var(--text2)" }}
            >
              <span className="group-hover:text-[var(--gold)] transition-colors">
                {link.label}
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300"
                style={{ background: "var(--gold)" }}
              />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Link
            href="/gallery"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: "var(--text2)" }}
            title="Search"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all hover:scale-110"
            style={{ color: "var(--text2)" }}
            title="Cart"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                style={{ background: "var(--rose)" }}
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-16 h-[30px] rounded-full relative transition-all overflow-hidden border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border2)",
            }}
            title="Toggle theme"
          >
            <motion.div
              className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full z-10"
              style={{ background: "var(--gold)", boxShadow: "0 2px 10px rgba(212,168,67,0.4)" }}
              animate={{ x: theme === "light" ? 34 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[13px] z-[1]">
              🌙
            </span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] z-[1]">
              ☀️
            </span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <motion.span
              className="w-6 h-[2px] rounded"
              style={{ background: "var(--text2)" }}
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-6 h-[2px] rounded"
              style={{ background: "var(--text2)" }}
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-6 h-[2px] rounded"
              style={{ background: "var(--text2)" }}
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-[999] backdrop-blur-2xl border-b p-5 flex flex-col gap-4 md:hidden"
            style={{
              background: "var(--nav-bg)",
              borderColor: "var(--border)",
            }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-medium tracking-[0.8px] uppercase py-3 border-b transition-colors hover:text-[var(--gold)]"
                style={{ color: "var(--text2)", borderColor: "var(--border)" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-medium tracking-[0.8px] uppercase py-3 transition-colors hover:text-[var(--gold)]"
              style={{ color: "var(--gold)" }}
            >
              Admin Panel
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

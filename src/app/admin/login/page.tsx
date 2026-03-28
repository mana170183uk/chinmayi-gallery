"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-[1]" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border" style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
            <span className="font-[Cinzel] text-[24px] font-bold" style={{ color: "var(--gold)" }}>CG</span>
          </div>
          <h1 className="font-[Playfair_Display] text-[28px] font-bold mb-2">Admin Panel</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>Sign in to manage your gallery</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chinmayigallery.com"
              className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[13px] px-4 py-3 rounded-lg"
              style={{ background: "var(--rose-glow)", color: "var(--rose)" }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
            style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[12px] mt-8" style={{ color: "var(--text3)" }}>
          Protected area. Authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
}

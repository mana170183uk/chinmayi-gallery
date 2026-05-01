"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="min-h-screen pt-36 pb-24 px-6 md:px-14 relative z-[1]">
      <div className="max-w-[1000px] mx-auto">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Get in Touch
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">Contact Us</motion.h1>
          <motion.p variants={fadeUp} className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
            Whether you&apos;re interested in purchasing artwork, commissioning a custom piece, or simply want to say hello — we&apos;d love to hear from you.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="space-y-8">
              {[
                { icon: "📍", title: "Studio Location", lines: ["London, United Kingdom", "(By appointment only)"] },
                { icon: "📧", title: "Email", lines: ["hello@chinmayigallery.com", "commissions@chinmayigallery.com"] },
                { icon: "📱", title: "Social Media", lines: ["@chinmayigallery on Instagram", "@chinmayiart on Pinterest"] },
                { icon: "🕐", title: "Response Time", lines: ["We typically respond within 24 hours", "Commission inquiries: 48 hours"] },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0" style={{ background: "var(--gold-glow)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold mb-1">{item.title}</h4>
                    {item.lines.map((line, i) => (
                      <div key={i} className="text-[14px]" style={{ color: "var(--text2)" }}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Commission Info */}
            <div className="mt-10 p-6 rounded-xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <h4 className="text-[16px] font-semibold mb-3" style={{ color: "var(--gold)" }}>Commission Process</h4>
              <ol className="space-y-2 text-[14px] list-decimal list-inside" style={{ color: "var(--text2)" }}>
                <li>Share your vision, preferred size and colour palette</li>
                <li>Receive a detailed proposal and timeline</li>
                <li>Approve composition sketches</li>
                <li>Painting creation (2-6 weeks)</li>
                <li>Final approval and delivery</li>
              </ol>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            {submitted ? (
              <div className="text-center py-20 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-[24px] font-semibold mb-3">Thank You!</h3>
                <p style={{ color: "var(--text2)" }}>Your message has been sent. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Name</label>
                    <input required className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Email</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Subject</label>
                  <select required className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none cursor-pointer transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <option value="">Select a topic</option>
                    <option>Purchase Inquiry</option>
                    <option>Commission Request</option>
                    <option>Exhibition Inquiry</option>
                    <option>Press & Media</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Message</label>
                  <textarea required rows={6} className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none resize-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                <button type="submit" className="w-full py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

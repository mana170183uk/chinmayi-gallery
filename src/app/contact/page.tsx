"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: FormData = { name: "", email: "", subject: "", message: "" };

function ContactContent() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormData>(emptyForm);

  // Prefill from query params (e.g. /contact?subject=Make%20an%20Offer&item=Title)
  useEffect(() => {
    const qSubject = searchParams.get("subject");
    const qItem = searchParams.get("item");
    setForm((prev) => ({
      ...prev,
      ...(qSubject ? { subject: qSubject } : {}),
      ...(qItem
        ? { message: prev.message || `I'm interested in: ${qItem}\n\n` }
        : {}),
    }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || "Could not send your message. Please try again or email chinmayi_n@yahoo.com directly.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setForm(emptyForm);
    } catch {
      setErrorMsg("Could not send your message. Please try again or email chinmayi_n@yahoo.com directly.");
    }
    setSubmitting(false);
  };

  return (
    <section className="min-h-screen pt-40 pb-24 px-6 md:px-14 relative z-[1]">
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
                { icon: "📍", title: "Studio Location", lines: ["Essex, United Kingdom", "(By appointment only)"] },
                { icon: "📧", title: "Email", lines: ["chinmayi_n@yahoo.com"] },
                { icon: "📱", title: "Social Media", lines: ["@chinu_the_artist on Instagram"] },
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Subject</label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Purchase Inquiry / Make an Offer / Commission Request / ..."
                    className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    list="subject-options"
                  />
                  <datalist id="subject-options">
                    <option>Purchase Inquiry</option>
                    <option>Make an Offer</option>
                    <option>Commission Request</option>
                    <option>Exhibition Inquiry</option>
                    <option>Workshop Enquiry</option>
                    <option>Press & Media</option>
                    <option>General Question</option>
                  </datalist>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Message</label>
                  <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg text-[14px] border outline-none resize-none transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                {errorMsg && (
                  <div className="text-[13px] p-3 rounded-lg border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.4)", color: "var(--rose)" }}>
                    {errorMsg}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="w-full py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactContent />
    </Suspense>
  );
}

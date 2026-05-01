"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Exhibition {
  id: string;
  year: string;
  title: string;
  venue: string;
  description?: string | null;
  imageUrl?: string | null;
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string | null;
  location?: string | null;
}

interface Props {
  exhibitions: Exhibition[];
  workshops: Workshop[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const process = [
  { step: "01", title: "Inspiration", desc: "Every painting begins with an emotion — a fleeting moment of beauty observed in nature, a colour harmony that demands to be explored." },
  { step: "02", title: "Composition", desc: "Thumbnail sketches and colour studies establish the mood and structure. This phase is about finding the perfect balance of elements." },
  { step: "03", title: "Creation", desc: "Working with premium oils on Belgian linen canvas, each piece develops through layers of colour, texture and light over days or weeks." },
  { step: "04", title: "Refinement", desc: "The final stage involves stepping back, living with the painting, and making subtle adjustments until every element sings in harmony." },
];

export default function AboutClient({ exhibitions, workshops }: Props) {
  return (
    <section className="min-h-screen pt-36 pb-24 relative z-[1]">
      {/* Hero */}
      <div className="px-6 md:px-14 max-w-[1200px] mx-auto mb-24">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <motion.div variants={fadeUp}>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border2)", boxShadow: "var(--art-glow), var(--art-shadow)" }}>
              <img src="/chinmayi-artist.jpg" alt="Chinmayi - Artist" className="w-full h-auto block" />
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-6" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> The Artist
            </div>
            <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold leading-tight mb-6">About Chinmayi</h1>
            <p className="text-[16px] leading-relaxed mb-5" style={{ color: "var(--text2)" }}>
              Chinmayi is a contemporary fine artist whose work explores the intersection of emotion, colour and texture. Drawing inspiration from natural landscapes, Indian heritage, palm leaf etching traditions, and the quiet moments in between, each painting tells a story that resonates with the heart.
            </p>
            <p className="text-[16px] leading-relaxed mb-5" style={{ color: "var(--text2)" }}>
              Working across diverse styles — from realistic landscapes and portraits to contemporary abstract expressions and traditional Indian art forms — Chinmayi creates pieces that bridge cultures and emotions. Her work has been exhibited in galleries across the UK and India, and is held in private collections worldwide.
            </p>
            <p className="text-[16px] leading-relaxed" style={{ color: "var(--text2)" }}>
              Every painting is created with museum-grade materials — premium oils, Belgian linen canvas, and archival varnishes — ensuring each piece remains vibrant for generations. Beyond paintings, Chinmayi&apos;s artistic vision extends into handcrafted jewellery, clothing, and home décor, bringing art into everyday life.
            </p>

            <div className="flex gap-12 mt-10 pt-8 border-t flex-wrap" style={{ borderColor: "var(--border)" }}>
              {[
                { num: "150+", label: "Artworks Created" },
                { num: String(exhibitions.length), label: "Exhibitions" },
                { num: "8", label: "Countries" },
                { num: "200+", label: "Happy Collectors" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-[Playfair_Display] text-[clamp(28px,3vw,40px)] font-bold" style={{ color: "var(--gold)" }}>{s.num}</div>
                  <div className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text3)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Creative Process */}
      <div className="px-6 md:px-14 py-24" style={{ background: "var(--bg2)" }}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Behind the Canvas
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,48px)] font-semibold">Creative Process</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="p-8 rounded-2xl border backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[var(--card-hover-border)]"
                style={{ background: "var(--bg-glass2)", borderColor: "var(--border)" }}
              >
                <div className="font-[Playfair_Display] text-[36px] font-bold mb-4" style={{ color: "var(--gold)", opacity: 0.3 }}>{p.step}</div>
                <h4 className="text-[20px] font-semibold mb-3">{p.title}</h4>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text2)" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Exhibitions */}
      <div className="px-6 md:px-14 py-24 max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Exhibition History
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,48px)] font-semibold">Exhibitions</motion.h2>
        </motion.div>

        <div className="space-y-0">
          {exhibitions.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-6 py-6 border-b group transition-colors hover:bg-[var(--bg2)]"
              style={{ borderColor: "var(--border)" }}
            >
              {ex.imageUrl && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                  <img src={ex.imageUrl} alt={ex.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="font-[Playfair_Display] text-[24px] font-bold w-16 flex-shrink-0" style={{ color: "var(--gold)" }}>{ex.year}</div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold group-hover:text-[var(--gold)] transition-colors">{ex.title}</div>
                <div className="text-[14px] mt-1" style={{ color: "var(--text3)" }}>{ex.venue}</div>
                {ex.description && <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--text2)" }}>{ex.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Art Workshops */}
      {workshops.length > 0 && (
        <div className="px-6 md:px-14 py-24" style={{ background: "var(--bg2)" }}>
          <div className="max-w-[1200px] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
                <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Learn With The Artist
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,48px)] font-semibold mb-4">Art Workshops</motion.h2>
              <motion.p variants={fadeUp} className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
                Join hands-on workshops to learn traditional and contemporary art techniques directly from Chinmayi.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshops.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="rounded-2xl border backdrop-blur-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-[var(--card-hover-border)]"
                  style={{ background: "var(--bg-glass2)", borderColor: "var(--border)" }}
                >
                  {w.imageUrl && (
                    <div className="w-full overflow-hidden" style={{ background: "var(--bg2)" }}>
                      <img src={w.imageUrl} alt={w.title} className="w-full h-auto block" />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="text-[11px] uppercase tracking-[2px] font-semibold mb-3" style={{ color: "var(--gold)" }}>{w.date}</div>
                    <h4 className="font-[Cormorant_Garamond] text-[24px] font-semibold mb-3">{w.title}</h4>
                    <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--text2)" }}>{w.description}</p>
                    {w.location && <p className="text-[12px]" style={{ color: "var(--text3)" }}>📍 {w.location}</p>}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/contact" className="inline-block px-8 py-3 rounded-md text-[12px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                Enquire About Workshops
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 md:px-14 py-16 text-center">
        <h3 className="text-[28px] font-semibold mb-4">Commission a Custom Piece</h3>
        <p className="text-[16px] mb-8 max-w-[500px] mx-auto" style={{ color: "var(--text2)" }}>
          Want something uniquely yours? Chinmayi accepts commission requests for bespoke artwork tailored to your vision and space.
        </p>
        <Link href="/contact" className="inline-block px-10 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
          Get in Touch
        </Link>
      </div>
    </section>
  );
}

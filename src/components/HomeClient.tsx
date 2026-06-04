"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import NewsletterForm from "@/components/NewsletterForm";
import { addToCart } from "@/lib/store";
import type { Artwork } from "@/data/artworks";

interface Collection {
  id: string;
  slug?: string;
  title: string;
  description: string;
  gradient: string;
  count: number;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  avatarGradient: string;
}

interface Props {
  artworks: Artwork[];
  featuredWorks: Artwork[];
  featured: Artwork;
  collections?: Collection[];
  testimonials: Testimonial[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomeClient({ artworks, featuredWorks, featured, testimonials }: Props) {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      {/* Top padding needs to clear the fixed navbar:
            mobile: 28px banner + 80px navbar = 108px → use 140px so the
                    "FINE ART COLLECTION" eyebrow and the headline aren't
                    hidden behind it.
            desktop: navbar is 100px, banner 28px = 128px → 150px gives air. */}
      <section className="min-h-[80vh] sm:min-h-screen flex items-center relative overflow-hidden pt-[140px] sm:pt-[150px] pb-10 sm:pb-14 px-4 sm:px-6 md:px-14">
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "radial-gradient(ellipse at 30% 50%, var(--gold-glow2), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[2]" style={{ background: "linear-gradient(transparent, var(--bg))" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center max-w-[1400px] mx-auto w-full relative z-[3]">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-6" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} />
              Fine Art Collection
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-[Playfair_Display] text-[clamp(40px,5.5vw,72px)] font-extrabold leading-[1.05] mb-7">
              Where Art<br />Meets <span className="italic relative" style={{ color: "var(--gold)" }}>
                Soul
                <span className="absolute bottom-1 left-0 right-0 h-[3px] rounded" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[17px] max-w-[500px] mb-10 leading-relaxed mx-auto lg:mx-0" style={{ color: "var(--text2)" }}>
              Discover breathtaking original paintings and limited-edition prints. Each piece is a window into emotion, colour and the beauty of the human experience.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link href="/gallery" className="px-9 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                Explore Gallery
              </Link>
              <Link href="/about" className="px-9 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase border backdrop-blur-md transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                Meet the Artist
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero grid — every card is forced to a uniform 3:4 portrait so the
              layout stays balanced regardless of each painting's source
              aspectRatio. Cropped with object-cover so the frame edges look
              clean even when the original is wider/narrower. */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="grid grid-cols-2 gap-3 sm:gap-4 max-w-[520px] lg:max-w-none mx-auto w-full" style={{ perspective: "800px" }}>
            {artworks.slice(0, 4).map((art, i) => (
              <motion.div
                key={art.id}
                className="rounded-xl overflow-hidden relative border group"
                style={{
                  boxShadow: "var(--art-shadow)",
                  borderColor: "var(--border2)",
                  // Subtle staggered offset only on large screens — on phones/tablets
                  // it pushed cards off the grid and looked broken.
                  transform: i === 1 ? "translateY(0)" : i === 2 ? "translateY(0)" : "none",
                }}
                whileHover={{ y: -8, rotateY: i % 2 === 0 ? -2 : 2 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="relative w-full"
                  style={{ background: art.imageUrl ? "var(--bg-card)" : art.gradient, aspectRatio: "3/4", overflow: "hidden" }}
                >
                  {art.imageUrl && (
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 text-[11px] sm:text-[12px] font-medium text-white px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" style={{ background: "rgba(0,0,0,0.55)" }}>
                  {art.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ FEATURED ARTWORKS ═══════ */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-14 relative z-[1]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> The Collection
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,50px)] font-semibold mb-4">Curated Artworks</motion.h2>
          <motion.p variants={fadeUp} className="text-[16px] max-w-[560px] mx-auto" style={{ color: "var(--text2)" }}>
            Browse original paintings and limited-edition prints, each crafted with passion and precision
          </motion.p>
        </motion.div>
        <div className="masonry-grid max-w-[1440px] mx-auto">
          {featuredWorks.map((art, i) => (
            <ArtworkCard key={art.id} artwork={art} index={i} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-16">
          <Link href="/gallery" className="inline-block px-10 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase border transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            View All Artworks
          </Link>
        </motion.div>
      </section>

      {/* ═══════ FEATURED MASTERPIECE ═══════ */}
      {featured && (
        <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, var(--gold-glow2), transparent 60%)" }} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Artwork of the Month
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,50px)] font-semibold">Featured Masterpiece</motion.h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center max-w-[1200px] mx-auto relative z-[1]">
            <div className="rounded-2xl overflow-hidden relative border" style={{ boxShadow: "var(--art-glow), var(--art-shadow)", borderColor: "var(--border2)" }}>
              <div className="relative" style={{ background: featured.imageUrl ? "var(--bg-card)" : featured.gradient }}>
                {featured.imageUrl ? (
                  <img src={featured.imageUrl} alt={featured.title} className="w-full h-auto block" />
                ) : (
                  <div className="art-gradient" style={{ aspectRatio: "3/4" }} />
                )}
              </div>
            </div>
            <div>
              <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-3" style={{ color: "var(--gold)" }}>Original &bull; {featured.medium}</div>
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-2">{featured.title}</h3>
              <div className="text-[14px] italic mb-1" style={{ color: "var(--text2)" }}>{featured.medium}</div>
              <div className="text-[13px] mb-6" style={{ color: "var(--text3)" }}>{featured.dimensions}</div>
              <p className="text-[15px] leading-relaxed mb-7" style={{ color: "var(--text2)" }}>{featured.description}</p>
              <div className="font-[Playfair_Display] text-[34px] font-bold mb-7" style={{ color: "var(--gold)" }}>
                £{featured.price.toLocaleString()}
                {featured.originalPrice && <span className="text-[18px] line-through ml-3 font-normal" style={{ color: "var(--text3)" }}>£{featured.originalPrice.toLocaleString()}</span>}
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                <button onClick={() => addToCart(featured)} className="inline-flex items-center gap-2.5 px-10 py-4 rounded-md font-bold text-[13px] tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                  🛒 Add to Cart
                </button>
                <button className="w-[52px] h-[52px] rounded-lg inline-flex items-center justify-center border text-[20px] transition-all hover:border-[var(--rose)] hover:text-[var(--rose)]" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>♡</button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════ CUSTOM DESIGNS MADE TO ORDER ═══════ */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-14 relative z-[1]">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Bespoke Commissions
            </div>
            <h3 className="font-[Playfair_Display] text-[clamp(28px,3.5vw,42px)] font-semibold mb-4">Custom Designs Made to Order</h3>
            <p className="text-[16px] max-w-[640px] mx-auto" style={{ color: "var(--text2)" }}>
              Want something uniquely yours? Commission a one-of-a-kind piece tailored to your vision —
              your chosen style, palette, dimensions and subject. Perfect for personal spaces, gifts and
              memorable occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { step: "01", title: "Share Your Vision", desc: "Tell us your idea, preferred style, palette and the size you have in mind." },
              { step: "02", title: "Sketches & Approval", desc: "Receive composition sketches and a timeline. Refine together until it feels right." },
              { step: "03", title: "Hand-Painted For You", desc: "Created with museum-grade materials, packaged with care, delivered to your door." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="p-8 rounded-2xl border backdrop-blur-xl"
                style={{ background: "var(--bg-glass2)", borderColor: "var(--border)" }}
              >
                <div className="font-[Playfair_Display] text-[36px] font-bold mb-3" style={{ color: "var(--gold)", opacity: 0.4 }}>{s.step}</div>
                <h4 className="text-[18px] font-semibold mb-2">{s.title}</h4>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text2)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
            >
              Start a Commission
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════ NEWSLETTER (Join the Inner Circle) — above Testimonials ═══════ */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Stay Connected
          </div>
          <h2 className="text-[clamp(30px,4vw,50px)] font-semibold">Join the Inner Circle</h2>
        </div>
        <div className="max-w-[560px] mx-auto text-center">
          <p className="text-[16px] mb-8" style={{ color: "var(--text2)" }}>
            Be the first to see new paintings, receive exhibition invitations and get exclusive access to limited-edition prints.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* ═══════ TESTIMONIALS — bottom of page ═══════ */}
      {testimonials.length > 0 && (
        <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-14 relative z-[1]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> What Collectors Say
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,50px)] font-semibold mb-4">Testimonials</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }} className="p-8 rounded-2xl backdrop-blur-xl border transition-all hover:border-[var(--card-hover-border)] hover:-translate-y-1" style={{ background: "var(--bg-glass2)", borderColor: "var(--border)" }}>
                <div className="text-[15px] tracking-wider mb-4" style={{ color: "var(--gold)" }}>★★★★★</div>
                <p className="text-[14.5px] leading-relaxed italic mb-5" style={{ color: "var(--text2)" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px]" style={{ background: t.avatarGradient }}>{t.avatar}</div>
                  <div>
                    <div className="text-[14px] font-semibold">{t.name}</div>
                    <div className="text-[12px]" style={{ color: "var(--text3)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
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
  collections: Collection[];
  testimonials: Testimonial[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomeClient({ artworks, featuredWorks, featured, collections, testimonials }: Props) {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="min-h-screen flex items-center relative overflow-hidden" style={{ padding: "100px clamp(20px,5vw,80px) 60px" }}>
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "radial-gradient(ellipse at 30% 50%, var(--gold-glow2), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[2]" style={{ background: "linear-gradient(transparent, var(--bg))" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1400px] mx-auto w-full relative z-[3]">
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

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="grid grid-cols-2 gap-4" style={{ perspective: "800px" }}>
            {artworks.slice(0, 4).map((art, i) => (
              <motion.div
                key={art.id}
                className="rounded-xl overflow-hidden relative border group"
                style={{
                  boxShadow: "var(--art-shadow)",
                  borderColor: "var(--border2)",
                  transform: i === 1 ? "translateY(50px)" : i === 2 ? "translateY(-30px)" : "none",
                }}
                whileHover={{ y: -8, rotateY: i % 2 === 0 ? -2 : 2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="art-gradient relative" style={{ background: art.gradient, aspectRatio: art.aspectRatio || "3/4" }}>
                  {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
                </div>
                <div className="absolute bottom-3 left-3 z-10 text-[12px] font-medium text-white px-3 py-1 rounded-full backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" style={{ background: "rgba(0,0,0,0.4)" }}>
                  {art.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ FEATURED ARTWORKS ═══════ */}
      <section className="py-24 px-6 md:px-14 relative z-[1]">
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

      {/* ═══════ COLLECTIONS ═══════ */}
      <section className="py-24 px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Browse by Theme
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,50px)] font-semibold mb-4">Curated Collections</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {collections.slice(0, 3).map((col, i) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
              <Link href={`/gallery?collection=${col.slug || col.id}`}>
                <div className="rounded-2xl overflow-hidden relative border group cursor-pointer" style={{ aspectRatio: "3/4", borderColor: "var(--border)" }}>
                  <div className="absolute inset-0" style={{ background: col.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                    <div className="text-[11px] tracking-[2px] uppercase font-semibold mb-2" style={{ color: "var(--gold)" }}>{col.count} Artworks</div>
                    <h3 className="text-[28px] text-white mb-2">{col.title}</h3>
                    <p className="text-[14px] text-white/70">{col.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED MASTERPIECE ═══════ */}
      {featured && (
        <section className="py-24 px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, var(--gold-glow2), transparent 60%)" }} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> Artwork of the Month
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-[clamp(30px,4vw,50px)] font-semibold">Featured Masterpiece</motion.h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1200px] mx-auto relative z-[1]">
            <div className="rounded-2xl overflow-hidden relative border" style={{ boxShadow: "var(--art-glow), var(--art-shadow)", borderColor: "var(--border2)" }}>
              <div className="art-gradient relative" style={{ background: featured.gradient, aspectRatio: "3/4" }}>
                {featured.imageUrl && <img src={featured.imageUrl} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />}
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

      {/* ═══════ ABOUT PREVIEW ═══════ */}
      <section className="py-24 px-6 md:px-14 relative z-[1]">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center max-w-[1200px] mx-auto">
          <div className="rounded-2xl overflow-hidden relative border" style={{ borderColor: "var(--border2)" }}>
            <div className="art-gradient" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", aspectRatio: "4/5" }} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
              <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> The Artist
            </div>
            <h3 className="text-[clamp(28px,3vw,38px)] font-semibold mb-6">Painting Emotions, One Stroke at a Time</h3>
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--text2)" }}>
              Chinmayi is a contemporary fine artist whose work explores the intersection of emotion, colour and texture.
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text2)" }}>
              Every painting is created with museum-grade materials — premium oils, Belgian linen canvas, and archival varnishes.
            </p>
            <div className="flex gap-12 mt-8 pt-8 border-t flex-wrap" style={{ borderColor: "var(--border)" }}>
              {[{ num: "150+", label: "Artworks" }, { num: "12", label: "Exhibitions" }, { num: "8", label: "Countries" }, { num: "200+", label: "Collectors" }].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-[Playfair_Display] text-[clamp(28px,3vw,40px)] font-bold" style={{ color: "var(--gold)" }}>{s.num}</div>
                  <div className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text3)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-24 px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
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

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="py-24 px-6 md:px-14 relative z-[1]" style={{ background: "var(--bg2)" }}>
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
          <form className="flex gap-3 flex-col sm:flex-row" onSubmit={(e) => { e.preventDefault(); alert("Welcome to the Chinmayi Gallery family!"); }}>
            <input type="email" placeholder="your@email.com" required className="flex-1 px-5 py-3.5 rounded-md text-[14px] outline-none border transition-colors focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            <button type="submit" className="px-8 py-3.5 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}

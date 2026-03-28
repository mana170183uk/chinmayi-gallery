import Link from "next/link";

const galleryLinks = [
  { label: "All Artworks", href: "/gallery" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/gallery?filter=new" },
  { label: "Limited Prints", href: "/gallery" },
];

const aboutLinks = [
  { label: "The Artist", href: "/about" },
  { label: "Exhibitions", href: "/about" },
  { label: "Commissions", href: "/contact" },
  { label: "Press", href: "/about" },
];

const supportLinks = [
  { label: "Shipping & Returns", href: "/contact" },
  { label: "Care Instructions", href: "/contact" },
  { label: "FAQ", href: "/contact" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--footer-bg)" }} className="pt-20 pb-10 px-6 md:px-14 text-[#9B98B0]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-10 border-b border-white/[0.06]">
        <div>
          <div className="font-[Playfair_Display] text-[22px] font-bold mb-3.5" style={{ color: "#D4A843" }}>
            Chinmayi Gallery
          </div>
          <p className="text-sm leading-relaxed text-[#8B88A0]">
            A premium online gallery showcasing original fine art paintings and limited-edition
            prints. Each piece is created with passion, precision and museum-grade materials.
          </p>
        </div>
        <div>
          <h5 className="text-[12px] font-semibold uppercase tracking-[2.5px] text-[#E5E3F0] mb-5">
            Gallery
          </h5>
          <ul className="space-y-3">
            {galleryLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-[#8B88A0] hover:text-[#D4A843] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-[12px] font-semibold uppercase tracking-[2.5px] text-[#E5E3F0] mb-5">
            About
          </h5>
          <ul className="space-y-3">
            {aboutLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-[#8B88A0] hover:text-[#D4A843] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-[12px] font-semibold uppercase tracking-[2.5px] text-[#E5E3F0] mb-5">
            Support
          </h5>
          <ul className="space-y-3">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-[#8B88A0] hover:text-[#D4A843] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center mt-5 text-[13px] text-[#6C6988] gap-4">
        <span>&copy; 2026 Chinmayi Gallery. All rights reserved.</span>
        <div className="flex gap-3">
          {["Instagram", "Pinterest", "Facebook"].map((s) => (
            <a
              key={s}
              href="#"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/[0.08] text-[#8B88A0] text-[13px] hover:text-[#D4A843] hover:border-[#D4A843] transition-all"
            >
              {s[0]}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

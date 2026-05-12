import { ReactNode } from "react";

interface Props {
  label: string;
  title: string;
  children: ReactNode;
}

export default function PolicyPage({ label, title, children }: Props) {
  return (
    <section className="min-h-screen pt-40 pb-24 px-6 md:px-14 relative z-[1]">
      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[4px] uppercase mb-4" style={{ color: "var(--gold)" }}>
            <span className="w-10 h-px" style={{ background: "var(--gold)" }} /> {label}
          </div>
          <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-bold mb-4">{title}</h1>
        </div>

        <div
          className="prose-policy text-[15px] leading-relaxed space-y-6"
          style={{ color: "var(--text2)" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

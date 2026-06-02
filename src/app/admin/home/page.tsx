"use client";

import { useState, useEffect, useCallback } from "react";

interface Artwork {
  id: string;
  title: string;
  slug: string;
  category: string;
  imageUrl?: string | null;
  gradient: string;
  badge?: string | null;
  heroPick?: boolean;
  homePick?: boolean;
  featured?: boolean;
  aspectRatio?: string;
}

export default function AdminHomePage() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/artworks");
      if (!res.ok) throw new Error("Failed to load artworks");
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const heroCount = items.filter((a) => a.heroPick).length;
  const curatedCount = items.filter((a) => a.homePick).length;

  const togglePick = async (
    id: string,
    field: "heroPick" | "homePick" | "featured",
    value: boolean
  ) => {
    setSaving(id + field);
    // Optimistic update so the UI reflects the tick immediately
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
    try {
      const res = await fetch(`/api/artworks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch {
      // Roll back on failure
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: !value } : a)));
      setError("Could not save change. Try again.");
    } finally {
      setSaving(null);
    }
  };

  const filtered = items.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold">Home Page</h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--text3)" }}>
          Tick which artworks appear in the <strong>Top 4 Hero panel</strong> and the <strong>Curated Artworks</strong> section on the home page. Changes save instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>Top 4 Hero panel</div>
          <div className="text-[24px] font-semibold">{heroCount} / 4 ticked</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>
            {heroCount === 0 ? "Tick up to 4 paintings below" : heroCount > 4 ? "More than 4 ticked — only the first 4 will show" : "Fewer than 4? Latest works auto-fill the rest"}
          </div>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>Curated Artworks</div>
          <div className="text-[24px] font-semibold">{curatedCount} ticked</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>
            {curatedCount === 0 ? "None ticked — system shows one per category" : "Only ticked artworks appear on the home page"}
          </div>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--gold)" }}>Featured Masterpiece</div>
          <div className="text-[24px] font-semibold">{items.filter((a) => a.featured).length} ticked</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>Tick exactly one — replaces the big Featured Masterpiece block</div>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-lg border text-[12.5px] flex items-start gap-2" style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}>
        <span style={{ color: "var(--gold)" }}>★</span>
        <span>
          <strong>Sold paintings can be picked too.</strong> The hero and curated sections honour every tick — sold pieces appear without a price tag, and the card shows &ldquo;Already purchased&rdquo; so visitors know it&rsquo;s not buyable.
        </span>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artworks by title or category..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border text-[13px]" style={{ background: "rgba(244,114,182,0.08)", borderColor: "var(--rose)", color: "var(--rose)" }}>
          {error}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Preview</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Title</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Category</th>
                <th className="text-center px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Top 4 Hero</th>
                <th className="text-center px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Curated</th>
                <th className="text-center px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Featured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((art) => (
                <tr key={art.id} className="border-b hover:bg-[var(--bg2)] transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: art.gradient }}>
                      {art.imageUrl && (
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{art.title}</span>
                      {art.badge === "sold" && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ background: "rgba(244,114,182,0.18)", color: "#f472b6" }}>
                          Sold
                        </span>
                      )}
                      {art.badge === "new" && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                          New
                        </span>
                      )}
                      {(art.badge === "nfs" || art.badge === "unavailable") && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ background: "rgba(120,120,128,0.2)", color: "var(--text3)" }}>
                          NFS
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3" style={{ color: "var(--text2)" }}>{art.category}</td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!art.heroPick}
                      disabled={saving === art.id + "heroPick"}
                      onChange={(e) => togglePick(art.id, "heroPick", e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-[var(--gold)]"
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!art.homePick}
                      disabled={saving === art.id + "homePick"}
                      onChange={(e) => togglePick(art.id, "homePick", e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-[var(--gold)]"
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!art.featured}
                      disabled={saving === art.id + "featured"}
                      onChange={(e) => togglePick(art.id, "featured", e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-[var(--gold)]"
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center" style={{ color: "var(--text3)" }}>
                    No artworks match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

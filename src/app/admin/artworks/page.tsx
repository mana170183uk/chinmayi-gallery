"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artworks as initialArtworks } from "@/data/artworks";
import type { Artwork } from "@/data/artworks";
import { fetchArtworks, createArtwork, updateArtwork, deleteArtwork } from "@/lib/api";

const gradientPresets = [
  { name: "Emerald", value: "linear-gradient(160deg, #1a0a2e, #2d1b69 30%, #11998e 60%, #38ef7d 90%)" },
  { name: "Rose", value: "linear-gradient(145deg, #2c003e, #f093fb 35%, #f5576c 65%, #ff6b35)" },
  { name: "Azure", value: "linear-gradient(135deg, #0c2340, #4facfe 40%, #00f2fe 80%, #e0f7fa)" },
  { name: "Golden", value: "linear-gradient(150deg, #5c1018, #fa709a 30%, #fee140 70%, #fffde4)" },
  { name: "Lavender", value: "linear-gradient(140deg, #1a0533, #a18cd1 35%, #fbc2eb 70%, #fff5f5)" },
  { name: "Sienna", value: "linear-gradient(155deg, #6b2c0f, #ffecd2 30%, #fcb69f 60%, #ff7e5f)" },
  { name: "Indigo", value: "linear-gradient(130deg, #0d1b3e, #667eea 30%, #764ba2 70%, #f093fb)" },
  { name: "Crimson", value: "linear-gradient(145deg, #3d0c02, #f5af19 30%, #f12711 65%, #ffcf48)" },
  { name: "Twilight", value: "linear-gradient(220deg, #1a2a6c 0%, #b21f1f 45%, #fdbb2d 100%)" },
  { name: "Mauve", value: "linear-gradient(170deg, #0c3483 0%, #6b6b83 40%, #aa4b6b 70%, #e8a4c4)" },
  { name: "Velvet", value: "linear-gradient(135deg, #0d0221, #c94b4b 40%, #4b134f 80%)" },
  { name: "Ocean", value: "linear-gradient(145deg, #000428, #004e92 50%, #6dd5ed)" },
];

interface FormData {
  title: string;
  category: string;
  medium: string;
  dimensions: string;
  year: string;
  price: string;
  description: string;
  gradient: string;
  imageUrl: string;
  aspectRatio: string;
  badge: string;
}

const emptyForm: FormData = {
  title: "", category: "landscape", medium: "", dimensions: "",
  year: new Date().getFullYear().toString(), price: "", description: "",
  gradient: gradientPresets[0].value, imageUrl: "", aspectRatio: "3/4", badge: "",
};

export default function AdminArtworksPage() {
  const [items, setItems] = useState(initialArtworks);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [useDb, setUseDb] = useState(false);

  const loadFromDb = useCallback(async () => {
    try {
      const data = await fetchArtworks();
      if (data && data.length > 0) {
        setItems(data);
        setUseDb(true);
      }
    } catch {
      // DB not available, use static data
    }
  }, []);

  useEffect(() => { loadFromDb(); }, [loadFromDb]);

  const filtered = items.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new window.FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Upload failed");
        return;
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (art: Artwork) => {
    setForm({
      title: art.title,
      category: art.category,
      medium: art.medium,
      dimensions: art.dimensions,
      year: art.year.toString(),
      price: art.price.toString(),
      description: art.description,
      gradient: art.gradient,
      imageUrl: (art as unknown as Record<string, string>).imageUrl || "",
      aspectRatio: art.aspectRatio,
      badge: art.badge || "",
    });
    setEditId(art.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    if (useDb) {
      try {
        await deleteArtwork(id);
        await loadFromDb();
      } catch {
        setItems(items.filter((a) => a.id !== id));
      }
    } else {
      setItems(items.filter((a) => a.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (useDb) {
      try {
        if (editId) {
          await updateArtwork(editId, { ...form, collection: form.category });
        } else {
          await createArtwork({ ...form, collection: form.category });
        }
        await loadFromDb();
      } catch {
        // Fallback to local state
        const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        if (editId) {
          setItems(items.map((a) => a.id === editId ? { ...a, ...form, slug, year: parseInt(form.year), price: parseInt(form.price), badge: (form.badge || undefined) as Artwork["badge"] } : a));
        } else {
          setItems([{ id: Date.now().toString(), slug, ...form, year: parseInt(form.year), price: parseInt(form.price), badge: (form.badge || undefined) as Artwork["badge"], collection: form.category } as Artwork, ...items]);
        }
      }
    } else {
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (editId) {
        setItems(items.map((a) => a.id === editId ? { ...a, ...form, slug, year: parseInt(form.year), price: parseInt(form.price), badge: (form.badge || undefined) as Artwork["badge"] } : a));
      } else {
        setItems([{ id: Date.now().toString(), slug, ...form, year: parseInt(form.year), price: parseInt(form.price), badge: (form.badge || undefined) as Artwork["badge"], collection: form.category } as Artwork, ...items]);
      }
    }

    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Artworks</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total artworks</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
        >
          + Add New Artwork
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artworks..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg text-[14px] border outline-none transition-colors focus:border-[var(--gold)]"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Artwork" : "Add New Artwork"}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Title *</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none cursor-pointer focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                      {["landscape", "abstract", "floral", "portrait", "contemporary"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Medium *</label>
                    <input required value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} placeholder="Oil on Canvas" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Dimensions *</label>
                    <input required value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder='24 × 36 in' className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Year</label>
                    <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Price (£) *</label>
                    <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Status</label>
                    <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none cursor-pointer focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                      <option value="">Available</option>
                      <option value="new">New</option>
                      <option value="featured">Featured</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Aspect Ratio</label>
                  <div className="flex gap-2 flex-wrap">
                    {["3/4", "4/5", "1/1", "4/3", "5/4", "5/6"].map((r) => (
                      <button key={r} type="button" onClick={() => setForm({ ...form, aspectRatio: r })} className={`px-4 py-1.5 rounded-full text-[12px] border transition-all ${form.aspectRatio === r ? "border-[var(--gold)]" : "border-[var(--border)]"}`} style={{ background: form.aspectRatio === r ? "var(--gold)" : "transparent", color: form.aspectRatio === r ? "#1A1830" : "var(--text2)" }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Artwork Image *</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                        style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
                      >
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        {uploading ? (
                          <>
                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
                            <span className="text-[13px]" style={{ color: "var(--text3)" }}>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl mb-2">📤</span>
                            <span className="text-[13px] font-medium" style={{ color: "var(--text2)" }}>Click to upload image</span>
                            <span className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>JPEG, PNG, WebP up to 10MB</span>
                          </>
                        )}
                      </label>
                      {form.imageUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[11px] truncate flex-1" style={{ color: "var(--emerald)" }}>Image uploaded successfully</span>
                          <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="text-[11px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Remove</button>
                        </div>
                      )}
                    </div>
                    {/* Preview */}
                    <div className="w-32 flex-shrink-0">
                      <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)", aspectRatio: form.aspectRatio }}>
                        {form.imageUrl ? (
                          <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: form.gradient }} />
                        )}
                      </div>
                      <p className="text-[10px] text-center mt-1" style={{ color: "var(--text3)" }}>Preview</p>
                    </div>
                  </div>
                </div>

                {/* Fallback Gradient (used when no image) */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Fallback Colour {form.imageUrl && <span className="normal-case font-normal">(used if image fails to load)</span>}
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {gradientPresets.map((g) => (
                      <button key={g.name} type="button" onClick={() => setForm({ ...form, gradient: g.value })} className={`aspect-square rounded-lg border-2 transition-all ${form.gradient === g.value ? "border-[var(--gold)] scale-110" : "border-transparent"}`} style={{ background: g.value }} title={g.name} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description *</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                    {editId ? "Save Changes" : "Add Artwork"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-lg text-[13px] font-semibold border transition-all hover:border-[var(--rose)]" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artworks Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Preview</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Title</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Category</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Price</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Status</th>
                <th className="text-right px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((art) => (
                <tr key={art.id} className="border-b hover:bg-[var(--bg2)] transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: art.gradient }}>
                      {(art as unknown as Record<string, string>).imageUrl && (
                        <img src={(art as unknown as Record<string, string>).imageUrl} alt={art.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium">{art.title}</td>
                  <td className="px-6 py-3 capitalize" style={{ color: "var(--text2)" }}>{art.category}</td>
                  <td className="px-6 py-3 font-semibold" style={{ color: "var(--gold)" }}>£{art.price.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                      art.badge === "sold" ? "text-red-400 bg-red-400/10" :
                      art.badge === "new" ? "text-green-400 bg-green-400/10" :
                      art.badge === "featured" ? "text-yellow-400 bg-yellow-400/10" :
                      "text-blue-400 bg-blue-400/10"
                    }`}>
                      {art.badge || "Available"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleEdit(art)} className="px-3 py-1 rounded text-[12px] font-medium mr-2 transition-colors hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(art.id)} className="px-3 py-1 rounded text-[12px] font-medium transition-colors hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

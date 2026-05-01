"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  id: string;
  url: string;
  label?: string | null;
  sortOrder: number;
}

interface Product {
  id: string; title: string; slug: string; type: string; description: string; price: number;
  originalPrice?: number | null; imageUrl?: string | null; gradient: string;
  badge?: string | null; material?: string | null; sizes?: string | null; inStock: boolean;
  images?: ProductImage[];
}

interface AdditionalImage {
  url: string;
  label: string;
}

const emptyForm = { title: "", type: "jewellery", description: "", price: "", material: "", sizes: "", imageUrl: "", badge: "", gradient: "linear-gradient(135deg, #667eea, #764ba2)" };

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try { const res = await fetch("/api/products"); setItems(await res.json()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try { const res = await fetch("/api/upload", { method: "POST", body: fd }); const d = await res.json(); if (res.ok) setForm(p => ({ ...p, imageUrl: d.url })); else alert(d.error); } catch { alert("Upload failed"); }
    setUploading(false);
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingAdditional(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) setAdditionalImages(prev => [...prev, { url: d.url, label: "" }]);
      else alert(d.error);
    } catch { alert("Upload failed"); }
    setUploadingAdditional(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: form.price, id: editId, additionalImages };
    if (editId) await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    else await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false); setEditId(null); setForm(emptyForm); setAdditionalImages([]); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div><h1 className="text-[28px] font-semibold">Products</h1><p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total products</p></div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setAdditionalImages([]); }} className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>+ Add Product</button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "jewellery", "clothing", "home-decor"].map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all capitalize" style={{ background: filter === t ? "var(--gold)" : "transparent", borderColor: filter === t ? "var(--gold)" : "var(--border)", color: filter === t ? "#1A1830" : "var(--text2)" }}>
            {t === "all" ? "All" : t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8" style={{ background: "var(--bg)", borderColor: "var(--border)" }} onClick={e => e.stopPropagation()}>
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Product" : "Add Product"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none cursor-pointer focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                      <option value="jewellery">Jewellery</option>
                      <option value="clothing">Clothing</option>
                      <option value="home-decor">Home Decor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Price (£)</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Material</label>
                    <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="e.g. Sterling Silver" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                {/* Sizes - available for all product types */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Sizes <span className="normal-case font-normal">(comma separated, e.g. S, M, L, XL or 6, 7, 8, 9)</span>
                  </label>
                  <input value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Main Product Image</label>
                  <div className="flex gap-4 items-start">
                    <label className={`flex flex-col items-center justify-center flex-1 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      {uploading ? <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-1" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading...</span></> : <><span className="text-2xl mb-1">📤</span><span className="text-[12px]" style={{ color: "var(--text2)" }}>Upload main image</span></>}
                    </label>
                    {form.imageUrl && <div className="w-24 h-24 rounded-lg overflow-hidden"><img src={form.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Additional Images <span className="normal-case font-normal">(e.g. back view, side view, detail shots)</span>
                  </label>
                  <div className="flex gap-3 flex-wrap mb-3">
                    {additionalImages.map((img, i) => (
                      <div key={i} className="relative">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                          <img src={img.url} alt={img.label || `Image ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <input
                          value={img.label}
                          onChange={(e) => setAdditionalImages(prev => prev.map((im, idx) => idx === i ? { ...im, label: e.target.value } : im))}
                          placeholder="Label"
                          className="w-20 mt-1 px-1 py-0.5 rounded text-[10px] border outline-none text-center"
                          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                          style={{ background: "var(--rose)" }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <label className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploadingAdditional ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept="image/*" onChange={handleAdditionalUpload} className="hidden" />
                      {uploadingAdditional ? (
                        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
                      ) : (
                        <span className="text-xl">+</span>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>{editId ? "Save" : "Add Product"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <table className="w-full text-[14px]">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Image</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Title</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Type</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Price</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Images</th>
            <th className="text-right px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b hover:bg-[var(--bg2)]" style={{ borderColor: "var(--border)" }}>
                <td className="px-6 py-3"><div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: p.gradient }}>{p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}</div></td>
                <td className="px-6 py-3 font-medium">{p.title}</td>
                <td className="px-6 py-3 capitalize" style={{ color: "var(--text2)" }}>{p.type.replace("-"," ")}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: "var(--gold)" }}>£{p.price}</td>
                <td className="px-6 py-3" style={{ color: "var(--text3)" }}>{1 + (p.images?.length || 0)}</td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => {
                    setForm({ title: p.title, type: p.type, description: p.description, price: String(p.price), material: p.material || "", sizes: p.sizes || "", imageUrl: p.imageUrl || "", badge: p.badge || "", gradient: p.gradient });
                    setAdditionalImages((p.images || []).map(img => ({ url: img.url, label: img.label || "" })));
                    setEditId(p.id); setShowForm(true);
                  }} className="px-3 py-1 text-[12px] mr-2 hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 text-[12px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>No products yet. Click &quot;+ Add Product&quot; to get started.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

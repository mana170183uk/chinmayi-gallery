"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExhibitionImage {
  id: string;
  url: string;
  caption?: string | null;
  sortOrder: number;
}

interface Exhibition {
  id: string;
  year: string;
  title: string;
  venue: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  sortOrder: number;
  images?: ExhibitionImage[];
}

interface AdditionalImage {
  url: string;
  caption: string;
}

const emptyForm = { year: "", title: "", venue: "", description: "", imageUrl: "", videoUrl: "", sortOrder: "0" };

export default function AdminExhibitionsPage() {
  const [items, setItems] = useState<Exhibition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);

  const load = useCallback(async () => {
    try { const res = await fetch("/api/exhibitions"); setItems(await res.json()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) setForm(p => ({ ...p, imageUrl: d.url }));
      else alert(d.error);
    } catch { alert("Upload failed"); }
    setUploading(false);
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingAdditional(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) setAdditionalImages(prev => [...prev, { url: d.url, caption: "" }]);
      else alert(d.error);
    } catch { alert("Upload failed"); }
    setUploadingAdditional(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, id: editId, additionalImages };
    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/exhibitions", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Failed to save"); return; }
    setShowForm(false); setEditId(null); setForm(emptyForm); setAdditionalImages([]); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exhibition?")) return;
    await fetch("/api/exhibitions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const handleEdit = (ex: Exhibition) => {
    setForm({
      year: ex.year,
      title: ex.title,
      venue: ex.venue,
      description: ex.description || "",
      imageUrl: ex.imageUrl || "",
      videoUrl: ex.videoUrl || "",
      sortOrder: String(ex.sortOrder),
    });
    setAdditionalImages((ex.images || []).map(img => ({ url: img.url, caption: img.caption || "" })));
    setEditId(ex.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Exhibitions</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total exhibitions</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setAdditionalImages([]); }} className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>+ Add Exhibition</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8" style={{ background: "var(--bg)", borderColor: "var(--border)" }} onClick={e => e.stopPropagation()}>
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Exhibition" : "Add Exhibition"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Year *</label>
                    <input required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2026" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Colours of the Soul — Solo Exhibition" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Venue *</label>
                  <input required value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="The Gallery, London" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                {/* Cover image */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Cover Image (optional)</label>
                  <div className="flex gap-4 items-start">
                    <label className={`flex flex-col items-center justify-center flex-1 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      {uploading ? <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-1" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading...</span></> : <><span className="text-2xl mb-1">📤</span><span className="text-[12px]" style={{ color: "var(--text2)" }}>Upload cover image</span></>}
                    </label>
                    {form.imageUrl && <div className="w-24 h-24 rounded-lg overflow-hidden"><img src={form.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>

                {/* Additional images */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Additional Images <span className="normal-case font-normal">(more photos from the exhibition)</span>
                  </label>
                  <div className="flex gap-3 flex-wrap mb-3">
                    {additionalImages.map((img, i) => (
                      <div key={i} className="relative">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                          <img src={img.url} alt={img.caption || `Image ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <input
                          value={img.caption}
                          onChange={(e) => setAdditionalImages(prev => prev.map((im, idx) => idx === i ? { ...im, caption: e.target.value } : im))}
                          placeholder="Caption"
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

                {/* Video URL */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Video URL <span className="normal-case font-normal">(YouTube, Vimeo, or direct .mp4 link)</span>
                  </label>
                  <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>{editId ? "Save" : "Add Exhibition"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <table className="w-full text-[14px]">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Image</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Year</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Title</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Venue</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Media</th>
            <th className="text-right px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(ex => (
              <tr key={ex.id} className="border-b hover:bg-[var(--bg2)]" style={{ borderColor: "var(--border)" }}>
                <td className="px-6 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: "var(--bg2)" }}>
                    {ex.imageUrl && <img src={ex.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-3 font-semibold" style={{ color: "var(--gold)" }}>{ex.year}</td>
                <td className="px-6 py-3 font-medium">{ex.title}</td>
                <td className="px-6 py-3" style={{ color: "var(--text2)" }}>{ex.venue}</td>
                <td className="px-6 py-3 text-[12px]" style={{ color: "var(--text3)" }}>
                  {(ex.images?.length || 0) + (ex.imageUrl ? 1 : 0)} pic{((ex.images?.length || 0) + (ex.imageUrl ? 1 : 0)) === 1 ? "" : "s"}
                  {ex.videoUrl && " · 1 video"}
                </td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => handleEdit(ex)} className="px-3 py-1 text-[12px] mr-2 hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>Edit</button>
                  <button onClick={() => handleDelete(ex.id)} className="px-3 py-1 text-[12px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>No exhibitions yet. Click &quot;+ Add Exhibition&quot; to get started.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

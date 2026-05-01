"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Workshop {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string | null;
  location?: string | null;
  sortOrder: number;
}

const emptyForm = { title: "", date: "", description: "", imageUrl: "", location: "", sortOrder: "0" };

export default function AdminWorkshopsPage() {
  const [items, setItems] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try { const res = await fetch("/api/workshops"); setItems(await res.json()); } catch {}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, id: editId };
    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/workshops", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Failed to save"); return; }
    setShowForm(false); setEditId(null); setForm(emptyForm); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this workshop?")) return;
    await fetch("/api/workshops", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const handleEdit = (w: Workshop) => {
    setForm({
      title: w.title,
      date: w.date,
      description: w.description,
      imageUrl: w.imageUrl || "",
      location: w.location || "",
      sortOrder: String(w.sortOrder),
    });
    setEditId(w.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Art Workshops</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total workshops</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>+ Add Workshop</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8" style={{ background: "var(--bg)", borderColor: "var(--border)" }} onClick={e => e.stopPropagation()}>
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Workshop" : "Add Workshop"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Palm Leaf Etching Masterclass" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Date / Schedule *</label>
                    <input required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Coming 2026 / Monthly Sessions" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Location</label>
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="London Studio / Online" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description *</label>
                  <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Image (optional)</label>
                  <div className="flex gap-4 items-start">
                    <label className={`flex flex-col items-center justify-center flex-1 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      {uploading ? <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-1" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading...</span></> : <><span className="text-2xl mb-1">📤</span><span className="text-[12px]" style={{ color: "var(--text2)" }}>Upload image</span></>}
                    </label>
                    {form.imageUrl && <div className="w-24 h-24 rounded-lg overflow-hidden"><img src={form.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} className="w-32 px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>{editId ? "Save" : "Add Workshop"}</button>
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
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Title</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Date</th>
            <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Location</th>
            <th className="text-right px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(w => (
              <tr key={w.id} className="border-b hover:bg-[var(--bg2)]" style={{ borderColor: "var(--border)" }}>
                <td className="px-6 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: "var(--bg2)" }}>
                    {w.imageUrl && <img src={w.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium">{w.title}</td>
                <td className="px-6 py-3" style={{ color: "var(--gold)" }}>{w.date}</td>
                <td className="px-6 py-3" style={{ color: "var(--text2)" }}>{w.location || "—"}</td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => handleEdit(w)} className="px-3 py-1 text-[12px] mr-2 hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>Edit</button>
                  <button onClick={() => handleDelete(w.id)} className="px-3 py-1 text-[12px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>No workshops yet. Click &quot;+ Add Workshop&quot; to get started.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

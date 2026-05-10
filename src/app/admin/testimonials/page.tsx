"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  avatarGradient: string;
  sortOrder: number;
}

const gradientPresets = [
  { name: "Indigo", value: "linear-gradient(135deg, #667eea, #764ba2)" },
  { name: "Sunset", value: "linear-gradient(135deg, #f093fb, #f5576c)" },
  { name: "Ocean",  value: "linear-gradient(135deg, #4facfe, #00f2fe)" },
  { name: "Gold",   value: "linear-gradient(135deg, #fa709a, #fee140)" },
  { name: "Mint",   value: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  { name: "Rose",   value: "linear-gradient(135deg, #ff9a9e, #fad0c4)" },
];

const emptyForm = {
  name: "",
  role: "",
  text: "",
  avatarGradient: gradientPresets[0].value,
  sortOrder: "0",
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      role: t.role || "",
      text: t.text,
      avatarGradient: t.avatarGradient || gradientPresets[0].value,
      sortOrder: String(t.sortOrder ?? 0),
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, id: editId };
    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Failed to save");
      return;
    }
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Testimonials</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total testimonials</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
        >
          + Add Testimonial
        </button>
      </div>

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
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Sarah Mitchell"
                      className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Role / Location</label>
                    <input
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Art Collector, London"
                      className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Quote *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder="Chinmayi's work transformed our living space — the colours come alive in different lights."
                    className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    Avatar Colour <span className="normal-case font-normal">(circle behind their initial)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-6 gap-2 flex-1">
                      {gradientPresets.map((g) => (
                        <button
                          key={g.name}
                          type="button"
                          onClick={() => setForm({ ...form, avatarGradient: g.value })}
                          className={`aspect-square rounded-lg border-2 transition-all ${form.avatarGradient === g.value ? "border-[var(--gold)] scale-110" : "border-transparent"}`}
                          style={{ background: g.value }}
                          title={g.name}
                        />
                      ))}
                    </div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-[24px] flex-shrink-0" style={{ background: form.avatarGradient }}>
                      {(form.name.charAt(0) || "?").toUpperCase()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    className="w-32 px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <p className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>Lower numbers appear first.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
                  >
                    {editId ? "Save Changes" : "Add Testimonial"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 rounded-lg text-[13px] font-semibold border"
                    style={{ borderColor: "var(--border)", color: "var(--text2)" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      {loading ? (
        <div className="text-center py-20" style={{ color: "var(--text3)" }}>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text3)" }}>
          <div className="text-4xl mb-3">★★★★★</div>
          <p>No testimonials yet. Click &quot;+ Add Testimonial&quot; to add one — it will appear on the home page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-xl border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="text-[14px] mb-3" style={{ color: "var(--gold)" }}>★★★★★</div>
              <p className="text-[14px] italic mb-4 leading-relaxed" style={{ color: "var(--text2)" }}>&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px]" style={{ background: t.avatarGradient }}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate">{t.name}</div>
                  <div className="text-[12px] truncate" style={{ color: "var(--text3)" }}>{t.role}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <button onClick={() => handleEdit(t)} className="text-[12px] hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-[12px] hover:text-[var(--rose)] ml-auto" style={{ color: "var(--text3)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

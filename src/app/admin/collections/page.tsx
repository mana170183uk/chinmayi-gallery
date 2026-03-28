"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collections as initialCollections, artworks } from "@/data/artworks";

export default function AdminCollectionsPage() {
  const [cols, setCols] = useState(initialCollections);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: "", title: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.title.toLowerCase().replace(/\s+/g, "-");
    setCols([...cols, { id, title: form.title, description: form.description, count: 0, gradient: "linear-gradient(135deg, #667eea, #764ba2)" }]);
    setShowForm(false);
    setForm({ id: "", title: "", description: "" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Collections</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{cols.length} collections</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
          + New Collection
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-2xl border p-8" style={{ background: "var(--bg)", borderColor: "var(--border)" }} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-[24px] font-semibold mb-6">New Collection</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Name</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
                  Create Collection
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cols.map((col, i) => {
          const count = artworks.filter((a) => a.collection === col.id).length;
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border overflow-hidden transition-all hover:-translate-y-1"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="h-32" style={{ background: col.gradient }} />
              <div className="p-5">
                <h3 className="text-[18px] font-semibold mb-1">{col.title}</h3>
                <p className="text-[13px] mb-3" style={{ color: "var(--text3)" }}>{col.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--gold)" }}>{count} artworks</span>
                  <button onClick={() => setCols(cols.filter((c) => c.id !== col.id))} className="text-[12px] transition-colors hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: string; title: string; author: string; description: string; price?: number | null;
  imageUrl?: string | null; pdfUrl?: string | null; amazonUrl?: string | null;
  gradient: string; badge?: string | null; pages?: number | null; isbn?: string | null; publishYear?: number | null;
}

const emptyForm = { title: "", author: "Chinmayi", description: "", price: "", imageUrl: "", pdfUrl: "", amazonUrl: "", badge: "", pages: "", isbn: "", publishYear: "", gradient: "linear-gradient(135deg, #667eea, #764ba2)" };

export default function AdminBooksPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { const res = await fetch("/api/books"); setItems(await res.json()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "pdfUrl") => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(field);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) setForm(p => ({ ...p, [field]: d.url }));
      else alert(d.error);
    } catch { alert("Upload failed"); }
    setUploading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, id: editId };
    if (editId) await fetch("/api/books", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    else await fetch("/api/books", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false); setEditId(null); setForm(emptyForm); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    await fetch("/api/books", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div><h1 className="text-[28px] font-semibold">Books</h1><p className="text-[14px]" style={{ color: "var(--text3)" }}>{items.length} total books</p></div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>+ Add Book</button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-8" style={{ background: "var(--bg)", borderColor: "var(--border)" }} onClick={e => e.stopPropagation()}>
              <h2 className="text-[24px] font-semibold mb-6">{editId ? "Edit Book" : "Add Book"}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Author</label>
                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Price (£)</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Pages</label>
                    <input type="number" value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Year</label>
                    <input type="number" value={form.publishYear} onChange={e => setForm({ ...form, publishYear: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>ISBN</label>
                  <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} placeholder="978-0-000-00000-0" className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                {/* Amazon URL */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>
                    🛒 Amazon URL
                  </label>
                  <input value={form.amazonUrl} onChange={e => setForm({ ...form, amazonUrl: e.target.value })} placeholder="https://www.amazon.co.uk/dp/..." className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  <p className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>Paste the full Amazon product URL — visitors will see a &quot;Buy on Amazon&quot; button</p>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>📷 Cover Image</label>
                  <div className="flex gap-4 items-start">
                    <label className={`flex flex-col items-center justify-center flex-1 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading === "imageUrl" ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "imageUrl")} className="hidden" />
                      {uploading === "imageUrl" ? <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-1" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading...</span></> : <><span className="text-2xl mb-1">📤</span><span className="text-[12px]" style={{ color: "var(--text2)" }}>Upload cover image</span></>}
                    </label>
                    {form.imageUrl && <div className="w-20 h-28 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}><img src={form.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>📄 PDF File</label>
                  <div className="flex gap-4 items-center">
                    <label className={`flex flex-col items-center justify-center flex-1 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading === "pdfUrl" ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
                      <input type="file" accept=".pdf,application/pdf" onChange={e => handleFileUpload(e, "pdfUrl")} className="hidden" />
                      {uploading === "pdfUrl" ? <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-1" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading PDF...</span></> : <><span className="text-xl mb-1">📎</span><span className="text-[12px]" style={{ color: "var(--text2)" }}>Upload PDF file</span></>}
                    </label>
                    {form.pdfUrl && (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]" style={{ color: "var(--emerald)" }}>PDF uploaded ✓</span>
                        <button type="button" onClick={() => setForm({ ...form, pdfUrl: "" })} className="text-[11px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Remove</button>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>Visitors will see a &quot;Download PDF&quot; button on the book page</p>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Description *</label>
                  <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>{editId ? "Save" : "Add Book"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Books List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(book => (
          <div key={book.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="aspect-[3/4] relative" style={{ background: book.gradient }}>
              {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-[16px] mb-1">{book.title}</h3>
              <p className="text-[12px] mb-2" style={{ color: "var(--gold)" }}>by {book.author}</p>
              <div className="flex gap-2 mb-3 text-[11px]" style={{ color: "var(--text3)" }}>
                {book.price && <span>£{book.price}</span>}
                {book.pages && <span>· {book.pages}p</span>}
                {book.amazonUrl && <span>· Amazon ✓</span>}
                {book.pdfUrl && <span>· PDF ✓</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ title: book.title, author: book.author, description: book.description, price: book.price ? String(book.price) : "", imageUrl: book.imageUrl || "", pdfUrl: book.pdfUrl || "", amazonUrl: book.amazonUrl || "", badge: book.badge || "", pages: book.pages ? String(book.pages) : "", isbn: book.isbn || "", publishYear: book.publishYear ? String(book.publishYear) : "", gradient: book.gradient }); setEditId(book.id); setShowForm(true); }} className="text-[12px] hover:text-[var(--gold)]" style={{ color: "var(--text2)" }}>Edit</button>
                <button onClick={() => handleDelete(book.id)} className="text-[12px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ color: "var(--text3)" }}>
            <div className="text-4xl mb-3">📚</div>
            <p>No books yet. Click &quot;+ Add Book&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

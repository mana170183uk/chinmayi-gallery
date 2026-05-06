"use client";

import { useState, useEffect, useCallback } from "react";

interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  artistName: string;
  artistBio: string;
  aboutImageUrl: string;
  contactEmail: string;
  instagramUrl: string;
  pinterestUrl: string;
  facebookUrl: string;
}

const empty: Settings = {
  heroTitle: "",
  heroSubtitle: "",
  artistName: "",
  artistBio: "",
  aboutImageUrl: "",
  contactEmail: "",
  instagramUrl: "",
  pinterestUrl: "",
  facebookUrl: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings({ ...empty, ...data });
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedMsg("Settings saved successfully");
        setTimeout(() => setSavedMsg(""), 3000);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save");
      }
    } catch {
      alert("Failed to save settings");
    }
    setSaving(false);
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) setSettings(p => ({ ...p, aboutImageUrl: d.url }));
      else alert(d.error);
    } catch { alert("Upload failed"); }
    setUploading(false);
  };

  if (loading) {
    return <div className="text-center py-20" style={{ color: "var(--text3)" }}>Loading settings...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold">Site Settings</h1>
        <p className="text-[14px]" style={{ color: "var(--text3)" }}>Manage homepage content, artist info, and About-page photo</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* About-page artist photo */}
        <section className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h2 className="text-[18px] font-semibold mb-4">About Page — Artist Photo</h2>
          <p className="text-[13px] mb-4" style={{ color: "var(--text3)" }}>
            This image is shown on the About page. Upload a new photo to replace it.
          </p>
          <div className="flex gap-4 items-start">
            <label className={`flex flex-col items-center justify-center flex-1 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--gold)] ${uploading ? "opacity-50" : ""}`} style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
              <input type="file" accept="image/*" onChange={handleAboutUpload} className="hidden" />
              {uploading ? (
                <><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mb-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} /><span className="text-[12px]" style={{ color: "var(--text3)" }}>Uploading...</span></>
              ) : (
                <><span className="text-2xl mb-2">📤</span><span className="text-[13px] font-medium" style={{ color: "var(--text2)" }}>Click to upload artist photo</span><span className="text-[11px] mt-1" style={{ color: "var(--text3)" }}>JPEG, PNG, WebP up to 10MB</span></>
              )}
            </label>
            {settings.aboutImageUrl && (
              <div className="w-40 flex-shrink-0">
                <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                  <img src={settings.aboutImageUrl} alt="Current About photo" className="w-full h-auto block" />
                </div>
                <p className="text-[10px] text-center mt-1" style={{ color: "var(--text3)" }}>Current</p>
              </div>
            )}
          </div>
          <input
            value={settings.aboutImageUrl}
            onChange={e => setSettings({ ...settings, aboutImageUrl: e.target.value })}
            placeholder="/chinmayi-artist.jpg or full URL"
            className="w-full mt-3 px-4 py-2 rounded-lg text-[12px] border outline-none focus:border-[var(--gold)]"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
          />
        </section>

        {/* Artist info */}
        <section className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h2 className="text-[18px] font-semibold mb-4">Artist Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Artist Name</label>
              <input value={settings.artistName} onChange={e => setSettings({ ...settings, artistName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Artist Bio</label>
              <textarea rows={4} value={settings.artistBio} onChange={e => setSettings({ ...settings, artistBio: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none resize-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h2 className="text-[18px] font-semibold mb-4">Homepage Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Hero Title</label>
              <input value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Hero Subtitle</label>
              <input value={settings.heroSubtitle} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
        </section>

        {/* Contact + Social */}
        <section className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h2 className="text-[18px] font-semibold mb-4">Contact & Social</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Contact Email</label>
              <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Instagram URL</label>
              <input value={settings.instagramUrl} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Facebook URL</label>
              <input value={settings.facebookUrl} onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Pinterest URL</label>
              <input value={settings.pinterestUrl} onChange={e => setSettings({ ...settings, pinterestUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-lg text-[14px] border outline-none focus:border-[var(--gold)]" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
        </section>

        <div className="flex gap-3 items-center">
          <button type="submit" disabled={saving} className="px-8 py-3 rounded-lg font-semibold text-[13px] tracking-wider uppercase transition-all hover:shadow-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {savedMsg && <span className="text-[13px]" style={{ color: "var(--emerald)" }}>{savedMsg}</span>}
        </div>
      </form>
    </div>
  );
}

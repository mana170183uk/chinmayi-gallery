"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not sign you up. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — thank you!"
          : "Welcome to the ChinuN family! You'll hear from us soon."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not sign you up. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-5 py-3.5 rounded-md text-[14px] outline-none border transition-colors focus:border-[var(--gold)]"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3.5 rounded-md text-[13px] font-semibold tracking-wider uppercase transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className="text-[13px] mt-3"
          style={{ color: status === "success" ? "var(--emerald)" : "var(--rose)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

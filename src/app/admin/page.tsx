"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { artworks, collections } from "@/data/artworks";

interface RecentOrder {
  id: string;
  artwork: string;
  customer: string;
  amount: string;
  status: string;
}

const stats = [
  { label: "Total Artworks", value: artworks.length.toString(), icon: "🎨", change: "" },
  { label: "Collections", value: collections.length.toString(), icon: "📁", change: `${collections.length} active` },
  { label: "Total Revenue", value: "£" + artworks.filter(a => a.badge === "sold").reduce((s, a) => s + a.price, 0).toLocaleString(), icon: "💷", change: "" },
  { label: "Available", value: artworks.filter(a => a.badge !== "sold").length.toString(), icon: "✓", change: artworks.filter(a => a.badge === "sold").length + " sold" },
];

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) { setLoadingOrders(false); return; }
        setRecentOrders(
          data.slice(0, 8).map((o: { id: string; customerName: string; total: number; status: string; items?: { artwork?: { title?: string } | null }[] }) => ({
            id: "#" + o.id.slice(-6).toUpperCase(),
            artwork: o.items?.[0]?.artwork?.title || `${o.items?.length || 0} item${o.items?.length === 1 ? "" : "s"}`,
            customer: o.customerName,
            amount: "£" + (o.total || 0).toLocaleString(),
            status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
          }))
        );
        setLoadingOrders(false);
      })
      .catch(() => setLoadingOrders(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Dashboard</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>Welcome back. Here&apos;s your gallery overview.</p>
        </div>
        <Link
          href="/admin/artworks"
          className="px-6 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#1A1830" }}
        >
          + Add Artwork
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl border transition-all hover:-translate-y-1"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[24px]">{stat.icon}</span>
            </div>
            <div className="font-[Playfair_Display] text-[28px] font-bold mb-1">{stat.value}</div>
            <div className="text-[13px] font-medium" style={{ color: "var(--text3)" }}>{stat.label}</div>
            <div className="text-[11px] mt-2" style={{ color: "var(--emerald)" }}>{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-[18px] font-semibold">Recent Orders</h3>
          <span className="text-[12px]" style={{ color: "var(--text3)" }}>Last 30 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Order</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Artwork</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Customer</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Amount</th>
                <th className="text-left px-6 py-3 font-medium text-[12px] uppercase tracking-wider" style={{ color: "var(--text3)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders && (
                <tr><td colSpan={5} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>Loading orders...</td></tr>
              )}
              {!loadingOrders && recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>No orders yet. Customer orders will appear here.</td></tr>
              )}
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-[var(--bg2)] transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--gold)" }}>{order.id}</td>
                  <td className="px-6 py-4">{order.artwork}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text2)" }}>{order.customer}</td>
                  <td className="px-6 py-4 font-semibold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                      order.status === "Delivered" ? "text-green-400 bg-green-400/10" :
                      order.status === "Shipped" ? "text-blue-400 bg-blue-400/10" :
                      "text-yellow-400 bg-yellow-400/10"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {[
          { title: "Manage Artworks", desc: "Add, edit, or remove paintings", href: "/admin/artworks", icon: "🖼️" },
          { title: "Manage Collections", desc: "Organize themed groups", href: "/admin/collections", icon: "📁" },
          { title: "View Website", desc: "See your live gallery", href: "/", icon: "🌐" },
        ].map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="p-6 rounded-xl border transition-all hover:-translate-y-1 hover:border-[var(--card-hover-border)] cursor-pointer" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="text-[24px] mb-3">{card.icon}</div>
              <h4 className="text-[16px] font-semibold mb-1">{card.title}</h4>
              <p className="text-[13px]" style={{ color: "var(--text3)" }}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";

interface OrderItem {
  id: string;
  price: number;
  artwork?: { title: string; imageUrl?: string | null } | null;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  shippingAddress?: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold">Orders</h1>
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all capitalize"
            style={{
              background: filter === s ? "var(--gold)" : "transparent",
              borderColor: filter === s ? "var(--gold)" : "var(--border)",
              color: filter === s ? "#1A1830" : "var(--text2)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Order</th>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Customer</th>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Items</th>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Total</th>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Status</th>
              <th className="text-left px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Date</th>
              <th className="text-right px-6 py-3 text-[12px] uppercase tracking-wider font-medium" style={{ color: "var(--text3)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>Loading orders...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center" style={{ color: "var(--text3)" }}>
                {orders.length === 0 ? "No orders yet. They will appear here once customers checkout." : "No orders match this filter."}
              </td></tr>
            )}
            {filtered.map((o) => (
              <React.Fragment key={o.id}>
                <tr className="border-b hover:bg-[var(--bg2)] cursor-pointer" style={{ borderColor: "var(--border)" }} onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                  <td className="px-6 py-3 font-mono text-[12px]" style={{ color: "var(--gold)" }}>#{o.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-[12px]" style={{ color: "var(--text3)" }}>{o.customerEmail}</div>
                  </td>
                  <td className="px-6 py-3" style={{ color: "var(--text2)" }}>{o.items.length} item{o.items.length === 1 ? "" : "s"}</td>
                  <td className="px-6 py-3 font-semibold" style={{ color: "var(--gold)" }}>£{o.total.toLocaleString()}</td>
                  <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="px-3 py-1 rounded text-[12px] border outline-none cursor-pointer"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-3 text-[12px]" style={{ color: "var(--text3)" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => deleteOrder(o.id)} className="px-3 py-1 text-[12px] hover:text-[var(--rose)]" style={{ color: "var(--text3)" }}>Delete</button>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr style={{ background: "var(--bg2)" }}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-2">
                        {o.shippingAddress && (
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text3)" }}>Shipping: </span>
                            <span className="text-[13px]">{o.shippingAddress}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text3)" }}>Items in this order</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {o.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0" style={{ background: "var(--bg2)" }}>
                                  {it.artwork?.imageUrl && <img src={it.artwork.imageUrl} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[13px] font-medium truncate">{it.artwork?.title || "Unknown"}</div>
                                  <div className="text-[12px]" style={{ color: "var(--gold)" }}>£{it.price.toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Artworks", href: "/admin/artworks", icon: "🎨" },
  { label: "Products", href: "/admin/products", icon: "🛍️" },
  { label: "Books", href: "/admin/books", icon: "📚" },
  { label: "Orders", href: "/admin", icon: "📦" },
  { label: "Settings", href: "/admin", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Skip auth check on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }

    fetch("/api/admin/verify")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // Show login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[72px] relative z-[1]">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
          <p className="text-[14px]" style={{ color: "var(--text3)" }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] flex relative z-[1]">
      {/* Sidebar */}
      <aside className="w-64 fixed top-[72px] left-0 bottom-0 border-r overflow-y-auto hidden lg:block" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="p-6">
          <h3 className="text-[18px] font-semibold mb-1">Admin Panel</h3>
          <p className="text-[12px]" style={{ color: "var(--text3)" }}>Manage your gallery</p>
        </div>
        <nav className="px-3 pb-6">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium mb-1 transition-all ${
                pathname === link.href
                  ? "text-[#1A1830]"
                  : "hover:bg-[var(--bg3)]"
              }`}
              style={{
                background: pathname === link.href ? "var(--gold)" : "transparent",
                color: pathname === link.href ? "#1A1830" : "var(--text2)",
              }}
            >
              <span className="text-[16px]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-6 space-y-3">
          <Link href="/" className="block text-[13px] hover:text-[var(--gold)] transition-colors" style={{ color: "var(--text3)" }}>
            ← Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="block text-[13px] transition-colors hover:text-[var(--rose)]"
            style={{ color: "var(--text3)" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 lg:ml-64 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}

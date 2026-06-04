"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV, getActiveKey } from "@/lib/nav";
import { supabase } from "@/lib/supabase";
import { setToken } from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const active = getActiveKey(pathname);

  async function logout() {
    await supabase.auth.signOut().catch(() => {});
    setToken(null);
    router.replace("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="brand-name" style={{ marginTop: 10 }}>
          La Ménagère
          <br />
          Paris
        </div>
        <div className="brand-subtitle">Administration</div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = n.key === active;
          return (
            <Link
              key={n.key}
              href={n.href}
              className={`nav-item${isActive ? " active" : ""}`}
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <span className="nav-label">{n.label}</span>
              {n.badge && (
                <span
                  className={`nav-badge${
                    n.badgeClass ? " " + n.badgeClass : ""
                  }`}
                >
                  {n.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button
          type="button"
          className="profile-block"
          onClick={logout}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
          title="Se déconnecter"
        >
          <div className="avatar">AZ</div>
          <div className="profile-info">
            <div className="pn">Administrateur</div>
            <div className="pr">Se déconnecter</div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <LogOut size={14} strokeWidth={1.8} />
          </span>
        </button>
      </div>
    </aside>
  );
}

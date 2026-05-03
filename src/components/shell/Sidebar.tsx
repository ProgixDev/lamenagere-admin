"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { NAV, getActiveKey } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const active = getActiveKey(pathname);

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
        <div className="profile-block">
          <div className="avatar">AZ</div>
          <div className="profile-info">
            <div className="pn">Azdine Khelifa</div>
            <div className="pr">Administrateur</div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </aside>
  );
}

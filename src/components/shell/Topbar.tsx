"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { getBreadcrumb } from "@/lib/nav";
import { useCurrentUser } from "@/lib/user-context";
import { ADMIN_ROLE_LABELS } from "@/lib/types";

export function Topbar() {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname);
  const { user } = useCurrentUser();

  const initials = user
    ? user.fullName.trim().split(/\s+/).map((w) => w[0] ?? "").slice(0, 2).join("").toUpperCase() || user.email[0].toUpperCase()
    : "?";

  const roleLabel = user ? (ADMIN_ROLE_LABELS[user.role] ?? user.role) : "";

  return (
    <div className="topbar">
      <div className="breadcrumb">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={i}>
              {isLast || !c.href ? (
                <span className={isLast ? "current" : "crumb"}>{c.label}</span>
              ) : (
                <Link className="crumb" href={c.href}>
                  {c.label}
                </Link>
              )}
              {!isLast && <span className="sep">/</span>}
            </Fragment>
          );
        })}
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={1.6} />
          <span className="dot"></span>
        </button>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1 }}>
              {user.fullName || user.email}
              {roleLabel && (
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "var(--primary)",
                    fontWeight: 600,
                  }}
                >
                  {roleLabel}
                </span>
              )}
            </span>
            <div className="avatar sm">{initials}</div>
          </div>
        )}
      </div>
    </div>
  );
}

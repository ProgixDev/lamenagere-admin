"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart, FileText, MessageSquare, Package,
  Users, Bell, Layers, LogIn, Activity,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { ActivityEntry, ActivityKind } from "@/lib/types";

const KIND_ICON: Record<ActivityKind, React.ReactNode> = {
  order:    <ShoppingCart size={12} strokeWidth={2} />,
  quote:    <FileText    size={12} strokeWidth={2} />,
  message:  <MessageSquare size={12} strokeWidth={2} />,
  product:  <Package    size={12} strokeWidth={2} />,
  customer: <Users      size={12} strokeWidth={2} />,
  auth:     <LogIn      size={12} strokeWidth={2} />,
  campaign: <Bell       size={12} strokeWidth={2} />,
  system:   <Layers     size={12} strokeWidth={2} />,
};

// pill class + inline color for kinds that don't have a system pill variant
const KIND_PILL_CLASS: Record<ActivityKind, string> = {
  order:    "pill pill-navy-soft",
  quote:    "pill",          // custom inline
  message:  "pill pill-success-soft",
  product:  "pill pill-warning-soft",
  customer: "pill",          // custom inline
  auth:     "pill pill-error-soft",
  campaign: "pill",          // custom inline
  system:   "pill pill-outline",
};

const KIND_CUSTOM_STYLE: Partial<Record<ActivityKind, React.CSSProperties>> = {
  quote:    { background: "rgba(124,58,237,0.10)", color: "#7C3AED" },
  customer: { background: "rgba(8,145,178,0.10)",  color: "#0891B2" },
  campaign: { background: "rgba(219,39,119,0.10)", color: "#DB2777" },
};

const KIND_LABELS: Record<ActivityKind, string> = {
  order:    "Commande",
  quote:    "Devis",
  message:  "Message",
  product:  "Produit",
  customer: "Client",
  auth:     "Auth",
  campaign: "Campagne",
  system:   "Système",
};

const ACTION_BADGE: Record<string, { label: string; style: React.CSSProperties }> = {
  LOGIN:   { label: "Connexion",    style: { background: "rgba(186,26,26,0.08)", color: "#ba1a1a" } },
  LOGOUT:  { label: "Déconnexion",  style: { background: "rgba(186,26,26,0.08)", color: "#ba1a1a" } },
  CREATE:  { label: "Création",     style: { background: "rgba(16,185,129,0.10)", color: "#047857" } },
  UPDATE:  { label: "Modification", style: { background: "rgba(245,158,11,0.10)", color: "#92400E" } },
  DELETE:  { label: "Suppression",  style: { background: "rgba(186,26,26,0.08)", color: "#ba1a1a" } },
  OTHER:   { label: "Action",       style: { background: "rgba(100,116,139,0.10)", color: "#64748b" } },
};

const ALL_KINDS: ActivityKind[] = [
  "order", "quote", "message", "product", "customer", "auth", "campaign", "system",
];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "à l'instant";
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function emailInitials(email: string | null): string {
  if (!email) return "?";
  return email[0].toUpperCase();
}

export default function ActivityPage() {
  const [entries, setEntries]     = useState<ActivityEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filterKind, setFilterKind] = useState<ActivityKind | "">("");
  const [page, setPage]           = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => { load(); }, [filterKind, page]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (filterKind) qs.set("kind", filterKind);
      qs.set("limit", String(PAGE_SIZE));
      qs.set("offset", String(page * PAGE_SIZE));
      const data = await adminApi.activity.list(qs.toString() ? `?${qs}` : "") as ActivityEntry[];
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal d&apos;activité</h1>
          <p className="page-subtitle">Toutes les actions effectuées par les administrateurs.</p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginRight: 6 }}>
          Filtrer
        </span>
        <button
          className={`pill ${filterKind === "" ? "pill-navy" : "pill-outline"}`}
          style={{ cursor: "pointer", border: "none" }}
          onClick={() => { setFilterKind(""); setPage(0); }}
        >
          Tout
        </button>
        {ALL_KINDS.map((k) => (
          <button
            key={k}
            className={`pill ${filterKind === k ? "pill-navy" : "pill-outline"}`}
            style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
            onClick={() => { setFilterKind(k); setPage(0); }}
          >
            {KIND_ICON[k]}
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="card-title">Activité</span>
            {!loading && (
              <span className="pill pill-outline" style={{ fontSize: 11 }}>
                {entries.length}{entries.length === PAGE_SIZE ? "+" : ""} entrée{entries.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th style={{ width: 120 }}>Type</th>
              <th style={{ width: 110 }}>Action</th>
              <th>Résumé</th>
              <th style={{ width: 200 }}>Utilisateur</th>
              <th style={{ width: 130 }}>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "56px 16px", color: "var(--on-surface-variant)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <Activity size={24} strokeWidth={1.4} style={{ opacity: 0.35 }} />
                    <span style={{ fontSize: 13 }}>Chargement…</span>
                  </div>
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "64px 16px", color: "var(--on-surface-variant)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <Activity size={28} strokeWidth={1.3} style={{ opacity: 0.3 }} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Aucune activité enregistrée</span>
                    <span style={{ fontSize: 13, opacity: 0.6 }}>Les actions des admins apparaîtront ici.</span>
                  </div>
                </td>
              </tr>
            ) : (
              entries.map((e) => {
                const actionBadge = e.action ? (ACTION_BADGE[e.action] ?? ACTION_BADGE.OTHER) : null;
                return (
                  <tr key={e.id}>
                    {/* Date */}
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--on-surface)" }}>
                        {fmtDate(e.createdAt)}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--on-surface-variant)", marginTop: 2 }}>
                        {relativeTime(e.createdAt)}
                      </div>
                    </td>

                    {/* Kind badge */}
                    <td>
                      <span
                        className={KIND_PILL_CLASS[e.kind]}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          ...(KIND_CUSTOM_STYLE[e.kind] ?? {}),
                        }}
                      >
                        {KIND_ICON[e.kind]}
                        {KIND_LABELS[e.kind]}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      {actionBadge ? (
                        <span
                          className="pill"
                          style={{ fontSize: 10, letterSpacing: "0.06em", ...actionBadge.style }}
                        >
                          {actionBadge.label}
                        </span>
                      ) : (
                        <span style={{ color: "var(--on-surface-variant)", fontSize: 12 }}>—</span>
                      )}
                    </td>

                    {/* Summary */}
                    <td>
                      <span style={{ fontSize: 13, color: "var(--on-surface)" }}>{e.summary}</span>
                      {e.entityRef && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 10,
                            color: "var(--on-surface-variant)",
                            fontFamily: "var(--font-mono)",
                            background: "var(--surface-container-low)",
                            padding: "1px 5px",
                            borderRadius: 3,
                          }}
                        >
                          #{e.entityRef.slice(0, 8)}
                        </span>
                      )}
                    </td>

                    {/* Actor */}
                    <td>
                      {e.actorEmail ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div
                            className="avatar sm"
                            style={{ flexShrink: 0, fontSize: 9 }}
                          >
                            {emailInitials(e.actorEmail)}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--on-surface-variant)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 160,
                            }}
                            title={e.actorEmail}
                          >
                            {e.actorEmail}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--on-surface-variant)", opacity: 0.4 }}>—</span>
                      )}
                    </td>

                    {/* IP */}
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: "var(--on-surface-variant)",
                          background: "var(--surface-container-low)",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {e.ipAddress ?? "—"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ── Pagination footer ── */}
        {!loading && entries.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderTop: "1px solid var(--outline-soft, var(--outline-variant))",
            }}
          >
            <button
              className="btn btn-outline btn-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Précédent
            </button>
            <span style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>
              Page <strong style={{ color: "var(--on-surface)" }}>{page + 1}</strong>
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={entries.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

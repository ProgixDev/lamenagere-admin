"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, FileText, MessageSquare, Package, Users, Bell, Shield, Layers, LogIn } from "lucide-react";
import { adminApi } from "@/lib/api";
import { ActivityEntry, ActivityKind } from "@/lib/types";

const KIND_ICON: Record<ActivityKind, React.ReactNode> = {
  order: <ShoppingCart size={14} strokeWidth={1.8} />,
  quote: <FileText size={14} strokeWidth={1.8} />,
  message: <MessageSquare size={14} strokeWidth={1.8} />,
  product: <Package size={14} strokeWidth={1.8} />,
  customer: <Users size={14} strokeWidth={1.8} />,
  auth: <LogIn size={14} strokeWidth={1.8} />,
  campaign: <Bell size={14} strokeWidth={1.8} />,
  system: <Layers size={14} strokeWidth={1.8} />,
};

const KIND_COLORS: Record<ActivityKind, string> = {
  order: "#2563EB",
  quote: "#7C3AED",
  message: "#059669",
  product: "#D97706",
  customer: "#0891B2",
  auth: "#DC2626",
  campaign: "#DB2777",
  system: "#6B7280",
};

const KIND_LABELS: Record<ActivityKind, string> = {
  order: "Commande",
  quote: "Devis",
  message: "Message",
  product: "Produit",
  customer: "Client",
  auth: "Auth",
  campaign: "Campagne",
  system: "Système",
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
  OTHER: "Action",
};

const ALL_KINDS: ActivityKind[] = [
  "order", "quote", "message", "product", "customer", "auth", "campaign", "system",
];

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKind, setFilterKind] = useState<ActivityKind | "">("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    load();
  }, [filterKind, page]);

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

  function fmtDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal d&apos;activité</h1>
          <p className="page-subtitle">
            Toutes les actions effectuées par les administrateurs.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          className={`btn btn-sm ${filterKind === "" ? "btn-primary" : "btn-outline"}`}
          onClick={() => { setFilterKind(""); setPage(0); }}
        >
          Tout
        </button>
        {ALL_KINDS.map((k) => (
          <button
            key={k}
            className={`btn btn-sm ${filterKind === k ? "btn-primary" : "btn-outline"}`}
            onClick={() => { setFilterKind(k); setPage(0); }}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Action</th>
              <th>Résumé</th>
              <th>Utilisateur</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                  Chargement…
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                  Aucune activité enregistrée.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {fmtDate(e.createdAt)}
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: KIND_COLORS[e.kind] + "18",
                        color: KIND_COLORS[e.kind],
                      }}
                    >
                      {KIND_ICON[e.kind]}
                      {KIND_LABELS[e.kind]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {e.action ? (ACTION_LABELS[e.action] ?? e.action) : "—"}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {e.summary}
                    {e.entityRef && (
                      <span style={{ marginLeft: 6, fontSize: 11, color: "var(--muted)" }}>
                        #{e.entityRef.slice(0, 8)}
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>
                    {e.actorEmail ?? "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)", fontFamily: "monospace" }}>
                    {e.ipAddress ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
        <button
          className="btn btn-outline btn-sm"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Précédent
        </button>
        <span style={{ padding: "4px 12px", fontSize: 13, color: "var(--muted)" }}>
          Page {page + 1}
        </span>
        <button
          className="btn btn-outline btn-sm"
          disabled={entries.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

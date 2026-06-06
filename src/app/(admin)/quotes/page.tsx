"use client";

import { useEffect, useState, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

type ColKey = "pending" | "sent" | "accepted" | "rejected";

interface AdminQuote {
  id: string;
  product: string;
  productImage: string;
  client: string;
  b2b?: boolean;
  dimensions?: string;
  status: "en_attente_devis" | "devis_envoye" | "devis_accepte" | "devis_rejete";
  statusLabel: string;
  quotedPrice?: string;
  createdAt: string;
  attachments?: number;
}

const STATUS_COL: Record<AdminQuote["status"], ColKey> = {
  en_attente_devis: "pending",
  devis_envoye: "sent",
  devis_accepte: "accepted",
  devis_rejete: "rejected",
};
const COL_STATUS: Record<ColKey, AdminQuote["status"]> = {
  pending: "en_attente_devis",
  sent: "devis_envoye",
  accepted: "devis_accepte",
  rejected: "devis_rejete",
};

const COL_DEFS: { key: ColKey; label: string; accent: string }[] = [
  { key: "pending", label: "En attente", accent: "var(--warning)" },
  { key: "sent", label: "Devis envoyé", accent: "var(--primary)" },
  { key: "accepted", label: "Accepté", accent: "var(--success)" },
  { key: "rejected", label: "Refusé", accent: "var(--error)" },
];

const PhotoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

function relativeTime(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `il y a ${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<ColKey | null>(null);

  function load() {
    setLoading(true);
    adminApi.quotes
      .list("")
      .then((r) => setQuotes((r as AdminQuote[]) ?? []))
      .catch((e: { message?: string }) =>
        toast.error(e?.message ?? "Chargement impossible"),
      )
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const counts: Record<ColKey, number> = { pending: 0, sent: 0, accepted: 0, rejected: 0 };
  quotes.forEach((q) => { counts[STATUS_COL[q.status]] += 1; });

  function onDragStart(e: DragEvent<HTMLDivElement>, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }
  function onDragOver(e: DragEvent<HTMLDivElement>, col: ColKey) {
    e.preventDefault();
    if (overCol !== col) setOverCol(col);
  }
  async function onDrop(e: DragEvent<HTMLDivElement>, col: ColKey) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    setDraggingId(null);
    setOverCol(null);
    if (!id) return;
    const quote = quotes.find((q) => q.id === id);
    if (!quote || STATUS_COL[quote.status] === col) return;

    const newStatus = COL_STATUS[col];
    const prev = quotes;
    setQuotes((qs) => qs.map((q) => (q.id === id ? { ...q, status: newStatus } : q)));
    try {
      await adminApi.quotes.setStatus(id, newStatus);
    } catch (err) {
      setQuotes(prev); // revert
      toast.error((err as { message?: string })?.message ?? "Déplacement impossible");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Devis</h1>
          <div className="page-subtitle">
            {loading ? "Chargement…" : `${counts.pending} demande(s) en attente`}
          </div>
        </div>
      </div>

      <div className="kanban">
        {COL_DEFS.map((col) => {
          const colCards = quotes.filter((q) => STATUS_COL[q.status] === col.key);
          const isOver = overCol === col.key;
          return (
            <div
              key={col.key}
              className="kanban-col"
              onDragOver={(e) => onDragOver(e, col.key)}
              onDragLeave={(e) => { if (e.currentTarget === e.target) setOverCol(null); }}
              onDrop={(e) => onDrop(e, col.key)}
              style={{
                outline: isOver ? "2px dashed var(--primary)" : undefined,
                outlineOffset: isOver ? -2 : undefined,
                background: isOver ? "rgba(0,36,68,0.04)" : undefined,
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "4px 4px 12px", borderBottom: "1px solid var(--outline-soft)" }}>
                <div className="hstack">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent }}></span>
                  <span style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase" }}>{col.label}</span>
                  <span style={{ fontSize: 11, color: "var(--outline)", background: "var(--surface)", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{counts[col.key]}</span>
                </div>
              </div>

              {colCards.map((c) => {
                const isDragging = draggingId === c.id;
                return (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, c.id)}
                    onDragEnd={() => { setDraggingId(null); setOverCol(null); }}
                    onClick={() => { if (!draggingId) router.push(`/quotes/${c.id}`); }}
                    style={{
                      background: "var(--surface)",
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 10,
                      boxShadow: isDragging ? "var(--shadow-pop)" : "0 1px 2px rgba(0,0,0,0.04)",
                      cursor: "grab",
                      transition: "all 0.15s",
                      border: "1px solid transparent",
                      opacity: isDragging ? 0.4 : 1,
                    }}
                  >
                    <div className="hstack" style={{ gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      {c.productImage && <div className="thumb sm" style={{ backgroundImage: `url(${c.productImage})` }}></div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{c.product}</div>
                        <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 3 }}>
                          {c.client}
                          {c.b2b && <> · <span style={{ color: "var(--secondary)", fontWeight: 600 }}>PRO</span></>}
                        </div>
                      </div>
                    </div>
                    {c.dimensions && (
                      <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", fontFamily: "var(--mono)", marginBottom: 8 }}>
                        {c.dimensions}
                      </div>
                    )}
                    {c.quotedPrice && (
                      <div style={{ fontFamily: "var(--display)", fontWeight: 600, color: "var(--secondary)", fontSize: 18, letterSpacing: "-0.02em", marginBottom: 8 }}>
                        {c.quotedPrice}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--outline)", paddingTop: 8, borderTop: "1px solid var(--outline-soft)" }}>
                      <span>{relativeTime(c.createdAt)}</span>
                      {(c.attachments ?? 0) > 0 && (
                        <span className="hstack-tight" style={{ gap: 3 }}>
                          <PhotoIcon />
                          {c.attachments}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {colCards.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--outline)", fontSize: 12 }}>
                  {isOver ? "Déposer ici" : "—"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

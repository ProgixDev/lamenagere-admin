"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal } from "lucide-react";

type Card = {
  product: string;
  client: string;
  tag?: string;
  time: string;
  dim?: string;
  photos?: number;
  msg?: number;
  price?: string;
  reason?: string;
  img: string;
};

type Col = { key: string; label: string; count: number; accent: string; cards: Card[] };

const COLS: Col[] = [
  { key: "pending", label: "En attente", count: 12, accent: "var(--warning)", cards: [
    { product: "Cuisine Noire & Or", client: "Karim Benali", tag: "PRO", time: "il y a 35 min", dim: "350 × 220 cm", photos: 4, msg: 1, img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=120" },
    { product: "Porte Pivotante Luxe", client: "Sophie Mercier", time: "il y a 2 h", dim: "120 × 260 cm", photos: 0, msg: 0, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120" },
    { product: "Dressing Walk-In Bois", client: "Vincent Roussel", time: "il y a 5 h", dim: "400 × 280 cm", photos: 6, msg: 0, img: "https://images.unsplash.com/photo-1558997519-3897dc05ed95?w=120" },
    { product: "Cuisine Îlot Chêne", client: "Léa Moreau", time: "Hier", dim: "280 × 200 cm", photos: 2, msg: 0, img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120" },
    { product: "Baie Vitrée XXL", client: "Maison Moderne", tag: "PRO", time: "Hier", dim: "600 × 280 cm", photos: 3, msg: 2, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120" },
  ] },
  { key: "sent", label: "Devis envoyé", count: 14, accent: "var(--primary)", cards: [
    { product: "Cuisine Luxe Îlot Arrondi", client: "Amina Tazi", price: "18 400 €", time: "envoyé il y a 1 j", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120" },
    { product: "Porte Noire LED", client: "Olivier Dubois", price: "5 200 €", time: "envoyé il y a 2 j", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120" },
    { product: "Dressing complet", client: "SARL Atelier Sud", tag: "PRO", price: "14 100 €", time: "envoyé il y a 3 j", img: "https://images.unsplash.com/photo-1558997519-3897dc05ed95?w=120" },
    { product: "Cuisine Crème Marbre", client: "Camille Leroux", price: "16 800 €", time: "envoyé il y a 4 j", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=120" },
  ] },
  { key: "accepted", label: "Accepté", count: 8, accent: "var(--success)", cards: [
    { product: "Cuisine Marbre Noir", client: "EURL Décor Plus", tag: "PRO", price: "22 400 €", time: "accepté il y a 2 j", img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=120" },
    { product: "Porte Géométrique custom", client: "Camille Leroux", price: "4 200 €", time: "accepté Hier", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=120" },
    { product: "Cuisine Bois & Marbre", client: "Maison Moderne", tag: "PRO", price: "19 600 €", time: "accepté il y a 4 j", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120" },
  ] },
  { key: "rejected", label: "Refusé", count: 4, accent: "var(--error)", cards: [
    { product: "Baie Vitrée XXL", client: "anonyme", reason: "prix trop élevé", time: "refusé il y a 5 j", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120" },
    { product: "Cuisine Îlot Long", client: "Jean Laurent", reason: "délai trop long", time: "refusé il y a 8 j", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120" },
  ] },
];

const PhotoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const MsgIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FILTER_TABS = [
  { key: "all", label: "Tous", count: 38 },
  { key: "pending", label: "En attente", count: 12 },
  { key: "sent", label: "Envoyés", count: 14 },
  { key: "accepted", label: "Acceptés", count: 8 },
  { key: "rejected", label: "Refusés", count: 4 },
];

export default function QuotesPage() {
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Devis</h1>
          <div className="page-subtitle">
            12 demandes en attente · délai de réponse moyen : 28 heures · 142 800 € de devis envoyés
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">Modèles de devis</button>
          <button className="btn btn-primary">
            <Plus size={14} strokeWidth={2} />
            <span>Nouveau devis</span>
          </button>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {FILTER_TABS.map((t) => (
          <button key={t.key} className={`chip${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}></div>
        <div className="seg">
          <button className={`seg-btn${view === "kanban" ? " active" : ""}`} onClick={() => setView("kanban")}>Kanban</button>
          <button className={`seg-btn${view === "table" ? " active" : ""}`} onClick={() => setView("table")}>Tableau</button>
        </div>
      </div>

      <div className="kanban">
        {COLS.map((col) => (
          <div key={col.key} className="kanban-col">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "4px 4px 12px", borderBottom: "1px solid var(--outline-soft)" }}>
              <div className="hstack">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent }}></span>
                <span style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase" }}>{col.label}</span>
                <span style={{ fontSize: 11, color: "var(--outline)", background: "var(--surface)", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{col.count}</span>
              </div>
              <button className="icon-btn" style={{ width: 24, height: 24 }}>
                <MoreHorizontal size={16} strokeWidth={2} />
              </button>
            </div>

            {col.cards.map((c, i) => (
              <div
                key={i}
                onClick={() => router.push("/quotes/DEV-2026-012")}
                style={{
                  background: "var(--surface)",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 10,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: "1px solid transparent",
                }}
              >
                <div className="hstack" style={{ gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="thumb sm" style={{ backgroundImage: `url(${c.img})` }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{c.product}</div>
                    <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 3 }}>
                      {c.client}
                      {c.tag && (
                        <>
                          {" · "}
                          <span style={{ color: "var(--secondary)", fontWeight: 600 }}>{c.tag}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {c.dim && (
                  <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", fontFamily: "var(--mono)", marginBottom: 8 }}>
                    {c.dim}
                  </div>
                )}
                {c.price && (
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, color: "var(--secondary)", fontSize: 18, letterSpacing: "-0.02em", marginBottom: 8 }}>
                    {c.price}
                  </div>
                )}
                {c.reason && (
                  <div style={{ fontSize: 11, color: "var(--error)", fontStyle: "italic", marginBottom: 8 }}>
                    Raison : {c.reason}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--outline)", paddingTop: 8, borderTop: "1px solid var(--outline-soft)" }}>
                  <span>{c.time}</span>
                  <div className="hstack-tight">
                    {(c.photos ?? 0) > 0 && (
                      <span className="hstack-tight" style={{ gap: 3 }}>
                        <PhotoIcon />
                        {c.photos}
                      </span>
                    )}
                    {(c.msg ?? 0) > 0 && (
                      <span className="hstack-tight" style={{ gap: 3, color: "var(--secondary)", fontWeight: 600, marginLeft: 8 }}>
                        <MsgIcon />
                        {c.msg}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {col.cards.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--outline)", fontSize: 12 }}>
                Tout est à jour ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

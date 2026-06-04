"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  ShoppingCart,
  FileText,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Plus,
  Bell,
  Star,
} from "lucide-react";
import { AreaChart } from "@/components/charts/AreaChart";
import { adminApi } from "@/lib/api";
import { formatEUR } from "@/lib/format";

type Tone = "navy" | "bronze" | "warn" | "success";
type KpiIconKey = "trendUp" | "cart" | "file" | "userPlus";

interface AdminOrder {
  id: string;
  client: string;
  clientInitials: string;
  b2b?: boolean;
  items: string;
  total: string;
  status: string;
  statusLabel: string;
  image: string;
}

interface DashboardData {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    pendingQuotes: number;
    unreadMessages: number;
  };
  revenueByDay: { date: string; total: number }[];
  categoryBreakdown: { category: string; total: number }[];
  recentOrders: AdminOrder[];
  activity: {
    id: string;
    kind: string;
    summary: string;
    createdAt: string;
  }[];
}

const STATUS_PILL: Record<string, string> = {
  commande_confirmee: "pill",
  en_preparation: "pill-prep",
  en_attente_expedition: "pill-warning",
  expediee: "pill-bronze",
  livree: "pill-success",
};

const ACTIVITY_COLOR: Record<string, string> = {
  order: "#10B981",
  quote: "#7f5531",
  message: "#002444",
  product: "#F59E0B",
  customer: "#F59E0B",
  campaign: "#002444",
  auth: "#73777f",
  system: "#73777f",
};

function KpiIcon({ keyName, tone }: { keyName: KpiIconKey; tone: Tone }) {
  const cls = tone === "navy" ? "kpi-icon" : `kpi-icon ${tone}`;
  let Icon = UserPlus;
  if (keyName === "trendUp") Icon = TrendingUp;
  else if (keyName === "cart") Icon = ShoppingCart;
  else if (keyName === "file") Icon = FileText;
  return (
    <div className={cls}>
      <Icon size={18} strokeWidth={1.6} />
    </div>
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.round(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  return `il y a ${d} j`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((d) => setData(d as DashboardData))
      .catch((e: { message?: string }) =>
        setError(e?.message ?? "Chargement impossible"),
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const kpis = [
    {
      caption: "Chiffre d'affaires",
      value: stats ? formatEUR(stats.totalRevenue) : "—",
      foot: "Total encaissé",
      iconKey: "trendUp" as KpiIconKey,
      tone: "success" as Tone,
    },
    {
      caption: "Commandes",
      value: stats ? String(stats.totalOrders) : "—",
      foot: "Toutes périodes",
      iconKey: "cart" as KpiIconKey,
      tone: "navy" as Tone,
    },
    {
      caption: "Devis en attente",
      value: stats ? String(stats.pendingQuotes) : "—",
      foot: "À traiter",
      iconKey: "file" as KpiIconKey,
      tone: "warn" as Tone,
    },
    {
      caption: "Commandes à traiter",
      value: stats ? String(stats.pendingOrders) : "—",
      foot: `${stats?.unreadMessages ?? 0} message(s) non lu(s)`,
      iconKey: "userPlus" as KpiIconKey,
      tone: "bronze" as Tone,
    },
  ];

  const revenueData = (data?.revenueByDay ?? []).map((r) => r.total);
  const maxCat = Math.max(1, ...(data?.categoryBreakdown ?? []).map((c) => c.total));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <div className="page-subtitle">
            {loading
              ? "Chargement…"
              : error
                ? `Erreur : ${error}`
                : "Aperçu de l'activité en temps réel"}
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">
            <Download size={14} strokeWidth={1.8} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} className="kpi">
            <div className="kpi-top">
              <KpiIcon keyName={k.iconKey} tone={k.tone} />
            </div>
            <div className="kpi-caption">{k.caption}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-foot">{k.foot}</div>
          </div>
        ))}
      </div>

      <div className="row-1-1" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                Chiffre d&apos;affaires · 30 derniers jours
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: "-0.02em",
                }}
              >
                {stats ? formatEUR(stats.totalRevenue) : "—"}
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 16px 18px" }}>
            {revenueData.length > 0 ? (
              <AreaChart data={revenueData} />
            ) : (
              <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>
                Aucune commande sur la période.
              </div>
            )}
          </div>
        </div>

        <div className="card card-padded">
          <div style={{ marginBottom: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              Répartition
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: "-0.01em",
              }}
            >
              Par catégorie
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(data?.categoryBreakdown ?? []).map((c) => (
              <div key={c.category}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.category}</span>
                  <span
                    className="num"
                    style={{
                      fontFamily: "var(--display)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--secondary)",
                    }}
                  >
                    {formatEUR(c.total)}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--surface-container-low)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round((c.total / maxCat) * 100)}%`,
                      background:
                        "linear-gradient(90deg, var(--primary), var(--primary-container))",
                      borderRadius: 999,
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {!loading && (data?.categoryBreakdown ?? []).length === 0 && (
              <div style={{ color: "var(--outline)", fontSize: 13 }}>
                Aucune vente enregistrée.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Commandes récentes</div>
            </div>
            <Link href="/orders" className="card-link">
              Voir tout →
            </Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders ?? []).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 12.5,
                          fontWeight: 500,
                        }}
                      >
                        #{o.id}
                      </div>
                    </td>
                    <td>
                      <div className="hstack" style={{ gap: 10 }}>
                        <div className="avatar sm">{o.clientInitials}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>
                            {o.client}
                          </div>
                          {o.b2b && (
                            <span
                              className="pill pill-bronze-soft"
                              style={{
                                fontSize: 9,
                                padding: "2px 6px",
                                marginTop: 3,
                                display: "inline-block",
                              }}
                            >
                              PRO
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="hstack" style={{ gap: 10 }}>
                        {o.image && (
                          <div
                            className="thumb sm"
                            style={{ backgroundImage: `url(${o.image})` }}
                          ></div>
                        )}
                        <span style={{ fontSize: 13 }}>{o.items}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }} className="num">
                      {o.total}
                    </td>
                    <td>
                      <span className={`pill ${STATUS_PILL[o.status] ?? "pill"}`}>
                        {o.statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--outline)" }}>
                      <ChevronRight size={14} strokeWidth={1.8} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && (data?.recentOrders ?? []).length === 0 && (
              <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>
                Aucune commande pour le moment.
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Activité</div>
          </div>
          <div style={{ padding: "18px 24px" }}>
            <div className="timeline">
              {(data?.activity ?? []).map((a) => (
                <div key={a.id} className="tl-row">
                  <span
                    className="tl-dot"
                    style={{ background: ACTIVITY_COLOR[a.kind] ?? "#73777f" }}
                  ></span>
                  <div className="tl-text">
                    <div style={{ fontWeight: 500 }}>{a.summary}</div>
                    <div className="tl-meta">{relativeTime(a.createdAt)}</div>
                  </div>
                </div>
              ))}
              {!loading && (data?.activity ?? []).length === 0 && (
                <div style={{ color: "var(--outline)", fontSize: 13 }}>
                  Aucune activité récente.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        <Link href="/products/new" className="quick-action">
          <div
            className="qa-icon"
            style={{ background: "rgba(0,36,68,0.08)", color: "var(--primary)" }}
          >
            <Plus size={14} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Ajouter un produit
            </div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
              Créer une nouvelle fiche
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
        <Link href="/quotes" className="quick-action">
          <div
            className="qa-icon"
            style={{ background: "rgba(127,85,49,0.10)", color: "var(--secondary)" }}
          >
            <FileText size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Voir les devis</div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
              {stats?.pendingQuotes ?? 0} demande(s) en attente
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
        <Link href="/campaigns" className="quick-action">
          <div
            className="qa-icon"
            style={{ background: "rgba(0,36,68,0.08)", color: "var(--primary)" }}
          >
            <Bell size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Envoyer une campagne
            </div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
              Notifications push
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
        <Link href="/featured" className="quick-action">
          <div
            className="qa-icon"
            style={{ background: "rgba(127,85,49,0.10)", color: "var(--secondary)" }}
          >
            <Star size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Mettre en avant</div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
              Carrousel & best-sellers
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
      </div>
    </div>
  );
}

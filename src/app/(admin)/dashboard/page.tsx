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

type Trend = "up" | "down" | "neutral";
type Tone = "navy" | "bronze" | "warn" | "success";

const KPI: {
  caption: string;
  value: string;
  trend: string;
  up: boolean | null;
  foot: string;
  iconKey: "trendUp" | "cart" | "file" | "userPlus";
  tone: Tone;
}[] = [
  {
    caption: "Chiffre d'affaires",
    value: "48 720 €",
    trend: "+18,2%",
    up: true,
    foot: "vs 30 derniers jours",
    iconKey: "trendUp",
    tone: "success",
  },
  {
    caption: "Commandes",
    value: "37",
    trend: "+6",
    up: true,
    foot: "vs précédente période · 1 317 € panier moyen",
    iconKey: "cart",
    tone: "navy",
  },
  {
    caption: "Devis en attente",
    value: "12",
    trend: "À traiter",
    up: null,
    foot: "Délai moyen de réponse : 28 h",
    iconKey: "file",
    tone: "warn",
  },
  {
    caption: "Nouveaux clients",
    value: "23",
    trend: "+9,5%",
    up: true,
    foot: "16 particuliers · 7 professionnels",
    iconKey: "userPlus",
    tone: "bronze",
  },
];

const REVENUE_DATA = [
  1450, 1820, 1610, 2100, 1740, 1920, 2400, 1980, 1700, 1590, 2250, 2640, 2120,
  1880, 2470, 2810, 1920, 1450, 1330, 1890, 2150, 2680, 2940, 2210, 1750, 1620,
  2050, 2480, 2310, 2920,
];

const CATEGORIES = [
  { name: "Cuisines", amount: 18400, pct: 100 },
  { name: "Portes", amount: 12100, pct: 66 },
  { name: "Chambres complètes", amount: 7850, pct: 43 },
  { name: "Canapés & fauteuils", amount: 5200, pct: 28 },
  { name: "Décoration", amount: 3420, pct: 19 },
  { name: "Autres", amount: 1750, pct: 10 },
];

type Trend2 = Trend;
const ORDERS: {
  id: string;
  client: string;
  initials: string;
  tag?: string;
  items: string;
  total: string;
  status: string;
  pill: string;
  img: string;
}[] = [
  {
    id: "LMP-2026-037",
    client: "Sophie Mercier",
    initials: "SM",
    items: "Canapé Modulable Bordeaux",
    total: "2 890 €",
    status: "EN PRÉPARATION",
    pill: "pill-prep",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80",
  },
  {
    id: "LMP-2026-036",
    client: "Karim Benali",
    initials: "KB",
    tag: "PRO",
    items: "Cuisine Noire & Or",
    total: "12 400 €",
    status: "EN ATTENTE",
    pill: "pill-warning",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&q=80",
  },
  {
    id: "LMP-2026-035",
    client: "Léa Moreau",
    initials: "LM",
    items: "Buffet Miroir + Chambre Royale",
    total: "7 780 €",
    status: "EXPÉDIÉE",
    pill: "pill-bronze",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=120&q=80",
  },
  {
    id: "LMP-2026-034",
    client: "SARL Atelier Sud",
    initials: "AS",
    tag: "PRO",
    items: "3 articles",
    total: "18 200 €",
    status: "LIVRÉE",
    pill: "pill-success",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&q=80",
  },
  {
    id: "LMP-2026-033",
    client: "Vincent Roussel",
    initials: "VR",
    items: "Porte Géométrique Noyer",
    total: "3 850 €",
    status: "EN PRÉPARATION",
    pill: "pill-prep",
    img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=120&q=80",
  },
  {
    id: "LMP-2026-032",
    client: "Amina Tazi",
    initials: "AT",
    items: "Canapé Bordeaux + Salon Crème",
    total: "6 340 €",
    status: "EXPÉDIÉE",
    pill: "pill-bronze",
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=120&q=80",
  },
  {
    id: "LMP-2026-031",
    client: "Camille Leroux",
    initials: "CL",
    items: "Baie Vitrée Coulissante",
    total: "2 100 €",
    status: "LIVRÉE",
    pill: "pill-success",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&q=80",
  },
  {
    id: "LMP-2026-030",
    client: "EURL Décor Plus",
    initials: "DP",
    tag: "PRO",
    items: "Cuisine Marbre Noir",
    total: "22 400 €",
    status: "EN ATTENTE D'EXPÉDITION",
    pill: "pill-warning",
    img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=120&q=80",
  },
];

const ACTIVITY = [
  { color: "#10B981", text: "Nouvelle commande", meta: "Sophie Mercier · 2 890 €", time: "il y a 12 min" },
  { color: "#7f5531", text: "Devis demandé", meta: "Cuisine Îlot Chêne Clair", time: "il y a 35 min" },
  { color: "#10B981", text: "Devis accepté", meta: "Karim Benali · 18 400 €", time: "il y a 1 h" },
  { color: "#002444", text: "Message reçu", meta: "SARL Atelier Sud", time: "il y a 2 h" },
  { color: "#7f5531", text: "Commande expédiée", meta: "#LMP-2026-031", time: "il y a 3 h" },
  { color: "#F59E0B", text: "Nouveau client B2B", meta: "EURL Décor Plus", time: "il y a 5 h" },
  { color: "#002444", text: "Devis envoyé", meta: "Vincent Roussel · 4 200 €", time: "Hier · 18:24" },
  { color: "#10B981", text: "Commande livrée", meta: "#LMP-2026-028", time: "Hier · 14:10" },
  { color: "#F59E0B", text: "Nouvel avis 5★", meta: "Buffet Miroir Triptyque", time: "Il y a 2 j" },
  { color: "#ba1a1a", text: "Stock faible", meta: "Porte Pivotante — 2 unités", time: "Il y a 2 j" },
  { color: "#002444", text: "Nouvelle commande", meta: "Olivier Dubois · 5 200 €", time: "Il y a 3 j" },
  { color: "#7f5531", text: "Devis envoyé", meta: "Amina Tazi · Cuisine Marbre", time: "Il y a 3 j" },
];

function KpiIcon({ keyName, tone }: { keyName: KpiIconKey; tone: Tone }) {
  const cls = tone === "navy" ? "kpi-icon" : `kpi-icon ${tone}`;
  let Icon;
  if (keyName === "trendUp") Icon = TrendingUp;
  else if (keyName === "cart") Icon = ShoppingCart;
  else if (keyName === "file") Icon = FileText;
  else Icon = UserPlus;
  return (
    <div className={cls}>
      <Icon size={18} strokeWidth={1.6} />
    </div>
  );
}

type KpiIconKey = "trendUp" | "cart" | "file" | "userPlus";

export default function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <div className="page-subtitle">
            Aperçu de l&apos;activité — mise à jour il y a 2 minutes
          </div>
        </div>
        <div className="hstack">
          <div className="select-wrap">
            <select defaultValue="30">
              <option value="today">Aujourd&apos;hui</option>
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="month">Ce mois-ci</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <button className="btn btn-outline btn-sm">
            <Download size={14} strokeWidth={1.8} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {KPI.map((k, i) => (
          <div key={i} className="kpi">
            <div className="kpi-top">
              <KpiIcon keyName={k.iconKey} tone={k.tone} />
              {k.up === null ? (
                <span className="kpi-trend neutral">{k.trend}</span>
              ) : (
                <span className={`kpi-trend ${k.up ? "up" : "down"}`}>
                  {k.up ? (
                    <TrendingUp size={12} strokeWidth={2.5} />
                  ) : (
                    <TrendingDown size={12} strokeWidth={2.5} />
                  )}
                  <span>{k.trend}</span>
                </span>
              )}
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
                48 720 €
              </div>
            </div>
            <div
              className="hstack-sm"
              style={{ fontSize: 11, color: "var(--outline)" }}
            >
              <span
                className="dot-mark"
                style={{ background: "var(--primary)" }}
              ></span>
              <span>Quotidien</span>
              <span
                style={{
                  marginLeft: 14,
                  borderTop: "1px dashed var(--outline)",
                  width: 14,
                  height: 1,
                }}
              ></span>
              <span>Moyenne</span>
            </div>
          </div>
          <div style={{ padding: "8px 16px 18px" }}>
            <AreaChart data={REVENUE_DATA} />
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
            {CATEGORIES.map((c) => (
              <div key={c.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span
                    className="num"
                    style={{
                      fontFamily: "var(--display)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--secondary)",
                    }}
                  >
                    {c.amount.toLocaleString("fr-FR").replace(/,/g, " ")} €
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
                      width: `${c.pct}%`,
                      background:
                        "linear-gradient(90deg, var(--primary), var(--primary-container))",
                      borderRadius: 999,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Commandes récentes</div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--outline)",
                  marginTop: 2,
                }}
              >
                8 sur 47 commandes
              </div>
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
                {ORDERS.map((o) => (
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
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--outline)",
                          marginTop: 2,
                        }}
                      >
                        il y a 12 min
                      </div>
                    </td>
                    <td>
                      <div className="hstack" style={{ gap: 10 }}>
                        <div className="avatar sm">{o.initials}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>
                            {o.client}
                          </div>
                          {o.tag && (
                            <span
                              className="pill pill-bronze-soft"
                              style={{
                                fontSize: 9,
                                padding: "2px 6px",
                                marginTop: 3,
                                display: "inline-block",
                              }}
                            >
                              {o.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="hstack" style={{ gap: 10 }}>
                        <div
                          className="thumb sm"
                          style={{ backgroundImage: `url(${o.img})` }}
                        ></div>
                        <span style={{ fontSize: 13 }}>{o.items}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }} className="num">
                      {o.total}
                    </td>
                    <td>
                      <span className={`pill ${o.pill}`}>{o.status}</span>
                    </td>
                    <td
                      style={{ textAlign: "right", color: "var(--outline)" }}
                    >
                      <ChevronRight size={14} strokeWidth={1.8} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Activité</div>
            <button
              className="btn-ghost"
              style={{
                fontSize: 11,
                color: "var(--outline)",
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              Filtrer
            </button>
          </div>
          <div style={{ padding: "18px 24px" }}>
            <div className="timeline">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="tl-row">
                  <span
                    className="tl-dot"
                    style={{ background: a.color }}
                  ></span>
                  <div className="tl-text">
                    <div style={{ fontWeight: 500 }}>{a.text}</div>
                    <div className="tl-meta">
                      {a.meta} · {a.time}
                    </div>
                  </div>
                </div>
              ))}
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
            style={{
              background: "rgba(0,36,68,0.08)",
              color: "var(--primary)",
            }}
          >
            <Plus size={14} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Ajouter un produit
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--outline)",
                marginTop: 2,
              }}
            >
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
            style={{
              background: "rgba(127,85,49,0.10)",
              color: "var(--secondary)",
            }}
          >
            <FileText size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Voir les devis
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--outline)",
                marginTop: 2,
              }}
            >
              12 demandes en attente
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
        <Link href="/campaigns" className="quick-action">
          <div
            className="qa-icon"
            style={{
              background: "rgba(0,36,68,0.08)",
              color: "var(--primary)",
            }}
          >
            <Bell size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Envoyer une campagne
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--outline)",
                marginTop: 2,
              }}
            >
              1 234 abonnés actifs
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>
            <ChevronRight size={14} strokeWidth={1.8} />
          </span>
        </Link>
        <Link href="/featured" className="quick-action">
          <div
            className="qa-icon"
            style={{
              background: "rgba(127,85,49,0.10)",
              color: "var(--secondary)",
            }}
          >
            <Star size={14} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>
              Mettre en avant
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--outline)",
                marginTop: 2,
              }}
            >
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

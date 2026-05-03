"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Plus, MoreHorizontal } from "lucide-react";

type C = {
  name: string;
  email: string;
  initials: string;
  type: "Particulier" | "PRO";
  company?: string;
  terr: string;
  orders: number;
  total: string;
  last: string;
  slug: string;
};

const CUST: C[] = [
  { name: "Sophie Mercier", email: "sophie.mercier@gmail.com", initials: "SM", type: "Particulier", terr: "🇫🇷 Métropole", orders: 5, total: "18 240 €", last: "il y a 12 min", slug: "sophie-mercier" },
  { name: "Karim Benali", email: "k.benali@ateliersud.fr", initials: "KB", type: "PRO", company: "SARL Atelier Sud", terr: "🇫🇷 Métropole", orders: 12, total: "84 200 €", last: "il y a 1 h", slug: "karim-benali" },
  { name: "SARL Atelier Sud", email: "commande@atelier-sud.fr", initials: "AS", type: "PRO", terr: "🇫🇷 Métropole", orders: 18, total: "142 800 €", last: "il y a 3 h", slug: "atelier-sud" },
  { name: "Léa Moreau", email: "lea.moreau@laposte.net", initials: "LM", type: "Particulier", terr: "🌴 La Réunion", orders: 2, total: "6 780 €", last: "Hier", slug: "lea-moreau" },
  { name: "Vincent Roussel", email: "v.roussel@orange.fr", initials: "VR", type: "Particulier", terr: "🇫🇷 Métropole", orders: 1, total: "3 850 €", last: "Hier", slug: "vincent-roussel" },
  { name: "EURL Décor Plus", email: "contact@decorplus.fr", initials: "DP", type: "PRO", terr: "🌴 Mayotte", orders: 7, total: "38 200 €", last: "il y a 2 j", slug: "decor-plus" },
  { name: "Amina Tazi", email: "amina.tazi@yahoo.fr", initials: "AT", type: "Particulier", terr: "🇫🇷 Métropole", orders: 3, total: "9 100 €", last: "il y a 5 j", slug: "amina-tazi" },
  { name: "Olivier Dubois", email: "o.dubois@free.fr", initials: "OD", type: "Particulier", terr: "🌴 Guadeloupe", orders: 1, total: "5 200 €", last: "il y a 1 sem", slug: "olivier-dubois" },
  { name: "Camille Leroux", email: "camille.l@gmail.com", initials: "CL", type: "Particulier", terr: "🌴 Martinique", orders: 2, total: "8 400 €", last: "il y a 2 sem", slug: "camille-leroux" },
  { name: "Maison Moderne SAS", email: "achats@maison-moderne.com", initials: "MM", type: "PRO", terr: "🇫🇷 Métropole", orders: 4, total: "22 100 €", last: "il y a 1 mois", slug: "maison-moderne" },
  { name: "Jean Laurent", email: "jlaurent@hotmail.fr", initials: "JL", type: "Particulier", terr: "🇫🇷 Métropole", orders: 6, total: "15 920 €", last: "il y a 1 mois", slug: "jean-laurent" },
  { name: "SAS Maison Moderne", email: "pro@maison-moderne.fr", initials: "MM", type: "PRO", terr: "🌴 Guyane", orders: 2, total: "11 400 €", last: "il y a 2 mois", slug: "maison-moderne-guyane" },
];

const TABS = [
  { key: "all", label: "Tous", count: 147 },
  { key: "p", label: "Particuliers", count: 89 },
  { key: "pro", label: "Professionnels", count: 58 },
  { key: "inactive", label: "Inactifs", count: 12 },
  { key: "vip", label: "VIP", count: 14 },
];

export default function CustomersPage() {
  const router = useRouter();
  const [tab, setTab] = useState("all");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <div className="page-subtitle">
            147 clients · 89 particuliers · 58 professionnels · 23 nouveaux ce mois
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">
            <Download size={14} strokeWidth={1.8} />
            <span>Exporter</span>
          </button>
          <button className="btn btn-primary">
            <Plus size={14} strokeWidth={2} />
            <span>Ajouter un client</span>
          </button>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`chip${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="card card-padded" style={{ marginBottom: 18 }}>
        <div className="hstack" style={{ gap: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280, maxWidth: 380 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input className="input-boxed" style={{ paddingLeft: 38, width: "100%" }} placeholder="Nom, email, SIRET..." />
          </div>
          <div className="select-wrap">
            <select defaultValue="all"><option value="all">Toutes zones</option><option>Métropole</option><option>Outre-mer</option></select>
          </div>
          <div className="select-wrap">
            <select defaultValue="reg"><option value="reg">Date inscription</option><option>30 derniers jours</option><option>Cette année</option></select>
          </div>
          <div className="select-wrap">
            <select defaultValue="recent"><option value="recent">Plus récent</option><option>Plus dépensé</option><option>Plus de commandes</option></select>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 32 }}><span className="checkbox"></span></th>
              <th>Client</th>
              <th>Type</th>
              <th>Territoire</th>
              <th style={{ textAlign: "center" }}>Cmd.</th>
              <th style={{ textAlign: "right" }}>Total dépensé</th>
              <th>Dernière activité</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CUST.map((c) => (
              <tr key={c.slug} onClick={() => router.push(`/customers/${c.slug}`)}>
                <td onClick={(e) => e.stopPropagation()}><span className="checkbox"></span></td>
                <td>
                  <div className="hstack" style={{ gap: 12 }}>
                    <div className={`avatar sm${c.type === "PRO" ? " bronze" : ""}`}>{c.initials}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
                        {c.email}{c.company ? ` · ${c.company}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {c.type === "PRO"
                    ? <span className="pill pill-bronze">PRO</span>
                    : <span className="pill pill-outline">Particulier</span>}
                </td>
                <td><span style={{ fontSize: 12.5 }}>{c.terr}</span></td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{c.orders}</td>
                <td style={{ textAlign: "right" }} className="num">{c.total}</td>
                <td style={{ fontSize: 12.5, color: "var(--on-surface-variant)" }}>{c.last}</td>
                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                  <button className="icon-btn" style={{ width: 28, height: 28 }}>
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderTop: "1px solid var(--outline-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--outline)" }}>1 - 12 sur 147 clients</div>
          <div className="hstack">
            <button className="chip" disabled style={{ opacity: 0.5 }}>‹</button>
            <button className="chip active">1</button>
            <button className="chip">2</button>
            <button className="chip">3</button>
            <button className="chip">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

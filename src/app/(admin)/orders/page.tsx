"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Truck } from "lucide-react";

type Row = {
  id: string;
  date: string;
  time: string;
  rel: string;
  client: string;
  initials: string;
  tag?: string;
  email: string;
  items: string;
  extra?: string;
  territory: string;
  flag: string;
  total: string;
  status: string;
  pill: string;
  img: string;
};

const ORDERS: Row[] = [
  { id: "LMP-2026-037", date: "3 mai 2026", time: "14:32", rel: "il y a 12 min", client: "Sophie Mercier", initials: "SM", email: "sophie.mercier@gmail.com", items: "Canapé Modulable Bordeaux", extra: "", territory: "Métropole", flag: "🇫🇷", total: "2 890 €", status: "EN PRÉPARATION", pill: "pill-prep", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80" },
  { id: "LMP-2026-036", date: "3 mai 2026", time: "11:18", rel: "il y a 3 h", client: "Karim Benali", initials: "KB", tag: "PRO", email: "k.benali@ateliersud.fr", items: "Cuisine Noire & Or", extra: "", territory: "Métropole", flag: "🇫🇷", total: "12 400 €", status: "CONFIRMÉE", pill: "pill-navy", img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=80" },
  { id: "LMP-2026-035", date: "2 mai 2026", time: "17:42", rel: "Hier", client: "Léa Moreau", initials: "LM", email: "lea.moreau@laposte.net", items: "Buffet Miroir + Chambre", extra: "+1", territory: "La Réunion", flag: "🌴", total: "7 780 €", status: "EXPÉDIÉE", pill: "pill-bronze", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=80" },
  { id: "LMP-2026-034", date: "2 mai 2026", time: "09:11", rel: "Hier", client: "SARL Atelier Sud", initials: "AS", tag: "PRO", email: "commande@atelier-sud.fr", items: "Cuisine + Dressing", extra: "+1", territory: "Métropole", flag: "🇫🇷", total: "18 200 €", status: "LIVRÉE", pill: "pill-success", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80" },
  { id: "LMP-2026-033", date: "1 mai 2026", time: "16:08", rel: "il y a 2 j", client: "Vincent Roussel", initials: "VR", email: "v.roussel@orange.fr", items: "Porte Géométrique Noyer", extra: "", territory: "Métropole", flag: "🇫🇷", total: "3 850 €", status: "EN PRÉPARATION", pill: "pill-prep", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=80" },
  { id: "LMP-2026-032", date: "1 mai 2026", time: "12:55", rel: "il y a 2 j", client: "Amina Tazi", initials: "AT", email: "amina.tazi@yahoo.fr", items: "Canapé + Salon Crème", extra: "", territory: "Mayotte", flag: "🌴", total: "6 340 €", status: "EN ATTENTE D'EXPÉDITION", pill: "pill-warning", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80" },
  { id: "LMP-2026-031", date: "30 avr 2026", time: "10:24", rel: "il y a 3 j", client: "Camille Leroux", initials: "CL", email: "camille.l@gmail.com", items: "Baie Vitrée Coulissante", extra: "", territory: "Martinique", flag: "🌴", total: "2 100 €", status: "EXPÉDIÉE", pill: "pill-bronze", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80" },
  { id: "LMP-2026-030", date: "29 avr 2026", time: "14:01", rel: "il y a 4 j", client: "EURL Décor Plus", initials: "DP", tag: "PRO", email: "contact@decorplus.fr", items: "Cuisine Marbre Noir", extra: "", territory: "Métropole", flag: "🇫🇷", total: "22 400 €", status: "LIVRÉE", pill: "pill-success", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=80" },
  { id: "LMP-2026-029", date: "28 avr 2026", time: "11:20", rel: "il y a 5 j", client: "Olivier Dubois", initials: "OD", email: "o.dubois@free.fr", items: "Chambre Royale", extra: "", territory: "Guadeloupe", flag: "🌴", total: "5 890 €", status: "EXPÉDIÉE", pill: "pill-bronze", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=80" },
  { id: "LMP-2026-028", date: "27 avr 2026", time: "08:45", rel: "il y a 6 j", client: "Maison Moderne SAS", initials: "MM", tag: "PRO", email: "achats@maison-moderne.com", items: "4 articles", extra: "", territory: "Métropole", flag: "🇫🇷", total: "14 280 €", status: "LIVRÉE", pill: "pill-success", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80" },
];

const TABS = [
  { label: "Toutes", count: 47 },
  { label: "Confirmée", count: 8 },
  { label: "En préparation", count: 12 },
  { label: "En attente d'expédition", count: 9 },
  { label: "Expédiée", count: 15 },
  { label: "Livrée", count: 3 },
];

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Commandes</h1>
          <div className="page-subtitle">
            47 commandes ce mois · 121 200 € de chiffre d&apos;affaires · 12 en attente d&apos;action
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">
            <Download size={14} strokeWidth={1.8} />
            <span>Exporter (CSV)</span>
          </button>
          <button className="btn btn-outline btn-sm">
            <Truck size={14} strokeWidth={1.7} />
            <span>Imprimer bons de livraison</span>
          </button>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18, gap: 8 }}>
        {TABS.map((t, i) => (
          <button
            key={t.label}
            className={`chip${tab === i ? " active" : ""}`}
            style={{ height: 36, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}
            onClick={() => setTab(i)}
          >
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="card card-padded" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280, maxWidth: 380 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input className="input-boxed" style={{ paddingLeft: 38, width: "100%" }} placeholder="Numéro, client, email..." />
          </div>
          <div className="select-wrap">
            <select defaultValue="range">
              <option value="range">Du 1 mars au 3 mai 2026</option>
              <option>30 derniers jours</option>
              <option>Cette semaine</option>
            </select>
          </div>
          <div className="select-wrap">
            <select defaultValue="all">
              <option value="all">Toutes zones</option>
              <option>Métropole</option>
              <option>La Réunion</option>
              <option>Mayotte</option>
              <option>Guadeloupe</option>
              <option>Martinique</option>
              <option>Guyane</option>
            </select>
          </div>
          <div className="select-wrap">
            <select defaultValue="all">
              <option value="all">Tous comptes</option>
              <option>Particulier</option>
              <option>Professionnel</option>
            </select>
          </div>
          <a style={{ fontSize: 12, color: "var(--secondary)", marginLeft: "auto", cursor: "pointer" }}>
            Réinitialiser →
          </a>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 32 }}><span className="checkbox"></span></th>
                <th># Commande</th>
                <th>Date</th>
                <th>Client</th>
                <th>Articles</th>
                <th>Territoire</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id} onClick={() => router.push(`/orders/${o.id}`)}>
                  <td onClick={(e) => e.stopPropagation()}><span className="checkbox"></span></td>
                  <td>
                    <div className="mono" style={{ fontSize: 12.5, fontWeight: 500 }}>#{o.id}</div>
                    <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{o.rel}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{o.date}</div>
                    <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{o.time}</div>
                  </td>
                  <td>
                    <div className="hstack" style={{ gap: 10 }}>
                      <div className="avatar sm">{o.initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="hstack" style={{ gap: 6 }}>
                          <span style={{ fontWeight: 500, fontSize: 13 }}>{o.client}</span>
                          {o.tag && <span className="pill pill-bronze-soft" style={{ fontSize: 9, padding: "1px 6px" }}>{o.tag}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160, whiteSpace: "nowrap" }}>{o.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="hstack" style={{ gap: 10 }}>
                      <div className="thumb sm" style={{ backgroundImage: `url(${o.img})` }}></div>
                      <span style={{ fontSize: 13 }}>
                        {o.items} {o.extra && <span style={{ color: "var(--outline)" }}>{o.extra}</span>}
                      </span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12.5 }}>{o.flag} {o.territory}</span></td>
                  <td style={{ textAlign: "right" }} className="num">{o.total}</td>
                  <td><span className={`pill ${o.pill}`}>{o.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                    <a href={`/orders/${o.id}`} style={{ fontSize: 12, color: "var(--secondary)", fontWeight: 500 }}>
                      Voir →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderTop: "1px solid var(--outline-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--outline)" }}>1 - 10 sur 47 commandes</div>
          <div className="hstack">
            <button className="chip" disabled style={{ opacity: 0.5 }}>‹ Précédent</button>
            <button className="chip active">1</button>
            <button className="chip">2</button>
            <button className="chip">3</button>
            <button className="chip">4</button>
            <button className="chip">5</button>
            <button className="chip">Suivant ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

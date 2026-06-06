"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: "particulier" | "professionnel";
  company?: string;
  siret?: string;
  territory: string;
  orders: number;
  totalSpent: string;
  createdAt: string;
  avatarInitials: string;
}
interface Address {
  id: string; firstName: string; lastName: string; street: string;
  postalCode: string; city: string; country: string; territory: string; isDefault?: boolean;
}
interface OrderLite { id: string; total: string; status: string; createdAt: string }
interface QuoteLite { id: string; status: string; quotedPrice?: string; createdAt: string }
interface Detail { customer: Customer; addresses: Address[]; orders: OrderLite[]; quotes: QuoteLite[] }

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [d, setD] = useState<Detail | null>(null);

  useEffect(() => {
    if (!id) return;
    adminApi.customers
      .detail(id)
      .then((r) => setD(r as Detail))
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Client introuvable"));
  }, [id]);

  if (!d) return <div className="page"><div className="page-subtitle">Chargement…</div></div>;
  const c = d.customer;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="hstack" style={{ gap: 14, marginBottom: 6 }}>
            <h1 className="page-title">{c.firstName} {c.lastName}</h1>
            {c.type === "professionnel" ? <span className="pill pill-bronze">PRO</span> : <span className="pill pill-outline">Particulier</span>}
          </div>
          <div className="page-subtitle">{c.email} · {c.phone || "—"} · Client depuis {new Date(c.createdAt).toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Commandes ({c.orders})</div>
            <table className="tbl">
              <thead><tr><th># Commande</th><th>Statut</th><th style={{ textAlign: "right" }}>Total</th><th>Date</th></tr></thead>
              <tbody>
                {d.orders.map((o) => (
                  <tr key={o.id} onClick={() => (window.location.href = `/orders/${o.id}`)} style={{ cursor: "pointer" }}>
                    <td className="mono">#{o.id}</td>
                    <td>{o.status}</td>
                    <td style={{ textAlign: "right" }} className="num">{o.total}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.orders.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucune commande.</div>}
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Devis</div>
            <table className="tbl">
              <thead><tr><th># Devis</th><th>Statut</th><th style={{ textAlign: "right" }}>Montant</th><th>Date</th></tr></thead>
              <tbody>
                {d.quotes.map((q) => (
                  <tr key={q.id} onClick={() => (window.location.href = `/quotes/${q.id}`)} style={{ cursor: "pointer" }}>
                    <td className="mono">#{q.id}</td>
                    <td>{q.status}</td>
                    <td style={{ textAlign: "right" }} className="num">{q.quotedPrice ?? "—"}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.quotes.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucun devis.</div>}
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Adresses</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {d.addresses.map((a) => (
                <div key={a.id} style={{ padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
                  <div className="hstack" style={{ gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{a.firstName} {a.lastName}</span>
                    {a.isDefault && <span className="pill pill-success-soft" style={{ fontSize: 9 }}>Par défaut</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
                    {a.street}<br />{a.postalCode} {a.city}<br />{a.country}
                  </div>
                </div>
              ))}
              {d.addresses.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucune adresse.</div>}
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="hstack" style={{ gap: 14, marginBottom: 16 }}>
              <div className={`avatar lg${c.type === "professionnel" ? " bronze" : ""}`}>{c.avatarInitials}</div>
              <div>
                <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600 }}>{c.firstName} {c.lastName}</div>
                {c.company && <div style={{ fontSize: 12, color: "var(--outline)" }}>{c.company}</div>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: 14, background: "var(--surface-container-low)", borderRadius: 10 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 9 }}>Total dépensé</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600, color: "var(--secondary)" }}>{c.totalSpent}</div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 9 }}>Commandes</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{c.orders}</div>
              </div>
            </div>
            {c.siret && <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 12, fontFamily: "var(--mono)" }}>SIRET {c.siret}</div>}
            <Link href="/messages" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Envoyer un message</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

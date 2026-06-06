"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatEUR } from "@/lib/format";

interface Item { description: string; quantity: number; unitPrice: string }
interface QuoteRow {
  id: string;
  quote_number: string | null;
  product_name: string | null;
  product_image: string | null;
  req_width: number | null;
  req_height: number | null;
  req_depth: number | null;
  notes: string | null;
  status: "en_attente_devis" | "devis_envoye" | "devis_accepte" | "devis_rejete";
  quoted_price_cents: number | null;
  shipping_cents: number | null;
  fabrication_delay: string | null;
  validity_days: number | null;
  admin_message: string | null;
  tva_rate: number | null;
  is_b2b: boolean;
  created_at: string;
  attachments?: { id: string; url: string }[];
  items?: { description: string; quantity: number; unit_price_cents: number; sort_order: number }[];
  profile?: { first_name: string; last_name: string; account_type: string; company: string | null; siret: string | null };
}

const STATUS: Record<string, { label: string; cls: string }> = {
  en_attente_devis: { label: "En attente", cls: "pill-warning" },
  devis_envoye: { label: "Devis envoyé", cls: "pill-navy" },
  devis_accepte: { label: "Accepté", cls: "pill-success" },
  devis_rejete: { label: "Refusé", cls: "pill-error" },
};

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [q, setQ] = useState<QuoteRow | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [shipping, setShipping] = useState("");
  const [delay, setDelay] = useState("");
  const [validity, setValidity] = useState("60");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    if (!id) return;
    adminApi.quotes
      .detail(id)
      .then((r) => {
        const row = r as QuoteRow;
        setQ(row);
        setItems((row.items ?? []).sort((a, b) => a.sort_order - b.sort_order).map((it) => ({
          description: it.description, quantity: it.quantity, unitPrice: String(it.unit_price_cents / 100),
        })));
        setShipping(row.shipping_cents != null ? String(row.shipping_cents / 100) : "");
        setDelay(row.fabrication_delay ?? "");
        setValidity(String(row.validity_days ?? 60));
        setMessage(row.admin_message ?? "");
      })
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Devis introuvable"));
  }
  useEffect(load, [id]);

  if (!q) return <div className="page"><div className="page-subtitle">Chargement…</div></div>;

  const st = STATUS[q.status];
  const num = (s: string) => Number(s.replace(",", ".")) || 0;
  const itemsTotal = items.reduce((sum, it) => sum + num(it.unitPrice) * it.quantity, 0);
  const total = itemsTotal + num(shipping);

  function setItem(i: number, p: Partial<Item>) {
    setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x)));
  }

  async function save() {
    setBusy(true);
    try {
      await adminApi.quotes.update(q!.id, {
        items: items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: num(it.unitPrice) })),
        shipping: num(shipping),
        fabricationDelay: delay,
        validityDays: Number(validity) || 60,
        adminMessage: message,
      });
      toast.success("Devis enregistré");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Échec");
    } finally {
      setBusy(false);
    }
  }
  async function send() {
    setBusy(true);
    try {
      await save();
      await adminApi.quotes.send(q!.id);
      toast.success("Devis envoyé");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Envoi impossible");
    } finally {
      setBusy(false);
    }
  }
  async function reject() {
    try {
      await adminApi.quotes.reject(q!.id);
      toast.success("Devis refusé");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Échec");
    }
  }

  const clientName = [q.profile?.first_name, q.profile?.last_name].filter(Boolean).join(" ");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="hstack" style={{ gap: 14, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 className="page-title">Demande #{q.quote_number ?? q.id.slice(0, 8)}</h1>
            <span className={`pill ${st.cls}`}>{st.label}</span>
          </div>
          <div className="page-subtitle">
            {new Date(q.created_at).toLocaleString("fr-FR")} · {clientName}{q.profile?.company ? ` · ${q.profile.company}` : ""}
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-danger btn-sm" onClick={reject} disabled={busy}>Refuser</button>
          <button className="btn btn-primary" onClick={send} disabled={busy}>
            <Send size={14} strokeWidth={1.7} /> <span>{busy ? "…" : "Envoyer le devis"}</span>
          </button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Produit demandé</div>
            <div className="hstack" style={{ gap: 18 }}>
              {q.product_image && <div className="thumb lg" style={{ backgroundImage: `url(${q.product_image})` }}></div>}
              <div style={{ flex: 1 }}>
                <div style={{ color: "var(--secondary)", fontFamily: "var(--display)", fontSize: 20, fontWeight: 600 }}>{q.product_name}</div>
                <div className="hstack" style={{ marginTop: 10, gap: 8 }}>
                  <span className="pill pill-outline">Sur devis</span>
                  {q.is_b2b && <span className="pill pill-bronze">PRO</span>}
                </div>
              </div>
            </div>
            {(q.req_width || q.req_height) && (
              <div style={{ marginTop: 18, fontSize: 13 }}>
                <span style={{ color: "var(--outline)" }}>Dimensions souhaitées : </span>
                <span className="mono" style={{ fontWeight: 600 }}>
                  {q.req_width ?? "?"} × {q.req_height ?? "?"}{q.req_depth ? ` × ${q.req_depth}` : ""} cm
                </span>
              </div>
            )}
            {q.notes && (
              <div style={{ marginTop: 14, fontSize: 13, fontStyle: "italic", color: "var(--on-surface-variant)" }}>
                « {q.notes} »
              </div>
            )}
            {(q.attachments ?? []).length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
                {q.attachments!.map((a) => (
                  <div key={a.id} style={{ aspectRatio: "1", borderRadius: 8, background: `url(${a.url}) center/cover` }}></div>
                ))}
              </div>
            )}
          </div>

          <div className="card card-padded">
            <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 18 }}>
              <div className="card-title">Préparer la réponse</div>
              <button className="btn btn-outline btn-sm" onClick={() => setItems((xs) => [...xs, { description: "", quantity: 1, unitPrice: "" }])}>
                <Plus size={14} strokeWidth={2} /> Ligne
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Description</th><th style={{ textAlign: "center", width: 70 }}>Qté</th><th style={{ textAlign: "right", width: 120 }}>P.U. (€)</th><th style={{ textAlign: "right", width: 120 }}>Total</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td><input className="input" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} /></td>
                    <td><input className="input num" style={{ textAlign: "center" }} type="number" value={it.quantity} onChange={(e) => setItem(i, { quantity: Number(e.target.value) })} /></td>
                    <td><input className="input num" style={{ textAlign: "right" }} value={it.unitPrice} onChange={(e) => setItem(i, { unitPrice: e.target.value })} /></td>
                    <td style={{ textAlign: "right" }} className="num">{formatEUR(num(it.unitPrice) * it.quantity)}</td>
                    <td><button className="icon-btn" style={{ color: "var(--error)" }} onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} style={{ color: "var(--outline)", fontSize: 13 }}>Ajoutez des lignes pour composer le devis.</td></tr>}
              </tbody>
            </table>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 18 }}>
              <div className="field"><label className="field-label">Frais de livraison (€)</label><input className="input" value={shipping} onChange={(e) => setShipping(e.target.value)} /></div>
              <div className="field"><label className="field-label">Délai de fabrication</label><input className="input" value={delay} onChange={(e) => setDelay(e.target.value)} /></div>
              <div className="field"><label className="field-label">Validité (jours)</label><input className="input" type="number" value={validity} onChange={(e) => setValidity(e.target.value)} /></div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label className="field-label">Message au client</label>
              <textarea className="textarea" style={{ minHeight: 70 }} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--outline)" }}>Articles</span><span>{formatEUR(itemsTotal)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--outline)" }}>Livraison</span><span>{formatEUR(num(shipping))}</span></div>
                <div style={{ height: 1, background: "var(--outline-soft)", margin: "8px 0" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>Total TTC</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, color: "var(--secondary)" }}>{formatEUR(total)}</span>
                </div>
              </div>
            </div>

            <div className="hstack" style={{ marginTop: 18, justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={save} disabled={busy}>Enregistrer</button>
              <button className="btn btn-primary" onClick={send} disabled={busy}><Send size={14} /> Envoyer</button>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Client</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600 }}>{clientName || "—"}</div>
            {q.profile?.company && <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>{q.profile.company}</div>}
            <div className="hstack" style={{ gap: 6, marginTop: 12 }}>
              {q.is_b2b ? <span className="pill pill-bronze">PRO</span> : <span className="pill pill-outline">Particulier</span>}
            </div>
            {q.profile?.siret && <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 10, fontFamily: "var(--mono)" }}>SIRET {q.profile.siret}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

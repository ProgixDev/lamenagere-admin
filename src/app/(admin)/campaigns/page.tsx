"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Send } from "lucide-react";
import { adminApi } from "@/lib/api";

interface Campaign {
  id: string;
  name: string;
  title: string | null;
  body: string | null;
  audience: { accountType?: string; territory?: string };
  status: "draft" | "scheduled" | "sent" | "archived";
  sent_count: number;
  created_at: string;
}

const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  draft: { label: "BROUILLON", cls: "pill-outline" },
  scheduled: { label: "PROGRAMMÉE", cls: "pill-warning" },
  sent: { label: "ENVOYÉE", cls: "pill-success" },
  archived: { label: "ARCHIVÉE", cls: "pill-outline" },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Nouveauté chez La Ménagère");
  const [title, setTitle] = useState("Nouveauté chez La Ménagère");
  const [body, setBody] = useState("Découvrez notre dernière collection de cuisines sur mesure.");
  const [audience, setAudience] = useState("all");
  const [busy, setBusy] = useState(false);

  function load() {
    setLoading(true);
    adminApi.campaigns
      .list("")
      .then((r) => setCampaigns((r as Campaign[]) ?? []))
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Chargement impossible"))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const counts = {
    all: campaigns.length,
    sent: campaigns.filter((c) => c.status === "sent").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
  };

  function audiencePayload() {
    return audience === "all" ? {} : { accountType: audience };
  }

  async function createCampaign(send: boolean) {
    setBusy(true);
    try {
      const created = (await adminApi.campaigns.create({
        name,
        title,
        body,
        audience: audiencePayload(),
      })) as { id: string };
      if (send) {
        const res = (await adminApi.campaigns.send(created.id)) as {
          sent: number;
          failed: number;
        };
        toast.success(`Campagne envoyée — ${res.sent} envoi(s), ${res.failed} échec(s)`);
      } else {
        toast.success("Brouillon enregistré");
      }
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Échec");
    } finally {
      setBusy(false);
    }
  }

  async function sendExisting(id: string) {
    try {
      const res = (await adminApi.campaigns.send(id)) as { sent: number; failed: number };
      toast.success(`Envoyée — ${res.sent} envoi(s), ${res.failed} échec(s)`);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Envoi impossible");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campagnes</h1>
          <div className="page-subtitle">Notifications push à vos utilisateurs mobiles</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-caption">Campagnes</div><div className="kpi-value">{counts.all}</div></div>
        <div className="kpi"><div className="kpi-caption">Envoyées</div><div className="kpi-value">{counts.sent}</div></div>
        <div className="kpi"><div className="kpi-caption">Programmées</div><div className="kpi-value">{counts.scheduled}</div></div>
        <div className="kpi"><div className="kpi-caption">Brouillons</div><div className="kpi-value">{counts.draft}</div></div>
      </div>

      <div className="card" style={{ overflow: "hidden", marginBottom: 24 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Cible</th>
              <th>Statut</th>
              <th style={{ textAlign: "center" }}>Envois</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const p = STATUS_PILL[c.status];
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontSize: 12.5 }}>
                    {c.audience?.accountType ? c.audience.accountType : "Tous"}
                  </td>
                  <td><span className={`pill ${p.cls}`}>{p.label}</span></td>
                  <td style={{ textAlign: "center" }}>{c.sent_count}</td>
                  <td style={{ textAlign: "right" }}>
                    {c.status !== "sent" && (
                      <button className="btn btn-outline btn-sm" onClick={() => sendExisting(c.id)}>
                        <Send size={13} strokeWidth={1.8} /> Envoyer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && campaigns.length === 0 && (
          <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>Aucune campagne.</div>
        )}
      </div>

      <div className="card card-padded">
        <div className="card-title" style={{ marginBottom: 18 }}>Nouvelle campagne</div>
        <div className="row-2">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="field">
              <label className="field-label">Nom interne</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <label className="field-label">Titre</label>
                <span style={{ fontSize: 10, color: "var(--outline)" }}>{title.length} / 60</span>
              </div>
              <input className="input" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field">
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <label className="field-label">Message</label>
                <span style={{ fontSize: 10, color: "var(--outline)" }}>{body.length} / 200</span>
              </div>
              <textarea className="textarea" style={{ minHeight: 80 }} maxLength={200} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Cible</label>
              <div className="select-wrap" style={{ width: "100%", marginTop: 6 }}>
                <select style={{ width: "100%" }} value={audience} onChange={(e) => setAudience(e.target.value)}>
                  <option value="all">Tous les utilisateurs</option>
                  <option value="particulier">Particuliers</option>
                  <option value="professionnel">Professionnels</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Aperçu</div>
            <div style={{ background: "#fff", border: "1px solid var(--outline-variant)", padding: 14, borderRadius: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>LM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--outline)" }}>LA MÉNAGÈRE PARIS · maintenant</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{title || "Titre"}</div>
                  <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", marginTop: 2, lineHeight: 1.4 }}>{body || "Message"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hstack" style={{ marginTop: 24, justifyContent: "flex-end", gap: 8, paddingTop: 18, borderTop: "1px solid var(--outline-soft)" }}>
          <button className="btn btn-outline btn-sm" onClick={() => createCampaign(false)} disabled={busy}>
            Enregistrer brouillon
          </button>
          <button className="btn btn-primary" onClick={() => createCampaign(true)} disabled={busy}>
            <Bell size={14} strokeWidth={1.6} /> {busy ? "Envoi…" : "Créer & envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

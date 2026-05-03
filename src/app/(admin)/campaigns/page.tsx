"use client";

import { useState } from "react";
import { Bell, MoreHorizontal, ArrowRight } from "lucide-react";

const ROWS = [
  { name: "Nouveauté Cuisine Noire & Or", type: "IMAGE", target: "Tous (1234)", date: "il y a 2 h", status: "ENVOYÉE", pill: "pill-success", perf: "1234 / 412 (33%) / 89 (7%)" },
  { name: "Soldes Printemps -15%", type: "TEXT", target: "Particuliers (892)", date: "Hier", status: "ENVOYÉE", pill: "pill-success", perf: "892 / 234 (26%) / 47 (5%)" },
  { name: "Votre devis est prêt", type: "TRIGGER", target: "Auto", date: "—", status: "ACTIVE", pill: "pill-navy", perf: "auto" },
  { name: "Livraison offerte ce week-end", type: "TEXT", target: "Tous", date: "Programmée 5 mai", status: "PROGRAMMÉE", pill: "pill-warning", perf: "—" },
  { name: "Bienvenue chez La Ménagère", type: "IMAGE", target: "Auto (nouveau)", date: "—", status: "ACTIVE", pill: "pill-navy", perf: "auto" },
  { name: "Collection Été", type: "IMAGE", target: "Métropole (734)", date: "Brouillon", status: "BROUILLON", pill: "pill-outline", perf: "—" },
  { name: "Rappel Devis Karim", type: "TEXT", target: "1 client", date: "Programmée demain", status: "PROGRAMMÉE", pill: "pill-warning", perf: "—" },
  { name: "Récap commande #LMP-31", type: "TRANSACTIONNELLE", target: "Auto", date: "—", status: "ENVOYÉE", pill: "pill-success", perf: "1 / 1 / 0" },
];

const TABS = [
  { key: "active", label: "En cours", count: 1 },
  { key: "scheduled", label: "Programmées", count: 3 },
  { key: "done", label: "Terminées", count: 24 },
  { key: "draft", label: "Brouillons", count: 2 },
];

export default function CampaignsPage() {
  const [tab, setTab] = useState("active");
  const [step, setStep] = useState<"content" | "audience" | "send">("content");
  const [contentType, setContentType] = useState<"simple" | "image" | "video">("simple");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campagnes</h1>
          <div className="page-subtitle">
            Notifications push à vos utilisateurs mobiles · 1 234 abonnés actifs
          </div>
        </div>
        <button className="btn btn-primary">
          <Bell size={14} strokeWidth={1.6} />
          <span>Nouvelle campagne</span>
        </button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-caption">Abonnés actifs</div><div className="kpi-value">1 234</div><div className="kpi-foot">+47 ce mois</div></div>
        <div className="kpi"><div className="kpi-caption">Taux d&apos;ouverture</div><div className="kpi-value">28 %</div><div className="kpi-foot">moyenne 30 j</div></div>
        <div className="kpi"><div className="kpi-caption">Taux de clic</div><div className="kpi-value">12 %</div><div className="kpi-foot">+2,1 pts vs mois précédent</div></div>
        <div className="kpi"><div className="kpi-caption">Conversions</div><div className="kpi-value">47</div><div className="kpi-foot">générées sur 30 j</div></div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`chip${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Cible</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Performance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td><span className="pill pill-outline" style={{ fontSize: 9 }}>{r.type}</span></td>
                <td style={{ fontSize: 12.5 }}>{r.target}</td>
                <td style={{ fontSize: 12.5, color: "var(--outline)" }}>{r.date}</td>
                <td><span className={`pill ${r.pill}`}>{r.status}</span></td>
                <td className="mono" style={{ fontSize: 11.5 }}>{r.perf}</td>
                <td>
                  <button className="icon-btn" style={{ width: 28, height: 28 }}>
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card card-padded" style={{ marginTop: 24 }}>
        <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div className="card-title">Nouvelle campagne</div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>
              Étape {step === "content" ? "1" : step === "audience" ? "2" : "3"} sur 3 ·{" "}
              {step === "content" ? "Contenu" : step === "audience" ? "Cible" : "Envoi"}
            </div>
          </div>
          <div className="seg">
            <button className={`seg-btn${step === "content" ? " active" : ""}`} onClick={() => setStep("content")}>1. Contenu</button>
            <button className={`seg-btn${step === "audience" ? " active" : ""}`} onClick={() => setStep("audience")}>2. Cible</button>
            <button className={`seg-btn${step === "send" ? " active" : ""}`} onClick={() => setStep("send")}>3. Envoi</button>
          </div>
        </div>

        <div className="row-2">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="field">
              <label className="field-label">Type</label>
              <div className="seg" style={{ marginTop: 6 }}>
                <button className={`seg-btn${contentType === "simple" ? " active" : ""}`} onClick={() => setContentType("simple")}>Notification simple</button>
                <button className={`seg-btn${contentType === "image" ? " active" : ""}`} onClick={() => setContentType("image")}>Avec image</button>
                <button className={`seg-btn${contentType === "video" ? " active" : ""}`} onClick={() => setContentType("video")}>Avec vidéo</button>
              </div>
            </div>
            <div className="field">
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <label className="field-label">Titre</label>
                <span style={{ fontSize: 10, color: "var(--outline)" }}>28 / 60</span>
              </div>
              <input className="input" defaultValue="Nouveauté chez La Ménagère" />
            </div>
            <div className="field">
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <label className="field-label">Message</label>
                <span style={{ fontSize: 10, color: "var(--outline)" }}>68 / 200</span>
              </div>
              <textarea
                className="textarea"
                style={{ minHeight: 80 }}
                defaultValue="Découvrez notre dernière collection de cuisines sur mesure. Disponible dès maintenant."
              />
            </div>
            <div className="field">
              <label className="field-label">Lien de destination</label>
              <div className="hstack" style={{ gap: 10, marginTop: 6 }}>
                <div className="select-wrap">
                  <select defaultValue="cat">
                    <option value="cat">Catégorie</option>
                    <option>Produit</option>
                    <option>Accueil</option>
                  </select>
                </div>
                <input className="input" defaultValue="Cuisines" style={{ flex: 1 }} />
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Aperçu</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", padding: 14, borderRadius: 14 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>iOS</div>
                <div style={{ background: "rgba(255,255,255,0.95)", padding: 12, borderRadius: 14, display: "flex", gap: 10, backdropFilter: "blur(10px)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>LM</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>La Ménagère</span>
                      <span style={{ fontSize: 10, color: "var(--outline)" }}>maintenant</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>Nouveauté chez La Ménagère</div>
                    <div style={{ fontSize: 11, color: "var(--on-surface-variant)", marginTop: 2, lineHeight: 1.4 }}>
                      Découvrez notre dernière collection de cuisines sur mesure...
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid var(--outline-variant)", padding: 14, borderRadius: 14 }}>
                <div className="eyebrow" style={{ marginBottom: 8, fontSize: 9 }}>Android</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>LM</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "var(--outline)" }}>LA MÉNAGÈRE PARIS · maintenant</div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>Nouveauté chez La Ménagère</div>
                    <div style={{ fontSize: 11, color: "var(--on-surface-variant)", marginTop: 2, lineHeight: 1.4 }}>
                      Découvrez notre dernière collection de cuisines sur mesure.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, padding: 12, background: "var(--surface-container-low)", borderRadius: 10, fontSize: 12, color: "var(--on-surface-variant)" }}>
              📱 Estimé : <strong>892 destinataires</strong> · envoi optimal suggéré 19:00
            </div>
          </div>
        </div>

        <div className="hstack" style={{ marginTop: 24, justifyContent: "flex-end", gap: 8, paddingTop: 18, borderTop: "1px solid var(--outline-soft)" }}>
          <button className="btn btn-outline btn-sm">Tester sur mon appareil</button>
          <button className="btn btn-outline btn-sm">Enregistrer brouillon</button>
          <button className="btn btn-primary">
            Continuer <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

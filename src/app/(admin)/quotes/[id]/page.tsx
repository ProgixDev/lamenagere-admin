import { Send, Plus } from "lucide-react";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="hstack" style={{ gap: 14, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 className="page-title">Demande #{id}</h1>
            <span className="pill pill-warning">En attente</span>
          </div>
          <div className="page-subtitle">
            Reçue le 3 mai 2026 à 13:55 · Karim Benali · SARL Atelier Sud
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-danger btn-sm">Refuser</button>
          <button className="btn btn-primary">
            <Send size={14} strokeWidth={1.7} />
            <span>Envoyer le devis</span>
          </button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Produit demandé</div>
            <div className="hstack" style={{ gap: 18 }}>
              <div className="thumb lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=200&q=80')" }}></div>
              <div style={{ flex: 1 }}>
                <a style={{ color: "var(--secondary)", fontFamily: "var(--display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  Cuisine Noire & Or →
                </a>
                <div style={{ fontSize: 12.5, color: "var(--outline)", marginTop: 4 }}>Cuisines · LMP-C-004</div>
                <div className="hstack" style={{ marginTop: 10, gap: 8 }}>
                  <span className="pill pill-outline">Sur devis</span>
                  <span className="pill pill-bronze-soft">Réf. à partir de 14 800 €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Dimensions souhaitées</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "10px 0", borderBottom: "1px solid var(--outline-soft)" }}>
                  <span style={{ color: "var(--outline)" }}>Largeur</span>
                  <span className="mono" style={{ fontWeight: 600 }}>350 cm</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "10px 0", borderBottom: "1px solid var(--outline-soft)" }}>
                  <span style={{ color: "var(--outline)" }}>Hauteur</span>
                  <span className="mono" style={{ fontWeight: 600 }}>220 cm</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "10px 0" }}>
                  <span style={{ color: "var(--outline)" }}>Profondeur</span>
                  <span className="mono" style={{ fontWeight: 600 }}>65 cm</span>
                </div>
              </div>
              <div style={{ background: "var(--surface-container-low)", borderRadius: 10, padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="180" height="120" viewBox="0 0 180 120">
                  <rect x="20" y="20" width="140" height="80" fill="none" stroke="#002444" strokeWidth="2" />
                  <text x="90" y="14" textAnchor="middle" fontSize="11" fill="#73777f" fontFamily="Geist Mono">350 cm</text>
                  <text x="174" y="64" fontSize="11" fill="#73777f" fontFamily="Geist Mono">220</text>
                  <text x="90" y="68" textAnchor="middle" fontSize="10" fill="#7f5531" fontWeight="600">350 × 220 cm</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 14 }}>Notes du client</div>
            <div style={{ borderLeft: "3px solid var(--secondary)", padding: "12px 16px", background: "var(--surface-container-low)", borderRadius: "0 8px 8px 0", fontStyle: "italic", fontSize: 13.5, lineHeight: 1.6, color: "var(--on-surface-variant)" }}>
              &quot;Bonjour, j&apos;aimerais un devis pour la cuisine Noire & Or avec un îlot plus large que le modèle de référence (3,5 mètres). Plan de travail en marbre Calacatta si possible. Merci d&apos;avance.&quot;
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 14 }}>Photos jointes (4)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    background: "url('https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=300&q=80') center/cover",
                    borderRadius: 8,
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Préparer la réponse</div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label className="field-label">Prix proposé TTC</label>
              <input
                className="input"
                style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 32, color: "var(--secondary)", padding: "14px 0", letterSpacing: "-0.02em" }}
                defaultValue="18 400 €"
              />
            </div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Détail du devis</div>
            <table className="tbl" style={{ marginBottom: 14 }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: "center" }}>Qté</th>
                  <th style={{ textAlign: "right" }}>Prix unit.</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cuisine Noire & Or — base 350×220</td>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td style={{ textAlign: "right" }} className="num">14 800 €</td>
                  <td style={{ textAlign: "right" }} className="num">14 800 €</td>
                  <td><button style={{ color: "var(--outline)" }}>×</button></td>
                </tr>
                <tr>
                  <td>Plan de travail marbre Calacatta</td>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td style={{ textAlign: "right" }} className="num">2 400 €</td>
                  <td style={{ textAlign: "right" }} className="num">2 400 €</td>
                  <td><button style={{ color: "var(--outline)" }}>×</button></td>
                </tr>
                <tr>
                  <td>Îlot custom 3,5 m</td>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td style={{ textAlign: "right" }} className="num">1 200 €</td>
                  <td style={{ textAlign: "right" }} className="num">1 200 €</td>
                  <td><button style={{ color: "var(--outline)" }}>×</button></td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-outline btn-sm" style={{ marginBottom: 18 }}>
              <Plus size={14} strokeWidth={2} />
              <span>Ajouter une ligne</span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div className="field">
                <label className="field-label">Frais de livraison</label>
                <input className="input" defaultValue="0 €" />
              </div>
              <div className="field">
                <label className="field-label">Délai de fabrication</label>
                <input className="input" defaultValue="6-8 semaines" />
              </div>
              <div className="field">
                <label className="field-label">Validité du devis</label>
                <div className="select-wrap" style={{ width: "100%" }}>
                  <select style={{ width: "100%" }} defaultValue="60">
                    <option value="30">30 jours</option>
                    <option value="60">60 jours</option>
                    <option value="90">90 jours</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
              <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--outline)" }}>Sous-total HT</span>
                  <span>15 333 €</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--outline)" }}>TVA 20 %</span>
                  <span>3 067 €</span>
                </div>
                <div style={{ height: 1, background: "var(--outline-soft)", margin: "6px 0" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="eyebrow">Total TTC</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, color: "var(--secondary)", letterSpacing: "-0.02em" }}>
                    18 400 €
                  </span>
                </div>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 18 }}>
              <label className="field-label">Message au client</label>
              <textarea
                className="textarea"
                style={{ minHeight: 140 }}
                defaultValue={`Bonjour Karim, suite à votre demande, voici notre proposition pour votre projet de cuisine Noire & Or sur mesure. Le devis tient compte des modifications souhaitées (îlot 3,5 m, plan de travail Calacatta). Notre équipe reste à votre disposition pour toute précision.

Cordialement,
Azdine — La Ménagère Paris`}
              />
            </div>

            <button className="btn btn-outline btn-sm" style={{ marginBottom: 18 }}>
              📎 Joindre un PDF (devis détaillé)
            </button>

            <div style={{ display: "flex", gap: 10, paddingTop: 18, borderTop: "1px solid var(--outline-soft)" }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <Send size={14} strokeWidth={1.7} />
                <span>Envoyer le devis au client</span>
              </button>
              <button className="btn btn-ghost btn-lg">Brouillon</button>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Client</div>
            <div className="hstack" style={{ gap: 14, marginBottom: 14 }}>
              <div className="avatar lg bronze">KB</div>
              <div>
                <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600 }}>Karim Benali</div>
                <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>k.benali@ateliersud.fr</div>
              </div>
            </div>
            <div className="hstack" style={{ gap: 6, marginBottom: 14 }}>
              <span className="pill pill-bronze">PRO</span>
              <span className="pill pill-outline">12 commandes</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--on-surface-variant)", background: "var(--surface-container-low)", padding: 12, borderRadius: 8, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 600 }}>SARL Atelier Sud</strong>
              <br />SIRET 821 234 567 00012
              <br />TVA FR82 821234567
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>Total dépensé</div>
                <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16, color: "var(--secondary)" }}>84 200 €</div>
              </div>
              <div>
                <div className="eyebrow" style={{ fontSize: 9 }}>Devis demandés</div>
                <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>7</div>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Devis similaires</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5 }}>
              <div style={{ padding: 10, background: "var(--surface-container-low)", borderRadius: 8 }}>
                <div style={{ fontWeight: 500 }}>Cuisine Noire & Or 320×200</div>
                <div className="hstack" style={{ marginTop: 4, justifyContent: "space-between" }}>
                  <span style={{ color: "var(--outline)", fontSize: 11 }}>envoyé en mars</span>
                  <span className="num" style={{ fontSize: 13 }}>16 200 €</span>
                </div>
              </div>
              <div style={{ padding: 10, background: "var(--surface-container-low)", borderRadius: 8 }}>
                <div style={{ fontWeight: 500 }}>Cuisine Noire & Or 380×240</div>
                <div className="hstack" style={{ marginTop: 4, justifyContent: "space-between" }}>
                  <span style={{ color: "var(--outline)", fontSize: 11 }}>envoyé en février</span>
                  <span className="num" style={{ fontSize: 13 }}>19 800 €</span>
                </div>
              </div>
              <div style={{ padding: 10, background: "rgba(16,185,129,0.06)", borderRadius: 8 }}>
                <div style={{ fontWeight: 500 }}>Cuisine Marbre + Or 350×220</div>
                <div className="hstack" style={{ marginTop: 4, justifyContent: "space-between" }}>
                  <span style={{ color: "var(--success)", fontWeight: 600, fontSize: 11 }}>accepté en avril</span>
                  <span className="num" style={{ fontSize: 13 }}>22 400 €</span>
                </div>
              </div>
            </div>
            <a className="card-link" style={{ display: "inline-block", marginTop: 12 }}>
              Voir l&apos;historique →
            </a>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Statut</div>
            <div className="timeline">
              <div className="tl-row">
                <span className="tl-dot" style={{ background: "var(--warning)" }}></span>
                <div className="tl-text">
                  <div>En attente de devis</div>
                  <div className="tl-meta">3 mai · 13:55 — client</div>
                </div>
              </div>
              <div className="tl-row">
                <span className="tl-dot" style={{ background: "var(--surface-dim)" }}></span>
                <div className="tl-text" style={{ color: "var(--outline)" }}>
                  <div>Devis envoyé</div>
                  <div className="tl-meta">—</div>
                </div>
              </div>
              <div className="tl-row">
                <span className="tl-dot" style={{ background: "var(--surface-dim)" }}></span>
                <div className="tl-text" style={{ color: "var(--outline)" }}>
                  <div>Accepté / Refusé</div>
                  <div className="tl-meta">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

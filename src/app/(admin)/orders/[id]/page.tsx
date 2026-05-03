import Link from "next/link";
import { Truck, ArrowRight, Check, Home, MessageSquare } from "lucide-react";

export default async function OrderDetailPage({
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
            <h1 className="page-title">Commande #{id}</h1>
            <span className="pill pill-prep">EN PRÉPARATION</span>
          </div>
          <div className="page-subtitle">
            Passée le 3 mai 2026 à 14:32 · Sophie Mercier · 🇫🇷 Métropole
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">Imprimer</button>
          <button className="btn btn-outline btn-sm">
            <Truck size={14} strokeWidth={1.7} />
            <span>Bon de livraison</span>
          </button>
          <button className="btn btn-primary">
            Faire avancer le statut <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Suivi</div>
                <div className="card-title">Statut & expédition</div>
              </div>
            </div>
            <div className="stepper">
              <div className="step done">
                <div className="step-icon"><Check size={14} strokeWidth={3} /></div>
                <div className="step-label">Confirmée</div>
                <div className="step-time">3 mai · 14:32</div>
              </div>
              <div className="step done">
                <div className="step-icon"><Check size={14} strokeWidth={3} /></div>
                <div className="step-label">En préparation</div>
                <div className="step-time">3 mai · 16:10</div>
              </div>
              <div className="step current">
                <div className="step-icon"><Truck size={14} strokeWidth={1.7} /></div>
                <div className="step-label" style={{ color: "var(--primary)" }}>En attente d&apos;expédition</div>
                <div className="step-time">En cours</div>
              </div>
              <div className="step">
                <div className="step-icon"><Truck size={14} strokeWidth={1.7} /></div>
                <div className="step-label" style={{ color: "var(--outline)" }}>Expédiée</div>
                <div className="step-time">—</div>
              </div>
              <div className="step">
                <div className="step-icon"><Home size={14} strokeWidth={2.5} /></div>
                <div className="step-label" style={{ color: "var(--outline)" }}>Livrée</div>
                <div className="step-time">—</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--outline-soft)" }}>
              <div className="field">
                <label className="field-label">Date de livraison estimée</label>
                <input className="input" type="text" defaultValue="21 mai 2026" />
              </div>
              <div className="field">
                <label className="field-label">Note interne (admins uniquement)</label>
                <input className="input" type="text" defaultValue="Container leaving Le Havre 15 mai" />
              </div>
            </div>

            <div className="hstack" style={{ marginTop: 22, gap: 10 }}>
              <button className="btn btn-primary">
                <Truck size={14} strokeWidth={1.7} />
                <span>Marquer comme expédiée</span>
              </button>
              <button className="btn btn-danger btn-sm">Annuler la commande</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Articles commandés</div>
              <span style={{ fontSize: 12, color: "var(--outline)" }}>2 articles</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Dimensions</th>
                    <th style={{ textAlign: "center" }}>Qté</th>
                    <th style={{ textAlign: "right" }}>Prix unitaire</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="hstack" style={{ gap: 14 }}>
                        <div className="thumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80')" }}></div>
                        <div>
                          <div style={{ fontWeight: 500 }}>Canapé Modulable Bordeaux</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--outline)", marginTop: 3 }}>SKU · LMP-S-005</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12.5 }}>320×95×180 cm</span></td>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td style={{ textAlign: "right" }} className="num">2 890 €</td>
                    <td style={{ textAlign: "right" }} className="num">2 890 €</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="hstack" style={{ gap: 14 }}>
                        <div className="thumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&q=80')" }}></div>
                        <div>
                          <div style={{ fontWeight: 500 }}>Buffet Miroir Triptyque</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--outline)", marginTop: 3 }}>SKU · LMP-D-009</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ color: "var(--outline)" }}>—</span></td>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td style={{ textAlign: "right" }} className="num">1 890 €</td>
                    <td style={{ textAlign: "right" }} className="num">1 890 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid var(--outline-soft)", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--outline)" }}>Sous-total HT</span><span>3 983,33 €</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--outline)" }}>TVA 20 %</span><span>796,67 €</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--outline)" }}>Frais de livraison</span><span>0 €</span></div>
                <div style={{ height: 1, background: "var(--outline-soft)", margin: "8px 0" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--on-surface)", fontWeight: 600 }}>Total TTC</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, color: "var(--secondary)", letterSpacing: "-0.02em" }}>4 780,00 €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Adresses</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Livraison</div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Sophie Mercier</div>
                <div style={{ fontSize: 13, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
                  12 rue de Rivoli<br />75001 Paris<br />France métropolitaine
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--on-surface-variant)" }}>📞 06 12 34 56 78</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Modifier</button>
              </div>
              <div>
                <div className="hstack" style={{ marginBottom: 10, gap: 10 }}>
                  <div className="eyebrow">Facturation</div>
                  <span className="pill pill-success-soft" style={{ fontSize: 9 }}>Identique</span>
                </div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Sophie Mercier</div>
                <div style={{ fontSize: 13, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
                  12 rue de Rivoli<br />75001 Paris<br />France métropolitaine
                </div>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Paiement</div>
            <div className="hstack" style={{ gap: 14 }}>
              <div style={{ width: 48, height: 32, background: "#1A1F71", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontStyle: "italic", fontSize: 11, borderRadius: 6, letterSpacing: "-0.05em" }}>
                VISA
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Visa •••• 4242</div>
                <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2, fontFamily: "var(--mono)" }}>tx_3K1aB2eZj9 · 3 mai 14:32</div>
              </div>
              <span className="pill pill-success">Payé · 4 780 €</span>
            </div>
            <button className="btn btn-danger btn-sm" style={{ marginTop: 18 }}>Rembourser cette commande</button>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Notes internes & journal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="avatar sm">AZ</div>
                <div style={{ flex: 1, background: "var(--surface-container-low)", padding: "12px 14px", borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Azdine <span style={{ color: "var(--outline)", fontWeight: 400, marginLeft: 6 }}>il y a 2h</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Container partira de Le Havre vers le 15 mai. RAS sur la préparation.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="avatar sm">AZ</div>
                <div style={{ flex: 1, background: "var(--surface-container-low)", padding: "12px 14px", borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Azdine <span style={{ color: "var(--outline)", fontWeight: 400, marginLeft: 6 }}>il y a 4h</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Stock OK, préparation lancée par l&apos;atelier.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="avatar sm outline">⚙</div>
                <div style={{ flex: 1, fontSize: 12.5, color: "var(--outline)", padding: "12px 0" }}>
                  <span style={{ fontWeight: 600, color: "var(--on-surface-variant)" }}>Système</span> · il y a 5h · Statut changé : Confirmée → En préparation
                </div>
              </div>
            </div>
            <textarea className="input-boxed" style={{ marginTop: 18, width: "100%", minHeight: 80 }} placeholder="Ajouter une note..." />
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Client</div>
            <div className="hstack" style={{ gap: 14, marginBottom: 16 }}>
              <div className="avatar lg">SM</div>
              <div>
                <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>Sophie Mercier</div>
                <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>sophie.mercier@gmail.com</div>
                <div style={{ fontSize: 12, color: "var(--outline)" }}>06 12 34 56 78</div>
              </div>
            </div>
            <div className="hstack" style={{ gap: 6, marginBottom: 18 }}>
              <span className="pill pill-bronze-soft">Particulier</span>
              <span className="pill pill-outline">5 commandes</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: 14, background: "var(--surface-container-low)", borderRadius: 10 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 9 }}>Total dépensé</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600, color: "var(--secondary)", letterSpacing: "-0.02em" }}>18 240 €</div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 9 }}>Dernière commande</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>il y a 12 min</div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexDirection: "column" }}>
              <Link href="/customers/sophie-mercier" className="btn btn-outline btn-sm">Voir la fiche client</Link>
              <button className="btn btn-outline btn-sm">
                <MessageSquare size={14} strokeWidth={1.6} />
                <span>Envoyer un message</span>
              </button>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Communication récente</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  Sophie Mercier <span style={{ color: "var(--outline)", fontWeight: 400, marginLeft: 6 }}>il y a 1h</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--on-surface-variant)", marginTop: 4 }}>
                  Bonjour, quand sera expédiée ma commande ?
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  Azdine <span style={{ color: "var(--outline)", fontWeight: 400, marginLeft: 6 }}>il y a 45 min</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--on-surface-variant)", marginTop: 4 }}>
                  Bonjour Sophie, expédition prévue cette semaine...
                </div>
              </div>
            </div>
            <Link href="/messages" className="card-link" style={{ marginTop: 14, display: "inline-block" }}>
              Ouvrir la conversation →
            </Link>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Historique du statut</div>
            <div className="timeline">
              <div className="tl-row">
                <span className="tl-dot" style={{ background: "var(--primary)" }}></span>
                <div className="tl-text">
                  <div>En préparation</div>
                  <div className="tl-meta">3 mai · 16:10 — par Azdine</div>
                </div>
              </div>
              <div className="tl-row">
                <span className="tl-dot" style={{ background: "var(--success)" }}></span>
                <div className="tl-text">
                  <div>Commande confirmée</div>
                  <div className="tl-meta">3 mai · 14:32 — automatique</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Outils</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-outline btn-sm">Dupliquer la commande</button>
              <button className="btn btn-outline btn-sm">Générer un avoir</button>
              <button className="btn btn-outline btn-sm">Signaler un problème</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

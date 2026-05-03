import Link from "next/link";
import { Mail, MessageSquare, Plus } from "lucide-react";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <div className="page">
      <div className="page-header">
        <div className="hstack" style={{ gap: 18 }}>
          <div className="avatar lg">SM</div>
          <div>
            <div className="hstack" style={{ gap: 10, marginBottom: 4 }}>
              <h1 className="page-title" style={{ fontSize: 28 }}>Sophie Mercier</h1>
              <span className="pill pill-bronze">Particulier</span>
            </div>
            <div className="page-subtitle">5 commandes · 18 240 € · cliente depuis le 15 mars 2026</div>
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">
            <Mail size={14} strokeWidth={1.7} />
            <span>Envoyer un email</span>
          </button>
          <button className="btn btn-outline btn-sm">
            <MessageSquare size={14} strokeWidth={1.6} />
            <span>Démarrer une conversation</span>
          </button>
          <button className="btn btn-primary">Modifier le profil</button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Coordonnées</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, fontSize: 13 }}>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Prénom</div><div>Sophie</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Nom</div><div>Mercier</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Email</div><div>sophie.mercier@gmail.com</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Téléphone</div><div>06 12 34 56 78</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Date de naissance</div><div>14 août 1985</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Langue</div><div>Français</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Inscrite</div><div>15 mars 2026 · il y a 49 j</div></div>
              <div><div className="eyebrow" style={{ marginBottom: 4 }}>Compte</div><div>Vérifié ✓</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Adresses</div>
              <button className="btn btn-outline btn-sm">
                <Plus size={14} strokeWidth={2} />
                <span>Ajouter</span>
              </button>
            </div>
            <div style={{ padding: "18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ border: "1px solid var(--outline-variant)", borderRadius: 10, padding: 16, position: "relative" }}>
                <span className="pill pill-success-soft" style={{ position: "absolute", top: 12, right: 12, fontSize: 9 }}>Principale</span>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Livraison</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Sophie Mercier<br />12 rue de Rivoli<br />75001 Paris<br />France métropolitaine
                </div>
              </div>
              <div style={{ border: "1px solid var(--outline-variant)", borderRadius: 10, padding: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Bureau</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Sophie Mercier<br />48 boulevard Haussmann<br />75009 Paris<br />France métropolitaine
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Commandes (5)</div>
              <Link href="/orders" className="card-link">Voir tout →</Link>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Articles</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">#LMP-2026-037</td>
                  <td>3 mai</td>
                  <td>Canapé Modulable</td>
                  <td style={{ textAlign: "right" }} className="num">2 890 €</td>
                  <td><span className="pill pill-prep">EN PRÉPARATION</span></td>
                </tr>
                <tr>
                  <td className="mono">#LMP-2026-018</td>
                  <td>14 avr</td>
                  <td>Buffet Miroir</td>
                  <td style={{ textAlign: "right" }} className="num">1 890 €</td>
                  <td><span className="pill pill-success">LIVRÉE</span></td>
                </tr>
                <tr>
                  <td className="mono">#LMP-2026-009</td>
                  <td>28 mar</td>
                  <td>Table Marbre + Chaises</td>
                  <td style={{ textAlign: "right" }} className="num">5 860 €</td>
                  <td><span className="pill pill-success">LIVRÉE</span></td>
                </tr>
                <tr>
                  <td className="mono">#LMP-2026-004</td>
                  <td>22 mar</td>
                  <td>Salon Crème</td>
                  <td style={{ textAlign: "right" }} className="num">3 450 €</td>
                  <td><span className="pill pill-success">LIVRÉE</span></td>
                </tr>
                <tr>
                  <td className="mono">#LMP-2026-001</td>
                  <td>16 mar</td>
                  <td>Décoration · 3 articles</td>
                  <td style={{ textAlign: "right" }} className="num">4 150 €</td>
                  <td><span className="pill pill-success">LIVRÉE</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Devis (3)</div>
              <a className="card-link">Voir tout →</a>
            </div>
            <table className="tbl">
              <tbody>
                <tr>
                  <td className="mono">#DEV-2026-008</td>
                  <td>Cuisine Îlot Chêne</td>
                  <td><span className="pill pill-warning">EN ATTENTE</span></td>
                  <td style={{ textAlign: "right", color: "var(--outline)" }}>il y a 2 j</td>
                </tr>
                <tr>
                  <td className="mono">#DEV-2026-005</td>
                  <td>Porte Pivotante</td>
                  <td><span className="pill pill-success-soft">ACCEPTÉ</span></td>
                  <td style={{ textAlign: "right", color: "var(--outline)" }}>il y a 1 sem</td>
                </tr>
                <tr>
                  <td className="mono">#DEV-2026-002</td>
                  <td>Dressing custom</td>
                  <td><span className="pill pill-error-soft">REFUSÉ</span></td>
                  <td style={{ textAlign: "right", color: "var(--outline)" }}>il y a 3 sem</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Activité</div>
            <div className="timeline">
              <div className="tl-row"><span className="tl-dot" style={{ background: "var(--success)" }}></span><div className="tl-text"><div>Commande passée · #LMP-2026-037</div><div className="tl-meta">il y a 12 min · 2 890 €</div></div></div>
              <div className="tl-row"><span className="tl-dot" style={{ background: "var(--secondary)" }}></span><div className="tl-text"><div>Devis demandé · Cuisine Îlot Chêne</div><div className="tl-meta">il y a 2 j</div></div></div>
              <div className="tl-row"><span className="tl-dot" style={{ background: "var(--primary)" }}></span><div className="tl-text"><div>Connexion à l&apos;app</div><div className="tl-meta">il y a 2 j · iPhone 14</div></div></div>
              <div className="tl-row"><span className="tl-dot"></span><div className="tl-text"><div>Adresse modifiée</div><div className="tl-meta">il y a 1 sem</div></div></div>
              <div className="tl-row"><span className="tl-dot" style={{ background: "var(--success)" }}></span><div className="tl-text"><div>Avis 5★ laissé</div><div className="tl-meta">Buffet Miroir · il y a 1 sem</div></div></div>
              <div className="tl-row"><span className="tl-dot"></span><div className="tl-text"><div>Inscription</div><div className="tl-meta">15 mars 2026</div></div></div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Statistiques</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 13 }}>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Total dépensé</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18, color: "var(--secondary)" }}>18 240 €</div></div>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Panier moyen</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>3 648 €</div></div>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Commandes</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>5</div></div>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Devis</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>3</div></div>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Conversion</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>66 %</div></div>
              <div><div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Note moyenne</div><div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 18 }}>4,8 ★</div></div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Score client</div>
            <div style={{ textAlign: "center" }}>
              <svg width="140" height="80" viewBox="0 0 140 80">
                <path d="M 20 70 A 50 50 0 0 1 120 70" fill="none" stroke="var(--surface-container)" strokeWidth="8" strokeLinecap="round" />
                <path d="M 20 70 A 50 50 0 0 1 110 38" fill="none" stroke="var(--success)" strokeWidth="8" strokeLinecap="round" />
                <text x="70" y="60" textAnchor="middle" fontFamily="Fraunces" fontSize="28" fontWeight="600" fill="var(--on-surface)">87</text>
              </svg>
              <div style={{ fontSize: 11, color: "var(--success)", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>Excellent</div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Segments</div>
            <div className="hstack" style={{ gap: 6, flexWrap: "wrap" }}>
              <span className="pill pill-bronze-soft">Client fidèle ×</span>
              <span className="pill pill-navy-soft">Métropole ×</span>
              <span className="pill pill-outline">Particulier ×</span>
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>
              <Plus size={14} strokeWidth={2} />
              <span>Ajouter un tag</span>
            </button>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Préférences</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Email marketing</span>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>SMS marketing</span>
                <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Notifications push</span>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Newsletter</span>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Compte</div>
            <div style={{ fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: 14 }}>
              Dernière connexion : il y a 2 j<br />
              IP : 86.215.x.x · Paris<br />
              Appareil : iPhone 14, Safari
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: "100%", marginBottom: 8 }}>
              Réinitialiser le mot de passe
            </button>
            <button className="btn btn-danger btn-sm" style={{ width: "100%" }}>
              Suspendre le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Plus, Download } from "lucide-react";

const INTEGRATIONS: { n: string; s: string; c: string }[] = [
  { n: "Stripe", s: "Activé", c: "success" },
  { n: "Google Analytics", s: "Activé", c: "success" },
  { n: "Mailchimp", s: "Connecter", c: "outline" },
  { n: "Meta Pixel", s: "Connecter", c: "outline" },
  { n: "Klaviyo", s: "Connecter", c: "outline" },
  { n: "API publique", s: "Lecture seule", c: "navy" },
];

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <div className="page-subtitle">
            Configurez votre boutique, votre compte et vos intégrations
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Profil administrateur</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Vos informations personnelles</div>
          <div className="hstack" style={{ gap: 14, marginBottom: 18 }}>
            <div className="avatar lg">AZ</div>
            <a className="card-link">Changer la photo</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field"><label className="field-label">Nom complet</label><input className="input" defaultValue="Azdine Khelifa" /></div>
            <div className="field"><label className="field-label">Email</label><input className="input" defaultValue="azdine@lamenagereparis.fr" /></div>
            <div className="field"><label className="field-label">Téléphone</label><input className="input" defaultValue="+33 6 12 34 56 78" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field">
                <label className="field-label">Langue</label>
                <div className="select-wrap" style={{ width: "100%" }}>
                  <select style={{ width: "100%" }} defaultValue="fr"><option value="fr">Français</option><option>English</option></select>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Fuseau horaire</label>
                <div className="select-wrap" style={{ width: "100%" }}>
                  <select style={{ width: "100%" }}><option>Europe/Paris</option></select>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start", marginTop: 8 }}>Enregistrer</button>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Sécurité</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Mot de passe et 2FA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field"><label className="field-label">Mot de passe actuel</label><input className="input" type="password" defaultValue="••••••••" /></div>
            <div className="field"><label className="field-label">Nouveau mot de passe</label><input className="input" type="password" /></div>
            <div className="field"><label className="field-label">Confirmer</label><input className="input" type="password" /></div>
            <div style={{ padding: 14, background: "var(--surface-container-low)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>2FA · Configuré</div>
                <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>iPhone d&apos;Azdine</div>
              </div>
              <a className="card-link">Reconfigurer</a>
            </div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 6 }}>
              Sessions : Mac · Paris · maintenant<br />
              iPhone · Paris · il y a 2h
            </div>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Boutique</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Informations légales et contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field"><label className="field-label">Nom de la boutique</label><input className="input" defaultValue="La Ménagère Paris" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label className="field-label">Email contact</label><input className="input" defaultValue="contact@lamenagereparis.fr" /></div>
              <div className="field"><label className="field-label">Téléphone</label><input className="input" defaultValue="+33 1 23 45 67 89" /></div>
            </div>
            <div className="field">
              <label className="field-label">Adresse entrepôt</label>
              <textarea className="textarea" style={{ minHeight: 60 }} defaultValue={"14 rue du Faubourg Saint-Antoine\n75011 Paris"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label className="field-label">SIRET</label><input className="input mono" defaultValue="821 234 567 00012" /></div>
              <div className="field"><label className="field-label">TVA intracom</label><input className="input mono" defaultValue="FR82 821234567" /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>Mode maintenance</div>
                <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>Affiche un écran maintenance dans l&apos;app</div>
              </div>
              <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
            </div>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Livraison</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Délais et frais par zone</div>
          <table className="tbl" style={{ marginBottom: 14 }}>
            <thead><tr><th>Zone</th><th>Délai</th><th style={{ textAlign: "right" }}>Frais</th></tr></thead>
            <tbody>
              <tr><td>🇫🇷 Métropole</td><td>2-3 semaines</td><td style={{ textAlign: "right" }} className="num">0 €</td></tr>
              <tr><td>🌴 La Réunion</td><td>8-12 semaines</td><td style={{ textAlign: "right" }} className="num">150 €</td></tr>
              <tr><td>🌴 Mayotte</td><td>8-12 semaines</td><td style={{ textAlign: "right" }} className="num">180 €</td></tr>
              <tr><td>🌴 Guadeloupe</td><td>8-12 semaines</td><td style={{ textAlign: "right" }} className="num">150 €</td></tr>
              <tr><td>🌴 Martinique</td><td>8-12 semaines</td><td style={{ textAlign: "right" }} className="num">150 €</td></tr>
              <tr><td>🌴 Guyane</td><td>8-12 semaines</td><td style={{ textAlign: "right" }} className="num">200 €</td></tr>
            </tbody>
          </table>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">Seuil franco de port</label>
            <input className="input" defaultValue="1500 €" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13 }}>Calcul auto selon poids/volume</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Paiements</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Méthodes de paiement & TVA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
              <div className="hstack" style={{ gap: 10 }}>
                <span style={{ fontWeight: 700, color: "#635bff", fontSize: 13 }}>stripe</span>
                <span style={{ fontSize: 11, color: "var(--outline)" }}>Compte test</span>
              </div>
              <span className="pill pill-success-soft">Connecté</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#003087" }}>PayPal</span>
              <a className="card-link">Connecter</a>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
              <span style={{ fontSize: 13 }}>Virement bancaire</span>
              <span className="pill pill-success-soft">Activé</span>
            </div>
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">TVA appliquée</label>
            <div className="select-wrap" style={{ width: "100%" }}>
              <select style={{ width: "100%" }} defaultValue="20"><option value="20">20% (taux normal)</option></select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13 }}>Acompte 30% &gt; 5000 €</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Notifications admin</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Quand vous voulez être prévenu</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span>Email · nouvelle commande</span>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span>Email · nouveau devis</span>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span>Email · nouveau message</span>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span>Push browser · commande</span>
              <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span>Récap quotidien (9h)</span>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
          </div>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Équipe</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Membres ayant accès au back-office</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
              <div className="avatar md">AZ</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>Azdine Khelifa</div>
                <div style={{ fontSize: 11, color: "var(--outline)" }}>azdine@lamenagereparis.fr · maintenant</div>
              </div>
              <span className="pill pill-bronze">Propriétaire</span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>
            <Plus size={14} strokeWidth={2} />
            <span>Inviter un membre</span>
          </button>
        </div>

        <div className="card card-padded">
          <div className="card-title" style={{ marginBottom: 6 }}>Intégrations</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Connectez vos outils favoris</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {INTEGRATIONS.map((i) => (
              <div key={i.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid var(--outline-soft)", borderRadius: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{i.n}</span>
                <span className={`pill pill-${i.c}-soft`}>{i.s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-padded" style={{ gridColumn: "span 2" }}>
          <div className="card-title" style={{ marginBottom: 18 }}>Avancé</div>
          <div className="hstack" style={{ gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <button className="btn btn-outline btn-sm">
              <Download size={14} strokeWidth={1.8} />
              <span>Exporter toutes les données</span>
            </button>
            <button className="btn btn-outline btn-sm">Logs d&apos;audit</button>
            <button className="btn btn-outline btn-sm">API &amp; Webhooks</button>
          </div>
          <div style={{ borderTop: "1px solid var(--outline-soft)", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--error)" }}>Zone dangereuse</div>
              <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>
                Cette action est irréversible et supprimera toutes vos données.
              </div>
            </div>
            <button className="btn btn-danger btn-sm">Supprimer la boutique</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Search, MoreHorizontal, Send } from "lucide-react";

const CONVS: {
  name: string;
  tag?: string;
  subj: string;
  last: string;
  time: string;
  unread?: number;
  active?: boolean;
  initials: string;
}[] = [
  { name: "Karim Benali", tag: "PRO", subj: "Devis Cuisine Noire & Or", last: "Bonjour, j'aimerais des précisions...", time: "12 min", unread: 2, active: true, initials: "KB" },
  { name: "Sophie Mercier", subj: "Commande #LMP-2026-037", last: "Quand sera expédiée ma commande ?", time: "1 h", unread: 1, initials: "SM" },
  { name: "SARL Atelier Sud", tag: "PRO", subj: "Devis Dressing complet", last: "Devis bien reçu, on revient vers vous", time: "3 h", initials: "AS" },
  { name: "Léa Moreau", subj: "Question Canapé Bordeaux", last: "Disponible en gris anthracite ?", time: "Hier", initials: "LM" },
  { name: "Vincent Roussel", subj: "Devis Porte Pivotante", last: "Photos supplémentaires", time: "Hier", unread: 1, initials: "VR" },
  { name: "EURL Décor Plus", tag: "PRO", subj: "Devis Cuisine Marbre", last: "Devis accepté, comment procéder ?", time: "2 j", initials: "DP" },
  { name: "Camille Leroux", subj: "Commande #LMP-2026-031", last: "Livraison reçue, tout va bien !", time: "3 j", initials: "CL" },
  { name: "Amina Tazi", subj: "Demande info", last: "Délai pour Mayotte ?", time: "5 j", initials: "AT" },
  { name: "Olivier Dubois", subj: "Suivi commande", last: "Numéro de tracking ?", time: "6 j", initials: "OD" },
];

export default function MessagesPage() {
  return (
    <div className="msg-app">
      <div className="list-pane">
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--outline-soft)" }}>
          <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>Messages</div>
            <span className="pill pill-warning">5 non lus</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input className="input-boxed" style={{ paddingLeft: 36, width: "100%", height: 36 }} placeholder="Rechercher..." />
          </div>
        </div>
        <div className="chips" style={{ padding: "10px 12px", gap: 6, borderBottom: "1px solid var(--outline-soft)", overflowX: "auto" }}>
          <button className="chip active" style={{ height: 28, fontSize: 11 }}>Toutes <span className="count">24</span></button>
          <button className="chip" style={{ height: 28, fontSize: 11 }}>Non lues <span className="count">5</span></button>
          <button className="chip" style={{ height: 28, fontSize: 11 }}>Devis <span className="count">12</span></button>
          <button className="chip" style={{ height: 28, fontSize: 11 }}>Cmd <span className="count">8</span></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {CONVS.map((c, i) => (
            <div key={i} className={`conv-row${c.active ? " active" : ""}`}>
              <div className={`avatar md${c.tag ? " bronze" : ""}`}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hstack" style={{ justifyContent: "space-between", gap: 6 }}>
                  <div className="hstack-tight" style={{ gap: 6, minWidth: 0, flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                    {c.tag && <span className="pill pill-bronze-soft" style={{ fontSize: 8, padding: "1px 5px" }}>{c.tag}</span>}
                  </div>
                  <span style={{ fontSize: 10, color: "var(--outline)", whiteSpace: "nowrap" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{c.subj}</div>
                <div className="hstack" style={{ justifyContent: "space-between", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11.5, color: "var(--outline)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.last}</span>
                  {c.unread && <span style={{ background: "var(--secondary)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="thread-pane">
        <div style={{ height: 64, background: "var(--surface)", borderBottom: "1px solid var(--outline-variant)", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div className="avatar md bronze">KB</div>
          <div style={{ flex: 1 }}>
            <div className="hstack" style={{ gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Karim Benali</span>
              <span className="pill pill-bronze-soft" style={{ fontSize: 9 }}>PRO</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>SARL Atelier Sud · Devis Cuisine Noire & Or</div>
          </div>
          <button className="btn btn-outline btn-sm">Marquer lu</button>
          <button className="btn btn-outline btn-sm">Archiver</button>
          <button className="icon-btn"><MoreHorizontal size={16} strokeWidth={2} /></button>
        </div>

        <div style={{ padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--outline-soft)" }}>
          <div style={{ background: "var(--surface)", borderLeft: "3px solid var(--primary)", padding: "10px 14px", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div className="thumb sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=120&q=80')" }}></div>
            <div style={{ flex: 1, fontSize: 12.5 }}>
              <span className="mono" style={{ fontWeight: 600 }}>#DEV-2026-012</span> · Cuisine Noire & Or · 350×220 cm
              <span className="pill pill-warning" style={{ marginLeft: 6, fontSize: 9 }}>EN ATTENTE</span>
            </div>
            <a href="/quotes/DEV-2026-012" className="card-link">Ouvrir →</a>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ textAlign: "center" }}>
            <span className="day-pill">Il y a 2 jours</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div className="avatar sm bronze">KB</div>
            <div className="bubble bubble-in">
              Bonjour, je suis intéressé par votre Cuisine Noire & Or. Est-il possible de l&apos;avoir avec un îlot plus large ?
              <div style={{ fontSize: 10, color: "var(--outline)", marginTop: 4 }}>14:22</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="bubble bubble-out">
              Bonjour Karim, oui tout à fait. Quelles dimensions souhaitez-vous ?
              <div style={{ fontSize: 10, opacity: 0.75, marginTop: 4 }}>14:48 · Lu ✓✓</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div className="avatar sm bronze">KB</div>
            <div className="bubble bubble-in">
              3,5 mètres de long si possible. Plan de travail en marbre Calacatta.
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <span className="day-pill">Hier</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div className="avatar sm bronze">KB</div>
            <div className="bubble bubble-in" style={{ padding: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6, width: 240 }}>
                <div style={{ aspectRatio: "1", background: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80') center/cover", borderRadius: 8 }}></div>
                <div style={{ aspectRatio: "1", background: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&q=80') center/cover", borderRadius: 8 }}></div>
              </div>
              <div style={{ padding: "0 6px" }}>Voici l&apos;espace dans lequel ça doit s&apos;installer.</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="bubble bubble-out">
              Merci, je prépare le devis avec ces specs. Réponse sous 24h.
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <span className="day-pill">Aujourd&apos;hui</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div className="avatar sm bronze">KB</div>
            <div className="bubble bubble-in">
              Bonjour, j&apos;aimerais des précisions sur le délai de fabrication pour ma cuisine.
              <div style={{ fontSize: 10, color: "var(--outline)", marginTop: 4 }}>il y a 12 min</div>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--surface)", borderTop: "1px solid var(--outline-variant)", padding: "16px 24px", flexShrink: 0 }}>
          <div style={{ background: "rgba(127,85,49,0.08)", border: "1px dashed var(--secondary)", borderRadius: 10, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--secondary)" }}>
            ✨ Suggestion : &quot;Bonjour Karim, le délai de fabrication est de 6-8 semaines après confirmation du devis...&quot;
            <button style={{ marginLeft: "auto", color: "var(--outline)", fontSize: 11 }}>Ignorer</button>
          </div>
          <div className="hstack" style={{ gap: 10, alignItems: "flex-end" }}>
            <button className="icon-btn">📎</button>
            <button className="icon-btn">😊</button>
            <textarea className="input-boxed" style={{ flex: 1, minHeight: 42, maxHeight: 120, resize: "none" }} placeholder="Écrire un message..." />
            <button className="btn btn-primary btn-sm">
              <Send size={14} strokeWidth={1.7} />
              <span>Envoyer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="ctx-pane" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Client</div>
        <div className="hstack" style={{ gap: 12, marginBottom: 14 }}>
          <div className="avatar lg bronze">KB</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Karim Benali</div>
            <div style={{ fontSize: 11, color: "var(--outline)" }}>SARL Atelier Sud</div>
          </div>
        </div>
        <div className="hstack" style={{ gap: 6, marginBottom: 18 }}>
          <span className="pill pill-bronze">PRO</span>
          <span className="pill pill-outline">12 cmd</span>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10, marginTop: 10 }}>Activité récente</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, marginBottom: 18 }}>
          <div className="hstack-tight" style={{ gap: 8 }}>
            <span className="pill pill-warning" style={{ fontSize: 9 }}>EN ATTENTE</span>
            <span>#DEV-2026-012</span>
          </div>
          <div className="hstack-tight" style={{ gap: 8 }}>
            <span className="pill pill-success" style={{ fontSize: 9 }}>LIVRÉE</span>
            <span>#LMP-2026-031</span>
          </div>
          <div style={{ color: "var(--outline)", fontSize: 11 }}>3 conversations actives</div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Notes internes</div>
        <textarea className="input-boxed" style={{ width: "100%", minHeight: 60, fontSize: 12, marginBottom: 10 }} placeholder="Ajouter une note privée..." />
        <div style={{ background: "var(--surface-container-low)", padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Client habituel · 8 commandes</div>
          <div style={{ color: "var(--outline)", fontSize: 11 }}>Azdine · il y a 2 sem</div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Pièces jointes (8)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                background: `url('https://images.unsplash.com/photo-${i % 2 ? "1556909114-44e3e9399a2a" : "1556909114-f6e7ad7d3136"}?w=100&q=80') center/cover`,
                borderRadius: 6,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

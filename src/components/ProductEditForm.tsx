"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Mode = "edit" | "new";

export function ProductEditForm({ mode = "edit" }: { mode?: Mode }) {
  const isEdit = mode === "edit";
  const [productType, setProductType] = useState<"standard" | "configurable" | "quote">("configurable");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    toast.success("Enregistré");
  }

  return (
    <form className="page" onSubmit={onSubmit}>
      <div className="page-header">
        <div>
          {isEdit && (
            <div
              style={{
                fontSize: 11,
                color: "var(--warning)",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--warning)",
                  animation: "pulse 1.5s infinite",
                }}
              ></span>
              Modifications non enregistrées
            </div>
          )}
          <h1 className="page-title">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>
          <div className="page-subtitle">
            {isEdit ? "Porte Géométrique Noyer · LMP-P-001" : "Créer une nouvelle fiche"}
          </div>
        </div>
        <div className="hstack">
          <Link href="/products" className="btn btn-outline btn-sm">Annuler</Link>
          <button type="button" className="btn btn-outline btn-sm">Enregistrer en brouillon</button>
          <button type="submit" className="btn btn-primary">Publier</button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 20 }}>Informations générales</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="field">
                <label className="field-label">Nom du produit</label>
                <input className="input" defaultValue={isEdit ? "Porte Géométrique Noyer" : ""} placeholder={isEdit ? "" : "Nom du produit"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field">
                  <label className="field-label">Slug</label>
                  <input className="input mono" defaultValue={isEdit ? "porte-geometrique-noyer" : ""} placeholder={isEdit ? "" : "slug-du-produit"} />
                </div>
                <div className="field">
                  <label className="field-label">Catégorie</label>
                  <div className="select-wrap" style={{ width: "100%" }}>
                    <select style={{ width: "100%" }} defaultValue="Portes">
                      <option>Portes</option>
                      <option>Cuisines</option>
                      <option>Canapés</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Type de produit</label>
                <div className="seg" style={{ marginTop: 6 }}>
                  <button type="button" className={`seg-btn${productType === "standard" ? " active" : ""}`} onClick={() => setProductType("standard")}>Standard</button>
                  <button type="button" className={`seg-btn${productType === "configurable" ? " active" : ""}`} onClick={() => setProductType("configurable")}>Configurable</button>
                  <button type="button" className={`seg-btn${productType === "quote" ? " active" : ""}`} onClick={() => setProductType("quote")}>Sur devis</button>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="textarea" defaultValue={isEdit ? "Une porte d'exception en placage noyer véritable, sublimée par un motif géométrique sculpté à la main. Idéale pour les entrées de prestige et les espaces résidentiels haut de gamme." : ""} />
              </div>
              <div className="field">
                <label className="field-label">Description courte</label>
                <input className="input" defaultValue={isEdit ? "Porte massive en noyer avec motif géométrique sculpté à la main." : ""} />
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 8 }}>Médias</div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 16 }}>
              5 photos max · JPG, PNG, max 5 Mo
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              <div style={{ aspectRatio: "1", borderRadius: 10, background: "url('https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=300&q=80') center/cover", position: "relative" }}>
                <span className="pill pill-bronze" style={{ position: "absolute", bottom: 8, left: 8, fontSize: 9 }}>Principale</span>
              </div>
              <div style={{ aspectRatio: "1", borderRadius: 10, background: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80') center/cover" }}></div>
              <div style={{ aspectRatio: "1", borderRadius: 10, background: "var(--surface-container-low)", border: "1.5px dashed var(--outline-variant)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--outline)", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <div style={{ fontSize: 10, textAlign: "center", marginTop: 6 }}>Ajouter</div>
              </div>
              <div style={{ aspectRatio: "1", borderRadius: 10, background: "var(--surface-container-low)", border: "1.5px dashed var(--outline-soft)" }}></div>
            </div>
            <div className="field" style={{ marginTop: 18 }}>
              <label className="field-label">Lien vidéo (optionnel)</label>
              <input className="input" placeholder="YouTube ou MP4..." />
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>
              Tarification ·{" "}
              {productType === "standard" ? "Standard" : productType === "configurable" ? "Configurable" : "Sur devis"}
            </div>

            {productType === "standard" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field">
                  <label className="field-label">Prix TTC</label>
                  <input className="input" defaultValue="2 890 €" />
                </div>
                <div className="field">
                  <label className="field-label">Coût d&apos;achat</label>
                  <div className="hstack" style={{ gap: 10 }}>
                    <input className="input" defaultValue="1 450 €" style={{ flex: 1 }} />
                    <span className="pill pill-success-soft">Marge 50%</span>
                  </div>
                </div>
              </div>
            )}

            {productType === "configurable" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="field">
                    <label className="field-label">Prix de base TTC</label>
                    <input className="input" defaultValue="3 850 €" />
                  </div>
                  <div className="field">
                    <label className="field-label">Coût d&apos;achat</label>
                    <div className="hstack" style={{ gap: 10 }}>
                      <input className="input" defaultValue="1 980 €" style={{ flex: 1 }} />
                      <span className="pill pill-success-soft">Marge 49%</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 20, padding: 16, background: "var(--surface-container-low)", borderRadius: 10 }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Calcul par dimension</div>
                  <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginBottom: 14 }}>
                    Le prix final est calculé à partir des dimensions choisies par le client.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field">
                      <label className="field-label">Coef. largeur (€/cm)</label>
                      <input className="input" defaultValue="8,50" />
                    </div>
                    <div className="field">
                      <label className="field-label">Coef. hauteur (€/cm)</label>
                      <input className="input" defaultValue="6,20" />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, color: "var(--on-surface-variant)" }}>
                    Référence : 200×220 cm · Min 80×180 · Max 280×280
                  </div>
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "#fff", borderRadius: 8, borderLeft: "3px solid var(--primary)", fontSize: 13 }}>
                    Aperçu : <strong>200×220 cm</strong> →{" "}
                    <span className="num" style={{ fontFamily: "var(--display)", fontSize: 18, color: "var(--secondary)", fontWeight: 600 }}>4 100 €</span>
                  </div>
                </div>
              </>
            )}

            {productType === "quote" && (
              <div style={{ padding: 16, background: "var(--surface-container-low)", borderRadius: 10, fontSize: 13, color: "var(--on-surface-variant)" }}>
                Ce produit est uniquement disponible sur devis. Le client demande un devis depuis la fiche produit.
              </div>
            )}
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Livraison</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="field"><label className="field-label">Délai métropole</label><input className="input" defaultValue="2-3 semaines" /></div>
              <div className="field"><label className="field-label">Délai outre-mer</label><input className="input" defaultValue="8-12 semaines" /></div>
              <div className="field"><label className="field-label">Poids estimé (kg)</label><input className="input" defaultValue="65" /></div>
              <div className="field"><label className="field-label">Encombrement (m³)</label><input className="input" defaultValue="0,8" /></div>
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Livraison gratuite</span>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>SEO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field">
                <label className="field-label">Titre SEO</label>
                <input className="input" defaultValue="Porte Géométrique Noyer Sur Mesure | La Ménagère Paris" />
              </div>
              <div className="field">
                <label className="field-label">Description SEO</label>
                <textarea className="textarea" style={{ minHeight: 60 }} defaultValue="Découvrez notre porte d'exception en noyer massif avec motif géométrique sculpté à la main. Configurable sur mesure, livraison France et outre-mer." />
              </div>
              <div style={{ background: "var(--surface-container-low)", padding: 14, borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: "#1a0dab", marginBottom: 2 }}>Porte Géométrique Noyer Sur Mesure | La Ménagère Paris</div>
                <div style={{ fontSize: 11, color: "#006621", marginBottom: 4 }}>lamenagereparis.fr › portes › porte-geometrique-noyer</div>
                <div style={{ fontSize: 12, color: "#545454" }}>Découvrez notre porte d&apos;exception en noyer massif avec motif géométrique sculpté à la main...</div>
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Statut</div>
            <div className="seg" style={{ width: "100%" }}>
              <button type="button" className={`seg-btn${status === "draft" ? " active" : ""}`} style={{ flex: 1 }} onClick={() => setStatus("draft")}>Brouillon</button>
              <button type="button" className={`seg-btn${status === "published" ? " active" : ""}`} style={{ flex: 1 }} onClick={() => setStatus("published")}>Publié</button>
              <button type="button" className={`seg-btn${status === "archived" ? " active" : ""}`} style={{ flex: 1 }} onClick={() => setStatus("archived")}>Archivé</button>
            </div>
            <div className="field" style={{ marginTop: 18 }}>
              <label className="field-label">Date de publication</label>
              <input className="input" defaultValue="Maintenant" />
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Mis en avant sur l&apos;accueil</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {isEdit && (
            <div className="card card-padded">
              <div className="eyebrow" style={{ marginBottom: 14 }}>Aperçu mobile</div>
              <div style={{ background: "var(--surface-container-low)", padding: 14, borderRadius: 14 }}>
                <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1", background: "url('https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=300&q=80') center/cover", position: "relative" }}>
                    <span style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, background: "rgba(255,255,255,0.95)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1c1c" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>Porte Géométrique Noyer</div>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, color: "var(--secondary)", marginTop: 4, fontSize: 14 }}>À partir de 3 850 €</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button type="button" className="btn btn-outline btn-sm">Dupliquer ce produit</button>
              <button type="button" className="btn btn-outline btn-sm">
                <ExternalLink size={14} strokeWidth={1.8} />
                <span>Voir sur la boutique</span>
              </button>
              <button type="button" className="btn btn-danger btn-sm">Supprimer</button>
            </div>
          </div>

          {isEdit && (
            <div className="card card-padded">
              <div className="eyebrow" style={{ marginBottom: 14 }}>Historique</div>
              <div className="timeline">
                <div className="tl-row"><span className="tl-dot"></span><div className="tl-text"><div>Modifié</div><div className="tl-meta">il y a 12 min · vous</div></div></div>
                <div className="tl-row"><span className="tl-dot" style={{ background: "var(--success)" }}></span><div className="tl-text"><div>Publié</div><div className="tl-meta">14 mars 2026 · Azdine</div></div></div>
                <div className="tl-row"><span className="tl-dot" style={{ background: "var(--secondary)" }}></span><div className="tl-text"><div>Créé</div><div className="tl-meta">10 mars 2026 · Azdine</div></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

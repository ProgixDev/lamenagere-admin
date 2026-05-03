"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const FEATURED = [
  { pos: 1, name: "Cuisine Noire & Or", cat: "Cuisines", img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=200" },
  { pos: 2, name: "Canapé Modulable Bordeaux", cat: "Canapés", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200" },
  { pos: 3, name: "Porte Géométrique Noyer", cat: "Portes", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=200" },
  { pos: 4, name: "Chambre Royale Blanche & Or", cat: "Chambres", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200" },
  { pos: 5, name: "Buffet Miroir Triptyque", cat: "Décoration", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200" },
  { pos: 6, name: "Baie Vitrée Coulissante", cat: "Baies Vitrées", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200" },
];

const DragHandle = () => (
  <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
    <circle cx="3" cy="4" r="1.5" />
    <circle cx="3" cy="10" r="1.5" />
    <circle cx="3" cy="16" r="1.5" />
    <circle cx="11" cy="4" r="1.5" />
    <circle cx="11" cy="10" r="1.5" />
    <circle cx="11" cy="16" r="1.5" />
  </svg>
);

export default function FeaturedPage() {
  const [tab, setTab] = useState<"products" | "carousel" | "banners">("products");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mise en avant</h1>
          <div className="page-subtitle">
            Contrôlez ce qui apparaît en premier sur l&apos;application mobile
          </div>
        </div>
        <button className="btn btn-outline btn-sm">📱 Voir le rendu mobile</button>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        <div className={`tab${tab === "products" ? " active" : ""}`} onClick={() => setTab("products")}>
          Produits vedette <span className="tcount">6</span>
        </div>
        <div className={`tab${tab === "carousel" ? " active" : ""}`} onClick={() => setTab("carousel")}>
          Carrousel d&apos;accueil <span className="tcount">2</span>
        </div>
        <div className={`tab${tab === "banners" ? " active" : ""}`} onClick={() => setTab("banners")}>
          Bannières promo <span className="tcount">2</span>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          {tab === "products" && (
            <div className="card card-padded">
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div className="card-title">Sélection actuelle</div>
                  <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>
                    6 produits affichés sur l&apos;accueil
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Plus size={14} strokeWidth={2} />
                  <span>Ajouter un produit</span>
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FEATURED.map((p) => (
                  <div key={p.pos} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 12 }}>
                    <span style={{ color: "var(--outline-variant)", cursor: "grab" }}>
                      <DragHandle />
                    </span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, fontSize: 14 }}>
                      #{p.pos}
                    </div>
                    <div className="thumb" style={{ backgroundImage: `url(${p.img})` }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{p.cat}</div>
                    </div>
                    <a className="card-link">Voir →</a>
                    <button className="btn btn-danger btn-sm">Retirer</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "carousel" && (
            <div className="card card-padded">
              <div className="card-title" style={{ marginBottom: 6 }}>Carrousel d&apos;accueil</div>
              <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>
                2 slides actives · rotation toutes les 5 secondes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 12 }}>
                  <span style={{ color: "var(--outline-variant)", cursor: "grab" }}><DragHandle /></span>
                  <div style={{ width: 160, height: 96, borderRadius: 10, background: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400') center/cover" }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>Cuisines Sur Mesure</div>
                    <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>Collection 2026 · → Catégorie Cuisines</div>
                    <div className="hstack" style={{ marginTop: 6, gap: 6 }}>
                      <span className="pill pill-navy-soft">IMAGE</span>
                      <span className="pill pill-success-soft">Active</span>
                    </div>
                  </div>
                  <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 12 }}>
                  <span style={{ color: "var(--outline-variant)", cursor: "grab" }}><DragHandle /></span>
                  <div style={{ width: 160, height: 96, borderRadius: 10, background: "url('https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=400') center/cover", position: "relative" }}>
                    <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4 }}>
                      ▶ VIDÉO
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>Portes Pivotantes 3D</div>
                    <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>Demandez votre devis · → Produit</div>
                    <div className="hstack" style={{ marginTop: 6, gap: 6 }}>
                      <span className="pill pill-bronze-soft">VIDÉO</span>
                      <span className="pill pill-success-soft">Active</span>
                    </div>
                  </div>
                  <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 14 }}>
                <Plus size={14} strokeWidth={2} />
                <span>Ajouter un slide</span>
              </button>
            </div>
          )}

          {tab === "banners" && (
            <div className="card card-padded">
              <div className="card-title" style={{ marginBottom: 18 }}>Bannières promo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "#fff" }}>
                  <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 12px", borderRadius: 999, fontWeight: 700, fontSize: 11, letterSpacing: "0.16em" }}>
                    -15%
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>Soldes Printemps · -15% sur les portes</div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Active jusqu&apos;au 15 mai</div>
                  </div>
                  <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, background: "var(--secondary)", color: "#fff" }}>
                  <span style={{ fontSize: 24 }}>📦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>Livraison offerte dès 1500 €</div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Permanente</div>
                  </div>
                  <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card card-padded" style={{ position: "sticky", top: 88, alignSelf: "flex-start" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Aperçu mobile</div>
          <div style={{ background: "#0f1115", padding: "14px 8px", borderRadius: 32, width: 240, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", height: 480, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2EA3F2" }}></span>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFC107" }}></span>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#EF4444" }}></span>
                </div>
                <span style={{ fontSize: 9, fontFamily: "var(--display)", fontWeight: 600 }}>La Ménagère</span>
                <span style={{ fontSize: 14 }}>≡</span>
              </div>
              <div style={{ height: 140, background: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400') center/cover", margin: "0 12px", borderRadius: 12, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 10, left: 10, color: "#fff" }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: 13, fontWeight: 600 }}>Cuisines Sur Mesure</div>
                  <div style={{ fontSize: 9, opacity: 0.9 }}>Collection 2026</div>
                </div>
              </div>
              <div style={{ padding: "12px 14px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--on-surface)" }}>
                Best-sellers
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 12px", flex: 1 }}>
                {FEATURED.slice(0, 4).map((p) => (
                  <div key={p.pos} style={{ background: "var(--surface-container-low)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ aspectRatio: "1", background: `url(${p.img}) center/cover` }}></div>
                    <div style={{ padding: 6 }}>
                      <div style={{ fontSize: 9, fontWeight: 500, lineHeight: 1.3 }}>{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Folder, Edit3, Eye, Trash2 } from "lucide-react";

type Cat = {
  name: string;
  slug: string;
  count: number;
  visible: boolean;
  img: string;
};

const CATS: Cat[] = [
  { name: "Portes", slug: "portes", count: 10, visible: true, img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=120&q=80" },
  { name: "Baies Vitrées", slug: "baies-vitrees", count: 2, visible: true, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&q=80" },
  { name: "Cuisines", slug: "cuisines", count: 8, visible: true, img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&q=80" },
  { name: "Canapés & Fauteuils", slug: "canapes-fauteuils", count: 4, visible: true, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80" },
  { name: "Tables à Manger", slug: "tables", count: 0, visible: true, img: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=120&q=80" },
  { name: "Chambres Complètes", slug: "chambres", count: 5, visible: true, img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=120&q=80" },
  { name: "Carrelage", slug: "carrelage", count: 0, visible: false, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&q=80" },
  { name: "Électroménager", slug: "electromenager", count: 0, visible: false, img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=120&q=80" },
  { name: "Décoration", slug: "decoration", count: 1, visible: true, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&q=80" },
  { name: "Lessive & Entretien", slug: "entretien", count: 0, visible: false, img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&q=80" },
];

const SWATCHES = ["#FFC69A", "#E8D6FF", "#C8E0C0", "#F4C8C8", "#C8DCE8", "#F4E8C8"];

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

export default function CategoriesPage() {
  const [selectedSlug, setSelectedSlug] = useState("portes");
  const [swatch, setSwatch] = useState(0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Catégories</h1>
          <div className="page-subtitle">
            10 catégories · 32 produits au total · 7 visibles dans l&apos;app
          </div>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} strokeWidth={2} />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div style={{ background: "rgba(0,36,68,0.04)", border: "1px solid var(--outline-soft)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, fontSize: 13 }}>
        <span style={{ color: "var(--primary)" }}>
          <Folder size={18} strokeWidth={1.6} />
        </span>
        <span style={{ color: "var(--on-surface-variant)" }}>
          Glissez-déposez pour réorganiser. Les catégories vides ne s&apos;affichent pas dans l&apos;app.
        </span>
      </div>

      <div className="row-8-4">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATS.map((c) => {
            const isSelected = c.slug === selectedSlug;
            return (
              <div
                key={c.slug}
                className="card"
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  border: isSelected ? "2px solid var(--primary)" : undefined,
                }}
                onClick={() => setSelectedSlug(c.slug)}
              >
                <span style={{ color: "var(--outline-variant)", cursor: "grab" }}>
                  <DragHandle />
                </span>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: `url(${c.img}) center/cover`,
                    flexShrink: 0,
                    opacity: c.visible ? 1 : 0.4,
                    filter: c.visible ? undefined : "grayscale(0.6)",
                  }}
                ></div>
                <div style={{ flex: 1, opacity: c.visible ? 1 : 0.55 }}>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--outline)", marginTop: 3, fontFamily: "var(--mono)" }}>
                    /{c.slug} · {c.count} produit{c.count > 1 ? "s" : ""}
                  </div>
                </div>
                {c.visible ? (
                  <span className="pill pill-success-soft">Visible</span>
                ) : (
                  <span className="pill pill-outline">Masquée</span>
                )}
                <div className="hstack" style={{ gap: 4, marginLeft: 8 }}>
                  <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={(e) => e.stopPropagation()}>
                    <Edit3 size={14} strokeWidth={1.7} />
                  </button>
                  <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={(e) => e.stopPropagation()}>
                    <Eye size={14} strokeWidth={1.7} />
                  </button>
                  <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--error)" }} onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={14} strokeWidth={1.7} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card card-padded" style={{ position: "sticky", top: 88, alignSelf: "flex-start" }}>
          <div className="card-title" style={{ marginBottom: 6 }}>Modifier la catégorie</div>
          <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>Portes · 10 produits</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="field">
              <label className="field-label">Nom</label>
              <input className="input" defaultValue="Portes" />
            </div>
            <div className="field">
              <label className="field-label">Slug</label>
              <input className="input mono" defaultValue="portes" />
            </div>
            <div className="field">
              <label className="field-label">Description</label>
              <textarea
                className="textarea"
                style={{ minHeight: 60 }}
                defaultValue="Portes d'entrée, portes intérieures, pivotantes et coulissantes — sur mesure."
              />
            </div>

            <div>
              <label className="field-label" style={{ display: "block", marginBottom: 8 }}>Image de couverture</label>
              <div style={{ height: 120, borderRadius: 10, background: "url('https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=600&q=80') center/cover", position: "relative" }}>
                <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 6 }}>
                  <button className="btn btn-outline btn-sm" style={{ background: "rgba(255,255,255,0.95)" }}>
                    Changer
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label" style={{ display: "block", marginBottom: 8 }}>Couleur d&apos;accent</label>
              <div className="hstack" style={{ gap: 8 }}>
                {SWATCHES.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setSwatch(i)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: s,
                      cursor: "pointer",
                      boxShadow: i === swatch ? "0 0 0 2px var(--primary)" : undefined,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Catégorie parente</label>
              <div className="select-wrap" style={{ width: "100%" }}>
                <select style={{ width: "100%" }} defaultValue="none">
                  <option value="none">—</option>
                  <option>Aménagement</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 14, background: "var(--surface-container-low)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Visible dans l&apos;app</span>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Mise en avant accueil</span>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span>Réservée aux pros (B2B)</span>
                <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Délai de livraison spécifique</label>
              <input className="input" placeholder="Hérité de la zone" />
            </div>

            <div style={{ display: "flex", gap: 8, paddingTop: 14, borderTop: "1px solid var(--outline-soft)" }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>Annuler</button>
              <button className="btn btn-primary" style={{ flex: 2 }}>Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

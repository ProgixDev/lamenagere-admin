"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Check,
} from "lucide-react";

type ProductRow = {
  name: string;
  sku: string;
  cat: string;
  type: "STANDARD" | "CONFIGURABLE" | "SUR DEVIS";
  price: string;
  stock: string;
  stockClass: string;
  status: "Publié" | "Brouillon";
  img: string;
};

const PRODUCTS: ProductRow[] = [
  { name: "Porte Géométrique Noyer", sku: "LMP-P-001", cat: "Portes", type: "CONFIGURABLE", price: "À partir de 3 850 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=200&q=80" },
  { name: "Porte Pivotante Luxe 3D", sku: "LMP-P-002", cat: "Portes", type: "SUR DEVIS", price: "Sur devis", stock: "—", stockClass: "pill-outline", status: "Publié", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
  { name: "Cuisine Îlot Chêne Clair", sku: "LMP-C-003", cat: "Cuisines", type: "SUR DEVIS", price: "Sur devis", stock: "—", stockClass: "pill-outline", status: "Publié", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80" },
  { name: "Cuisine Noire & Or", sku: "LMP-C-004", cat: "Cuisines", type: "SUR DEVIS", price: "Sur devis", stock: "—", stockClass: "pill-outline", status: "Publié", img: "https://images.unsplash.com/photo-1556909114-44e3e9399a2a?w=200&q=80" },
  { name: "Canapé Modulable Bordeaux", sku: "LMP-S-005", cat: "Canapés", type: "STANDARD", price: "2 890 €", stock: "Stock faible", stockClass: "pill-warning-soft", status: "Publié", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80" },
  { name: "Salon Bicolore Crème", sku: "LMP-S-006", cat: "Canapés", type: "STANDARD", price: "3 450 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&q=80" },
  { name: "Chambre Royale Blanche & Or", sku: "LMP-B-007", cat: "Chambres", type: "STANDARD", price: "5 890 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=80" },
  { name: "Dressing Walk-In Bois", sku: "LMP-B-008", cat: "Chambres", type: "SUR DEVIS", price: "Sur devis", stock: "—", stockClass: "pill-outline", status: "Brouillon", img: "https://images.unsplash.com/photo-1558997519-3897dc05ed95?w=200&q=80" },
  { name: "Buffet Miroir Triptyque", sku: "LMP-D-009", cat: "Décoration", type: "STANDARD", price: "1 890 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80" },
  { name: "Baie Vitrée Coulissante", sku: "LMP-V-010", cat: "Baies Vitrées", type: "CONFIGURABLE", price: "À partir de 2 100 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80" },
  { name: "Table Marbre Travertin", sku: "LMP-T-011", cat: "Tables à Manger", type: "STANDARD", price: "3 290 €", stock: "En stock", stockClass: "pill-success-soft", status: "Publié", img: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=200&q=80" },
  { name: "Fauteuil Velours Émeraude", sku: "LMP-S-012", cat: "Canapés", type: "STANDARD", price: "1 250 €", stock: "Rupture", stockClass: "pill-error-soft", status: "Publié", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&q=80" },
];

function typePill(t: string) {
  if (t === "STANDARD") return "pill-navy-soft";
  if (t === "CONFIGURABLE") return "pill-bronze-soft";
  return "pill-outline";
}

const STATUS_TABS = [
  { key: "all", label: "Tous", count: 32 },
  { key: "published", label: "Publiés", count: 28 },
  { key: "draft", label: "Brouillons", count: 4 },
  { key: "archived", label: "Archivés", count: 0 },
];

const CAT_FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "portes", label: "Portes", count: 10 },
  { key: "cuisines", label: "Cuisines", count: 8 },
  { key: "canapes", label: "Canapés", count: 4 },
  { key: "chambres", label: "Chambres", count: 5 },
  { key: "baies", label: "Baies vitrées", count: 2 },
  { key: "deco", label: "Décoration", count: 1 },
  { key: "tables", label: "Tables", count: 2 },
];

const SViewListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const SViewGridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

export default function ProductsPage() {
  const [statusTab, setStatusTab] = useState("all");
  const [catTab, setCatTab] = useState("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<Set<string>>(new Set(["LMP-P-001"]));

  function toggle(sku: string) {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(sku)) s.delete(sku);
      else s.add(sku);
      return s;
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Produits</h1>
          <div className="page-subtitle">
            32 produits · 28 publiés · 4 brouillons · Dernière mise à jour il y a 3 min
          </div>
        </div>
        <div className="hstack">
          <button className="btn btn-outline btn-sm">
            <Download size={14} strokeWidth={1.8} />
            <span>Importer CSV</span>
          </button>
          <Link href="/products/new" className="btn btn-primary">
            <Plus size={14} strokeWidth={2} />
            <span>Ajouter un produit</span>
          </Link>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "0 0 280px" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input className="input-boxed" style={{ paddingLeft: 38, width: "100%" }} placeholder="Rechercher un produit, SKU..." />
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="chips">
              {STATUS_TABS.map((t) => (
                <button key={t.key} className={`chip${statusTab === t.key ? " active" : ""}`} onClick={() => setStatusTab(t.key)}>
                  {t.label} <span className="count">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hstack">
            <div className="select-wrap">
              <select defaultValue="recent">
                <option value="recent">Plus récents</option>
                <option value="old">Plus anciens</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="low-stock">Stock faible</option>
              </select>
            </div>
            <div className="seg">
              <button className={`seg-btn${view === "list" ? " active" : ""}`} title="Liste" onClick={() => setView("list")}>
                <SViewListIcon />
              </button>
              <button className={`seg-btn${view === "grid" ? " active" : ""}`} title="Grille" onClick={() => setView("grid")}>
                <SViewGridIcon />
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--outline-soft)" }}>
          <div className="chips">
            <span className="eyebrow" style={{ marginRight: 8 }}>Catégorie</span>
            {CAT_FILTERS.map((c) => (
              <button key={c.key} className={`chip${catTab === c.key ? " active" : ""}`} onClick={() => setCatTab(c.key)}>
                {c.label}
                {c.count !== undefined && <span className="count">{c.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 32 }}><span className="checkbox"></span></th>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => {
                const checked = selected.has(p.sku);
                return (
                  <tr key={p.sku} onClick={() => { window.location.href = `/products/${p.sku.toLowerCase()}`; }}>
                    <td onClick={(e) => { e.stopPropagation(); toggle(p.sku); }}>
                      <span className={`checkbox${checked ? " checked" : ""}`}>
                        {checked && <Check size={10} strokeWidth={3} />}
                      </span>
                    </td>
                    <td>
                      <div className="hstack" style={{ gap: 14 }}>
                        <div className="thumb" style={{ backgroundImage: `url(${p.img})` }}></div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--outline)", marginTop: 3 }}>SKU · {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12.5 }}>{p.cat}</span></td>
                    <td><span className={`pill ${typePill(p.type)}`}>{p.type}</span></td>
                    <td style={{ textAlign: "right" }} className="num">{p.price}</td>
                    <td><span className={`pill ${p.stockClass}`}>{p.stock}</span></td>
                    <td>
                      {p.status === "Publié" ? (
                        <span className="pill pill-success-soft">Publié</span>
                      ) : (
                        <span className="pill pill-outline">Brouillon</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                      <button className="icon-btn" style={{ width: 28, height: 28 }}>
                        <MoreHorizontal size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderTop: "1px solid var(--outline-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--outline)" }}>1 - 12 sur 32 produits</div>
          <div className="hstack">
            <button className="chip" disabled style={{ opacity: 0.5 }}>‹</button>
            <button className="chip active">1</button>
            <button className="chip">2</button>
            <button className="chip">3</button>
            <button className="chip">›</button>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 18, boxShadow: "var(--shadow-pop)", zIndex: 100 }}>
          <div className="hstack">
            <span className="pill pill-navy" style={{ fontFamily: "var(--display)", fontSize: 11 }}>{selected.size}</span>
            <span style={{ fontWeight: 500, fontSize: 13 }}>
              {selected.size > 1 ? "produits sélectionnés" : "produit sélectionné"}
            </span>
          </div>
          <div style={{ height: 24, width: 1, background: "var(--outline-soft)" }}></div>
          <button className="btn btn-outline btn-sm">Publier</button>
          <button className="btn btn-outline btn-sm">Mettre en brouillon</button>
          <button className="btn btn-danger btn-sm">Supprimer</button>
        </div>
      )}
    </div>
  );
}

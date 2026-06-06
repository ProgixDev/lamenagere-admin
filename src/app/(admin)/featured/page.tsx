"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { adminApi } from "@/lib/api";

interface FeaturedProduct {
  id: string;
  name: string;
  category: { name: string };
  images: string[];
}
interface Slide {
  id: string;
  kind: "image" | "video";
  title: string;
  subtitle?: string;
  mediaUrl: string;
  isActive: boolean;
}
interface Banner {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
}
interface ProductOption {
  id: string;
  name: string;
}

export default function FeaturedPage() {
  const [tab, setTab] = useState<"products" | "carousel" | "banners">("products");
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [allProducts, setAllProducts] = useState<ProductOption[]>([]);
  const [addId, setAddId] = useState("");

  async function load() {
    const [f, c, b, p] = await Promise.all([
      adminApi.featured.products() as Promise<FeaturedProduct[]>,
      adminApi.featured.carousel() as Promise<Slide[]>,
      adminApi.featured.banners() as Promise<Banner[]>,
      adminApi.products.list("?page=1&limit=100") as Promise<{ items: ProductOption[] }>,
    ]);
    setFeatured(f ?? []);
    setSlides(c ?? []);
    setBanners(b ?? []);
    setAllProducts(p?.items ?? []);
  }

  useEffect(() => {
    load().catch((e: { message?: string }) => toast.error(e?.message ?? "Chargement impossible"));
  }, []);

  async function addProduct() {
    if (!addId) return;
    try {
      await adminApi.featured.addProduct(addId);
      setAddId("");
      await load();
      toast.success("Produit ajouté");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Ajout impossible");
    }
  }
  async function removeProduct(id: string) {
    try {
      await adminApi.featured.removeProduct(id);
      await load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Retrait impossible");
    }
  }
  async function toggleSlide(s: Slide) {
    setSlides((xs) => xs.map((x) => (x.id === s.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      await adminApi.featured.updateSlide(s.id, {
        kind: s.kind, title: s.title, subtitle: s.subtitle, mediaUrl: s.mediaUrl, isActive: !s.isActive,
      });
    } catch {
      load();
    }
  }
  async function toggleBanner(b: Banner) {
    setBanners((xs) => xs.map((x) => (x.id === b.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      await adminApi.featured.updateBanner(b.id, {
        badge: b.badge, title: b.title, subtitle: b.subtitle, isActive: !b.isActive,
      });
    } catch {
      load();
    }
  }

  const featuredIds = new Set(featured.map((f) => f.id));
  const addable = allProducts.filter((p) => !featuredIds.has(p.id));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mise en avant</h1>
          <div className="page-subtitle">Contrôlez ce qui apparaît en premier sur l&apos;application mobile</div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        <div className={`tab${tab === "products" ? " active" : ""}`} onClick={() => setTab("products")}>
          Produits vedette <span className="tcount">{featured.length}</span>
        </div>
        <div className={`tab${tab === "carousel" ? " active" : ""}`} onClick={() => setTab("carousel")}>
          Carrousel d&apos;accueil <span className="tcount">{slides.length}</span>
        </div>
        <div className={`tab${tab === "banners" ? " active" : ""}`} onClick={() => setTab("banners")}>
          Bannières promo <span className="tcount">{banners.length}</span>
        </div>
      </div>

      <div className="stack">
        {tab === "products" && (
          <div className="card card-padded">
            <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 18, gap: 10, flexWrap: "wrap" }}>
              <div className="card-title">Sélection actuelle</div>
              <div className="hstack" style={{ gap: 8 }}>
                <div className="select-wrap">
                  <select value={addId} onChange={(e) => setAddId(e.target.value)}>
                    <option value="">Choisir un produit…</option>
                    {addable.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button className="btn btn-outline btn-sm" onClick={addProduct} disabled={!addId}>
                  <Plus size={14} strokeWidth={2} /> Ajouter
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {featured.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, fontSize: 14 }}>#{i + 1}</div>
                  <div className="thumb" style={{ backgroundImage: `url(${p.images?.[0] ?? ""})` }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{p.category?.name}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeProduct(p.id)}>Retirer</button>
                </div>
              ))}
              {featured.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucun produit vedette.</div>}
            </div>
          </div>
        )}

        {tab === "carousel" && (
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Carrousel d&apos;accueil</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {slides.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--outline-soft)", borderRadius: 12 }}>
                  <div style={{ width: 160, height: 96, borderRadius: 10, background: s.mediaUrl ? `url(${s.mediaUrl}) center/cover` : "var(--surface-container-low)" }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>{s.title}</div>
                    {s.subtitle && <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>{s.subtitle}</div>}
                    <div className="hstack" style={{ marginTop: 6, gap: 6 }}>
                      <span className={`pill ${s.kind === "video" ? "pill-bronze-soft" : "pill-navy-soft"}`}>{s.kind.toUpperCase()}</span>
                      {s.isActive && <span className="pill pill-success-soft">Active</span>}
                    </div>
                  </div>
                  <label className="switch"><input type="checkbox" checked={s.isActive} onChange={() => toggleSlide(s)} /><span className="slider"></span></label>
                  <button className="btn btn-danger btn-sm" onClick={async () => { await adminApi.featured.deleteSlide(s.id); load(); }}>Suppr.</button>
                </div>
              ))}
              {slides.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucun slide.</div>}
            </div>
          </div>
        )}

        {tab === "banners" && (
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Bannières promo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {banners.map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, background: "linear-gradient(135deg, var(--primary), var(--primary-container))", color: "#fff" }}>
                  {b.badge && <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 12px", borderRadius: 999, fontWeight: 700, fontSize: 11 }}>{b.badge}</span>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>{b.title}</div>
                    {b.subtitle && <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{b.subtitle}</div>}
                  </div>
                  <label className="switch"><input type="checkbox" checked={b.isActive} onChange={() => toggleBanner(b)} /><span className="slider"></span></label>
                  <button className="btn btn-danger btn-sm" onClick={async () => { await adminApi.featured.deleteBanner(b.id); load(); }}>Suppr.</button>
                </div>
              ))}
              {banners.length === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucune bannière.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

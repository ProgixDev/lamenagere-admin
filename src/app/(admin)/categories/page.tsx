"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Folder, Trash2 } from "lucide-react";
import { adminApi, api } from "@/lib/api";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  description?: string;
  productCount?: number;
  accentColor?: string;
  parentId?: string;
  sortOrder: number;
  isVisible: boolean;
  isFeaturedHome: boolean;
  b2bOnly: boolean;
  deliveryOverride?: string;
}

interface Form {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  isVisible: boolean;
  isFeaturedHome: boolean;
  b2bOnly: boolean;
  deliveryOverride: string;
}

const SWATCHES = ["#FFC69A", "#E8D6FF", "#C8E0C0", "#F4C8C8", "#C8DCE8", "#F4E8C8"];

function toForm(c: AdminCategory): Form {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    imageUrl: c.image ?? "",
    accentColor: c.accentColor ?? SWATCHES[0],
    isVisible: c.isVisible,
    isFeaturedHome: c.isFeaturedHome,
    b2bOnly: c.b2bOnly,
    deliveryOverride: c.deliveryOverride ?? "",
  };
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load(selectId?: string) {
    const list = (await adminApi.categories.list()) as AdminCategory[];
    setCats(list ?? []);
    const pick = selectId ?? selectedId ?? list?.[0]?.id ?? null;
    setSelectedId(pick);
    const found = (list ?? []).find((c) => c.id === pick);
    if (found) setForm(toForm(found));
  }

  useEffect(() => {
    load().catch((e: { message?: string }) =>
      toast.error(e?.message ?? "Chargement impossible"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(c: AdminCategory) {
    setSelectedId(c.id);
    setForm(toForm(c));
  }

  function patch(p: Partial<Form>) {
    setForm((f) => (f ? { ...f, ...p } : f));
  }

  const visibleCount = cats.filter((c) => c.isVisible).length;
  const totalProducts = cats.reduce((n, c) => n + (c.productCount ?? 0), 0);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        imageUrl: form.imageUrl || undefined,
        accentColor: form.accentColor,
        isVisible: form.isVisible,
        isFeaturedHome: form.isFeaturedHome,
        b2bOnly: form.b2bOnly,
        deliveryOverride: form.deliveryOverride || undefined,
      };
      if (selectedId) await adminApi.categories.update(selectedId, payload);
      else await adminApi.categories.create(payload);
      toast.success("Catégorie enregistrée");
      await load(selectedId ?? undefined);
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function addCategory() {
    try {
      const created = (await adminApi.categories.create({
        name: "Nouvelle catégorie",
        isVisible: false,
      })) as AdminCategory;
      await load(created.id);
      toast.success("Catégorie créée");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Création impossible");
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await adminApi.categories.remove(id);
      setSelectedId(null);
      await load();
      toast.success("Catégorie supprimée");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Suppression impossible");
    }
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await api.upload(file, "categories");
      patch({ imageUrl: url });
      toast.success("Image téléversée");
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Téléversement échoué");
    }
  }

  const selected = cats.find((c) => c.id === selectedId);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Catégories</h1>
          <div className="page-subtitle">
            {cats.length} catégories · {totalProducts} produits · {visibleCount} visibles
          </div>
        </div>
        <button className="btn btn-primary" onClick={addCategory}>
          <Plus size={14} strokeWidth={2} />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div style={{ background: "rgba(0,36,68,0.04)", border: "1px solid var(--outline-soft)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, fontSize: 13 }}>
        <span style={{ color: "var(--primary)" }}><Folder size={18} strokeWidth={1.6} /></span>
        <span style={{ color: "var(--on-surface-variant)" }}>
          Sélectionnez une catégorie pour la modifier. Les catégories masquées ne s&apos;affichent pas dans l&apos;app.
        </span>
      </div>

      <div className="row-8-4">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cats.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <div
                key={c.id}
                className="card"
                style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: isSelected ? "2px solid var(--primary)" : undefined }}
                onClick={() => select(c)}
              >
                <div style={{ width: 56, height: 56, borderRadius: 10, background: c.image ? `url(${c.image}) center/cover` : "var(--surface-container-low)", flexShrink: 0, opacity: c.isVisible ? 1 : 0.4 }}></div>
                <div style={{ flex: 1, opacity: c.isVisible ? 1 : 0.55 }}>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--outline)", marginTop: 3, fontFamily: "var(--mono)" }}>
                    /{c.slug} · {c.productCount ?? 0} produit{(c.productCount ?? 0) > 1 ? "s" : ""}
                  </div>
                </div>
                {c.isVisible ? <span className="pill pill-success-soft">Visible</span> : <span className="pill pill-outline">Masquée</span>}
                <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--error)" }} onClick={(e) => { e.stopPropagation(); remove(c.id); }}>
                  <Trash2 size={14} strokeWidth={1.7} />
                </button>
              </div>
            );
          })}
          {cats.length === 0 && (
            <div style={{ color: "var(--outline)", fontSize: 13, padding: 24 }}>Aucune catégorie.</div>
          )}
        </div>

        {form && (
          <div className="card card-padded" style={{ position: "sticky", top: 88, alignSelf: "flex-start" }}>
            <div className="card-title" style={{ marginBottom: 6 }}>
              {selectedId ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 18 }}>
              {selected ? `${selected.name} · ${selected.productCount ?? 0} produits` : "—"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="field">
                <label className="field-label">Nom</label>
                <input className="input" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Slug</label>
                <input className="input mono" value={form.slug} onChange={(e) => patch({ slug: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="textarea" style={{ minHeight: 60 }} value={form.description} onChange={(e) => patch({ description: e.target.value })} />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: 8 }}>Image de couverture</label>
                <div style={{ height: 120, borderRadius: 10, background: form.imageUrl ? `url(${form.imageUrl}) center/cover` : "var(--surface-container-low)", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 8, right: 8 }}>
                    <button className="btn btn-outline btn-sm" style={{ background: "rgba(255,255,255,0.95)" }} onClick={() => fileRef.current?.click()}>
                      Changer
                    </button>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: 8 }}>Couleur d&apos;accent</label>
                <div className="hstack" style={{ gap: 8 }}>
                  {SWATCHES.map((s) => (
                    <div key={s} onClick={() => patch({ accentColor: s })} style={{ width: 32, height: 32, borderRadius: 8, background: s, cursor: "pointer", boxShadow: form.accentColor === s ? "0 0 0 2px var(--primary)" : undefined }}></div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 14, background: "var(--surface-container-low)", borderRadius: 10 }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>Visible dans l&apos;app</span>
                  <span className="switch"><input type="checkbox" checked={form.isVisible} onChange={(e) => patch({ isVisible: e.target.checked })} /><span className="slider"></span></span>
                </label>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>Mise en avant accueil</span>
                  <span className="switch"><input type="checkbox" checked={form.isFeaturedHome} onChange={(e) => patch({ isFeaturedHome: e.target.checked })} /><span className="slider"></span></span>
                </label>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>Réservée aux pros (B2B)</span>
                  <span className="switch"><input type="checkbox" checked={form.b2bOnly} onChange={(e) => patch({ b2bOnly: e.target.checked })} /><span className="slider"></span></span>
                </label>
              </div>

              <div className="field">
                <label className="field-label">Délai de livraison spécifique</label>
                <input className="input" placeholder="Hérité de la zone" value={form.deliveryOverride} onChange={(e) => patch({ deliveryOverride: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 8, paddingTop: 14, borderTop: "1px solid var(--outline-soft)" }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => selected && setForm(toForm(selected))}>Annuler</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={save} disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

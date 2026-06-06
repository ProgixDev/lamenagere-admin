"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { adminApi, api } from "@/lib/api";

type Mode = "edit" | "new";
type UiType = "standard" | "configurable" | "quote";
type Status = "brouillon" | "publie" | "archive";

interface Category {
  id: string;
  name: string;
}

interface Form {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  productType: UiType;
  status: Status;
  price: string;
  purchaseCost: string;
  widthCoef: string;
  heightCoef: string;
  refWidth: string;
  refHeight: string;
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  deliveryMetropole: string;
  deliveryOutremer: string;
  weightKg: string;
  volumeM3: string;
  freeShipping: boolean;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
}

const EMPTY: Form = {
  name: "", slug: "", sku: "", description: "", shortDescription: "",
  categoryId: "", productType: "standard", status: "brouillon",
  price: "", purchaseCost: "", widthCoef: "", heightCoef: "",
  refWidth: "", refHeight: "", minWidth: "", minHeight: "", maxWidth: "", maxHeight: "",
  deliveryMetropole: "2-3 semaines", deliveryOutremer: "8-12 semaines",
  weightKg: "", volumeM3: "", freeShipping: false,
  seoTitle: "", seoDescription: "", isFeatured: false,
};

const num = (s: string): number | undefined => {
  if (!s.trim()) return undefined;
  const n = Number(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};
const cents = (c: number | null): string => (c == null ? "" : String(c / 100));

export function ProductEditForm({ mode = "edit" }: { mode?: Mode }) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [form, setForm] = useState<Form>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi.categories
      .list()
      .then((r) => setCategories((r as Category[]) ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    adminApi.products
      .get(id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((p: any) => {
        const ui: UiType = p.product_type === "quote_only" ? "quote" : p.product_type;
        setForm({
          name: p.name ?? "",
          slug: p.slug ?? "",
          sku: p.sku ?? "",
          description: p.description ?? "",
          shortDescription: p.short_description ?? "",
          categoryId: p.category_id ?? "",
          productType: ui,
          status: p.status ?? "brouillon",
          price: cents(p.base_price_cents),
          purchaseCost: cents(p.purchase_cost_cents),
          widthCoef: cents(p.width_coef_cents),
          heightCoef: cents(p.height_coef_cents),
          refWidth: p.ref_width != null ? String(p.ref_width) : "",
          refHeight: p.ref_height != null ? String(p.ref_height) : "",
          minWidth: p.min_width != null ? String(p.min_width) : "",
          minHeight: p.min_height != null ? String(p.min_height) : "",
          maxWidth: p.max_width != null ? String(p.max_width) : "",
          maxHeight: p.max_height != null ? String(p.max_height) : "",
          deliveryMetropole: p.delivery_metropole ?? "",
          deliveryOutremer: p.delivery_outremer ?? "",
          weightKg: p.weight_kg != null ? String(p.weight_kg) : "",
          volumeM3: p.volume_m3 != null ? String(p.volume_m3) : "",
          freeShipping: !!p.free_shipping,
          seoTitle: p.seo_title ?? "",
          seoDescription: p.seo_description ?? "",
          isFeatured: !!p.is_featured,
        });
        const media = (p.media ?? []) as { url: string; type: string }[];
        setImages(media.filter((m) => m.type === "image").map((m) => m.url));
        setVideoUrl(media.find((m) => m.type === "video")?.url ?? "");
      })
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Produit introuvable"))
      .finally(() => setLoading(false));
  }, [isEdit, id]);

  function patch(p: Partial<Form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function onPickImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      try {
        const { url } = await api.upload(file, "products");
        setImages((imgs) => [...imgs, url]);
      } catch (err) {
        toast.error((err as { message?: string })?.message ?? "Téléversement échoué");
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function buildPayload(status: Status) {
    return {
      name: form.name,
      slug: form.slug || undefined,
      sku: form.sku || undefined,
      description: form.description,
      shortDescription: form.shortDescription || undefined,
      categoryId: form.categoryId,
      productType: form.productType === "quote" ? "quote_only" : form.productType,
      priceMode:
        form.productType === "standard" ? "fixed" : form.productType === "configurable" ? "calculated" : "quote",
      status,
      price: num(form.price),
      purchaseCost: num(form.purchaseCost),
      widthCoef: num(form.widthCoef),
      heightCoef: num(form.heightCoef),
      refWidth: num(form.refWidth),
      refHeight: num(form.refHeight),
      minWidth: num(form.minWidth),
      minHeight: num(form.minHeight),
      maxWidth: num(form.maxWidth),
      maxHeight: num(form.maxHeight),
      customizable: form.productType === "configurable",
      deliveryMetropole: form.deliveryMetropole || undefined,
      deliveryOutremer: form.deliveryOutremer || undefined,
      weightKg: num(form.weightKg),
      volumeM3: num(form.volumeM3),
      freeShipping: form.freeShipping,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      isFeatured: form.isFeatured,
      imageUrls: images,
      videoUrls: videoUrl ? [videoUrl] : [],
    };
  }

  async function save(status: Status) {
    if (!form.name.trim() || !form.categoryId) {
      toast.error("Nom et catégorie requis");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(status);
      if (isEdit && id) {
        await adminApi.products.update(id, payload);
        toast.success("Produit enregistré");
      } else {
        const created = (await adminApi.products.create(payload)) as { id: string };
        toast.success("Produit créé");
        router.push(`/products/${created.id}`);
      }
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id || !confirm("Supprimer ce produit ?")) return;
    try {
      await adminApi.products.remove(id);
      toast.success("Produit supprimé");
      router.push("/products");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Suppression impossible");
    }
  }

  if (loading) {
    return <div className="page"><div className="page-subtitle">Chargement…</div></div>;
  }

  return (
    <form className="page" onSubmit={(e) => { e.preventDefault(); save(form.status); }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>
          <div className="page-subtitle">{isEdit ? `${form.name} · ${form.sku}` : "Créer une nouvelle fiche"}</div>
        </div>
        <div className="hstack">
          <Link href="/products" className="btn btn-outline btn-sm">Annuler</Link>
          <button type="button" className="btn btn-outline btn-sm" disabled={saving} onClick={() => save("brouillon")}>
            Enregistrer en brouillon
          </button>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => save("publie")}>
            {saving ? "…" : "Publier"}
          </button>
        </div>
      </div>

      <div className="row-8-4">
        <div className="stack">
          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 20 }}>Informations générales</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="field">
                <label className="field-label">Nom du produit</label>
                <input className="input" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field">
                  <label className="field-label">Slug</label>
                  <input className="input mono" value={form.slug} placeholder="auto depuis le nom" onChange={(e) => patch({ slug: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field-label">Catégorie</label>
                  <div className="select-wrap" style={{ width: "100%" }}>
                    <select style={{ width: "100%" }} value={form.categoryId} onChange={(e) => patch({ categoryId: e.target.value })}>
                      <option value="">— Choisir —</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Type de produit</label>
                <div className="seg" style={{ marginTop: 6 }}>
                  {(["standard", "configurable", "quote"] as UiType[]).map((t) => (
                    <button key={t} type="button" className={`seg-btn${form.productType === t ? " active" : ""}`} onClick={() => patch({ productType: t })}>
                      {t === "standard" ? "Standard" : t === "configurable" ? "Configurable" : "Sur devis"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="textarea" value={form.description} onChange={(e) => patch({ description: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Description courte</label>
                <input className="input" value={form.shortDescription} onChange={(e) => patch({ shortDescription: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 8 }}>Médias</div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 16 }}>JPG, PNG · la première image est la principale</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {images.map((url, i) => (
                <div key={url} style={{ aspectRatio: "1", borderRadius: 10, background: `url(${url}) center/cover`, position: "relative" }}>
                  {i === 0 && <span className="pill pill-bronze" style={{ position: "absolute", bottom: 8, left: 8, fontSize: 9 }}>Principale</span>}
                  <button type="button" onClick={() => setImages((im) => im.filter((u) => u !== url))} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div onClick={() => fileRef.current?.click()} style={{ aspectRatio: "1", borderRadius: 10, background: "var(--surface-container-low)", border: "1.5px dashed var(--outline-variant)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--outline)", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <div style={{ fontSize: 10, textAlign: "center", marginTop: 6 }}>Ajouter</div>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPickImages} />
            <div className="field" style={{ marginTop: 18 }}>
              <label className="field-label">Lien vidéo (optionnel)</label>
              <input className="input" placeholder="YouTube ou MP4..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </div>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>
              Tarification · {form.productType === "standard" ? "Standard" : form.productType === "configurable" ? "Configurable" : "Sur devis"}
            </div>

            {form.productType === "standard" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field"><label className="field-label">Prix TTC (€)</label><input className="input" value={form.price} onChange={(e) => patch({ price: e.target.value })} /></div>
                <div className="field"><label className="field-label">Coût d&apos;achat (€)</label><input className="input" value={form.purchaseCost} onChange={(e) => patch({ purchaseCost: e.target.value })} /></div>
              </div>
            )}

            {form.productType === "configurable" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="field"><label className="field-label">Prix de base TTC (€)</label><input className="input" value={form.price} onChange={(e) => patch({ price: e.target.value })} /></div>
                  <div className="field"><label className="field-label">Coût d&apos;achat (€)</label><input className="input" value={form.purchaseCost} onChange={(e) => patch({ purchaseCost: e.target.value })} /></div>
                </div>
                <div style={{ marginTop: 20, padding: 16, background: "var(--surface-container-low)", borderRadius: 10 }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Calcul par dimension</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field"><label className="field-label">Coef. largeur (€/cm)</label><input className="input" value={form.widthCoef} onChange={(e) => patch({ widthCoef: e.target.value })} /></div>
                    <div className="field"><label className="field-label">Coef. hauteur (€/cm)</label><input className="input" value={form.heightCoef} onChange={(e) => patch({ heightCoef: e.target.value })} /></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
                    <div className="field"><label className="field-label">Réf. L×H (cm)</label>
                      <div className="hstack" style={{ gap: 6 }}>
                        <input className="input" placeholder="L" value={form.refWidth} onChange={(e) => patch({ refWidth: e.target.value })} />
                        <input className="input" placeholder="H" value={form.refHeight} onChange={(e) => patch({ refHeight: e.target.value })} />
                      </div>
                    </div>
                    <div className="field"><label className="field-label">Min L×H</label>
                      <div className="hstack" style={{ gap: 6 }}>
                        <input className="input" placeholder="L" value={form.minWidth} onChange={(e) => patch({ minWidth: e.target.value })} />
                        <input className="input" placeholder="H" value={form.minHeight} onChange={(e) => patch({ minHeight: e.target.value })} />
                      </div>
                    </div>
                    <div className="field"><label className="field-label">Max L×H</label>
                      <div className="hstack" style={{ gap: 6 }}>
                        <input className="input" placeholder="L" value={form.maxWidth} onChange={(e) => patch({ maxWidth: e.target.value })} />
                        <input className="input" placeholder="H" value={form.maxHeight} onChange={(e) => patch({ maxHeight: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {form.productType === "quote" && (
              <div style={{ padding: 16, background: "var(--surface-container-low)", borderRadius: 10, fontSize: 13, color: "var(--on-surface-variant)" }}>
                Ce produit est uniquement disponible sur devis. Le client demande un devis depuis la fiche produit.
              </div>
            )}
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>Livraison</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="field"><label className="field-label">Délai métropole</label><input className="input" value={form.deliveryMetropole} onChange={(e) => patch({ deliveryMetropole: e.target.value })} /></div>
              <div className="field"><label className="field-label">Délai outre-mer</label><input className="input" value={form.deliveryOutremer} onChange={(e) => patch({ deliveryOutremer: e.target.value })} /></div>
              <div className="field"><label className="field-label">Poids estimé (kg)</label><input className="input" value={form.weightKg} onChange={(e) => patch({ weightKg: e.target.value })} /></div>
              <div className="field"><label className="field-label">Encombrement (m³)</label><input className="input" value={form.volumeM3} onChange={(e) => patch({ volumeM3: e.target.value })} /></div>
            </div>
            <label style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
              <span className="switch"><input type="checkbox" checked={form.freeShipping} onChange={(e) => patch({ freeShipping: e.target.checked })} /><span className="slider"></span></span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Livraison gratuite</span>
            </label>
          </div>

          <div className="card card-padded">
            <div className="card-title" style={{ marginBottom: 18 }}>SEO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field"><label className="field-label">Titre SEO</label><input className="input" value={form.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value })} /></div>
              <div className="field"><label className="field-label">Description SEO</label><textarea className="textarea" style={{ minHeight: 60 }} value={form.seoDescription} onChange={(e) => patch({ seoDescription: e.target.value })} /></div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Statut</div>
            <div className="seg" style={{ width: "100%" }}>
              {(["brouillon", "publie", "archive"] as Status[]).map((s) => (
                <button key={s} type="button" className={`seg-btn${form.status === s ? " active" : ""}`} style={{ flex: 1 }} onClick={() => patch({ status: s })}>
                  {s === "brouillon" ? "Brouillon" : s === "publie" ? "Publié" : "Archivé"}
                </button>
              ))}
            </div>
            <label style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Mis en avant sur l&apos;accueil</span>
              <span className="switch"><input type="checkbox" checked={form.isFeatured} onChange={(e) => patch({ isFeatured: e.target.checked })} /><span className="slider"></span></span>
            </label>
          </div>

          <div className="card card-padded">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button type="button" className="btn btn-outline btn-sm">
                <ExternalLink size={14} strokeWidth={1.8} />
                <span>Voir sur la boutique</span>
              </button>
              {isEdit && <button type="button" className="btn btn-danger btn-sm" onClick={remove}>Supprimer</button>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

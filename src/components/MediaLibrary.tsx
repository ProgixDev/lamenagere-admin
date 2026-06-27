"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, api, type MediaItem } from "@/lib/api";

interface Props {
  open: boolean;
  folder?: string;
  onClose: () => void;
  onPick: (url: string) => void;
}

/**
 * Shared media library backed by the Supabase storage bucket. Browse images
 * already uploaded to a folder, upload new ones, or remove them — so admins
 * reuse the same asset instead of re-uploading it everywhere.
 */
export default function MediaLibrary({ open, folder = "products", onClose, onPick }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminApi.media
      .list(folder)
      .then(setItems)
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Chargement impossible"))
      .finally(() => setLoading(false));
  }, [open, folder]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, path } = await api.upload(file, folder);
      setItems((prev) => [{ path, url, name: file.name }, ...prev]);
      toast.success("Image téléversée");
      onPick(url);
      onClose();
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Téléversement échoué");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(path: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Supprimer définitivement cette image du stockage ?")) return;
    try {
      await adminApi.media.remove(path);
      setItems((prev) => prev.filter((i) => i.path !== path));
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Suppression impossible");
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" style={{ maxWidth: 720 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="card-title">Bibliothèque média</div>
            <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 4 }}>
              Réutilisez une image déjà téléversée ou ajoutez-en une nouvelle.
            </div>
          </div>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose} title="Fermer">
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: 16 }}>
            <button className="btn btn-outline btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> {uploading ? "Téléversement…" : "Téléverser une image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
          </div>

          {loading ? (
            <div style={{ color: "var(--outline)", fontSize: 13, padding: 20 }}>Chargement…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--outline)", fontSize: 13, padding: 20 }}>
              Aucune image dans ce dossier. Téléversez-en une.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {items.map((m) => (
                <div
                  key={m.path}
                  onClick={() => {
                    onPick(m.url);
                    onClose();
                  }}
                  title={m.name}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: 10,
                    background: `url(${m.url}) center/cover`,
                    border: "1px solid var(--outline-soft)",
                    cursor: "pointer",
                  }}
                >
                  <button
                    className="icon-btn"
                    onClick={(e) => remove(m.path, e)}
                    title="Supprimer"
                    style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, background: "rgba(255,255,255,0.92)", color: "var(--error)" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

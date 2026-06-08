"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import {
  AdminUser,
  AdminRole,
  ADMIN_ROLE_LABELS,
} from "@/lib/types";
import { useCurrentUser } from "@/lib/user-context";

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "editor", label: "Éditeur" },
  { value: "support", label: "Support" },
];

const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: "#7C3AED",
  admin: "#2563EB",
  manager: "#059669",
  editor: "#D97706",
  support: "#6B7280",
};

function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        background: ROLE_COLORS[role] + "18",
        color: ROLE_COLORS[role],
        border: `1px solid ${ROLE_COLORS[role]}30`,
      }}
    >
      {ADMIN_ROLE_LABELS[role] ?? role}
    </span>
  );
}

interface CreateForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: AdminRole;
}

const EMPTY_FORM: CreateForm = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  role: "manager",
};

export default function UsersPage() {
  const { user: me } = useCurrentUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<AdminRole>("manager");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.users.list() as AdminUser[];
      setUsers(data);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.users.create(form);
      toast.success("Utilisateur créé");
      setShowCreate(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateRole(id: string) {
    try {
      await adminApi.users.updateRole(id, editRole);
      toast.success("Rôle mis à jour");
      setEditingId(null);
      load();
    } catch {
      toast.error("Mise à jour impossible");
    }
  }

  async function handleRevoke(user: AdminUser) {
    if (!confirm(`Révoquer l'accès de ${user.email} ?`)) return;
    try {
      await adminApi.users.revoke(user.id);
      toast.success("Accès révoqué");
      load();
    } catch {
      toast.error("Révocation impossible");
    }
  }

  if (me?.role !== "super_admin") {
    return (
      <div className="page-content">
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          Accès réservé au super administrateur.
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Utilisateurs admin</h1>
          <p className="page-subtitle">
            Gérez les accès et rôles des membres de l&apos;équipe.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreate(true)}
          style={{ gap: 6 }}
        >
          <Plus size={14} strokeWidth={2} />
          Inviter un utilisateur
        </button>
      </div>

      {showCreate && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>
            <ShieldCheck size={15} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Nouvel utilisateur admin
          </h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div className="field">
                <label className="field-label">Prénom</label>
                <input
                  className="input"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Nom</label>
                <input
                  className="input"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Mot de passe temporaire</label>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <div className="field">
                <label className="field-label">Rôle</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? "Création…" : "Créer le compte"}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Dernière activité</th>
              <th>Créé le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                  Chargement…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                  Aucun utilisateur admin.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || u.email[0].toUpperCase();
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar sm">{initials}</div>
                        <span style={{ fontWeight: 500 }}>{name}</span>
                        {isMe && (
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>(vous)</span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{u.email}</td>
                    <td>
                      {editingId === u.id ? (
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <select
                            className="input"
                            style={{ padding: "2px 6px", fontSize: 12, height: 28 }}
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as AdminRole)}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: "2px 8px", fontSize: 12 }}
                            onClick={() => handleUpdateRole(u.id)}
                          >
                            OK
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: "2px 8px", fontSize: 12 }}
                            onClick={() => setEditingId(null)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <RoleBadge role={u.role} />
                      )}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {u.lastActivityAt
                        ? new Date(u.lastActivityAt).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      {!isMe && u.role !== "super_admin" && (
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button
                            className="icon-btn"
                            title="Modifier le rôle"
                            onClick={() => { setEditingId(u.id); setEditRole(u.role === "super_admin" ? "admin" : u.role); }}
                          >
                            <Pencil size={14} strokeWidth={1.8} />
                          </button>
                          <button
                            className="icon-btn"
                            title="Révoquer l'accès"
                            style={{ color: "var(--danger)" }}
                            onClick={() => handleRevoke(u)}
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

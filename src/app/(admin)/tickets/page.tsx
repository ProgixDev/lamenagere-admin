"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { adminApi } from "@/lib/api";

interface TMessage { id: string; sender: "customer" | "admin"; content: string; createdAt: string }
interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  categoryLabel: string;
  description: string;
  status: "ouvert" | "en_cours" | "resolu" | "ferme";
  statusLabel: string;
  priority: "basse" | "normale" | "haute" | "urgente";
  priorityLabel: string;
  createdAt: string;
  client?: string;
  clientInitials?: string;
  clientEmail?: string;
  b2b?: boolean;
  unread?: number;
  messages?: TMessage[];
}

const STATUS_PILL: Record<string, string> = {
  ouvert: "pill-warning", en_cours: "pill-navy", resolu: "pill-success", ferme: "pill-outline",
};
const PRIO_PILL: Record<string, string> = {
  urgente: "pill-error", haute: "pill-warning", normale: "pill-navy-soft", basse: "pill-outline",
};
const STATUSES = [
  { v: "ouvert", l: "Ouvert" }, { v: "en_cours", l: "En cours" },
  { v: "resolu", l: "Résolu" }, { v: "ferme", l: "Fermé" },
];
const PRIORITIES = [
  { v: "basse", l: "Basse" }, { v: "normale", l: "Normale" },
  { v: "haute", l: "Haute" }, { v: "urgente", l: "Urgente" },
];
const FILTERS = [
  { v: "", l: "Tous" }, { v: "ouvert", l: "Ouverts" },
  { v: "en_cours", l: "En cours" }, { v: "resolu", l: "Résolus" },
];

function rel(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `il y a ${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi.tickets
      .list(filter ? `?status=${filter}` : "")
      .then((r) => setTickets((r as Ticket[]) ?? []))
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Chargement impossible"))
      .finally(() => setLoading(false));
  }
  useEffect(load, [filter]);

  async function open(id: string) {
    try {
      const t = (await adminApi.tickets.detail(id)) as Ticket;
      setActive(t);
      setTickets((ts) => ts.map((x) => (x.id === id ? { ...x, unread: 0 } : x)));
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Ouverture impossible");
    }
  }

  async function setField(field: "status" | "priority", value: string) {
    if (!active) return;
    try {
      const t = (await adminApi.tickets.update(active.id, { [field]: value })) as Ticket;
      setActive(t);
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Mise à jour impossible");
    }
  }

  async function sendReply() {
    if (!active || !reply.trim()) return;
    try {
      const t = (await adminApi.tickets.reply(active.id, { content: reply.trim() })) as Ticket;
      setActive(t);
      setReply("");
      load();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Envoi impossible");
    }
  }

  const openCount = tickets.filter((t) => t.status === "ouvert").length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tickets SAV</h1>
          <div className="page-subtitle">
            {loading ? "Chargement…" : `${tickets.length} ticket(s) · ${openCount} ouvert(s)`}
          </div>
        </div>
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.v} className={`chip${filter === f.v ? " active" : ""}`} onClick={() => setFilter(f.v)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="row-1-1" style={{ alignItems: "flex-start" }}>
        {/* List */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => open(t.id)}
                style={{
                  textAlign: "left", background: active?.id === t.id ? "var(--surface-container-low)" : "none",
                  border: "none", borderBottom: "1px solid var(--outline-soft)", padding: "14px 18px",
                  cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
                }}
              >
                <div className={`avatar sm${t.b2b ? " bronze" : ""}`}>{t.clientInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="hstack" style={{ justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</span>
                    {(t.unread ?? 0) > 0 && <span style={{ background: "var(--secondary)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999 }}>{t.unread}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
                    <span className="mono">#{t.ticketNumber}</span> · {t.client} · {rel(t.createdAt)}
                  </div>
                  <div className="hstack" style={{ gap: 6, marginTop: 6 }}>
                    <span className={`pill ${STATUS_PILL[t.status]}`} style={{ fontSize: 9 }}>{t.statusLabel}</span>
                    <span className={`pill ${PRIO_PILL[t.priority]}`} style={{ fontSize: 9 }}>{t.priorityLabel}</span>
                    <span className="pill pill-outline" style={{ fontSize: 9 }}>{t.categoryLabel}</span>
                  </div>
                </div>
              </button>
            ))}
            {!loading && tickets.length === 0 && (
              <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>Aucun ticket.</div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="card card-padded" style={{ position: "sticky", top: 88 }}>
          {active ? (
            <>
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                <div className="card-title">{active.subject}</div>
                <span className="mono" style={{ fontSize: 11, color: "var(--outline)" }}>#{active.ticketNumber}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--outline)", marginBottom: 16 }}>
                {active.client} · {active.clientEmail} · {rel(active.createdAt)}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div className="field">
                  <label className="field-label">Statut</label>
                  <div className="select-wrap" style={{ width: "100%" }}>
                    <select style={{ width: "100%" }} value={active.status} onChange={(e) => setField("status", e.target.value)}>
                      {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Priorité</label>
                  <div className="select-wrap" style={{ width: "100%" }}>
                    <select style={{ width: "100%" }} value={active.priority} onChange={(e) => setField("priority", e.target.value)}>
                      {PRIORITIES.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ padding: 14, background: "var(--surface-container-low)", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--outline)", marginBottom: 6 }}>
                  {active.categoryLabel}
                </div>
                {active.description}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 300, overflowY: "auto", marginBottom: 14 }}>
                {(active.messages ?? []).map((m) =>
                  m.sender === "admin" ? (
                    <div key={m.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div className="bubble bubble-out">{m.content}<div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>{rel(m.createdAt)}</div></div>
                    </div>
                  ) : (
                    <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                      <div className={`avatar sm${active.b2b ? " bronze" : ""}`}>{active.clientInitials}</div>
                      <div className="bubble bubble-in">{m.content}<div style={{ fontSize: 10, color: "var(--outline)", marginTop: 4 }}>{rel(m.createdAt)}</div></div>
                    </div>
                  ),
                )}
              </div>

              <div className="hstack" style={{ gap: 10, alignItems: "flex-end" }}>
                <textarea
                  className="input-boxed" style={{ flex: 1, minHeight: 44, maxHeight: 120, resize: "none" }}
                  placeholder="Répondre au client…" value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <button className="btn btn-primary btn-sm" onClick={sendReply} disabled={!reply.trim()}>
                  <Send size={14} strokeWidth={1.7} /> Répondre
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--outline)", fontSize: 14 }}>
              Sélectionnez un ticket
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

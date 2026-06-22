"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Search, Send } from "lucide-react";
import { adminApi } from "@/lib/api";

interface Conversation {
  id: string;
  vendorName: string;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  b2b?: boolean;
  pinnedEntity?: { kind: "order" | "quote"; ref: string; label: string };
  product?: { id: string; name: string; image?: string; priceLabel: string };
}
interface Message {
  id: string;
  conversationId: string;
  sender: "admin" | "client";
  content: string;
  attachments?: string[];
  createdAt: string;
}

function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}
function timeShort(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.round(h / 24)} j`;
}

export default function MessagesPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  function loadConvs() {
    adminApi.conversations
      .list()
      .then((r) => setConvs((r as Conversation[]) ?? []))
      .catch((e: { message?: string }) => toast.error(e?.message ?? "Chargement impossible"));
  }
  useEffect(loadConvs, []);

  async function openConv(id: string) {
    setActiveId(id);
    try {
      const m = (await adminApi.conversations.messages(id)) as Message[];
      setMessages(m ?? []);
      await adminApi.conversations.markRead(id);
      setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Ouverture impossible");
    }
  }

  async function send() {
    if (!activeId || !draft.trim()) return;
    setSending(true);
    try {
      const msg = (await adminApi.conversations.reply(activeId, { content: draft.trim() })) as Message;
      setMessages((m) => [...m, msg]);
      setDraft("");
      loadConvs();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Envoi impossible");
    } finally {
      setSending(false);
    }
  }

  const active = convs.find((c) => c.id === activeId);
  const totalUnread = convs.reduce((n, c) => n + c.unread, 0);

  const q = query.trim().toLowerCase();
  const filteredConvs = q
    ? convs.filter((c) =>
        [c.vendorName, c.subject, c.lastMessage]
          .some((v) => v?.toLowerCase().includes(q)),
      )
    : convs;

  return (
    <div className="msg-app">
      <div className="list-pane">
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--outline-soft)" }}>
          <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>Messages</div>
            {totalUnread > 0 && <span className="pill pill-warning">{totalUnread} non lus</span>}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input className="input-boxed" style={{ paddingLeft: 36, width: "100%", height: 36 }} placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredConvs.map((c) => (
            <div key={c.id} className={`conv-row${c.id === activeId ? " active" : ""}`} onClick={() => openConv(c.id)} style={{ cursor: "pointer" }}>
              <div className={`avatar md${c.b2b ? " bronze" : ""}`}>{initials(c.vendorName)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hstack" style={{ justifyContent: "space-between", gap: 6 }}>
                  <div className="hstack-tight" style={{ gap: 6, minWidth: 0, flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.vendorName}</span>
                    {c.b2b && <span className="pill pill-bronze-soft" style={{ fontSize: 8, padding: "1px 5px" }}>PRO</span>}
                  </div>
                  <span style={{ fontSize: 10, color: "var(--outline)", whiteSpace: "nowrap" }}>{timeShort(c.lastMessageAt)}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{c.subject}</div>
                <div className="hstack" style={{ justifyContent: "space-between", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11.5, color: "var(--outline)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.lastMessage}</span>
                  {c.unread > 0 && <span style={{ background: "var(--secondary)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
          {filteredConvs.length === 0 && (
            <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>
              {convs.length === 0 ? "Aucune conversation." : "Aucun résultat."}
            </div>
          )}
        </div>
      </div>

      <div className="thread-pane">
        {active ? (
          <>
            <div style={{ height: 64, background: "var(--surface)", borderBottom: "1px solid var(--outline-variant)", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <div className={`avatar md${active.b2b ? " bronze" : ""}`}>{initials(active.vendorName)}</div>
              <div style={{ flex: 1 }}>
                <div className="hstack" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{active.vendorName}</span>
                  {active.b2b && <span className="pill pill-bronze-soft" style={{ fontSize: 9 }}>PRO</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{active.subject}</div>
              </div>
            </div>

            {active.pinnedEntity && (
              <div style={{ padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--outline-soft)" }}>
                <div style={{ borderLeft: "3px solid var(--primary)", padding: "10px 14px", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
                  <span className="mono" style={{ fontWeight: 600 }}>#{active.pinnedEntity.ref}</span> · {active.pinnedEntity.label}
                  <a href={`/${active.pinnedEntity.kind === "order" ? "orders" : "quotes"}/${active.pinnedEntity.ref}`} className="card-link" style={{ marginLeft: "auto" }}>Ouvrir →</a>
                </div>
              </div>
            )}

            {active.product && (
              <div style={{ padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--outline-soft)" }}>
                <a href={`/products/${active.product.id}`} className="card-link" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  {active.product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={active.product.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active.product.name}</div>
                    <div style={{ fontSize: 12, color: "var(--secondary)" }}>{active.product.priceLabel}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--primary)", flexShrink: 0 }}>Voir le produit →</span>
                </a>
              </div>
            )}

            <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m) =>
                m.sender === "client" ? (
                  <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div className={`avatar sm${active.b2b ? " bronze" : ""}`}>{initials(active.vendorName)}</div>
                    <div className="bubble bubble-in">
                      {m.content}
                      <div style={{ fontSize: 10, color: "var(--outline)", marginTop: 4 }}>{timeShort(m.createdAt)}</div>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="bubble bubble-out">
                      {m.content}
                      <div style={{ fontSize: 10, opacity: 0.75, marginTop: 4 }}>{timeShort(m.createdAt)}</div>
                    </div>
                  </div>
                ),
              )}
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--outline)", fontSize: 13, marginTop: 24 }}>
                  Aucun message dans cette conversation.
                </div>
              )}
            </div>

            <div style={{ background: "var(--surface)", borderTop: "1px solid var(--outline-variant)", padding: "16px 24px", flexShrink: 0 }}>
              <div className="hstack" style={{ gap: 10, alignItems: "flex-end" }}>
                <textarea
                  className="input-boxed"
                  style={{ flex: 1, minHeight: 42, maxHeight: 120, resize: "none" }}
                  placeholder="Écrire un message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                />
                <button className="btn btn-primary btn-sm" onClick={send} disabled={sending || !draft.trim()}>
                  <Send size={14} strokeWidth={1.7} />
                  <span>{sending ? "…" : "Envoyer"}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--outline)", fontSize: 14 }}>
            Sélectionnez une conversation
          </div>
        )}
      </div>

      <div className="ctx-pane" style={{ padding: 20 }}>
        {active && (
          <>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Client</div>
            <div className="hstack" style={{ gap: 12, marginBottom: 14 }}>
              <div className={`avatar lg${active.b2b ? " bronze" : ""}`}>{initials(active.vendorName)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{active.vendorName}</div>
                <div style={{ fontSize: 11, color: "var(--outline)" }}>{active.subject}</div>
              </div>
            </div>
            {active.b2b && <span className="pill pill-bronze">PRO</span>}
          </>
        )}
      </div>
    </div>
  );
}

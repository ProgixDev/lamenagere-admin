"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
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

export default function MessageThreadPage() {
  const params = useParams();
  const id = String(params.id);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [convs, m] = await Promise.all([
          adminApi.conversations.list() as Promise<Conversation[]>,
          adminApi.conversations.messages(id) as Promise<Message[]>,
        ]);
        if (cancelled) return;
        setConv((convs ?? []).find((c) => c.id === id) ?? null);
        setMessages(m ?? []);
        await adminApi.conversations.markRead(id);
      } catch (e) {
        if (!cancelled)
          toast.error((e as { message?: string })?.message ?? "Ouverture impossible");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const msg = (await adminApi.conversations.reply(id, { content: draft.trim() })) as Message;
      setMessages((m) => [...m, msg]);
      setDraft("");
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Envoi impossible");
    } finally {
      setSending(false);
    }
  }

  const name = conv?.vendorName ?? "Conversation";

  return (
    <div className="msg-app">
      <div className="thread-pane" style={{ flex: 1 }}>
        <div style={{ height: 64, background: "var(--surface)", borderBottom: "1px solid var(--outline-variant)", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <Link href="/messages" className="card-link" aria-label="Retour" style={{ display: "flex" }}>
            <ArrowLeft size={18} strokeWidth={1.8} />
          </Link>
          <div className={`avatar md${conv?.b2b ? " bronze" : ""}`}>{initials(name)}</div>
          <div style={{ flex: 1 }}>
            <div className="hstack" style={{ gap: 8 }}>
              <span style={{ fontWeight: 600 }}>{name}</span>
              {conv?.b2b && <span className="pill pill-bronze-soft" style={{ fontSize: 9 }}>PRO</span>}
            </div>
            <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>{conv?.subject ?? ""}</div>
          </div>
        </div>

        {conv?.pinnedEntity && (
          <div style={{ padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--outline-soft)" }}>
            <div style={{ borderLeft: "3px solid var(--primary)", padding: "10px 14px", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
              <span className="mono" style={{ fontWeight: 600 }}>#{conv.pinnedEntity.ref}</span> · {conv.pinnedEntity.label}
              <a href={`/${conv.pinnedEntity.kind === "order" ? "orders" : "quotes"}/${conv.pinnedEntity.ref}`} className="card-link" style={{ marginLeft: "auto" }}>Ouvrir →</a>
            </div>
          </div>
        )}

        <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m) =>
            m.sender === "client" ? (
              <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div className={`avatar sm${conv?.b2b ? " bronze" : ""}`}>{initials(name)}</div>
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
          {!loading && messages.length === 0 && (
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
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Send, Paperclip, X } from "lucide-react";
import { adminApi, api } from "@/lib/api";

function normalizeAttachment(
  a: string | { type?: string; url?: string },
): { type: string; url: string } {
  if (typeof a === "string") {
    return { url: a, type: /\.(mp4|mov|m4v|webm|avi|mkv)(\?|$)/i.test(a) ? "video" : "image" };
  }
  return { url: a.url ?? "", type: a.type ?? "image" };
}

function MsgAttachments({
  items,
}: {
  items?: (string | { type?: string; url?: string })[];
}) {
  const norm = (items ?? []).map(normalizeAttachment).filter((a) => a.url);
  if (!norm.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
      {norm.map((a, i) =>
        a.type === "video" ? (
          <video key={i} src={a.url} controls style={{ width: 220, maxWidth: "100%", borderRadius: 10, display: "block" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <a key={i} href={a.url} target="_blank" rel="noreferrer">
            <img src={a.url} alt="" style={{ width: 220, maxWidth: "100%", borderRadius: 10, display: "block", objectFit: "cover" }} />
          </a>
        ),
      )}
    </div>
  );
}

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
  attachments?: { type: string; url: string }[];
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
  const [pending, setPending] = useState<{ url: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file, "messages");
      setPending((p) => [...p, { url, type: file.type.startsWith("video") ? "video" : "image" }]);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Téléversement échoué");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function send() {
    if (!draft.trim() && pending.length === 0) return;
    setSending(true);
    try {
      const msg = (await adminApi.conversations.reply(id, {
        content: draft.trim(),
        attachments: pending.map((p) => p.url),
      })) as Message;
      setMessages((m) => [...m, msg]);
      setDraft("");
      setPending([]);
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

        {conv?.product && (
          <div style={{ padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--outline-soft)" }}>
            <Link href={`/products/${conv.product.id}`} className="card-link" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              {conv.product.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={conv.product.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.product.name}</div>
                <div style={{ fontSize: 12, color: "var(--secondary)" }}>{conv.product.priceLabel}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--primary)", flexShrink: 0 }}>Voir le produit →</span>
            </Link>
          </div>
        )}

        <div ref={threadRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m) =>
            m.sender === "client" ? (
              <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div className={`avatar sm${conv?.b2b ? " bronze" : ""}`}>{initials(name)}</div>
                <div className="bubble bubble-in">
                  <MsgAttachments items={m.attachments} />
                  {m.content && <div>{m.content}</div>}
                  <div style={{ fontSize: 10, color: "var(--outline)", marginTop: 4 }}>{timeShort(m.createdAt)}</div>
                </div>
              </div>
            ) : (
              <div key={m.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="bubble bubble-out">
                  <MsgAttachments items={m.attachments} />
                  {m.content && <div>{m.content}</div>}
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
          {(pending.length > 0 || uploading) && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {pending.map((p, i) => (
                <div key={`${p.url}-${i}`} style={{ position: "relative", width: 56, height: 56 }}>
                  {p.type === "video" ? (
                    <div style={{ width: 56, height: 56, borderRadius: 8, background: "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🎥</div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
                  )}
                  <button
                    onClick={() => setPending((prev) => prev.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 9, border: "none", background: "var(--on-surface)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                    aria-label="Retirer"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {uploading && (
                <div style={{ width: 56, height: 56, borderRadius: 8, background: "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--outline)" }}>…</div>
              )}
            </div>
          )}
          <div className="hstack" style={{ gap: 10, alignItems: "flex-end" }}>
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={onPickFile} />
            <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Joindre un fichier">
              <Paperclip size={16} strokeWidth={1.7} />
            </button>
            <textarea
              className="input-boxed"
              style={{ flex: 1, minHeight: 42, maxHeight: 120, resize: "none" }}
              placeholder="Écrire un message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button className="btn btn-primary btn-sm" onClick={send} disabled={sending || uploading || (!draft.trim() && pending.length === 0)}>
              <Send size={14} strokeWidth={1.7} />
              <span>{sending ? "…" : "Envoyer"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

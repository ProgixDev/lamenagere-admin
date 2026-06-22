"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, MoreHorizontal } from "lucide-react";
import { adminApi } from "@/lib/api";

interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  type: "particulier" | "professionnel";
  company?: string;
  siret?: string;
  territory: string;
  orders: number;
  totalSpent: string;
  lastActivity: string;
  createdAt: string;
  avatarInitials: string;
}

const TABS = [
  { key: "all", label: "Tous" },
  { key: "particulier", label: "Particuliers" },
  { key: "professionnel", label: "Professionnels" },
  { key: "inactive", label: "Inactifs" },
];

const ZONES: Record<string, string> = {
  metropole: "🇫🇷 Métropole",
  reunion: "🌴 La Réunion",
  guadeloupe: "🌴 Guadeloupe",
  martinique: "🌴 Martinique",
  guyane: "🌴 Guyane",
  mayotte: "🌴 Mayotte",
};

function relativeTime(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  return d < 30 ? `il y a ${d} j` : `il y a ${Math.round(d / 30)} mois`;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    adminApi.customers
      .list("")
      .then((r) => setCustomers((r as AdminCustomer[]) ?? []))
      .catch((e: { message?: string }) =>
        toast.error(e?.message ?? "Chargement impossible"),
      )
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      all: customers.length,
      particulier: customers.filter((c) => c.type === "particulier").length,
      professionnel: customers.filter((c) => c.type === "professionnel").length,
      inactive: customers.filter((c) => c.orders === 0).length,
    }),
    [customers],
  );

  const filtered = customers.filter((c) => {
    if (tab === "particulier" && c.type !== "particulier") return false;
    if (tab === "professionnel" && c.type !== "professionnel") return false;
    if (tab === "inactive" && c.orders !== 0) return false;
    if (
      search &&
      !`${c.fullName} ${c.email} ${c.company ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <div className="page-subtitle">
            {loading
              ? "Chargement…"
              : `${counts.all} clients · ${counts.particulier} particuliers · ${counts.professionnel} professionnels`}
          </div>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`chip${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} <span className="count">{counts[t.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      <div className="card card-padded" style={{ marginBottom: 18 }}>
        <div className="hstack" style={{ gap: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280, maxWidth: 380 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", display: "flex" }}>
              <Search size={16} strokeWidth={1.8} />
            </span>
            <input
              className="input-boxed"
              style={{ paddingLeft: 38, width: "100%" }}
              placeholder="Nom, email, société..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Territoire</th>
              <th style={{ textAlign: "center" }}>Cmd.</th>
              <th style={{ textAlign: "right" }}>Total dépensé</th>
              <th>Dernière activité</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => router.push(`/customers/${c.id}`)} style={{ cursor: "pointer" }}>
                <td>
                  <div className="hstack" style={{ gap: 12 }}>
                    <div className={`avatar sm${c.type === "professionnel" ? " bronze" : ""}`}>{c.avatarInitials}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{c.fullName}</div>
                      <div style={{ fontSize: 11, color: "var(--outline)", marginTop: 2 }}>
                        {c.email}{c.company ? ` · ${c.company}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {c.type === "professionnel"
                    ? <span className="pill pill-bronze">PRO</span>
                    : <span className="pill pill-outline">Particulier</span>}
                </td>
                <td><span style={{ fontSize: 12.5 }}>{ZONES[c.territory] ?? c.territory}</span></td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{c.orders}</td>
                <td style={{ textAlign: "right" }} className="num">{c.totalSpent}</td>
                <td style={{ fontSize: 12.5, color: "var(--on-surface-variant)" }}>{relativeTime(c.lastActivity)}</td>
                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                  <button className="icon-btn" style={{ width: 28, height: 28 }}>
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 24, color: "var(--outline)", fontSize: 13 }}>
            Aucun client.
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderTop: "1px solid var(--outline-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--outline)" }}>{filtered.length} client(s)</div>
        </div>
      </div>
    </div>
  );
}

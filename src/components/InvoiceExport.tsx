"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, FileText, X } from "lucide-react";
import { adminApi } from "@/lib/api";

/** `AAAA-MM-JJ` in local time — `toISOString()` would shift the day across UTC. */
function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/**
 * The periods an accountant actually asks for. `Depuis le début` starts in
 * 2020 — comfortably before the first order, so it means "everything" without
 * needing the backend to special-case an open range.
 */
const PRESETS: { label: string; range: () => [string, string] }[] = [
  {
    label: "Mois en cours",
    range: () => {
      const now = new Date();
      return [iso(new Date(now.getFullYear(), now.getMonth(), 1)), iso(now)];
    },
  },
  {
    label: "Mois dernier",
    range: () => {
      const now = new Date();
      return [
        iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        iso(new Date(now.getFullYear(), now.getMonth(), 0)),
      ];
    },
  },
  {
    label: "Trimestre en cours",
    range: () => {
      const now = new Date();
      return [
        iso(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)),
        iso(now),
      ];
    },
  },
  {
    label: "Année en cours",
    range: () => {
      const now = new Date();
      return [iso(new Date(now.getFullYear(), 0, 1)), iso(now)];
    },
  },
  {
    label: "Depuis le début",
    range: () => ["2020-01-01", iso(new Date())],
  },
];

/**
 * The comptabilité export: every facture of a period, as the CSV ledger the
 * accountant reconciles from or as the PDFs themselves.
 *
 * A panel anchored under its own button rather than a modal: the period is
 * something an admin adjusts and re-exports a few times in a row, and a dialog
 * that has to be reopened after every download makes that tedious.
 */
export default function InvoiceExport() {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(() => PRESETS[3].range()[0]);
  const [to, setTo] = useState(() => PRESETS[3].range()[1]);
  const [busy, setBusy] = useState<"csv" | "zip" | null>(null);

  async function run(format: "csv" | "zip") {
    setBusy(format);
    const pending =
      format === "zip"
        ? toast.loading("Préparation des factures PDF… (les factures manquantes sont générées)")
        : null;
    try {
      await adminApi.invoices.export(from, to, format);
      toast.success(
        format === "csv"
          ? "Récapitulatif comptable téléchargé"
          : "Archive des factures téléchargée",
      );
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Export impossible");
    } finally {
      if (pending) toast.dismiss(pending);
      setBusy(null);
    }
  }

  const activePreset = PRESETS.findIndex((p) => {
    const [f, t] = p.range();
    return f === from && t === to;
  });

  return (
    <div style={{ position: "relative" }}>
      <button className="btn btn-outline btn-sm" onClick={() => setOpen((o) => !o)}>
        <Download size={14} strokeWidth={1.8} />
        <span>Factures (comptabilité)</span>
      </button>

      {open && (
        <div
          className="card card-padded"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 30,
            width: 560,
            maxWidth: "calc(100vw - 32px)",
            boxShadow: "0 18px 48px rgba(0,0,0,0.14)",
          }}
        >
          <div
            className="hstack"
            style={{ justifyContent: "space-between", marginBottom: 16 }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Export des factures</div>
              <div style={{ fontSize: 12, color: "var(--outline)", marginTop: 2 }}>
                Toutes les commandes payées de la période, pour la comptabilité.
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          </div>

          <div className="chips" style={{ marginBottom: 16, gap: 8 }}>
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                className={`chip${activePreset === i ? " active" : ""}`}
                style={{ height: 32, fontSize: 10.5 }}
                onClick={() => {
                  const [f, t] = p.range();
                  setFrom(f);
                  setTo(t);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field">
              <label className="field-label" htmlFor="invoice-export-from">
                Du
              </label>
              <input
                id="invoice-export-from"
                type="date"
                className="input-boxed"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="invoice-export-to">
                Au
              </label>
              <input
                id="invoice-export-to"
                type="date"
                className="input-boxed"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="hstack" style={{ gap: 10 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => run("csv")}
                disabled={busy !== null}
              >
                <FileSpreadsheet size={14} strokeWidth={1.8} />
                <span>{busy === "csv" ? "Export…" : "Récapitulatif CSV"}</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => run("zip")}
                disabled={busy !== null}
              >
                <FileText size={14} strokeWidth={1.8} />
                <span>{busy === "zip" ? "Préparation…" : "Factures PDF (ZIP)"}</span>
              </button>
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: "var(--outline)", marginTop: 14 }}>
            Le CSV s&apos;ouvre dans Excel (HT, TVA, TTC, remboursements). Le ZIP contient
            chaque facture en PDF plus ce même récapitulatif. Les commandes payées avant la
            mise en place des factures sont générées automatiquement lors de l&apos;export —
            aucun email n&apos;est envoyé au client.
          </div>
        </div>
      )}
    </div>
  );
}

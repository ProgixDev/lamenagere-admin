"use client";

import React from "react";

export const PALETTE = [
  "#002444",
  "#7f5531",
  "#10B981",
  "#2EA3F2",
  "#F59E0B",
  "#9b6bdf",
  "#14b8a6",
  "#e8794b",
];

/* ── Sparkline ─────────────────────────────────────────────────────────────*/
export function Sparkline({
  data,
  color = "#002444",
  width = 130,
  height = 36,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const pts = data.map<[number, number]>((v, i) => [
    i * stepX,
    height - 3 - ((v - min) / span) * (height - 6),
  ]);
  const line = pts.map((p, i) => (i ? `L${p[0]},${p[1]}` : `M${p[0]},${p[1]}`)).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const id = `sg${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── Donut ─────────────────────────────────────────────────────────────────*/
export function Donut({
  segments,
  size = 180,
  thickness = 26,
  centerTop,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((n, s) => n + s.value, 0);
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${c} ${c})`}>
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-container-low)" strokeWidth={thickness} />
          {total > 0 &&
            segments.map((s, i) => {
              const len = (s.value / total) * circ;
              const el = (
                <circle
                  key={i}
                  cx={c}
                  cy={c}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
        </g>
        {centerValue && (
          <>
            <text x={c} y={c - 4} textAnchor="middle" style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 20, fill: "var(--on-surface)" }}>
              {centerValue}
            </text>
            {centerTop && (
              <text x={c} y={c + 16} textAnchor="middle" style={{ fontSize: 10, fill: "var(--outline)" }}>
                {centerTop}
              </text>
            )}
          </>
        )}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 140 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: "var(--on-surface-variant)" }}>{s.label}</span>
            <span style={{ fontWeight: 600 }}>
              {total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
        {total === 0 && <div style={{ color: "var(--outline)", fontSize: 13 }}>Aucune donnée.</div>}
      </div>
    </div>
  );
}

/* ── Comparison trend chart (area + dashed previous period) ───────────────── */
export function TrendChart({
  labels,
  current,
  previous,
  height = 280,
  formatValue = (n) => String(Math.round(n)),
  color = "#002444",
}: {
  labels: string[];
  current: number[];
  previous?: number[];
  height?: number;
  formatValue?: (n: number) => string;
  color?: string;
}) {
  const W = 1000;
  const padTop = 14;
  const padBottom = 10;
  const h = height;
  const all = [...current, ...(previous ?? [])];
  const max = Math.max(...all, 1) * 1.15;
  const n = current.length;
  const stepX = n > 1 ? W / (n - 1) : W;
  const y = (v: number) => padTop + (1 - v / max) * (h - padTop - padBottom);
  const toPath = (arr: number[]) =>
    arr.map((v, i) => `${i ? "L" : "M"}${i * stepX},${y(v)}`).join(" ");
  const curLine = toPath(current);
  const curArea = `${curLine} L${W},${h - padBottom} L0,${h - padBottom} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1];

  // Sparse x labels (~6)
  const labelEvery = Math.max(1, Math.ceil(n / 6));
  const xLabels = labels
    .map((l, i) => ({ l, i }))
    .filter(({ i }) => i % labelEvery === 0 || i === n - 1);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {grid.map((g) => (
            <line key={g} x1={0} x2={W} y1={padTop + g * (h - padTop - padBottom)} y2={padTop + g * (h - padTop - padBottom)} stroke="var(--outline-soft)" strokeWidth={1} />
          ))}
          {previous && previous.length === n && (
            <path d={toPath(previous)} fill="none" stroke="var(--outline)" strokeWidth={1.5} strokeDasharray="5 5" vectorEffect="non-scaling-stroke" opacity={0.7} />
          )}
          <path d={curArea} fill="url(#trendGrad)" />
          <path d={curLine} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        {/* Y labels overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, height: h, width: "100%", pointerEvents: "none" }}>
          {[1, 0.5, 0].map((g) => (
            <div key={g} style={{ position: "absolute", top: padTop + (1 - g) * (h - padTop - padBottom) - 8, right: 4, fontSize: 10, color: "var(--outline)", background: "var(--surface)", padding: "0 4px" }}>
              {formatValue(max * g)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {xLabels.map(({ l, i }) => (
          <span key={i} style={{ fontSize: 10, color: "var(--outline)" }}>
            {l.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Vertical bars (e.g. weekday) ──────────────────────────────────────────*/
export function VBars({
  data,
  labels,
  color = "#002444",
  height = 160,
  formatValue,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height, paddingTop: 18 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 6 }}>
          <div style={{ fontSize: 10, color: "var(--outline)", fontWeight: 600 }}>
            {formatValue ? (v > 0 ? formatValue(v) : "") : v || ""}
          </div>
          <div
            title={labels[i]}
            style={{
              width: "70%",
              height: `${Math.max(2, (v / max) * 100)}%`,
              background: `linear-gradient(180deg, ${color}, ${color}99)`,
              borderRadius: "6px 6px 0 0",
              transition: "height 0.2s",
            }}
          />
          <div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

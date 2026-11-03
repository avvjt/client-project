"use client";

import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Animated supply-corridor map: abstract wireframe globe with the Bengaluru
 * hub and eight corridor nodes of interest. Purely presentational — corridors
 * are labelled "of interest" and activation is confirmed per enquiry.
 * Overlay chips are percent-positioned so they track the responsive SVG.
 */
type CorridorNode = {
  key: "Asia" | "MiddleEast" | "SouthAmerica" | "Africa" | "Australia" | "Canada" | "Un" | "Eu";
  /** percent coordinates in the 16/10 container */
  x: number;
  y: number;
  /** SVG-space coordinates in the 160×100 viewBox */
  sx: number;
  sy: number;
};

const HUB = { x: 58.1, y: 44, sx: 93, sy: 44 };

const CORRIDORS: CorridorNode[] = [
  { key: "Asia", x: 66.9, y: 32, sx: 107, sy: 32 },
  { key: "MiddleEast", x: 52.5, y: 38, sx: 84, sy: 38 },
  { key: "Eu", x: 40.6, y: 24, sx: 65, sy: 24 },
  { key: "Africa", x: 43.8, y: 63, sx: 70, sy: 63 },
  { key: "SouthAmerica", x: 17.5, y: 54, sx: 28, sy: 54 },
  { key: "Australia", x: 69.4, y: 68, sx: 111, sy: 68 },
  { key: "Canada", x: 14.4, y: 17, sx: 23, sy: 17 },
  { key: "Un", x: 50, y: 7, sx: 80, sy: 7 },
];

const ARC_PATHS: Record<CorridorNode["key"], string> = {
  Asia: "M93,44 Q102,36 107,32",
  MiddleEast: "M93,44 Q88,39 84,38",
  Eu: "M93,44 Q77,32 65,24",
  Africa: "M93,44 Q80,58 70,63",
  SouthAmerica: "M93,44 Q58,72 28,54",
  Australia: "M93,44 Q104,60 111,68",
  Canada: "M93,44 Q58,14 23,17",
  Un: "M93,44 Q90,22 80,7",
};

export function CorridorMap() {
  const { t } = useI18n();

  const labels: Record<CorridorNode["key"], { name: string; note: string }> = {
    Asia: { name: t.home.corridorAsia, note: t.home.corridorAsiaNote },
    MiddleEast: { name: t.home.corridorMiddleEast, note: t.home.corridorMiddleEastNote },
    SouthAmerica: { name: t.home.corridorSouthAmerica, note: t.home.corridorSouthAmericaNote },
    Africa: { name: t.home.corridorAfrica, note: t.home.corridorAfricaNote },
    Australia: { name: t.home.corridorAustralia, note: t.home.corridorAustraliaNote },
    Canada: { name: t.home.corridorCanada, note: t.home.corridorCanadaNote },
    Un: { name: t.home.corridorUn, note: t.home.corridorUnNote },
    Eu: { name: t.home.corridorEu, note: t.home.corridorEuNote },
  };

  return (
    <div className="relative aspect-[16/10] w-full select-none" role="img"
      aria-label={`${t.home.corridorsTitle}: ${CORRIDORS.map((c) => labels[c.key].name).join(", ")}`}
    >
      {/* Wireframe globe + arcs */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Radar sweep — slow rotating teal scan behind the globe (motion-safe) */}
        <div
          className="absolute inset-0 m-auto aspect-square h-full max-w-full motion-safe:animate-[radar_9s_linear_infinite] rounded-full [background:conic-gradient(from_0deg,transparent_0deg,transparent_250deg,rgba(17,166,160,0.12)_295deg,rgba(115,216,205,0.16)_315deg,transparent_330deg)]"
        />
      </div>
      <svg
        viewBox="0 0 160 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="globeFill" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="var(--brand-teal)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--brand-teal)" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Globe wireframe */}
        <g fill="none" stroke="var(--brand-engineering)" strokeOpacity="0.35" strokeWidth="0.4">
          <circle cx="80" cy="50" r="38" fill="url(#globeFill)" strokeOpacity="0.5" />
          <ellipse cx="80" cy="50" rx="38" ry="14" />
          <ellipse cx="80" cy="50" rx="38" ry="27" />
          <ellipse cx="80" cy="50" rx="14" ry="38" />
          <ellipse cx="80" cy="50" rx="27" ry="38" />
          <line x1="42" y1="50" x2="118" y2="50" strokeDasharray="1 1.6" />
          <line x1="80" y1="12" x2="80" y2="88" strokeDasharray="1 1.6" />
        </g>

        {/* Corridor arcs — draw in on scroll */}
        <g fill="none" stroke="var(--brand-teal-signal)" strokeWidth="0.55" strokeLinecap="round">
          {CORRIDORS.map((c, i) => (
            <motion.path
              key={c.key}
              d={ARC_PATHS[c.key]}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 + i * 0.12 }}
            />
          ))}
        </g>

        {/* Flowing shipment dashes — supply in motion along each corridor */}
        <g
          fill="none"
          stroke="var(--brand-teal-pale)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="1.5 3"
          className="motion-safe:animate-[dashflow_1.8s_linear_infinite]"
          opacity="0.9"
        >
          {CORRIDORS.map((c) => (
            <path key={`flow-${c.key}`} d={ARC_PATHS[c.key]} />
          ))}
        </g>

        {/* Nodes */}
        {CORRIDORS.map((c, i) => (
          <motion.circle
            key={c.key}
            cx={c.sx}
            cy={c.sy}
            r="1.5"
            fill="var(--brand-teal)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.35 + i * 0.12 }}
            style={{ transformOrigin: `${c.sx}px ${c.sy}px` }}
          />
        ))}

        {/* Bengaluru hub */}
        <circle cx={HUB.sx} cy={HUB.sy} r="2.1" fill="var(--brand-champagne)" stroke="var(--brand-navy)" strokeWidth="0.4" />
      </svg>

      {/* Hub pulse + label (HTML overlay for crisp text + RTL safety) */}
      <span
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-champagne opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full border border-brand-navy bg-brand-champagne" />
        </span>
      </span>
      <span
        className="tech-value absolute z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-md bg-brand-navy px-2 py-1 text-[10px] font-semibold text-white shadow-md"
        style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
      >
        {t.home.networkHub}
      </span>

      {/* Corridor chips — hidden on small screens (legend list shown instead) */}
      {CORRIDORS.map((c) => (
        <span
          key={c.key}
          className="absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm sm:block"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          {labels[c.key].name}
        </span>
      ))}
    </div>
  );
}

/** Legend list used below the map and as the mobile fallback for corridor names. */
export function CorridorLegend() {
  const { t } = useI18n();
  const items: Array<{ name: string; note: string }> = [
    { name: t.home.corridorAsia, note: t.home.corridorAsiaNote },
    { name: t.home.corridorMiddleEast, note: t.home.corridorMiddleEastNote },
    { name: t.home.corridorSouthAmerica, note: t.home.corridorSouthAmericaNote },
    { name: t.home.corridorAfrica, note: t.home.corridorAfricaNote },
    { name: t.home.corridorAustralia, note: t.home.corridorAustraliaNote },
    { name: t.home.corridorCanada, note: t.home.corridorCanadaNote },
    { name: t.home.corridorUn, note: t.home.corridorUnNote },
    { name: t.home.corridorEu, note: t.home.corridorEuNote },
  ];
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-start gap-2.5 rounded-md border border-border bg-card px-3.5 py-3"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal-signal" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold leading-snug">{item.name}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{item.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

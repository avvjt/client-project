"use client";

/**
 * DISPO-CONCEPT — GLOBAL FLAGS & EMBLEMS
 *
 * Hand-drawn inline SVG flags for the seven export corridors of interest,
 * the country of origin and the Swiss-grade marker. Flags are CONTENT
 * (they carry their official colours) — they never drive UI chrome colour.
 * Simplified geometry, correct silhouettes, recognisable at chip size.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FlagCode =
  | "eu" | "un" | "in" | "jp" | "ae" | "br" | "ng" | "au" | "ca" | "ch"
  | "us" | "gb" | "de" | "fr" | "nl" | "es" | "it" | "se" | "pl" | "gr"
  | "sa" | "kw" | "eg" | "ke" | "gh" | "za" | "mx" | "co" | "ar" | "pe"
  | "cl" | "kr" | "sg" | "my" | "id" | "th" | "vn" | "ph" | "cn" | "bd"
  | "pk";

const FLAG_LABELS: Record<FlagCode, string> = {
  eu: "European Union",
  un: "United Nations",
  in: "India",
  jp: "Japan",
  ae: "United Arab Emirates",
  br: "Brazil",
  ng: "Nigeria",
  au: "Australia",
  ca: "Canada",
  ch: "Switzerland",
  us: "United States",
  gb: "United Kingdom",
  de: "Germany",
  fr: "France",
  nl: "Netherlands",
  es: "Spain",
  it: "Italy",
  se: "Sweden",
  pl: "Poland",
  gr: "Greece",
  sa: "Saudi Arabia",
  kw: "Kuwait",
  eg: "Egypt",
  ke: "Kenya",
  gh: "Ghana",
  za: "South Africa",
  mx: "Mexico",
  co: "Colombia",
  ar: "Argentina",
  pe: "Peru",
  cl: "Chile",
  kr: "South Korea",
  sg: "Singapore",
  my: "Malaysia",
  id: "Indonesia",
  th: "Thailand",
  vn: "Vietnam",
  ph: "Philippines",
  cn: "China",
  bd: "Bangladesh",
  pk: "Pakistan",
};

/** Five-pointed star path for a given centre + radius. */
function star(cx: number, cy: number, r: number): string {
  const inner = r * 0.42;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }
  return `${d}Z`;
}

const EU_STAR_ANGLES = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

function FlagArtwork({ code }: { code: FlagCode }) {
  switch (code) {
    case "eu":
      return (
        <>
          <rect width="60" height="40" fill="#003399" />
          {EU_STAR_ANGLES.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 30 + 12 * Math.sin(rad);
            const cy = 20 - 12 * Math.cos(rad);
            return <path key={deg} d={star(cx, cy, 2.4)} fill="#FFCC00" />;
          })}
        </>
      );
    case "un":
      // The UN emblem (globe + laurel) is protected under GA Resolution 92(I);
      // reproducing even a simplified lookalike on a commercial site is a
      // legal risk. A text-only reference chip is the compliant representation.
      return (
        <>
          <rect width="60" height="40" fill="#5B92E5" />
          <text
            x="30"
            y="26"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="16"
            fontWeight="700"
            letterSpacing="1"
            fill="#fff"
          >
            UN
          </text>
        </>
      );
    case "in":
      return (
        <>
          <rect width="60" height="13.33" fill="#FF9933" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#138808" />
          <circle cx="30" cy="20" r="5.2" fill="none" stroke="#000080" strokeWidth="1" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={30 + 1 * Math.cos(a)}
                y1={20 + 1 * Math.sin(a)}
                x2={30 + 5 * Math.cos(a)}
                y2={20 + 5 * Math.sin(a)}
                stroke="#000080"
                strokeWidth="0.6"
              />
            );
          })}
          <circle cx="30" cy="20" r="1" fill="#000080" />
        </>
      );
    case "jp":
      return (
        <>
          <rect width="60" height="40" fill="#FFFFFF" />
          <circle cx="30" cy="20" r="9" fill="#BC002D" />
        </>
      );
    case "ae":
      return (
        <>
          <rect width="60" height="13.33" fill="#00732F" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#000000" />
          <rect width="16" height="40" fill="#FF0000" />
        </>
      );
    case "br":
      return (
        <>
          <rect width="60" height="40" fill="#009C3B" />
          <path d="M30 5L54 20 30 35 6 20Z" fill="#FFDF00" />
          <circle cx="30" cy="20" r="8.6" fill="#002776" />
          <path d="M22.5 17.5c5-2.4 10.5-2 14.8 1.6" fill="none" stroke="#fff" strokeWidth="1.2" />
        </>
      );
    case "ng":
      return (
        <>
          <rect width="20" height="40" fill="#008751" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#008751" />
        </>
      );
    case "au":
      return (
        <>
          <rect width="60" height="40" fill="#012169" />
          {/* simplified Union Jack canton */}
          <path d="M0 0l26 17M26 0L0 17" stroke="#fff" strokeWidth="4.4" />
          <path d="M0 0l26 17M26 0L0 17" stroke="#C8102E" strokeWidth="1.8" />
          <path d="M13 0v17M0 8.5h26" stroke="#fff" strokeWidth="6" />
          <path d="M13 0v17M0 8.5h26" stroke="#C8102E" strokeWidth="3" />
          {/* Commonwealth star + Southern Cross */}
          <path d={star(13, 29, 4.4)} fill="#fff" />
          <path d={star(45, 9, 2.4)} fill="#fff" />
          <path d={star(52, 16, 2.4)} fill="#fff" />
          <path d={star(45, 27, 2.4)} fill="#fff" />
          <path d={star(39, 18, 1.7)} fill="#fff" />
        </>
      );
    case "ca":
      // Canada — red-white-red vertical triband with a simplified maple leaf.
      return (
        <>
          <rect width="60" height="40" fill="#FFFFFF" />
          <rect width="15" height="40" fill="#D80621" />
          <rect x="45" width="15" height="40" fill="#D80621" />
          <path
            d="M30 9l2.1 4.3 3.4-1.3-1 4.2 3.9.6-2.8 3 3.4 2.6-6.6 1.1.4 4.5h-5.6l.4-4.5-6.6-1.1 3.4-2.6-2.8-3 3.9-.6-1-4.2 3.4 1.3L30 9Z"
            fill="#D80621"
          />
          <rect x="29.3" y="24" width="1.4" height="7" fill="#D80621" />
        </>
      );
    case "ch":
      return (
        <>
          <rect width="60" height="40" fill="#DA291C" />
          <path d="M26 10h8v6h6v8h-6v6h-8v-6h-6v-8h6v-6Z" fill="#FFFFFF" />
        </>
      );
    case "us": {
      // 13 stripes, blue canton, simplified star field (dot grid).
      const stripes = Array.from({ length: 13 }, (_, i) =>
        i % 2 === 0 ? (
          <rect key={`s${i}`} y={(i * 40) / 13} width="60" height={40 / 13} fill="#B22234" />
        ) : null
      );
      const dots: ReactNode[] = [];
      [4.5, 8.5, 12.5, 16.5].forEach((y, row) => {
        const count = row % 2 === 0 ? 5 : 4;
        const x0 = row % 2 === 0 ? 4 : 6.2;
        for (let c = 0; c < count; c++) {
          dots.push(<circle key={`d${row}-${c}`} cx={x0 + c * 4.4} cy={y} r="1.05" fill="#fff" />);
        }
      });
      return (
        <>
          <rect width="60" height="40" fill="#FFFFFF" />
          {stripes}
          <rect width="24" height={(7 * 40) / 13} fill="#3C3B6E" />
          {dots}
        </>
      );
    }
    case "gb":
      // Union Jack — simplified canton geometry (same treatment as AU).
      return (
        <>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
          <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13.4" />
          <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
        </>
      );
    case "de":
      return (
        <>
          <rect width="60" height="13.33" fill="#000000" />
          <rect y="13.33" width="60" height="13.33" fill="#DD0000" />
          <rect y="26.66" width="60" height="13.34" fill="#FFCE00" />
        </>
      );
    case "fr":
      return (
        <>
          <rect width="20" height="40" fill="#002395" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#ED2939" />
        </>
      );
    case "nl":
      return (
        <>
          <rect width="60" height="13.33" fill="#AE1C28" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#21468B" />
        </>
      );
    case "es":
      return (
        <>
          <rect width="60" height="40" fill="#F1BF00" />
          <rect width="60" height="10" fill="#AA151B" />
          <rect y="30" width="60" height="10" fill="#AA151B" />
        </>
      );
    case "it":
      return (
        <>
          <rect width="20" height="40" fill="#009246" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#CE2B37" />
        </>
      );
    case "se":
      return (
        <>
          <rect width="60" height="40" fill="#006AA7" />
          <rect x="18" width="7.5" height="40" fill="#FECC00" />
          <rect y="16.25" width="60" height="7.5" fill="#FECC00" />
        </>
      );
    case "pl":
      return (
        <>
          <rect width="60" height="20" fill="#FFFFFF" />
          <rect y="20" width="60" height="20" fill="#DC143C" />
        </>
      );
    case "gr": {
      const grStripes = Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          y={(i * 40) / 9}
          width="60"
          height={40 / 9}
          fill={i % 2 === 0 ? "#0D5EAF" : "#FFFFFF"}
        />
      ));
      return (
        <>
          {grStripes}
          <rect width="22.22" height="22.22" fill="#0D5EAF" />
          <rect x="8.9" width="4.42" height="22.22" fill="#FFFFFF" />
          <rect y="8.9" width="22.22" height="4.42" fill="#FFFFFF" />
        </>
      );
    }
    case "sa":
      // Simplified: green field, stylised script stroke and sword (no text).
      return (
        <>
          <rect width="60" height="40" fill="#006C35" />
          <path
            d="M14 17q4-3.4 8 0t8 0 8 0 8 0"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M18 22.4q4-3 8 0t8 0 6 0"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M13 27.6h33.5l3.5 1.5-3.5 1.5H13Z" fill="#FFFFFF" />
          <rect x="10.5" y="26.4" width="3" height="4.4" rx="1" fill="#FFFFFF" />
        </>
      );
    case "kw":
      return (
        <>
          <rect width="60" height="13.33" fill="#007A3D" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#CE1126" />
          <path d="M0 0l20 13.33L20 26.66 0 40Z" fill="#000000" />
        </>
      );
    case "eg":
      return (
        <>
          <rect width="60" height="13.33" fill="#CE1126" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#000000" />
          <path
            d="M30 15.2c-1.6 1.6-4 2.6-5.4 4.8l3.2.7c.2 1.6.9 2.7 2.2 3.6 1.3-.9 2-2 2.2-3.6l3.2-.7c-1.4-2.2-3.8-3.2-5.4-4.8Z"
            fill="#C09300"
          />
        </>
      );
    case "ke":
      return (
        <>
          <rect width="60" height="12.6" fill="#000000" />
          <rect y="13.9" width="60" height="12.2" fill="#BB0000" />
          <rect y="27.4" width="60" height="12.6" fill="#006600" />
          <path d="M12 5l36 30M48 5L12 35" stroke="#FFFFFF" strokeWidth="1.3" />
          <ellipse cx="30" cy="20" rx="7" ry="10.6" fill="#FFFFFF" />
          <ellipse cx="30" cy="20" rx="5.4" ry="9" fill="#BB0000" />
          <ellipse cx="30" cy="20" rx="2.1" ry="9" fill="#000000" />
        </>
      );
    case "gh":
      return (
        <>
          <rect width="60" height="13.33" fill="#CE1126" />
          <rect y="13.33" width="60" height="13.33" fill="#FCD116" />
          <rect y="26.66" width="60" height="13.34" fill="#006B3F" />
          <path d={star(30, 20, 7)} fill="#000000" />
        </>
      );
    case "za":
      return (
        <>
          <rect width="60" height="20" fill="#DE3831" />
          <rect y="20" width="60" height="20" fill="#002395" />
          <rect x="22" y="14" width="38" height="12" fill="#FFFFFF" />
          <rect x="24" y="16" width="36" height="8" fill="#007A4D" />
          <path d="M-2-2 26 20-2 42" stroke="#FFFFFF" strokeWidth="13" fill="none" />
          <path d="M-2-2 26 20-2 42" stroke="#007A4D" strokeWidth="8" fill="none" />
          <path d="M0 4l19 16L0 36Z" fill="#FFB612" />
          <path d="M0 9l13 11L0 31Z" fill="#000000" />
        </>
      );
    case "mx":
      return (
        <>
          <rect width="20" height="40" fill="#006847" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#CE1126" />
        </>
      );
    case "co":
      return (
        <>
          <rect width="60" height="20" fill="#FCD116" />
          <rect y="20" width="60" height="10" fill="#003893" />
          <rect y="30" width="60" height="10" fill="#CE1126" />
        </>
      );
    case "ar": {
      const arRays = Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <line
            key={i}
            x1={30 + 4.4 * Math.cos(a)}
            y1={20 + 4.4 * Math.sin(a)}
            x2={30 + 6.2 * Math.cos(a)}
            y2={20 + 6.2 * Math.sin(a)}
            stroke="#F6B40E"
            strokeWidth="1"
          />
        );
      });
      return (
        <>
          <rect width="60" height="13.33" fill="#74ACDF" />
          <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
          <rect y="26.66" width="60" height="13.34" fill="#74ACDF" />
          <circle cx="30" cy="20" r="3.4" fill="#F6B40E" />
          {arRays}
        </>
      );
    }
    case "pe":
      return (
        <>
          <rect width="20" height="40" fill="#D91023" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#D91023" />
        </>
      );
    case "cl":
      return (
        <>
          <rect width="60" height="20" fill="#FFFFFF" />
          <rect y="20" width="60" height="20" fill="#D52B1E" />
          <rect width="20" height="20" fill="#0039A6" />
          <path d={star(10, 10, 5.5)} fill="#FFFFFF" />
        </>
      );
    case "kr": {
      const trigram = (x: number, y: number, rot: number) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
          {[-3.2, 0, 3.2].map((dy) => (
            <rect key={dy} x="-4" y={dy - 0.7} width="8" height="1.4" fill="#000000" />
          ))}
        </g>
      );
      return (
        <>
          <rect width="60" height="40" fill="#FFFFFF" />
          <g transform="rotate(-18 30 20)">
            <path d="M22.5 20a7.5 7.5 0 0 1 15 0Z" fill="#CD2E3A" />
            <path d="M37.5 20a7.5 7.5 0 0 1-15 0Z" fill="#0047A0" />
            <circle cx="26.25" cy="20" r="3.75" fill="#CD2E3A" />
            <circle cx="33.75" cy="20" r="3.75" fill="#0047A0" />
          </g>
          {trigram(10, 8, -56)}
          {trigram(50, 8, 56)}
          {trigram(10, 32, 56)}
          {trigram(50, 32, -56)}
        </>
      );
    }
    case "sg": {
      const sgStars: [number, number][] = [
        [26.5, 7],
        [29.2, 9.1],
        [28.1, 12.4],
        [24.9, 12.4],
        [23.8, 9.1],
      ];
      return (
        <>
          <rect width="60" height="20" fill="#EF3340" />
          <rect y="20" width="60" height="20" fill="#FFFFFF" />
          <circle cx="16.5" cy="10" r="7" fill="#FFFFFF" />
          <circle cx="20.2" cy="10" r="5.7" fill="#EF3340" />
          {sgStars.map(([cx, cy]) => (
            <path key={`${cx}-${cy}`} d={star(cx, cy, 1.4)} fill="#FFFFFF" />
          ))}
        </>
      );
    }
    case "my": {
      const myStripes = Array.from({ length: 14 }, (_, i) => (
        <rect
          key={i}
          y={(i * 40) / 14}
          width="60"
          height={40 / 14}
          fill={i % 2 === 0 ? "#CC0001" : "#FFFFFF"}
        />
      ));
      return (
        <>
          {myStripes}
          <rect width="30" height="20" fill="#010066" />
          <circle cx="11" cy="10" r="6" fill="#FFCC00" />
          <circle cx="14.2" cy="10" r="4.9" fill="#010066" />
          <path d={star(21.5, 10, 4)} fill="#FFCC00" />
        </>
      );
    }
    case "id":
      return (
        <>
          <rect width="60" height="20" fill="#CE1126" />
          <rect y="20" width="60" height="20" fill="#FFFFFF" />
        </>
      );
    case "th":
      return (
        <>
          <rect width="60" height="40" fill="#A51931" />
          <rect y="6.67" width="60" height="26.66" fill="#F4F5F8" />
          <rect y="13.33" width="60" height="13.34" fill="#2D2A4A" />
        </>
      );
    case "vn":
      return (
        <>
          <rect width="60" height="40" fill="#DA251D" />
          <path d={star(30, 20, 9)} fill="#FFFF00" />
        </>
      );
    case "ph": {
      const phRays = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={8 + 4 * Math.cos(a)}
            y1={20 + 4 * Math.sin(a)}
            x2={8 + 6.4 * Math.cos(a)}
            y2={20 + 6.4 * Math.sin(a)}
            stroke="#FCD116"
            strokeWidth="1.1"
          />
        );
      });
      return (
        <>
          <rect width="60" height="20" fill="#0038A8" />
          <rect y="20" width="60" height="20" fill="#CE1126" />
          <path d="M0 0l24 20L0 40Z" fill="#FFFFFF" />
          <circle cx="8" cy="20" r="2.9" fill="#FCD116" />
          {phRays}
          <path d={star(4.5, 5, 1.7)} fill="#FCD116" />
          <path d={star(4.5, 35, 1.7)} fill="#FCD116" />
          <path d={star(16.5, 20, 1.7)} fill="#FCD116" />
        </>
      );
    }
    case "cn": {
      const cnSmall: [number, number][] = [
        [21, 4.5],
        [24.5, 8.5],
        [24.5, 13.5],
        [21, 17.5],
      ];
      return (
        <>
          <rect width="60" height="40" fill="#DE2910" />
          <path d={star(11, 10.5, 6)} fill="#FFDE00" />
          {cnSmall.map(([cx, cy]) => (
            <path key={`${cx}-${cy}`} d={star(cx, cy, 1.9)} fill="#FFDE00" />
          ))}
        </>
      );
    }
    case "bd":
      return (
        <>
          <rect width="60" height="40" fill="#006A4E" />
          <circle cx="26" cy="20" r="9.4" fill="#F42A41" />
        </>
      );
    case "pk":
      return (
        <>
          <rect width="60" height="40" fill="#01411C" />
          <rect width="15" height="40" fill="#FFFFFF" />
          <circle cx="37" cy="20" r="9" fill="#FFFFFF" />
          <circle cx="40.5" cy="17.6" r="7.6" fill="#01411C" />
          <path d={star(43.5, 12.5, 2.8)} fill="#FFFFFF" />
        </>
      );
  }
}

export function Flag({ code, className }: { code: FlagCode; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={cn("inline-block h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10", className)}
      role="img"
      aria-label={FLAG_LABELS[code]}
    >
      <FlagArtwork code={code} />
    </svg>
  );
}

/**
 * Country + region markets for the Global Supply inquiry selector.
 * Labels are international proper names (single source across locales —
 * the flag artwork carries the visual identity).
 */
export const MARKET_FLAG_LABELS: Record<FlagCode, string> = FLAG_LABELS;

/** Corridor → representative flag mapping (used by home + supply views). */
export const CORRIDOR_FLAGS = [
  { flag: "jp" as FlagCode, key: "Asia" },
  { flag: "ae" as FlagCode, key: "MiddleEast" },
  { flag: "br" as FlagCode, key: "SouthAmerica" },
  { flag: "ng" as FlagCode, key: "Africa" },
  { flag: "au" as FlagCode, key: "Australia" },
  { flag: "ca" as FlagCode, key: "Canada" },
  { flag: "un" as FlagCode, key: "Un" },
  { flag: "eu" as FlagCode, key: "Eu" },
] as const;

/** Flag + label chip used in corridor sections and footers. */
export function FlagChip({
  flag,
  label,
  note,
  className,
}: {
  flag: FlagCode;
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5",
        className
      )}
    >
      <Flag code={flag} />
      <span className="flex flex-col leading-none">
        <span className="tech-value text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</span>
        {note && <span className="mt-0.5 text-[10px] text-muted-foreground">{note}</span>}
      </span>
    </span>
  );
}

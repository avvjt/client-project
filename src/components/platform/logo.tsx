import { cn } from "@/lib/utils";

/**
 * Dispo-Concept Swiss badge — red field, white Swiss cross, vector "DC"
 * monogram. Geometric paths (no font dependency) stay crisp from favicon
 * to footer. Echoes the Swiss Army seal: red, white, precise.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <rect width="64" height="64" rx="12" className="fill-brand-swiss" />
      {/* Swiss cross */}
      <rect x="28.5" y="9" width="7" height="16" rx="1.5" className="fill-white" />
      <rect x="24" y="13.5" width="16" height="7" rx="1.5" className="fill-white" />
      {/* D — filled geometric bowl */}
      <path d="M15 31 h8 a10 10 0 0 1 0 20 h-8 z" className="fill-white" />
      {/* C — open ring, 270° arc opening right */}
      <path
        d="M54.36 34.64 A9 9 0 1 0 54.36 47.36"
        fill="none"
        className="stroke-white"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-extrabold tracking-[0.08em] text-foreground">
          DISPO<span className="text-brand-swiss">-</span>CONCEPT
        </span>
      </span>
    </span>
  );
}

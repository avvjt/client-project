"use client";

import { motion } from "motion/react";
import { Building2, Factory, FlaskConical, Package, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Hub-and-spoke collaboration diagram: Dispo-Concept at the centre of five
 * relationship types. Lines render as percent-space SVG (preserveAspectRatio
 * "none" + non-scaling stroke); node chips are HTML overlays for safe RTL text.
 */
type NodeDef = {
  key: "Buyers" | "Distributors" | "Oem" | "Suppliers" | "Technical";
  x: number;
  y: number;
  /** SVG-space percent coordinates for line endpoints */
  sx: number;
  sy: number;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
};

const NODES: NodeDef[] = [
  { key: "Buyers", x: 15, y: 18, sx: 15, sy: 18, icon: Building2 },
  { key: "Distributors", x: 85, y: 18, sx: 85, sy: 18, icon: Share2 },
  { key: "Oem", x: 15, y: 82, sx: 15, sy: 82, icon: Factory },
  { key: "Suppliers", x: 85, y: 82, sx: 85, sy: 82, icon: Package },
  { key: "Technical", x: 50, y: 97, sx: 50, sy: 97, icon: FlaskConical },
];

export function NetworkDiagram() {
  const { t } = useI18n();

  const labels: Record<NodeDef["key"], string> = {
    Buyers: t.home.networkNodeBuyers,
    Distributors: t.home.networkNodeDistributors,
    Oem: t.home.networkNodeOem,
    Suppliers: t.home.networkNodeSuppliers,
    Technical: t.home.networkNodeTechnical,
  };

  return (
    <div className="relative hidden h-[380px] w-full select-none lg:block" aria-hidden="true">
      {/* Connection lines */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke="var(--brand-teal)" strokeOpacity="0.45" strokeWidth="1.1" strokeDasharray="2.5 2.5" vectorEffect="non-scaling-stroke">
          {NODES.map((n, i) => (
            <motion.line
              key={n.key}
              x1="50"
              y1="50"
              x2={n.sx}
              y2={n.sy}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: "easeOut" }}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      {/* Hub */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-brand-teal/40 bg-brand-navy text-center shadow-xl">
          <span className="tech-value text-[10px] uppercase tracking-[0.2em] text-brand-teal-pale">
            Hub
          </span>
          <span className="mt-1 px-2 font-display text-[13px] font-extrabold leading-tight text-white">
            {t.home.networkHub}
          </span>
        </div>
      </motion.div>

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.key}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.25 + i * 0.1 }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-2 ps-2 pe-4 shadow-md">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
              <n.icon className="h-4 w-4 text-primary" aria-hidden={true} />
            </span>
            <span className="max-w-52 text-xs font-semibold leading-tight">{labels[n.key]}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Mobile/stacked fallback — same relationships as a simple list. */
export function NetworkList() {
  const { t } = useI18n();
  const items: Array<{ key: NodeDef["key"]; label: string }> = [
    { key: "Buyers", label: t.home.networkNodeBuyers },
    { key: "Distributors", label: t.home.networkNodeDistributors },
    { key: "Oem", label: t.home.networkNodeOem },
    { key: "Suppliers", label: t.home.networkNodeSuppliers },
    { key: "Technical", label: t.home.networkNodeTechnical },
  ];
  const icons: Record<NodeDef["key"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
    Buyers: Building2,
    Distributors: Share2,
    Oem: Factory,
    Suppliers: Package,
    Technical: FlaskConical,
  };
  return (
    <ul className="space-y-2.5 lg:hidden">
      {items.map((item) => {
        const Icon = icons[item.key];
        return (
          <li
            key={item.key}
            className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
              <Icon className="h-4.5 w-4.5 text-primary" aria-hidden={true} />
            </span>
            <span className="text-sm font-semibold">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

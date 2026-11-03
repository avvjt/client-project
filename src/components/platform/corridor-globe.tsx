"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useInView, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n/provider";

/**
 * WebGL corridor globe (cobe, ~13 kB gz-free). Renders the SAME eight export
 * corridors of interest + Bengaluru hub that the wireframe corridor map
 * visualises, as a draggable 3D sphere with hub→region arcs.
 *
 * Honesty boundaries kept identical to CorridorMap: corridors are labelled
 * "of interest"; region points are region-level centroids, activation is
 * confirmed per enquiry. No route volumes, transit times or client names.
 *
 * A11y / performance contract:
 *  - canvas is decorative (aria-hidden); the accessible corridor data lives
 *    in the section's CorridorLegend and this component's role="img" label,
 *    both driven by the existing i18n keys (zero new dictionary keys).
 *  - prefers-reduced-motion → no rotation, no drag physics: one static frame.
 *  - the rAF loop pauses off-screen and on hidden tabs.
 *  - pointer drag only advertises itself on (pointer: fine) devices.
 */

export type CorridorRegionKey =
  | "Asia"
  | "MiddleEast"
  | "SouthAmerica"
  | "Africa"
  | "Australia"
  | "Canada"
  | "Un"
  | "Eu";

/** Bengaluru hub — matches the wireframe map's hub node. */
const HUB: [number, number] = [12.97, 77.59];

/**
 * Region-level centroids, ordered to echo the wireframe map's relative
 * placement (Asia east of hub, EU north-west, Africa south-west, …).
 * Approximations are intentional: these mark regions, not facilities.
 */
const CORRIDOR_GEO: Record<CorridorRegionKey, [number, number]> = {
  Asia: [23, 103],
  MiddleEast: [25, 48],
  Eu: [49, 9],
  Africa: [4, 21],
  SouthAmerica: [-14, -58],
  Australia: [-25, 134],
  Canada: [57, -102],
  Un: [40.75, -73.98], // United Nations — New York
};

/* Brand colours as linear-ish sRGB triples for cobe. */
const SWISS_RED: [number, number, number] = [0.855, 0.161, 0.11]; // #DA291C
const TEAL: [number, number, number] = [0.067, 0.651, 0.627]; // #11A6A0
const TEAL_PALE: [number, number, number] = [0.451, 0.847, 0.804]; // #73D8CD

const BASE_SPIN = 0.0022; // rad/frame ≈ one revolution per ~48 s
const DRAG_SENSITIVITY = 0.0045; // rad per px of pointer travel

type Palette = {
  dark: number;
  baseColor: [number, number, number];
  glowColor: [number, number, number];
  atmosphere: number;
};

function paletteFor(resolvedTheme: string | undefined): Palette {
  // The sphere is a brand object: navy continents on both themes. Light mode
  // lifts the glow so the silhouette reads on the pale page background.
  if (resolvedTheme === "dark") {
    return {
      dark: 1,
      baseColor: [0.11, 0.18, 0.27],
      glowColor: [0.13, 0.22, 0.32],
      atmosphere: 0.9,
    };
  }
  return {
    dark: 0.35,
    baseColor: [0.09, 0.16, 0.25],
    glowColor: [0.72, 0.78, 0.82],
    atmosphere: 1.4,
  };
}

export function CorridorGlobe({ className }: { className?: string }) {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const frameRef = useRef(0);
  const phiRef = useRef(HUB[1] * (Math.PI / 180)); // start facing the hub
  const velRef = useRef(0);
  const dragRef = useRef<{ startX: number; startPhi: number } | null>(null);
  const [size, setSize] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(wrapRef, { margin: "120px" });

  const labels: Record<CorridorRegionKey, string> = {
    Asia: t.home.corridorAsia,
    MiddleEast: t.home.corridorMiddleEast,
    SouthAmerica: t.home.corridorSouthAmerica,
    Africa: t.home.corridorAfrica,
    Australia: t.home.corridorAustralia,
    Canada: t.home.corridorCanada,
    Un: t.home.corridorUn,
    Eu: t.home.corridorEu,
  };

  const ariaLabel = `${t.home.corridorsTitle} — ${t.home.corridorsOriginLabel}: ${Object.values(
    labels,
  ).join(", ")}`;

  /* Track container size (square) for the canvas backing store. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0]?.contentRect.width ?? 0);
      setSize((prev) => (Math.abs(prev - w) >= 2 ? w : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Create / update the globe whenever size or theme changes. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size < 80) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pal = paletteFor(resolvedTheme);
    const markers = [
      { id: "hub", location: HUB, size: 0.075, color: SWISS_RED },
      ...(
        Object.keys(CORRIDOR_GEO) as CorridorRegionKey[]
      ).map((key) => ({
        id: key,
        location: CORRIDOR_GEO[key],
        size: 0.042,
        color: TEAL_PALE,
      })),
    ];
    const arcs = (Object.keys(CORRIDOR_GEO) as CorridorRegionKey[]).map((key) => ({
      id: `arc-${key}`,
      from: HUB,
      to: CORRIDOR_GEO[key],
    }));
    const opts = {
      width: size,
      height: size,
      devicePixelRatio: dpr,
      phi: phiRef.current,
      theta: 0.26,
      dark: pal.dark,
      diffuse: 1.15,
      mapSamples: 17000,
      mapBrightness: 5.4,
      baseColor: pal.baseColor,
      markerColor: TEAL,
      glowColor: pal.glowColor,
      opacity: 0.98,
      markers,
      arcs,
      arcColor: TEAL,
      arcWidth: 0.32,
      arcHeight: 0.32,
    };
    if (globeRef.current) {
      globeRef.current.update(opts);
      return;
    }
    globeRef.current = createGlobe(canvas, opts);
    return () => {
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, [size, resolvedTheme]);

  /* We own the frame loop: base spin + drag inertia, paused off-screen. */
  useEffect(() => {
    if (!inView || size < 80) return;
    if (reduceMotion) {
      // One calm static frame — the globe already rendered on creation.
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!dragRef.current) {
        // Momentum decays back into the base spin.
        const spin = BASE_SPIN * (dt / 16.7);
        phiRef.current += spin + velRef.current;
        velRef.current *= 0.94;
        if (Math.abs(velRef.current) < spin * 0.4) velRef.current = 0;
      }
      globeRef.current?.update({ phi: phiRef.current });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
      } else {
        last = performance.now();
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [inView, size, reduceMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !inView) return;
    dragRef.current = { startX: e.clientX, startPhi: phiRef.current };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const next = drag.startPhi + (e.clientX - drag.startX) * DRAG_SENSITIVITY;
    velRef.current = (next - phiRef.current) * 0.4;
    phiRef.current = next;
    globeRef.current?.update({ phi: phiRef.current });
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "pan-y", cursor: dragging ? "grabbing" : "grab" }}
    >
      {size >= 80 && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="aspect-square w-full"
          style={{
            width: "100%",
            height: "100%",
            contain: "layout paint size",
          }}
        />
      )}
    </div>
  );
}

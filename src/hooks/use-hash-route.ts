"use client";

import { useEffect, useState } from "react";

export type Route =
  | { view: "home" }
  | { view: "products" }
  | { view: "product"; slug: string }
  | { view: "capabilities" }
  | { view: "quality" }
  | { view: "industries" }
  | { view: "supply" }
  | { view: "sustainability" }
  | { view: "company" }
  | { view: "leadership" }
  | { view: "investors" }
  | { view: "vendors" }
  | { view: "rnd" }
  | { view: "careers" }
  | { view: "aiTech" }
  | { view: "contact" }
  | { view: "rfq"; product?: string; intent?: string }
  | { view: "privacy" }
  | { view: "terms" }
  | { view: "notFound" };

export interface RouteState {
  route: Route;
  /** Stable key for view transition animations. */
  key: string;
}

/**
 * Internal SPA router over the URL hash. The public surface of this build is
 * the single `/` route (platform constraint); hash routes keep every view
 * deep-linkable and shareable (e.g. `#/products/surgical-gowns`, `#/rfq?product=…`).
 */
export function parseHash(hash: string): RouteState {
  const raw = hash.replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const query = new URLSearchParams(queryPart ?? "");

  if (segments.length === 0) return { route: { view: "home" }, key: "home" };

  switch (segments[0]) {
    case "products":
      return segments[1]
        ? { route: { view: "product", slug: segments[1] }, key: `product:${segments[1]}` }
        : { route: { view: "products" }, key: "products" };
    case "capabilities":
      return { route: { view: "capabilities" }, key: "capabilities" };
    case "quality":
      return { route: { view: "quality" }, key: "quality" };
    case "industries":
      return { route: { view: "industries" }, key: "industries" };
    case "supply":
      return { route: { view: "supply" }, key: "supply" };
    case "sustainability":
      return { route: { view: "sustainability" }, key: "sustainability" };
    case "company":
      return { route: { view: "company" }, key: "company" };
    case "leadership":
      return { route: { view: "leadership" }, key: "leadership" };
    case "investors":
      return { route: { view: "investors" }, key: "investors" };
    case "vendors":
      return { route: { view: "vendors" }, key: "vendors" };
    case "rnd":
      return { route: { view: "rnd" }, key: "rnd" };
    case "careers":
      return { route: { view: "careers" }, key: "careers" };
    case "ai-tech":
      return { route: { view: "aiTech" }, key: "aiTech" };
    case "contact":
      return { route: { view: "contact" }, key: "contact" };
    case "rfq": {
      const product = query.get("product") ?? undefined;
      const intent = query.get("intent") ?? undefined;
      return { route: { view: "rfq", product, intent }, key: `rfq:${product ?? ""}:${intent ?? ""}` };
    }
    case "privacy":
      return { route: { view: "privacy" }, key: "privacy" };
    case "terms":
      return { route: { view: "terms" }, key: "terms" };
    default:
      return { route: { view: "notFound" }, key: "notFound" };
  }
}

export function useHashRoute(): RouteState {
  // Always start from "home" on both server and client so SSR markup and the
  // first client render match (prevents a hydration mismatch on deep links like
  // /#/products — the correct view is synced right after hydration below).
  const [state, setState] = useState<RouteState>({ route: { view: "home" }, key: "home" });

  useEffect(() => {
    // Sync the real route one frame after hydration (SSR always renders
    // "home"; deep links resolve without a hydration mismatch).
    const raf = requestAnimationFrame(() => setState(parseHash(window.location.hash)));
    const onChange = () => setState(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  return state;
}

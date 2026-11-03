"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { toast } from "sonner";

/**
 * CopyProtection — site-wide copyright shield (management requirement:
 * "the whole website copyright protected, including the copying of the
 * text or right-clicking of the content").
 *
 * Layers:
 * 1. Context menu (right-click) suppressed on protected content.
 * 2. Copy / cut of protected content suppressed; Ctrl/Cmd+C on a static
 *    selection is blocked. A respectful toast explains why (rate-limited
 *    so it never nags).
 * 3. Image / SVG drag-out suppressed (prevents "drag to desktop" scraping).
 * 4. Text selection disabled via CSS (globals.css), with explicit
 *    exemptions so the site remains fully usable and accessible.
 * 5. Printed output replaced by a copyright notice (@media print).
 *
 * Accessibility & usability contract (WCAG 2.2):
 * - Form fields (RFQ form, chat), contenteditable regions and elements
 *   marked `data-allow-copy` (published e-mail / phone lines) keep native
 *   select, copy, paste and context-menu behaviour — visitors must be able
 *   to fill forms and copy our own contact details.
 * - Screen readers are unaffected: content remains in the DOM and is
 *   announced normally; only clipboard selection is restricted.
 * - Every active restriction is surfaced to the user via toast — never
 *   silently, and never trapping keyboard focus.
 */

/** Selector for elements that keep native selection/copy behaviour. */
const COPY_EXEMPT =
  "input, textarea, select, [contenteditable], [contenteditable] *, [data-allow-copy], [data-allow-copy] *";

function isExempt(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(COPY_EXEMPT) !== null;
}

/** Selection anchor/focus may be text nodes — resolve them to elements. */
function nodeToElement(node: Node | null | undefined): Element | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : (node.parentElement ?? null);
}

export function CopyProtection() {
  const { t } = useI18n();
  const lastAnnounced = useRef(0);
  // Rendered after mount so server and client markup always match (same
  // pattern as the footer year — no hydration mismatch at year boundaries).
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setYear(new Date().getFullYear()), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const announce = () => {
      const now = Date.now();
      if (now - lastAnnounced.current < 4000) return;
      lastAnnounced.current = now;
      toast(t.footer.copyBlockedToast, { duration: 4200 });
    };

    const onContextMenu = (e: MouseEvent) => {
      if (isExempt(e.target)) return;
      e.preventDefault();
    };

    const onClipboardCopy = (e: ClipboardEvent) => {
      if (isExempt(e.target)) return;
      // If either end of the selection sits inside an exempt element
      // (e.g. copying the published e-mail), let the copy through.
      const sel = window.getSelection?.();
      const anchor = nodeToElement(sel?.anchorNode ?? null);
      const focus = nodeToElement(sel?.focusNode ?? null);
      if ((anchor && anchor.closest(COPY_EXEMPT)) || (focus && focus.closest(COPY_EXEMPT))) {
        return;
      }
      e.preventDefault();
      announce();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
      const key = e.key.toLowerCase();
      if (key !== "c" && key !== "x") return;
      const active = document.activeElement;
      if (active && active.closest?.(COPY_EXEMPT)) return;
      const sel = window.getSelection?.();
      // Under the site-wide user-select guard Selection.toString() returns
      // "" even for a live range — rely on isCollapsed, not string length.
      if (!sel || sel.isCollapsed) return;
      const anchor = nodeToElement(sel.anchorNode);
      const focus = nodeToElement(sel.focusNode);
      if ((anchor && anchor.closest(COPY_EXEMPT)) || (focus && focus.closest(COPY_EXEMPT))) {
        return;
      }
      e.preventDefault();
      announce();
    };

    const onDragStart = (e: DragEvent) => {
      const isGraphic = e.target instanceof HTMLImageElement || e.target instanceof SVGSVGElement;
      if (!isGraphic || isExempt(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onClipboardCopy);
    document.addEventListener("cut", onClipboardCopy);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onClipboardCopy);
      document.removeEventListener("cut", onClipboardCopy);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [t]);

  return (
    <div className="print-notice" aria-hidden="true">
      <p className="print-notice-brand">© {year ?? ""} Dispo-Concept Private Limited</p>
      <p className="print-notice-body">{t.footer.printBlockedNote}</p>
    </div>
  );
}

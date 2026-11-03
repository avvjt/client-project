"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/platform/blocks";
import { ProductCard } from "@/components/platform/product-card";
import { PRODUCT_FAMILIES } from "@/content/products";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

type FamilyKey = keyof ReturnType<typeof useI18n>["t"]["products"]["familyNames"];

export function ProductsView() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyKey | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_FAMILIES.filter((p) => {
      if (family !== "all" && p.key !== family) {
        return false;
      }
      if (!q) return true;
      const item = t.products.items[p.key];
      const haystack = [item.name, item.short, item.long, t.products.familyNames[p.key], ...p.variants.map((v) => v.name)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, family, t]);

  const families = Object.entries(t.products.familyNames) as Array<[FamilyKey, string]>;

  return (
    <>
      <PageHero eyebrow={t.nav.alias.products} title={t.products.title} subtitle={t.products.subtitle} />

      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-md">
              <label htmlFor="product-search" className="mb-1.5 block text-sm font-medium">
                {t.products.searchLabel}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.products.searchPlaceholder}
                  className="min-h-11 ps-9"
                />
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <p className="mb-1.5 text-sm font-medium" id="family-filter-label">
                {t.products.familyFilterLabel}
              </p>
              <div
                role="group"
                aria-labelledby="family-filter-label"
                className="flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  onClick={() => setFamily("all")}
                  aria-pressed={family === "all"}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    family === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "tab-glow-red border-border bg-card text-muted-foreground"
                  )}
                >
                  {t.products.allFamilies}
                </button>
                {families.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFamily(key)}
                    aria-pressed={family === key}
                    className={cn(
                      "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                      family === key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "tab-glow-red border-border bg-card text-muted-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count — announced to screen readers */}
          <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
            {results.length === 1
              ? t.products.resultsOne
              : `${results.length} ${t.products.resultsMany}`}
          </p>

          {/* Grid */}
          {results.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  familyLabel={t.products.familyNames[p.key]}
                  priority={i < 2}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-bold">{t.products.noResultsTitle}</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{t.products.noResultsBody}</p>
              <Button asChild variant="cta" className="mt-5 min-h-11">
                <a href="#/rfq">{t.common.requestQuotation}</a>
              </Button>
              <Button
                variant="ghost"
                className="mt-2 min-h-11"
                onClick={() => {
                  setQuery("");
                  setFamily("all");
                }}
              >
                {t.products.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

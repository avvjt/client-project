"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileUp, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rfqSchema, fileExtensionOf, RFQ_UPLOAD } from "@/lib/rfq-schema";
import type { RfqFieldErrorCode, RfqErrorCode } from "@/lib/rfq-schema";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { PRODUCT_FAMILIES } from "@/content/products";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<string, RfqFieldErrorCode>>;

interface FormState {
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  buyerType: string;
  productCategory: string;
  productCode: string;
  quantity: string;
  technicalRequirements: string;
  packagingRequirements: string;
  deliveryTimeframe: string;
  consent: boolean;
}

const INITIAL: FormState = {
  organization: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  buyerType: "",
  productCategory: "",
  productCode: "",
  quantity: "",
  technicalRequirements: "",
  packagingRequirements: "",
  deliveryTimeframe: "",
  consent: false,
};

export function RfqForm({ prefillSlug, intent }: { prefillSlug?: string; intent?: string }) {
  const { t, locale } = useI18n();
  const docsIntent = intent === "docs";
  const [values, setValues] = useState<FormState>(INITIAL);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<RfqErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Prefill product category from catalogue selection (e.g. #/rfq?product=surgical-gowns).
  // `t` is a dependency on purpose: after a language switch the prefilled
  // product name must follow the new locale instead of staying stale.
  useEffect(() => {
    if (prefillSlug) {
      const fam = PRODUCT_FAMILIES.find((p) => p.slug === prefillSlug);
      if (fam) {
        setValues((v) => ({
          ...v,
          productCategory: fam.key,
          productCode: t.products.items[fam.key]?.name ?? v.productCode,
        }));
      }
    }
  }, [prefillSlug, t]);

  // Documentation intent (e.g. #/rfq?product=surgical-gowns&intent=docs):
  // prefill the technical field with the documentation-request template so the
  // "Request Documentation" CTA produces a visibly different enquiry.
  useEffect(() => {
    if (docsIntent) {
      setValues((v) => ({
        ...v,
        technicalRequirements: v.technicalRequirements || t.rfq.docsIntentTemplate,
      }));
    }
  }, [docsIntent, t]);

  const categoryOptions = useMemo(
    () => [
      ...PRODUCT_FAMILIES.map((p) => ({ value: p.key, label: t.products.familyNames[p.key] })),
      { value: "other" as const, label: t.rfq.categories.other },
    ],
    [t]
  );

  const buyerOptions = (
    Object.entries(t.rfq.buyerTypes) as Array<[string, string]>
  ).map(([value, label]) => ({ value, label }));

  const deliveryOptions = (
    Object.entries(t.rfq.deliveryOptions) as Array<[string, string]>
  ).map(([value, label]) => ({ value, label }));

  // Radix Select resolves the trigger label from click-registered items; a
  // programmatically prefilled value (e.g. ?product=surgical-gowns) has no
  // registered text, so the trigger would fall back to the placeholder even
  // though the value is set. Explicit children fix the display.
  const categoryLabel = categoryOptions.find((o) => o.value === values.productCategory)?.label;
  const buyerLabel = buyerOptions.find((o) => o.value === values.buyerType)?.label;
  const deliveryLabel = deliveryOptions.find((o) => o.value === values.deliveryTimeframe)?.label;

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function errorMessage(field: string, code: RfqFieldErrorCode): string {
    switch (code) {
      case "REQUIRED":
        return t.rfq.errRequired;
      case "SHORT":
        return t.rfq.errShort;
      case "LONG":
        return t.rfq.errLong;
      case "EMAIL":
        return t.rfq.errEmail;
      case "CHOICE":
        return t.rfq.errChoice;
      case "CONSENT":
        return t.rfq.errConsent;
      default:
        return t.rfq.errRequired;
    }
  }

  /** Move keyboard focus to the first invalid field and announce the summary. */
  function focusFirstInvalid(fieldErrors: FieldErrors) {
    const firstKey = Object.keys(fieldErrors)[0];
    if (!firstKey) return;
    // Most fields render with id `rfq-<name>`; three render with shortened ids.
    const idMap: Record<string, string> = {
      productCategory: "rfq-category",
      technicalRequirements: "rfq-technical",
      deliveryTimeframe: "rfq-delivery",
    };
    requestAnimationFrame(() => {
      document.getElementById(idMap[firstKey] ?? `rfq-${firstKey}`)?.focus();
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    // Client-side validation with the shared schema.
    const parsed = rfqSchema.safeParse({ ...values, locale });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as RfqFieldErrorCode;
      }
      setErrors(fieldErrors);
      focusFirstInvalid(fieldErrors);
      return;
    }

    // Attachment pre-checks for fast feedback.
    if (file) {
      const ext = fileExtensionOf(file.name);
      if (!RFQ_UPLOAD.allowedExtensions.includes(ext)) {
        setFormError("FILE_TYPE");
        return;
      }
      if (file.size > RFQ_UPLOAD.maxBytes) {
        setFormError("FILE_TOO_LARGE");
        return;
      }
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(parsed.data).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("startedAt", String(startedAt.current));
      fd.append("company_website", ""); // honeypot — humans leave it empty
      if (file) fd.append("attachment", file);

      // reCAPTCHA v3 (no-op token when the site key is not configured).
      const captchaToken = await getRecaptchaToken("rfq_submit");
      if (captchaToken) fd.append("recaptchaToken", captchaToken);

      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; reference?: string; code?: RfqErrorCode; fields?: FieldErrors };

      if (res.ok && json.ok && json.reference) {
        setReference(json.reference);
        return;
      }
      if (json.code === "VALIDATION" && json.fields) {
        setErrors(json.fields);
        focusFirstInvalid(json.fields);
      } else if (json.code) {
        setFormError(json.code);
      } else {
        setFormError("SERVER");
      }
    } catch {
      setFormError("SERVER");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setValues(INITIAL);
    setFile(null);
    setErrors({});
    setFormError(null);
    setReference(null);
    startedAt.current = Date.now();
  }

  const errProps = (field: string) =>
    errors[field]
      ? ({ "aria-invalid": true, "aria-describedby": `rfq-${field}-error` } as const)
      : {};

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <p id={`rfq-${field}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-destructive">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errorMessage(field, errors[field]!)}
      </p>
    );
  }

  /* ---------- Success state ---------- */
  if (reference) {
    return (
      <div
        className="rounded-xl border border-brand-teal/40 bg-card p-8 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h3 className="text-fluid-h3 mt-4 font-display font-bold">{t.rfq.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {t.rfq.successBody}
        </p>
        <div className="mx-auto mt-5 w-fit rounded-lg border border-border bg-secondary px-5 py-3">
          <p className="tech-value text-xs uppercase tracking-widest text-muted-foreground">
            {t.rfq.successRefLabel}
          </p>
          <p className="tech-value mt-1 text-xl font-semibold tracking-wide text-primary">{reference}</p>
        </div>
        <p className="tech-value mx-auto mt-3 max-w-sm text-xs text-muted-foreground">{t.rfq.referenceNote}</p>
        <Button variant="outline" onClick={reset} className="mt-6 min-h-11">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.rfq.newRequest}
        </Button>
      </div>
    );
  }

  /* ---------- Form ---------- */
  const inputCls = "min-h-11 bg-background";

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {formError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-destructive">
            {formError === "RATE_LIMITED"
              ? t.rfq.errRateLimited
              : formError === "CAPTCHA"
                ? t.rfq.errCaptcha
                : formError === "FILE_TYPE"
                  ? t.rfq.errFileType
                  : formError === "FILE_TOO_LARGE"
                    ? t.rfq.errFileSize
                    : t.rfq.errServer}
          </p>
        </div>
      )}

      <h3 className="text-fluid-h3 font-display font-bold">{t.rfq.formTitle}</h3>

      {docsIntent && (
        <p
          className="mt-4 flex items-center gap-2.5 rounded-lg border border-brand-teal/40 bg-accent px-4 py-3 text-sm font-medium text-foreground"
          role="note"
        >
          <FileUp className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {t.products.detailCtaDocs}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Organization */}
        <div className="sm:col-span-2">
          <Label htmlFor="rfq-organization">{t.rfq.org} *</Label>
          <Input
            id="rfq-organization"
            name="organization"
            autoComplete="organization"
            value={values.organization}
            onChange={(e) => set("organization", e.target.value)}
            placeholder={t.rfq.orgPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.organization && "border-destructive")}
            {...errProps("organization")}
          />
          <FieldError field="organization" />
        </div>

        {/* Contact name */}
        <div>
          <Label htmlFor="rfq-contactName">{t.rfq.contactName} *</Label>
          <Input
            id="rfq-contactName"
            name="contactName"
            autoComplete="name"
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder={t.rfq.contactNamePlaceholder}
            className={cn(inputCls, "mt-1.5", errors.contactName && "border-destructive")}
            {...errProps("contactName")}
          />
          <FieldError field="contactName" />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="rfq-email">{t.rfq.email} *</Label>
          <Input
            id="rfq-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder={t.rfq.emailPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.email && "border-destructive")}
            {...errProps("email")}
          />
          <FieldError field="email" />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="rfq-phone">
            {t.rfq.phone} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Input
            id="rfq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder={t.rfq.phonePlaceholder}
            className={cn(inputCls, "mt-1.5")}
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="rfq-country">{t.rfq.country} *</Label>
          <Input
            id="rfq-country"
            name="country"
            autoComplete="country-name"
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder={t.rfq.countryPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.country && "border-destructive")}
            {...errProps("country")}
          />
          <FieldError field="country" />
        </div>

        {/* Buyer type */}
        <div>
          <Label htmlFor="rfq-buyerType">{t.rfq.buyerType} *</Label>
          <Select
            value={values.buyerType}
            onValueChange={(v) => {
              // Radix's hidden native <select> can emit an empty change while
              // its option list registers (closed content) — never let an empty
              // emission clobber a prefilled/selected value.
              if (v) set("buyerType", v);
            }}
          >
            <SelectTrigger
              id="rfq-buyerType"
              className={cn("mt-1.5 min-h-11 w-full", errors.buyerType && "border-destructive")}
              aria-invalid={Boolean(errors.buyerType)}
              aria-describedby={errors.buyerType ? "rfq-buyerType-error" : undefined}
            >
              <SelectValue placeholder={t.rfq.selectPlaceholder}>{buyerLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {buyerOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="buyerType" />
        </div>

        {/* Product category */}
        <div>
          <Label htmlFor="rfq-category">{t.rfq.category} *</Label>
          <Select
            value={values.productCategory}
            onValueChange={(v) => {
              if (v) set("productCategory", v);
            }}
          >
            <SelectTrigger
              id="rfq-category"
              className={cn("mt-1.5 min-h-11 w-full", errors.productCategory && "border-destructive")}
              aria-invalid={Boolean(errors.productCategory)}
              aria-describedby={errors.productCategory ? "rfq-productCategory-error" : undefined}
            >
              <SelectValue placeholder={t.rfq.selectPlaceholder}>{categoryLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="productCategory" />
        </div>

        {/* Product code */}
        <div>
          <Label htmlFor="rfq-productCode">
            {t.rfq.productCode} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Input
            id="rfq-productCode"
            name="productCode"
            value={values.productCode}
            onChange={(e) => set("productCode", e.target.value)}
            placeholder={t.rfq.productCodePlaceholder}
            className={cn(inputCls, "mt-1.5")}
          />
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor="rfq-quantity">{t.rfq.quantity} *</Label>
          <Input
            id="rfq-quantity"
            name="quantity"
            value={values.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder={t.rfq.quantityPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.quantity && "border-destructive")}
            {...errProps("quantity")}
          />
          <FieldError field="quantity" />
        </div>

        {/* Technical requirements */}
        <div className="sm:col-span-2">
          <Label htmlFor="rfq-technical">{t.rfq.technical} *</Label>
          <Textarea
            id="rfq-technical"
            name="technicalRequirements"
            rows={5}
            value={values.technicalRequirements}
            onChange={(e) => set("technicalRequirements", e.target.value)}
            placeholder={t.rfq.technicalPlaceholder}
            className={cn("mt-1.5 bg-background", errors.technicalRequirements && "border-destructive")}
            {...errProps("technicalRequirements")}
          />
          <FieldError field="technicalRequirements" />
        </div>

        {/* Packaging */}
        <div className="sm:col-span-2">
          <Label htmlFor="rfq-packaging">
            {t.rfq.packaging} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Textarea
            id="rfq-packaging"
            name="packagingRequirements"
            rows={2}
            value={values.packagingRequirements}
            onChange={(e) => set("packagingRequirements", e.target.value)}
            placeholder={t.rfq.packagingPlaceholder}
            className="mt-1.5 bg-background"
          />
        </div>

        {/* Delivery timeframe */}
        <div>
          <Label htmlFor="rfq-delivery">{t.rfq.delivery} *</Label>
          <Select
            value={values.deliveryTimeframe}
            onValueChange={(v) => {
              if (v) set("deliveryTimeframe", v);
            }}
          >
            <SelectTrigger
              id="rfq-delivery"
              className={cn("mt-1.5 min-h-11 w-full", errors.deliveryTimeframe && "border-destructive")}
              aria-invalid={Boolean(errors.deliveryTimeframe)}
              aria-describedby={errors.deliveryTimeframe ? "rfq-deliveryTimeframe-error" : undefined}
            >
              <SelectValue placeholder={t.rfq.selectPlaceholder}>{deliveryLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="deliveryTimeframe" />
        </div>

        {/* Attachment */}
        <div>
          <Label htmlFor="rfq-attachment">
            {t.rfq.attachment} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <label
            htmlFor="rfq-attachment"
            className="mt-1.5 flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md border border-dashed border-input bg-background px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-brand-teal/60 hover:bg-accent/50"
          >
            <FileUp className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">
              {file ? `${t.rfq.attachmentSelected}: ${file.name}` : t.rfq.attachmentButton}
            </span>
          </label>
          <input
            id="rfq-attachment"
            name="attachment"
            type="file"
            accept={RFQ_UPLOAD.allowedExtensions.map((e) => `.${e}`).join(",")}
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.rfq.attachmentHelp}</p>
        </div>

        {/* Consent */}
        <div className="sm:col-span-2">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4">
            <Checkbox
              id="rfq-consent"
              checked={values.consent}
              onCheckedChange={(checked) => set("consent", checked === true)}
              className="mt-0.5"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "rfq-consent-error" : undefined}
            />
            <div>
              <Label htmlFor="rfq-consent" className="text-[13px] font-medium leading-relaxed">
                {t.rfq.consentText} *
              </Label>
              <FieldError field="consent" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{t.rfq.responseNote}</p>
        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="min-h-12 min-w-44">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.rfq.submitting}
            </>
          ) : (
            t.rfq.submit
          )}
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t.rfq.privacyNote}</p>

      {/* Honeypot — hidden from humans, catches dumb bots */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="rfq-hp">Company website</label>
        <input id="rfq-hp" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
    </form>
  );
}

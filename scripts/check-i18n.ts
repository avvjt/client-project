/**
 * i18n structural parity checker.
 * Verifies every locale dictionary has exactly the same leaf-key tree as the
 * English source of truth, with no missing, extra, or empty string values.
 * Also detects duplicate keys at source level (which silently collapse at
 * runtime) and placeholder-token mismatches (e.g. {n}/{total} drift).
 *
 * Usage:
 *   bun scripts/check-i18n.ts            # check all locales
 *   bun scripts/check-i18n.ts fr de      # check only the listed locales
 */
import { readFileSync } from "fs";
import en from "../src/lib/i18n/dictionaries/en";
import fr from "../src/lib/i18n/dictionaries/fr";
import de from "../src/lib/i18n/dictionaries/de";
import es from "../src/lib/i18n/dictionaries/es";
import nl from "../src/lib/i18n/dictionaries/nl";
import ar from "../src/lib/i18n/dictionaries/ar";
import zh from "../src/lib/i18n/dictionaries/zh";

type DictNode = Record<string, unknown>;

function leafPaths(obj: DictNode, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...leafPaths(value as DictNode, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
}

function leafValues(obj: DictNode, prefix = ""): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nested = leafValues(value as DictNode, path);
      for (const [k, v] of nested) map.set(k, v);
    } else if (typeof value === "string") {
      map.set(path, value);
    }
  }
  return map;
}

/**
 * Source-level duplicate key detection: parses the raw file text and tracks
 * the parent path of every `key:` line by indentation. Object.entries in the
 * compiled module silently collapses duplicates, so this must read the source.
 */
function duplicateKeys(filePath: string): string[] {
  const text = readFileSync(filePath, "utf8") as string;
  const stack: Array<{ indent: number; key: string }> = [];
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const line of text.split("\n")) {
    const match = line.match(/^(\s*)([A-Za-z0-9_]+)\s*:\s*/);
    if (!match) continue;
    const indent = match[1].length;
    const key = match[2];
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
    const path = [...stack.map((s) => s.key), key].join(".");
    if (seen.has(path)) dupes.add(path);
    seen.add(path);
    // Only object keys (value continues on following lines) push the stack;
    // inline `key: "value"` lines are leaves and must not become parents.
    const rest = line.slice(line.indexOf(":") + 1).trim();
    if (rest === "" || rest === "{") stack.push({ indent, key });
  }
  return [...dupes];
}

const PLACEHOLDER_RE = /\{[a-zA-Z]+\}/g;

const ALL: Array<[string, DictNode, string]> = [
  ["fr", fr as unknown as DictNode, "src/lib/i18n/dictionaries/fr.ts"],
  ["de", de as unknown as DictNode, "src/lib/i18n/dictionaries/de.ts"],
  ["es", es as unknown as DictNode, "src/lib/i18n/dictionaries/es.ts"],
  ["nl", nl as unknown as DictNode, "src/lib/i18n/dictionaries/nl.ts"],
  ["ar", ar as unknown as DictNode, "src/lib/i18n/dictionaries/ar.ts"],
  ["zh", zh as unknown as DictNode, "src/lib/i18n/dictionaries/zh.ts"],
];

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = args.length > 0 ? ALL.filter(([name]) => args.includes(name)) : ALL;

const enKeys = new Set(leafPaths(en as unknown as DictNode));
const enValues = leafValues(en as unknown as DictNode);
let failed = false;

for (const [name, dict, file] of targets) {
  const keys = leafPaths(dict);
  const keySet = new Set(keys);
  const missing = [...enKeys].filter((k) => !keySet.has(k));
  const extra = keys.filter((k) => !enKeys.has(k));
  const empty = keys.filter((k) => {
    const v = k.split(".").reduce<unknown>((acc, part) => (acc as DictNode | undefined)?.[part], dict);
    return typeof v === "string" && v.trim() === "";
  });
  const dupes = duplicateKeys(file);
  // Placeholder tokens such as {n} / {total} must survive translation.
  const placeholderDrift: string[] = [];
  const values = leafValues(dict);
  for (const [k, enVal] of enValues) {
    const locVal = values.get(k);
    if (locVal === undefined) continue;
    const enTokens = (enVal.match(PLACEHOLDER_RE) ?? []).sort().join(",");
    const locTokens = (locVal.match(PLACEHOLDER_RE) ?? []).sort().join(",");
    if (enTokens !== locTokens) placeholderDrift.push(k);
  }

  if (missing.length === 0 && extra.length === 0 && empty.length === 0 && dupes.length === 0 && placeholderDrift.length === 0) {
    console.log(`✓ ${name}: parity OK (${keys.length} leaf keys)`);
    continue;
  }

  failed = true;
  console.error(`✗ ${name}:`);
  if (missing.length > 0) console.error(`  missing (${missing.length}): ${missing.join(", ")}`);
  if (extra.length > 0) console.error(`  extra (${extra.length}): ${extra.join(", ")}`);
  if (empty.length > 0) console.error(`  empty (${empty.length}): ${empty.join(", ")}`);
  if (dupes.length > 0) console.error(`  duplicate keys (${dupes.length}): ${dupes.join(", ")}`);
  if (placeholderDrift.length > 0) console.error(`  placeholder drift (${placeholderDrift.length}): ${placeholderDrift.join(", ")}`);
}

process.exit(failed ? 1 : 0);

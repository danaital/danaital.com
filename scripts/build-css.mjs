/* =============================================================================
   build-css.mjs — assemble assets/styles.css from the global base layer plus
   the per-component css`` blocks colocated in src/main.ts.

   Why this exists: the site is framework-free static output (see README), so we
   can't use styled-components (needs React + a runtime that injects <style> tags,
   which also fights the strict CSP). Instead styles are AUTHORED next to their
   components via a css`` tagged template, and this build step extracts them into
   one plain stylesheet at compile time — same ergonomics, zero runtime cost.

   Run by `npm run build` (after tsc). Deterministic: no timestamps, so the
   output only changes when the CSS does.
   ========================================================================== */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(root, "src", "styles", "base.css");
const SOURCE = join(root, "src", "main.ts");
const OUT = join(root, "assets", "styles.css");
const MARKER = "@@COMPONENTS@@";

/**
 * Pull the contents of every css`...` tagged-template literal out of the source.
 * Kept intentionally simple: our css`` blocks are plain CSS with no `${}`
 * interpolation and no stray backticks, so a backtick-delimited scan is exact.
 * If someone adds an interpolation, fail loudly rather than emit wrong CSS.
 */
function extractCssBlocks(src) {
  const blocks = [];
  // Match css` only as a statement-position tagged template: start of a line
  // followed by optional indentation. This deliberately ignores prose mentions
  // of css`` inside `//`/`*` comments (which sit mid-line, not at line start).
  const re = /^[ \t]*css`/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index + m[0].length; // just past the opening backtick
    const end = src.indexOf("`", start);
    if (end === -1) throw new Error("build-css: unterminated css`` template in src/main.ts");
    const body = src.slice(start, end);
    if (body.includes("${")) {
      throw new Error(
        "build-css: css`` block contains a ${} interpolation, which this build " +
          "step does not resolve. Keep colocated CSS static (use CSS custom " +
          "properties for dynamic values)."
      );
    }
    blocks.push(body.trim());
    re.lastIndex = end + 1;
  }
  return blocks;
}

const base = readFileSync(BASE, "utf8");
const markerCount = base.split(MARKER).length - 1;
if (markerCount !== 1) {
  throw new Error(
    `build-css: expected exactly one ${MARKER} marker in src/styles/base.css, found ${markerCount}. ` +
      `(A second occurrence — e.g. in a comment — would cause components to be injected in the wrong place.)`
  );
}

const blocks = extractCssBlocks(readFileSync(SOURCE, "utf8"));
if (blocks.length === 0) {
  throw new Error("build-css: no css`` blocks found in src/main.ts — refusing to emit a stylesheet missing component styles");
}

// Splice the joined component blocks in where the marker sits, preserving the
// explanatory comment lines around it.
const components = blocks.join("\n\n");
const out =
  "/* WARNING: GENERATED FILE - do not edit by hand.\n" +
  "   Global styles: src/styles/base.css | component styles: css blocks in src/main.ts\n" +
  "   Rebuild with: npm run build */\n" +
  base.replace(MARKER, components);

writeFileSync(OUT, out);
console.log(`build-css: wrote ${OUT} (${blocks.length} component blocks, ${out.length} bytes)`);

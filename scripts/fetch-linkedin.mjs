#!/usr/bin/env node
/*
 * Fetch recent LinkedIn posts via a third-party scraping API and write
 * assets/posts.json (consumed at runtime by the Writing section).
 *
 * ToS note: scraping LinkedIn is against LinkedIn's Terms of Service. This is
 * used here, by the site owner's explicit choice, for their OWN public posts.
 * It uses a third-party *service* API key (Apify) — never a LinkedIn password,
 * and it never logs a browser into LinkedIn.
 *
 * Safe by default: if the API key / profile URL is missing, or the call fails,
 * or nothing is returned, it logs and exits 0 WITHOUT touching posts.json.
 *
 * Env:
 *   LINKEDIN_PROFILE_URL  (required)  e.g. https://www.linkedin.com/in/tal-danai/
 *   APIFY_TOKEN           (required)  Apify API token (repo secret)
 *   APIFY_ACTOR           (optional)  Apify actor id, default below — set to the
 *                                     LinkedIn-profile-posts actor you chose.
 *   MAX_POSTS             (optional)  default 8
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "assets", "posts.json");

const PROFILE = process.env.LINKEDIN_PROFILE_URL || "";
const TOKEN = process.env.APIFY_TOKEN || "";
const ACTOR = process.env.APIFY_ACTOR || "apimaestro~linkedin-profile-posts";
const MAX = parseInt(process.env.MAX_POSTS || "8", 10);

const log = (m) => console.log("[linkedin-sync] " + m);

if (!TOKEN || !PROFILE) {
  log("APIFY_TOKEN or LINKEDIN_PROFILE_URL not set — skipping (posts.json unchanged).");
  process.exit(0);
}

const pick = (o, keys) => {
  for (const k of keys) if (o && o[k]) return o[k];
  return "";
};
const toISO = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};
const clip = (s, n) => {
  s = (s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
};

const url =
  `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items` +
  `?token=${TOKEN}&maxItems=${MAX}`;
// Common input keys across LinkedIn-posts actors — extra keys are ignored by actors.
const input = { username: PROFILE, profileUrls: [PROFILE], maxPosts: MAX, limit: MAX };

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    log(`scraper API returned HTTP ${res.status} — posts.json unchanged.`);
    process.exit(0);
  }
  const items = await res.json();
  if (!Array.isArray(items) || items.length === 0) {
    log("no posts returned — posts.json unchanged.");
    process.exit(0);
  }

  const posts = items
    .slice(0, MAX)
    .map((it) => {
      const text = pick(it, ["text", "postText", "content", "commentary", "description"]);
      const link = pick(it, ["url", "postUrl", "link", "postLink", "shareUrl"]);
      const date = toISO(pick(it, ["postedAtISO", "postedAt", "publishedAt", "date", "time", "datePublished"]));
      return {
        title: clip((text.split("\n")[0] || "").trim() || "LinkedIn post", 70),
        excerpt: clip(text, 180),
        date,
        link: link || PROFILE,
      };
    })
    .filter((p) => p.link);

  if (posts.length === 0) {
    log("could not map any posts — posts.json unchanged.");
    process.exit(0);
  }

  writeFileSync(OUT, JSON.stringify(posts, null, 2) + "\n");
  log(`wrote ${posts.length} posts to assets/posts.json`);
} catch (e) {
  log("error: " + (e && e.message ? e.message : e) + " — posts.json unchanged.");
  process.exit(0);
}

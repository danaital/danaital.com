# danaital.com — Tal Danai's personal site

A personal website written in **TypeScript**, compiled to static JS and
deployed to **GitHub Pages** at <https://danaital.com>.

## Stack & structure

- `index.html` + `assets/styles.css` — markup and styles.
- **`src/data.ts`** — all site content (projects, skills, experience, education,
  certificates, writing/LinkedIn posts, contact, config).
- **`src/main.ts`** — rendering + interactions (toasts, contact form, etc.).
- `tsc` compiles `src/*.ts` → `assets/*.js` (config in `tsconfig.json`).

## Editing content

Edit **[`src/data.ts`](src/data.ts)**, then build, commit, and push — CI rebuilds
and GitHub Pages redeploys automatically.

```bash
npm install        # once
npm run build      # compile src/*.ts -> assets/*.js   (npm run watch for live)
```

- **Projects** — entries in the `projects` array. Omit `link` (or `""`) for a
  "Private repository" label. Set `showRepos: true` to list multiple repos.
  `inquire: true` adds an "Inquire about this" link; `demo` adds a "Live demo" link.
- **Experience** — `experience.development` / `experience.teaching` arrays.
- **Education / Certificates** — `education` / `certificates` arrays.
- **Writing** — `posts` array (empty → LinkedIn call-to-action).
- **Contact / form** — `contacts` array and `config` (Web3Forms key, ntfy topic).

## LinkedIn posts (Writing section)

The Writing section renders from **`assets/posts.json`** (fetched at runtime), so
posts update without a rebuild. It's filled automatically by a nightly job
([`.github/workflows/linkedin-sync.yml`](.github/workflows/linkedin-sync.yml)) that
runs [`scripts/fetch-linkedin.mjs`](scripts/fetch-linkedin.mjs) → scrapes the
owner's own public LinkedIn posts via a third-party API (Apify) → writes
`posts.json` → commits (which redeploys).

**One-time setup** — add repo secrets (Settings → Secrets and variables → Actions):
- `APIFY_TOKEN` — your Apify API token.
- `LINKEDIN_PROFILE_URL` — e.g. `https://www.linkedin.com/in/tal-danai/`.
- `APIFY_ACTOR` *(optional)* — the LinkedIn-profile-posts actor id you chose
  (default `apimaestro~linkedin-profile-posts`; verify/adjust per your actor).
- `NTFY_TOPIC` *(optional)* — phone ping after a sync.

You can also just hand-edit `assets/posts.json` (array of
`{ title, excerpt, date, link }`). Without the secrets the job no-ops and the
section shows a "Read my posts on LinkedIn" call-to-action.

> ⚠️ Note: scraping LinkedIn is against LinkedIn's ToS — used here, by choice, only
> for the owner's own public posts via a service API key (never a LinkedIn login).
> Proxycurl/Nubela is a drop-in alternative provider if preferred.

## Local preview

```bash
npm run build
node .claude/server.js     # serves on http://localhost:8123
```

## Deployment

GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
runs `npm ci && npm run build` then publishes to GitHub Pages on every push to
`master`. The `CNAME` file pins `danaital.com`; point the domain there via DNS
(A records to GitHub Pages IPs + a `www` CNAME).

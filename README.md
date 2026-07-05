# danaital.com — Tal Danai's personal site

A personal website written in **TypeScript**, compiled to static JS and
deployed to **GitHub Pages** at <https://danaital.com>.

## Stack & structure

- `index.html` + `assets/styles.css` — markup and styles.
- **`src/data.ts`** — all site content (projects, skills, experience, education,
  certificates, writing/LinkedIn posts, contact, config).
- **`src/main.ts`** — rendering + interactions (theme toggle, scrollspy,
  scroll-reveal, toasts, contact form, etc.).
- `tsc` compiles `src/*.ts` → `assets/*.js` (config in `tsconfig.json`).
- `assets/og.png` — social share image (1200×630); `robots.txt` + `sitemap.xml`
  and the JSON-LD/Open Graph tags in `index.html` cover SEO and link previews.

## Theme, motion & SEO

- **Dark mode** — a light/dark toggle lives in the nav. The choice persists in
  `localStorage` and defaults to the visitor's `prefers-color-scheme`. An inline
  script in `<head>` applies it before first paint (no flash). Colors are driven
  by CSS custom properties; the dark palette lives under `:root[data-theme="dark"]`
  in `assets/styles.css`.
- **Active-section nav + scroll-reveal** — an `IntersectionObserver` highlights
  the current section in the nav and fades sections/cards in as they enter.
  Both honour `prefers-reduced-motion`.
- **Social/OG image** — regenerate `assets/og.png` from a headless-Chrome render
  if the branding changes (1200×630). Referenced via `og:image` / `twitter:image`.

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

The Writing section shows a "Read my posts on LinkedIn" call-to-action while
`posts` in `src/data.ts` is empty. To feature specific posts, add entries to
the `posts` array — each `{ title, excerpt, date, link }`.

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

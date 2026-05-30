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

# danaital.com — Full Verification Checklist

A foolproof, feature-by-feature checklist to verify the site end to end. Compiled
from every source of truth in the repo: `README.md`, `index.html`,
`src/main.ts`, `src/data.ts`, `assets/styles.css`, and both GitHub Actions
workflows (`deploy.yml`, `repo-scan.yml`).

**How to use:** Build locally (`npm run build`), serve it
(`node .claude/server.js` → http://localhost:8123), then walk each section.
Tick a box only after you've actually seen the behaviour. Test on desktop **and**
a narrow/mobile width.

Legend: `[ ]` = to verify · 🔒 = needs config/secret · 🌐 = live-site/prod only

---

## 0. Build & tooling

- [ ] `npm install` succeeds with no errors.
- [ ] `npm run build` compiles `src/*.ts` → `assets/data.js` + `assets/main.js` with no `tsc` errors.
- [ ] `npm run watch` recompiles on save (live editing).
- [ ] Local preview server starts: `node .claude/server.js` serves on http://localhost:8123.
- [ ] No console errors in the browser devtools on first load.
- [ ] `assets/data.js` and `assets/main.js` are up to date (rebuilt after the latest `src/` edit).

## 1. Page shell & navigation

- [ ] Page title reads **"Tal Danai — Full Stack Developer"**.
- [ ] Favicon (inline "T" SVG) appears in the browser tab.
- [ ] Google Fonts (Fraunces + Inter) load; no FOUT/missing-font fallback.
- [ ] **Skip-to-content** link: press Tab on load → "Skip to content" appears top-left; activating it jumps to `#main`.
- [ ] Header brand "Tal Danai" links back to `#top`.
- [ ] All nav links scroll to the right section: **About, Experience, Projects, Education, Writing, Contact**.
- [ ] **Mobile nav toggle** (hamburger): tap opens the menu; `aria-expanded` flips `false`↔`true`.
- [ ] Tapping any nav link on mobile closes the menu and clears `aria-expanded`.
- [ ] Footer shows **© <current year> Tal Danai** — year is injected dynamically (matches real year).
- [ ] Footer "Back to top ↑" link jumps to `#top`.

## 2. Hero / About (`#about`)

- [ ] Eyebrow "Full Stack Developer", heading "Hi, I'm Tal Danai.", lede + sub paragraphs all render.
- [ ] **"View my work"** button scrolls to `#projects`.
- [ ] **"Get in touch"** button scrolls to `#contact`.
- [ ] Portrait image (`assets/portrait.webp`) loads at 230×230.
- [ ] **Portrait fallback:** if the image fails (rename/remove it to test), the **"TD" monogram** appears instead.
- [ ] **"Inquiries" badge** under the portrait opens a `mailto:taldanai@icloud.com?subject=Inquiry`.
- [ ] Clicking the Inquiries badge fires the **"Opening your email app…"** toast.

## 3. Skills strip

- [ ] All skills from `data.skills` render as pills: TypeScript, React, React Native, Node.js, NestJS, FastAPI, Python, Java, Prisma, PostgreSQL, Redis, C++.
- [ ] Count on screen matches the array length (12).

## 4. Experience (`#experience`)

- [ ] Two columns render: **Development** and **Teaching**.
- [ ] Development entries (4): Ofran Worldwide Car Rental, Ryde — Outsmart Mobility, eToro, Ofran Services Ltd.
- [ ] Teaching entries (3): Reichman recitation instructor, Google × Reichman Tech School, RRIS TA.
- [ ] Each item shows **role**, **org**, **period pill**, **meta** line, and bullet **points** where present.
- [ ] Date pill stays pinned top-right even when the role title wraps to two lines.
- [ ] On narrow screens (< 920px) the two columns stack to a single column (no cramped/cut Teaching column).

## 5. Projects (`#projects`)

For each card in `data.projects` verify the rendering rules in `src/main.ts`:

- [ ] All visible projects render: **StudyMate, Reports System, Beacon of Light, Zoom Virtual Assistant, Phonics, This Website**.
- [ ] "Course Management" is **absent** (it's commented out in `src/data.ts`).
- [ ] Each card shows **name**, optional **tag** (with correct colour class — gold `tag-accent` for the two flagships), **blurb**, and **stack** chips.
- [ ] **Flagship tags** show on StudyMate ("Flagship · AI study platform") and Reports System ("Flagship · Ofran platform").
- [ ] **`link` set** (e.g. Zoom Virtual Assistant, This Website): footer shows **"View on GitHub →"** when the URL contains github.com, else "View project →"; opens in a new tab (`rel=noopener`).
- [ ] **`link` empty + no `showRepos`** (e.g. Beacon of Light, Phonics): footer shows the **"Private repository"** label, no dead link.
- [ ] **`demo` set:** a **"Live demo →"** button appears. (Currently all `demo` are `""` → no button. Set one to confirm it appears.)
- [ ] **`inquire: true`** (StudyMate, Reports System, Beacon of Light, Phonics): an **"Inquire about this →"** link appears.
- [ ] **Multi-repo (`showRepos: true`)**: the "Repositories" chip section renders with one chip per repo; chips with a URL are links, chips without a URL show a non-clickable **"Private"** chip. (No current project sets `showRepos: true` — flip it on Reports System to confirm.)
- [ ] Section footer "More on github.com/danaital" link works.

### 5a. Per-project inquiry prefill

- [ ] Clicking **"Inquire about this →"** on a project: smooth-scrolls to `#contact`.
- [ ] The message textarea is **prefilled** with `Hi Tal, I'd love to talk to you about "<Project>".`
- [ ] The textarea receives focus (~0.45s after scroll).
- [ ] A toast appears: **"Ask away about <Project> ↓"**.

## 6. Education & Certificates (`#education`)

- [ ] Education entries render: **M.Sc., Machine Learning & Data Science** (Reichman, Sep 2025–Present) and **B.Sc., Computer Science** (Reichman, 2018–2023).
- [ ] Each shows degree, org, period pill (and note if present).
- [ ] **Certificates section is hidden** while `data.certificates` is empty (the `#certs-wrap` stays `hidden`).
- [ ] Adding a certificate to `data.certificates` → the "Certifications" block **appears** with name + "issuer · year" meta.

## 7. Writing (`#writing`)

- [ ] With `data.posts` **empty** (current state): the empty-state shows "I share notes and project updates on LinkedIn." + a **"Read my posts on LinkedIn →"** button linking to `data.linkedinUrl`.
- [ ] Adding a post to `data.posts` → cards render instead, each with **date** (formatted e.g. "May 1, 2026"), **title**, optional **excerpt**, and a **"Read on LinkedIn →"** affordance; the card links to `post.link` in a new tab.

## 8. Contact (`#contact`)

### 8a. Contact links

- [ ] Contact links render: **Email** (mailto:taldanai@icloud.com), **GitHub** (github.com/danaital), **LinkedIn** (Tal Danai).
- [ ] Email link opens in same tab (`mailto` → `_self`); GitHub/LinkedIn open in a new tab.
- [ ] Clicking the **email** contact link fires the **"Opening your email app…"** toast.

### 8b. Contact form — validation

- [ ] Submitting empty → inline errors: **"Please enter your name."**, **"Please enter your email."**, **"Please enter a message."**; first invalid field gets focus; toast **"Please fix the highlighted fields."**
- [ ] Invalid email (e.g. `foo@bar`) → **"Enter a valid email address."**
- [ ] Field error **clears** as soon as you start typing in that field.
- [ ] Form width is constrained (≈640px) and the message field spans full width.

### 8c. Contact form — submission paths

- [ ] **Mailto fallback** (default, `web3formsKey` still `YOUR_…`): a valid submit opens the visitor's email client to `contactEmail` with a prefilled subject/body, plus the **"Opening your email app…"** toast.
- [ ] **Honeypot:** the hidden `botcheck` checkbox is `display:none`; if a bot checks it, submit is **silently dropped** (no send). Verify a normal submit with botcheck unchecked still works.
- [ ] 🔒 **Web3Forms** (after setting a real `web3formsKey`): submit POSTs to `api.web3forms.com`, button disables, shows **"Sending…"**, then **"Thanks, <FirstName>! Your message was sent."**; the form resets.
- [ ] 🔒 **Failure handling:** a failed/blocked request shows **"Couldn't send — please email me directly."** or **"Network error — please email me directly."** and re-enables the button.
- [ ] 🔒 **ntfy phone push** (after setting `ntfyTopic` and subscribing in the ntfy app): a successful Web3Forms submit also pushes a phone notification titled "New inquiry — danaital.com".

## 9. Toasts (global)

- [ ] Toasts appear bottom (toast-wrap), auto-dismiss after ~3.5s (5s for success).
- [ ] Clicking a toast dismisses it immediately.
- [ ] `aria-live="polite"` / `role="status"` present (screen-reader announce).

## 10. Responsive & accessibility

- [ ] Breakpoints behave: **920px** (experience stacks), **820px**, **620px**, **520px** (toast full-width) — no overflow or clipped content at any width.
- [ ] **Reduced motion:** with OS "Reduce motion" on, animations/transitions are disabled (`prefers-reduced-motion` block).
- [ ] Keyboard-only: every interactive element is reachable by Tab and shows a visible focus state (form inputs get an accent border on focus).
- [ ] Color contrast of text on backgrounds is legible.

## 11. SEO & social meta (`index.html`)

- [ ] `<meta name="description">` present and accurate.
- [ ] **Open Graph** tags present: `og:type`, `og:title`, `og:description`, `og:url`.
- [ ] **Twitter** card meta present (`twitter:card = summary`).
- [ ] 🌐 Pasting the live URL into a link-preview tool (e.g. a Slack/LinkedIn DM, or opengraph.xyz) shows the correct title/description.

## 12. CI/CD deploy (`.github/workflows/deploy.yml`)

- [ ] 🌐 Pushing to `master` triggers the **"Deploy to GitHub Pages"** workflow.
- [ ] Workflow runs `npm ci` → `npm run build` → stages `_site` (excluding repo-meta) → uploads → deploys; ends green.
- [ ] 🌐 https://danaital.com serves the latest content after deploy.
- [ ] `CNAME` pins `danaital.com`; DNS A-records point to GitHub Pages IPs + `www` CNAME (domain resolves, HTTPS valid).
- [ ] `workflow_dispatch` can trigger a manual deploy from the Actions tab.

## 13. Daily repo scan + privacy audit (`.github/workflows/repo-scan.yml`)

- [ ] 🌐 The **"Daily GitHub project scan"** workflow exists and is scheduled (07:00 UTC daily) + `workflow_dispatch`.
- [ ] Manually dispatch it: it lists own non-fork repos, diffs against repos already linked in `assets/data.js`, and reports **repos not yet featured**.
- [ ] **Privacy audit:** any PUBLIC repo not on the `ALLOWLIST` (currently just `danaital.com`) is flagged "confirm these should be public".
- [ ] Findings land in a **single tracking issue** (created, or updated if one is already open) titled "🔭 danaital daily scan — repos & privacy".
- [ ] "All clear" path: when nothing's new and nothing's unexpectedly public, the run exits 0 with no issue.
- [ ] 🔒 **Private-repo audit:** set a PAT with `repo` scope as secret `GH_SCAN_TOKEN` to also confirm private repos are still private (otherwise only public repos are visible).
- [ ] 🔒 **ntfy push:** set the `NTFY_TOPIC` Actions secret → the scan also pushes a phone notification (priority "high" when public repos are flagged).

---

## ⚠️ Appendix — Unmerged "Site polish" branch (NOT yet live)

These features exist only on branch **`claude/quirky-kirch-2b4f11`** ("Site polish:
dark mode, SEO/social, contact redesign, interactive nav"). They are **not on
`master`** and **not deployed**. Decide whether to merge; verify only after merging.

- [ ] **Dark mode:** nav sun/moon toggle; defaults to `prefers-color-scheme`; persists to `localStorage`; inline `<head>` script applies theme before first paint (no flash); dark palette via `:root[data-theme="dark"]`.
- [ ] **Scrollspy:** active-section nav highlighting as you scroll.
- [ ] **Scroll-reveal:** fade-up reveals on sections — honouring `prefers-reduced-motion`.
- [ ] **Contact redesign:** two-column layout (icon contact methods + elevated "Send a message" card) with mailto-fallback note.
- [ ] **SEO additions:** JSON-LD `Person`, `summary_large_image` Twitter card, canonical link, `theme-color` meta.
- [ ] **`robots.txt`** (Allow all + sitemap reference) and **`sitemap.xml`** are served from the site root.
- [ ] **Social share image** `assets/og.png` (1200×630) referenced by `og:image` and renders in link previews.
- [ ] Writing section + its nav link are **auto-hidden** unless `posts` is non-empty; the contact availability badge is removed.
- [ ] **Note:** the branch README documents the preview server on **port 3000** — reconcile with `master`'s `.claude/server.js` (port 8123) before merging.

---

## Config / secrets quick-reference (things that gate 🔒 items)

| Setting | Where | Until set… |
|---|---|---|
| `web3formsKey` | `src/data.ts` → `config` | form falls back to mailto |
| `ntfyTopic` | `src/data.ts` → `config` | no phone push on inquiry |
| `contactEmail` | `src/data.ts` → `config` | defaults to taldanai@icloud.com |
| `linkedinUrl` | `src/data.ts` | confirm exact LinkedIn URL |
| `NTFY_TOPIC` | repo Actions secret | daily scan won't phone-push |
| `GH_SCAN_TOKEN` (PAT, `repo` scope) | repo Actions secret | scan can't audit private repos |

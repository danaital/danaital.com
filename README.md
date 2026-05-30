# danaital.com — Tal Danai's personal site

A static, zero-build personal website (HTML + CSS + a little vanilla JS),
deployed to **GitHub Pages** at <https://danaital.com>.

## Editing content

All content lives in **[`assets/data.js`](assets/data.js)** — projects, skills,
writing/LinkedIn posts, and contact links. Edit that file, commit, and push;
GitHub Pages redeploys automatically. No build step.

- **Projects** — add/remove entries in the `projects` array. Omit `link` for
  private repos (the card renders a "Private repository" label instead).
- **Writing** — add LinkedIn posts to the `posts` array. While it's empty, the
  section shows a "Read my posts on LinkedIn" call-to-action.
- **Contact** — edit the `contacts` array.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deployment

Hosted on GitHub Pages from this repo. The `CNAME` file pins the custom domain
`danaital.com`. DNS is configured at GoDaddy (A records to GitHub Pages IPs +
a `www` CNAME). See repo Settings → Pages.

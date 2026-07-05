/* =============================================================================
   Render site content from window.SITE_DATA and wire up small interactions.
   Compiled by `tsc` to assets/main.js and loaded as a plain (non-module)
   script after assets/data.js, so everything stays inside one IIFE and reads
   the SITE_DATA global.
   ========================================================================== */
(function () {
  "use strict";

  const data: SiteData | undefined = window.SITE_DATA;
  if (!data) return;

  /* ---------------------------------------------------------------------------
     DOM helpers
     ------------------------------------------------------------------------ */

  /** Attributes accepted by el(); `text`/`html`/`class` are handled specially. */
  interface ElAttrs {
    class?: string;
    /** Sets textContent — safe for untrusted strings. */
    text?: string;
    /** Sets innerHTML — only pass trusted, author-controlled markup (e.g. inline SVG). */
    html?: string;
    [attr: string]: string | undefined;
  }

  type Child = Node | string;

  function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs?: ElAttrs,
    children?: Child[]
  ): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (attrs) {
      for (const key of Object.keys(attrs)) {
        const value = attrs[key];
        if (value == null) continue;
        if (key === "class") node.className = value;
        else if (key === "html") node.innerHTML = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value);
      }
    }
    if (children) {
      for (const child of children) {
        node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
      }
    }
    return node;
  }

  /** querySelector with a typed result. */
  function qs<E extends Element = Element>(selector: string): E | null {
    return document.querySelector<E>(selector);
  }

  /** Append rendered items to the container with `id`, if it exists. No-op otherwise.
   *  Builds off-DOM via a DocumentFragment so a list triggers one reflow, not one per item. */
  function renderInto<T>(id: string, items: T[] | undefined, render: (item: T) => Node): void {
    const host = document.getElementById(id);
    if (!host || !items || !items.length) return;
    const frag = document.createDocumentFragment();
    items.forEach((item) => frag.appendChild(render(item)));
    host.appendChild(frag);
  }

  /* ---------------------------------------------------------------------------
     Inline SVG icons (author-controlled markup — safe for innerHTML)
     ------------------------------------------------------------------------ */
  const svg = (paths: string): string =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";

  const contactIcons: Record<string, string> = {
    email: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
    github: svg('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'),
    linkedin: svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'),
  };
  const linkIcon = svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>');
  const arrowIcon = svg('<path d="M7 17 17 7M7 7h10v10"/>');

  /* ---------------------------------------------------------------------------
     Toasts: timed, auto-dismissing notifications
     ------------------------------------------------------------------------ */
  function showToast(message: string, ms = 3500): void {
    let wrap = document.getElementById("toast-wrap");
    if (!wrap) {
      wrap = el("div", { id: "toast-wrap", class: "toast-wrap", "aria-live": "polite" });
      document.body.appendChild(wrap);
    }
    const toast = el("div", { class: "toast", role: "status" }, [message]);
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    const dismiss = () => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 320);
    };
    toast.addEventListener("click", dismiss);
    setTimeout(dismiss, ms);
  }
  window.showToast = showToast;

  /* ---------------------------------------------------------------------------
     Portrait fallback: swap to the initials monogram if the image 404s.
     (Moved here from an inline `onerror=""` attribute so a strict
     Content-Security-Policy — no `script-src 'unsafe-inline'` — still allows it.)
     ------------------------------------------------------------------------ */
  const portraitImg = qs<HTMLImageElement>("#portrait-img");
  if (portraitImg) {
    portraitImg.addEventListener("error", () => {
      portraitImg.classList.add("js-hidden");
      document.getElementById("mono-fallback")?.classList.remove("js-hidden");
    });
  }

  /* ---------------------------------------------------------------------------
     Skills strip
     ------------------------------------------------------------------------ */
  renderInto("skills-list", data.skills, (skill) => el("li", { text: skill }));

  /* ---------------------------------------------------------------------------
     Projects
     ------------------------------------------------------------------------ */
  function renderProject(p: Project): HTMLElement {
    const card = el("article", { class: "project-card" });

    const head = el("div", { class: "project-head" });
    head.appendChild(el("h3", { text: p.name }));
    if (p.tag) {
      head.appendChild(el("span", { class: ("project-tag " + (p.tagClass || "")).trim(), text: p.tag }));
    }
    card.appendChild(head);

    card.appendChild(el("p", { class: "project-blurb", text: p.blurb }));

    const stack = el("ul", { class: "stack" });
    (p.stack || []).forEach((t) => stack.appendChild(el("li", { text: t })));
    card.appendChild(stack);

    // Optional multi-repo links — opt-in per project via showRepos.
    if (p.showRepos && p.repos && p.repos.length) {
      const reposWrap = el("div", { class: "repos" });
      reposWrap.appendChild(el("span", { class: "repos-label", text: "Repositories" }));
      const repoList = el("ul", { class: "repo-chips" });
      p.repos.forEach((rp) => {
        const li = el("li");
        li.appendChild(
          rp.url
            ? el("a", { class: "repo-chip", href: rp.url, target: "_blank", rel: "noopener noreferrer" }, [rp.label])
            : el("span", { class: "repo-chip repo-chip-private", title: "Private", text: rp.label })
        );
        repoList.appendChild(li);
      });
      reposWrap.appendChild(repoList);
      card.appendChild(reposWrap);
    }

    const footer = el("div", { class: "project-foot" });
    if (p.link) {
      const label = p.link.indexOf("github.com") > -1 ? "View on GitHub →" : "View project →";
      footer.appendChild(el("a", { class: "project-link", href: p.link, target: "_blank", rel: "noopener noreferrer" }, [label]));
    } else if (!p.showRepos) {
      footer.appendChild(el("span", { class: "project-private", text: "Private repository" }));
    }
    if (p.demo) {
      footer.appendChild(el("a", { class: "project-demo", href: p.demo, target: "_blank", rel: "noopener noreferrer" }, ["Live demo →"]));
    }
    if (p.inquire) {
      footer.appendChild(el("a", { class: "project-inquire", href: "#contact", "data-project": p.name }, ["Inquire about this →"]));
    }
    card.appendChild(footer);

    return card;
  }

  const grid = qs<HTMLElement>("#projects-grid");
  if (grid) {
    const projectsFrag = document.createDocumentFragment();
    (data.projects || []).forEach((p) => projectsFrag.appendChild(renderProject(p)));
    grid.appendChild(projectsFrag);

    // Per-project inquiry: prefill the contact form with the project and jump to it.
    grid.addEventListener("click", (e) => {
      const target = e.target as Element | null;
      const link = target?.closest?.<HTMLElement>(".project-inquire");
      if (!link) return;
      e.preventDefault();
      const proj = link.getAttribute("data-project") || "your work";
      const msg = document.getElementById("cf-msg") as HTMLTextAreaElement | null;
      if (msg) msg.value = 'Hi Tal, I\'d love to talk to you about "' + proj + '". ';
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => msg?.focus(), 450);
      showToast("Ask away about " + proj + " ↓");
    });
  }

  /* ---------------------------------------------------------------------------
     Writing (hidden entirely while there are no posts)
     ------------------------------------------------------------------------ */
  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  }

  const writing = qs<HTMLElement>("#writing-list");
  if (writing) {
    const posts = data.posts || [];
    const section = document.getElementById("writing");
    const navItem = qs<HTMLElement>('#nav-links a[href="#writing"]')?.parentElement;
    const hasPosts = posts.length > 0;

    if (section) section.hidden = !hasPosts;
    if (navItem) navItem.hidden = !hasPosts;

    const postsFrag = document.createDocumentFragment();
    posts.forEach((post) => {
      const card = el("a", { class: "writing-card", href: post.link || "#", target: "_blank", rel: "noopener noreferrer" });
      if (post.date) card.appendChild(el("time", { datetime: post.date, text: formatDate(post.date) }));
      card.appendChild(el("h3", { text: post.title }));
      if (post.excerpt) card.appendChild(el("p", { text: post.excerpt }));
      card.appendChild(el("span", { class: "writing-more", text: "Read on LinkedIn →" }));
      postsFrag.appendChild(card);
    });
    writing.appendChild(postsFrag);
  }

  /* ---------------------------------------------------------------------------
     Contact links
     ------------------------------------------------------------------------ */
  renderInto("contact-links", data.contacts, (c) => {
    const key = (c.label || "").toLowerCase();
    const isMail = c.href.indexOf("mailto:") === 0;
    const li = el("li");
    li.appendChild(
      el("a", { href: c.href, target: isMail ? "_self" : "_blank", rel: "noopener noreferrer" }, [
        el("span", { class: "contact-method-icon", html: contactIcons[key] || linkIcon }),
        el("span", { class: "contact-method-body" }, [
          el("span", { class: "contact-method-label", text: c.label }),
          el("span", { class: "contact-method-value", text: c.value }),
        ]),
        el("span", { class: "contact-method-arrow", html: arrowIcon }),
      ])
    );
    return li;
  });

  /* ---------------------------------------------------------------------------
     Experience (development + teaching)
     ------------------------------------------------------------------------ */
  function renderXpItem(x: ExperienceItem): HTMLElement {
    const li = el("li", { class: "xp-item" });
    const head = el("div", { class: "xp-head" });
    head.appendChild(el("h4", { text: x.role }));
    if (x.period) head.appendChild(el("span", { class: "xp-period", text: x.period }));
    li.appendChild(head);
    if (x.org) li.appendChild(el("p", { class: "xp-org", text: x.org }));
    if (x.meta) li.appendChild(el("p", { class: "xp-meta", text: x.meta }));
    if (x.points && x.points.length) {
      const pts = el("ul", { class: "xp-points" });
      x.points.forEach((pt) => pts.appendChild(el("li", { text: pt })));
      li.appendChild(pts);
    }
    return li;
  }
  if (data.experience) {
    renderInto("xp-development", data.experience.development, renderXpItem);
    renderInto("xp-teaching", data.experience.teaching, renderXpItem);
  }

  /* ---------------------------------------------------------------------------
     Education
     ------------------------------------------------------------------------ */
  renderInto("edu-list", data.education, (e) => {
    const li = el("li", { class: "edu-item" });
    const head = el("div", { class: "xp-head" });
    head.appendChild(el("h4", { text: e.degree }));
    if (e.period) head.appendChild(el("span", { class: "xp-period", text: e.period }));
    li.appendChild(head);
    if (e.org) li.appendChild(el("p", { class: "xp-org", text: e.org }));
    if (e.note) li.appendChild(el("p", { class: "edu-note", text: e.note }));
    return li;
  });

  /* ---------------------------------------------------------------------------
     Certificates (section hidden while empty)
     ------------------------------------------------------------------------ */
  if (data.certificates && data.certificates.length) {
    renderInto("cert-list", data.certificates, (c) => {
      const li = el("li", { class: "cert-item" });
      li.appendChild(el("span", { class: "cert-name", text: c.name }));
      const meta = [c.issuer, c.year].filter(Boolean).join(" · ");
      if (meta) li.appendChild(el("span", { class: "cert-meta", text: meta }));
      return li;
    });
    const certWrap = qs<HTMLElement>("#certs-wrap");
    if (certWrap) certWrap.hidden = false;
  }

  /* ---------------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------------ */
  const toggle = qs<HTMLButtonElement>(".nav-toggle");
  const navLinks = qs<HTMLElement>("#nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if ((e.target as Element).tagName === "A") {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------------------------
     Theme toggle (light / dark)
     ------------------------------------------------------------------------ */
  const themeBtn = qs<HTMLButtonElement>("#theme-toggle");
  if (themeBtn) {
    const root = document.documentElement;
    const applyTheme = (t: string) => {
      root.setAttribute("data-theme", t);
      themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      qs('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#0e1320" : "#fbfaf7");
    };
    // Sync aria-label + theme-color with whatever the inline <head> script set.
    applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode / storage disabled — ignore */
      }
      applyTheme(next);
    });
  }

  /* ---------------------------------------------------------------------------
     Active-section nav highlighting (scrollspy)
     ------------------------------------------------------------------------ */
  const navLinkEls = Array.from(document.querySelectorAll<HTMLAnchorElement>('#nav-links a[href^="#"]'));
  const linkFor: Record<string, HTMLAnchorElement> = {};
  navLinkEls.forEach((a) => {
    const id = (a.getAttribute("href") || "").slice(1);
    if (id && document.getElementById(id)) linkFor[id] = a;
  });
  const spyIds = Object.keys(linkFor);
  if (spyIds.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinkEls.forEach((a) => a.classList.remove("active"));
          linkFor[entry.target.id]?.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spyIds.forEach((id) => {
      const target = document.getElementById(id);
      if (target) spy.observe(target);
    });
  }

  /* ---------------------------------------------------------------------------
     Scroll-reveal: fade sections/cards up as they enter (motion-safe)
     ------------------------------------------------------------------------ */
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealSelectors = [".section-head", ".project-card", ".edu-item", ".xp-item", ".writing-card", ".contact-intro", ".contact-form"];
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((node) => {
        node.classList.add("reveal");
        revObs.observe(node);
      });
    });
  }

  /* ---------------------------------------------------------------------------
     Surface a timed toast when someone acts on a contact/inquiry link
     ------------------------------------------------------------------------ */
  qs('#contact-links a[href^="mailto:"]')?.addEventListener("click", () => showToast("Opening your email app…"));

  /* ---------------------------------------------------------------------------
     Contact form: Web3Forms submit + ntfy phone push (mailto fallback)
     ------------------------------------------------------------------------ */
  const cfg = data.config;
  const isSet = (v: string | undefined): v is string => typeof v === "string" && v.length > 0 && v.indexOf("YOUR_") !== 0;

  const form = qs<HTMLFormElement>("#contact-form");
  if (form) {
    const fieldIds = ["cf-name", "cf-email", "cf-msg"] as const;

    const setErr = (id: string, msg: string): void => {
      const input = document.getElementById(id);
      const field = input?.closest(".field");
      if (!field) return;
      field.classList.toggle("has-error", !!msg);
      let fe = field.querySelector<HTMLElement>(".field-err");
      if (msg) {
        if (!fe) {
          fe = el("span", { class: "field-err" });
          field.appendChild(fe);
        }
        fe.textContent = msg;
      } else if (fe) {
        fe.textContent = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      if (fd.get("botcheck")) return; // honeypot tripped — silently drop

      // Hard-cap lengths in case the `maxlength` attributes are bypassed client-side —
      // the real enforcement is server-side (Web3Forms), this just avoids sending junk.
      const name = (fd.get("name") || "").toString().trim().slice(0, 100);
      const email = (fd.get("email") || "").toString().trim().slice(0, 254);
      const message = (fd.get("message") || "").toString().trim().slice(0, 5000);

      // Per-field required + format validation with inline error messages.
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      let firstBad = "";
      setErr("cf-name", name ? "" : "Please enter your name.");
      if (!name) firstBad = firstBad || "cf-name";
      setErr("cf-email", !email ? "Please enter your email." : !emailOk ? "Enter a valid email address." : "");
      if (!email || !emailOk) firstBad = firstBad || "cf-email";
      setErr("cf-msg", message ? "" : "Please enter a message.");
      if (!message) firstBad = firstBad || "cf-msg";
      if (firstBad) {
        document.getElementById(firstBad)?.focus();
        showToast("Please fix the highlighted fields.");
        return;
      }

      // Fallback while the form backend isn't configured: open the visitor's email.
      if (!isSet(cfg.web3formsKey)) {
        const to = cfg.contactEmail || "taldanai@icloud.com";
        const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
        window.location.href =
          "mailto:" + to + "?subject=" + encodeURIComponent("Inquiry from danaital.com") + "&body=" + body;
        showToast("Opening your email app…");
        return;
      }

      const btn = form.querySelector<HTMLButtonElement>("button[type=submit]");
      if (btn) btn.disabled = true;
      showToast("Sending…");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: cfg.web3formsKey,
          subject: "New inquiry from danaital.com",
          from_name: "danaital.com",
          name,
          email,
          message,
        }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json && json.success) {
            if (isSet(cfg.ntfyTopic)) {
              fetch("https://ntfy.sh/" + cfg.ntfyTopic, {
                method: "POST",
                headers: { Title: "New inquiry — danaital.com", Tags: "envelope" },
                body: name + " (" + email + "): " + message,
              }).catch(() => {});
            }
            form.reset();
            showToast("Thanks, " + name.split(" ")[0] + "! Your message was sent.", 5000);
          } else {
            showToast("Couldn't send — please email me directly.", 5000);
          }
        })
        .catch(() => showToast("Network error — please email me directly.", 5000))
        .then(() => {
          if (btn) btn.disabled = false;
        });
    });

    // Clear a field's error as soon as the user starts fixing it.
    fieldIds.forEach((id) => {
      const input = document.getElementById(id);
      input?.addEventListener("input", () => {
        const field = input.closest(".field");
        if (!field) return;
        field.classList.remove("has-error");
        const fe = field.querySelector(".field-err");
        if (fe) fe.textContent = "";
      });
    });
  }

  /* ---------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

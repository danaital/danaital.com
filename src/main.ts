/* Render site content from window.SITE_DATA and wire up small interactions. */
(function () {
  "use strict";
  var data: any = (window as any).SITE_DATA || {};
  var $ = function (sel: string): any { return document.querySelector(sel); };

  function el(tag: string, attrs?: any, children?: any[]): any {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* ---- Skills strip ---- */
  var skillsList = $("#skills-list");
  if (skillsList) {
    (data.skills || []).forEach(function (s: string) {
      skillsList.appendChild(el("li", { text: s }));
    });
  }

  /* ---- Projects ---- */
  var grid = $("#projects-grid");
  if (grid) {
    (data.projects || []).forEach(function (p: any) {
      var card = el("article", { class: "project-card" });

      var head = el("div", { class: "project-head" });
      head.appendChild(el("h3", { text: p.name }));
      if (p.tag) head.appendChild(el("span", { class: "project-tag " + (p.tagClass || ""), text: p.tag }));
      card.appendChild(head);

      card.appendChild(el("p", { class: "project-blurb", text: p.blurb }));

      var stack = el("ul", { class: "stack" });
      (p.stack || []).forEach(function (t: string) { stack.appendChild(el("li", { text: t })); });
      card.appendChild(stack);

      // Optional multi-repo links — opt-in per project via showRepos.
      if (p.showRepos && p.repos && p.repos.length) {
        var reposWrap = el("div", { class: "repos" });
        reposWrap.appendChild(el("span", { class: "repos-label", text: "Repositories" }));
        var repoList = el("ul", { class: "repo-chips" });
        p.repos.forEach(function (rp: any) {
          var li = el("li");
          if (rp.url) {
            li.appendChild(el("a", { class: "repo-chip", href: rp.url, target: "_blank", rel: "noopener" }, [rp.label]));
          } else {
            li.appendChild(el("span", { class: "repo-chip repo-chip-private", title: "Private", text: rp.label }));
          }
          repoList.appendChild(li);
        });
        reposWrap.appendChild(repoList);
        card.appendChild(reposWrap);
      }

      var footer = el("div", { class: "project-foot" });
      if (p.link) {
        footer.appendChild(el("a", {
          class: "project-link", href: p.link, target: "_blank", rel: "noopener",
        }, [p.link.indexOf("github.com") > -1 ? "View on GitHub →" : "View project →"]));
      } else if (!p.showRepos) {
        footer.appendChild(el("span", { class: "project-private", text: "Private repository" }));
      }
      if (p.demo) {
        footer.appendChild(el("a", {
          class: "project-demo", href: p.demo, target: "_blank", rel: "noopener",
        }, ["Live demo →"]));
      }
      if (p.inquire) {
        footer.appendChild(el("a", {
          class: "project-inquire", href: "#contact", "data-project": p.name,
        }, ["Inquire about this →"]));
      }
      card.appendChild(footer);

      grid.appendChild(card);
    });

    // Per-project inquiry: prefill the contact form with the project and jump to it.
    grid.addEventListener("click", function (e: any) {
      var a = e.target.closest && e.target.closest(".project-inquire");
      if (!a) return;
      e.preventDefault();
      var proj = a.getAttribute("data-project") || "your work";
      var msg: any = document.getElementById("cf-msg");
      if (msg) msg.value = 'Hi Tal, I\'d love to talk to you about "' + proj + '". ';
      var contact = document.getElementById("contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { if (msg) msg.focus(); }, 450);
      showToast("Ask away about " + proj + " ↓");
    });
  }

  /* ---- Writing ---- */
  var writing = $("#writing-list");
  if (writing) {
    var posts = data.posts || [];
    if (posts.length === 0) {
      writing.appendChild(el("div", { class: "writing-empty" }, [
        el("p", { text: "I share notes and project updates on LinkedIn." }),
        el("a", {
          class: "btn btn-primary", href: data.linkedinUrl || "#",
          target: "_blank", rel: "noopener",
        }, ["Read my posts on LinkedIn →"]),
      ]));
    } else {
      posts.forEach(function (post: any) {
        var item = el("a", {
          class: "writing-card", href: post.link || "#",
          target: "_blank", rel: "noopener",
        });
        if (post.date) item.appendChild(el("time", { datetime: post.date, text: formatDate(post.date) }));
        item.appendChild(el("h3", { text: post.title }));
        if (post.excerpt) item.appendChild(el("p", { text: post.excerpt }));
        item.appendChild(el("span", { class: "writing-more", text: "Read on LinkedIn →" }));
        writing.appendChild(item);
      });
    }
  }

  /* ---- Contact ---- */
  var contacts = $("#contact-links");
  if (contacts) {
    (data.contacts || []).forEach(function (c: any) {
      var li = el("li");
      li.appendChild(el("a", { href: c.href, target: c.href.indexOf("mailto:") === 0 ? "_self" : "_blank", rel: "noopener" }, [
        el("span", { class: "contact-label", text: c.label }),
        el("span", { class: "contact-value", text: c.value }),
      ]));
      contacts.appendChild(li);
    });
  }

  /* ---- Experience (development + teaching) ---- */
  function renderXp(listId: string, items: any[]) {
    var ul = document.getElementById(listId);
    if (!ul) return;
    (items || []).forEach(function (x: any) {
      var li = el("li", { class: "xp-item" });
      var head = el("div", { class: "xp-head" });
      head.appendChild(el("h4", { text: x.role }));
      if (x.period) head.appendChild(el("span", { class: "xp-period", text: x.period }));
      li.appendChild(head);
      if (x.org) li.appendChild(el("p", { class: "xp-org", text: x.org }));
      if (x.meta) li.appendChild(el("p", { class: "xp-meta", text: x.meta }));
      if (x.points && x.points.length) {
        var pts = el("ul", { class: "xp-points" });
        x.points.forEach(function (pt: string) { pts.appendChild(el("li", { text: pt })); });
        li.appendChild(pts);
      }
      ul!.appendChild(li);
    });
  }
  if (data.experience) {
    renderXp("xp-development", data.experience.development);
    renderXp("xp-teaching", data.experience.teaching);
  }

  /* ---- Education ---- */
  var eduList = $("#edu-list");
  if (eduList) {
    (data.education || []).forEach(function (e: any) {
      var li = el("li", { class: "edu-item" });
      var head = el("div", { class: "xp-head" });
      head.appendChild(el("h4", { text: e.degree }));
      if (e.period) head.appendChild(el("span", { class: "xp-period", text: e.period }));
      li.appendChild(head);
      if (e.org) li.appendChild(el("p", { class: "xp-org", text: e.org }));
      if (e.note) li.appendChild(el("p", { class: "edu-note", text: e.note }));
      eduList.appendChild(li);
    });
  }

  /* ---- Certificates (section hidden while empty) ---- */
  var certList = $("#cert-list");
  var certWrap = $("#certs-wrap");
  if (certList && data.certificates && data.certificates.length) {
    data.certificates.forEach(function (c: any) {
      var li = el("li", { class: "cert-item" });
      li.appendChild(el("span", { class: "cert-name", text: c.name }));
      var meta = [c.issuer, c.year].filter(Boolean).join(" · ");
      if (meta) li.appendChild(el("span", { class: "cert-meta", text: meta }));
      certList.appendChild(li);
    });
    if (certWrap) certWrap.hidden = false;
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = $(".nav-toggle");
  var navLinks = $("#nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e: any) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Toasts: timed, auto-dismissing notifications ---- */
  function showToast(message: string, ms?: number) {
    ms = ms || 3500;
    var wrap: any = document.getElementById("toast-wrap");
    if (!wrap) {
      wrap = el("div", { id: "toast-wrap", class: "toast-wrap", "aria-live": "polite" });
      document.body.appendChild(wrap);
    }
    var toast = el("div", { class: "toast", role: "status" }, [message]);
    wrap.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("show"); });
    var dismiss = function () {
      toast.classList.remove("show");
      toast.classList.add("hide");
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 320);
    };
    toast.addEventListener("click", dismiss);
    setTimeout(dismiss, ms);
  }
  (window as any).showToast = showToast;

  /* Surface a timed toast when someone acts on a contact/inquiry link. */
  var inquiry = $(".inquiry");
  if (inquiry) {
    inquiry.addEventListener("click", function () { showToast("Opening your email app…"); });
  }
  var emailLink = document.querySelector('#contact-links a[href^="mailto:"]');
  if (emailLink) {
    emailLink.addEventListener("click", function () { showToast("Opening your email app…"); });
  }

  /* ---- Contact form: Web3Forms submit + ntfy phone push (mailto fallback) ---- */
  var form = $("#contact-form");
  var cfg = data.config || {};
  function isSet(v: any) { return typeof v === "string" && v && v.indexOf("YOUR_") !== 0; }
  if (form) {
    form.addEventListener("submit", function (e: any) {
      e.preventDefault();
      var fd = new FormData(form);
      if (fd.get("botcheck")) return; // honeypot tripped — silently drop
      var name = (fd.get("name") || "").toString().trim();
      var email = (fd.get("email") || "").toString().trim();
      var message = (fd.get("message") || "").toString().trim();

      // Per-field required + format validation with inline error messages.
      var setErr = function (id: string, msg: string) {
        var inp: any = document.getElementById(id);
        var field = inp && inp.closest(".field");
        if (!field) return;
        field.classList.toggle("has-error", !!msg);
        var fe = field.querySelector(".field-err");
        if (msg) {
          if (!fe) { fe = el("span", { class: "field-err" }); field.appendChild(fe); }
          fe.textContent = msg;
        } else if (fe) { fe.textContent = ""; }
      };
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var firstBad = "";
      setErr("cf-name", name ? "" : "Please enter your name.");
      if (!name) firstBad = firstBad || "cf-name";
      setErr("cf-email", !email ? "Please enter your email." : (!emailOk ? "Enter a valid email address." : ""));
      if (!email || !emailOk) firstBad = firstBad || "cf-email";
      setErr("cf-msg", message ? "" : "Please enter a message.");
      if (!message) firstBad = firstBad || "cf-msg";
      if (firstBad) {
        var fb: any = document.getElementById(firstBad);
        if (fb) fb.focus();
        showToast("Please fix the highlighted fields.");
        return;
      }

      // Fallback while the form backend isn't configured: open the visitor's email.
      if (!isSet(cfg.web3formsKey)) {
        var to = cfg.contactEmail || "taldanai@icloud.com";
        var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
        window.location.href = "mailto:" + to +
          "?subject=" + encodeURIComponent("Inquiry from danaital.com") + "&body=" + body;
        showToast("Opening your email app…");
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      showToast("Sending…");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: cfg.web3formsKey,
          subject: "New inquiry from danaital.com",
          from_name: "danaital.com",
          name: name, email: email, message: message,
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && json.success) {
            if (isSet(cfg.ntfyTopic)) {
              fetch("https://ntfy.sh/" + cfg.ntfyTopic, {
                method: "POST",
                headers: { Title: "New inquiry — danaital.com", Tags: "envelope" },
                body: name + " (" + email + "): " + message,
              }).catch(function () {});
            }
            form.reset();
            showToast("Thanks, " + name.split(" ")[0] + "! Your message was sent.", 5000);
          } else {
            showToast("Couldn't send — please email me directly.", 5000);
          }
        })
        .catch(function () { showToast("Network error — please email me directly.", 5000); })
        .then(function () { if (btn) btn.disabled = false; });
    });

    // Clear a field's error as soon as the user starts fixing it.
    ["cf-name", "cf-email", "cf-msg"].forEach(function (id) {
      var inp = document.getElementById(id);
      if (inp) inp.addEventListener("input", function () {
        var field = (inp as any).closest(".field");
        if (field) {
          field.classList.remove("has-error");
          var fe = field.querySelector(".field-err");
          if (fe) fe.textContent = "";
        }
      });
    });
  }

  /* ---- Year ---- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return iso; }
  }
})();

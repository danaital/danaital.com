/* Render site content from window.SITE_DATA and wire up small interactions. */
(function () {
  "use strict";
  var data = window.SITE_DATA || {};
  var $ = function (sel) { return document.querySelector(sel); };

  function el(tag, attrs, children) {
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
    (data.skills || []).forEach(function (s) {
      skillsList.appendChild(el("li", { text: s }));
    });
  }

  /* ---- Projects ---- */
  var grid = $("#projects-grid");
  if (grid) {
    (data.projects || []).forEach(function (p) {
      var card = el("article", { class: "project-card" });

      var head = el("div", { class: "project-head" });
      head.appendChild(el("h3", { text: p.name }));
      if (p.tag) head.appendChild(el("span", { class: "project-tag " + (p.tagClass || ""), text: p.tag }));
      card.appendChild(head);

      card.appendChild(el("p", { class: "project-blurb", text: p.blurb }));

      var stack = el("ul", { class: "stack" });
      (p.stack || []).forEach(function (t) { stack.appendChild(el("li", { text: t })); });
      card.appendChild(stack);

      var footer = el("div", { class: "project-foot" });
      if (p.link) {
        footer.appendChild(el("a", {
          class: "project-link", href: p.link, target: "_blank", rel: "noopener",
        }, [p.link.indexOf("github.com") > -1 ? "View on GitHub →" : "View project →"]));
      } else {
        footer.appendChild(el("span", { class: "project-private", text: "Private repository" }));
      }
      card.appendChild(footer);

      grid.appendChild(card);
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
      posts.forEach(function (post) {
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
    (data.contacts || []).forEach(function (c) {
      var li = el("li");
      li.appendChild(el("a", { href: c.href, target: c.href.indexOf("mailto:") === 0 ? "_self" : "_blank", rel: "noopener" }, [
        el("span", { class: "contact-label", text: c.label }),
        el("span", { class: "contact-value", text: c.value }),
      ]));
      contacts.appendChild(li);
    });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = $(".nav-toggle");
  var navLinks = $("#nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Toasts: timed, auto-dismissing notifications ---- */
  function showToast(message, ms) {
    ms = ms || 3500;
    var wrap = document.getElementById("toast-wrap");
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
  window.showToast = showToast;

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
  function isSet(v) { return typeof v === "string" && v && v.indexOf("YOUR_") !== 0; }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      if (fd.get("botcheck")) return; // honeypot tripped — silently drop
      var name = (fd.get("name") || "").toString().trim();
      var email = (fd.get("email") || "").toString().trim();
      var message = (fd.get("message") || "").toString().trim();
      if (!name || !email || !message) { showToast("Please fill in every field."); return; }

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
  }

  /* ---- Year ---- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return iso; }
  }
})();

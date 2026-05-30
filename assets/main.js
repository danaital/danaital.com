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

  /* ---- Year ---- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return iso; }
  }
})();

/* Render site content from window.SITE_DATA and wire up small interactions. */
(function () {
    "use strict";
    var data = window.SITE_DATA || {};
    var $ = function (sel) { return document.querySelector(sel); };
    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        attrs = attrs || {};
        Object.keys(attrs).forEach(function (k) {
            if (k === "class")
                node.className = attrs[k];
            else if (k === "html")
                node.innerHTML = attrs[k];
            else if (k === "text")
                node.textContent = attrs[k];
            else
                node.setAttribute(k, attrs[k]);
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
            if (p.tag)
                head.appendChild(el("span", { class: "project-tag " + (p.tagClass || ""), text: p.tag }));
            card.appendChild(head);
            card.appendChild(el("p", { class: "project-blurb", text: p.blurb }));
            var stack = el("ul", { class: "stack" });
            (p.stack || []).forEach(function (t) { stack.appendChild(el("li", { text: t })); });
            card.appendChild(stack);
            // Optional multi-repo links — opt-in per project via showRepos.
            if (p.showRepos && p.repos && p.repos.length) {
                var reposWrap = el("div", { class: "repos" });
                reposWrap.appendChild(el("span", { class: "repos-label", text: "Repositories" }));
                var repoList = el("ul", { class: "repo-chips" });
                p.repos.forEach(function (rp) {
                    var li = el("li");
                    if (rp.url) {
                        li.appendChild(el("a", { class: "repo-chip", href: rp.url, target: "_blank", rel: "noopener" }, [rp.label]));
                    }
                    else {
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
            }
            else if (!p.showRepos) {
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
        grid.addEventListener("click", function (e) {
            var a = e.target.closest && e.target.closest(".project-inquire");
            if (!a)
                return;
            e.preventDefault();
            var proj = a.getAttribute("data-project") || "your work";
            var msg = document.getElementById("cf-msg");
            if (msg)
                msg.value = 'Hi Tal, I\'d love to talk to you about "' + proj + '". ';
            var contact = document.getElementById("contact");
            if (contact)
                contact.scrollIntoView({ behavior: "smooth" });
            setTimeout(function () { if (msg)
                msg.focus(); }, 450);
            showToast("Ask away about " + proj + " ↓");
        });
    }
    /* ---- Writing (hidden entirely while there are no posts) ---- */
    var writing = $("#writing-list");
    if (writing) {
        var posts = data.posts || [];
        var writingSection = document.getElementById("writing");
        var writingNav = document.querySelector('#nav-links a[href="#writing"]');
        if (posts.length === 0) {
            if (writingSection)
                writingSection.hidden = true;
            if (writingNav && writingNav.parentElement)
                writingNav.parentElement.hidden = true;
        }
        else {
            if (writingSection)
                writingSection.hidden = false;
            posts.forEach(function (post) {
                var item = el("a", {
                    class: "writing-card", href: post.link || "#",
                    target: "_blank", rel: "noopener",
                });
                if (post.date)
                    item.appendChild(el("time", { datetime: post.date, text: formatDate(post.date) }));
                item.appendChild(el("h3", { text: post.title }));
                if (post.excerpt)
                    item.appendChild(el("p", { text: post.excerpt }));
                item.appendChild(el("span", { class: "writing-more", text: "Read on LinkedIn →" }));
                writing.appendChild(item);
            });
        }
    }
    /* ---- Contact ---- */
    var SVG = function (paths) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
    };
    var contactIcons = {
        email: SVG('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
        github: SVG('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'),
        linkedin: SVG('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'),
    };
    var linkIcon = SVG('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>');
    var arrowIcon = SVG('<path d="M7 17 17 7M7 7h10v10"/>');
    var contacts = $("#contact-links");
    if (contacts) {
        (data.contacts || []).forEach(function (c) {
            var key = (c.label || "").toLowerCase();
            var isMail = c.href.indexOf("mailto:") === 0;
            var li = el("li");
            li.appendChild(el("a", { href: c.href, target: isMail ? "_self" : "_blank", rel: "noopener" }, [
                el("span", { class: "contact-method-icon", html: contactIcons[key] || linkIcon }),
                el("span", { class: "contact-method-body" }, [
                    el("span", { class: "contact-method-label", text: c.label }),
                    el("span", { class: "contact-method-value", text: c.value }),
                ]),
                el("span", { class: "contact-method-arrow", html: arrowIcon }),
            ]));
            contacts.appendChild(li);
        });
    }
    /* ---- Experience (development + teaching) ---- */
    function renderXp(listId, items) {
        var ul = document.getElementById(listId);
        if (!ul)
            return;
        (items || []).forEach(function (x) {
            var li = el("li", { class: "xp-item" });
            var head = el("div", { class: "xp-head" });
            head.appendChild(el("h4", { text: x.role }));
            if (x.period)
                head.appendChild(el("span", { class: "xp-period", text: x.period }));
            li.appendChild(head);
            if (x.org)
                li.appendChild(el("p", { class: "xp-org", text: x.org }));
            if (x.meta)
                li.appendChild(el("p", { class: "xp-meta", text: x.meta }));
            if (x.points && x.points.length) {
                var pts = el("ul", { class: "xp-points" });
                x.points.forEach(function (pt) { pts.appendChild(el("li", { text: pt })); });
                li.appendChild(pts);
            }
            ul.appendChild(li);
        });
    }
    if (data.experience) {
        renderXp("xp-development", data.experience.development);
        renderXp("xp-teaching", data.experience.teaching);
    }
    /* ---- Education ---- */
    var eduList = $("#edu-list");
    if (eduList) {
        (data.education || []).forEach(function (e) {
            var li = el("li", { class: "edu-item" });
            var head = el("div", { class: "xp-head" });
            head.appendChild(el("h4", { text: e.degree }));
            if (e.period)
                head.appendChild(el("span", { class: "xp-period", text: e.period }));
            li.appendChild(head);
            if (e.org)
                li.appendChild(el("p", { class: "xp-org", text: e.org }));
            if (e.note)
                li.appendChild(el("p", { class: "edu-note", text: e.note }));
            eduList.appendChild(li);
        });
    }
    /* ---- Certificates (section hidden while empty) ---- */
    var certList = $("#cert-list");
    var certWrap = $("#certs-wrap");
    if (certList && data.certificates && data.certificates.length) {
        data.certificates.forEach(function (c) {
            var li = el("li", { class: "cert-item" });
            li.appendChild(el("span", { class: "cert-name", text: c.name }));
            var meta = [c.issuer, c.year].filter(Boolean).join(" · ");
            if (meta)
                li.appendChild(el("span", { class: "cert-meta", text: meta }));
            certList.appendChild(li);
        });
        if (certWrap)
            certWrap.hidden = false;
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
    /* ---- Theme toggle (light / dark) ---- */
    var themeBtn = $("#theme-toggle");
    if (themeBtn) {
        var applyTheme = function (t) {
            document.documentElement.setAttribute("data-theme", t);
            themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta)
                meta.setAttribute("content", t === "dark" ? "#0e1320" : "#fbfaf7");
        };
        // Sync aria-label + theme-color with whatever the inline <head> script set.
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
        themeBtn.addEventListener("click", function () {
            var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            try {
                localStorage.setItem("theme", next);
            }
            catch (e) { }
            applyTheme(next);
        });
    }
    /* ---- Active-section nav highlighting (scrollspy) ---- */
    var navLinkEls = Array.prototype.slice.call(document.querySelectorAll('#nav-links a[href^="#"]'));
    var linkFor = {};
    navLinkEls.forEach(function (a) {
        var id = (a.getAttribute("href") || "").slice(1);
        if (id && document.getElementById(id))
            linkFor[id] = a;
    });
    var spyIds = Object.keys(linkFor);
    if (spyIds.length && "IntersectionObserver" in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    navLinkEls.forEach(function (a) { a.classList.remove("active"); });
                    var current = linkFor[en.target.id];
                    if (current)
                        current.classList.add("active");
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        spyIds.forEach(function (id) { spy.observe(document.getElementById(id)); });
    }
    /* ---- Scroll-reveal: fade sections/cards up as they enter (motion-safe) ---- */
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window) {
        var revealSelectors = [".section-head", ".project-card", ".edu-item", ".xp-item", ".writing-card", ".contact-intro", ".contact-form"];
        var revObs = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add("in");
                    obs.unobserve(en.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
        revealSelectors.forEach(function (sel) {
            Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function (el) {
                el.classList.add("reveal");
                revObs.observe(el);
            });
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
            setTimeout(function () { if (toast.parentNode)
                toast.remove(); }, 320);
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
            if (fd.get("botcheck"))
                return; // honeypot tripped — silently drop
            var name = (fd.get("name") || "").toString().trim();
            var email = (fd.get("email") || "").toString().trim();
            var message = (fd.get("message") || "").toString().trim();
            // Per-field required + format validation with inline error messages.
            var setErr = function (id, msg) {
                var inp = document.getElementById(id);
                var field = inp && inp.closest(".field");
                if (!field)
                    return;
                field.classList.toggle("has-error", !!msg);
                var fe = field.querySelector(".field-err");
                if (msg) {
                    if (!fe) {
                        fe = el("span", { class: "field-err" });
                        field.appendChild(fe);
                    }
                    fe.textContent = msg;
                }
                else if (fe) {
                    fe.textContent = "";
                }
            };
            var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            var firstBad = "";
            setErr("cf-name", name ? "" : "Please enter your name.");
            if (!name)
                firstBad = firstBad || "cf-name";
            setErr("cf-email", !email ? "Please enter your email." : (!emailOk ? "Enter a valid email address." : ""));
            if (!email || !emailOk)
                firstBad = firstBad || "cf-email";
            setErr("cf-msg", message ? "" : "Please enter a message.");
            if (!message)
                firstBad = firstBad || "cf-msg";
            if (firstBad) {
                var fb = document.getElementById(firstBad);
                if (fb)
                    fb.focus();
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
            if (btn)
                btn.disabled = true;
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
                        }).catch(function () { });
                    }
                    form.reset();
                    showToast("Thanks, " + name.split(" ")[0] + "! Your message was sent.", 5000);
                }
                else {
                    showToast("Couldn't send — please email me directly.", 5000);
                }
            })
                .catch(function () { showToast("Network error — please email me directly.", 5000); })
                .then(function () { if (btn)
                btn.disabled = false; });
        });
        // Clear a field's error as soon as the user starts fixing it.
        ["cf-name", "cf-email", "cf-msg"].forEach(function (id) {
            var inp = document.getElementById(id);
            if (inp)
                inp.addEventListener("input", function () {
                    var field = inp.closest(".field");
                    if (field) {
                        field.classList.remove("has-error");
                        var fe = field.querySelector(".field-err");
                        if (fe)
                            fe.textContent = "";
                    }
                });
        });
    }
    /* ---- Year ---- */
    var year = $("#year");
    if (year)
        year.textContent = String(new Date().getFullYear());
    function formatDate(iso) {
        try {
            return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        }
        catch (e) {
            return iso;
        }
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Dynamic year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2. Navbar shrink on scroll ---------- */
    const navbar = document.querySelector(".navbar");
    function onScroll() {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- 3. Mobile burger menu + backdrop ---------- */
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const backdrop = document.getElementById("nav-backdrop");

    function setMenu(open) {
        if (!navToggle || !navLinks) return;
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
        navLinks.classList.toggle("open", open);
        if (backdrop) backdrop.classList.toggle("open", open);
        document.body.style.overflow = open ? "hidden" : "";
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            setMenu(navToggle.getAttribute("aria-expanded") !== "true");
        });
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });
    }
    if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });

    /* ---------- 4. Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ---------- 5. Scroll-spy: highlight active nav link ---------- */
    const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
    const sections = spyLinks
        .map(function (a) { return document.querySelector(a.getAttribute("href")); })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    spyLinks.forEach(function (a) {
                        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
                    });
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- 6. Accordions (services + FAQ) — one handler ---------- */
    document.querySelectorAll(".accordion-btn, .faq-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const panel = document.getElementById(btn.getAttribute("aria-controls"));
            if (!panel) return;
            const isOpen = btn.getAttribute("aria-expanded") === "true";

            const group = btn.closest(".services-grid, .faq-container");
            if (group && !isOpen) {
                group.querySelectorAll(".accordion-btn, .faq-btn").forEach(function (other) {
                    if (other !== btn && other.getAttribute("aria-expanded") === "true") {
                        other.setAttribute("aria-expanded", "false");
                        const op = document.getElementById(other.getAttribute("aria-controls"));
                        if (op) op.style.maxHeight = "0px";
                    }
                });
            }

            if (isOpen) {
                btn.setAttribute("aria-expanded", "false");
                panel.style.maxHeight = "0px";
            } else {
                btn.setAttribute("aria-expanded", "true");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    /* ---------- 7. Diploma modal (accessible) ---------- */
    const modal = document.getElementById("image-modal");
    const diplomaBtn = document.getElementById("diploma-btn");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close-modal");
    let lastFocused = null;

    function openModal() {
        if (!modal || !diplomaBtn) return;
        lastFocused = document.activeElement;
        modalImg.src = diplomaBtn.querySelector("img").src;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("open");
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    if (diplomaBtn) {
        diplomaBtn.addEventListener("click", openModal);
        diplomaBtn.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal();
            }
        });
    }
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (modal && modal.classList.contains("open")) closeModal();
            if (navLinks && navLinks.classList.contains("open")) setMenu(false);
        }
    });

    /* ---------- 8. Lead form -> WhatsApp ---------- */
    const form = document.getElementById("lead-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameEl = document.getElementById("name");
            const hint = document.getElementById("form-hint");
            const name = nameEl.value.trim();

            if (!name) {
                nameEl.classList.add("invalid");
                nameEl.focus();
                if (hint) hint.textContent = "Пожалуйста, укажите имя.";
                return;
            }
            nameEl.classList.remove("invalid");

            const program = document.getElementById("program").value;
            const message = document.getElementById("message").value.trim();

            let text = "Здравствуйте! Меня зовут " + name + ".";
            text += "\nИнтересует: " + program + ".";
            if (message) text += "\n" + message;
            text += "\nХочу записаться на бесплатную консультацию.";

            const url = "https://wa.me/48782425330?text=" + encodeURIComponent(text);
            if (hint) hint.textContent = "Открываем WhatsApp…";
            window.open(url, "_blank", "noopener");
        });
    }

    /* ---------- 9. Scroll reveal (with light stagger) ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        const io = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger siblings within the same grid/flex group
                    const parent = entry.target.parentElement;
                    const siblings = parent ? Array.from(parent.querySelectorAll(":scope > .reveal")) : [];
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx > 0 ? idx * 0.08 : 0) + "s";
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }
});

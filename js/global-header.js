"use strict";

(function initializeGlobalHeader() {
    const storageKey = "tws-language";
    const activeClass = "is-active";

    function getHeader() {
        return document.querySelector("[data-global-header]");
    }

    function getActiveKey() {
        const path = window.location.pathname;
        const hash = window.location.hash.replace("#", "");

        if (path.includes("/product/")) {
            return "produk";
        }

        if (["tentang", "produk", "layanan", "cakupan", "kontak"].includes(hash)) {
            return hash;
        }

        return "home";
    }

    function setActiveNavigation(header) {
        const activeKey = getActiveKey();
        const links = header.querySelectorAll("[data-nav-key]");

        links.forEach((link) => {
            const isActive = link.dataset.navKey === activeKey;
            link.classList.toggle(activeClass, isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function setLanguage(header, language) {
        const normalizedLanguage = language === "en" ? "en" : "id";
        const buttons = header.querySelectorAll("[data-global-language]");

        buttons.forEach((button) => {
            const isActive = button.dataset.globalLanguage === normalizedLanguage;
            button.classList.toggle(activeClass, isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        document.documentElement.lang = normalizedLanguage;

        try {
            localStorage.setItem(storageKey, normalizedLanguage);
        } catch (error) {
            console.warn("Pilihan bahasa tidak dapat disimpan.", error);
        }
    }

    function getSavedLanguage() {
        try {
            return localStorage.getItem(storageKey) || "id";
        } catch (error) {
            console.warn("Pilihan bahasa tidak dapat dibaca.", error);
            return "id";
        }
    }

    function closeMenu(header) {
        const toggle = header.querySelector("[data-global-menu-toggle]");
        const mobileNavigation = header.querySelector("[data-global-mobile-nav]");

        toggle?.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
        toggle?.setAttribute("aria-label", "Buka navigasi");

        mobileNavigation?.classList.remove("is-open");
        mobileNavigation?.setAttribute("aria-hidden", "true");

        document.body.classList.remove("global-header-menu-open");
    }

    function openMenu(header) {
        const toggle = header.querySelector("[data-global-menu-toggle]");
        const mobileNavigation = header.querySelector("[data-global-mobile-nav]");

        toggle?.classList.add("is-open");
        toggle?.setAttribute("aria-expanded", "true");
        toggle?.setAttribute("aria-label", "Tutup navigasi");

        mobileNavigation?.classList.add("is-open");
        mobileNavigation?.setAttribute("aria-hidden", "false");

        document.body.classList.add("global-header-menu-open");
    }

    function initializeHeader() {
        const header = getHeader();

        if (!header || header.dataset.globalHeaderReady === "true") {
            return;
        }

        header.dataset.globalHeaderReady = "true";

        const toggle = header.querySelector("[data-global-menu-toggle]");

        toggle?.addEventListener("click", () => {
            const isOpen = toggle.classList.contains("is-open");

            if (isOpen) {
                closeMenu(header);
            } else {
                openMenu(header);
            }
        });

        header.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => closeMenu(header));
        });

        header.querySelectorAll("[data-global-language]").forEach((button) => {
            button.addEventListener("click", () => {
                setLanguage(header, button.dataset.globalLanguage);
            });
        });

        document.addEventListener("click", (event) => {
            if (!header.contains(event.target)) {
                closeMenu(header);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu(header);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1080) {
                closeMenu(header);
            }
        });

        // Smooth hide on scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        let ticking = false;
        const HIDE_THRESHOLD = 80; // start hiding after this many px scrolled

        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;
                ticking = true;

                requestAnimationFrame(() => {
                    const currentY = window.scrollY;

                    // maintain is-scrolled flag for styling (e.g., shadow)
                    header.classList.toggle("is-scrolled", currentY > 10);

                    // don't hide header when mobile menu is open
                    if (document.body.classList.contains("global-header-menu-open")) {
                        header.classList.remove("is-hidden");
                        lastScrollY = currentY;
                        ticking = false;
                        return;
                    }

                    if (currentY > lastScrollY && currentY > HIDE_THRESHOLD) {
                        // scrolling down
                        header.classList.add("is-hidden");
                    } else if (currentY < lastScrollY) {
                        // scrolling up
                        header.classList.remove("is-hidden");
                    }

                    lastScrollY = Math.max(0, currentY);
                    ticking = false;
                });
            },
            { passive: true }
        );

        window.addEventListener("hashchange", () => setActiveNavigation(header));

        setActiveNavigation(header);
        setLanguage(header, getSavedLanguage());
        header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    document.addEventListener("sectionsLoaded", initializeHeader);

    if (document.readyState !== "loading") {
        initializeHeader();
    } else {
        document.addEventListener("DOMContentLoaded", initializeHeader, { once: true });
    }
}());

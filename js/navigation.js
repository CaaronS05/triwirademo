"use strict";

document.addEventListener(
    "sectionsLoaded",
    initializeNavigation,
    { once: true }
);

function initializeNavigation() {
    const siteHeader = document.getElementById("siteHeader");
    const mobileMenuButton =
        document.getElementById("mobileMenuButton");
    const mobileNavigation =
        document.getElementById("mobileNavigation");

    const navigationLinks = document.querySelectorAll(
        ".nav-link, .mobile-nav-link"
    );

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    if (!siteHeader) {
        console.warn("Elemen siteHeader tidak ditemukan.");
        return;
    }

    function openMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.add("is-active");
        mobileNavigation.classList.add("is-open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            "Tutup menu navigasi"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("menu-open");
    }

    function closeMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.remove("is-active");
        mobileNavigation.classList.remove("is-open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            "Buka menu navigasi"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("menu-open");
    }

    function toggleMobileMenu() {
        if (!mobileNavigation) {
            return;
        }

        const menuIsOpen =
            mobileNavigation.classList.contains("is-open");

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener(
            "click",
            toggleMobileMenu
        );
    }

    document.addEventListener("click", (event) => {
        if (!mobileNavigation || !mobileMenuButton) {
            return;
        }

        const menuIsOpen =
            mobileNavigation.classList.contains("is-open");

        if (!menuIsOpen) {
            return;
        }

        const clickInsideMenu =
            mobileNavigation.contains(event.target);

        const clickInsideButton =
            mobileMenuButton.contains(event.target);

        if (!clickInsideMenu && !clickInsideButton) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1150) {
            closeMobileMenu();
        }
    });

    function updateStickyHeader() {
        const shouldBeSticky = window.scrollY > 20;

        siteHeader.classList.toggle(
            "is-sticky",
            shouldBeSticky
        );

        siteHeader.classList.toggle(
            "is-scrolled",
            shouldBeSticky
        );
    }

    let scrollTicking = false;

    window.addEventListener(
        "scroll",
        () => {
            if (scrollTicking) {
                return;
            }

            window.requestAnimationFrame(() => {
                updateStickyHeader();
                scrollTicking = false;
            });

            scrollTicking = true;
        },
        { passive: true }
    );

    updateStickyHeader();

    function setActiveNavigation(targetId) {
        navigationLinks.forEach((link) => {
            const linkTarget =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                linkTarget === `#${targetId}`
            );
        });
    }

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetSelector =
                link.getAttribute("href");

            if (
                !targetSelector ||
                targetSelector === "#"
            ) {
                return;
            }

            const targetElement =
                document.querySelector(targetSelector);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            closeMobileMenu();

            const headerHeight =
                siteHeader.offsetHeight;

            const targetPosition =
                targetElement
                    .getBoundingClientRect()
                    .top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: "smooth"
            });

            const targetId =
                targetSelector.replace("#", "");

            setActiveNavigation(targetId);

            if (
                window.history &&
                window.history.replaceState
            ) {
                window.history.replaceState(
                    null,
                    "",
                    targetSelector
                );
            }
        });
    });

    const observedSections = [
        "home",
        "tentang",
        "produk",
        "layanan",
        "cakupan",
        "kontak"
    ]
        .map((sectionId) => {
            return document.getElementById(sectionId);
        })
        .filter(Boolean);

    if (
        "IntersectionObserver" in window &&
        observedSections.length > 0
    ) {
        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    const visibleEntries =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (firstEntry, secondEntry) =>
                                    secondEntry
                                        .intersectionRatio -
                                    firstEntry
                                        .intersectionRatio
                            );

                    if (visibleEntries.length === 0) {
                        return;
                    }

                    setActiveNavigation(
                        visibleEntries[0].target.id
                    );
                },
                {
                    root: null,
                    rootMargin: "-30% 0px -55% 0px",
                    threshold: [
                        0.1,
                        0.25,
                        0.5,
                        0.75
                    ]
                }
            );

        observedSections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    const currentHash =
        window.location.hash.replace("#", "");

    if (
        currentHash &&
        document.getElementById(currentHash)
    ) {
        setActiveNavigation(currentHash);
    } else {
        setActiveNavigation("home");
    }
}

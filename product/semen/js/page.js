"use strict";

/* ==========================================================
   PRODUCT DETAIL PAGE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    waitForProductSections();
});


/* ==========================================================
   WAIT FOR HTML INCLUDE
========================================================== */

function waitForProductSections(attempt = 0) {
    const productFooter = document.querySelector(
        ".product-footer, .semen-footer, .site-footer"
    );

    if (productFooter) {
        initializeProductDetailPage();
        return;
    }

    if (attempt >= 100) {
        console.warn(
            "Beberapa komponen halaman produk belum berhasil dimuat."
        );

        initializeProductDetailPage();
        return;
    }

    window.setTimeout(() => {
        waitForProductSections(attempt + 1);
    }, 100);
}


/* ==========================================================
   INITIALIZATION
========================================================== */

function initializeProductDetailPage() {
    const page = document.querySelector(".product-detail-page");

    if (page?.dataset.productDetailInitialized === "true") {
        return;
    }

    if (page) {
        page.dataset.productDetailInitialized = "true";
    }

    initializeSmoothScrolling();
    initializeProductGallery();
    initializeCurrentYear();
    initializeExternalLinks();
}


/* ==========================================================
   STICKY HEADER
========================================================== */

function initializeStickyHeader() {
    const header = document.querySelector(".product-header");

    if (!header) {
        return;
    }

    const headerHost =
        header.closest("[data-include]") ||
        header.parentElement;

    const updateHeaderHeight = () => {
        if (
            headerHost &&
            headerHost !== document.body &&
            headerHost !== document.documentElement
        ) {
            headerHost.style.minHeight = `${header.offsetHeight}px`;
        }

        document.documentElement.style.setProperty(
            "--product-header-current-height",
            `${header.offsetHeight}px`
        );
    };

    const updateHeaderState = () => {
        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );

        updateHeaderHeight();
    };

    header.classList.add("is-sticky");

    updateHeaderHeight();
    updateHeaderState();

    window.addEventListener(
        "scroll",
        updateHeaderState,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateHeaderHeight
    );
}


/* ==========================================================
   MOBILE NAVIGATION
========================================================== */

function initializeMobileNavigation() {
    const menuButton = document.querySelector(
        ".product-mobile-menu-button"
    );

    const mobileNavigation = document.querySelector(
        ".product-mobile-navigation"
    );

    if (!menuButton || !mobileNavigation) {
        return;
    }

    const mobileLinks = mobileNavigation.querySelectorAll(
        ".product-mobile-nav-link, .product-mobile-contact"
    );

    const openMenu = () => {
        menuButton.classList.add("is-active");
        mobileNavigation.classList.add("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "product-mobile-menu-open"
        );
    };

    const closeMenu = () => {
        menuButton.classList.remove("is-active");
        mobileNavigation.classList.remove("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "product-mobile-menu-open"
        );
    };

    const toggleMenu = () => {
        const isOpen = mobileNavigation.classList.contains(
            "is-open"
        );

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileNavigation.setAttribute(
        "aria-hidden",
        "true"
    );

    menuButton.addEventListener(
        "click",
        toggleMenu
    );

    mobileLinks.forEach((link) => {
        link.addEventListener(
            "click",
            closeMenu
        );
    });

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        }
    );

    document.addEventListener(
        "click",
        (event) => {
            const clickedInsideNavigation =
                mobileNavigation.contains(event.target);

            const clickedMenuButton =
                menuButton.contains(event.target);

            if (
                !clickedInsideNavigation &&
                !clickedMenuButton
            ) {
                closeMenu();
            }
        }
    );

    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 1150) {
                closeMenu();
            }
        }
    );
}


/* ==========================================================
   SMOOTH SCROLLING
========================================================== */

function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );

    internalLinks.forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const targetId = link.getAttribute("href");

                if (!targetId) {
                    return;
                }

                const targetElement =
                    document.querySelector(targetId);

                if (!targetElement) {
                    return;
                }

                event.preventDefault();

                const header = document.querySelector(
                    "[data-global-header]"
                );

                const headerHeight =
                    header?.offsetHeight || 0;

                const targetPosition =
                    targetElement.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    24;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                window.history.replaceState(
                    null,
                    "",
                    targetId
                );
            }
        );
    });
}


/* ==========================================================
   LANGUAGE SWITCHER
========================================================== */

function initializeLanguageSwitcher() {
    const languageButtons = document.querySelectorAll(
        ".product-language-button"
    );

    if (!languageButtons.length) {
        return;
    }

    const savedLanguage =
        localStorage.getItem("tws-language") || "id";

    setActiveLanguage(
        languageButtons,
        savedLanguage
    );

    languageButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const selectedLanguage =
                    button.dataset.language ||
                    button.dataset.lang ||
                    button.textContent
                        .trim()
                        .toLowerCase();

                localStorage.setItem(
                    "tws-language",
                    selectedLanguage
                );

                setActiveLanguage(
                    languageButtons,
                    selectedLanguage
                );

                document.documentElement.lang =
                    selectedLanguage === "en"
                        ? "en"
                        : "id";

                document.dispatchEvent(
                    new CustomEvent(
                        "productLanguageChanged",
                        {
                            detail: {
                                language:
                                    selectedLanguage
                            }
                        }
                    )
                );
            }
        );
    });
}

function setActiveLanguage(
    languageButtons,
    selectedLanguage
) {
    languageButtons.forEach((button) => {
        const buttonLanguage =
            button.dataset.language ||
            button.dataset.lang ||
            button.textContent
                .trim()
                .toLowerCase();

        const isActive =
            buttonLanguage === selectedLanguage;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}


/* ==========================================================
   PRODUCT GALLERY
========================================================== */

function initializeProductGallery() {
    const mainImage = document.querySelector(
        ".product-main-image-element"
    );

    const thumbnails = document.querySelectorAll(
        ".product-thumbnail"
    );

    if (!thumbnails.length) {
        return;
    }

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener(
            "click",
            () => {
                const selectedImage =
                    thumbnail.dataset.imageSrc ||
                    thumbnail.dataset.image ||
                    thumbnail
                        .querySelector("img")
                        ?.getAttribute("src");

                const selectedAlt =
                    thumbnail.dataset.imageAlt ||
                    thumbnail
                        .querySelector("img")
                        ?.getAttribute("alt") ||
                    "Bata ringan PT. TRI WIRA SAKTI";

                thumbnails.forEach((item) => {
                    item.classList.remove("active");
                    item.setAttribute(
                        "aria-pressed",
                        "false"
                    );
                });

                thumbnail.classList.add("active");

                thumbnail.setAttribute(
                    "aria-pressed",
                    "true"
                );

                if (
                    mainImage &&
                    selectedImage
                ) {
                    mainImage.style.opacity = "0";

                    window.setTimeout(() => {
                        mainImage.src = selectedImage;
                        mainImage.alt = selectedAlt;
                        mainImage.style.opacity = "1";
                    }, 180);
                }
            }
        );

        thumbnail.setAttribute(
            "aria-pressed",
            thumbnail.classList.contains("active")
                ? "true"
                : "false"
        );
    });
}


/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

function initializeActiveNavigation() {
    const navigationLinks = document.querySelectorAll(
        ".product-nav-link, .product-mobile-nav-link"
    );

    if (!navigationLinks.length) {
        return;
    }

    const sectionMap = new Map();

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (
            !href ||
            !href.startsWith("#") ||
            href === "#"
        ) {
            return;
        }

        const section = document.querySelector(href);

        if (!section) {
            return;
        }

        if (!sectionMap.has(section)) {
            sectionMap.set(section, []);
        }

        sectionMap.get(section).push(link);
    });

    if (!sectionMap.size) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (firstEntry, secondEntry) =>
                        secondEntry.intersectionRatio -
                        firstEntry.intersectionRatio
                );

            if (!visibleEntries.length) {
                return;
            }

            navigationLinks.forEach((link) => {
                link.classList.remove("active");
            });

            const activeSection =
                visibleEntries[0].target;

            const activeLinks =
                sectionMap.get(activeSection) || [];

            activeLinks.forEach((link) => {
                link.classList.add("active");
            });
        },
        {
            root: null,
            rootMargin: "-30% 0px -55% 0px",
            threshold: [
                0,
                0.15,
                0.35,
                0.6
            ]
        }
    );

    sectionMap.forEach(
        (_, section) => {
            observer.observe(section);
        }
    );
}


/* ==========================================================
   CURRENT YEAR
========================================================== */

function initializeCurrentYear() {
    const currentYearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    const currentYear =
        new Date().getFullYear();

    currentYearElements.forEach((element) => {
        element.textContent =
            String(currentYear);
    });
}


/* ==========================================================
   EXTERNAL LINKS
========================================================== */

function initializeExternalLinks() {
    const externalLinks = document.querySelectorAll(
        'a[href^="http://"], a[href^="https://"]'
    );

    externalLinks.forEach((link) => {
        link.setAttribute(
            "target",
            "_blank"
        );

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    });
}

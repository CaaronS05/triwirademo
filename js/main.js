"use strict";

document.documentElement.classList.add("js-enabled");

document.addEventListener(
    "sectionsLoaded",
    initializeWebsite,
    { once: true }
);

function initializeWebsite() {
    initializeCurrentYear();
    initializeImages();
    secureExternalLinks();
    handleInitialHash();

    document.body.classList.add("sections-ready");

    document.dispatchEvent(
        new CustomEvent("siteReady")
    );
}


/* ==========================================================
   CURRENT YEAR
   Digunakan untuk tahun copyright pada footer
========================================================== */

function initializeCurrentYear() {
    const currentYearElements =
        document.querySelectorAll("[data-current-year]");

    const currentYear =
        new Date().getFullYear();

    currentYearElements.forEach((element) => {
        element.textContent =
            String(currentYear);
    });
}


/* ==========================================================
   IMAGE SETTINGS
========================================================== */

function initializeImages() {
    const images =
        document.querySelectorAll("img");

    images.forEach((image) => {
        if (!image.hasAttribute("loading")) {
            image.setAttribute(
                "loading",
                "lazy"
            );
        }

        if (!image.hasAttribute("decoding")) {
            image.setAttribute(
                "decoding",
                "async"
            );
        }

        image.addEventListener(
            "load",
            () => {
                image.classList.add(
                    "is-loaded"
                );
            },
            { once: true }
        );

        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "is-error"
                );

                console.warn(
                    `Gambar gagal dimuat: ${image.src}`
                );
            },
            { once: true }
        );

        if (image.complete && image.naturalWidth > 0) {
            image.classList.add(
                "is-loaded"
            );
        }
    });
}


/* ==========================================================
   EXTERNAL LINKS SECURITY
========================================================== */

function secureExternalLinks() {
    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );

    externalLinks.forEach((link) => {
        const currentRel =
            link.getAttribute("rel") || "";

        const relValues =
            new Set(
                currentRel
                    .split(" ")
                    .filter(Boolean)
            );

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute(
            "rel",
            Array.from(relValues).join(" ")
        );
    });
}


/* ==========================================================
   INITIAL HASH
   Membuka section yang dituju ketika website direfresh
========================================================== */

function handleInitialHash() {
    const currentHash =
        window.location.hash;

    if (!currentHash || currentHash === "#") {
        return;
    }

    const targetElement =
        document.querySelector(currentHash);

    if (!targetElement) {
        return;
    }

    window.requestAnimationFrame(() => {
        const siteHeader =
            document.querySelector("[data-global-header]");

        const headerHeight =
            siteHeader
                ? siteHeader.offsetHeight
                : 0;

        const targetPosition =
            targetElement
                .getBoundingClientRect()
                .top +
            window.scrollY -
            headerHeight;

        window.scrollTo({
            top: Math.max(targetPosition, 0),
            behavior: "auto"
        });
    });
}


/* ==========================================================
   PAGE FULLY LOADED
========================================================== */

window.addEventListener(
    "load",
    () => {
        document.body.classList.add(
            "page-loaded"
        );
    },
    { once: true }
);

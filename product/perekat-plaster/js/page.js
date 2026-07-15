"use strict";

/**
 * Perekat & Plaster page interactions.
 * Menggunakan event delegation agar tetap berfungsi
 * ketika section HTML dimuat secara asynchronous.
 */

document.addEventListener("click", (event) => {
    const menuButton = event.target.closest("[data-menu-toggle]");

    if (menuButton) {
        const navigation = document.querySelector(
            "[data-header-navigation]"
        );

        if (!navigation) {
            return;
        }

        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Tutup navigasi"
                : "Buka navigasi"
        );

        return;
    }

    const navigationLink = event.target.closest(
        "[data-header-navigation] a"
    );

    if (navigationLink) {
        const navigation = document.querySelector(
            "[data-header-navigation]"
        );

        const menuButton = document.querySelector(
            "[data-menu-toggle]"
        );

        navigation?.classList.remove("is-open");

        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton?.setAttribute(
            "aria-label",
            "Buka navigasi"
        );
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
        const navigation = document.querySelector(
            "[data-header-navigation]"
        );

        const menuButton = document.querySelector(
            "[data-menu-toggle]"
        );

        navigation?.classList.remove("is-open");

        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );
    }
});

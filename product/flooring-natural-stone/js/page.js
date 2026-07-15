document.addEventListener("DOMContentLoaded", () => {
    initializeFlooringPage();
});

document.addEventListener("sectionsLoaded", () => {
    initializeFlooringPage();
});

function initializeFlooringPage() {
    initializeFlooringGallery();
    initializeFlooringMobileMenu();
}

function initializeFlooringGallery() {
    const mainImage = document.querySelector("#flooringMainImage");
    const thumbnails = document.querySelectorAll(
        ".flooring-thumbnail"
    );

    if (!mainImage || thumbnails.length === 0) {
        return;
    }

    thumbnails.forEach((thumbnail) => {
        if (thumbnail.dataset.initialized === "true") {
            return;
        }

        thumbnail.dataset.initialized = "true";

        thumbnail.addEventListener("click", () => {
            const nextImage = thumbnail.dataset.flooringImage;
            const nextAlt =
                thumbnail.dataset.flooringAlt ||
                "Produk Flooring & Natural Stone";

            if (!nextImage || thumbnail.classList.contains("is-active")) {
                return;
            }

            thumbnails.forEach((item) => {
                item.classList.remove("is-active");
                item.setAttribute("aria-pressed", "false");
            });

            thumbnail.classList.add("is-active");
            thumbnail.setAttribute("aria-pressed", "true");
            mainImage.classList.add("is-changing");

            const replacementImage = new Image();

            replacementImage.onload = () => {
                mainImage.src = nextImage;
                mainImage.alt = nextAlt;
                mainImage.classList.remove("is-changing");
            };

            replacementImage.onerror = () => {
                mainImage.classList.remove("is-changing");
            };

            replacementImage.src = nextImage;
        });
    });
}

function initializeFlooringMobileMenu() {
    const menuButton = document.querySelector(
        ".flooring-menu-toggle"
    );

    const navigation = document.querySelector(
        ".flooring-navigation"
    );

    if (!menuButton || !navigation) {
        return;
    }

    if (menuButton.dataset.initialized === "true") {
        return;
    }

    menuButton.dataset.initialized = "true";

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.classList.toggle("is-active", isOpen);
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("is-open");
            menuButton.classList.remove("is-active");
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1150) {
            navigation.classList.remove("is-open");
            menuButton.classList.remove("is-active");
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });
}

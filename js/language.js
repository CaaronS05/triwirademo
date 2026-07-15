"use strict";

document.addEventListener(
    "sectionsLoaded",
    initializeLanguageSwitcher,
    { once: true }
);

function initializeLanguageSwitcher() {
    const languageButtons = document.querySelectorAll(
        ".language-button[data-language]"
    );

    if (languageButtons.length === 0) {
        console.warn("Tombol pilihan bahasa tidak ditemukan.");
        return;
    }

    const defaultLanguage = "id";
    const supportedLanguages = ["id", "en"];

    function getSavedLanguage() {
        try {
            const savedLanguage =
                localStorage.getItem("preferredLanguage");

            if (
                savedLanguage &&
                supportedLanguages.includes(savedLanguage)
            ) {
                return savedLanguage;
            }
        } catch (error) {
            console.warn(
                "Pilihan bahasa tidak dapat dibaca.",
                error
            );
        }

        return defaultLanguage;
    }

    function saveLanguage(language) {
        try {
            localStorage.setItem(
                "preferredLanguage",
                language
            );
        } catch (error) {
            console.warn(
                "Pilihan bahasa tidak dapat disimpan.",
                error
            );
        }
    }

    function updateLanguageButtons(language) {
        languageButtons.forEach((button) => {
            const buttonLanguage =
                button.dataset.language;

            const isActive =
                buttonLanguage === language;

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

    function updateTextContent(language) {
        const translatableElements =
            document.querySelectorAll(
                "[data-id][data-en]"
            );

        translatableElements.forEach((element) => {
            const translatedText =
                element.dataset[language];

            if (typeof translatedText !== "string") {
                return;
            }

            element.textContent = translatedText;
        });
    }

    function updatePlaceholderText(language) {
        const translatableInputs =
            document.querySelectorAll(
                "[data-placeholder-id][data-placeholder-en]"
            );

        translatableInputs.forEach((input) => {
            const placeholderKey =
                language === "en"
                    ? "placeholderEn"
                    : "placeholderId";

            const translatedPlaceholder =
                input.dataset[placeholderKey];

            if (typeof translatedPlaceholder !== "string") {
                return;
            }

            input.setAttribute(
                "placeholder",
                translatedPlaceholder
            );
        });
    }

    function updateAccessibilityLabels(language) {
        const accessibleElements =
            document.querySelectorAll(
                "[data-aria-id][data-aria-en]"
            );

        accessibleElements.forEach((element) => {
            const ariaKey =
                language === "en"
                    ? "ariaEn"
                    : "ariaId";

            const translatedLabel =
                element.dataset[ariaKey];

            if (typeof translatedLabel !== "string") {
                return;
            }

            element.setAttribute(
                "aria-label",
                translatedLabel
            );
        });
    }

    function applyLanguage(language) {
        const selectedLanguage =
            supportedLanguages.includes(language)
                ? language
                : defaultLanguage;

        document.documentElement.lang =
            selectedLanguage;

        updateLanguageButtons(selectedLanguage);
        updateTextContent(selectedLanguage);
        updatePlaceholderText(selectedLanguage);
        updateAccessibilityLabels(selectedLanguage);
        saveLanguage(selectedLanguage);

        document.dispatchEvent(
            new CustomEvent("languageChanged", {
                detail: {
                    language: selectedLanguage
                }
            })
        );
    }

    languageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedLanguage =
                button.dataset.language;

            applyLanguage(selectedLanguage);
        });
    });

    applyLanguage(getSavedLanguage());
}
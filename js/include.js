"use strict";

(function initializeSectionLoader() {
    const projectBasePath = (() => {
        const scriptSource = document.currentScript?.src || "";

        if (!scriptSource) {
            return "";
        }

        const scriptPath = new URL(scriptSource, window.location.href).pathname;
        const includeScriptPath = "/js/include.js";

        if (!scriptPath.endsWith(includeScriptPath)) {
            return "";
        }

        return scriptPath.slice(0, -includeScriptPath.length);
    })();

    function withProjectBase(path) {
        if (
            !path ||
            !path.startsWith("/") ||
            path.startsWith("//")
        ) {
            return path;
        }

        return `${projectBasePath}${path}`;
    }

    function normalizeRootRelativeAttributes(markup) {
        if (!projectBasePath) {
            return markup;
        }

        return markup.replace(
            /\b(href|src|data-include)="\/(?!\/)([^"]*)"/g,
            `$1="${projectBasePath}/$2"`
        );
    }

    function showLoadError(element, filePath, error) {
        const errorContainer = document.createElement("div");
        const errorMessage = document.createElement("p");
        const errorPath = document.createElement("small");

        errorContainer.className = "section-load-error";
        errorContainer.setAttribute("role", "alert");
        errorMessage.textContent = "Konten gagal dimuat.";
        errorPath.textContent = filePath;

        errorContainer.append(errorMessage, errorPath);
        element.replaceChildren(errorContainer);
        element.classList.add("section-error");

        console.error(`Gagal memuat section: ${filePath}`, error);
    }

    async function loadSection(element) {
        const filePath = element.dataset.include;

        if (!filePath) {
            return { filePath: "", loaded: false };
        }

        element.setAttribute("aria-busy", "true");

        try {
            const response = await fetch(withProjectBase(filePath), {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
            }

            const sectionContent = normalizeRootRelativeAttributes(
                await response.text()
            );

            element.innerHTML = sectionContent;
            element.classList.remove("section-error");
            element.classList.add("section-loaded");

            return { filePath, loaded: true };
        } catch (error) {
            showLoadError(element, filePath, error);
            return { filePath, loaded: false };
        } finally {
            element.removeAttribute("aria-busy");
        }
    }

    async function loadAllSections() {
        const sectionElements = Array.from(
            document.querySelectorAll("[data-include]")
        );

        const results = await Promise.all(
            sectionElements.map(loadSection)
        );

        const loadedSections = results.filter(
            (result) => result.loaded
        ).length;

        document.dispatchEvent(
            new CustomEvent("sectionsLoaded", {
                detail: {
                    totalSections: results.length,
                    loadedSections,
                    failedSections: results.length - loadedSections,
                    results
                }
            })
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            loadAllSections,
            { once: true }
        );
    } else {
        loadAllSections();
    }
}());

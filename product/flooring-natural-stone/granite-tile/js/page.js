function initGraniteFilterButtons() {
    const buttons = document.querySelectorAll(".granite-filter-button");

    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((item) => {
                item.classList.remove("is-active");
            });

            button.classList.add("is-active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initGraniteFilterButtons();
});

document.addEventListener("sectionsLoaded", () => {
    initGraniteFilterButtons();
});

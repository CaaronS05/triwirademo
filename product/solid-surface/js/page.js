function initSolidFilterButtons() {
    const buttons = document.querySelectorAll(".solid-filter-button");

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
    initSolidFilterButtons();
});

document.addEventListener("sectionsLoaded", () => {
    initSolidFilterButtons();
});

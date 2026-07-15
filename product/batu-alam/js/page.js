function initBatuFilterButtons() {
    const buttons = document.querySelectorAll(".batu-filter-button");

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
    initBatuFilterButtons();
});

document.addEventListener("sectionsLoaded", () => {
    initBatuFilterButtons();
});

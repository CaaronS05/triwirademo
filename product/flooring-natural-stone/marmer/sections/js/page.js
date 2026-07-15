function initMarmerFilterButtons() {
    const buttons = document.querySelectorAll(".marmer-filter-button");

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
    initMarmerFilterButtons();
});

document.addEventListener("sectionsLoaded", () => {
    initMarmerFilterButtons();
});
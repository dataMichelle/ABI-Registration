const filterButtons = [...document.querySelectorAll(".filter-tab")];
const activityCards = [...document.querySelectorAll(".activity-card")];
const placeholderLinks = document.querySelectorAll(".js-coming-soon");
const toast = document.querySelector("#toast");
const toastClose = toast.querySelector("button");
let toastTimer;

function filterActivities(selectedButton) {
  const selectedFilter = selectedButton.dataset.filter;

  filterButtons.forEach((button) => {
    const selected = button === selectedButton;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  activityCards.forEach((card) => {
    card.hidden =
      selectedFilter !== "all" && card.dataset.category !== selectedFilter;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterActivities(button));
});

function hideToast() {
  toast.hidden = true;
  window.clearTimeout(toastTimer);
}

function showToast(event) {
  event.preventDefault();
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(hideToast, 4500);
}

placeholderLinks.forEach((link) => link.addEventListener("click", showToast));
toastClose.addEventListener("click", hideToast);

document.querySelectorAll(".faq-grid details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    document.querySelectorAll(".faq-grid details").forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

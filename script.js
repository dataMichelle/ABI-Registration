const tabs = [...document.querySelectorAll(".day-tab")];
const panels = [...document.querySelectorAll(".day-panel")];
const dialog = document.querySelector("#rsvp-dialog");
const form = document.querySelector("#rsvp-form");
const formView = document.querySelector("#rsvp-form-view");
const successView = document.querySelector("#success-view");
const rsvpButtons = document.querySelectorAll(".js-rsvp");
const closeButton = document.querySelector("#dialog-close");
const successClose = document.querySelector("#success-close");
const storageKey = "abi-reunion-rsvp";

function selectDay(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.setAttribute("tabindex", isSelected ? "0" : "-1");
  });

  panels.forEach((panel) => {
    const isSelected = panel.id === `panel-${selectedTab.dataset.day}`;
    panel.hidden = !isSelected;
    panel.classList.toggle("active", isSelected);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectDay(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    selectDay(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

function loadSavedRsvp() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;

    Object.entries(saved).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    });
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function openRsvp() {
  formView.hidden = false;
  successView.hidden = true;
  loadSavedRsvp();
  dialog.showModal();
  requestAnimationFrame(() => form.elements.name.focus());
}

function closeRsvp() {
  dialog.close();
}

rsvpButtons.forEach((button) => button.addEventListener("click", openRsvp));
closeButton.addEventListener("click", closeRsvp);
successClose.addEventListener("click", closeRsvp);

dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) closeRsvp();
});

function celebrate() {
  const symbols = ["✦", "●", "◆", "★", "♥"];
  const colors = ["#ef6a3a", "#f7bd3d", "#2f7067", "#e99a9c"];

  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement("span");
    piece.textContent = symbols[index % symbols.length];
    piece.setAttribute("aria-hidden", "true");
    Object.assign(piece.style, {
      position: "fixed",
      zIndex: "9999",
      top: "-20px",
      left: `${Math.random() * 100}vw`,
      color: colors[index % colors.length],
      fontSize: `${8 + Math.random() * 10}px`,
      pointerEvents: "none",
      transition: `transform ${1.2 + Math.random()}s ease-in, opacity 400ms ease ${0.9 + Math.random() * 0.6}s`,
    });
    document.body.append(piece);

    requestAnimationFrame(() => {
      piece.style.transform = `translate(${Math.random() * 120 - 60}px, ${window.innerHeight + 60}px) rotate(${Math.random() * 720}deg)`;
      piece.style.opacity = "0";
    });

    window.setTimeout(() => piece.remove(), 2500);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem(storageKey, JSON.stringify(data));

  formView.hidden = true;
  successView.hidden = false;
  successClose.focus();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    celebrate();
  }
});

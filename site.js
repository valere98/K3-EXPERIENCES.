const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const eventMedia = {
  picnics: [
    { src: "images/Luxury Picnic Party _ Cherry Theme.jpeg", title: "Luxury picnic with cherry theme" }
  ],
  weddings: [
    { src: "images/wedding dinner-setup.jpeg", title: "Wedding dinner setup" },
    { src: "images/wedding reception set-up.mp4", title: "Wedding reception setup" },
    { src: "images/bridal party set-up.mp4", title: "Bridal party setup" },
    { src: "images/knot bridal shower_ Prosecco glasses with black bows.jpeg", title: "Bridal shower with prosecco glasses" }
  ],
  private: [
    { src: "images/Anniversary outdoorparty.jpeg", title: "Outdoor anniversary party" },
    { src: "images/kids birthday set-up.jpeg", title: "Children's birthday setup" },
    { src: "images/birthday.jpeg", title: "Birthday celebration" },
    { src: "images/Bears Baby Shower Party.jpeg", title: "Baby shower setup" },
    { src: "images/Cute Graduation Party Decor 2026 You'll Absolutely Love - With Houna.jpeg", title: "Graduation party decor" },
    { src: "images/graduation.jpeg", title: "Graduation celebration" },
    { src: "images/intimate friends dinner set-up.mp4", title: "Intimate dinner with friends" },
    { src: "images/garden party.jpeg", title: "Garden party" },
    { src: "images/Iftar table set up.jpeg", title: "Iftar table setup" }
  ],
  corporate: [
    { src: "images/team events.jpeg", title: "Team event" },
    { src: "images/networking event.jpeg", title: "Networking event" },
    { src: "images/conference.jpg", title: "Conference setup" },
    { src: "images/corprate event set-up.mp4", title: "Corporate event setup" },
    { src: "images/Corporate Conference.jpeg", title: "Corporate conference" }
  ],
  brands: [
    { src: "images/immersive launches event.jpeg", title: "Immersive brand launch" }
  ],
  large: [
    { src: "images/public event.jpg", title: "Public event" },
    { src: "images/carnivoe event set-up.jpeg", title: "Carnival event setup" }
  ]
};

const categoryNames = {
  picnics: "Picnics",
  weddings: "Weddings & Engagements",
  private: "Private Celebrations",
  corporate: "Corporate Events",
  brands: "Brand Experiences",
  large: "Large-Scale Events"
};

const mediaViewer = document.querySelector("#media-viewer");
const galleryGrid = document.querySelector("#gallery-grid");
const mediaCards = document.querySelectorAll("[data-media-category]");
let currentMedia = [];
let currentMediaIndex = 0;
let currentCategory = "";
let returnFocusTo = null;

const mediaUrl = item => encodeURI(item.src);
const isVideo = item => /\.mp4$/i.test(item.src);

function openMedia(category, index = 0, trigger = null) {
  currentMedia = eventMedia[category] || [];
  if (!mediaViewer || currentMedia.length === 0) return;

  currentCategory = category;
  currentMediaIndex = index;
  returnFocusTo = trigger || document.activeElement;
  renderCurrentMedia();
  if (!mediaViewer.open) mediaViewer.showModal();
}

function renderCurrentMedia() {
  const item = currentMedia[currentMediaIndex];
  if (!item || !mediaViewer) return;

  const mediaContainer = mediaViewer.querySelector("[data-viewer-media]");
  const caption = mediaViewer.querySelector("[data-viewer-caption]");
  const count = mediaViewer.querySelector("[data-viewer-count]");
  const previousVideo = mediaContainer.querySelector("video");
  if (previousVideo) previousVideo.pause();
  const media = document.createElement(isVideo(item) ? "video" : "img");
  media.src = mediaUrl(item);
  if (isVideo(item)) {
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
  } else {
    media.alt = item.title;
  }
  media.className = "viewer-asset";
  mediaContainer.replaceChildren(media);
  caption.textContent = `${categoryNames[currentCategory]}: ${item.title}`;
  count.textContent = `${currentMediaIndex + 1} of ${currentMedia.length}`;

  mediaViewer.querySelector("[data-viewer-previous]").disabled = currentMedia.length < 2;
  mediaViewer.querySelector("[data-viewer-next]").disabled = currentMedia.length < 2;
}

function stepMedia(direction) {
  if (currentMedia.length < 2) return;
  currentMediaIndex = (currentMediaIndex + direction + currentMedia.length) % currentMedia.length;
  renderCurrentMedia();
}

if (mediaViewer) {
  mediaViewer.querySelector("[data-viewer-back]")?.addEventListener("click", () => mediaViewer.close());
  mediaViewer.querySelector("[data-viewer-previous]")?.addEventListener("click", () => stepMedia(-1));
  mediaViewer.querySelector("[data-viewer-next]")?.addEventListener("click", () => stepMedia(1));
  mediaViewer.addEventListener("click", event => {
    if (event.target === mediaViewer) mediaViewer.close();
  });
  mediaViewer.addEventListener("close", () => {
    const activeVideo = mediaViewer.querySelector("video");
    if (activeVideo) activeVideo.pause();
    returnFocusTo?.focus();
    returnFocusTo = null;
  });
  mediaViewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") stepMedia(-1);
    if (event.key === "ArrowRight") stepMedia(1);
  });
}

mediaCards.forEach(card => {
  const category = card.dataset.mediaCategory;
  const items = eventMedia[category];
  if (!items?.length || !mediaViewer) return;

  const cover = document.createElement("button");
  cover.type = "button";
  cover.className = "card-media-open";
  cover.setAttribute("aria-label", `View ${categoryNames[category]} photos and videos`);
  cover.addEventListener("click", () => openMedia(category, 0, cover));

  const firstItem = items[0];
  const thumbnail = document.createElement(isVideo(firstItem) ? "video" : "img");
  thumbnail.className = "card-media";
  thumbnail.src = mediaUrl(firstItem);
  if (isVideo(firstItem)) {
    thumbnail.muted = true;
    thumbnail.playsInline = true;
    thumbnail.preload = "metadata";
  } else {
    thumbnail.alt = "";
  }
  cover.append(thumbnail);
  card.prepend(cover);
});

if (galleryGrid) {
  Object.entries(eventMedia).forEach(([category, items]) => {
    items.forEach((item, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "gallery-item";
      tile.dataset.category = category;
      tile.setAttribute("aria-label", `Open ${item.title} in ${categoryNames[category]}`);

      const media = document.createElement(isVideo(item) ? "video" : "img");
      media.className = "gallery-thumbnail";
      media.src = mediaUrl(item);
      if (isVideo(item)) {
        media.muted = true;
        media.playsInline = true;
        media.preload = "metadata";
      } else {
        media.alt = "";
      }

      const title = document.createElement("strong");
      title.textContent = item.title;
      const categoryLabel = document.createElement("span");
      categoryLabel.textContent = categoryNames[category];
      tile.append(media, title, categoryLabel);
      tile.addEventListener("click", () => openMedia(category, index, tile));
      galleryGrid.append(tile);
    });
  });
}

const inquiryForm = document.querySelector("#inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;

    const values = new FormData(inquiryForm);
    const message = [
      "Hello K3 Experiences, I would like to plan an event.",
      `Name: ${values.get("name")}`,
      `Event: ${values.get("event")}`,
      `Preferred date: ${values.get("date") || "Not decided"}`,
      `Details: ${values.get("details") || "I would like to discuss my ideas."}`
    ].join("\n");
    const status = document.querySelector("#form-status");
    status.textContent = "Opening WhatsApp with your inquiry. Please review and send the message there.";
    window.open(`https://wa.me/254115890933?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

if (galleryGrid) {
  const filters = document.querySelectorAll("[data-gallery-filter]");
  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.galleryFilter;
      filters.forEach(button => button.setAttribute("aria-pressed", String(button === filter)));
      galleryGrid.querySelectorAll("[data-category]").forEach(item => {
        item.hidden = category !== "all" && item.dataset.category !== category;
      });
    });
  });
}

const spinOrbit = document.querySelector("[data-spin-orbit]");
if (spinOrbit) {
  const photos = [...spinOrbit.querySelectorAll(".spin-photo")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let angle = 0;
  let previousTime = 0;

  photos.forEach(photo => {
    photo.addEventListener("focus", () => photo.classList.add("is-focused"));
    photo.addEventListener("blur", () => photo.classList.remove("is-focused"));
    photo.addEventListener("click", () => {
      const wasSelected = photo.classList.contains("is-selected");
      photos.forEach(item => item.classList.remove("is-selected"));
      if (!wasSelected) photo.classList.add("is-selected");
    });
  });

  const animateOrbit = time => {
    if (!previousTime) previousTime = time;
    if (!reducedMotion.matches) angle += (time - previousTime) * 0.00022;
    previousTime = time;

    const width = spinOrbit.clientWidth;
    const radiusX = Math.min(width * (width < 640 ? 0.43 : 0.39), 430);
    const radiusY = width < 640 ? 250 : Math.min(width * 0.28, 225);

    photos.forEach((photo, index) => {
      const orbitAngle = angle + (Math.PI * 2 * index) / photos.length;
      const depth = (Math.sin(orbitAngle) + 1) / 2;
      const selected = photo.classList.contains("is-selected") || photo.classList.contains("is-focused");
      const scale = 0.78 + depth * 0.25 + (selected ? 0.12 : 0);

      photo.style.setProperty("--x", `${Math.cos(orbitAngle) * radiusX}px`);
      photo.style.setProperty("--y", `${Math.sin(orbitAngle) * radiusY}px`);
      photo.style.setProperty("--scale", scale.toFixed(3));
      photo.style.zIndex = selected ? "30" : String(depth > 0.84 ? Math.round(depth * 3) + 11 : Math.round(depth * 9) + 1);
      photo.style.filter = selected ? "blur(0)" : `blur(${((1 - depth) * 3.2).toFixed(2)}px)`;
      photo.style.opacity = selected ? "1" : (0.62 + depth * 0.38).toFixed(2);
    });

    window.requestAnimationFrame(animateOrbit);
  };

  window.requestAnimationFrame(animateOrbit);
}

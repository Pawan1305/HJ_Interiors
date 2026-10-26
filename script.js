const mobileToggle = document.querySelector(".mobile-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const header = document.querySelector(".site-header");
const filterButtons = document.querySelectorAll(".filter-btn");
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const year = document.getElementById("year");
const contactFab = document.getElementById("contact-fab");
const fabPanel = document.getElementById("fab-panel");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (mobileToggle && siteNav) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    mobileToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 800 && siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 18);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const imageAssets = [
  "assets/WhatsApp Image 2026-10-26 at 5.09.43 PM.jpeg",
  "assets/WhatsApp Image 2026-10-26 at 5.09.48 PM.jpeg",
  ...Array.from({ length: 3 }, (_, i) => `assets/WhatsApp Image 2026-10-26 at 5.09.48 PM (${i + 1}).jpeg`),
  "assets/WhatsApp Image 2026-10-26 at 5.09.49 PM.jpeg",
  ...Array.from(
    { length: 16 },
    (_, i) => `assets/WhatsApp Image 2026-10-26 at 5.09.49 PM (${i + 1}).jpeg`
  )
];

const videoAssets = [
  "assets/WhatsApp Video 2026-10-26 at 5.09.54 PM.mp4",
  ...Array.from(
    { length: 26 },
    (_, i) => `assets/WhatsApp Video 2026-10-26 at 5.09.54 PM (${i + 1}).mp4`
  )
];

const allAssets = [
  ...imageAssets.map((src, index) => ({
    type: "image",
    src,
    caption: `Project image ${index + 1}`,
    alt: `HJ Interiors completed project image ${index + 1}`
  })),
  ...videoAssets.map((src, index) => ({
    type: "video",
    src,
    caption: `Project video ${index + 1}`,
    alt: `HJ Interiors interior design project video ${index + 1}`
  }))
];

const renderGallery = () => {
  if (!gallery) return;

  const markup = allAssets
    .map((asset) => {
      if (asset.type === "image") {
        return `
          <figure class="gallery-item gallery-item--image reveal" data-category="image">
            <img src="${asset.src}" alt="${asset.alt}" loading="lazy" decoding="async" />
            <figcaption>${asset.caption}</figcaption>
          </figure>
        `;
      }

      return `
        <figure class="gallery-item reveal" data-category="video">
          <video preload="metadata" controls playsinline>
            <source src="${asset.src}" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <figcaption>${asset.caption}</figcaption>
        </figure>
      `;
    })
    .join("");

  gallery.innerHTML = markup;
};

renderGallery();

const getGalleryItems = () => document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    getGalleryItems().forEach((item) => {
      const category = item.dataset.category;
      const shouldShow = selectedFilter === "all" || category === selectedFilter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

if (gallery) {
  gallery.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const figure = target.closest(".gallery-item--image");
    if (!figure || !lightbox || !lightboxImage || !lightboxCaption) return;

    const image = figure.querySelector("img");
    const caption = figure.querySelector("figcaption");
    if (!image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption ? caption.textContent ?? "" : "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
}

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

if (contactFab && fabPanel) {
  contactFab.addEventListener("click", () => {
    const isOpen = fabPanel.classList.toggle("is-open");
    fabPanel.setAttribute("aria-hidden", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    const clickedInside = fabPanel.contains(target) || contactFab.contains(target);
    if (!clickedInside) {
      fabPanel.classList.remove("is-open");
      fabPanel.setAttribute("aria-hidden", "true");
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

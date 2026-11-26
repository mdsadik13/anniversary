document.body.classList.add("opening-active");

const opening = document.getElementById("opening");
const site = document.getElementById("site");
const openStory = document.getElementById("openStory");
opening.classList.add("is-signature-playing");

const pinkHearts = document.querySelectorAll(".ambient-hearts--pink span");
const heartColumns = 5;
const heartRows = Math.ceil(pinkHearts.length / heartColumns);
let heartSeed = 2711;
const nextHeartRandom = () => {
  heartSeed = (heartSeed * 1664525 + 1013904223) >>> 0;
  return heartSeed / 4294967296;
};
pinkHearts.forEach((heart, index) => {
  const column = index % heartColumns;
  const row = Math.floor(index / heartColumns);
  const x = 5 + (column + .5 + (nextHeartRandom() - .5) * .5) * 90 / heartColumns;
  const y = (row + .5 + (nextHeartRandom() - .5) * .7) * 100 / heartRows;
  heart.style.left = `${x}%`;
  heart.style.top = `${y}%`;
});

openStory.addEventListener("click", () => {
  opening.classList.add("is-open");
  site.classList.add("is-visible");
  document.body.classList.remove("opening-active");
  window.setTimeout(() => site.classList.add("is-heart-lit"), 750);
  window.setTimeout(() => opening.setAttribute("aria-hidden", "true"), 1000);
});

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("siteNav");
navToggle.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");
  siteNav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
siteNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

const envelope = document.getElementById("envelope");
const letterCard = document.getElementById("letterCard");
const envelopeHint = document.getElementById("envelopeHint");
envelope.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("is-open");
  envelope.setAttribute("aria-expanded", String(isOpen));
  envelope.setAttribute("aria-label", isOpen ? "Close the letter" : "Open the letter");
  envelopeHint.textContent = isOpen ? "A little letter for you" : "Tap to open";
  letterCard.classList.toggle("is-visible", isOpen);
  letterCard.setAttribute("aria-hidden", String(!isOpen));
});

document.querySelectorAll(".love-card").forEach(card => {
  card.addEventListener("click", () => {
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(isFlipped));
  });
});

const memories = [
  { file: "FirstDayWeMetInreal.jpeg" },
  { file: "FirstDate.jpeg" },
  { file: "FirstTrip.jpeg" },
  { file: "FirstTrip (2).jpeg" },
  { file: "FirstTrip (3).jpeg" },
  { file: "FirstTrip (4).jpeg" },
  { file: "FirstTrip (5).jpeg" },
  { file: "FirstTrip (6).jpeg" },
  { file: "AtHerSistersWedding.jpeg" },
  { file: "A Fianl meet before our long distance start.jpeg" },
  { file: "Enjoying the peace despite all the problem.jpeg" },
  { file: "Enjoying at nit.jpeg" },
  { file: "OurFirstConcern.jpeg" },
  { file: "Your cute efforts.jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.36 PM.jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.40 PM (1).jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.40 PM.jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.41 PM (2).jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.41 PM.jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.42 PM (2).jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.42 PM.jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.46 PM (1).jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.46 PM (2).jpeg" },
  { file: "WhatsApp Image 2026-11-24 at 4.46.47 PM (1).jpeg" }
].map((memory, index) => ({
  ...memory,
  src: `assets/images/${encodeURI(memory.file)}`,
  title: "",
  caption: ""
}));

const gallery = document.getElementById("gallery");
memories.forEach((memory, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `gallery-card reveal${index % 7 === 0 ? " gallery-card--tall" : ""}${index % 11 === 3 ? " gallery-card--wide" : ""}${memory.file === "FirstDayWeMetInreal.jpeg" ? " gallery-card--love" : ""}`;
  card.dataset.index = String(index);
  card.setAttribute("aria-label", `Open memory ${String(index + 1).padStart(2, "0")}`);
  card.style.setProperty("--card-z", String(index + 1));
  card.innerHTML = `
    <img src="${memory.src}" alt="An anniversary memory" loading="${index < 6 ? "eager" : "lazy"}">
    ${memory.file === "FirstDayWeMetInreal.jpeg" ? '<svg class="gallery-card__love-border" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect class="gallery-card__love-border-glow" x="2" y="2" width="96" height="96" rx="3"></rect><rect class="gallery-card__love-border-line" x="2" y="2" width="96" height="96" rx="3"></rect></svg>' : ""}
  `;
  card.style.transitionDelay = `${(index % 6) * 55}ms`;
  card.addEventListener("click", () => showLightbox(index));
  gallery.appendChild(card);
  revealObserver.observe(card);
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let lightboxIndex = 0;

function showLightbox(index) {
  lightboxIndex = (index + memories.length) % memories.length;
  const memory = memories[lightboxIndex];
  lightboxImage.src = memory.src;
  lightboxImage.alt = memory.title || "A memory from our first year together";
  lightboxCaption.textContent = "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close").focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery-card").forEach(card => {
  card.addEventListener("click", () => showLightbox(Number(card.dataset.index)));
});
document.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
document.querySelector(".lightbox__nav--prev").addEventListener("click", () => showLightbox(lightboxIndex - 1));
document.querySelector(".lightbox__nav--next").addEventListener("click", () => showLightbox(lightboxIndex + 1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

let touchStartX = 0;
lightbox.addEventListener("touchstart", event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", event => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) showLightbox(lightboxIndex + (delta < 0 ? 1 : -1));
}, { passive: true });

document.getElementById("finalReveal").addEventListener("click", event => {
  const message = document.getElementById("finalMessage");
  const isVisible = message.classList.toggle("is-visible");
  message.setAttribute("aria-hidden", String(!isVisible));
  event.currentTarget.textContent = isVisible ? "One more time, always us ♡" : "Reveal my final wish ♡";
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  if (event.key === "ArrowLeft" && lightbox.classList.contains("is-open")) showLightbox(lightboxIndex - 1);
  if (event.key === "ArrowRight" && lightbox.classList.contains("is-open")) showLightbox(lightboxIndex + 1);
});

const musicControl = document.getElementById("musicControl");
const music = document.getElementById("backgroundMusic");
musicControl.addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => {
      musicControl.classList.add("is-playing");
      musicControl.setAttribute("aria-label", "Pause music");
    }).catch(() => {
      musicControl.setAttribute("aria-label", "Music unavailable; add your audio file");
    });
  } else {
    music.pause();
    musicControl.classList.remove("is-playing");
    musicControl.setAttribute("aria-label", "Play music");
  }
});

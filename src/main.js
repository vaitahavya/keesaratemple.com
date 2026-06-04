import "./style.css";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

const images = [
  { src: "/images/temple-gate.jpg", alt: "Keesaragutta temple main gate" },
  { src: "/images/temple-ruins.jpg", alt: "Keesaragutta temple view from ruins" },
  { src: "/images/temple-view.jpg", alt: "Temple at Keesaragutta" },
  { src: "/images/temple-site.jpg", alt: "Temple at Keesaraguda" },
  { src: "/images/temple-night.jpg", alt: "Keesara site at night" },
  { src: "/images/lotus-pond.jpg", alt: "Lotus pond at Keesara" },
  { src: "/images/temple-semi-ruined.jpg", alt: "Semi ruined temple at Keesaragutta" },
  { src: "/images/temple-gate-small.jpg", alt: "Keesara gutta main temple gate" },
];

const track = document.querySelector(".slideshow__track");
const frame = document.querySelector(".slideshow__frame");
const slideshow = document.querySelector(".slideshow");

let timeline;
let progress = 0;

function buildSlideshow() {
  images.forEach((image) => {
    const slide = document.createElement("article");
    slide.className = "slideshow__slide";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "eager";
    img.decoding = "async";
    slide.appendChild(img);

    track.appendChild(slide);
  });

  return Promise.all(
    [...track.querySelectorAll("img")].map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );
}

function getSlideWidth() {
  return frame.getBoundingClientRect().width;
}

function syncSlideSizes() {
  const width = getSlideWidth();
  if (!width) return;

  gsap.set(track.querySelectorAll(".slideshow__slide"), {
    width,
    flexBasis: width,
  });
}

function getTotalShift() {
  return getSlideWidth() * (images.length - 1);
}

function buildTimeline() {
  timeline?.kill();

  syncSlideSizes();

  const totalShift = getTotalShift();
  if (!totalShift) return;

  gsap.set(track, { x: 0 });
  gsap.set(slideshow, { y: 0 });

  timeline = gsap
    .timeline({ paused: true })
    .to(track, { x: -totalShift, ease: "none" })
    .to(
      slideshow,
      { y: -Math.min(window.innerHeight * 0.1, 64), ease: "none" },
      0
    );

  timeline.progress(progress);
}

function initInteraction() {
  Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    tolerance: 12,
    preventDefault: true,
    onChangeY(self) {
      const step = self.deltaY / (window.innerHeight * 0.85);
      progress = gsap.utils.clamp(0, 1, progress + step);
      timeline?.progress(progress);
    },
  });
}

buildSlideshow().then(() => {
  requestAnimationFrame(() => {
    buildTimeline();
    initInteraction();
  });
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildTimeline, 200);
});

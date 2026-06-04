import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const orbit = document.querySelector(".orbit");
const scrollStage = document.querySelector(".scroll-stage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createOrbitItems() {
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.34;

  images.forEach((image, index) => {
    const angle = (index / images.length) * Math.PI * 2;
    const item = document.createElement("div");
    item.className = "orbit__item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    item.appendChild(img);

    gsap.set(item, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotation: (angle * 180) / Math.PI + 90,
    });

    orbit.appendChild(item);
  });
}

function initScrollAnimation() {
  const items = gsap.utils.toArray(".orbit__item");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".page",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: ".scroll-stage",
      anticipatePin: 1,
    },
  });

  tl.to(
    ".orbit",
    {
      rotation: 540,
      ease: "none",
    },
    0
  )
    .to(
      items,
      {
        y: "-=55vh",
        scale: 0.82,
        autoAlpha: 0.35,
        stagger: 0.04,
        ease: "none",
      },
      0
    )
    .to(
      ".orbit__ring",
      {
        scale: 1.35,
        autoAlpha: 0,
        ease: "none",
      },
      0
    );
}

function initStaticLayout() {
  gsap.set(".orbit__item", { autoAlpha: 1 });
}

createOrbitItems();

if (reducedMotion) {
  initStaticLayout();
} else {
  initScrollAnimation();
}

window.addEventListener("load", () => ScrollTrigger.refresh());

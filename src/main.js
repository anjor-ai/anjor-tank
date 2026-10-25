import "./studio-next.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wordReel } from "./artcv.js";
import { LABS } from "./lab-data.js";
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
let paused = root.classList.contains("rm");
const motionButton = $("#motion");
function reflectMotion() {
  motionButton.textContent = paused ? "Enable motion" : "Pause motion";
  motionButton.setAttribute("aria-pressed", String(paused));
}
reflectMotion();
$("#theme").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("anjor-theme", next);
  } catch {}
  $('meta[name="theme-color"]').content =
    next === "dark" ? "#090d18" : "#ffffff";
});
const menu = $("#menu"),
  mobile = $("#mobile-nav");
function closeMenu() {
  mobile.hidden = true;
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
}
menu.addEventListener("click", () => {
  mobile.hidden = !mobile.hidden;
  menu.setAttribute("aria-expanded", String(!mobile.hidden));
  menu.setAttribute(
    "aria-label",
    mobile.hidden ? "Open navigation" : "Close navigation",
  );
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobile.hidden) {
    closeMenu();
    menu.focus();
  }
});
matchMedia("(min-width:901px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});
$$("[data-rl]").forEach(wordReel);
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  if (paused) return;
  gsap.from(".hero>h1,.hero>.eyebrow,.hero-lead", {
    opacity: 0,
    y: 14,
    duration: 0.7,
    stagger: 0.08,
    ease: "power2.out",
    clearProps: "all",
  });
  gsap.from(".keyboard", {
    opacity: 0,
    y: 35,
    duration: 1.1,
    delay: 0.15,
    ease: "power3.out",
  });
  $$(
    ".section-heading,.founder-feature,.role-pair,.personal-teaser,.principles,.track-grid,.timeline-row",
  ).forEach((el) =>
    gsap.from(el, {
      y: 25,
      opacity: 0.25,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
      clearProps: "all",
    }),
  );
  const stage = $("[data-keyboard-root]"),
    keyboard = $(".keyboard");
  if (stage && matchMedia("(hover:hover) and (min-width:901px)").matches) {
    const tiltX = gsap.quickTo(keyboard, "rotationX", {
        duration: 0.7,
        ease: "power2.out",
      }),
      tiltZ = gsap.quickTo(keyboard, "rotation", {
        duration: 0.7,
        ease: "power2.out",
      });
    const move = (e) => {
      if (paused) return;
      const r = stage.getBoundingClientRect();
      tiltX(28 + ((e.clientY - r.top - r.height / 2) / r.height) * 5);
      tiltZ(-5 + ((e.clientX - r.left - r.width / 2) / r.width) * 3);
    };
    const leave = () => {
      tiltX(28);
      tiltZ(-5);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }
});
motionButton.addEventListener("click", () => {
  try {
    sessionStorage.setItem("anjor-motion", paused ? "on" : "off");
  } catch {}
  location.reload();
});
motionQuery.addEventListener("change", () => location.reload());
$$("[data-key]").forEach((key) => {
  const preview = $("#key-preview");
  const show = () => {
    preview.textContent = key.dataset.caption;
  };
  const reset = () => {
    preview.textContent = "Choose a key. Open a different part of my world.";
  };
  key.addEventListener("pointerenter", show);
  key.addEventListener("focus", show);
  key.addEventListener("pointerleave", reset);
  key.addEventListener("blur", reset);
});
const hello = $("#hello-input");
hello?.addEventListener("input", () => {
  const value = hello.value.trim().toLowerCase();
  $("#hello-output").textContent =
    value === "hello"
      ? "Hello back. Glad you found your way here."
      : value === "meshhetu"
        ? "Rethink how systems work."
        : value
          ? "Keep exploring. Every key opens a new story."
          : "A small hello goes a long way.";
});
hello?.addEventListener("keydown", (e) => {
  const key = $$("[data-letter]").find(
    (k) => k.dataset.letter === e.key.toUpperCase(),
  );
  if (key) {
    key.classList.add("pressed");
    setTimeout(() => key.classList.remove("pressed"), 180);
  }
});
function filters(buttonAttr, cardAttr) {
  const buttons = $$(`[${buttonAttr}]`);
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const value = b.getAttribute(buttonAttr);
      $$(`[${cardAttr}]`).forEach((c) => {
        c.hidden = value !== "All" && c.getAttribute(cardAttr) !== value;
      });
      ScrollTrigger.refresh();
    }),
  );
}
filters("data-filter", "data-category");
filters("data-photo-filter", "data-photo-category");
$$("[data-lab]").forEach((lab) => {
  const data = LABS[lab.dataset.lab],
    buttons = $$("[data-scenario]", lab);
  const set = (i) => {
    buttons.forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
    $("[data-result-number]", lab).textContent = data.results[i][0];
    $("[data-result-title]", lab).textContent = data.results[i][1];
    $("[data-result-copy]", lab).textContent = data.results[i][2];
    if (!paused)
      gsap.fromTo(
        $(".lab-result", lab),
        { y: 6, opacity: 0.5 },
        { y: 0, opacity: 1, duration: 0.3 },
      );
  };
  buttons.forEach((b) =>
    b.addEventListener("click", () => set(+b.dataset.scenario)),
  );
  $("[data-reset]", lab).addEventListener("click", () => set(0));
});
const form = $("#brief-form");
if (form) {
  const track = new URLSearchParams(location.search).get("track");
  if (["A", "B"].includes(track)) $("#intent").value = track;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#brief-name").value.trim(),
      brief = $("#brief").value.trim();
    if (!name || !brief) {
      $("#brief-status").textContent =
        "Please add your name and a short brief.";
      return;
    }
    const intent = $("#intent").selectedOptions[0].textContent;
    const body = `Hi Anjor,\n\n${brief}\n\n${name}`;
    location.href = `mailto:anjort2000@gmail.com?subject=${encodeURIComponent(intent + " — " + name)}&body=${encodeURIComponent(body)}`;
    $("#brief-status").textContent =
      "Your email draft is ready to open. If your email app does not launch, use the direct email link.";
  });
}

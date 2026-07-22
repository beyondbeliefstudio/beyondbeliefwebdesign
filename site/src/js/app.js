import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The inline <head> script already set data-motion; re-assert under reduced motion.
if (reduceMotion) root.setAttribute("data-motion", "off");
const motionOff = () => root.getAttribute("data-motion") === "off";

let lenis = null;

function boot() {
  try {
    // Always run (these degrade gracefully).
    initMenu();
    initMarquees();
    initAnchors();
    initNavActive();
    initHeader();
    initCtaGlow();
    initFieldWash(); // Three.js hero wash — self-handles reduced motion (paints a static frame)
    initCursor(); // desktop trailing cursor — self-guards on fine-pointer + reduced motion

    if (motionOff()) {
      // Drift is disabled under reduced motion; clear any inline transform a prior
      // parallax run may have left so the map sits at its static CSS default.
      gsap.set(".hero-map", { clearProps: "all" });
      gsap.set("#problem .prob-illo", { clearProps: "all" });
      gsap.set(["section.sec-dark", "#contact"], { clearProps: "all" });
      return;
    }

    // Motion layer. Reveals/markers/counters use IntersectionObserver + CSS
    // (robust, no animation-library timing to stall). GSAP drives the horizontal
    // Work pin-scroll and the hero map parallax, which need scrubbed scrolling.
    initLenis();
    initPreloader();
    initDarkPanelWipe();
    initReveals();
    initWordFill();
    initHighlights();
    initCounters();
    initWorkScroll();
    initHeroParallax();
    initProblemParallax();
  } catch (err) {
    // Never leave content hidden — drop to the fully-visible static page.
    console.warn("[bb] motion disabled:", err);
    root.setAttribute("data-motion", "off");
  }
}

// ==========================================
// SMOOTH SCROLL (Lenis on its own rAF loop)
// ==========================================
function initLenis() {
  try {
    lenis = new Lenis({ lerp: 0.105, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = time => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch (err) {
    lenis = null;
  }
}

function lockScroll(lock) {
  if (lenis) lock ? lenis.stop() : lenis.start();
  document.body.style.overflow = lock ? "hidden" : "";
}

// ==========================================
// MARQUEES — duplicate the track once for a seamless -50% loop
// ==========================================
function initMarquees() {
  if (reduceMotion) return; // leave static under reduced motion
  document.querySelectorAll(".marquee-track").forEach(track => {
    Array.from(track.children).forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
    track.setAttribute("data-animated", "");
  });
}

// ==========================================
// OVERLAY MENU
// ==========================================
function initMenu() {
  const btn = document.getElementById("menu-btn");
  const overlay = document.getElementById("menu-overlay");
  if (!btn || !overlay) return;

  let open = false;
  const setOpen = v => {
    open = v;
    root.classList.toggle("menu-open", v);
    btn.setAttribute("aria-expanded", String(v));
    btn.setAttribute("aria-label", v ? "Close menu" : "Open menu");
    overlay.setAttribute("aria-hidden", String(!v));
    lockScroll(v);
  };

  btn.addEventListener("click", () => setOpen(!open));
  overlay.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && open) setOpen(false);
  });
}

// ==========================================
// HEADER — scrolled state + hide on scroll-down / show on scroll-up
// ==========================================
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const setNavHeight = () =>
    root.style.setProperty("--nav-height", header.offsetHeight + "px");
  setNavHeight();
  window.addEventListener("resize", setNavHeight, { passive: true });

  const canHide = !motionOff();
  let lastY = window.scrollY || 0;
  let hidden = false;

  const onScroll = () => {
    const y = window.scrollY || 0;
    header.classList.toggle("scrolled", y > 12);

    if (canHide && !root.classList.contains("menu-open")) {
      if (y > 300 && y > lastY + 4 && !hidden) {
        header.classList.add("nav-hidden");
        hidden = true;
      } else if (y < lastY - 4 && hidden) {
        header.classList.remove("nav-hidden");
        hidden = false;
      }
    } else if (hidden) {
      header.classList.remove("nav-hidden");
      hidden = false;
    }
    lastY = y;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ==========================================
// CUSTOM CURSOR — an ink dot (near-instant) + a ring that trails behind, with
// hover/view states. Desktop only: bails on touch or reduced motion, leaving
// the native cursor untouched (data-cursor stays off, so the cursor:none and
// dot/ring CSS never apply).
// ==========================================
function initCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!finePointer || reduceMotion) {
    root.setAttribute("data-cursor", "off");
    return;
  }
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  root.setAttribute("data-cursor", "on");
  ring.style.display = "flex";

  // dot tracks almost instantly; ring trails with a softer ease (the lag = the effect)
  const dx = gsap.quickTo(dot, "x", { duration: 0.015, ease: "power2.out" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.015, ease: "power2.out" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.14, ease: "power3.out" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.14, ease: "power3.out" });

  window.addEventListener(
    "pointermove",
    e => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    },
    { passive: true }
  );

  // state switching via event delegation (two listeners total)
  document.addEventListener("pointerover", e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const hov = t.closest('a, button, input, textarea, [data-cursor="grow"]');
    const dark = t.closest(".sec-dark, footer");
    document.body.classList.toggle("cur-hover", !!hov);
    document.body.classList.toggle("cur-light", !!dark);
  });
  document.addEventListener("pointerout", e => {
    if (!e.relatedTarget) document.body.classList.remove("cur-hover", "cur-light");
  });
}

// ==========================================
// PRELOADER (home only) — counts up, fills the bar, then slides away to reveal
// the page. Scroll is locked while it's up. Bails cleanly if rAF is throttled.
// ==========================================
function initPreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return; // rendered on the home page only

  // Skip on phones — the overlay delays the hero from counting as LCP, and mobile
  // is where that budget matters most. CSS hides it there too (no flash/scroll-lock).
  if (window.matchMedia("(max-width: 767px)").matches) {
    pre.remove();
    return;
  }

  const countEl = pre.querySelector(".pre-count");
  const barEl = pre.querySelector(".pre-bar i");
  lockScroll(true);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    pre.classList.add("is-leaving");
    const cleanup = () => {
      lockScroll(false);
      pre.remove();
    };
    pre.addEventListener("transitionend", cleanup, { once: true });
    setTimeout(cleanup, 1100); // fallback if transitionend never fires
  };

  // eased count 0 → 100 (~1.4s), filling the bar in step
  const duration = 1400;
  let startTs = null;
  const step = ts => {
    if (startTs === null) startTs = ts;
    const p = Math.min(1, (ts - startTs) / duration);
    const val = Math.round((1 - Math.pow(1 - p, 2)) * 100);
    if (countEl) countEl.textContent = String(val);
    if (barEl) barEl.style.width = val + "%";
    if (p < 1) requestAnimationFrame(step);
    else setTimeout(finish, 180); // brief hold at 100
  };
  requestAnimationFrame(step);

  // failsafe: a hidden/background tab throttles rAF so the count stalls — timers
  // still fire, so force the exit rather than block the page behind the overlay.
  setTimeout(() => {
    if (done) return;
    if (countEl) countEl.textContent = "100";
    if (barEl) barEl.style.width = "100%";
    finish();
  }, 4500);
}

// ==========================================
// REVEAL SYSTEM (IntersectionObserver → .is-in, CSS transitions)
// ==========================================
function makeObserver(onEnter, options) {
  return new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onEnter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    options || { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
}

function initReveals() {
  // hero / subpage line-mask headlines are in view on load — reveal next frame
  document.querySelectorAll(".lines").forEach(el => {
    requestAnimationFrame(() => el.classList.add("is-in"));
  });

  const io = makeObserver(el => el.classList.add("is-in"));
  document.querySelectorAll("[data-reveal], [data-wipe]").forEach(el => io.observe(el));

  const ioStagger = makeObserver(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
      child.classList.add("is-in");
    });
  });
  document.querySelectorAll("[data-reveal-stagger]").forEach(g => ioStagger.observe(g));
}

// ==========================================
// WORD-FILL STATEMENT (words "ink in" on enter)
// ==========================================
function initWordFill() {
  const targets = document.querySelectorAll("[data-fill-words]");
  targets.forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = i < words.length - 1 ? word + " " : word;
      span.style.transitionDelay = `${i * 0.05}s`;
      el.appendChild(span);
    });
  });
  const io = makeObserver(el => el.classList.add("is-in"), {
    rootMargin: "0px 0px -18% 0px",
    threshold: 0.15,
  });
  targets.forEach(el => io.observe(el));
}

// ==========================================
// LIME HIGHLIGHT MARKERS
// ==========================================
function initHighlights() {
  const io = makeObserver(el => el.classList.add("on"), {
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.2,
  });
  document.querySelectorAll(".hl").forEach(el => io.observe(el));
}

// ==========================================
// COUNTERS (rAF count-up, GSAP-independent)
// ==========================================
function initCounters() {
  const io = makeObserver(el => {
    const target = parseFloat(el.getAttribute("data-count"));
    if (Number.isNaN(target)) return;
    const duration = 1600;
    let startTs = null;
    const step = ts => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  document.querySelectorAll("[data-count]").forEach(el => io.observe(el));
}

// ==========================================
// HORIZONTAL "WORK" SCROLL (homepage, ≥901px)
// ==========================================
function initWorkScroll() {
  const section = document.getElementById("work");
  if (!section) return;
  const stage = section.querySelector(".work-stage");
  const track = section.querySelector(".work-track");
  if (!stage || !track) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    section.classList.add("work-pinned");
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      section.classList.remove("work-pinned");
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  });
}

// ==========================================
// HERO FIELD WASH (Three.js watercolor field, lazy-loaded as its own chunk)
// ==========================================
// The Three.js chunk is ~480KB. On a throttled mobile CPU it wrecks LCP/TBT, so
// it only loads on capable large-screen devices, and only AFTER the page has
// loaded and the main thread is idle — the hero paints first, effect second.
// Everywhere else the CSS "paper" ground is the (indistinguishable) fallback.
function fieldWashAllowed() {
  if (motionOff()) return false;
  if (root.getAttribute("data-field") === "off") return false;
  if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false;
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return false;
  const mem = navigator.deviceMemory; // Chromium only; undefined elsewhere = allow
  if (mem && mem < 4) return false;
  return true;
}

function initFieldWash() {
  if (!document.getElementById("field-canvas")) return;
  if (!fieldWashAllowed()) return;
  const load = () => import("./field.js").then(m => m.initField()).catch(() => {});
  const schedule = () =>
    "requestIdleCallback" in window ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 900);
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
}

// ==========================================
// HERO MAP PARALLAX — map zooms in + drifts up as you scroll through each hero
// ==========================================
function initHeroParallax() {
  document.querySelectorAll(".hero-map").forEach(map => {
    const hero = map.closest("section");
    if (!hero) return;
    gsap.fromTo(
      map,
      { scale: 1, yPercent: 0 },
      {
        scale: 1.16,
        yPercent: -6,
        ease: "none",
        transformOrigin: "center 42%",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.7 },
      }
    );
  });
}

// ==========================================
// DARK PANEL WIPE — dark sections expand from a floating inset card to full-bleed
// as they scroll into view; scrubbed so the expansion tracks scroll position.
// ==========================================
function initDarkPanelWipe() {
  document.querySelectorAll("section.sec-dark, #contact").forEach(sec => {
    gsap.fromTo(
      sec,
      { clipPath: "inset(4% 3% 8% 3% round 26px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "power1.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 92%",
          end: "top 30%",
          scrub: 0.4,
        },
      }
    );
  });
}

// ==========================================
// CTA GLOW — radial gradient follows the pointer within the section
// ==========================================
function initCtaGlow() {
  const section = document.querySelector("[data-cta-glow]");
  if (!section) return;
  section.addEventListener(
    "pointermove",
    e => {
      const { left, top, width, height } = section.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      section.style.setProperty("--mx", `${x.toFixed(1)}%`);
      section.style.setProperty("--my", `${y.toFixed(1)}%`);
    },
    { passive: true }
  );
}

// ==========================================
// PROBLEM SECTION PARALLAX — illustration drifts y:48→-38 as it scrolls through
// ==========================================
function initProblemParallax() {
  const probFrame = document.querySelector("#problem .prob-illo");
  if (!probFrame) return;
  gsap.fromTo(
    probFrame,
    { y: 48 },
    {
      y: -38,
      ease: "none",
      scrollTrigger: {
        trigger: probFrame,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    }
  );
}

// ==========================================
// IN-PAGE ANCHORS (Lenis-scrolled with a header offset)
// ==========================================
function initAnchors() {
  const onHome = (location.pathname.replace(/\/$/, "") || "/") === "/";

  // Landing on /#section from another page: re-scroll with the header offset
  if (onHome && location.hash && document.querySelector(location.hash)) {
    requestAnimationFrame(() => {
      const t = document.querySelector(location.hash);
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: -90, immediate: true });
      else window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 90);
    });
  }

  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(a => {
    let id = a.getAttribute("href");
    // "/#services" only behaves as an in-page anchor when already on the home page
    if (id && id.startsWith("/#")) {
      if (!onHome) return;
      id = id.slice(1);
    }
    if (!id || id === "#") return;
    a.addEventListener("click", e => {
      const target = id === "#top" ? null : document.querySelector(id);
      if (id !== "#top" && !target) return;
      e.preventDefault();

      root.classList.remove("menu-open");
      document.getElementById("menu-btn")?.setAttribute("aria-expanded", "false");
      document.getElementById("menu-overlay")?.setAttribute("aria-hidden", "true");
      lockScroll(false);

      const dest = id === "#top" ? 0 : target;
      if (lenis) lenis.scrollTo(dest, { offset: -90, duration: 1.2 });
      else if (id === "#top") window.scrollTo({ top: 0, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ==========================================
// NAV ACTIVE STATE (footer / inline nav links)
// ==========================================
function initNavActive() {
  const here = (location.pathname.replace(/\/$/, "") || "/").toLowerCase();
  document.querySelectorAll("a.nav-link[href]").forEach(a => {
    const path = (new URL(a.href).pathname.replace(/\/$/, "") || "/").toLowerCase();
    if (path === here) a.classList.add("active");
  });
}

// ==========================================
// ENTRY — invoked at the very bottom so every init function above is defined
// first (bundlers/minifiers don't reliably preserve function-declaration
// hoisting across an earlier call). The module is deferred, so it can run
// after DOMContentLoaded has already fired — guard on readyState.
// ==========================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

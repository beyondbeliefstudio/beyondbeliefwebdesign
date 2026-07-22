/* Beyond Belief V2 — motion system
   Lenis smooth scroll · GSAP ScrollTrigger · preloader · custom cursor ·
   scramble labels · word-fill · velocity marquee ·
   pinned horizontal work section · parallax · rail · tweaks bridge. */
(function () {
  'use strict';
  var docEl = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasGSAP = !!window.gsap;
  var state = { calm: false };

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (reduced || !hasGSAP) {
    docEl.dataset.motion = 'off';
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
    var rail = document.getElementById('rail');
    if (rail) rail.style.opacity = '1';
    document.querySelectorAll('.hl').forEach(function (el) { el.classList.add('on'); });
    if (!hasGSAP) return;
  }

  /* ================= Lenis ================= */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.105, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (docEl.classList.contains('menu-open') && state.closeMenu) state.closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      else target.scrollIntoView ? window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }) : null;
    });
  });

  /* ================= helpers ================= */
  function splitWords(el) {
    var text = el.textContent;
    el.textContent = '';
    var frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = part;
      frag.appendChild(s);
    });
    el.appendChild(frag);
    return el.querySelectorAll('.w');
  }

  var SCRAMBLE_POOL = '#</>*+=··—ABCDEFKMNPRSTX0123456789';
  function scramble(el, duration) {
    var original = el.dataset.scrambleText || el.textContent;
    el.dataset.scrambleText = original;
    var len = original.length;
    var obj = { p: 0 };
    gsap.to(obj, {
      p: 1, duration: duration || 0.9, ease: 'power2.out',
      onUpdate: function () {
        var solved = Math.floor(obj.p * len);
        var out = '';
        for (var i = 0; i < len; i++) {
          var ch = original[i];
          if (i < solved || ch === ' ' || ch === '/') out += ch;
          else out += SCRAMBLE_POOL[(Math.random() * SCRAMBLE_POOL.length) | 0];
        }
        el.textContent = out;
      },
      onComplete: function () { el.textContent = original; }
    });
  }

  /* ================= preloader + hero intro ================= */
  var heroIntro = gsap.timeline({ paused: true });
  (function buildIntro() {
    var lines = document.querySelectorAll('#hero .display .line-inner');
    var eyebrow = document.querySelector('#hero .eyebrow');
    var lead = document.querySelector('#hero .lead');
    var ctas = document.querySelectorAll('#hero .cta-row > *');
    var foot = document.querySelector('#hero .hero-foot');
    var header = document.getElementById('header');
    var fieldWrap = document.querySelector('#hero .field-wrap');
    var railEl = document.getElementById('rail');

    if (reduced) return;

    gsap.set(lines, { yPercent: 115 });
    gsap.set([eyebrow, lead, foot], { autoAlpha: 0, y: 16 });
    gsap.set(ctas, { autoAlpha: 0, y: 22 });
    gsap.set(header, { yPercent: -130 });
    gsap.set(fieldWrap, { autoAlpha: 0 });
    if (railEl) gsap.set(railEl, { autoAlpha: 0 });

    heroIntro
      .to(fieldWrap, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0)
      .to(lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0.05)
      .to(eyebrow, {
        autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out',
        onStart: function () { var n = eyebrow.querySelector('[data-scramble]'); if (n) scramble(n, 1.1); }
      }, 0.15)
      .to(lead, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.55)
      .to(ctas, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.7)
      .to(foot, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.9)
      .to(header, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.85)
      .add(function () {
        document.querySelectorAll('#hero .hl').forEach(function (el) { el.classList.add('on'); });
      }, 1.0);
    if (railEl) heroIntro.to(railEl, { autoAlpha: 1, duration: 0.6 }, 1.2);
  })();

  (function preloader() {
    var pre = document.getElementById('preloader');
    if (!pre) { heroIntro.play(); return; }
    if (reduced) { pre.style.display = 'none'; return; }

    var count = pre.querySelector('.pre-count');
    var bar = pre.querySelector('.pre-bar i');
    var mark = pre.querySelector('.pre-mark');
    var finished = false;

    function exit(fast) {
      if (finished) return;
      finished = true;
      var tl = gsap.timeline({
        onComplete: function () { pre.style.display = 'none'; }
      });
      tl.to(pre, { yPercent: -100, duration: fast ? 0.55 : 0.85, ease: 'expo.inOut' });
      heroIntro.delay(fast ? 0.15 : 0.45).play();
    }

    // Failsafe: if rAF is throttled (background/hidden tab), the GSAP ticker
    // stalls and the preloader would block the page forever. Timers still fire,
    // so cut straight to the finished state.
    setTimeout(function () {
      if (pre.style.display === 'none') return;
      finished = true;
      if (lenis) lenis.start();
      pre.style.display = 'none';
      heroIntro.delay(0);
      heroIntro.progress(1);
      document.querySelectorAll('#hero .hl').forEach(function (el) { el.classList.add('on'); });
      document.querySelectorAll('[data-scramble],[data-scramble-st]').forEach(function (el) {
        if (el.dataset.scrambleText) el.textContent = el.dataset.scrambleText;
      });
    }, 4500);

    if (lenis) lenis.stop();
    var obj = { v: 0 };
    gsap.timeline({ onComplete: function () { if (lenis) lenis.start(); exit(false); } })
      .from(mark, { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' }, 0)
      .to(obj, {
        v: 100, duration: 1.5, ease: 'power2.inOut',
        onUpdate: function () {
          var v = Math.round(obj.v);
          count.textContent = (v < 10 ? '00' : v < 100 ? '0' : '') + v;
          bar.style.width = v + '%';
        }
      }, 0.1);
  })();

  /* ================= custom cursor ================= */
  (function cursor() {
    if (!finePointer || reduced) { docEl.dataset.cursor = 'off'; return; }
    docEl.dataset.cursor = 'on';
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    ring.style.display = 'flex';
    var dx = gsap.quickTo(dot, 'x', { duration: 0.015, ease: 'power2.out' });
    var dy = gsap.quickTo(dot, 'y', { duration: 0.015, ease: 'power2.out' });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.14, ease: 'power3.out' });
    var ry = gsap.quickTo(ring, 'y', { duration: 0.14, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var view = e.target.closest('[data-cursor="view"]');
      var hov = e.target.closest('a, button, input, textarea, [data-cursor="grow"]');
      document.body.classList.toggle('cur-view', !!view);
      document.body.classList.toggle('cur-hover', !view && !!hov);
    });
    document.addEventListener('pointerout', function (e) {
      if (!e.relatedTarget) { document.body.classList.remove('cur-view', 'cur-hover'); }
    });
  })();

  /* ================= overlay menu ================= */
  (function menu() {
    var btn = document.getElementById('menu-btn');
    var overlay = document.getElementById('menu-overlay');
    if (!btn || !overlay) return;
    function setOpen(open) {
      docEl.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      if (hasGSAP && !reduced) {
        var headerEl = document.getElementById('header');
        if (open && headerEl) gsap.to(headerEl, { yPercent: 0, duration: 0.4, ease: 'power3.out' });
      }
    }
    state.closeMenu = function () { setOpen(false); };
    btn.addEventListener('click', function () {
      setOpen(!docEl.classList.contains('menu-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && docEl.classList.contains('menu-open')) setOpen(false);
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  })();

  /* ================= header hide / show ================= */
  (function header() {
    var el = document.getElementById('header');
    if (!el) return;
    var onScrollClass = function () { el.classList.toggle('scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScrollClass, { passive: true });
    onScrollClass();
    if (reduced) return;
    var hidden = false;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var goingDown = self.direction === 1 && self.scroll() > 300;
        if (docEl.classList.contains('menu-open')) return;
        if (goingDown && !hidden) { hidden = true; gsap.to(el, { yPercent: -130, duration: 0.5, ease: 'power3.out' }); }
        else if (!goingDown && hidden) { hidden = false; gsap.to(el, { yPercent: 0, duration: 0.5, ease: 'power3.out' }); }
      }
    });
  })();

  /* ================= left rail ================= */
  (function rail() {
    var railEl = document.getElementById('rail');
    if (!railEl) return;
    var num = railEl.querySelector('.rail-num');
    var label = railEl.querySelector('.rail-label');
    var fill = railEl.querySelector('.rail-track i');
    var secs = document.querySelectorAll('[data-rail]');
    secs.forEach(function (sec, i) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (self) {
          if (!self.isActive) return;
          num.textContent = (i + 1 < 10 ? '0' : '') + (i + 1) + ' / ' + (secs.length < 10 ? '0' : '') + secs.length;
          label.textContent = sec.dataset.rail;
        }
      });
    });
    if (!reduced) {
      gsap.to(fill, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
      });
    } else { fill.style.transform = 'scaleY(1)'; }
  })();

  /* ================= generic reveals ================= */
  if (!reduced) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el, { y: 34, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
      var kids = group.children;
      gsap.fromTo(kids, { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });
    document.querySelectorAll('[data-scramble-st]').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () { scramble(el, 0.9); }
      });
    });
    document.querySelectorAll('#process .step .rule').forEach(function (el) {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    // headline wipes
    document.querySelectorAll('[data-wipe]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', y: 26 }, {
        clipPath: 'inset(0 0 -12% 0)', y: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
      });
    });
    // dark sections wipe in like panels
    document.querySelectorAll('section.sec-dark, #contact').forEach(function (sec) {
      gsap.fromTo(sec, { clipPath: 'inset(4% 3% 8% 3% round 26px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out',
        scrollTrigger: { trigger: sec, start: 'top 92%', end: 'top 30%', scrub: 0.4 }
      });
    });
  }

  /* ================= word-fill statement ================= */
  (function wordFill() {
    var el = document.querySelector('[data-fill-words]');
    if (!el) return;
    var words = splitWords(el);
    var fillColor = el.closest('.sec-dark') ? '#F5F6EF' : '#0B0E0A';
    if (reduced) { words.forEach(function (w) { w.style.color = fillColor; }); return; }
    gsap.to(words, {
      color: fillColor, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.4 }
    });
  })();

  /* ================= problem frame + image band parallax ================= */
  if (!reduced) {
    var heroMap = document.querySelector('#hero .hero-grid');
    if (heroMap) {
      // map slowly zooms in + drifts up as you scroll through the hero
      gsap.fromTo(heroMap, { scale: 1, yPercent: 0 }, {
        scale: 1.16, yPercent: -6, ease: 'none', transformOrigin: 'center 42%',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
      });
    }
    var probFrame = document.querySelector('#problem .prob-illo');
    if (probFrame) {
      gsap.fromTo(probFrame, { y: 48 }, {
        y: -38, ease: 'none',
        scrollTrigger: { trigger: probFrame, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      });
    }
    var monroe = document.getElementById('monroe');
    if (monroe) {
      var img = monroe.querySelector('img');
      // no reveal — full image shown from the top; a very slow zoom anchored
      // to the top edge so the steeple/sky never get cropped (only the bottom)
      gsap.fromTo(img, { scale: 1 }, {
        scale: 1.035, ease: 'none', transformOrigin: 'center top',
        scrollTrigger: { trigger: monroe, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }
    var apFrame = document.querySelector('#about .ap-frame');
    if (apFrame) {
      gsap.fromTo(apFrame, { y: 50, rotate: -4.5 }, { y: -24, rotate: -1.4, ease: 'none',
        scrollTrigger: { trigger: '#about .about-photo', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    }
    var sticker = document.querySelector('#about .ap-sticker');
    if (sticker) {
      gsap.fromTo(sticker, { scale: 0, rotate: -14 }, { scale: 1, rotate: 5, duration: 0.7, ease: 'back.out(2.2)',
        scrollTrigger: { trigger: sticker, start: 'top 92%', once: true } });
    }
    var ghost = document.querySelector('.foot-wordmark');
    if (ghost) {
      gsap.fromTo(ghost, { y: 110 }, { y: 0, ease: 'none',
        scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'top 30%', scrub: 0.5 } });
    }
  }

  /* ================= counters ================= */
  if (!reduced) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var to = parseInt(el.dataset.count, 10);
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: to, duration: 1.6, ease: 'power3.out',
            onUpdate: function () { el.textContent = Math.round(obj.v); }
          });
        }
      });
    });
  }

  /* ================= horizontal work section ================= */
  (function workHorizontal() {
    if (reduced) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      var stage = document.querySelector('#work .work-stage');
      var track = document.querySelector('#work .work-track');
      if (!stage || !track) return;
      var getDist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, {
        x: function () { return -getDist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: function () { return '+=' + (getDist() + window.innerHeight * 0.2); },
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      return function () { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
    });
  })();

  /* ================= contact glow follows cursor ================= */
  (function ctaGlow() {
    var sec = document.getElementById('contact');
    if (!sec || !finePointer) return;
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      sec.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
  })();

  /* ================= tweaks bridge ================= */
  window.addEventListener('bb:tweaks', function (e) {
    var t = e.detail || {};
    state.calm = t.motion === 'Calm';
    if (!reduced) docEl.dataset.motion = state.calm ? 'calm' : 'full';
    docEl.dataset.grain = t.grain === false ? 'off' : 'on';
    docEl.dataset.field = t.field === false ? 'off' : 'on';
    if (window.BB_FIELD) {
      window.BB_FIELD.setEnabled(t.field !== false);
      window.BB_FIELD.setMotion(state.calm ? 'calm' : 'full');
    }
  });

  /* ================= stall guard (static mode) ================= */
  // If rAF is throttled (embedded/background contexts), GSAP's ticker never
  // advances and every entrance state stays hidden. Detect the stall and snap
  // the whole page to its finished, static state instead.
  function forceStatic() {
    docEl.dataset.motion = 'off';
    gsap.globalTimeline.getChildren(true, true, true).forEach(function (t) {
      try { t.progress(1); } catch (e) {}
    });
    try { ScrollTrigger.getAll().forEach(function (st) { st.kill(); }); } catch (e) {}
    // hard-clear every inline hidden/entrance state back to CSS defaults
    gsap.set(['[data-reveal]', '[data-reveal-stagger] > *', '#hero .line-inner', '#hero .eyebrow',
      '#hero .lead', '#hero .cta-row > *', '#hero .hero-foot', '#hero .field-wrap', '#hero .hero-grid',
      '#process .step .rule', '#header', '#monroe img', '#monroe .img-clip', '[data-wipe]',
      'section.sec-dark', '#contact', '#problem .prob-illo',
      '#about .ap-frame', '#about .ap-sticker', '.foot-wordmark', '#problem .bframe', '#work .work-track'
    ].join(','), { clearProps: 'all' });
    var fillEl = document.querySelector('[data-fill-words]');
    var words = document.querySelectorAll('[data-fill-words] .w');
    if (words.length) gsap.set(words, { color: (fillEl && fillEl.closest('.sec-dark')) ? '#F5F6EF' : '#0B0E0A' });
    document.querySelectorAll('[data-scramble],[data-scramble-st]').forEach(function (el) {
      if (el.dataset.scrambleText) el.textContent = el.dataset.scrambleText;
    });
    document.querySelectorAll('.hl').forEach(function (el) { el.classList.add('on'); });
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
    var railEl = document.getElementById('rail');
    if (railEl) { railEl.style.opacity = '1'; var f = railEl.querySelector('.rail-track i'); if (f) f.style.transform = 'scaleY(1)'; }
  }
  window.BBV2_forceStatic = forceStatic;
  (function watchdog() {
    // Continuously monitor ticker health. A healthy tab advances 60fps;
    // throttled/embedded contexts advance sporadically or not at all.
    var staticDone = false, healthy = 0, last = gsap.ticker.frame;
    var iv = setInterval(function () {
      if (staticDone) { clearInterval(iv); return; }
      var f = gsap.ticker.frame, d = f - last; last = f;
      if (document.hidden) return; // never judge a hidden tab
      if (d >= 40) { healthy++; if (healthy >= 3) clearInterval(iv); return; }
      healthy = 0;
      if (d < 30) { staticDone = true; clearInterval(iv); forceStatic(); }
    }, 2000);
  })();

  window.addEventListener('load', function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();

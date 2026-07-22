/* Beyond Belief V2 — hero wash (Three.js)
   A soft, airbrushed watercolor field in brand tones (paper, cream,
   lime wash, sage) that drifts slowly and warms toward the cursor.
   Rendered at reduced resolution for a naturally soft, grainless blur. */
(function () {
  'use strict';
  if (!window.THREE) return;
  var canvas = document.getElementById('field-canvas');
  if (!canvas) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer, scene, camera, uniforms;
  var running = false, enabled = true, inView = true;
  var mouseTarget = new THREE.Vector2(0.5, 0.6);
  var mouseCurrent = new THREE.Vector2(0.5, 0.6);
  var clock = new THREE.Clock();

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(1);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.6) },
      uAmp: { value: 1.0 }
    };

    var mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      depthWrite: false,
      vertexShader: [
        'varying vec2 vUv;',
        'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
      ].join('\n'),
      fragmentShader: [
        'precision highp float;',
        'uniform float uTime;',
        'uniform float uAspect;',
        'uniform vec2 uMouse;',
        'uniform float uAmp;',
        'varying vec2 vUv;',
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
        'float noise(vec2 p){',
        '  vec2 i = floor(p); vec2 f = fract(p);',
        '  vec2 u = f * f * (3.0 - 2.0 * f);',
        '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
        '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
        '}',
        'float fbm(vec2 p){',
        '  float v = 0.0; float a = 0.5;',
        '  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + vec2(7.3, 3.1); a *= 0.55; }',
        '  return v;',
        '}',
        'void main(){',
        '  vec2 p = vec2(vUv.x * uAspect, vUv.y) * 1.55;',
        '  float t = uTime * 0.045 * uAmp;',
        '  float n1 = fbm(p * 1.05 + vec2(t * 0.7, -t * 0.45));',
        '  float n2 = fbm(p * 1.9 - vec2(t * 0.35, t * 0.55) + n1 * 1.6);',
        '  float n3 = fbm(p * 0.75 + vec2(-t * 0.25, t * 0.35) + n2 * 0.8);',
        '  vec3 paper = vec3(0.961, 0.965, 0.937);',
        '  vec3 cream = vec3(0.952, 0.906, 0.733);',
        '  vec3 limew = vec3(0.882, 0.953, 0.604);',
        '  vec3 sage  = vec3(0.682, 0.722, 0.612);',
        '  vec3 warm  = vec3(0.949, 0.815, 0.541);',
        '  vec3 col = paper;',
        '  col = mix(col, cream, smoothstep(0.32, 0.78, n1) * 0.9);',
        '  col = mix(col, limew, smoothstep(0.42, 0.88, n2) * 0.85);',
        '  col = mix(col, sage,  smoothstep(0.58, 0.95, n3) * 0.55);',
        '  col = mix(col, warm,  smoothstep(0.62, 0.98, fbm(p * 1.3 + vec2(t * 0.2, -t * 0.3) + n3)) * 0.4);',
        '  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);',
        '  float md = distance(vec2(vUv.x * uAspect, vUv.y), m);',
        '  float charge = exp(-md * md * 7.0);',
        '  col = mix(col, vec3(0.84, 1.0, 0.30), charge * 0.30 * uAmp);',
        '  col = mix(col, vec3(0.99, 0.97, 0.88), charge * 0.18);',
        '  float vig = smoothstep(0.0, 0.45, vUv.y) * 0.18;', // settle toward paper at very bottom
        '  col = mix(col, paper, (1.0 - smoothstep(0.0, 0.35, vUv.y)) * 0.55);',
        '  col += (hash(vUv * 913.7 + fract(uTime)) - 0.5) * 0.018 + vig * 0.0;',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('pointermove', function (e) {
      mouseTarget.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
    }, { passive: true });

    var hero = document.getElementById('hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        syncRunning();
      }, { threshold: 0.02 }).observe(hero);
    }
    document.addEventListener('visibilitychange', syncRunning);

    if (prefersReduced) uniforms.uAmp.value = 0.0;

    syncRunning();
    uniforms.uTime.value = 40.0; // start mid-drift so the first frame is rich
    renderer.render(scene, camera); // always paint one frame
  }

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    // render soft + cheap at 45% resolution; CSS scales it up
    renderer.setSize(Math.max(2, w * 0.45), Math.max(2, h * 0.45), false);
    uniforms.uAspect.value = w / h;
    renderer.render(scene, camera);
  }

  function frame() {
    if (!running) return;
    uniforms.uTime.value = 40.0 + clock.getElapsedTime();
    mouseCurrent.lerp(mouseTarget, 0.045);
    uniforms.uMouse.value.copy(mouseCurrent);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function syncRunning() {
    var should = enabled && inView && !document.hidden && !prefersReduced;
    if (should && !running) { running = true; requestAnimationFrame(frame); }
    if (!should) running = false;
  }

  window.BB_FIELD = {
    setEnabled: function (on) { enabled = !!on; syncRunning(); if (on) resize(); },
    setMotion: function (level) { if (uniforms && !prefersReduced) uniforms.uAmp.value = (level === 'calm') ? 0.4 : 1.0; }
  };

  try { init(); } catch (e) { /* WebGL unavailable — paper ground stays clean */ }
})();

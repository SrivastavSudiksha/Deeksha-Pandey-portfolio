(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  let stored = null;
  try { stored = localStorage.getItem('dp-theme'); } catch (e) {}
  // Light is the default look for the site; only switch to dark if the
  // visitor has explicitly toggled it before (saved in localStorage).
  root.dataset.theme = stored || 'light';
  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('dp-theme', next); } catch (e) {}
    });
  }
})();
const sidenav = document.getElementById('sidenav');
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');

if (navToggle && sidenav) {
  navToggle.addEventListener('click', () => {
    sidenav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

function closeMobile() {
  if (!sidenav) return;
  sidenav.classList.remove('open');
  document.body.style.overflow = '';
}
if (navClose) navClose.addEventListener('click', closeMobile);

document.querySelectorAll('a[href*="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const hashIdx = href.indexOf('#');
    if (hashIdx === -1) return;
    const hash = href.slice(hashIdx);
    const pagePart = href.slice(0, hashIdx);
    const here = location.pathname.split('/').pop() || 'index.html';
    const samePage = pagePart === '' || pagePart === here;
    if (hash === '#') { closeMobile(); return; }
    const target = samePage ? document.querySelector(hash) : null;
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMobile();
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) link.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.max(target / 70, 1);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 18);
}

const statNums = document.querySelectorAll('.hstat-n');
let counted = false;
const hero = document.querySelector('.hero');
if (hero && statNums.length) {
  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statNums.forEach(el => animateCounter(el, parseInt(el.dataset.target || 0)));
    }
  }, { threshold: 0.3 });
  heroObs.observe(hero);
}

const revealEls = document.querySelectorAll(
  '.pub-item, .tcard, .cinfo-item, .slink, .edu-item, .rcard, .affil-card, ' +
  '.award-row, .pos-item, .mem-item, .skill-chip, .student-card, .conf-item, ' +
  '.feature-award, .join-banner, .research-visual'
);
if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = `opacity .55s ease ${i * 45}ms, transform .55s cubic-bezier(.22,1,.36,1) ${i * 45}ms`;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    revealObs.observe(el);
  });
}
(function () {
  const canvases = document.querySelectorAll('.network-canvas');
  if (!canvases.length) return;

  const LINK_DIST = 130;

  function rgb() {
    return document.documentElement.dataset.theme === 'light' ? '10,157,134' : '0,229,199';
  }

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, pts = [], raf = null, visible = false;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.max(w * dpr, 1);
      canvas.height = Math.max(h * dpr, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(95, Math.floor((w * h) / 15000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.8
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const c = rgb();

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;
      }
      // edges
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = 'rgba(' + c + ',' + ((1 - d / LINK_DIST) * 0.17).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const glow = i % 7 === 0;
        ctx.fillStyle = 'rgba(' + c + ',' + (glow ? 0.85 : 0.45) + ')';
        ctx.shadowColor = 'rgba(' + c + ',0.8)';
        ctx.shadowBlur = glow ? 10 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow ? p.r + 0.6 : p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(step);
    }

    function start() { if (!raf && visible) raf = requestAnimationFrame(step); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    resize();
    window.addEventListener('resize', resize);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.02 }).observe(canvas);
  });
})();
// Web Services directory — live filter
(function () {
  const input = document.getElementById('wsFilter');
  const table = document.getElementById('wsTable');
  const empty = document.getElementById('wsEmpty');
  if (!input || !table) return;
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visibleCount = 0;
    rows.forEach(row => {
      const match = row.textContent.toLowerCase().includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    if (empty) empty.hidden = visibleCount !== 0;
  });
})();
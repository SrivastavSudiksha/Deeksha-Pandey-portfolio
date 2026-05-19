const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
if (mobileClose) mobileClose.addEventListener('click', closeMobile);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobile();
    }
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => observer.observe(s));

function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const statNums = document.querySelectorAll('.hstat-n');
let counted = false;
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    statNums.forEach(el => {
      const target = parseInt(el.dataset.target || 0);
      animateCounter(el, target);
    });
  }
}, { threshold: 0.3 });
const hero = document.querySelector('.hero');
if (hero) heroObs.observe(hero);

const revealEls = document.querySelectorAll('.pub-item, .tcard, .cinfo-item, .slink, .edu-item');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transition = `opacity 0.5s ease ${i * 40}ms, transform 0.5s ease ${i * 40}ms`;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  revealObs.observe(el);
});
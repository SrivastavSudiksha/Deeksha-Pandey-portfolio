
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--accent); }`;
document.head.appendChild(style);

const researchCards = document.querySelectorAll('.research-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
      }, parseInt(delay));
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

researchCards.forEach(card => cardObserver.observe(card));

const revealEls = document.querySelectorAll('.pub-item, .tool-card, .connect-card, .contact-item, .award-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transition = `opacity 0.5s ease ${i * 50}ms, transform 0.5s ease ${i * 50}ms`;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(15px)';
  revealObserver.observe(el);
});

function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach(el => {
      const text = el.textContent;
      const num = parseInt(text.replace(/\D/g, ''));
      const suffix = text.replace(/[0-9]/g, '');
      el.textContent = '0' + suffix;
      animateCounter(el, num, suffix);
    });
  }
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) statsObserver.observe(heroSection);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(78,205,196,0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.3s ease, top 0.3s ease;
`;
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

console.log(
  '%cDr. Deeksha Pandey — Computational Biology & Bioinformatics\n%cICGEB New Delhi · AMR Research · ML Tools',
  'color: #4ecdc4; font-size: 16px; font-weight: bold;',
  'color: #8aafaa; font-size: 12px;'
);

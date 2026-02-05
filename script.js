// Scroll-based reveal for sections/cards
const revealTargets = document.querySelectorAll('.section, .case-card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((el) => {
  el.classList.add('hidden');
  observer.observe(el);
});

// Microinteractions for nav links
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('mouseenter', () => {
    link.style.transform = 'translateY(-1px) scale(1.03)';
  });
  link.addEventListener('mouseleave', () => {
    link.style.transform = 'translateY(0) scale(1)';
  });
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.navbar nav');

function setNavOpen(isOpen) {
  document.body.classList.toggle('nav-open', isOpen);
  if (navToggle) navToggle.setAttribute('aria-expanded', String(isOpen));
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('nav-open');
    setNavOpen(!isOpen);
  });

  // Close after selecting a link (mobile)
  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => setNavOpen(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    const target = e.target;
    if (target instanceof Node && (nav.contains(target) || navToggle.contains(target))) return;
    setNavOpen(false);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
  });
}

// Gentle parallax for hero cards on mouse move
const hero = document.querySelector('.home');
const cards = document.querySelectorAll('.hero-card');

if (hero && cards.length) {
  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * 12;

    cards.forEach((card, index) => {
      const intensity = (index + 1) * 0.4;
      card.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cards.forEach((card) => {
      card.style.transform = 'translate(0, 0)';
    });
  });
}

// Prevent actual form submission (prototype feel)
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! This prototype doesn’t send messages yet.');
  });
}
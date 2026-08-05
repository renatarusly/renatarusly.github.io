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
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
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
  const sideCard = hero.querySelector('.hero-card-side');
  const baseRotate = sideCard ? ' rotate(-4deg)' : '';

  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * 12;

    cards.forEach((card, index) => {
      const intensity = (index + 1) * 0.4;
      const tx = `translate(${x * intensity}px, ${y * intensity}px)`;
      card.style.transform = card === sideCard ? tx + baseRotate : tx;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cards.forEach((card) => {
      card.style.transform = card === sideCard ? 'translate(0, 0) rotate(-4deg)' : 'translate(0, 0)';
    });
  });
}

// Slideshow widgets (center slide + peeking neighbors)
document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
  const viewport = slideshow.querySelector('.slideshow-viewport');
  const track = slideshow.querySelector('.slideshow-track');
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  if (slides.length < 2) return;

  const captionEl = slideshow.querySelector('.slideshow-caption');
  const dotsWrap = slideshow.querySelector('.slideshow-dots');
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slideshow-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      goTo(i);
      resetAutoplay();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  let current = 0;
  let timer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    const activeSlide = slides[current];
    const offset = viewport.clientWidth / 2 - activeSlide.offsetLeft - activeSlide.offsetWidth / 2;
    track.style.transform = `translateX(${offset}px)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    if (captionEl) captionEl.innerHTML = activeSlide.dataset.caption || '';
  }

  function startAutoplay() {
    timer = setInterval(() => goTo(current + 1), 7000);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  slideshow.querySelector('.slideshow-prev').addEventListener('click', () => {
    goTo(current - 1);
    resetAutoplay();
  });

  slideshow.querySelector('.slideshow-next').addEventListener('click', () => {
    goTo(current + 1);
    resetAutoplay();
  });

  slideshow.addEventListener('mouseenter', stopAutoplay);
  slideshow.addEventListener('mouseleave', startAutoplay);
  window.addEventListener('resize', () => goTo(current));

  goTo(0);
  startAutoplay();
});

// Show success message after FormSubmit redirect
const formStatus = document.getElementById('form-status');
if (formStatus && new URLSearchParams(window.location.search).get('sent') === '1') {
  formStatus.hidden = false;
  formStatus.className = 'form-status success';
  formStatus.textContent = 'Thanks for reaching out! I’ll get back to you soon.';
  history.replaceState(null, '', window.location.pathname + '#connect');
}
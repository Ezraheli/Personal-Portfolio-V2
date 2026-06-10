/* ============================================================
   STEPHANIE LOSABIA — Personal Portfolio V2
   js/app.js  |  All Interactivity
   ============================================================ */

'use strict';

/* ── 1. THEME TOGGLE ─────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const iconSun     = document.querySelector('.icon-sun');
const iconMoon    = document.querySelector('.icon-moon');

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  if (iconSun)  iconSun.style.display  = dark ? 'none'  : 'block';
  if (iconMoon) iconMoon.style.display = dark ? 'block' : 'none';
}

function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved === 'dark' || (!saved && prefersDark));
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
  });
}

initTheme();

/* ── 2. MOBILE HAMBURGER MENU ────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── 3. ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, #mobile-menu a');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ── 4. NAVBAR SCROLL SHADOW ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 2px 20px rgba(0,0,0,0.12)'
      : 'none';
  }
}, { passive: true });

/* ── 5. ACCORDION ────────────────────────────────────────────── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const body = trigger.nextElementSibling;

    // Close all
    document.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      const b = t.nextElementSibling;
      if (b) b.classList.remove('open');
    });

    // Open clicked (if it was closed)
    if (!expanded) {
      trigger.setAttribute('aria-expanded', 'true');
      if (body) body.classList.add('open');
    }
  });
});

// Sync initial state: if HTML has aria-expanded="true", make sure body is open
// (handles hardcoded open state in markup)
document.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(trigger => {
  const body = trigger.nextElementSibling;
  if (body) body.classList.add('open');
});

/* ── 6. PROJECTS — SHOW MORE / LESS ─────────────────────────── */
const showMoreBtn = document.getElementById('show-more-btn');
const hiddenProjectsContainer = document.getElementById('hiddenProjects');
const projectsGrid = document.querySelector('#projects .projects-grid');

if (showMoreBtn && hiddenProjectsContainer && projectsGrid) {
  // Store the hidden project cards
  const hiddenCards = Array.from(hiddenProjectsContainer.querySelectorAll('.project-card.hidden'));
  
  // Initially, remove the wrapper and hide the cards
  hiddenCards.forEach(card => {
    card.style.display = 'none';
  });
  
  // Remove the wrapper div (we don't need it anymore)
  // Move hidden cards outside the wrapper but keep them hidden
  hiddenCards.forEach(card => {
    projectsGrid.appendChild(card);
  });
  hiddenProjectsContainer.remove();
  
  // Now toggle the visible cards
  showMoreBtn.addEventListener('click', () => {
    const isHidden = hiddenCards[0].style.display === 'none';
    
    hiddenCards.forEach(card => {
      card.style.display = isHidden ? 'flex' : 'none';
    });
    
    showMoreBtn.textContent = isHidden ? 'Show Less ↑' : 'Show More ↓';
  });
}

/* ── 7. GALLERY LIGHTBOX ─────────────────────────────────────── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');
const galleryItems = Array.from(document.querySelectorAll('.masonry-item'));

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  if (!item || !lbImg) return;
  lbImg.src = item.querySelector('img').src;
  lbImg.alt = item.querySelector('img').alt;
  if (lbCounter) lbCounter.textContent = `${index + 1} / ${galleryItems.length}`;
  if (lightbox) {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  }
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
  });
});

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', showPrev);
if (lbNext)  lbNext.addEventListener('click', showNext);

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Click backdrop to close
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ── 8. CONTACT FORM ─────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const origText = btn ? btn.textContent : '';

    // Simple client-side feedback
    if (btn) {
      btn.textContent = '✓ Message sent!';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      btn.disabled = true;
    }

    // Reset after 3 seconds
    setTimeout(() => {
      contactForm.reset();
      if (btn) {
        btn.textContent = origText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }
    }, 3000);
  });
}

/* ── 9. SCROLL FADE-IN ANIMATIONS ───────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ── 10. BACK TO TOP ─────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 11. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--nav-height')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 12. CONTACT BUTTON (hero) ───────────────────────────────── */
const heroContactBtn = document.getElementById('hero-contact-btn');
if (heroContactBtn) {
  heroContactBtn.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const navH = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--nav-height')) || 70;
      window.scrollTo({
        top: contactSection.offsetTop - navH,
        behavior: 'smooth'
      });
    }
  });
}


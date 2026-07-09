/* ============================================================
   STEPHANIE LOSABIA — Personal Portfolio V2
   js/app.js  |  Full Interactivity + Developer's Option Panel
   Storage: localStorage (no backend needed)
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STORAGE KEYS
   ══════════════════════════════════════════════════════════════ */
const STORAGE = {
  PROJECTS          : 'portfolio_projects_v2',
  SOFTWARE_PROJECTS : 'portfolio_software_projects_v2',
  GALLERY           : 'portfolio_gallery_v2',
  THEME             : 'portfolio-theme',
};

/* ══════════════════════════════════════════════════════════════
   1. THEME TOGGLE
   ══════════════════════════════════════════════════════════════ */
const themeToggle = document.getElementById('theme-toggle');
const iconSun     = document.querySelector('.icon-sun');
const iconMoon    = document.querySelector('.icon-moon');

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem(STORAGE.THEME, dark ? 'dark' : 'light');
  if (iconSun)  iconSun.style.display  = dark ? 'none'  : 'block';
  if (iconMoon) iconMoon.style.display = dark ? 'block' : 'none';
}

(function initTheme() {
  const saved = localStorage.getItem(STORAGE.THEME);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved === 'dark' || (!saved && prefersDark));
})();

themeToggle?.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
});

/* ══════════════════════════════════════════════════════════════
   2. MOBILE HAMBURGER MENU
   ══════════════════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeHamburger() {
  mobileMenu?.classList.remove('open');
  hamburger?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeHamburger));

document.addEventListener('click', e => {
  if (mobileMenu?.classList.contains('open') &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)) closeHamburger();
});

/* ══════════════════════════════════════════════════════════════
   3. ACTIVE NAV LINK ON SCROLL
   ══════════════════════════════════════════════════════════════ */
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a, #mobile-menu a');

function updateActiveLink() {
  let current = '';
  allSections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) current = s.id;
  });
  allNavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ══════════════════════════════════════════════════════════════
   4. NAVBAR SCROLL SHADOW
   ══════════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.12)' : 'none';
}, { passive: true });

/* ══════════════════════════════════════════════════════════════
   5. ACCORDION
   ══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  // Respect initial open state from HTML
  if (trigger.getAttribute('aria-expanded') === 'true') {
    trigger.nextElementSibling?.classList.add('open');
  }
  trigger.addEventListener('click', () => {
    const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.nextElementSibling?.classList.remove('open');
    });
    if (!wasOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      trigger.nextElementSibling?.classList.add('open');
    }
  });
});

/* ══════════════════════════════════════════════════════════════
   6. PROJECTS — SHOW MORE / LESS
   ══════════════════════════════════════════════════════════════ */
const showMoreBtn             = document.getElementById('show-more-btn');
const hiddenProjectsContainer = document.getElementById('hiddenProjects');
const projectsGrid            = document.querySelector('#projects .projects-grid');

let hiddenCards = [];

if (showMoreBtn && hiddenProjectsContainer && projectsGrid) {
  hiddenCards = Array.from(hiddenProjectsContainer.querySelectorAll('.project-card'));
  hiddenCards.forEach(c => { c.style.display = 'none'; projectsGrid.appendChild(c); });
  hiddenProjectsContainer.remove();

  showMoreBtn.addEventListener('click', () => {
    const showing = hiddenCards[0]?.style.display !== 'none';
    hiddenCards.forEach(c => { c.style.display = showing ? 'none' : 'flex'; });
    showMoreBtn.textContent = showing ? 'Show More ↓' : 'Show Less ↑';
  });
}

/* ── Software Projects — same Show More / Less behavior ────────── */
const showMoreBtnSw             = document.getElementById('show-more-btn-sw');
const hiddenProjectsContainerSw = document.getElementById('hiddenSoftwareProjects');
const projectsGridSw            = document.querySelector('#software-projects .projects-grid');

let hiddenCardsSw = [];

/* Only reveal the Show More button once there's actually something hidden to show */
function updateSoftwareShowMoreVisibility() {
  const wrap = document.getElementById('show-more-wrap-sw');
  const grid = document.querySelector('#software-projects .projects-grid');
  if (!wrap || !grid) return;
  const hasHidden = grid.querySelectorAll('.project-card.hidden').length > 0;
  wrap.style.display = hasHidden ? '' : 'none';
}

if (showMoreBtnSw && hiddenProjectsContainerSw && projectsGridSw) {
  hiddenCardsSw = Array.from(hiddenProjectsContainerSw.querySelectorAll('.project-card'));
  hiddenCardsSw.forEach(c => { c.style.display = 'none'; projectsGridSw.appendChild(c); });
  hiddenProjectsContainerSw.remove();

  showMoreBtnSw.addEventListener('click', () => {
    const showing = hiddenCardsSw[0]?.style.display !== 'none';
    hiddenCardsSw.forEach(c => { c.style.display = showing ? 'none' : 'flex'; });
    showMoreBtnSw.textContent = showing ? 'Show More ↓' : 'Show Less ↑';
  });
}
updateSoftwareShowMoreVisibility();

/* ══════════════════════════════════════════════════════════════
   7. GALLERY LIGHTBOX
   ══════════════════════════════════════════════════════════════ */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');

let galleryItems = [];
let currentLbIndex = 0;

function rebuildGalleryItems() {
  galleryItems = Array.from(
    document.querySelectorAll('#masonry-grid .masonry-item:not([style*="display: none"])')
  );
  galleryItems.forEach((item, i) => {
    item.onclick     = () => openLightbox(i);
    item.onkeydown   = e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); };
    item.tabIndex    = 0;
  });
}

function openLightbox(i) {
  currentLbIndex = i;
  const img = galleryItems[i]?.querySelector('img');
  if (!img || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  if (lbCounter) lbCounter.textContent = `${i + 1} / ${galleryItems.length}`;
  lightbox?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
  if (lbImg) lbImg.src = '';
}

document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
document.getElementById('lb-prev')?.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentLbIndex);
});
document.getElementById('lb-next')?.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex + 1) % galleryItems.length;
  openLightbox(currentLbIndex);
});
document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { currentLbIndex = (currentLbIndex - 1 + galleryItems.length) % galleryItems.length; openLightbox(currentLbIndex); }
  if (e.key === 'ArrowRight') { currentLbIndex = (currentLbIndex + 1) % galleryItems.length; openLightbox(currentLbIndex); }
});
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

rebuildGalleryItems();

/* ══════════════════════════════════════════════════════════════
   8. GALLERY YEAR FILTER (public-facing)
   ══════════════════════════════════════════════════════════════ */
const galleryFilterBar = document.getElementById('gallery-filter-bar');
const masonryGrid      = document.getElementById('masonry-grid');

function getActiveYears() {
  const years = new Set();
  document.querySelectorAll('#masonry-grid .masonry-item img[data-year]')
    .forEach(img => years.add(img.getAttribute('data-year')));
  return ['All', ...Array.from(years).sort((a, b) => b - a)];
}

function buildYearFilterBar(activeYear = 'All') {
  if (!galleryFilterBar) return;
  const years = getActiveYears();

  // Only show the bar if there's more than one year
  if (years.length <= 2) { // 'All' + 1 year = no point filtering
    galleryFilterBar.style.display = 'none';
    return;
  }
  galleryFilterBar.style.display = '';
  galleryFilterBar.innerHTML = '<span class="gallery-filter-label">Filter:</span>';
  years.forEach(year => {
    const btn = document.createElement('button');
    btn.className = `gallery-year-btn${year === activeYear ? ' active' : ''}`;
    btn.textContent = year;
    btn.dataset.year = year;
    btn.addEventListener('click', () => filterGalleryByYear(year));
    galleryFilterBar.appendChild(btn);
  });
}

function filterGalleryByYear(year) {
  document.querySelectorAll('.gallery-year-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.year === year));
  document.querySelectorAll('#masonry-grid .masonry-item').forEach(item => {
    const imgYear = item.querySelector('img')?.getAttribute('data-year') || '';
    item.style.display = (year === 'All' || imgYear === year) ? '' : 'none';
  });
  rebuildGalleryItems();
}

buildYearFilterBar();

/* ══════════════════════════════════════════════════════════════
   9. CONTACT FORM
   ══════════════════════════════════════════════════════════════ */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const orig = btn?.innerHTML;
  if (btn) { btn.textContent = '✓ Message sent!'; btn.style.cssText = 'background:#22c55e;color:#fff'; btn.disabled = true; }
  setTimeout(() => {
    e.target.reset();
    if (btn) { btn.innerHTML = orig; btn.style.cssText = ''; btn.disabled = false; }
  }, 3000);
});

/* ══════════════════════════════════════════════════════════════
   10. SCROLL FADE-IN
   ══════════════════════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
    setTimeout(() => entry.target.classList.add('visible'), siblings.indexOf(entry.target) * 80);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ══════════════════════════════════════════════════════════════
   11. BACK TO TOP
   ══════════════════════════════════════════════════════════════ */
const backToTop = document.getElementById('back-to-top');
backToTop && window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════════════════════════
   12. SMOOTH SCROLL
   ══════════════════════════════════════════════════════════════ */
function navHeight() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - navHeight(), behavior: 'smooth' }); }
  });
});

/* ══════════════════════════════════════════════════════════════
   ██████████████████████████████████████████████████████████████
   13. DEVELOPER'S OPTION PANEL  —  Fully persistent via
       localStorage. No backend, no Firebase required.
   ██████████████████████████████████████████████████████████████
   ══════════════════════════════════════════════════════════════ */

/* ── Toast ───────────────────────────────────────────────────── */
const devToast = document.getElementById('dev-toast');
let toastTimer;
function showToast(msg, type = 'success') {
  if (!devToast) return;
  clearTimeout(toastTimer);
  devToast.textContent = msg;
  devToast.className = `show ${type}`;
  toastTimer = setTimeout(() => { devToast.className = ''; }, 3200);
}

/* ══════════════════════════════════════════════════════════════
   PASSWORD AUTH
   ══════════════════════════════════════════════════════════════ */

// ✏️ CHANGE YOUR PASSWORD HERE ↓
const DEV_PASSWORD = 'steph2025';
// ↑ ✏️ CHANGE YOUR PASSWORD HERE

const SESSION_KEY = 'dev_auth_session';   // clears when browser tab closes

/* Returns true if already authenticated this session */
function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'granted';
}

/* ── Password prompt modal ───────────────────────────────────── */
const authModal       = document.getElementById('dev-auth-modal');
const authInput       = document.getElementById('dev-auth-input');
const authSubmitBtn   = document.getElementById('dev-auth-submit');
const authCancelBtn   = document.getElementById('dev-auth-cancel');
const authError       = document.getElementById('dev-auth-error');
const authToggleEye   = document.getElementById('dev-auth-eye');

function openAuthModal() {
  if (!authModal) return;
  authModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (authInput) { authInput.value = ''; authInput.focus(); }
  if (authError) authError.textContent = '';
}

function closeAuthModal() {
  authModal?.classList.remove('open');
  document.body.style.overflow = '';
  devToggleBtn?.classList.remove('active');
}

/* Show / hide password eye toggle */
authToggleEye?.addEventListener('click', () => {
  if (!authInput) return;
  const isHidden = authInput.type === 'password';
  authInput.type = isHidden ? 'text' : 'password';
  authToggleEye.innerHTML = isHidden
    ? /* eye-off SVG */ `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : /* eye SVG     */ `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  authInput.focus();
});

/* Validate password */
function submitPassword() {
  if (!authInput || !authError) return;
  const entered = authInput.value;

  if (entered === DEV_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'granted');
    closeAuthModal();
    openDevPanel();
  } else {
    authError.textContent = 'Incorrect password. Try again.';
    authInput.value = '';
    authInput.focus();
    /* Shake animation */
    authInput.classList.add('shake');
    setTimeout(() => authInput.classList.remove('shake'), 500);
  }
}

authSubmitBtn?.addEventListener('click', submitPassword);
authCancelBtn?.addEventListener('click', closeAuthModal);
authInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitPassword();
  if (e.key === 'Escape') closeAuthModal();
});
/* Click outside modal box to cancel */
authModal?.addEventListener('click', e => {
  if (e.target === authModal) closeAuthModal();
});

/* ── Panel open / close ──────────────────────────────────────── */
const devToggleBtn  = document.getElementById('dev-toggle-btn');
const devPanel      = document.getElementById('dev-panel');
const devBackdrop   = document.getElementById('dev-panel-backdrop');
const devPanelClose = document.getElementById('dev-panel-close');

function openDevPanel() {
  devPanel?.classList.add('open');
  devBackdrop?.classList.add('open');
  devToggleBtn?.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderProjectList();
  renderSoftwareProjectList();
  renderGalleryList();
  buildDevYearFilter();
}
function closeDevPanel() {
  devPanel?.classList.remove('open');
  devBackdrop?.classList.remove('open');
  devToggleBtn?.classList.remove('active');
  document.body.style.overflow = '';
}

/* Gate the toggle button behind auth */
devToggleBtn?.addEventListener('click', () => {
  if (devPanel?.classList.contains('open')) {
    closeDevPanel();
  } else if (isAuthenticated()) {
    openDevPanel();           // already unlocked this session — go straight in
  } else {
    devToggleBtn.classList.add('active');
    openAuthModal();          // ask for password first
  }
});

devPanelClose?.addEventListener('click', closeDevPanel);
devBackdrop?.addEventListener('click', closeDevPanel);

/* ── Tab switching ───────────────────────────────────────────── */
document.querySelectorAll('.dev-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dev-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.dev-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`dev-pane-${tab.dataset.tab}`)?.classList.add('active');
    if (tab.dataset.tab === 'gallery') { renderGalleryList(); buildDevYearFilter(); }
    if (tab.dataset.tab === 'projects') renderProjectList();
    if (tab.dataset.tab === 'software') renderSoftwareProjectList();
  });
});

/* ══════════════════════════════════════════════════════════════
   STORAGE HELPERS
   ══════════════════════════════════════════════════════════════ */

function loadSavedProjects() {
  try { return JSON.parse(localStorage.getItem(STORAGE.PROJECTS)) || null; }
  catch { return null; }
}

function saveProjectsToStorage() {
  const cards = Array.from(document.querySelectorAll('#projects .project-card'));
  const data = cards.map(card => ({
    img      : card.querySelector('.project-img')?.src || '',
    category : card.querySelector('.project-category')?.textContent || '',
    title    : card.querySelector('.project-title')?.textContent || '',
    desc     : card.querySelector('.project-desc')?.textContent || '',
    btnLabel : card.querySelector('.project-overlay a')?.textContent?.trim() || 'Show Details',
    link     : card.querySelector('.project-overlay a')?.getAttribute('href') || '#',
    hidden   : card.classList.contains('hidden') || card.style.display === 'none',
  }));
  localStorage.setItem(STORAGE.PROJECTS, JSON.stringify(data));
}

function loadSavedSoftwareProjects() {
  try { return JSON.parse(localStorage.getItem(STORAGE.SOFTWARE_PROJECTS)) || null; }
  catch { return null; }
}

function saveSoftwareProjectsToStorage() {
  const cards = Array.from(document.querySelectorAll('#software-projects .project-card'));
  const data = cards.map(card => ({
    img      : card.querySelector('.project-img')?.src || '',
    category : card.querySelector('.project-category')?.textContent || '',
    title    : card.querySelector('.project-title')?.textContent || '',
    desc     : card.querySelector('.project-desc')?.textContent || '',
    btnLabel : card.querySelector('.project-overlay a')?.textContent?.trim() || 'Show Details',
    link     : card.querySelector('.project-overlay a')?.getAttribute('href') || '#',
    hidden   : card.classList.contains('hidden') || card.style.display === 'none',
  }));
  localStorage.setItem(STORAGE.SOFTWARE_PROJECTS, JSON.stringify(data));
}

function loadSavedGallery() {
  try { return JSON.parse(localStorage.getItem(STORAGE.GALLERY)) || null; }
  catch { return null; }
}

function saveGalleryToStorage() {
  const items = Array.from(document.querySelectorAll('#masonry-grid .masonry-item'));
  const data = items.map(item => {
    const img = item.querySelector('img');
    return {
      src  : img?.src  || '',
      alt  : img?.alt  || '',
      year : img?.getAttribute('data-year') || new Date().getFullYear().toString(),
    };
  });
  localStorage.setItem(STORAGE.GALLERY, JSON.stringify(data));
}

/* ══════════════════════════════════════════════════════════════
   HYDRATE FROM localStorage ON PAGE LOAD
   ══════════════════════════════════════════════════════════════ */
function hydrateFromStorage() {
  // ── Projects ────────────────────────────────────────────────
  const savedProjects = loadSavedProjects();
  if (savedProjects && savedProjects.length > 0) {
    const grid = document.querySelector('#projects .projects-grid');
    if (grid) {
      grid.querySelectorAll('.project-card').forEach(c => c.remove());
      document.getElementById('hiddenProjects')?.remove();

      savedProjects.forEach(p => {
        const card = buildProjectCardEl(p);
        if (p.hidden) { card.classList.add('hidden'); card.style.display = 'none'; }
        grid.appendChild(card);
      });

      const newHiddenCards = Array.from(grid.querySelectorAll('.project-card.hidden'));
      if (showMoreBtn && newHiddenCards.length) {
        const newBtn = showMoreBtn.cloneNode(true);
        showMoreBtn.parentNode?.replaceChild(newBtn, showMoreBtn);
        newBtn.addEventListener('click', () => {
          const showing = newHiddenCards[0]?.style.display !== 'none';
          newHiddenCards.forEach(c => { c.style.display = showing ? 'none' : 'flex'; });
          newBtn.textContent = showing ? 'Show More ↓' : 'Show Less ↑';
        });
      }
    }
  }

  // ── Software Projects ───────────────────────────────────────
  const savedSoftwareProjects = loadSavedSoftwareProjects();
  if (savedSoftwareProjects && savedSoftwareProjects.length > 0) {
    const gridSw = document.querySelector('#software-projects .projects-grid');
    if (gridSw) {
      gridSw.querySelectorAll('.project-card').forEach(c => c.remove());
      document.getElementById('hiddenSoftwareProjects')?.remove();

      savedSoftwareProjects.forEach(p => {
        const card = buildProjectCardEl(p);
        if (p.hidden) { card.classList.add('hidden'); card.style.display = 'none'; }
        gridSw.appendChild(card);
      });

      const newHiddenCardsSw = Array.from(gridSw.querySelectorAll('.project-card.hidden'));
      if (showMoreBtnSw && newHiddenCardsSw.length) {
        const newBtnSw = showMoreBtnSw.cloneNode(true);
        showMoreBtnSw.parentNode?.replaceChild(newBtnSw, showMoreBtnSw);
        newBtnSw.addEventListener('click', () => {
          const showing = newHiddenCardsSw[0]?.style.display !== 'none';
          newHiddenCardsSw.forEach(c => { c.style.display = showing ? 'none' : 'flex'; });
          newBtnSw.textContent = showing ? 'Show More ↓' : 'Show Less ↑';
        });
      }
      updateSoftwareShowMoreVisibility();
    }
  }

  // ── Gallery ──────────────────────────────────────────────────
  const savedGallery = loadSavedGallery();
  if (savedGallery && savedGallery.length > 0) {
    const grid = document.getElementById('masonry-grid');
    if (grid) {
      grid.querySelectorAll('.masonry-item').forEach(i => i.remove());
      savedGallery.forEach(p => grid.appendChild(buildGalleryItemEl(p)));
      buildYearFilterBar();
      rebuildGalleryItems();
    }
  }
}

hydrateFromStorage();

/* ══════════════════════════════════════════════════════════════
   DOM BUILDERS
   ══════════════════════════════════════════════════════════════ */

function buildProjectCardEl({ img, category, title, desc, btnLabel = 'Show Details', link = '#' }) {
  const a = document.createElement('article');
  a.className = 'project-card fade-in';
  a.innerHTML = `
    <div class="project-img-wrap">
      <img class="project-img" src="${img}" alt="${title}" loading="lazy" />
      <div class="project-overlay">
        <a href="${link}" target="_blank" rel="noopener">${btnLabel}</a>
      </div>
    </div>
    <div class="project-body">
      <span class="project-category">${category}</span>
      <h3 class="project-title">${title}</h3>
      <p class="project-desc">${desc}</p>
    </div>`;
  return a;
}

function buildGalleryItemEl({ src, alt, year }) {
  const div = document.createElement('div');
  div.className = 'masonry-item';
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Open: ${alt}`);
  div.innerHTML = `<img src="${src}" data-year="${year}" alt="${alt}" loading="lazy" />`;
  return div;
}

/* ══════════════════════════════════════════════════════════════
   IMAGE FILE → BASE64 PROMISE
   ══════════════════════════════════════════════════════════════ */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ══════════════════════════════════════════════════════════════
   IMAGE PREVIEW WIRING (path input + file browse)
   ══════════════════════════════════════════════════════════════ */
function wireImgPreview(fileInputId, textInputId, previewId, pathPrefix = '') {
  const fileInput = document.getElementById(fileInputId);
  const textInput = document.getElementById(textInputId);
  const preview   = document.getElementById(previewId);
  if (!fileInput || !textInput || !preview) return;

  function showPreview(src) {
    preview.innerHTML = `<img src="${src}" alt="preview"
      onerror="this.parentElement.innerHTML='<span style=\\'color:#e53e3e;font-size:0.75rem\\'>Image not found — check the path</span>'">
      <input type='file' id='${fileInputId}' accept='image/*' style='position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;'>`;
    wireImgPreview(fileInputId, textInputId, previewId, pathPrefix);
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      textInput.value = b64;
      showPreview(b64);
    } catch { showToast('Could not read file.', 'error'); }
  });

  textInput.addEventListener('input', () => {
    const val = textInput.value.trim();
    if (val) showPreview(val);
    else preview.innerHTML = `<span>Click to browse or paste a path above</span>
      <input type='file' id='${fileInputId}' accept='image/*' style='position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;'>`;
  });
}

wireImgPreview('np-img-file', 'np-img', 'np-img-preview');
wireImgPreview('nsp-img-file', 'nsp-img', 'nsp-img-preview');
wireImgPreview('ng-img-file', 'ng-img', 'ng-img-preview');

/* ══════════════════════════════════════════════════════════════
   PROJECT MANAGER
   ══════════════════════════════════════════════════════════════ */

document.getElementById('np-add-btn')?.addEventListener('click', () => {
  const img      = document.getElementById('np-img').value.trim();
  const category = document.getElementById('np-category').value;
  const title    = document.getElementById('np-title').value.trim();
  const desc     = document.getElementById('np-desc').value.trim();
  const btnLabel = document.getElementById('np-btn-label').value.trim() || 'Show Details';
  const link     = document.getElementById('np-link').value.trim() || '#';
  const hidden   = document.getElementById('np-visibility').value === 'hidden';

  if (!title) { showToast('Please enter a project title.', 'error'); return; }
  if (!img)   { showToast('Please provide an image.', 'error'); return; }

  const grid = document.querySelector('#projects .projects-grid');
  if (!grid) return;

  const card = buildProjectCardEl({ img, category, title, desc, btnLabel, link });
  if (hidden) { card.classList.add('hidden'); card.style.display = 'none'; }
  grid.appendChild(card);

  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));

  saveProjectsToStorage();

  ['np-img', 'np-title', 'np-desc', 'np-link'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('np-btn-label').value = 'Show Details';
  document.getElementById('np-img-preview').innerHTML =
    `<span>Click to browse or paste a path above</span>
     <input type="file" id="np-img-file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">`;
  wireImgPreview('np-img-file', 'np-img', 'np-img-preview');

  renderProjectList();
  showToast(`"${title}" added and saved!`);
});

/* ── Software Projects: add new ─────────────────────────────── */
document.getElementById('nsp-add-btn')?.addEventListener('click', () => {
  const img      = document.getElementById('nsp-img').value.trim();
  const category = document.getElementById('nsp-category').value;
  const title    = document.getElementById('nsp-title').value.trim();
  const desc     = document.getElementById('nsp-desc').value.trim();
  const btnLabel = document.getElementById('nsp-btn-label').value.trim() || 'Show Details';
  const link     = document.getElementById('nsp-link').value.trim() || '#';
  const hidden   = document.getElementById('nsp-visibility').value === 'hidden';

  if (!title) { showToast('Please enter a project title.', 'error'); return; }
  if (!img)   { showToast('Please provide an image.', 'error'); return; }

  const grid = document.querySelector('#software-projects .projects-grid');
  if (!grid) return;

  const card = buildProjectCardEl({ img, category, title, desc, btnLabel, link });
  if (hidden) { card.classList.add('hidden'); card.style.display = 'none'; }
  grid.appendChild(card);

  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));

  saveSoftwareProjectsToStorage();
  updateSoftwareShowMoreVisibility();

  ['nsp-img', 'nsp-title', 'nsp-desc', 'nsp-link'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('nsp-btn-label').value = 'Show Details';
  document.getElementById('nsp-img-preview').innerHTML =
    `<span>Click to browse or paste a path above</span>
     <input type="file" id="nsp-img-file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">`;
  wireImgPreview('nsp-img-file', 'nsp-img', 'nsp-img-preview');

  renderSoftwareProjectList();
  showToast(`"${title}" added and saved!`);
});

/* ── Render project list in panel ────────────────────────────── */
function renderProjectList() {
  const list = document.getElementById('dev-project-list');
  if (!list) return;
  const cards = Array.from(document.querySelectorAll('#projects .project-card'));

  if (!cards.length) {
    list.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted)">No projects yet.</p>';
    return;
  }

  list.innerHTML = '';
  cards.forEach((card, i) => {
    const imgEl    = card.querySelector('.project-img');
    const titleEl  = card.querySelector('.project-title');
    const catEl    = card.querySelector('.project-category');
    const descEl   = card.querySelector('.project-desc');
    const linkEl   = card.querySelector('.project-overlay a');

    const imgSrc   = imgEl?.src  || '';
    const title    = titleEl?.textContent  || `Project ${i+1}`;
    const category = catEl?.textContent    || '';
    const desc     = descEl?.textContent   || '';
    const btnLabel = linkEl?.textContent?.trim() || 'Show Details';
    const link     = linkEl?.getAttribute('href') || '#';

    const row = document.createElement('div');
    row.innerHTML = `
      <div class="dev-item">
        <img class="dev-item-thumb" src="${imgSrc}" alt="${title}"
             onerror="this.style.opacity=0.2;this.style.background='var(--bg-secondary)'">
        <div class="dev-item-info">
          <div class="dev-item-name">${title}</div>
          <div class="dev-item-meta">${category}</div>
        </div>
        <div class="dev-item-actions">
          <button class="dev-btn dev-btn-edit dev-btn-sm" data-action="edit" title="Edit">✏️</button>
          <button class="dev-btn dev-btn-danger dev-btn-sm" data-action="delete" title="Delete">🗑</button>
        </div>
      </div>
      <div class="dev-edit-form" id="dev-ef-${i}">
        <div class="dev-field">
          <label>Image Path or URL</label>
          <input class="ep-img" type="text" value="${imgSrc}" placeholder="./assets/projects/..." />
        </div>
        <div class="dev-edit-row">
          <div class="dev-field">
            <label>Title</label>
            <input class="ep-title" type="text" value="${title}" />
          </div>
          <div class="dev-field">
            <label>Category</label>
            <input class="ep-cat" type="text" value="${category}" />
          </div>
        </div>
        <div class="dev-field">
          <label>Description</label>
          <textarea class="ep-desc">${desc}</textarea>
        </div>
        <div class="dev-edit-row">
          <div class="dev-field">
            <label>Button Label</label>
            <input class="ep-btn" type="text" value="${btnLabel}" />
          </div>
          <div class="dev-field">
            <label>Link URL</label>
            <input class="ep-link" type="text" value="${link}" />
          </div>
        </div>
        <button class="dev-btn dev-btn-primary ep-save" style="margin-top:0.5rem">💾 Save Changes</button>
      </div>`;

    row.querySelector('[data-action="edit"]').addEventListener('click', btn => {
      const form = document.getElementById(`dev-ef-${i}`);
      const open = form?.classList.toggle('open');
      btn.currentTarget.textContent = open ? '✕' : '✏️';
    });

    row.querySelector('[data-action="delete"]').addEventListener('click', () => {
      const name = card.querySelector('.project-title')?.textContent || 'Project';
      card.remove();
      saveProjectsToStorage();
      renderProjectList();
      showToast(`"${name}" deleted.`);
    });

    row.querySelector('.ep-save').addEventListener('click', () => {
      const f = document.getElementById(`dev-ef-${i}`);
      if (!f) return;
      const newImg  = f.querySelector('.ep-img').value.trim();
      const newTitle = f.querySelector('.ep-title').value.trim();
      const newCat   = f.querySelector('.ep-cat').value.trim();
      const newDesc  = f.querySelector('.ep-desc').value.trim();
      const newBtn   = f.querySelector('.ep-btn').value.trim();
      const newLink  = f.querySelector('.ep-link').value.trim();

      if (imgEl)   imgEl.src = newImg;
      if (titleEl) titleEl.textContent  = newTitle;
      if (catEl)   catEl.textContent    = newCat;
      if (descEl)  descEl.textContent   = newDesc;
      if (linkEl)  { linkEl.textContent = newBtn; linkEl.href = newLink; }

      saveProjectsToStorage();
      f.classList.remove('open');
      renderProjectList();
      showToast(`"${newTitle}" updated and saved!`);
    });

    list.appendChild(row);
  });
}

/* ── Render software project list in panel ───────────────────── */
function renderSoftwareProjectList() {
  const list = document.getElementById('dev-software-project-list');
  if (!list) return;
  const cards = Array.from(document.querySelectorAll('#software-projects .project-card'));

  if (!cards.length) {
    list.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted)">No software projects yet.</p>';
    return;
  }

  list.innerHTML = '';
  cards.forEach((card, i) => {
    const imgEl    = card.querySelector('.project-img');
    const titleEl  = card.querySelector('.project-title');
    const catEl    = card.querySelector('.project-category');
    const descEl   = card.querySelector('.project-desc');
    const linkEl   = card.querySelector('.project-overlay a');

    const imgSrc   = imgEl?.src  || '';
    const title    = titleEl?.textContent  || `Project ${i+1}`;
    const category = catEl?.textContent    || '';
    const desc     = descEl?.textContent   || '';
    const btnLabel = linkEl?.textContent?.trim() || 'Show Details';
    const link     = linkEl?.getAttribute('href') || '#';

    const row = document.createElement('div');
    row.innerHTML = `
      <div class="dev-item">
        <img class="dev-item-thumb" src="${imgSrc}" alt="${title}"
             onerror="this.style.opacity=0.2;this.style.background='var(--bg-secondary)'">
        <div class="dev-item-info">
          <div class="dev-item-name">${title}</div>
          <div class="dev-item-meta">${category}</div>
        </div>
        <div class="dev-item-actions">
          <button class="dev-btn dev-btn-edit dev-btn-sm" data-action="edit" title="Edit">✏️</button>
          <button class="dev-btn dev-btn-danger dev-btn-sm" data-action="delete" title="Delete">🗑</button>
        </div>
      </div>
      <div class="dev-edit-form" id="dev-esf-${i}">
        <div class="dev-field">
          <label>Image Path or URL</label>
          <input class="ep-img" type="text" value="${imgSrc}" placeholder="./assets/projects/..." />
        </div>
        <div class="dev-edit-row">
          <div class="dev-field">
            <label>Title</label>
            <input class="ep-title" type="text" value="${title}" />
          </div>
          <div class="dev-field">
            <label>Category</label>
            <input class="ep-cat" type="text" value="${category}" />
          </div>
        </div>
        <div class="dev-field">
          <label>Description</label>
          <textarea class="ep-desc">${desc}</textarea>
        </div>
        <div class="dev-edit-row">
          <div class="dev-field">
            <label>Button Label</label>
            <input class="ep-btn" type="text" value="${btnLabel}" />
          </div>
          <div class="dev-field">
            <label>Link URL</label>
            <input class="ep-link" type="text" value="${link}" />
          </div>
        </div>
        <button class="dev-btn dev-btn-primary ep-save" style="margin-top:0.5rem">💾 Save Changes</button>
      </div>`;

    row.querySelector('[data-action="edit"]').addEventListener('click', btn => {
      const form = document.getElementById(`dev-esf-${i}`);
      const open = form?.classList.toggle('open');
      btn.currentTarget.textContent = open ? '✕' : '✏️';
    });

    row.querySelector('[data-action="delete"]').addEventListener('click', () => {
      const name = card.querySelector('.project-title')?.textContent || 'Project';
      card.remove();
      saveSoftwareProjectsToStorage();
      updateSoftwareShowMoreVisibility();
      renderSoftwareProjectList();
      showToast(`"${name}" deleted.`);
    });

    row.querySelector('.ep-save').addEventListener('click', () => {
      const f = document.getElementById(`dev-esf-${i}`);
      if (!f) return;
      const newImg  = f.querySelector('.ep-img').value.trim();
      const newTitle = f.querySelector('.ep-title').value.trim();
      const newCat   = f.querySelector('.ep-cat').value.trim();
      const newDesc  = f.querySelector('.ep-desc').value.trim();
      const newBtn   = f.querySelector('.ep-btn').value.trim();
      const newLink  = f.querySelector('.ep-link').value.trim();

      if (imgEl)   imgEl.src = newImg;
      if (titleEl) titleEl.textContent  = newTitle;
      if (catEl)   catEl.textContent    = newCat;
      if (descEl)  descEl.textContent   = newDesc;
      if (linkEl)  { linkEl.textContent = newBtn; linkEl.href = newLink; }

      saveSoftwareProjectsToStorage();
      f.classList.remove('open');
      renderSoftwareProjectList();
      showToast(`"${newTitle}" updated and saved!`);
    });

    list.appendChild(row);
  });
}

/* ══════════════════════════════════════════════════════════════
   GALLERY MANAGER
   ══════════════════════════════════════════════════════════════ */

document.getElementById('ng-add-btn')?.addEventListener('click', () => {
  const src  = document.getElementById('ng-img').value.trim();
  const alt  = document.getElementById('ng-alt').value.trim() || 'Gallery photo';
  const year = document.getElementById('ng-year').value.trim() || String(new Date().getFullYear());

  if (!src) { showToast('Please provide an image.', 'error'); return; }

  const grid = document.getElementById('masonry-grid');
  if (!grid) return;

  grid.appendChild(buildGalleryItemEl({ src, alt, year }));

  saveGalleryToStorage();

  document.getElementById('ng-img').value = '';
  document.getElementById('ng-alt').value = '';
  document.getElementById('ng-img-preview').innerHTML =
    `<span>Click to browse or paste a path above</span>
     <input type="file" id="ng-img-file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">`;
  wireImgPreview('ng-img-file', 'ng-img', 'ng-img-preview');

  buildYearFilterBar();
  buildDevYearFilter();
  renderGalleryList();
  rebuildGalleryItems();
  showToast(`Photo added to gallery (${year}) and saved!`);
});

/* ── Render gallery list in panel ────────────────────────────── */
function renderGalleryList() {
  const list = document.getElementById('dev-gallery-list');
  if (!list) return;
  const items = Array.from(document.querySelectorAll('#masonry-grid .masonry-item'));

  if (!items.length) {
    list.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted)">No photos yet.</p>';
    return;
  }

  list.innerHTML = '';
  items.forEach((item, i) => {
    const img  = item.querySelector('img');
    const src  = img?.src  || '';
    const alt  = img?.alt  || `Photo ${i+1}`;
    const year = img?.getAttribute('data-year') || '—';

    const row = document.createElement('div');
    row.className = 'dev-item';
    row.innerHTML = `
      <img class="dev-item-thumb" src="${src}" alt="${alt}"
           onerror="this.style.opacity=0.2;this.style.background='var(--bg-secondary)'">
      <div class="dev-item-info">
        <div class="dev-item-name">${alt}</div>
        <div class="dev-item-meta">Year: ${year}</div>
      </div>
      <div class="dev-item-actions">
        <button class="dev-btn dev-btn-danger dev-btn-sm" title="Remove">🗑</button>
      </div>`;

    row.querySelector('.dev-btn-danger').addEventListener('click', () => {
      item.remove();
      saveGalleryToStorage();
      buildYearFilterBar();
      buildDevYearFilter();
      renderGalleryList();
      rebuildGalleryItems();
      showToast('Photo removed and saved.');
    });
    list.appendChild(row);
  });
}

/* ── Dev panel year tag preview ──────────────────────────────── */
function buildDevYearFilter() {
  const bar = document.getElementById('dev-year-filter');
  if (!bar) return;
  const years = getActiveYears().filter(y => y !== 'All');
  if (!years.length) {
    bar.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted)">Add photos to see year tags here.</span>';
    return;
  }
  bar.innerHTML = '';
  years.forEach(y => {
    const tag = document.createElement('span');
    tag.className = 'dev-year-tag';
    tag.textContent = y;
    bar.appendChild(tag);
  });
}

/* ══════════════════════════════════════════════════════════════
   EXPORT / IMPORT
   ══════════════════════════════════════════════════════════════ */
document.getElementById('dev-export-btn')?.addEventListener('click', () => {
  const data = {
    exported          : new Date().toISOString(),
    projects          : loadSavedProjects()         || [],
    softwareProjects  : loadSavedSoftwareProjects()  || [],
    gallery           : loadSavedGallery()           || [],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'portfolio-data.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported as portfolio-data.json!');
});

document.getElementById('dev-import-input')?.addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.projects)         localStorage.setItem(STORAGE.PROJECTS,          JSON.stringify(data.projects));
    if (data.softwareProjects) localStorage.setItem(STORAGE.SOFTWARE_PROJECTS, JSON.stringify(data.softwareProjects));
    if (data.gallery)          localStorage.setItem(STORAGE.GALLERY,           JSON.stringify(data.gallery));
    showToast('Data imported! Reloading…');
    setTimeout(() => location.reload(), 1200);
  } catch { showToast('Invalid JSON file.', 'error'); }
});

document.getElementById('dev-clear-btn')?.addEventListener('click', () => {
  if (!confirm('Clear ALL saved projects and gallery data? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE.PROJECTS);
  localStorage.removeItem(STORAGE.SOFTWARE_PROJECTS);
  localStorage.removeItem(STORAGE.GALLERY);
  showToast('All data cleared. Reloading…');
  setTimeout(() => location.reload(), 1200);
});
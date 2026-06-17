/* ============================================================
   STEPHANIE LOSABIA — Personal Portfolio V2
   js/app.js  |  All Interactivity + Developer's Option Panel
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

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

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
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, #mobile-menu a');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100)
      current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ── 4. NAVBAR SCROLL SHADOW ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(0,0,0,0.12)' : 'none';
}, { passive: true });

/* ── 5. ACCORDION ────────────────────────────────────────────── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      const b = t.nextElementSibling;
      if (b) b.classList.remove('open');
    });
    if (!expanded) {
      trigger.setAttribute('aria-expanded', 'true');
      const body = trigger.nextElementSibling;
      if (body) body.classList.add('open');
    }
  });
});

// Respect initial open state from HTML markup
document.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(trigger => {
  const body = trigger.nextElementSibling;
  if (body) body.classList.add('open');
});

/* ── 6. PROJECTS — SHOW MORE / LESS ─────────────────────────── */
const showMoreBtn            = document.getElementById('show-more-btn');
const hiddenProjectsContainer = document.getElementById('hiddenProjects');
const projectsGrid            = document.querySelector('#projects .projects-grid');

if (showMoreBtn && hiddenProjectsContainer && projectsGrid) {
  const hiddenCards = Array.from(hiddenProjectsContainer.querySelectorAll('.project-card.hidden'));
  hiddenCards.forEach(card => { card.style.display = 'none'; });
  hiddenCards.forEach(card => { projectsGrid.appendChild(card); });
  hiddenProjectsContainer.remove();

  showMoreBtn.addEventListener('click', () => {
    const isHidden = hiddenCards[0]?.style.display === 'none';
    hiddenCards.forEach(card => { card.style.display = isHidden ? 'flex' : 'none'; });
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

let galleryItems = []; // rebuilt whenever gallery changes
let currentIndex = 0;

function rebuildGalleryItems() {
  galleryItems = Array.from(document.querySelectorAll('.masonry-item:not([style*="display: none"])'));
  galleryItems.forEach((item, i) => {
    item.onclick = () => openLightbox(i);
    item.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); };
    if (!item.getAttribute('tabindex')) item.setAttribute('tabindex', '0');
  });
}

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  if (!item || !lbImg) return;
  lbImg.src = item.querySelector('img').src;
  lbImg.alt = item.querySelector('img').alt;
  if (lbCounter) lbCounter.textContent = `${index + 1} / ${galleryItems.length}`;
  if (lightbox) { lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeLightbox() {
  if (lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  if (lbImg) lbImg.src = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', showPrev);
if (lbNext)  lbNext.addEventListener('click', showNext);

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

rebuildGalleryItems();

/* ── 8. GALLERY YEAR FILTER (public-facing) ─────────────────── */
const galleryFilterBar = document.getElementById('gallery-filter-bar');
const masonryGrid      = document.getElementById('masonry-grid');

function getYearsFromGallery() {
  const years = new Set();
  document.querySelectorAll('.masonry-item img[data-year]').forEach(img => {
    years.add(img.getAttribute('data-year'));
  });
  return ['All', ...Array.from(years).sort((a, b) => b - a)];
}

function buildYearFilterBar() {
  if (!galleryFilterBar) return;
  const years = getYearsFromGallery();
  // Keep the label span
  galleryFilterBar.innerHTML = '<span class="gallery-filter-label">Filter:</span>';
  years.forEach(year => {
    const btn = document.createElement('button');
    btn.className = 'gallery-year-btn' + (year === 'All' ? ' active' : '');
    btn.textContent = year;
    btn.dataset.year = year;
    btn.addEventListener('click', () => filterGalleryByYear(year));
    galleryFilterBar.appendChild(btn);
  });
}

function filterGalleryByYear(year) {
  // Update active button
  document.querySelectorAll('.gallery-year-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.year === year);
  });
  // Show/hide items
  document.querySelectorAll('.masonry-item').forEach(item => {
    const imgYear = item.querySelector('img')?.getAttribute('data-year') || '';
    const show = year === 'All' || imgYear === year;
    item.style.display = show ? '' : 'none';
  });
  rebuildGalleryItems();
}

buildYearFilterBar();

/* ── 9. CONTACT FORM ─────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const origHTML = btn?.innerHTML;
    if (btn) {
      btn.textContent = '✓ Message sent!';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      btn.disabled = true;
    }
    setTimeout(() => {
      contactForm.reset();
      if (btn) { btn.innerHTML = origHTML; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }
    }, 3000);
  });
}

/* ── 10. SCROLL FADE-IN ANIMATIONS ──────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
      setTimeout(() => entry.target.classList.add('visible'), siblings.indexOf(entry.target) * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

/* ── 11. BACK TO TOP ─────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 12. SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ── 13. HERO CONTACT BUTTON ─────────────────────────────────── */
const heroContactBtn = document.getElementById('hero-contact-btn');
if (heroContactBtn) {
  heroContactBtn.addEventListener('click', () => {
    const contact = document.getElementById('contact');
    if (contact) {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      window.scrollTo({ top: contact.offsetTop - navH, behavior: 'smooth' });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   14. DEVELOPER'S OPTION PANEL
   ══════════════════════════════════════════════════════════════ */

const devToggleBtn  = document.getElementById('dev-toggle-btn');
const devPanel      = document.getElementById('dev-panel');
const devBackdrop   = document.getElementById('dev-panel-backdrop');
const devPanelClose = document.getElementById('dev-panel-close');
const devToast      = document.getElementById('dev-toast');

// ── Toast helper ─────────────────────────────────────────────
function showToast(msg, type = 'success') {
  if (!devToast) return;
  devToast.textContent = msg;
  devToast.className = `show ${type}`;
  clearTimeout(devToast._timer);
  devToast._timer = setTimeout(() => { devToast.className = ''; }, 3000);
}

// ── Open / close panel ───────────────────────────────────────
function openDevPanel() {
  devPanel?.classList.add('open');
  devBackdrop?.classList.add('open');
  devToggleBtn?.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderProjectList();
  renderGalleryList();
  renderDevYearFilter();
}

function closeDevPanel() {
  devPanel?.classList.remove('open');
  devBackdrop?.classList.remove('open');
  devToggleBtn?.classList.remove('active');
  document.body.style.overflow = '';
}

devToggleBtn?.addEventListener('click', () => {
  devPanel?.classList.contains('open') ? closeDevPanel() : openDevPanel();
});
devPanelClose?.addEventListener('click', closeDevPanel);
devBackdrop?.addEventListener('click', closeDevPanel);

// ── Tab switching ─────────────────────────────────────────────
document.querySelectorAll('.dev-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dev-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.dev-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const pane = document.getElementById(`dev-pane-${tab.dataset.tab}`);
    if (pane) pane.classList.add('active');
    if (tab.dataset.tab === 'gallery') { renderGalleryList(); renderDevYearFilter(); }
    if (tab.dataset.tab === 'projects') renderProjectList();
  });
});

/* ── IMG PATH → PREVIEW helper ─────────────────────────────── */
function wireImgPreview(fileInput, textInput, previewEl) {
  // File browse → preview
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      previewEl.innerHTML = `<img src="${e.target.result}" alt="preview">`;
      textInput.value = `./assets/projects/${file.name}`;
    };
    reader.readAsDataURL(file);
  });
  // Text input → live preview
  textInput?.addEventListener('input', () => {
    const val = textInput.value.trim();
    if (val) {
      previewEl.innerHTML = `<img src="${val}" alt="preview" onerror="this.parentElement.innerHTML='<span>Image not found — check the path</span>'">`;
    } else {
      previewEl.innerHTML = `<span>Paste a path or browse above</span><input type="file" id="${fileInput.id}" accept="image/*">`;
      wireImgPreview(previewEl.querySelector('input'), textInput, previewEl);
    }
  });
}

// Wire project image preview
wireImgPreview(
  document.getElementById('np-img-file'),
  document.getElementById('np-img'),
  document.getElementById('np-img-preview')
);
// Wire gallery image preview
wireImgPreview(
  document.getElementById('ng-img-file'),
  document.getElementById('ng-img'),
  document.getElementById('ng-img-preview')
);

/* ═══════════════════════════════════════════════════════════════
   PROJECT MANAGER
   ═══════════════════════════════════════════════════════════════ */

// ── Build a project card DOM element ─────────────────────────
function buildProjectCard(data, hidden = false) {
  const article = document.createElement('article');
  article.className = `project-card${hidden ? ' hidden' : ''} fade-in`;
  article.innerHTML = `
    <div class="project-img-wrap">
      <img class="project-img" src="${data.img}" alt="${data.title}" loading="lazy" />
      <div class="project-overlay">
        <a href="${data.link}" target="_blank" rel="noopener">${data.btnLabel}</a>
      </div>
    </div>
    <div class="project-body">
      <span class="project-category">${data.category}</span>
      <h3 class="project-title">${data.title}</h3>
      <p class="project-desc">${data.desc}</p>
    </div>`;
  if (hidden) article.style.display = 'none';
  return article;
}

// ── Add project ───────────────────────────────────────────────
document.getElementById('np-add-btn')?.addEventListener('click', () => {
  const img      = document.getElementById('np-img').value.trim();
  const category = document.getElementById('np-category').value;
  const title    = document.getElementById('np-title').value.trim();
  const desc     = document.getElementById('np-desc').value.trim();
  const btnLabel = document.getElementById('np-btn-label').value.trim() || 'Show Details';
  const link     = document.getElementById('np-link').value.trim() || '#';
  const hidden   = document.getElementById('np-visibility').value === 'hidden';

  if (!title) { showToast('Please enter a project title.', 'error'); return; }
  if (!img)   { showToast('Please provide an image path.', 'error'); return; }

  const grid = document.querySelector('#projects .projects-grid');
  if (!grid) return;

  const card = buildProjectCard({ img, category, title, desc, btnLabel, link }, hidden);
  grid.appendChild(card);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('visible'));
  });

  // Reset form
  ['np-img','np-title','np-desc','np-link'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  document.getElementById('np-btn-label').value = 'Show Details';
  document.getElementById('np-img-preview').innerHTML = '<span>Click to browse or paste a path above</span><input type="file" id="np-img-file" accept="image/*">';
  wireImgPreview(document.getElementById('np-img-file'), document.getElementById('np-img'), document.getElementById('np-img-preview'));

  renderProjectList();
  showToast(`"${title}" added to projects!`);
});

// ── Render project list in panel ──────────────────────────────
function renderProjectList() {
  const list = document.getElementById('dev-project-list');
  if (!list) return;
  const cards = Array.from(document.querySelectorAll('#projects .project-card'));
  if (!cards.length) { list.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted)">No projects yet.</p>'; return; }

  list.innerHTML = '';
  cards.forEach((card, i) => {
    const img      = card.querySelector('.project-img')?.src || '';
    const title    = card.querySelector('.project-title')?.textContent || `Project ${i+1}`;
    const category = card.querySelector('.project-category')?.textContent || '';

    const row = document.createElement('div');
    row.innerHTML = `
      <div class="dev-item">
        <img class="dev-item-thumb" src="${img}" alt="${title}" onerror="this.style.opacity=0.3">
        <div class="dev-item-info">
          <div class="dev-item-name">${title}</div>
          <div class="dev-item-meta">${category}</div>
        </div>
        <div class="dev-item-actions">
          <button class="dev-btn dev-btn-edit dev-btn-sm" data-action="edit" data-idx="${i}">✏️</button>
          <button class="dev-btn dev-btn-danger dev-btn-sm" data-action="delete" data-idx="${i}">🗑</button>
        </div>
      </div>
      <div class="dev-edit-form" id="dev-edit-form-${i}">
        <div class="dev-field"><label>Image Path</label>
          <input type="text" value="${img}" class="ep-img" data-idx="${i}"/></div>
        <div class="dev-field"><label>Title</label>
          <input type="text" value="${title}" class="ep-title" data-idx="${i}"/></div>
        <div class="dev-field"><label>Category</label>
          <input type="text" value="${category}" class="ep-cat" data-idx="${i}"/></div>
        <div class="dev-field"><label>Description</label>
          <textarea class="ep-desc" data-idx="${i}">${card.querySelector('.project-desc')?.textContent || ''}</textarea></div>
        <div class="dev-edit-row">
          <div class="dev-field"><label>Button Label</label>
            <input type="text" value="${card.querySelector('.project-overlay a')?.textContent || 'Show Details'}" class="ep-btn" data-idx="${i}"/></div>
          <div class="dev-field"><label>Link URL</label>
            <input type="text" value="${card.querySelector('.project-overlay a')?.href || ''}" class="ep-link" data-idx="${i}"/></div>
        </div>
        <button class="dev-btn dev-btn-primary ep-save" data-idx="${i}" style="margin-top:0.5rem">💾 Save Changes</button>
      </div>`;
    list.appendChild(row);
  });

  // Edit toggle
  list.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const form = document.getElementById(`dev-edit-form-${btn.dataset.idx}`);
      form?.classList.toggle('open');
      btn.textContent = form?.classList.contains('open') ? '✕' : '✏️';
    });
  });

  // Delete
  list.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = document.querySelectorAll('#projects .project-card')[btn.dataset.idx];
      const name = card?.querySelector('.project-title')?.textContent || 'Project';
      card?.remove();
      renderProjectList();
      showToast(`"${name}" removed.`);
    });
  });

  // Save edits
  list.querySelectorAll('.ep-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx  = btn.dataset.idx;
      const card = document.querySelectorAll('#projects .project-card')[idx];
      if (!card) return;

      const newImg   = list.querySelector(`.ep-img[data-idx="${idx}"]`).value.trim();
      const newTitle = list.querySelector(`.ep-title[data-idx="${idx}"]`).value.trim();
      const newCat   = list.querySelector(`.ep-cat[data-idx="${idx}"]`).value.trim();
      const newDesc  = list.querySelector(`.ep-desc[data-idx="${idx}"]`).value.trim();
      const newBtn   = list.querySelector(`.ep-btn[data-idx="${idx}"]`).value.trim();
      const newLink  = list.querySelector(`.ep-link[data-idx="${idx}"]`).value.trim();

      if (card.querySelector('.project-img'))          card.querySelector('.project-img').src = newImg;
      if (card.querySelector('.project-title'))        card.querySelector('.project-title').textContent = newTitle;
      if (card.querySelector('.project-category'))     card.querySelector('.project-category').textContent = newCat;
      if (card.querySelector('.project-desc'))         card.querySelector('.project-desc').textContent = newDesc;
      if (card.querySelector('.project-overlay a')) {
        card.querySelector('.project-overlay a').textContent = newBtn;
        card.querySelector('.project-overlay a').href = newLink;
      }

      document.getElementById(`dev-edit-form-${idx}`)?.classList.remove('open');
      renderProjectList();
      showToast(`"${newTitle}" updated!`);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY MANAGER
   ═══════════════════════════════════════════════════════════════ */

// ── Add photo ─────────────────────────────────────────────────
document.getElementById('ng-add-btn')?.addEventListener('click', () => {
  const src  = document.getElementById('ng-img').value.trim();
  const alt  = document.getElementById('ng-alt').value.trim() || 'Gallery photo';
  const year = document.getElementById('ng-year').value.trim() || new Date().getFullYear().toString();

  if (!src) { showToast('Please provide an image path or URL.', 'error'); return; }

  const grid = document.getElementById('masonry-grid');
  if (!grid) return;

  const div = document.createElement('div');
  div.className = 'masonry-item';
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Open: ${alt}`);
  div.innerHTML = `<img src="${src}" data-year="${year}" alt="${alt}" loading="lazy" />`;
  grid.appendChild(div);

  // Reset form
  document.getElementById('ng-img').value  = '';
  document.getElementById('ng-alt').value  = '';
  document.getElementById('ng-img-preview').innerHTML = '<span>Click to browse or paste a path above</span><input type="file" id="ng-img-file" accept="image/*">';
  wireImgPreview(document.getElementById('ng-img-file'), document.getElementById('ng-img'), document.getElementById('ng-img-preview'));

  // Rebuild filter + lightbox
  buildYearFilterBar();
  renderDevYearFilter();
  renderGalleryList();
  rebuildGalleryItems();

  showToast(`Photo added to gallery (${year})!`);
});

// ── Render gallery list in panel ──────────────────────────────
function renderGalleryList() {
  const list = document.getElementById('dev-gallery-list');
  if (!list) return;
  const items = Array.from(document.querySelectorAll('#masonry-grid .masonry-item'));
  if (!items.length) { list.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted)">No photos yet.</p>'; return; }

  list.innerHTML = '';
  items.forEach((item, i) => {
    const img  = item.querySelector('img');
    const src  = img?.src  || '';
    const alt  = img?.alt  || `Photo ${i+1}`;
    const year = img?.getAttribute('data-year') || '—';

    const row = document.createElement('div');
    row.className = 'dev-item';
    row.innerHTML = `
      <img class="dev-item-thumb" src="${src}" alt="${alt}" onerror="this.style.opacity=0.3">
      <div class="dev-item-info">
        <div class="dev-item-name">${alt}</div>
        <div class="dev-item-meta">Year: ${year}</div>
      </div>
      <div class="dev-item-actions">
        <button class="dev-btn dev-btn-danger dev-btn-sm" title="Remove photo">🗑</button>
      </div>`;
    row.querySelector('.dev-btn-danger').addEventListener('click', () => {
      item.remove();
      buildYearFilterBar();
      renderDevYearFilter();
      renderGalleryList();
      rebuildGalleryItems();
      showToast('Photo removed from gallery.');
    });
    list.appendChild(row);
  });
}

// ── Dev panel year filter preview ────────────────────────────
function renderDevYearFilter() {
  const bar = document.getElementById('dev-year-filter');
  if (!bar) return;
  const years = getYearsFromGallery();
  bar.innerHTML = '';
  years.forEach(year => {
    const tag = document.createElement('span');
    tag.className = 'dev-year-tag';
    tag.textContent = year;
    bar.appendChild(tag);
  });
  if (!years.filter(y => y !== 'All').length) {
    bar.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted)">Add photos to see year tags.</span>';
  }
}
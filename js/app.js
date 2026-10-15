/**
 * WM LABS - Interactive Aquarium Application Controller
 * 
 * Coordinates UI states, modal dialogues, product drawers, audio toggles,
 * lighting filters, and connects the DOM to the Canvas AquariumEngine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const canvas = document.getElementById('aquarium-canvas');
  const feedBtn = document.getElementById('btn-feed');
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  const quickChipsContainer = document.getElementById('quick-chips-container');
  const tankCountEl = document.getElementById('tank-product-count');

  // Modals & Drawers
  const productDrawerOverlay = document.getElementById('product-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerPrevBtn = document.getElementById('drawer-prev-btn');
  const drawerNextBtn = document.getElementById('drawer-next-btn');

  const productsModal = document.getElementById('modal-products');
  const aboutModal = document.getElementById('modal-about');
  const contactModal = document.getElementById('modal-contact');
  const devGuideModal = document.getElementById('modal-dev-guide');

  // Nav buttons
  const navHomeBtn = document.getElementById('nav-home');
  const navProductsBtn = document.getElementById('nav-products');
  const navAboutBtn = document.getElementById('nav-about');
  const navContactBtn = document.getElementById('nav-contact');
  const devPillBtn = document.getElementById('dev-helper-pill');

  let currentProductIndex = 0;

  // Initialize Aquarium Engine
  const aquarium = new AquariumEngine(canvas, {
    onFishClick: (product) => {
      openProductDrawer(product);
    },
    onFishHover: (product) => {
      // Hover feedback handled in canvas and badge
    }
  });

  // Load registered products
  aquarium.loadProducts(PRODUCTS_DATA);
  if (tankCountEl) {
    tankCountEl.textContent = `${PRODUCTS_DATA.length} Products Swimming`;
  }

  // Populate Quick Select Chips in bottom status bar
  populateQuickChips();

  // Populate Products Directory Grid in Products Modal
  populateProductsGrid();

  // ==========================================================================
  // Product Drawer Logic
  // ==========================================================================
  function openProductDrawer(product) {
    currentProductIndex = PRODUCTS_DATA.findIndex(p => p.id === product.id);
    renderProductDrawerContent(product);
    productDrawerOverlay.classList.add('active');
  }

  function closeProductDrawer() {
    productDrawerOverlay.classList.remove('active');
  }

  function renderProductDrawerContent(product) {
    const drawer = productDrawerOverlay.querySelector('.product-drawer');
    drawer.style.setProperty('--drawer-accent', product.accentColor || '#38BDF8');

    document.getElementById('drawer-title').textContent = product.name;
    document.getElementById('drawer-tagline').textContent = product.tagline;
    document.getElementById('drawer-category').textContent = product.category;
    document.getElementById('drawer-status').textContent = product.status;
    document.getElementById('drawer-status').style.borderColor = product.accentColor || '#38BDF8';
    document.getElementById('drawer-status').style.color = product.accentColor || '#38BDF8';

    document.getElementById('drawer-description').textContent = product.description;

    // Highlights
    const highlightsList = document.getElementById('drawer-highlights');
    highlightsList.innerHTML = '';
    product.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      highlightsList.appendChild(li);
    });

    // Metrics
    const metricsGrid = document.getElementById('drawer-metrics');
    metricsGrid.innerHTML = '';
    if (product.metrics) {
      Object.entries(product.metrics).forEach(([k, v]) => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
          <div class="metric-value">${v}</div>
          <div class="metric-label">${k}</div>
        `;
        metricsGrid.appendChild(card);
      });
    }

    // CTA Launch button
    const ctaBtn = document.getElementById('drawer-cta-btn');
    ctaBtn.href = product.url || '#';
    ctaBtn.innerHTML = `Launch ${product.name} Page <span>→</span>`;
    ctaBtn.style.background = `linear-gradient(135deg, ${product.accentColor}dd, ${product.accentColor}88)`;

    // Render Fish Avatar Preview Canvas
    renderAvatarCanvas(product);
  }

  function renderAvatarCanvas(product) {
    const previewContainer = document.getElementById('drawer-avatar-preview');
    previewContainer.innerHTML = '';

    const frames = PixelSprites.getFrames(product.species);
    if (frames && frames[0]) {
      const srcCanvas = frames[0];
      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = srcCanvas.width;
      previewCanvas.height = srcCanvas.height;
      const pctx = previewCanvas.getContext('2d');
      pctx.imageSmoothingEnabled = false;
      pctx.drawImage(srcCanvas, 0, 0);
      previewContainer.appendChild(previewCanvas);
    }
  }

  // Drawer cycle buttons (Next / Prev)
  drawerPrevBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex - 1 + PRODUCTS_DATA.length) % PRODUCTS_DATA.length;
    const prod = PRODUCTS_DATA[currentProductIndex];
    renderProductDrawerContent(prod);
    aquarium.focusProduct(prod.id);
  });

  drawerNextBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex + 1) % PRODUCTS_DATA.length;
    const prod = PRODUCTS_DATA[currentProductIndex];
    renderProductDrawerContent(prod);
    aquarium.focusProduct(prod.id);
  });

  drawerCloseBtn.addEventListener('click', closeProductDrawer);
  productDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === productDrawerOverlay) {
      closeProductDrawer();
    }
  });

  // ==========================================================================
  // Quick Chips in Footer
  // ==========================================================================
  function populateQuickChips() {
    quickChipsContainer.innerHTML = '';
    PRODUCTS_DATA.forEach(prod => {
      const chip = document.createElement('button');
      chip.className = 'fish-quick-chip interactive';
      chip.innerHTML = `
        <span class="chip-pip" style="background-color: ${prod.accentColor}"></span>
        <span>${prod.name}</span>
      `;
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        aquarium.focusProduct(prod.id);
      });
      quickChipsContainer.appendChild(chip);
    });
  }

  // ==========================================================================
  // Products Directory Grid Modal
  // ==========================================================================
  function populateProductsGrid() {
    const grid = document.getElementById('products-directory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PRODUCTS_DATA.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-item-card';
      card.style.setProperty('--card-accent', prod.accentColor);
      card.innerHTML = `
        <div class="card-top">
          <span class="badge-tag badge-status" style="border-color:${prod.accentColor}; color:${prod.accentColor}">${prod.status}</span>
          <span class="badge-tag badge-category">${prod.category}</span>
        </div>
        <div class="card-title">${prod.name}</div>
        <div class="card-tagline">${prod.tagline}</div>
        <div class="card-footer-meta">
          <span>Release: ${prod.releaseEta}</span>
          <span style="color:${prod.accentColor}">Inspect Fish →</span>
        </div>
      `;

      card.addEventListener('click', () => {
        closeAllModals();
        aquarium.focusProduct(prod.id);
      });

      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // Modal Management
  // ==========================================================================
  function openModal(modalEl) {
    closeAllModals();
    closeProductDrawer();
    modalEl.classList.add('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    navHomeBtn.classList.add('active');
  }

  // Hook close buttons on all modals
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // Nav Links
  navHomeBtn.addEventListener('click', () => {
    closeAllModals();
    closeProductDrawer();
    navHomeBtn.classList.add('active');
  });

  navProductsBtn.addEventListener('click', () => {
    openModal(productsModal);
    navProductsBtn.classList.add('active');
  });

  navAboutBtn.addEventListener('click', () => {
    openModal(aboutModal);
    navAboutBtn.classList.add('active');
  });

  navContactBtn.addEventListener('click', () => {
    openModal(contactModal);
    navContactBtn.classList.add('active');
  });

  if (devPillBtn) {
    devPillBtn.addEventListener('click', () => {
      openModal(devGuideModal);
    });
  }

  // ==========================================================================
  // Header Actions (Feed, Lighting, Audio)
  // ==========================================================================
  feedBtn.addEventListener('click', () => {
    const x = window.innerWidth * (0.2 + Math.random() * 0.6);
    const y = 80 + Math.random() * 50;
    aquarium.spawnFood(x, y, 6);
    SoundFX.playBubble();
  });

  themeToggleBtn.addEventListener('click', () => {
    const isNight = aquarium.toggleNightMode();
    themeToggleBtn.innerHTML = isNight
      ? `<span>🌙</span> Deep Sea`
      : `<span>☀️</span> Sunlit Reef`;
  });

  soundToggleBtn.addEventListener('click', () => {
    const isAudioOn = SoundFX.toggleMute();
    soundToggleBtn.innerHTML = isAudioOn
      ? `<span>🔊</span> Sound ON`
      : `<span>🔇</span> Sound OFF`;
  });

  // Contact form submission placeholder
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent to the WM Labs team.');
      contactForm.reset();
      closeAllModals();
    });
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeProductDrawer();
    } else if (e.key === 'f' || e.key === 'F') {
      // Shortcut to feed fish
      feedBtn.click();
    }
  });
});

/**
 * WM LABS - Interactive Aquarium Application Controller
 * 
 * Clean, streamlined UI controller coordinating navigation links,
 * the active Products directory, About Us, Contact modal, and the Product Dossier drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('aquarium-canvas');

  // Modals & Drawers
  const productDrawerOverlay = document.getElementById('product-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerPrevBtn = document.getElementById('drawer-prev-btn');
  const drawerNextBtn = document.getElementById('drawer-next-btn');

  const productsModal = document.getElementById('modal-products');
  const aboutModal = document.getElementById('modal-about');
  const contactModal = document.getElementById('modal-contact');

  // Nav buttons
  const navHomeBtn = document.getElementById('nav-home');
  const navProductsBtn = document.getElementById('nav-products');
  const navAboutBtn = document.getElementById('nav-about');
  const navContactBtn = document.getElementById('nav-contact');

  let currentProductIndex = 0;

  // Initialize Aquarium Engine
  const aquarium = new AquariumEngine(canvas, {
    onFishClick: (product) => {
      openProductDrawer(product);
    }
  });

  // Load registered products
  aquarium.loadProducts(PRODUCTS_DATA);

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

  // Navigation Links
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

  // Contact form submission
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
    }
  });
});

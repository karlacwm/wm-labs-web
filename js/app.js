/**
 * WM LABS - Interactive Aquarium Application Controller
 * 
 * Clean, streamlined UI controller coordinating navigation links,
 * the active Products directory, About Us, Contact modal, and the Product Dossier drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('aquarium-canvas');

  // Modals & Windows
  const productModalOverlay = document.getElementById('product-modal-overlay');
  const productModalCloseBtn = document.getElementById('product-modal-close-btn');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');

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
      openProductModal(product);
    }
  });

  // Load registered products
  aquarium.loadProducts(PRODUCTS_DATA);

  // Populate Products Directory Grid in Products Modal
  populateProductsGrid();

  // ==========================================================================
  // Product Dossier Popup Modal Logic
  // ==========================================================================
  function openProductModal(product) {
    currentProductIndex = PRODUCTS_DATA.findIndex(p => p.id === product.id);
    renderProductModalContent(product);
    closeAllModals();
    productModalOverlay.classList.add('active');
  }

  function closeProductModal() {
    productModalOverlay.classList.remove('active');
  }

  function renderProductModalContent(product) {
    const windowEl = productModalOverlay.querySelector('.product-modal-window');
    windowEl.style.setProperty('--drawer-accent', product.accentColor || '#38BDF8');

    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-tagline').textContent = product.tagline;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-status').textContent = product.status;
    document.getElementById('modal-status').style.borderColor = product.accentColor || '#38BDF8';
    document.getElementById('modal-status').style.color = product.accentColor || '#38BDF8';

    document.getElementById('modal-description').textContent = product.description;

    // Highlights
    const highlightsList = document.getElementById('modal-highlights');
    highlightsList.innerHTML = '';
    product.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      highlightsList.appendChild(li);
    });

    // Metrics
    const metricsGrid = document.getElementById('modal-metrics');
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
    const ctaBtn = document.getElementById('modal-cta-btn');
    if (product.status === 'Coming Soon') {
      ctaBtn.href = 'javascript:void(0)';
      ctaBtn.removeAttribute('target');
      ctaBtn.removeAttribute('rel');
      ctaBtn.innerHTML = `Coming Soon <span>✦</span>`;
      ctaBtn.style.opacity = '0.55';
      ctaBtn.style.cursor = 'default';
      ctaBtn.style.background = 'rgba(255, 255, 255, 0.12)';
    } else {
      ctaBtn.href = product.url || '#';
      ctaBtn.target = '_blank';
      ctaBtn.rel = 'noopener noreferrer';
      ctaBtn.style.opacity = '1';
      ctaBtn.style.cursor = 'pointer';
      ctaBtn.innerHTML = `Open ${product.name} Site <span>→</span>`;
      ctaBtn.style.background = `linear-gradient(135deg, ${product.accentColor}dd, ${product.accentColor}88)`;
    }

    // Render Fish Avatar Preview Canvas
    renderAvatarCanvas(product);
  }

  function renderAvatarCanvas(product) {
    const previewContainer = document.getElementById('modal-avatar-preview');
    previewContainer.innerHTML = '';

    const frames = PixelSprites.getFrames(product);
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

  // Fish cycle buttons (Next / Prev)
  modalPrevBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex - 1 + PRODUCTS_DATA.length) % PRODUCTS_DATA.length;
    const prod = PRODUCTS_DATA[currentProductIndex];
    renderProductModalContent(prod);
    aquarium.focusProduct(prod.id);
  });

  modalNextBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex + 1) % PRODUCTS_DATA.length;
    const prod = PRODUCTS_DATA[currentProductIndex];
    renderProductModalContent(prod);
    aquarium.focusProduct(prod.id);
  });

  productModalCloseBtn.addEventListener('click', closeProductModal);

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
    }
  });
});

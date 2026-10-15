# WM Labs — Interactive Aquarium Launchpad

A clean, minimalist launchpad for **WM Labs** with an interactive pixel-art aquarium showcasing active engineering projects. Each product is represented by an autonomous swimming fish directing users to its respective product page.

---

## Quick Start (Run Locally)

Run using Python's built-in HTTP server:

```bash
# In the project directory:
python -m http.server 8080
```

Then open your browser to:
👉 **`http://localhost:8080`**

*(Or open `index.html` directly in any modern browser).*

---

## Active Products in Launchpad

1. **GoalCoach** (`#FF6B35` • Orange fish)
   - Adaptive AI language coach with dual-agent closed state-driven loop and LLM tool calling.
   - Live web application at [goalcoach.ai.studio](https://goalcoach.ai.studio).
2. **PastPort** (`#38EF7D` • Mint/Green fish)
   - Photographic heritage deduction and narrative simulation platform set in historical sites.
   - Proposal & research prototype at [github.com/Psyche0920/PastPort](https://github.com/Psyche0920/PastPort).
3. **Coming Soon (R&D)** (`#00F2FE` • Cyan fish)
   - Active research and development project.
4. **Coming Soon (Prototype)** (`#FFE066` • Yellow fish)
   - Active prototyping project.

---

## How to Add New Products & Fish

To add more products, open [`js/products-data.js`](file:///c:/Users/Karla/OneDrive/Desktop/wm-labs-web/js/products-data.js) and append an entry to the `PRODUCTS_DATA` array:

```javascript
{
  id: 'product-slug',
  name: 'Product Name',
  tagline: 'Short one-line product subtitle',
  category: 'Category / Domain',
  status: 'Live MVP', // 'Live MVP' | 'In Development' | 'Coming Soon'
  releaseEta: 'Available Now',
  leadDev: 'WM Labs Group',
  accentColor: '#FF6B35', // Drives fish color & popup glow (#FF6B35 orange, #38EF7D green, #00F2FE cyan, #FFE066 yellow, etc.)
  url: 'https://product.domain.com', // External URL or proposal repository
  githubUrl: 'https://github.com/org/repo',
  description: 'Comprehensive architectural overview...',
  highlights: [
    'Key capability or technical milestone',
    'Core architecture highlight'
  ],
  metrics: {
    spec1: 'Value 1',
    spec2: 'Value 2'
  }
}
```

The aquarium engine automatically spawns the new fish with collision avoidance, matches its pixel art colorway to `accentColor`, hooks up inspection hitboxes, and adds it to the **Products** directory modal.

---

## Project Structure

```text
wm-labs-web/
├── index.html            # Semantic HTML5 launch page, modal windows & backdrop
├── css/
│   └── style.css         # Modern frosted-glass styling, pop-up modal & responsive layout
├── js/
│   ├── products-data.js  # Product registry (edit this to add/modify products)
│   ├── pixel-sprites.js  # Procedural pixel art (fish palettes, corals, varied bubbles)
│   ├── aquarium-engine.js# 60 FPS HTML5 Canvas simulation, collision avoidance & hit-testing
│   └── app.js            # UI controller for navigation and product modal window
└── README.md             # Project documentation
```

---

## Controls & Interaction

- **Hover over Fish**: Pauses the fish, glows the name badge, and displays `"Click to inspect product →"`.
- **Click Fish**: Opens the centered **Product Dossier Window** with specifications, key metrics, architecture highlights, and the **"Launch Product Page →"** link. Use the `◀ Prev Fish` / `Next Fish ▶` buttons to cycle through products.
- **Autonomous Avoidance**: Fish actively detect proximity with other fish (`< 160px`) and steer away to prevent overlapping and collisions.
- **Navigation Bar**: Centered menu with quick access to **Home**, **Products** (full R&D directory), **About Us**, and **Contact**.

---

## Linking Your Company Domain

1. Deploy these static files to **GitHub Pages**, **Cloudflare Pages**, **Vercel**, or your own static host.
2. In your DNS registrar, point a `CNAME` or `A` record for your domain (e.g. `wmlabs.com`) to the hosting server.
3. In `js/products-data.js`, set each product's `url` property to its respective domain path or subdomain (e.g. `goalcoach.ai.studio` or `wmlabs.com/products/pastport`).

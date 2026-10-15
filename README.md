# WM Labs — Interactive Aquarium Launchpad

A clean, minimalist launchpad for **WM Labs** with a pixel-art aquarium aesthetic showcasing developing products. Each product is represented by an interactive swimming fish directing users to its respective product page.

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

## How to Add New Products & Fish

To add more products over time, open [`js/products-data.js`](file:///c:/Users/Karla/OneDrive/Desktop/wm-labs-web/js/products-data.js) and append an entry to the `PRODUCTS_DATA` array:

```javascript
{
  id: 'aqua-os',
  name: 'AquaOS Core',
  tagline: 'High-Throughput Micro-Kernel for Cloud Computing',
  species: 'clownfish', // clownfish (orange) | neontetra (cyan) | angelfish (green) | pufferfish (yellow) | koi (red) | guppy (purple)
  category: 'Infrastructure',
  status: 'In Development',
  releaseEta: 'Q3 2027',
  accentColor: '#FF6B35',
  url: 'https://aqua.wmlabs.com', // Links to individual product page
  description: 'Detailed description of the product architecture...',
  highlights: [
    'Sub-millisecond cold start times',
    'Deterministic memory safety'
  ],
  metrics: {
    speed: '4.8x faster',
    uptime: '99.99%'
  }
}
```

The engine automatically spawns the new fish, allocates swimming physics, hooks up inspection hitboxes, and includes it in the **Products** directory modal.

---

## Project Structure

```text
wm-labs-web/
├── index.html            # Semantic HTML5 launch page & modals
├── css/
│   └── style.css         # Modern frosted-glass styling and responsive layout
├── js/
│   ├── products-data.js  # Product registry (edit this to add/modify products)
│   ├── pixel-sprites.js  # Procedural pixel art (sleek fish, extra-large corals, bubbles)
│   ├── aquarium-engine.js# 60 FPS HTML5 Canvas simulation & hit-testing
│   └── app.js            # UI controller for navigation and product drawers
└── README.md             # This guide
```

---

## Controls & Interaction

- **Hover over Fish**: Pauses the fish and clearly displays its product name above and `"Click to inspect product →"` underneath.
- **Click Fish**: Opens the slide-over **Product Dossier Drawer** with specifications and the **"Launch Product Page →"** link.
- **Navigation Bar**: Quick access to **Home**, **Products** (all engineering projects directory), **About Us**, and **Contact**.

---

## Linking Your Company Domain

1. Deploy these static files to **GitHub Pages**, **Cloudflare Pages**, **Vercel**, or your own server.
2. In your DNS registrar, point a `CNAME` or `A` record for your domain (e.g. `wmlabs.com`) to the hosting server.
3. In `js/products-data.js`, set each product's `url` property to its respective domain path or subdomain (e.g., `aqua.wmlabs.com` or `wmlabs.com/products/aqua`).

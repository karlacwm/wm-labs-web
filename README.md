# WM Labs — Interactive Aquarium Launchpad

An interactive, pixel-art aquarium launchpad for **WM Labs** showcasing products in development. Each product swims as an interactive fish that users can feed, inspect, and click to visit its product page.

---

## Quick Start (Run Locally)

You do **not** need Node.js or any build steps. Run using Python's built-in static server:

```bash
# In the project directory:
python -m http.server 8080
```

Then open your browser to:
👉 **`http://localhost:8080`**

*(Or double-click `index.html` in any browser, or use VS Code's "Live Server" extension).*

---

## How to Add New Products & Fish

To add more products as the company grows, open [`js/products-data.js`](file:///c:/Users/Karla/OneDrive/Desktop/wm-labs-web/js/products-data.js) and add an entry:

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
  url: 'https://aqua.wmlabs.com', // Direct link to product page
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

The engine automatically creates the fish, sets up swimming physics, updates the product directory modal, and adds a quick switcher chip.

---

## Project Structure

```text
wm-labs-web/
├── index.html            # Main semantic HTML5 launch page & modals
├── css/
│   └── style.css         # Modern styling, glassmorphism, responsive layout
├── js/
│   ├── products-data.js  # Product registry (edit this to add/modify products)
│   ├── pixel-sprites.js  # Pixel art rendering (fish, corals, kelp, bubbles)
│   ├── sound-effects.js  # 8-bit Web Audio synthesizer (zero external mp3s)
│   ├── aquarium-engine.js# 60 FPS Canvas physics & autonomous swimming AI
│   └── app.js            # UI controller, drawers, and modal handlers
└── README.md             # This guide
```

---

## Features & Controls

- **Click a Fish**: Plays a chime and slides open the detailed **Product Dossier Drawer** with launch links.
- **Click Empty Water**: Drops fish food pellets (`~`). Nearby fish swim over to eat.
- **🦐 Feed Tank Button** (or press <kbd>F</kbd>): Spawns food across the tank.
- **☀️ Sunlit Reef / 🌙 Deep Sea**: Toggles daylight tropical reef vs. midnight bioluminescent glow.
- **🔇 / 🔊 Sound Button**: Toggles aquatic 8-bit sound effects (muted by default).

---

## Custom Domain Setup

When linking this site to your company domain (e.g., `wmlabs.com`):
1. Deploy these static files to **GitHub Pages**, **Cloudflare Pages**, **Vercel**, or your own server.
2. In your DNS provider, set a `CNAME` or `A` record pointing to your host.
3. In `js/products-data.js`, set the `url` property for each product to its respective subdomain (e.g., `aqua.wmlabs.com`) or path (e.g., `wmlabs.com/products/aqua`).

/**
 * WM LABS - Pixel Graphics Art & Sprite Generator
 * 
 * Provides procedural pixel art rendering for cute clean fish species,
 * large environmental corals, lush waving kelp, and shiny bubble particles.
 * Supports both matrix-based pixel art and external PNG sprite loading.
 */

const PixelSprites = (() => {
  const cache = {};

  /**
   * Helper to parse pixel art matrix into an offscreen canvas.
   */
  function createMatrixSprite(matrix, palette, pixelScale = 2) {
    const height = matrix.length;
    const width = matrix[0].length;
    const canvas = document.createElement('canvas');
    canvas.width = width * pixelScale;
    canvas.height = height * pixelScale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < height; y++) {
      const row = matrix[y];
      for (let x = 0; x < width; x++) {
        const char = row[x];
        const color = palette[char];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale);
        }
      }
    }
    return canvas;
  }

  // --- CUTE, SIMPLE, ICONIC PIXEL FISH FRAMES (Facing RIGHT: Head right, Tail left) ---
  // Frame 0: Neutral Tail
  const fishFrame0 = [
    ".........KKKK.......",
    ".......KKHHHHcKK....",
    "..KKKKKCHHHHHHHcK...",
    ".KFFFFKCCHHHHHHHcK..",
    "KFFFFFKCCCHHHHWWEcK.",
    "KFFFFFFKCCCCCWGGECK.",
    "KFFFFFKCCFFCCWGGECK.",
    ".KFFFFKCCffffCCCCcK.",
    "..KKKKKCBCCCCCCccK..",
    ".......KCBBBBBBcK...",
    "........KKBBBBcK....",
    "..........KKKK......"
  ];

  // Frame 1: Tail swung UP
  const fishFrame1 = [
    ".KKKKKKKK...........",
    "KFFFFFFKKKHHHHcKK...",
    "KFFFFFFFKCHHHHHHHcK.",
    ".KFFFFFKCCHHHHHHHcK.",
    "..KKKKKKCCCHHHHWWEcK",
    "......KCCCCCCWGGECK.",
    "......KCCFFCCWGGECK.",
    "......KCCffffCCCCcK.",
    ".......KCBCCCCCCccK.",
    ".......KCBBBBBBcK...",
    "........KKBBBBcK....",
    "..........KKKK......"
  ];

  // Frame 2: Tail swung DOWN
  const fishFrame2 = [
    ".........KKKK.......",
    ".......KKHHHHcKK....",
    "........KCHHHHHHHcK.",
    ".......KCCHHHHHHHcK.",
    "......KCCCHHHHWWEcK.",
    "......KCCCCCCWGGECK.",
    "..KKKKKCCFFCCWGGECK.",
    ".KFFFFFKCffffCCCCcK.",
    "KFFFFFFKCBCCCCCCccK.",
    "KFFFFFFKKCBBBBBBcK..",
    ".KKKKKK.KKBBBBcK....",
    "..........KKKK......"
  ];

  const fishFrames = [fishFrame0, fishFrame1, fishFrame2];

  // Color palettes for simple, distinct, vibrant fish
  const colorPalettes = {
    // 1. Orange Clown/Goldfish (AquaOS)
    clownfish: {
      C: '#FF7A29', c: '#D94B0A', H: '#FFA966', B: '#FFF0D4', F: '#FF944D', f: '#C43D04',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    },
    // 2. Cyan / Neon Blue Tang (HyperStream)
    neontetra: {
      C: '#00D2FF', c: '#007BB8', H: '#80E8FF', B: '#E0F7FF', F: '#38BDF8', f: '#0284C7',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    },
    // 3. Mint / Emerald Angelfish (DeepQuery)
    angelfish: {
      C: '#10B981', c: '#047857', H: '#6EE7B7', B: '#ECFDF5', F: '#34D399', f: '#059669',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    },
    // 4. Golden Yellow Sunfish (VaultPulse)
    pufferfish: {
      C: '#FBBF24', c: '#D97706', H: '#FDE68A', B: '#FFFBEB', F: '#FCD34D', f: '#B45309',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    },
    // 5. Coral / Ruby Koi (Aura Compute)
    koi: {
      C: '#F43F5E', c: '#BE123C', H: '#FDA4AF', B: '#FFF1F2', F: '#FB7185', f: '#9F1239',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    },
    // 6. Royal Purple / Violet Guppy (PixelForge UI)
    guppy: {
      C: '#A855F7', c: '#7E22CE', H: '#D8B4FE', B: '#FAF5FF', F: '#C084FC', f: '#6B21A8',
      W: '#FFFFFF', E: '#090D16', G: '#FFFFFF', K: '#090D16'
    }
  };

  // --- LARGER, MORE VIBRANT CORAL SPRITES ---
  function createBigCoralSprite(primaryColor, darkColor, highlightColor) {
    const palette = {
      'C': primaryColor,
      'c': darkColor,
      'H': highlightColor,
      'K': '#090D16'
    };
    // 24x18 larger branching coral
    const m = [
      "....KK.......KK.........KK..",
      "...KCCK.....KCCK.......KCCK.",
      "..KHCCK.....KHCCK.....KHCCK.",
      "..KHCCcK...KHCCcK.....KHCCcK",
      "..KHHCCcKK.KHCCcK....KHHCCcK",
      "...KHHCCcKKKHCCcKK..KHHCCcK.",
      "...KHHCCcKKHHCCcKK.KHHCCcK..",
      "....KHHCCcKHHCCcKKKHHCCcK...",
      "....KHHCCcKHHCCcKKHHCCcK....",
      ".....KHHCCcHHCCcKHHCCcK.....",
      ".....KHHCCcHHCCcKHHCCcK.....",
      "......KHCCCCCCCCCCCCcK......",
      "......KHCCCCCCCCCCCCcK......",
      ".......KcccccccccccccK......",
      "........KcccccccccccK.......",
      ".........KKccccccccKK.......",
      "...........KKKKKKKK........."
    ];
    return createMatrixSprite(m, palette, 3);
  }

  // Round Brain Coral / Sea Anemone
  function createBrainCoralSprite(c1, c2, c3) {
    const palette = { 'A': c1, 'B': c2, 'C': c3, 'K': '#090D16' };
    const m = [
      "........KKKKKKKK........",
      "......KKCAAAAAACKK......",
      "....KKCAAAAAAAAACKK.....",
      "...KCAACAAAAACAACAK.....",
      "..KCAAACAAAAACAAACAK....",
      ".KCAAAAACAAAACAAAACAK...",
      ".KCAAAAACAAAACAAAACAK...",
      "KCAAAAAACAAAACAAAAACAK..",
      "KCAAAACCCCCCCCCCACCAAK..",
      "KCAAACBBBBBBBBBCCCACAK..",
      "KCAAACBBBBBBBBBBCCACAK..",
      ".KAAACBBBBBBBBBBCCAAK...",
      ".KBAACBBBBBBBBBBCCBAK...",
      "..KBBACCCCCCCCCCBBBK....",
      "...KKBBBBBBBBBBBBKK.....",
      ".....KKKKKKKKKKKK......."
    ];
    return createMatrixSprite(m, palette, 3);
  }

  // Chest Sprite
  function createChestSprite() {
    const palette = {
      'W': '#78350F',
      'w': '#B45309',
      'G': '#FBBF24',
      'g': '#D97706',
      'K': '#090D16',
      'L': '#38BDF8',
      'l': '#BAE6FD',
    };
    const m = [
      ".......KKKKKKKKKKKKKK.......",
      ".....KKGGGGGGGGGGGGGGKK.....",
      "....KGWwWwWwWwWwWwWwWGK.....",
      "...KGwWwWwWwWwWwWwWwWwWGK...",
      "...KGGGGGGGGGGGGGGGGGGGGK...",
      "...KLLLLLLLLLLLLLLLLLLLLK...",
      "...KLLllllLLLLllllLLLLLLK...",
      "..KGGGGGGGGGGGGGGGGGGGGGGK..",
      "..KGWWwwWWwwWWwwWWwwWWwwGK..",
      "..KGWwWWwwWWwwWWwwWWwwWWGK..",
      "..KGWwWWwwWGgGWwwWWwwWWwGK..",
      "..KGWWwwWWwGgGWwwWWwwWWwGK..",
      "..KGWwWWwwWWwwWWwwWWwwWWGK..",
      "..KGWWwwWWwwWWwwWWwwWWwwGK..",
      "..KKGGGGGGGGGGGGGGGGGGGGKK..",
      "....KKKKKKKKKKKKKKKKKKKK...."
    ];
    return createMatrixSprite(m, palette, 3);
  }

  function initSprites() {
    // Generate clean fish species in each colorway
    Object.keys(colorPalettes).forEach(species => {
      const palette = colorPalettes[species];
      cache[species] = fishFrames.map(m => createMatrixSprite(m, palette, 2));
    });

    // Rich Coral Formations
    cache['coral_pink'] = createBigCoralSprite('#F43F5E', '#BE123C', '#FDA4AF');
    cache['coral_purple'] = createBigCoralSprite('#A855F7', '#7E22CE', '#E9D5FF');
    cache['coral_orange'] = createBigCoralSprite('#FB923C', '#C2410C', '#FED7AA');
    cache['coral_cyan'] = createBrainCoralSprite('#06B6D4', '#0E7490', '#A5F3FC');
    cache['coral_yellow'] = createBrainCoralSprite('#EAB308', '#A16207', '#FEF08A');

    cache['chest'] = createChestSprite();
  }

  /**
   * Helper to load external PNG image sprites if user wishes to import custom drawn art.
   * Handles onload asynchronous events safely so nothing breaks or remains invisible.
   */
  function loadSpriteImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }

  // Draw lush, taller, thicker seaweed with sine wave sway
  function drawPixelKelp(ctx, startX, startY, height, time, swayOffset = 0, isFront = false) {
    const segments = Math.floor(height / 12);
    const segHeight = height / segments;
    let currX = startX;
    let currY = startY;

    ctx.save();
    for (let i = 0; i < segments; i++) {
      // Gentle sinusoidal wave sway
      const sway = Math.sin(time * 1.6 + i * 0.35 + swayOffset) * (i * 2.8);
      const nextX = startX + sway;
      const nextY = currY - segHeight;

      // Color shading
      const ratio = i / segments;
      let r, g, b;
      if (isFront) {
        r = Math.round(16 + ratio * 40);
        g = Math.round(155 + ratio * 85);
        b = Math.round(65 + ratio * 45);
      } else {
        r = Math.round(10 + ratio * 25);
        g = Math.round(105 + ratio * 55);
        b = Math.round(45 + ratio * 30);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      // Thicker blade width
      const bladeW = Math.max(6, 14 - i * 0.6);
      ctx.fillRect(Math.round(currX - bladeW / 2), Math.round(currY - segHeight), Math.round(bladeW), Math.round(segHeight + 1));

      // Leaf fronds extending outward
      if (i % 2 === 0 && i > 1 && i < segments - 1) {
        ctx.fillStyle = `rgb(${r + 25}, ${g + 30}, ${b + 15})`;
        const dir = (i % 4 === 0) ? 1 : -1;
        const leafW = 10 + (segments - i) * 0.4;
        ctx.fillRect(Math.round(currX + (dir === 1 ? bladeW / 2 : -bladeW / 2 - leafW)), Math.round(currY - segHeight / 2), Math.round(leafW), 5);
      }

      currX = nextX;
      currY = nextY;
    }
    ctx.restore();
  }

  // Draw cute glossy pixel bubble of any size
  function drawPixelBubble(ctx, x, y, radius, opacity = 0.85) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const r = Math.max(3, Math.round(radius));

    // Outer pixel ring
    ctx.fillStyle = '#BAE6FD';
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r), (r - 1) * 2, r * 2);
    ctx.fillRect(Math.round(x - r), Math.round(y - r + 1), r * 2, (r - 1) * 2);

    // Inner translucent sphere
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(Math.round(x - r + 2), Math.round(y - r + 2), (r - 2) * 2, (r - 2) * 2);

    // Cute glossy highlight pixel
    ctx.fillStyle = '#FFFFFF';
    const hlSize = Math.max(2, Math.floor(r * 0.45));
    ctx.fillRect(Math.round(x - Math.floor(r * 0.55)), Math.round(y - Math.floor(r * 0.55)), hlSize, hlSize);

    // Secondary subtle lower glint for big bubbles
    if (r >= 8) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(Math.round(x + Math.floor(r * 0.3)), Math.round(y + Math.floor(r * 0.3)), 2, 2);
    }

    ctx.restore();
  }

  // Draw food pellet
  function drawPixelFlake(ctx, x, y, frame) {
    ctx.save();
    ctx.fillStyle = (frame % 2 === 0) ? '#F59E0B' : '#EF4444';
    ctx.fillRect(Math.round(x), Math.round(y), 5, 4);
    ctx.fillStyle = '#FDE68A';
    ctx.fillRect(Math.round(x + 1), Math.round(y + 1), 3, 2);
    ctx.restore();
  }

  return {
    init: initSprites,
    getFrames: (species) => cache[species] || cache['clownfish'],
    getScenery: (key) => cache[key],
    drawPixelKelp,
    drawPixelBubble,
    drawPixelFlake,
    loadSpriteImage
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PixelSprites };
}

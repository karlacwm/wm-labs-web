/**
 * WM LABS - Pixel Graphics Art & Sprite Generator
 * 
 * Provides procedural pixel art rendering matching the flagship launch preview:
 * - Authentic 32x20 pixel goldfish/koi silhouette with flared caudal tail, dorsal fin, and round eye
 * - Layered boulder rocks, tiered stone plateaus
 * - Diverse corals: tube sponges, pink anemone, cyan staghorn, purple tubes, red sea fan, green moss mounds
 * - Dynamic swaying kelp with natural staggered heights
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

  // --- AUTHENTIC PIXEL GOLDFISH / KOI SPRITE (32x20) ---
  // Facing RIGHT: Head on right, flared triangular caudal fin on left
  const fishMatrix = [
    "................................",
    "...............KKKKK............",
    ".............KKFFFfKKKK.........",
    "...........KKFFFFFFfffcK........",
    ".........KKFFFFFFFFfffccK.......",
    "........KCHHHHHHHHHHHHcccK......",
    "..KKK..KCHHHHHHHHHHHHHHcccK.....",
    ".KFFFK.KCHHHHHHHHHHHHHHHcccK....",
    "KFFFFFKCCHHHHHHHHHHHHWWEcccK....",
    "KFFFFFFKCCHHHHHHHHHHHWGGccccK...",
    "KFFFFFFFKKCCCCCCCCCCCWGGccccK...",
    "KFFFFFFKCCHHHCCCCCCCCWEEccccK...",
    "KFFFFFKCCFFCCCCCCCCCccccccccK...",
    ".KFFFKCCffffCCCCCCCCccccccccK...",
    "..KKK.KCBCCCCCCCCCCCCCCCCccK....",
    ".......KCBBBBBBBBBBBBBBccccK....",
    "........KCCBBBBBBBBBBccccKK.....",
    "..........KKKFFffffKCKKK........",
    "............KFFFfffK............",
    ".............KKKKKK............."
  ];

  // 6 vibrant product color palettes
  const colorPalettes = {
    // 1. Vibrant Goldfish Orange (AquaOS) - matching the hero orange fish
    clownfish: {
      C: '#FF7A29', c: '#C43D04', H: '#FFA756', B: '#FFF1D6', F: '#FF8833', f: '#A32F00',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    // 2. Electric Cyan / Neon Blue (HyperStream)
    neontetra: {
      C: '#00D2FF', c: '#006FA8', H: '#7DE6FF', B: '#E0F8FF', F: '#38BDF8', f: '#0284C7',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    // 3. Mint / Emerald Green (DeepQuery)
    angelfish: {
      C: '#10B981', c: '#046A4E', H: '#6EE7B7', B: '#ECFDF5', F: '#34D399', f: '#065F46',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    // 4. Radiant Golden Sunfish (VaultPulse)
    pufferfish: {
      C: '#FBBF24', c: '#B45309', H: '#FDE68A', B: '#FFFBEB', F: '#FCD34D', f: '#92400E',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    // 5. Ruby Coral / Magenta (Aura Compute)
    koi: {
      C: '#F43F5E', c: '#9F1239', H: '#FDA4AF', B: '#FFF1F2', F: '#FB7185', f: '#881337',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    // 6. Royal Cyber Violet (PixelForge UI)
    guppy: {
      C: '#A855F7', c: '#6B21A8', H: '#D8B4FE', B: '#FAF5FF', F: '#C084FC', f: '#581C87',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    }
  };

  // --- DIVERSE UNDERWATER SCENERY SPRITES (MATCHING LAUNCH PREVIEW) ---

  // 1. Slate Rocks / Boulders (Mound)
  function createRockMound(widthScale = 3) {
    const palette = {
      'R': '#475569', // Slate light highlight
      'r': '#334155', // Slate body
      'D': '#1E293B', // Dark slate shadow
      'd': '#0F172A', // Deep shadow
      'K': '#020617'  // Outline
    };
    const m = [
      ".........KKKKKK.............................",
      ".......KKRRRRRRKKK........KKKKKKK...........",
      ".....KKRRRRRRRRRRRKK....KKRRRRRRRKKK........",
      "....KRRRRrrrrrrRRRRRKKKKRRRrrrrrrRRRKK......",
      "...KRRRrrrrrrrrrrrrRRRRRRRrrrrrrrrrrrRKK....",
      "..KRRRrrrrrrDDDrrrrrrrrrrrrrrrrDDDDrrrrRKK..",
      ".KRRRrrrrrDDDDDDrrrrrrrrrrrrrDDDDDDDDrrrRK..",
      "KRRRrrrrrDDDDDDDDrrrrrrrrrrrDDDDDDDDDDdrrRK.",
      "KRRrrrrrDDDDDDDDddrrrrrrrrrDDDDDDDDDDdddrrRK",
      "KrrrrrrDDDDDDDDdddrrrrrrrrDDDDDDDDDdddddrrRK",
      "KrrrrrDDDDDDDDDdddrrrrrrrDDDDDDDDddddddrrrRK",
      "KKrrrDDDDDDDDDddddKrrrrrrDDDDDDdddddddrrrKK.",
      ".KKKDDDDDDDDDddddKKKrrrrDDDDDdddddddrrrKKK..",
      "..KKKKKKKKKKKKKKKK.KKKKKKKKKKKKKKKKKKKK....."
    ];
    return createMatrixSprite(m, palette, widthScale);
  }

  // 2. Orange Tube Sponges (Cylindrical open-mouth corals on the left)
  function createTubeSponges() {
    const palette = {
      'Y': '#FBBF24', // Rim highlight
      'O': '#F97316', // Body orange
      'o': '#EA580C', // Dark orange shadow
      'D': '#7C2D12', // Open tube mouth inside
      'K': '#0F172A'
    };
    const m = [
      "....KKKKK.........KKKK..........",
      "...KYDDDYK.......KYDDYK.........",
      "..KYYYYYYYK.....KYYYYYK.........",
      "..KYOOOOOYK.....KYOOOYK...KKKK..",
      "..KYOOOOOoK.....KYOOOoK..KYDDYK.",
      "..KYOOOOOoK.....KYOOOoK.KYYYYYK.",
      "..KYOOOOOoK.....KYOOOoK.KYOOOYK.",
      "..KYOOOOOoK.....KYOOOoK.KYOOOoK.",
      "..KYOOOOOoK.KK..KYOOOoK.KYOOOoK.",
      "..KYOOOOOooKYOK.KYOOOoK.KYOOOoK.",
      "..KYOOOOOooKYoK.KYOOOooKKYOOOoK.",
      "..KYOOOOOooKYoK.KYOOOooKKYOOOooK",
      "..KYYOOOOooKYoKKKYOOOooKKYOOOooK",
      "...KKKKKKKKKKKK..KKKKKKK.KKKKKKK"
    ];
    return createMatrixSprite(m, palette, 3);
  }

  // 3. Pink Sea Anemone with wavy tentacles
  function createPinkAnemone() {
    const palette = {
      'T': '#FDA4AF', // Tentacle tip
      'P': '#F43F5E', // Tentacle body
      'p': '#BE123C', // Shadow
      'B': '#9F1239', // Base shadow
      'K': '#0F172A'
    };
    const m = [
      "..KTK...KTK...KTK...KTK...KTK...",
      ".KTPTK.KTPTK.KTPTK.KTPTK.KTPTK..",
      ".KPPTK.KPPTK.KPPTK.KPPTK.KPPTK..",
      "..KPPTKKPPTKKKPPTKKKPPTKKKPPTK..",
      "..KPPPKPPPKKKKPPPKKKKPPPKKPPPK..",
      "...KPPPPPPPPPPPPPPPPPPPPPPPK....",
      "...KPPPPppppppppppppppPPPPK.....",
      "....KPPPppppppppppppppPPPK......",
      "....KBBBBBBBBBBBBBBBBBBBBK......",
      ".....KKKKKKKKKKKKKKKKKKKK......."
    ];
    return createMatrixSprite(m, palette, 3.5);
  }

  // 4. Cyan Staghorn Coral Branches
  function createCyanStaghorn() {
    const palette = {
      'C': '#38BDF8', // Cyan highlight
      'c': '#0284C7', // Cyan body
      'D': '#0369A1', // Deep shadow
      'K': '#0F172A'
    };
    const m = [
      "....KK.......KK.........KK......",
      "...KCCK.....KCCK.......KCCK.....",
      "..KCCCK.....KCCCK.....KCCCK..KK.",
      "..KCCcCK...KCCcCK.....KCCcCKKCCK",
      "..KCcDcKK..KCcDcK....KCcDcKKCcCK",
      "...KCcDcKKKCcDcKK..KKCcDcKKCcDcK",
      "...KCcDcKKCcDcKK..KKCcDcKKCcDcK.",
      "....KCcDcKCcDcKKKKCcDcKKCcDcK...",
      "....KCcDcKCcDcKKCcDcKKCcDcK.....",
      ".....KCcDccDccDccDccDcK.........",
      "......KCDDDDDDDDDDDDDcK.........",
      ".......KDDDDDDDDDDDDDK..........",
      ".........KKKKKKKKKKKK..........."
    ];
    return createMatrixSprite(m, palette, 3.5);
  }

  // 5. Purple Sea Tubes (Right shelf)
  function createPurpleTubes() {
    const palette = {
      'V': '#C084FC', // Violet rim
      'v': '#9333EA', // Purple body
      'D': '#3B0764', // Deep inside mouth
      'K': '#0F172A'
    };
    const m = [
      "....KKKK........KKKKK...........",
      "...KVDDVK......KVDDDVK..........",
      "..KVVVVVVK....KVVVVVVVK.........",
      "..KVvvvvVK....KVvvvvvVK...KKKK..",
      "..KVvvvvvK....KVvvvvvVK..KVDDVK.",
      "..KVvvvvvK....KVvvvvvVK.KVVVVVVK",
      "..KVvvvvvK....KVvvvvvVK.KVvvvvVK",
      "..KVvvvvvK.KK.KVvvvvvVK.KVvvvvvK",
      "..KVvvvvvvKVvKKVvvvvvvKKKVvvvvvK",
      "...KKKKKKKKKKKKKKKKKKKKKKKKKKKKK"
    ];
    return createMatrixSprite(m, palette, 3.2);
  }

  // 6. Red Sea Fan Coral
  function createRedSeaFan() {
    const palette = {
      'R': '#FB7185', // Light coral tip
      'r': '#E11D48', // Red body
      'D': '#881337', // Deep stem
      'K': '#0F172A'
    };
    const m = [
      ".......KKKKKKKKKK.......",
      ".....KKRRRRRRRRRRKK.....",
      "...KKRRrrrrrrrrrrRRKK...",
      "..KRRrrrrrrrrrrrrrrRRK..",
      ".KRRrrKrKKrKKrKKrKrrRRK.",
      ".KRrKKrKKrKKrKKrKKrKKrRK",
      "KRRrrKKrKKrKKrKKrKKrrRRK",
      "KRrrrrrrrrrrrrrrrrrrrrRK",
      "KRrrKrKrKrKrKrKrKrKrKrrK",
      ".KrrKrKrKrKrKrKrKrKrKrrK",
      "..KrrrKrrKrrKrrKrrKrrrK.",
      "...KDDDDDDDDDDDDDDDDDK..",
      ".....KKKDDDDDDDDDKKK....",
      "........KKDDDDDKK.......",
      "..........KDDDK.........",
      "..........KKKKK........."
    ];
    return createMatrixSprite(m, palette, 3.5);
  }

  // 7. Green Moss / Sea Grass Mound
  function createMossMound() {
    const palette = {
      'G': '#4ADE80',
      'g': '#16A34A',
      'D': '#14532D',
      'K': '#0F172A'
    };
    const m = [
      "......KK...KK.....KK....",
      "....KKGGK.KGGK...KGGKK..",
      "...KGGGGKKGGGGKKKGGGGK..",
      "..KGGggggGGggggGGggggK..",
      ".KGggggggggggggggggggGK.",
      ".KgggggDDDDDDDDDggggggK.",
      "..KKDDDDDDDDDDDDDDDDKK..",
      "....KKKKKKKKKKKKKKKK...."
    ];
    return createMatrixSprite(m, palette, 3);
  }

  function initSprites() {
    // Generate authentic goldfish/koi in 6 product colorways
    Object.keys(colorPalettes).forEach(species => {
      const palette = colorPalettes[species];
      cache[species] = [createMatrixSprite(fishMatrix, palette, 2.8)];
    });

    // Scenery Elements matching the reference preview
    cache['rock_mound'] = createRockMound(3.2);
    cache['tube_sponges'] = createTubeSponges();
    cache['pink_anemone'] = createPinkAnemone();
    cache['cyan_staghorn'] = createCyanStaghorn();
    cache['purple_tubes'] = createPurpleTubes();
    cache['red_sea_fan'] = createRedSeaFan();
    cache['moss_mound'] = createMossMound();
  }

  // Draw kelp with natural staggered heights and wavy sine sway
  function drawPixelKelp(ctx, startX, startY, height, time, swayOffset = 0, isFront = false) {
    const segments = Math.max(8, Math.floor(height / 14));
    const segHeight = height / segments;
    let currX = startX;
    let currY = startY;

    ctx.save();
    for (let i = 0; i < segments; i++) {
      // Gentle wavy sway
      const sway = Math.sin(time * 1.5 + i * 0.32 + swayOffset) * (i * 2.5);
      const nextX = startX + sway;
      const nextY = currY - segHeight;

      const ratio = i / segments;
      let r, g, b;
      if (isFront) {
        r = Math.round(18 + ratio * 45);
        g = Math.round(160 + ratio * 85);
        b = Math.round(65 + ratio * 45);
      } else {
        r = Math.round(10 + ratio * 28);
        g = Math.round(105 + ratio * 55);
        b = Math.round(40 + ratio * 32);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      const bladeW = Math.max(5, 12 - i * 0.5);
      ctx.fillRect(Math.round(currX - bladeW / 2), Math.round(currY - segHeight), Math.round(bladeW), Math.round(segHeight + 1));

      // Leaf fronds extending outward
      if (i % 2 === 0 && i > 1 && i < segments - 1) {
        ctx.fillStyle = `rgb(${r + 25}, ${g + 30}, ${b + 15})`;
        const dir = (i % 4 === 0) ? 1 : -1;
        const leafW = 9 + (segments - i) * 0.35;
        ctx.fillRect(Math.round(currX + (dir === 1 ? bladeW / 2 : -bladeW / 2 - leafW)), Math.round(currY - segHeight / 2), Math.round(leafW), 4);
      }

      currX = nextX;
      currY = nextY;
    }
    ctx.restore();
  }

  // Draw glossy pixel bubble
  function drawPixelBubble(ctx, x, y, radius, opacity = 0.85) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const r = Math.max(3, Math.round(radius));

    ctx.fillStyle = '#BAE6FD';
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r), (r - 1) * 2, r * 2);
    ctx.fillRect(Math.round(x - r), Math.round(y - r + 1), r * 2, (r - 1) * 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(Math.round(x - r + 2), Math.round(y - r + 2), (r - 2) * 2, (r - 2) * 2);

    ctx.fillStyle = '#FFFFFF';
    const hlSize = Math.max(2, Math.floor(r * 0.45));
    ctx.fillRect(Math.round(x - Math.floor(r * 0.55)), Math.round(y - Math.floor(r * 0.55)), hlSize, hlSize);

    if (r >= 8) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(Math.round(x + Math.floor(r * 0.3)), Math.round(y + Math.floor(r * 0.3)), 2, 2);
    }

    ctx.restore();
  }

  return {
    init: initSprites,
    getFrames: (species) => cache[species] || cache['clownfish'],
    getScenery: (key) => cache[key],
    drawPixelKelp,
    drawPixelBubble
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PixelSprites };
}

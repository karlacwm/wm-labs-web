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

  // Vibrant product color palettes
  const colorPalettes = {
    orange: {
      C: '#FF7A29', c: '#C43D04', H: '#FFA756', B: '#FFF1D6', F: '#FF8833', f: '#A32F00',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    cyan: {
      C: '#00D2FF', c: '#006FA8', H: '#7DE6FF', B: '#E0F8FF', F: '#38BDF8', f: '#0284C7',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    green: {
      C: '#10B981', c: '#046A4E', H: '#6EE7B7', B: '#ECFDF5', F: '#34D399', f: '#065F46',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    yellow: {
      C: '#FBBF24', c: '#B45309', H: '#FDE68A', B: '#FFFBEB', F: '#FCD34D', f: '#92400E',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    red: {
      C: '#F43F5E', c: '#9F1239', H: '#FDA4AF', B: '#FFF1F2', F: '#FB7185', f: '#881337',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    },
    purple: {
      C: '#A855F7', c: '#6B21A8', H: '#D8B4FE', B: '#FAF5FF', F: '#C084FC', f: '#581C87',
      W: '#FFFFFF', E: '#0B132B', G: '#FFFFFF', K: '#0B132B'
    }
  };

  // Aliases for backwards compatibility
  colorPalettes.clownfish = colorPalettes.orange;
  colorPalettes.neontetra = colorPalettes.cyan;
  colorPalettes.angelfish = colorPalettes.green;
  colorPalettes.pufferfish = colorPalettes.yellow;
  colorPalettes.koi = colorPalettes.red;
  colorPalettes.guppy = colorPalettes.purple;

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
      ".........KDDDDDDDDDDK...........",
      ".........KDDDDDDDDDDK...........",
      ".........KDDDDDDDDDDK...........",
      ".........KKKKKKKKKKKK...........",
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
      "..KVvvvvvvKVvKKVvvvvvvKKKVvvvvvK",
      "..KVvvvvvvKVvKKVvvvvvvKKKVvvvvvK",
      "..KVvvvvvvKVvKKVvvvvvvKKKVvvvvvK",
      "..KVvvvvvvKVvKKVvvvvvvKKKVvvvvvK",
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

  // 8. Golden Brain Coral (Grooved dome)
  function createBrainCoral() {
    const palette = {
      'Y': '#FDE047', // Ridge highlight
      'O': '#F59E0B', // Golden body
      'D': '#B45309', // Groove shadow
      'S': '#78350F', // Deep valley
      'K': '#0F172A'
    };
    const m = [
      ".......KKKKKKKKKK.......",
      ".....KKYOYOYOYOYOKK.....",
      "...KKYOYYODDDDOYYOYKK...",
      "..KYOODDSYYYYYYSDDOOYK..",
      ".KYODSYYODDDDDDOYYSDOYK.",
      ".KYOSYODYYYYYYYYDOYSYOK.",
      "KYODSYODDDDDDDDDDOYSDOYK",
      "KYOSYYODYYYYYYYYDOYYSYOK",
      "KYODSYODDDDDDDDDDOYSDOYK",
      ".KYOSYYOYYYYYYYYDOYYSYOK.",
      ".KYODDSSDDDDDDDDSSDOOYK.",
      "..KYOODDDDDDDDDDDDDOOYK..",
      "...KKSSSSSSSSSSSSSSKK...",
      ".....KKKKKKKKKKKKKK....."
    ];
    return createMatrixSprite(m, palette, 3.4);
  }

  // 9. Electric Fire Coral (Branching flame cluster)
  function createFireCoral() {
    const palette = {
      'F': '#FDE047', // Yellow tip
      'O': '#FF6B00', // Fiery orange body
      'D': '#C2410C', // Deep red-orange shadow
      'K': '#0F172A'
    };
    const m = [
      "...KK.....KK.....KK.....",
      "..KFK....KFK....KFK.....",
      "..KOK....KOK....KOK.....",
      "..KOK...KOKOK...KOK.KK..",
      "..KODKK.KODOK..KODOKFK..",
      "..KODOKKKODOK..KODOKOK..",
      "...KODOKODODOKKKODOKOK..",
      "...KODODODODODODODODOK..",
      "....KODDDDDDDDDDDDDOK...",
      ".....KKODDDDDDDDDDKK....",
      ".......KKKKKKKKKKK......"
    ];
    return createMatrixSprite(m, palette, 3.2);
  }

  // 10. Bubble / Pearl Coral (Cluster of glowing aquamarine vesicles)
  function createBubbleCoral() {
    const palette = {
      'W': '#F0FDFA', // Glint
      'G': '#6EE7B7', // Highlight
      'T': '#14B8A6', // Body teal
      'D': '#0F766E', // Shadow
      'K': '#0F172A'
    };
    const m = [
      ".......KKKKK............",
      ".....KKWGGGTKK...KKKK...",
      "....KWGGTTTTDK.KKWGTKK..",
      "...KWGGTTTTTDKKWGTTTDK..",
      "..KKDTTTTTTDKKWGTTTTTDK.",
      ".KWGTKKKKKKDKDTTTTTTTDDK",
      "KWGTTDK..KWGTTKKKKKKKK..",
      "KTTTTDK.KWGTTTDK........",
      ".KDTTDK.KDTTTTDK........",
      "..KKKK...KDTTDK.........",
      "..........KKKK.........."
    ];
    return createMatrixSprite(m, palette, 3.4);
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
    cache['brain_coral'] = createBrainCoral();
    cache['fire_coral'] = createFireCoral();
    cache['bubble_coral'] = createBubbleCoral();
  }

  // Draw kelp: thickened slightly with crisp definition and elegant leaves
  function drawPixelKelp(ctx, startX, startY, height, time, swayOffset = 0, isFront = false) {
    const segments = Math.max(8, Math.floor(height / 15));
    const segHeight = height / segments;
    let currX = startX;
    let currY = startY;

    ctx.save();
    for (let i = 0; i < segments; i++) {
      // Gentle wavy sway
      const sway = Math.sin(time * 1.4 + i * 0.3 + swayOffset) * (i * 2.4);
      const nextX = startX + sway;
      const nextY = currY - segHeight;

      const ratio = i / segments;
      let r, g, b;
      if (isFront) {
        r = Math.round(18 + ratio * 42);
        g = Math.round(162 + ratio * 80);
        b = Math.round(62 + ratio * 42);
      } else {
        r = Math.round(10 + ratio * 26);
        g = Math.round(108 + ratio * 52);
        b = Math.round(38 + ratio * 30);
      }

      // Slightly thickened blade (from 5-12 up to 8-16px)
      const bladeW = Math.max(8, 16 - i * 0.55);

      // Subtle dark outline for pixel depth
      ctx.fillStyle = '#061a0c';
      ctx.fillRect(Math.round(currX - bladeW / 2 - 1), Math.round(currY - segHeight), Math.round(bladeW + 2), Math.round(segHeight + 1));

      // Main blade
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(Math.round(currX - bladeW / 2), Math.round(currY - segHeight), Math.round(bladeW), Math.round(segHeight + 1));

      // Center vein highlight
      ctx.fillStyle = `rgb(${r + 26}, ${g + 30}, ${b + 16})`;
      ctx.fillRect(Math.round(currX - 1), Math.round(currY - segHeight), 2, Math.round(segHeight + 1));

      // Leaf fronds extending outward (thickened to 5px height and 12-18px wide)
      if (i % 2 === 0 && i > 1 && i < segments - 1) {
        const dir = (i % 4 === 0) ? 1 : -1;
        const leafW = 13 + (segments - i) * 0.5;
        const leafH = 5;
        const leafX = Math.round(currX + (dir === 1 ? bladeW / 2 : -bladeW / 2 - leafW));
        const leafY = Math.round(currY - segHeight / 2 - leafH / 2);

        ctx.fillStyle = '#061a0c';
        ctx.fillRect(leafX - 1, leafY - 1, Math.round(leafW + 2), leafH + 2);

        ctx.fillStyle = `rgb(${r + 20}, ${g + 26}, ${b + 12})`;
        ctx.fillRect(leafX, leafY, Math.round(leafW), leafH);

        ctx.fillStyle = `rgb(${r + 38}, ${g + 44}, ${b + 20})`;
        ctx.fillRect(leafX, leafY, Math.round(leafW), 2);
      }

      currX = nextX;
      currY = nextY;
    }
    ctx.restore();
  }

  // Draw glossy pixel bubble (supporting tiny 2px micro-bubbles up to giant 38px spheres)
  function drawPixelBubble(ctx, x, y, radius, opacity = 0.85) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const r = Math.max(2, Math.round(radius));

    if (r <= 3) {
      // Tiny micro-bubble
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(Math.round(x - r), Math.round(y - r), r * 2, r * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(Math.round(x - r + 1), Math.round(y - r + 1), 1, 1);
      ctx.restore();
      return;
    }

    // Outer cyan/sky ring
    ctx.fillStyle = '#BAE6FD';
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r), (r - 1) * 2, r * 2);
    ctx.fillRect(Math.round(x - r), Math.round(y - r + 1), r * 2, (r - 1) * 2);

    // Inner translucent sphere body
    ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
    ctx.fillRect(Math.round(x - r + 2), Math.round(y - r + 2), (r - 2) * 2, (r - 2) * 2);

    // Primary bright specular glint on upper-left
    ctx.fillStyle = '#FFFFFF';
    const hlSize = Math.max(2, Math.floor(r * 0.45));
    ctx.fillRect(Math.round(x - Math.floor(r * 0.55)), Math.round(y - Math.floor(r * 0.55)), hlSize, hlSize);

    // Secondary lower reflection for medium-to-giant bubbles
    if (r >= 9) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      const secSize = Math.max(2, Math.floor(r * 0.22));
      ctx.fillRect(Math.round(x + Math.floor(r * 0.35)), Math.round(y + Math.floor(r * 0.35)), secSize, secSize);
    }

    ctx.restore();
  }

  return {
    init: initSprites,
    // Direct sprite lookup by product, color hex, or palette name
    getFrames: (productOrKey) => {
      if (!productOrKey) return cache['orange'];
      if (typeof productOrKey === 'string') {
        return cache[productOrKey] || cache['orange'];
      }
      // If product object passed, match by accentColor
      const color = (productOrKey.accentColor || '').toUpperCase();
      if (color.includes('FF6B') || color.includes('FF7A')) return cache['orange'];
      if (color.includes('38EF') || color.includes('10B9')) return cache['green'];
      if (color.includes('00F2') || color.includes('00D2') || color.includes('38BD')) return cache['cyan'];
      if (color.includes('FFE0') || color.includes('FBBF')) return cache['yellow'];
      if (color.includes('FF41') || color.includes('F43F')) return cache['red'];
      if (color.includes('9D4E') || color.includes('A855')) return cache['purple'];
      return cache['orange'];
    },
    getScenery: (key) => cache[key],
    drawPixelKelp,
    drawPixelBubble
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PixelSprites };
}

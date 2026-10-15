/**
 * WM LABS - Pixel Graphics Art & Sprite Generator
 * 
 * Provides procedural and matrix-based pixel art rendering for fish species,
 * environmental flora, rocks, shells, and underwater particle effects.
 */

const PixelSprites = (() => {
  // Offscreen canvas cache for blazing fast 60fps renders
  const cache = {};

  /**
   * Helper to parse pixel art matrix into an offscreen canvas.
   * `palette`: map of characters to hex/rgba strings (' ' or '.' = transparent)
   * `matrix`: array of equal-length strings
   */
  function createMatrixSprite(matrix, palette, pixelScale = 1) {
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

  // --- 1. CLOWNFISH SPRITES (3 animation frames for tail wag) ---
  const clownfishPalette = {
    'O': '#FF6B35', // Primary bright orange
    'o': '#D94D1A', // Dark orange shadow
    'W': '#FFFFFF', // Crisp white band
    'w': '#E0E6ED', // White shadow
    'K': '#1A1E24', // Black outline & fin accents
    'Y': '#FFB03B', // Highlight orange
    'E': '#0E1726', // Eye pupil
    'G': '#4FD1C5', // Eye sparkle
    'F': '#FFA552', // Fin membrane
    'f': '#C9551E', // Fin rib
  };

  const clownfishFrames = [
    // Frame 0: Tail straight
    [
      "............KKKK............",
      "..........KKOOOOKK..........",
      ".........KOOOYYOOOK.........",
      "........KOOGEEYYOOOK........",
      ".......KOOGEEEYYOOOOK.......",
      "......KOOYYOYYYYOOOOOK......",
      ".....KOOYYYWWWWYOOOOOK......",
      "....KOOYYYWWWwwKOOOOOK......",
      "...KOOYYYWWWwwwKKOOOOOOK....",
      "..KKOOYYYWWWwwwKKKOOOOOKK...",
      ".KFFKOYYWWWWwwwKKKOOOOOFFK..",
      "KFFFFKYYWWWWwwKKKOOOOOFFFFK.",
      ".KFFfKOYYWWWwwKKOOOOOOfffK..",
      "..KKOOOOOOOOOOKKOOOWWKOOK...",
      "...KOOOOOOOOOOKKOOWWWwK.....",
      "....KOOOOOOOOKKKOOWWwwK.....",
      ".....KOOOOOOKKKKOOWWWwK.....",
      "......KKKKKK..KKOOWWWwK.....",
      "...............KKOOWWwK.....",
      "................KKKKKK......"
    ],
    // Frame 1: Tail swung up
    [
      "............KKKK............",
      "..........KKOOOOKK...KKKK...",
      ".........KOOOYYOOOK.KOFFK...",
      "........KOOGEEYYOOOKKOFFFK..",
      ".......KOOGEEEYYOOOKOFFFFK..",
      "......KOOYYOYYYYOOOOOFFfK...",
      ".....KOOYYYWWWWYOOOOOFFK....",
      "....KOOYYYWWWwwKOOOOOOK.....",
      "...KOOYYYWWWwwwKKOOOOOOK....",
      "..KKOOYYYWWWwwwKKKOOOOOKK...",
      ".KFFKOYYWWWWwwwKKKOOOOOOKK..",
      "KFFFFKYYWWWWwwKKKOOOOOOOK...",
      ".KFFfKOYYWWWwwKKOOOOOOOK....",
      "..KKOOOOOOOOOOKKOOOWWKK.....",
      "...KOOOOOOOOOOKKOOWWWwK.....",
      "....KOOOOOOOOKKKOOWWwwK.....",
      ".....KOOOOOOKKKKOOWWWwK.....",
      "......KKKKKK..KKOOWWWwK.....",
      "...............KKOOWWwK.....",
      "................KKKKKK......"
    ],
    // Frame 2: Tail swung down
    [
      "............KKKK............",
      "..........KKOOOOKK..........",
      ".........KOOOYYOOOK.........",
      "........KOOGEEYYOOOK........",
      ".......KOOGEEEYYOOOOK.......",
      "......KOOYYOYYYYOOOOOK......",
      ".....KOOYYYWWWWYOOOOOK......",
      "....KOOYYYWWWwwKOOOOOK......",
      "...KOOYYYWWWwwwKKOOOOOOK....",
      "..KKOOYYYWWWwwwKKKOOOOOKK...",
      ".KFFKOYYWWWWwwwKKKOOOOOKK...",
      "KFFFFKYYWWWWwwKKKOOOOOOOK...",
      ".KFFfKOYYWWWwwKKOOOOOOOFFK..",
      "..KKOOOOOOOOOOKKOOOWWKOOFFFK",
      "...KOOOOOOOOOOKKOOWWWwKOFFFK",
      "....KOOOOOOOOKKKOOWWwwKKOFFK",
      ".....KOOOOOOKKKKOOWWWwKKKKK.",
      "......KKKKKK..KKOOWWWwK.....",
      "...............KKOOWWwK.....",
      "................KKKKKK......"
    ]
  ];

  // --- 2. NEON TETRA (Electric Blue & Ruby Red Glow) ---
  const neonPalette = {
    'B': '#00F2FE', // Neon Cyan / Turquoise glow
    'b': '#009FFD', // Deep Neon Blue
    'R': '#FF0844', // Hot Ruby Red
    'r': '#B5072F', // Deep Ruby
    'S': '#E2E8F0', // Silver Belly
    's': '#94A3B8', // Shadow Silver
    'K': '#0A1128', // Dark Outline
    'E': '#001020', // Pupil
    'G': '#A5F3FC', // Glint
    'F': '#38BDF8', // Translucent Fin
  };

  const neonFrames = [
    // Frame 0: straight
    [
      ".........KKKKKK.............",
      ".......KKBBBBBBKK...........",
      "......KBGBBBBBBBBKK.........",
      ".....KBGEBBBBBBBBBBKK.......",
      "....KBBBBBBBBBBBBBBBBKK.....",
      "...KBbBBBBBBBBBBBBBBBBBK....",
      "..KBbbBBBBBBBBBBbbbbbbbbKK..",
      ".KSSbbbbbbbbbbbbRRRRRRRRRKK.",
      "KSSSSSSsssssssRRRRRRRRRRRRKK",
      ".KSSSSSSSSsssRRRRRRRRRRRFFF.",
      "..KKSSSSSSssRRRRRRRRRRRFFFFK",
      "....KKKSSSSSRRRRRRRRRRFFFFK.",
      ".......KKKKKRRRRRRRRKKKK....",
      "............KKKKKKKK........"
    ],
    // Frame 1: tail flutter up
    [
      ".........KKKKKK.....KKKK....",
      ".......KKBBBBBBKK..KFFFFK...",
      "......KBGBBBBBBBBKK.KFFFK...",
      ".....KBGEBBBBBBBBBBKKKFK....",
      "....KBBBBBBBBBBBBBBBBKKK....",
      "...KBbBBBBBBBBBBBBBBBBBK....",
      "..KBbbBBBBBBBBBBbbbbbbbbKK..",
      ".KSSbbbbbbbbbbbbRRRRRRRRRKK.",
      "KSSSSSSsssssssRRRRRRRRRRRRKK",
      ".KSSSSSSSSsssRRRRRRRRRRKK...",
      "..KKSSSSSSssRRRRRRRRRKK.....",
      "....KKKSSSSSRRRRRRRKK.......",
      ".......KKKKKRRRRRRK.........",
      "............KKKKKK.........."
    ],
    // Frame 2: tail flutter down
    [
      ".........KKKKKK.............",
      ".......KKBBBBBBKK...........",
      "......KBGBBBBBBBBKK.........",
      ".....KBGEBBBBBBBBBBKK.......",
      "....KBBBBBBBBBBBBBBBBKK.....",
      "...KBbBBBBBBBBBBBBBBBBBK....",
      "..KBbbBBBBBBBBBBbbbbbbbbKK..",
      ".KSSbbbbbbbbbbbbRRRRRRRRRKK.",
      "KSSSSSSsssssssRRRRRRRRRRRRKK",
      ".KSSSSSSSSsssRRRRRRRRRRRRKKK",
      "..KKSSSSSSssRRRRRRRRRRRFFFFK",
      "....KKKSSSSSRRRRRRRRRRFFFFK.",
      ".......KKKKKRRRRRRRRKFFFFK..",
      "............KKKKKKKK.KKK...."
    ]
  ];

  // --- 3. ANGELFISH (Tall, Majestic, Zebra Emerald/Silver) ---
  const angelPalette = {
    'S': '#E2E8F0', // Silver Base
    's': '#94A3B8', // Shadow Silver
    'C': '#38EF7D', // Emerald Accent
    'c': '#11998E', // Deep Emerald
    'K': '#0F172A', // Dark Zebra Stripe / Outline
    'Y': '#FBBF24', // Yellow highlight
    'E': '#020617', // Pupil
    'G': '#F8FAFC', // Eye sparkle
    'F': '#A7F3D0', // Translucent Emerald Fin
  };

  const angelFrames = [
    // Frame 0:
    [
      ".............KK.............",
      "............KFFK............",
      "...........KFFFFK...........",
      "..........KFFFFFK...........",
      ".........KFFFFFFK...........",
      "........KFFFFFFFKK..........",
      ".......KKKFFFFFFKK..........",
      "......KKSSKKFFKKKK..........",
      ".....KKSSSKKKKSSSSKK........",
      "....KKSGEEKKKKSSSSSKK.......",
      "...KKSSGEEKKKKSSSSSSSKK.....",
      "..KKSSSSSSKKKKKKSSSSSSSKK...",
      ".KKSSSSCCSSKKKCCCCSSSSSKK...",
      "KKSSSSSCCCCSKKCCCCSSSSSSKK..",
      ".KKSSSSSCCCCSKCCCCSSSSSSKFK.",
      "..KKSSSSSCCCKKKCCCSSSSSFFFFK",
      "...KKSSSSSCSSKKKCSSSSSSFFFFK",
      "....KKSSSSSSSSKKKSSSSSFFFFK.",
      ".....KKKSSSSSSKKKSSSSKKKK...",
      ".......KKSSSSSKKKSSSKK......",
      "........KKKSSSKKKSSKK.......",
      "..........KKKKKKKKK.........",
      "...........KFFKK............",
      "..........KFFFK.............",
      ".........KFFFFK.............",
      "........KFFFFK..............",
      ".......KKFFFK...............",
      "......KKKKKK................"
    ],
    // Frame 1: tail flex
    [
      ".............KK.............",
      "............KFFK............",
      "...........KFFFFK...........",
      "..........KFFFFFK...........",
      ".........KFFFFFFK...........",
      "........KFFFFFFFKK..........",
      ".......KKKFFFFFFKK..........",
      "......KKSSKKFFKKKK..........",
      ".....KKSSSKKKKSSSSKK...KKK..",
      "....KKSGEEKKKKSSSSSKK.KFFFK.",
      "...KKSSGEEKKKKSSSSSSSKKFFFK.",
      "..KKSSSSSSKKKKKKSSSSSSKFFK..",
      ".KKSSSSCCSSKKKCCCCSSSSSKK...",
      "KKSSSSSCCCCSKKCCCCSSSSSSKK..",
      ".KKSSSSSCCCCSKCCCCSSSSSSKK..",
      "..KKSSSSSCCCKKKCCCSSSSSFFK..",
      "...KKSSSSSCSSKKKCSSSSSSFFFK.",
      "....KKSSSSSSSSKKKSSSSSFFFFK.",
      ".....KKKSSSSSSKKKSSSSKKKK...",
      ".......KKSSSSSKKKSSSKK......",
      "........KKKSSSKKKSSKK.......",
      "..........KKKKKKKKK.........",
      "...........KFFKK............",
      "..........KFFFK.............",
      ".........KFFFFK.............",
      "........KFFFFK..............",
      ".......KKFFFK...............",
      "......KKKKKK................"
    ]
  ];

  // --- 4. PUFFERFISH (Round, Spiky, Golden-Teal Cute Cyber) ---
  const pufferPalette = {
    'Y': '#FFE066', // Golden Yellow
    'y': '#F59E0B', // Amber Shadow
    'T': '#14B8A6', // Teal Spot
    't': '#0D9488', // Dark Teal
    'W': '#FFFBEB', // Belly Cream
    'w': '#FEF3C7', // Belly Shadow
    'K': '#1C1917', // Dark Outline
    'E': '#0C0A09', // Eye Pupil
    'G': '#FFFFFF', // Glint
    'P': '#F43F5E', // Cute Pink Cheek
    'F': '#FDE68A', // Flutter Fin
  };

  const pufferFrames = [
    // Frame 0: Normal
    [
      ".........KKKKKKK............",
      ".......KKTYYYYYYKK..........",
      "......KTTYYYYTTYYYKK........",
      ".....KTYYYTTYYYYYYYYKK......",
      "....KYYGEEYYYYYTTTYYYKK.....",
      "...KYYYGEEYYYYYTTTYYYYKK....",
      "..KTYYYYYYYYYYYYTYYYYYYKK...",
      ".KTTYYYPPPPYYYYYYYYYYYYYK...",
      "KTYYYYYPPPPWWWWWWWWWWYYYKK..",
      "KYYYYYYYWWWWWWWWWWWWWWYYKKFK",
      "KYYYYYYWWWWWWWWWWWWWWWYKFFFK",
      "KTYYYTTWWWWWWWWWWWWWWWYKKFFK",
      ".KTTTTYYWWWWWWWWWWWWWYYK.KK.",
      "..KYYYYYYWWWWWWWWWWYYKK.....",
      "...KKTTYYYYWWWWWWYYKK.......",
      ".....KKKYYYYYYYYKKK.........",
      "........KKKKKKKK............"
    ],
    // Frame 1: Fin wave
    [
      ".........KKKKKKK............",
      ".......KKTYYYYYYKK..........",
      "......KTTYYYYTTYYYKK...KK...",
      ".....KTYYYTTYYYYYYYYKKKFFK..",
      "....KYYGEEYYYYYTTTYYYKFFFK..",
      "...KYYYGEEYYYYYTTTYYYKFFK...",
      "..KTYYYYYYYYYYYYTYYYYYKK....",
      ".KTTYYYPPPPYYYYYYYYYYYYYK...",
      "KTYYYYYPPPPWWWWWWWWWWYYYKK..",
      "KYYYYYYYWWWWWWWWWWWWWWYYKK..",
      "KYYYYYYWWWWWWWWWWWWWWWYK....",
      "KTYYYTTWWWWWWWWWWWWWWWYK....",
      ".KTTTTYYWWWWWWWWWWWWWYYK....",
      "..KYYYYYYWWWWWWWWWWYYKK.....",
      "...KKTTYYYYWWWWWWYYKK.......",
      ".....KKKYYYYYYYYKKK.........",
      "........KKKKKKKK............"
    ]
  ];

  // --- 5. GOLDEN KOI (Ruby & Gold Imperial Scales) ---
  const koiPalette = {
    'W': '#F8FAFC', // Pure Pearl White
    'w': '#CBD5E1', // Scale Shading
    'R': '#EF4444', // Imperial Red Kohaku Spot
    'r': '#B91C1C', // Dark Crimson
    'O': '#F97316', // Vibrant Gold
    'o': '#C2410C', // Deep Gold
    'K': '#0F172A', // Outline
    'E': '#020617', // Eye
    'G': '#FFFFFF', // Glint
    'F': '#FECDD3', // Silk Fin
  };

  const koiFrames = [
    // Frame 0:
    [
      "...........KKKKKK...........",
      ".........KKWWRRRRKK.........",
      "........KWWWRRRRRRRKK.......",
      ".......KWWGEERRRRRRRRKK.....",
      "......KWWWGEERRRRRROOOKK....",
      ".....KWWWWWRRRRRROOOOOOKK...",
      "....KWWWWWWWRRRROOOOOOOOK...",
      "...KWWWWWWWWWROOOOOOOOOOOK..",
      "..KWWWWWWWWWWROOOOOOOOOOOKK.",
      ".KFFWWWWWWWWWWROOOOOOOOOOFK.",
      "KFFFFWWWWWWWWWWRRROOOOOOFFFK",
      ".KFFfWWWWWWWWWWWRRROOOOOfffK",
      "..KWWWWWWWWWWWWWWRRROOOKKK..",
      "...KWWWWWWWWWWWWWRRROOK.....",
      "....KKWWWWWWWWWWWRRROK......",
      "......KKKWWWWWWWWRRKK.......",
      ".........KKKKKKKKKK........."
    ],
    // Frame 1:
    [
      "...........KKKKKK....KKKK...",
      ".........KKWWRRRRKK.KFFFK...",
      "........KWWWRRRRRRRKKFFFK...",
      ".......KWWGEERRRRRRRRKFK....",
      "......KWWWGEERRRRRROOOKK....",
      ".....KWWWWWRRRRRROOOOOOKK...",
      "....KWWWWWWWRRRROOOOOOOOK...",
      "...KWWWWWWWWWROOOOOOOOOOOK..",
      "..KWWWWWWWWWWROOOOOOOOOOOKK.",
      ".KFFWWWWWWWWWWROOOOOOOOOOK..",
      "KFFFFWWWWWWWWWWRRROOOOOOOK..",
      ".KFFfWWWWWWWWWWWRRROOOOOOK..",
      "..KWWWWWWWWWWWWWWRRROOOKKK..",
      "...KWWWWWWWWWWWWWRRROOK.....",
      "....KKWWWWWWWWWWWRRROK......",
      "......KKKWWWWWWWWRRKK.......",
      ".........KKKKKKKKKK........."
    ]
  ];

  // --- 6. CYBER GUPPY / BETTA (Violet, Magenta & Flowing Tails) ---
  const guppyPalette = {
    'V': '#A855F7', // Violet
    'v': '#7E22CE', // Deep Violet
    'M': '#EC4899', // Magenta
    'm': '#BE185D', // Dark Magenta
    'C': '#38BDF8', // Cyan Highlight
    'K': '#090514', // Outline
    'E': '#030712', // Eye
    'G': '#FDF4FF', // Sparkle
    'F': '#D946EF', // Majestic Fan Fin
    'f': '#9333EA', // Fin Rib
  };

  const guppyFrames = [
    // Frame 0:
    [
      ".........KKKK...............",
      ".......KKVVVVKK.....KKKKK...",
      "......KVVGGVVVVKK.KKFFFFFK..",
      ".....KVVGGEEVVVVVKKFFFFFFFKK",
      "....KVVVVEEVVVVVVVFFFFFFfffK",
      "...KVVVMVVVVVVVVVVFFFFFFfffK",
      "..KVVVMMMVVVVVVVVVFFFFFFFFFK",
      ".KFFVMMMMMMVVVVVVVFFFFFFFFK.",
      "KFFFFMMMMMMMMVVVVVVFFFFFFK..",
      ".KFFFMMMMMMMMMMVVVFFFFFKK...",
      "..KFFfVMMMMMMMMMMVFFFKK.....",
      "...KKVVVVMMMMMMMMVKKK.......",
      ".....KKKVVVVVVVKKK..........",
      "........KKKKKKKK............"
    ],
    // Frame 1:
    [
      ".........KKKK...............",
      ".......KKVVVVKK.............",
      "......KVVGGVVVVKK...KKKKK...",
      ".....KVVGGEEVVVVVKKKFFFFFK..",
      "....KVVVVEEVVVVVVVVFFFFFFFKK",
      "...KVVVMVVVVVVVVVVVFFFFFfffK",
      "..KVVVMMMVVVVVVVVVFFFFFFfffK",
      ".KFFVMMMMMMVVVVVVVFFFFFFFFFK",
      "KFFFFMMMMMMMMVVVVVVFFFFFFFK.",
      ".KFFFMMMMMMMMMMVVVFFFFFKKK..",
      "..KFFfVMMMMMMMMMMVFFFKK.....",
      "...KKVVVVMMMMMMMMVKKK.......",
      ".....KKKVVVVVVVKKK..........",
      "........KKKKKKKK............"
    ]
  ];

  // Compile all sprite matrices once
  function initSprites() {
    cache['clownfish'] = clownfishFrames.map(m => createMatrixSprite(m, clownfishPalette, 2));
    cache['neontetra'] = neonFrames.map(m => createMatrixSprite(m, neonPalette, 2));
    cache['angelfish'] = angelFrames.map(m => createMatrixSprite(m, angelPalette, 2));
    cache['pufferfish'] = pufferFrames.map(m => createMatrixSprite(m, pufferPalette, 2));
    cache['koi'] = koiFrames.map(m => createMatrixSprite(m, koiPalette, 2));
    cache['guppy'] = guppyFrames.map(m => createMatrixSprite(m, guppyPalette, 2));

    // Scenery Elements
    cache['chest'] = createChestSprite();
    cache['coral_pink'] = createCoralSprite('#F43F5E', '#BE123C', '#FDA4AF');
    cache['coral_purple'] = createCoralSprite('#A855F7', '#7E22CE', '#E9D5FF');
    cache['shell'] = createShellSprite();
    cache['starfish'] = createStarfishSprite();
  }

  function createChestSprite() {
    const palette = {
      'W': '#78350F', // Wood dark
      'w': '#B45309', // Wood light
      'G': '#FBBF24', // Gold trim
      'g': '#D97706', // Dark gold
      'K': '#1C1917', // Outline
      'L': '#38BDF8', // Cyan treasure glow inside
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
    return createMatrixSprite(m, palette, 2);
  }

  function createCoralSprite(c1, c2, c3) {
    const palette = { 'A': c1, 'B': c2, 'C': c3, 'K': '#0F172A' };
    const m = [
      "....KK...KK.....KK..........",
      "...KCCK.KCCK...KCCK.........",
      "...KCAK.KCAK...KCAK..KK.....",
      "...KCAKKKCAK...KCAK.KCCK....",
      "....KCAACAAKK..KCAKKKCAK....",
      "....KCAAACAAK..KCAACAAK.....",
      ".....KBAAACAKKKKCAAABK......",
      ".....KBAAAAACAAACAAABK......",
      "......KBBAAAAAAAAABBK.......",
      "......KBBBAAAAAAAABBK.......",
      ".......KBBBBAAAABBBK........",
      "........KKBBBBBBKK..........",
      "..........KKKKKK............"
    ];
    return createMatrixSprite(m, palette, 2);
  }

  function createShellSprite() {
    const palette = {
      'W': '#FFFBEB',
      'w': '#FDE68A',
      'Y': '#F59E0B',
      'K': '#451A03'
    };
    const m = [
      "......KKKKKK......",
      "....KKWWWWWWKK....",
      "...KWWwWwwWwWWK...",
      "..KWWwWWwwWWwWWK..",
      ".KWWwWWYwwYWWwWWK.",
      ".KWWwWWYwwYWWwWWK.",
      "..KKWWwYwwYwWWKK..",
      "....KKKKYYYYKK....",
      "......KKKKKK......"
    ];
    return createMatrixSprite(m, palette, 2);
  }

  function createStarfishSprite() {
    const palette = {
      'O': '#FB923C',
      'o': '#EA580C',
      'Y': '#FEF08A',
      'K': '#431407'
    };
    const m = [
      ".......KK.......",
      "......KOOK......",
      "......KYYK......",
      ".....KYYYYK.....",
      "..KKKKOYYOKKKK..",
      ".KOYYYYYYYYYYOK.",
      "..KKOYYYYYYOKK..",
      "....KOYYYYOK....",
      "...KOOYYYYOOK...",
      "..KOOKK..KKOOK..",
      "..KKK......KKK.."
    ];
    return createMatrixSprite(m, palette, 2);
  }

  // Draw seaweed dynamically using swaying pixel joints
  function drawPixelKelp(ctx, startX, startY, height, time, swayOffset = 0) {
    const segments = Math.floor(height / 10);
    const segHeight = height / segments;
    let currX = startX;
    let currY = startY;

    ctx.save();
    for (let i = 0; i < segments; i++) {
      const sway = Math.sin(time * 1.5 + i * 0.4 + swayOffset) * (i * 2.2);
      const nextX = startX + sway;
      const nextY = currY - segHeight;

      // Color gradient from deep sea kelp to bright tip
      const ratio = i / segments;
      const r = Math.round(16 + ratio * 34);
      const g = Math.round(130 + ratio * 85);
      const b = Math.round(70 + ratio * 45);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      // Draw pixelated blade
      const bladeW = Math.max(4, 9 - i * 0.7);
      ctx.fillRect(Math.round(currX - bladeW / 2), Math.round(currY - segHeight), Math.round(bladeW), Math.round(segHeight + 1));

      // Little leaf node every other segment
      if (i % 2 === 0 && i < segments - 1) {
        ctx.fillStyle = `rgb(${r + 20}, ${g + 30}, ${b + 10})`;
        const dir = (i % 4 === 0) ? 1 : -1;
        ctx.fillRect(Math.round(currX + dir * bladeW), Math.round(currY - segHeight / 2), 6, 4);
      }

      currX = nextX;
      currY = nextY;
    }
    ctx.restore();
  }

  // Draw rising pixel bubble
  function drawPixelBubble(ctx, x, y, radius, opacity = 0.8) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const r = Math.max(2, Math.round(radius));

    // Outer ring
    ctx.fillStyle = '#BAE6FD';
    ctx.fillRect(Math.round(x - r), Math.round(y - r + 1), r * 2, r * 2 - 2);
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r), r * 2 - 2, r * 2);

    // Inner translucent core
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r + 1), r * 2 - 2, r * 2 - 2);

    // Specular highlight dot
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(Math.round(x - Math.floor(r / 2)), Math.round(y - Math.floor(r / 2)), Math.max(1, Math.round(r * 0.5)), Math.max(1, Math.round(r * 0.5)));

    ctx.restore();
  }

  // Draw pixel fish flake food
  function drawPixelFlake(ctx, x, y, frame) {
    ctx.save();
    ctx.fillStyle = (frame % 2 === 0) ? '#F59E0B' : '#EF4444';
    ctx.fillRect(Math.round(x), Math.round(y), 4, 3);
    ctx.fillStyle = '#FDE68A';
    ctx.fillRect(Math.round(x + 1), Math.round(y + 1), 2, 2);
    ctx.restore();
  }

  return {
    init: initSprites,
    getFrames: (species) => cache[species] || cache['clownfish'],
    getScenery: (key) => cache[key],
    drawPixelKelp,
    drawPixelBubble,
    drawPixelFlake
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PixelSprites };
}

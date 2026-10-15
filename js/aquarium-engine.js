/**
 * WM LABS - Aquarium Simulation Engine
 * 
 * 60FPS HTML5 Canvas physics engine.
 * Features:
 * - Authentic pixel goldfish/koi gliding smoothly (static sprite, no wagging required)
 * - Diverse scenery matching launchpad preview: slate rock mounds, tube sponges, pink anemone, staghorns
 * - Varied-height swaying kelp forest (short, medium, and tall stalks)
 * - Large ambient bubbles and clean hover inspection badge underneath each fish
 */

class AquariumEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = Object.assign({
      onFishClick: null,
      onFishHover: null,
    }, options);

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = window.devicePixelRatio || 1;

    // Simulation entities
    this.fishList = [];
    this.bubbles = [];
    this.bgBubbles = [];
    this.ambientMotes = [];
    this.kelpStalks = [];
    this.sceneryProps = [];

    // Interaction state
    this.mouse = { x: -1000, y: -1000, inside: false };
    this.hoveredFish = null;
    this.selectedFish = null;

    // Time
    this.lastTime = performance.now();
    this.timeSeconds = 0;

    // Initialize
    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Sprite initialization
    PixelSprites.init();

    // Setup input listeners
    this.setupEvents();

    // Populate environment
    this.setupEnvironment();

    // Start render loop
    requestAnimationFrame((t) => this.loop(t));
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.ctx.imageSmoothingEnabled = false;

    this.setupEnvironment();
  }

  setupEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handlePointerMove = (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.inside = true;
      this.checkFishHover();
    };

    this.canvas.addEventListener('mousemove', handlePointerMove);
    this.canvas.addEventListener('touchmove', handlePointerMove, { passive: true });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.inside = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      if (this.hoveredFish) {
        this.hoveredFish.isHovered = false;
        this.hoveredFish = null;
        this.canvas.style.cursor = 'default';
        if (this.options.onFishHover) this.options.onFishHover(null);
      }
    });

    const handlePointerClick = (e) => {
      const pos = getPos(e);
      const clickedFish = this.findFishAt(pos.x, pos.y);

      if (clickedFish) {
        clickedFish.celebrate();
        this.selectedFish = clickedFish;
        if (this.options.onFishClick) {
          this.options.onFishClick(clickedFish.product, clickedFish);
        }
      }
    };

    this.canvas.addEventListener('click', handlePointerClick);
  }

  setupEnvironment() {
    // 1. Reduced number of seaweed stalks (7 prominent stalks framing sides, leaving swimming space)
    this.kelpStalks = [
      // Left cluster (framing left edge)
      { x: this.width * 0.04, baseY: this.height - 50, height: 440, swayOffset: 0.2, isFront: false },
      { x: this.width * 0.09, baseY: this.height - 50, height: 360, swayOffset: 1.4, isFront: true },
      { x: this.width * 0.16, baseY: this.height - 50, height: 280, swayOffset: 2.6, isFront: false },

      // Mid-ground subtle stalk
      { x: this.width * 0.44, baseY: this.height - 50, height: 180, swayOffset: 3.1, isFront: false },

      // Right cluster (framing right edge)
      { x: this.width * 0.77, baseY: this.height - 50, height: 240, swayOffset: 0.9, isFront: false },
      { x: this.width * 0.88, baseY: this.height - 50, height: 380, swayOffset: 2.1, isFront: true },
      { x: this.width * 0.95, baseY: this.height - 50, height: 460, swayOffset: 3.7, isFront: false }
    ];

    // 2. Rich Tiered Coral Garden with varied elevation nestled across the higher Sandbed
    this.sceneryProps = [
      // Left Dune & Foreshore
      { type: 'rock_mound', x: this.width * 0.03, y: this.height - 145 },
      { type: 'tube_sponges', x: this.width * 0.07, y: this.height - 175 },
      { type: 'pink_anemone', x: this.width * 0.15, y: this.height - 105 },
      { type: 'fire_coral', x: this.width * 0.22, y: this.height - 145 },

      // Center-Left Sand Valley & Crest
      { type: 'moss_mound', x: this.width * 0.28, y: this.height - 85 },
      { type: 'brain_coral', x: this.width * 0.35, y: this.height - 118 },
      { type: 'cyan_staghorn', x: this.width * 0.42, y: this.height - 155 },

      // Center Basin & High Reef Ridge
      { type: 'bubble_coral', x: this.width * 0.49, y: this.height - 100 },
      { type: 'red_sea_fan', x: this.width * 0.58, y: this.height - 172 },
      { type: 'moss_mound', x: this.width * 0.64, y: this.height - 90 },

      // Right Tiered Dune & Elevated Spire
      { type: 'rock_mound', x: this.width * 0.72, y: this.height - 138 },
      { type: 'purple_tubes', x: this.width * 0.79, y: this.height - 178 },
      { type: 'fire_coral', x: this.width * 0.85, y: this.height - 120 },
      { type: 'cyan_staghorn', x: this.width * 0.92, y: this.height - 158 }
    ];

    // 3. Ambient bubbles, with varied sizes (including delicate small bubbles and giant ones)
    const bubbleSizes = [2.5, 3.0, 4.0, 5.0, 8.5, 14.0, 20.0, 26.0, 32.0, 38.0];
    this.bgBubbles = bubbleSizes.map((radius, idx) => ({
      x: (idx / bubbleSizes.length) * this.width + (Math.random() * 40 - 20),
      y: Math.random() * this.height,
      radius,
      vy: -0.30 - (radius < 8 ? 0.22 : 0.10) - Math.random() * 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.2 + Math.random() * 1.5,
      opacity: radius < 6 ? 0.80 : radius > 25 ? 0.60 : 0.45
    }));

    // 4. Ambient light motes
    this.ambientMotes = [];
    for (let i = 0; i < 40; i++) {
      this.ambientMotes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.2,
        size: Math.random() > 0.6 ? 2 : 1,
        alpha: 0.15 + Math.random() * 0.4
      });
    }
  }

  loadProducts(products) {
    this.fishList = [];
    products.forEach((prod, index) => {
      const x = 120 + (index % 3) * (this.width * 0.28) + Math.random() * 40;
      const y = 140 + Math.floor(index / 3) * (this.height * 0.30) + Math.random() * 40;
      const fish = new FishEntity(prod, x, y, this);
      this.fishList.push(fish);
    });
  }

  findFishAt(x, y) {
    for (let i = this.fishList.length - 1; i >= 0; i--) {
      const f = this.fishList[i];
      if (f.containsPoint(x, y)) {
        return f;
      }
    }
    return null;
  }

  checkFishHover() {
    const f = this.findFishAt(this.mouse.x, this.mouse.y);
    if (f !== this.hoveredFish) {
      if (this.hoveredFish) {
        this.hoveredFish.isHovered = false;
      }
      this.hoveredFish = f;
      if (this.hoveredFish) {
        this.hoveredFish.isHovered = true;
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
      if (this.options.onFishHover) {
        this.options.onFishHover(this.hoveredFish ? this.hoveredFish.product : null);
      }
    }
  }

  spawnBubble(x, y, radius = 4, riseSpeed = 1.3) {
    this.bubbles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -riseSpeed - Math.random() * 0.6,
      radius,
      wobble: Math.random() * Math.PI * 2,
      opacity: 0.75 + Math.random() * 0.25
    });
  }

  focusProduct(productId) {
    const target = this.fishList.find(f => f.product.id === productId);
    if (target) {
      target.celebrate();
      this.selectedFish = target;
      if (this.options.onFishClick) {
        this.options.onFishClick(target.product, target);
      }
    }
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.timeSeconds += dt;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Background bubbles
    this.bgBubbles.forEach(b => {
      b.wobble += dt * b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.6;
      b.y += b.vy;
      if (b.y < -35) {
        b.y = this.height + 25;
        b.x = Math.random() * this.width;
      }
    });

    // 2. Foreground bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.wobble += dt * 4;
      b.x += Math.sin(b.wobble) * 0.5 + b.vx;
      b.y += b.vy;
      if (b.y < 55) {
        this.bubbles.splice(i, 1);
      }
    }

    // 3. Ambient motes
    this.ambientMotes.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < 40) m.y = this.height - 20;
      if (m.x < 0) m.x = this.width;
      if (m.x > this.width) m.x = 0;
    });

    // 4. Fish gliding
    this.fishList.forEach(fish => fish.update(dt, this));
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Water Background
    this.renderWaterBackground();

    // 2. Sunlight Caustics Rays
    this.renderCaustics();

    // 3. Large Background Bubbles
    this.bgBubbles.forEach(b => {
      PixelSprites.drawPixelBubble(ctx, b.x, b.y, b.radius, b.opacity);
    });

    // 4. Ambient Motes
    this.renderAmbientMotes();

    // 5. Background Kelp (darker layer)
    this.kelpStalks.filter(k => !k.isFront).forEach(k => {
      PixelSprites.drawPixelKelp(ctx, k.x, k.baseY, k.height, this.timeSeconds, k.swayOffset, false);
    });

    // 6. Sandy Bottom Substrate
    this.renderSeaFloor();

    // 7. Scenery Rocks & Tiered Corals (Layered, Staggered)
    this.sceneryProps.forEach(prop => {
      const sprite = PixelSprites.getScenery(prop.type);
      if (sprite) {
        ctx.drawImage(sprite, Math.round(prop.x), Math.round(prop.y));
      }
    });

    // 8. Foreground Kelp (vibrant green layer)
    this.kelpStalks.filter(k => k.isFront).forEach(k => {
      PixelSprites.drawPixelKelp(ctx, k.x, k.baseY, k.height, this.timeSeconds, k.swayOffset, true);
    });

    // 9. Fish Entities (Gliding smoothly, static authentic pixel art)
    this.fishList.forEach(fish => fish.render(ctx));

    // 10. Foreground Bubbles
    this.bubbles.forEach(b => {
      PixelSprites.drawPixelBubble(ctx, b.x, b.y, b.radius, b.opacity);
    });

    // 11. Aquarium Rim & Glass Tank Outline
    this.renderAquariumRim();
  }

  renderWaterBackground() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#1c78f2');
    grad.addColorStop(0.18, '#1056bd');
    grad.addColorStop(0.48, '#083e91');
    grad.addColorStop(0.82, '#052a6b');
    grad.addColorStop(1, '#031c47');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  renderCaustics() {
    const ctx = this.ctx;
    ctx.save();
    const rayCount = 7;
    const t = this.timeSeconds * 0.6;

    for (let i = 0; i < rayCount; i++) {
      const angle = 0.12 * Math.sin(t + i * 1.3);
      const startX = (i / rayCount) * this.width + Math.sin(t * 0.8 + i) * 70;
      const widthTop = 45 + Math.sin(t + i) * 22;
      const widthBottom = 140 + Math.cos(t * 0.7 + i) * 45;

      const grad = ctx.createLinearGradient(0, 0, 0, this.height * 0.85);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      grad.addColorStop(0.4, 'rgba(186, 230, 253, 0.07)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX + widthTop, 0);
      ctx.lineTo(startX + widthBottom + angle * 300, this.height);
      ctx.lineTo(startX - 20 + angle * 300, this.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  renderAmbientMotes() {
    const ctx = this.ctx;
    ctx.save();
    this.ambientMotes.forEach(m => {
      ctx.fillStyle = 'rgba(255, 255, 255, ' + m.alpha + ')';
      ctx.fillRect(Math.round(m.x), Math.round(m.y), m.size, m.size);
    });
    ctx.restore();
  }

  renderSeaFloor() {
    const ctx = this.ctx;
    ctx.save();

    // Much higher, prominent layered sandbed (~135px to 165px from bottom)
    const sandTop = this.height - 145;
    const sandGrad = ctx.createLinearGradient(0, sandTop - 35, 0, this.height);
    sandGrad.addColorStop(0, '#f59e0b');
    sandGrad.addColorStop(0.15, '#d97706');
    sandGrad.addColorStop(0.40, '#b45309');
    sandGrad.addColorStop(0.75, '#92400e');
    sandGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.moveTo(0, sandTop);

    const step = 35;
    for (let x = 0; x <= this.width + step; x += step) {
      const duneY = sandTop + Math.sin(x * 0.010 + 1.2) * 18 + Math.cos(x * 0.022) * 10;
      ctx.lineTo(x, duneY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();

    // Sand dune crest highlight
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Golden sand & gravel textured flecks
    const fleckCount = Math.floor(this.width / 14);
    for (let i = 0; i < fleckCount; i++) {
      const fx = (i / fleckCount) * this.width + ((i * 37) % 24);
      const fy = (sandTop + 18) + ((i * 19) % (this.height - sandTop - 24));
      ctx.fillStyle = (i % 3 === 0) ? '#fef08a' : (i % 3 === 1) ? '#fbbf24' : '#d97706';
      ctx.fillRect(Math.round(fx), Math.round(fy), 2, 2);
    }

    ctx.restore();
  }

  renderAquariumRim() {
    const ctx = this.ctx;
    ctx.save();

    const waterGrad = ctx.createLinearGradient(0, 0, this.width, 0);
    waterGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    waterGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
    waterGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, this.width, 3);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(0, 0, 4, this.height);
    ctx.fillRect(this.width - 4, 0, 4, this.height);

    ctx.restore();
  }
}

/**
 * FishEntity represents an autonomous product fish.
 * Authentic goldfish/koi proportions matching the launch preview.
 * Glides smoothly through water (tail does not move).
 */
class FishEntity {
  constructor(product, x, y, engine) {
    this.product = product;
    this.engine = engine;

    this.x = x;
    this.y = y;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.5);
    this.vy = (Math.random() - 0.5) * 0.4;
    this.facing = this.vx >= 0 ? 1 : -1;

    this.targetX = this.x;
    this.targetY = this.y;
    this.pickNewWaypoint();
    this.waypointTimer = 3 + Math.random() * 5;

    // Sprite is static (no tail wagging animation needed)
    this.frames = PixelSprites.getFrames(product);
    this.sprite = this.frames[0];

    this.isHovered = false;
    this.spinAngle = 0;
    this.isSpinning = false;

    // Scale & Hit testing dimensions
    this.w = this.sprite ? this.sprite.width : 90;
    this.h = this.sprite ? this.sprite.height : 56;

    this.bubbleTimer = 2 + Math.random() * 5;
  }

  pickNewWaypoint() {
    const pad = 140;
    this.targetX = pad + Math.random() * (this.engine.width - pad * 2);
    this.targetY = 120 + Math.random() * (this.engine.height - 330);
    this.waypointTimer = 4 + Math.random() * 6;
  }

  celebrate() {
    this.isSpinning = true;
    this.spinAngle = 0;
    for (let i = 0; i < 7; i++) {
      this.engine.spawnBubble(this.x + (Math.random() * 24 - 12), this.y + (Math.random() * 12 - 6), 3 + Math.random() * 3, 2.2);
    }
  }

  containsPoint(px, py) {
    const hitW = Math.max(this.w * 1.15, 95);
    const hitH = Math.max(this.h * 1.25, 60);
    return (
      px >= this.x - hitW / 2 &&
      px <= this.x + hitW / 2 &&
      py >= this.y - hitH / 2 &&
      py <= this.y + hitH / 2
    );
  }

  update(dt, engine) {
    if (this.isSpinning) {
      this.spinAngle += dt * 14;
      if (this.spinAngle >= Math.PI * 2) {
        this.spinAngle = 0;
        this.isSpinning = false;
      }
    }

    // Gentle bubbles emitted from mouth (head on right when facing = 1)
    this.bubbleTimer -= dt;
    if (this.bubbleTimer <= 0) {
      const mouthX = this.x + (this.facing === 1 ? this.w * 0.44 : -this.w * 0.44);
      const mouthY = this.y - 2;
      engine.spawnBubble(mouthX, mouthY, 2.5 + Math.random() * 2.5, 1.3);
      this.bubbleTimer = 4 + Math.random() * 7;
    }

    // Subtle cursor curiosity
    if (engine.mouse.inside && !this.isHovered) {
      const mouseDist = Math.hypot(engine.mouse.x - this.x, engine.mouse.y - this.y);
      if (mouseDist < 160) {
        this.targetX = engine.mouse.x;
        this.targetY = engine.mouse.y;
      }
    }

    // Fish-to-fish proximity detection & collision avoidance (turn away before overlapping)
    let repelVx = 0;
    let repelVy = 0;
    const personalSpace = 160; // Safe distance between fish centers

    for (const other of engine.fishList) {
      if (other === this) continue;
      const fdx = this.x - other.x;
      const fdy = this.y - other.y;
      const fdist = Math.hypot(fdx, fdy);

      if (fdist < personalSpace && fdist > 0.1) {
        // Force increases strongly as fish get closer
        const factor = (personalSpace - fdist) / personalSpace; // 0 to 1
        const nx = fdx / fdist;
        const ny = fdy / fdist;

        repelVx += nx * factor * 2.4;
        repelVy += ny * factor * 1.8;

        // If on direct collision course, steer waypoint away and reverse target direction
        if (fdist < 110) {
          this.pickNewWaypoint();
          if (Math.sign(this.vx) === Math.sign(other.vx) || Math.abs(fdx) < 80) {
            this.targetX = this.x + (fdx >= 0 ? 200 : -200);
          }
        }
      }
    }

    this.waypointTimer -= dt;
    if (this.waypointTimer <= 0) {
      this.pickNewWaypoint();
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distToTarget = Math.hypot(dx, dy);

    const speed = this.isHovered ? 0.2 : 0.95;
    if (distToTarget > 12) {
      const targetVx = (dx / distToTarget) * speed;
      const targetVy = (dy / distToTarget) * (speed * 0.6);

      this.vx += (targetVx - this.vx) * (dt * 1.5) + repelVx * (dt * 2.5);
      this.vy += (targetVy - this.vy) * (dt * 1.5) + repelVy * (dt * 2.5);
    } else {
      this.vx += repelVx * (dt * 2.5);
      this.vy += repelVy * (dt * 2.5);
    }

    // Clamp maximum velocity for natural, fluid gliding
    const maxSpeed = this.isHovered ? 0.35 : 1.35;
    const currentSpeed = Math.hypot(this.vx, this.vy);
    if (currentSpeed > maxSpeed) {
      this.vx = (this.vx / currentSpeed) * maxSpeed;
      this.vy = (this.vy / currentSpeed) * maxSpeed;
    }

    // Smooth gliding with natural sinusoidal hydro-bob
    this.x += this.vx;
    this.y += this.vy + Math.sin(engine.timeSeconds * 2.2 + this.x * 0.04) * 0.28;

    if (this.vx > 0.08) this.facing = 1;
    else if (this.vx < -0.08) this.facing = -1;

    // Boundaries
    const padX = 85;
    const topPad = 110;
    const bottomPad = engine.height - 150;

    if (this.x < padX) {
      this.x = padX;
      this.vx = Math.abs(this.vx) * 0.8;
      this.targetX = padX + 160;
    } else if (this.x > engine.width - padX) {
      this.x = engine.width - padX;
      this.vx = -Math.abs(this.vx) * 0.8;
      this.targetX = engine.width - padX - 160;
    }

    if (this.y < topPad) {
      this.y = topPad;
      this.vy = Math.abs(this.vy) * 0.8;
      this.targetY = topPad + 110;
    } else if (this.y > bottomPad) {
      this.y = bottomPad;
      this.vy = -Math.abs(this.vy) * 0.8;
      this.targetY = bottomPad - 110;
    }
  }

  render(ctx) {
    if (!this.sprite) return;

    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    if (this.isSpinning) {
      ctx.rotate(this.spinAngle);
    }

    // Soft glow when hovered
    if (this.isHovered) {
      ctx.save();
      ctx.shadowColor = this.product.accentColor || '#38BDF8';
      ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.w * 0.6, this.h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Facing right by default; flip horizontally when swimming left
    ctx.scale(this.facing, 1);
    ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2);

    ctx.restore();

    this.renderBadge(ctx);
  }

  renderBadge(ctx) {
    const isHovered = this.isHovered;
    const badgeX = Math.round(this.x);

    // 1. Product Name Badge ON TOP of the fish (Enlarged for clear readability)
    const nameY = Math.round(this.y - this.h / 2 - 20);

    ctx.save();
    ctx.font = '700 15px "Pixelify Sans", "Plus Jakarta Sans", sans-serif';
    const text = this.product.name;
    const textMetrics = ctx.measureText(text);
    const badgeW = Math.round(textMetrics.width + 34);
    const badgeH = 28;

    const bgAlpha = isHovered ? 0.98 : 0.85;
    ctx.fillStyle = 'rgba(8, 14, 28, ' + bgAlpha + ')';
    ctx.strokeStyle = isHovered ? (this.product.accentColor || '#38BDF8') : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = isHovered ? 2 : 1.5;

    const rx = Math.round(badgeX - badgeW / 2);
    const ry = Math.round(nameY - badgeH / 2);

    ctx.fillRect(rx, ry, badgeW, badgeH);
    ctx.strokeRect(rx, ry, badgeW, badgeH);

    // Accent indicator dot/square
    ctx.fillStyle = this.product.accentColor || '#38BDF8';
    ctx.fillRect(rx + 8, ry + 9, 10, 10);

    ctx.fillStyle = isHovered ? '#FFFFFF' : '#F1F5F9';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, rx + 24, ry + badgeH / 2 + 1);

    // 2. "Click to inspect product →" position moved CLEARLY UNDER THE FISH
    if (isHovered) {
      const hintY = Math.round(this.y + this.h / 2 + 22);
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      const hintText = 'Click to inspect product →';
      const hintMetrics = ctx.measureText(hintText);
      const hintW = hintMetrics.width + 24;
      const hintH = 26;

      const hx = Math.round(badgeX - hintW / 2);
      const hy = Math.round(hintY - hintH / 2);

      // High-contrast dark badge for 100% crisp readability
      ctx.fillStyle = 'rgba(6, 11, 25, 0.96)';
      ctx.fillRect(hx, hy, hintW, hintH);

      ctx.strokeStyle = this.product.accentColor || '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hx, hy, hintW, hintH);

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hintText, badgeX, hintY);
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AquariumEngine, FishEntity };
}

/**
 * WM LABS - Aquarium Graphics & Simulation Engine
 * 
 * 60FPS HTML5 Canvas physics engine.
 * Handles fish autonomous flocking & wandering, cursor curiosity, food physics,
 * lush swaying kelp, large background glossy bubbles, corals, and product hit-testing.
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
    this.foodFlakes = [];
    this.bubbles = [];
    this.bgBubbles = []; // Large cute background bubbles
    this.ambientMotes = [];
    this.kelpStalks = [];
    this.sceneryProps = [];

    // Interaction state
    this.mouse = { x: -1000, y: -1000, isDown: false, inside: false };
    this.hoveredFish = null;
    this.selectedFish = null;

    // Time & Lighting Mode
    this.lastTime = performance.now();
    this.timeSeconds = 0;
    this.isNightMode = false;

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
        SoundFX.playClick();
        this.selectedFish = clickedFish;
        if (this.options.onFishClick) {
          this.options.onFishClick(clickedFish.product, clickedFish);
        }
      } else {
        this.spawnFood(pos.x, pos.y, 4);
        SoundFX.playBubble();
      }
    };

    this.canvas.addEventListener('click', handlePointerClick);
  }

  setupEnvironment() {
    // 1. Lush, taller kelp stalks
    this.kelpStalks = [];
    const stalkCount = Math.max(12, Math.floor(this.width / 75));
    for (let i = 0; i < stalkCount; i++) {
      const isEdge = i < 4 || i > stalkCount - 5;
      const x = (i / (stalkCount - 1)) * (this.width - 60) + 30 + (Math.random() * 26 - 13);
      // Taller kelp (up to 380px tall)
      const height = isEdge ? 240 + Math.random() * 140 : 160 + Math.random() * 110;
      this.kelpStalks.push({
        x,
        baseY: this.height - 20,
        height,
        swayOffset: Math.random() * Math.PI * 2,
        isFront: i % 2 === 0
      });
    }

    // 2. Rich, larger coral reef formations across sea floor
    this.sceneryProps = [
      { type: 'coral_pink', x: this.width * 0.06, y: this.height - 72 },
      { type: 'coral_orange', x: this.width * 0.22, y: this.height - 68 },
      { type: 'chest', x: this.width * 0.38, y: this.height - 62 },
      { type: 'coral_cyan', x: this.width * 0.54, y: this.height - 70 },
      { type: 'coral_yellow', x: this.width * 0.70, y: this.height - 66 },
      { type: 'coral_purple', x: this.width * 0.88, y: this.height - 74 },
    ];

    // 3. Cute large background bubbles
    this.bgBubbles = [];
    const bgBubbleCount = Math.max(14, Math.floor(this.width / 80));
    for (let i = 0; i < bgBubbleCount; i++) {
      this.bgBubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 8 + Math.random() * 14, // 8px to 22px big glossy bubbles!
        vy: -0.4 - Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.5 + Math.random() * 1.5,
        opacity: 0.45 + Math.random() * 0.35
      });
    }

    // 4. Ambient floating light motes
    this.ambientMotes = [];
    for (let i = 0; i < 45; i++) {
      this.ambientMotes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.15 - Math.random() * 0.25,
        size: Math.random() > 0.6 ? 2 : 1,
        alpha: 0.15 + Math.random() * 0.4
      });
    }
  }

  loadProducts(products) {
    this.fishList = [];
    products.forEach((prod, index) => {
      const x = 120 + (index % 3) * (this.width * 0.28) + Math.random() * 50;
      const y = 140 + Math.floor(index / 3) * (this.height * 0.28) + Math.random() * 40;
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

  spawnFood(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.foodFlakes.push({
        x: x + (Math.random() * 24 - 12),
        y: y + (Math.random() * 16 - 8),
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.8 + Math.random() * 0.7,
        frame: Math.floor(Math.random() * 4),
        animTime: 0,
        eaten: false
      });
    }

    this.fishList.forEach(fish => fish.noticeFood(x, y));
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

  toggleNightMode() {
    this.isNightMode = !this.isNightMode;
    return this.isNightMode;
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

  // --- SIMULATION & RENDER LOOP ---
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.timeSeconds += dt;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Treasure chest bubbling
    if (Math.random() < 0.28) {
      const chest = this.sceneryProps.find(p => p.type === 'chest');
      if (chest) {
        this.spawnBubble(chest.x + 36 + (Math.random() * 8 - 4), chest.y + 12, 3 + Math.random() * 4, 1.5);
      }
    }

    // 2. Large Background Bubbles rising smoothly
    this.bgBubbles.forEach(b => {
      b.wobble += dt * b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.6;
      b.y += b.vy;
      if (b.y < -30) {
        b.y = this.height + 20;
        b.x = Math.random() * this.width;
      }
    });

    // 3. Foreground Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.wobble += dt * 4;
      b.x += Math.sin(b.wobble) * 0.5 + b.vx;
      b.y += b.vy;
      if (b.y < 55) {
        this.bubbles.splice(i, 1);
      }
    }

    // 4. Ambient Motes
    this.ambientMotes.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < 40) m.y = this.height - 20;
      if (m.x < 0) m.x = this.width;
      if (m.x > this.width) m.x = 0;
    });

    // 5. Food Flakes
    for (let i = this.foodFlakes.length - 1; i >= 0; i--) {
      const f = this.foodFlakes[i];
      f.animTime += dt;
      f.y += f.vy;
      f.x += Math.sin(f.animTime * 3) * 0.4;

      if (f.y >= this.height - 35) {
        f.vy = 0;
        if (f.animTime > 8) {
          this.foodFlakes.splice(i, 1);
        }
      }
      if (f.eaten) {
        this.foodFlakes.splice(i, 1);
      }
    }

    // 6. Fish Entities
    this.fishList.forEach(fish => fish.update(dt, this));
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Water Background Gradient
    this.renderWaterBackground();

    // 2. Sunlight Caustics Rays
    this.renderCaustics();

    // 3. Large Background Bubbles (giving deep aquatic atmosphere)
    this.bgBubbles.forEach(b => {
      PixelSprites.drawPixelBubble(ctx, b.x, b.y, b.radius, b.opacity);
    });

    // 4. Distant Ambient Motes
    this.renderAmbientMotes();

    // 5. Background Kelp stalks (darker layer)
    this.kelpStalks.filter(k => !k.isFront).forEach(k => {
      PixelSprites.drawPixelKelp(ctx, k.x, k.baseY, k.height, this.timeSeconds, k.swayOffset, false);
    });

    // 6. Sea floor substrate & sand dunes
    this.renderSeaFloor();

    // 7. Large Corals and Chest on sea floor
    this.sceneryProps.forEach(prop => {
      const sprite = PixelSprites.getScenery(prop.type);
      if (sprite) {
        ctx.drawImage(sprite, Math.round(prop.x), Math.round(prop.y));
      }
    });

    // 8. Foreground Kelp stalks (vibrant front layer)
    this.kelpStalks.filter(k => k.isFront).forEach(k => {
      PixelSprites.drawPixelKelp(ctx, k.x, k.baseY, k.height, this.timeSeconds, k.swayOffset, true);
    });

    // 9. Food Flakes
    this.foodFlakes.forEach(f => {
      PixelSprites.drawPixelFlake(ctx, f.x, f.y, Math.floor(f.animTime * 4));
    });

    // 10. Fish Entities (Bigger, cuter, distinct colors)
    this.fishList.forEach(fish => fish.render(ctx));

    // 11. Foreground Bubbles from mouth & chest
    this.bubbles.forEach(b => {
      PixelSprites.drawPixelBubble(ctx, b.x, b.y, b.radius, b.opacity);
    });

    // 12. Water Surface reflections & glass rim
    this.renderAquariumRim();
  }

  renderWaterBackground() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);

    if (this.isNightMode) {
      grad.addColorStop(0, '#040d21');
      grad.addColorStop(0.3, '#071536');
      grad.addColorStop(0.7, '#081a3d');
      grad.addColorStop(1, '#030814');
    } else {
      grad.addColorStop(0, '#1d75f2');
      grad.addColorStop(0.18, '#1056bd');
      grad.addColorStop(0.48, '#083e91');
      grad.addColorStop(0.82, '#052a6b');
      grad.addColorStop(1, '#031c47');
    }

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
      if (this.isNightMode) {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
        grad.addColorStop(0.6, 'rgba(129, 140, 248, 0.03)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
        grad.addColorStop(0.4, 'rgba(186, 230, 253, 0.07)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

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
      ctx.fillStyle = this.isNightMode ? 'rgba(56, 189, 248, ' + m.alpha + ')' : 'rgba(255, 255, 255, ' + m.alpha + ')';
      ctx.fillRect(Math.round(m.x), Math.round(m.y), m.size, m.size);
    });
    ctx.restore();
  }

  renderSeaFloor() {
    const ctx = this.ctx;
    ctx.save();

    const sandGrad = ctx.createLinearGradient(0, this.height - 55, 0, this.height);
    if (this.isNightMode) {
      sandGrad.addColorStop(0, '#1e293b');
      sandGrad.addColorStop(0.3, '#0f172a');
      sandGrad.addColorStop(1, '#020617');
    } else {
      sandGrad.addColorStop(0, '#d97706');
      sandGrad.addColorStop(0.2, '#b45309');
      sandGrad.addColorStop(0.6, '#92400e');
      sandGrad.addColorStop(1, '#78350f');
    }

    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.moveTo(0, this.height - 40);

    const step = 40;
    for (let x = 0; x <= this.width + step; x += step) {
      const duneY = (this.height - 40) + Math.sin(x * 0.015 + 1.2) * 8 + Math.cos(x * 0.03) * 4;
      ctx.lineTo(x, duneY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();

    // Pixel gravel on sand
    const fleckCount = Math.floor(this.width / 20);
    for (let i = 0; i < fleckCount; i++) {
      const fx = (i / fleckCount) * this.width + ((i * 37) % 20);
      const fy = (this.height - 26) + ((i * 13) % 20);
      ctx.fillStyle = (i % 2 === 0) ? '#fde68a' : '#f59e0b';
      if (this.isNightMode) ctx.fillStyle = '#334155';
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
 * FishEntity represents an autonomous product fish swimming in the tank.
 * Bigger, simple, cute pixel art with smooth swimming wag.
 */
class FishEntity {
  constructor(product, x, y, engine) {
    this.product = product;
    this.engine = engine;

    this.x = x;
    this.y = y;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.85 + Math.random() * 0.5);
    this.vy = (Math.random() - 0.5) * 0.4;
    this.facing = this.vx >= 0 ? 1 : -1;

    this.targetX = this.x;
    this.targetY = this.y;
    this.pickNewWaypoint();
    this.waypointTimer = 2 + Math.random() * 4;

    this.frames = PixelSprites.getFrames(product.species);
    this.currentFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.16;

    this.state = 'wandering';
    this.isHovered = false;
    this.spinAngle = 0;
    this.isSpinning = false;

    // BIGGER SIZE: Scale 4.2 provides a prominent, adorable, high-visibility fish!
    this.scale = 4.2;
    this.frameWidth = this.frames[0] ? this.frames[0].width : 40;
    this.frameHeight = this.frames[0] ? this.frames[0].height : 24;
    this.w = this.frameWidth * (this.scale / 2);
    this.h = this.frameHeight * (this.scale / 2);

    this.bubbleTimer = 2 + Math.random() * 5;
  }

  pickNewWaypoint() {
    const pad = 140;
    this.targetX = pad + Math.random() * (this.engine.width - pad * 2);
    this.targetY = 130 + Math.random() * (this.engine.height - 240);
    this.waypointTimer = 4 + Math.random() * 6;
  }

  noticeFood(fx, fy) {
    const dist = Math.hypot(fx - this.x, fy - this.y);
    if (dist < 480) {
      this.targetX = fx;
      this.targetY = fy;
      this.state = 'chasing_food';
    }
  }

  celebrate() {
    this.isSpinning = true;
    this.spinAngle = 0;
    for (let i = 0; i < 7; i++) {
      this.engine.spawnBubble(this.x + (Math.random() * 24 - 12), this.y + (Math.random() * 12 - 6), 3 + Math.random() * 3, 2.2);
    }
  }

  containsPoint(px, py) {
    // Generous bounding box for comfortable cursor click & touch
    const hitW = Math.max(this.w * 1.25, 88);
    const hitH = Math.max(this.h * 1.35, 60);
    return (
      px >= this.x - hitW / 2 &&
      px <= this.x + hitW / 2 &&
      py >= this.y - hitH / 2 &&
      py <= this.y + hitH / 2
    );
  }

  update(dt, engine) {
    this.animTimer += dt;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    if (this.isSpinning) {
      this.spinAngle += dt * 14;
      if (this.spinAngle >= Math.PI * 2) {
        this.spinAngle = 0;
        this.isSpinning = false;
      }
    }

    // Mouth bubbles (head is on the right when facing = 1, on the left when facing = -1)
    this.bubbleTimer -= dt;
    if (this.bubbleTimer <= 0) {
      const mouthX = this.x + (this.facing === 1 ? this.w * 0.42 : -this.w * 0.42);
      const mouthY = this.y;
      engine.spawnBubble(mouthX, mouthY, 2.5 + Math.random() * 2.5, 1.3);
      this.bubbleTimer = 4 + Math.random() * 7;
    }

    // Food seeking behavior
    if (this.state === 'chasing_food') {
      let nearestFood = null;
      let minDist = 500;
      engine.foodFlakes.forEach(flake => {
        if (!flake.eaten) {
          const d = Math.hypot(flake.x - this.x, flake.y - this.y);
          if (d < minDist) {
            minDist = d;
            nearestFood = flake;
          }
        }
      });

      if (nearestFood) {
        this.targetX = nearestFood.x;
        this.targetY = nearestFood.y;

        if (minDist < 30) {
          nearestFood.eaten = true;
          SoundFX.playNibble();
          engine.spawnBubble(this.x, this.y - 10, 3, 2);
          this.state = 'wandering';
          this.pickNewWaypoint();
        }
      } else {
        this.state = 'wandering';
      }
    }

    // Cursor curiosity
    if (engine.mouse.inside && this.state === 'wandering' && !this.isHovered) {
      const mouseDist = Math.hypot(engine.mouse.x - this.x, engine.mouse.y - this.y);
      if (mouseDist < 180) {
        this.targetX = engine.mouse.x;
        this.targetY = engine.mouse.y;
      }
    }

    // Waypoint timer
    this.waypointTimer -= dt;
    if (this.waypointTimer <= 0 && this.state === 'wandering') {
      this.pickNewWaypoint();
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distToTarget = Math.hypot(dx, dy);

    const speed = this.isHovered ? 0.25 : (this.state === 'chasing_food' ? 2.1 : 1.0);
    if (distToTarget > 12) {
      const targetVx = (dx / distToTarget) * speed;
      const targetVy = (dy / distToTarget) * (speed * 0.6);

      this.vx += (targetVx - this.vx) * (dt * 1.5);
      this.vy += (targetVy - this.vy) * (dt * 1.5);
    }

    this.x += this.vx;
    this.y += this.vy + Math.sin(engine.timeSeconds * 2.5 + this.x * 0.05) * 0.28;

    if (this.vx > 0.08) this.facing = 1;
    else if (this.vx < -0.08) this.facing = -1;

    // Boundaries
    const padX = 85;
    const topPad = 120;
    const bottomPad = engine.height - 90;

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
    const sprite = this.frames[this.currentFrame] || this.frames[0];
    if (!sprite) return;

    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    if (this.isSpinning) {
      ctx.rotate(this.spinAngle);
    }

    // Glow highlight when hovered
    if (this.isHovered) {
      ctx.save();
      ctx.shadowColor = this.product.accentColor || '#38BDF8';
      ctx.shadowBlur = 22;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.w * 0.65, this.h * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Facing right by default: scale(facing, 1) properly flips head when moving left
    ctx.scale(this.facing * (this.scale / 2), (this.scale / 2));
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);

    ctx.restore();

    this.renderBadge(ctx);
  }

  renderBadge(ctx) {
    const isHovered = this.isHovered;
    const badgeY = Math.round(this.y - this.h * 0.6 - 20);
    const badgeX = Math.round(this.x);

    ctx.save();
    ctx.font = '600 12px "Pixelify Sans", monospace';
    const text = this.product.name;
    const textMetrics = ctx.measureText(text);
    const badgeW = textMetrics.width + 24;
    const badgeH = 22;

    const bgAlpha = isHovered ? 0.95 : 0.7;
    ctx.fillStyle = 'rgba(15, 23, 42, ' + bgAlpha + ')';
    ctx.strokeStyle = isHovered ? (this.product.accentColor || '#38BDF8') : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;

    const rx = Math.round(badgeX - badgeW / 2);
    const ry = Math.round(badgeY - badgeH / 2);

    ctx.fillRect(rx, ry, badgeW, badgeH);
    ctx.strokeRect(rx, ry, badgeW, badgeH);

    ctx.fillStyle = this.product.accentColor || '#38BDF8';
    ctx.fillRect(rx + 6, ry + 7, 7, 7);

    ctx.fillStyle = isHovered ? '#FFFFFF' : '#E2E8F0';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, rx + 18, ry + badgeH / 2 + 1);

    if (isHovered) {
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      const hint = 'Click to inspect product →';
      ctx.fillStyle = this.product.accentColor || '#38BDF8';
      ctx.textAlign = 'center';
      ctx.fillText(hint, badgeX, badgeY + badgeH + 8);
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AquariumEngine, FishEntity };
}

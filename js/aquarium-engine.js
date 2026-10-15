/**
 * WM LABS - Aquarium Graphics & Simulation Engine
 * 
 * 60FPS HTML5 Canvas physics engine.
 * Handles fish autonomous flocking & wandering, cursor curiosity, food physics,
 * environmental kelp swaying, bubble particles, and product hit-testing.
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

    // Simulation state
    this.fishList = [];
    this.foodFlakes = [];
    this.bubbles = [];
    this.ambientMotes = [];
    this.kelpStalks = [];
    this.sceneryProps = [];

    // Interaction state
    this.mouse = { x: -1000, y: -1000, isDown: false, inside: false };
    this.hoveredFish = null;
    this.selectedFish = null;

    // Time & Mode
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

    // Re-anchor scenery
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
        // Clicked a product fish!
        clickedFish.celebrate();
        SoundFX.playClick();
        this.selectedFish = clickedFish;
        if (this.options.onFishClick) {
          this.options.onFishClick(clickedFish.product, clickedFish);
        }
      } else {
        // Clicked water: drop food!
        this.spawnFood(pos.x, pos.y, 4);
        SoundFX.playBubble();
      }
    };

    this.canvas.addEventListener('click', handlePointerClick);
  }

  setupEnvironment() {
    // Kelp forest placement along the bottom
    this.kelpStalks = [];
    const stalkCount = Math.max(8, Math.floor(this.width / 90));
    for (let i = 0; i < stalkCount; i++) {
      // Cluster more at edges for tank aesthetics
      const isEdge = i < 3 || i > stalkCount - 4;
      const x = (i / (stalkCount - 1)) * (this.width - 80) + 40 + (Math.random() * 30 - 15);
      const height = isEdge ? 180 + Math.random() * 120 : 100 + Math.random() * 90;
      this.kelpStalks.push({
        x,
        baseY: this.height - 25,
        height,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    // Scenery props on sea floor
    this.sceneryProps = [
      { type: 'chest', x: Math.min(this.width * 0.22, 220), y: this.height - 55 },
      { type: 'coral_pink', x: Math.min(this.width * 0.12, 110), y: this.height - 48 },
      { type: 'coral_purple', x: Math.max(this.width * 0.85, this.width - 150), y: this.height - 50 },
      { type: 'shell', x: this.width * 0.45, y: this.height - 25 },
      { type: 'starfish', x: this.width * 0.65, y: this.height - 24 }
    ];

    // Ambient floating plankton/particles
    this.ambientMotes = [];
    for (let i = 0; i < 40; i++) {
      this.ambientMotes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.15 - Math.random() * 0.25,
        size: Math.random() > 0.7 ? 2 : 1,
        alpha: 0.15 + Math.random() * 0.4
      });
    }
  }

  loadProducts(products) {
    this.fishList = [];
    products.forEach((prod, index) => {
      // Stagger initial positions nicely across the tank
      const x = 100 + (index % 3) * (this.width * 0.3) + Math.random() * 60;
      const y = 140 + Math.floor(index / 3) * (this.height * 0.25) + Math.random() * 50;
      const fish = new FishEntity(prod, x, y, this);
      this.fishList.push(fish);
    });
  }

  findFishAt(x, y) {
    // Check backwards to select topmost rendered fish
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

    // Alert nearby fish of food arrival!
    this.fishList.forEach(fish => fish.noticeFood(x, y));
  }

  spawnBubble(x, y, radius = 3, riseSpeed = 1.2) {
    this.bubbles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -riseSpeed - Math.random() * 0.6,
      radius,
      wobble: Math.random() * Math.PI * 2,
      opacity: 0.7 + Math.random() * 0.3
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

  // --- MAIN SIMULATION & RENDER LOOP ---
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.timeSeconds += dt;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Treasure chest continuous bubbles
    if (Math.random() < 0.25) {
      const chest = this.sceneryProps.find(p => p.type === 'chest');
      if (chest) {
        this.spawnBubble(chest.x + 28 + (Math.random() * 8 - 4), chest.y + 10, 2 + Math.random() * 3, 1.4);
      }
    }

    // 2. Update Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.wobble += dt * 4;
      b.x += Math.sin(b.wobble) * 0.5 + b.vx;
      b.y += b.vy;
      // Pop at water line (y < 60)
      if (b.y < 60) {
        this.bubbles.splice(i, 1);
      }
    }

    // 3. Update Ambient Motes
    this.ambientMotes.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < 40) m.y = this.height - 20;
      if (m.x < 0) m.x = this.width;
      if (m.x > this.width) m.x = 0;
    });

    // 4. Update Food Flakes
    for (let i = this.foodFlakes.length - 1; i >= 0; i--) {
      const f = this.foodFlakes[i];
      f.animTime += dt;
      f.y += f.vy;
      f.x += Math.sin(f.animTime * 3) * 0.4;

      // Bottom substrate reached
      if (f.y >= this.height - 35) {
        f.vy = 0;
        // Fade or get cleaned up
        if (f.animTime > 8) {
          this.foodFlakes.splice(i, 1);
        }
      }
      if (f.eaten) {
        this.foodFlakes.splice(i, 1);
      }
    }

    // 5. Update Fish
    this.fishList.forEach(fish => fish.update(dt, this));
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Water Background Gradient
    this.renderWaterBackground();

    // 2. Sunlight Caustics Rays
    this.renderCaustics();

    // 3. Distant Ambient Motes
    this.renderAmbientMotes();

    // 4. Sea floor substrate & sand dunes
    this.renderSeaFloor();

    // 5. Background Kelp stalks
    this.kelpStalks.forEach(k => {
      PixelSprites.drawPixelKelp(ctx, k.x, k.baseY, k.height, this.timeSeconds, k.swayOffset);
    });

    // 6. Scenery Props (Chest, Corals, Shells)
    this.sceneryProps.forEach(prop => {
      const sprite = PixelSprites.getScenery(prop.type);
      if (sprite) {
        ctx.drawImage(sprite, Math.round(prop.x), Math.round(prop.y));
      }
    });

    // 7. Food Flakes
    this.foodFlakes.forEach(f => {
      PixelSprites.drawPixelFlake(ctx, f.x, f.y, Math.floor(f.animTime * 4));
    });

    // 8. Fish Entities
    this.fishList.forEach(fish => fish.render(ctx));

    // 9. Bubbles
    this.bubbles.forEach(b => {
      PixelSprites.drawPixelBubble(ctx, b.x, b.y, b.radius, b.opacity);
    });

    // 10. Water Surface reflections & glass rim
    this.renderAquariumRim();
  }

  renderWaterBackground() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);

    if (this.isNightMode) {
      // Deep bioluminescent midnight
      grad.addColorStop(0, '#040d21');
      grad.addColorStop(0.3, '#071536');
      grad.addColorStop(0.7, '#081a3d');
      grad.addColorStop(1, '#030814');
    } else {
      // Sunlit tropical crystal water
      grad.addColorStop(0, '#1a73e8');
      grad.addColorStop(0.15, '#0e52b5');
      grad.addColorStop(0.45, '#073b88');
      grad.addColorStop(0.8, '#052a65');
      grad.addColorStop(1, '#031c44');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  renderCaustics() {
    const ctx = this.ctx;
    ctx.save();
    const rayCount = 6;
    const t = this.timeSeconds * 0.6;

    for (let i = 0; i < rayCount; i++) {
      const angle = 0.12 * Math.sin(t + i * 1.3);
      const startX = (i / rayCount) * this.width + Math.sin(t * 0.8 + i) * 60;
      const widthTop = 40 + Math.sin(t + i) * 20;
      const widthBottom = 130 + Math.cos(t * 0.7 + i) * 40;

      const grad = ctx.createLinearGradient(0, 0, 0, this.height * 0.85);
      if (this.isNightMode) {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        grad.addColorStop(0.6, 'rgba(129, 140, 248, 0.03)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(0.4, 'rgba(186, 230, 253, 0.06)');
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

    // Sand dune gradient
    const sandGrad = ctx.createLinearGradient(0, this.height - 50, 0, this.height);
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
    ctx.moveTo(0, this.height - 35);

    // Gently rolling dunes
    const step = 40;
    for (let x = 0; x <= this.width + step; x += step) {
      const duneY = (this.height - 35) + Math.sin(x * 0.015 + 1.2) * 8 + Math.cos(x * 0.03) * 4;
      ctx.lineTo(x, duneY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();

    // Pixel gravel and shell flecks on sand
    const fleckCount = Math.floor(this.width / 25);
    for (let i = 0; i < fleckCount; i++) {
      const fx = (i / fleckCount) * this.width + ((i * 37) % 20);
      const fy = (this.height - 24) + ((i * 13) % 18);
      ctx.fillStyle = (i % 2 === 0) ? '#fde68a' : '#f59e0b';
      if (this.isNightMode) ctx.fillStyle = '#334155';
      ctx.fillRect(Math.round(fx), Math.round(fy), 2, 2);
    }

    ctx.restore();
  }

  renderAquariumRim() {
    const ctx = this.ctx;
    ctx.save();

    // Top water surface shimmer line
    const waterGrad = ctx.createLinearGradient(0, 0, this.width, 0);
    waterGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    waterGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
    waterGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, this.width, 3);

    // Tank glass side highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(0, 0, 4, this.height);
    ctx.fillRect(this.width - 4, 0, 4, this.height);

    ctx.restore();
  }
}

/**
 * FishEntity represents an autonomous product fish swimming in the tank.
 */
class FishEntity {
  constructor(product, x, y, engine) {
    this.product = product;
    this.engine = engine;

    this.x = x;
    this.y = y;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.6);
    this.vy = (Math.random() - 0.5) * 0.4;
    this.facing = this.vx >= 0 ? 1 : -1;

    // Waypoints & behavior
    this.targetX = this.x;
    this.targetY = this.y;
    this.pickNewWaypoint();
    this.waypointTimer = 2 + Math.random() * 4;

    // Animation & State
    this.frames = PixelSprites.getFrames(product.species);
    this.currentFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.14; // seconds per frame

    this.state = 'wandering'; // 'wandering' | 'curious' | 'chasing_food' | 'celebrating'
    this.isHovered = false;
    this.spinAngle = 0; // for celebratory spin
    this.isSpinning = false;

    // Sprite scale & hit testing box
    this.scale = 2.4;
    this.frameWidth = this.frames[0] ? this.frames[0].width : 56;
    this.frameHeight = this.frames[0] ? this.frames[0].height : 40;
    this.w = this.frameWidth * (this.scale / 2);
    this.h = this.frameHeight * (this.scale / 2);

    // Mouth position offset for eating & bubbles
    this.mouthOffset = { x: 20, y: 10 };
    this.bubbleTimer = 2 + Math.random() * 5;
  }

  pickNewWaypoint() {
    const pad = 120;
    this.targetX = pad + Math.random() * (this.engine.width - pad * 2);
    this.targetY = 120 + Math.random() * (this.engine.height - 220);
    this.waypointTimer = 4 + Math.random() * 6;
  }

  noticeFood(fx, fy) {
    // If food is within reasonable range, swim to it!
    const dist = Math.hypot(fx - this.x, fy - this.y);
    if (dist < 450) {
      this.targetX = fx;
      this.targetY = fy;
      this.state = 'chasing_food';
    }
  }

  celebrate() {
    this.isSpinning = true;
    this.spinAngle = 0;
    // Release a celebratory burst of tiny bubbles
    for (let i = 0; i < 6; i++) {
      this.engine.spawnBubble(this.x + (Math.random() * 20 - 10), this.y + (Math.random() * 10 - 5), 2 + Math.random() * 3, 2);
    }
  }

  containsPoint(px, py) {
    // Generous bounding box for comfortable cursor click & hover
    const hitW = Math.max(this.w * 1.3, 70);
    const hitH = Math.max(this.h * 1.3, 50);
    return (
      px >= this.x - hitW / 2 &&
      px <= this.x + hitW / 2 &&
      py >= this.y - hitH / 2 &&
      py <= this.y + hitH / 2
    );
  }

  update(dt, engine) {
    // Animation frame advance
    this.animTimer += dt;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    // Celebratory 360 spin
    if (this.isSpinning) {
      this.spinAngle += dt * 14;
      if (this.spinAngle >= Math.PI * 2) {
        this.spinAngle = 0;
        this.isSpinning = false;
      }
    }

    // Periodic bubbles from fish mouth
    this.bubbleTimer -= dt;
    if (this.bubbleTimer <= 0) {
      const mouthX = this.x + (this.facing === 1 ? this.w * 0.45 : -this.w * 0.45);
      const mouthY = this.y - 2;
      engine.spawnBubble(mouthX, mouthY, 2 + Math.random() * 2, 1.2);
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

        // If close enough: eat!
        if (minDist < 25) {
          nearestFood.eaten = true;
          SoundFX.playNibble();
          // spawn nibble crumbs
          engine.spawnBubble(this.x, this.y - 6, 2, 1.8);
          this.state = 'wandering';
          this.pickNewWaypoint();
        }
      } else {
        this.state = 'wandering';
      }
    }

    // Cursor curiosity (if cursor is nearby, fish gently looks or steers towards it)
    if (engine.mouse.inside && this.state === 'wandering' && !this.isHovered) {
      const mouseDist = Math.hypot(engine.mouse.x - this.x, engine.mouse.y - this.y);
      if (mouseDist < 160) {
        this.targetX = engine.mouse.x;
        this.targetY = engine.mouse.y;
      }
    }

    // Waypoint wandering update
    this.waypointTimer -= dt;
    if (this.waypointTimer <= 0 && this.state === 'wandering') {
      this.pickNewWaypoint();
    }

    // Steer towards target smoothly
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distToTarget = Math.hypot(dx, dy);

    const speed = this.isHovered ? 0.2 : (this.state === 'chasing_food' ? 1.9 : 0.9);
    if (distToTarget > 10) {
      const targetVx = (dx / distToTarget) * speed;
      const targetVy = (dy / distToTarget) * (speed * 0.6);

      // Smooth inertia
      this.vx += (targetVx - this.vx) * (dt * 1.5);
      this.vy += (targetVy - this.vy) * (dt * 1.5);
    }

    // Position integration with gentle sinusoidal cruising bob
    this.x += this.vx;
    this.y += this.vy + Math.sin(engine.timeSeconds * 2.5 + this.x * 0.05) * 0.25;

    // Facing direction
    if (this.vx > 0.08) this.facing = 1;
    else if (this.vx < -0.08) this.facing = -1;

    // Tank boundaries containment
    const padX = 70;
    const topPad = 110;
    const bottomPad = engine.height - 70;

    if (this.x < padX) {
      this.x = padX;
      this.vx = Math.abs(this.vx) * 0.8;
      this.targetX = padX + 150;
    } else if (this.x > engine.width - padX) {
      this.x = engine.width - padX;
      this.vx = -Math.abs(this.vx) * 0.8;
      this.targetX = engine.width - padX - 150;
    }

    if (this.y < topPad) {
      this.y = topPad;
      this.vy = Math.abs(this.vy) * 0.8;
      this.targetY = topPad + 100;
    } else if (this.y > bottomPad) {
      this.y = bottomPad;
      this.vy = -Math.abs(this.vy) * 0.8;
      this.targetY = bottomPad - 100;
    }
  }

  render(ctx) {
    const sprite = this.frames[this.currentFrame] || this.frames[0];
    if (!sprite) return;

    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    // Spin or direction orientation
    if (this.isSpinning) {
      ctx.rotate(this.spinAngle);
    }

    // Hover glow effect
    if (this.isHovered) {
      ctx.save();
      ctx.shadowColor = this.product.accentColor || '#38BDF8';
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.w * 0.7, this.h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render pixel art sprite (flipped horizontally if swimming left)
    ctx.scale(this.facing * (this.scale / 2), (this.scale / 2));
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);

    ctx.restore();

    // Render floating product badge above fish
    this.renderBadge(ctx);
  }

  renderBadge(ctx) {
    const isHovered = this.isHovered;
    const badgeY = Math.round(this.y - this.h * 0.65 - 18);
    const badgeX = Math.round(this.x);

    ctx.save();
    ctx.font = '600 11px "Pixelify Sans", monospace';
    const text = this.product.name;
    const textMetrics = ctx.measureText(text);
    const badgeW = textMetrics.width + 20;
    const badgeH = 20;

    // Badge container background
    const bgAlpha = isHovered ? 0.95 : 0.65;
    ctx.fillStyle = isHovered ? 'rgba(15, 23, 42, ' + bgAlpha + ')' : 'rgba(15, 23, 42, ' + bgAlpha + ')';
    ctx.strokeStyle = isHovered ? (this.product.accentColor || '#38BDF8') : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;

    // Pixelated badge box
    const rx = Math.round(badgeX - badgeW / 2);
    const ry = Math.round(badgeY - badgeH / 2);

    ctx.fillRect(rx, ry, badgeW, badgeH);
    ctx.strokeRect(rx, ry, badgeW, badgeH);

    // Accent indicator dot
    ctx.fillStyle = this.product.accentColor || '#38BDF8';
    ctx.fillRect(rx + 6, ry + 6, 6, 6);

    // Label text
    ctx.fillStyle = isHovered ? '#FFFFFF' : '#E2E8F0';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, rx + 16, ry + badgeH / 2 + 1);

    // If hovered, draw small "Click to Inspect" hint
    if (isHovered) {
      ctx.font = '500 9px "Plus Jakarta Sans", sans-serif';
      const hint = 'Click to inspect product →';
      ctx.fillStyle = this.product.accentColor || '#38BDF8';
      ctx.textAlign = 'center';
      ctx.fillText(hint, badgeX, badgeY + badgeH + 6);
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AquariumEngine, FishEntity };
}

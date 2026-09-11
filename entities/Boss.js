import { getBossType } from '../data/bosses.js';

export class Boss {
  constructor(x, y, id = 'dungeonGuardian', level = 1) {
    const type = getBossType(id);
    this.id = type.id;
    this.name = type.name;
    this.x = x;
    this.y = y;
    this.radius = 28;
    this.speed = type.speed + level * 2;
    this.maxHp = type.hp + level * 35;
    this.hp = this.maxHp;
    this.damage = type.damage + level;
    this.attackCooldown = type.attackCooldown;
    this.attackTimer = 0;
    this.xp = type.xp + level * 20;
    this.reward = type.reward;
    this.color = type.color;
    this.hitFlash = 0;
    this.phase = 1;
    this.phaseChanged = false;
    this.aiTime = Math.random() * Math.PI * 2;
    this.telegraph = 0;
    this.chargeCooldown = 0;
    this.chargeTimer = 0;
  }

  updatePhase() {
    const ratio = this.hp / this.maxHp;
    const nextPhase = ratio <= 0.33 ? 3 : ratio <= 0.66 ? 2 : 1;
    if (nextPhase !== this.phase) {
      this.phase = nextPhase;
      this.phaseChanged = true;
      this.attackTimer = 0.15;
      this.telegraph = 0.45;
    }
  }

  moveTowards(player, speed, dt, collision) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const mx = dx / d * speed * dt;
    const my = dy / d * speed * dt;
    if (collision) collision.moveCircle(this, mx, my);
    else { this.x += mx; this.y += my; }
    return d;
  }

  update(dt, player, collision = null) {
    this.aiTime += dt;
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.telegraph = Math.max(0, this.telegraph - dt);
    this.chargeCooldown = Math.max(0, this.chargeCooldown - dt);
    this.chargeTimer = Math.max(0, this.chargeTimer - dt);

    this.updatePhase();

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (this.phase === 1) {
      if (distance > this.radius + player.radius + 14) {
        this.moveTowards(player, this.speed, dt, collision);
      }
    } else if (this.phase === 2) {
      const angle = Math.atan2(dy, dx) + Math.sin(this.aiTime * 2.2) * 0.55;
      const desiredDistance = 90;
      const radial = distance - desiredDistance;
      const targetX = Math.cos(angle) * radial + dx;
      const targetY = Math.sin(angle) * radial + dy;
      if (distance > 55) this.moveTowards({ x: this.x + targetX, y: this.y + targetY }, this.speed * 1.2, dt, collision);
    } else {
      if (this.chargeTimer > 0) {
        this.moveTowards(player, this.speed * 3.2, dt, collision);
      } else if (this.chargeCooldown <= 0 && distance > 80) {
        this.chargeCooldown = 2.4;
        this.chargeTimer = 0.28;
        this.telegraph = 0.28;
      } else if (distance > this.radius + player.radius + 18) {
        this.moveTowards(player, this.speed * 1.45, dt, collision);
      }
    }

    const contactRange = this.radius + player.radius + (this.phase === 3 ? 16 : 10);
    if (distance <= contactRange && this.attackTimer <= 0) {
      const phaseDamage = this.damage * (this.phase === 3 ? 1.25 : this.phase === 2 ? 1.1 : 1);
      player.takeDamage(Math.round(phaseDamage));
      this.attackTimer = this.attackCooldown / (this.phase === 3 ? 1.25 : this.phase === 2 ? 1.1 : 1);
      this.telegraph = 0.18;
    }
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.1;
    return { phase: this.phase, defeated: this.hp <= 0 };
  }

  get phaseLabel() {
    return `Fase ${this.phase}`;
  }
}

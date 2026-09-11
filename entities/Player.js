import { COMBAT_CONFIG } from '../data/combat.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 220;
    this.maxHp = 100;
    this.hp = 100;
    this.damage = 12;
    this.attackRange = COMBAT_CONFIG.player.range;
    this.attackCooldown = 0.28;
    this.attackTimer = 0;
    this.invulnerability = 0;
    this.spriteId = 'knight';
    this.facing = 1;
    this.moving = false;
    this.animTime = 0;
  }

  update(dt, input, width, height, collision = null) {
    const move = input.movement();
    const moving = move.x !== 0 || move.y !== 0;
    this.moving = moving;
    if (move.x !== 0) this.facing = move.x < 0 ? -1 : 1;
    if (moving) this.animTime += dt;

    const dx = move.x * this.speed * dt;
    const dy = move.y * this.speed * dt;
    if (collision) collision.moveCircle(this, dx, dy);
    else { this.x += dx; this.y += dy; }

    this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.invulnerability = Math.max(0, this.invulnerability - dt);
  }

  animationFrame() {
    return this.moving ? Math.floor(this.animTime * 8) % 4 : 0;
  }

  canAttack() { return this.attackTimer <= 0; }
  startAttack() { this.attackTimer = this.attackCooldown; }

  takeDamage(amount) {
    if (this.invulnerability > 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerability = COMBAT_CONFIG.player.invulnerabilityAfterHit;
    return true;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }
}

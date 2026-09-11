import { COMBAT_CONFIG } from '../data/combat.js';

export class Projectile {
  constructor(x, y, target, damage, collision = null, onHit = null) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = COMBAT_CONFIG.player.projectileSpeed;
    this.radius = COMBAT_CONFIG.player.projectileRadius;
    this.collision = collision;
    this.onHit = onHit;
    this.dead = false;
  }

  update(dt) {
    if (!this.target || this.target.hp <= 0) {
      this.dead = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy) || 1;
    const step = this.speed * dt;
    const nextX = this.x + dx / distance * step;
    const nextY = this.y + dy / distance * step;

    if (this.collision?.circleHitsWall(nextX, nextY, this.radius)) {
      this.dead = true;
      return;
    }

    if (distance <= step + this.radius + this.target.radius) {
      let result;
      if (typeof this.target.takeCombatDamage === 'function') {
        result = this.target.takeCombatDamage(this.damage, this.x, this.y);
      } else if (typeof this.target.takeDamage === 'function') {
        this.target.takeDamage(this.damage);
        result = { damage: this.damage, critical: false, defeated: this.target.hp <= 0 };
      }
      this.onHit?.(this.target, result, this.x, this.y);
      this.dead = true;
      return;
    }

    this.x = nextX;
    this.y = nextY;
  }
}

import { getBossType } from '../data/bosses.js';

export class Boss {
  constructor(x, y, id = 'dungeonGuardian', level = 1) {
    const type = getBossType(id);
    this.id = type.id;
    this.name = type.name;
    this.x = x; this.y = y; this.radius = 28;
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
  }

  update(dt, player, collision = null) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d > this.radius + player.radius + 12) {
      const mx = dx / d * this.speed * dt;
      const my = dy / d * this.speed * dt;
      collision ? collision.moveCircle(this, mx, my) : (this.x += mx, this.y += my);
    } else if (this.attackTimer <= 0) {
      player.takeDamage(this.damage);
      this.attackTimer = this.attackCooldown;
    }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.1;
  }
}

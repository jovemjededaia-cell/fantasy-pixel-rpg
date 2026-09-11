import { getEnemyType } from '../data/enemies.js';

export class Enemy {
  constructor(x, y, level = 1, typeId = 'slime') {
    const type = getEnemyType(typeId);
    this.typeId = type.id;
    this.name = type.name;
    this.x = x; this.y = y; this.radius = type.id === 'guardian' ? 18 : 14;
    this.speed = type.speed + level * 3;
    this.maxHp = type.hp + level * 5; this.hp = this.maxHp;
    this.damage = type.damage + Math.floor(level * 0.5);
    this.attackCooldown = type.attackCooldown;
    this.attackTimer = 0;
    this.xp = type.xp + level * 2;
    this.color = type.color;
    this.hitFlash = 0;
  }

  update(dt, player, collision = null) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d > this.radius + player.radius + 4) {
      const moveX = dx / d * this.speed * dt;
      const moveY = dy / d * this.speed * dt;
      if (collision) collision.moveCircle(this, moveX, moveY);
      else { this.x += moveX; this.y += moveY; }
    } else if (this.attackTimer <= 0) {
      player.takeDamage(this.damage);
      this.attackTimer = this.attackCooldown;
    }
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.08;
  }
}

export class Enemy {
  constructor(x, y, level = 1) {
    this.x = x; this.y = y; this.radius = 14;
    this.speed = 72 + level * 5;
    this.maxHp = 30 + level * 5; this.hp = this.maxHp;
    this.damage = 8 + Math.floor(level * 0.6);
    this.attackCooldown = 0.9;
    this.attackTimer = 0;
    this.hitFlash = 0;
  }

  update(dt, player) {
    const dx = player.x - this.x, dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d > this.radius + player.radius + 4) {
      this.x += dx / d * this.speed * dt;
      this.y += dy / d * this.speed * dt;
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

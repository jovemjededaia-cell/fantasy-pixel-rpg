export class Projectile {
  constructor(x, y, target, damage) {
    this.x = x; this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = 520;
    this.radius = 5;
    this.dead = false;
  }

  update(dt) {
    if (!this.target || this.target.hp <= 0) { this.dead = true; return; }
    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const step = this.speed * dt;
    if (d <= step + this.target.radius) {
      this.target.takeDamage(this.damage);
      this.dead = true;
      return;
    }
    this.x += dx / d * step;
    this.y += dy / d * step;
  }
}

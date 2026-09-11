export class Player {
  constructor(x, y) {
    this.x = x; this.y = y; this.radius = 16;
    this.speed = 220;
    this.maxHp = 100; this.hp = 100;
    this.damage = 12;
    this.attackRange = 420;
    this.attackCooldown = 0.28;
    this.attackTimer = 0;
    this.invulnerability = 0;
  }

  update(dt, input, width, height, collision = null) {
    const move = input.movement();
    const dx = move.x * this.speed * dt;
    const dy = move.y * this.speed * dt;

    if (collision) {
      collision.moveCircle(this, dx, dy);
    } else {
      this.x += dx;
      this.y += dy;
    }

    this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.invulnerability = Math.max(0, this.invulnerability - dt);
  }

  canAttack() { return this.attackTimer <= 0; }
  startAttack() { this.attackTimer = this.attackCooldown; }

  takeDamage(amount) {
    if (this.invulnerability > 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerability = 0.35;
    return true;
  }
}

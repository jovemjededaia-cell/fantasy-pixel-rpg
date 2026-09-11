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
    this.spriteId = 'knight';
    this.facing = 0;
    this.animTime = 0;
    this.isMoving = false;
  }

  update(dt, input, width, height, collision = null) {
    const move = input.movement();
    this.isMoving = Math.abs(move.x) + Math.abs(move.y) > 0;
    if (this.isMoving) {
      this.animTime += dt;
      if (Math.abs(move.x) > Math.abs(move.y)) this.facing = move.x < 0 ? 1 : 3;
      else this.facing = move.y < 0 ? 2 : 0;
    } else {
      this.animTime = 0;
    }

    const dx = move.x * this.speed * dt;
    const dy = move.y * this.speed * dt;
    if (collision) collision.moveCircle(this, dx, dy);
    else { this.x += dx; this.y += dy; }

    this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.invulnerability = Math.max(0, this.invulnerability - dt);
  }

  animationFrame(fps = 8, framesPerDirection = 4) {
    const local = this.isMoving ? Math.floor(this.animTime * fps) % framesPerDirection : 0;
    return this.facing * framesPerDirection + local;
  }

  canAttack() { return this.attackTimer <= 0; }
  startAttack() { this.attackTimer = this.attackCooldown; }

  takeDamage(amount) {
    if (this.invulnerability > 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerability = 0.35;
    return true;
  }

  heal(amount) { this.hp = Math.min(this.maxHp, this.hp + amount); }
}

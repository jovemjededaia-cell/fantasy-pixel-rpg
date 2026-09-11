import { getEnemyType } from '../data/enemies.js';
import { COMBAT_CONFIG } from '../data/combat.js';

export class Enemy {
  constructor(x, y, level = 1, typeId = 'slime') {
    const type = getEnemyType(typeId);
    this.typeId = type.id;
    this.name = type.name;
    this.x = x;
    this.y = y;
    this.radius = type.id === 'guardian' ? 18 : 14;
    this.speed = type.speed + level * 3;
    this.maxHp = type.hp + level * 5;
    this.hp = this.maxHp;
    this.damage = type.damage + Math.floor(level * 0.5);
    this.attackCooldown = type.attackCooldown;
    this.attackTimer = 0;
    this.xp = type.xp + level * 2;
    this.color = type.color;
    this.hitFlash = 0;
    this.aiTime = Math.random() * Math.PI * 2;
    this.hitstun = 0;
    this.knockbackX = 0;
    this.knockbackY = 0;
  }

  update(dt, player, collision = null, aiSystem = null) {
    this.hitstun = Math.max(0, this.hitstun - dt);
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);

    if (this.hitstun > 0) {
      if (collision) collision.moveCircle(this, this.knockbackX * dt, this.knockbackY * dt);
      return;
    }

    const shouldAttack = aiSystem
      ? aiSystem.update(this, player, dt, collision)
      : this.defaultChase(dt, player, collision);

    if (shouldAttack && this.attackTimer <= 0) {
      player.takeDamage(this.damage);
      this.attackTimer = this.attackCooldown;
    }
  }

  defaultChase(dt, player, collision) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy) || 1;
    if (distance > this.radius + player.radius + 4) {
      const moveX = dx / distance * this.speed * dt;
      const moveY = dy / distance * this.speed * dt;
      if (collision) collision.moveCircle(this, moveX, moveY);
      else { this.x += moveX; this.y += moveY; }
    }
    return distance <= this.radius + player.radius + 4;
  }

  takeCombatDamage(amount, hitX = this.x, hitY = this.y) {
    const criticalChance = COMBAT_CONFIG.player.baseCritChance;
    const critical = Math.random() < criticalChance;
    const finalDamage = critical
      ? Math.max(1, Math.round(amount * COMBAT_CONFIG.player.critMultiplier))
      : Math.max(1, Math.round(amount));

    this.hp = Math.max(0, this.hp - finalDamage);
    this.hitFlash = 0.1;
    this.hitstun = COMBAT_CONFIG.hitstun;

    const dx = this.x - hitX;
    const dy = this.y - hitY;
    const distance = Math.hypot(dx, dy) || 1;
    const force = critical ? COMBAT_CONFIG.player.knockback * 1.5 : COMBAT_CONFIG.player.knockback;
    this.knockbackX = dx / distance * force;
    this.knockbackY = dy / distance * force;

    return { damage: finalDamage, critical, defeated: this.hp <= 0 };
  }

  takeDamage(amount) {
    return this.takeCombatDamage(amount);
  }
}

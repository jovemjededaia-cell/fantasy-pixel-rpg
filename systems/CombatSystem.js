import { Projectile } from '../entities/Projectile.js';
import { CollisionSystem } from './CollisionSystem.js';

export class CombatSystem {
  constructor(state, dungeonCollision = null) {
    this.state = state;
    this.dungeonCollision = dungeonCollision;
  }

  update(dt) {
    const { player, enemies, projectiles } = this.state;
    for (const enemy of enemies) {
      enemy.update(dt, player, this.dungeonCollision);
    }

    if (player.canAttack() && this.state.input.attackPressed()) {
      const target = this.findNearestTarget();
      if (target) {
        player.startAttack();
        projectiles.push(new Projectile(player.x, player.y, target, player.damage));
      }
    }

    for (const projectile of projectiles) projectile.update(dt);
    this.state.projectiles = projectiles.filter(p => !p.dead);

    const defeated = enemies.filter(enemy => enemy.hp <= 0).length;
    if (defeated) {
      this.state.score += defeated;
      this.state.enemies = enemies.filter(enemy => enemy.hp > 0);
    }
  }

  findNearestTarget() {
    const { player, enemies } = this.state;
    let nearest = null, best = Infinity;
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      const d = CollisionSystem.distance(player, enemy);
      if (d <= player.attackRange && d < best) {
        best = d;
        nearest = enemy;
      }
    }
    return nearest;
  }
}

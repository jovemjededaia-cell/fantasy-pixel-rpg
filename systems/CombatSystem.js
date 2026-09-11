import { Projectile } from '../entities/Projectile.js';
import { CollisionSystem } from './CollisionSystem.js';
import { EnemyAISystem } from './EnemyAISystem.js';

export class CombatSystem {
  constructor(state, dungeonCollision = null, progression = null, inventory = null) {
    this.state = state;
    this.dungeonCollision = dungeonCollision;
    this.progression = progression;
    this.inventory = inventory;
    this.enemyAI = new EnemyAISystem();
  }

  pushCombatEffect(effect) {
    this.state.combatEffects ??= [];
    this.state.combatEffects.push({ ...effect, time: 0, duration: effect.duration ?? 0.35 });
  }

  updateEffects(dt) {
    if (!this.state.combatEffects) return;
    for (const effect of this.state.combatEffects) effect.time += dt;
    this.state.combatEffects = this.state.combatEffects.filter(effect => effect.time < effect.duration);
  }

  update(dt) {
    const { player, enemies, projectiles } = this.state;
    this.updateEffects(dt);

    for (const enemy of enemies) {
      enemy.update(dt, player, this.dungeonCollision, this.enemyAI);
    }
    if (this.state.boss) this.state.boss.update(dt, player, this.dungeonCollision);

    if (player.canAttack() && this.state.input.attackPressed()) {
      const target = this.findNearestTarget();
      if (target) {
        player.startAttack();
        projectiles.push(new Projectile(player.x, player.y, target, player.damage, this.dungeonCollision));
      }
    }

    for (const projectile of projectiles) projectile.update(dt);
    this.state.projectiles = projectiles.filter(p => !p.dead);

    for (const enemy of enemies) {
      if (enemy.hp <= 0) {
        this.state.score += 1;
        this.progression?.grantXp(enemy.xp);
        if (enemy.typeId === 'guardian' || Math.random() < 0.12) this.inventory?.add('smallPotion');
      }
    }
    this.state.enemies = enemies.filter(enemy => enemy.hp > 0);

    const boss = this.state.boss;
    if (boss && boss.hp <= 0 && !this.state.bossDefeated) {
      this.state.bossDefeated = true;
      this.state.score += 10;
      this.progression?.grantXp(boss.xp);
      this.inventory?.add(boss.reward);
    }
  }

  findNearestTarget() {
    const { player, enemies, boss } = this.state;
    let nearest = null;
    let best = Infinity;
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      const d = CollisionSystem.distance(player, enemy);
      if (d <= player.attackRange && d < best) {
        best = d;
        nearest = enemy;
      }
    }
    if (boss && boss.hp > 0) {
      const d = CollisionSystem.distance(player, boss);
      if (d <= player.attackRange && d < best) nearest = boss;
    }
    return nearest;
  }
}

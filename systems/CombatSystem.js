import { Projectile } from '../entities/Projectile.js';
import { CollisionSystem } from './CollisionSystem.js';
import { EnemyAISystem } from './EnemyAISystem.js';

export class CombatSystem {
  constructor(state, dungeonCollision = null, progression = null, inventory = null, effects = null) {
    this.state = state;
    this.dungeonCollision = dungeonCollision;
    this.progression = progression;
    this.inventory = inventory;
    this.effects = effects;
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

    for (const enemy of enemies) enemy.update(dt, player, this.dungeonCollision, this.enemyAI);
    if (this.state.boss) this.state.boss.update(dt, player, this.dungeonCollision);

    if (player.canAttack() && this.state.input.attackPressed()) {
      const target = this.findNearestTarget();
      if (target) {
        player.startAttack();
        this.effects?.spawn('attack', player.x, player.y, { targetX: target.x, targetY: target.y, life: 0.16 });
        projectiles.push(new Projectile(
          player.x, player.y, target, player.damage, this.dungeonCollision,
          (hitTarget, result, x, y) => {
            this.effects?.spawn(result?.critical ? 'critical' : 'hit', x, y, {
              life: result?.critical ? 0.45 : 0.28,
              damage: result?.damage ?? player.damage,
              critical: !!result?.critical
            });
            this.effects?.spawn('spark', hitTarget?.x ?? x, hitTarget?.y ?? y, { life: 0.22 });
          }
        ));
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
      this.effects?.spawn('bossDefeat', boss.x, boss.y, { life: 0.8 });
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

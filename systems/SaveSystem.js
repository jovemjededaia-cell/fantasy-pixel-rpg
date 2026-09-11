import { DungeonMap } from '../dungeon/DungeonMap.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';

const SAVE_KEY = 'fantasy-pixel-rpg-save-v1';

export class SaveSystem {
  constructor(game) {
    this.game = game;
  }

  buildSnapshot() {
    const state = this.game.state;
    const dungeon = this.game.dungeon.map;

    return {
      version: 1,
      savedAt: new Date().toISOString(),
      state: {
        score: state.score,
        time: state.time,
        wave: state.wave,
        spawnTimer: state.spawnTimer,
        running: state.running,
        gameOver: state.gameOver,
        dungeonReady: state.dungeonReady,
        inventory: structuredClone(state.inventory ?? []),
        inventoryCapacity: state.inventoryCapacity,
        level: state.level,
        xp: state.xp,
        xpToNext: state.xpToNext,
        bossDefeated: state.bossDefeated,
        bossWarning: ''
      },
      player: state.player ? {
        x: state.player.x,
        y: state.player.y,
        radius: state.player.radius,
        speed: state.player.speed,
        maxHp: state.player.maxHp,
        hp: state.player.hp,
        damage: state.player.damage,
        attackRange: state.player.attackRange,
        attackCooldown: state.player.attackCooldown,
        attackTimer: state.player.attackTimer,
        invulnerability: state.player.invulnerability
      } : null,
      enemies: state.enemies.map(enemy => ({
        x: enemy.x, y: enemy.y, typeId: enemy.typeId,
        radius: enemy.radius, speed: enemy.speed,
        maxHp: enemy.maxHp, hp: enemy.hp, damage: enemy.damage,
        attackCooldown: enemy.attackCooldown, attackTimer: enemy.attackTimer,
        xp: enemy.xp, color: enemy.color, aiTime: enemy.aiTime,
        hitFlash: enemy.hitFlash, hitstun: enemy.hitstun,
        knockbackX: enemy.knockbackX, knockbackY: enemy.knockbackY
      })),
      boss: state.boss ? {
        x: state.boss.x, y: state.boss.y, id: state.boss.id,
        phase: state.boss.phase, maxHp: state.boss.maxHp, hp: state.boss.hp,
        speed: state.boss.speed, damage: state.boss.damage,
        attackCooldown: state.boss.attackCooldown, attackTimer: state.boss.attackTimer,
        xp: state.boss.xp, reward: state.boss.reward, color: state.boss.color,
        aiTime: state.boss.aiTime, telegraph: state.boss.telegraph,
        chargeCooldown: state.boss.chargeCooldown, chargeTimer: state.boss.chargeTimer
      } : null,
      dungeon: dungeon ? {
        width: dungeon.width,
        height: dungeon.height,
        tiles: [...dungeon.tiles]
      } : null
    };
  }

  save() {
    try {
      const snapshot = this.buildSnapshot();
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
      return true;
    } catch (error) {
      console.error('Falha ao salvar a partida:', error);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const snapshot = JSON.parse(raw);
      if (snapshot.version !== 1) return false;

      const state = this.game.state;
      state.score = snapshot.state.score;
      state.time = snapshot.state.time;
      state.wave = snapshot.state.wave;
      state.spawnTimer = snapshot.state.spawnTimer;
      state.running = snapshot.state.running;
      state.gameOver = snapshot.state.gameOver;
      state.dungeonReady = snapshot.state.dungeonReady;
      state.inventory = snapshot.state.inventory ?? [];
      state.inventoryCapacity = snapshot.state.inventoryCapacity ?? 12;
      state.level = snapshot.state.level ?? 1;
      state.xp = snapshot.state.xp ?? 0;
      state.xpToNext = snapshot.state.xpToNext ?? 60;
      state.bossDefeated = snapshot.state.bossDefeated ?? false;
      state.bossWarning = '';
      state.projectiles = [];
      state.enemies = [];
      state.boss = null;

      if (snapshot.dungeon) {
        this.game.dungeon.map = new DungeonMap(
          snapshot.dungeon.width,
          snapshot.dungeon.height,
          [...snapshot.dungeon.tiles]
        );
        state.dungeon = this.game.dungeon.map;
      }

      if (snapshot.player) {
        state.player = new Player(snapshot.player.x, snapshot.player.y);
        Object.assign(state.player, snapshot.player);
      }

      state.enemies = (snapshot.enemies ?? []).map(data => {
        const enemy = new Enemy(data.x, data.y, 1, data.typeId);
        Object.assign(enemy, data);
        return enemy;
      });

      if (snapshot.boss) {
        const boss = new Boss(snapshot.boss.x, snapshot.boss.y, snapshot.boss.id, 1);
        Object.assign(boss, snapshot.boss);
        state.boss = boss;
      }

      state.playerTerrain = this.game.terrain.detectEntity(state.player);
      this.game.inventoryUI.render();
      return true;
    } catch (error) {
      console.error('Falha ao carregar a partida:', error);
      return false;
    }
  }

  exists() {
    return localStorage.getItem(SAVE_KEY) !== null;
  }
}

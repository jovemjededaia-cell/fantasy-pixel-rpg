import { GameState } from './GameState.js';
import { Input } from './Input.js';
import { Renderer } from './Renderer.js';
import { GameLoop } from './GameLoop.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { DungeonSystem } from '../systems/DungeonSystem.js';
import { DungeonCollisionSystem } from '../systems/DungeonCollisionSystem.js';
import { TerrainSystem } from '../systems/TerrainSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { ProgressionSystem } from '../systems/ProgressionSystem.js';
import { InventoryUI } from '../ui/InventoryUI.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = new GameState();
    this.input = new Input(canvas);
    this.renderer = new Renderer(canvas);
    this.state.input = this.input;
    this.dungeon = new DungeonSystem(this.state, this.renderer);
    this.dungeonCollision = new DungeonCollisionSystem(this.dungeon);
    this.terrain = new TerrainSystem(this.dungeon);
    this.inventory = new InventorySystem(this.state);
    this.progression = new ProgressionSystem(this.state);
    this.combat = new CombatSystem(this.state, this.dungeonCollision, this.progression, this.inventory);
    this.inventoryUI = new InventoryUI(this);
    this.saveSystem = new SaveSystem(this);
    this.loop = new GameLoop(dt => this.update(dt), () => this.render());

    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if (key === 'r' && this.state.gameOver) {
        this.reset();
        return;
      }
      if (key === 'f6') {
        e.preventDefault();
        this.saveSystem.save();
        this.state.saveNotice = 'Jogo salvo!';
        this.state.saveNoticeTime = 1.5;
      }
      if (key === 'f10') {
        e.preventDefault();
        if (this.saveSystem.load()) {
          this.state.saveNotice = 'Jogo carregado!';
          this.state.saveNoticeTime = 1.5;
        } else {
          this.state.saveNotice = 'Nenhum save encontrado.';
          this.state.saveNoticeTime = 1.5;
        }
      }
    });
  }

  start() { this.reset(); this.loop.start(); }

  reset() {
    this.state.reset();
    this.state.input = this.input;
    this.inventory.reset();
    this.inventoryUI.toggle(false);
    this.state.running = true;
    const columns = Math.floor(this.canvas.width / this.dungeon.tileSize);
    const rows = Math.floor(this.canvas.height / this.dungeon.tileSize);
    this.dungeon.generate(columns, rows);
    this.state.dungeonReady = true;
    const spawn = this.dungeon.findWalkableSpawn();
    this.state.player = new Player(spawn.x, spawn.y);
    this.progression.reset(this.state.player);
    this.state.playerTerrain = this.terrain.detectEntity(this.state.player);
    this.spawnEnemy();
  }

  spawnEnemy() {
    const spawn = this.dungeon.findWalkableSpawn(this.state.player);
    const roll = Math.random();
    const type = roll < 0.55 ? 'slime' : roll < 0.85 ? 'bat' : 'guardian';
    this.state.enemies.push(new Enemy(spawn.x, spawn.y, this.state.wave, type));
  }

  spawnBoss() {
    if (this.state.boss) return;
    const spawn = this.dungeon.findWalkableSpawn(this.state.player);
    const id = this.state.wave >= 10 ? 'ancientCore' : 'dungeonGuardian';
    this.state.boss = new Boss(spawn.x, spawn.y, id, this.state.wave);
    this.state.bossRewardClaimed = false;
    this.state.bossWarning = `${this.state.boss.name} apareceu!`;
  }

  usePotion() {
    if (!this.state.inventory.find(item => item.id === 'smallPotion')) return;
    if (this.state.player.hp >= this.state.player.maxHp) return;
    this.state.player.heal(25);
    this.inventory.remove('smallPotion');
  }

  update(dt) {
    if (!this.state.running) { this.input.endFrame(); return; }
    this.state.time += dt;
    this.state.saveNoticeTime = Math.max(0, (this.state.saveNoticeTime ?? 0) - dt);

    this.state.player.update(dt, this.input, this.canvas.width, this.canvas.height, this.dungeonCollision);
    this.state.playerTerrain = this.terrain.detectEntity(this.state.player);

    if (this.input.pressed('i')) this.inventoryUI.toggle();
    if (this.input.pressed('e')) this.usePotion();
    if (!this.inventoryUI.root.classList.contains('hidden')) this.inventoryUI.render();

    this.combat.update(dt);

    this.state.spawnTimer -= dt;
    const interval = Math.max(0.35, 1.4 - this.state.wave * 0.06);
    if (!this.state.boss && this.state.spawnTimer <= 0) {
      this.spawnEnemy();
      this.state.spawnTimer = interval;
    }

    const newWave = 1 + Math.floor(this.state.score / 8);
    if (newWave !== this.state.wave) {
      this.state.wave = newWave;
      if (newWave % 5 === 0) this.spawnBoss();
    }

    if (this.state.boss?.hp <= 0) this.state.boss = null;
    if (this.state.player.hp <= 0) { this.state.running = false; this.state.gameOver = true; }
    this.input.endFrame();
  }

  render() {
    const { ctx } = this.renderer;
    this.renderer.clear();
    ctx.fillStyle = '#0b0e13';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.dungeon.draw(ctx);

    for (const projectile of this.state.projectiles) {
      ctx.beginPath(); ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f7d774'; ctx.fill();
    }

    for (const enemy of this.state.enemies) {
      ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      ctx.fillStyle = enemy.hitFlash > 0 ? '#fff' : enemy.color; ctx.fill();
      ctx.fillStyle = '#30151a'; ctx.fillRect(enemy.x - 15, enemy.y - 22, 30, 4);
      ctx.fillStyle = '#72d66d'; ctx.fillRect(enemy.x - 15, enemy.y - 22, 30 * (enemy.hp / enemy.maxHp), 4);
    }

    if (this.state.boss) {
      const boss = this.state.boss;
      ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.radius + (boss.phase === 3 ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = boss.telegraph > 0 ? '#fff3bf' : boss.hitFlash > 0 ? '#fff' : boss.color;
      ctx.fill();
      ctx.fillStyle = '#30151a'; ctx.fillRect(boss.x - 52, boss.y - 48, 104, 7);
      ctx.fillStyle = '#e85b67'; ctx.fillRect(boss.x - 52, boss.y - 48, 104 * (boss.hp / boss.maxHp), 7);
      this.renderer.text(`${boss.name} — ${boss.phaseLabel}`, boss.x, boss.y - 58, 12, 'center');
    }

    const player = this.state.player;
    if (player) {
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = player.invulnerability > 0 ? '#fff' : '#5da9ff'; ctx.fill();
      ctx.strokeStyle = '#dcecff'; ctx.stroke();
    }

    const terrainName = this.state.playerTerrain?.name ?? 'Desconhecido';
    ctx.fillStyle = 'rgba(0,0,0,.62)'; ctx.fillRect(14, 14, 390, 126);
    this.renderer.text(`HP: ${Math.ceil(player.hp)}/${player.maxHp}`, 28, 38);
    this.renderer.text(`Nível: ${this.state.level}`, 28, 60);
    this.renderer.text(`XP: ${this.state.xp}/${this.state.xpToNext}`, 120, 60);
    this.renderer.text(`Derrotados: ${this.state.score}`, 28, 82);
    this.renderer.text(`Onda: ${this.state.wave}`, 170, 82);
    this.renderer.text(`Poções: ${this.inventory.count('smallPotion')} [E]`, 28, 104, 12);
    this.renderer.text(`Terreno: ${terrainName}`, 28, 124, 12);
    this.renderer.text('F6 salvar • F10 carregar', this.canvas.width - 24, this.canvas.height - 18, 12, 'right');

    if (this.state.saveNoticeTime > 0) {
      this.renderer.text(this.state.saveNotice, this.canvas.width / 2, 76, 16, 'center');
    }

    if (this.state.bossWarning) {
      this.renderer.text(this.state.bossWarning, this.canvas.width / 2, 48, 22, 'center');
      if (this.state.boss?.phaseChanged) {
        this.state.bossWarning = `${this.state.boss.name} entrou na ${this.state.boss.phaseLabel}!`;
        this.state.boss.phaseChanged = false;
      } else if (this.state.boss) {
        this.state.bossWarning = '';
      }
    }

    if (this.state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      this.renderer.text('GAME OVER', this.canvas.width/2, 230, 42, 'center');
      this.renderer.text(`Nível ${this.state.level} • ${this.state.score} derrotados`, this.canvas.width/2, 270, 18, 'center');
      this.renderer.text('Pressione R para reiniciar', this.canvas.width/2, 310, 18, 'center');
    }
  }
}

import { GameState } from './GameState.js';
import { Input } from './Input.js';
import { Renderer } from './Renderer.js';
import { GameLoop } from './GameLoop.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { DungeonSystem } from '../systems/DungeonSystem.js';
import { DungeonCollisionSystem } from '../systems/DungeonCollisionSystem.js';
import { TerrainSystem } from '../systems/TerrainSystem.js';

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
    this.combat = new CombatSystem(this.state);
    this.loop = new GameLoop(dt => this.update(dt), () => this.render());

    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'r' && this.state.gameOver) this.reset();
    });
  }

  start() { this.reset(); this.loop.start(); }

  reset() {
    this.state.reset();
    this.state.input = this.input;
    this.state.running = true;

    const columns = Math.floor(this.canvas.width / this.dungeon.tileSize);
    const rows = Math.floor(this.canvas.height / this.dungeon.tileSize);
    this.dungeon.generate(columns, rows);
    this.state.dungeonReady = true;

    const spawn = this.dungeon.findWalkableSpawn();
    this.state.player = new Player(spawn.x, spawn.y);
    this.state.playerTerrain = this.terrain.detectEntity(this.state.player);
    this.spawnEnemy();
  }

  spawnEnemy() {
    const spawn = this.dungeon.findWalkableSpawn(this.state.player);
    this.state.enemies.push(new Enemy(spawn.x, spawn.y, this.state.wave));
  }

  update(dt) {
    if (!this.state.running) return;
    this.state.time += dt;
    this.state.player.update(dt, this.input, this.canvas.width, this.canvas.height, this.dungeonCollision);
    this.state.playerTerrain = this.terrain.detectEntity(this.state.player);
    this.combat.update(dt);

    this.state.spawnTimer -= dt;
    const interval = Math.max(0.35, 1.4 - this.state.wave * 0.06);
    if (this.state.spawnTimer <= 0) {
      this.spawnEnemy();
      this.state.spawnTimer = interval;
    }

    this.state.wave = 1 + Math.floor(this.state.score / 8);
    if (this.state.player.hp <= 0) {
      this.state.running = false;
      this.state.gameOver = true;
    }
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
      ctx.fillStyle = enemy.hitFlash > 0 ? '#fff' : '#d94b5b'; ctx.fill();
      ctx.fillStyle = '#30151a'; ctx.fillRect(enemy.x - 15, enemy.y - 22, 30, 4);
      ctx.fillStyle = '#72d66d'; ctx.fillRect(enemy.x - 15, enemy.y - 22, 30 * (enemy.hp / enemy.maxHp), 4);
    }

    const player = this.state.player;
    if (player) {
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = player.invulnerability > 0 ? '#fff' : '#5da9ff'; ctx.fill();
      ctx.strokeStyle = '#dcecff'; ctx.stroke();
    }

    const terrainName = this.state.playerTerrain?.name ?? 'Desconhecido';
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(14, 14, 330, 88);
    this.renderer.text(`HP: ${Math.ceil(this.state.player.hp)}/${this.state.player.maxHp}`, 28, 38);
    this.renderer.text(`Derrotados: ${this.state.score}`, 28, 60);
    this.renderer.text(`Onda: ${this.state.wave}`, 160, 60);
    this.renderer.text(`Terreno: ${terrainName}`, 28, 82, 12);

    if (this.state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      this.renderer.text('GAME OVER', this.canvas.width/2, 230, 42, 'center');
      this.renderer.text(`Inimigos derrotados: ${this.state.score}`, this.canvas.width/2, 270, 18, 'center');
      this.renderer.text('Pressione R para reiniciar', this.canvas.width/2, 310, 18, 'center');
    }
  }
}

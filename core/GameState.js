export class GameState {
  constructor() { this.reset(); }

  reset() {
    this.running = false;
    this.gameOver = false;
    this.score = 0;
    this.time = 0;
    this.wave = 1;
    this.spawnTimer = 0;
    this.enemies = [];
    this.projectiles = [];
    this.effects = [];
    this.player = null;
    this.dungeon = null;
    this.dungeonReady = false;
  }
}

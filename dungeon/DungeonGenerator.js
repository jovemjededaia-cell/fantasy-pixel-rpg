import { WFC } from './WFC.js';
import { DungeonMap } from './DungeonMap.js';
import { validateDungeon } from './DungeonValidator.js';

export class DungeonGenerator {
  constructor({ width = 24, height = 24, maxAttempts = 12 } = {}) {
    this.width = width;
    this.height = height;
    this.maxAttempts = maxAttempts;
  }

  generate() {
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      const solver = new WFC(this.width, this.height);
      const status = solver.run();
      if (status.contradiction || !status.finished) continue;

      const map = new DungeonMap(this.width, this.height, solver.toTileMap());
      const validation = validateDungeon(map);
      if (validation.valid) {
        return { map, attempts: attempt, validation };
      }
    }

    throw new Error(`Não foi possível gerar uma dungeon válida após ${this.maxAttempts} tentativas.`);
  }
}

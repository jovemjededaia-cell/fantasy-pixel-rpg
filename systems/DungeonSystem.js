import { DungeonGenerator } from '../dungeon/DungeonGenerator.js';
import { DUNGEON_TILES } from '../dungeon/TileSet.js';

export class DungeonSystem {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.tileSize = 32;
    this.map = null;
  }

  generate(width, height) {
    const result = new DungeonGenerator({ width, height }).generate();
    this.map = result.map;
    this.state.dungeon = this.map;
    return result;
  }

  draw(ctx) {
    if (!this.map) return;
    const size = this.tileSize;

    this.map.forEach((tileIndex, x, y) => {
      const tile = DUNGEON_TILES[tileIndex];
      const px = x * size;
      const py = y * size;

      ctx.fillStyle = this.colorFor(tile.kind);
      ctx.fillRect(px, py, size, size);

      if (tile.kind === 'floor') {
        ctx.fillStyle = 'rgba(255,255,255,.035)';
        ctx.fillRect(px + 2, py + 2, size - 4, 2);
      }
    });
  }

  colorFor(kind) {
    switch (kind) {
      case 'wall': return '#252833';
      case 'water': return '#1c4f6e';
      case 'lava': return '#7c2f25';
      case 'grass': return '#31552b';
      default: return '#6b5945';
    }
  }
}

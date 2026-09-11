import { RoomCorridorGenerator } from '../dungeon/RoomCorridorGenerator.js';
import { DUNGEON_TILES } from '../dungeon/TileSet.js';

export class DungeonSystem {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.tileSize = 32;
    this.map = null;
    this.rooms = [];
    this.start = null;
    this.exit = null;
  }

  generate(width, height) {
    const result = new RoomCorridorGenerator({
      width,
      height,
      maxRooms: Math.max(6, Math.min(10, Math.floor(width * height / 70)))
    }).generate();

    this.map = result.map;
    this.rooms = result.rooms;
    this.start = result.start;
    this.exit = result.exit;
    this.state.dungeon = this.map;
    this.state.dungeonStart = this.start;
    this.state.dungeonExit = this.exit;
    return result;
  }

  isWalkable(x, y) {
    if (!this.map) return false;
    const tile = DUNGEON_TILES[this.map.get(x, y)];
    return !!tile && tile.kind !== 'wall' && tile.kind !== 'lava';
  }

  findWalkableSpawn(avoidEntity = null) {
    if (!this.map) return { x: this.tileSize / 2, y: this.tileSize / 2 };

    const candidates = [];
    this.map.forEach((tileIndex, x, y) => {
      if (!this.isWalkable(x, y)) return;
      const px = x * this.tileSize + this.tileSize / 2;
      const py = y * this.tileSize + this.tileSize / 2;
      if (avoidEntity) {
        const dx = px - avoidEntity.x;
        const dy = py - avoidEntity.y;
        if (dx * dx + dy * dy < 160 * 160) return;
      }
      candidates.push({ x: px, y: py });
    });

    return candidates[Math.floor(Math.random() * candidates.length)] || {
      x: this.tileSize / 2,
      y: this.tileSize / 2
    };
  }

  getPointWorld(point) {
    if (!point) return null;
    return {
      x: point.x * this.tileSize + this.tileSize / 2,
      y: point.y * this.tileSize + this.tileSize / 2
    };
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

    this.drawMarker(ctx, this.start, '#6de58a', 'ENTRADA');
    this.drawMarker(ctx, this.exit, '#f2d36b', 'SAÍDA');
  }

  drawMarker(ctx, point, color, label) {
    if (!point) return;
    const x = point.x * this.tileSize + this.tileSize / 2;
    const y = point.y * this.tileSize + this.tileSize / 2;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 9, y - 9, 18, 18);
    ctx.fillStyle = color;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 13);
    ctx.restore();
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

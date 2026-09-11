import { DUNGEON_TILES } from '../dungeon/TileSet.js';

export class DungeonCollisionSystem {
  constructor(dungeonSystem) {
    this.dungeon = dungeonSystem;
  }

  isSolidTile(tileIndex) {
    const tile = DUNGEON_TILES[tileIndex];
    return !tile || tile.kind === 'wall' || tile.kind === 'lava';
  }

  circleHitsWall(x, y, radius) {
    const map = this.dungeon.map;
    const size = this.dungeon.tileSize;
    if (!map) return false;

    const minX = Math.floor((x - radius) / size);
    const maxX = Math.floor((x + radius) / size);
    const minY = Math.floor((y - radius) / size);
    const maxY = Math.floor((y + radius) / size);

    for (let ty = minY; ty <= maxY; ty++) {
      for (let tx = minX; tx <= maxX; tx++) {
        if (!map.inBounds(tx, ty)) return true;
        if (!this.isSolidTile(map.get(tx, ty))) continue;

        const left = tx * size;
        const top = ty * size;
        const right = left + size;
        const bottom = top + size;

        const closestX = Math.max(left, Math.min(x, right));
        const closestY = Math.max(top, Math.min(y, bottom));
        const dx = x - closestX;
        const dy = y - closestY;

        if (dx * dx + dy * dy < radius * radius) return true;
      }
    }

    return false;
  }

  moveCircle(entity, dx, dy) {
    const nextX = entity.x + dx;
    if (!this.circleHitsWall(nextX, entity.y, entity.radius)) {
      entity.x = nextX;
    }

    const nextY = entity.y + dy;
    if (!this.circleHitsWall(entity.x, nextY, entity.radius)) {
      entity.y = nextY;
    }
  }
}

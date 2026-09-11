import { DUNGEON_TILES } from '../dungeon/TileSet.js';

export class TerrainSystem {
  constructor(dungeonSystem) {
    this.dungeon = dungeonSystem;
  }

  getTileAtWorld(x, y) {
    const map = this.dungeon.map;
    const size = this.dungeon.tileSize;
    if (!map) return null;

    const tx = Math.floor(x / size);
    const ty = Math.floor(y / size);
    if (!map.inBounds(tx, ty)) return null;

    const tileIndex = map.get(tx, ty);
    const tile = DUNGEON_TILES[tileIndex];
    if (!tile) return null;

    return { x: tx, y: ty, index: tileIndex, id: tile.id, name: tile.name, kind: tile.kind };
  }

  getTerrainAt(x, y) {
    return this.getTileAtWorld(x, y)?.kind ?? null;
  }

  isFloor(x, y) { return this.getTerrainAt(x, y) === 'floor'; }
  isWater(x, y) { return this.getTerrainAt(x, y) === 'water'; }
  isLava(x, y) { return this.getTerrainAt(x, y) === 'lava'; }
  isGrass(x, y) { return this.getTerrainAt(x, y) === 'grass'; }

  detectEntity(entity) {
    return this.getTileAtWorld(entity.x, entity.y);
  }
}

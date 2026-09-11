import { DUNGEON_TILES, DIRS, OPP } from './TileSet.js';

export function isWalkable(tileIndex) {
  const tile = DUNGEON_TILES[tileIndex];
  return !!tile && tile.kind !== 'wall' && tile.kind !== 'lava';
}

export function validateDungeon(map) {
  const errors = [];

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const a = map.get(x, y);
      if (a == null || !DUNGEON_TILES[a]) {
        errors.push(`Tile inválido em ${x},${y}`);
        continue;
      }

      for (let direction = 0; direction < 4; direction++) {
        const nx = x + DIRS[direction][0];
        const ny = y + DIRS[direction][1];
        if (!map.inBounds(nx, ny)) continue;

        const b = map.get(nx, ny);
        if (DUNGEON_TILES[a].edges[direction] !== DUNGEON_TILES[b].edges[OPP[direction]]) {
          errors.push(`Borda incompatível em ${x},${y}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

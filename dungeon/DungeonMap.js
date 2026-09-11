export class DungeonMap {
  constructor(width, height, tileMap = []) {
    this.width = width;
    this.height = height;
    this.tiles = tileMap;
  }

  index(x, y) { return y * this.width + x; }
  inBounds(x, y) { return x >= 0 && y >= 0 && x < this.width && y < this.height; }
  get(x, y) { return this.inBounds(x, y) ? this.tiles[this.index(x, y)] : null; }
  set(x, y, tile) { if (this.inBounds(x, y)) this.tiles[this.index(x, y)] = tile; }

  forEach(callback) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) callback(this.get(x, y), x, y);
    }
  }
}

import { DUNGEON_TILES, DIRS, tilesMatch } from './TileSet.js';

export class WFC {
  constructor(width, height, tiles = DUNGEON_TILES) {
    this.width = width;
    this.height = height;
    this.tiles = tiles;
    this.reset();
  }

  reset() {
    const all = this.tiles.map((_, index) => index);
    this.cells = Array.from({ length: this.width * this.height }, () => ({
      options: [...all],
      tile: -1
    }));
    this.collapsed = 0;
    this.contradiction = false;
    this.finished = false;
  }

  index(x, y) { return y * this.width + x; }
  coords(index) { return [index % this.width, Math.floor(index / this.width)]; }

  entropy(cell) {
    if (cell.tile >= 0) return Infinity;
    return cell.options.length + Math.random() * 0.01;
  }

  observe() {
    let best = -1;
    let entropy = Infinity;

    for (let i = 0; i < this.cells.length; i++) {
      const value = this.entropy(this.cells[i]);
      if (value < entropy) {
        entropy = value;
        best = i;
      }
    }

    if (best < 0) {
      this.finished = true;
      return true;
    }

    const cell = this.cells[best];
    const tile = this.weightedChoice(cell.options);
    cell.tile = tile;
    cell.options = [tile];
    this.collapsed++;

    return this.propagate(best);
  }

  weightedChoice(options) {
    const total = options.reduce((sum, index) => sum + (this.tiles[index].weight ?? 1), 0);
    let roll = Math.random() * total;
    for (const index of options) {
      roll -= this.tiles[index].weight ?? 1;
      if (roll <= 0) return index;
    }
    return options[options.length - 1];
  }

  propagate(startIndex) {
    const queue = [startIndex];
    const queued = new Set([startIndex]);

    while (queue.length) {
      const current = queue.shift();
      queued.delete(current);
      const [x, y] = this.coords(current);

      for (let direction = 0; direction < 4; direction++) {
        const nx = x + DIRS[direction][0];
        const ny = y + DIRS[direction][1];
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;

        const neighborIndex = this.index(nx, ny);
        const neighbor = this.cells[neighborIndex];
        if (neighbor.tile >= 0) continue;

        const before = neighbor.options.length;
        neighbor.options = neighbor.options.filter(candidate =>
          this.cells[current].options.some(source => tilesMatch(source, candidate, direction))
        );

        if (neighbor.options.length === 0) {
          this.contradiction = true;
          return false;
        }

        if (neighbor.options.length === 1) {
          neighbor.tile = neighbor.options[0];
          this.collapsed++;
        }

        if (neighbor.options.length < before && !queued.has(neighborIndex)) {
          queue.push(neighborIndex);
          queued.add(neighborIndex);
        }
      }
    }

    if (this.collapsed >= this.cells.length) this.finished = true;
    return true;
  }

  step() {
    if (this.finished || this.contradiction) return this.status();
    this.observe();
    return this.status();
  }

  run(maxSteps = this.width * this.height * 4) {
    for (let i = 0; i < maxSteps && !this.finished && !this.contradiction; i++) this.step();
    return this.status();
  }

  status() {
    return {
      collapsed: this.collapsed,
      total: this.cells.length,
      finished: this.finished,
      contradiction: this.contradiction
    };
  }

  toTileMap() {
    return this.cells.map(cell => cell.tile >= 0 ? cell.tile : 0);
  }
}

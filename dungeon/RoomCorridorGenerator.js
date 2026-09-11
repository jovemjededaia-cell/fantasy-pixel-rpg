import { DungeonMap } from './DungeonMap.js';

const FLOOR = 0;
const WALL = 1;
const WALL_T = 2;
const WALL_R = 3;
const WALL_B = 4;
const WALL_L = 5;
const CORNER_TL = 6;
const CORNER_TR = 7;
const CORNER_BL = 8;
const CORNER_BR = 9;

export class RoomCorridorGenerator {
  constructor({ width, height, maxRooms = 9 } = {}) {
    this.width = width;
    this.height = height;
    this.maxRooms = maxRooms;
  }

  generate() {
    const grid = new Array(this.width * this.height).fill(WALL);
    const rooms = [];
    const attempts = this.maxRooms * 8;

    for (let i = 0; i < attempts && rooms.length < this.maxRooms; i++) {
      const room = this.randomRoom();
      if (!room || this.overlapsTooMuch(room, rooms)) continue;

      this.carveRoom(grid, room);
      if (rooms.length > 0) {
        const previous = rooms[rooms.length - 1];
        this.carveCorridor(grid, this.center(previous), this.center(room));
      }
      rooms.push(room);
    }

    if (rooms.length < 2) {
      const fallback = this.createFallbackRooms(grid);
      rooms.push(...fallback);
    }

    // Add a few extra connections so the dungeon is less linear.
    for (let i = 2; i < rooms.length; i += 3) {
      const a = rooms[i - 2];
      const b = rooms[i];
      this.carveCorridor(grid, this.center(a), this.center(b));
    }

    const tiles = this.buildWallVariants(grid);
    const map = new DungeonMap(this.width, this.height, tiles);

    const start = this.center(rooms[0]);
    const exit = this.center(rooms[rooms.length - 1]);

    return {
      map,
      rooms,
      start: { x: start.x, y: start.y },
      exit: { x: exit.x, y: exit.y }
    };
  }

  randomRoom() {
    const minW = 4;
    const maxW = Math.min(8, this.width - 4);
    const minH = 4;
    const maxH = Math.min(7, this.height - 4);
    if (maxW < minW || maxH < minH) return null;

    const w = minW + Math.floor(Math.random() * (maxW - minW + 1));
    const h = minH + Math.floor(Math.random() * (maxH - minH + 1));
    const x = 1 + Math.floor(Math.random() * Math.max(1, this.width - w - 1));
    const y = 1 + Math.floor(Math.random() * Math.max(1, this.height - h - 1));
    return { x, y, w, h };
  }

  overlapsTooMuch(room, rooms) {
    return rooms.some(other => {
      const separated =
        room.x + room.w + 1 < other.x ||
        other.x + other.w + 1 < room.x ||
        room.y + room.h + 1 < other.y ||
        other.y + other.h + 1 < room.y;
      return !separated;
    });
  }

  carveRoom(grid, room) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) this.set(grid, x, y, FLOOR);
    }
  }

  carveCorridor(grid, a, b) {
    let x = a.x;
    let y = a.y;
    const horizontalFirst = Math.random() < 0.5;

    if (horizontalFirst) {
      while (x !== b.x) { this.set(grid, x, y, FLOOR); x += Math.sign(b.x - x); }
      while (y !== b.y) { this.set(grid, x, y, FLOOR); y += Math.sign(b.y - y); }
    } else {
      while (y !== b.y) { this.set(grid, x, y, FLOOR); y += Math.sign(b.y - y); }
      while (x !== b.x) { this.set(grid, x, y, FLOOR); x += Math.sign(b.x - x); }
    }
    this.set(grid, b.x, b.y, FLOOR);
  }

  createFallbackRooms(grid) {
    const a = { x: 2, y: 2, w: 6, h: 5 };
    const b = { x: Math.max(2, this.width - 8), y: Math.max(2, this.height - 7), w: 6, h: 5 };
    this.carveRoom(grid, a);
    this.carveRoom(grid, b);
    this.carveCorridor(grid, this.center(a), this.center(b));
    return [a, b];
  }

  center(room) {
    return {
      x: Math.floor(room.x + room.w / 2),
      y: Math.floor(room.y + room.h / 2)
    };
  }

  set(grid, x, y, value) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      grid[y * this.width + x] = value;
    }
  }

  get(grid, x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return WALL;
    return grid[y * this.width + x];
  }

  buildWallVariants(grid) {
    const tiles = new Array(grid.length).fill(FLOOR);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.get(grid, x, y) === FLOOR) {
          tiles[y * this.width + x] = FLOOR;
          continue;
        }

        const north = this.get(grid, x, y - 1) === FLOOR;
        const east = this.get(grid, x + 1, y) === FLOOR;
        const south = this.get(grid, x, y + 1) === FLOOR;
        const west = this.get(grid, x - 1, y) === FLOOR;

        if (south && east) tiles[y * this.width + x] = CORNER_TL;
        else if (south && west) tiles[y * this.width + x] = CORNER_TR;
        else if (north && east) tiles[y * this.width + x] = CORNER_BL;
        else if (north && west) tiles[y * this.width + x] = CORNER_BR;
        else if (south) tiles[y * this.width + x] = WALL_T;
        else if (west) tiles[y * this.width + x] = WALL_R;
        else if (north) tiles[y * this.width + x] = WALL_B;
        else if (east) tiles[y * this.width + x] = WALL_L;
        else tiles[y * this.width + x] = WALL;
      }
    }

    return tiles;
  }
}

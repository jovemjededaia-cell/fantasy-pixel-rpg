import { getSpriteConfig } from '../data/sprites.js';

export class SpriteSystem {
  constructor() {
    this.cache = new Map();
  }

  get(id) {
    const config = getSpriteConfig(id);
    if (!config?.sheet) return null;
    if (this.cache.has(id)) return this.cache.get(id);

    const image = new Image();
    image.decoding = 'async';
    image.src = config.sheet;
    const record = { image, loaded: false, failed: false };
    image.onload = () => { record.loaded = true; };
    image.onerror = () => { record.failed = true; };
    this.cache.set(id, record);
    return record;
  }

  draw(ctx, id, x, y, size, frame = 0, columns = 4, rows = 4) {
    const record = this.get(id);
    if (!record || !record.loaded || record.failed) return false;

    const { image } = record;
    const frameWidth = image.width / columns;
    const frameHeight = image.height / rows;
    const sx = (frame % columns) * frameWidth;
    const sy = Math.floor(frame / columns) * frameHeight;

    ctx.drawImage(image, sx, sy, frameWidth, frameHeight, x - size / 2, y - size / 2, size, size);
    return true;
  }
}

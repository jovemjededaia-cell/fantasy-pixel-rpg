export class SpriteSystem {
  constructor() {
    this.cache = new Map();
  }

  load(id, url) {
    if (this.cache.has(id)) return this.cache.get(id);
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    const record = { image, loaded: false, failed: false };
    image.onload = () => { record.loaded = true; };
    image.onerror = () => { record.failed = true; };
    this.cache.set(id, record);
    return record;
  }

  draw(ctx, id, url, x, y, size, frame = 0, columns = 4, rows = 4) {
    const sprite = this.load(id, url);
    if (!sprite.loaded || sprite.failed) return false;

    const image = sprite.image;
    const frameWidth = image.width / columns;
    const frameHeight = image.height / rows;
    const sx = (frame % columns) * frameWidth;
    const sy = Math.floor(frame / columns) * frameHeight;
    ctx.drawImage(image, sx, sy, frameWidth, frameHeight, x - size / 2, y - size / 2, size, size);
    return true;
  }
}

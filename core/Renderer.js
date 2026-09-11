export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  grid(size = 32) {
    const c = this.ctx;
    c.save();
    c.strokeStyle = 'rgba(255,255,255,.035)';
    c.lineWidth = 1;
    for (let x = 0; x <= this.canvas.width; x += size) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,this.canvas.height); c.stroke(); }
    for (let y = 0; y <= this.canvas.height; y += size) { c.beginPath(); c.moveTo(0,y); c.lineTo(this.canvas.width,y); c.stroke(); }
    c.restore();
  }

  text(text, x, y, size = 16, align = 'left') {
    const c = this.ctx;
    c.font = `${size}px system-ui, sans-serif`;
    c.textAlign = align;
    c.fillStyle = '#f1f3f5';
    c.fillText(text, x, y);
  }
}

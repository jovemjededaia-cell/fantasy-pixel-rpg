export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false };

    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key)) e.preventDefault();
      this.keys.add(key);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));

    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) * canvas.width / r.width;
      this.mouse.y = (e.clientY - r.top) * canvas.height / r.height;
    });
    canvas.addEventListener('pointerdown', () => { this.mouse.down = true; });
    window.addEventListener('pointerup', () => { this.mouse.down = false; });
  }

  movement() {
    let x = 0, y = 0;
    if (this.keys.has('a') || this.keys.has('arrowleft')) x--;
    if (this.keys.has('d') || this.keys.has('arrowright')) x++;
    if (this.keys.has('w') || this.keys.has('arrowup')) y--;
    if (this.keys.has('s') || this.keys.has('arrowdown')) y++;
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  attackPressed() { return this.keys.has(' ') || this.mouse.down; }
}

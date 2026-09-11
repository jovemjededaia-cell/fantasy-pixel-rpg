export class EffectsSystem {
  constructor(state) { this.state = state; }

  spawn(type, x, y, options = {}) {
    this.state.effects ??= [];
    this.state.effects.push({
      type, x, y,
      age: 0,
      life: options.life ?? 0.3,
      damage: options.damage ?? 0,
      critical: !!options.critical
    });
  }

  update(dt) {
    if (!this.state.effects) return;
    for (const effect of this.state.effects) effect.age += dt;
    this.state.effects = this.state.effects.filter(effect => effect.age < effect.life);
  }

  draw(ctx) {
    for (const effect of this.state.effects ?? []) {
      const t = Math.min(1, effect.age / effect.life);
      ctx.save();
      ctx.globalAlpha = 1 - t;

      if (effect.type === 'hit') {
        const radius = 8 + t * 16;
        ctx.strokeStyle = effect.critical ? '#ffd65a' : '#f2f2f2';
        ctx.lineWidth = effect.critical ? 3 : 2;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (effect.type === 'spark') {
        const radius = 4 + t * 10;
        ctx.fillStyle = '#f7d774';
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          ctx.fillRect(effect.x + Math.cos(a) * radius - 1, effect.y + Math.sin(a) * radius - 1, 3, 3);
        }
      }

      ctx.restore();
    }
  }
}

export class ProgressionSystem {
  constructor(state) { this.state = state; }

  reset(player) {
    this.state.level = 1;
    this.state.xp = 0;
    this.state.xpToNext = this.nextXp(1);
    this.state.player = player;
  }

  nextXp(level) { return 60 + (level - 1) * 45; }

  grantXp(amount) {
    const player = this.state.player;
    this.state.xp += amount;
    while (this.state.xp >= this.state.xpToNext) {
      this.state.xp -= this.state.xpToNext;
      this.state.level += 1;
      this.state.xpToNext = this.nextXp(this.state.level);
      player.maxHp += 10;
      player.hp = player.maxHp;
      player.damage += 2;
      player.speed += 3;
    }
  }
}

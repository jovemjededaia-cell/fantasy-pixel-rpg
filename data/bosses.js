export const BOSS_TYPES = Object.freeze({
  dungeonGuardian: {
    id: 'dungeonGuardian', name: 'Guardião da Masmorra',
    hp: 420, speed: 52, damage: 18, attackCooldown: 0.9,
    xp: 180, reward: 'vitalityCharm', color: '#d66b75'
  },
  ancientCore: {
    id: 'ancientCore', name: 'Núcleo Ancestral',
    hp: 650, speed: 42, damage: 22, attackCooldown: 0.75,
    xp: 300, reward: 'powerCharm', color: '#7aa7e8'
  }
});

export function getBossType(id) { return BOSS_TYPES[id] ?? BOSS_TYPES.dungeonGuardian; }

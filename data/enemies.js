export const ENEMY_TYPES = Object.freeze({
  slime: { id: 'slime', name: 'Slime', hp: 34, speed: 62, damage: 7, attackCooldown: 1.0, xp: 12, color: '#65c466' },
  bat: { id: 'bat', name: 'Morcego', hp: 24, speed: 108, damage: 5, attackCooldown: 0.75, xp: 15, color: '#9a78c8' },
  guardian: { id: 'guardian', name: 'Guardião', hp: 72, speed: 48, damage: 12, attackCooldown: 1.2, xp: 28, color: '#c28d62' }
});

export function getEnemyType(id) { return ENEMY_TYPES[id] ?? ENEMY_TYPES.slime; }

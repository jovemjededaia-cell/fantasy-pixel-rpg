export const ITEMS = Object.freeze({
  smallPotion: { id: 'smallPotion', name: 'Poção pequena', type: 'consumable', heal: 25 },
  largePotion: { id: 'largePotion', name: 'Poção grande', type: 'consumable', heal: 60 },
  crystal: { id: 'crystal', name: 'Cristal antigo', type: 'material', value: 20 },
  vitalityCharm: { id: 'vitalityCharm', name: 'Amuleto de vitalidade', type: 'stat', stat: 'maxHp', amount: 15 },
  powerCharm: { id: 'powerCharm', name: 'Amuleto de poder', type: 'stat', stat: 'damage', amount: 3 }
});

export function getItem(id) { return ITEMS[id] ?? null; }

export const SPRITES = Object.freeze({
  player: {
    knight: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/Knight/Knight-Sheet.png'
    }
  },
  enemies: {
    slime: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/Slime/Slime-Sheet.png'
    },
    basicGoblin: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/BasicGoblin/BasicGoblin-Sheet.png'
    },
    advancedGoblin: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/AdvancedGoblin/AdvancedGoblin-Sheet.png'
    },
    eliteGoblin: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/EliteGoblin/EliteGoblin-Sheet.png'
    },
    skeleton: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/Skeleton/Skeleton-Sheet.png'
    },
    reaper: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/Reaper/Reaper-Sheet.png'
    },
    warlock: {
      sheet: 'https://raw.githubusercontent.com/jovemjededaia-cell/prototipo/main/16-bit%20RPG%20Fantasy%20personagens/Tiny%20Fantasy/Assets/Warlock/Warlock-Sheet.png'
    }
  }
});

export function getSpriteConfig(id) {
  if (id === 'knight') return SPRITES.player.knight;
  return SPRITES.enemies[id] ?? null;
}

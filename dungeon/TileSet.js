export const EDGE = Object.freeze({ WALL: 0, FLOOR: 1, WATER: 2, LAVA: 3, GRASS: 4 });

export const DUNGEON_TILES = Object.freeze([
  { id: 'floor', name: 'Chão', edges: [1,1,1,1], kind: 'floor', weight: 8 },
  { id: 'wall', name: 'Parede', edges: [0,0,0,0], kind: 'wall', weight: 2 },
  { id: 'wall-t', name: 'Parede cima', edges: [0,1,1,1], kind: 'wall', weight: 3 },
  { id: 'wall-r', name: 'Parede direita', edges: [1,0,1,1], kind: 'wall', weight: 3 },
  { id: 'wall-b', name: 'Parede baixo', edges: [1,1,0,1], kind: 'wall', weight: 3 },
  { id: 'wall-l', name: 'Parede esquerda', edges: [1,1,1,0], kind: 'wall', weight: 3 },
  { id: 'corner-tl', name: 'Canto superior esquerdo', edges: [0,1,1,0], kind: 'wall', weight: 2 },
  { id: 'corner-tr', name: 'Canto superior direito', edges: [0,0,1,1], kind: 'wall', weight: 2 },
  { id: 'corner-bl', name: 'Canto inferior esquerdo', edges: [1,1,0,0], kind: 'wall', weight: 2 },
  { id: 'corner-br', name: 'Canto inferior direito', edges: [1,0,0,1], kind: 'wall', weight: 2 },
  { id: 'water', name: 'Água', edges: [2,2,2,2], kind: 'water', weight: 1 },
  { id: 'water-t', name: 'Água cima', edges: [1,2,2,2], kind: 'water', weight: 1 },
  { id: 'water-r', name: 'Água direita', edges: [2,1,2,2], kind: 'water', weight: 1 },
  { id: 'water-b', name: 'Água baixo', edges: [2,2,1,2], kind: 'water', weight: 1 },
  { id: 'water-l', name: 'Água esquerda', edges: [2,2,2,1], kind: 'water', weight: 1 },
  { id: 'lava', name: 'Lava', edges: [3,3,3,3], kind: 'lava', weight: 1 },
  { id: 'lava-t', name: 'Lava cima', edges: [1,3,3,3], kind: 'lava', weight: 1 },
  { id: 'lava-r', name: 'Lava direita', edges: [3,1,3,3], kind: 'lava', weight: 1 },
  { id: 'lava-b', name: 'Lava baixo', edges: [3,3,1,3], kind: 'lava', weight: 1 },
  { id: 'lava-l', name: 'Lava esquerda', edges: [3,3,3,1], kind: 'lava', weight: 1 },
  { id: 'grass', name: 'Grama', edges: [4,4,4,4], kind: 'grass', weight: 1 },
  { id: 'grass-t', name: 'Grama cima', edges: [1,4,4,4], kind: 'grass', weight: 1 },
  { id: 'grass-r', name: 'Grama direita', edges: [4,1,4,4], kind: 'grass', weight: 1 },
  { id: 'grass-b', name: 'Grama baixo', edges: [4,4,1,4], kind: 'grass', weight: 1 },
  { id: 'grass-l', name: 'Grama esquerda', edges: [4,4,4,1], kind: 'grass', weight: 1 }
]);

export const DIRS = Object.freeze([[0,-1],[1,0],[0,1],[-1,0]]);
export const OPP = Object.freeze([2,3,0,1]);

export function tilesMatch(a, b, direction) {
  return DUNGEON_TILES[a].edges[direction] === DUNGEON_TILES[b].edges[OPP[direction]];
}

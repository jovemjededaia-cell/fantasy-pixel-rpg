# Fantasy Pixel RPG

Novo repositório oficial do projeto **Fantasy Pixel RPG**.

Este projeto substitui o antigo núcleo monolítico do V28 por uma arquitetura modular em JavaScript ES Modules.

## Estrutura atual

```text
fantasy-pixel-rpg/
├── core/
│   ├── Game.js
│   ├── GameState.js
│   ├── GameLoop.js
│   ├── Input.js
│   └── Renderer.js
├── entities/
│   ├── Player.js
│   ├── Enemy.js
│   └── Projectile.js
├── systems/
│   ├── CombatSystem.js
│   └── CollisionSystem.js
├── data/
│   └── game-version.js
├── index.html
├── style.css
└── game.js
```

## Objetivo

Construir um RPG pixel-art expansível, reaproveitando as melhores ideias das versões anteriores sem carregar a arquitetura monolítica do V28.

### Próximas etapas

1. Sistema de mapa e dungeon procedural.
2. Classes e armas como dados/configuração.
3. Sprites e assets do Fantasy Pixel.
4. Inimigos com comportamentos diferentes.
5. Inventário, itens, loja e progressão.
6. Bosses e salas especiais.
7. Efeitos, áudio, HUD e polimento.

> O repositório `prototipo` continua como referência/backup das versões antigas.

## Execução local

Como o projeto usa ES Modules, execute com um servidor HTTP local. Por exemplo, com VS Code + Live Server, ou outro servidor estático.

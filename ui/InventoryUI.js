import { getItem } from '../data/items.js';

export class InventoryUI {
  constructor(game) {
    this.game = game;
    this.root = document.createElement('aside');
    this.root.className = 'inventory-ui hidden';
    this.root.innerHTML = `
      <div class="inventory-head">
        <strong>🎒 Inventário</strong>
        <button type="button" data-close aria-label="Fechar inventário">×</button>
      </div>
      <div class="inventory-grid" data-grid></div>
      <div class="inventory-footer" data-footer></div>
    `;
    document.querySelector('.game-panel')?.appendChild(this.root);
    this.grid = this.root.querySelector('[data-grid]');
    this.footer = this.root.querySelector('[data-footer]');
    this.root.querySelector('[data-close]')?.addEventListener('click', () => this.toggle(false));
  }

  toggle(force = null) {
    const shouldOpen = force === null ? this.root.classList.contains('hidden') : force;
    this.root.classList.toggle('hidden', !shouldOpen);
    if (shouldOpen) this.render();
  }

  render() {
    const inventory = this.game.state.inventory ?? [];
    const capacity = this.game.state.inventoryCapacity ?? 0;
    this.grid.innerHTML = '';

    for (let i = 0; i < capacity; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      const stack = inventory[i];
      if (stack) {
        const item = getItem(stack.id);
        slot.innerHTML = `<span class="item-name">${item?.name ?? stack.id}</span><span class="item-amount">×${stack.amount}</span>`;
      } else {
        slot.innerHTML = '<span class="empty-slot">vazio</span>';
      }
      this.grid.appendChild(slot);
    }

    this.footer.textContent = `${inventory.length}/${capacity} espaços ocupados • [I] fechar/abrir • [E] usar poção`;
  }
}

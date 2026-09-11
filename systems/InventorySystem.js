export class InventorySystem {
  constructor(state) { this.state = state; }

  reset() {
    this.state.inventory = [];
    this.state.inventoryCapacity = 12;
  }

  add(itemId, amount = 1) {
    const stack = this.state.inventory.find(item => item.id === itemId);
    if (stack) { stack.amount += amount; return true; }
    if (this.state.inventory.length >= this.state.inventoryCapacity) return false;
    this.state.inventory.push({ id: itemId, amount });
    return true;
  }

  remove(itemId, amount = 1) {
    const stack = this.state.inventory.find(item => item.id === itemId);
    if (!stack || stack.amount < amount) return false;
    stack.amount -= amount;
    if (stack.amount <= 0) this.state.inventory = this.state.inventory.filter(item => item !== stack);
    return true;
  }

  count(itemId) { return this.state.inventory.find(item => item.id === itemId)?.amount ?? 0; }
}

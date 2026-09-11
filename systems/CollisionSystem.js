export class CollisionSystem {
  static distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  static overlaps(a, b) { return this.distance(a, b) <= a.radius + b.radius; }
}

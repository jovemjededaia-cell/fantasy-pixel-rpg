export class EnemyAISystem {
  update(enemy, player, dt, collision) {
    if (enemy.typeId === 'bat') {
      return this.updateBat(enemy, player, dt, collision);
    }

    if (enemy.typeId === 'guardian') {
      return this.updateGuardian(enemy, player, dt, collision);
    }

    return this.updateSlime(enemy, player, dt, collision);
  }

  move(enemy, dx, dy, speed, dt, collision) {
    const distance = Math.hypot(dx, dy) || 1;
    const moveX = dx / distance * speed * dt;
    const moveY = dy / distance * speed * dt;

    if (collision) collision.moveCircle(enemy, moveX, moveY);
    else {
      enemy.x += moveX;
      enemy.y += moveY;
    }
  }

  updateSlime(enemy, player, dt, collision) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;

    // Slime: simples, direto e previsível.
    if (distance > enemy.radius + player.radius + 4) {
      this.move(enemy, dx, dy, enemy.speed, dt, collision);
    }

    return distance <= enemy.radius + player.radius + 4;
  }

  updateBat(enemy, player, dt, collision) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;

    enemy.aiTime += dt;

    // O morcego circula o jogador antes de se aproximar.
    const angle = Math.atan2(dy, dx);
    const orbitDirection = Math.sin(enemy.aiTime * 2.4) >= 0 ? 1 : -1;
    const orbitStrength = distance > 150 ? 0.35 : 0.9;
    const desiredAngle = angle + orbitDirection * Math.PI * 0.5 * orbitStrength;
    const targetX = Math.cos(desiredAngle) * distance;
    const targetY = Math.sin(desiredAngle) * distance;

    if (distance > 42) {
      this.move(enemy, targetX, targetY, enemy.speed, dt, collision);
    }

    // Ataques do morcego são curtos e frequentes quando ele consegue encostar.
    return distance <= enemy.radius + player.radius + 8;
  }

  updateGuardian(enemy, player, dt, collision) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;

    // Guardião avança lentamente e para numa distância curta do jogador.
    const preferredDistance = 62;
    if (distance > preferredDistance) {
      this.move(enemy, dx, dy, enemy.speed, dt, collision);
    }

    return distance <= preferredDistance;
  }
}

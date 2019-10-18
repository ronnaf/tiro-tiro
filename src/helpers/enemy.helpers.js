import "phaser";

const BULLET_DAMAGE = 10;

function getEnemy(enemies, x, y, distance) {
  const enemyUnits = enemies.getChildren();

  for (let i = 0; i < enemyUnits.length; i++) {
    if (
      enemyUnits[i].active &&
      Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <=
        distance
    )
      return enemyUnits[i];
  }
  return false;
}

function damageEnemy(enemy, bullet) {
  if (enemy.active === true && bullet.active === true) {
		bullet.destroy(true);
    enemy.takeDamage(BULLET_DAMAGE);
  }
}

export { getEnemy, damageEnemy };

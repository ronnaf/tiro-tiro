function addBullet(bullets, x, y, angle) {
  const bullet = bullets.get();

  if (bullet) {
    bullet.fire(x, y, angle);
  }
}

export { addBullet };

function placeTurret(pointer, turrets, map, playerHealth, decreasePusils, pusils) {
  const i = Math.floor(pointer.y / 96);
  const j = Math.floor(pointer.x / 96);

  if (canPlaceTurret(pusils, playerHealth, map, i, j)) {
    const turret = turrets.get();

    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j);

      decreasePusils()
    }
  }
}

function canPlaceTurret(pusils, playerHealth, map, i, j) {
  return map[i][j] === 0 && playerHealth > 0 && Math.floor(pusils) > 0;
}

export { placeTurret, canPlaceTurret };

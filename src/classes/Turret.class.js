import "phaser";
import { getEnemy } from "../helpers/enemy.helpers";
import { addBullet } from "../helpers/bullet.helpers";

export default class Turret extends Phaser.GameObjects.Image {
  constructor(scene, map, enemies, bullets) {
    super(scene, 0, 0, "turret");
    this.setDepth(0);

    this.bullets = bullets;
    this.enemies = enemies;
    this.map = map;
    this.nextTic = 0;
  }

  place(i, j) {
    this.y = i * 96 + 96 / 2;
    this.x = j * 96 + 96 / 2;
    this.map[i][j] = 1;
  }

  fire() {
    const enemy = getEnemy(this.enemies, this.x, this.y, 200);

    if (enemy) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.bullets, this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  }
}

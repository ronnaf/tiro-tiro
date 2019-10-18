import "phaser";

export default class Bullet extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene, 0, 0, "bullet");

    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(600, 1);
  }

  fire(x, y, angle) {
    this.setActive(true);
    this.setVisible(true);

    this.setPosition(x, y);
    this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 300;
  }

  update(time, delta) {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.destroy(true);
    }
  }
}

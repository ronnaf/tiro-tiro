import "phaser";

export default class Kontra extends Phaser.GameObjects.Sprite {
  constructor(scene, path, damagePlayer, increasePusils) {
    super(scene, 0, 0, "kontra");
    this.setDepth(1);

    this.increasePusils = increasePusils;
    this.damagePlayer = damagePlayer;
    this.ENEMY_SPEED = 1 / 10000;
    this.path = path;
    this.previousX = 0;
    this.previousY = 0;
    this.health = 100;
    this.healthText = new Phaser.GameObjects.Text(scene);
    this.follower = {
      location: 0,
      vector: new Phaser.Math.Vector2()
    };

    scene.add.existing(this.healthText);
  }

  setHealth(health) {
    this.health = health;
  }

  startOnPath() {
    this.follower.location = 0;
    this.path.getPoint(this.follower.location, this.follower.vector);
    this.setPosition(this.follower.vector.x, this.follower.vector.y);
  }

  playSpriteAccordingly(x, y) {
    if (this.previousY < y) {
      this.play("kontra_down", true);
    } else if (this.previousY > y) {
      this.play("kontra_up", true);
    } else if (this.previousX < x) {
      this.play("kontra_right", true);
    } else if (this.previousX > x) {
      this.play("kontra_left", true);
    }
  }

  takeDamage(damage) {
    this.health -= damage;

    if (this.health <= 0) {
      this.health = 0;
      this.destroy(true);
      this.healthText.destroy(true);
      this.increasePusils();
    }
  }

  update(time, delta) {
    this.previousX = this.follower.vector.x;
    this.previousY = this.follower.vector.y;

    this.follower.location += this.ENEMY_SPEED * delta;

    this.path.getPoint(this.follower.location, this.follower.vector);
    this.setPosition(this.follower.vector.x, this.follower.vector.y);
    this.playSpriteAccordingly(this.follower.vector.x, this.follower.vector.y);

    this.healthText.setText(this.health);
    this.healthText.setPosition(
      this.follower.vector.x - 16,
      this.follower.vector.y - 64
    );

    if (this.follower.location >= 1) {
      this.destroy(true);
      this.healthText.destroy(true);
      this.damagePlayer();
    }
  }
}

import Phaser from "phaser";
import Kontra from "./classes/Kontra.class";
import Turret from "./classes/Turret.class";
import Bullet from "./classes/Bullet.class";
import { makeGrid } from "./helpers/grid.helpers";
import { placeTurret } from "./helpers/turret.helpers";
import { damageEnemy } from "./helpers/enemy.helpers";
import kontraSprite from "./assets/kontra.png";
import bulletImage from "./assets/bullet.png";
import turretImage from "./assets/cute-turret.png";
import gameOverPng from "./assets/gameover.png";
import tiroImage from "./assets/tiro.png";
import fontImage from "./assets/font.png";
import fontFnt from "./assets/font.fnt";

const DEFAULT_WIDTH = 768;
const DEFAULT_HEIGHT = 768;
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
const map = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
let playerHealth = 100;
let enemySpan = 3000;
let pusils = 4;
let playerHealthText;
let gameOverImage;
let pusilText;
let nextEnemy;
let enemies;
let path;

function damagePlayer() {
  playerHealth -= 15;
}

function decreasePusils() {
  pusils -= 1;
}

function increasePusils() {
  pusils += 0.25;
}

/**
 * PRELOAD METHOD
 */
function preload() {
  this.load.bitmapFont("Press Start 2P", fontImage, fontFnt);
  this.load.image("tiro-logo", tiroImage);
  this.load.image("gameover", gameOverPng);
  this.load.image("bullet", bulletImage);
  this.load.image("turret", turretImage);
  this.load.spritesheet("kontra", kontraSprite, {
    frameWidth: 64,
    frameHeight: 128
  });
}

/**
 * CREATE METHOD
 */
function create() {
  /**
   * grid
   */
  const gridGraphics = this.add.graphics();
  makeGrid(gridGraphics);

  /**
   * enemy path
   */
  const graphics = this.add.graphics();
  graphics.lineStyle(1, 0xffffff, 0);

  path = this.add.path(-64, 576);
  path.lineTo(240, 576);
  path.lineTo(240, 96);
  path.lineTo(624, 96);
  path.lineTo(624, 288);
  path.lineTo(832, 288);
  path.draw(graphics);

  const pathBorderGraphics = this.add.graphics();
  pathBorderGraphics.lineStyle(3, 0x71fbfd, 1);

  const pathBorderA = this.add.path(0, 672);
  pathBorderA.lineTo(288, 672);
  pathBorderA.lineTo(288, 192);
  pathBorderA.lineTo(576, 192);
  pathBorderA.lineTo(576, 384);
  pathBorderA.lineTo(768, 384);
  pathBorderA.draw(pathBorderGraphics);

  const pathBorderB = this.add.path(0, 576);
  pathBorderB.lineTo(192, 576);
  pathBorderB.lineTo(192, 96);
  pathBorderB.lineTo(672, 96);
  pathBorderB.lineTo(672, 288);
  pathBorderB.lineTo(768, 288);
  pathBorderB.draw(pathBorderGraphics);

  /**
   * enemy sprite animations
   */
  this.anims.create({
    key: "kontra_down",
    frames: this.anims.generateFrameNumbers("kontra", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "kontra_up",
    frames: this.anims.generateFrameNumbers("kontra", { start: 12, end: 15 }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "kontra_left",
    frames: this.anims.generateFrameNumbers("kontra", { start: 4, end: 7 }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "kontra_right",
    frames: this.anims.generateFrameNumbers("kontra", { start: 8, end: 11 }),
    frameRate: 8,
    repeat: -1
  });

  /**
   * enemies declaration
   */
  enemies = this.physics.add.group({
    classType: function(scene) {
      return new Kontra(scene, path, damagePlayer, increasePusils);
    },
    runChildUpdate: true
  });

  nextEnemy = 0;

  /**
   * bullets declaration
   */
  const bullets = this.physics.add.group({
    classType: function(scene) {
      return new Bullet(scene);
    },
    runChildUpdate: true
  });

  /**
   * turrets declaration
   */
  const turrets = this.add.group({
    classType: function(scene) {
      return new Turret(scene, map, enemies, bullets);
    },
    runChildUpdate: true
  });

  this.input.on("pointerdown", function(pointer) {
    placeTurret(pointer, turrets, map, playerHealth, decreasePusils, pusils);
  });

  this.physics.add.overlap(enemies, bullets, function(enemy, bullet) {
    damageEnemy(enemy, bullet);
  });

  // this.add.text(16, 16, "TIRO-TIRO", {
  //   fontSize: 32
  // });
  this.add.image(16, 16, "tiro-logo", { height: 200, width: 200 });
  playerHealthText = this.add.text(592, 698, `health: ${playerHealth}`, {
    fontSize: 24
  });
  pusilText = this.add.text(592, 726, `pusil: ${pusils}`, {
    fontSize: 24
  });
}

/**
 * UPDATE METHOD
 *
 * @param {*} time
 * @param {*} delta
 */
function update(time, delta) {
  // spawning enemies
  if (playerHealth > 0 && time > nextEnemy) {
    const enemy = enemies.get();

    if (enemy) {
      enemy.setHealth(100);
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.startOnPath();

      nextEnemy = time + enemySpan;

      if (enemySpan > 800) {
        enemySpan -= 50;
      }
    }
  }

  // display game over text
  if (playerHealth <= 0) {
    playerHealth = 0;

    gameOverImage = this.add.image(384, 384, "gameover");
    gameOverImage.setDepth(4);
  }

  playerHealthText.setText(`health: ${playerHealth}`);
  pusilText.setText(`pusil: ${pusils}`);
}

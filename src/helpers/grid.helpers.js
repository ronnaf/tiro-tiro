function makeGrid(graphics) {
  graphics.lineStyle(1, 0xffffff, 0.5);

  for (let i = 0; i < 8; i++) {
    graphics.moveTo(0, i * 96);
    graphics.lineTo(768, i * 96);
  }

  for (let j = 0; j < 8; j++) {
    graphics.moveTo(j * 96, 0);
    graphics.lineTo(j * 96, 768);
  }

  graphics.strokePath();
}

export { makeGrid };

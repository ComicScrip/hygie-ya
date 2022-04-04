class GameObject {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
  }

  collidesWith(anotherGameObject) {
    return this.x === anotherGameObject.x && this.y === anotherGameObject.y;
  }

  setCoordinates(x, y) {
    if (x >= 0 && x <= this.game.tileCount + 1) this.x = x;
    if (y >= 0 && y <= this.game.tileCount + 1) this.y = y;
  }

  get color() {
    return 'white';
  }

  draw() {
    const { x, y, game, color } = this;
    const { tileSize, ctx } = game;
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}

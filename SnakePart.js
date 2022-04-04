class SnakePart extends GameObject {
  constructor(game, x, y) {
    super(game, x, y);
  }

  get color() {
    const color = this.game.isPaused ? '#435b20' : '#92c744';
    const digestingColor =
      this.game.isPaused || this.game.isOver ? '#525200' : 'yellow';
    return this.digestingApple ? digestingColor : color;
  }
}

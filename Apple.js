class Apple extends GameObject {
  constructor(game, x, y) {
    super(game, x, y);
  }

  get color() {
    if (this.game.isPaused || this.game.isOver) return '#3d0000';
    return 'red';
  }
}

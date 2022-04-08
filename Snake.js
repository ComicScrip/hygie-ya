class Snake extends GameObject {
  direction = null;
  bodyParts = [];
  hasMoved = false;

  constructor(game) {
    const headStartX = Math.floor(game.tileCount / 2);
    const headStartY = Math.floor(game.tileCount / 2);
    super(game, headStartX, headStartY);
    this.bodyParts = [];
    this.addPart(headStartX + 1, headStartY);
    this.addPart(headStartX + 2, headStartY);
  }

  get color() {
    const headColor =
      this.game.isPaused || this.game.isOver ? '#003b00' : 'green';
    const digestingColor = this.game.isPaused ? '#525200' : 'yellow';
    return this.digestingApple ? digestingColor : headColor;
  }

  setDirection(dir) {
    if (!this.hasMoved && dir === 'e') return;

    if (dir === 'w' && this.direction === 'e') return;
    else if (dir === 's' && this.direction === 'n') return;
    else if (dir === 'n' && this.direction === 's') return;
    else if (dir === 'e' && this.direction === 'w') return;

    this.hasMoved = true;
    this.game.incrementSpeed();
    this.direction = dir;
  }

  move() {
    const { direction, x, y, digestingApple, game, bodyParts } = this;
    const { hasWalls, tileCount } = game;
    if (!direction) return;

    let current = { x, y, digestingApple };
    let next;

    if (direction === 'e') this.x++;
    else if (direction === 'w') this.x--;
    else if (direction === 's') this.y++;
    else if (direction === 'n') this.y--;

    if (!hasWalls) {
      if (x >= tileCount - 1 && direction === 'e') this.x = 0;
      else if (x <= 0 && direction === 'w') this.x = tileCount - 1;

      if (y >= tileCount - 1 && direction === 's') this.y = 0;
      else if (y <= 0 && direction === 'n') this.y = tileCount - 1;
    }

    for (let part of bodyParts) {
      next = {
        x: current.x,
        y: current.y,
        digestingApple: current.digestingApple,
      };
      current = { x: part.x, y: part.y, digestingApple: part.digestingApple };
      part.setCoordinates(next.x, next.y);
      part.digestingApple = next.digestingApple;
    }
  }

  addPart(x, y) {
    this.bodyParts.push(new SnakePart(this.game, x || this.x, y || this.y));
  }

  eat() {
    const { game } = this;
    const { speed, appleList } = game;
    for (let apple of appleList) {
      if (this.collidesWith(apple)) {
        this.digestingApple = true;
        this.addPart();
        game.incrementScore();
        game.decrementSpeed();
        game.removeApple(apple);
        const sound = new Audio(
          'https://freesound.org/data/previews/20/20266_29508-lq.mp3'
        );
        sound.volume =
          parseInt(localStorage.getItem('soundVolume')) / 100 || 0.25;
        sound.play();

        let applesToAdd = 0;
        const lengthBonus = Math.floor(this.bodyParts.length / 10);
        const bonus = Math.random() * (lengthBonus > 3 ? 3 : lengthBonus);
        applesToAdd = bonus + speed / (appleList.length * 4);
        if (game.appleList.length === 0) applesToAdd += 1;
        else if (game.appleList.length > 10) applesToAdd = 1;

        for (let i = 0; i < applesToAdd; i++) game.addApple();

        return true;
      }
    }
    this.digestingApple = false;
    return false;
  }

  draw() {
    this.bodyParts.forEach((part) => part.draw());
    super.draw();
  }

  collidesWith(anotherGameObject) {
    return (
      super.collidesWith(anotherGameObject) ||
      this.bodyParts.some((part) => part.collidesWith(anotherGameObject))
    );
  }
}

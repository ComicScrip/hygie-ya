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
    if (!this.direction) return;

    let current = {
      x: this.x,
      y: this.y,
      digestingApple: this.digestingApple,
    };
    let next;

    if (this.direction === 'e') this.x++;
    else if (this.direction === 'w') this.x--;
    else if (this.direction === 's') this.y++;
    else if (this.direction === 'n') this.y--;

    if (!this.game.hasWalls) {
      if (this.direction === 'e' && this.x > this.game.tileCount + 1)
        this.x = 0;
      if (this.direction === 'w' && this.x < 0)
        this.x = this.game.tileCount + 1;
      if (this.direction === 'n' && this.y < 0)
        this.y = this.game.tileCount + 1;
      if (this.direction === 's' && this.y > this.game.tileCount + 1)
        this.y = 0;
    }

    for (let part of this.bodyParts) {
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
        const lengthBonus = Math.floor(this.bodyParts.length / 10);
        const bonus = Math.random() * (lengthBonus > 3 ? 3 : lengthBonus);
        const numberOfApplesToAdd = bonus + speed / (appleList.length * 4);
        for (let i = 1; i < numberOfApplesToAdd; i += 1) game.addApple();
        if (!game.appleList.length) game.addApple();
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

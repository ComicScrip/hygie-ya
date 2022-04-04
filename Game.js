function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Game {
  initialSpeed = 1;
  speed = this.initialSpeed;
  tileCount = 20;
  isPaused = true;
  elapsedTimePlaying = 0;
  playerScore = 0; // number of eaten apples
  highScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
  hasWalls = localStorage.getItem('hasWalls') === 'true';

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = this.canvas.width / this.tileCount - 2;
    this.initObjects();
  }

  get isOver() {
    const { x, y, bodyParts } = this.snake;
    const limit = this.tileCount + 1;
    console.log(this.hasWalls);
    if (this.hasWalls) return x < 0 || x > limit || y < 0 || y > limit;
    return bodyParts.some(
      (part) => !this.snake.digestingApple && part.collidesWith(this.snake)
    );
  }
  get playerEfficiency() {
    return (
      this.playerScore &&
      Math.round((this.playerScore * 5000) / this.elapsedTimePlaying)
    );
  }
  get finalScore() {
    return this.playerScore + this.playerEfficiency;
  }

  saveHighScore() {
    if (this.finalScore > this.highScore) {
      this.highScore = this.finalScore;
      localStorage.setItem('highScore', this.finalScore);
    }
  }

  initObjects() {
    this.snake = new Snake(this);
    this.appleList = [];
    for (let i = 0; i < 3; i += 1) this.addApple();
  }

  addApple() {
    const { x, y } = this.getEmptyRandomAvailableCoordinates();
    this.appleList.push(new Apple(this, x, y));
  }

  removeApple(apple) {
    this.appleList = this.appleList.filter((a) => a !== apple);
  }

  isSpotAvailable(x, y) {
    return (
      !this.snake.collidesWith({ x, y }) &&
      !this.appleList.some((apple) => apple.collidesWith({ x, y }))
    );
  }

  getEmptyRandomAvailableCoordinates() {
    let randPosition = {};
    do {
      randPosition.x = randomIntFromInterval(0, this.tileCount + 1);
      randPosition.y = randomIntFromInterval(0, this.tileCount + 1);
    } while (!this.isSpotAvailable(randPosition.x, randPosition.y));
    return randPosition;
  }

  congratulatePlayer() {
    const end = Date.now() + 5000; // 5s animation
    const colors = ['#ff0000', '#ffff00'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  displayPause() {
    this.draw();
    this.ctx.fillStyle = '#87c032';

    this.ctx.font = '25px SnakeChan';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'black';
    this.ctx.shadowBlur = 4;
    this.ctx.fillText(
      'Game paused',
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );
    this.ctx.font = '15px SnakeChan';
    this.ctx.fillText(
      'Press space to resume',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
    this.ctx.shadowBlur = 0;
  }

  displayGameOver() {
    this.draw();
    this.ctx.fillStyle = '#ffff00';

    this.ctx.font = '25px SnakeChan';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'black';
    this.ctx.shadowBlur = 4;

    this.ctx.fillText(
      'Game over !',
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    this.ctx.font = '18px SnakeChan';
    this.ctx.fillText(
      `final score : ${this.finalScore}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.font = '14px SnakeChan';
    this.ctx.fillText(
      `highscore : ${this.highScore}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );

    this.ctx.font = '18px SnakeChan';
    this.ctx.fillText(
      'Press r to restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 80
    );
    this.ctx.shadowBlur = 4;
  }

  clearScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clearScreen();
    this.appleList.forEach((apple) => apple.draw());
    this.snake.draw();
  }

  play() {
    this.isPaused = false;
    this.draw();
    this.snake.move();
    this.snake.eat();

    if (this.isOver) {
      if (this.playerScore > this.highScore) this.congratulatePlayer();
      this.saveHighScore();
      this.displayGameOver();
      this.clearTimeouts();
    } else {
      this.timeoutId = setTimeout(() => {
        this.elapsedTimePlaying += 1000 / this.speed;
        this.play();
      }, 1000 / this.speed);
    }
  }

  clearTimeouts() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  pause() {
    if (!this.isOver) {
      this.isPaused = true;
      this.displayPause();
      this.clearTimeouts();
    }
  }

  togglePause() {
    if (this.isPaused) this.play();
    else this.pause();
  }

  incrementSpeed(amount = 1) {
    if (this.isOver) return;
    this.speed += amount;
    if (this.speed > 60) this.speed = 60;
  }

  incrementScore(amount = 1) {
    this.playerScore += amount;
  }

  decrementSpeed(amount) {
    if (amount) this.speed -= amount;
    else {
      if (this.speed < 5) this.speed -= 1;
      else if (this.speed < 10) this.speed -= 2;
      else if (this.speed < 15) this.speed -= 3;
      else if (this.speed < 20) this.speed -= 4;
      else if (this.speed < 25) this.speed -= 6;
      else if (this.speed < 30) this.speed -= 10;
      else if (this.speed < 40) this.speed -= 15;
      else if (this.speed < 50) this.speed -= 25;
      else if (this.speed > 50) this.speed -= 40;
    }

    if (this.speed < 1) this.speed = 1;
  }

  reset() {
    this.pause();
    this.initObjects();
    this.speed = this.initialSpeed;
    this.playerScore = 0;
    this.elapsedTimePlaying = 0;
    this.play();
  }
}

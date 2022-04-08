const gameElement = document.getElementById('game');
const gameContainerElement = document.getElementById('game-container');
const optionsFromElement = document.getElementById('optionsForm');
const hasWallsInput = document.getElementById('hasWalls');
const easyModeInput = document.getElementById('easyMode');
const volumeInput = document.getElementById('vol');
const rightArrow = document.querySelector('.right');
const leftArrow = document.querySelector('.left');
const uptArrow = document.querySelector('.up');
const downArrow = document.querySelector('.down');

function updateActiveDirBtn() {
  const highlighted = document.querySelector('.active');
  if (highlighted) highlighted.classList.remove('active');
  const btnToHighligh = { e: 'right', w: 'left', n: 'up', s: 'down' }[
    g.snake.direction
  ];
  console.log(btnToHighligh);
  if (btnToHighligh)
    document.querySelector(`.${btnToHighligh}`).classList.add('active');
}

hasWallsInput.checked = localStorage.getItem('hasWalls') === 'true';

let newSize = window.innerWidth;

if (newSize > 500) newSize = 500;
if (window.innerHeight < 700) newSize = 300;

gameElement.width = newSize;
gameElement.height = newSize;
gameContainerElement.style.width = newSize + 'px';
gameContainerElement.style.height = newSize + 'px';
optionsFromElement.style.width = newSize - 20 + 'px';

const g = new Game(gameElement);

hasWallsInput.addEventListener('change', (e) => {
  localStorage.setItem('hasWalls', e.target.checked);
  g.hasWalls = e.target.checked;
});

volumeInput.addEventListener('input', (e) => {
  console.log(e.target.value);
  localStorage.setItem('soundVolume', e.target.value);
});

gameContainerElement.addEventListener('click', () => {
  if (g.isOver) g.reset();
  else g.togglePause();
});

document.addEventListener('keydown', ({ key }) => {
  g.incrementSpeed();

  if (key === ' ') return g.togglePause();
  if (key === 'r') return g.reset();
  if (key === 'ArrowLeft') g.snake.setDirection('w');
  if (key === 'ArrowUp') g.snake.setDirection('n');
  if (key === 'ArrowDown') g.snake.setDirection('s');
  if (key === 'ArrowRight') g.snake.setDirection('e');

  updateActiveDirBtn();
});

rightArrow.addEventListener('click', () => g.snake.setDirection('e'));
downArrow.addEventListener('click', () => g.snake.setDirection('s'));
leftArrow.addEventListener('click', () => g.snake.setDirection('w'));
uptArrow.addEventListener('click', () => g.snake.setDirection('n'));

function formatTime(milis) {
  let seconds = Math.round(milis / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

// refresh game info every 0.1s
setInterval(() => {
  const { elapsedTimePlaying, playerScore, speed, playerEfficiency } = g;
  const formatedTime = formatTime(elapsedTimePlaying);
  document.getElementById('time').innerHTML = `${formatedTime}`;
  document.getElementById('score').innerHTML = `${playerScore} ${
    playerEfficiency ? '+ ' + playerEfficiency : ''
  } pt`;
  document.getElementById('speed').innerHTML = `Speed : ${speed}`;
}, 100);

g.play();
g.pause();

const gameElement = document.getElementById('game');
const gameContainerElement = document.getElementById('game-container');
const hasWallsInput = document.getElementById('hasWalls');
const easyModeInput = document.getElementById('easyMode');
const volumeInput = document.getElementById('vol');

hasWallsInput.checked = localStorage.getItem('hasWalls') === 'true';

if (window.innerWidth < 420) {
  const newSize = window.innerWidth;
  gameElement.width = newSize;
  gameElement.height = newSize;
  gameContainerElement.style.width = newSize - 8 + 'px';
  gameContainerElement.style.height = newSize - 8 + 'px';
}

const g = new Game(gameElement);

hasWallsInput.addEventListener('change', (e) => {
  localStorage.setItem('hasWalls', e.target.checked);
  g.hasWalls = e.target.checked;
});

volumeInput.addEventListener('input', (e) => {
  console.log(e.target.value);
  localStorage.setItem('soundVolume', e.target.value);
});

document.addEventListener('keydown', ({ key }) => {
  g.incrementSpeed();
  if (key === ' ') return g.togglePause();
  if (key === 'r') return g.reset();
  if (key === 'ArrowLeft') return g.snake.setDirection('w');
  if (key === 'ArrowUp') return g.snake.setDirection('n');
  if (key === 'ArrowDown') return g.snake.setDirection('s');
  if (key === 'ArrowRight') return g.snake.setDirection('e');
});

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

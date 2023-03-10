var modal = document.getElementById('id01');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const NO_OF_HIGH_SCORES = 5;
const HIGH_SCORES = 'highScores';

showHighScores();

let sequence = [];
let humanSequence = [];
let level = 0;
let score = -1;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const puntuacion = document.querySelector('.js-puntuacion');
const tileContainer = document.querySelector('.js-container');

function resetGame(text) {
  
  alert(text);
  checkHighScore(score);
  sequence = [];
  humanSequence = [];
  level = 0;
  
  score = -1;
  startButton.classList.remove('hidden');
  heading.textContent = 'Simón Dice';
  puntuacion.textContent = 'Puntuación: 0';
  info.classList.add('hidden');
  tileContainer.classList.add('unclickable');
}

function humanTurn(level) {
  tileContainer.classList.remove('unclickable');
  info.textContent = `Tu turno: ${level} Tap${level > 1 ? 's' : ''}`;
}

function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = document.querySelector(`[data-sound='${color}']`);

  tile.classList.add('activated');
  sound.play();

  setTimeout(() => {
    tile.classList.remove('activated');
  }, 300);
}

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * 1000);
    //}, (index + 1) * 900);
  });
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow'];
  const random = tiles[Math.floor(Math.random() * tiles.length)];

  return random;
}

function nextRound() {
  level += 1;
  score += 1;

  tileContainer.classList.add('unclickable');
  info.textContent = 'Espera a que termine la secuencia...';
  heading.textContent = `Nivel ${level}`;
  puntuacion.textContent = `Puntuación: ${score}`;


  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}

function handleClick(tile) {
  const index = humanSequence.push(tile) - 1;
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();

  const remainingTaps = sequence.length - humanSequence.length;

  if (humanSequence[index] !== sequence[index]) {
    resetGame('¡PRRRR! ¡Terrible, tecla incorrecta!');
    return;
  }

  if (humanSequence.length === sequence.length) {
    humanSequence = [];
    info.textContent = '¡Bingo! ¡Sigue así!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Tu turno: ${remainingTaps} Tap${
    remainingTaps > 1 ? 's' : ''
  }`;
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Espera a que termine la secuencia...';
  nextRound();
}

startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;

  if (tile) handleClick(tile);
});

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.name} - (${score.score}p.)`)
    .join('');
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    const name = prompt('¡Has conseguido un nuevo récord! Introduce tu nombre:');
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
}

const GameBoard = (() => {
  const BOARD_SIZE = 3;
  let gameBoard;

  const init = function () {
    gameBoard = new Array(BOARD_SIZE);
    for (let x = 0; x < BOARD_SIZE; x++) {
      gameBoard[x] = new Array(BOARD_SIZE);
    }
    fill('');
  };

  const fill = function (value) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        gameBoard[x][y] = value;
      }
    }
  };

  const update = function (x, y, value) {
    gameBoard[x][y] = value;
  }

  const display = function () {
    const boardElement = document.querySelector('.game-board');

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('game-board__cell');
        cellElement.textContent = gameBoard[x][y];
        boardElement.appendChild(cellElement);
      }
    }
  }

  return { init, display, update }
})();

const Player = (name) => {
  const scores = 0;

  const mark = function (x, y, marker) {
    GameBoard.update(x, y, marker);
  }

  return { mark }
}

const Game = (() => {
  const player1 = Player('first');
  const player2 = Player('second');


  const start = function() {
    GameBoard.init();
    GameBoard.display();
  }

  const detectWinner = function() {

  }
  return { start }
})();

Game.start();

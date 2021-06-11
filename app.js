const GameBoard = (() => {
  const BOARD_SIZE = 3;
  let cellElements;
  let gameBoard;

  const init = function() {
    gameBoard = new Array(BOARD_SIZE);
    for (let x = 0; x < BOARD_SIZE; x++) {
      gameBoard[x] = new Array(BOARD_SIZE);
    }
    fill('');
  };

  const fill = function(value) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        gameBoard[x][y] = value;
      }
    }
  };

  const update = function(x, y, value) {
    cellElements.forEach(cellElement => {
      if (cellElement.x === x && cellElement.y === y) cellElement.textContent = value;
    })
    gameBoard[x][y] = value;
  }

  const getCellElements = function() {
    return document.querySelectorAll('.game-board__cell');
  }

  const createCellElement = function (x, y) {
    const cellElement = document.createElement('div');
    cellElement.classList.add('game-board__cell');
    cellElement.textContent = gameBoard[x][y];
    cellElement.x = x;
    cellElement.y = y;
    return cellElement;
  }

  const display = function() {
    const boardElement = document.querySelector('.game-board');

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const cellElement = createCellElement(x, y);
        boardElement.appendChild(cellElement);
      }
    }

    cellElements = document.querySelectorAll('.game-board__cell');
  }

  return { init, display, update, getCellElements }
})();

const Player = (name) => {
  const scores = 0;

  const mark = function(x, y, marker) {
    GameBoard.update(x, y, marker);
  }

  return { mark }
}

const Game = (() => {
  const player1 = Player('first');
  const player2 = Player('second');

  const handlePlayersClicks = function() {
    const cells = GameBoard.getCellElements();

    cells.forEach(cell => {
      cell.addEventListener('click', e => {
        player1.mark(cell.x, cell.y, 'o');
      })
    })
  }

  const start = function() {
    GameBoard.init();
    GameBoard.display();
    handlePlayersClicks();
  }

  const detectWinner = function() {

  }
  return { start }
})();

Game.start();

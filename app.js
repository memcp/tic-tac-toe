const GameBoard = (() => {
  const BOARD_SIZE = 4;
  const PRIMARY_DIAGONAL_DIRECTION = 1;
  const SECONDARY_DIAGONAL_DIRECTION = -1;

  let cellElements;
  let gameBoard;

  const init = function() {
    gameBoard = create2DArray();
    fill('');
    changeGridRules();
  };

  const fill = function(value) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        gameBoard[x][y] = value;
      }
    }
  };

  const create2DArray = function () {
    let temp = new Array(BOARD_SIZE);
    for (let x = 0; x < BOARD_SIZE; x++) {
      temp[x] = new Array(BOARD_SIZE);
    }
    return temp;
  }

  const changeGridRules = function () {
    const boardElement = document.querySelector('.game-board');
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 0fr)`
    boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 0fr)`
  }

  const transpose = function (gameBoard) {
    let temp = create2DArray();
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        temp[x][y] = gameBoard[y][x];
      }
    }
    return temp;
  }

  const getDiagonal = function (direction) {
    let diagonal = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (direction === PRIMARY_DIAGONAL_DIRECTION) {
          if (x === y) diagonal.push(gameBoard[x][y]);
        } else if (direction === SECONDARY_DIAGONAL_DIRECTION) {
          if (x + y === BOARD_SIZE - 1) diagonal.push(gameBoard[x][y]);
        }
      }
    }
    return diagonal;
  }

  const primaryDiagonal = function () {
    return getDiagonal(PRIMARY_DIAGONAL_DIRECTION);
  }

  const secondaryDiagonal = function () {
    return getDiagonal(SECONDARY_DIAGONAL_DIRECTION);;
  }

  const update = function(x, y, value) {
    cellElements.forEach(cellElement => {
      if (cellElement.x === x && cellElement.y === y) cellElement.textContent = value;
    })
    gameBoard[x][y] = value;
  }

  const getGameBoard = function () {
    return gameBoard;
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

  const isFull = function () {
    let isFull = true;
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (gameBoard[x][y] === '') return false;
      }
    }
    return isFull;
  }

  const clear = function () {
    const boardElement = document.querySelector('.game-board');
    boardElement.textContent = '';

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        gameBoard[x][y] = '';
      }
    }
  }

  return {
    init, display, update, getCellElements, getGameBoard, transpose, primaryDiagonal, secondaryDiagonal, isFull,
    clear
  }
})();

const Player = (name, marker) => {
  const _marker = marker;

  const mark = function(x, y) {
    GameBoard.update(x, y, _marker);
  }

  const getName = function () {
    return name;
  }

  const getMarker = function () {
    return marker;
  }

  return { mark, getName, getMarker }
}

const Game = (() => {
  const player1 = Player('first', 'o');
  const player2 = Player('second', 'x');
  let playerOneTurn = true;

  const checkDiagonals = function (gameBoard, mark) {
    let winByPrimaryDiagonal = same(GameBoard.primaryDiagonal(), mark);
    let winBySecondaryDiagonal = same(GameBoard.secondaryDiagonal(), mark);

    return winByPrimaryDiagonal || winBySecondaryDiagonal;
  }

  const same = function (row, mark) {
    let same = true;
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== mark) same = false;
    }
    return same;
  }

  const checkStraight = function (gameBoard, mark) {
    let winning = false;
    for (let x = 0; x < gameBoard.length; x++) {
      if (same(gameBoard[x], mark)) winning = true;
    }
    return winning;
  }

  const checkHorizontal = function (gameBoard, mark) {
    return checkStraight(gameBoard, mark);
  }

  const checkVertical = function (gameBoard, mark) {
    let transposedBoard = GameBoard.transpose(gameBoard);
    return checkStraight(transposedBoard, mark);
  }

  const checkWinner = function (gameBoard, marker) {
    let winDiagonally = checkDiagonals(gameBoard, marker);
    let winHorizontally = checkHorizontal(gameBoard, marker);
    let winVertically = checkVertical(gameBoard, marker);

    return winDiagonally || winHorizontally || winVertically;
  }

  const isEmpty = function (cell) {
    return cell.textContent === '';
  }

  const congratsWinner = function (player, cb) {
    const startGameButton = document.querySelector('.start-game');
    const winnerElement = document.querySelector('.winner');
    winnerElement.textContent = cb(player)
    winnerElement.style.display = 'block';
    startGameButton.textContent = 'Restart Game';
  }

  const win = function (player) {
    return `Player ${player.getName()} wins, played with "${player.getMarker()}"`;
  }

  const tie = function () {
    return `It's tie`;
  }

  const switchTurn = function () {
    playerOneTurn = !playerOneTurn;
  }

  function checkGameRules(cell, gameBoard, player) {
    player.mark(cell.x, cell.y);
    if (checkWinner(gameBoard, player.getMarker())) {
      congratsWinner(player, win);
    }
    if (GameBoard.isFull()) {
      congratsWinner(null, tie);
    }
    switchTurn();
  }

  const handlePlayersClicks = function() {
    const cells = GameBoard.getCellElements();

    cells.forEach(cell => {
      cell.addEventListener('click', e => {
        const gameBoard = GameBoard.getGameBoard();
        if(isEmpty(cell)) {
          if (playerOneTurn) {
            checkGameRules(cell, gameBoard, player1);
          } else {
            checkGameRules(cell, gameBoard, player2);
          }
        }
      })
    });
  }

  const start = function() {
    GameBoard.init();
    GameBoard.display();
    handlePlayersClicks();
  }

  return { start }
})();

const startGameButton = document.querySelector('.start-game');

startGameButton.addEventListener('click', () => {
  const winnerElement = document.querySelector('.winner');
  winnerElement.style.display = 'none';
  if (GameBoard.getGameBoard()) GameBoard.clear();
  Game.start();
})

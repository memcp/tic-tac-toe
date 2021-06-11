const GameBoard = (() => {
  const BOARD_SIZE = 4;
  let cellElements;
  let gameBoard;

  const init = function() {
    gameBoard = new Array(BOARD_SIZE);
    for (let x = 0; x < BOARD_SIZE; x++) {
      gameBoard[x] = new Array(BOARD_SIZE);
    }
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

  const changeGridRules = function () {
    const boardElement = document.querySelector('.game-board');
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 0fr)`
    boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 0fr)`
  }

  const transpose = function (gameBoard) {
    let temp = new Array(BOARD_SIZE);
    for (let x = 0; x < BOARD_SIZE; x++) {
      temp[x] = new Array(BOARD_SIZE);
    }

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        temp[x][y] = gameBoard[y][x];
      }
    }
    return temp;
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

  return { init, display, update, getCellElements, getGameBoard, transpose }
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
  let playerOneTurn = true;

  // todo fix to work with big boards, not limited to three cells
  const checkDiagonals = function (gameBoard, mark) {
    let winDiagonally = false;

    for (let x = 1; x < gameBoard.length - 1; x++) {
      for (let y = 1; y < gameBoard.length - 1; y++) {
        let winByMainDiagonal = gameBoard[x][y] === mark && gameBoard[x + 1][y + 1] === mark && gameBoard[x - 1][y - 1] === mark;
        let winByMinorDiagonal = gameBoard[x][y] === mark && gameBoard[x - 1][y + 1] === mark && gameBoard[x + 1][y - 1] === mark;
        winDiagonally = x === y && (winByMainDiagonal || winByMinorDiagonal);
      }
    }

    return winDiagonally;
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

  const checkWinner = function (gameBoard, mark) {
    let winDiagonally = checkDiagonals(gameBoard, mark);
    let winHorizontally = checkHorizontal(gameBoard, mark);
    let winVertically = checkVertical(gameBoard, mark);

    return winDiagonally || winHorizontally || winVertically;
  }


  const isEmpty = function (cell) {
    return cell.textContent === '';
  }

  const handlePlayersClicks = function() {
    const cells = GameBoard.getCellElements();

    cells.forEach(cell => {
      cell.addEventListener('click', e => {
        const gameBoard = GameBoard.getGameBoard()
        if(isEmpty(cell)) {
          if (playerOneTurn) {
            player1.mark(cell.x, cell.y, 'o');
            if (checkWinner(gameBoard, 'o')) {
              console.log('Player 1 is winner');
            }
            playerOneTurn = false;
          } else {
            player2.mark(cell.x, cell.y, 'x');
            if (checkWinner(gameBoard, 'x')) {
              console.log('Player 2 is winner');
            }
            playerOneTurn = true;
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

Game.start();

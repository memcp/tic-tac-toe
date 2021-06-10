const Player = (name) => {

  return {}
}

const GameBoard = (() => {
  const BOARD_SIZE = 3;
  let gameBoard;

  const init = function () {
    gameBoard = new Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++) {
      gameBoard[i] = new Array(BOARD_SIZE);
    }
    fillBoard('');
  };

  const fillBoard = function (value) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        gameBoard[i][j] = value;
      }
    }
  };

  const display = function () {
    console.log(gameBoard);
  }

  return { init, display }
})();

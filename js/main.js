'use strict';

const MINE = '<img src ="img/mine.png">',
    USED_HINT = 'img/hintUsed.png',
    UN_USED_HINT = 'img/hintUnused.png',
    FLAG = '<img src ="img/flag.png">',
    HEART = '<img src="img/heart.jpg">',
    GAME_ON = '😀',
    GAME_OVER = '😭',
    GAME_WON = '😎',
    OUCH = '😫',
    TREE = '<img src="img/tree.png">';


var gBoard,
    gLevel,
    gGame,
    gTimerInterval,
    gDifficulties,
    gRestartBtn,
    gGameOverSound,
    gElLives;


//sets the board
function init() {
    gElLives = document.querySelector('.lives');
    gElLives.innerHTML = 'Lives left: 3';
    // clearInterval(gTimerInterval);
    gTimerInterval = null;
    gDifficulties = [{ size: 4, mines: 2 }, { size: 8, mines: 12 }, { size: 12, mines: 30 }]
    gLevel = { size: 4, mines: 2 }
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        hintOn: false,
        livesLeft: 3
    }
    getHighscore();
    gBoard = createBoard(gLevel.size);
    renderBoard(gBoard);
    createHints();
    gRestartBtn = document.querySelector('.restart');
    gRestartBtn.innerText = GAME_ON;
    addHearts();
}

//creates the board mat
function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isMarked: false,
                negsCount: 0,
                i,
                j
            }
        }
    }
    return board;
}



//Cell left clicked
function cellClicked(elCell, i, j, event) {
    //don't start if the game is over!
    if (!gGame.isOn) return;
    //if the player used a hint:
    if (gGame.hintOn) {
        revealNegs(gBoard, i, j);
        gGame.hintOn = false;
        return;
    }
    //on the first click, places the mines and starts the game.
    if (!gTimerInterval) {
        setTimer();
        placeMines(i, j, gLevel.mines);
        gGame.isOn = true;
    }
    var currCell = gBoard[i][j];
    (event.button) ? cellMarked(elCell, currCell): expandShown(elCell, currCell);
}


//Cell right clicked
function cellMarked(elCell, currCell) {
    if (currCell.isMarked) {
        elCell.innerText = '';
        currCell.isMarked = false;
        gGame.markedCount--;
        elCell.classList.remove('revealed');
    } else {
        currCell.isMarked = true;
        renderCell(gBoard, currCell.i, currCell.j);
        gGame.markedCount++;
        checkVictory();
    }
}

//Shows the content of the clicked cell(if it's not a mine)
function expandShown(elCell, currCell) {
    //if the cell has already been clicked: stop
    if (currCell.isMarked || currCell.isShown) return;

    if (currCell.isMine) {
        new Audio('sfx/wrong.mp3').play();
        elCell.classList.add('clickedBomb');
        gGame.livesLeft--;
        addHearts();
        (gGame.livesLeft) ? lifeLost(currCell.i, currCell.j, elCell): gameOver(elCell);
    } else {
        gGame.shownCount++;
        checkVictory();
    }
    currCell.isShown = true;
    renderCell(gBoard, currCell.i, currCell.j);
}


function gameOver(elCell) {
    gRestartBtn.innerText = GAME_OVER;
    gGame.isOn = false;
    console.log('Game over!');
    clearInterval(gTimerInterval);
    revealMines();
}

function checkVictory() {
    if (gLevel.mines === gGame.markedCount &&
        gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
        localStorage.setItem("highscore", gGame.secsPassed);
        console.log(localStorage.getItem("highscore"));
        gRestartBtn.innerText = GAME_WON;
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        console.log('You won!');
    }
}

function useHint(elCell) {
    if (gGame.hintOn || elCell.dataset.used === 'true' || !gGame.isOn) return;
    gGame.hintOn = true;
    elCell.dataset.used = 'true';
    elCell.src = USED_HINT;
}


function createHints() {
    var elHints = document.querySelector('.hints');
    var strHtml = 'Hints:';
    for (var i = 0; i < 3; i++) {
        strHtml += `<img data-used="false" onclick="useHint(this)" src=${UN_USED_HINT} id="hint${i+1}">`;
    }
    elHints.innerHTML = strHtml;
}

function lifeLost(i, j, elCell) {
    console.log(`Lives Left: ${gGame.livesLeft}`);
    setTimeout(() => {
        var currCell = gBoard[i][j];
        currCell.isShown = false;
        console.log(currCell);
        elCell.classList.remove('clickedBomb');
        hideCell(i, j);
    }, 1000);
}
//To do: change the i and j requirements in some functions to use currCell.i/j
//change the timer to images of numbers, with the innerHTML made by a function
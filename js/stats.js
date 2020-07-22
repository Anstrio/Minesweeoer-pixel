'use strict';


function setTimer() {
    gTimerInterval = setInterval(() => {
        gGame.secsPassed++;
        var num = gGame.secsPassed;
        for (var i = 0; i < 3; i++) {
            document.querySelector(`.digit${i+1}`).innerText = num % 10;
            num = Math.floor(num / 10);
        }
    }, 1000);
}

//choose difficulty, the default is easy

function setDifficulty(diff) {
    if (gTimerInterval || !gGame.isOn) return;
    gLevel = gDifficulties[diff];
    gBoard = createBoard(gLevel.size);
    renderBoard(gBoard);
}
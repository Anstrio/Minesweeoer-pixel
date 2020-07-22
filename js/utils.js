//render the board
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = gBoard[i][j];
            var cellContent = '';
            if (currCell.isShown) {
                cellContent = (currCell.isMine) ? MINE : currCell.negsCount;
            } else cellContent = TREE;
            strHtml += `<th id="cell${i}-${j}" class="cell" onmouseup="cellClicked(this, ${i}, ${j}, event)">${cellContent} </th>`;
        }
        strHtml += '</tr>';
    }
    document.querySelector('.board').innerHTML = strHtml;
}


//render the cell clicked
function renderCell(mat, i, j) {
    var elCell = document.querySelector(`#cell${i}-${j}`);
    var currCell = mat[i][j];
    var strHtml = '';
    var cellContent = '';
    if (currCell.isMarked) cellContent = FLAG;
    else cellContent = (currCell.isMine) ? MINE : currCell.negsCount;
    strHtml = `<th id="cell${i}-${j}" class="cell" onmouseup="cellClicked(this, ${i}, ${j}, event)">${cellContent} </th>`;
    elCell.innerHTML = strHtml;
    elCell.classList.add('revealed');
}

//hides a cell's content, used in the revealNegs function
function hideCell(i, j) {
    var elCell = document.querySelector(`#cell${i}-${j}`);
    var strHtml = `<th id="cell${i}-${j}" class="cell" onmouseup="cellClicked(this, ${i}, ${j}, event)">${TREE} </th>`;
    elCell.innerHTML = strHtml;
    elCell.classList.remove('revealed');
}


//reveals all the neighbours of the specified cell, used by the cell clicked function after a hint is used
function revealNegs(mat, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue;
            renderCell(mat, i, j);
        }
    }
    setTimeout(() => {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= mat.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= mat[0].length) continue;
                if (!mat[i][j].isShown) hideCell(i, j);
            }
        }
    }, 1000)
}

//it... returns a random integer number, not much to say here
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function colorCell(elCell, color) {
    elCell.style.backgroundColor = color;
}

function getAllEmpties(mat, iClicked = null, jClicked = null) {
    var empties = [];
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            if ((i === iClicked && j === jClicked) || mat[i][j].isMine || mat[i][j].isShown) continue;
            empties.push({ i, j });
        }
    }
    return empties;
}


function countNegs(iCounted, jCounted) {
    for (var i = iCounted - 1; i <= iCounted + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jCounted - 1; j <= jCounted + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (gBoard[i][j].isMine) gBoard[iCounted][jCounted].negsCount++;
        }
    }
}

function addHearts() {
    var strHtml = '';
    for (var i = 0; i < gGame.livesLeft; i++) {
        strHtml += HEART;
    }
    document.querySelector('.lives').innerHTML = `Lives: ${strHtml}`;
}

function getHighscore() {
    var strHtml = 'Highscore';
    console.log(strHtml);
}
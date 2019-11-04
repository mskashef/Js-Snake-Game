let n = 20; // size of playground : n * n
let score = 0;
let snakeSize = 3; // size of snake
let cells = []; // playground matrix
let lost = false; // the gamer has lost or not
let win = false; // the gamer has won or not
let dir = "right"; // direction of movement
let lastMove = "right"; // last move direction : it's used for detecting if the snake wants to go backward (& we prevent that on keyPress)
/*
    in the matrix : |
                    |__ empty cells : -1
                    |__ snake Body : [0 to (snakeSize - 1)] --> snakeSize - 1 => head
                    |__ food : -2

    first we create the empty cells
    so :

    in the nested loops below we set all cells of the matrix to -1 (they are empty):
 */
for (let i = 0; i < n; i++) {
    cells[i] = [];
    for (let j = 0; j < n; j++) {
        cells[i][j] = -1;
    }
}

let center = Math.floor(n/2); // center of the playground
cells[center][center + 1] = 2; // head of snake
cells[center][center    ] = 1; // body of snake
cells[center][center - 1] = 0;  // body of snake

// -- change movement direction according to the pressed key --
window.addEventListener("keydown", function (event) {
    let direction = "";
    switch (event.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        default:
            direction = dir;
            return;
    }
    dir = (direction == oppositeOf(lastMove)) ? dir : direction;
});
// on document ready -->
$(document).ready(function() {
    addFood(); // add a food in a random place of playground
    refreshPage(); // placing playground in a table and add it to web page
    startMoving(); // start auto movement
    // Restart Game Button
    $("input#Restart-Game-btn").click(function () {
        location.reload();
    });
});
// returns the opposite direction of entry direction
function oppositeOf(direction) {
    switch (direction) {
        case "up":
            return "down";
        case "down":
            return "up";
        case "right":
            return "left";
        case "left":
            return "right";
    }
}
// Game Over
function GameOver()  {
    lost = true; // player lost
    clearTimeout(startMoving); // clearing the set timeOut for auto movement
    alert("You Lost!"); // then alerts this message to the player
}
// places playground in a table and add it to web page
function refreshPage() {
    let insetHtml = "";
    insetHtml += "<table id='cells-container' cellspacing='0' cellpadding='0'>\n";
    for (let i = 0; i < n; i++) {
        insetHtml += "\t<tr class='row " + "" + "'>\n";
        for (let j = 0; j < n; j++) {
            insetHtml += "\t\t<td class='coll " + (cells[i][j] === snakeSize - 1 ? "head" : cells[i][j] === -1 ? "empty" : cells[i][j] === -2 ? "food" : "snake") + "'></td>\n";
        }
        insetHtml += "\t</tr>\n";
    }
    insetHtml += "</table>\n";
    $("#tableContainer").html(insetHtml);
}
// returns position of the right-hand-side cell of the entry cell position
function getRight(i, j) {
    let pos = [];
    pos[0] = i;
    pos[1] = (j == n - 1) ? 0 : j + 1
    return pos;
}
// returns position of the left-hand-side cell of the entry cell position
function getLeft(i, j) {
    let pos = [];
    pos[0] = i;
    pos[1] = (j == 0) ? n - 1 : j - 1
    return pos;
}
// returns position of the up-side cell of the entry cell position
function getTop(i, j) {
    let pos = [];
    pos[0] = (i == 0) ? n - 1 : i - 1;
    pos[1] = j;
    return pos;
}
// returns position of the down-side cell of the entry cell position.
function getBottom(i, j) {
    let pos = [];
    pos[0] = (i == n - 1) ? 0 : i + 1;
    pos[1] = j
    return pos;
}
// subtracts 1 from all none-negative values of the playground matrix (this will remove the tail of the snake(changes 0 to -1))
function allSubOne() {
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] >= 0) {
                cells[i][j]--;
            }
        }
    }
}
// move right function
function moveRight() {
	lastMove = 'right'; // saving the move direction in the variable
    // if snake size is the maximum size(n*n), player wins
    if (snakeSize == n * n) win = true;
    // do not work(return) if player is lost or won
    if (win || lost) return;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] === snakeSize - 1 /*if current cell is head of snake*/) {
                if (cells[getRight(i, j)[0]][getRight(i, j)[1]] === -1 /*if right-hand-side cell of current cell is empty*/) {
                    cells[i][j] = snakeSize - 1; // this cell will be the first snake-body-cell (which is connected to head) after subtracting 1 from it
                    cells[getRight(i, j)[0]][getRight(i, j)[1]] = snakeSize; // right-hand-side cell of current cell will be the head of the snake after subtracting 1 from it
                    allSubOne(); // subtract 1 from all none-negative cells --> this will remove the tail of the snake that has value of 0. _ 0 will convert to - 1
                } else if (cells[getRight(i, j)[0]][getRight(i, j)[1]] === -2 /*if right-hand-side cell of current cell is food*/) {
                    snakeSize++; // snake will grow up after eating food
                    cells[getRight(i, j)[0]][getRight(i, j)[1]] = snakeSize - 1; // the food will be changed to head of snake
                    addFood(); // add new food the playground as the food in the playground is eaten
                } else if (cells[getRight(i, j)[0]][getRight(i, j)[1]] >= 0 /*if it happens an accident(snake by it self)*/) {
                    GameOver(); // Game Over
                }
                refreshPage(); // then page is refreshed
                return; // and function ends
            }
        }
    }
}
// move up function
function moveUp() {
	lastMove = 'up'; // saving the move direction in the variable
    // explanation as same as move-right-function
    if (snakeSize == n * n) win = true;
    if (win || lost) return;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] === snakeSize - 1) {
                if (cells[getTop(i, j)[0]][getTop(i, j)[1]] === -1) {
                    cells[i][j] = snakeSize - 1;
                    cells[getTop(i, j)[0]][getTop(i, j)[1]] = snakeSize;
                    allSubOne();
                } else if (cells[getTop(i, j)[0]][getTop(i, j)[1]] === -2) {
                    snakeSize++;
                    cells[getTop(i, j)[0]][getTop(i, j)[1]] = snakeSize - 1;
                    addFood();
                } else if (cells[getTop(i, j)[0]][getTop(i, j)[1]] >= 0) {
                    GameOver();
                }
                refreshPage();
                return;
            }
        }
    }
}
// move left function
function moveLeft() {
	lastMove = 'left'; // saving the move direction in the variable
    // explanation as same as move-right-function
    if (snakeSize == n * n) win = true;
    if (win || lost) return;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] === snakeSize - 1) {
                if (cells[getLeft(i, j)[0]][getLeft(i, j)[1]] === -1) {
                    cells[i][j] = snakeSize - 1;
                    cells[getLeft(i, j)[0]][getLeft(i, j)[1]] = snakeSize;
                    allSubOne();
                } else if (cells[getLeft(i, j)[0]][getLeft(i, j)[1]] === -2) {
                    snakeSize++;
                    cells[getLeft(i, j)[0]][getLeft(i, j)[1]] = snakeSize - 1;
                    addFood();
                } else if (cells[getLeft(i, j)[0]][getLeft(i, j)[1]] >= 0) {
                    GameOver();
                }
                refreshPage();
                return;
            }
        }
    }
}
// move down function
function moveDown() {
	lastMove = 'down'; // saving the move direction in the variable
    // explanation as same as move-right-function
    if (snakeSize == n * n) win = true;
    if (win || lost) return;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] === snakeSize - 1) {
                if (cells[getBottom(i, j)[0]][getBottom(i, j)[1]] === -1) {
                    cells[i][j] = snakeSize - 1;
                    cells[getBottom(i, j)[0]][getBottom(i, j)[1]] = snakeSize;
                    allSubOne();
                } else if (cells[getBottom(i, j)[0]][getBottom(i, j)[1]] === -2) {
                    snakeSize++;
                    cells[getBottom(i, j)[0]][getBottom(i, j)[1]] = snakeSize - 1;
                    addFood();
                } else if (cells[getBottom(i, j)[0]][getBottom(i, j)[1]] >= 0) {
                    GameOver();
                }
                refreshPage();
                return;
            }
        }
    }
}
// finds a random empty cell in the playground for placing food.
function randomEmptyPosition() {
    let EmptyCellsX = []; // for saving x of the empty cells
    let EmptyCellsY = [];   // for saving y of the empty cells
    var c = 0; // counter
    let pos = []; // position tha will be returned
    // finding empty-cells and save their positions in two arrays (one for x and the other one for y)
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (cells[i][j] === -1) {
                EmptyCellsX[c  ] = i;
                EmptyCellsY[c++] = j;
            }
        }
    }
    // choose a random empty cell from empty cells
    let rand = Math.floor(Math.random() * EmptyCellsX.length);
    // save them in the 'pos' array
    pos[0] = EmptyCellsX[rand];
    pos[1] = EmptyCellsY[rand];
    return pos; // and return the position
}
// places a food on random empty position found in function randomEmptyPosition().
function addFood() {
    let pos = randomEmptyPosition(); // Positions of a random empty cell
    cells[pos[0]][pos[1]] = -2; // change that cell to food
    $("span#scoreNumber").text(score); // show the new score to the user
    score++; // Increase the score
}
// the move function according to the move direction
function move() {
    switch (dir) {
        case "right":
            moveRight();
            break;
        case "left":
            moveLeft();
            break;
        case "up":
            moveUp();
            break;
        case "down":
            moveDown();
            break;
    }
}
// start moving of snake
function startMoving() {
	setInterval(move, 150);

}

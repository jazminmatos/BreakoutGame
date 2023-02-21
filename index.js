// Game Board
const gameBoard = document.getElementById("game-board");
const startGame = document.getElementById("start-game"); // button
const gameOver = document.getElementById("game-over"); // gameOver screen
const finalScore = document.getElementById("final-score");
// Scores
const scoreContainer = document.getElementById("score");
let score = 0;
// Ball
let ballTimer;
const ballStartXYPosition = [300, 200]; // [x, y] --> keep track of where to restart the ball
let ballCurrentXYPosition = ballStartXYPosition; // keep track of ball's current position
const ball = new Shape(ballCurrentXYPosition[0] + "px", ballCurrentXYPosition[1] + "px", "ball");
let ballXDirection = 1;
let ballYDirection = -1;
ball.putOnDom();
const ballDiameter = ball.shapeElement.offsetWidth;
const ballHeight = ball.shapeElement.offsetHeight;
// Bricks (8 rows of 8)
Shape.createBricks();
let bricks = Shape.allBricks.map(brick => brick.shapeElement);
// Lives
Life.createFiveLives();
// Paddle
const paddleStartXYPosition = [260, 35]; // [x, y] --> keep track of where to restart the paddle
let paddleCurrentXYPosition = paddleStartXYPosition; // keep track of paddle's current position
const paddle = new Shape(paddleCurrentXYPosition[0] + "px", paddleCurrentXYPosition[1] + "px", "paddle");
paddle.putOnDom();

document.addEventListener("keydown", movePaddleWithKeys);

startGame.addEventListener("click", function(e) {
    // if Life.all array is empty
    if (Life.all.length === 0) {
        // Remove any existing timers
        clearTimeout(ballTimer);
        // Remove game over screen
        gameOver.style.display = "none";
        // Refresh ball position
        ballRefresh();
        // Recreate 5 lives
        Life.createFiveLives();
        // Remove all bricks from gameBoard (if any)
        if (bricks.length > 0) {
            bricks.map(brick => gameBoard.removeChild(brick));
        };
        // Delete existing bricks from allBricks array
        Shape.allBricks = [];
        // Populate w/ new bricks
        Shape.createBricks();
        // reset bricks array (or else bricks won't disappear)
        bricks = Shape.allBricks.map(brick => brick.shapeElement);
        // score gets reset as soon as game over screen hits
    };
        moveBall();
});

// Moving ball
function moveBall() {
    // ball speed & direction
    if (ballCurrentXYPosition[1] > 0) {
        ballCurrentXYPosition[0] += ballXDirection;
        ballCurrentXYPosition[1] += ballYDirection;
        updateBallPosition();
        
        // Checking for Collisions:
        ballBrickCollisions();
        ballWallPaddleCollisions();
        ballBottomOfBoardCollision();

        // Repopulate bricks if ALL bricks disappear
        populateNewBricks();
    };
    ballTimer = setTimeout(moveBall, 7);
};

function updateBallPosition() {
    ball.shapeElement.style.left = ballCurrentXYPosition[0] + "px";
    ball.shapeElement.style.bottom = ballCurrentXYPosition[1] + "px"; 
};

// Move ball back to start position
// Had to hard code it or else didn't work
function ballRefresh() {
    // move ball to the middle
    ballCurrentXYPosition[0] = 300;
    ballCurrentXYPosition[1] = 200;
};

// Purpose: when player destroys all bricks, populate new set of bricks
function populateNewBricks() {
    if (bricks.length === 0) {
        // Delete existing bricks from allBricks array
        Shape.allBricks = [];
        // Populate w/ new bricks
        Shape.createBricks();
        // reset bricks array (or else bricks won't disappear)
        bricks = Shape.allBricks.map(brick => brick.shapeElement);
        // Reset ball position
        ballRefresh();
    };
};

function movePaddleWithKeys(e) {
    switch(e.key) {
        case "a":
        case "ArrowLeft":
            // if x position is within the game-board
            if (paddleCurrentXYPosition[0] > 0) {
                paddleCurrentXYPosition[0] -= 20;
                paddle.shapeElement.style.left = paddleCurrentXYPosition[0] + "px"; 
            };
            break;
        case "d":
        case "ArrowRight":
            // if x position + board width + 5 is on the game-board
            if (paddleCurrentXYPosition[0] < gameBoard.offsetWidth - 80) {
                paddleCurrentXYPosition[0] += 20;
                paddle.shapeElement.style.left = paddleCurrentXYPosition[0] + "px";
            break;
        };
    };
};

function updateScore() {
    score++;
    scoreContainer.innerHTML = '';
    scoreContainer.innerHTML = `<h3>Score: ${score}</h3>`;
};

// -------------------------------- Checking for Collisions Below -------------------------------- //

// Ball & bottom of board collision
function ballBottomOfBoardCollision() {
    // if ball hits bottom of game board
    if (ballCurrentXYPosition[1] <= 0) {
        ballRefresh();
        // remove one lifeElement
        Life.loseLife();
    };
};

// positive x = moving to the right
// negative x = moving to the left
// positive y = moving up
// negative y = moving down
function ballWallPaddleCollisions() {
    // if the ball hits the left of the paddle
    if (
        ballCurrentXYPosition[0] > paddleStartXYPosition[0] && 
        ballCurrentXYPosition[0] < (paddleStartXYPosition[0] + (paddle.shapeElement.offsetWidth/2)) &&
        ballCurrentXYPosition[1] > paddleCurrentXYPosition[1] && 
        ballCurrentXYPosition[1] < (paddleCurrentXYPosition[1] + paddle.shapeElement.offsetHeight) 
    ) {
        // if it's moving to the bottom left, move to the top left
        if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // if x & y are negative
            ballYDirection = Math.abs(ballYDirection); // make y positive
            return;
        };
        // if it's moving to the bottom right, move to the top left
        if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // positive x & negative y
            ballXDirection = -Math.abs(ballXDirection); // make x negative
            ballYDirection = Math.abs(ballYDirection); // make y positive
            return;
        }
    };
    // if the ball hits right half of paddle
    if (
        ballCurrentXYPosition[0] > (paddleStartXYPosition[0] + (paddle.shapeElement.offsetWidth/2)) && 
        ballCurrentXYPosition[0] < (paddleStartXYPosition[0] + paddle.shapeElement.offsetWidth) &&
        ballCurrentXYPosition[1] > paddleCurrentXYPosition[1] && 
        ballCurrentXYPosition[1] < (paddleCurrentXYPosition[1] + paddle.shapeElement.offsetHeight) 
    ) {
        // if it's moving to the bottom left, move to the top right
        if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // if x & y are negative
            ballXDirection = Math.abs(ballXDirection); // make x positive
            ballYDirection = Math.abs(ballYDirection); // make y positive
            return;
        };

        // if it's moving to the bottom right, move to the top right
        if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x is positive, y is negative
            ballYDirection = Math.abs(ballYDirection); // make y positive
            return;
        };
    };

    // if ball hits top wall
    if (ballCurrentXYPosition[1] >= (gameBoard.offsetHeight - ballDiameter)) {
        ballYDirection = ballYDirection * -1;
        return;
    };

    // if ball hits left wall
    if (ballCurrentXYPosition[0] <= 0) {
        // if it's moving to top left, move to top right
        if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // x is negative, y is positive
            ballXDirection = Math.abs(ballXDirection); // x is positive
            return;
        };

        // if it's moving to bottom left, move to bottom right
        if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x is negative, y is negative
            ballXDirection = Math.abs(ballXDirection); // x is positive
            return;
        };
    };

    // if ball hits right wall
    if (ballCurrentXYPosition[0] >= (gameBoard.offsetWidth - ballDiameter)) {
        // if it's moving to the top right, move top left
        if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // if both x & y are positive
            ballXDirection = -Math.abs(ballXDirection); // make x negative
            return;
        };

        // if it's moving to the bottom right, move bottom left
        if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // if x is positive & y is negative
            ballXDirection = -Math.abs(ballXDirection); // make x negative
            return;
        };
    };
};

function ballBrickCollisions() {
    for (let i = 0; i < bricks.length; i++) {
        let brickLeft = parseInt(bricks[i].style.left);
        let brickBottom = parseInt(bricks[i].style.bottom);
        
        function brickDisappearsAndScore() {
            // when hit, remove from parentContainer
            gameBoard.removeChild(bricks[i]);
            // Remove it from bricks array so that JS is not checking something that doesn't exist
            bricks.splice(i, 1);
            // when ball hits brick, score goes up one point
            updateScore();
        };

        if (
            // bottom of brick
            ballCurrentXYPosition[1] + ballHeight <= brickBottom && ballCurrentXYPosition[1] > brickBottom - ballHeight - 2 &&
            ((ballCurrentXYPosition[0] >= brickLeft && ballCurrentXYPosition[0] <= brickLeft + bricks[i].offsetWidth) || (ballCurrentXYPosition[0] + ballDiameter >= brickLeft && ballCurrentXYPosition[0] + ballDiameter <= brickLeft + bricks[i].offsetWidth))
        ) {
            // console.log("inside bottom of brick")
            brickDisappearsAndScore();

            // if moving top right, move bottom right
            if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // x is positive, y is positive
                ballYDirection = -Math.abs(ballYDirection); // make y negative
                return;
            };

            // if moving top left, move bottom left
            if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // x is negative, y is positive
                ballYDirection = -Math.abs(ballYDirection); // make y negative
                return;
            };
        };

        // top side of brick
        if (
            ballCurrentXYPosition[1] >= brickBottom + bricks[i].offsetHeight && ballCurrentXYPosition[1] + ballHeight < brickBottom + bricks[i].offsetHeight + ballDiameter + 2 && // ballCurrentXYPosition[1] > brickBottom &&
            ((ballCurrentXYPosition[0] >= brickLeft && ballCurrentXYPosition[0] <= brickLeft + bricks[i].offsetWidth) || (ballCurrentXYPosition[0] + ballDiameter >= brickLeft && ballCurrentXYPosition[0] + ballDiameter <= brickLeft + bricks[i].offsetWidth))
        ) {
            // console.log("inside top of brick")
            brickDisappearsAndScore();

            // if moving bottom right, move top right
            if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x is positive, y is negative
                ballYDirection = Math.abs(ballYDirection); // make y positive
                return;
            };

            // if moving bottom left, move top left
            if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x is negative, y is negative 
                ballYDirection = Math.abs(ballYDirection); // make y positive
                return;
            };
        };

        // left side of brick
        if (
            ballCurrentXYPosition[0] + ballDiameter <= brickLeft && ballCurrentXYPosition[0] > brickLeft - ballDiameter - 2 && // ballCurrentXYPosition[0] + ballDiameter < brickLeft + bricks[i].offsetWidth &&
            ((ballCurrentXYPosition[1] >= brickBottom && ballCurrentXYPosition[1] <= brickBottom + bricks[i].offsetHeight) || (ballCurrentXYPosition[1] + ballHeight >= brickBottom && ballCurrentXYPosition[1] + ballHeight <= brickBottom + bricks[i].offsetHeight))
        ) {
            // console.log("inside left side of brick")
            // when hit, remove from parentContainer
            brickDisappearsAndScore();

            // if ball moving bottom right, move bottom left
            if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x is positive, y is negative
                ballXDirection = -Math.abs(ballXDirection); // make x negative
                return;
            };
            
            // if ball moving top right, move top left
            if (ballXDirection === Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // x & y are positive
                ballXDirection = -Math.abs(ballXDirection); // make x negative
                return;
            };
        };

        // right side of brick
        if (
            ballCurrentXYPosition[0] >= brickLeft + bricks[i].offsetWidth && ballCurrentXYPosition[0] <= brickLeft + bricks[i].offsetWidth + 2 &&// ballCurrentXYPosition[0] > brickLeft &&
            // ((ballCurrentXYPosition[1] > brickBottom && ballCurrentXYPosition[1] + ballHeight < brickBottom + bricks[i].offsetHeight))
            ((ballCurrentXYPosition[1] >= brickBottom && ballCurrentXYPosition[1] <= brickBottom + bricks[i].offsetHeight) || (ballCurrentXYPosition[1] + ballHeight >= brickBottom && ballCurrentXYPosition[1] + ballHeight <= brickBottom + bricks[i].offsetHeight))
        ) {
            // console.log("inside right side of brick")
            brickDisappearsAndScore();
            
            // if moving bottom left, move bottom right
            if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === -Math.abs(ballYDirection)) { // x & y are negative
                ballXDirection = Math.abs(ballXDirection); // make x positive
                return;
            };

            // if moving top left, move top right
            if (ballXDirection === -Math.abs(ballXDirection) && ballYDirection === Math.abs(ballYDirection)) { // x is negative, y is positive
                ballXDirection = Math.abs(ballXDirection); // make x positive
                return;
            };
        };
    };
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Elements
const speedSelect = document.getElementById("speedSelect");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const restartButton = document.getElementById("restartButton");
const bgMusic = document.getElementById("bgMusic");
const hitSound = document.getElementById("hitSound");

// Music Volume
bgMusic.volume = 0.5;
hitSound.volume = 0.8;

// Ball & Paddle
let ballRadius = 8;
let x, y, dx, dy;
let paddleHeight = 12;
let paddleWidth = 100;
let paddleX, paddleY;

// Game flags
let gameRunning = false;
let gameOver = false;
let score = 0;

// Bricks
let brickRowCount = 6;
let brickColumnCount = 8;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 20;

let brickWidth = (canvas.width - brickOffsetLeft * 2 - brickPadding * (brickColumnCount - 1)) / brickColumnCount;
let brickHeight = 15;
let bricks = [];

// Paddle Control
const paddleSpeed = 10;
let leftPressed = false;
let rightPressed = false;

const speedLevels = {
    slow: 0.5,
    medium: 1,
    fast: 1.5
};
let speedMultiplier = speedLevels.medium;

// Setup game
function initializeGame() {
    x = canvas.width / 2;
    y = canvas.height - 40;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 10;

    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score;
}

initializeGame();

// Paddle movement
function movePaddle() {
    if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }
}

// Key events
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
});

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
                let brickY = brickOffsetTop + r * (brickHeight + brickPadding);
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x && x < b.x + brickWidth &&
                    y > b.y && y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    document.getElementById("score").innerText = score;
                    hitSound.currentTime = 0;
                    hitSound.play();
                }
            }
        }
    }
}

// Ball movement
function updateBall() {
    x += dx * speedMultiplier;
    y += dy * speedMultiplier;

    // Wall collisions
    if (x + ballRadius > canvas.width || x - ballRadius < 0) {
        dx = -dx;
    }
    if (y - ballRadius < 0) {
        dy = -dy;
    }

    // Paddle collision
    if (
        y + ballRadius >= paddleY &&
        x > paddleX && x < paddleX + paddleWidth
    ) {
        dy = -Math.abs(dy); // Always bounce upward
    }

    // Bottom collision
    if (y + ballRadius > canvas.height) {
        endGame();
    }

    collisionDetection();
}

// Draw game over
function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Draw everything
function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    movePaddle();
    updateBall();

    if (gameOver) {
        drawGameOver();
    } else {
        requestAnimationFrame(draw);
    }
}

// Controls
function startGame() {
    if (!gameOver) {
        speedMultiplier = speedLevels[speedSelect.value];
        gameRunning = true;
        bgMusic.play().catch(() => {});
        draw();
    }
}

function stopGame() {
    gameRunning = false;
    bgMusic.pause();
}

function restartGame() {
    initializeGame();
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
    startGame();
}

function endGame() {
    gameRunning = false;
    gameOver = true;
    drawGameOver();
    bgMusic.pause();
}

// Buttons
startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);
restartButton.addEventListener("click", restartGame);

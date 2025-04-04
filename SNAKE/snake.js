const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

const box = 15;
let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "right";
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let score = 0;
let gameInterval;
let speed = 200;
let isRunning = false;

const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverMessage = document.getElementById("gameOverMessage");

// Load audio files
const bgMusic = new Audio("bg-music.mp3");
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("game-over.mp3");

bgMusic.loop = true; // Loop background music

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "lime";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "right") snakeX += box;
    if (direction === "left") snakeX -= box;
    if (direction === "up") snakeY -= box;
    if (direction === "down") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreDisplay.textContent = score; // Update Score Display
        eatSound.play(); // Play eating sound
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOverMessage.textContent = "Game Over! Final Score: " + score;
        gameOverSound.play(); // Play game over sound
        stopGame();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function changeDirection(newDirection) {
    if (newDirection === "up" && direction !== "down") direction = "up";
    if (newDirection === "down" && direction !== "up") direction = "down";
    if (newDirection === "left" && direction !== "right") direction = "left";
    if (newDirection === "right" && direction !== "left") direction = "right";
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") changeDirection("up");
    if (event.key === "ArrowDown") changeDirection("down");
    if (event.key === "ArrowLeft") changeDirection("left");
    if (event.key === "ArrowRight") changeDirection("right");
});

function restartGame() {
    stopGame();
    snake = [{ x: 5 * box, y: 5 * box }];
    direction = "right";
    score = 0;
    scoreDisplay.textContent = score;
    gameOverMessage.textContent = "";
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    startGame();
}

function setSpeed(newSpeed) {
    speed = newSpeed;
}

function startGame() {
    if (!isRunning) {
        isRunning = true;
        bgMusic.play(); // Start background music
        gameInterval = setInterval(draw, speed);
    }
}

function stopGame() {
    clearInterval(gameInterval);
    isRunning = false;
    bgMusic.pause(); // Stop background music
    bgMusic.currentTime = 0; // Reset music
}

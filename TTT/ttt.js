// Game logic variables
let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('#reset-btn');
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');
let currentPlayer = "O";  // Player who is currently playing (starts with O)
let board = Array(9).fill(null);  // Empty board

// Load sounds for placing X and O, and for winning
const placeOSound = new Audio('place-o.mp3');
const placeXSound = new Audio('place-x.mp3');
const winSound = new Audio('win-sound.mp3');

// Winning patterns (indexes of buttons in the grid)
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to check for a winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            showWinner(board[a]);
            return true;
        }
    }
    return false;
};

// Show winner message
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");  // Show message container
    disableBoxes();  // Disable all boxes
    winSound.play();  // Play win sound
};

// Draw game logic
const gameDraw = () => {
    msg.innerText = "It's a draw!";
    msgContainer.classList.remove("hide");  // Show message container
};

// Disable all boxes
const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

// Enable all boxes (for a new game)
const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
    });
    board.fill(null);  // Reset the board array
};

// Handle click on each box
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        // If box is already filled, don't do anything
        if (board[index]) return;

        // Fill the box with the current player's symbol
        box.innerText = currentPlayer;
        board[index] = currentPlayer;  // Update board array

        // Play sound based on current player
        if (currentPlayer === "O") {
            placeOSound.play();  // Play sound for "O"
        } else {
            placeXSound.play();  // Play sound for "X"
        }

        // Check for winner
        if (checkWinner()) {
            return;
        }

        // Check for draw
        if (board.every(cell => cell)) {
            gameDraw();
            return;
        }

        // Change player turn
        currentPlayer = currentPlayer === "O" ? "X" : "O";
    });
});

// Reset the game when clicking reset button
resetBtn.addEventListener('click', () => {
    enableBoxes();
    msgContainer.classList.add("hide");  // Hide message container
    currentPlayer = "O";  // Reset to Player O's turn
});

// Start a new game when clicking new game button
newGameBtn.addEventListener('click', () => {
    enableBoxes();
    msgContainer.classList.add("hide");  // Hide message container
    currentPlayer = "O";  // Reset to Player O's turn
});

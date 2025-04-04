// List of words used in the game
const words = ['shark', 'whale', 'dolphin', 'octopus', 'crab', 'fish', 'turtle', 'seal', 'jellyfish', 'starfish', 'computer', 'coding', 'algorithm', 'debug', 'software', 'hardware', 'binary', 'network', 'internet', 'program', 'database', 'encryption', 'firewall', 'compiler', 'variable', 'function', 'syntax', 'runtime', 'inheritance', 'polymorphism', 'recursion', 'loop', 'array', 'stack', 'queue', 'object', 'class', 'method', 'constructor', 'node', 'server', 'client', 'cloud', 'blockchain', 'machinelearning', 'datastructure', 'cybersecurity', 'processor', 'algorithm', 'API', 'framework', 'repository', 'virtualization', 'microservices', 'container', 'orchestration', 'parallelism', 'multithreading', 'asynchronous', 'eventloop', 'closure', 'prototype', 'inheritance', 'encapsulation', 'abstraction', 'OSI', 'TCP', 'UDP', 'protocol', 'bandwidth', 'latency', 'throughput', 'ping', 'ipaddresses', 'subnet', 'firewall', 'router', 'switch', 'hub', 'modem', 'gateway', 'DNS', 'DHCP', 'NAT', 'VP'];



// Game state variables
let score = 0;
localStorage.setItem('typingWizardHighScore', 0); // Initialize high score in local storage
// Check if high score exists in local storage, if not set to 0
let highScore = localStorage.getItem('typingWizardHighScore') || 0;
let missed = 0;
let activeGame = false;

// DOM element references
const gameContainer = document.getElementById("gameContainer");
const inputField = document.getElementById("inputField");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const highScoreDisplay = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOver");
const highScoreOverDisplay = document.getElementById("highScoreOver");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const bgMusic = document.getElementById("bgMusic");

// Start game when the start button is clicked
startButton.onclick = () => { 
    startScreen.classList.add('hidden'); // Hide start screen
    scoreDisplay.classList.remove('hidden'); // Show score display
    missedDisplay.classList.remove('hidden'); // Show missed display
    highScoreDisplay.innerText = 'High Score: ' + highScore;
    highScoreDisplay.classList.remove('hidden'); // Show high score
    activeGame = true; // Set game as active
    inputField.focus(); // Focus on input field
    startGame(); // Start spawning words
    bgMusic.play(); // Play background music
};

// Reload page on restart
restartButton.onclick = () => { 
    // location.reload(); // Reload the page
    resetGame(); // Reset game state
    startGame();
    inputField.focus(); // Focus on input field
    bgMusic.currentTime = 0; // Reset music to start
    bgMusic.play();
};

// Function to create and animate words
function createWord() {
    if (!activeGame) return;
    const word = document.createElement('div');
    word.classList.add('word');
    word.innerText = words[Math.floor(Math.random() * words.length)];
    word.style.left = Math.random() * 80 + 'vw';
    word.style.top = '-10vh';
    gameContainer.appendChild(word);

    // Animation interval
    const moveWord = setInterval(() => {
        word.style.top = (parseInt(word.style.top) + 2) + 'px';
        if (parseInt(word.style.top) > window.innerHeight) { // If word reaches bottom
            clearInterval(moveWord);
            gameContainer.removeChild(word);
            missed++;
            missedDisplay.innerText = 'Missed: ' + missed; // Update display
            if (missed >= 3) gameOver(); // Trigger game over
            if (missed === 2) {
                missedDisplay.style.color = 'red';
            }
        }
    }, 100);
}

// Function to start generating words
function startGame() { 

    setInterval(createWord, 5000); 
}

function resetGame() {
    score = 0;
    missed = 0;
    // scoreDisplay.innerText = 'Score: 0';
    activeGame = true;
    gameOverScreen.classList.add('hidden');
    highScoreOverDisplay.classList.add('hidden'); // Hide it during gameplay
    highScoreDisplay.innerText = 'High Score: ' + highScore;
    highScoreDisplay.classList.remove('hidden');
    scoreDisplay.innerText = 'Score: ' + score;
    missedDisplay.innerText = 'Missed: 0';
    missedDisplay.style.color = '#ffffff'; // Reset color to default

    // Remove all existing word elements
    document.querySelectorAll('.word').forEach(word => word.remove());
}

// Event listener to handle typing
inputField.addEventListener('input', () => {
    const typed = inputField.value;
    document.querySelectorAll('.word').forEach(word => {
        if (word.innerText.startsWith(typed)) {
            word.style.backgroundColor = 'yellow'; // Highlight matching words
        } else {
            word.style.backgroundColor = ''; // Remove highlight
        }
        if (word.innerText === typed) { // Correct word typed
            gameContainer.removeChild(word);
            score += 10;
            scoreDisplay.innerText = 'Score: ' + score;
            inputField.value = ''; // Clear input
        }
    });
});

// Function to handle game over
function gameOver() {
    activeGame = false;
    document.querySelectorAll('.word').forEach(word => word.remove()); // Remove all words
    gameOverScreen.classList.remove('hidden'); // Show game over screen
    highScoreDisplay.classList.add('hidden');
    highScoreOverDisplay.classList.remove('hidden'); // Show high score above game over screen
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('typingWizardHighScore', highScore);
        highScoreOverDisplay.innerText = 'High Score: ' + score; // Update high score display
    }else {
        highScoreOverDisplay.innerText = 'High Score: ' + highScore; // Show high score on game over screen
    }
    bgMusic.pause(); // Pause background music
}

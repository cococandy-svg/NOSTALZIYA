const grid = document.getElementById('grid');
let board = [];

// Load audio files
const bgMusic = new Audio('background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;

const mergeSound = new Audio('merge.mp3');
mergeSound.volume = 0.4;

const gameOverSound = new Audio('gameover.mp3');
gameOverSound.volume = 0.6;

let musicStarted = false;

function init() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    addRandom();
    addRandom();
    draw();
}

function addRandom() {
    let empty = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length > 0) {
        let { r, c } = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function draw() {
    grid.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (value) {
                cell.textContent = value;
                cell.setAttribute('data-value', value);
            }
            grid.appendChild(cell);
        });
    });

    if (isGameOver()) {
        document.getElementById('message').innerText = "Game Over!";
        bgMusic.pause();
        gameOverSound.play();
    } else {
        document.getElementById('message').innerText = "";
    }
}

function move(dir) {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let line = [];
        for (let j = 0; j < 4; j++) {
            let value = (dir === 'left' || dir === 'right') ? board[i][j] : board[j][i];
            if (value !== 0) line.push(value);
        }

        if (dir === 'right' || dir === 'down') line.reverse();

        for (let j = 0; j < line.length - 1; j++) {
            if (line[j] === line[j + 1]) {
                line[j] *= 2;
                line.splice(j + 1, 1);
                line.push(0);
                mergeSound.play();
            }
        }

        while (line.length < 4) line.push(0);
        if (dir === 'right' || dir === 'down') line.reverse();

        for (let j = 0; j < 4; j++) {
            let value = (dir === 'left' || dir === 'right') ? board[i][j] : board[j][i];
            if (value !== line[j]) {
                moved = true;
                if (dir === 'left' || dir === 'right') board[i][j] = line[j];
                else board[j][i] = line[j];
            }
        }
    }

    if (moved) {
        addRandom();
        draw();
    }
}

function isGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false;
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', e => {
    if (!musicStarted) {
        bgMusic.play().catch(err => console.log("Music autoplay blocked:", err));
        musicStarted = true;
    }

    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
});

init();

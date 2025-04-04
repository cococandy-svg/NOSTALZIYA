let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;

// Audio files (must be in the same folder)
let bgm = new Audio("bgm.mp3");
let hitMoleSound = new Audio("hit-mole.mp3");
let hitCactusSound = new Audio("hit-cactus.mp3");
bgm.loop = true;

window.onload = function() {
    setGame();

    // Fix autoplay by waiting for user interaction
    document.addEventListener("click", initAudio, { once: true });
}

function initAudio() {
    bgm.play().catch(e => {
        console.log("Autoplay blocked:", e);
    });
}

function setGame() {
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    setInterval(setMole, 1000);
    setInterval(setPlant, 2000);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) return;

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;

    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./cacti.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) return;

    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) return;

    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();
        hitMoleSound.currentTime = 0;
        hitMoleSound.play();
    } else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString();
        hitCactusSound.currentTime = 0;
        hitCactusSound.play();
        bgm.pause();
        gameOver = true;
    }
}

function restartGame() {
    if (currMoleTile) currMoleTile.innerHTML = "";
    if (currPlantTile) currPlantTile.innerHTML = "";
    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score.toString();
    bgm.currentTime = 0;
    bgm.play();
}
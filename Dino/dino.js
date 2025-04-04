// Board
let board;
let boardwidth = 750;
let boardheight = 250;
let context;

// Dino
let dinowidth = 80;
let dinoheight = 94;
let dinox = 50;
let dinoy = boardheight - dinoheight;
let dinoimg;

let dino = {
    x: dinox,
    y: dinoy,
    height: dinoheight,
    width: dinowidth
};

// Cactus
let cactusarray = [];
let cactus1width = 34;
let cactus2width = 69;
let cactus3width = 102;
let cactusheight = 70;
let cactusx = 700;
let cactusy = boardheight - cactusheight;

let cactus1img, cactus2img, cactus3img;

// Physics
let velocityx = -8;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;
let score = 0;

// Sounds
let bgm = new Audio("./bgm.mp3");  // Background Music
let jumpSound = new Audio("./jump.mp3");  // Jump Sound
let hitSound = new Audio("./hit.mp3");  // Hit Sound

bgm.loop = true;  // Make BGM loop automatically
bgm.play();  // Start the music when game loads

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    // Load Images
    dinoimg = new Image();
    dinoimg.src = "./dino.png";
    dinoimg.onload = function () {
        context.drawImage(dinoimg, dino.x, dino.y, dino.width, dino.height);
    };

    cactus1img = new Image();
    cactus1img.src = "./cactus1.png";

    cactus2img = new Image();
    cactus2img.src = "./cactus2.png";

    cactus3img = new Image();
    cactus3img.src = "./cactus3.png";

    requestAnimationFrame(update);
    setInterval(placecactus, 700); // More frequent cactus spawns
    document.addEventListener("keydown", movedino);
};

function update() {
    if (gameover) {
        context.fillStyle = "red";
        context.font = "30px Arial";
        context.fillText("Game Over! Press Space to Restart", 150, 100);
        return;
    }
    
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Dino Physics
    velocityy += gravity;
    dino.y = Math.min(dino.y + velocityy, dinoy);
    context.drawImage(dinoimg, dino.x, dino.y, dino.width, dino.height);

    // Cactus Movement
    for (let i = 0; i < cactusarray.length; i++) {
        let cactus = cactusarray[i];
        cactus.x += velocityx;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Collision Detection
        if (detectcollision(dino, cactus)) {
            gameover = true;
            hitSound.play();  // Play hit sound
            bgm.pause();  // Stop BGM on game over
            dinoimg.src = "./dinodead.png";
            dinoimg.onload = function () {
                context.drawImage(dinoimg, dino.x, dino.y, dino.width, dino.height);
            };
        }
    }

    // Score Display
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Score: " + score, 5, 20);
    score++;
}

function movedino(e) {
    if (gameover && (e.code == "Space" || e.code == "ArrowUp")) {  
        restartGame();  // Restart on Space or Arrow Up
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y >= dinoy) { 
        velocityy = -12;  // Jump
        jumpSound.play();  // Play jump sound
    }
}

// Restart Game Function
function restartGame() {
    gameover = false;
    score = 0;
    dino.y = dinoy;
    dinoimg.src = "./dino.png";  // Reset Dino Image
    cactusarray = [];  // Clear cactuses

    // Restart Background Music from Beginning
    bgm.currentTime = 0;  
    bgm.play();

    requestAnimationFrame(update);
}

// Spawn Cactus
function placecactus() {
    if (gameover) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusx,
        y: cactusy,
        width: null,
        height: cactusheight
    };

    let placecactuschance = Math.random();

    if (placecactuschance > 0.85) {  
        cactus.img = cactus3img;
        cactus.width = cactus3width;
    } else if (placecactuschance > 0.55) {  
        cactus.img = cactus2img;
        cactus.width = cactus2width;
    } else {  
        cactus.img = cactus1img;
        cactus.width = cactus1width;
    }

    cactusarray.push(cactus);

    if (cactusarray.length > 5) {
        cactusarray.shift(); // Remove the first cactus
    }
}

// Collision Detection
function detectcollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

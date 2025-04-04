//board
let board;
let boardwidth=360;
let boardheight=640;
let context;

//bird
let birdwidth=34;
let birdheight=24;
let birdX=boardwidth/8;
let birdY=boardheight/2;
let birdimage;

let bird={
    x:birdX,
    y:birdY,
    width:birdwidth,
    height:birdheight
}

//pipes
let pipe;
let pipearray=[];
let pipewidth=64;//width:height::384:3072::1/8
let pipeheight=512;
let pipex=boardwidth;
let pipey=0;

let toppipeimg;
let bottompipeimg;


//physics
let velocityx=-1.5;//pipe moves left speed
let velocityy=0;
let gravity=0.15;

let gameover=false;
let score=0;


//sound
let wingsound=new Audio("./sfx_wing.wav");
let hitsound=new Audio("/.sfx_hit.wav");
let bgm=new Audio("bgm.mp3");
bgm.loop=true;


window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");//used for drawing on the board

    //draw flappy bird
    //context.fillStyle="green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);


    //load image
    birdimage=new Image();
    birdimage.src="./flappybird2.png";
    birdimage.onload=function(){ 
         context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);
    }

    toppipeimg=new Image()
    toppipeimg.src="./toppipe.png";

    bottompipeimg=new Image();
    bottompipeimg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placepipes,1500);//every1.5sec
    document.addEventListener("keydown",movebird)
}

function update(){
    requestAnimationFrame(update);
    if (gameover) {
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);
        context.fillText("GAME OVER", 5, 90);
        bgm.pause();
        bgm.currentTime = 0; // Reset BGM
        return; // Stop updating the game
    }
    
    context.clearRect(0,0,board.width,board.height),

    //bird
    velocityy+=gravity;
    bird.y=Math.max(bird.y+velocityy,0);//apply gravity Nd limits the max height to the top of  the canvas
    context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameover=true
    }

    //pipes updates pipe on our canvas every 1.5 sec
    for(let i=0;i<pipearray.length;i++)
    {
        pipe=pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height)

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;//since it passes two pipe botytom and top pipe
            pipe.passed=true;
        }


        if(detectcollision(bird,pipe)){
            hitsound.play();
            gameover=true;
        }
    }

    //clear pipes
    while(pipearray.length>0 && pipearray[0].x< -pipewidth){
        pipearray.shift();//removes first element from the array
    }

    //score
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);

    if (gameover){
        context.fillText("GAME OVER",5,90)
        bgm.pause();
        bgm.currentTime=0;
    }

}



function placepipes(){
    if(gameover){
        return;
    }
    let openingspace=board.height/4;
    let randompipey=pipey- pipeheight/4  -Math.random()*(pipeheight/2)  ;

    let toppipe={
        img:toppipeimg,
        x:pipex,
        y:randompipey,
        width:pipewidth,
        height:pipeheight,
        passed:false//checks if the flappy bird has passed the pipe yet
    };

    pipearray.push(toppipe);

    let bottompipe={
        img:bottompipeimg,
        x:pipex,
        y:randompipey+pipeheight+openingspace,
        width:pipewidth,
        height:pipeheight,
        passed:false//checks if the flappy bird has passed the pipe yet
    };
    
    pipearray.push(bottompipe);
}

function movebird(e){
    if (gameover) {
        resetGame();
        return;
    }
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        if (bgm.paused){
            bgm.play();
        }
        wingsound.play();
        velocityy=-4;
    }
}

   
function detectcollision(a,b){
    return a.x<b.x+b.width&&
        a.x+a.width>b.x&&
        a.y<b.y+b.height&&
        a.y+a.height>b.y;
}

function resetGame() {
    bird.y = birdY; // Reset bird's position
    velocityy = 0;   // Reset bird's velocity to stop instant fall
    pipearray = [];  // Clear old pipes
    score = 0;       // Reset score
    gameover = false;
    bgm.play();
}

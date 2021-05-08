
const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

let hitSound = new Audio();
let wallSound = new Audio();
let userScoreSound = new Audio();
let comScoreSound = new Audio();

hitSound.src = "pong/sounds/hit.mp3";
wallSound.src = "pong/sounds/wall.mp3";
comScoreSound.src = "pong/sounds/comScore.mp3";
userScoreSound.src = "pong/sounds/userScore.mp3";

// Ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// User Paddle
const userPaddle = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// COM Paddle
const comPaddle = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}


function drawRectangle(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePosition);

function getMousePosition(evt){
    let rect = canvas.getBoundingClientRect();
    
    userPaddle.y = evt.clientY - rect.top - userPaddle.height/2;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRectangle(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collisionDetection(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}


function update(){
    
    if( ball.x - ball.radius < 0 ){
        comPaddle.score++;
        comScoreSound.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        userPaddle.score++;
        userScoreSound.play();
        resetBall();
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    comPaddle.y += ((ball.y - (comPaddle.y + comPaddle.height/2)))*0.1;
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wallSound.play();
    }
    
    let player = (ball.x + ball.radius < canvas.width/2) ? userPaddle : comPaddle;
    
    if(collisionDetection(ball,player)){
        hitSound.play();
        let collidePoint = (ball.y - (player.y + player.height/2));

        collidePoint = collidePoint / (player.height/2);
        
        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render(){
    
    drawRectangle(0, 0, canvas.width, canvas.height, "#000");
    
    drawText(userPaddle.score,canvas.width/4,canvas.height/5);
    
    drawText(comPaddle.score,3*canvas.width/4,canvas.height/5);
    
    drawNet();
    
    drawRectangle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    
    drawRectangle(comPaddle.x, comPaddle.y, comPaddle.width, comPaddle.height, comPaddle.color);
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}

let framePerSecond = 50;

let loop = setInterval(game,1000/framePerSecond);
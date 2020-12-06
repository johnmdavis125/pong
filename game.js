let canvas;
let canvasContext;
let ballX = 50; 
let ballY = 50; 
let ballSpeedX = 10; 
let ballSpeedY = 4; 

let player1Score = 0; 
let player2Score = 0; 
const winningScore = 3; 

let showingWinScreen = false; 

let paddle1Y = 250; 
let paddle2Y = 250; 
const paddleHeight = 100; 
const paddleWidth = 10; 

const calculateMousePos = (event) => {
    let rect = canvas.getBoundingClientRect(); 
    let root = document.documentElement; 
    let mouseX = event.clientX - rect.left - root.scrollLeft; 
    let mouseY = event.clientY - rect.top - root.scrollTop; 
    return {
        x: mouseX,
        y: mouseY
    }
}

const handleMouseClick = (event) => {
    if (showingWinScreen){
        player1Score = 0; 
        player2Score = 0; 
        showingWinScreen = false; 
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas'); 
    canvasContext = canvas.getContext('2d'); 

    let framesPerSecond = 30; 
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond); 

    canvas.addEventListener('mousedown', handleMouseClick); 

    canvas.addEventListener('mousemove', function(event) {
        let mousePos = calculateMousePos(event); 
        paddle1Y = mousePos.y - (paddleHeight / 2); 
    })

}

const ballReset = () => {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        showingWinScreen = true; 
    }

    ballSpeedX = -ballSpeedX; 
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

const computerMovement = () => {
    let paddle2YCenter = paddle2Y + (paddleHeight / 2); 
    if (paddle2YCenter < (ballY - 35)) {
        paddle2Y += 6; 
    } else if (paddle2YCenter > (ballY + 35)){
        paddle2Y -= 6; 
    }
}

const moveEverything = () => {     
    if(showingWinScreen) {
        return; 
    }
    computerMovement(); 

    ballX += ballSpeedX; 
    ballY += ballSpeedY; 

    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < (paddle2Y + paddleHeight)){
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (paddle2Y + (paddleHeight / 2));
            ballSpeedY = deltaY * 0.35; 

        } else {
            player1Score ++;
            ballReset(); 
        }
    }
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < (paddle1Y + paddleHeight)){
            ballSpeedX = -ballSpeedX;

            let deltaY = ballY - (paddle1Y + (paddleHeight / 2));
            ballSpeedY = deltaY * 0.35; 

        } else {
            player2Score ++; 
            ballReset(); 
        }
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY; 
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY; 
    }
}

const drawNet = () => {
    for (let i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i , 2 , 20 , 'white'); 
    }
}

const drawEverything = () => {
    // background
    colorRect(0,0,canvas.width,canvas.height,'black');  

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white'; 

        if (player1Score >= winningScore) {
            canvasContext.fillText('Left Player Won!', 350, 200);
        } else if (player2Score >= winningScore) {
            canvasContext.fillText('Right Player Won!', 350, 200); 
        }

        canvasContext.fillText("Click to continue", 350, 500); 
        return; 
    }

    drawNet(); 

    // left player
    colorRect(0,paddle1Y,paddleWidth,paddleHeight,'white');    
    // right player
    colorRect((canvas.width - paddleWidth), paddle2Y, paddleWidth, paddleHeight, 'white'); 
    // ball
    colorCircle(ballX, ballY, 10, 'white');  

    canvasContext.fillText(`Player 1 Score: ${player1Score}`, 100, 100); 
    canvasContext.fillText(`Player 2 Score: ${player2Score}`, canvas.width - 180, 100); 
};

const colorCircle = (centerX, centerY, radius, drawColor) => {
    canvasContext.fillStyle = drawColor; 
    canvasContext.beginPath(); 
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);  
    canvasContext.fill(); 
};

const colorRect = (leftX, topY, width, height, drawColor) => {
    canvasContext.fillStyle = drawColor; 
    canvasContext.fillRect(leftX, topY, width, height); 
};
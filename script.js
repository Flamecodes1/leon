const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let player = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0
};
let obstacles = [];
let keys = {};

function drawPlayer() {
    ctx.fillStyle = "#3498db";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = "#e74c3c";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function generateObstacle() {
    const size = Math.random() * 30 + 20;
    const y = Math.random() * (canvas.height - size);
    obstacles.push({
        x: canvas.width,
        y: y,
        width: size,
        height: size
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Begrenzungen für die Spielfigur
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateScore() {
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            alert("Game Over! Score: " + score);
            resetGame();
        }
    });
}

function resetGame() {
    score = 0;
    obstacles = [];
    player.x = 50;
    player.y = canvas.height / 2;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    movePlayer();
    updateObstacles();
    updateScore();
    detectCollision();

    if (Math.random() < 0.03) generateObstacle();

    requestAnimationFrame(gameLoop);
}

function handleKeyDown(e) {
    keys[e.key] = true;
    if (keys['ArrowUp']) player.dy = -player.speed;
    if (keys['ArrowDown']) player.dy = player.speed;
    if (keys['ArrowLeft']) player.dx = -player.speed;
    if (keys['ArrowRight']) player.dx = player.speed;
}

function handleKeyUp(e) {
    keys[e.key] = false;
    if (!keys['ArrowUp'] && !keys['ArrowDown']) player.dy = 0;
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) player.dx = 0;
}

// Eventlistener für die Tastensteuerung
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

gameLoop();

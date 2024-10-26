const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let player = { x: 50, y: canvas.height / 2, width: 30, height: 30, speed: 5 };
let obstacles = [];
let isJumping = false;

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
  const height = Math.random() * (canvas.height - 100) + 50;
  obstacles.push({ x: canvas.width, y: height, width: 20, height: 20 });
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= 5;
  });
  obstacles = obstacles.filter(obstacle => obstacle.x > -obstacle.width);
}

function handleTouchStart() {
  if (!isJumping) {
    isJumping = true;
    let jumpCount = 0;

    const jumpInterval = setInterval(() => {
      if (jumpCount < 15) {
        player.y -= 10;
      } else if (jumpCount < 30) {
        player.y += 10;
      } else {
        isJumping = false;
        clearInterval(jumpInterval);
      }
      jumpCount++;
    }, 20);
  }
}

function updateScore() {
  score++;
  document.getElementById("score").innerText = `Score: ${score}`;
}

function detectCollision() {
  obstacles.forEach(obstacle => {
    if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {
      alert("Game Over! Score: " + score);
      resetGame();
    }
  });
}

function resetGame() {
  score = 0;
  obstacles = [];
  player.y = canvas.height / 2;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  updateObstacles();
  updateScore();
  detectCollision();

  if (Math.random() < 0.02) generateObstacle();

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("touchstart", handleTouchStart);

gameLoop();

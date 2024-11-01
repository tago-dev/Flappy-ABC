const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 240,
    velocity: 0,
    gravity: 0.1,
    jump: -4,
    currentLetter: 'A'
};

let pipes = [];
let score = 0;
let highScore = 0;
let gameOver = false;
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let currentLetterIndex = 0;

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(bird.currentLetter, bird.x, bird.y + 7);
}

function createPipe() {
    const gap = 170;
    const pipeWidth = 50;
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: height,
        passed: false
    });

    pipes.push({
        x: canvas.width,
        y: height + gap,
        width: pipeWidth,
        height: canvas.height - height - gap,
        passed: false
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function updateGame() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    pipes.forEach(pipe => {
        pipe.x -= 1.5;

        if (pipe.x + pipe.width < 0) {
            pipes = pipes.filter(p => p !== pipe);
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            if (pipe.y === 0) {
                score++;
                document.getElementById('score').textContent = score;
                if (score > highScore) {
                    highScore = score;
                    document.getElementById('highScore').textContent = highScore;
                }

                currentLetterIndex = (currentLetterIndex + 1) % alphabet.length;
                bird.currentLetter = alphabet[currentLetterIndex];
            }
        }

        if (
            bird.x + 20 > pipe.x &&
            bird.x - 20 < pipe.x + pipe.width &&
            (bird.y - 20 < pipe.y + pipe.height &&
                bird.y + 20 > pipe.y)
        ) {
            gameOver = true;
        }
    });

    if (bird.y + 20 > canvas.height || bird.y - 20 < 0) {
        gameOver = true;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
        createPipe();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Pressione ESPAÇO para reiniciar', canvas.width / 2, canvas.height / 2 + 40);
    }
}

function gameLoop() {
    updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    bird.y = 240;
    bird.velocity = 0;
    bird.currentLetter = 'A';
    currentLetterIndex = 0;
    pipes = [];
    score = 0;
    document.getElementById('score').textContent = score;
    gameOver = false;
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.jump;
        }
    }
});

gameLoop();
// Snake - Modern overhaul with neon theme
(function() {
    'use strict';

    // Inject styles
    const styleId = 'snake-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .snake-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f1f0f 100%);
                min-height: 100%;
                border-radius: 12px;
            }

            .snake-title {
                font-size: 2rem;
                font-weight: bold;
                color: #4ade80;
                text-shadow: 0 0 30px rgba(74, 222, 128, 0.6);
                margin: 0;
            }

            .snake-score-row {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
            }

            .snake-score-box {
                background: linear-gradient(145deg, #1a2a1a, #0f1f0f);
                border: 2px solid #4ade80;
                border-radius: 12px;
                padding: 0.5rem 1.5rem;
                text-align: center;
                box-shadow: 0 0 15px rgba(74, 222, 128, 0.2);
            }

            .snake-score-label {
                color: #4ade80;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .snake-score-value {
                color: #fff;
                font-size: 1.5rem;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }

            .snake-canvas-wrapper {
                position: relative;
                border: 4px solid #4ade80;
                border-radius: 12px;
                box-shadow: 0 0 30px rgba(74, 222, 128, 0.3),
                            inset 0 0 30px rgba(74, 222, 128, 0.1);
                overflow: hidden;
            }

            .snake-controls {
                display: grid;
                grid-template-columns: repeat(3, 65px);
                grid-template-rows: repeat(3, 65px);
                gap: 8px;
            }

            .snake-ctrl-btn {
                background: linear-gradient(145deg, #4ade80, #22c55e);
                color: #0a0a1a;
                border: none;
                border-radius: 12px;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
            }

            .snake-ctrl-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
            }

            .snake-ctrl-btn:active {
                transform: scale(0.95);
            }

            .snake-instructions {
                color: #888;
                font-size: 0.85rem;
                text-align: center;
                max-width: 350px;
            }

            .snake-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.85);
                z-index: 10;
            }

            .snake-overlay h2 {
                font-size: 2.5rem;
                margin: 0;
                color: #4ade80;
                text-shadow: 0 0 30px rgba(74, 222, 128, 0.8);
            }

            .snake-overlay.gameover h2 {
                color: #ef4444;
                text-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
            }

            .snake-overlay p {
                color: #fff;
                font-size: 1.2rem;
                margin: 0.5rem 0;
            }

            .snake-overlay .highscore {
                color: #ffd700;
                text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
            }

            .snake-overlay .hint {
                color: #888;
                font-size: 1rem;
                margin-top: 1rem;
            }

            .snake-start-btn {
                background: linear-gradient(145deg, #4ade80, #22c55e);
                color: #0a0a1a;
                border: none;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 1rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(74, 222, 128, 0.4);
            }

            .snake-start-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(74, 222, 128, 0.5);
            }

            .snake-confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                top: -10px;
                z-index: 1001;
                animation: confettiFall linear forwards;
            }

            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    const GRID_SIZE = 20;
    let COLS, ROWS, CANVAS_WIDTH, CANVAS_HEIGHT;

    let canvas = null;
    let ctx = null;
    let gameLoopId = null;
    let lastTime = 0;
    let moveTimer = 0;

    let gameState = {
        mode: 'menu',
        score: 0,
        highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0,
        speed: 150,
        snake: [],
        direction: 'right',
        nextDirection: 'right',
        food: null,
        gameOver: false,
        newHighScore: false
    };

    function initGame() {
        const startX = Math.floor(COLS / 2);
        const startY = Math.floor(ROWS / 2);
        gameState.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        gameState.direction = 'right';
        gameState.nextDirection = 'right';
        gameState.score = 0;
        gameState.speed = 150;
        gameState.gameOver = false;
        gameState.newHighScore = false;
        spawnFood();
    }

    function spawnFood() {
        let validPosition = false;
        let x, y;

        while (!validPosition) {
            x = Math.floor(Math.random() * COLS);
            y = Math.floor(Math.random() * ROWS);
            validPosition = !gameState.snake.some(seg => seg.x === x && seg.y === y);
        }

        gameState.food = { x, y };
    }

    function update(deltaTime) {
        if (gameState.mode !== 'playing') return;

        moveTimer += deltaTime;

        if (moveTimer >= gameState.speed) {
            moveTimer = 0;
            moveSnake();
        }
    }

    function moveSnake() {
        gameState.direction = gameState.nextDirection;

        const head = { ...gameState.snake[0] };

        switch (gameState.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            gameOver();
            return;
        }

        if (gameState.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOver();
            return;
        }

        gameState.snake.unshift(head);

        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            gameState.score += 10;
            gameState.speed = Math.max(50, gameState.speed - 2);
            spawnFood();
        } else {
            gameState.snake.pop();
        }
    }

    function gameOver() {
        gameState.mode = 'gameover';
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            gameState.newHighScore = true;
            localStorage.setItem('snakeHighScore', gameState.highScore);
            createConfetti();
        }
    }

    function createConfetti() {
        const colors = ['#4ade80', '#22c55e', '#ffd700', '#ef4444', '#4fc3f7', '#f06292'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'snake-confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }

    function draw() {
        // Clear canvas with dark background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * GRID_SIZE, 0);
            ctx.lineTo(x * GRID_SIZE, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * GRID_SIZE);
            ctx.lineTo(CANVAS_WIDTH, y * GRID_SIZE);
            ctx.stroke();
        }

        if (gameState.mode === 'playing' || gameState.mode === 'gameover') {
            drawGame();
        }

        // Update score display
        const scoreEl = document.getElementById('snakeScoreValue');
        const highScoreEl = document.getElementById('snakeHighScoreValue');
        if (scoreEl) scoreEl.textContent = gameState.score;
        if (highScoreEl) highScoreEl.textContent = gameState.highScore;
    }

    function drawGame() {
        // Draw food with glow
        const foodX = gameState.food.x * GRID_SIZE + GRID_SIZE / 2;
        const foodY = gameState.food.y * GRID_SIZE + GRID_SIZE / 2;

        // Glow effect
        const gradient = ctx.createRadialGradient(foodX, foodY, 0, foodX, foodY, GRID_SIZE);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(gameState.food.x * GRID_SIZE - 5, gameState.food.y * GRID_SIZE - 5, GRID_SIZE + 10, GRID_SIZE + 10);

        // Food
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(foodX, foodY, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw snake
        gameState.snake.forEach((seg, i) => {
            const x = seg.x * GRID_SIZE;
            const y = seg.y * GRID_SIZE;

            if (i === 0) {
                // Head with glow
                ctx.fillStyle = '#4ade80';
                ctx.shadowColor = '#4ade80';
                ctx.shadowBlur = 15;
            } else {
                // Body gradient
                const brightness = 1 - (i / gameState.snake.length) * 0.5;
                ctx.fillStyle = `rgb(${Math.floor(74 * brightness)}, ${Math.floor(222 * brightness)}, ${Math.floor(128 * brightness)})`;
                ctx.shadowBlur = 8;
            }

            // Rounded rectangle for segments
            const radius = 4;
            const size = GRID_SIZE - 2;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size, size, radius);
            ctx.fill();

            // Eyes on head
            if (i === 0) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                let eyeOffsetX = 0, eyeOffsetY = 0;
                switch (gameState.direction) {
                    case 'up': eyeOffsetY = -3; break;
                    case 'down': eyeOffsetY = 3; break;
                    case 'left': eyeOffsetX = -3; break;
                    case 'right': eyeOffsetX = 3; break;
                }
                ctx.beginPath();
                ctx.arc(x + 7 + eyeOffsetX, y + 8 + eyeOffsetY, 3, 0, Math.PI * 2);
                ctx.arc(x + 13 + eyeOffsetX, y + 8 + eyeOffsetY, 3, 0, Math.PI * 2);
                ctx.fill();

                // Pupils
                ctx.fillStyle = '#0a0a1a';
                ctx.beginPath();
                ctx.arc(x + 7 + eyeOffsetX * 1.3, y + 8 + eyeOffsetY * 1.3, 1.5, 0, Math.PI * 2);
                ctx.arc(x + 13 + eyeOffsetX * 1.3, y + 8 + eyeOffsetY * 1.3, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.shadowBlur = 0;
    }

    function renderUI() {
        const content = document.getElementById('snakeContent');
        const canvasSize = Math.min(400, window.innerWidth - 60);
        CANVAS_WIDTH = canvasSize;
        CANVAS_HEIGHT = canvasSize;
        COLS = Math.floor(CANVAS_WIDTH / GRID_SIZE);
        ROWS = Math.floor(CANVAS_HEIGHT / GRID_SIZE);

        content.innerHTML = `
            <div class="snake-container">
                <h1 class="snake-title">🐍 Snake</h1>

                <div class="snake-score-row">
                    <div class="snake-score-box">
                        <div class="snake-score-label">Score</div>
                        <div class="snake-score-value" id="snakeScoreValue">${gameState.score}</div>
                    </div>
                    <div class="snake-score-box">
                        <div class="snake-score-label">Best</div>
                        <div class="snake-score-value" id="snakeHighScoreValue">${gameState.highScore}</div>
                    </div>
                </div>

                <div class="snake-canvas-wrapper">
                    <canvas id="snakeCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" style="display: block;"></canvas>
                    ${gameState.mode === 'menu' ? `
                        <div class="snake-overlay">
                            <h2>🐍 SNAKE</h2>
                            <p class="highscore">High Score: ${gameState.highScore}</p>
                            <button class="snake-start-btn" onclick="startSnakeGame()">Play</button>
                            <p class="hint">Use arrow keys or swipe to move</p>
                        </div>
                    ` : ''}
                    ${gameState.mode === 'gameover' ? `
                        <div class="snake-overlay gameover">
                            <h2>Game Over!</h2>
                            <p>Score: ${gameState.score}</p>
                            ${gameState.newHighScore ? '<p class="highscore">🏆 NEW HIGH SCORE! 🏆</p>' : ''}
                            <button class="snake-start-btn" onclick="startSnakeGame()">Play Again</button>
                        </div>
                    ` : ''}
                </div>

                <div class="snake-controls">
                    <div></div>
                    <button class="snake-ctrl-btn" onclick="handleSnakeDir('up')">⬆️</button>
                    <div></div>
                    <button class="snake-ctrl-btn" onclick="handleSnakeDir('left')">⬅️</button>
                    <div></div>
                    <button class="snake-ctrl-btn" onclick="handleSnakeDir('right')">➡️</button>
                    <div></div>
                    <button class="snake-ctrl-btn" onclick="handleSnakeDir('down')">⬇️</button>
                    <div></div>
                </div>

                <div class="snake-instructions">
                    Swipe on the game or use arrow keys to control the snake.<br>
                    Eat the red food to grow and score points!
                </div>
            </div>
        `;

        canvas = document.getElementById('snakeCanvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);
    }

    window.startSnakeGame = function() {
        gameState.mode = 'playing';
        initGame();
        renderUI();
        draw();
    };

    window.handleSnakeDir = function(dir) {
        if (gameState.mode === 'menu' || gameState.mode === 'gameover') {
            startSnakeGame();
            return;
        }

        switch (dir) {
            case 'up': if (gameState.direction !== 'down') gameState.nextDirection = 'up'; break;
            case 'down': if (gameState.direction !== 'up') gameState.nextDirection = 'down'; break;
            case 'left': if (gameState.direction !== 'right') gameState.nextDirection = 'left'; break;
            case 'right': if (gameState.direction !== 'left') gameState.nextDirection = 'right'; break;
        }
    };

    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        update(deltaTime);
        draw();

        if (gameState.mode === 'gameover') {
            renderUI();
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (gameState.mode === 'menu' || gameState.mode === 'gameover') {
            startSnakeGame();
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (gameState.direction !== 'down') gameState.nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (gameState.direction !== 'up') gameState.nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (gameState.direction !== 'right') gameState.nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (gameState.direction !== 'left') gameState.nextDirection = 'right';
                break;
        }
    }

    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        e.preventDefault();

        if (gameState.mode === 'menu' || gameState.mode === 'gameover') {
            return; // Let button handle it
        }

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        if (gameState.mode !== 'playing') return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const minSwipe = 30;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > minSwipe && gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            } else if (dx < -minSwipe && gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
        } else {
            if (dy > minSwipe && gameState.direction !== 'up') {
                gameState.nextDirection = 'down';
            } else if (dy < -minSwipe && gameState.direction !== 'down') {
                gameState.nextDirection = 'up';
            }
        }
    }

    window.launchSnake = function() {
        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('snakeGame').style.display = 'block';

        gameState.mode = 'menu';
        renderUI();

        document.addEventListener('keydown', handleKeyDown);

        lastTime = performance.now();
        gameLoopId = requestAnimationFrame(gameLoop);
    };

    window.exitSnake = function() {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.querySelectorAll('.snake-confetti').forEach(el => el.remove());

        document.getElementById('snakeGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

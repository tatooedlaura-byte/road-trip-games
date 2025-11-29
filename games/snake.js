// Snake - Classic arcade game
(function() {
    'use strict';

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;
    const GRID_SIZE = 20;
    const COLS = CANVAS_WIDTH / GRID_SIZE;
    const ROWS = CANVAS_HEIGHT / GRID_SIZE;

    let canvas = null;
    let ctx = null;
    let gameLoopId = null;
    let lastTime = 0;
    let moveTimer = 0;

    let gameState = {
        mode: 'menu', // menu, playing, gameover
        score: 0,
        highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0,
        speed: 150, // ms between moves
        snake: [],
        direction: 'right',
        nextDirection: 'right',
        food: null,
        gameOver: false
    };

    function initGame() {
        // Start snake in the middle
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
        spawnFood();
    }

    function spawnFood() {
        let validPosition = false;
        let x, y;

        while (!validPosition) {
            x = Math.floor(Math.random() * COLS);
            y = Math.floor(Math.random() * ROWS);

            // Check if food spawns on snake
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
        // Apply the queued direction
        gameState.direction = gameState.nextDirection;

        const head = { ...gameState.snake[0] };

        switch (gameState.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            gameOver();
            return;
        }

        // Check self collision
        if (gameState.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOver();
            return;
        }

        // Add new head
        gameState.snake.unshift(head);

        // Check food collision
        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            gameState.score += 10;
            // Speed up slightly
            gameState.speed = Math.max(50, gameState.speed - 2);
            spawnFood();
        } else {
            // Remove tail if no food eaten
            gameState.snake.pop();
        }
    }

    function gameOver() {
        gameState.mode = 'gameover';
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('snakeHighScore', gameState.highScore);
        }
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid lines (subtle)
        ctx.strokeStyle = '#2a2a4e';
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

        if (gameState.mode === 'menu') {
            drawMenu();
        } else if (gameState.mode === 'playing' || gameState.mode === 'gameover') {
            drawGame();
        }
    }

    function drawMenu() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SNAKE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Tap or Press any key to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Use arrow keys or swipe to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);

        ctx.fillStyle = '#ffd700';
        ctx.fillText(`High Score: ${gameState.highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
    }

    function drawGame() {
        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(
            gameState.food.x * GRID_SIZE + GRID_SIZE / 2,
            gameState.food.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2 - 2,
            0, Math.PI * 2
        );
        ctx.fill();

        // Draw snake
        gameState.snake.forEach((seg, i) => {
            if (i === 0) {
                // Head
                ctx.fillStyle = '#22c55e';
            } else {
                // Body gradient
                const gradient = 1 - (i / gameState.snake.length) * 0.4;
                ctx.fillStyle = `rgb(${Math.floor(34 * gradient)}, ${Math.floor(197 * gradient)}, ${Math.floor(94 * gradient)})`;
            }

            ctx.fillRect(
                seg.x * GRID_SIZE + 1,
                seg.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );

            // Draw eyes on head
            if (i === 0) {
                ctx.fillStyle = '#fff';
                let eyeOffsetX = 0, eyeOffsetY = 0;
                switch (gameState.direction) {
                    case 'up': eyeOffsetY = -3; break;
                    case 'down': eyeOffsetY = 3; break;
                    case 'left': eyeOffsetX = -3; break;
                    case 'right': eyeOffsetX = 3; break;
                }
                ctx.beginPath();
                ctx.arc(seg.x * GRID_SIZE + 7 + eyeOffsetX, seg.y * GRID_SIZE + 7 + eyeOffsetY, 2, 0, Math.PI * 2);
                ctx.arc(seg.x * GRID_SIZE + 13 + eyeOffsetX, seg.y * GRID_SIZE + 7 + eyeOffsetY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${gameState.score}`, 10, 30);

        ctx.textAlign = 'right';
        ctx.fillText(`Best: ${gameState.highScore}`, CANVAS_WIDTH - 10, 30);

        // Game over overlay
        if (gameState.mode === 'gameover') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

            if (gameState.score === gameState.highScore && gameState.score > 0) {
                ctx.fillStyle = '#ffd700';
                ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
            }

            ctx.fillStyle = '#aaa';
            ctx.font = '18px Arial';
            ctx.fillText('Tap or press any key to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
        }
    }

    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        update(deltaTime);
        draw();

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (gameState.mode === 'menu') {
            gameState.mode = 'playing';
            initGame();
            return;
        }

        if (gameState.mode === 'gameover') {
            gameState.mode = 'playing';
            initGame();
            return;
        }

        // Prevent reversing direction
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

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        e.preventDefault();

        if (gameState.mode === 'menu' || gameState.mode === 'gameover') {
            gameState.mode = 'playing';
            initGame();
            return;
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
            // Horizontal swipe
            if (dx > minSwipe && gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            } else if (dx < -minSwipe && gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
        } else {
            // Vertical swipe
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

        document.getElementById('snakeContent').innerHTML = `
            <div style="text-align: center;">
                <canvas id="snakeCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" style="border: 4px solid #4ade80; border-radius: 10px; max-width: 100%; height: auto; touch-action: none;"></canvas>

                <!-- Mobile Controls -->
                <div style="display: flex; justify-content: center; margin-top: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(3, 70px); grid-template-rows: repeat(3, 70px); gap: 5px;">
                        <div></div>
                        <button id="snakeUpBtn" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬆️</button>
                        <div></div>

                        <button id="snakeLeftBtn" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬅️</button>
                        <div></div>
                        <button id="snakeRightBtn" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">➡️</button>

                        <div></div>
                        <button id="snakeDownBtn" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬇️</button>
                        <div></div>
                    </div>
                </div>
            </div>
        `;

        canvas = document.getElementById('snakeCanvas');
        ctx = canvas.getContext('2d');

        // Disable context menu and selection
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserSelect = 'none';
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Event listeners
        document.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);

        // Mobile button controls
        const upBtn = document.getElementById('snakeUpBtn');
        const downBtn = document.getElementById('snakeDownBtn');
        const leftBtn = document.getElementById('snakeLeftBtn');
        const rightBtn = document.getElementById('snakeRightBtn');

        function handleButtonPress(dir) {
            if (gameState.mode === 'menu' || gameState.mode === 'gameover') {
                gameState.mode = 'playing';
                initGame();
                return;
            }

            switch (dir) {
                case 'up': if (gameState.direction !== 'down') gameState.nextDirection = 'up'; break;
                case 'down': if (gameState.direction !== 'up') gameState.nextDirection = 'down'; break;
                case 'left': if (gameState.direction !== 'right') gameState.nextDirection = 'left'; break;
                case 'right': if (gameState.direction !== 'left') gameState.nextDirection = 'right'; break;
            }
        }

        upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('up'); });
        downBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('down'); });
        leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('left'); });
        rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('right'); });

        upBtn.addEventListener('click', () => handleButtonPress('up'));
        downBtn.addEventListener('click', () => handleButtonPress('down'));
        leftBtn.addEventListener('click', () => handleButtonPress('left'));
        rightBtn.addEventListener('click', () => handleButtonPress('right'));

        gameState.mode = 'menu';
        lastTime = performance.now();
        gameLoopId = requestAnimationFrame(gameLoop);
    };

    window.exitSnake = function() {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        if (canvas) {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
        }

        document.getElementById('snakeGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

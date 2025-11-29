// 2048 - Sliding puzzle game
(function() {
    'use strict';

    const GRID_SIZE = 4;
    const CELL_SIZE = 90;
    const CELL_GAP = 10;
    const BOARD_SIZE = GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * CELL_GAP;

    let canvas = null;
    let ctx = null;
    let gameLoopId = null;

    let gameState = {
        mode: 'playing', // playing, won, gameover
        grid: [],
        score: 0,
        bestScore: parseInt(localStorage.getItem('2048BestScore')) || 0,
        won: false,
        canContinue: false,
        animating: false
    };

    const TILE_COLORS = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
        4096: '#3c3a32',
        8192: '#3c3a32'
    };

    const TEXT_COLORS = {
        2: '#776e65',
        4: '#776e65',
        8: '#f9f6f2',
        16: '#f9f6f2',
        32: '#f9f6f2',
        64: '#f9f6f2',
        128: '#f9f6f2',
        256: '#f9f6f2',
        512: '#f9f6f2',
        1024: '#f9f6f2',
        2048: '#f9f6f2',
        4096: '#f9f6f2',
        8192: '#f9f6f2'
    };

    function initGame() {
        gameState.grid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            gameState.grid[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                gameState.grid[i][j] = 0;
            }
        }
        gameState.score = 0;
        gameState.won = false;
        gameState.canContinue = false;
        gameState.mode = 'playing';

        // Add two starting tiles
        addRandomTile();
        addRandomTile();
    }

    function addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (gameState.grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            gameState.grid[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        // Remove zeros
        let arr = row.filter(val => val !== 0);

        // Merge adjacent equal tiles
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                gameState.score += arr[i];
                if (arr[i] === 2048 && !gameState.won) {
                    gameState.won = true;
                    gameState.mode = 'won';
                }
                arr.splice(i + 1, 1);
            }
        }

        // Pad with zeros
        while (arr.length < GRID_SIZE) {
            arr.push(0);
        }

        return arr;
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            const original = [...gameState.grid[i]];
            gameState.grid[i] = slide(gameState.grid[i]);
            if (original.some((val, idx) => val !== gameState.grid[i][idx])) {
                moved = true;
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            const original = [...gameState.grid[i]];
            gameState.grid[i] = slide(gameState.grid[i].reverse()).reverse();
            if (original.some((val, idx) => val !== gameState.grid[i][idx])) {
                moved = true;
            }
        }
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < GRID_SIZE; j++) {
            let column = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                column.push(gameState.grid[i][j]);
            }
            const original = [...column];
            column = slide(column);
            for (let i = 0; i < GRID_SIZE; i++) {
                gameState.grid[i][j] = column[i];
            }
            if (original.some((val, idx) => val !== column[idx])) {
                moved = true;
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < GRID_SIZE; j++) {
            let column = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                column.push(gameState.grid[i][j]);
            }
            const original = [...column];
            column = slide(column.reverse()).reverse();
            for (let i = 0; i < GRID_SIZE; i++) {
                gameState.grid[i][j] = column[i];
            }
            if (original.some((val, idx) => val !== column[idx])) {
                moved = true;
            }
        }
        return moved;
    }

    function canMove() {
        // Check for empty cells
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (gameState.grid[i][j] === 0) return true;
            }
        }

        // Check for possible merges
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const val = gameState.grid[i][j];
                if (j < GRID_SIZE - 1 && gameState.grid[i][j + 1] === val) return true;
                if (i < GRID_SIZE - 1 && gameState.grid[i + 1][j] === val) return true;
            }
        }

        return false;
    }

    function handleMove(direction) {
        if (gameState.mode === 'gameover') return;
        if (gameState.mode === 'won' && !gameState.canContinue) return;

        let moved = false;

        switch (direction) {
            case 'left': moved = moveLeft(); break;
            case 'right': moved = moveRight(); break;
            case 'up': moved = moveUp(); break;
            case 'down': moved = moveDown(); break;
        }

        if (moved) {
            addRandomTile();

            if (gameState.score > gameState.bestScore) {
                gameState.bestScore = gameState.score;
                localStorage.setItem('2048BestScore', gameState.bestScore);
            }

            if (!canMove()) {
                gameState.mode = 'gameover';
            }
        }

        draw();
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#faf8ef';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw board background
        ctx.fillStyle = '#bbada0';
        ctx.beginPath();
        ctx.roundRect(0, 0, BOARD_SIZE, BOARD_SIZE, 6);
        ctx.fill();

        // Draw cells
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const value = gameState.grid[i][j];
                const x = CELL_GAP + j * (CELL_SIZE + CELL_GAP);
                const y = CELL_GAP + i * (CELL_SIZE + CELL_GAP);

                // Cell background
                ctx.fillStyle = TILE_COLORS[value] || TILE_COLORS[8192];
                ctx.beginPath();
                ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 3);
                ctx.fill();

                // Cell value
                if (value !== 0) {
                    ctx.fillStyle = TEXT_COLORS[value] || TEXT_COLORS[8192];
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Adjust font size based on number length
                    let fontSize = 45;
                    if (value >= 1000) fontSize = 35;
                    if (value >= 10000) fontSize = 28;

                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.fillText(value, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
                }
            }
        }

        // Draw score area
        const scoreY = BOARD_SIZE + 20;
        ctx.fillStyle = '#bbada0';
        ctx.beginPath();
        ctx.roundRect(0, scoreY, BOARD_SIZE / 2 - 5, 60, 3);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(BOARD_SIZE / 2 + 5, scoreY, BOARD_SIZE / 2 - 5, 60, 3);
        ctx.fill();

        ctx.fillStyle = '#eee4da';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCORE', BOARD_SIZE / 4, scoreY + 20);
        ctx.fillText('BEST', BOARD_SIZE * 3 / 4, scoreY + 20);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(gameState.score, BOARD_SIZE / 4, scoreY + 45);
        ctx.fillText(gameState.bestScore, BOARD_SIZE * 3 / 4, scoreY + 45);

        // Win overlay
        if (gameState.mode === 'won' && !gameState.canContinue) {
            ctx.fillStyle = 'rgba(237, 194, 46, 0.5)';
            ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

            ctx.fillStyle = '#776e65';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('You Win!', BOARD_SIZE / 2, BOARD_SIZE / 2 - 30);

            ctx.font = '20px Arial';
            ctx.fillText('Tap "Continue" to keep playing', BOARD_SIZE / 2, BOARD_SIZE / 2 + 20);
        }

        // Game over overlay
        if (gameState.mode === 'gameover') {
            ctx.fillStyle = 'rgba(238, 228, 218, 0.73)';
            ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

            ctx.fillStyle = '#776e65';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', BOARD_SIZE / 2, BOARD_SIZE / 2);
        }
    }

    function handleKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                handleMove('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                handleMove('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                handleMove('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                handleMove('right');
                break;
        }
    }

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const minSwipe = 50;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > minSwipe) {
                handleMove('right');
            } else if (dx < -minSwipe) {
                handleMove('left');
            }
        } else {
            if (dy > minSwipe) {
                handleMove('down');
            } else if (dy < -minSwipe) {
                handleMove('up');
            }
        }
    }

    window.launch2048 = function() {
        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('game2048').style.display = 'block';

        document.getElementById('game2048Content').innerHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 1rem;">
                    <button id="btn2048NewGame" style="background: #8f7a66; color: #f9f6f2; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; margin-right: 0.5rem;">New Game</button>
                    <button id="btn2048Continue" style="background: #8f7a66; color: #f9f6f2; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; display: none;">Continue</button>
                </div>

                <canvas id="canvas2048" width="${BOARD_SIZE}" height="${BOARD_SIZE + 100}" style="max-width: 100%; height: auto; touch-action: none;"></canvas>

                <!-- Mobile Controls -->
                <div style="display: flex; justify-content: center; margin-top: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(3, 70px); grid-template-rows: repeat(3, 70px); gap: 5px;">
                        <div></div>
                        <button id="btn2048Up" style="background: linear-gradient(135deg, #edc22e 0%, #edcc61 100%); color: #776e65; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬆️</button>
                        <div></div>

                        <button id="btn2048Left" style="background: linear-gradient(135deg, #edc22e 0%, #edcc61 100%); color: #776e65; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬅️</button>
                        <div></div>
                        <button id="btn2048Right" style="background: linear-gradient(135deg, #edc22e 0%, #edcc61 100%); color: #776e65; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">➡️</button>

                        <div></div>
                        <button id="btn2048Down" style="background: linear-gradient(135deg, #edc22e 0%, #edcc61 100%); color: #776e65; border: none; border-radius: 12px; cursor: pointer; font-size: 1.5rem; font-weight: bold; touch-action: manipulation;">⬇️</button>
                        <div></div>
                    </div>
                </div>

                <p style="color: #776e65; margin-top: 1rem; font-size: 0.9rem;">
                    Swipe or use arrow keys to move tiles.<br>
                    Combine matching numbers to reach 2048!
                </p>
            </div>
        `;

        canvas = document.getElementById('canvas2048');
        ctx = canvas.getContext('2d');

        // Disable context menu and selection
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserSelect = 'none';
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Event listeners
        document.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);

        // New game button
        document.getElementById('btn2048NewGame').addEventListener('click', () => {
            initGame();
            document.getElementById('btn2048Continue').style.display = 'none';
            draw();
        });

        // Continue button
        document.getElementById('btn2048Continue').addEventListener('click', () => {
            gameState.canContinue = true;
            gameState.mode = 'playing';
            document.getElementById('btn2048Continue').style.display = 'none';
            draw();
        });

        // Mobile button controls
        const upBtn = document.getElementById('btn2048Up');
        const downBtn = document.getElementById('btn2048Down');
        const leftBtn = document.getElementById('btn2048Left');
        const rightBtn = document.getElementById('btn2048Right');

        upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove('up'); });
        downBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove('down'); });
        leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove('left'); });
        rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove('right'); });

        upBtn.addEventListener('click', () => handleMove('up'));
        downBtn.addEventListener('click', () => handleMove('down'));
        leftBtn.addEventListener('click', () => handleMove('left'));
        rightBtn.addEventListener('click', () => handleMove('right'));

        initGame();
        draw();
    };

    window.exit2048 = function() {
        document.removeEventListener('keydown', handleKeyDown);
        if (canvas) {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
        }

        document.getElementById('game2048').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

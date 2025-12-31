// 2048 - Modern overhaul with dark theme (no animations for reliability)
(function() {
    'use strict';

    // Inject styles
    const styleId = '2048-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .g2048-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                min-height: 100%;
                border-radius: 12px;
            }

            .g2048-title {
                font-size: 2.5rem;
                font-weight: bold;
                color: #edc22e;
                text-shadow: 0 0 30px rgba(237, 194, 46, 0.6);
                margin: 0;
            }

            .g2048-score-row {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }

            .g2048-score-box {
                background: linear-gradient(145deg, #2a2a4a, #1a1a3a);
                border: 2px solid #444;
                border-radius: 12px;
                padding: 0.5rem 1.5rem;
                text-align: center;
                min-width: 100px;
            }

            .g2048-score-label {
                color: #888;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .g2048-score-value {
                color: #fff;
                font-size: 1.5rem;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }

            .g2048-btn-row {
                display: flex;
                gap: 0.5rem;
            }

            .g2048-btn {
                background: linear-gradient(145deg, #edc22e, #d4a828);
                color: #1a1a2e;
                border: none;
                padding: 0.7rem 1.5rem;
                border-radius: 10px;
                font-weight: bold;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(237, 194, 46, 0.3);
            }

            .g2048-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(237, 194, 46, 0.4);
            }

            .g2048-board {
                background: linear-gradient(145deg, #2a2a4a, #1a1a3a);
                border: 3px solid #444;
                border-radius: 12px;
                padding: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                            inset 0 2px 10px rgba(255, 255, 255, 0.05);
            }

            .g2048-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }

            .g2048-cell {
                aspect-ratio: 1;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .g2048-cell.tile-2 { background: linear-gradient(145deg, #eee4da, #d8cfc5); color: #776e65; }
            .g2048-cell.tile-4 { background: linear-gradient(145deg, #ede0c8, #d7cbb5); color: #776e65; }
            .g2048-cell.tile-8 { background: linear-gradient(145deg, #f2b179, #dc9d68); color: #f9f6f2; }
            .g2048-cell.tile-16 { background: linear-gradient(145deg, #f59563, #df8050); color: #f9f6f2; }
            .g2048-cell.tile-32 { background: linear-gradient(145deg, #f67c5f, #e0684c); color: #f9f6f2; }
            .g2048-cell.tile-64 { background: linear-gradient(145deg, #f65e3b, #e04a28); color: #f9f6f2; }
            .g2048-cell.tile-128 { background: linear-gradient(145deg, #edcf72, #d7b95f); color: #f9f6f2; box-shadow: 0 0 20px rgba(237, 207, 114, 0.4); }
            .g2048-cell.tile-256 { background: linear-gradient(145deg, #edcc61, #d7b64e); color: #f9f6f2; box-shadow: 0 0 25px rgba(237, 204, 97, 0.5); }
            .g2048-cell.tile-512 { background: linear-gradient(145deg, #edc850, #d7b23d); color: #f9f6f2; box-shadow: 0 0 30px rgba(237, 200, 80, 0.6); }
            .g2048-cell.tile-1024 { background: linear-gradient(145deg, #edc53f, #d7af2c); color: #f9f6f2; box-shadow: 0 0 35px rgba(237, 197, 63, 0.7); }
            .g2048-cell.tile-2048 { background: linear-gradient(145deg, #edc22e, #d7ac1b); color: #f9f6f2; box-shadow: 0 0 40px rgba(237, 194, 46, 0.8); }
            .g2048-cell.tile-super { background: linear-gradient(145deg, #3c3a32, #2a2820); color: #f9f6f2; box-shadow: 0 0 40px rgba(60, 58, 50, 0.8); }

            .g2048-controls {
                display: grid;
                grid-template-columns: repeat(3, 60px);
                grid-template-rows: repeat(3, 60px);
                gap: 8px;
            }

            .g2048-ctrl-btn {
                background: linear-gradient(145deg, #edc22e, #d4a828);
                color: #1a1a2e;
                border: none;
                border-radius: 12px;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
            }

            .g2048-ctrl-btn:hover {
                transform: scale(1.05);
            }

            .g2048-ctrl-btn:active {
                transform: scale(0.95);
            }

            .g2048-instructions {
                color: #888;
                font-size: 0.85rem;
                text-align: center;
                max-width: 350px;
            }

            .g2048-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
            }

            .g2048-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, #1a1a2e, #0f0f1e);
                border: 3px solid #edc22e;
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 0 50px rgba(237, 194, 46, 0.5);
                animation: modalAppear 0.4s ease-out;
            }

            @keyframes modalAppear {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }

            .g2048-modal.gameover {
                border-color: #e94560;
                box-shadow: 0 0 50px rgba(233, 69, 96, 0.5);
            }

            .g2048-modal h2 {
                font-size: 2rem;
                margin: 0 0 1rem 0;
                color: #edc22e;
            }

            .g2048-modal.gameover h2 {
                color: #e94560;
            }

            .g2048-modal p {
                color: #aaa;
                margin: 0.5rem 0;
                font-size: 1.1rem;
            }

            .g2048-modal button {
                background: linear-gradient(145deg, #edc22e, #d4a828);
                color: #1a1a2e;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                margin: 0.5rem;
                transition: all 0.3s ease;
            }

            .g2048-modal button:hover {
                transform: scale(1.05);
            }

            .g2048-confetti {
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
        `;
        document.head.appendChild(style);
    }

    const GRID_SIZE = 4;
    let cellSize = 70;

    // Simple 2D grid - much more reliable than tile tracking
    let grid = [];
    let gameState = {
        mode: 'playing',
        score: 0,
        bestScore: parseInt(localStorage.getItem('2048BestScore')) || 0,
        won: false,
        canContinue: false
    };

    function initGame() {
        // Initialize empty grid
        grid = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            grid[r] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                grid[r][c] = 0;
            }
        }

        gameState.score = 0;
        gameState.won = false;
        gameState.canContinue = false;
        gameState.mode = 'playing';

        addRandomTile();
        addRandomTile();
        renderBoard();
        renderGrid();
    }

    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slideRow(row) {
        // Remove zeros
        let arr = row.filter(val => val !== 0);

        // Merge adjacent equal values
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

    function move(direction) {
        let moved = false;
        const oldGrid = grid.map(row => [...row]);

        if (direction === 'left') {
            for (let r = 0; r < GRID_SIZE; r++) {
                grid[r] = slideRow(grid[r]);
            }
        } else if (direction === 'right') {
            for (let r = 0; r < GRID_SIZE; r++) {
                grid[r] = slideRow(grid[r].reverse()).reverse();
            }
        } else if (direction === 'up') {
            for (let c = 0; c < GRID_SIZE; c++) {
                let col = [];
                for (let r = 0; r < GRID_SIZE; r++) {
                    col.push(grid[r][c]);
                }
                col = slideRow(col);
                for (let r = 0; r < GRID_SIZE; r++) {
                    grid[r][c] = col[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < GRID_SIZE; c++) {
                let col = [];
                for (let r = 0; r < GRID_SIZE; r++) {
                    col.push(grid[r][c]);
                }
                col = slideRow(col.reverse()).reverse();
                for (let r = 0; r < GRID_SIZE; r++) {
                    grid[r][c] = col[r];
                }
            }
        }

        // Check if anything moved
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] !== oldGrid[r][c]) {
                    moved = true;
                    break;
                }
            }
            if (moved) break;
        }

        return moved;
    }

    function canMove() {
        // Check for empty cells
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 0) return true;
            }
        }

        // Check for possible merges
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const val = grid[r][c];
                if (c < GRID_SIZE - 1 && grid[r][c + 1] === val) return true;
                if (r < GRID_SIZE - 1 && grid[r + 1][c] === val) return true;
            }
        }

        return false;
    }

    function handleMove(direction) {
        if (gameState.mode === 'gameover') return;
        if (gameState.mode === 'won' && !gameState.canContinue) return;

        const moved = move(direction);

        if (moved) {
            addRandomTile();

            if (gameState.score > gameState.bestScore) {
                gameState.bestScore = gameState.score;
                localStorage.setItem('2048BestScore', gameState.bestScore);
            }

            if (!canMove()) {
                gameState.mode = 'gameover';
            }

            renderGrid();
            updateScore();

            if (gameState.mode === 'won' && !gameState.canContinue) {
                showWinModal();
            } else if (gameState.mode === 'gameover') {
                showGameOverModal();
            }
        }
    }

    function updateScore() {
        const scoreEl = document.getElementById('g2048-score');
        if (scoreEl) scoreEl.textContent = gameState.score;
    }

    function renderGrid() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = document.getElementById(`g2048-cell-${r}-${c}`);
                if (cell) {
                    const val = grid[r][c];
                    cell.className = 'g2048-cell';
                    if (val > 0) {
                        const tileClass = val > 2048 ? 'tile-super' : `tile-${val}`;
                        cell.classList.add(tileClass);
                        cell.textContent = val;
                    } else {
                        cell.textContent = '';
                    }
                }
            }
        }
    }

    function renderBoard() {
        const content = document.getElementById('game2048Content');
        cellSize = Math.min(70, (window.innerWidth - 100) / 4);

        let gridHtml = '';
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                gridHtml += `<div class="g2048-cell" id="g2048-cell-${r}-${c}" style="width: ${cellSize}px; height: ${cellSize}px; font-size: ${cellSize * 0.4}px;"></div>`;
            }
        }

        content.innerHTML = `
            <div class="g2048-container">
                <h1 class="g2048-title">2048</h1>

                <div class="g2048-score-row">
                    <div class="g2048-score-box">
                        <div class="g2048-score-label">Score</div>
                        <div class="g2048-score-value" id="g2048-score">${gameState.score}</div>
                    </div>
                    <div class="g2048-score-box">
                        <div class="g2048-score-label">Best</div>
                        <div class="g2048-score-value">${gameState.bestScore}</div>
                    </div>
                </div>

                <div class="g2048-btn-row">
                    <button class="g2048-btn" onclick="init2048Game()">New Game</button>
                </div>

                <div class="g2048-board">
                    <div class="g2048-grid">
                        ${gridHtml}
                    </div>
                </div>

                <div class="g2048-controls">
                    <div></div>
                    <button class="g2048-ctrl-btn" onclick="handle2048Move('up')">⬆️</button>
                    <div></div>
                    <button class="g2048-ctrl-btn" onclick="handle2048Move('left')">⬅️</button>
                    <div></div>
                    <button class="g2048-ctrl-btn" onclick="handle2048Move('right')">➡️</button>
                    <div></div>
                    <button class="g2048-ctrl-btn" onclick="handle2048Move('down')">⬇️</button>
                    <div></div>
                </div>

                <div class="g2048-instructions">
                    Swipe or use arrow keys to move tiles.<br>
                    Combine matching numbers to reach 2048!
                </div>
            </div>
        `;
    }

    function createConfetti() {
        const colors = ['#edc22e', '#f2b179', '#f59563', '#f67c5f', '#edcf72', '#4ade80'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'g2048-confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }

    function showWinModal() {
        createConfetti();
        const content = document.getElementById('game2048Content');
        const modalHtml = `
            <div class="g2048-overlay" onclick="close2048Modal()"></div>
            <div class="g2048-modal">
                <h2>🎉 You Win!</h2>
                <p>You reached 2048!</p>
                <p>Score: ${gameState.score}</p>
                <button onclick="continue2048()">Keep Playing</button>
                <button onclick="close2048Modal(); init2048Game();">New Game</button>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', modalHtml);
    }

    function showGameOverModal() {
        const content = document.getElementById('game2048Content');
        const modalHtml = `
            <div class="g2048-overlay" onclick="close2048Modal()"></div>
            <div class="g2048-modal gameover">
                <h2>Game Over!</h2>
                <p>Final Score: ${gameState.score}</p>
                <p>Best Score: ${gameState.bestScore}</p>
                <button onclick="close2048Modal(); init2048Game();">Try Again</button>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.close2048Modal = function() {
        document.querySelectorAll('.g2048-overlay, .g2048-modal').forEach(el => el.remove());
        document.querySelectorAll('.g2048-confetti').forEach(el => el.remove());
    };

    window.continue2048 = function() {
        gameState.canContinue = true;
        gameState.mode = 'playing';
        close2048Modal();
    };

    window.init2048Game = function() {
        initGame();
    };

    window.handle2048Move = function(dir) {
        handleMove(dir);
    };

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

        document.addEventListener('keydown', handleKeyDown);
        document.getElementById('game2048Content').addEventListener('touchstart', handleTouchStart);
        document.getElementById('game2048Content').addEventListener('touchend', handleTouchEnd);

        initGame();
    };

    window.exit2048 = function() {
        document.removeEventListener('keydown', handleKeyDown);
        const content = document.getElementById('game2048Content');
        if (content) {
            content.removeEventListener('touchstart', handleTouchStart);
            content.removeEventListener('touchend', handleTouchEnd);
        }
        close2048Modal();

        document.getElementById('game2048').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

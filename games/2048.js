// 2048 - Modern overhaul with dark theme and slide animations
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
                position: relative;
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

            .g2048-cell-bg {
                aspect-ratio: 1;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.05);
            }

            .g2048-tiles {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                pointer-events: none;
            }

            .g2048-tile {
                position: absolute;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                transition: transform 0.15s ease-out;
            }

            .g2048-tile.pop {
                animation: tilePop 0.15s ease-out;
            }

            @keyframes tilePop {
                0% { transform: scale(0); }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .g2048-tile.tile-2 { background: linear-gradient(145deg, #eee4da, #d8cfc5); color: #776e65; }
            .g2048-tile.tile-4 { background: linear-gradient(145deg, #ede0c8, #d7cbb5); color: #776e65; }
            .g2048-tile.tile-8 { background: linear-gradient(145deg, #f2b179, #dc9d68); color: #f9f6f2; }
            .g2048-tile.tile-16 { background: linear-gradient(145deg, #f59563, #df8050); color: #f9f6f2; }
            .g2048-tile.tile-32 { background: linear-gradient(145deg, #f67c5f, #e0684c); color: #f9f6f2; }
            .g2048-tile.tile-64 { background: linear-gradient(145deg, #f65e3b, #e04a28); color: #f9f6f2; }
            .g2048-tile.tile-128 { background: linear-gradient(145deg, #edcf72, #d7b95f); color: #f9f6f2; box-shadow: 0 0 20px rgba(237, 207, 114, 0.4); }
            .g2048-tile.tile-256 { background: linear-gradient(145deg, #edcc61, #d7b64e); color: #f9f6f2; box-shadow: 0 0 25px rgba(237, 204, 97, 0.5); }
            .g2048-tile.tile-512 { background: linear-gradient(145deg, #edc850, #d7b23d); color: #f9f6f2; box-shadow: 0 0 30px rgba(237, 200, 80, 0.6); }
            .g2048-tile.tile-1024 { background: linear-gradient(145deg, #edc53f, #d7af2c); color: #f9f6f2; box-shadow: 0 0 35px rgba(237, 197, 63, 0.7); }
            .g2048-tile.tile-2048 { background: linear-gradient(145deg, #edc22e, #d7ac1b); color: #f9f6f2; box-shadow: 0 0 40px rgba(237, 194, 46, 0.8); }
            .g2048-tile.tile-super { background: linear-gradient(145deg, #3c3a32, #2a2820); color: #f9f6f2; box-shadow: 0 0 40px rgba(60, 58, 50, 0.8); }

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
    let cellGap = 10;
    let tileIdCounter = 0;

    let gameState = {
        mode: 'playing',
        tiles: [], // Array of {id, value, row, col}
        score: 0,
        bestScore: parseInt(localStorage.getItem('2048BestScore')) || 0,
        won: false,
        canContinue: false
    };

    function getGridCell(row, col) {
        return gameState.tiles.find(t => t.row === row && t.col === col);
    }

    function initGame() {
        gameState.tiles = [];
        gameState.score = 0;
        gameState.won = false;
        gameState.canContinue = false;
        gameState.mode = 'playing';
        tileIdCounter = 0;

        addRandomTile();
        addRandomTile();
        renderBoard();
        renderTiles();
    }

    function addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!getGridCell(r, c)) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const tile = {
                id: tileIdCounter++,
                value: Math.random() < 0.9 ? 2 : 4,
                row: cell.row,
                col: cell.col,
                isNew: true
            };
            gameState.tiles.push(tile);
        }
    }

    function move(direction) {
        let moved = false;

        // Clear new flag from all tiles
        gameState.tiles.forEach(t => t.isNew = false);

        if (direction === 'left') {
            for (let row = 0; row < GRID_SIZE; row++) {
                moved = moveRowLeft(row) || moved;
            }
        } else if (direction === 'right') {
            for (let row = 0; row < GRID_SIZE; row++) {
                moved = moveRowRight(row) || moved;
            }
        } else if (direction === 'up') {
            for (let col = 0; col < GRID_SIZE; col++) {
                moved = moveColUp(col) || moved;
            }
        } else if (direction === 'down') {
            for (let col = 0; col < GRID_SIZE; col++) {
                moved = moveColDown(col) || moved;
            }
        }

        return moved;
    }

    function moveRowLeft(row) {
        const rowTiles = gameState.tiles.filter(t => t.row === row).sort((a, b) => a.col - b.col);
        let moved = false;
        let targetCol = 0;

        for (let i = 0; i < rowTiles.length; i++) {
            const tile = rowTiles[i];

            // Check for merge with previous tile at targetCol-1
            if (targetCol > 0) {
                const prevTile = gameState.tiles.find(t => t.row === row && t.col === targetCol - 1);
                if (prevTile && prevTile.value === tile.value && !prevTile.merged) {
                    // Merge
                    prevTile.value *= 2;
                    prevTile.merged = true;
                    gameState.score += prevTile.value;
                    if (prevTile.value === 2048 && !gameState.won) {
                        gameState.won = true;
                        gameState.mode = 'won';
                    }
                    // Remove merged tile
                    gameState.tiles = gameState.tiles.filter(t => t !== tile);
                    moved = true;
                    continue;
                }
            }

            if (tile.col !== targetCol) {
                tile.col = targetCol;
                moved = true;
            }
            targetCol++;
        }

        // Clear merged flags
        gameState.tiles.forEach(t => t.merged = false);
        return moved;
    }

    function moveRowRight(row) {
        const rowTiles = gameState.tiles.filter(t => t.row === row).sort((a, b) => b.col - a.col);
        let moved = false;
        let targetCol = GRID_SIZE - 1;

        for (let i = 0; i < rowTiles.length; i++) {
            const tile = rowTiles[i];

            if (targetCol < GRID_SIZE - 1) {
                const prevTile = gameState.tiles.find(t => t.row === row && t.col === targetCol + 1);
                if (prevTile && prevTile.value === tile.value && !prevTile.merged) {
                    prevTile.value *= 2;
                    prevTile.merged = true;
                    gameState.score += prevTile.value;
                    if (prevTile.value === 2048 && !gameState.won) {
                        gameState.won = true;
                        gameState.mode = 'won';
                    }
                    gameState.tiles = gameState.tiles.filter(t => t !== tile);
                    moved = true;
                    continue;
                }
            }

            if (tile.col !== targetCol) {
                tile.col = targetCol;
                moved = true;
            }
            targetCol--;
        }

        gameState.tiles.forEach(t => t.merged = false);
        return moved;
    }

    function moveColUp(col) {
        const colTiles = gameState.tiles.filter(t => t.col === col).sort((a, b) => a.row - b.row);
        let moved = false;
        let targetRow = 0;

        for (let i = 0; i < colTiles.length; i++) {
            const tile = colTiles[i];

            if (targetRow > 0) {
                const prevTile = gameState.tiles.find(t => t.col === col && t.row === targetRow - 1);
                if (prevTile && prevTile.value === tile.value && !prevTile.merged) {
                    prevTile.value *= 2;
                    prevTile.merged = true;
                    gameState.score += prevTile.value;
                    if (prevTile.value === 2048 && !gameState.won) {
                        gameState.won = true;
                        gameState.mode = 'won';
                    }
                    gameState.tiles = gameState.tiles.filter(t => t !== tile);
                    moved = true;
                    continue;
                }
            }

            if (tile.row !== targetRow) {
                tile.row = targetRow;
                moved = true;
            }
            targetRow++;
        }

        gameState.tiles.forEach(t => t.merged = false);
        return moved;
    }

    function moveColDown(col) {
        const colTiles = gameState.tiles.filter(t => t.col === col).sort((a, b) => b.row - a.row);
        let moved = false;
        let targetRow = GRID_SIZE - 1;

        for (let i = 0; i < colTiles.length; i++) {
            const tile = colTiles[i];

            if (targetRow < GRID_SIZE - 1) {
                const prevTile = gameState.tiles.find(t => t.col === col && t.row === targetRow + 1);
                if (prevTile && prevTile.value === tile.value && !prevTile.merged) {
                    prevTile.value *= 2;
                    prevTile.merged = true;
                    gameState.score += prevTile.value;
                    if (prevTile.value === 2048 && !gameState.won) {
                        gameState.won = true;
                        gameState.mode = 'won';
                    }
                    gameState.tiles = gameState.tiles.filter(t => t !== tile);
                    moved = true;
                    continue;
                }
            }

            if (tile.row !== targetRow) {
                tile.row = targetRow;
                moved = true;
            }
            targetRow--;
        }

        gameState.tiles.forEach(t => t.merged = false);
        return moved;
    }

    function canMove() {
        // Check for empty cells
        if (gameState.tiles.length < 16) return true;

        // Check for possible merges
        for (const tile of gameState.tiles) {
            const right = gameState.tiles.find(t => t.row === tile.row && t.col === tile.col + 1);
            const down = gameState.tiles.find(t => t.row === tile.row + 1 && t.col === tile.col);
            if (right && right.value === tile.value) return true;
            if (down && down.value === tile.value) return true;
        }

        return false;
    }

    function handleMove(direction) {
        if (gameState.mode === 'gameover') return;
        if (gameState.mode === 'won' && !gameState.canContinue) return;

        const moved = move(direction);

        if (moved) {
            // Update tile positions with animation
            updateTilePositions();

            // After animation, add new tile
            setTimeout(() => {
                addRandomTile();

                if (gameState.score > gameState.bestScore) {
                    gameState.bestScore = gameState.score;
                    localStorage.setItem('2048BestScore', gameState.bestScore);
                }

                if (!canMove()) {
                    gameState.mode = 'gameover';
                }

                renderTiles();
                updateScore();

                if (gameState.mode === 'won' && !gameState.canContinue) {
                    showWinModal();
                } else if (gameState.mode === 'gameover') {
                    showGameOverModal();
                }
            }, 150);
        }
    }

    function updateTilePositions() {
        gameState.tiles.forEach(tile => {
            const el = document.getElementById(`tile-${tile.id}`);
            if (el) {
                const x = tile.col * (cellSize + cellGap);
                const y = tile.row * (cellSize + cellGap);
                el.style.transform = `translate(${x}px, ${y}px)`;

                // Update value display if merged
                const tileClass = tile.value > 2048 ? 'tile-super' : `tile-${tile.value}`;
                el.className = `g2048-tile ${tileClass}`;
                el.textContent = tile.value;
            }
        });
        updateScore();
    }

    function updateScore() {
        const scoreEl = document.getElementById('g2048-score');
        if (scoreEl) scoreEl.textContent = gameState.score;
    }

    function renderTiles() {
        const container = document.getElementById('g2048-tiles');
        if (!container) return;

        container.innerHTML = '';

        gameState.tiles.forEach(tile => {
            const tileClass = tile.value > 2048 ? 'tile-super' : `tile-${tile.value}`;
            const fontSize = tile.value >= 1000 ? cellSize * 0.35 : cellSize * 0.45;
            const x = tile.col * (cellSize + cellGap);
            const y = tile.row * (cellSize + cellGap);

            const div = document.createElement('div');
            div.id = `tile-${tile.id}`;
            div.className = `g2048-tile ${tileClass}${tile.isNew ? ' pop' : ''}`;
            div.style.cssText = `width: ${cellSize}px; height: ${cellSize}px; font-size: ${fontSize}px; transform: translate(${x}px, ${y}px);`;
            div.textContent = tile.value;
            container.appendChild(div);
        });
    }

    function renderBoard() {
        const content = document.getElementById('game2048Content');
        cellSize = Math.min(70, (window.innerWidth - 100) / 4);
        cellGap = 10;
        const boardSize = cellSize * 4 + cellGap * 3;

        let gridHtml = '';
        for (let i = 0; i < 16; i++) {
            gridHtml += `<div class="g2048-cell-bg" style="width: ${cellSize}px; height: ${cellSize}px;"></div>`;
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

                <div class="g2048-board" style="width: ${boardSize + 20}px; height: ${boardSize + 20}px;">
                    <div class="g2048-grid" style="gap: ${cellGap}px;">
                        ${gridHtml}
                    </div>
                    <div class="g2048-tiles" id="g2048-tiles"></div>
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

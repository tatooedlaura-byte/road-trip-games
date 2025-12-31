// Minesweeper Game - Modern overhaul with dark theme
(function() {
    'use strict';

    // Inject styles
    const styleId = 'minesweeper-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .ms-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                min-height: 100%;
                border-radius: 12px;
            }

            .ms-title {
                font-size: 1.8rem;
                font-weight: bold;
                color: #e94560;
                text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
                margin: 0;
            }

            .ms-difficulty-row {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .ms-diff-btn {
                background: linear-gradient(145deg, #2a2a4a, #1a1a3a);
                color: #aaa;
                border: 2px solid #333;
                padding: 0.6rem 1rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }

            .ms-diff-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .ms-diff-btn.active-beginner {
                background: linear-gradient(145deg, #4CAF50, #388E3C);
                color: white;
                border-color: #4CAF50;
                box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
            }

            .ms-diff-btn.active-intermediate {
                background: linear-gradient(145deg, #FF9800, #F57C00);
                color: white;
                border-color: #FF9800;
                box-shadow: 0 0 15px rgba(255, 152, 0, 0.4);
            }

            .ms-diff-btn.active-expert {
                background: linear-gradient(145deg, #e94560, #c23a51);
                color: white;
                border-color: #e94560;
                box-shadow: 0 0 15px rgba(233, 69, 96, 0.4);
            }

            .ms-info-bar {
                background: linear-gradient(145deg, #1a1a2e, #0f0f1e);
                border: 2px solid #333;
                border-radius: 12px;
                padding: 0.5rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
            }

            .ms-counter {
                background: #000;
                color: #ff3333;
                font-family: 'Courier New', monospace;
                font-size: 1.5rem;
                font-weight: bold;
                padding: 0.3rem 0.6rem;
                border-radius: 6px;
                border: 2px solid #333;
                min-width: 3.5rem;
                text-align: center;
                text-shadow: 0 0 10px rgba(255, 51, 51, 0.7);
            }

            .ms-face-btn {
                background: linear-gradient(145deg, #3a3a5a, #2a2a4a);
                border: 2px solid #444;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 1.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ms-face-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(233, 69, 96, 0.4);
            }

            .ms-face-btn:active {
                transform: scale(0.95);
            }

            .ms-mode-btn {
                background: linear-gradient(145deg, #4CAF50, #388E3C);
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            }

            .ms-mode-btn.flag-mode {
                background: linear-gradient(145deg, #FF9800, #F57C00);
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
            }

            .ms-mode-btn:hover {
                transform: translateY(-2px);
            }

            .ms-grid-wrapper {
                max-width: 100%;
                overflow-x: auto;
                padding: 0.5rem;
            }

            .ms-grid-container {
                background: linear-gradient(145deg, #2a2a4a, #1a1a3a);
                border: 3px solid #444;
                border-radius: 12px;
                padding: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                            inset 0 2px 10px rgba(255, 255, 255, 0.05);
            }

            .ms-grid {
                display: grid;
                gap: 2px;
                background: #222;
            }

            .ms-cell {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -webkit-touch-callout: none;
                touch-action: manipulation;
                transition: all 0.15s ease;
                border-radius: 4px;
            }

            .ms-cell.hidden {
                background: linear-gradient(145deg, #4a4a6a, #3a3a5a);
                border: 2px solid #555;
                box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1),
                            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
            }

            .ms-cell.hidden:hover {
                background: linear-gradient(145deg, #5a5a7a, #4a4a6a);
                transform: scale(1.05);
            }

            .ms-cell.revealed {
                background: linear-gradient(145deg, #2a2a3a, #1a1a2a);
                border: 1px solid #333;
                animation: revealCell 0.2s ease-out;
            }

            @keyframes revealCell {
                0% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .ms-cell.flagged {
                background: linear-gradient(145deg, #5a4a2a, #4a3a1a);
                border: 2px solid #FF9800;
                animation: flagPlace 0.3s ease-out;
            }

            @keyframes flagPlace {
                0% { transform: scale(1.3); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }

            .ms-cell.mine {
                background: linear-gradient(145deg, #8a2a2a, #6a1a1a);
                border: 2px solid #e94560;
                animation: mineReveal 0.3s ease-out;
            }

            .ms-cell.mine-hit {
                background: linear-gradient(145deg, #ff0000, #cc0000);
                animation: mineExplode 0.5s ease-out;
            }

            @keyframes mineReveal {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            @keyframes mineExplode {
                0% { transform: scale(0.5); background: #fff; }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }

            .ms-cell .num-1 { color: #4fc3f7; text-shadow: 0 0 8px rgba(79, 195, 247, 0.6); }
            .ms-cell .num-2 { color: #81c784; text-shadow: 0 0 8px rgba(129, 199, 132, 0.6); }
            .ms-cell .num-3 { color: #e57373; text-shadow: 0 0 8px rgba(229, 115, 115, 0.6); }
            .ms-cell .num-4 { color: #9575cd; text-shadow: 0 0 8px rgba(149, 117, 205, 0.6); }
            .ms-cell .num-5 { color: #ffb74d; text-shadow: 0 0 8px rgba(255, 183, 77, 0.6); }
            .ms-cell .num-6 { color: #4dd0e1; text-shadow: 0 0 8px rgba(77, 208, 225, 0.6); }
            .ms-cell .num-7 { color: #f06292; text-shadow: 0 0 8px rgba(240, 98, 146, 0.6); }
            .ms-cell .num-8 { color: #90a4ae; text-shadow: 0 0 8px rgba(144, 164, 174, 0.6); }

            .ms-instructions {
                text-align: center;
                color: #888;
                font-size: 0.85rem;
                max-width: 500px;
                line-height: 1.5;
            }

            .ms-instructions strong {
                color: #e94560;
            }

            .ms-game-over {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, #1a1a2e, #0f0f1e);
                border: 3px solid #e94560;
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 0 50px rgba(233, 69, 96, 0.5);
                animation: popIn 0.4s ease-out;
            }

            .ms-game-over.win {
                border-color: #4CAF50;
                box-shadow: 0 0 50px rgba(76, 175, 80, 0.5);
            }

            @keyframes popIn {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }

            .ms-game-over h2 {
                font-size: 2rem;
                margin: 0 0 1rem 0;
                color: #e94560;
            }

            .ms-game-over.win h2 {
                color: #4CAF50;
            }

            .ms-game-over p {
                color: #aaa;
                margin: 0.5rem 0;
                font-size: 1.1rem;
            }

            .ms-game-over button {
                background: linear-gradient(145deg, #e94560, #c23a51);
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 1rem;
                transition: all 0.3s ease;
            }

            .ms-game-over.win button {
                background: linear-gradient(145deg, #4CAF50, #388E3C);
            }

            .ms-game-over button:hover {
                transform: scale(1.05);
            }

            .ms-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
            }

            .ms-confetti {
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

    // Game constants
    const DIFFICULTIES = {
        beginner: { rows: 9, cols: 9, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 30, cols: 16, mines: 99 }
    };

    // Game state
    let gameState = {
        difficulty: 'beginner',
        rows: 9,
        cols: 9,
        mines: 10,
        grid: [],
        revealed: [],
        flagged: [],
        gameOver: false,
        won: false,
        firstClick: true,
        timer: 0,
        timerInterval: null,
        minesRemaining: 10,
        flagMode: false,
        showingEndScreen: false
    };

    // Touch handling for long-press
    let touchTimer = null;
    let touchHandled = false;

    // Initialize game
    function initGame(difficulty = 'beginner') {
        // Clear any existing timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }

        // Close any end screen
        closeEndScreen();

        const config = DIFFICULTIES[difficulty];
        gameState = {
            difficulty: difficulty,
            rows: config.rows,
            cols: config.cols,
            mines: config.mines,
            grid: [],
            revealed: [],
            flagged: [],
            gameOver: false,
            won: false,
            firstClick: true,
            timer: 0,
            timerInterval: null,
            minesRemaining: config.mines,
            flagMode: false,
            showingEndScreen: false
        };

        // Initialize empty grid (mines placed on first click)
        for (let r = 0; r < gameState.rows; r++) {
            gameState.grid[r] = [];
            gameState.revealed[r] = [];
            gameState.flagged[r] = [];
            for (let c = 0; c < gameState.cols; c++) {
                gameState.grid[r][c] = 0;
                gameState.revealed[r][c] = false;
                gameState.flagged[r][c] = false;
            }
        }

        renderGame();
    }

    // Place mines AFTER first click (ensures first click is always safe)
    function placeMines(safeRow, safeCol) {
        let minesPlaced = 0;
        const safeZone = [];

        // Mark 3x3 area around first click as safe zone
        for (let r = safeRow - 1; r <= safeRow + 1; r++) {
            for (let c = safeCol - 1; c <= safeCol + 1; c++) {
                if (r >= 0 && r < gameState.rows && c >= 0 && c < gameState.cols) {
                    safeZone.push(`${r},${c}`);
                }
            }
        }

        // Place mines randomly, avoiding safe zone
        while (minesPlaced < gameState.mines) {
            const r = Math.floor(Math.random() * gameState.rows);
            const c = Math.floor(Math.random() * gameState.cols);
            const key = `${r},${c}`;

            if (gameState.grid[r][c] !== 'mine' && !safeZone.includes(key)) {
                gameState.grid[r][c] = 'mine';
                minesPlaced++;
            }
        }

        // Calculate numbers for all non-mine cells
        for (let r = 0; r < gameState.rows; r++) {
            for (let c = 0; c < gameState.cols; c++) {
                if (gameState.grid[r][c] !== 'mine') {
                    gameState.grid[r][c] = countAdjacentMines(r, c);
                }
            }
        }
    }

    // Count mines in 8 adjacent cells
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < gameState.rows && c >= 0 && c < gameState.cols) {
                    if (gameState.grid[r][c] === 'mine') {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    // Flood fill algorithm to reveal empty cells
    function revealCell(row, col) {
        if (row < 0 || row >= gameState.rows || col < 0 || col >= gameState.cols) {
            return;
        }
        if (gameState.revealed[row][col] || gameState.flagged[row][col]) {
            return;
        }

        gameState.revealed[row][col] = true;

        // If empty cell (0 adjacent mines), recursively reveal neighbors
        if (gameState.grid[row][col] === 0) {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r !== row || c !== col) {
                        revealCell(r, c);
                    }
                }
            }
        }
    }

    // Handle left click
    function handleLeftClick(row, col) {
        if (gameState.gameOver || gameState.showingEndScreen) {
            return;
        }

        // If in flag mode, place/remove flag instead
        if (gameState.flagMode) {
            toggleFlag(row, col);
            return;
        }

        // Can't reveal flagged cells
        if (gameState.flagged[row][col]) {
            return;
        }

        // First click - place mines
        if (gameState.firstClick) {
            gameState.firstClick = false;
            placeMines(row, col);
            startTimer();
        }

        // Already revealed
        if (gameState.revealed[row][col]) {
            return;
        }

        // Hit a mine
        if (gameState.grid[row][col] === 'mine') {
            gameState.gameOver = true;
            gameState.won = false;
            gameState.hitMine = { row, col };
            revealAllMines();
            stopTimer();
            renderGame();
            showEndScreen(false);
            return;
        }

        // Reveal cell(s)
        revealCell(row, col);
        checkWin();
        renderGame();
    }

    // Toggle flag on a cell
    function toggleFlag(row, col) {
        if (gameState.gameOver || gameState.revealed[row][col]) {
            return;
        }
        gameState.flagged[row][col] = !gameState.flagged[row][col];
        gameState.minesRemaining += gameState.flagged[row][col] ? -1 : 1;
        renderGame();
    }

    // Handle right click (flagging)
    function handleRightClick(row, col, event) {
        event.preventDefault();
        toggleFlag(row, col);
    }

    // Handle middle click or both buttons (chording)
    function handleChording(row, col) {
        if (gameState.gameOver || !gameState.revealed[row][col]) {
            return;
        }

        const cellValue = gameState.grid[row][col];
        if (cellValue === 0 || cellValue === 'mine') {
            return;
        }

        // Count adjacent flags
        let flagCount = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < gameState.rows && c >= 0 && c < gameState.cols) {
                    if (gameState.flagged[r][c]) {
                        flagCount++;
                    }
                }
            }
        }

        // If flag count matches number, reveal all unflagged neighbors
        if (flagCount === cellValue) {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < gameState.rows && c >= 0 && c < gameState.cols) {
                        if (!gameState.flagged[r][c] && !gameState.revealed[r][c]) {
                            if (gameState.grid[r][c] === 'mine') {
                                gameState.gameOver = true;
                                gameState.won = false;
                                gameState.hitMine = { row: r, col: c };
                                revealAllMines();
                                stopTimer();
                            } else {
                                revealCell(r, c);
                            }
                        }
                    }
                }
            }
            checkWin();
            renderGame();
            if (gameState.gameOver && !gameState.won) {
                showEndScreen(false);
            }
        }
    }

    // Reveal all mines (game over)
    function revealAllMines() {
        for (let r = 0; r < gameState.rows; r++) {
            for (let c = 0; c < gameState.cols; c++) {
                if (gameState.grid[r][c] === 'mine') {
                    gameState.revealed[r][c] = true;
                }
            }
        }
    }

    // Check win condition
    function checkWin() {
        let allSafeCellsRevealed = true;
        for (let r = 0; r < gameState.rows; r++) {
            for (let c = 0; c < gameState.cols; c++) {
                if (gameState.grid[r][c] !== 'mine' && !gameState.revealed[r][c]) {
                    allSafeCellsRevealed = false;
                    break;
                }
            }
            if (!allSafeCellsRevealed) break;
        }

        if (allSafeCellsRevealed) {
            gameState.gameOver = true;
            gameState.won = true;
            stopTimer();

            // Auto-flag remaining mines
            for (let r = 0; r < gameState.rows; r++) {
                for (let c = 0; c < gameState.cols; c++) {
                    if (gameState.grid[r][c] === 'mine') {
                        gameState.flagged[r][c] = true;
                    }
                }
            }
            gameState.minesRemaining = 0;
            renderGame();
            showEndScreen(true);
        }
    }

    // Timer functions
    function startTimer() {
        gameState.timerInterval = setInterval(() => {
            gameState.timer++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }
    }

    function updateTimerDisplay() {
        const timerEl = document.getElementById('minesweeperTimer');
        if (timerEl) {
            timerEl.textContent = String(Math.min(999, gameState.timer)).padStart(3, '0');
        }
    }

    // Show end screen
    function showEndScreen(won) {
        gameState.showingEndScreen = true;
        const content = document.getElementById('minesweeperContent');

        if (won) {
            createConfetti();
        }

        const endScreenHtml = `
            <div class="ms-overlay" onclick="closeMsEndScreen()"></div>
            <div class="ms-game-over ${won ? 'win' : ''}">
                <h2>${won ? '🎉 Victory!' : '💥 Game Over!'}</h2>
                <p>${won ? 'You cleared the minefield!' : 'You hit a mine!'}</p>
                <p>Time: ${gameState.timer} seconds</p>
                <p>Difficulty: ${gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)}</p>
                <button onclick="closeMsEndScreen(); initMinesweeper();">Play Again</button>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', endScreenHtml);
    }

    function closeEndScreen() {
        gameState.showingEndScreen = false;
        const overlay = document.querySelector('.ms-overlay');
        const endScreen = document.querySelector('.ms-game-over');
        if (overlay) overlay.remove();
        if (endScreen) endScreen.remove();
        // Remove confetti
        document.querySelectorAll('.ms-confetti').forEach(c => c.remove());
    }

    window.closeMsEndScreen = closeEndScreen;

    // Create confetti effect
    function createConfetti() {
        const colors = ['#e94560', '#4CAF50', '#FF9800', '#4fc3f7', '#9575cd', '#f06292'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'ms-confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }

    // Render game
    function renderGame() {
        const content = document.getElementById('minesweeperContent');

        // Calculate cell size based on difficulty and screen
        const reservedSpace = 80;
        const availableWidth = Math.min(window.innerWidth - reservedSpace, 1200);

        let maxCellSize;
        if (gameState.difficulty === 'beginner') {
            maxCellSize = 36;
        } else if (gameState.difficulty === 'intermediate') {
            maxCellSize = 28;
        } else {
            maxCellSize = 22;
        }

        const gridPadding = 20;
        const calculatedSize = Math.floor((availableWidth - gridPadding) / gameState.cols);
        const cellSize = Math.min(maxCellSize, Math.max(18, calculatedSize));

        content.innerHTML = `
            <div class="ms-container">
                <h1 class="ms-title">💣 Minesweeper</h1>

                <div class="ms-difficulty-row">
                    <button class="ms-diff-btn ${gameState.difficulty === 'beginner' ? 'active-beginner' : ''}"
                            onclick="changeDifficulty('beginner')">
                        Beginner (9×9)
                    </button>
                    <button class="ms-diff-btn ${gameState.difficulty === 'intermediate' ? 'active-intermediate' : ''}"
                            onclick="changeDifficulty('intermediate')">
                        Intermediate (16×16)
                    </button>
                    <button class="ms-diff-btn ${gameState.difficulty === 'expert' ? 'active-expert' : ''}"
                            onclick="changeDifficulty('expert')">
                        Expert (30×16)
                    </button>
                </div>

                <div class="ms-info-bar" style="width: ${cellSize * gameState.cols + 16}px; max-width: 100%;">
                    <div class="ms-counter">
                        ${String(Math.max(0, gameState.minesRemaining)).padStart(3, '0')}
                    </div>
                    <button class="ms-face-btn" onclick="initMinesweeper()">
                        ${gameState.gameOver ? (gameState.won ? '😎' : '😵') : '🙂'}
                    </button>
                    <div class="ms-counter" id="minesweeperTimer">
                        ${String(Math.min(999, gameState.timer)).padStart(3, '0')}
                    </div>
                </div>

                <button class="ms-mode-btn ${gameState.flagMode ? 'flag-mode' : ''}" onclick="toggleFlagMode()">
                    ${gameState.flagMode ? '🚩 Flag Mode' : '👆 Reveal Mode'}
                </button>

                <div class="ms-grid-wrapper">
                    <div class="ms-grid-container">
                        <div class="ms-grid" style="grid-template-columns: repeat(${gameState.cols}, ${cellSize}px);">
                            ${renderGrid(cellSize)}
                        </div>
                    </div>
                </div>

                <div class="ms-instructions">
                    <strong>Desktop:</strong> Click to reveal · Right-click to flag · Middle-click numbers to chord<br>
                    <strong>Mobile:</strong> Use mode toggle or long-press to flag<br>
                    💡 First click is always safe!
                </div>
            </div>
        `;
    }

    // Render grid cells
    function renderGrid(cellSize) {
        let html = '';

        for (let r = 0; r < gameState.rows; r++) {
            for (let c = 0; c < gameState.cols; c++) {
                const revealed = gameState.revealed[r][c];
                const flagged = gameState.flagged[r][c];
                const value = gameState.grid[r][c];
                const isHitMine = gameState.hitMine && gameState.hitMine.row === r && gameState.hitMine.col === c;

                let cellClass = 'ms-cell';
                let content = '';

                if (flagged && !revealed) {
                    cellClass += ' hidden flagged';
                    content = '🚩';
                } else if (revealed) {
                    if (value === 'mine') {
                        cellClass += isHitMine ? ' mine mine-hit' : ' mine';
                        content = '💣';
                    } else {
                        cellClass += ' revealed';
                        if (value > 0) {
                            content = `<span class="num-${value}">${value}</span>`;
                        }
                    }
                } else {
                    cellClass += ' hidden';
                }

                html += `
                    <div class="${cellClass}"
                         style="width: ${cellSize}px; height: ${cellSize}px; font-size: ${cellSize * 0.55}px;"
                         onmousedown="handleMouseDown(event, ${r}, ${c})"
                         oncontextmenu="handleRightClickCell(${r}, ${c}, event)"
                         ontouchstart="handleTouchStart(event, ${r}, ${c})"
                         ontouchend="handleTouchEnd(event, ${r}, ${c})"
                         ontouchmove="handleTouchMove()"
                    >${content}</div>
                `;
            }
        }

        return html;
    }

    // Mouse event handling for chording
    window.handleMouseDown = function(event, row, col) {
        event.preventDefault();

        if (event.button === 0) {
            handleLeftClick(row, col);
        } else if (event.button === 1) {
            handleChording(row, col);
        }
    };

    window.handleRightClickCell = function(row, col, event) {
        handleRightClick(row, col, event);
    };

    // Touch event handlers for long-press flagging
    window.handleTouchStart = function(event, row, col) {
        event.preventDefault();
        touchHandled = false;

        touchTimer = setTimeout(() => {
            toggleFlag(row, col);
            touchHandled = true;

            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500);
    };

    window.handleTouchEnd = function(event, row, col) {
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }

        if (touchHandled) {
            event.preventDefault();
            touchHandled = false;
            return;
        }

        event.preventDefault();
        handleLeftClick(row, col);
    };

    window.handleTouchMove = function() {
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }
    };

    // Toggle flag mode
    window.toggleFlagMode = function() {
        gameState.flagMode = !gameState.flagMode;
        renderGame();
    };

    // Change difficulty
    window.changeDifficulty = function(difficulty) {
        initGame(difficulty);
    };

    // Initialize game
    window.initMinesweeper = function() {
        initGame(gameState.difficulty);
    };

    // Launch Minesweeper
    window.launchMinesweeper = function() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('minesweeperGame').style.display = 'block';
        initGame();
    };

    // Exit to menu
    window.exitMinesweeper = function() {
        stopTimer();
        closeEndScreen();
        document.getElementById('minesweeperGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };

})();

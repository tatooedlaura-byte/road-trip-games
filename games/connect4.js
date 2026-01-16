// Connect 4 Game - Overhauled Edition
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'connect4-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .c4-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
            }

            .c4-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .c4-back-btn {
                position: absolute;
                top: 0.5rem;
                left: 0.5rem;
                background: rgba(75, 85, 99, 0.9);
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                cursor: pointer;
                z-index: 100;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .c4-back-btn:hover {
                background: rgba(75, 85, 99, 1);
            }

            .c4-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .c4-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #e94560 0%, #ffbd69 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .c4-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .c4-turn-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 1rem;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
            }

            .c4-turn-indicator.player1 {
                background: linear-gradient(135deg, rgba(233,69,96,0.3) 0%, rgba(233,69,96,0.1) 100%);
                border: 2px solid rgba(233,69,96,0.5);
            }

            .c4-turn-indicator.player2 {
                background: linear-gradient(135deg, rgba(255,189,105,0.3) 0%, rgba(255,189,105,0.1) 100%);
                border: 2px solid rgba(255,189,105,0.5);
            }

            .c4-disc-preview {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3);
            }

            .c4-disc-preview.red {
                background: radial-gradient(circle at 30% 30%, #ff6b6b, #e94560, #c73e54);
            }

            .c4-disc-preview.yellow {
                background: radial-gradient(circle at 30% 30%, #ffe066, #ffbd69, #f0a500);
            }

            .c4-turn-text {
                font-size: 1.2rem;
                font-weight: 600;
            }

            .c4-board-wrapper {
                position: relative;
                display: flex;
                justify-content: center;
            }

            .c4-board {
                background: linear-gradient(180deg, #0077b6 0%, #023e8a 100%);
                border-radius: 12px;
                padding: 8px;
                box-shadow:
                    inset 0 2px 10px rgba(0,0,0,0.3),
                    0 8px 20px rgba(0,0,0,0.4);
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 6px;
            }

            .c4-column {
                display: flex;
                flex-direction: column;
                gap: 6px;
                cursor: pointer;
                position: relative;
            }

            .c4-column:hover .c4-cell:not(.filled) {
                background: rgba(255,255,255,0.15);
            }

            .c4-column.disabled {
                cursor: default;
            }

            .c4-column-indicator {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%) scale(0);
                width: 32px;
                height: 32px;
                border-radius: 50%;
                opacity: 0.7;
                transition: transform 0.2s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .c4-column:hover .c4-column-indicator {
                transform: translateX(-50%) scale(1);
            }

            .c4-column.disabled .c4-column-indicator {
                display: none;
            }

            .c4-cell {
                width: clamp(36px, 10vw, 48px);
                height: clamp(36px, 10vw, 48px);
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                position: relative;
                transition: background 0.2s ease;
                overflow: hidden;
            }

            .c4-disc {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3);
            }

            .c4-disc.red {
                background: radial-gradient(circle at 30% 30%, #ff6b6b, #e94560, #c73e54);
            }

            .c4-disc.yellow {
                background: radial-gradient(circle at 30% 30%, #ffe066, #ffbd69, #f0a500);
            }

            .c4-disc.dropping {
                animation: dropDisc 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            .c4-disc.winning {
                animation: winPulse 0.6s ease-in-out infinite;
            }

            @keyframes dropDisc {
                0% {
                    transform: translateY(-400px);
                    opacity: 0.8;
                }
                60% {
                    transform: translateY(10px);
                }
                80% {
                    transform: translateY(-5px);
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes winPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0.5);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3), 0 0 20px 5px rgba(255,255,255,0.4);
                }
            }

            .c4-buttons {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.5rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .c4-btn {
                padding: 0.875rem 1.5rem;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .c4-btn:active {
                transform: scale(0.97);
            }

            .c4-btn-primary {
                background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(233,69,96,0.4);
            }

            .c4-btn-primary:hover {
                box-shadow: 0 6px 20px rgba(233,69,96,0.5);
                transform: translateY(-2px);
            }

            .c4-btn-secondary {
                background: rgba(255,255,255,0.15);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .c4-btn-secondary:hover {
                background: rgba(255,255,255,0.25);
            }

            .c4-mode-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .c4-mode-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 1.5rem 1rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .c4-mode-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(255,255,255,0.4);
                transform: translateY(-3px);
            }

            .c4-mode-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .c4-mode-title {
                font-size: 1.1rem;
                font-weight: 600;
                display: block;
                margin-bottom: 0.25rem;
            }

            .c4-mode-desc {
                font-size: 0.85rem;
                opacity: 0.7;
            }

            .c4-input-group {
                margin-bottom: 1.25rem;
            }

            .c4-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .c4-input {
                width: 100%;
                padding: 0.875rem 1rem;
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 1rem;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }

            .c4-input:focus {
                outline: none;
                border-color: #e94560;
                background: rgba(255,255,255,0.15);
            }

            .c4-input::placeholder {
                color: rgba(255,255,255,0.4);
            }

            .c4-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }

            .c4-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .c4-rules p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .c4-winner-banner {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(233,69,96,0.2) 0%, rgba(255,189,105,0.2) 100%);
                border-radius: 15px;
                margin-bottom: 1.5rem;
                animation: celebrateIn 0.5s ease-out;
            }

            .c4-winner-title {
                font-size: 2.5rem;
                margin: 0 0 0.5rem 0;
            }

            .c4-winner-name {
                font-size: 1.4rem;
                font-weight: 600;
                margin: 0;
            }

            @keyframes celebrateIn {
                0% {
                    transform: scale(0.8);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .c4-confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 2px;
                animation: confettiFall 3s ease-out forwards;
            }

            @keyframes confettiFall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(500px) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Game State
    let state = {
        board: Array(6).fill(null).map(() => Array(7).fill(null)),
        currentPlayer: 1,
        player1Name: '',
        player2Name: '',
        isAI: false,
        gameOver: false,
        winningCells: [],
        lastMove: null
    };

    function resetState() {
        state = {
            board: Array(6).fill(null).map(() => Array(7).fill(null)),
            currentPlayer: 1,
            player1Name: state.player1Name,
            player2Name: state.player2Name,
            isAI: state.isAI,
            gameOver: false,
            winningCells: [],
            lastMove: null
        };
    }

    function launchConnectFour() {
        state = {
            board: Array(6).fill(null).map(() => Array(7).fill(null)),
            currentPlayer: 1,
            player1Name: '',
            player2Name: '',
            isAI: false,
            gameOver: false,
            winningCells: [],
            lastMove: null
        };

        if (typeof hideAllMenus === 'function') hideAllMenus();
        document.getElementById('connect4Game').style.display = 'block';
        showSetup();
    }

    function exitConnect4() {
        document.getElementById('connect4Game').style.display = 'none';
        document.getElementById('strategyMenu').style.display = 'block';
    }

    function showSetup() {
        const content = document.getElementById('connect4Content');
        content.innerHTML = `
            <div class="c4-container">
                <div class="c4-card">
                    <button class="c4-back-btn" onclick="exitConnect4()">← Back</button>
                    <div class="c4-header">
                        <h1 class="c4-title">Connect 4</h1>
                        <p class="c4-subtitle">Drop discs & connect four to win!</p>
                    </div>

                    <div class="c4-rules">
                        <h4>How to Play</h4>
                        <p>Take turns dropping colored discs into the grid. First player to connect 4 in a row (horizontally, vertically, or diagonally) wins!</p>
                    </div>

                    <h3 style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;">Choose Mode</h3>

                    <div class="c4-mode-grid">
                        <button class="c4-mode-btn" onclick="selectConnect4PassAndPlay()">
                            <span class="c4-mode-icon">👥</span>
                            <span class="c4-mode-title">Pass & Play</span>
                            <span class="c4-mode-desc">2 Players</span>
                        </button>
                        <button class="c4-mode-btn" onclick="selectConnect4VsAI()">
                            <span class="c4-mode-icon">🤖</span>
                            <span class="c4-mode-title">vs Computer</span>
                            <span class="c4-mode-desc">Single Player</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function selectConnect4PassAndPlay() {
        state.isAI = false;
        showPlayerNames();
    }

    function selectConnect4VsAI() {
        state.isAI = true;
        showPlayerNames();
    }

    function showPlayerNames() {
        const content = document.getElementById('connect4Content');
        content.innerHTML = `
            <div class="c4-container">
                <div class="c4-card">
                    <button class="c4-back-btn" onclick="showSetup()">← Back</button>
                    <div class="c4-header">
                        <h1 class="c4-title">Player Names</h1>
                        <p class="c4-subtitle">${state.isAI ? 'Enter your name' : 'Enter player names'}</p>
                    </div>

                    <div class="c4-input-group">
                        <label class="c4-label">
                            <span class="c4-disc-preview red" style="width: 24px; height: 24px;"></span>
                            Player 1 (Red)
                        </label>
                        <input type="text" id="connect4Player1Name" class="c4-input" placeholder="Enter name" value="${state.player1Name || ''}">
                    </div>

                    ${!state.isAI ? `
                    <div class="c4-input-group">
                        <label class="c4-label">
                            <span class="c4-disc-preview yellow" style="width: 24px; height: 24px;"></span>
                            Player 2 (Yellow)
                        </label>
                        <input type="text" id="connect4Player2Name" class="c4-input" placeholder="Enter name" value="${state.player2Name || ''}">
                    </div>
                    ` : ''}

                    <div class="c4-buttons">
                        <button class="c4-btn c4-btn-primary" onclick="startConnect4WithNames()">Start Game</button>
                    </div>
                </div>
            </div>
        `;

        // Focus first input
        setTimeout(() => {
            document.getElementById('connect4Player1Name')?.focus();
        }, 100);
    }

    function startConnect4WithNames() {
        const player1Input = document.getElementById('connect4Player1Name').value.trim();
        const player2Input = state.isAI ? 'Computer' : document.getElementById('connect4Player2Name')?.value.trim();

        state.player1Name = player1Input || 'Player 1';
        state.player2Name = player2Input || 'Player 2';

        showBoard();
    }

    function showBoard() {
        const content = document.getElementById('connect4Content');
        const currentPlayerName = state.currentPlayer === 1 ? state.player1Name : state.player2Name;
        const playerClass = state.currentPlayer === 1 ? 'player1' : 'player2';
        const discClass = state.currentPlayer === 1 ? 'red' : 'yellow';

        content.innerHTML = `
            <div class="c4-container">
                <div class="c4-card">
                    <div class="c4-turn-indicator ${playerClass}">
                        <div class="c4-disc-preview ${discClass}"></div>
                        <span class="c4-turn-text">${currentPlayerName}'s Turn</span>
                    </div>

                    <div class="c4-board-wrapper">
                        <div class="c4-board">
                            ${renderBoard()}
                        </div>
                    </div>

                    <div class="c4-buttons">
                        <button class="c4-btn c4-btn-secondary" onclick="exitConnect4()">← Exit</button>
                        <button class="c4-btn c4-btn-secondary" onclick="launchConnectFour()">↺ Restart</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderBoard() {
        let html = '';
        const discClass = state.currentPlayer === 1 ? 'red' : 'yellow';

        // Render by columns for easier click handling
        for (let col = 0; col < 7; col++) {
            const available = isColumnAvailable(col);
            const columnClass = !state.gameOver && available ? '' : 'disabled';

            html += `<div class="c4-column ${columnClass}" onclick="${!state.gameOver && available ? `dropDisc(${col})` : ''}">`;

            // Add hover indicator
            if (!state.gameOver && available) {
                html += `<div class="c4-column-indicator c4-disc-preview ${discClass}"></div>`;
            }

            // Render cells in this column (top to bottom)
            for (let row = 0; row < 6; row++) {
                const cell = state.board[row][col];
                const isWinning = state.winningCells.some(([r, c]) => r === row && c === col);
                const isLastMove = state.lastMove && state.lastMove.row === row && state.lastMove.col === col;

                let discHtml = '';
                if (cell === 1) {
                    const classes = ['c4-disc', 'red'];
                    if (isWinning) classes.push('winning');
                    if (isLastMove) classes.push('dropping');
                    discHtml = `<div class="${classes.join(' ')}"></div>`;
                } else if (cell === 2) {
                    const classes = ['c4-disc', 'yellow'];
                    if (isWinning) classes.push('winning');
                    if (isLastMove) classes.push('dropping');
                    discHtml = `<div class="${classes.join(' ')}"></div>`;
                }

                html += `<div class="c4-cell ${cell ? 'filled' : ''}">${discHtml}</div>`;
            }

            html += '</div>';
        }

        return html;
    }

    function isColumnAvailable(col) {
        return state.board[0][col] === null;
    }

    function dropDisc(col) {
        if (state.gameOver) return;

        // Find the lowest available row
        let row = -1;
        for (let r = 5; r >= 0; r--) {
            if (state.board[r][col] === null) {
                row = r;
                break;
            }
        }

        if (row === -1) return;

        // Place the disc
        state.board[row][col] = state.currentPlayer;
        state.lastMove = { row, col };

        // Check for win
        const winResult = checkWin(row, col);
        if (winResult) {
            state.gameOver = true;
            state.winningCells = winResult;
            showBoard();
            setTimeout(() => showWinner(), 600);
            return;
        }

        // Check for draw
        if (isBoardFull()) {
            state.gameOver = true;
            showBoard();
            setTimeout(() => showDraw(), 400);
            return;
        }

        // Switch player
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        showBoard();

        // AI move
        if (state.isAI && state.currentPlayer === 2) {
            setTimeout(() => makeAIMove(), 700);
        }
    }

    function checkWin(row, col) {
        const player = state.board[row][col];
        const directions = [
            [[0, 1], [0, -1]],   // Horizontal
            [[1, 0], [-1, 0]],  // Vertical
            [[1, 1], [-1, -1]], // Diagonal \
            [[1, -1], [-1, 1]]  // Diagonal /
        ];

        for (const [dir1, dir2] of directions) {
            const cells = [[row, col]];

            // Check in first direction
            for (let i = 1; i < 4; i++) {
                const r = row + dir1[0] * i;
                const c = col + dir1[1] * i;
                if (r >= 0 && r < 6 && c >= 0 && c < 7 && state.board[r][c] === player) {
                    cells.push([r, c]);
                } else break;
            }

            // Check in opposite direction
            for (let i = 1; i < 4; i++) {
                const r = row + dir2[0] * i;
                const c = col + dir2[1] * i;
                if (r >= 0 && r < 6 && c >= 0 && c < 7 && state.board[r][c] === player) {
                    cells.push([r, c]);
                } else break;
            }

            if (cells.length >= 4) return cells;
        }

        return null;
    }

    function isBoardFull() {
        return state.board[0].every(cell => cell !== null);
    }

    function makeAIMove() {
        if (state.gameOver) return;

        const aiPlayer = 2;
        const humanPlayer = 1;

        // Priority 1: Win if possible
        for (let col = 0; col < 7; col++) {
            if (isColumnAvailable(col)) {
                const row = getLowestRow(col);
                state.board[row][col] = aiPlayer;
                if (checkWin(row, col)) {
                    state.lastMove = { row, col };
                    state.gameOver = true;
                    state.winningCells = checkWin(row, col) || [];
                    showBoard();
                    setTimeout(() => showWinner(), 600);
                    return;
                }
                state.board[row][col] = null;
            }
        }

        // Priority 2: Block opponent's win
        for (let col = 0; col < 7; col++) {
            if (isColumnAvailable(col)) {
                const row = getLowestRow(col);
                state.board[row][col] = humanPlayer;
                if (checkWin(row, col)) {
                    state.board[row][col] = null;
                    dropDisc(col);
                    return;
                }
                state.board[row][col] = null;
            }
        }

        // Priority 3: Take center if available
        if (isColumnAvailable(3)) {
            dropDisc(3);
            return;
        }

        // Priority 4: Avoid giving opponent a winning move
        const safeCols = [];
        for (let col = 0; col < 7; col++) {
            if (isColumnAvailable(col)) {
                const row = getLowestRow(col);
                state.board[row][col] = aiPlayer;

                // Check if this creates a winning opportunity for opponent above
                let isSafe = true;
                if (row > 0) {
                    state.board[row - 1][col] = humanPlayer;
                    if (checkWin(row - 1, col)) {
                        isSafe = false;
                    }
                    state.board[row - 1][col] = null;
                }

                state.board[row][col] = null;
                if (isSafe) safeCols.push(col);
            }
        }

        // Pick from safe columns, preferring center-adjacent
        if (safeCols.length > 0) {
            const preferred = [3, 2, 4, 1, 5, 0, 6];
            for (const col of preferred) {
                if (safeCols.includes(col)) {
                    dropDisc(col);
                    return;
                }
            }
        }

        // Fallback: Pick any available column
        const available = [];
        for (let col = 0; col < 7; col++) {
            if (isColumnAvailable(col)) available.push(col);
        }

        if (available.length > 0) {
            const col = available[Math.floor(Math.random() * available.length)];
            dropDisc(col);
        }
    }

    function getLowestRow(col) {
        for (let r = 5; r >= 0; r--) {
            if (state.board[r][col] === null) return r;
        }
        return -1;
    }

    function createConfetti() {
        const container = document.querySelector('.c4-card');
        if (!container) return;

        const colors = ['#e94560', '#ffbd69', '#4ecdc4', '#a855f7', '#22c55e'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'c4-confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3500);
        }
    }

    function showWinner() {
        const winner = state.currentPlayer;
        const winnerName = winner === 1 ? state.player1Name : state.player2Name;
        const discClass = winner === 1 ? 'red' : 'yellow';

        const content = document.getElementById('connect4Content');
        content.innerHTML = `
            <div class="c4-container">
                <div class="c4-card" style="position: relative; overflow: hidden;">
                    <button class="c4-back-btn" onclick="exitConnect4()">← Back</button>
                    <div class="c4-winner-banner">
                        <h2 class="c4-winner-title">🎉 Victory! 🎉</h2>
                        <p class="c4-winner-name" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <span class="c4-disc-preview ${discClass}" style="width: 28px; height: 28px;"></span>
                            ${winnerName} Wins!
                        </p>
                    </div>

                    <div class="c4-board-wrapper">
                        <div class="c4-board">
                            ${renderBoard()}
                        </div>
                    </div>

                    <div class="c4-buttons">
                        <button class="c4-btn c4-btn-primary" onclick="playAgain()">🔄 Play Again</button>
                    </div>
                </div>
            </div>
        `;

        createConfetti();
    }

    function showDraw() {
        const content = document.getElementById('connect4Content');
        content.innerHTML = `
            <div class="c4-container">
                <div class="c4-card">
                    <button class="c4-back-btn" onclick="exitConnect4()">← Back</button>
                    <div class="c4-winner-banner" style="background: linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(150,150,150,0.2) 100%);">
                        <h2 class="c4-winner-title">🤝 Draw!</h2>
                        <p class="c4-winner-name">The board is full - it's a tie!</p>
                    </div>

                    <div class="c4-board-wrapper">
                        <div class="c4-board">
                            ${renderBoard()}
                        </div>
                    </div>

                    <div class="c4-buttons">
                        <button class="c4-btn c4-btn-primary" onclick="playAgain()">🔄 Play Again</button>
                    </div>
                </div>
            </div>
        `;
    }

    function playAgain() {
        resetState();
        showBoard();
    }

    // Expose functions to global scope
    window.launchConnectFour = launchConnectFour;
    window.exitConnect4 = exitConnect4;
    window.selectConnect4PassAndPlay = selectConnect4PassAndPlay;
    window.selectConnect4VsAI = selectConnect4VsAI;
    window.startConnect4WithNames = startConnect4WithNames;
    window.dropDisc = dropDisc;
    window.playAgain = playAgain;
    window.showSetup = showSetup;

})();

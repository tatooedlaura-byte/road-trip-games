// Othello Game - Overhauled Edition
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'othello-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .oth-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 0.75rem;
            }

            .oth-card {
                background: linear-gradient(145deg, #1a3d2e 0%, #0d261a 100%);
                border-radius: 20px;
                padding: 1.25rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .oth-back-btn {
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                padding: 0.4rem 0.7rem;
                border-radius: 8px;
                font-size: 0.8rem;
                cursor: pointer;
                z-index: 10;
            }

            .oth-back-btn:hover {
                background: rgba(255,255,255,0.25);
            }

            .oth-header {
                text-align: center;
                margin-bottom: 1.25rem;
            }

            .oth-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .oth-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .oth-scoreboard {
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: rgba(255,255,255,0.08);
                border-radius: 15px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .oth-score {
                text-align: center;
                min-width: 80px;
                padding: 0.5rem;
                border-radius: 10px;
                transition: all 0.3s ease;
            }

            .oth-score.active {
                background: rgba(255,255,255,0.1);
                transform: scale(1.05);
            }

            .oth-disc-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 0 auto 0.5rem auto;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }

            .oth-disc-icon.black {
                background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
                border: 2px solid #333;
            }

            .oth-disc-icon.white {
                background: radial-gradient(circle at 30% 30%, #ffffff, #d0d0d0);
                border: 2px solid #bbb;
            }

            .oth-score-value {
                font-size: 1.8rem;
                font-weight: 700;
            }

            .oth-score-label {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-top: 0.25rem;
            }

            .oth-vs {
                font-size: 1.2rem;
                opacity: 0.5;
                font-weight: 600;
            }

            .oth-status {
                text-align: center;
                padding: 0.75rem;
                border-radius: 10px;
                margin-bottom: 1rem;
                font-size: 1rem;
                font-weight: 600;
                background: rgba(46,204,113,0.2);
                border: 2px solid rgba(46,204,113,0.4);
                color: #2ecc71;
            }

            .oth-status.gameover {
                background: rgba(241,196,15,0.2);
                border-color: rgba(241,196,15,0.4);
                color: #f1c40f;
            }

            .oth-board-container {
                background: linear-gradient(145deg, #1e5f3d 0%, #145a32 100%);
                border-radius: 12px;
                padding: 6px;
                box-shadow: inset 0 2px 10px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.4);
            }

            .oth-board {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 3px;
            }

            .oth-cell {
                aspect-ratio: 1;
                background: linear-gradient(145deg, #27ae60 0%, #1e8449 100%);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.15s ease;
                position: relative;
            }

            .oth-cell:hover:not(.disabled) {
                background: linear-gradient(145deg, #2ecc71 0%, #27ae60 100%);
            }

            .oth-cell.valid {
                background: linear-gradient(145deg, #2ecc71 0%, #27ae60 100%);
            }

            .oth-cell.disabled {
                cursor: default;
            }

            .oth-disc {
                width: 80%;
                height: 80%;
                border-radius: 50%;
                box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                transition: transform 0.3s ease;
            }

            .oth-disc.black {
                background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
                border: 2px solid #333;
            }

            .oth-disc.white {
                background: radial-gradient(circle at 30% 30%, #ffffff, #d0d0d0);
                border: 2px solid #bbb;
            }

            .oth-disc.new {
                animation: placeDisc 0.3s ease-out;
            }

            .oth-disc.flipping {
                animation: flipDisc 0.4s ease-in-out;
            }

            @keyframes placeDisc {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.15); }
                100% { transform: scale(1); opacity: 1; }
            }

            @keyframes flipDisc {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(90deg); }
                100% { transform: rotateY(0deg); }
            }

            .oth-hint {
                width: 30%;
                height: 30%;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                animation: hintPulse 1.5s ease-in-out infinite;
            }

            @keyframes hintPulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }

            .oth-buttons {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.25rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .oth-btn {
                padding: 0.75rem 1.25rem;
                border: none;
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .oth-btn:active {
                transform: scale(0.97);
            }

            .oth-btn-primary {
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(46,204,113,0.3);
            }

            .oth-btn-primary:hover {
                box-shadow: 0 6px 20px rgba(46,204,113,0.4);
                transform: translateY(-2px);
            }

            .oth-btn-secondary {
                background: rgba(255,255,255,0.15);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .oth-btn-secondary:hover {
                background: rgba(255,255,255,0.25);
            }

            .oth-mode-grid {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1.25rem;
            }

            .oth-mode-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 1rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                width: 100%;
                box-sizing: border-box;
            }

            .oth-mode-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(46,204,113,0.5);
                transform: translateY(-3px);
            }

            .oth-mode-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .oth-mode-title {
                font-size: 1.1rem;
                font-weight: 600;
                display: block;
                margin-bottom: 0.25rem;
            }

            .oth-mode-desc {
                font-size: 0.85rem;
                opacity: 0.7;
            }

            .oth-difficulty {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-top: 1rem;
            }

            .oth-diff-btn {
                padding: 0.5rem 1rem;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.85rem;
            }

            .oth-diff-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .oth-diff-btn.easy:hover { border-color: #2ecc71; }
            .oth-diff-btn.medium:hover { border-color: #f39c12; }
            .oth-diff-btn.hard:hover { border-color: #e74c3c; }

            .oth-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.25rem;
            }

            .oth-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .oth-rules p {
                margin: 0;
                font-size: 0.85rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .oth-winner-banner {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(46,204,113,0.2) 0%, rgba(39,174,96,0.1) 100%);
                border-radius: 15px;
                margin-bottom: 1rem;
                animation: celebrateIn 0.5s ease-out;
            }

            .oth-winner-title {
                font-size: 2rem;
                margin: 0 0 0.5rem 0;
            }

            .oth-winner-score {
                font-size: 1.2rem;
                opacity: 0.9;
            }

            @keyframes celebrateIn {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    const BOARD_SIZE = 8;
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;

    const DIRECTIONS = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    let state = {
        board: [],
        currentPlayer: BLACK,
        gameMode: null,
        aiDifficulty: 'medium',
        gameActive: false,
        validMoves: [],
        lastMove: null
    };

    function initBoard() {
        state.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
        const mid = BOARD_SIZE / 2;
        state.board[mid - 1][mid - 1] = WHITE;
        state.board[mid - 1][mid] = BLACK;
        state.board[mid][mid - 1] = BLACK;
        state.board[mid][mid] = WHITE;
        state.currentPlayer = BLACK;
        state.gameActive = true;
        state.validMoves = getValidMoves(BLACK);
        state.lastMove = null;
    }

    function getValidMoves(player) {
        const moves = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (isValidMove(row, col, player)) {
                    moves.push([row, col]);
                }
            }
        }
        return moves;
    }

    function isValidMove(row, col, player) {
        if (state.board[row][col] !== EMPTY) return false;
        const opponent = player === BLACK ? WHITE : BLACK;

        for (const [dr, dc] of DIRECTIONS) {
            let r = row + dr, c = col + dc;
            let foundOpponent = false;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (state.board[r][c] === EMPTY) break;
                if (state.board[r][c] === opponent) {
                    foundOpponent = true;
                } else if (state.board[r][c] === player && foundOpponent) {
                    return true;
                } else {
                    break;
                }
                r += dr;
                c += dc;
            }
        }
        return false;
    }

    function getFlippedDiscs(row, col, player) {
        const opponent = player === BLACK ? WHITE : BLACK;
        const toFlip = [];

        for (const [dr, dc] of DIRECTIONS) {
            let r = row + dr, c = col + dc;
            const temp = [];

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (state.board[r][c] === EMPTY) break;
                if (state.board[r][c] === opponent) {
                    temp.push([r, c]);
                } else if (state.board[r][c] === player) {
                    toFlip.push(...temp);
                    break;
                } else {
                    break;
                }
                r += dr;
                c += dc;
            }
        }
        return toFlip;
    }

    function makeMove(row, col, player) {
        if (!isValidMove(row, col, player)) return false;

        state.board[row][col] = player;
        state.lastMove = [row, col];
        const flipped = getFlippedDiscs(row, col, player);

        for (const [r, c] of flipped) {
            state.board[r][c] = player;
        }
        return flipped;
    }

    function getScore() {
        let black = 0, white = 0;
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (state.board[row][col] === BLACK) black++;
                else if (state.board[row][col] === WHITE) white++;
            }
        }
        return { black, white };
    }

    function switchPlayer() {
        state.currentPlayer = state.currentPlayer === BLACK ? WHITE : BLACK;
        state.validMoves = getValidMoves(state.currentPlayer);

        if (state.validMoves.length === 0) {
            state.currentPlayer = state.currentPlayer === BLACK ? WHITE : BLACK;
            state.validMoves = getValidMoves(state.currentPlayer);

            if (state.validMoves.length === 0) {
                state.gameActive = false;
                return false;
            }
        }
        return true;
    }

    // AI Logic
    function getAIMove() {
        if (state.validMoves.length === 0) return null;

        if (state.aiDifficulty === 'easy') {
            return state.validMoves[Math.floor(Math.random() * state.validMoves.length)];
        }

        const depth = state.aiDifficulty === 'hard' ? 2 : 1;
        let bestMove = null;
        let bestScore = -Infinity;

        const weights = [
            [100, -20, 10, 5, 5, 10, -20, 100],
            [-20, -50, -5, -5, -5, -5, -50, -20],
            [10, -5, 1, 1, 1, 1, -5, 10],
            [5, -5, 1, 0, 0, 1, -5, 5],
            [5, -5, 1, 0, 0, 1, -5, 5],
            [10, -5, 1, 1, 1, 1, -5, 10],
            [-20, -50, -5, -5, -5, -5, -50, -20],
            [100, -20, 10, 5, 5, 10, -20, 100]
        ];

        for (const [row, col] of state.validMoves) {
            const savedBoard = state.board.map(r => [...r]);
            state.board[row][col] = WHITE;
            const flipped = getFlippedDiscs(row, col, WHITE);
            for (const [r, c] of flipped) state.board[r][c] = WHITE;

            let score = weights[row][col] + flipped.length * 5;

            if (depth > 1) {
                const oppMoves = getValidMoves(BLACK);
                if (oppMoves.length > 0) {
                    let worst = Infinity;
                    for (const [r, c] of oppMoves.slice(0, 5)) {
                        worst = Math.min(worst, weights[r][c]);
                    }
                    score -= worst;
                }
            }

            state.board = savedBoard;

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }

        return bestMove;
    }

    function launchOthello() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('othelloGame').style.display = 'block';
        showSetup();
    }

    function exitOthello() {
        document.getElementById('othelloGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    function showSetup() {
        const content = document.getElementById('othelloContent');
        content.innerHTML = `
            <div class="oth-container">
                <div class="oth-card">
                    <button class="oth-back-btn" onclick="window.othello.exit()">← Back</button>
                    <div class="oth-header">
                        <h1 class="oth-title">Othello</h1>
                        <p class="oth-subtitle">Classic disc-flipping strategy</p>
                    </div>

                    <div class="oth-rules">
                        <h4>How to Play</h4>
                        <p>Place discs to trap opponent's pieces between yours. All trapped discs flip to your color. Most discs wins!</p>
                    </div>

                    <h3 style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;">Choose Mode</h3>

                    <div class="oth-mode-grid">
                        <button class="oth-mode-btn" onclick="window.othello.startPvP()">
                            <span class="oth-mode-icon">👥</span>
                            <span class="oth-mode-title">Pass & Play</span>
                            <span class="oth-mode-desc">2 Players</span>
                        </button>
                        <div class="oth-mode-btn" style="cursor: default;">
                            <span class="oth-mode-icon">🤖</span>
                            <span class="oth-mode-title">vs Computer</span>
                            <div class="oth-difficulty">
                                <button class="oth-diff-btn easy" onclick="window.othello.startAI('easy')">Easy</button>
                                <button class="oth-diff-btn medium" onclick="window.othello.startAI('medium')">Med</button>
                                <button class="oth-diff-btn hard" onclick="window.othello.startAI('hard')">Hard</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function startGame(mode, difficulty = 'medium') {
        state.gameMode = mode;
        state.aiDifficulty = difficulty;
        initBoard();
        showBoard();
    }

    function showBoard() {
        const content = document.getElementById('othelloContent');
        const { black, white } = getScore();
        const isAI = state.gameMode === 'ai';

        let statusText = '';
        let statusClass = '';

        if (!state.gameActive) {
            statusClass = 'gameover';
            if (black > white) {
                statusText = `Black wins ${black}-${white}!`;
            } else if (white > black) {
                statusText = `White wins ${white}-${black}!`;
            } else {
                statusText = `It's a tie ${black}-${white}!`;
            }
        } else {
            const name = state.currentPlayer === BLACK ? 'Black' : 'White';
            const suffix = isAI && state.currentPlayer === WHITE ? ' (AI thinking...)' : "'s turn";
            statusText = name + suffix;
        }

        content.innerHTML = `
            <div class="oth-container">
                <div class="oth-card">
                    <div class="oth-scoreboard">
                        <div class="oth-score ${state.currentPlayer === BLACK && state.gameActive ? 'active' : ''}">
                            <div class="oth-disc-icon black"></div>
                            <div class="oth-score-value">${black}</div>
                            <div class="oth-score-label">${isAI ? 'You' : 'Black'}</div>
                        </div>
                        <div class="oth-vs">VS</div>
                        <div class="oth-score ${state.currentPlayer === WHITE && state.gameActive ? 'active' : ''}">
                            <div class="oth-disc-icon white"></div>
                            <div class="oth-score-value">${white}</div>
                            <div class="oth-score-label">${isAI ? 'Computer' : 'White'}</div>
                        </div>
                    </div>

                    <div class="oth-status ${statusClass}">${statusText}</div>

                    <div class="oth-board-container">
                        <div class="oth-board">
                            ${renderBoard()}
                        </div>
                    </div>

                    <div class="oth-buttons">
                        <button class="oth-btn oth-btn-secondary" onclick="window.othello.exit()">← Exit</button>
                        <button class="oth-btn oth-btn-secondary" onclick="window.othello.menu()">Menu</button>
                        <button class="oth-btn oth-btn-primary" onclick="window.othello.restart()">↺ New Game</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderBoard() {
        let html = '';
        const canMove = state.gameActive && (state.gameMode === 'pvp' || state.currentPlayer === BLACK);

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = state.board[row][col];
                const isValid = state.validMoves.some(([r, c]) => r === row && c === col);
                const isLast = state.lastMove && state.lastMove[0] === row && state.lastMove[1] === col;

                let cellClass = 'oth-cell';
                if (isValid && canMove) cellClass += ' valid';
                if (!canMove || !isValid) cellClass += ' disabled';

                let inner = '';
                if (cell === BLACK) {
                    inner = `<div class="oth-disc black ${isLast ? 'new' : ''}"></div>`;
                } else if (cell === WHITE) {
                    inner = `<div class="oth-disc white ${isLast ? 'new' : ''}"></div>`;
                } else if (isValid && canMove) {
                    inner = `<div class="oth-hint"></div>`;
                }

                const clickHandler = isValid && canMove ? `onclick="window.othello.move(${row},${col})"` : '';

                html += `<div class="${cellClass}" ${clickHandler}>${inner}</div>`;
            }
        }
        return html;
    }

    async function handleMove(row, col) {
        if (!state.gameActive) return;
        if (state.gameMode === 'ai' && state.currentPlayer === WHITE) return;
        if (!isValidMove(row, col, state.currentPlayer)) return;

        makeMove(row, col, state.currentPlayer);
        showBoard();

        if (switchPlayer()) {
            showBoard();

            if (state.gameMode === 'ai' && state.currentPlayer === WHITE && state.gameActive) {
                setTimeout(makeAIMove, 600);
            }
        } else {
            showBoard();
        }
    }

    async function makeAIMove() {
        if (!state.gameActive || state.currentPlayer !== WHITE) return;

        const move = getAIMove();
        if (move) {
            const [row, col] = move;
            makeMove(row, col, WHITE);
            showBoard();

            if (switchPlayer()) {
                showBoard();
            } else {
                showBoard();
            }
        }
    }

    // Expose functions
    window.launchOthello = launchOthello;
    window.othello = {
        startPvP: () => startGame('pvp'),
        startAI: (diff) => startGame('ai', diff),
        move: handleMove,
        restart: () => startGame(state.gameMode, state.aiDifficulty),
        menu: showSetup,
        exit: exitOthello
    };

    // Legacy support
    window.exitOthello = exitOthello;
    window.exitOthelloToMenu = exitOthello;

})();

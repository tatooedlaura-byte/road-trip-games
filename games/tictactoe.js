// Tic Tac Toe Game - Overhauled Edition
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'tictactoe-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .ttt-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 450px;
                margin: 0 auto;
                padding: 1rem;
            }

            .ttt-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .ttt-back-btn {
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

            .ttt-back-btn:hover {
                background: rgba(75, 85, 99, 1);
            }

            .ttt-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .ttt-title {
                font-size: 2rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #e94560 0%, #0099ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .ttt-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .ttt-scoreboard {
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: rgba(255,255,255,0.08);
                border-radius: 15px;
                padding: 1rem;
                margin-bottom: 1.25rem;
            }

            .ttt-score {
                text-align: center;
                min-width: 70px;
            }

            .ttt-score-symbol {
                font-size: 1.8rem;
                font-weight: 700;
                margin-bottom: 0.25rem;
            }

            .ttt-score-symbol.x {
                color: #e94560;
                text-shadow: 0 0 20px rgba(233,69,96,0.5);
            }

            .ttt-score-symbol.o {
                color: #0099ff;
                text-shadow: 0 0 20px rgba(0,153,255,0.5);
            }

            .ttt-score-value {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .ttt-score-label {
                font-size: 0.75rem;
                opacity: 0.7;
                margin-top: 0.25rem;
            }

            .ttt-score-divider {
                text-align: center;
                opacity: 0.5;
            }

            .ttt-score-divider-label {
                font-size: 0.7rem;
                margin-bottom: 0.25rem;
            }

            .ttt-turn-indicator {
                text-align: center;
                padding: 0.875rem;
                border-radius: 12px;
                margin-bottom: 1.25rem;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .ttt-turn-indicator.x {
                background: linear-gradient(135deg, rgba(233,69,96,0.3) 0%, rgba(233,69,96,0.1) 100%);
                border: 2px solid rgba(233,69,96,0.5);
                color: #e94560;
            }

            .ttt-turn-indicator.o {
                background: linear-gradient(135deg, rgba(0,153,255,0.3) 0%, rgba(0,153,255,0.1) 100%);
                border: 2px solid rgba(0,153,255,0.5);
                color: #0099ff;
            }

            .ttt-turn-indicator.winner {
                animation: winnerPulse 0.6s ease-in-out infinite;
            }

            .ttt-turn-indicator.draw {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
            }

            @keyframes winnerPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            .ttt-board {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                max-width: 320px;
                margin: 0 auto 1.5rem auto;
            }

            .ttt-cell {
                aspect-ratio: 1;
                background: linear-gradient(145deg, #252547 0%, #1a1a35 100%);
                border: 3px solid #3a3a5c;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3.5rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .ttt-cell:hover:not(.disabled) {
                background: linear-gradient(145deg, #353567 0%, #2a2a50 100%);
                transform: scale(1.03);
                border-color: #5a5a8c;
            }

            .ttt-cell.disabled {
                cursor: default;
            }

            .ttt-cell.x {
                color: #e94560;
                text-shadow: 0 0 30px rgba(233,69,96,0.6);
                animation: placeSymbol 0.3s ease-out;
            }

            .ttt-cell.o {
                color: #0099ff;
                text-shadow: 0 0 30px rgba(0,153,255,0.6);
                animation: placeSymbol 0.3s ease-out;
            }

            .ttt-cell.winning {
                animation: winningCell 0.5s ease-in-out infinite;
            }

            @keyframes placeSymbol {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }

            @keyframes winningCell {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 20px rgba(255,255,255,0.3);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 40px rgba(255,255,255,0.5);
                }
            }

            .ttt-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .ttt-btn {
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

            .ttt-btn:active {
                transform: scale(0.97);
            }

            .ttt-btn-primary {
                background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(233,69,96,0.4);
            }

            .ttt-btn-primary:hover {
                box-shadow: 0 6px 20px rgba(233,69,96,0.5);
                transform: translateY(-2px);
            }

            .ttt-btn-secondary {
                background: rgba(255,255,255,0.15);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .ttt-btn-secondary:hover {
                background: rgba(255,255,255,0.25);
            }

            .ttt-mode-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .ttt-mode-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 1.5rem 1rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .ttt-mode-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(233,69,96,0.5);
                transform: translateY(-3px);
            }

            .ttt-mode-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .ttt-mode-title {
                font-size: 1.1rem;
                font-weight: 600;
                display: block;
                margin-bottom: 0.25rem;
            }

            .ttt-mode-desc {
                font-size: 0.85rem;
                opacity: 0.7;
            }

            .ttt-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }

            .ttt-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .ttt-rules p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .ttt-confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 2px;
                animation: confettiFall 2.5s ease-out forwards;
                pointer-events: none;
            }

            @keyframes confettiFall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Winning combinations
    const WINNING_COMBOS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Game State
    let state = {
        mode: null, // 'pvp' or 'ai'
        board: Array(9).fill(null),
        currentPlayer: 'X',
        gameOver: false,
        winner: null,
        winningCombo: null,
        scores: { X: 0, O: 0, draws: 0 },
        playerNames: ['Player 1', 'Player 2']
    };

    function launchTicTacToe() {
        state = {
            mode: null,
            board: Array(9).fill(null),
            currentPlayer: 'X',
            gameOver: false,
            winner: null,
            winningCombo: null,
            scores: { X: 0, O: 0, draws: 0 },
            playerNames: ['Player 1', 'Player 2']
        };

        if (typeof hideAllMenus === 'function') hideAllMenus();
        document.getElementById('tictactoeGame').style.display = 'block';
        showSetup();
    }

    function exitTicTacToe() {
        document.getElementById('tictactoeGame').style.display = 'none';
        document.getElementById('strategyMenu').style.display = 'block';
    }

    function showSetup() {
        const content = document.getElementById('tictactoeContent');
        content.innerHTML = `
            <div class="ttt-container">
                <div class="ttt-card">
                    <button class="ttt-back-btn" onclick="exitTicTacToe()">← Back</button>
                    <div class="ttt-header">
                        <h1 class="ttt-title">Tic Tac Toe</h1>
                        <p class="ttt-subtitle">Classic strategy for two</p>
                    </div>

                    <div class="ttt-rules">
                        <h4>How to Play</h4>
                        <p>Take turns placing X's and O's. First to get 3 in a row wins!</p>
                    </div>

                    <h3 style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;">Choose Mode</h3>

                    <div class="ttt-mode-grid">
                        <button class="ttt-mode-btn" onclick="window.tictactoe.start('pvp')">
                            <span class="ttt-mode-icon">👥</span>
                            <span class="ttt-mode-title">Pass & Play</span>
                            <span class="ttt-mode-desc">2 Players</span>
                        </button>
                        <button class="ttt-mode-btn" onclick="window.tictactoe.start('ai')">
                            <span class="ttt-mode-icon">🤖</span>
                            <span class="ttt-mode-title">vs Computer</span>
                            <span class="ttt-mode-desc">Single Player</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function startGame(mode) {
        state.mode = mode;
        showNameEntry();
    }

    function showNameEntry() {
        const content = document.getElementById('tictactoeContent');
        const isAI = state.mode === 'ai';

        content.innerHTML = `
            <div class="ttt-container">
                <div class="ttt-card">
                    <button class="ttt-back-btn" onclick="window.tictactoe.showSetup()">← Back</button>
                    <div class="ttt-header">
                        <h1 class="ttt-title">Tic Tac Toe</h1>
                        <p class="ttt-subtitle">${isAI ? 'Enter your name' : 'Enter player names'}</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 1rem; margin: 1.5rem 0;">
                        <div>
                            <label style="display: flex; align-items: center; gap: 0.5rem; color: #e94560; font-weight: bold; margin-bottom: 0.5rem;">
                                <span class="ttt-score-symbol x" style="width: 24px; height: 24px; font-size: 1rem;">X</span>
                                ${isAI ? 'Your Name' : 'Player 1 (X)'}
                            </label>
                            <input type="text" id="tttPlayer1Name" class="ttt-input" placeholder="Enter name" value="${state.playerNames[0] === 'Player 1' ? '' : state.playerNames[0]}">
                        </div>
                        ${!isAI ? `
                        <div>
                            <label style="display: flex; align-items: center; gap: 0.5rem; color: #0099ff; font-weight: bold; margin-bottom: 0.5rem;">
                                <span class="ttt-score-symbol o" style="width: 24px; height: 24px; font-size: 1rem;">O</span>
                                Player 2 (O)
                            </label>
                            <input type="text" id="tttPlayer2Name" class="ttt-input" placeholder="Enter name" value="${state.playerNames[1] === 'Player 2' ? '' : state.playerNames[1]}">
                        </div>
                        ` : ''}
                    </div>

                    <div class="ttt-buttons">
                        <button class="ttt-btn ttt-btn-primary" onclick="window.tictactoe.startWithNames()">Start Game</button>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => document.getElementById('tttPlayer1Name')?.focus(), 100);
    }

    function startWithNames() {
        const player1Input = document.getElementById('tttPlayer1Name')?.value.trim();
        const player2Input = state.mode === 'ai' ? 'Computer' : document.getElementById('tttPlayer2Name')?.value.trim();

        state.playerNames[0] = player1Input || 'Player 1';
        state.playerNames[1] = player2Input || 'Player 2';

        state.board = Array(9).fill(null);
        state.currentPlayer = 'X';
        state.gameOver = false;
        state.winner = null;
        state.winningCombo = null;
        showBoard();
    }

    function showBoard() {
        const content = document.getElementById('tictactoeContent');
        const isAI = state.mode === 'ai';

        let turnText = '';
        let turnClass = state.currentPlayer.toLowerCase();

        if (state.gameOver) {
            if (state.winner === 'draw') {
                turnText = "It's a Draw!";
                turnClass = 'draw';
            } else {
                const winnerName = state.winner === 'X' ? state.playerNames[0] : state.playerNames[1];
                turnText = `🎉 ${winnerName} Wins! 🎉`;
                turnClass += ' winner';
            }
        } else {
            const currentName = state.currentPlayer === 'X' ? state.playerNames[0] : state.playerNames[1];
            turnText = `${currentName}'s Turn (${state.currentPlayer})`;
        }

        content.innerHTML = `
            <div class="ttt-container">
                <div class="ttt-card" style="position: relative; overflow: hidden;">
                    <button class="ttt-back-btn" onclick="exitTicTacToe()">← Back</button>
                    <div class="ttt-scoreboard">
                        <div class="ttt-score">
                            <div class="ttt-score-symbol x">X</div>
                            <div class="ttt-score-value">${state.scores.X}</div>
                            <div class="ttt-score-label">${state.playerNames[0]}</div>
                        </div>
                        <div class="ttt-score-divider">
                            <div class="ttt-score-divider-label">Draws</div>
                            <div class="ttt-score-value" style="font-size: 1.2rem; opacity: 0.6;">${state.scores.draws}</div>
                        </div>
                        <div class="ttt-score">
                            <div class="ttt-score-symbol o">O</div>
                            <div class="ttt-score-value">${state.scores.O}</div>
                            <div class="ttt-score-label">${state.playerNames[1]}</div>
                        </div>
                    </div>

                    <div class="ttt-turn-indicator ${turnClass}">
                        ${turnText}
                    </div>

                    <div class="ttt-board">
                        ${renderCells()}
                    </div>

                    <div class="ttt-buttons">
                        <button class="ttt-btn ttt-btn-primary" onclick="window.tictactoe.newGame()">↺ New Game</button>
                    </div>
                </div>
            </div>
        `;

        // Confetti on win
        if (state.gameOver && state.winner && state.winner !== 'draw') {
            setTimeout(createConfetti, 100);
        }
    }

    function renderCells() {
        let html = '';
        for (let i = 0; i < 9; i++) {
            const cell = state.board[i];
            const isWinning = state.winningCombo && state.winningCombo.includes(i);
            const disabled = state.gameOver || cell !== null;

            let cellClass = 'ttt-cell';
            if (cell) cellClass += ` ${cell.toLowerCase()}`;
            if (isWinning) cellClass += ' winning';
            if (disabled) cellClass += ' disabled';

            html += `
                <div class="${cellClass}"
                     ${!disabled ? `onclick="window.tictactoe.move(${i})"` : ''}>
                    ${cell || ''}
                </div>
            `;
        }
        return html;
    }

    function makeMove(index) {
        if (state.gameOver || state.board[index] !== null) return;

        // Prevent moves during AI turn
        if (state.mode === 'ai' && state.currentPlayer === 'O') return;

        state.board[index] = state.currentPlayer;

        const result = checkWinner();
        if (result) {
            state.gameOver = true;
            state.winner = result.winner;
            state.winningCombo = result.combo;
            if (result.winner !== 'draw') {
                state.scores[result.winner]++;
            } else {
                state.scores.draws++;
            }
            showBoard();
        } else {
            state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
            showBoard();

            // AI move
            if (state.mode === 'ai' && state.currentPlayer === 'O') {
                setTimeout(makeAIMove, 600);
            }
        }
    }

    function checkWinner() {
        for (const combo of WINNING_COMBOS) {
            const [a, b, c] = combo;
            if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
                return { winner: state.board[a], combo };
            }
        }
        if (state.board.every(cell => cell !== null)) {
            return { winner: 'draw', combo: null };
        }
        return null;
    }

    function makeAIMove() {
        if (state.gameOver) return;

        // AI Strategy: Win > Block > Center > Corner > Any
        let move = findWinningMove('O') ||
                   findWinningMove('X') ||
                   (state.board[4] === null ? 4 : null) ||
                   findCorner() ||
                   findAny();

        if (move !== null) {
            state.board[move] = 'O';

            const result = checkWinner();
            if (result) {
                state.gameOver = true;
                state.winner = result.winner;
                state.winningCombo = result.combo;
                if (result.winner !== 'draw') {
                    state.scores[result.winner]++;
                } else {
                    state.scores.draws++;
                }
            } else {
                state.currentPlayer = 'X';
            }
            showBoard();
        }
    }

    function findWinningMove(player) {
        for (const combo of WINNING_COMBOS) {
            const [a, b, c] = combo;
            const cells = [state.board[a], state.board[b], state.board[c]];
            const playerCount = cells.filter(c => c === player).length;
            const emptyCount = cells.filter(c => c === null).length;

            if (playerCount === 2 && emptyCount === 1) {
                if (state.board[a] === null) return a;
                if (state.board[b] === null) return b;
                if (state.board[c] === null) return c;
            }
        }
        return null;
    }

    function findCorner() {
        const corners = [0, 2, 6, 8].filter(i => state.board[i] === null);
        return corners.length > 0 ? corners[Math.floor(Math.random() * corners.length)] : null;
    }

    function findAny() {
        for (let i = 0; i < 9; i++) {
            if (state.board[i] === null) return i;
        }
        return null;
    }

    function newGame() {
        state.board = Array(9).fill(null);
        state.currentPlayer = 'X';
        state.gameOver = false;
        state.winner = null;
        state.winningCombo = null;
        showBoard();
    }

    function createConfetti() {
        const container = document.querySelector('.ttt-card');
        if (!container) return;

        const colors = ['#e94560', '#0099ff', '#4ecdc4', '#a855f7', '#22c55e', '#ffbd69'];

        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'ttt-confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Expose functions
    window.launchTicTacToe = launchTicTacToe;
    window.exitTicTacToe = exitTicTacToe;
    window.tictactoe = {
        start: startGame,
        move: makeMove,
        newGame: newGame,
        showSetup: showSetup,
        startWithNames: startWithNames
    };

})();

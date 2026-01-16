// Dots and Boxes Game - Modern dark theme overhaul
(function() {
    'use strict';

    // Game state
    const dotsState = {
        gridSize: 6, // 6x6 dots creates 5x5 boxes
        currentPlayer: 0, // 0 = Player 1 (Cyan), 1 = Player 2/AI (Pink)
        scores: [0, 0],
        horizontalLines: [], // [row][col] - line below dot
        verticalLines: [],   // [row][col] - line to right of dot
        boxes: [],           // [row][col] - which player captured this box (or null)
        gameMode: null,      // 'pass-and-play' or 'vs-ai'
        gameOver: false
    };

    const COLORS = ['#22d3ee', '#f472b6']; // Cyan, Pink
    const GLOW_COLORS = ['rgba(34, 211, 238, 0.6)', 'rgba(244, 114, 182, 0.6)'];
    let playerNames = ['Player 1', 'Player 2'];

    // Initialize game state
    function initGame() {
        dotsState.horizontalLines = [];
        dotsState.verticalLines = [];
        dotsState.boxes = [];

        for (let i = 0; i < dotsState.gridSize; i++) {
            dotsState.horizontalLines[i] = [];
            dotsState.verticalLines[i] = [];
            dotsState.boxes[i] = [];
            for (let j = 0; j < dotsState.gridSize; j++) {
                dotsState.horizontalLines[i][j] = false;
                dotsState.verticalLines[i][j] = false;
                dotsState.boxes[i][j] = null;
            }
        }

        dotsState.currentPlayer = 0;
        dotsState.scores = [0, 0];
        dotsState.gameOver = false;
    }

    // Launch game and show mode selection
    window.launchDotsAndBoxes = function() {
        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById('plateTracker').style.display = 'none';
        if (typeof hideAllMenus === 'function') hideAllMenus();
        document.getElementById('dotsAndBoxesGame').style.display = 'block';

        const app = document.getElementById('dotsAndBoxesContent');
        app.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); min-height: 100%; padding: 1rem; border-radius: 12px; position: relative;">
                <button onclick="showGamesMenu()" style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(75, 85, 99, 0.8); color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; z-index: 10;">← Back</button>

                <div style="text-align: center; padding-top: 2rem; max-width: 400px; margin: 0 auto;">
                    <h1 style="font-size: 2rem; color: #22d3ee; text-shadow: 0 0 20px rgba(34, 211, 238, 0.5); margin: 0 0 0.5rem 0;">📦 Dots & Boxes</h1>
                    <p style="color: #888; margin-bottom: 2rem;">Choose your game mode</p>

                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button onclick="startDotsAndBoxes('pass-and-play')" style="background: linear-gradient(145deg, #667eea, #764ba2); color: white; border: none; padding: 1.2rem 1.5rem; border-radius: 12px; cursor: pointer; font-size: 1rem; font-weight: bold; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3); transition: all 0.2s ease;">
                            <span style="font-size: 2rem;">👥</span>
                            <div style="text-align: left;">
                                <div style="font-size: 1.1rem;">Pass and Play</div>
                                <div style="font-size: 0.8rem; opacity: 0.9; font-weight: normal;">Take turns on same device</div>
                            </div>
                        </button>

                        <button onclick="startDotsAndBoxes('vs-ai')" style="background: linear-gradient(145deg, #f093fb, #f5576c); color: white; border: none; padding: 1.2rem 1.5rem; border-radius: 12px; cursor: pointer; font-size: 1rem; font-weight: bold; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 20px rgba(245, 87, 108, 0.3); transition: all 0.2s ease;">
                            <span style="font-size: 2rem;">🤖</span>
                            <div style="text-align: left;">
                                <div style="font-size: 1.1rem;">vs Computer</div>
                                <div style="font-size: 0.8rem; opacity: 0.9; font-weight: normal;">Play against AI opponent</div>
                            </div>
                        </button>
                    </div>

                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #22d3ee;">How to Play:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; color: #9ca3af; font-size: 0.85rem; line-height: 1.6;">
                            <li>Take turns drawing lines between dots</li>
                            <li>Complete a box to capture it and score a point</li>
                            <li>When you complete a box, you get another turn!</li>
                            <li>Player with the most boxes wins</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    };

    // Start game with selected mode - show name entry first
    window.startDotsAndBoxes = function(mode) {
        dotsState.gameMode = mode;
        showNameEntry();
    };

    // Show name entry screen
    function showNameEntry() {
        const app = document.getElementById('dotsAndBoxesContent');
        const isAI = dotsState.gameMode === 'vs-ai';

        app.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); min-height: 100%; padding: 1rem; border-radius: 12px; position: relative;">
                <button onclick="launchDotsAndBoxes()" style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(75, 85, 99, 0.8); color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; z-index: 10;">← Back</button>

                <div style="text-align: center; padding-top: 2rem; max-width: 400px; margin: 0 auto;">
                    <h1 style="font-size: 1.8rem; color: #22d3ee; text-shadow: 0 0 20px rgba(34, 211, 238, 0.5); margin: 0 0 0.5rem 0;">📦 Dots & Boxes</h1>
                    <p style="color: #888; margin-bottom: 2rem;">${isAI ? 'Enter your name' : 'Enter player names'}</p>

                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="text-align: left;">
                            <label style="display: block; color: ${COLORS[0]}; font-weight: bold; margin-bottom: 0.5rem; font-size: 0.9rem;">Player 1 (Cyan)</label>
                            <input type="text" id="dotsPlayer1Name" placeholder="Enter name" value="${playerNames[0] === 'Player 1' ? '' : playerNames[0]}" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid ${COLORS[0]}; background: rgba(34, 211, 238, 0.1); color: white; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        ${!isAI ? `
                        <div style="text-align: left;">
                            <label style="display: block; color: ${COLORS[1]}; font-weight: bold; margin-bottom: 0.5rem; font-size: 0.9rem;">Player 2 (Pink)</label>
                            <input type="text" id="dotsPlayer2Name" placeholder="Enter name" value="${playerNames[1] === 'Player 2' ? '' : playerNames[1]}" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 2px solid ${COLORS[1]}; background: rgba(244, 114, 182, 0.1); color: white; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        ` : ''}
                    </div>

                    <button onclick="startDotsGame()" style="background: linear-gradient(145deg, #3b82f6, #2563eb); color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-size: 1rem; font-weight: bold; width: 100%;">Start Game</button>
                </div>
            </div>
        `;

        setTimeout(() => document.getElementById('dotsPlayer1Name')?.focus(), 100);
    }

    // Start the actual game after name entry
    window.startDotsGame = function() {
        const player1Input = document.getElementById('dotsPlayer1Name')?.value.trim();
        const player2Input = dotsState.gameMode === 'vs-ai' ? 'Computer' : document.getElementById('dotsPlayer2Name')?.value.trim();

        playerNames[0] = player1Input || 'Player 1';
        playerNames[1] = player2Input || 'Player 2';

        initGame();
        renderGame();
    };

    // Render the game board
    function renderGame() {
        const app = document.getElementById('dotsAndBoxesContent');
        const boxesTotal = (dotsState.gridSize - 1) * (dotsState.gridSize - 1);

        let playerIndicator = '';
        if (!dotsState.gameOver) {
            const currentName = dotsState.gameMode === 'vs-ai' && dotsState.currentPlayer === 1
                ? 'Computer'
                : playerNames[dotsState.currentPlayer];
            const indicatorColor = COLORS[dotsState.currentPlayer];
            const glowColor = GLOW_COLORS[dotsState.currentPlayer];
            playerIndicator = `
                <div style="text-align: center; padding: 0.75rem; background: ${indicatorColor}22; color: ${indicatorColor}; border: 2px solid ${indicatorColor}; border-radius: 10px; margin-bottom: 1rem; font-size: 1.1rem; font-weight: bold; box-shadow: 0 0 15px ${glowColor};">
                    ${currentName}'s Turn
                </div>
            `;
        }

        app.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); min-height: 100%; padding: 1rem; border-radius: 12px; position: relative;">
                <button onclick="launchDotsAndBoxes()" style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(75, 85, 99, 0.8); color: white; border: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; z-index: 10;">← Back</button>

                <div style="max-width: 400px; margin: 0 auto; padding-top: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="margin: 0; font-size: 1.3rem; color: #22d3ee; text-shadow: 0 0 15px rgba(34, 211, 238, 0.5);">📦 Dots & Boxes</h2>
                        <button onclick="startDotsAndBoxes('${dotsState.gameMode}')" style="background: linear-gradient(145deg, #3b82f6, #2563eb); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">New Game</button>
                    </div>

                    <!-- Score Display -->
                    <div style="display: flex; justify-content: space-around; margin-bottom: 1rem; gap: 0.5rem;">
                        <div style="background: ${COLORS[0]}22; border: 2px solid ${COLORS[0]}; color: white; padding: 0.75rem 1.5rem; border-radius: 10px; flex: 1; text-align: center; box-shadow: 0 0 15px ${GLOW_COLORS[0]};">
                            <div style="font-size: 0.8rem; color: ${COLORS[0]};">${playerNames[0]}</div>
                            <div style="font-size: 2rem; font-weight: bold; color: ${COLORS[0]};">${dotsState.scores[0]}</div>
                        </div>
                        <div style="background: ${COLORS[1]}22; border: 2px solid ${COLORS[1]}; color: white; padding: 0.75rem 1.5rem; border-radius: 10px; flex: 1; text-align: center; box-shadow: 0 0 15px ${GLOW_COLORS[1]};">
                            <div style="font-size: 0.8rem; color: ${COLORS[1]};">${dotsState.gameMode === 'vs-ai' ? 'Computer' : playerNames[1]}</div>
                            <div style="font-size: 2rem; font-weight: bold; color: ${COLORS[1]};">${dotsState.scores[1]}</div>
                        </div>
                    </div>

                    ${playerIndicator}

                    <!-- Game Board -->
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; border: 2px solid rgba(255,255,255,0.1); display: flex; justify-content: center;">
                        ${renderBoard()}
                    </div>

                    ${dotsState.gameOver ? `
                        <div style="text-align: center; padding: 1.5rem; background: ${dotsState.scores[0] > dotsState.scores[1] ? COLORS[0] : dotsState.scores[1] > dotsState.scores[0] ? COLORS[1] : '#6b7280'}22; border: 2px solid ${dotsState.scores[0] > dotsState.scores[1] ? COLORS[0] : dotsState.scores[1] > dotsState.scores[0] ? COLORS[1] : '#6b7280'}; color: white; border-radius: 12px; margin-top: 1rem; font-size: 1.2rem; font-weight: bold; box-shadow: 0 0 20px ${dotsState.scores[0] > dotsState.scores[1] ? GLOW_COLORS[0] : dotsState.scores[1] > dotsState.scores[0] ? GLOW_COLORS[1] : 'rgba(107, 114, 128, 0.5)'};">
                            ${dotsState.scores[0] > dotsState.scores[1] ? '🎉 ' + playerNames[0] + ' Wins!' : dotsState.scores[1] > dotsState.scores[0] ? (dotsState.gameMode === 'vs-ai' ? '🤖 Computer Wins!' : '🎉 ' + playerNames[1] + ' Wins!') : '🤝 It\'s a Tie!'}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // If it's AI's turn, make AI move after a delay
        if (!dotsState.gameOver && dotsState.gameMode === 'vs-ai' && dotsState.currentPlayer === 1) {
            setTimeout(makeAIMove, 500);
        }
    }

    // Render the board SVG
    function renderBoard() {
        const dotSize = 6;
        const spacing = 45;
        const padding = 15;
        const width = padding * 2 + (dotsState.gridSize - 1) * spacing;
        const height = padding * 2 + (dotsState.gridSize - 1) * spacing;

        let svg = `<svg width="${width}" height="${height}" style="display: block;">`;

        // Draw boxes (filled squares)
        for (let row = 0; row < dotsState.gridSize - 1; row++) {
            for (let col = 0; col < dotsState.gridSize - 1; col++) {
                if (dotsState.boxes[row][col] !== null) {
                    const x = padding + col * spacing;
                    const y = padding + row * spacing;
                    const player = dotsState.boxes[row][col];
                    svg += `<rect x="${x + dotSize/2}" y="${y + dotSize/2}" width="${spacing - dotSize}" height="${spacing - dotSize}" fill="${COLORS[player]}" opacity="0.3" rx="3"/>`;
                    svg += `<text x="${x + spacing/2}" y="${y + spacing/2 + 2}" text-anchor="middle" dominant-baseline="middle" font-size="18" font-weight="bold" fill="${COLORS[player]}">${player + 1}</text>`;
                }
            }
        }

        // Draw horizontal lines (below each dot)
        for (let row = 0; row < dotsState.gridSize; row++) {
            for (let col = 0; col < dotsState.gridSize - 1; col++) {
                const x1 = padding + col * spacing;
                const y1 = padding + row * spacing;
                const x2 = x1 + spacing;

                if (dotsState.horizontalLines[row][col]) {
                    svg += `<line x1="${x1 + dotSize/2}" y1="${y1}" x2="${x2 - dotSize/2}" y2="${y1}" stroke="#60a5fa" stroke-width="4" stroke-linecap="round"/>`;
                } else if (!dotsState.gameOver) {
                    svg += `<line x1="${x1 + dotSize/2}" y1="${y1}" x2="${x2 - dotSize/2}" y2="${y1}" stroke="rgba(255,255,255,0.15)" stroke-width="3" stroke-linecap="round"/>`;
                    svg += `<rect x="${x1 + dotSize/2}" y="${y1 - 8}" width="${spacing - dotSize}" height="16" fill="transparent" style="cursor: pointer;" onclick="drawLine('h', ${row}, ${col})"/>`;
                }
            }
        }

        // Draw vertical lines (to the right of each dot)
        for (let row = 0; row < dotsState.gridSize - 1; row++) {
            for (let col = 0; col < dotsState.gridSize; col++) {
                const x1 = padding + col * spacing;
                const y1 = padding + row * spacing;
                const y2 = y1 + spacing;

                if (dotsState.verticalLines[row][col]) {
                    svg += `<line x1="${x1}" y1="${y1 + dotSize/2}" x2="${x1}" y2="${y2 - dotSize/2}" stroke="#60a5fa" stroke-width="4" stroke-linecap="round"/>`;
                } else if (!dotsState.gameOver) {
                    svg += `<line x1="${x1}" y1="${y1 + dotSize/2}" x2="${x1}" y2="${y2 - dotSize/2}" stroke="rgba(255,255,255,0.15)" stroke-width="3" stroke-linecap="round"/>`;
                    svg += `<rect x="${x1 - 8}" y="${y1 + dotSize/2}" width="16" height="${spacing - dotSize}" fill="transparent" style="cursor: pointer;" onclick="drawLine('v', ${row}, ${col})"/>`;
                }
            }
        }

        // Draw dots
        for (let row = 0; row < dotsState.gridSize; row++) {
            for (let col = 0; col < dotsState.gridSize; col++) {
                const x = padding + col * spacing;
                const y = padding + row * spacing;
                svg += `<circle cx="${x}" cy="${y}" r="${dotSize}" fill="#60a5fa"/>`;
            }
        }

        svg += '</svg>';
        return svg;
    }

    // Draw a line
    window.drawLine = function(type, row, col) {
        if (dotsState.gameOver) return;

        // Check if line already exists
        if (type === 'h' && dotsState.horizontalLines[row][col]) return;
        if (type === 'v' && dotsState.verticalLines[row][col]) return;

        // Draw the line
        if (type === 'h') {
            dotsState.horizontalLines[row][col] = true;
        } else {
            dotsState.verticalLines[row][col] = true;
        }

        // Check if any boxes were completed
        const completedBoxes = checkCompletedBoxes(type, row, col);

        if (completedBoxes > 0) {
            dotsState.scores[dotsState.currentPlayer] += completedBoxes;
        } else {
            dotsState.currentPlayer = 1 - dotsState.currentPlayer;
        }

        // Check if game is over
        const totalBoxes = (dotsState.gridSize - 1) * (dotsState.gridSize - 1);
        if (dotsState.scores[0] + dotsState.scores[1] === totalBoxes) {
            dotsState.gameOver = true;
        }

        renderGame();
    };

    // Check if drawing a line completed any boxes
    function checkCompletedBoxes(type, row, col) {
        let completedCount = 0;

        if (type === 'h') {
            if (row > 0 && isBoxComplete(row - 1, col)) {
                dotsState.boxes[row - 1][col] = dotsState.currentPlayer;
                completedCount++;
            }
            if (row < dotsState.gridSize - 1 && isBoxComplete(row, col)) {
                dotsState.boxes[row][col] = dotsState.currentPlayer;
                completedCount++;
            }
        } else {
            if (col > 0 && isBoxComplete(row, col - 1)) {
                dotsState.boxes[row][col - 1] = dotsState.currentPlayer;
                completedCount++;
            }
            if (col < dotsState.gridSize - 1 && isBoxComplete(row, col)) {
                dotsState.boxes[row][col] = dotsState.currentPlayer;
                completedCount++;
            }
        }

        return completedCount;
    }

    // Check if a specific box is complete
    function isBoxComplete(row, col) {
        if (dotsState.boxes[row][col] !== null) return false;

        return dotsState.horizontalLines[row][col] &&
               dotsState.horizontalLines[row + 1][col] &&
               dotsState.verticalLines[row][col] &&
               dotsState.verticalLines[row][col + 1];
    }

    // AI Move
    function makeAIMove() {
        if (dotsState.gameOver) return;

        let move = findBoxCompletingMove();
        if (!move) {
            move = findSafeMove();
        }
        if (!move) {
            move = findRandomMove();
        }

        if (move) {
            drawLine(move.type, move.row, move.col);
        }
    }

    // Find a move that completes a box
    function findBoxCompletingMove() {
        for (let row = 0; row < dotsState.gridSize; row++) {
            for (let col = 0; col < dotsState.gridSize - 1; col++) {
                if (!dotsState.horizontalLines[row][col]) {
                    dotsState.horizontalLines[row][col] = true;
                    const boxes = countPotentialBoxes('h', row, col);
                    dotsState.horizontalLines[row][col] = false;
                    if (boxes > 0) return { type: 'h', row, col };
                }
            }
        }

        for (let row = 0; row < dotsState.gridSize - 1; row++) {
            for (let col = 0; col < dotsState.gridSize; col++) {
                if (!dotsState.verticalLines[row][col]) {
                    dotsState.verticalLines[row][col] = true;
                    const boxes = countPotentialBoxes('v', row, col);
                    dotsState.verticalLines[row][col] = false;
                    if (boxes > 0) return { type: 'v', row, col };
                }
            }
        }

        return null;
    }

    function countPotentialBoxes(type, row, col) {
        let count = 0;
        if (type === 'h') {
            if (row > 0 && isBoxComplete(row - 1, col)) count++;
            if (row < dotsState.gridSize - 1 && isBoxComplete(row, col)) count++;
        } else {
            if (col > 0 && isBoxComplete(row, col - 1)) count++;
            if (col < dotsState.gridSize - 1 && isBoxComplete(row, col)) count++;
        }
        return count;
    }

    // Find a move that doesn't create an opportunity for opponent
    function findSafeMove() {
        const safeMoves = [];

        for (let row = 0; row < dotsState.gridSize; row++) {
            for (let col = 0; col < dotsState.gridSize - 1; col++) {
                if (!dotsState.horizontalLines[row][col] && !wouldCreateOpportunity('h', row, col)) {
                    safeMoves.push({ type: 'h', row, col });
                }
            }
        }

        for (let row = 0; row < dotsState.gridSize - 1; row++) {
            for (let col = 0; col < dotsState.gridSize; col++) {
                if (!dotsState.verticalLines[row][col] && !wouldCreateOpportunity('v', row, col)) {
                    safeMoves.push({ type: 'v', row, col });
                }
            }
        }

        if (safeMoves.length > 0) {
            return safeMoves[Math.floor(Math.random() * safeMoves.length)];
        }
        return null;
    }

    function wouldCreateOpportunity(type, row, col) {
        if (type === 'h') {
            if (row > 0 && dotsState.boxes[row - 1][col] === null && countBoxSides(row - 1, col) === 2) return true;
            if (row < dotsState.gridSize - 1 && dotsState.boxes[row][col] === null && countBoxSides(row, col) === 2) return true;
        } else {
            if (col > 0 && dotsState.boxes[row][col - 1] === null && countBoxSides(row, col - 1) === 2) return true;
            if (col < dotsState.gridSize - 1 && dotsState.boxes[row][col] === null && countBoxSides(row, col) === 2) return true;
        }
        return false;
    }

    function countBoxSides(row, col) {
        let count = 0;
        if (dotsState.horizontalLines[row][col]) count++;
        if (dotsState.horizontalLines[row + 1][col]) count++;
        if (dotsState.verticalLines[row][col]) count++;
        if (dotsState.verticalLines[row][col + 1]) count++;
        return count;
    }

    function findRandomMove() {
        const moves = [];

        for (let row = 0; row < dotsState.gridSize; row++) {
            for (let col = 0; col < dotsState.gridSize - 1; col++) {
                if (!dotsState.horizontalLines[row][col]) {
                    moves.push({ type: 'h', row, col });
                }
            }
        }

        for (let row = 0; row < dotsState.gridSize - 1; row++) {
            for (let col = 0; col < dotsState.gridSize; col++) {
                if (!dotsState.verticalLines[row][col]) {
                    moves.push({ type: 'v', row, col });
                }
            }
        }

        if (moves.length > 0) {
            return moves[Math.floor(Math.random() * moves.length)];
        }
        return null;
    }

})();

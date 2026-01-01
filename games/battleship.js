// Battleship Game - Overhauled Edition
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'battleship-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .bs-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 0.75rem;
            }

            .bs-card {
                background: linear-gradient(145deg, #0c1929 0%, #1a3a5c 100%);
                border-radius: 20px;
                padding: 1.25rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
            }

            .bs-header {
                text-align: center;
                margin-bottom: 1.25rem;
            }

            .bs-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .bs-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .bs-phase-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 0.875rem;
                background: linear-gradient(135deg, rgba(0,217,255,0.2) 0%, rgba(0,153,204,0.1) 100%);
                border: 2px solid rgba(0,217,255,0.4);
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .bs-phase-indicator.attack {
                background: linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(255,107,107,0.1) 100%);
                border-color: rgba(255,107,107,0.4);
            }

            .bs-phase-text {
                font-size: 1.1rem;
                font-weight: 600;
            }

            .bs-grid-wrapper {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }

            .bs-grid-section {
                width: 100%;
            }

            .bs-grid-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .bs-grid-label.attack {
                color: #ff6b6b;
            }

            .bs-grid-label.defense {
                color: #00d9ff;
            }

            .bs-grid-container {
                background: linear-gradient(180deg, #0a2a4a 0%, #0d3d6b 100%);
                border-radius: 10px;
                padding: 6px;
                box-shadow: inset 0 2px 10px rgba(0,0,0,0.4);
                max-width: 100%;
                overflow-x: auto;
            }

            .bs-grid {
                display: grid;
                gap: 2px;
                width: fit-content;
                max-width: 100%;
            }

            .bs-grid-header {
                display: contents;
            }

            .bs-header-cell {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.65rem;
                color: rgba(255,255,255,0.6);
            }

            .bs-cell {
                aspect-ratio: 1;
                background: linear-gradient(145deg, #1a4a7a 0%, #0d3d6b 100%);
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.15s ease;
                position: relative;
                overflow: hidden;
            }

            .bs-cell:hover:not(.disabled) {
                background: linear-gradient(145deg, #2a6a9a 0%, #1a5a8a 100%);
                transform: scale(1.05);
            }

            .bs-cell.disabled {
                cursor: default;
            }

            .bs-cell.ship {
                background: linear-gradient(145deg, #2d5a87 0%, #1a4a7a 100%);
                box-shadow: inset 0 0 10px rgba(0,217,255,0.3);
            }

            .bs-cell.hit {
                background: linear-gradient(145deg, #ff4757 0%, #c0392b 100%);
                animation: hitPulse 0.5s ease-out;
            }

            .bs-cell.miss {
                background: linear-gradient(145deg, #3498db 0%, #2980b9 100%);
            }

            .bs-cell.sunk {
                background: linear-gradient(145deg, #7f1d1d 0%, #450a0a 100%);
            }

            .bs-cell-content {
                font-size: clamp(0.6rem, 2vw, 0.9rem);
            }

            @keyframes hitPulse {
                0% { transform: scale(1.2); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }

            @keyframes splash {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }

            .bs-ship-info {
                background: rgba(255,255,255,0.08);
                border-radius: 10px;
                padding: 0.875rem;
                margin-bottom: 1rem;
            }

            .bs-ship-name {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .bs-ship-preview {
                display: flex;
                gap: 4px;
                margin-bottom: 0.75rem;
            }

            .bs-ship-cell {
                width: 28px;
                height: 28px;
                background: linear-gradient(145deg, #00d9ff 0%, #0099cc 100%);
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,217,255,0.3);
            }

            .bs-controls {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .bs-btn {
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

            .bs-btn:active {
                transform: scale(0.97);
            }

            .bs-btn-primary {
                background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
                color: #0c1929;
                box-shadow: 0 4px 15px rgba(0,217,255,0.3);
            }

            .bs-btn-primary:hover {
                box-shadow: 0 6px 20px rgba(0,217,255,0.4);
                transform: translateY(-2px);
            }

            .bs-btn-secondary {
                background: rgba(255,255,255,0.15);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .bs-btn-secondary:hover {
                background: rgba(255,255,255,0.25);
            }

            .bs-btn-danger {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
                color: white;
            }

            .bs-btn-small {
                padding: 0.5rem 0.875rem;
                font-size: 0.85rem;
            }

            .bs-buttons {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.25rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .bs-mode-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.25rem;
            }

            .bs-mode-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 1.25rem 1rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .bs-mode-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(0,217,255,0.5);
                transform: translateY(-3px);
            }

            .bs-mode-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .bs-mode-title {
                font-size: 1.1rem;
                font-weight: 600;
                display: block;
                margin-bottom: 0.25rem;
            }

            .bs-mode-desc {
                font-size: 0.85rem;
                opacity: 0.7;
            }

            .bs-input-group {
                margin-bottom: 1rem;
            }

            .bs-label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .bs-input {
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

            .bs-input:focus {
                outline: none;
                border-color: #00d9ff;
                background: rgba(255,255,255,0.15);
            }

            .bs-input::placeholder {
                color: rgba(255,255,255,0.4);
            }

            .bs-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.25rem;
            }

            .bs-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .bs-rules p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .bs-pass-screen {
                text-align: center;
                padding: 2rem;
            }

            .bs-pass-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: bounce 1s ease infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            .bs-pass-title {
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
            }

            .bs-pass-subtitle {
                font-size: 1.1rem;
                opacity: 0.8;
                margin-bottom: 1.5rem;
            }

            .bs-winner-banner {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(0,217,255,0.2) 0%, rgba(0,153,204,0.1) 100%);
                border-radius: 15px;
                margin-bottom: 1.25rem;
                animation: celebrateIn 0.5s ease-out;
            }

            .bs-winner-title {
                font-size: 2.5rem;
                margin: 0 0 0.5rem 0;
            }

            .bs-winner-name {
                font-size: 1.4rem;
                font-weight: 600;
                margin: 0;
            }

            @keyframes celebrateIn {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }

            .bs-ships-status {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.75rem;
            }

            .bs-ship-status {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.25rem 0.5rem;
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
                font-size: 0.75rem;
            }

            .bs-ship-status.sunk {
                background: rgba(255,107,107,0.3);
                text-decoration: line-through;
                opacity: 0.6;
            }

            .bs-alert {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(145deg, #1a3a5c 0%, #0c1929 100%);
                border: 3px solid #00d9ff;
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                z-index: 1000;
                animation: alertIn 0.3s ease forwards;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }

            .bs-alert.hit {
                border-color: #ff6b6b;
            }

            .bs-alert.miss {
                border-color: #3498db;
            }

            @keyframes alertIn {
                0% { transform: translate(-50%, -50%) scale(0); }
                70% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }

            .bs-alert-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }

            .bs-alert-text {
                font-size: 1.3rem;
                font-weight: 600;
            }

            .bs-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 999;
            }
        `;
        document.head.appendChild(style);
    }

    // Game State
    let state = {
        phase: 'setup',
        currentPlayer: 1,
        player1Name: '',
        player2Name: '',
        isAI: false,
        player1: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
        player2: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
        shipTypes: [
            { name: 'Carrier', size: 5, icon: '🚢' },
            { name: 'Battleship', size: 4, icon: '⛴️' },
            { name: 'Cruiser', size: 3, icon: '🛥️' },
            { name: 'Submarine', size: 3, icon: '🤿' },
            { name: 'Destroyer', size: 2, icon: '🚤' }
        ],
        currentShipIndex: 0,
        orientation: 'horizontal',
        aiState: null
    };

    function createEmptyGrid() {
        return Array(10).fill(null).map(() => Array(10).fill(null));
    }

    function resetState() {
        state = {
            phase: 'setup',
            currentPlayer: 1,
            player1Name: state.player1Name,
            player2Name: state.player2Name,
            isAI: state.isAI,
            player1: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
            player2: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
            shipTypes: state.shipTypes,
            currentShipIndex: 0,
            orientation: 'horizontal',
            aiState: null
        };
    }

    function launchBattleship() {
        state = {
            phase: 'setup',
            currentPlayer: 1,
            player1Name: '',
            player2Name: '',
            isAI: false,
            player1: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
            player2: { grid: createEmptyGrid(), ships: [], hits: [], misses: [] },
            shipTypes: [
                { name: 'Carrier', size: 5, icon: '🚢' },
                { name: 'Battleship', size: 4, icon: '⛴️' },
                { name: 'Cruiser', size: 3, icon: '🛥️' },
                { name: 'Submarine', size: 3, icon: '🤿' },
                { name: 'Destroyer', size: 2, icon: '🚤' }
            ],
            currentShipIndex: 0,
            orientation: 'horizontal',
            aiState: null
        };

        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('battleshipGame').style.display = 'block';
        showSetup();
    }

    function exitBattleship() {
        document.getElementById('battleshipGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    function showSetup() {
        const content = document.getElementById('battleshipContent');
        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-header">
                        <h1 class="bs-title">Battleship</h1>
                        <p class="bs-subtitle">Classic naval combat strategy</p>
                    </div>

                    <div class="bs-rules">
                        <h4>How to Play</h4>
                        <p>Place 5 ships on your grid, then take turns attacking the enemy. Hit all enemy ship cells to win!</p>
                    </div>

                    <h3 style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;">Choose Mode</h3>

                    <div class="bs-mode-grid">
                        <button class="bs-mode-btn" onclick="selectPassAndPlay()">
                            <span class="bs-mode-icon">👥</span>
                            <span class="bs-mode-title">Pass & Play</span>
                            <span class="bs-mode-desc">2 Players</span>
                        </button>
                        <button class="bs-mode-btn" onclick="selectVsAI()">
                            <span class="bs-mode-icon">🤖</span>
                            <span class="bs-mode-title">vs Computer</span>
                            <span class="bs-mode-desc">Single Player</span>
                        </button>
                    </div>

                    <div class="bs-buttons">
                        <button class="bs-btn bs-btn-secondary" onclick="exitBattleship()">← Back</button>
                    </div>
                </div>
            </div>
        `;
    }

    function selectPassAndPlay() {
        state.isAI = false;
        showPlayerNames();
    }

    function selectVsAI() {
        state.isAI = true;
        showPlayerNames();
    }

    function showPlayerNames() {
        const content = document.getElementById('battleshipContent');
        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-header">
                        <h1 class="bs-title">Player Names</h1>
                        <p class="bs-subtitle">${state.isAI ? 'Enter your name' : 'Enter player names'}</p>
                    </div>

                    <div class="bs-input-group">
                        <label class="bs-label">Player 1</label>
                        <input type="text" id="player1Name" class="bs-input" placeholder="Enter name" value="${state.player1Name || ''}">
                    </div>

                    ${!state.isAI ? `
                    <div class="bs-input-group">
                        <label class="bs-label">Player 2</label>
                        <input type="text" id="player2Name" class="bs-input" placeholder="Enter name" value="${state.player2Name || ''}">
                    </div>
                    ` : ''}

                    <div class="bs-buttons">
                        <button class="bs-btn bs-btn-secondary" onclick="showSetup()">← Back</button>
                        <button class="bs-btn bs-btn-primary" onclick="startWithNames()">Start Game</button>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => document.getElementById('player1Name')?.focus(), 100);
    }

    function startWithNames() {
        state.player1Name = document.getElementById('player1Name').value.trim() || 'Player 1';
        state.player2Name = state.isAI ? 'Computer' : (document.getElementById('player2Name')?.value.trim() || 'Player 2');
        state.phase = 'player1_place';
        state.currentShipIndex = 0;
        showShipPlacement(1);
    }

    function showShipPlacement(player) {
        const ship = state.shipTypes[state.currentShipIndex];
        const playerName = player === 1 ? state.player1Name : state.player2Name;
        const content = document.getElementById('battleshipContent');

        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-phase-indicator">
                        <span class="bs-phase-text">${playerName} - Place Your Ships</span>
                    </div>

                    <div class="bs-ship-info">
                        <div class="bs-ship-name">${ship.icon} ${ship.name} (${state.currentShipIndex + 1}/5)</div>
                        <div class="bs-ship-preview">
                            ${Array(ship.size).fill(0).map(() => '<div class="bs-ship-cell"></div>').join('')}
                        </div>
                        <div class="bs-controls">
                            <button class="bs-btn bs-btn-secondary bs-btn-small" onclick="toggleOrientation()">
                                ${state.orientation === 'horizontal' ? '→ Horizontal' : '↓ Vertical'}
                            </button>
                            <button class="bs-btn bs-btn-danger bs-btn-small" onclick="undoLastShip()" ${state.currentShipIndex === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
                                ↶ Undo
                            </button>
                        </div>
                    </div>

                    ${renderPlacementGrid(player)}

                    <div class="bs-buttons">
                        <button class="bs-btn bs-btn-secondary" onclick="exitBattleship()">← Exit</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderPlacementGrid(player) {
        const playerData = player === 1 ? state.player1 : state.player2;
        const letters = 'ABCDEFGHIJ'.split('');
        const cellSize = 'clamp(24px, 6.5vw, 32px)';

        let html = `<div class="bs-grid-container"><div class="bs-grid" style="grid-template-columns: 16px repeat(10, ${cellSize});">`;

        // Header row
        html += '<div class="bs-header-cell"></div>';
        for (let i = 1; i <= 10; i++) {
            html += `<div class="bs-header-cell">${i}</div>`;
        }

        // Grid rows
        for (let row = 0; row < 10; row++) {
            html += `<div class="bs-header-cell">${letters[row]}</div>`;
            for (let col = 0; col < 10; col++) {
                const hasShip = playerData.grid[row][col] !== null;
                html += `
                    <div class="bs-cell ${hasShip ? 'ship' : ''}"
                         onclick="placeShipAt(${row}, ${col})"
                         onmouseenter="previewShip(${row}, ${col})"
                         onmouseleave="clearPreview()">
                        ${hasShip ? '<span class="bs-cell-content">🚢</span>' : ''}
                    </div>
                `;
            }
        }

        html += '</div></div>';
        return html;
    }

    function toggleOrientation() {
        state.orientation = state.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        showShipPlacement(state.phase === 'player1_place' ? 1 : 2);
    }

    function undoLastShip() {
        if (state.currentShipIndex === 0) return;

        const player = state.phase === 'player1_place' ? 1 : 2;
        const playerData = player === 1 ? state.player1 : state.player2;

        const lastShip = playerData.ships.pop();
        lastShip.positions.forEach(([r, c]) => {
            playerData.grid[r][c] = null;
        });

        state.currentShipIndex--;
        showShipPlacement(player);
    }

    function placeShipAt(row, col) {
        const player = state.phase === 'player1_place' ? 1 : 2;
        const playerData = player === 1 ? state.player1 : state.player2;
        const ship = state.shipTypes[state.currentShipIndex];

        const positions = [];
        for (let i = 0; i < ship.size; i++) {
            const r = state.orientation === 'horizontal' ? row : row + i;
            const c = state.orientation === 'horizontal' ? col + i : col;

            if (r >= 10 || c >= 10 || playerData.grid[r][c] !== null) {
                showAlert('Invalid placement!', 'miss');
                return;
            }

            // Check adjacent cells
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const checkR = r + dr;
                    const checkC = c + dc;
                    if (checkR >= 0 && checkR < 10 && checkC >= 0 && checkC < 10) {
                        if (playerData.grid[checkR][checkC] !== null) {
                            showAlert('Ships cannot touch!', 'miss');
                            return;
                        }
                    }
                }
            }

            positions.push([r, c]);
        }

        // Place ship
        positions.forEach(([r, c]) => {
            playerData.grid[r][c] = ship.name;
        });

        playerData.ships.push({
            name: ship.name,
            positions: positions,
            hits: []
        });

        state.currentShipIndex++;

        if (state.currentShipIndex >= state.shipTypes.length) {
            if (state.phase === 'player1_place') {
                if (state.isAI) {
                    placeAIShips();
                    state.phase = 'battle';
                    state.currentPlayer = 1;
                    showBattleTurn();
                } else {
                    showPassPhone(2);
                }
            } else {
                state.phase = 'battle';
                state.currentPlayer = 1;
                showBattleTurn();
            }
        } else {
            showShipPlacement(player);
        }
    }

    function showPassPhone(toPlayer) {
        const fromName = toPlayer === 2 ? state.player1Name : state.player2Name;
        const toName = toPlayer === 2 ? state.player2Name : state.player1Name;

        const content = document.getElementById('battleshipContent');
        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-pass-screen">
                        <div class="bs-pass-icon">📱</div>
                        <h2 class="bs-pass-title">Pass the Phone!</h2>
                        <p class="bs-pass-subtitle">${fromName}, look away!<br>Hand the phone to ${toName}</p>
                        <button class="bs-btn bs-btn-primary" onclick="${toPlayer === 2 ? 'startPlayer2Setup()' : 'showBattleTurn()'}">${toName} Ready!</button>
                    </div>
                </div>
            </div>
        `;
    }

    function startPlayer2Setup() {
        state.phase = 'player2_place';
        state.currentShipIndex = 0;
        showShipPlacement(2);
    }

    function placeAIShips() {
        state.shipTypes.forEach(shipType => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                const positions = [];
                let valid = true;

                for (let i = 0; i < shipType.size && valid; i++) {
                    const r = orientation === 'horizontal' ? row : row + i;
                    const c = orientation === 'horizontal' ? col + i : col;

                    if (r >= 10 || c >= 10 || state.player2.grid[r][c] !== null) {
                        valid = false;
                        break;
                    }

                    for (let dr = -1; dr <= 1 && valid; dr++) {
                        for (let dc = -1; dc <= 1 && valid; dc++) {
                            const checkR = r + dr;
                            const checkC = c + dc;
                            if (checkR >= 0 && checkR < 10 && checkC >= 0 && checkC < 10) {
                                if (state.player2.grid[checkR][checkC] !== null) {
                                    valid = false;
                                }
                            }
                        }
                    }

                    if (valid) positions.push([r, c]);
                }

                if (valid && positions.length === shipType.size) {
                    positions.forEach(([r, c]) => {
                        state.player2.grid[r][c] = shipType.name;
                    });
                    state.player2.ships.push({
                        name: shipType.name,
                        positions: positions,
                        hits: []
                    });
                    placed = true;
                }
            }
        });
    }

    function showBattleTurn() {
        const currentPlayer = state.currentPlayer;
        const opponent = currentPlayer === 1 ? 2 : 1;
        const playerName = currentPlayer === 1 ? state.player1Name : state.player2Name;
        const opponentData = opponent === 1 ? state.player1 : state.player2;
        const sunkCount = opponentData.ships.filter(s => s.hits.length === s.positions.length).length;

        const content = document.getElementById('battleshipContent');
        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-phase-indicator attack">
                        <span class="bs-phase-text">${playerName}'s Turn • ${sunkCount}/5 Ships Sunk</span>
                    </div>

                    <div class="bs-grid-wrapper">
                        <div class="bs-grid-section">
                            <div class="bs-grid-label attack">🎯 Attack Grid</div>
                            ${renderAttackGrid(opponent)}
                        </div>

                        <div class="bs-grid-section">
                            <div class="bs-grid-label defense">🛡️ Your Fleet</div>
                            ${renderDefenseGrid(currentPlayer)}
                        </div>
                    </div>

                    <div class="bs-buttons">
                        <button class="bs-btn bs-btn-secondary" onclick="exitBattleship()">← Exit</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderAttackGrid(opponentPlayer) {
        const opponentData = opponentPlayer === 1 ? state.player1 : state.player2;
        const currentPlayerData = state.currentPlayer === 1 ? state.player1 : state.player2;
        const letters = 'ABCDEFGHIJ'.split('');
        const cellSize = 'clamp(22px, 6vw, 28px)';

        let html = `<div class="bs-grid-container"><div class="bs-grid" style="grid-template-columns: 14px repeat(10, ${cellSize});">`;

        html += '<div class="bs-header-cell"></div>';
        for (let i = 1; i <= 10; i++) {
            html += `<div class="bs-header-cell">${i}</div>`;
        }

        for (let row = 0; row < 10; row++) {
            html += `<div class="bs-header-cell">${letters[row]}</div>`;
            for (let col = 0; col < 10; col++) {
                const wasHit = currentPlayerData.hits?.some(h => h[0] === row && h[1] === col);
                const wasMiss = currentPlayerData.misses?.some(m => m[0] === row && m[1] === col);
                const shipName = opponentData.grid[row][col];
                const isSunk = shipName && opponentData.ships.find(s => s.name === shipName)?.hits.length ===
                              opponentData.ships.find(s => s.name === shipName)?.positions.length;

                let cellClass = 'bs-cell';
                let content = '';
                let clickable = true;

                if (wasHit) {
                    cellClass += isSunk ? ' sunk' : ' hit';
                    content = '💥';
                    clickable = false;
                } else if (wasMiss) {
                    cellClass += ' miss';
                    content = '💧';
                    clickable = false;
                }

                if (!clickable) cellClass += ' disabled';

                html += `
                    <div class="${cellClass}" ${clickable ? `onclick="makeAttack(${row}, ${col})"` : ''}>
                        <span class="bs-cell-content">${content}</span>
                    </div>
                `;
            }
        }

        html += '</div></div>';
        return html;
    }

    function renderDefenseGrid(player) {
        const playerData = player === 1 ? state.player1 : state.player2;
        const opponentData = player === 1 ? state.player2 : state.player1;
        const letters = 'ABCDEFGHIJ'.split('');
        const cellSize = 'clamp(22px, 6vw, 28px)';

        let html = `<div class="bs-grid-container"><div class="bs-grid" style="grid-template-columns: 14px repeat(10, ${cellSize});">`;

        html += '<div class="bs-header-cell"></div>';
        for (let i = 1; i <= 10; i++) {
            html += `<div class="bs-header-cell">${i}</div>`;
        }

        for (let row = 0; row < 10; row++) {
            html += `<div class="bs-header-cell">${letters[row]}</div>`;
            for (let col = 0; col < 10; col++) {
                const hasShip = playerData.grid[row][col] !== null;
                const wasHit = opponentData.hits?.some(h => h[0] === row && h[1] === col);
                const wasMiss = opponentData.misses?.some(m => m[0] === row && m[1] === col);

                let cellClass = 'bs-cell disabled';
                let content = '';

                if (wasHit) {
                    cellClass += ' hit';
                    content = '💥';
                } else if (wasMiss) {
                    cellClass += ' miss';
                    content = '💧';
                } else if (hasShip) {
                    cellClass += ' ship';
                    content = '🚢';
                }

                html += `
                    <div class="${cellClass}">
                        <span class="bs-cell-content">${content}</span>
                    </div>
                `;
            }
        }

        html += '</div></div>';
        return html;
    }

    function makeAttack(row, col) {
        const currentPlayerData = state.currentPlayer === 1 ? state.player1 : state.player2;
        const opponent = state.currentPlayer === 1 ? 2 : 1;
        const opponentData = opponent === 1 ? state.player1 : state.player2;

        const hasShip = opponentData.grid[row][col] !== null;

        if (hasShip) {
            if (!currentPlayerData.hits) currentPlayerData.hits = [];
            currentPlayerData.hits.push([row, col]);

            const shipName = opponentData.grid[row][col];
            const ship = opponentData.ships.find(s => s.name === shipName);
            if (ship) ship.hits.push([row, col]);

            if (ship && ship.hits.length === ship.positions.length) {
                showAlert(`HIT! You sunk the ${ship.name}!`, 'hit', () => checkForWin());
            } else {
                showAlert('HIT!', 'hit', () => switchTurn());
            }
        } else {
            if (!currentPlayerData.misses) currentPlayerData.misses = [];
            currentPlayerData.misses.push([row, col]);
            showAlert('Miss!', 'miss', () => switchTurn());
        }
    }

    function showAlert(message, type, callback) {
        const content = document.getElementById('battleshipContent');
        const alertHtml = `
            <div class="bs-overlay" onclick="closeAlert()"></div>
            <div class="bs-alert ${type}">
                <div class="bs-alert-icon">${type === 'hit' ? '💥' : '💧'}</div>
                <div class="bs-alert-text">${message}</div>
            </div>
        `;
        content.insertAdjacentHTML('beforeend', alertHtml);

        window.currentAlertCallback = callback;
        setTimeout(() => closeAlert(), 1200);
    }

    function closeAlert() {
        const overlay = document.querySelector('.bs-overlay');
        const alert = document.querySelector('.bs-alert');
        if (overlay) overlay.remove();
        if (alert) alert.remove();
        if (window.currentAlertCallback) {
            window.currentAlertCallback();
            window.currentAlertCallback = null;
        }
    }

    function checkForWin() {
        const opponent = state.currentPlayer === 1 ? 2 : 1;
        const opponentData = opponent === 1 ? state.player1 : state.player2;
        const allSunk = opponentData.ships.every(s => s.hits.length === s.positions.length);

        if (allSunk) {
            showWinner();
        } else {
            switchTurn();
        }
    }

    function switchTurn() {
        if (state.isAI) {
            if (state.currentPlayer === 1) {
                state.currentPlayer = 2;
                showBattleTurn();
                setTimeout(() => makeAIAttack(), 1000);
            } else {
                state.currentPlayer = 1;
                showBattleTurn();
            }
        } else {
            const nextPlayer = state.currentPlayer === 1 ? 2 : 1;
            const currentName = state.currentPlayer === 1 ? state.player1Name : state.player2Name;
            const nextName = nextPlayer === 1 ? state.player1Name : state.player2Name;

            const content = document.getElementById('battleshipContent');
            content.innerHTML = `
                <div class="bs-container">
                    <div class="bs-card">
                        <div class="bs-pass-screen">
                            <div class="bs-pass-icon">📱</div>
                            <h2 class="bs-pass-title">Pass the Phone!</h2>
                            <p class="bs-pass-subtitle">${currentName}, look away!<br>Hand to ${nextName}</p>
                            <button class="bs-btn bs-btn-primary" onclick="continueToNextTurn()">${nextName} Ready!</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function continueToNextTurn() {
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        showBattleTurn();
    }

    function makeAIAttack() {
        if (!state.aiState) {
            state.aiState = { mode: 'hunt', targetQueue: [] };
        }

        let row, col;
        const aiData = state.player2;
        const playerData = state.player1;

        if (state.aiState.mode === 'target' && state.aiState.targetQueue.length > 0) {
            [row, col] = state.aiState.targetQueue.shift();
        } else {
            let found = false;
            while (!found) {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
                const alreadyAttacked = aiData.hits?.some(h => h[0] === row && h[1] === col) ||
                                       aiData.misses?.some(m => m[0] === row && m[1] === col);
                if (!alreadyAttacked) found = true;
            }
            state.aiState.mode = 'hunt';
        }

        const hasShip = playerData.grid[row][col] !== null;

        if (hasShip) {
            if (!aiData.hits) aiData.hits = [];
            aiData.hits.push([row, col]);

            const shipName = playerData.grid[row][col];
            const ship = playerData.ships.find(s => s.name === shipName);
            if (ship) ship.hits.push([row, col]);

            if (ship.hits.length < ship.positions.length) {
                state.aiState.mode = 'target';
                [[row-1, col], [row+1, col], [row, col-1], [row, col+1]].forEach(([r, c]) => {
                    if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                        const attacked = aiData.hits?.some(h => h[0] === r && h[1] === c) ||
                                        aiData.misses?.some(m => m[0] === r && m[1] === c) ||
                                        state.aiState.targetQueue.some(t => t[0] === r && t[1] === c);
                        if (!attacked) state.aiState.targetQueue.push([r, c]);
                    }
                });
            }

            if (ship && ship.hits.length === ship.positions.length) {
                state.aiState.mode = 'hunt';
                state.aiState.targetQueue = [];
                showAlert(`Computer sunk your ${ship.name}!`, 'hit', () => {
                    const allSunk = playerData.ships.every(s => s.hits.length === s.positions.length);
                    if (allSunk) showWinner();
                    else switchTurn();
                });
            } else {
                showAlert('Computer HIT!', 'hit', () => switchTurn());
            }
        } else {
            if (!aiData.misses) aiData.misses = [];
            aiData.misses.push([row, col]);
            showAlert('Computer missed!', 'miss', () => switchTurn());
        }
    }

    function showWinner() {
        const winnerName = state.currentPlayer === 1 ? state.player1Name : state.player2Name;
        const isPlayerWin = !(state.isAI && state.currentPlayer === 2);

        const content = document.getElementById('battleshipContent');
        content.innerHTML = `
            <div class="bs-container">
                <div class="bs-card">
                    <div class="bs-winner-banner">
                        <h2 class="bs-winner-title">${isPlayerWin ? '🎉 Victory! 🎉' : '😔 Defeat'}</h2>
                        <p class="bs-winner-name">${winnerName} Wins!</p>
                    </div>

                    <p style="text-align: center; opacity: 0.8; margin-bottom: 1rem;">All enemy ships have been sunk!</p>

                    <div class="bs-buttons">
                        <button class="bs-btn bs-btn-primary" onclick="launchBattleship()">🔄 Play Again</button>
                        <button class="bs-btn bs-btn-secondary" onclick="exitBattleship()">← Back to Games</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Expose functions
    window.launchBattleship = launchBattleship;
    window.exitBattleship = exitBattleship;
    window.selectPassAndPlay = selectPassAndPlay;
    window.selectVsAI = selectVsAI;
    window.startWithNames = startWithNames;
    window.toggleOrientation = toggleOrientation;
    window.undoLastShip = undoLastShip;
    window.placeShipAt = placeShipAt;
    window.startPlayer2Setup = startPlayer2Setup;
    window.makeAttack = makeAttack;
    window.continueToNextTurn = continueToNextTurn;
    window.closeAlert = closeAlert;

})();

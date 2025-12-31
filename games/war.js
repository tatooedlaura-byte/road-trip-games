// War Card Game - Modern dark theme overhaul
(function() {
    'use strict';

    const styleId = 'war-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .war-container {
                min-height: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border-radius: 12px;
                text-align: center;
                position: relative;
            }

            .war-back-btn {
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                background: rgba(75, 85, 99, 0.8);
                color: white;
                border: none;
                padding: 0.5rem 0.75rem;
                border-radius: 8px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 10;
            }

            .war-back-btn:hover {
                background: rgba(75, 85, 99, 1);
            }

            .war-title {
                font-size: 2rem;
                color: #ec4899;
                text-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
                margin: 0 0 0.5rem 0;
            }

            .war-scores {
                display: flex;
                justify-content: space-around;
                margin-bottom: 1rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .war-score {
                text-align: center;
            }

            .war-score-label {
                font-size: 0.75rem;
                color: #888;
            }

            .war-score-value {
                font-size: 1.3rem;
                font-weight: bold;
                color: #fff;
            }

            .war-cards {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin: 1rem 0;
            }

            .war-card {
                width: 85px;
                height: 115px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 3px solid #444;
                transition: all 0.3s ease;
            }

            .war-card.face-down {
                background: linear-gradient(145deg, #ec4899, #db2777);
                color: white;
                font-size: 0.9rem;
            }

            .war-card.face-up {
                background: linear-gradient(145deg, #fefefe, #e8e8e8);
                box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
            }

            .war-card.face-up.red { color: #dc2626; }
            .war-card.face-up.black { color: #1f2937; }

            .war-card .rank { font-size: 1.8rem; }
            .war-card .suit { font-size: 1.4rem; }

            .war-vs {
                font-size: 1.5rem;
                font-weight: bold;
                color: #ec4899;
                text-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
            }

            .war-message {
                min-height: 50px;
                margin: 0.75rem 0;
                padding: 0.75rem;
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: bold;
            }

            .war-message.info { background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2)); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
            .war-message.win { background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.2)); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
            .war-message.lose { background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2)); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
            .war-message.war { background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(219, 39, 119, 0.2)); color: #f9a8d4; border: 1px solid rgba(236, 72, 153, 0.4); }

            .war-risk {
                margin: 0.75rem 0;
            }

            .war-risk-label {
                font-size: 0.8rem;
                color: #888;
                margin-bottom: 0.3rem;
            }

            .war-risk-btns {
                display: flex;
                gap: 0.3rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .war-risk-btn {
                background: linear-gradient(145deg, #374151, #1f2937);
                color: #9ca3af;
                border: 2px solid #4b5563;
                padding: 0.5rem 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.85rem;
                transition: all 0.2s ease;
            }

            .war-risk-btn:hover {
                border-color: #6b7280;
            }

            .war-risk-btn.active-0 {
                background: linear-gradient(145deg, #3b82f6, #2563eb);
                color: white;
                border-color: #60a5fa;
            }

            .war-risk-btn.active-1 {
                background: linear-gradient(145deg, #f59e0b, #d97706);
                color: white;
                border-color: #fbbf24;
            }

            .war-risk-btn.active-2 {
                background: linear-gradient(145deg, #f97316, #ea580c);
                color: white;
                border-color: #fb923c;
            }

            .war-risk-btn.active-3 {
                background: linear-gradient(145deg, #ef4444, #dc2626);
                color: white;
                border-color: #f87171;
            }

            .war-deck {
                margin: 1rem auto;
                width: 110px;
                height: 140px;
                background: linear-gradient(145deg, #ec4899, #db2777);
                border: 3px solid #f9a8d4;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
                touch-action: none;
            }

            .war-deck:hover {
                transform: scale(1.02);
                box-shadow: 0 6px 25px rgba(236, 72, 153, 0.5);
            }

            .war-deck:active {
                transform: scale(0.98);
            }

            .war-deck-icon { font-size: 2rem; margin-bottom: 0.3rem; }
            .war-deck-text { font-size: 0.9rem; }

            .war-btn {
                background: linear-gradient(145deg, #ec4899, #db2777);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
                margin: 0.3rem;
            }

            .war-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
            }

            .war-btn.secondary {
                background: linear-gradient(145deg, #4b5563, #374151);
                box-shadow: 0 4px 15px rgba(75, 85, 99, 0.3);
            }

            .war-btn.secondary:hover {
                box-shadow: 0 6px 20px rgba(75, 85, 99, 0.4);
            }

            .war-mode-btn {
                background: linear-gradient(145deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 1.2rem 1.5rem;
                border-radius: 12px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.2s ease;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                width: 100%;
                max-width: 350px;
            }

            .war-mode-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
            }

            .war-mode-btn.pink {
                background: linear-gradient(145deg, #f093fb, #f5576c);
            }

            .war-mode-btn.gold {
                background: linear-gradient(145deg, #fa709a, #fee140);
            }

            .war-mode-icon { font-size: 2rem; }
            .war-mode-text { text-align: left; }
            .war-mode-title { font-size: 1.1rem; }
            .war-mode-desc { font-size: 0.8rem; opacity: 0.9; font-weight: normal; }

            /* Face-to-face mode styles */
            .war-f2f {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                padding: 0.5rem;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            }

            .war-f2f-player {
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                margin: 0.3rem 0;
            }

            .war-f2f-player.rotated {
                transform: rotate(180deg);
            }

            .war-f2f-label {
                font-size: 0.75rem;
                color: #888;
                margin-bottom: 0.2rem;
            }

            .war-f2f-deck {
                width: 75px;
                height: 95px;
                margin: 0.3rem auto;
                background: linear-gradient(145deg, #ec4899, #db2777);
                border: 2px solid #f9a8d4;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                cursor: pointer;
                touch-action: none;
                transition: all 0.2s ease;
            }

            .war-f2f-deck.ready {
                background: linear-gradient(145deg, #22c55e, #16a34a);
                border-color: #4ade80;
            }

            .war-f2f-deck-icon { font-size: 1.3rem; }
            .war-f2f-deck-text { font-size: 0.7rem; }

            .war-f2f-risk {
                margin-top: 0.3rem;
            }

            .war-f2f-risk-btns {
                display: flex;
                gap: 0.15rem;
                justify-content: center;
            }

            .war-f2f-risk-btn {
                background: #374151;
                color: #9ca3af;
                border: none;
                padding: 0.25rem 0.4rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.65rem;
                font-weight: bold;
                min-width: 28px;
            }

            .war-f2f-middle {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.03);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                margin: 0.3rem 0;
            }

            .war-f2f-cards {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100%;
            }

            .war-f2f-card {
                width: 65px;
                height: 90px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 2px solid #444;
            }

            .war-f2f-card.face-down {
                background: linear-gradient(145deg, #ec4899, #db2777);
            }

            .war-f2f-card.face-up {
                background: linear-gradient(145deg, #fefefe, #e8e8e8);
            }

            .war-f2f-card.face-up.red { color: #dc2626; }
            .war-f2f-card.face-up.black { color: #1f2937; }

            .war-f2f-card .rank { font-size: 1.4rem; }
            .war-f2f-card .suit { font-size: 1.1rem; }

            .war-f2f-exit {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: rgba(75, 85, 99, 0.9);
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.75rem;
                z-index: 10;
            }

            .war-2p-risk {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin: 0.5rem 0;
            }

            .war-2p-risk-group {
                flex: 1;
                max-width: 180px;
            }
        `;
        document.head.appendChild(style);
    }

    let warState = {
        mode: null,
        playerDeck: [],
        computerDeck: [],
        playerScore: 0,
        computerScore: 0,
        playerCard: null,
        computerCard: null,
        warPile: [],
        gameOver: false,
        message: '',
        messageType: 'info',
        riskLevel: 0,
        riskLevel2: 0,
        player1Ready: false,
        player2Ready: false
    };

    let swipeStartY = 0;
    let isSwiping = false;
    let swipeSource = null;

    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

    function isRed(suit) {
        return suit === '♥' || suit === '♦';
    }

    function launchWar() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('warGame').style.display = 'block';
        showModeSelection();
    }

    function showModeSelection() {
        const content = document.getElementById('warContent');
        content.innerHTML = `
            <div class="war-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
                <h1 class="war-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎴 War</h1>
                <p style="color: #888; margin-bottom: 2rem;">Choose your game mode</p>

                <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 350px;">
                    <button class="war-mode-btn" onclick="startWarMode('vsComputer')">
                        <span class="war-mode-icon">🤖</span>
                        <div class="war-mode-text">
                            <div class="war-mode-title">vs Computer</div>
                            <div class="war-mode-desc">Play against AI opponent</div>
                        </div>
                    </button>

                    <button class="war-mode-btn pink" onclick="startWarMode('twoPlayer')">
                        <span class="war-mode-icon">👥</span>
                        <div class="war-mode-text">
                            <div class="war-mode-title">2 Player (Same View)</div>
                            <div class="war-mode-desc">Both see same screen</div>
                        </div>
                    </button>

                    <button class="war-mode-btn gold" onclick="startWarMode('faceToFace')">
                        <span class="war-mode-icon">🔄</span>
                        <div class="war-mode-text">
                            <div class="war-mode-title">Face-to-Face</div>
                            <div class="war-mode-desc">Device between players</div>
                        </div>
                    </button>
                </div>

                <button class="war-btn secondary" style="margin-top: 2rem;" onclick="exitWar()">← Back to Games</button>
            </div>
        `;
    }

    function startWarMode(mode) {
        warState.mode = mode;
        initializeGame();
    }

    function exitWar() {
        document.getElementById('warGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    function initializeGame() {
        const deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ rank, suit, value: values[rank] });
            }
        }

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        warState.playerDeck = deck.slice(0, 26);
        warState.computerDeck = deck.slice(26);
        warState.playerScore = 26;
        warState.computerScore = 26;
        warState.playerCard = null;
        warState.computerCard = null;
        warState.warPile = [];
        warState.gameOver = false;
        warState.riskLevel = 0;
        warState.riskLevel2 = 0;
        warState.player1Ready = false;
        warState.player2Ready = false;

        const isTwoPlayer = warState.mode === 'twoPlayer' || warState.mode === 'faceToFace';
        warState.message = isTwoPlayer
            ? 'Choose risk levels, then click or swipe to flip!'
            : 'Choose your risk level, then click or swipe to flip!';
        warState.messageType = 'info';

        showWarBoard();
    }

    function showWarBoard() {
        if (warState.mode === 'faceToFace') {
            showFaceToFaceBoard();
            return;
        }

        const content = document.getElementById('warContent');
        const isTwoPlayer = warState.mode === 'twoPlayer';
        const p1Label = isTwoPlayer ? 'P1' : 'You';
        const p2Label = isTwoPlayer ? 'P2' : 'CPU';

        const playerCardHTML = warState.playerCard
            ? `<div class="war-card face-up ${isRed(warState.playerCard.suit) ? 'red' : 'black'}">
                <span class="rank">${warState.playerCard.rank}</span>
                <span class="suit">${warState.playerCard.suit}</span>
            </div>`
            : `<div class="war-card face-down">${p1Label}</div>`;

        const computerCardHTML = warState.computerCard
            ? `<div class="war-card face-up ${isRed(warState.computerCard.suit) ? 'red' : 'black'}">
                <span class="rank">${warState.computerCard.rank}</span>
                <span class="suit">${warState.computerCard.suit}</span>
            </div>`
            : `<div class="war-card face-down">${p2Label}</div>`;

        content.innerHTML = `
            <div class="war-container">
                <button class="war-back-btn" onclick="exitWar()">← Back</button>
                <h1 class="war-title" style="padding-top: 1.5rem;">🎴 War</h1>

                <div class="war-scores">
                    <div class="war-score">
                        <div class="war-score-label">${p1Label}</div>
                        <div class="war-score-value">${warState.playerScore}</div>
                    </div>
                    <div class="war-score">
                        <div class="war-score-label">${p2Label}</div>
                        <div class="war-score-value">${warState.computerScore}</div>
                    </div>
                </div>

                <div class="war-cards">
                    ${playerCardHTML}
                    <div class="war-vs">VS</div>
                    ${computerCardHTML}
                </div>

                <div class="war-message ${warState.messageType}">${warState.message}</div>

                ${!warState.gameOver ? `
                    ${isTwoPlayer ? `
                        <div class="war-2p-risk">
                            <div class="war-2p-risk-group">
                                <div class="war-risk-label">P1 Risk:</div>
                                <div class="war-risk-btns">
                                    <button class="war-risk-btn ${warState.riskLevel === 0 ? 'active-0' : ''}" onclick="setRiskLevel(0)">0</button>
                                    <button class="war-risk-btn ${warState.riskLevel === 1 ? 'active-1' : ''}" onclick="setRiskLevel(1)">+2</button>
                                    <button class="war-risk-btn ${warState.riskLevel === 2 ? 'active-2' : ''}" onclick="setRiskLevel(2)">+4</button>
                                    <button class="war-risk-btn ${warState.riskLevel === 3 ? 'active-3' : ''}" onclick="setRiskLevel(3)">+6</button>
                                </div>
                            </div>
                            <div class="war-2p-risk-group">
                                <div class="war-risk-label">P2 Risk:</div>
                                <div class="war-risk-btns">
                                    <button class="war-risk-btn ${warState.riskLevel2 === 0 ? 'active-0' : ''}" onclick="setRiskLevel2(0)">0</button>
                                    <button class="war-risk-btn ${warState.riskLevel2 === 1 ? 'active-1' : ''}" onclick="setRiskLevel2(1)">+2</button>
                                    <button class="war-risk-btn ${warState.riskLevel2 === 2 ? 'active-2' : ''}" onclick="setRiskLevel2(2)">+4</button>
                                    <button class="war-risk-btn ${warState.riskLevel2 === 3 ? 'active-3' : ''}" onclick="setRiskLevel2(3)">+6</button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="war-risk">
                            <div class="war-risk-label">Risk Extra Cards (win/lose more!):</div>
                            <div class="war-risk-btns">
                                <button class="war-risk-btn ${warState.riskLevel === 0 ? 'active-0' : ''}" onclick="setRiskLevel(0)">0 Safe</button>
                                <button class="war-risk-btn ${warState.riskLevel === 1 ? 'active-1' : ''}" onclick="setRiskLevel(1)">+2🔥</button>
                                <button class="war-risk-btn ${warState.riskLevel === 2 ? 'active-2' : ''}" onclick="setRiskLevel(2)">+4🔥</button>
                                <button class="war-risk-btn ${warState.riskLevel === 3 ? 'active-3' : ''}" onclick="setRiskLevel(3)">+6🔥</button>
                            </div>
                        </div>
                    `}

                    <div class="war-deck" id="deckSwipeArea" onclick="flipCard()" ontouchstart="handleSwipeStart(event)" ontouchmove="handleSwipeMove(event)" ontouchend="handleSwipeEnd(event)">
                        <div class="war-deck-icon">👆</div>
                        <div class="war-deck-text">Click/Swipe</div>
                    </div>
                ` : `
                    <button class="war-btn" onclick="initializeGame()">🔄 Play Again</button>
                `}
            </div>
        `;
    }

    function showFaceToFaceBoard() {
        const content = document.getElementById('warContent');

        const player1CardHTML = warState.playerCard
            ? `<div class="war-f2f-card face-up ${isRed(warState.playerCard.suit) ? 'red' : 'black'}">
                <span class="rank">${warState.playerCard.rank}</span>
                <span class="suit">${warState.playerCard.suit}</span>
            </div>`
            : `<div class="war-f2f-card face-down"></div>`;

        const player2CardHTML = warState.computerCard
            ? `<div class="war-f2f-card face-up ${isRed(warState.computerCard.suit) ? 'red' : 'black'}">
                <span class="rank">${warState.computerCard.rank}</span>
                <span class="suit">${warState.computerCard.suit}</span>
            </div>`
            : `<div class="war-f2f-card face-down"></div>`;

        content.innerHTML = `
            <div class="war-f2f" style="position: relative;">
                <button class="war-f2f-exit" onclick="exitWar()">✕</button>

                <!-- Player 2 (Top, Rotated) -->
                <div class="war-f2f-player rotated">
                    <div class="war-f2f-label">Player 2: ${warState.computerScore} cards</div>
                    <div class="war-f2f-deck ${warState.player2Ready ? 'ready' : ''}" id="swipeArea2" onclick="handlePlayer2Click()" ontouchstart="handleSwipeStart(event)" ontouchmove="handleSwipeMove(event)" ontouchend="handleSwipeEnd(event)">
                        <div class="war-f2f-deck-icon">${warState.player2Ready ? '✓' : '👆'}</div>
                        <div class="war-f2f-deck-text">${warState.player2Ready ? 'Ready!' : 'Click'}</div>
                    </div>
                    <div class="war-f2f-risk">
                        <div class="war-f2f-risk-btns">
                            <button class="war-f2f-risk-btn ${warState.riskLevel2 === 0 ? 'active-0' : ''}" onclick="setRiskLevel2(0)" style="background: ${warState.riskLevel2 === 0 ? '#3b82f6' : '#374151'}; color: ${warState.riskLevel2 === 0 ? 'white' : '#9ca3af'};">0</button>
                            <button class="war-f2f-risk-btn ${warState.riskLevel2 === 1 ? 'active-1' : ''}" onclick="setRiskLevel2(1)" style="background: ${warState.riskLevel2 === 1 ? '#f59e0b' : '#374151'}; color: ${warState.riskLevel2 === 1 ? 'white' : '#9ca3af'};">+2</button>
                            <button class="war-f2f-risk-btn ${warState.riskLevel2 === 2 ? 'active-2' : ''}" onclick="setRiskLevel2(2)" style="background: ${warState.riskLevel2 === 2 ? '#f97316' : '#374151'}; color: ${warState.riskLevel2 === 2 ? 'white' : '#9ca3af'};">+4</button>
                            <button class="war-f2f-risk-btn ${warState.riskLevel2 === 3 ? 'active-3' : ''}" onclick="setRiskLevel2(3)" style="background: ${warState.riskLevel2 === 3 ? '#ef4444' : '#374151'}; color: ${warState.riskLevel2 === 3 ? 'white' : '#9ca3af'};">+6</button>
                        </div>
                    </div>
                </div>

                <!-- Middle Cards -->
                <div class="war-f2f-middle">
                    <div class="war-f2f-cards">
                        ${player1CardHTML}
                        <div style="font-size: 1rem; font-weight: bold; color: #ec4899;">VS</div>
                        ${player2CardHTML}
                    </div>
                    ${warState.message ? `<div class="war-message ${warState.messageType}" style="margin-top: 0.4rem; font-size: 0.75rem;">${warState.message}</div>` : ''}
                    ${warState.gameOver ? `<button class="war-btn" style="margin-top: 0.4rem; padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="initializeGame()">Play Again</button>` : ''}
                </div>

                <!-- Player 1 (Bottom) -->
                <div class="war-f2f-player">
                    <div class="war-f2f-deck ${warState.player1Ready ? 'ready' : ''}" id="swipeArea1" onclick="handlePlayer1Click()" ontouchstart="handleSwipeStart(event)" ontouchmove="handleSwipeMove(event)" ontouchend="handleSwipeEnd(event)">
                        <div class="war-f2f-deck-icon">${warState.player1Ready ? '✓' : '👆'}</div>
                        <div class="war-f2f-deck-text">${warState.player1Ready ? 'Ready!' : 'Click'}</div>
                    </div>
                    <div class="war-f2f-risk">
                        <div class="war-f2f-risk-btns">
                            <button class="war-f2f-risk-btn" onclick="setRiskLevel(0)" style="background: ${warState.riskLevel === 0 ? '#3b82f6' : '#374151'}; color: ${warState.riskLevel === 0 ? 'white' : '#9ca3af'};">0</button>
                            <button class="war-f2f-risk-btn" onclick="setRiskLevel(1)" style="background: ${warState.riskLevel === 1 ? '#f59e0b' : '#374151'}; color: ${warState.riskLevel === 1 ? 'white' : '#9ca3af'};">+2</button>
                            <button class="war-f2f-risk-btn" onclick="setRiskLevel(2)" style="background: ${warState.riskLevel === 2 ? '#f97316' : '#374151'}; color: ${warState.riskLevel === 2 ? 'white' : '#9ca3af'};">+4</button>
                            <button class="war-f2f-risk-btn" onclick="setRiskLevel(3)" style="background: ${warState.riskLevel === 3 ? '#ef4444' : '#374151'}; color: ${warState.riskLevel === 3 ? 'white' : '#9ca3af'};">+6</button>
                        </div>
                    </div>
                    <div class="war-f2f-label">Player 1: ${warState.playerScore} cards</div>
                </div>
            </div>
        `;
    }

    function setRiskLevel(level) {
        warState.riskLevel = level;
        showWarBoard();
    }

    function setRiskLevel2(level) {
        warState.riskLevel2 = level;
        showWarBoard();
    }

    function handleSwipeStart(e) {
        swipeStartY = e.touches[0].clientY;
        isSwiping = true;

        let element = e.target;
        while (element && !element.id?.startsWith('swipeArea') && element.id !== 'deckSwipeArea') {
            element = element.parentElement;
        }
        swipeSource = element?.id;
    }

    function handleSwipeMove(e) {
        if (!isSwiping) return;

        const currentY = e.touches[0].clientY;
        const deltaY = swipeStartY - currentY;

        if (warState.mode === 'faceToFace') {
            if (swipeSource) {
                const area = document.getElementById(swipeSource);
                if (area) {
                    if (swipeSource === 'swipeArea2' && deltaY < 0) {
                        area.style.transform = `translateY(${Math.min(Math.abs(deltaY), 50)}px)`;
                    } else if (swipeSource === 'swipeArea1' && deltaY > 0) {
                        area.style.transform = `translateY(-${Math.min(deltaY, 50)}px)`;
                    }
                }
            }
        } else {
            const deckArea = document.getElementById('deckSwipeArea');
            if (deckArea && deltaY > 0) {
                deckArea.style.transform = `translateY(-${Math.min(deltaY, 50)}px)`;
            }
        }
    }

    function handleSwipeEnd(e) {
        if (!isSwiping) return;

        const endY = e.changedTouches[0].clientY;
        const deltaY = swipeStartY - endY;

        if (warState.mode === 'faceToFace') {
            const area1 = document.getElementById('swipeArea1');
            const area2 = document.getElementById('swipeArea2');
            if (area1) area1.style.transform = 'translateY(0)';
            if (area2) area2.style.transform = 'translateY(0)';

            let validSwipe = false;
            if (swipeSource === 'swipeArea1' && deltaY > 50) {
                validSwipe = true;
            } else if (swipeSource === 'swipeArea2' && deltaY < -50) {
                validSwipe = true;
            }

            if (validSwipe) {
                if (swipeSource === 'swipeArea1' && !warState.player1Ready) {
                    warState.player1Ready = true;
                    if (warState.playerDeck.length > 0) {
                        warState.playerCard = warState.playerDeck.shift();
                    }
                } else if (swipeSource === 'swipeArea2' && !warState.player2Ready) {
                    warState.player2Ready = true;
                    if (warState.computerDeck.length > 0) {
                        warState.computerCard = warState.computerDeck.shift();
                    }
                }

                showWarBoard();

                if (warState.player1Ready && warState.player2Ready) {
                    setTimeout(() => {
                        resolveRound();
                        showWarBoard();
                    }, 1000);
                }
            }
        } else {
            const deckArea = document.getElementById('deckSwipeArea');
            if (deckArea) {
                deckArea.style.transform = 'translateY(0)';
            }

            if (deltaY > 50) {
                flipCard();
            }
        }

        isSwiping = false;
        swipeSource = null;
    }

    function flipCard() {
        if (warState.playerDeck.length === 0 || warState.computerDeck.length === 0) {
            endGame();
            return;
        }

        warState.playerCard = warState.playerDeck.shift();
        showWarBoard();

        setTimeout(() => {
            warState.computerCard = warState.computerDeck.shift();
            showWarBoard();

            setTimeout(() => {
                resolveRound();
            }, 1500);
        }, 800);
    }

    function resolveRound() {
        if (!warState.playerCard || !warState.computerCard) {
            endGame();
            return;
        }

        warState.warPile.push(warState.playerCard, warState.computerCard);

        const isTwoPlayer = warState.mode === 'twoPlayer' || warState.mode === 'faceToFace';

        for (let i = 0; i < warState.riskLevel; i++) {
            if (warState.playerDeck.length > 0) {
                warState.warPile.push(warState.playerDeck.shift());
            }
        }

        const player2Risk = isTwoPlayer ? warState.riskLevel2 : warState.riskLevel;
        for (let i = 0; i < player2Risk; i++) {
            if (warState.computerDeck.length > 0) {
                warState.warPile.push(warState.computerDeck.shift());
            }
        }

        const player1Name = isTwoPlayer ? 'Player 1' : 'You';
        const player2Name = isTwoPlayer ? 'Player 2' : 'You';

        if (warState.playerCard.value > warState.computerCard.value) {
            const cardsWon = warState.warPile.length;
            warState.playerDeck.push(...warState.warPile);
            warState.playerScore = warState.playerDeck.length;
            warState.computerScore = warState.computerDeck.length;

            const totalRisk = warState.riskLevel + (isTwoPlayer ? warState.riskLevel2 : warState.riskLevel);
            const riskBonus = totalRisk > 0 ? ` (+${totalRisk * 2} risk!)` : '';
            warState.message = `${player1Name} Win${isTwoPlayer ? 's' : ''} ${cardsWon} cards! ${warState.playerCard.rank}${warState.playerCard.suit} beats ${warState.computerCard.rank}${warState.computerCard.suit}${riskBonus}`;
            warState.messageType = 'win';
            warState.warPile = [];
            warState.riskLevel = 0;
            warState.riskLevel2 = 0;
            warState.player1Ready = false;
            warState.player2Ready = false;
            warState.playerCard = null;
            warState.computerCard = null;
        } else if (warState.computerCard.value > warState.playerCard.value) {
            const cardsWon = warState.warPile.length;
            warState.computerDeck.push(...warState.warPile);
            warState.playerScore = warState.playerDeck.length;
            warState.computerScore = warState.computerDeck.length;

            const totalRisk = warState.riskLevel + (isTwoPlayer ? warState.riskLevel2 : warState.riskLevel);
            const riskInfo = totalRisk > 0 ? ` (+${totalRisk * 2} risk!)` : '';
            warState.message = isTwoPlayer
                ? `${player2Name} Wins ${cardsWon} cards! ${warState.computerCard.rank}${warState.computerCard.suit} beats ${warState.playerCard.rank}${warState.playerCard.suit}${riskInfo}`
                : `You Lose ${cardsWon} cards! ${warState.computerCard.rank}${warState.computerCard.suit} beats ${warState.playerCard.rank}${warState.playerCard.suit}${riskInfo}`;
            warState.messageType = 'lose';
            warState.warPile = [];
            warState.riskLevel = 0;
            warState.riskLevel2 = 0;
            warState.player1Ready = false;
            warState.player2Ready = false;
            warState.playerCard = null;
            warState.computerCard = null;
        } else {
            warState.message = `⚔️ WAR! Both played ${warState.playerCard.rank}! Flip again!`;
            warState.messageType = 'war';

            for (let i = 0; i < 3; i++) {
                if (warState.playerDeck.length > 0) {
                    warState.warPile.push(warState.playerDeck.shift());
                }
                if (warState.computerDeck.length > 0) {
                    warState.warPile.push(warState.computerDeck.shift());
                }
            }
            warState.riskLevel = 0;
            warState.riskLevel2 = 0;
            warState.player1Ready = false;
            warState.player2Ready = false;
            warState.playerCard = null;
            warState.computerCard = null;
        }

        if (warState.playerDeck.length === 0 || warState.computerDeck.length === 0) {
            endGame();
        }

        showWarBoard();
    }

    function endGame() {
        warState.gameOver = true;
        const isTwoPlayer = warState.mode === 'twoPlayer' || warState.mode === 'faceToFace';

        if (warState.playerDeck.length > warState.computerDeck.length) {
            warState.message = isTwoPlayer ? '🎉 Player 1 Wins the Game!' : '🎉 You Win the Game!';
            warState.messageType = 'win';
        } else if (warState.computerDeck.length > warState.playerDeck.length) {
            warState.message = isTwoPlayer ? '🎉 Player 2 Wins the Game!' : '😢 Computer Wins the Game!';
            warState.messageType = 'lose';
        } else {
            warState.message = '🤝 It\'s a Tie!';
            warState.messageType = 'info';
        }
        showWarBoard();
    }

    function handlePlayer1Click() {
        if (warState.player1Ready || warState.gameOver) return;

        warState.player1Ready = true;
        if (warState.playerDeck.length > 0) {
            warState.playerCard = warState.playerDeck.shift();
        }

        showWarBoard();

        if (warState.player1Ready && warState.player2Ready) {
            setTimeout(() => {
                resolveRound();
                showWarBoard();
            }, 1000);
        }
    }

    function handlePlayer2Click() {
        if (warState.player2Ready || warState.gameOver) return;

        warState.player2Ready = true;
        if (warState.computerDeck.length > 0) {
            warState.computerCard = warState.computerDeck.shift();
        }

        showWarBoard();

        if (warState.player1Ready && warState.player2Ready) {
            setTimeout(() => {
                resolveRound();
                showWarBoard();
            }, 1000);
        }
    }

    window.launchWar = launchWar;
    window.exitWar = exitWar;
    window.flipCard = flipCard;
    window.initializeGame = initializeGame;
    window.setRiskLevel = setRiskLevel;
    window.setRiskLevel2 = setRiskLevel2;
    window.startWarMode = startWarMode;
    window.handleSwipeStart = handleSwipeStart;
    window.handleSwipeMove = handleSwipeMove;
    window.handleSwipeEnd = handleSwipeEnd;
    window.handlePlayer1Click = handlePlayer1Click;
    window.handlePlayer2Click = handlePlayer2Click;

})();

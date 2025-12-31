// Trash (Garbage) Card Game - Modern dark theme overhaul
(function() {
    'use strict';

    const styleId = 'trash-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .trash-container {
                min-height: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border-radius: 12px;
                position: relative;
            }

            .trash-back-btn {
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

            .trash-back-btn:hover {
                background: rgba(75, 85, 99, 1);
            }

            .trash-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .trash-title {
                font-size: 1.8rem;
                color: #f97316;
                text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
                margin: 0 0 0.5rem 0;
            }

            .trash-message {
                padding: 0.75rem;
                border-radius: 10px;
                font-weight: bold;
                font-size: 0.95rem;
            }

            .trash-message.info { background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2)); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
            .trash-message.success { background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.2)); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
            .trash-message.warning { background: linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.2)); color: #fed7aa; border: 1px solid rgba(249, 115, 22, 0.4); }

            .trash-board {
                margin-bottom: 1rem;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 2px solid rgba(255, 255, 255, 0.1);
            }

            .trash-board.active {
                border-color: #f97316;
                box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
            }

            .trash-board-label {
                font-size: 0.85rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
                color: #888;
            }

            .trash-board.active .trash-board-label {
                color: #f97316;
            }

            .trash-cards-row {
                display: flex;
                gap: 0.4rem;
                justify-content: center;
                margin-bottom: 0.4rem;
            }

            .trash-card {
                width: 55px;
                height: 75px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                transition: all 0.2s ease;
                border: 2px solid #333;
            }

            .trash-card.face-down {
                background: linear-gradient(145deg, #f97316, #ea580c);
                color: white;
                cursor: default;
            }

            .trash-card.face-down.clickable {
                cursor: pointer;
                box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
            }

            .trash-card.face-down.clickable:hover {
                transform: scale(1.05);
                box-shadow: 0 0 25px rgba(249, 115, 22, 0.6);
            }

            .trash-card.face-up {
                background: linear-gradient(145deg, #fefefe, #e8e8e8);
            }

            .trash-card.face-up.red { color: #dc2626; }
            .trash-card.face-up.black { color: #1f2937; }

            .trash-card .rank { font-size: 1.1rem; }
            .trash-card .suit { font-size: 0.9rem; }
            .trash-card .position { font-size: 0.7rem; opacity: 0.9; }

            .trash-piles {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .trash-pile {
                text-align: center;
            }

            .trash-pile-label {
                font-size: 0.75rem;
                color: #888;
                margin-bottom: 0.3rem;
            }

            .trash-pile-card {
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

            .trash-pile-card.deck {
                background: linear-gradient(145deg, #f97316, #ea580c);
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            }

            .trash-pile-card.deck:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(249, 115, 22, 0.5);
            }

            .trash-pile-card.deck.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .trash-pile-card.deck.disabled:hover {
                transform: none;
                box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            }

            .trash-pile-card.discard {
                background: linear-gradient(145deg, #fefefe, #e8e8e8);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .trash-pile-card.discard:hover {
                transform: scale(1.05);
            }

            .trash-pile-card.discard.disabled {
                cursor: not-allowed;
            }

            .trash-pile-card.discard.disabled:hover {
                transform: none;
            }

            .trash-pile-card.discard.red { color: #dc2626; }
            .trash-pile-card.discard.black { color: #1f2937; }

            .trash-pile-card .rank { font-size: 1.3rem; }
            .trash-pile-card .suit { font-size: 1.1rem; }

            .trash-drawn {
                text-align: center;
            }

            .trash-drawn-card {
                width: 65px;
                height: 90px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 3px solid #fbbf24;
                background: linear-gradient(145deg, #fefefe, #e8e8e8);
                box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
                margin: 0 auto;
            }

            .trash-drawn-card.red { color: #dc2626; }
            .trash-drawn-card.black { color: #1f2937; }

            .trash-drawn-card .rank { font-size: 1.3rem; }
            .trash-drawn-card .suit { font-size: 1.1rem; }

            .trash-discard-btn {
                background: linear-gradient(145deg, #ef4444, #dc2626);
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                border-radius: 8px;
                font-size: 0.75rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 0.4rem;
                transition: all 0.2s ease;
            }

            .trash-discard-btn:hover {
                transform: scale(1.05);
            }

            .trash-pile-count {
                font-size: 0.65rem;
                color: #666;
                margin-top: 0.2rem;
            }

            .trash-btn {
                background: linear-gradient(145deg, #f97316, #ea580c);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            }

            .trash-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
            }

            .trash-btn.secondary {
                background: linear-gradient(145deg, #4b5563, #374151);
                box-shadow: 0 4px 15px rgba(75, 85, 99, 0.3);
            }

            .trash-btn.secondary:hover {
                box-shadow: 0 6px 20px rgba(75, 85, 99, 0.4);
            }

            .trash-btn.info {
                background: linear-gradient(145deg, #3b82f6, #2563eb);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }

            .trash-btn.info:hover {
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
            }

            .trash-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 1rem;
            }

            .trash-mode-btn {
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

            .trash-mode-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
            }

            .trash-mode-btn.pink {
                background: linear-gradient(145deg, #f093fb, #f5576c);
                box-shadow: 0 4px 20px rgba(245, 87, 108, 0.3);
            }

            .trash-mode-btn.pink:hover {
                box-shadow: 0 6px 25px rgba(245, 87, 108, 0.4);
            }

            .trash-mode-icon { font-size: 2rem; }
            .trash-mode-text { text-align: left; }
            .trash-mode-title { font-size: 1.1rem; }
            .trash-mode-desc { font-size: 0.8rem; opacity: 0.9; font-weight: normal; }

            .trash-rules {
                max-width: 600px;
                margin: 0 auto;
                padding: 1.5rem;
            }

            .trash-rules h2 {
                color: #f97316;
                text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
                margin-bottom: 1rem;
            }

            .trash-rules-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .trash-rules-section h3 {
                color: #fbbf24;
                margin-bottom: 0.5rem;
            }

            .trash-rules-section p, .trash-rules-section li {
                color: #d1d5db;
                line-height: 1.6;
            }

            .trash-rules-section ul, .trash-rules-section ol {
                margin-left: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    let trashState = {
        mode: null,
        deck: [],
        discardPile: [],
        player1Cards: [],
        player2Cards: [],
        currentPlayer: 1,
        drawnCard: null,
        gameOver: false,
        message: '',
        messageType: 'info',
        currentTurnActive: false
    };

    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    function getCardValue(rank) {
        if (rank === 'A') return 1;
        if (rank === 'J') return 11;
        if (rank === 'Q' || rank === 'K') return 0;
        return parseInt(rank);
    }

    function isRed(suit) {
        return suit === '♥' || suit === '♦';
    }

    function launchTrash() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('trashGame').style.display = 'block';
        showModeSelection();
    }

    function showModeSelection() {
        const content = document.getElementById('trashContent');
        content.innerHTML = `
            <div class="trash-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
                <h1 class="trash-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">🗑️ Trash</h1>
                <p style="color: #888; margin-bottom: 2rem;">Choose your game mode</p>

                <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 350px;">
                    <button class="trash-mode-btn" onclick="startTrashMode('vsComputer')">
                        <span class="trash-mode-icon">🤖</span>
                        <div class="trash-mode-text">
                            <div class="trash-mode-title">vs Computer</div>
                            <div class="trash-mode-desc">Play against AI opponent</div>
                        </div>
                    </button>

                    <button class="trash-mode-btn pink" onclick="startTrashMode('twoPlayer')">
                        <span class="trash-mode-icon">👥</span>
                        <div class="trash-mode-text">
                            <div class="trash-mode-title">2 Player Pass-and-Play</div>
                            <div class="trash-mode-desc">Take turns on same device</div>
                        </div>
                    </button>
                </div>

                <button class="trash-btn secondary" style="margin-top: 2rem;" onclick="exitTrash()">← Back to Games</button>
            </div>
        `;
    }

    function showTrashRules() {
        const content = document.getElementById('trashContent');
        content.innerHTML = `
            <div class="trash-container">
                <div class="trash-rules">
                    <h2>📖 How to Play Trash</h2>

                    <div class="trash-rules-section">
                        <h3>🎯 Objective</h3>
                        <p>Be the first player to fill all 10 spots (Ace through 10) with the correct cards, face-up.</p>
                    </div>

                    <div class="trash-rules-section">
                        <h3>🎴 Setup</h3>
                        <ul>
                            <li>Each player gets 10 cards arranged face-down in 2 rows of 5</li>
                            <li>Positions are numbered 1-10 (Ace = 1, 2-10 = face value)</li>
                        </ul>
                    </div>

                    <div class="trash-rules-section">
                        <h3>▶️ How to Play</h3>
                        <ol>
                            <li><strong>Draw a card</strong> from the deck or discard pile</li>
                            <li><strong>If it's Ace-10:</strong> Place it in the correct spot and flip the card that was there</li>
                            <li><strong>If it's a Jack:</strong> Wild card! Place it in any empty spot</li>
                            <li><strong>If it's a Queen or King:</strong> Unplayable - your turn ends</li>
                            <li><strong>Chain placement:</strong> Keep placing revealed cards in their spots</li>
                            <li><strong>Turn ends when:</strong>
                                <ul>
                                    <li>You draw/reveal a Queen or King</li>
                                    <li>You reveal a card whose spot is already filled</li>
                                </ul>
                            </li>
                        </ol>
                    </div>

                    <div class="trash-rules-section">
                        <h3>🏆 Winning</h3>
                        <p>First player to get all 10 spots filled with correct face-up cards wins!</p>
                    </div>

                    <div class="trash-actions">
                        <button class="trash-btn info" onclick="showTrashBoard()">← Back to Game</button>
                        <button class="trash-btn secondary" onclick="showModeSelection()">New Game</button>
                    </div>
                </div>
            </div>
        `;
    }

    function startTrashMode(mode) {
        trashState.mode = mode;
        initializeGame();
    }

    function exitTrash() {
        document.getElementById('trashGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    function initializeGame() {
        trashState.deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                trashState.deck.push({ rank, suit });
            }
        }
        shuffleDeck();

        trashState.player1Cards = [];
        trashState.player2Cards = [];
        for (let i = 0; i < 10; i++) {
            trashState.player1Cards.push({ ...trashState.deck.pop(), faceUp: false });
            trashState.player2Cards.push({ ...trashState.deck.pop(), faceUp: false });
        }

        trashState.discardPile = [trashState.deck.pop()];
        trashState.currentPlayer = 1;
        trashState.drawnCard = null;
        trashState.gameOver = false;
        trashState.currentTurnActive = false;
        trashState.message = trashState.mode === 'twoPlayer'
            ? 'Player 1: Tap Deck or Discard to draw!'
            : 'Your turn! Tap Deck or Discard to draw!';
        trashState.messageType = 'info';

        showTrashBoard();
    }

    function shuffleDeck() {
        for (let i = trashState.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [trashState.deck[i], trashState.deck[j]] = [trashState.deck[j], trashState.deck[i]];
        }
    }

    function showTrashBoard() {
        const content = document.getElementById('trashContent');
        const isTwoPlayer = trashState.mode === 'twoPlayer';
        const canDraw = !trashState.drawnCard && !trashState.gameOver && (trashState.mode === 'vsComputer' ? trashState.currentPlayer === 1 : true);

        const topCard = trashState.discardPile.length > 0 ? trashState.discardPile[trashState.discardPile.length - 1] : null;

        content.innerHTML = `
            <div class="trash-container">
                <button class="trash-back-btn" onclick="exitTrash()">← Back</button>
                <div class="trash-header" style="padding-top: 2rem;">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <h1 class="trash-title">🗑️ Trash</h1>
                        <button class="trash-btn info" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="showTrashRules()">📖 Rules</button>
                    </div>
                    <div class="trash-message ${trashState.messageType}">${trashState.message}</div>
                </div>

                <!-- Opponent's Board -->
                <div class="trash-board ${trashState.currentPlayer === 2 && isTwoPlayer ? 'active' : ''}">
                    <div class="trash-board-label">${isTwoPlayer ? 'Player 2' : 'Computer'}</div>
                    ${renderPlayerCards(trashState.player2Cards, trashState.currentPlayer === 2, 2)}
                </div>

                <!-- Draw/Discard Piles -->
                <div class="trash-piles">
                    <div class="trash-pile">
                        <div class="trash-pile-label">Deck</div>
                        <div class="trash-pile-card deck ${!canDraw ? 'disabled' : ''}" ${canDraw ? 'onclick="drawFromDeck()"' : ''}>
                            🎴
                        </div>
                        <div class="trash-pile-count">${trashState.deck.length} cards</div>
                    </div>
                    <div class="trash-pile">
                        <div class="trash-pile-label">Discard</div>
                        ${topCard ? `
                            <div class="trash-pile-card discard ${isRed(topCard.suit) ? 'red' : 'black'} ${!canDraw ? 'disabled' : ''}" ${canDraw ? 'onclick="drawFromDiscard()"' : ''}>
                                <span class="rank">${topCard.rank}</span>
                                <span class="suit">${topCard.suit}</span>
                            </div>
                        ` : '<div class="trash-pile-card discard" style="background: rgba(255,255,255,0.1);"></div>'}
                    </div>
                    ${trashState.drawnCard ? `
                        <div class="trash-drawn">
                            <div class="trash-pile-label">Drawn</div>
                            <div class="trash-drawn-card ${isRed(trashState.drawnCard.suit) ? 'red' : 'black'}">
                                <span class="rank">${trashState.drawnCard.rank}</span>
                                <span class="suit">${trashState.drawnCard.suit}</span>
                            </div>
                            <button class="trash-discard-btn" onclick="discardAndEndTurn()">Discard</button>
                        </div>
                    ` : ''}
                </div>

                <!-- Player's Board -->
                <div class="trash-board ${trashState.currentPlayer === 1 ? 'active' : ''}">
                    <div class="trash-board-label">${isTwoPlayer ? 'Player 1' : 'You'}</div>
                    ${renderPlayerCards(trashState.player1Cards, trashState.currentPlayer === 1, 1)}
                </div>

                ${trashState.gameOver ? `
                <div class="trash-actions">
                    <button class="trash-btn" onclick="initializeGame()">🔄 Play Again</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    function renderPlayerCards(cards, isCurrentPlayer, playerNum) {
        const canPlace = isCurrentPlayer && trashState.drawnCard && !trashState.gameOver && trashState.currentPlayer === playerNum;

        let html = '';
        // Row 1 (positions 0-4)
        html += '<div class="trash-cards-row">';
        for (let i = 0; i < 5; i++) {
            html += renderCard(cards[i], i, canPlace);
        }
        html += '</div>';

        // Row 2 (positions 5-9)
        html += '<div class="trash-cards-row">';
        for (let i = 5; i < 10; i++) {
            html += renderCard(cards[i], i, canPlace);
        }
        html += '</div>';

        return html;
    }

    function renderCard(card, position, canPlace) {
        const positionLabel = position + 1;

        if (card.faceUp) {
            return `<div class="trash-card face-up ${isRed(card.suit) ? 'red' : 'black'}">
                <span class="rank">${card.rank}</span>
                <span class="suit">${card.suit}</span>
            </div>`;
        } else {
            if (canPlace) {
                return `<div class="trash-card face-down clickable" onclick="placeCard(${position})">
                    <span class="position">${positionLabel}</span>
                </div>`;
            } else {
                return `<div class="trash-card face-down">
                    <span class="position">${positionLabel}</span>
                </div>`;
            }
        }
    }

    function drawFromDeck() {
        if (trashState.deck.length === 0) return;
        trashState.drawnCard = trashState.deck.pop();
        trashState.currentTurnActive = true;

        const value = getCardValue(trashState.drawnCard.rank);
        if (value === 0) {
            trashState.message = `Drew ${trashState.drawnCard.rank}${trashState.drawnCard.suit} - Unplayable! Turn ends.`;
            trashState.messageType = 'warning';
            trashState.discardPile.push(trashState.drawnCard);
            trashState.drawnCard = null;
            showTrashBoard();
            setTimeout(() => endTurn(), 1500);
        } else {
            trashState.message = value === 11
                ? `Drew a Jack (Wild)! Tap any face-down card.`
                : `Drew ${trashState.drawnCard.rank}${trashState.drawnCard.suit} - Tap spot ${value}!`;
            trashState.messageType = 'info';
            showTrashBoard();
        }
    }

    function drawFromDiscard() {
        if (trashState.discardPile.length === 0) return;
        trashState.drawnCard = trashState.discardPile.pop();
        trashState.currentTurnActive = true;

        const value = getCardValue(trashState.drawnCard.rank);
        trashState.message = value === 11
            ? `Drew a Jack (Wild)! Tap any face-down card.`
            : `Drew ${trashState.drawnCard.rank}${trashState.drawnCard.suit} - Tap spot ${value}!`;
        trashState.messageType = 'info';

        showTrashBoard();
    }

    function placeCard(position) {
        if (!trashState.drawnCard || !trashState.currentTurnActive) return;

        const playerCards = trashState.currentPlayer === 1 ? trashState.player1Cards : trashState.player2Cards;
        const drawnValue = getCardValue(trashState.drawnCard.rank);
        const isWild = drawnValue === 11;
        const isValidPosition = (drawnValue === position + 1 || isWild) && !playerCards[position].faceUp;

        if (!isValidPosition) {
            trashState.message = `Can't place there! ${isWild ? 'Tap any face-down spot.' : 'Tap spot ' + drawnValue + '.'}`;
            trashState.messageType = 'warning';
            showTrashBoard();
            return;
        }

        const oldCard = playerCards[position];
        playerCards[position] = { ...trashState.drawnCard, faceUp: true };
        trashState.drawnCard = null;

        if (playerCards.every(c => c.faceUp)) {
            trashState.gameOver = true;
            trashState.message = trashState.currentPlayer === 1
                ? (trashState.mode === 'twoPlayer' ? '🎉 Player 1 wins!' : '🎉 You win!')
                : (trashState.mode === 'twoPlayer' ? '🎉 Player 2 wins!' : '😢 Computer wins!');
            trashState.messageType = 'success';
            showTrashBoard();
            return;
        }

        if (oldCard && !oldCard.faceUp) {
            oldCard.faceUp = true;
            const oldValue = getCardValue(oldCard.rank);

            if (oldValue === 0) {
                trashState.message = `Revealed ${oldCard.rank}${oldCard.suit} - Turn ends!`;
                trashState.messageType = 'warning';
                trashState.discardPile.push(oldCard);
                showTrashBoard();
                setTimeout(() => endTurn(), 1500);
                return;
            } else if (oldValue === 11) {
                trashState.drawnCard = oldCard;
                trashState.message = `Revealed a Jack (Wild)! Tap any face-down card.`;
                trashState.messageType = 'info';
            } else {
                const targetPosition = oldValue - 1;
                if (playerCards[targetPosition].faceUp) {
                    trashState.message = `Revealed ${oldCard.rank}${oldCard.suit} - Spot ${oldValue} filled! Turn ends.`;
                    trashState.messageType = 'warning';
                    trashState.discardPile.push(oldCard);
                    showTrashBoard();
                    setTimeout(() => endTurn(), 1500);
                    return;
                } else {
                    trashState.drawnCard = oldCard;
                    trashState.message = `Revealed ${oldCard.rank}${oldCard.suit} - Tap spot ${oldValue}!`;
                    trashState.messageType = 'info';
                }
            }
        }

        showTrashBoard();
    }

    function discardAndEndTurn() {
        if (!trashState.drawnCard) return;

        trashState.message = `Discarded ${trashState.drawnCard.rank}${trashState.drawnCard.suit} - Turn ends.`;
        trashState.messageType = 'warning';
        trashState.discardPile.push(trashState.drawnCard);
        trashState.drawnCard = null;
        showTrashBoard();

        setTimeout(() => endTurn(), 1500);
    }

    function endTurn() {
        trashState.currentTurnActive = false;
        trashState.drawnCard = null;
        trashState.currentPlayer = trashState.currentPlayer === 1 ? 2 : 1;

        if (trashState.mode === 'vsComputer' && trashState.currentPlayer === 2) {
            trashState.message = "Computer's turn...";
            trashState.messageType = 'info';
            showTrashBoard();
            setTimeout(computerTurn, 1000);
        } else {
            trashState.message = trashState.mode === 'twoPlayer'
                ? `Player ${trashState.currentPlayer}: Tap Deck or Discard to draw!`
                : 'Your turn! Tap Deck or Discard to draw!';
            trashState.messageType = 'info';
            showTrashBoard();
        }
    }

    function computerTurn() {
        if (trashState.deck.length === 0) {
            endTurn();
            return;
        }

        trashState.drawnCard = trashState.deck.pop();
        const value = getCardValue(trashState.drawnCard.rank);

        if (value === 0) {
            trashState.discardPile.push(trashState.drawnCard);
            trashState.drawnCard = null;
            setTimeout(endTurn, 800);
            return;
        }

        setTimeout(() => placeComputerCard(), 800);
    }

    function placeComputerCard() {
        if (!trashState.drawnCard) {
            endTurn();
            return;
        }

        const value = getCardValue(trashState.drawnCard.rank);
        const playerCards = trashState.player2Cards;

        let targetPosition = -1;
        if (value === 11) {
            targetPosition = playerCards.findIndex(c => !c.faceUp);
        } else {
            const pos = value - 1;
            if (!playerCards[pos].faceUp) {
                targetPosition = pos;
            }
        }

        if (targetPosition === -1) {
            trashState.discardPile.push(trashState.drawnCard);
            trashState.drawnCard = null;
            setTimeout(endTurn, 500);
            return;
        }

        const oldCard = playerCards[targetPosition];
        playerCards[targetPosition] = { ...trashState.drawnCard, faceUp: true };
        trashState.drawnCard = oldCard.faceUp ? null : oldCard;

        if (trashState.drawnCard) {
            trashState.drawnCard.faceUp = true;
        }

        showTrashBoard();

        if (playerCards.every(c => c.faceUp)) {
            trashState.gameOver = true;
            trashState.message = '😢 Computer wins!';
            trashState.messageType = 'warning';
            showTrashBoard();
            return;
        }

        if (trashState.drawnCard) {
            const newValue = getCardValue(trashState.drawnCard.rank);
            if (newValue === 0 || (newValue !== 11 && playerCards[newValue - 1].faceUp)) {
                trashState.discardPile.push(trashState.drawnCard);
                trashState.drawnCard = null;
                setTimeout(endTurn, 800);
            } else {
                setTimeout(() => placeComputerCard(), 800);
            }
        } else {
            setTimeout(endTurn, 800);
        }
    }

    window.launchTrash = launchTrash;
    window.exitTrash = exitTrash;
    window.startTrashMode = startTrashMode;
    window.initializeGame = initializeGame;
    window.drawFromDeck = drawFromDeck;
    window.drawFromDiscard = drawFromDiscard;
    window.placeCard = placeCard;
    window.discardAndEndTurn = discardAndEndTurn;
    window.showTrashRules = showTrashRules;
    window.showTrashBoard = showTrashBoard;

})();

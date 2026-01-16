// Boggle Game
(function() {
    'use strict';

    // Boggle dice (classic 4x4 configuration)
    const DICE_4X4 = [
        'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
        'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
        'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
        'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'
    ];

    // 5x5 Big Boggle dice
    const DICE_5X5 = [
        'AAAFRS', 'AAEEEE', 'AAFIRS', 'ADENNN', 'AEEEEM',
        'AEEGMU', 'AEGMNN', 'AFIRSY', 'BJKQXZ', 'CCENST',
        'CEIILT', 'CEILPT', 'CEIPST', 'DDHNOT', 'DHHLOR',
        'DHLNOR', 'DHLNOR', 'EIIITT', 'EMOTTT', 'ENSSSU',
        'FIPRSY', 'GORRVW', 'IPRRRY', 'NOOTUW', 'OOOTTU'
    ];

    let wordList = new Set();
    let grid = [];
    let gridSize = 4;
    let selectedCells = [];
    let foundWords = new Set();
    let timerInterval = null;
    let timeRemaining = 0;
    let gameActive = false;
    let allValidWords = [];
    let highScore = parseInt(localStorage.getItem('boggleHighScore')) || 0;

    const SCORING = {
        3: 1, 4: 1, 5: 2, 6: 3, 7: 5, 8: 11
    };

    // Inject CSS styles
    const styleId = 'boggle-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .bog-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                user-select: none;
                -webkit-user-select: none;
            }

            .bog-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .bog-back-btn {
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
            }

            .bog-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .bog-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .bog-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .bog-timer {
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
                color: #00ff88;
            }

            .bog-timer.warning { color: #ffa500; }
            .bog-timer.danger { color: #ff4444; animation: pulse 0.5s infinite; }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .bog-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 1rem;
                font-size: 1rem;
            }

            .bog-stat {
                text-align: center;
            }

            .bog-stat-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: #ffd93d;
            }

            .bog-stat-label {
                font-size: 0.8rem;
                color: #888;
            }

            .bog-grid-container {
                display: flex;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .bog-grid {
                display: grid;
                gap: 6px;
                background: rgba(0,0,0,0.3);
                padding: 10px;
                border-radius: 12px;
                touch-action: none;
            }

            .bog-grid.size-4 {
                grid-template-columns: repeat(4, 1fr);
            }

            .bog-grid.size-5 {
                grid-template-columns: repeat(5, 1fr);
            }

            .bog-cell {
                width: 55px;
                height: 55px;
                background: linear-gradient(145deg, #f5deb3 0%, #deb887 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.6rem;
                font-weight: bold;
                color: #333;
                cursor: pointer;
                transition: transform 0.1s, box-shadow 0.1s;
                box-shadow: 0 3px 6px rgba(0,0,0,0.3);
            }

            .bog-grid.size-5 .bog-cell {
                width: 48px;
                height: 48px;
                font-size: 1.4rem;
            }

            .bog-cell:hover {
                transform: scale(1.05);
            }

            .bog-cell.selected {
                background: linear-gradient(145deg, #ffd93d 0%, #ff6b6b 100%);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255, 217, 61, 0.5);
            }

            .bog-cell.last-selected {
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
            }

            .bog-current-word {
                text-align: center;
                font-size: 1.5rem;
                font-weight: bold;
                min-height: 2.5rem;
                margin-bottom: 0.5rem;
                color: #ffd93d;
                letter-spacing: 2px;
            }

            .bog-message {
                text-align: center;
                font-size: 0.9rem;
                min-height: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .bog-message.success { color: #00ff88; }
            .bog-message.error { color: #ff6b6b; }

            .bog-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .bog-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .bog-btn:hover { transform: translateY(-2px); }
            .bog-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

            .bog-btn.primary {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .bog-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .bog-btn.danger {
                background: #ff6b6b;
                color: white;
            }

            .bog-found-words {
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                padding: 1rem;
                max-height: 150px;
                overflow-y: auto;
            }

            .bog-found-title {
                font-size: 0.9rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .bog-words-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .bog-word-tag {
                background: rgba(0, 255, 136, 0.2);
                color: #00ff88;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .bog-menu {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                padding: 1rem 0;
            }

            .bog-menu-btn {
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .bog-menu-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }

            .bog-menu-btn.primary {
                background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
                color: #1a1a2e;
            }

            .bog-menu-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .bog-settings {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .bog-settings-title {
                font-size: 1rem;
                margin-bottom: 1rem;
                color: #888;
            }

            .bog-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
            }

            .bog-setting-label { font-size: 0.9rem; }

            .bog-setting-select {
                padding: 0.5rem;
                border-radius: 8px;
                border: 1px solid #444;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
            }

            .bog-rules {
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .bog-rules h4 {
                margin: 0 0 0.5rem 0;
                color: #ff6b6b;
            }

            .bog-rules ul {
                margin: 0;
                padding-left: 1.2rem;
            }

            .bog-results {
                text-align: center;
            }

            .bog-score {
                font-size: 3rem;
                font-weight: bold;
                color: #ffd93d;
                margin: 0.5rem 0;
            }

            .bog-missed-words {
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                padding: 1rem;
                margin-top: 1rem;
                max-height: 200px;
                overflow-y: auto;
            }

            .bog-missed-title {
                font-size: 0.9rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .bog-missed-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .bog-missed-tag {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }

            .bog-loading {
                text-align: center;
                padding: 3rem;
                color: #888;
            }

            .bog-loading-spinner {
                font-size: 2rem;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    let gameSettings = {
        gridSize: 4,
        timeLimit: 180
    };

    async function loadWordList() {
        if (wordList.size > 0) return;

        try {
            const response = await fetch('./data/ghost-words.txt');
            const text = await response.text();
            const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length >= 3);
            wordList = new Set(words);
            console.log(`Loaded ${wordList.size} words for Boggle`);
        } catch (error) {
            console.error('Failed to load word list:', error);
            // Fallback to a small built-in list
            wordList = new Set(['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT']);
        }
    }

    function generateGrid() {
        const dice = gridSize === 5 ? DICE_5X5 : DICE_4X4;
        const shuffledDice = [...dice].sort(() => Math.random() - 0.5);

        grid = [];
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                const dieIndex = i * gridSize + j;
                const die = shuffledDice[dieIndex];
                const letter = die[Math.floor(Math.random() * die.length)];
                row.push(letter === 'Q' ? 'Qu' : letter);
            }
            grid.push(row);
        }
    }

    function isAdjacent(cell1, cell2) {
        const rowDiff = Math.abs(cell1.row - cell2.row);
        const colDiff = Math.abs(cell1.col - cell2.col);
        return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
    }

    function getSelectedWord() {
        return selectedCells.map(c => grid[c.row][c.col]).join('').toUpperCase();
    }

    function isValidSelection(row, col) {
        // Check if already selected
        if (selectedCells.some(c => c.row === row && c.col === col)) {
            return false;
        }

        // First selection is always valid
        if (selectedCells.length === 0) return true;

        // Must be adjacent to last selected
        const lastCell = selectedCells[selectedCells.length - 1];
        return isAdjacent(lastCell, { row, col });
    }

    function selectCell(row, col) {
        if (!gameActive) return;

        // Check if clicking the last selected cell to deselect
        if (selectedCells.length > 0) {
            const lastCell = selectedCells[selectedCells.length - 1];
            if (lastCell.row === row && lastCell.col === col) {
                selectedCells.pop();
                updateGridDisplay();
                updateCurrentWord();
                return;
            }
        }

        // Check if clicking a previously selected cell (backtrack)
        const existingIndex = selectedCells.findIndex(c => c.row === row && c.col === col);
        if (existingIndex !== -1) {
            // Backtrack to this cell
            selectedCells = selectedCells.slice(0, existingIndex + 1);
            updateGridDisplay();
            updateCurrentWord();
            return;
        }

        if (isValidSelection(row, col)) {
            selectedCells.push({ row, col });
            updateGridDisplay();
            updateCurrentWord();
        }
    }

    function updateGridDisplay() {
        const cells = document.querySelectorAll('.bog-cell');
        cells.forEach(cell => {
            cell.classList.remove('selected', 'last-selected');
        });

        selectedCells.forEach((c, index) => {
            const cell = document.querySelector(`.bog-cell[data-row="${c.row}"][data-col="${c.col}"]`);
            if (cell) {
                cell.classList.add('selected');
                if (index === selectedCells.length - 1) {
                    cell.classList.add('last-selected');
                }
            }
        });
    }

    function updateCurrentWord() {
        const wordEl = document.getElementById('bogCurrentWord');
        if (wordEl) {
            wordEl.textContent = getSelectedWord() || '—';
        }
    }

    function showMessage(text, type = '') {
        const msgEl = document.getElementById('bogMessage');
        if (msgEl) {
            msgEl.textContent = text;
            msgEl.className = 'bog-message ' + type;
            setTimeout(() => {
                if (msgEl.textContent === text) {
                    msgEl.textContent = '';
                    msgEl.className = 'bog-message';
                }
            }, 1500);
        }
    }

    function submitWord() {
        if (!gameActive || selectedCells.length < 3) {
            showMessage('Words must be 3+ letters', 'error');
            return;
        }

        const word = getSelectedWord().replace('QU', 'QU');

        if (foundWords.has(word)) {
            showMessage('Already found!', 'error');
            clearSelection();
            return;
        }

        if (!wordList.has(word)) {
            showMessage('Not a valid word', 'error');
            clearSelection();
            return;
        }

        foundWords.add(word);
        showMessage(`+${getWordScore(word)} points!`, 'success');
        updateFoundWords();
        updateScore();
        clearSelection();
    }

    function clearSelection() {
        selectedCells = [];
        updateGridDisplay();
        updateCurrentWord();
        lastKeyMatches = [];
        lastKeyIndex = -1;
    }

    // Track matching cells for cycling through duplicates
    let lastKeyMatches = [];
    let lastKeyIndex = -1;

    function getCellLetter(row, col) {
        return grid[row][col].toUpperCase().replace('QU', 'Q');
    }

    function cellMatchesKey(row, col, key) {
        const cellLetter = getCellLetter(row, col);
        return cellLetter === key || (key === 'Q' && grid[row][col] === 'Qu');
    }

    function handleKeydown(e) {
        if (!gameActive) return;

        const key = e.key.toUpperCase();

        // Enter submits the word
        if (e.key === 'Enter') {
            e.preventDefault();
            submitWord();
            return;
        }

        // Backspace removes last letter
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (selectedCells.length > 0) {
                selectedCells.pop();
                updateGridDisplay();
                updateCurrentWord();
                lastKeyMatches = [];
                lastKeyIndex = -1;
            }
            return;
        }

        // Escape clears selection
        if (e.key === 'Escape') {
            e.preventDefault();
            clearSelection();
            return;
        }

        // Letter keys - find matching cell
        if (/^[A-Z]$/.test(key)) {
            e.preventDefault();

            // If no cells selected, find all cells with this letter
            if (selectedCells.length === 0) {
                const matches = [];
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        if (cellMatchesKey(row, col, key)) {
                            matches.push({ row, col });
                        }
                    }
                }

                if (matches.length > 0) {
                    // Check if pressing same key again to cycle
                    if (lastKeyMatches.length > 0 && selectedCells.length === 0) {
                        // We just cycled and cleared, start fresh
                    }
                    lastKeyMatches = matches;
                    lastKeyIndex = 0;
                    selectCell(matches[0].row, matches[0].col);
                }
            } else {
                // Find all adjacent cells with this letter
                const lastCell = selectedCells[selectedCells.length - 1];
                const lastCellLetter = getCellLetter(lastCell.row, lastCell.col);

                // Check if pressing same key to cycle through alternatives
                if (lastKeyMatches.length > 1 && cellMatchesKey(lastCell.row, lastCell.col, key)) {
                    // Cycle to next match
                    lastKeyIndex = (lastKeyIndex + 1) % lastKeyMatches.length;
                    const nextMatch = lastKeyMatches[lastKeyIndex];

                    // Remove current last cell and add the new one
                    selectedCells.pop();
                    selectedCells.push(nextMatch);
                    updateGridDisplay();
                    updateCurrentWord();
                    return;
                }

                // Find all adjacent unselected cells with this letter
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],          [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];

                const matches = [];
                for (const [dr, dc] of directions) {
                    const newRow = lastCell.row + dr;
                    const newCol = lastCell.col + dc;

                    if (newRow >= 0 && newRow < gridSize &&
                        newCol >= 0 && newCol < gridSize) {

                        // Check if already selected
                        if (selectedCells.some(c => c.row === newRow && c.col === newCol)) {
                            continue;
                        }

                        if (cellMatchesKey(newRow, newCol, key)) {
                            matches.push({ row: newRow, col: newCol });
                        }
                    }
                }

                if (matches.length > 0) {
                    lastKeyMatches = matches;
                    lastKeyIndex = 0;
                    selectCell(matches[0].row, matches[0].col);
                }
            }
        }
    }

    function setupKeyboardListener() {
        document.addEventListener('keydown', handleKeydown);
    }

    function removeKeyboardListener() {
        document.removeEventListener('keydown', handleKeydown);
    }

    function getWordScore(word) {
        const len = word.length;
        if (len >= 8) return 11;
        return SCORING[len] || 1;
    }

    function calculateTotalScore() {
        let total = 0;
        foundWords.forEach(word => {
            total += getWordScore(word);
        });
        return total;
    }

    function updateScore() {
        const scoreEl = document.getElementById('bogScore');
        if (scoreEl) {
            scoreEl.textContent = calculateTotalScore();
        }

        const countEl = document.getElementById('bogWordCount');
        if (countEl) {
            countEl.textContent = foundWords.size;
        }
    }

    function updateFoundWords() {
        const listEl = document.getElementById('bogWordsList');
        if (listEl) {
            const sorted = Array.from(foundWords).sort((a, b) => b.length - a.length || a.localeCompare(b));
            listEl.innerHTML = sorted.map(w => `<span class="bog-word-tag">${w}</span>`).join('');
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        timeRemaining = gameSettings.timeLimit;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const timerEl = document.getElementById('bogTimer');
        if (timerEl) {
            timerEl.textContent = formatTime(timeRemaining);
            timerEl.className = 'bog-timer';
            if (timeRemaining <= 10) {
                timerEl.classList.add('danger');
            } else if (timeRemaining <= 30) {
                timerEl.classList.add('warning');
            }
        }
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function findAllValidWords() {
        allValidWords = [];
        const visited = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

        function dfs(row, col, path, word) {
            if (word.length >= 3 && wordList.has(word)) {
                if (!allValidWords.includes(word)) {
                    allValidWords.push(word);
                }
            }

            if (word.length >= 10) return; // Max word length to prevent infinite search

            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],          [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];

            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                if (newRow >= 0 && newRow < gridSize &&
                    newCol >= 0 && newCol < gridSize &&
                    !visited[newRow][newCol]) {

                    visited[newRow][newCol] = true;
                    const letter = grid[newRow][newCol];
                    dfs(newRow, newCol, [...path, { row: newRow, col: newCol }], word + letter);
                    visited[newRow][newCol] = false;
                }
            }
        }

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                visited[i][j] = true;
                const letter = grid[i][j];
                dfs(i, j, [{ row: i, col: j }], letter);
                visited[i][j] = false;
            }
        }

        allValidWords.sort((a, b) => b.length - a.length || a.localeCompare(b));
    }

    function showMenu() {
        stopTimer();
        gameActive = false;

        const container = document.getElementById('boggleContent');
        container.innerHTML = `
            <div class="bog-container">
                <div class="bog-card">
                    <button class="game-back-btn" onclick="exitBoggle()">← Back</button>

                    <div class="bog-header">
                        <h1 class="bog-title">Boggle</h1>
                    </div>

                    <div class="bog-rules">
                        <h4>How to Play</h4>
                        <ul>
                            <li>Find words by connecting adjacent letters</li>
                            <li>Tap letters in sequence (including diagonals)</li>
                            <li>Each letter can only be used once per word</li>
                            <li>Words must be 3+ letters</li>
                            <li>Longer words = more points!</li>
                        </ul>
                    </div>

                    <div class="bog-menu">
                        <button class="bog-menu-btn primary" onclick="window.boggleGame.startGame()">
                            ▶️ Start Game
                        </button>
                    </div>

                    <div class="bog-settings">
                        <div class="bog-settings-title">Settings</div>

                        <div class="bog-setting-row">
                            <span class="bog-setting-label">Grid Size</span>
                            <select class="bog-setting-select" id="bogGridSize" onchange="window.boggleGame.updateSettings()">
                                <option value="4" selected>4×4 (Classic)</option>
                                <option value="5">5×5 (Big Boggle)</option>
                            </select>
                        </div>

                        <div class="bog-setting-row">
                            <span class="bog-setting-label">Time Limit</span>
                            <select class="bog-setting-select" id="bogTimeLimit" onchange="window.boggleGame.updateSettings()">
                                <option value="120">2 minutes</option>
                                <option value="180" selected>3 minutes</option>
                                <option value="300">5 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateSettings() {
        const sizeEl = document.getElementById('bogGridSize');
        const timeEl = document.getElementById('bogTimeLimit');

        if (sizeEl) gameSettings.gridSize = parseInt(sizeEl.value);
        if (timeEl) gameSettings.timeLimit = parseInt(timeEl.value);
    }

    async function startGame() {
        const container = document.getElementById('boggleContent');
        container.innerHTML = `
            <div class="bog-container">
                <div class="bog-card">
                    <div class="bog-loading">
                        <div class="bog-loading-spinner">🎲</div>
                        <p>Loading words...</p>
                    </div>
                </div>
            </div>
        `;

        await loadWordList();

        gridSize = gameSettings.gridSize;
        generateGrid();
        foundWords = new Set();
        selectedCells = [];
        gameActive = true;

        container.innerHTML = `
            <div class="bog-container">
                <div class="bog-card">
                    <button class="game-back-btn" onclick="window.boggleGame.confirmQuit()">← Quit</button>

                    <div class="bog-timer" id="bogTimer">${formatTime(gameSettings.timeLimit)}</div>

                    <div class="bog-stats">
                        <div class="bog-stat">
                            <div class="bog-stat-value" id="bogScore">0</div>
                            <div class="bog-stat-label">Points</div>
                        </div>
                        <div class="bog-stat">
                            <div class="bog-stat-value" style="color: #f9df6d;">${highScore}</div>
                            <div class="bog-stat-label">Best</div>
                        </div>
                        <div class="bog-stat">
                            <div class="bog-stat-value" id="bogWordCount">0</div>
                            <div class="bog-stat-label">Words</div>
                        </div>
                    </div>

                    <div class="bog-grid-container">
                        <div class="bog-grid size-${gridSize}" id="bogGrid">
                            ${grid.map((row, i) => row.map((letter, j) => `
                                <div class="bog-cell" data-row="${i}" data-col="${j}"
                                     onclick="window.boggleGame.selectCell(${i}, ${j})">
                                    ${letter}
                                </div>
                            `).join('')).join('')}
                        </div>
                    </div>

                    <div class="bog-current-word" id="bogCurrentWord">—</div>
                    <div class="bog-message" id="bogMessage"></div>

                    <div class="bog-actions">
                        <button class="bog-btn primary" onclick="window.boggleGame.submitWord()">Submit</button>
                        <button class="bog-btn secondary" onclick="window.boggleGame.clearSelection()">Clear</button>
                    </div>

                    <div class="bog-found-words">
                        <div class="bog-found-title">Found Words:</div>
                        <div class="bog-words-list" id="bogWordsList"></div>
                    </div>
                </div>
            </div>
        `;

        startTimer();
        setupKeyboardListener();
    }

    function confirmQuit() {
        if (confirm('Quit game? Your progress will be lost.')) {
            stopTimer();
            removeKeyboardListener();
            gameActive = false;
            showMenu();
        }
    }

    function endGame() {
        stopTimer();
        removeKeyboardListener();
        gameActive = false;

        // Find all valid words for comparison
        findAllValidWords();

        const score = calculateTotalScore();
        const isNewHighScore = score > highScore;
        if (isNewHighScore) {
            highScore = score;
            localStorage.setItem('boggleHighScore', highScore);
        }

        const missedWords = allValidWords.filter(w => !foundWords.has(w)).slice(0, 50);
        const foundArr = Array.from(foundWords).sort((a, b) => b.length - a.length);

        const container = document.getElementById('boggleContent');
        container.innerHTML = `
            <div class="bog-container">
                <div class="bog-card">
                    <div class="bog-header">
                        <h1 class="bog-title">Time's Up!</h1>
                    </div>

                    <div class="bog-results">
                        <div class="bog-stat-label">Your Score</div>
                        <div class="bog-score">${score}</div>
                        ${isNewHighScore ? `<div style="color: #f9df6d; font-weight: bold; margin-bottom: 0.5rem;">🏆 NEW HIGH SCORE! 🏆</div>` : `<div style="color: #888; margin-bottom: 0.5rem;">Best: ${highScore}</div>`}
                        <div style="color: #888; margin-bottom: 1rem;">
                            ${foundWords.size} words found | ${allValidWords.length} possible
                        </div>

                        ${foundArr.length > 0 ? `
                            <div class="bog-found-words" style="text-align: left;">
                                <div class="bog-found-title">Your Words:</div>
                                <div class="bog-words-list">
                                    ${foundArr.map(w => `<span class="bog-word-tag">${w}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${missedWords.length > 0 ? `
                            <div class="bog-missed-words" style="text-align: left;">
                                <div class="bog-missed-title">Some words you missed:</div>
                                <div class="bog-missed-list">
                                    ${missedWords.map(w => `<span class="bog-missed-tag">${w}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="bog-actions" style="margin-top: 1.5rem;">
                            <button class="bog-btn primary" onclick="window.boggleGame.startGame()">Play Again</button>
                            <button class="bog-btn secondary" onclick="window.boggleGame.showMenu()">Menu</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        showMenu();
    }

    // Expose functions
    window.boggleGame = {
        init,
        showMenu,
        startGame,
        selectCell,
        submitWord,
        clearSelection,
        updateSettings,
        confirmQuit
    };

    window.launchBoggle = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('boggleGame').style.display = 'block';
        init();
    };

    window.exitBoggle = function() {
        stopTimer();
        removeKeyboardListener();
        document.getElementById('boggleGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

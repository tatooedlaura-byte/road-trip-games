// Anagrams Game
(function() {
    'use strict';

    // Common words to use as source words (6-8 letters, good for anagrams)
    const SOURCE_WORDS = [
        'STRANGE', 'PIRATES', 'STORIED', 'PAINTER', 'TOENAIL', 'STORAGE',
        'TRADING', 'CRASHED', 'STARRED', 'TREASON', 'DETAILS', 'TEASING',
        'RELATED', 'COASTER', 'ROASTED', 'PRESENT', 'RENTALS', 'SALTIER',
        'SLITHER', 'HOLSTER', 'SHORTIE', 'CORNETS', 'SECTION', 'RETINAS',
        'NASTIER', 'ANGRIEST', 'ORGANIST', 'ROASTING', 'TANGIERS', 'ALERTING',
        'RELATING', 'TRIANGLE', 'INTEGRAL', 'STEALING', 'GELATINS', 'ENTRAILS',
        'LATRINES', 'RATLINES', 'ORIENTAL', 'RELATION', 'DELATION', 'ASTEROID',
        'SEDATION', 'ASTONIED', 'TOADIES', 'IODATES', 'DONATES', 'TOASTED',
        'SALTINE', 'SALIENT', 'ENTAILS', 'SLAINTE', 'TENAILS', 'ELASTIN',
        'PARTIES', 'PASTIER', 'TRAIPSE', 'PIRATES', 'PRATIES', 'PIASTRE',
        'ORBITED', 'DEORBIT', 'CREDITS', 'DIRECTS', 'DANCERS', 'DOMAINS',
        'DAIMONS', 'STADIUM', 'AUDITOR', 'CURIOUS', 'STUDIOS', 'OUTLAWS'
    ];

    let wordList = new Set();
    let currentLetters = [];
    let sourceWord = '';
    let foundWords = new Set();
    let allValidWords = [];
    let timerInterval = null;
    let timeRemaining = 0;
    let gameActive = false;
    let hintsUsed = 0;
    let highScore = parseInt(localStorage.getItem('anagramsHighScore')) || 0;

    let gameSettings = {
        wordLength: 7,
        timeLimit: 120,
        mode: 'timed' // 'timed' or 'zen'
    };

    // Inject CSS styles
    const styleId = 'anagrams-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .ana-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                user-select: none;
                -webkit-user-select: none;
            }

            .ana-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                padding-top: 3rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .ana-back-btn {
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

            .ana-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .ana-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .ana-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .ana-timer {
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
                color: #00ff88;
            }

            .ana-timer.warning { color: #ffa500; }
            .ana-timer.danger { color: #ff4444; animation: pulse 0.5s infinite; }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .ana-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 1rem;
            }

            .ana-stat {
                text-align: center;
            }

            .ana-stat-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: #a855f7;
            }

            .ana-stat-label {
                font-size: 0.8rem;
                color: #888;
            }

            .ana-letters-container {
                display: flex;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .ana-letters {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .ana-letter {
                width: 48px;
                height: 48px;
                background: linear-gradient(145deg, #a855f7 0%, #ec4899 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                cursor: pointer;
                transition: transform 0.15s, opacity 0.15s;
                box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
            }

            .ana-letter:hover {
                transform: scale(1.1);
            }

            .ana-letter.used {
                opacity: 0.3;
                transform: scale(0.9);
                cursor: not-allowed;
            }

            .ana-letter.used:hover {
                transform: scale(0.9);
            }

            .ana-input-area {
                display: flex;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .ana-current-word {
                display: flex;
                gap: 6px;
                min-height: 52px;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
            }

            .ana-current-letter {
                width: 44px;
                height: 44px;
                background: rgba(168, 85, 247, 0.2);
                border: 2px solid #a855f7;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                font-weight: bold;
                color: #a855f7;
                cursor: pointer;
                transition: transform 0.15s;
            }

            .ana-current-letter:hover {
                transform: scale(1.1);
                background: rgba(168, 85, 247, 0.3);
            }

            .ana-message {
                text-align: center;
                font-size: 0.9rem;
                min-height: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .ana-message.success { color: #00ff88; }
            .ana-message.error { color: #ff6b6b; }

            .ana-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .ana-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .ana-btn:hover { transform: translateY(-2px); }
            .ana-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

            .ana-btn.primary {
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                color: white;
            }

            .ana-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .ana-found-words {
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                padding: 1rem;
                max-height: 150px;
                overflow-y: auto;
            }

            .ana-found-title {
                font-size: 0.9rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .ana-words-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 0.5rem;
            }

            .ana-word-tag {
                background: rgba(168, 85, 247, 0.2);
                color: #a855f7;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 500;
                text-align: center;
            }

            .ana-word-tag.long {
                background: rgba(0, 255, 136, 0.2);
                color: #00ff88;
            }

            .ana-menu {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                padding: 1rem 0;
            }

            .ana-menu-btn {
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .ana-menu-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }

            .ana-menu-btn.primary {
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                color: white;
            }

            .ana-menu-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .ana-settings {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .ana-settings-title {
                font-size: 1rem;
                margin-bottom: 1rem;
                color: #888;
            }

            .ana-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
            }

            .ana-setting-label { font-size: 0.9rem; }

            .ana-setting-select {
                padding: 0.5rem;
                border-radius: 8px;
                border: 1px solid #444;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
            }

            .ana-rules {
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .ana-rules h4 {
                margin: 0 0 0.5rem 0;
                color: #a855f7;
            }

            .ana-rules ul {
                margin: 0;
                padding-left: 1.2rem;
            }

            .ana-results {
                text-align: center;
            }

            .ana-score {
                font-size: 3rem;
                font-weight: bold;
                color: #a855f7;
                margin: 0.5rem 0;
            }

            .ana-missed-words {
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                padding: 1rem;
                margin-top: 1rem;
                max-height: 200px;
                overflow-y: auto;
                text-align: left;
            }

            .ana-missed-title {
                font-size: 0.9rem;
                color: #888;
                margin-bottom: 0.5rem;
            }

            .ana-missed-tag {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                display: inline-block;
                margin: 0.2rem;
            }

            .ana-loading {
                text-align: center;
                padding: 3rem;
                color: #888;
            }

            .ana-shuffle-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                margin-left: 0.5rem;
            }

            .ana-shuffle-btn:hover {
                background: rgba(255,255,255,0.2);
            }
        `;
        document.head.appendChild(style);
    }

    async function loadWordList() {
        if (wordList.size > 0) return;

        try {
            const response = await fetch('./data/ghost-words.txt');
            const text = await response.text();
            const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length >= 3);
            wordList = new Set(words);
            console.log(`Loaded ${wordList.size} words for Anagrams`);
        } catch (error) {
            console.error('Failed to load word list:', error);
        }
    }

    function canMakeWord(word, availableLetters) {
        const letterCount = {};
        for (const letter of availableLetters) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }

        for (const letter of word) {
            if (!letterCount[letter] || letterCount[letter] === 0) {
                return false;
            }
            letterCount[letter]--;
        }
        return true;
    }

    function findAllValidWords(letters) {
        const validWords = [];
        const letterArr = letters.split('');

        for (const word of wordList) {
            if (word.length >= 3 && word.length <= letters.length && canMakeWord(word, letterArr)) {
                validWords.push(word);
            }
        }

        return validWords.sort((a, b) => b.length - a.length || a.localeCompare(b));
    }

    function shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function getRandomSourceWord() {
        const filtered = SOURCE_WORDS.filter(w => w.length === gameSettings.wordLength);
        if (filtered.length === 0) {
            return SOURCE_WORDS[Math.floor(Math.random() * SOURCE_WORDS.length)];
        }
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (gameSettings.mode === 'zen') return;

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
        const timerEl = document.getElementById('anaTimer');
        if (timerEl) {
            if (gameSettings.mode === 'zen') {
                timerEl.textContent = '∞';
                timerEl.className = 'ana-timer';
            } else {
                timerEl.textContent = formatTime(timeRemaining);
                timerEl.className = 'ana-timer';
                if (timeRemaining <= 10) {
                    timerEl.classList.add('danger');
                } else if (timeRemaining <= 30) {
                    timerEl.classList.add('warning');
                }
            }
        }
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function handleKeydown(e) {
        if (!gameActive) return;

        const key = e.key.toUpperCase();

        // Enter to submit
        if (e.key === 'Enter') {
            e.preventDefault();
            submitWord();
            return;
        }

        // Backspace to remove last letter
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (currentWord.length > 0) {
                unselectLetter(currentWord.length - 1);
            }
            return;
        }

        // Letter keys - find first available matching letter
        if (/^[A-Z]$/.test(key)) {
            e.preventDefault();
            for (let i = 0; i < currentLetters.length; i++) {
                if (currentLetters[i] === key && !selectedIndices.includes(i)) {
                    selectLetter(i);
                    break;
                }
            }
        }
    }

    let selectedIndices = [];
    let currentWord = [];

    function selectLetter(index) {
        if (!gameActive) return;
        if (selectedIndices.includes(index)) return;

        selectedIndices.push(index);
        currentWord.push(currentLetters[index]);
        updateDisplay();
    }

    function unselectLetter(position) {
        if (!gameActive) return;

        const index = selectedIndices[position];
        selectedIndices.splice(position, 1);
        currentWord.splice(position, 1);
        updateDisplay();
    }

    function updateDisplay() {
        // Update letter tiles
        const letterEls = document.querySelectorAll('.ana-letter');
        letterEls.forEach((el, i) => {
            if (selectedIndices.includes(i)) {
                el.classList.add('used');
            } else {
                el.classList.remove('used');
            }
        });

        // Update current word display
        const currentWordEl = document.getElementById('anaCurrentWord');
        if (currentWordEl) {
            if (currentWord.length === 0) {
                currentWordEl.innerHTML = '<span style="color: #666;">Tap letters to spell words</span>';
            } else {
                currentWordEl.innerHTML = currentWord.map((letter, i) => `
                    <div class="ana-current-letter" onclick="window.anagramsGame.unselectLetter(${i})">${letter}</div>
                `).join('');
            }
        }
    }

    function submitWord() {
        if (!gameActive || currentWord.length < 3) {
            showMessage('Words must be 3+ letters', 'error');
            return;
        }

        const word = currentWord.join('');

        if (foundWords.has(word)) {
            showMessage('Already found!', 'error');
            clearWord();
            return;
        }

        if (!wordList.has(word)) {
            showMessage('Not a valid word', 'error');
            clearWord();
            return;
        }

        foundWords.add(word);
        const points = word.length >= sourceWord.length ? word.length * 2 : word.length;
        showMessage(`+${points} points!`, 'success');
        updateFoundWords();
        updateScore();
        clearWord();

        // Check if found the source word
        if (word === sourceWord) {
            showMessage('🎉 Found the main word! +BONUS!', 'success');
        }
    }

    function clearWord() {
        selectedIndices = [];
        currentWord = [];
        updateDisplay();
    }

    function shuffleLetters() {
        currentLetters = shuffleArray(currentLetters);
        clearWord();
        renderLetters();
    }

    function renderLetters() {
        const container = document.getElementById('anaLetters');
        if (container) {
            container.innerHTML = currentLetters.map((letter, i) => `
                <div class="ana-letter" onclick="window.anagramsGame.selectLetter(${i})">${letter}</div>
            `).join('');
        }
        updateDisplay();
    }

    function showMessage(text, type = '') {
        const msgEl = document.getElementById('anaMessage');
        if (msgEl) {
            msgEl.textContent = text;
            msgEl.className = 'ana-message ' + type;
            setTimeout(() => {
                if (msgEl.textContent === text) {
                    msgEl.textContent = '';
                    msgEl.className = 'ana-message';
                }
            }, 2000);
        }
    }

    function calculateScore() {
        let score = 0;
        foundWords.forEach(word => {
            const points = word.length >= sourceWord.length ? word.length * 2 : word.length;
            score += points;
        });
        return score;
    }

    function updateScore() {
        const scoreEl = document.getElementById('anaScore');
        if (scoreEl) {
            scoreEl.textContent = calculateScore();
        }

        const countEl = document.getElementById('anaWordCount');
        if (countEl) {
            countEl.textContent = foundWords.size;
        }
    }

    function updateFoundWords() {
        const listEl = document.getElementById('anaWordsList');
        if (listEl) {
            const sorted = Array.from(foundWords).sort((a, b) => a.localeCompare(b));
            listEl.innerHTML = sorted.map(w => `
                <span class="ana-word-tag ${w.length >= sourceWord.length ? 'long' : ''}">${w}</span>
            `).join('');
        }
    }

    function showMenu() {
        stopTimer();
        gameActive = false;

        const container = document.getElementById('anagramsContent');
        container.innerHTML = `
            <div class="ana-container">
                <div class="ana-card">
                    <button class="game-back-btn" onclick="exitAnagrams()">← Back</button>

                    <div class="ana-header">
                        <h1 class="ana-title">Anagrams</h1>
                    </div>

                    <div class="ana-rules">
                        <h4>How to Play</h4>
                        <ul>
                            <li>Make as many words as you can from the letters</li>
                            <li>Tap letters to build words, tap again to remove</li>
                            <li>Find the original word for bonus points!</li>
                            <li>Longer words = more points</li>
                        </ul>
                    </div>

                    <div class="ana-menu">
                        <button class="ana-menu-btn primary" onclick="window.anagramsGame.startGame()">
                            ▶️ Start Game
                        </button>
                    </div>

                    <div class="ana-settings">
                        <div class="ana-settings-title">Settings</div>

                        <div class="ana-setting-row">
                            <span class="ana-setting-label">Letters</span>
                            <select class="ana-setting-select" id="anaWordLength" onchange="window.anagramsGame.updateSettings()">
                                <option value="6">6 letters</option>
                                <option value="7" selected>7 letters</option>
                                <option value="8">8 letters</option>
                            </select>
                        </div>

                        <div class="ana-setting-row">
                            <span class="ana-setting-label">Mode</span>
                            <select class="ana-setting-select" id="anaMode" onchange="window.anagramsGame.updateSettings()">
                                <option value="timed" selected>Timed (2 min)</option>
                                <option value="zen">Zen (no timer)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateSettings() {
        const lengthEl = document.getElementById('anaWordLength');
        const modeEl = document.getElementById('anaMode');

        if (lengthEl) gameSettings.wordLength = parseInt(lengthEl.value);
        if (modeEl) gameSettings.mode = modeEl.value;
    }

    async function startGame() {
        const container = document.getElementById('anagramsContent');
        container.innerHTML = `
            <div class="ana-container">
                <div class="ana-card">
                    <div class="ana-loading">
                        <p>Loading words...</p>
                    </div>
                </div>
            </div>
        `;

        await loadWordList();

        sourceWord = getRandomSourceWord();
        currentLetters = shuffleArray(sourceWord.split(''));
        foundWords = new Set();
        selectedIndices = [];
        currentWord = [];
        hintsUsed = 0;
        gameActive = true;

        // Add keyboard support
        document.addEventListener('keydown', handleKeydown);

        allValidWords = findAllValidWords(sourceWord);

        container.innerHTML = `
            <div class="ana-container">
                <div class="ana-card">
                    <button class="game-back-btn" onclick="window.anagramsGame.confirmQuit()">← Quit</button>

                    <div class="ana-timer" id="anaTimer">${gameSettings.mode === 'zen' ? '∞' : formatTime(gameSettings.timeLimit)}</div>

                    <div class="ana-stats">
                        <div class="ana-stat">
                            <div class="ana-stat-value" id="anaScore">0</div>
                            <div class="ana-stat-label">Points</div>
                        </div>
                        <div class="ana-stat">
                            <div class="ana-stat-value" style="color: #f9df6d;">${highScore}</div>
                            <div class="ana-stat-label">Best</div>
                        </div>
                        <div class="ana-stat">
                            <div class="ana-stat-value" id="anaWordCount">0</div>
                            <div class="ana-stat-label">Words</div>
                        </div>
                    </div>

                    <div class="ana-letters-container">
                        <div class="ana-letters" id="anaLetters">
                            ${currentLetters.map((letter, i) => `
                                <div class="ana-letter" onclick="window.anagramsGame.selectLetter(${i})">${letter}</div>
                            `).join('')}
                        </div>
                        <button class="ana-shuffle-btn" onclick="window.anagramsGame.shuffleLetters()" title="Shuffle">🔀</button>
                    </div>

                    <div class="ana-input-area">
                        <div class="ana-current-word" id="anaCurrentWord">
                            <span style="color: #666;">Tap letters to spell words</span>
                        </div>
                    </div>

                    <div class="ana-message" id="anaMessage"></div>

                    <div class="ana-actions">
                        <button class="ana-btn primary" onclick="window.anagramsGame.submitWord()">Submit</button>
                        <button class="ana-btn secondary" onclick="window.anagramsGame.clearWord()">Clear</button>
                        ${gameSettings.mode === 'zen' ? `
                            <button class="ana-btn secondary" onclick="window.anagramsGame.endGame()">Done</button>
                        ` : ''}
                    </div>

                    <div class="ana-found-words">
                        <div class="ana-found-title">Found Words:</div>
                        <div class="ana-words-grid" id="anaWordsList"></div>
                    </div>
                </div>
            </div>
        `;

        startTimer();
    }

    function confirmQuit() {
        if (confirm('Quit game? Your progress will be lost.')) {
            stopTimer();
            gameActive = false;
            showMenu();
        }
    }

    function endGame() {
        stopTimer();
        gameActive = false;
        document.removeEventListener('keydown', handleKeydown);

        const score = calculateScore();
        const isNewHighScore = score > highScore;
        if (isNewHighScore) {
            highScore = score;
            localStorage.setItem('anagramsHighScore', highScore);
        }

        const missedWords = allValidWords.filter(w => !foundWords.has(w)).slice(0, 40);
        const foundArr = Array.from(foundWords).sort((a, b) => a.localeCompare(b));
        const foundSourceWord = foundWords.has(sourceWord);

        const container = document.getElementById('anagramsContent');
        container.innerHTML = `
            <div class="ana-container">
                <div class="ana-card">
                    <div class="ana-header">
                        <h1 class="ana-title">Results</h1>
                    </div>

                    <div class="ana-results">
                        <div style="margin-bottom: 1rem;">
                            <div style="color: #888; font-size: 0.9rem;">The word was:</div>
                            <div style="font-size: 2rem; font-weight: bold; color: ${foundSourceWord ? '#00ff88' : '#a855f7'}; letter-spacing: 4px;">
                                ${sourceWord} ${foundSourceWord ? '✓' : ''}
                            </div>
                        </div>

                        <div class="ana-stat-label">Your Score</div>
                        <div class="ana-score">${score}</div>
                        ${isNewHighScore ? `<div style="color: #f9df6d; font-weight: bold; margin-bottom: 0.5rem;">🏆 NEW HIGH SCORE! 🏆</div>` : `<div style="color: #888; margin-bottom: 0.5rem;">Best: ${highScore}</div>`}
                        <div style="color: #888; margin-bottom: 1rem;">
                            ${foundWords.size} of ${allValidWords.length} words found
                        </div>

                        ${foundArr.length > 0 ? `
                            <div class="ana-found-words" style="text-align: left; max-height: 120px;">
                                <div class="ana-found-title">Your Words:</div>
                                <div class="ana-words-grid">
                                    ${foundArr.map(w => `<span class="ana-word-tag ${w.length >= sourceWord.length ? 'long' : ''}">${w}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${missedWords.length > 0 ? `
                            <div class="ana-missed-words">
                                <div class="ana-missed-title">Some words you missed:</div>
                                ${missedWords.map(w => `<span class="ana-missed-tag">${w}</span>`).join('')}
                            </div>
                        ` : ''}

                        <div class="ana-actions" style="margin-top: 1.5rem;">
                            <button class="ana-btn primary" onclick="window.anagramsGame.startGame()">Play Again</button>
                            <button class="ana-btn secondary" onclick="window.anagramsGame.showMenu()">Menu</button>
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
    window.anagramsGame = {
        init,
        showMenu,
        startGame,
        selectLetter,
        unselectLetter,
        submitWord,
        clearWord,
        shuffleLetters,
        updateSettings,
        confirmQuit,
        endGame
    };

    window.launchAnagrams = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('anagramsGame').style.display = 'block';
        init();
    };

    window.exitAnagrams = function() {
        stopTimer();
        document.removeEventListener('keydown', handleKeydown);
        document.getElementById('anagramsGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

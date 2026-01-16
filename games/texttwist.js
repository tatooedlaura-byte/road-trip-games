// Text Twist Game - Find all words, must find the big word to advance
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'texttwist-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .texttwist-game {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .texttwist-back-btn {
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
            }

            .texttwist-header {
                text-align: center;
                margin-bottom: 1rem;
                padding-top: 1rem;
            }

            .texttwist-header h2 {
                font-size: 1.8rem;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .texttwist-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }

            .texttwist-stats span {
                color: rgba(255,255,255,0.7);
            }

            .texttwist-stats strong {
                color: #00ff88;
            }

            .texttwist-timer {
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                color: #00d9ff;
                margin-bottom: 1rem;
            }

            .texttwist-timer.warning {
                color: #ffd93d;
            }

            .texttwist-timer.danger {
                color: #ff6b6b;
            }

            .texttwist-word-slots {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1.5rem;
                min-height: 80px;
            }

            .texttwist-word-group {
                display: flex;
                flex-wrap: wrap;
                gap: 0.3rem;
                justify-content: center;
                margin-bottom: 0.5rem;
            }

            .texttwist-word-slot {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 4px;
                padding: 0.3rem 0.5rem;
                font-size: 0.8rem;
                min-width: 60px;
                text-align: center;
                font-family: monospace;
            }

            .texttwist-word-slot.found {
                background: rgba(0, 255, 136, 0.2);
                border-color: #00ff88;
                color: #00ff88;
            }

            .texttwist-word-slot.big-word {
                border-color: #ffd93d;
            }

            .texttwist-word-slot.big-word.found {
                background: rgba(255, 217, 61, 0.2);
                border-color: #ffd93d;
                color: #ffd93d;
            }

            .texttwist-current {
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                letter-spacing: 0.5rem;
                margin-bottom: 1rem;
                min-height: 3rem;
                color: #00d9ff;
            }

            .texttwist-letters {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }

            .texttwist-letter {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(145deg, #4a5568, #2d3748);
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }

            .texttwist-letter:hover:not(:disabled) {
                transform: translateY(-3px);
                box-shadow: 0 6px 8px rgba(0,0,0,0.4);
            }

            .texttwist-letter:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .texttwist-letter.selected {
                background: linear-gradient(145deg, #00d9ff, #0099cc);
                transform: scale(0.9);
            }

            .texttwist-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .tt-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tt-btn:hover:not(:disabled) {
                transform: translateY(-2px);
            }

            .tt-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tt-btn.primary {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .tt-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .texttwist-message {
                text-align: center;
                min-height: 1.5rem;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }

            .texttwist-message.success {
                color: #00ff88;
            }

            .texttwist-message.error {
                color: #ff6b6b;
            }

            .texttwist-message.warning {
                color: #ffd93d;
            }

            .texttwist-message.bonus {
                color: #00d9ff;
            }

            .texttwist-bonus-words {
                display: flex;
                flex-wrap: wrap;
                gap: 0.3rem;
                justify-content: center;
                margin-top: 0.5rem;
            }

            .texttwist-bonus-words span {
                background: rgba(0, 217, 255, 0.2);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                color: #00d9ff;
            }

            .texttwist-gameover {
                text-align: center;
                padding: 1.5rem;
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
            }

            .texttwist-gameover h3 {
                font-size: 1.5rem;
                margin: 0 0 1rem 0;
            }

            .texttwist-gameover.won h3 {
                color: #00ff88;
            }

            .texttwist-gameover.lost h3 {
                color: #ff6b6b;
            }

            .texttwist-gameover p {
                margin: 0.5rem 0;
                color: rgba(255,255,255,0.7);
            }

            .texttwist-missed {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
            }

            .texttwist-missed h4 {
                margin: 0 0 0.5rem 0;
                color: rgba(255,255,255,0.7);
                font-size: 0.9rem;
            }

            .texttwist-missed-words {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
            }

            .texttwist-missed-words span {
                background: rgba(255,107,107,0.2);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }

    // 6-letter word puzzles with valid sub-words
    const PUZZLES = [
        { letters: 'TRAVEL', words: ['TRAVEL', 'LATER', 'ALTER', 'ALERT', 'RATE', 'LATE', 'TALE', 'REAL', 'TEAR', 'VEAL', 'ATE', 'EAT', 'EAR', 'ARE', 'ART', 'RAT', 'TAR', 'LET', 'ALE'] },
        { letters: 'GARDEN', words: ['GARDEN', 'DANGER', 'GANDER', 'GRADE', 'GRAND', 'RANGE', 'RAGED', 'ANGER', 'DEAR', 'DARE', 'DRAG', 'GEAR', 'RANG', 'READ', 'NEAR', 'EARN', 'AND', 'AGE', 'ARE', 'EAR', 'END', 'RED', 'DEN', 'RAN'] },
        { letters: 'STRIPE', words: ['STRIPE', 'PRIEST', 'RIPEST', 'SPRITE', 'TRIPS', 'STRIP', 'SPITE', 'SPIRE', 'TIRES', 'TRIES', 'RIPES', 'PIER', 'PIES', 'RIPE', 'RISE', 'TIRE', 'TIER', 'SPIT', 'TIPS', 'TRIP', 'STEP', 'PEST', 'REST', 'SIP', 'TIP', 'SIT', 'SET', 'PET', 'PIE', 'RIP'] },
        { letters: 'STREAM', words: ['STREAM', 'MASTER', 'SMART', 'STEAM', 'TEAMS', 'MATES', 'MEATS', 'TRAMS', 'MARS', 'STAR', 'RATS', 'TARS', 'ARTS', 'MAST', 'MEAT', 'TEAM', 'MATE', 'SEAM', 'SAME', 'EAT', 'ATE', 'ARE', 'EAR', 'ARM', 'ART', 'RAT', 'SAT', 'SET', 'SEA', 'MAT'] },
        { letters: 'LISTEN', words: ['LISTEN', 'SILENT', 'TINSEL', 'ENLIST', 'INLET', 'TILES', 'LINES', 'LIENS', 'LIST', 'SLIT', 'SILT', 'LENS', 'LENT', 'NEST', 'NETS', 'TENS', 'SENT', 'LINE', 'TILE', 'LITE', 'SITE', 'TIN', 'SIT', 'SET', 'LET', 'NET', 'TEN', 'SIN', 'NIL', 'LIE'] },
        { letters: 'PLANES', words: ['PLANES', 'NAPLES', 'PANELS', 'PLANE', 'PANEL', 'PENAL', 'LANES', 'LEANS', 'PALES', 'LEAPS', 'PLAN', 'LANE', 'LEAN', 'PALE', 'LEAP', 'SEAL', 'SALE', 'PANS', 'NAPS', 'SNAP', 'SPAN', 'PAN', 'NAP', 'SAP', 'LAP', 'ALE', 'PEA', 'SEA'] },
        { letters: 'WINTER', words: ['WINTER', 'TWINER', 'WRITE', 'WINER', 'TWINE', 'INTER', 'INERT', 'TRINE', 'WIRE', 'WINE', 'WRIT', 'TIER', 'TIRE', 'RITE', 'RENT', 'TWIN', 'WREN', 'NEWT', 'WIT', 'WIN', 'WET', 'NEW', 'NET', 'TEN', 'TIN', 'NIT'] },
        { letters: 'SPRING', words: ['SPRING', 'GRIPS', 'PRIGS', 'SPRIG', 'RINGS', 'GIRNS', 'GRINS', 'PINGS', 'GRIP', 'GRIN', 'RING', 'SING', 'PINS', 'SPIN', 'SNIP', 'RIGS', 'PIGS', 'GIN', 'PIN', 'SIN', 'SIP', 'RIG', 'PIG', 'NIP', 'RIP'] },
        { letters: 'CHASTE', words: ['CHASTE', 'CHEATS', 'SACHET', 'CHASE', 'CHEAT', 'TEACH', 'CHEST', 'HASTE', 'HEATS', 'HATES', 'CASTE', 'CASH', 'CAST', 'CATS', 'CHAT', 'EACH', 'ETCH', 'HATE', 'HEAT', 'SEAT', 'EATS', 'ACHE', 'ACE', 'ACT', 'ATE', 'EAT', 'HAS', 'HAT', 'SET', 'SAT', 'SEA', 'TEA', 'THE'] },
        { letters: 'MINGLE', words: ['MINGLE', 'LIMING', 'GRIME', 'LIMEN', 'MELON', 'LEMON', 'MINE', 'LINE', 'LIME', 'MILE', 'GLEN', 'GRIM', 'LIMN', 'LING', 'GLIM', 'GIN', 'GEM', 'LEG', 'LIE', 'MEN', 'NIL'] }
    ];

    let currentPuzzle = null;
    let currentWord = '';
    let foundWords = new Set();
    let bonusWords = new Set();
    let selectedIndices = [];
    let shuffledLetters = [];
    let timeRemaining = 120;
    let timerInterval = null;
    let gameOver = false;
    let level = 1;
    let totalScore = 0;
    let bonusScore = 0;
    let highScore = parseInt(localStorage.getItem('textTwistHighScore')) || 0;
    let message = '';
    let messageType = '';
    let dictionary = new Set();

    // Load dictionary for bonus word validation
    async function loadDictionary() {
        if (dictionary.size > 0) return;

        try {
            const response = await fetch('./data/ghost-words.txt');
            const text = await response.text();
            const words = text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length >= 3);
            dictionary = new Set(words);
            console.log(`Loaded ${dictionary.size} words for Text Twist`);
        } catch (error) {
            console.error('Failed to load dictionary:', error);
        }
    }

    // Check if a word can be made from available letters
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

    async function init() {
        level = 1;
        totalScore = 0;
        bonusScore = 0;
        await loadDictionary();
        startNewRound();
    }

    function startNewRound() {
        currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        shuffledLetters = shuffleArray([...currentPuzzle.letters]);
        currentWord = '';
        foundWords = new Set();
        bonusWords = new Set();
        selectedIndices = [];
        timeRemaining = 120;
        gameOver = false;
        message = '';
        messageType = '';
        startTimer();
        render();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        stopTimer();
        timerInterval = setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                endGame(false);
            }
            render();
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function selectLetter(index) {
        if (gameOver || selectedIndices.includes(index)) return;

        selectedIndices.push(index);
        currentWord += shuffledLetters[index];
        message = '';
        render();
    }

    function clearWord() {
        currentWord = '';
        selectedIndices = [];
        message = '';
        render();
    }

    function twist() {
        shuffledLetters = shuffleArray([...shuffledLetters]);
        render();
    }

    function submitWord() {
        if (currentWord.length < 3) {
            message = 'Words must be at least 3 letters';
            messageType = 'error';
            render();
            return;
        }

        if (foundWords.has(currentWord) || bonusWords.has(currentWord)) {
            message = 'Already found!';
            messageType = 'error';
            clearWord();
            return;
        }

        if (currentPuzzle.words.includes(currentWord)) {
            // It's a puzzle word
            foundWords.add(currentWord);
            totalScore += currentWord.length * 10;
            message = `+${currentWord.length * 10} points!`;
            messageType = 'success';

            // Check if found the big word
            if (currentWord.length === 6) {
                message = 'Big word found! Level complete!';
                messageType = 'warning';
            }

            // Check if all words found
            if (foundWords.size === currentPuzzle.words.length) {
                endGame(true, true);
            }
        } else if (dictionary.has(currentWord) && canMakeWord(currentWord, currentPuzzle.letters.split(''))) {
            // It's a valid bonus word from the dictionary
            bonusWords.add(currentWord);
            const bonus = currentWord.length * 5;
            bonusScore += bonus;
            totalScore += bonus;
            message = `Bonus word! +${bonus} points!`;
            messageType = 'bonus';
        } else {
            message = 'Not a valid word';
            messageType = 'error';
        }

        clearWord();
    }

    function endGame(won, allFound = false) {
        stopTimer();
        gameOver = true;

        // Update high score if beaten
        if (totalScore > highScore) {
            highScore = totalScore;
            localStorage.setItem('textTwistHighScore', highScore);
        }

        if (won && !allFound) {
            // Found big word, can advance
            level++;
        }

        render();
    }

    function nextLevel() {
        startNewRound();
    }

    function hasBigWord() {
        return [...foundWords].some(w => w.length === 6);
    }

    function render() {
        const container = document.getElementById('texttwist-container');
        if (!container) return;

        const bigWord = currentPuzzle.words.find(w => w.length === 6);
        const foundBigWord = foundWords.has(bigWord);

        // Group words by length
        const wordsByLength = {};
        currentPuzzle.words.forEach(word => {
            const len = word.length;
            if (!wordsByLength[len]) wordsByLength[len] = [];
            wordsByLength[len].push(word);
        });

        let timerClass = '';
        if (timeRemaining <= 10) timerClass = 'danger';
        else if (timeRemaining <= 30) timerClass = 'warning';

        container.innerHTML = `
            <div class="texttwist-game">
                <button class="game-back-btn" onclick="exitTextTwist()">← Back</button>

                <div class="texttwist-header">
                    <h2>Text Twist</h2>
                </div>

                <div class="texttwist-stats">
                    <span>Level: <strong>${level}</strong></span>
                    <span>Score: <strong>${totalScore}</strong></span>
                    <span>Best: <strong style="color: #f9df6d;">${highScore}</strong></span>
                    <span>Found: <strong>${foundWords.size}/${currentPuzzle.words.length}</strong></span>
                </div>

                ${!gameOver ? `
                    <div class="texttwist-timer ${timerClass}">${formatTime(timeRemaining)}</div>

                    <div class="texttwist-word-slots">
                        ${Object.keys(wordsByLength).sort((a, b) => b - a).map(len => `
                            <div class="texttwist-word-group">
                                ${wordsByLength[len].map(word => `
                                    <div class="texttwist-word-slot ${foundWords.has(word) ? 'found' : ''} ${word.length === 6 ? 'big-word' : ''}">
                                        ${foundWords.has(word) ? word : '?'.repeat(word.length)}
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>

                    <div class="texttwist-current">${currentWord || '&nbsp;'}</div>

                    <div class="texttwist-letters">
                        ${shuffledLetters.map((letter, i) => `
                            <button class="texttwist-letter ${selectedIndices.includes(i) ? 'selected' : ''}"
                                    onclick="window.TextTwistGame.selectLetter(${i})"
                                    ${selectedIndices.includes(i) ? 'disabled' : ''}>
                                ${letter}
                            </button>
                        `).join('')}
                    </div>

                    <div class="texttwist-message ${messageType}">${message}</div>

                    <div class="texttwist-actions">
                        <button class="tt-btn secondary" onclick="window.TextTwistGame.clearWord()">Clear</button>
                        <button class="tt-btn secondary" onclick="window.TextTwistGame.twist()">Twist</button>
                        <button class="tt-btn primary" onclick="window.TextTwistGame.submitWord()" ${currentWord.length < 3 ? 'disabled' : ''}>Enter</button>
                    </div>

                    ${foundBigWord ? `
                        <div style="text-align: center;">
                            <button class="tt-btn primary" onclick="window.TextTwistGame.nextLevel()">Next Level →</button>
                        </div>
                    ` : ''}
                ` : `
                    <div class="texttwist-gameover ${foundBigWord ? 'won' : 'lost'}">
                        <h3>${foundBigWord ? 'Level Complete!' : 'Time\'s Up!'}</h3>
                        <p>Words found: ${foundWords.size}/${currentPuzzle.words.length}</p>
                        ${bonusWords.size > 0 ? `<p>Bonus words: ${bonusWords.size}</p>` : ''}
                        <p>Score: ${totalScore}</p>
                        ${totalScore >= highScore && totalScore > 0 ? `<p style="color: #f9df6d; font-weight: bold;">🏆 NEW HIGH SCORE! 🏆</p>` : `<p>Best: ${highScore}</p>`}

                        ${!foundBigWord ? `
                            <div class="texttwist-missed">
                                <h4>The big word was:</h4>
                                <div class="texttwist-missed-words">
                                    <span style="font-size: 1.2rem; background: rgba(255,217,61,0.3);">${bigWord}</span>
                                </div>
                            </div>
                        ` : ''}

                        <div class="texttwist-missed">
                            <h4>Missed words:</h4>
                            <div class="texttwist-missed-words">
                                ${currentPuzzle.words.filter(w => !foundWords.has(w)).map(w => `<span>${w}</span>`).join('')}
                            </div>
                        </div>

                        ${bonusWords.size > 0 ? `
                            <div class="texttwist-missed">
                                <h4>Your bonus words:</h4>
                                <div class="texttwist-bonus-words">
                                    ${[...bonusWords].map(w => `<span>${w}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div style="margin-top: 1rem;">
                            <button class="tt-btn primary" onclick="window.TextTwistGame.newGame()">Play Again</button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    function newGame() {
        level = 1;
        totalScore = 0;
        bonusScore = 0;
        startNewRound();
    }

    // Keyboard support
    function handleKeydown(e) {
        if (gameOver) return;

        const key = e.key.toUpperCase();

        if (key === 'ENTER') {
            submitWord();
        } else if (key === 'BACKSPACE') {
            if (selectedIndices.length > 0) {
                selectedIndices.pop();
                currentWord = currentWord.slice(0, -1);
                render();
            }
        } else if (key === ' ') {
            twist();
        } else if (/^[A-Z]$/.test(key)) {
            // Find first unselected instance of this letter
            const index = shuffledLetters.findIndex((l, i) => l === key && !selectedIndices.includes(i));
            if (index !== -1) {
                selectLetter(index);
            }
        }
    }

    let keyboardActive = false;

    function addKeyboardListener() {
        if (!keyboardActive) {
            document.addEventListener('keydown', handleKeydown);
            keyboardActive = true;
        }
    }

    function removeKeyboardListener() {
        if (keyboardActive) {
            document.removeEventListener('keydown', handleKeydown);
            keyboardActive = false;
        }
    }

    // Expose functions
    window.TextTwistGame = {
        init,
        selectLetter,
        clearWord,
        twist,
        submitWord,
        nextLevel,
        newGame
    };

    window.launchTextTwist = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('textTwistGame').style.display = 'block';
        addKeyboardListener();
        init();
    };

    window.exitTextTwist = function() {
        stopTimer();
        removeKeyboardListener();
        document.getElementById('textTwistGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

// Scattergories Game
(function() {
    'use strict';

    // Category lists
    const CATEGORIES = [
        "Animal", "Food", "City", "Country", "Movie", "TV Show", "Song",
        "Boy's Name", "Girl's Name", "Occupation", "Sport", "Color",
        "Fruit", "Vegetable", "Clothing Item", "Body Part", "Vehicle",
        "Holiday", "School Subject", "Musical Instrument", "Book Title",
        "Restaurant", "Dessert", "Beverage", "Furniture", "Kitchen Item",
        "Toy", "Celebrity", "Band/Artist", "Something Cold", "Something Hot",
        "Something Soft", "Something You Shout", "Reason to be Late",
        "Thing at a Beach", "Thing at a Party", "Thing in a Pocket",
        "Superpower", "Cartoon Character", "Historical Figure", "Emotion",
        "College Major", "Pizza Topping", "Ice Cream Flavor", "Candy",
        "Type of Dance", "Thing in a Zoo", "Thing in a Hospital"
    ];

    // Letters - excluding Q, X, Z for easier gameplay (can be enabled)
    const EASY_LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWY'.split('');
    const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    let currentLetter = '';
    let currentCategories = [];
    let answers = {};
    let timerInterval = null;
    let timeRemaining = 0;
    let gameSettings = {
        numCategories: 6,
        timeLimit: 90,
        hardLetters: false
    };

    // Inject CSS styles
    const styleId = 'scattergories-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .scat-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
            }

            .scat-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .scat-back-btn {
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

            .scat-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .scat-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .scat-title {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .scat-letter-display {
                font-size: 4rem;
                font-weight: 900;
                text-align: center;
                margin: 1rem 0;
                color: #ffd700;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }

            .scat-timer {
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 1rem;
                color: #00ff88;
            }

            .scat-timer.warning {
                color: #ffa500;
            }

            .scat-timer.danger {
                color: #ff4444;
                animation: pulse 0.5s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .scat-categories {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .scat-category-row {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .scat-category-label {
                flex: 0 0 120px;
                font-size: 0.9rem;
                color: #aaa;
            }

            .scat-category-input {
                flex: 1;
                padding: 0.6rem 0.8rem;
                border: 2px solid #333;
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 1rem;
            }

            .scat-category-input:focus {
                outline: none;
                border-color: #00d9ff;
            }

            .scat-category-input:disabled {
                opacity: 0.6;
            }

            .scat-category-input.correct {
                border-color: #00ff88;
                background: rgba(0, 255, 136, 0.1);
            }

            .scat-category-input.incorrect {
                border-color: #ff4444;
                background: rgba(255, 68, 68, 0.1);
            }

            .scat-menu {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                padding: 1rem 0;
            }

            .scat-menu-btn {
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .scat-menu-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }

            .scat-menu-btn.primary {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .scat-menu-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .scat-settings {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .scat-settings-title {
                font-size: 1rem;
                margin-bottom: 1rem;
                color: #888;
            }

            .scat-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
            }

            .scat-setting-label {
                font-size: 0.9rem;
            }

            .scat-setting-select {
                padding: 0.5rem;
                border-radius: 8px;
                border: 1px solid #444;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
            }

            .scat-checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }

            .scat-checkbox {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            .scat-results {
                text-align: center;
            }

            .scat-score {
                font-size: 3rem;
                font-weight: bold;
                color: #ffd700;
                margin: 1rem 0;
            }

            .scat-score-label {
                font-size: 1.2rem;
                color: #888;
            }

            .scat-results-list {
                text-align: left;
                margin: 1.5rem 0;
            }

            .scat-result-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .scat-result-category {
                color: #888;
            }

            .scat-result-answer {
                font-weight: 500;
            }

            .scat-result-answer.valid {
                color: #00ff88;
            }

            .scat-result-answer.invalid {
                color: #ff4444;
                text-decoration: line-through;
            }

            .scat-btn-row {
                display: flex;
                gap: 0.75rem;
                margin-top: 1rem;
            }

            .scat-btn-row .scat-menu-btn {
                flex: 1;
            }

            .scat-game-actions {
                display: flex;
                gap: 0.75rem;
                margin-top: 1rem;
            }

            .scat-game-actions .scat-menu-btn {
                flex: 1;
                padding: 0.75rem;
                font-size: 1rem;
            }

            .scat-rules {
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .scat-rules h4 {
                margin: 0 0 0.5rem 0;
                color: #00d9ff;
            }

            .scat-rules ul {
                margin: 0;
                padding-left: 1.2rem;
            }

            .scat-rules li {
                margin-bottom: 0.25rem;
            }
        `;
        document.head.appendChild(style);
    }

    function getRandomLetter() {
        const letters = gameSettings.hardLetters ? ALL_LETTERS : EASY_LETTERS;
        return letters[Math.floor(Math.random() * letters.length)];
    }

    function getRandomCategories(count) {
        const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
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
        const timerEl = document.getElementById('scatTimer');
        if (timerEl) {
            timerEl.textContent = formatTime(timeRemaining);
            timerEl.className = 'scat-timer';
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

    function validateAnswer(answer, letter) {
        if (!answer || answer.trim() === '') return false;
        const trimmed = answer.trim().toUpperCase();
        return trimmed.startsWith(letter);
    }

    function calculateScore() {
        let score = 0;
        for (const category of currentCategories) {
            const answer = answers[category] || '';
            if (validateAnswer(answer, currentLetter)) {
                score++;
            }
        }
        return score;
    }

    function showMenu() {
        stopTimer();
        const container = document.getElementById('scattergoriesContent');
        container.innerHTML = `
            <div class="scat-container">
                <div class="scat-card">
                    <button class="scat-back-btn" onclick="exitScattergories()">← Back</button>

                    <div class="scat-header">
                        <h1 class="scat-title">Scattergories</h1>
                    </div>

                    <div class="scat-rules">
                        <h4>How to Play</h4>
                        <ul>
                            <li>You'll get a random letter and categories</li>
                            <li>Think of words starting with that letter for each category</li>
                            <li>Beat the clock!</li>
                            <li>Score 1 point for each valid answer</li>
                        </ul>
                    </div>

                    <div class="scat-menu">
                        <button class="scat-menu-btn primary" onclick="window.scattergoriesGame.startGame()">
                            ▶️ Start Game
                        </button>
                    </div>

                    <div class="scat-settings">
                        <div class="scat-settings-title">Settings</div>

                        <div class="scat-setting-row">
                            <span class="scat-setting-label">Categories</span>
                            <select class="scat-setting-select" id="numCategories" onchange="window.scattergoriesGame.updateSettings()">
                                <option value="4">4 (Quick)</option>
                                <option value="6" selected>6 (Standard)</option>
                                <option value="8">8 (Challenge)</option>
                                <option value="10">10 (Expert)</option>
                            </select>
                        </div>

                        <div class="scat-setting-row">
                            <span class="scat-setting-label">Time Limit</span>
                            <select class="scat-setting-select" id="timeLimit" onchange="window.scattergoriesGame.updateSettings()">
                                <option value="60">1 minute</option>
                                <option value="90" selected>1.5 minutes</option>
                                <option value="120">2 minutes</option>
                                <option value="180">3 minutes</option>
                            </select>
                        </div>

                        <div class="scat-setting-row">
                            <label class="scat-checkbox-label">
                                <input type="checkbox" class="scat-checkbox" id="hardLetters" onchange="window.scattergoriesGame.updateSettings()">
                                <span class="scat-setting-label">Include Q, X, Z</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateSettings() {
        const numCat = document.getElementById('numCategories');
        const timeEl = document.getElementById('timeLimit');
        const hardEl = document.getElementById('hardLetters');

        if (numCat) gameSettings.numCategories = parseInt(numCat.value);
        if (timeEl) gameSettings.timeLimit = parseInt(timeEl.value);
        if (hardEl) gameSettings.hardLetters = hardEl.checked;
    }

    function startGame() {
        currentLetter = getRandomLetter();
        currentCategories = getRandomCategories(gameSettings.numCategories);
        answers = {};

        const container = document.getElementById('scattergoriesContent');
        container.innerHTML = `
            <div class="scat-container">
                <div class="scat-card">
                    <button class="scat-back-btn" onclick="window.scattergoriesGame.confirmQuit()">← Quit</button>

                    <div class="scat-letter-display">${currentLetter}</div>
                    <div class="scat-timer" id="scatTimer">${formatTime(gameSettings.timeLimit)}</div>

                    <div class="scat-categories" id="scatCategories">
                        ${currentCategories.map((cat, i) => `
                            <div class="scat-category-row">
                                <span class="scat-category-label">${cat}</span>
                                <input type="text"
                                    class="scat-category-input"
                                    id="answer-${i}"
                                    placeholder="${currentLetter}..."
                                    oninput="window.scattergoriesGame.saveAnswer('${cat}', this.value)"
                                    autocomplete="off"
                                    autocapitalize="characters">
                            </div>
                        `).join('')}
                    </div>

                    <div class="scat-game-actions">
                        <button class="scat-menu-btn primary" onclick="window.scattergoriesGame.endGame()">
                            ✓ Done
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Focus first input
        setTimeout(() => {
            const firstInput = document.getElementById('answer-0');
            if (firstInput) firstInput.focus();
        }, 100);

        startTimer();
    }

    function saveAnswer(category, value) {
        answers[category] = value;
    }

    function confirmQuit() {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            stopTimer();
            showMenu();
        }
    }

    function endGame() {
        stopTimer();

        // Disable all inputs
        const inputs = document.querySelectorAll('.scat-category-input');
        inputs.forEach(input => input.disabled = true);

        const score = calculateScore();
        const total = currentCategories.length;

        const container = document.getElementById('scattergoriesContent');
        container.innerHTML = `
            <div class="scat-container">
                <div class="scat-card">
                    <div class="scat-header">
                        <h1 class="scat-title">Results</h1>
                    </div>

                    <div class="scat-results">
                        <div class="scat-letter-display" style="font-size: 2.5rem; margin: 0.5rem 0;">Letter: ${currentLetter}</div>
                        <div class="scat-score-label">Your Score</div>
                        <div class="scat-score">${score} / ${total}</div>

                        <div class="scat-results-list">
                            ${currentCategories.map(cat => {
                                const answer = answers[cat] || '';
                                const isValid = validateAnswer(answer, currentLetter);
                                return `
                                    <div class="scat-result-row">
                                        <span class="scat-result-category">${cat}</span>
                                        <span class="scat-result-answer ${isValid ? 'valid' : 'invalid'}">
                                            ${answer || '(empty)'}
                                            ${isValid ? '✓' : '✗'}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <div class="scat-btn-row">
                            <button class="scat-menu-btn primary" onclick="window.scattergoriesGame.startGame()">
                                🔄 Play Again
                            </button>
                            <button class="scat-menu-btn secondary" onclick="window.scattergoriesGame.showMenu()">
                                📋 Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        showMenu();
    }

    // Expose functions to window
    window.scattergoriesGame = {
        init,
        showMenu,
        startGame,
        endGame,
        saveAnswer,
        updateSettings,
        confirmQuit
    };

    window.launchScattergories = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('scattergoriesGame').style.display = 'block';
        init();
    };

    window.exitScattergories = function() {
        stopTimer();
        document.getElementById('scattergoriesGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

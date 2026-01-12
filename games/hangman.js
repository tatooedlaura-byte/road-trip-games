// Hangman Game - Classic word guessing
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'hangman-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .hangman-game {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
            }

            .hangman-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .hangman-header h2 {
                font-size: 1.8rem;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .hangman-stats {
                font-size: 0.9rem;
            }

            .hangman-stats .wins {
                color: #00ff88;
                margin-right: 1rem;
            }

            .hangman-stats .losses {
                color: #ff6b6b;
            }

            .hangman-category {
                text-align: center;
                margin-bottom: 1rem;
                color: rgba(255,255,255,0.7);
            }

            .hangman-category strong {
                color: #00d9ff;
            }

            .hangman-drawing {
                text-align: center;
                margin-bottom: 1rem;
            }

            .hangman-drawing pre {
                font-family: 'Courier New', monospace;
                font-size: 1rem;
                line-height: 1.2;
                color: #00ff88;
                margin: 0;
                display: inline-block;
                text-align: left;
            }

            .hangman-word {
                text-align: center;
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: 0.5rem;
                margin-bottom: 1rem;
                font-family: 'Courier New', monospace;
            }

            .hangman-guesses {
                text-align: center;
                margin-bottom: 1rem;
                color: rgba(255,255,255,0.7);
            }

            .hangman-keyboard {
                margin-bottom: 1rem;
            }

            .keyboard-row {
                display: flex;
                justify-content: center;
                gap: 0.3rem;
                margin-bottom: 0.3rem;
            }

            .hangman-keyboard .key {
                width: 2.2rem;
                height: 2.5rem;
                border: none;
                border-radius: 6px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .hangman-keyboard .key:hover:not(:disabled) {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }

            .hangman-keyboard .key.correct {
                background: #00ff88;
                color: #1a1a2e;
            }

            .hangman-keyboard .key.wrong {
                background: #ff6b6b;
                color: white;
            }

            .hangman-keyboard .key:disabled {
                cursor: not-allowed;
            }

            .hangman-result {
                text-align: center;
                padding: 1rem;
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .hangman-result.won h3 {
                color: #00ff88;
            }

            .hangman-result.lost h3 {
                color: #ff6b6b;
            }

            .hangman-result h3 {
                font-size: 1.5rem;
                margin: 0 0 0.5rem 0;
            }

            .hangman-result p {
                margin: 0 0 1rem 0;
                color: rgba(255,255,255,0.7);
            }

            .hangman-new-game-options {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }

            .hangman-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
                transition: all 0.2s ease;
            }

            .hangman-btn:hover {
                transform: translateY(-2px);
            }

            .hangman-category-select {
                text-align: center;
            }

            .hangman-category-select label {
                margin-right: 0.5rem;
                color: rgba(255,255,255,0.7);
            }

            .hangman-category-select select {
                padding: 0.5rem;
                border-radius: 6px;
                border: none;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
                cursor: pointer;
            }

            .hangman-category-select select option {
                background: #1a1a2e;
                color: white;
            }

            .hangman-back-btn {
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

            .hangman-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .hangman-game {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // Word categories with themed words
    const CATEGORIES = {
        "Animals": [
            "ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "BUTTERFLY", "KANGAROO",
            "ALLIGATOR", "CHEETAH", "GORILLA", "FLAMINGO", "HEDGEHOG", "OCTOPUS",
            "SQUIRREL", "TORTOISE", "WOLVERINE", "ARMADILLO", "CHAMELEON", "JELLYFISH"
        ],
        "Countries": [
            "AUSTRALIA", "BRAZIL", "CANADA", "DENMARK", "EGYPT", "FRANCE",
            "GERMANY", "HUNGARY", "ICELAND", "JAMAICA", "KENYA", "LEBANON",
            "MEXICO", "NORWAY", "PORTUGAL", "SINGAPORE", "THAILAND", "VIETNAM"
        ],
        "Movies": [
            "TITANIC", "AVATAR", "INCEPTION", "GLADIATOR", "JURASSIC",
            "MATRIX", "FROZEN", "SHREK", "ALADDIN", "CLUELESS", "GREASE",
            "JAWS", "ROCKY", "PSYCHO", "ALIEN", "PREDATOR", "TERMINATOR"
        ],
        "Food": [
            "PIZZA", "SPAGHETTI", "HAMBURGER", "TACOS", "SUSHI", "LASAGNA",
            "PANCAKES", "SANDWICH", "BURRITO", "CROISSANT", "WAFFLES", "PRETZEL",
            "QUESADILLA", "FALAFEL", "RAMEN", "DUMPLING", "ENCHILADA", "NACHOS"
        ],
        "Sports": [
            "BASKETBALL", "FOOTBALL", "BASEBALL", "VOLLEYBALL", "GYMNASTICS",
            "SWIMMING", "WRESTLING", "BADMINTON", "SNOWBOARDING", "SKATEBOARDING",
            "SURFING", "ARCHERY", "FENCING", "BOWLING", "LACROSSE", "CRICKET"
        ],
        "Landmarks": [
            "COLOSSEUM", "PYRAMIDS", "STONEHENGE", "ACROPOLIS", "KREMLIN",
            "ALHAMBRA", "PARTHENON", "MACHU", "ANGKOR", "PETRA",
            "VERSAILLES", "LOUVRE", "VATICAN", "EVEREST", "NIAGARA"
        ],
        "Music": [
            "GUITAR", "PIANO", "VIOLIN", "TRUMPET", "SAXOPHONE", "DRUMS",
            "HARMONICA", "ACCORDION", "UKULELE", "CLARINET", "TROMBONE",
            "BANJO", "MANDOLIN", "BASSOON", "FLUTE", "ORCHESTRA", "SYMPHONY"
        ],
        "Occupations": [
            "DOCTOR", "TEACHER", "ENGINEER", "ARCHITECT", "SCIENTIST",
            "ASTRONAUT", "DETECTIVE", "JOURNALIST", "PHARMACIST", "VETERINARIAN",
            "ELECTRICIAN", "PLUMBER", "CARPENTER", "MECHANIC", "SURGEON", "LAWYER"
        ]
    };

    const HANGMAN_STAGES = [
        // 0 - empty
        `
   +---+
   |   |
       |
       |
       |
       |
=========`,
        // 1 - head
        `
   +---+
   |   |
   O   |
       |
       |
       |
=========`,
        // 2 - body
        `
   +---+
   |   |
   O   |
   |   |
       |
       |
=========`,
        // 3 - left arm
        `
   +---+
   |   |
   O   |
  /|   |
       |
       |
=========`,
        // 4 - right arm
        `
   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========`,
        // 5 - left leg
        `
   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========`,
        // 6 - right leg (dead)
        `
   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========`
    ];

    let currentWord = '';
    let currentCategory = '';
    let guessedLetters = new Set();
    let wrongGuesses = 0;
    let gameOver = false;
    let wins = 0;
    let losses = 0;
    const MAX_WRONG = 6;

    function init() {
        loadStats();
        startNewGame();
    }

    function loadStats() {
        const saved = localStorage.getItem('hangman-stats');
        if (saved) {
            const stats = JSON.parse(saved);
            wins = stats.wins || 0;
            losses = stats.losses || 0;
        }
    }

    function saveStats() {
        localStorage.setItem('hangman-stats', JSON.stringify({ wins, losses }));
    }

    function startNewGame(category = null) {
        // Pick random category if not specified
        const categories = Object.keys(CATEGORIES);
        currentCategory = category || categories[Math.floor(Math.random() * categories.length)];

        // Pick random word from category
        const words = CATEGORIES[currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)];

        guessedLetters = new Set();
        wrongGuesses = 0;
        gameOver = false;
        render();
    }

    function render() {
        const container = document.getElementById('hangman-container');
        if (!container) return;

        const displayWord = currentWord.split('').map(letter =>
            guessedLetters.has(letter) ? letter : '_'
        ).join(' ');

        const won = !displayWord.includes('_');
        const lost = wrongGuesses >= MAX_WRONG;

        if ((won || lost) && !gameOver) {
            gameOver = true;
            if (won) wins++;
            else losses++;
            saveStats();
        }

        container.innerHTML = `
            <div class="hangman-game">
                <button class="hangman-back-btn" onclick="exitHangman()">← Back</button>
                <div class="hangman-header">
                    <h2>Hangman</h2>
                    <div class="hangman-stats">
                        <span class="wins">Wins: ${wins}</span>
                        <span class="losses">Losses: ${losses}</span>
                    </div>
                </div>

                <div class="hangman-category">
                    Category: <strong>${currentCategory}</strong>
                </div>

                <div class="hangman-drawing">
                    <pre>${HANGMAN_STAGES[wrongGuesses]}</pre>
                </div>

                <div class="hangman-word">
                    ${displayWord}
                </div>

                <div class="hangman-guesses">
                    Wrong guesses: ${wrongGuesses}/${MAX_WRONG}
                </div>

                ${gameOver ? `
                    <div class="hangman-result ${won ? 'won' : 'lost'}">
                        <h3>${won ? 'You Won!' : 'Game Over!'}</h3>
                        ${!won ? `<p>The word was: <strong>${currentWord}</strong></p>` : ''}
                        <div class="hangman-new-game-options">
                            <button class="hangman-btn" onclick="window.HangmanGame.newGame()">
                                Random Category
                            </button>
                            <button class="hangman-btn" onclick="window.HangmanGame.newGame('${currentCategory}')">
                                Same Category
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="hangman-keyboard">
                        ${renderKeyboard()}
                    </div>
                `}

                <div class="hangman-category-select">
                    <label>Choose category:</label>
                    <select onchange="window.HangmanGame.newGame(this.value)">
                        <option value="">Random</option>
                        ${Object.keys(CATEGORIES).map(cat =>
                            `<option value="${cat}" ${cat === currentCategory ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    function renderKeyboard() {
        const rows = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];

        return rows.map(row => `
            <div class="keyboard-row">
                ${row.split('').map(letter => {
                    const guessed = guessedLetters.has(letter);
                    const inWord = currentWord.includes(letter);
                    let className = 'key';
                    if (guessed) {
                        className += inWord ? ' correct' : ' wrong';
                    }
                    return `
                        <button class="${className}"
                                onclick="window.HangmanGame.guess('${letter}')"
                                ${guessed || gameOver ? 'disabled' : ''}>
                            ${letter}
                        </button>
                    `;
                }).join('')}
            </div>
        `).join('');
    }

    function guess(letter) {
        if (gameOver || guessedLetters.has(letter)) return;

        guessedLetters.add(letter);

        if (!currentWord.includes(letter)) {
            wrongGuesses++;
        }

        render();
    }

    // Handle physical keyboard
    function handleKeyPress(e) {
        if (gameOver) return;
        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter)) {
            guess(letter);
        }
    }

    function newGame(category = null) {
        startNewGame(category);
    }

    // Keyboard listener management
    let keyboardListenerActive = false;

    function addKeyboardListener() {
        if (!keyboardListenerActive) {
            document.addEventListener('keydown', handleKeyPress);
            keyboardListenerActive = true;
        }
    }

    function removeKeyboardListener() {
        if (keyboardListenerActive) {
            document.removeEventListener('keydown', handleKeyPress);
            keyboardListenerActive = false;
        }
    }

    // Expose functions to window
    window.HangmanGame = {
        init,
        guess,
        newGame
    };

    window.launchHangman = function() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('hangmanGame').style.display = 'block';
        addKeyboardListener();
        init();
    };

    window.exitHangman = function() {
        removeKeyboardListener();
        document.getElementById('hangmanGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

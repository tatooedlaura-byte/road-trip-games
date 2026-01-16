// Cryptogram Game - Decode substitution cipher puzzles
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'cryptogram-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .cryptogram-game {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 1rem;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .cryptogram-back-btn {
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

            .cryptogram-header {
                text-align: center;
                margin-bottom: 1rem;
                padding-top: 1rem;
            }

            .cryptogram-header h2 {
                font-size: 1.8rem;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #a78bfa 0%, #818cf8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .cryptogram-header p {
                color: rgba(255,255,255,0.6);
                font-size: 0.9rem;
                margin: 0;
            }

            .cryptogram-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }

            .cryptogram-stats span {
                color: rgba(255,255,255,0.7);
            }

            .cryptogram-puzzle {
                background: rgba(0,0,0,0.3);
                padding: 1.5rem;
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .cryptogram-line {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
                justify-content: center;
            }

            .cryptogram-word {
                display: flex;
                gap: 2px;
            }

            .cryptogram-cell {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 24px;
            }

            .cryptogram-encoded {
                font-size: 0.7rem;
                color: rgba(255,255,255,0.5);
                height: 1rem;
            }

            .cryptogram-decoded {
                width: 24px;
                height: 28px;
                border: none;
                border-bottom: 2px solid rgba(255,255,255,0.3);
                background: transparent;
                color: white;
                font-size: 1.1rem;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                font-family: 'Courier New', monospace;
                cursor: pointer;
            }

            .cryptogram-decoded:focus {
                outline: none;
                border-bottom-color: #a78bfa;
                background: rgba(167, 139, 250, 0.1);
            }

            .cryptogram-decoded.correct {
                color: #00ff88;
                border-bottom-color: #00ff88;
            }

            .cryptogram-decoded.selected {
                background: rgba(167, 139, 250, 0.2);
                border-bottom-color: #a78bfa;
            }

            .cryptogram-decoded.hint {
                color: #ffd93d;
                border-bottom-color: #ffd93d;
            }

            .cryptogram-space {
                width: 12px;
            }

            .cryptogram-punct {
                font-size: 1.2rem;
                padding: 0 2px;
                color: rgba(255,255,255,0.7);
                align-self: flex-end;
            }

            .cryptogram-author {
                text-align: right;
                font-style: italic;
                color: rgba(255,255,255,0.5);
                margin-top: 1rem;
                font-size: 0.9rem;
            }

            .cryptogram-keyboard {
                margin-bottom: 1rem;
            }

            .cryptogram-keyboard-row {
                display: flex;
                justify-content: center;
                gap: 4px;
                margin-bottom: 4px;
            }

            .cryptogram-key {
                width: 28px;
                height: 36px;
                border: none;
                border-radius: 4px;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .cryptogram-key:hover:not(:disabled) {
                background: rgba(255,255,255,0.2);
            }

            .cryptogram-key.used {
                background: rgba(167, 139, 250, 0.3);
                color: #a78bfa;
            }

            .cryptogram-key:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .cryptogram-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .cg-btn {
                padding: 0.6rem 1rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .cg-btn:hover:not(:disabled) {
                transform: translateY(-2px);
            }

            .cg-btn.primary {
                background: linear-gradient(135deg, #a78bfa 0%, #818cf8 100%);
                color: white;
            }

            .cg-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .cg-btn.success {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .cryptogram-win {
                text-align: center;
                padding: 1.5rem;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .cryptogram-win h3 {
                color: #00ff88;
                font-size: 1.5rem;
                margin: 0 0 0.5rem 0;
            }

            .cryptogram-win p {
                color: rgba(255,255,255,0.7);
                margin: 0.25rem 0;
            }

            .cryptogram-hint-count {
                font-size: 0.85rem;
                color: rgba(255,255,255,0.6);
                text-align: center;
                margin-bottom: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Famous quotes for puzzles
    const QUOTES = [
        { text: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO", author: "Steve Jobs" },
        { text: "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY", author: "Albert Einstein" },
        { text: "LIFE IS WHAT HAPPENS WHEN YOURE BUSY MAKING OTHER PLANS", author: "John Lennon" },
        { text: "THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR DREAMS", author: "Eleanor Roosevelt" },
        { text: "BE THE CHANGE YOU WISH TO SEE IN THE WORLD", author: "Mahatma Gandhi" },
        { text: "STAY HUNGRY STAY FOOLISH", author: "Steve Jobs" },
        { text: "THE BEST TIME TO PLANT A TREE WAS TWENTY YEARS AGO THE SECOND BEST TIME IS NOW", author: "Chinese Proverb" },
        { text: "IT DOES NOT MATTER HOW SLOWLY YOU GO AS LONG AS YOU DO NOT STOP", author: "Confucius" },
        { text: "SUCCESS IS NOT FINAL FAILURE IS NOT FATAL IT IS THE COURAGE TO CONTINUE THAT COUNTS", author: "Winston Churchill" },
        { text: "BELIEVE YOU CAN AND YOURE HALFWAY THERE", author: "Theodore Roosevelt" },
        { text: "THE ONLY IMPOSSIBLE JOURNEY IS THE ONE YOU NEVER BEGIN", author: "Tony Robbins" },
        { text: "HAPPINESS IS NOT SOMETHING READY MADE IT COMES FROM YOUR OWN ACTIONS", author: "Dalai Lama" },
        { text: "EVERYTHING YOU CAN IMAGINE IS REAL", author: "Pablo Picasso" },
        { text: "DO WHAT YOU CAN WITH WHAT YOU HAVE WHERE YOU ARE", author: "Theodore Roosevelt" },
        { text: "THE PURPOSE OF OUR LIVES IS TO BE HAPPY", author: "Dalai Lama" }
    ];

    let currentQuote = null;
    let cipher = {};
    let reverseCipher = {};
    let userGuesses = {};
    let selectedCell = null;
    let hintsUsed = 0;
    let solved = false;
    let puzzlesSolved = 0;

    function init() {
        puzzlesSolved = parseInt(localStorage.getItem('cryptogram-solved') || '0');
        startNewPuzzle();
    }

    function startNewPuzzle() {
        currentQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        cipher = generateCipher();
        reverseCipher = {};
        Object.entries(cipher).forEach(([k, v]) => reverseCipher[v] = k);
        userGuesses = {};
        selectedCell = null;
        hintsUsed = 0;
        solved = false;
        render();
    }

    function generateCipher() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = [...alphabet];

        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Ensure no letter maps to itself
        for (let i = 0; i < alphabet.length; i++) {
            if (alphabet[i] === shuffled[i]) {
                const swapIdx = (i + 1) % alphabet.length;
                [shuffled[i], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[i]];
            }
        }

        const cipher = {};
        alphabet.forEach((letter, i) => {
            cipher[letter] = shuffled[i];
        });
        return cipher;
    }

    function encode(text) {
        return text.split('').map(char => {
            if (/[A-Z]/.test(char)) {
                return cipher[char];
            }
            return char;
        }).join('');
    }

    function selectCell(encodedLetter) {
        selectedCell = encodedLetter;
        render();
    }

    function guessLetter(letter) {
        if (!selectedCell || solved) return;

        // Check if this letter is already used for another encoded letter
        const existingKey = Object.entries(userGuesses).find(([k, v]) => v === letter && k !== selectedCell);
        if (existingKey) {
            // Remove the old mapping
            delete userGuesses[existingKey[0]];
        }

        userGuesses[selectedCell] = letter;
        checkSolved();
        render();
    }

    function clearGuess() {
        if (selectedCell) {
            delete userGuesses[selectedCell];
            render();
        }
    }

    function checkSolved() {
        const uniqueLetters = new Set(currentQuote.text.replace(/[^A-Z]/g, '').split(''));
        let allCorrect = true;

        uniqueLetters.forEach(letter => {
            const encoded = cipher[letter];
            if (userGuesses[encoded] !== letter) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            solved = true;
            puzzlesSolved++;
            localStorage.setItem('cryptogram-solved', puzzlesSolved.toString());
        }
    }

    function getHint() {
        if (solved) return;

        // Find an unsolved letter
        const uniqueLetters = [...new Set(currentQuote.text.replace(/[^A-Z]/g, '').split(''))];
        const unsolved = uniqueLetters.filter(letter => {
            const encoded = cipher[letter];
            return userGuesses[encoded] !== letter;
        });

        if (unsolved.length > 0) {
            const letter = unsolved[Math.floor(Math.random() * unsolved.length)];
            const encoded = cipher[letter];
            userGuesses[encoded] = letter;
            hintsUsed++;
            checkSolved();
            render();
        }
    }

    function render() {
        const container = document.getElementById('cryptogram-container');
        if (!container) return;

        const encoded = encode(currentQuote.text);
        const words = currentQuote.text.split(' ');
        const encodedWords = encoded.split(' ');

        // Get used letters
        const usedLetters = new Set(Object.values(userGuesses));

        container.innerHTML = `
            <div class="cryptogram-game">
                <button class="game-back-btn" onclick="exitCryptogram()">← Back</button>

                <div class="cryptogram-header">
                    <h2>Cryptogram</h2>
                    <p>Decode the substitution cipher to reveal the quote</p>
                </div>

                <div class="cryptogram-stats">
                    <span>Puzzles Solved: ${puzzlesSolved}</span>
                </div>

                ${solved ? `
                    <div class="cryptogram-win">
                        <h3>Solved!</h3>
                        <p>"${currentQuote.text}"</p>
                        <p>— ${currentQuote.author}</p>
                        ${hintsUsed > 0 ? `<p style="font-size: 0.85rem;">Hints used: ${hintsUsed}</p>` : ''}
                    </div>
                    <div class="cryptogram-actions">
                        <button class="cg-btn success" onclick="window.CryptogramGame.newPuzzle()">Next Puzzle</button>
                    </div>
                ` : `
                    <div class="cryptogram-puzzle">
                        <div class="cryptogram-line">
                            ${encodedWords.map((word, wordIdx) => `
                                <div class="cryptogram-word">
                                    ${word.split('').map((char, charIdx) => {
                                        const originalChar = words[wordIdx][charIdx];
                                        if (/[A-Z]/.test(char)) {
                                            const guess = userGuesses[char] || '';
                                            const isCorrect = guess === originalChar;
                                            const isSelected = selectedCell === char;
                                            return `
                                                <div class="cryptogram-cell">
                                                    <span class="cryptogram-encoded">${char}</span>
                                                    <input type="text"
                                                           class="cryptogram-decoded ${isCorrect ? 'correct' : ''} ${isSelected ? 'selected' : ''}"
                                                           value="${guess}"
                                                           readonly
                                                           onclick="window.CryptogramGame.selectCell('${char}')"
                                                           maxlength="1">
                                                </div>
                                            `;
                                        } else {
                                            return `<span class="cryptogram-punct">${char}</span>`;
                                        }
                                    }).join('')}
                                </div>
                                <div class="cryptogram-space"></div>
                            `).join('')}
                        </div>
                        <div class="cryptogram-author">— ${currentQuote.author}</div>
                    </div>

                    <div class="cryptogram-keyboard">
                        ${['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(row => `
                            <div class="cryptogram-keyboard-row">
                                ${row.split('').map(letter => `
                                    <button class="cryptogram-key ${usedLetters.has(letter) ? 'used' : ''}"
                                            onclick="window.CryptogramGame.guessLetter('${letter}')"
                                            ${!selectedCell ? 'disabled' : ''}>
                                        ${letter}
                                    </button>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>

                    <div class="cryptogram-hint-count">Hints used: ${hintsUsed}</div>

                    <div class="cryptogram-actions">
                        <button class="cg-btn secondary" onclick="window.CryptogramGame.clearGuess()" ${!selectedCell ? 'disabled' : ''}>Clear</button>
                        <button class="cg-btn secondary" onclick="window.CryptogramGame.getHint()">Hint</button>
                        <button class="cg-btn secondary" onclick="window.CryptogramGame.newPuzzle()">New Puzzle</button>
                    </div>
                `}
            </div>
        `;
    }

    function newPuzzle() {
        startNewPuzzle();
    }

    // Keyboard support
    function handleKeydown(e) {
        if (solved) return;

        const key = e.key.toUpperCase();

        if (/^[A-Z]$/.test(key) && selectedCell) {
            guessLetter(key);
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            clearGuess();
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
    window.CryptogramGame = {
        init,
        selectCell,
        guessLetter,
        clearGuess,
        getHint,
        newPuzzle
    };

    window.launchCryptogram = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('cryptogramGame').style.display = 'block';
        addKeyboardListener();
        init();
    };

    window.exitCryptogram = function() {
        removeKeyboardListener();
        document.getElementById('cryptogramGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

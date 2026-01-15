// Crossword Game - Classic crossword puzzles
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'crossword-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .crossword-game {
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

            .crossword-back-btn {
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

            .crossword-header {
                text-align: center;
                margin-bottom: 1rem;
                padding-top: 1rem;
            }

            .crossword-header h2 {
                font-size: 1.8rem;
                margin: 0;
                background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .crossword-grid-container {
                display: flex;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .crossword-grid {
                display: grid;
                gap: 1px;
                background: #333;
                padding: 1px;
                border-radius: 4px;
            }

            .crossword-cell {
                width: 32px;
                height: 32px;
                position: relative;
                background: white;
            }

            .crossword-cell.black {
                background: #1a1a2e;
            }

            .crossword-cell-number {
                position: absolute;
                top: 1px;
                left: 2px;
                font-size: 8px;
                color: #333;
                font-weight: bold;
            }

            .crossword-cell-input {
                width: 100%;
                height: 100%;
                border: none;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                text-transform: uppercase;
                background: transparent;
                color: #333;
                cursor: pointer;
            }

            .crossword-cell-input:focus {
                outline: none;
                background: rgba(96, 165, 250, 0.3);
            }

            .crossword-cell.selected .crossword-cell-input {
                background: rgba(96, 165, 250, 0.5);
            }

            .crossword-cell.highlighted .crossword-cell-input {
                background: rgba(96, 165, 250, 0.2);
            }

            .crossword-cell.correct .crossword-cell-input {
                color: #16a34a;
            }

            .crossword-cell.incorrect .crossword-cell-input {
                color: #dc2626;
                background: rgba(220, 38, 38, 0.1);
            }

            .crossword-clues {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .crossword-clue-section h3 {
                font-size: 1rem;
                margin: 0 0 0.5rem 0;
                color: #60a5fa;
            }

            .crossword-clue-list {
                font-size: 0.85rem;
                max-height: 200px;
                overflow-y: auto;
            }

            .crossword-clue {
                padding: 0.3rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 0.25rem;
            }

            .crossword-clue:hover {
                background: rgba(255,255,255,0.1);
            }

            .crossword-clue.selected {
                background: rgba(96, 165, 250, 0.3);
            }

            .crossword-clue.solved {
                color: #00ff88;
                text-decoration: line-through;
                opacity: 0.7;
            }

            .crossword-clue-number {
                font-weight: bold;
                margin-right: 0.5rem;
            }

            .crossword-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .cw-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .cw-btn:hover {
                transform: translateY(-2px);
            }

            .cw-btn.primary {
                background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                color: white;
            }

            .cw-btn.secondary {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .cw-btn.success {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .crossword-win {
                text-align: center;
                padding: 1.5rem;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .crossword-win h3 {
                color: #00ff88;
                font-size: 1.5rem;
                margin: 0 0 0.5rem 0;
            }

            .crossword-current-clue {
                background: rgba(96, 165, 250, 0.2);
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                min-height: 2.5rem;
            }

            .crossword-current-clue .direction {
                font-size: 0.8rem;
                color: #60a5fa;
                margin-bottom: 0.25rem;
            }

            .crossword-keyboard {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-top: 1rem;
                padding: 0.5rem;
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
            }

            .crossword-keyboard-row {
                display: flex;
                justify-content: center;
                gap: 4px;
            }

            .crossword-key {
                min-width: 28px;
                height: 40px;
                border: none;
                border-radius: 6px;
                background: rgba(255,255,255,0.15);
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.1s ease;
                -webkit-tap-highlight-color: transparent;
            }

            .crossword-key:active {
                background: rgba(96, 165, 250, 0.5);
                transform: scale(0.95);
            }

            .crossword-key.wide {
                min-width: 50px;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Pre-made crossword puzzles (7x7 grid)
    const PUZZLES = [
        {
            grid: [
                ['C','A','T','#','D','O','G'],
                ['A','#','R','O','A','D','#'],
                ['R','U','N','#','Y','#','B'],
                ['#','N','#','S','#','C','A'],
                ['S','#','P','U','N','A','T'],
                ['U','S','E','N','#','R','#'],
                ['N','#','T','#','J','O','Y']
            ],
            clues: {
                across: [
                    { num: 1, row: 0, col: 0, text: "Feline pet", answer: "CAT" },
                    { num: 4, row: 0, col: 4, text: "Canine pet", answer: "DOG" },
                    { num: 6, row: 1, col: 2, text: "Street or highway", answer: "ROAD" },
                    { num: 7, row: 2, col: 0, text: "Move quickly on foot", answer: "RUN" },
                    { num: 9, row: 3, col: 3, text: "Opposite of daughter", answer: "S" },
                    { num: 10, row: 4, col: 2, text: "Wordplay joke", answer: "PUN" },
                    { num: 12, row: 4, col: 5, text: "Flying mammal", answer: "BAT" },
                    { num: 13, row: 5, col: 0, text: "Utilize", answer: "USE" },
                    { num: 14, row: 6, col: 4, text: "Happiness", answer: "JOY" }
                ],
                down: [
                    { num: 1, row: 0, col: 0, text: "Automobile", answer: "CAR" },
                    { num: 2, row: 0, col: 2, text: "Path or route", answer: "TRUNK" },
                    { num: 3, row: 0, col: 4, text: "24 hours", answer: "DAY" },
                    { num: 5, row: 0, col: 6, text: "Flying mammal", answer: "BAT" },
                    { num: 6, row: 1, col: 3, text: "Brightness source", answer: "SUN" },
                    { num: 8, row: 2, col: 1, text: "Employ", answer: "UN" },
                    { num: 11, row: 3, col: 5, text: "Vehicle", answer: "CAR" }
                ]
            }
        },
        {
            grid: [
                ['H','A','P','P','Y','#','#'],
                ['O','#','I','#','E','A','R'],
                ['M','I','X','#','S','#','E'],
                ['E','#','#','T','#','B','A'],
                ['#','S','A','W','#','E','D'],
                ['C','O','W','#','A','D','#'],
                ['U','N','#','F','I','#','#']
            ],
            clues: {
                across: [
                    { num: 1, row: 0, col: 0, text: "Joyful", answer: "HAPPY" },
                    { num: 5, row: 1, col: 4, text: "Hearing organ", answer: "EAR" },
                    { num: 6, row: 2, col: 0, text: "Blend together", answer: "MIX" },
                    { num: 8, row: 3, col: 0, text: "Where we live", answer: "E" },
                    { num: 9, row: 4, col: 1, text: "Past tense of see", answer: "SAW" },
                    { num: 11, row: 4, col: 5, text: "Peruse", answer: "READ" },
                    { num: 12, row: 5, col: 0, text: "Farm animal", answer: "COW" },
                    { num: 13, row: 5, col: 4, text: "Commercial", answer: "AD" },
                    { num: 14, row: 6, col: 0, text: "Not down", answer: "UN" },
                    { num: 15, row: 6, col: 3, text: "Suitable", answer: "FI" }
                ],
                down: [
                    { num: 1, row: 0, col: 0, text: "Residence", answer: "HOME" },
                    { num: 2, row: 0, col: 2, text: "Greek letter", answer: "PIX" },
                    { num: 3, row: 0, col: 4, text: "Affirmative", answer: "YES" },
                    { num: 4, row: 1, col: 5, text: "Furniture item", answer: "BED" },
                    { num: 7, row: 2, col: 6, text: "Understand", answer: "READ" },
                    { num: 10, row: 3, col: 3, text: "Two", answer: "TWO" },
                    { num: 11, row: 5, col: 1, text: "Possess", answer: "OWN" }
                ]
            }
        },
        {
            grid: [
                ['S','T','A','R','#','B','E'],
                ['E','#','N','#','A','U','N'],
                ['A','I','T','#','T','#','D'],
                ['#','D','#','P','#','W','#'],
                ['R','E','D','A','Y','E','T'],
                ['U','A','#','N','#','T','#'],
                ['N','#','T','O','P','#','#']
            ],
            clues: {
                across: [
                    { num: 1, row: 0, col: 0, text: "Celestial body", answer: "STAR" },
                    { num: 4, row: 0, col: 5, text: "Exist", answer: "BE" },
                    { num: 6, row: 1, col: 4, text: "Bread loaf", answer: "BUN" },
                    { num: 7, row: 2, col: 0, text: "Consumed food", answer: "AIT" },
                    { num: 8, row: 2, col: 4, text: "Baseball item", answer: "T" },
                    { num: 9, row: 4, col: 0, text: "Color", answer: "RED" },
                    { num: 10, row: 4, col: 3, text: "24 hours", answer: "AYET" },
                    { num: 11, row: 5, col: 3, text: "Cooking vessel", answer: "N" },
                    { num: 12, row: 6, col: 2, text: "Summit", answer: "TOP" }
                ],
                down: [
                    { num: 1, row: 0, col: 0, text: "Ocean", answer: "SEA" },
                    { num: 2, row: 0, col: 2, text: "Insect", answer: "ANT" },
                    { num: 3, row: 0, col: 3, text: "Tear", answer: "R" },
                    { num: 4, row: 0, col: 5, text: "Moist", answer: "BUYWET" },
                    { num: 5, row: 0, col: 6, text: "Conclusion", answer: "END" },
                    { num: 6, row: 1, col: 4, text: "Flying animal", answer: "BAT" },
                    { num: 8, row: 1, col: 1, text: "Concept", answer: "IDEA" },
                    { num: 9, row: 4, col: 0, text: "Jog", answer: "RUN" }
                ]
            }
        }
    ];

    let currentPuzzle = null;
    let userGrid = [];
    let selectedCell = null;
    let direction = 'across';
    let solved = false;

    function init() {
        startNewPuzzle();
    }

    function startNewPuzzle() {
        currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        userGrid = currentPuzzle.grid.map(row => row.map(cell => cell === '#' ? '#' : ''));
        selectedCell = findFirstCell();
        direction = 'across';
        solved = false;
        render();
    }

    function findFirstCell() {
        for (let r = 0; r < currentPuzzle.grid.length; r++) {
            for (let c = 0; c < currentPuzzle.grid[r].length; c++) {
                if (currentPuzzle.grid[r][c] !== '#') {
                    return { row: r, col: c };
                }
            }
        }
        return { row: 0, col: 0 };
    }

    function getCellNumber(row, col) {
        const allClues = [...currentPuzzle.clues.across, ...currentPuzzle.clues.down];
        const clue = allClues.find(c => c.row === row && c.col === col);
        return clue ? clue.num : null;
    }

    function selectCell(row, col) {
        if (currentPuzzle.grid[row][col] === '#') return;

        if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
            // Toggle direction
            direction = direction === 'across' ? 'down' : 'across';
        } else {
            selectedCell = { row, col };
        }
        render();
    }

    function inputLetter(letter) {
        if (!selectedCell || solved) return;

        const { row, col } = selectedCell;
        if (currentPuzzle.grid[row][col] === '#') return;

        userGrid[row][col] = letter.toUpperCase();
        moveToNextCell();
        checkSolved();
        render();
    }

    function moveToNextCell() {
        if (!selectedCell) return;

        let { row, col } = selectedCell;

        if (direction === 'across') {
            col++;
            while (col < currentPuzzle.grid[0].length && currentPuzzle.grid[row][col] === '#') {
                col++;
            }
            if (col < currentPuzzle.grid[0].length) {
                selectedCell = { row, col };
            }
        } else {
            row++;
            while (row < currentPuzzle.grid.length && currentPuzzle.grid[row][col] === '#') {
                row++;
            }
            if (row < currentPuzzle.grid.length) {
                selectedCell = { row, col };
            }
        }
    }

    function deleteLetter() {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        if (userGrid[row][col]) {
            userGrid[row][col] = '';
        } else {
            // Move back
            if (direction === 'across' && col > 0) {
                let newCol = col - 1;
                while (newCol >= 0 && currentPuzzle.grid[row][newCol] === '#') {
                    newCol--;
                }
                if (newCol >= 0) {
                    selectedCell = { row, col: newCol };
                    userGrid[row][newCol] = '';
                }
            } else if (direction === 'down' && row > 0) {
                let newRow = row - 1;
                while (newRow >= 0 && currentPuzzle.grid[newRow][col] === '#') {
                    newRow--;
                }
                if (newRow >= 0) {
                    selectedCell = { row: newRow, col };
                    userGrid[newRow][col] = '';
                }
            }
        }
        render();
    }

    function checkSolved() {
        for (let r = 0; r < currentPuzzle.grid.length; r++) {
            for (let c = 0; c < currentPuzzle.grid[r].length; c++) {
                if (currentPuzzle.grid[r][c] !== '#' && userGrid[r][c] !== currentPuzzle.grid[r][c]) {
                    return;
                }
            }
        }
        solved = true;
    }

    function getHighlightedCells() {
        if (!selectedCell) return new Set();

        const cells = new Set();
        const { row, col } = selectedCell;

        if (direction === 'across') {
            // Find start of word
            let startCol = col;
            while (startCol > 0 && currentPuzzle.grid[row][startCol - 1] !== '#') {
                startCol--;
            }
            // Highlight word
            for (let c = startCol; c < currentPuzzle.grid[0].length && currentPuzzle.grid[row][c] !== '#'; c++) {
                cells.add(`${row},${c}`);
            }
        } else {
            // Find start of word
            let startRow = row;
            while (startRow > 0 && currentPuzzle.grid[startRow - 1][col] !== '#') {
                startRow--;
            }
            // Highlight word
            for (let r = startRow; r < currentPuzzle.grid.length && currentPuzzle.grid[r][col] !== '#'; r++) {
                cells.add(`${r},${col}`);
            }
        }

        return cells;
    }

    function getCurrentClue() {
        if (!selectedCell) return null;

        const { row, col } = selectedCell;
        const clues = direction === 'across' ? currentPuzzle.clues.across : currentPuzzle.clues.down;

        // Find the clue that contains this cell
        for (const clue of clues) {
            if (direction === 'across') {
                if (clue.row === row && col >= clue.col && col < clue.col + clue.answer.length) {
                    return { ...clue, direction };
                }
            } else {
                if (clue.col === col && row >= clue.row && row < clue.row + clue.answer.length) {
                    return { ...clue, direction };
                }
            }
        }
        return null;
    }

    function selectClue(clue, dir) {
        direction = dir;
        selectedCell = { row: clue.row, col: clue.col };
        render();
    }

    function isWordSolved(clue, dir) {
        if (dir === 'across') {
            for (let i = 0; i < clue.answer.length; i++) {
                if (userGrid[clue.row][clue.col + i] !== clue.answer[i]) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < clue.answer.length; i++) {
                if (userGrid[clue.row + i][clue.col] !== clue.answer[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkAnswers() {
        // Show which cells are correct/incorrect
        render(true);
    }

    function render(showCheck = false) {
        const container = document.getElementById('crossword-container');
        if (!container) return;

        const size = currentPuzzle.grid.length;
        const highlighted = getHighlightedCells();
        const currentClue = getCurrentClue();

        container.innerHTML = `
            <div class="crossword-game">
                <button class="crossword-back-btn" onclick="exitCrossword()">← Back</button>

                <div class="crossword-header">
                    <h2>Crossword</h2>
                </div>

                ${solved ? `
                    <div class="crossword-win">
                        <h3>Puzzle Complete!</h3>
                        <p>Great job solving the crossword!</p>
                    </div>
                ` : ''}

                <div class="crossword-current-clue">
                    ${currentClue ? `
                        <div class="direction">${currentClue.num} ${currentClue.direction.toUpperCase()}</div>
                        <div>${currentClue.text}</div>
                    ` : 'Select a cell to begin'}
                </div>

                <div class="crossword-grid-container">
                    <div class="crossword-grid" style="grid-template-columns: repeat(${size}, 32px);">
                        ${currentPuzzle.grid.map((row, r) => row.map((cell, c) => {
                            const isBlack = cell === '#';
                            const isSelected = selectedCell && selectedCell.row === r && selectedCell.col === c;
                            const isHighlighted = highlighted.has(`${r},${c}`);
                            const cellNum = getCellNumber(r, c);
                            const userVal = userGrid[r][c];
                            const isCorrect = showCheck && userVal && userVal === cell;
                            const isIncorrect = showCheck && userVal && userVal !== cell;

                            return `
                                <div class="crossword-cell ${isBlack ? 'black' : ''} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}">
                                    ${!isBlack ? `
                                        ${cellNum ? `<span class="crossword-cell-number">${cellNum}</span>` : ''}
                                        <input type="text"
                                               class="crossword-cell-input"
                                               value="${userVal}"
                                               maxlength="1"
                                               readonly
                                               onclick="window.CrosswordGame.selectCell(${r}, ${c})">
                                    ` : ''}
                                </div>
                            `;
                        }).join('')).join('')}
                    </div>
                </div>

                <div class="crossword-clues">
                    <div class="crossword-clue-section">
                        <h3>Across</h3>
                        <div class="crossword-clue-list">
                            ${currentPuzzle.clues.across.map(clue => `
                                <div class="crossword-clue ${currentClue && currentClue.num === clue.num && direction === 'across' ? 'selected' : ''} ${isWordSolved(clue, 'across') ? 'solved' : ''}"
                                     onclick="window.CrosswordGame.selectClue(${JSON.stringify(clue).replace(/"/g, '&quot;')}, 'across')">
                                    <span class="crossword-clue-number">${clue.num}.</span>
                                    ${clue.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="crossword-clue-section">
                        <h3>Down</h3>
                        <div class="crossword-clue-list">
                            ${currentPuzzle.clues.down.map(clue => `
                                <div class="crossword-clue ${currentClue && currentClue.num === clue.num && direction === 'down' ? 'selected' : ''} ${isWordSolved(clue, 'down') ? 'solved' : ''}"
                                     onclick="window.CrosswordGame.selectClue(${JSON.stringify(clue).replace(/"/g, '&quot;')}, 'down')">
                                    <span class="crossword-clue-number">${clue.num}.</span>
                                    ${clue.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="crossword-actions">
                    <button class="cw-btn secondary" onclick="window.CrosswordGame.checkAnswers()">Check</button>
                    <button class="cw-btn secondary" onclick="window.CrosswordGame.newPuzzle()">New Puzzle</button>
                </div>

                <div class="crossword-keyboard">
                    <div class="crossword-keyboard-row">
                        ${['Q','W','E','R','T','Y','U','I','O','P'].map(k =>
                            `<button class="crossword-key" onclick="window.CrosswordGame.inputLetter('${k}')">${k}</button>`
                        ).join('')}
                    </div>
                    <div class="crossword-keyboard-row">
                        ${['A','S','D','F','G','H','J','K','L'].map(k =>
                            `<button class="crossword-key" onclick="window.CrosswordGame.inputLetter('${k}')">${k}</button>`
                        ).join('')}
                    </div>
                    <div class="crossword-keyboard-row">
                        <button class="crossword-key wide" onclick="window.CrosswordGame.deleteLetter()">⌫</button>
                        ${['Z','X','C','V','B','N','M'].map(k =>
                            `<button class="crossword-key" onclick="window.CrosswordGame.inputLetter('${k}')">${k}</button>`
                        ).join('')}
                        <button class="crossword-key wide" onclick="window.CrosswordGame.toggleDirection()">↔️</button>
                    </div>
                </div>
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

        if (/^[A-Z]$/.test(key)) {
            inputLetter(key);
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            deleteLetter();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            direction = 'across';
            if (selectedCell && selectedCell.col < currentPuzzle.grid[0].length - 1) {
                selectCell(selectedCell.row, selectedCell.col + 1);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            direction = 'across';
            if (selectedCell && selectedCell.col > 0) {
                selectCell(selectedCell.row, selectedCell.col - 1);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            direction = 'down';
            if (selectedCell && selectedCell.row < currentPuzzle.grid.length - 1) {
                selectCell(selectedCell.row + 1, selectedCell.col);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            direction = 'down';
            if (selectedCell && selectedCell.row > 0) {
                selectCell(selectedCell.row - 1, selectedCell.col);
            }
            e.preventDefault();
        } else if (e.key === 'Tab') {
            direction = direction === 'across' ? 'down' : 'across';
            render();
            e.preventDefault();
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

    function toggleDirection() {
        direction = direction === 'across' ? 'down' : 'across';
        render();
    }

    // Expose functions
    window.CrosswordGame = {
        init,
        selectCell,
        selectClue,
        checkAnswers,
        newPuzzle,
        inputLetter,
        deleteLetter,
        toggleDirection
    };

    window.launchCrossword = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('crosswordGame').style.display = 'block';
        addKeyboardListener();
        init();
    };

    window.exitCrossword = function() {
        removeKeyboardListener();
        document.getElementById('crosswordGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

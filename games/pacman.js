// Pac-Man Game - Mobile-optimized with dynamic sizing
(function() {
    'use strict';

    // Base dimensions (original design)
    const BASE_WIDTH = 560;
    const BASE_HEIGHT = 620;
    const BASE_TILE_SIZE = 20;
    const GRID_WIDTH = 28;
    const GRID_HEIGHT = 31;

    // Dynamic dimensions
    let CANVAS_WIDTH = BASE_WIDTH;
    let CANVAS_HEIGHT = BASE_HEIGHT;
    let scaleFactor = 1;

    // Scaled getters
    function getTileSize() { return BASE_TILE_SIZE * scaleFactor; }

    // Tile types
    const TILE = {
        EMPTY: 0,
        WALL: 1,
        DOT: 2,
        POWER: 3,
        GHOST_HOUSE: 4,
        TUNNEL: 5
    };

    // Directions
    const DIR = {
        UP: { x: 0, y: -1, name: 'UP' },
        DOWN: { x: 0, y: 1, name: 'DOWN' },
        LEFT: { x: -1, y: 0, name: 'LEFT' },
        RIGHT: { x: 1, y: 0, name: 'RIGHT' },
        NONE: { x: 0, y: 0, name: 'NONE' }
    };

    // Game state
    let canvas, ctx;
    let gameState = 'playing';
    let score = 0;
    let highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
    let lives = 3;
    let level = 1;
    let dotsRemaining = 0;
    let powerMode = false;
    let powerModeTimer = 0;
    const POWER_MODE_DURATION = 300;

    // Maze layout
    let maze = [];
    let originalMaze = [];

    // Entities
    let pacman = null;
    let ghosts = [];

    // Game loop
    let animationFrameId = null;
    let lastFrameTime = 0;
    const FRAME_RATE = 30;
    const FRAME_DURATION = 1000 / FRAME_RATE;

    // Control state
    let movingLeft = false;
    let movingRight = false;
    let movingUp = false;
    let movingDown = false;

    // Resize canvas to fit screen
    function resizeCanvas() {
        const wrapper = document.getElementById('pacmanCanvasWrapper');
        if (!wrapper) return;

        let w = wrapper.clientWidth;
        let h = wrapper.clientHeight;

        if (w === 0 || h === 0) {
            w = window.innerWidth;
            h = window.innerHeight - 180;
        }

        // Maintain aspect ratio (28:31 grid)
        const aspectRatio = BASE_WIDTH / BASE_HEIGHT;
        let newWidth, newHeight;

        if (w / h > aspectRatio) {
            newHeight = h;
            newWidth = h * aspectRatio;
        } else {
            newWidth = w;
            newHeight = w / aspectRatio;
        }

        CANVAS_WIDTH = Math.floor(newWidth);
        CANVAS_HEIGHT = Math.floor(newHeight);
        scaleFactor = CANVAS_WIDTH / BASE_WIDTH;

        if (canvas) {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
        }
    }

    // Initialize maze (classic Pac-Man layout)
    function createMaze() {
        const layout = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
            [5,0,0,0,0,0,2,0,0,0,1,4,4,4,4,4,4,1,0,0,0,2,0,0,0,0,0,5],
            [1,1,1,1,1,1,2,1,1,0,1,4,4,4,4,4,4,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        maze = layout.map(row => [...row]);
        originalMaze = layout.map(row => [...row]);

        dotsRemaining = 0;
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (maze[y][x] === TILE.DOT || maze[y][x] === TILE.POWER) {
                    dotsRemaining++;
                }
            }
        }
    }

    // Check if tile is walkable
    function isWalkable(x, y) {
        if (y < 0 || y >= GRID_HEIGHT || x < 0 || x >= GRID_WIDTH) {
            return false;
        }
        return maze[y][x] !== TILE.WALL;
    }

    // Check if tile is walkable for ghosts
    function isWalkableForGhost(x, y, ghost) {
        if (y < 0 || y >= GRID_HEIGHT) return false;

        if (y === 14 && (x < 0 || x >= GRID_WIDTH)) {
            return true;
        }

        if (x < 0 || x >= GRID_WIDTH) return false;

        const tile = maze[y][x];

        if (ghost.mode === 'eaten' || ghost.mode === 'exiting') {
            return tile !== TILE.WALL;
        }

        return tile !== TILE.WALL && tile !== TILE.GHOST_HOUSE;
    }

    // Get available directions at intersection
    function getAvailableDirections(x, y, currentDir, isGhost, ghost) {
        const directions = [];
        const checkFunc = isGhost ?
            (dx, dy) => isWalkableForGhost(x + dx, y + dy, ghost) :
            (dx, dy) => isWalkable(x + dx, y + dy);

        if (checkFunc(0, -1) && currentDir.name !== 'DOWN') directions.push(DIR.UP);
        if (checkFunc(0, 1) && currentDir.name !== 'UP') directions.push(DIR.DOWN);
        if (checkFunc(-1, 0) && currentDir.name !== 'RIGHT') directions.push(DIR.LEFT);
        if (checkFunc(1, 0) && currentDir.name !== 'LEFT') directions.push(DIR.RIGHT);

        return directions;
    }

    // Pac-Man entity
    function createPacman() {
        return {
            gridX: 14,
            gridY: 23,
            pixelX: 14 * BASE_TILE_SIZE + BASE_TILE_SIZE / 2,
            pixelY: 23 * BASE_TILE_SIZE + BASE_TILE_SIZE / 2,
            direction: DIR.NONE,
            nextDirection: DIR.NONE,
            speed: 3.5,
            animation: 0
        };
    }

    // Ghost entity
    function createGhost(name, color, startX, startY, scatterTarget) {
        return {
            name: name,
            color: color,
            gridX: startX,
            gridY: startY,
            pixelX: startX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2,
            pixelY: startY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2,
            startX: startX,
            startY: startY,
            direction: DIR.LEFT,
            mode: 'chase',
            scatterTarget: scatterTarget,
            speed: 3.0,
            animation: 0
        };
    }

    // Initialize ghosts
    function createGhosts() {
        const ghosts = [
            createGhost('Blinky', '#FF0000', 14, 11, { x: 25, y: 0 }),
            createGhost('Pinky', '#FFB8FF', 14, 13, { x: 2, y: 0 }),
            createGhost('Inky', '#00FFFF', 13, 13, { x: 27, y: 30 }),
            createGhost('Clyde', '#FFB851', 15, 13, { x: 0, y: 30 })
        ];

        ghosts.forEach(ghost => {
            if (ghost.gridY >= 12 && ghost.gridY <= 14) {
                ghost.mode = 'exiting';
            }
        });

        return ghosts;
    }

    // BFS pathfinding for eaten ghosts
    function findPathBFS(startX, startY, targetX, targetY, ghost) {
        const queue = [{ x: startX, y: startY, path: [] }];
        const visited = new Set();
        visited.add(`${startX},${startY}`);

        while (queue.length > 0) {
            const current = queue.shift();

            if (current.x === targetX && current.y === targetY) {
                return current.path.length > 0 ? current.path[0] : DIR.NONE;
            }

            const directions = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT];
            for (const dir of directions) {
                let nextX = current.x + dir.x;
                let nextY = current.y + dir.y;

                if (nextY === 14) {
                    if (nextX < 0) nextX = GRID_WIDTH - 1;
                    if (nextX >= GRID_WIDTH) nextX = 0;
                }

                if (isWalkableForGhost(nextX, nextY, ghost)) {
                    const key = `${nextX},${nextY}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push({
                            x: nextX,
                            y: nextY,
                            path: [...current.path, dir]
                        });
                    }
                }
            }
        }

        return DIR.NONE;
    }

    // Ghost AI - Target selection
    function getGhostTarget(ghost) {
        if (ghost.mode === 'eaten') {
            return { x: 14, y: 14 };
        }

        if (ghost.mode === 'exiting') {
            return { x: 14, y: 11 };
        }

        if (ghost.mode === 'frightened') {
            return null;
        }

        if (ghost.mode === 'scatter') {
            return ghost.scatterTarget;
        }

        switch (ghost.name) {
            case 'Blinky':
                return { x: pacman.gridX, y: pacman.gridY };

            case 'Pinky':
                return {
                    x: pacman.gridX + (pacman.direction.x * 4),
                    y: pacman.gridY + (pacman.direction.y * 4)
                };

            case 'Inky':
                const blinky = ghosts.find(g => g.name === 'Blinky');
                if (blinky) {
                    const pivotX = pacman.gridX + (pacman.direction.x * 2);
                    const pivotY = pacman.gridY + (pacman.direction.y * 2);
                    return {
                        x: pivotX + (pivotX - blinky.gridX),
                        y: pivotY + (pivotY - blinky.gridY)
                    };
                }
                return { x: pacman.gridX, y: pacman.gridY };

            case 'Clyde':
                const dist = Math.abs(ghost.gridX - pacman.gridX) + Math.abs(ghost.gridY - pacman.gridY);
                if (dist > 8) {
                    return { x: pacman.gridX, y: pacman.gridY };
                } else {
                    return ghost.scatterTarget;
                }

            default:
                return { x: pacman.gridX, y: pacman.gridY };
        }
    }

    // Choose best direction for ghost
    function chooseGhostDirection(ghost) {
        const target = getGhostTarget(ghost);

        if (ghost.mode === 'frightened') {
            const available = getAvailableDirections(ghost.gridX, ghost.gridY, ghost.direction, true, ghost);
            if (available.length > 0) {
                return available[Math.floor(Math.random() * available.length)];
            }
            return ghost.direction;
        }

        if (ghost.mode === 'eaten' || ghost.mode === 'exiting') {
            const dir = findPathBFS(ghost.gridX, ghost.gridY, target.x, target.y, ghost);
            return dir !== DIR.NONE ? dir : ghost.direction;
        }

        const available = getAvailableDirections(ghost.gridX, ghost.gridY, ghost.direction, true, ghost);
        if (available.length === 0) {
            return ghost.direction;
        }

        let bestDir = available[0];
        let bestDist = Infinity;

        for (const dir of available) {
            const nextX = ghost.gridX + dir.x;
            const nextY = ghost.gridY + dir.y;
            const dist = Math.abs(nextX - target.x) + Math.abs(nextY - target.y);
            if (dist < bestDist) {
                bestDist = dist;
                bestDir = dir;
            }
        }

        return bestDir;
    }

    // Check if entity is aligned with grid
    function isAlignedWithGrid(pixelX, pixelY) {
        return Math.abs(pixelX % BASE_TILE_SIZE - BASE_TILE_SIZE / 2) < 3 &&
               Math.abs(pixelY % BASE_TILE_SIZE - BASE_TILE_SIZE / 2) < 3;
    }

    // Update Pac-Man
    function updatePacman() {
        if (!pacman) return;

        pacman.animation++;

        pacman.gridX = Math.floor(pacman.pixelX / BASE_TILE_SIZE);
        pacman.gridY = Math.floor(pacman.pixelY / BASE_TILE_SIZE);

        // Handle continuous button press
        if (movingUp) pacman.nextDirection = DIR.UP;
        else if (movingDown) pacman.nextDirection = DIR.DOWN;
        else if (movingLeft) pacman.nextDirection = DIR.LEFT;
        else if (movingRight) pacman.nextDirection = DIR.RIGHT;

        if (isAlignedWithGrid(pacman.pixelX, pacman.pixelY) && pacman.nextDirection !== DIR.NONE) {
            if (!isWalkable(pacman.gridX, pacman.gridY)) {
                pacman.pixelX = pacman.gridX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                pacman.pixelY = pacman.gridY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                return;
            }

            const nextGridX = pacman.gridX + pacman.nextDirection.x;
            const nextGridY = pacman.gridY + pacman.nextDirection.y;
            if (isWalkable(nextGridX, nextGridY)) {
                pacman.direction = pacman.nextDirection;
                pacman.nextDirection = DIR.NONE;
                pacman.pixelX = pacman.gridX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                pacman.pixelY = pacman.gridY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
            }
        }

        if (pacman.direction !== DIR.NONE) {
            const newPixelX = pacman.pixelX + pacman.direction.x * pacman.speed;
            const newPixelY = pacman.pixelY + pacman.direction.y * pacman.speed;
            const newGridX = Math.floor(newPixelX / BASE_TILE_SIZE);
            const newGridY = Math.floor(newPixelY / BASE_TILE_SIZE);

            if (newGridY === 14) {
                if (newPixelX < 0) {
                    pacman.pixelX = (GRID_WIDTH - 1) * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                    return;
                }
                if (newPixelX >= GRID_WIDTH * BASE_TILE_SIZE) {
                    pacman.pixelX = BASE_TILE_SIZE / 2;
                    return;
                }
            }

            if (isWalkable(newGridX, newGridY)) {
                pacman.pixelX = newPixelX;
                pacman.pixelY = newPixelY;

                if (pacman.gridX !== newGridX || pacman.gridY !== newGridY) {
                    const tile = maze[newGridY][newGridX];
                    if (tile === TILE.DOT) {
                        maze[newGridY][newGridX] = TILE.EMPTY;
                        score += 10;
                        dotsRemaining--;
                    } else if (tile === TILE.POWER) {
                        maze[newGridY][newGridX] = TILE.EMPTY;
                        score += 50;
                        dotsRemaining--;
                        activatePowerMode();
                    }
                }
            } else {
                pacman.direction = DIR.NONE;
                pacman.pixelX = pacman.gridX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                pacman.pixelY = pacman.gridY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
            }
        }
    }

    // Activate power mode
    function activatePowerMode() {
        powerMode = true;
        powerModeTimer = POWER_MODE_DURATION;

        ghosts.forEach(ghost => {
            if (ghost.mode !== 'eaten' && ghost.mode !== 'exiting') {
                ghost.mode = 'frightened';
            }
        });
    }

    // Update ghosts
    function updateGhosts() {
        ghosts.forEach(ghost => {
            ghost.animation++;

            ghost.gridX = Math.floor(ghost.pixelX / BASE_TILE_SIZE);
            ghost.gridY = Math.floor(ghost.pixelY / BASE_TILE_SIZE);

            if (ghost.mode === 'eaten' && ghost.gridX === 14 && ghost.gridY === 14) {
                ghost.mode = 'exiting';
            }

            if (ghost.mode === 'exiting' && ghost.gridX === 14 && ghost.gridY === 11) {
                ghost.mode = 'chase';
            }

            if (isAlignedWithGrid(ghost.pixelX, ghost.pixelY)) {
                const newDirection = chooseGhostDirection(ghost);
                if (newDirection !== DIR.NONE) {
                    if (newDirection.name !== ghost.direction.name) {
                        ghost.pixelX = ghost.gridX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                        ghost.pixelY = ghost.gridY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                    }
                    ghost.direction = newDirection;
                }
            }

            let currentSpeed = ghost.speed;
            if (ghost.mode === 'eaten') {
                currentSpeed = 5.0;
            } else if (ghost.mode === 'frightened') {
                currentSpeed = 2.0;
            }

            if (ghost.direction !== DIR.NONE) {
                const newPixelX = ghost.pixelX + ghost.direction.x * currentSpeed;
                const newPixelY = ghost.pixelY + ghost.direction.y * currentSpeed;
                const newGridX = Math.floor(newPixelX / BASE_TILE_SIZE);
                const newGridY = Math.floor(newPixelY / BASE_TILE_SIZE);

                if (newGridY === 14) {
                    if (newPixelX < 0) {
                        ghost.pixelX = (GRID_WIDTH - 1) * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                        return;
                    }
                    if (newPixelX >= GRID_WIDTH * BASE_TILE_SIZE) {
                        ghost.pixelX = BASE_TILE_SIZE / 2;
                        return;
                    }
                }

                if (isWalkableForGhost(newGridX, newGridY, ghost)) {
                    ghost.pixelX = newPixelX;
                    ghost.pixelY = newPixelY;
                } else {
                    ghost.pixelX = ghost.gridX * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                    ghost.pixelY = ghost.gridY * BASE_TILE_SIZE + BASE_TILE_SIZE / 2;
                }
            }
        });
    }

    // Check collisions
    function checkCollisions() {
        if (!pacman) return;

        ghosts.forEach(ghost => {
            if (ghost.gridX === pacman.gridX && ghost.gridY === pacman.gridY) {
                if (ghost.mode === 'frightened') {
                    ghost.mode = 'eaten';
                    score += 200;
                } else if (ghost.mode !== 'eaten' && ghost.mode !== 'exiting') {
                    loseLife();
                }
            }
        });
    }

    // Lose a life
    function loseLife() {
        lives--;
        if (lives <= 0) {
            gameState = 'gameover';
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('pacmanHighScore', highScore);
            }
        } else {
            pacman = createPacman();
            ghosts = createGhosts();
            powerMode = false;
            powerModeTimer = 0;
        }
    }

    // Update power mode timer
    function updatePowerMode() {
        if (powerMode) {
            powerModeTimer--;
            if (powerModeTimer <= 0) {
                powerMode = false;
                ghosts.forEach(ghost => {
                    if (ghost.mode === 'frightened') {
                        ghost.mode = 'chase';
                    }
                });
            }
        }
    }

    // Check level complete
    function checkLevelComplete() {
        if (dotsRemaining <= 0) {
            level++;
            createMaze();
            pacman = createPacman();
            ghosts = createGhosts();
            powerMode = false;
            powerModeTimer = 0;
        }
    }

    // Game update loop
    function update() {
        if (gameState !== 'playing') return;

        updatePacman();
        updateGhosts();
        checkCollisions();
        updatePowerMode();
        checkLevelComplete();
    }

    // Render maze
    function renderMaze() {
        const tileSize = getTileSize();

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const tile = maze[y][x];
                const px = x * tileSize;
                const py = y * tileSize;

                if (tile === TILE.WALL) {
                    ctx.fillStyle = '#2121FF';
                    ctx.fillRect(px, py, tileSize, tileSize);
                    ctx.strokeStyle = '#4242FF';
                    ctx.lineWidth = Math.max(1, scaleFactor);
                    ctx.strokeRect(px, py, tileSize, tileSize);
                } else if (tile === TILE.DOT) {
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(px + tileSize / 2, py + tileSize / 2, 2 * scaleFactor, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === TILE.POWER) {
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(px + tileSize / 2, py + tileSize / 2, 5 * scaleFactor, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === TILE.GHOST_HOUSE) {
                    ctx.fillStyle = '#FF69B4';
                    ctx.globalAlpha = 0.2;
                    ctx.fillRect(px, py, tileSize, tileSize);
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }

    // Render Pac-Man
    function renderPacman() {
        if (!pacman) return;

        const tileSize = getTileSize();
        const px = pacman.pixelX * scaleFactor;
        const py = pacman.pixelY * scaleFactor;
        const radius = tileSize / 2 - 2 * scaleFactor;

        const mouthAngle = Math.abs(Math.sin(pacman.animation * 0.2)) * 0.4;

        let startAngle = mouthAngle;
        let endAngle = Math.PI * 2 - mouthAngle;

        if (pacman.direction === DIR.RIGHT) {
            startAngle = mouthAngle;
            endAngle = Math.PI * 2 - mouthAngle;
        } else if (pacman.direction === DIR.LEFT) {
            startAngle = Math.PI + mouthAngle;
            endAngle = Math.PI - mouthAngle;
        } else if (pacman.direction === DIR.UP) {
            startAngle = Math.PI * 1.5 + mouthAngle;
            endAngle = Math.PI * 1.5 - mouthAngle;
        } else if (pacman.direction === DIR.DOWN) {
            startAngle = Math.PI * 0.5 + mouthAngle;
            endAngle = Math.PI * 0.5 - mouthAngle;
        }

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(px, py, radius, startAngle, endAngle);
        ctx.lineTo(px, py);
        ctx.closePath();
        ctx.fill();
    }

    // Render ghost
    function renderGhost(ghost) {
        const tileSize = getTileSize();
        const px = ghost.pixelX * scaleFactor;
        const py = ghost.pixelY * scaleFactor;
        const radius = tileSize / 2 - 2 * scaleFactor;

        if (ghost.mode === 'eaten') {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(px - 4 * scaleFactor, py, 3 * scaleFactor, 0, Math.PI * 2);
            ctx.arc(px + 4 * scaleFactor, py, 3 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0000FF';
            ctx.beginPath();
            ctx.arc(px - 4 * scaleFactor, py, 1.5 * scaleFactor, 0, Math.PI * 2);
            ctx.arc(px + 4 * scaleFactor, py, 1.5 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Flashing when power mode ending
            if (ghost.mode === 'frightened' && powerModeTimer < 90 && Math.floor(powerModeTimer / 10) % 2 === 0) {
                ctx.fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = ghost.mode === 'frightened' ? '#0000FF' : ghost.color;
            }

            ctx.beginPath();
            ctx.arc(px, py - 2 * scaleFactor, radius, Math.PI, 0);
            ctx.lineTo(px + radius, py + radius);
            ctx.lineTo(px + radius - 4 * scaleFactor, py + radius - 4 * scaleFactor);
            ctx.lineTo(px, py + radius);
            ctx.lineTo(px - radius + 4 * scaleFactor, py + radius - 4 * scaleFactor);
            ctx.lineTo(px - radius, py + radius);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(px - 4 * scaleFactor, py - 2 * scaleFactor, 3 * scaleFactor, 0, Math.PI * 2);
            ctx.arc(px + 4 * scaleFactor, py - 2 * scaleFactor, 3 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px - 4 * scaleFactor, py - 2 * scaleFactor, 1.5 * scaleFactor, 0, Math.PI * 2);
            ctx.arc(px + 4 * scaleFactor, py - 2 * scaleFactor, 1.5 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Render game
    function render() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (gameState === 'playing') {
            renderMaze();
            renderPacman();
            ghosts.forEach(renderGhost);
        } else if (gameState === 'gameover') {
            renderMaze();
            ghosts.forEach(renderGhost);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            const fontSize = Math.max(24, CANVAS_WIDTH / 15);
            ctx.fillStyle = '#FF0000';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - fontSize);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${fontSize * 0.6}px Arial`;
            ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + fontSize * 0.5);
            ctx.fillText('Tap NEW to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + fontSize * 1.5);
        }
    }

    // Game loop
    function gameLoop(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const deltaTime = timestamp - lastFrameTime;

        if (deltaTime >= FRAME_DURATION) {
            update();
            render();
            updateHUD();
            lastFrameTime = timestamp - (deltaTime % FRAME_DURATION);
        }

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Update HUD elements
    function updateHUD() {
        const scoreEl = document.getElementById('pacmanScore');
        const highEl = document.getElementById('pacmanHigh');
        const livesEl = document.getElementById('pacmanLives');
        const levelEl = document.getElementById('pacmanLevel');

        if (scoreEl) scoreEl.textContent = score;
        if (highEl) highEl.textContent = highScore;
        if (livesEl) livesEl.textContent = '🟡'.repeat(lives);
        if (levelEl) levelEl.textContent = level;
    }

    // Setup touch controls
    function setupControls() {
        const btnUp = document.getElementById('pacmanBtnUp');
        const btnDown = document.getElementById('pacmanBtnDown');
        const btnLeft = document.getElementById('pacmanBtnLeft');
        const btnRight = document.getElementById('pacmanBtnRight');

        function addControlListeners(btn, startFn, endFn) {
            if (!btn) return;
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); startFn(); }, { passive: false });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); endFn(); }, { passive: false });
            btn.addEventListener('touchcancel', endFn);
            btn.addEventListener('mousedown', (e) => { e.preventDefault(); startFn(); });
            btn.addEventListener('mouseup', endFn);
            btn.addEventListener('mouseleave', endFn);
        }

        addControlListeners(btnUp, () => { movingUp = true; }, () => { movingUp = false; });
        addControlListeners(btnDown, () => { movingDown = true; }, () => { movingDown = false; });
        addControlListeners(btnLeft, () => { movingLeft = true; }, () => { movingLeft = false; });
        addControlListeners(btnRight, () => { movingRight = true; }, () => { movingRight = false; });
    }

    // Handle keyboard input
    function handleKeyDown(e) {
        if (gameState !== 'playing') return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                movingUp = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                movingDown = true;
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                movingLeft = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                movingRight = true;
                e.preventDefault();
                break;
        }
    }

    function handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                movingUp = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                movingDown = false;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                movingLeft = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                movingRight = false;
                break;
        }
    }

    // Start new game
    function startNewGame() {
        score = 0;
        lives = 3;
        level = 1;
        powerMode = false;
        powerModeTimer = 0;
        movingUp = movingDown = movingLeft = movingRight = false;

        createMaze();
        pacman = createPacman();
        ghosts = createGhosts();
        gameState = 'playing';
    }

    // Initialize game
    function initGame() {
        canvas = document.getElementById('pacmanCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        ctx = canvas.getContext('2d');
        resizeCanvas();

        createMaze();
        pacman = createPacman();
        ghosts = createGhosts();

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        window.addEventListener('resize', resizeCanvas);

        gameLoop(0);
    }

    // Show help modal
    function showHelp() {
        document.getElementById('pacmanHelpModal').style.display = 'flex';
    }

    function hideHelp() {
        document.getElementById('pacmanHelpModal').style.display = 'none';
    }

    // Toggle D-pad between left and right side
    function toggleHand() {
        const leftSide = document.getElementById('pacmanLeftSide');
        const rightSide = document.getElementById('pacmanRightSide');
        const dpad = document.getElementById('pacmanDpad');
        const handBtn = document.getElementById('pacmanHandBtn');

        const isLeftHanded = localStorage.getItem('pacmanLeftHanded') === 'true';

        if (isLeftHanded) {
            // Switch to right-handed (D-pad on right)
            rightSide.appendChild(dpad);
            leftSide.innerHTML = '';
            leftSide.appendChild(handBtn);
            localStorage.setItem('pacmanLeftHanded', 'false');
        } else {
            // Switch to left-handed (D-pad on left)
            leftSide.appendChild(dpad);
            rightSide.innerHTML = '';
            rightSide.appendChild(handBtn);
            localStorage.setItem('pacmanLeftHanded', 'true');
        }

        // Re-setup controls after DOM changes
        setupControls();
    }

    // Apply saved hand preference on load
    function applyHandPreference() {
        const isLeftHanded = localStorage.getItem('pacmanLeftHanded') === 'true';
        if (isLeftHanded) {
            const leftSide = document.getElementById('pacmanLeftSide');
            const rightSide = document.getElementById('pacmanRightSide');
            const dpad = document.getElementById('pacmanDpad');
            const handBtn = document.getElementById('pacmanHandBtn');

            if (leftSide && rightSide && dpad && handBtn) {
                leftSide.appendChild(dpad);
                rightSide.innerHTML = '';
                rightSide.appendChild(handBtn);
            }
        }
    }

    // Launch game
    window.launchPacman = function() {
        if (typeof hideAllMenus === 'function') hideAllMenus();
        document.getElementById('pacmanGame').style.display = 'flex';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!animationFrameId) {
                    initGame();
                } else {
                    resizeCanvas();
                }
                applyHandPreference();
                setupControls();
                startNewGame();
            });
        });
    };

    // Exit game
    window.exitPacman = function() {
        document.getElementById('pacmanGame').style.display = 'none';
        document.getElementById('arcadeMenu').style.display = 'block';

        movingUp = movingDown = movingLeft = movingRight = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        gameState = 'playing';
        lastFrameTime = 0;
    };

    // Expose functions
    window.pacmanNewGame = startNewGame;
    window.pacmanShowHelp = showHelp;
    window.pacmanHideHelp = hideHelp;
    window.pacmanToggleHand = toggleHand;

})();

// Galaxian Game - Classic 1979 arcade space shooter
(function() {
    'use strict';

    // Dynamic canvas sizing
    const BASE_WIDTH = 360;
    const BASE_HEIGHT = 480;
    let CANVAS_WIDTH = 360;
    let CANVAS_HEIGHT = 480;
    let scaleFactor = 1;

    // Base game constants (will be scaled)
    const BASE_PLAYER_WIDTH = 24;
    const BASE_PLAYER_HEIGHT = 24;
    const BASE_PLAYER_SPEED = 4;
    const BASE_BULLET_WIDTH = 3;
    const BASE_BULLET_HEIGHT = 12;
    const BASE_BULLET_SPEED = 8;
    const BASE_ENEMY_WIDTH = 20;
    const BASE_ENEMY_HEIGHT = 20;
    const ENEMY_ROWS = 5;
    const ENEMY_COLS = 10;
    const BASE_ENEMY_SPACING_X = 32;
    const BASE_ENEMY_SPACING_Y = 32;
    const BASE_ENEMY_START_X = 40;
    const BASE_ENEMY_START_Y = 60;
    const BASE_DIVE_SPEED = 3;
    const BASE_ENEMY_BULLET_SPEED = 4;

    // Scaled getters
    function getPlayerWidth() { return BASE_PLAYER_WIDTH * scaleFactor; }
    function getPlayerHeight() { return BASE_PLAYER_HEIGHT * scaleFactor; }
    function getPlayerSpeed() { return BASE_PLAYER_SPEED * scaleFactor; }
    function getBulletWidth() { return BASE_BULLET_WIDTH * scaleFactor; }
    function getBulletHeight() { return BASE_BULLET_HEIGHT * scaleFactor; }
    function getBulletSpeed() { return BASE_BULLET_SPEED * scaleFactor; }
    function getEnemyWidth() { return BASE_ENEMY_WIDTH * scaleFactor; }
    function getEnemyHeight() { return BASE_ENEMY_HEIGHT * scaleFactor; }
    function getEnemyBulletSpeed() { return BASE_ENEMY_BULLET_SPEED * scaleFactor; }

    // Resize canvas to fill wrapper
    function resizeCanvas() {
        const wrapper = document.getElementById('galaxianCanvasWrapper');
        if (!wrapper || !gameState.canvas) return;

        let w = wrapper.clientWidth;
        let h = wrapper.clientHeight;

        if (w === 0 || h === 0) {
            w = window.innerWidth;
            h = window.innerHeight - 120;
        }

        // Maintain aspect ratio (3:4)
        const targetRatio = BASE_WIDTH / BASE_HEIGHT;
        const currentRatio = w / h;

        if (currentRatio > targetRatio) {
            CANVAS_HEIGHT = h;
            CANVAS_WIDTH = h * targetRatio;
        } else {
            CANVAS_WIDTH = w;
            CANVAS_HEIGHT = w / targetRatio;
        }

        gameState.canvas.width = CANVAS_WIDTH;
        gameState.canvas.height = CANVAS_HEIGHT;

        scaleFactor = CANVAS_WIDTH / BASE_WIDTH;
    }

    // Enemy types with colors and point values
    const ENEMY_TYPES = {
        FLAGSHIP: { color: '#FF0000', points: 150, row: 0 },
        RED: { color: '#FF6666', points: 80, row: 1 },
        PURPLE: { color: '#FF00FF', points: 60, rows: [2, 3] },
        BLUE: { color: '#00FFFF', points: 50, rows: [4] }
    };

    // Game state
    let gameState = {
        canvas: null,
        ctx: null,
        player: null,
        bullet: null,
        enemies: [],
        enemyBullets: [],
        stars: [],
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        paused: false,
        animationId: null,
        formationOffsetX: 0,
        formationDirection: 1,
        keys: {},
        shootCooldown: 0,
        respawning: false,
        respawnTimer: 0,
        invincible: false,
        invincibilityTimer: 0,
        blinkTimer: 0
    };

    // Player object
    class Player {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        get width() { return getPlayerWidth(); }
        get height() { return getPlayerHeight(); }
        get speed() { return getPlayerSpeed(); }

        draw(ctx) {
            // Blink when invincible (skip drawing every 8 frames)
            if (gameState.invincible && Math.floor(gameState.blinkTimer / 8) % 2 === 0) {
                return;
            }

            const w = this.width;
            const h = this.height;

            // Draw simple spaceship shape
            ctx.fillStyle = '#00FF00';
            ctx.beginPath();
            ctx.moveTo(this.x + w / 2, this.y);
            ctx.lineTo(this.x + w, this.y + h);
            ctx.lineTo(this.x + w / 2, this.y + h * 0.7);
            ctx.lineTo(this.x, this.y + h);
            ctx.closePath();
            ctx.fill();
        }

        moveLeft() {
            this.x = Math.max(10 * scaleFactor, this.x - this.speed);
        }

        moveRight() {
            this.x = Math.min(CANVAS_WIDTH - this.width - 10 * scaleFactor, this.x + this.speed);
        }
    }

    // Bullet object
    class Bullet {
        constructor(x, y, speed) {
            this.x = x;
            this.y = y;
            this.speed = speed;
        }

        get width() { return getBulletWidth(); }
        get height() { return getBulletHeight(); }

        draw(ctx) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y -= this.speed;
        }

        isOffScreen() {
            return this.y + this.height < 0;
        }
    }

    // Enemy bullet object
    class EnemyBullet extends Bullet {
        update() {
            this.y += this.speed;
        }

        isOffScreen() {
            return this.y > CANVAS_HEIGHT;
        }
    }

    // Star object for background
    class Star {
        constructor() {
            this.baseX = Math.random();
            this.baseY = Math.random();
            this.baseSpeed = Math.random() * 2 + 1;
            this.brightness = Math.random() * 0.5 + 0.5;
        }

        get x() { return this.baseX * CANVAS_WIDTH; }
        get y() { return this.baseY * CANVAS_HEIGHT; }
        get speed() { return this.baseSpeed * scaleFactor; }

        draw(ctx) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
            ctx.fillRect(this.x, this.y, Math.max(1, scaleFactor), Math.max(1, scaleFactor));
        }

        update() {
            this.baseY += this.baseSpeed * scaleFactor / CANVAS_HEIGHT;
            if (this.baseY > 1) {
                this.baseY = 0;
                this.baseX = Math.random();
            }
        }
    }

    // Enemy object
    class Enemy {
        constructor(x, y, type, row, col) {
            this.homeX = x;
            this.homeY = y;
            this.x = x;
            this.y = y;
            this.type = type;
            this.row = row;
            this.col = col;
            this.diving = false;
            this.divePhase = 0;
            this.diveStartX = 0;
            this.diveStartY = 0;
            this.diveTargetX = 0;
            this.shootTimer = 0;
            this.alive = true;
        }

        get width() { return getEnemyWidth(); }
        get height() { return getEnemyHeight(); }

        draw(ctx) {
            if (!this.alive) return;

            const w = this.width;
            const h = this.height;
            const wingSize = 4 * scaleFactor;

            ctx.fillStyle = this.type.color;

            // Draw spaceship body - diamond/arrow shape
            ctx.beginPath();
            ctx.moveTo(this.x + w / 2, this.y); // Top point
            ctx.lineTo(this.x + w, this.y + h * 0.6); // Right side
            ctx.lineTo(this.x + w / 2, this.y + h); // Bottom point
            ctx.lineTo(this.x, this.y + h * 0.6); // Left side
            ctx.closePath();
            ctx.fill();

            // Draw wings/fins extending out
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + h * 0.6);
            ctx.lineTo(this.x - wingSize, this.y + h * 0.5);
            ctx.lineTo(this.x, this.y + h * 0.4);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.x + w, this.y + h * 0.6);
            ctx.lineTo(this.x + w + wingSize, this.y + h * 0.5);
            ctx.lineTo(this.x + w, this.y + h * 0.4);
            ctx.fill();

            // Add cockpit detail for flagships
            if (this.type === ENEMY_TYPES.FLAGSHIP) {
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(this.x + w / 2, this.y + h * 0.5, 3 * scaleFactor, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        update(formationOffsetX) {
            if (!this.alive) return;

            if (this.diving) {
                this.updateDive();
            } else {
                // Follow formation
                this.x = this.homeX + formationOffsetX;
                this.y = this.homeY;

                // Random chance to start diving (limited by max diving enemies)
                const divingCount = gameState.enemies.filter(e => e.alive && e.diving).length;
                if (divingCount < 2 && Math.random() < 0.0002) {
                    this.startDive();
                }
            }

            // Shoot occasionally when diving
            if (this.diving && Math.random() < 0.02) {
                this.shoot();
            }
        }

        startDive() {
            this.diving = true;
            this.divePhase = 0;
            this.diveStartX = this.x;
            this.diveStartY = this.y;
            // Use player position if exists, otherwise use center screen
            this.diveTargetX = gameState.player ? gameState.player.x : CANVAS_WIDTH / 2;
        }

        updateDive() {
            this.divePhase += 0.01;

            // S-curve dive pattern (scaled)
            const progress = this.divePhase;
            const curveOffset = Math.sin(progress * Math.PI * 2) * 80 * scaleFactor;

            this.x = this.diveStartX + curveOffset;
            this.y = this.diveStartY + progress * 100 * scaleFactor;

            // Return to formation or die off screen
            if (this.y > CANVAS_HEIGHT + 50 * scaleFactor) {
                this.diving = false;
                this.x = this.homeX;
                this.y = this.homeY;
                this.divePhase = 0;
            }
        }

        shoot() {
            const bullet = new EnemyBullet(
                this.x + this.width / 2 - getBulletWidth() / 2,
                this.y + this.height,
                getEnemyBulletSpeed()
            );
            gameState.enemyBullets.push(bullet);
        }

        getPoints() {
            // Double points if diving
            return this.type.points * (this.diving ? 2 : 1);
        }
    }

    // Initialize game
    function initGame() {
        const canvas = document.getElementById('galaxianCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        gameState.canvas = canvas;
        gameState.ctx = canvas.getContext('2d');

        resizeCanvas();

        resetGame();
        setupControls();
        gameLoop();
    }

    function resetGame() {
        // Reset player
        gameState.player = new Player(
            CANVAS_WIDTH / 2 - getPlayerWidth() / 2,
            CANVAS_HEIGHT - 60 * scaleFactor
        );

        // Reset game state
        gameState.bullet = null;
        gameState.enemies = [];
        gameState.enemyBullets = [];
        gameState.score = 0;
        gameState.lives = 3;
        gameState.level = 1;
        gameState.gameOver = false;
        gameState.formationOffsetX = 0;
        gameState.formationDirection = 1;
        gameState.shootCooldown = 0;
        gameState.respawning = false;
        gameState.respawnTimer = 0;
        gameState.invincible = false;
        gameState.invincibilityTimer = 0;
        gameState.blinkTimer = 0;

        // Create starfield
        gameState.stars = [];
        for (let i = 0; i < 50; i++) {
            gameState.stars.push(new Star());
        }

        createEnemyFormation();
    }

    function createEnemyFormation() {
        gameState.enemies = [];

        const startX = BASE_ENEMY_START_X * scaleFactor;
        const startY = BASE_ENEMY_START_Y * scaleFactor;
        const spacingX = BASE_ENEMY_SPACING_X * scaleFactor;
        const spacingY = BASE_ENEMY_SPACING_Y * scaleFactor;

        for (let row = 0; row < ENEMY_ROWS; row++) {
            for (let col = 0; col < ENEMY_COLS; col++) {
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                let type;
                if (row === 0 && (col === 4 || col === 5)) {
                    type = ENEMY_TYPES.FLAGSHIP;
                } else if (row === 1) {
                    type = ENEMY_TYPES.RED;
                } else if (row === 2 || row === 3) {
                    type = ENEMY_TYPES.PURPLE;
                } else {
                    type = ENEMY_TYPES.BLUE;
                }

                gameState.enemies.push(new Enemy(x, y, type, row, col));
            }
        }
    }

    function setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            gameState.keys[e.key] = true;

            if (e.key === ' ') {
                e.preventDefault();
            }

            if (e.key === 'r' && gameState.gameOver) {
                resetGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            gameState.keys[e.key] = false;
        });
    }

    function shoot() {
        if (!gameState.player) return;
        if (!gameState.bullet) {
            gameState.bullet = new Bullet(
                gameState.player.x + gameState.player.width / 2 - getBulletWidth() / 2,
                gameState.player.y,
                getBulletSpeed()
            );
        }
    }

    function handleInput() {
        // Don't handle input if player doesn't exist
        if (!gameState.player) return;

        if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
            gameState.player.moveLeft();
        }
        if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
            gameState.player.moveRight();
        }

        // Auto-fire when holding space
        if (gameState.keys[' '] && !gameState.gameOver) {
            if (gameState.shootCooldown <= 0 && !gameState.bullet) {
                shoot();
                gameState.shootCooldown = 15; // Cooldown frames between shots
            }
        }
    }

    function updateFormation() {
        gameState.formationOffsetX += gameState.formationDirection * 0.5 * scaleFactor;

        if (gameState.formationOffsetX > 30 * scaleFactor || gameState.formationOffsetX < -30 * scaleFactor) {
            gameState.formationDirection *= -1;
        }
    }

    function checkCollisions() {
        // Player bullet hits enemies
        if (gameState.bullet) {
            for (let enemy of gameState.enemies) {
                if (enemy.alive && checkRectCollision(gameState.bullet, enemy)) {
                    enemy.alive = false;
                    gameState.score += enemy.getPoints();
                    gameState.bullet = null;
                    break;
                }
            }
        }

        // Enemy bullets hit player (only if not invincible and player exists)
        if (!gameState.invincible && gameState.player) {
            for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
                const bullet = gameState.enemyBullets[i];
                if (checkRectCollision(bullet, gameState.player)) {
                    gameState.enemyBullets.splice(i, 1);
                    loseLife();
                    return; // Exit early - player may now be null
                }
            }

            // Enemy collision with player (re-check player exists)
            if (gameState.player) {
                for (let enemy of gameState.enemies) {
                    if (enemy.alive && checkRectCollision(enemy, gameState.player)) {
                        enemy.alive = false;
                        loseLife();
                        return; // Exit early
                    }
                }
            }
        }
    }

    function checkRectCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    function loseLife() {
        // Only lose life if not already respawning
        if (gameState.respawning) return;

        gameState.lives--;

        if (gameState.lives <= 0) {
            gameState.gameOver = true;
        } else {
            // Set up respawn
            gameState.respawning = true;
            gameState.respawnTimer = 60; // 1 second at 60fps
            gameState.player = null; // Remove player temporarily
        }
    }

    function checkLevelComplete() {
        const aliveEnemies = gameState.enemies.filter(e => e.alive).length;
        if (aliveEnemies === 0) {
            gameState.level++;
            createEnemyFormation();
        }
    }

    function update() {
        if (gameState.gameOver || gameState.paused) return;

        // Handle respawning
        if (gameState.respawning) {
            gameState.respawnTimer--;
            if (gameState.respawnTimer <= 0) {
                // Respawn player
                gameState.player = new Player(
                    CANVAS_WIDTH / 2 - getPlayerWidth() / 2,
                    CANVAS_HEIGHT - 60 * scaleFactor
                );
                gameState.respawning = false;
                gameState.invincible = true;
                gameState.invincibilityTimer = 180; // 3 seconds at 60fps
                gameState.blinkTimer = 0;
            }
        }

        // Handle invincibility timer
        if (gameState.invincible) {
            gameState.invincibilityTimer--;
            gameState.blinkTimer++;
            if (gameState.invincibilityTimer <= 0) {
                gameState.invincible = false;
            }
        }

        // Decrement shoot cooldown
        if (gameState.shootCooldown > 0) {
            gameState.shootCooldown--;
        }

        handleInput();
        updateFormation();

        // Update stars
        gameState.stars.forEach(star => star.update());

        // Update player bullet
        if (gameState.bullet) {
            gameState.bullet.update();
            if (gameState.bullet.isOffScreen()) {
                gameState.bullet = null;
            }
        }

        // Update enemies
        gameState.enemies.forEach(enemy => enemy.update(gameState.formationOffsetX));

        // Update enemy bullets
        for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
            gameState.enemyBullets[i].update();
            if (gameState.enemyBullets[i].isOffScreen()) {
                gameState.enemyBullets.splice(i, 1);
            }
        }

        checkCollisions();
        checkLevelComplete();
    }

    function draw() {
        const ctx = gameState.ctx;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw stars
        gameState.stars.forEach(star => star.draw(ctx));

        // Draw player (if exists)
        if (gameState.player) {
            gameState.player.draw(ctx);
        }

        // Draw player bullet
        if (gameState.bullet) {
            gameState.bullet.draw(ctx);
        }

        // Draw enemies
        gameState.enemies.forEach(enemy => enemy.draw(ctx));

        // Draw enemy bullets
        gameState.enemyBullets.forEach(bullet => bullet.draw(ctx));

        // Draw UI
        drawUI(ctx);

        if (gameState.gameOver) {
            drawGameOver(ctx);
        }
    }

    function drawUI(ctx) {
        const fontSize = Math.max(12, 16 * scaleFactor);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(`Score: ${gameState.score}`, 10 * scaleFactor, 20 * scaleFactor);
        ctx.fillText(`Lives: ${gameState.lives}`, 10 * scaleFactor, 40 * scaleFactor);
        ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH - 90 * scaleFactor, 20 * scaleFactor);
    }

    function drawGameOver(ctx) {
        const boxHeight = 160 * scaleFactor;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, CANVAS_HEIGHT / 2 - boxHeight / 2, CANVAS_WIDTH, boxHeight);

        const titleSize = Math.max(20, 32 * scaleFactor);
        ctx.fillStyle = '#FF0000';
        ctx.font = `bold ${titleSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30 * scaleFactor);

        const scoreSize = Math.max(14, 18 * scaleFactor);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${scoreSize}px monospace`;
        ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        // Restart button (scaled)
        const btnWidth = 160 * scaleFactor;
        const btnHeight = 50 * scaleFactor;
        ctx.fillStyle = '#28a745';
        ctx.fillRect(CANVAS_WIDTH / 2 - btnWidth / 2, CANVAS_HEIGHT / 2 + 20 * scaleFactor, btnWidth, btnHeight);
        const btnFontSize = Math.max(14, 20 * scaleFactor);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${btnFontSize}px monospace`;
        ctx.fillText('RESTART', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20 * scaleFactor + btnHeight / 2 + btnFontSize / 3);

        ctx.textAlign = 'left';
    }

    function gameLoop() {
        update();
        draw();
        gameState.animationId = requestAnimationFrame(gameLoop);
    }

    // Setup mobile touch controls
    function setupMobileControls() {
        const canvas = gameState.canvas;
        const btnLeft = document.getElementById('galaxianBtnLeft');
        const btnRight = document.getElementById('galaxianBtnRight');
        const btnFire = document.getElementById('galaxianBtnFire');

        // Add canvas click/touch for restart button
        const handleCanvasClick = (e) => {
            if (!gameState.gameOver) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            let clientX, clientY;
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;

            // Check if click is on restart button (scaled)
            const btnWidth = 160 * scaleFactor;
            const btnHeight = 50 * scaleFactor;
            const buttonX = CANVAS_WIDTH / 2 - btnWidth / 2;
            const buttonY = CANVAS_HEIGHT / 2 + 20 * scaleFactor;

            if (x >= buttonX && x <= buttonX + btnWidth &&
                y >= buttonY && y <= buttonY + btnHeight) {
                resetGame();
            }
        };

        canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener('touchstart', handleCanvasClick);

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); gameState.keys['ArrowLeft'] = true; }, { passive: false });
            btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); gameState.keys['ArrowLeft'] = false; }, { passive: false });
            btnLeft.addEventListener('touchcancel', () => { gameState.keys['ArrowLeft'] = false; });
            btnLeft.addEventListener('mousedown', (e) => { e.preventDefault(); gameState.keys['ArrowLeft'] = true; });
            btnLeft.addEventListener('mouseup', () => { gameState.keys['ArrowLeft'] = false; });
            btnLeft.addEventListener('mouseleave', () => { gameState.keys['ArrowLeft'] = false; });
        }

        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); gameState.keys['ArrowRight'] = true; }, { passive: false });
            btnRight.addEventListener('touchend', (e) => { e.preventDefault(); gameState.keys['ArrowRight'] = false; }, { passive: false });
            btnRight.addEventListener('touchcancel', () => { gameState.keys['ArrowRight'] = false; });
            btnRight.addEventListener('mousedown', (e) => { e.preventDefault(); gameState.keys['ArrowRight'] = true; });
            btnRight.addEventListener('mouseup', () => { gameState.keys['ArrowRight'] = false; });
            btnRight.addEventListener('mouseleave', () => { gameState.keys['ArrowRight'] = false; });
        }

        if (btnFire) {
            btnFire.addEventListener('touchstart', (e) => { e.preventDefault(); gameState.keys[' '] = true; }, { passive: false });
            btnFire.addEventListener('touchend', (e) => { e.preventDefault(); gameState.keys[' '] = false; }, { passive: false });
            btnFire.addEventListener('touchcancel', () => { gameState.keys[' '] = false; });
            btnFire.addEventListener('mousedown', (e) => { e.preventDefault(); gameState.keys[' '] = true; });
            btnFire.addEventListener('mouseup', () => { gameState.keys[' '] = false; });
            btnFire.addEventListener('mouseleave', () => { gameState.keys[' '] = false; });
        }
    }

    // Launch Galaxian
    window.launchGalaxian = function() {
        if (typeof hideAllMenus === 'function') hideAllMenus();
        document.getElementById('galaxianGame').style.display = 'flex';

        // Double RAF for layout to settle
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initGame();
                setupMobileControls();
                window.addEventListener('resize', resizeCanvas);
            });
        });
    };

    // Exit to menu
    window.exitGalaxian = function() {
        if (gameState.animationId) {
            cancelAnimationFrame(gameState.animationId);
            gameState.animationId = null;
        }
        window.removeEventListener('resize', resizeCanvas);
        document.getElementById('galaxianGame').style.display = 'none';
        document.getElementById('arcadeMenu').style.display = 'block';
    };

    // Restart game (for HTML button)
    window.galaxianRestart = function() {
        resetGame();
    };

})();

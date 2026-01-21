// Caverns of Mars - A faithful remake of the 1981 Atari classic
// by Greg Christensen, reimagined for Road Trip Games

(function() {
    'use strict';

    let canvas = null;
    let ctx = null;
    let gameLoopId = null;

    // Game constants - will be recalculated based on canvas size
    let GAME_WIDTH = 600;
    let GAME_HEIGHT = 700;
    let scaleFactor = 1;
    const SHIP_WIDTH = 30;
    const SHIP_HEIGHT = 30;
    const CAVE_WIDTH = 300;
    const SCROLL_SPEED = 2;
    const GRAVITY = 0.3;
    const MAX_FALL_SPEED = 4; // Increased from 2.5
    const SHOOT_SLOWDOWN = 1.5; // Increased from 0.4 - much stronger control
    const FUEL_DRAIN_RATE = 0.05; // Reduced from 0.1
    const SHOOT_FUEL_COST = 0.15; // Reduced from 0.3
    const FUEL_TANK_VALUE = 30;

    // Game state
    let gameState = {
        mode: 'menu', // menu, playing, descending, planting, escaping, won, gameover
        difficulty: 'medium',
        score: 0,
        highScore: localStorage.getItem('cavernsHighScore') || 0,
        level: 1,
        sectionsComplete: 0
    };

    // Player ship
    let ship = {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT * 0.4, // Start at 40% from top
        vx: 0,
        vy: 0,
        fuel: 100,
        health: 100,
        shooting: false
    };

    // Cave generation
    let cave = {
        segments: [],
        scrollOffset: 0,
        totalDepth: 0,
        sectionsPerLevel: { easy: 3, medium: 4, hard: 6 }
    };

    // Entities
    let bullets = [];
    let enemies = [];
    let fuelTanks = [];
    let explosions = [];

    // Input
    let keys = {};
    let mouseX = 0;
    let mouseY = 0;
    let mouseDown = false;
    let touchLeft = false;
    let touchRight = false;
    let touchShoot = false;

    // Cave segment generation
    function generateCaveSegment(y, isReactor = false) {
        const baseWidth = CAVE_WIDTH;
        const variance = Math.random() * 60 - 30;
        const leftWall = (GAME_WIDTH - baseWidth) / 2 + variance;
        const rightWall = leftWall + baseWidth;

        return {
            y: y,
            leftWall: leftWall,
            rightWall: rightWall,
            isReactor: isReactor
        };
    }

    function initializeCave() {
        cave.segments = [];
        cave.scrollOffset = 0;

        const totalSections = cave.sectionsPerLevel[gameState.difficulty];
        const segmentHeight = 50;
        const sectionsDepth = totalSections * 2000; // Each section is 2000 pixels

        // Generate cave segments
        for (let i = 0; i < sectionsDepth / segmentHeight + 20; i++) {
            const y = i * segmentHeight;
            const isReactor = (i * segmentHeight >= sectionsDepth - 100 && i * segmentHeight < sectionsDepth);
            cave.segments.push(generateCaveSegment(y, isReactor));
        }

        cave.totalDepth = sectionsDepth;

        // Add fuel tanks throughout
        fuelTanks = [];
        for (let i = 0; i < sectionsDepth / 300; i++) {
            const segment = cave.segments[Math.floor(Math.random() * cave.segments.length)];
            fuelTanks.push({
                x: segment.leftWall + Math.random() * (segment.rightWall - segment.leftWall - 30),
                y: segment.y + Math.random() * 50,
                width: 25,
                height: 25,
                active: true
            });
        }

        // Add enemies
        enemies = [];
        for (let i = 0; i < sectionsDepth / 400; i++) {
            const segment = cave.segments[Math.floor(Math.random() * cave.segments.length)];
            enemies.push({
                x: segment.leftWall + Math.random() * (segment.rightWall - segment.leftWall - 20),
                y: segment.y + Math.random() * 50,
                width: 20,
                height: 20,
                vx: Math.random() * 2 - 1,
                active: true,
                type: Math.random() > 0.5 ? 'rocket' : 'torpedo'
            });
        }
    }

    function resetGame() {
        ship.x = GAME_WIDTH / 2;
        ship.y = GAME_HEIGHT * 0.4; // Reset to 40% from top
        ship.vx = 0;
        ship.vy = 0;
        ship.fuel = 100;
        ship.health = 100;
        ship.shooting = false;

        gameState.score = 0;
        gameState.level = 1;
        gameState.sectionsComplete = 0;

        bullets = [];
        explosions = [];

        initializeCave();
    }

    function startGame(difficulty) {
        gameState.difficulty = difficulty;
        gameState.mode = 'descending';
        resetGame();
    }

    function updateShip(dt) {
        // Horizontal movement
        if (keys['ArrowLeft'] || keys['a'] || keys['A'] || touchLeft) {
            ship.vx = -3;
        } else if (keys['ArrowRight'] || keys['d'] || keys['D'] || touchRight) {
            ship.vx = 3;
        } else {
            ship.vx *= 0.9;
        }

        // Shooting
        ship.shooting = keys[' '] || touchShoot;

        // Vertical movement (gravity and shooting)
        if (ship.shooting && ship.fuel > 0) {
            if (gameState.mode === 'escaping') {
                // When escaping, shooting propels you upward - accelerate upward each frame
                ship.vy -= SHOOT_SLOWDOWN * 3; // 3x acceleration when escaping!
                ship.vy = Math.max(ship.vy, -15); // Even faster! (was -10)
                // Almost no fuel cost when escaping!
                ship.fuel = Math.max(0, ship.fuel - SHOOT_FUEL_COST * 0.05);
            } else {
                // When descending, shooting slows you down
                ship.vy = Math.max(ship.vy - SHOOT_SLOWDOWN, -1);
                ship.fuel = Math.max(0, ship.fuel - SHOOT_FUEL_COST);
            }

            // Create bullets (firing downward) - but not when escaping!
            if (gameState.mode !== 'escaping' && Math.random() < 0.3) {
                // Bullets start at ship position in world coordinates
                const worldY = ship.y + cave.scrollOffset;
                bullets.push({
                    x: ship.x - 10,
                    y: worldY + SHIP_HEIGHT / 2,
                    vy: 8, // Positive = down in world space
                    active: true
                });
                bullets.push({
                    x: ship.x + 10,
                    y: worldY + SHIP_HEIGHT / 2,
                    vy: 8,
                    active: true
                });
            }
        } else {
            // Gravity/deceleration when not shooting
            if (gameState.mode === 'escaping') {
                // During escape, apply drag to slow down when not thrusting
                ship.vy *= 0.95; // Lose 5% speed per frame
                // Small gravity pulls you back down
                ship.vy = Math.min(ship.vy + GRAVITY * dt * 0.3, MAX_FALL_SPEED);
            } else {
                ship.vy = Math.min(ship.vy + GRAVITY * dt, MAX_FALL_SPEED);
            }
        }

        // Update position
        ship.x += ship.vx;

        // Keep ship on screen horizontally
        ship.x = Math.max(20, Math.min(GAME_WIDTH - 20, ship.x));

        // Fuel drain
        ship.fuel = Math.max(0, ship.fuel - FUEL_DRAIN_RATE * dt);

        // Check if out of fuel
        if (ship.fuel <= 0) {
            gameState.mode = 'gameover';
        }

        // Ship moves down the screen, cave scrolls to keep ship centered
        if (gameState.mode === 'descending') {
            ship.y += ship.vy;

            // Keep ship roughly centered, scroll cave as needed
            const targetY = GAME_HEIGHT * 0.4;
            if (ship.y > targetY) {
                const diff = ship.y - targetY;
                cave.scrollOffset += diff;
                ship.y = targetY;
            }
        } else if (gameState.mode === 'escaping') {
            // Move ship based on velocity (negative vy = upward)
            ship.y += ship.vy;

            const targetY = GAME_HEIGHT * 0.5;
            if (ship.y < targetY) {
                // Ship going too high, scroll cave up
                const diff = targetY - ship.y;
                cave.scrollOffset -= diff;
                ship.y = targetY;
            }
        }

        // Check if reached reactor
        if (gameState.mode === 'descending' && cave.scrollOffset >= cave.totalDepth - 200) {
            gameState.mode = 'planting';
            setTimeout(() => {
                gameState.mode = 'escaping';
                createExplosion(GAME_WIDTH / 2, GAME_HEIGHT + cave.totalDepth);
            }, 2000);
        }

        // Check if escaped
        if (gameState.mode === 'escaping' && cave.scrollOffset <= 0) {
            gameState.mode = 'won';
            gameState.score += 1000;
            if (gameState.score > gameState.highScore) {
                gameState.highScore = gameState.score;
                localStorage.setItem('cavernsHighScore', gameState.highScore);
            }
        }
    }

    function updateBullets(dt) {
        bullets.forEach(bullet => {
            if (!bullet.active) return;

            bullet.y += bullet.vy;

            // Remove off-screen bullets
            if (bullet.y > GAME_HEIGHT + cave.scrollOffset + 100) {
                bullet.active = false;
            }

            // Check collision with fuel tanks
            fuelTanks.forEach(tank => {
                if (!tank.active) return;
                if (checkCollision(bullet, tank)) {
                    tank.active = false;
                    bullet.active = false;
                    ship.fuel = Math.min(100, ship.fuel + FUEL_TANK_VALUE);
                    gameState.score += 10;
                    createExplosion(tank.x, tank.y);
                }
            });

            // Check collision with enemies
            enemies.forEach(enemy => {
                if (!enemy.active) return;
                if (checkCollision(bullet, enemy)) {
                    enemy.active = false;
                    bullet.active = false;
                    gameState.score += 50;
                    createExplosion(enemy.x, enemy.y);
                }
            });

            // Check collision with cave walls
            const bulletWorldY = bullet.y + cave.scrollOffset;
            const segment = getCaveSegmentAtY(bulletWorldY);
            if (segment) {
                if (bullet.x < segment.leftWall || bullet.x > segment.rightWall) {
                    bullet.active = false;
                    createExplosion(bullet.x, bullet.y);
                    // Carve a small hole
                    if (bullet.x < segment.leftWall) {
                        segment.leftWall -= 5;
                    } else {
                        segment.rightWall += 5;
                    }
                }
            }
        });

        bullets = bullets.filter(b => b.active);
    }

    function updateEnemies(dt) {
        enemies.forEach(enemy => {
            if (!enemy.active) return;

            enemy.x += enemy.vx;

            // Bounce off walls
            const enemyWorldY = enemy.y;
            const segment = getCaveSegmentAtY(enemyWorldY);
            if (segment) {
                if (enemy.x < segment.leftWall || enemy.x > segment.rightWall - enemy.width) {
                    enemy.vx *= -1;
                }
            }

            // Check collision with ship (convert enemy world Y to screen Y)
            const enemyScreenY = enemy.y - cave.scrollOffset;
            const shipBox = {
                x: ship.x - SHIP_WIDTH/2,
                y: ship.y - SHIP_HEIGHT/2,
                width: SHIP_WIDTH,
                height: SHIP_HEIGHT
            };
            const enemyBox = {
                x: enemy.x,
                y: enemyScreenY,
                width: enemy.width,
                height: enemy.height
            };

            if (checkCollision(enemyBox, shipBox)) {
                enemy.active = false;
                ship.health -= 20;
                createExplosion(enemy.x, enemyScreenY);

                if (ship.health <= 0) {
                    gameState.mode = 'gameover';
                }
            }
        });
    }

    function updateExplosions(dt) {
        explosions.forEach(exp => {
            exp.age += dt;
            exp.radius += 2;
            exp.opacity -= 0.02;
        });
        explosions = explosions.filter(exp => exp.opacity > 0);
    }

    function createExplosion(x, y) {
        explosions.push({
            x: x,
            y: y,
            radius: 5,
            opacity: 1,
            age: 0
        });
    }

    function checkCollision(a, b) {
        const aBox = {
            x: a.x - (a.width || 4) / 2,
            y: a.y - (a.height || 4) / 2,
            width: a.width || 4,
            height: a.height || 4
        };
        const bBox = {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height
        };

        return aBox.x < bBox.x + bBox.width &&
               aBox.x + aBox.width > bBox.x &&
               aBox.y < bBox.y + bBox.height &&
               aBox.y + aBox.height > bBox.y;
    }

    function getCaveSegmentAtY(worldY) {
        return cave.segments.find(seg => Math.abs(seg.y - worldY) < 25);
    }

    function checkCaveCollision() {
        const shipWorldY = ship.y + cave.scrollOffset;
        const segment = getCaveSegmentAtY(shipWorldY);

        if (segment && !segment.isReactor) {
            const shipLeft = ship.x - SHIP_WIDTH / 2;
            const shipRight = ship.x + SHIP_WIDTH / 2;

            if (shipLeft < segment.leftWall || shipRight > segment.rightWall) {
                ship.health -= 5;
                if (ship.health <= 0) {
                    gameState.mode = 'gameover';
                }
            }
        }
    }

    function update(dt) {
        if (gameState.mode === 'descending' || gameState.mode === 'escaping') {
            updateShip(dt);
            updateBullets(dt);
            updateEnemies(dt);
            updateExplosions(dt);
            checkCaveCollision();
        } else if (gameState.mode === 'planting') {
            updateExplosions(dt);
        }
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (gameState.mode === 'menu') {
            drawMenu();
        } else if (gameState.mode === 'won') {
            drawVictory();
        } else if (gameState.mode === 'gameover') {
            drawGameOver();
        } else {
            drawGame();
        }
    }

    function drawMenu() {
        const titleSize = Math.max(20, Math.min(36, GAME_WIDTH / 12));
        const subtitleSize = Math.max(12, Math.min(16, GAME_WIDTH / 25));
        const textSize = Math.max(10, Math.min(14, GAME_WIDTH / 30));
        const btnWidth = Math.min(200, GAME_WIDTH * 0.7);
        const btnHeight = Math.max(35, 40 * scaleFactor);
        const startY = GAME_HEIGHT * 0.12;

        ctx.fillStyle = '#ff6b35';
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('CAVERNS OF MARS', GAME_WIDTH / 2, startY);

        ctx.fillStyle = '#fff';
        ctx.font = `${subtitleSize}px Arial`;
        ctx.fillText('A tribute to the 1981 Atari classic', GAME_WIDTH / 2, startY + titleSize * 1.2);

        ctx.font = `${subtitleSize}px Arial`;
        ctx.fillText('Select Difficulty:', GAME_WIDTH / 2, startY + titleSize * 2.5);

        // Difficulty buttons
        const btnX = GAME_WIDTH / 2 - btnWidth / 2;
        const btnStartY = startY + titleSize * 3.2;
        const btnGap = btnHeight + 15;

        drawButton('EASY (3 Sections)', btnX, btnStartY, btnWidth, btnHeight, gameState.difficulty === 'easy');
        drawButton('MEDIUM (4 Sections)', btnX, btnStartY + btnGap, btnWidth, btnHeight, gameState.difficulty === 'medium');
        drawButton('HARD (6 Sections)', btnX, btnStartY + btnGap * 2, btnWidth, btnHeight, gameState.difficulty === 'hard');

        ctx.fillStyle = '#f7931e';
        ctx.font = `${textSize}px Arial`;
        const infoY = btnStartY + btnGap * 3 + 20;
        ctx.fillText('Tap difficulty to start', GAME_WIDTH / 2, infoY);
        ctx.fillText('Use buttons below to play', GAME_WIDTH / 2, infoY + textSize * 1.5);

        ctx.fillStyle = '#fff';
        ctx.font = `${textSize}px Arial`;
        ctx.fillText(`High Score: ${gameState.highScore}`, GAME_WIDTH / 2, infoY + textSize * 3.5);
    }

    function drawButton(text, x, y, w, h, highlighted) {
        ctx.fillStyle = highlighted ? '#f7931e' : '#667eea';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        const fontSize = Math.max(12, Math.min(16, w / 12));
        ctx.fillStyle = '#fff';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(text, x + w / 2, y + h / 2 + fontSize / 3);
    }

    function drawGame() {
        // Draw cave walls
        ctx.fillStyle = '#8B4513';
        cave.segments.forEach(segment => {
            const screenY = segment.y - cave.scrollOffset;

            if (screenY > -100 && screenY < GAME_HEIGHT + 100) {
                // Left wall
                ctx.fillRect(0, screenY, segment.leftWall, 50);
                // Right wall
                ctx.fillRect(segment.rightWall, screenY, GAME_WIDTH - segment.rightWall, 50);

                // Reactor highlight
                if (segment.isReactor) {
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(segment.leftWall, screenY, segment.rightWall - segment.leftWall, 50);
                    ctx.fillStyle = '#8B4513';
                }

                // Cave texture
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, screenY + i * 16);
                    ctx.lineTo(segment.leftWall, screenY + i * 16);
                    ctx.moveTo(segment.rightWall, screenY + i * 16);
                    ctx.lineTo(GAME_WIDTH, screenY + i * 16);
                    ctx.stroke();
                }
            }
        });

        // Draw fuel tanks (canister style)
        fuelTanks.forEach(tank => {
            if (!tank.active) return;
            const screenY = tank.y - cave.scrollOffset;
            if (screenY > -50 && screenY < GAME_HEIGHT + 50) {
                const x = tank.x;
                const y = screenY;
                const w = tank.width;
                const h = tank.height;

                // Canister body - gradient for 3D effect
                const bodyGradient = ctx.createLinearGradient(x, y, x + w, y);
                bodyGradient.addColorStop(0, '#cc8800');
                bodyGradient.addColorStop(0.3, '#ffcc00');
                bodyGradient.addColorStop(0.5, '#ffee66');
                bodyGradient.addColorStop(0.7, '#ffcc00');
                bodyGradient.addColorStop(1, '#aa6600');

                // Main body with rounded ends
                ctx.fillStyle = bodyGradient;
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 4, w - 4, h - 6, 3);
                ctx.fill();

                // Top cap/nozzle
                ctx.fillStyle = '#888';
                ctx.fillRect(x + w/2 - 4, y, 8, 5);
                ctx.fillStyle = '#666';
                ctx.fillRect(x + w/2 - 2, y - 2, 4, 4);

                // Highlight stripe
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(x + 5, y + 6, 3, h - 10);

                // Fuel level bands
                ctx.strokeStyle = '#aa6600';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + 4, y + h * 0.4);
                ctx.lineTo(x + w - 4, y + h * 0.4);
                ctx.moveTo(x + 4, y + h * 0.65);
                ctx.lineTo(x + w - 4, y + h * 0.65);
                ctx.stroke();

                // Outline
                ctx.strokeStyle = '#885500';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 4, w - 4, h - 6, 3);
                ctx.stroke();

                // Glow effect
                ctx.shadowColor = '#ffaa00';
                ctx.shadowBlur = 8;
                ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
                ctx.beginPath();
                ctx.roundRect(x, y + 2, w, h - 4, 4);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        // Draw enemies
        enemies.forEach(enemy => {
            if (!enemy.active) return;
            const screenY = enemy.y - cave.scrollOffset;
            if (screenY > -50 && screenY < GAME_HEIGHT + 50) {
                if (enemy.type === 'rocket') {
                    ctx.fillStyle = '#ff0000';
                    ctx.beginPath();
                    ctx.moveTo(enemy.x + enemy.width / 2, screenY);
                    ctx.lineTo(enemy.x, screenY + enemy.height);
                    ctx.lineTo(enemy.x + enemy.width, screenY + enemy.height);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillStyle = '#ff00ff';
                    ctx.fillRect(enemy.x, screenY, enemy.width, enemy.height);
                }
            }
        });

        // Draw bullets
        ctx.fillStyle = '#00ffff';
        bullets.forEach(bullet => {
            const screenY = bullet.y - cave.scrollOffset;
            if (screenY > -10 && screenY < GAME_HEIGHT + 10) {
                ctx.fillRect(bullet.x - 2, screenY - 5, 4, 10);
            }
        });

        // Draw explosions
        explosions.forEach(exp => {
            const screenY = exp.y - cave.scrollOffset;
            ctx.fillStyle = `rgba(255, 150, 0, ${exp.opacity})`;
            ctx.beginPath();
            ctx.arc(exp.x, screenY, exp.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 0, ${exp.opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(exp.x, screenY, exp.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);

        // Ship body
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(0, -SHIP_HEIGHT / 2);
        ctx.lineTo(-SHIP_WIDTH / 2, SHIP_HEIGHT / 2);
        ctx.lineTo(SHIP_WIDTH / 2, SHIP_HEIGHT / 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cannons
        ctx.fillStyle = '#888';
        ctx.fillRect(-SHIP_WIDTH / 2 - 3, 0, 3, 10);
        ctx.fillRect(SHIP_WIDTH / 2, 0, 3, 10);

        // Thruster effect when shooting
        if (ship.shooting) {
            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.arc(0, SHIP_HEIGHT / 2, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Draw HUD
        drawHUD();

        // Draw mission status
        if (gameState.mode === 'planting') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, GAME_HEIGHT / 2 - 50, GAME_WIDTH, 100);
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PLANTING REACTOR BOMB...', GAME_WIDTH / 2, GAME_HEIGHT / 2);
        } else if (gameState.mode === 'escaping') {
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ESCAPE! REACTOR CRITICAL!', GAME_WIDTH / 2, 30);

            // Show escape progress
            const escapePercent = Math.max(0, 100 - (cave.scrollOffset / cave.totalDepth * 100)).toFixed(0);
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`ESCAPED: ${escapePercent}%`, GAME_WIDTH / 2, 55);
        }
    }

    function drawHUD() {
        // Scale HUD elements
        const barWidth = Math.min(120, GAME_WIDTH * 0.3);
        const barHeight = Math.max(12, 16 * scaleFactor);
        const fontSize = Math.max(10, 12 * scaleFactor);
        const margin = 8;

        // Background for HUD at top
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, GAME_WIDTH, barHeight * 2 + margin * 3);

        // Fuel bar
        ctx.fillStyle = '#333';
        ctx.fillRect(margin, margin, barWidth, barHeight);
        const fuelColor = ship.fuel > 30 ? '#00ff00' : ship.fuel > 15 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = fuelColor;
        ctx.fillRect(margin, margin, (ship.fuel / 100) * barWidth, barHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin, margin, barWidth, barHeight);
        ctx.fillStyle = '#fff';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('FUEL', margin + 4, margin + barHeight - 3);

        // Health bar
        ctx.fillStyle = '#333';
        ctx.fillRect(margin, margin * 2 + barHeight, barWidth, barHeight);
        const healthColor = ship.health > 50 ? '#00ff00' : ship.health > 25 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(margin, margin * 2 + barHeight, (ship.health / 100) * barWidth, barHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(margin, margin * 2 + barHeight, barWidth, barHeight);
        ctx.fillStyle = '#fff';
        ctx.fillText('HP', margin + 4, margin * 2 + barHeight * 2 - 3);

        // Score and Depth on right
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'right';
        ctx.fillText(`${gameState.score} pts`, GAME_WIDTH - margin, margin + barHeight - 2);

        const depthPercent = Math.min(100, (cave.scrollOffset / cave.totalDepth * 100).toFixed(0));
        ctx.fillText(`${depthPercent}% deep`, GAME_WIDTH - margin, margin * 2 + barHeight * 2 - 2);

        // Update HTML display elements
        updateHTMLDisplay();
    }

    function updateHTMLDisplay() {
        const scoreEl = document.getElementById('cavernsScore');
        const fuelEl = document.getElementById('cavernsFuel');
        const healthEl = document.getElementById('cavernsHealth');
        const depthEl = document.getElementById('cavernsDepth');

        if (scoreEl) scoreEl.textContent = gameState.score;
        if (fuelEl) fuelEl.textContent = Math.round(ship.fuel);
        if (healthEl) healthEl.textContent = Math.round(ship.health);
        if (depthEl) {
            const depthPercent = Math.min(100, (cave.scrollOffset / cave.totalDepth * 100).toFixed(0));
            depthEl.textContent = depthPercent + '%';
        }
    }

    function drawVictory() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const titleSize = Math.max(24, Math.min(48, GAME_WIDTH / 8));
        const textSize = Math.max(16, Math.min(24, GAME_WIDTH / 16));
        const smallSize = Math.max(12, Math.min(18, GAME_WIDTH / 22));

        ctx.fillStyle = '#00ff00';
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('MISSION SUCCESS!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - titleSize);

        ctx.fillStyle = '#fff';
        ctx.font = `${textSize}px Arial`;
        ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 0.5);
        ctx.fillText(`High Score: ${gameState.highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 2);

        ctx.font = `${smallSize}px Arial`;
        ctx.fillStyle = '#f7931e';
        ctx.fillText('Tap NEW or screen to play again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 4);
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const titleSize = Math.max(24, Math.min(48, GAME_WIDTH / 8));
        const textSize = Math.max(16, Math.min(24, GAME_WIDTH / 16));
        const smallSize = Math.max(12, Math.min(18, GAME_WIDTH / 22));

        ctx.fillStyle = '#ff0000';
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('MISSION FAILED', GAME_WIDTH / 2, GAME_HEIGHT / 2 - titleSize);

        ctx.fillStyle = '#fff';
        ctx.font = `${textSize}px Arial`;
        ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 0.5);
        ctx.fillText(`High Score: ${gameState.highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 2);

        ctx.font = `${smallSize}px Arial`;
        ctx.fillStyle = '#f7931e';
        ctx.fillText('Tap NEW or screen to play again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + textSize * 4);
    }

    // Game loop
    let lastTime = 0;
    function gameLoop(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 16.67, 2);
        lastTime = timestamp;

        update(dt);
        draw();

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Event handlers
    function handleKeyDown(e) {
        // Prevent default scrolling for game controls
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd', 'w', 's', 'A', 'D', 'W', 'S'].includes(e.key)) {
            e.preventDefault();
        }
        keys[e.key] = true;
    }

    function handleKeyUp(e) {
        keys[e.key] = false;
    }

    function handleMouseMove(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (GAME_WIDTH / rect.width);
        mouseY = (e.clientY - rect.top) * (GAME_HEIGHT / rect.height);
    }

    function handleMouseDown(e) {
        mouseDown = true;
        handleClick(mouseX, mouseY);
    }

    function handleMouseUp() {
        mouseDown = false;
    }

    function handleTouchStart(e) {
        if (!canvas) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();

        // Get touch position for menu clicks
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mouseX = (touch.clientX - rect.left) * (GAME_WIDTH / rect.width);
            mouseY = (touch.clientY - rect.top) * (GAME_HEIGHT / rect.height);
        }

        mouseDown = true;
        handleClick(mouseX, mouseY);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (e.touches.length === 0) {
            mouseDown = false;
        }
    }

    function handleTouchMove(e) {
        if (!canvas) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();

        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mouseX = (touch.clientX - rect.left) * (GAME_WIDTH / rect.width);
            mouseY = (touch.clientY - rect.top) * (GAME_HEIGHT / rect.height);
        }
    }

    function handleClick(x, y) {
        if (gameState.mode === 'menu') {
            // Calculate button positions (must match drawMenu)
            const titleSize = Math.max(20, Math.min(36, GAME_WIDTH / 12));
            const btnWidth = Math.min(200, GAME_WIDTH * 0.7);
            const btnHeight = Math.max(35, 40 * scaleFactor);
            const startY = GAME_HEIGHT * 0.12;
            const btnX = GAME_WIDTH / 2 - btnWidth / 2;
            const btnStartY = startY + titleSize * 3.2;
            const btnGap = btnHeight + 15;

            // Check difficulty buttons
            if (x >= btnX && x <= btnX + btnWidth) {
                if (y >= btnStartY && y <= btnStartY + btnHeight) {
                    startGame('easy');
                } else if (y >= btnStartY + btnGap && y <= btnStartY + btnGap + btnHeight) {
                    startGame('medium');
                } else if (y >= btnStartY + btnGap * 2 && y <= btnStartY + btnGap * 2 + btnHeight) {
                    startGame('hard');
                }
            }
        } else if (gameState.mode === 'won' || gameState.mode === 'gameover') {
            gameState.mode = 'menu';
        }
    }

    // Resize canvas to fit wrapper
    function resizeCanvas() {
        if (!canvas) return;

        const wrapper = document.getElementById('cavernsCanvasWrapper');
        if (!wrapper) return;

        let wrapperWidth = wrapper.clientWidth;
        let wrapperHeight = wrapper.clientHeight;

        // Fallback if wrapper has no size yet
        if (wrapperWidth === 0 || wrapperHeight === 0) {
            wrapperWidth = window.innerWidth;
            wrapperHeight = window.innerHeight - 120;
        }

        // Use wrapper dimensions
        GAME_WIDTH = wrapperWidth;
        GAME_HEIGHT = wrapperHeight;

        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;

        // Calculate scale factor based on original 600x700
        scaleFactor = Math.min(GAME_WIDTH / 600, GAME_HEIGHT / 700);
    }

    function setupHTMLControls() {
        const btnLeft = document.getElementById('cavernsBtnLeft');
        const btnRight = document.getElementById('cavernsBtnRight');
        const btnFire = document.getElementById('cavernsBtnFire');

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); touchLeft = true; }, { passive: false });
            btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); touchLeft = false; }, { passive: false });
            btnLeft.addEventListener('touchcancel', () => { touchLeft = false; });
            btnLeft.addEventListener('mousedown', (e) => { e.preventDefault(); touchLeft = true; });
            btnLeft.addEventListener('mouseup', () => { touchLeft = false; });
            btnLeft.addEventListener('mouseleave', () => { touchLeft = false; });
        }

        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); touchRight = true; }, { passive: false });
            btnRight.addEventListener('touchend', (e) => { e.preventDefault(); touchRight = false; }, { passive: false });
            btnRight.addEventListener('touchcancel', () => { touchRight = false; });
            btnRight.addEventListener('mousedown', (e) => { e.preventDefault(); touchRight = true; });
            btnRight.addEventListener('mouseup', () => { touchRight = false; });
            btnRight.addEventListener('mouseleave', () => { touchRight = false; });
        }

        if (btnFire) {
            btnFire.addEventListener('touchstart', (e) => { e.preventDefault(); touchShoot = true; }, { passive: false });
            btnFire.addEventListener('touchend', (e) => { e.preventDefault(); touchShoot = false; }, { passive: false });
            btnFire.addEventListener('touchcancel', () => { touchShoot = false; });
            btnFire.addEventListener('mousedown', (e) => { e.preventDefault(); touchShoot = true; });
            btnFire.addEventListener('mouseup', () => { touchShoot = false; });
            btnFire.addEventListener('mouseleave', () => { touchShoot = false; });
        }
    }

    function launchCavernsOfMars() {
        // Show game section
        if (typeof hideAllMenus === 'function') hideAllMenus();
        const gameEl = document.getElementById('cavernsOfMarsGame');
        gameEl.style.display = 'flex';

        // Use double requestAnimationFrame to ensure DOM layout is computed
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Initialize canvas
                canvas = document.getElementById('cavernsCanvas');
                ctx = canvas.getContext('2d');

                // Reset game state
                gameState.mode = 'menu';
                gameState.difficulty = 'medium';
                gameState.score = 0;
                gameState.highScore = localStorage.getItem('cavernsHighScore') || 0;

                // Disable text selection and context menu on canvas
                canvas.style.userSelect = 'none';
                canvas.style.webkitUserSelect = 'none';
                canvas.style.touchAction = 'manipulation';

                // Setup event listeners
                document.addEventListener('keydown', handleKeyDown);
                document.addEventListener('keyup', handleKeyUp);
                canvas.addEventListener('mousemove', handleMouseMove);
                canvas.addEventListener('mousedown', handleMouseDown);
                canvas.addEventListener('mouseup', handleMouseUp);
                canvas.addEventListener('touchstart', handleTouchStart);
                canvas.addEventListener('touchend', handleTouchEnd);
                canvas.addEventListener('touchmove', handleTouchMove);
                window.addEventListener('resize', resizeCanvas);

                resizeCanvas();
                setupHTMLControls();

                // Start game loop
                lastTime = performance.now();
                gameLoopId = requestAnimationFrame(gameLoop);
            });
        });
    }

    function exitCavernsOfMars() {
        // Cancel game loop
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }

        // Remove event listeners
        if (canvas) {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchmove', handleTouchMove);
        }
        window.removeEventListener('resize', resizeCanvas);

        // Hide game section
        document.getElementById('cavernsOfMarsGame').style.display = 'none';
        document.getElementById('arcadeMenu').style.display = 'block';

        // Clear canvas reference
        canvas = null;
        ctx = null;

        // Reset keys and touch state
        keys = {};
        touchLeft = false;
        touchRight = false;
        touchShoot = false;
    }

    // Restart game from HTML button
    window.restartCaverns = function() {
        gameState.mode = 'menu';
        resetGame();
    };

    // Expose functions to window
    window.launchCavernsOfMars = launchCavernsOfMars;
    window.exitCavernsOfMars = exitCavernsOfMars;
})();

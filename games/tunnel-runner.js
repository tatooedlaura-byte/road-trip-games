// Tunnel Runner Game - Side-scrolling rocket game with sprites and visual effects
(function() {
    let gameCanvas, ctx;
    let gameState = 'loading'; // loading, menu, playing, gameOver
    let rocket;
    let tunnelSegments = [];
    let score = 0;
    let coins = 0;
    let highScore = parseInt(localStorage.getItem('tunnelRunnerHighScore') || '0');
    let highCoins = parseInt(localStorage.getItem('tunnelRunnerHighCoins') || '0');
    let animationId;

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const ROCKET_SIZE = 40;
    const SCROLL_SPEED = 3;
    const BASE_TUNNEL_WIDTH = 200;
    const MIN_TUNNEL_WIDTH = 160;
    const MAX_TUNNEL_WIDTH = 240;
    const SEGMENT_WIDTH = 20;
    const OBSTACLE_CHANCE = 0.08;
    const COIN_CHANCE = 0.075;
    const SPLIT_CHANCE = 0.008;
    const MIN_PATH_WIDTH = 100;
    const PATH_DEVIATION = 30;
    const COIN_SIZE = 24;

    // Smooth motion parameters
    let targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
    let targetTunnelWidth = BASE_TUNNEL_WIDTH;
    let smoothingFactor = 0.15;
    let noiseOffset = 0;

    // Assets
    const assets = {
        ship: null,
        fire: [],
        meteors: [],
        coin: null,
        stars: []
    };
    let assetsLoaded = false;
    let fireFrame = 0;

    // Starfield for parallax background
    let starLayers = [];

    // Particles for effects
    let particles = [];

    // Color palette for tunnel variations with neon glow
    const TUNNEL_COLORS = [
        { wall: '#6c5ce7', edge: '#a29bfe', glow: 'rgba(162, 155, 254, 0.6)', name: 'purple' },
        { wall: '#00b894', edge: '#55efc4', glow: 'rgba(85, 239, 196, 0.6)', name: 'green' },
        { wall: '#0984e3', edge: '#74b9ff', glow: 'rgba(116, 185, 255, 0.6)', name: 'blue' },
        { wall: '#d63031', edge: '#ff7675', glow: 'rgba(255, 118, 117, 0.6)', name: 'red' },
        { wall: '#fdcb6e', edge: '#ffeaa7', glow: 'rgba(255, 234, 167, 0.6)', name: 'yellow' },
        { wall: '#e17055', edge: '#fab1a0', glow: 'rgba(250, 177, 160, 0.6)', name: 'orange' }
    ];

    // Load all assets
    function loadAssets(callback) {
        let loaded = 0;
        const toLoad = 24; // ship + 20 fire frames + coin + 2 stars

        function onLoad() {
            loaded++;
            if (loaded >= toLoad) {
                assetsLoaded = true;
                callback();
            }
        }

        // Load ship
        assets.ship = new Image();
        assets.ship.onload = onLoad;
        assets.ship.onerror = onLoad;
        assets.ship.src = 'assets/tunnel-runner/ship.png';

        // Load fire animation frames
        for (let i = 0; i < 20; i++) {
            const img = new Image();
            img.onload = onLoad;
            img.onerror = onLoad;
            img.src = `assets/tunnel-runner/fire${i.toString().padStart(2, '0')}.png`;
            assets.fire.push(img);
        }

        // Load coin
        assets.coin = new Image();
        assets.coin.onload = onLoad;
        assets.coin.onerror = onLoad;
        assets.coin.src = 'assets/tunnel-runner/coin.png';

        // Load star sprites
        for (let i = 1; i <= 2; i++) {
            const img = new Image();
            img.onload = onLoad;
            img.onerror = onLoad;
            img.src = `assets/tunnel-runner/star${i}.png`;
            assets.stars.push(img);
        }

        // Load meteors
        const meteorTypes = ['meteorBrown_big1', 'meteorBrown_big2', 'meteorGrey_big1', 'meteorGrey_big2'];
        meteorTypes.forEach(name => {
            const img = new Image();
            img.onload = () => {};
            img.src = `assets/tunnel-runner/${name}.png`;
            assets.meteors.push(img);
        });
    }

    // Initialize starfield
    function initStarfield() {
        starLayers = [];

        // Create 3 layers of stars with different speeds
        for (let layer = 0; layer < 3; layer++) {
            const stars = [];
            const count = 30 + layer * 20;
            const speed = 0.5 + layer * 0.5;

            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * GAME_WIDTH,
                    y: Math.random() * GAME_HEIGHT,
                    size: 1 + layer * 0.5 + Math.random(),
                    brightness: 0.3 + layer * 0.2 + Math.random() * 0.3,
                    speed: speed
                });
            }
            starLayers.push(stars);
        }
    }

    // Update starfield
    function updateStarfield() {
        for (let layer of starLayers) {
            for (let star of layer) {
                star.x -= star.speed;
                if (star.x < 0) {
                    star.x = GAME_WIDTH;
                    star.y = Math.random() * GAME_HEIGHT;
                }
            }
        }
    }

    // Draw starfield
    function drawStarfield() {
        for (let layer of starLayers) {
            for (let star of layer) {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Particle system
    function createParticle(x, y, type) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            type: type,
            size: 3 + Math.random() * 5
        };

        if (type === 'exhaust') {
            particle.vx = -2 - Math.random() * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            particle.decay = 0.05;
            particle.size = 4 + Math.random() * 4;
        } else if (type === 'coin') {
            particle.vx = (Math.random() - 0.5) * 6;
            particle.vy = (Math.random() - 0.5) * 6;
            particle.size = 2 + Math.random() * 3;
        }

        particles.push(particle);
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function drawParticles() {
        for (let p of particles) {
            let color;
            if (p.type === 'exhaust') {
                const r = 255;
                const g = Math.floor(100 + 155 * p.life);
                const b = Math.floor(50 * p.life);
                color = `rgba(${r}, ${g}, ${b}, ${p.life})`;
            } else if (p.type === 'coin') {
                color = `rgba(255, 215, 0, ${p.life})`;
            } else {
                color = `rgba(255, 255, 255, ${p.life})`;
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Rocket object
    function createRocket() {
        return {
            x: 150,
            y: GAME_HEIGHT / 2,
            velocity: 0,
            gravity: 0.25,
            lift: -4.5,
            maxVelocity: 6
        };
    }

    // Create a tunnel segment
    function createTunnelSegment(x, topHeight, bottomHeight, tunnelWidth, colorIndex, obstacles = [], coins = [], splitInfo = null) {
        return {
            x: x,
            topHeight: topHeight,
            bottomHeight: bottomHeight,
            tunnelWidth: tunnelWidth,
            colorIndex: colorIndex,
            obstacles: obstacles,
            coins: coins,
            splitInfo: splitInfo
        };
    }

    // Simple noise function for smooth variation
    function smoothNoise(x, amplitude) {
        return Math.sin(x * 0.1) * amplitude + Math.sin(x * 0.23) * (amplitude * 0.5);
    }

    // Track obstacle spacing
    let segmentsSinceLastObstacle = 0;
    const MIN_OBSTACLE_SPACING = 15;

    // Create random obstacles for a segment
    function createObstacles(topHeight, bottomHeight, tunnelWidth, canSpawn) {
        const obstacles = [];

        if (canSpawn &&
            segmentsSinceLastObstacle >= MIN_OBSTACLE_SPACING &&
            tunnelWidth >= 160 &&
            Math.random() < OBSTACLE_CHANCE) {

            const rand = Math.random();
            let obstacleLength;

            if (rand < 0.25) {
                obstacleLength = 30 + Math.random() * 50;
                obstacles.push({
                    type: 'stalactite',
                    y: topHeight,
                    length: obstacleLength,
                    meteorIndex: Math.floor(Math.random() * assets.meteors.length),
                    rotation: Math.random() * Math.PI * 2
                });
            } else if (rand < 0.5) {
                obstacleLength = 30 + Math.random() * 50;
                obstacles.push({
                    type: 'stalagmite',
                    y: bottomHeight,
                    length: obstacleLength,
                    meteorIndex: Math.floor(Math.random() * assets.meteors.length),
                    rotation: Math.random() * Math.PI * 2
                });
            } else if (rand < 0.7) {
                obstacles.push({
                    type: 'stalactite',
                    y: topHeight,
                    length: 25 + Math.random() * 30,
                    meteorIndex: Math.floor(Math.random() * assets.meteors.length),
                    rotation: Math.random() * Math.PI * 2
                });
                obstacles.push({
                    type: 'stalagmite',
                    y: bottomHeight,
                    length: 25 + Math.random() * 30,
                    meteorIndex: Math.floor(Math.random() * assets.meteors.length),
                    rotation: Math.random() * Math.PI * 2
                });
            } else {
                const centerY = topHeight + tunnelWidth / 2;
                obstacles.push({
                    type: 'crystal',
                    y: centerY,
                    size: 30 + Math.random() * 20,
                    meteorIndex: Math.floor(Math.random() * assets.meteors.length),
                    rotation: Math.random() * Math.PI * 2
                });
            }

            segmentsSinceLastObstacle = 0;
        } else {
            segmentsSinceLastObstacle++;
        }

        return obstacles;
    }

    // Create coins for a segment
    function createCoins(topHeight, bottomHeight, tunnelWidth, canSpawn) {
        const segmentCoins = [];

        if (canSpawn && Math.random() < COIN_CHANCE) {
            const numCoins = Math.floor(1 + Math.random() * 3);

            for (let i = 0; i < numCoins; i++) {
                const y = topHeight + COIN_SIZE + Math.random() * (tunnelWidth - COIN_SIZE * 2);
                segmentCoins.push({
                    y: y,
                    collected: false,
                    bobOffset: Math.random() * Math.PI * 2
                });
            }
        }

        return segmentCoins;
    }

    // Track color and split state
    let segmentsSinceColorChange = 0;
    let currentColorIndex = 0;
    let splitState = null;
    let splitSegmentsRemaining = 0;
    let splitDividerY = 0;
    let splitTopTarget = 0;
    let splitBottomTarget = 0;
    const SPLIT_DURATION = 30;
    const FULL_SPLIT_DURATION = 50;
    const MERGE_DURATION = 30;

    // Initialize game
    function initGame() {
        rocket = createRocket();
        tunnelSegments = [];
        score = 0;
        coins = 0;
        noiseOffset = 0;
        particles = [];
        segmentsSinceLastObstacle = 0;
        segmentsSinceColorChange = 0;
        splitState = null;

        targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
        targetTunnelWidth = BASE_TUNNEL_WIDTH;

        let currentTopHeight = targetTopHeight;
        let currentTunnelWidth = targetTunnelWidth;

        for (let i = 0; i < Math.ceil(GAME_WIDTH / SEGMENT_WIDTH) + 5; i++) {
            const heightNoise = smoothNoise(noiseOffset + i, 3);
            targetTopHeight = GAME_HEIGHT / 2 - currentTunnelWidth / 2 + heightNoise;

            currentTopHeight += (targetTopHeight - currentTopHeight) * smoothingFactor;
            currentTopHeight = Math.max(50, Math.min(GAME_HEIGHT - currentTunnelWidth - 50, currentTopHeight));

            const currentBottomHeight = currentTopHeight + currentTunnelWidth;

            const obstacles = i > 10 ? createObstacles(currentTopHeight, currentBottomHeight, currentTunnelWidth, true) : [];
            const segmentCoins = i > 10 ? createCoins(currentTopHeight, currentBottomHeight, currentTunnelWidth, true) : [];

            tunnelSegments.push(createTunnelSegment(i * SEGMENT_WIDTH, currentTopHeight, currentBottomHeight, currentTunnelWidth, currentColorIndex, obstacles, segmentCoins));
        }

        initStarfield();
        gameState = 'playing';
        gameLoop();
    }

    // Update game state
    function update() {
        if (gameState !== 'playing') return;

        // Update starfield
        updateStarfield();

        // Update particles
        updateParticles();

        // Create exhaust particles
        if (Math.random() < 0.5) {
            createParticle(rocket.x - 10, rocket.y + ROCKET_SIZE / 2, 'exhaust');
        }

        // Update fire animation
        fireFrame = (fireFrame + 0.5) % assets.fire.length;

        // Update rocket physics
        rocket.velocity += rocket.gravity;
        rocket.velocity = Math.max(-rocket.maxVelocity, Math.min(rocket.maxVelocity, rocket.velocity));
        rocket.y += rocket.velocity;

        // Update tunnel segments
        for (let segment of tunnelSegments) {
            segment.x -= SCROLL_SPEED;
        }

        // Remove off-screen segments and add new ones
        if (tunnelSegments[0].x < -SEGMENT_WIDTH) {
            tunnelSegments.shift();

            const lastSegment = tunnelSegments[tunnelSegments.length - 1];
            noiseOffset += 0.5;

            const widthNoise = smoothNoise(noiseOffset * 0.5, 4);
            targetTunnelWidth += widthNoise;
            targetTunnelWidth = Math.max(MIN_TUNNEL_WIDTH, Math.min(MAX_TUNNEL_WIDTH, targetTunnelWidth));

            let newTunnelWidth = lastSegment.tunnelWidth + (targetTunnelWidth - lastSegment.tunnelWidth) * smoothingFactor;

            const heightNoise = smoothNoise(noiseOffset, 5);
            targetTopHeight = GAME_HEIGHT / 2 - newTunnelWidth / 2 + heightNoise;

            let newTopHeight = lastSegment.topHeight + (targetTopHeight - lastSegment.topHeight) * smoothingFactor;
            newTopHeight = Math.max(50, Math.min(GAME_HEIGHT - newTunnelWidth - 50, newTopHeight));
            let newBottomHeight = newTopHeight + newTunnelWidth;

            segmentsSinceColorChange++;
            if (segmentsSinceColorChange > 50 + Math.random() * 50) {
                currentColorIndex = (currentColorIndex + 1) % TUNNEL_COLORS.length;
                segmentsSinceColorChange = 0;
            }

            // Handle tunnel splits
            let splitInfo = null;

            if (splitState === null && Math.random() < SPLIT_CHANCE && score > 50) {
                splitState = 'splitting';
                splitSegmentsRemaining = SPLIT_DURATION;
                splitDividerY = newTopHeight + newTunnelWidth / 2;

                const dividerThickness = 15;
                const requiredWidth = (MIN_PATH_WIDTH * 2) + dividerThickness + (PATH_DEVIATION * 2);
                const expansionNeeded = Math.max(0, requiredWidth - newTunnelWidth);

                splitTopTarget = newTopHeight - (expansionNeeded / 2) - PATH_DEVIATION;
                splitBottomTarget = newBottomHeight + (expansionNeeded / 2) + PATH_DEVIATION;
            }

            if (splitState === 'splitting') {
                const progress = 1 - (splitSegmentsRemaining / SPLIT_DURATION);
                newTopHeight = lastSegment.topHeight + (splitTopTarget - lastSegment.topHeight) * 0.1;
                newBottomHeight = lastSegment.bottomHeight + (splitBottomTarget - lastSegment.bottomHeight) * 0.1;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                const dividerThickness = 15;
                splitDividerY = newTopHeight + MIN_PATH_WIDTH + (dividerThickness / 2) + (PATH_DEVIATION * progress);
                splitInfo = { state: 'splitting', progress: progress, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = 'split';
                    splitSegmentsRemaining = FULL_SPLIT_DURATION;
                }
            } else if (splitState === 'split') {
                const dividerThickness = 15;
                const smallVariation = smoothNoise(noiseOffset * 2, 2);

                newTopHeight = lastSegment.topHeight + smallVariation * 0.3;
                newBottomHeight = lastSegment.bottomHeight + smallVariation * 0.3;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                splitDividerY = newTopHeight + MIN_PATH_WIDTH + (dividerThickness / 2) + PATH_DEVIATION;
                splitInfo = { state: 'split', progress: 1, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = 'merging';
                    splitSegmentsRemaining = MERGE_DURATION;
                    targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
                    targetTunnelWidth = BASE_TUNNEL_WIDTH;
                }
            } else if (splitState === 'merging') {
                const progress = splitSegmentsRemaining / MERGE_DURATION;
                newTopHeight = lastSegment.topHeight + (targetTopHeight - lastSegment.topHeight) * 0.08;
                newBottomHeight = newTopHeight + lastSegment.tunnelWidth + (targetTunnelWidth - lastSegment.tunnelWidth) * 0.08;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                const dividerThickness = 15;
                splitDividerY = newTopHeight + (newTunnelWidth / 2);
                splitInfo = { state: 'merging', progress: progress, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = null;
                }
            }

            const canSpawnObstacle = splitState === null;
            const obstacles = createObstacles(newTopHeight, newBottomHeight, newTunnelWidth, canSpawnObstacle);
            const segmentCoins = createCoins(newTopHeight, newBottomHeight, newTunnelWidth, canSpawnObstacle);

            tunnelSegments.push(createTunnelSegment(
                lastSegment.x + SEGMENT_WIDTH,
                newTopHeight,
                newBottomHeight,
                newTunnelWidth,
                currentColorIndex,
                obstacles,
                segmentCoins,
                splitInfo
            ));

            score++;
        }

        // Check collisions
        const rocketSegment = tunnelSegments.find(seg =>
            rocket.x + ROCKET_SIZE > seg.x && rocket.x < seg.x + SEGMENT_WIDTH
        );

        if (rocketSegment) {
            if (rocket.y < rocketSegment.topHeight || rocket.y + ROCKET_SIZE > rocketSegment.bottomHeight) {
                gameOver();
            }

            for (let obstacle of rocketSegment.obstacles) {
                if (obstacle.type === 'stalactite') {
                    if (rocket.y < obstacle.y + obstacle.length) {
                        gameOver();
                    }
                } else if (obstacle.type === 'stalagmite') {
                    if (rocket.y + ROCKET_SIZE > obstacle.y - obstacle.length) {
                        gameOver();
                    }
                } else if (obstacle.type === 'crystal') {
                    const distance = Math.sqrt(
                        Math.pow(rocket.x + ROCKET_SIZE / 2 - (rocketSegment.x + SEGMENT_WIDTH / 2), 2) +
                        Math.pow(rocket.y + ROCKET_SIZE / 2 - obstacle.y, 2)
                    );
                    if (distance < obstacle.size / 2 + ROCKET_SIZE / 2) {
                        gameOver();
                    }
                }
            }

            for (let coin of rocketSegment.coins) {
                if (!coin.collected) {
                    const distance = Math.sqrt(
                        Math.pow(rocket.x + ROCKET_SIZE / 2 - (rocketSegment.x + SEGMENT_WIDTH / 2), 2) +
                        Math.pow(rocket.y + ROCKET_SIZE / 2 - coin.y, 2)
                    );
                    if (distance < COIN_SIZE + ROCKET_SIZE / 2) {
                        coin.collected = true;
                        coins++;
                        // Create coin particles
                        for (let i = 0; i < 8; i++) {
                            createParticle(rocketSegment.x + SEGMENT_WIDTH / 2, coin.y, 'coin');
                        }
                    }
                }
            }

            if (rocketSegment.splitInfo && rocketSegment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerTop = rocketSegment.splitInfo.dividerY - (dividerHalfThickness * rocketSegment.splitInfo.progress);
                const dividerBottom = rocketSegment.splitInfo.dividerY + (dividerHalfThickness * rocketSegment.splitInfo.progress);

                if (rocket.y + ROCKET_SIZE > dividerTop && rocket.y < dividerBottom) {
                    gameOver();
                }
            }
        }

        if (rocket.y < 0 || rocket.y + ROCKET_SIZE > GAME_HEIGHT) {
            gameOver();
        }
    }

    // Draw game
    function draw() {
        // Clear canvas with dark background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (gameState === 'loading') {
            drawLoading();
        } else if (gameState === 'menu') {
            drawStarfield();
            drawMenu();
        } else if (gameState === 'playing') {
            drawStarfield();
            drawTunnel();
            drawParticles();
            drawRocket();
            drawScore();
        } else if (gameState === 'gameOver') {
            drawStarfield();
            drawTunnel();
            drawParticles();
            drawRocket();
            drawGameOver();
        }
    }

    // Draw loading screen
    function drawLoading() {
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    // Draw tunnel with smooth curves
    function drawTunnel() {
        const color = TUNNEL_COLORS[currentColorIndex];

        // Draw top wall
        ctx.fillStyle = color.wall;
        ctx.beginPath();
        ctx.moveTo(0, 0);

        if (tunnelSegments.length > 0) {
            ctx.lineTo(tunnelSegments[0].x, tunnelSegments[0].topHeight);

            for (let i = 1; i < tunnelSegments.length - 1; i++) {
                const current = tunnelSegments[i];
                const next = tunnelSegments[i + 1];
                const controlX = current.x;
                const controlY = current.topHeight;
                const endX = (current.x + next.x) / 2;
                const endY = (current.topHeight + next.topHeight) / 2;
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            }

            if (tunnelSegments.length > 1) {
                const last = tunnelSegments[tunnelSegments.length - 1];
                ctx.lineTo(last.x, last.topHeight);
            }
        }

        ctx.lineTo(GAME_WIDTH, 0);
        ctx.closePath();
        ctx.fill();

        // Draw top edge with glow
        ctx.strokeStyle = color.edge;
        ctx.lineWidth = 3;
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();

        if (tunnelSegments.length > 0) {
            ctx.moveTo(tunnelSegments[0].x, tunnelSegments[0].topHeight);

            for (let i = 1; i < tunnelSegments.length - 1; i++) {
                const current = tunnelSegments[i];
                const next = tunnelSegments[i + 1];
                const controlX = current.x;
                const controlY = current.topHeight;
                const endX = (current.x + next.x) / 2;
                const endY = (current.topHeight + next.topHeight) / 2;
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            }

            if (tunnelSegments.length > 1) {
                const last = tunnelSegments[tunnelSegments.length - 1];
                ctx.lineTo(last.x, last.topHeight);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw bottom wall
        ctx.fillStyle = color.wall;
        ctx.beginPath();
        ctx.moveTo(0, GAME_HEIGHT);

        if (tunnelSegments.length > 0) {
            ctx.lineTo(tunnelSegments[0].x, tunnelSegments[0].bottomHeight);

            for (let i = 1; i < tunnelSegments.length - 1; i++) {
                const current = tunnelSegments[i];
                const next = tunnelSegments[i + 1];
                const controlX = current.x;
                const controlY = current.bottomHeight;
                const endX = (current.x + next.x) / 2;
                const endY = (current.bottomHeight + next.bottomHeight) / 2;
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            }

            if (tunnelSegments.length > 1) {
                const last = tunnelSegments[tunnelSegments.length - 1];
                ctx.lineTo(last.x, last.bottomHeight);
            }
        }

        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
        ctx.closePath();
        ctx.fill();

        // Draw bottom edge with glow
        ctx.strokeStyle = color.edge;
        ctx.lineWidth = 3;
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();

        if (tunnelSegments.length > 0) {
            ctx.moveTo(tunnelSegments[0].x, tunnelSegments[0].bottomHeight);

            for (let i = 1; i < tunnelSegments.length - 1; i++) {
                const current = tunnelSegments[i];
                const next = tunnelSegments[i + 1];
                const controlX = current.x;
                const controlY = current.bottomHeight;
                const endX = (current.x + next.x) / 2;
                const endY = (current.bottomHeight + next.bottomHeight) / 2;
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            }

            if (tunnelSegments.length > 1) {
                const last = tunnelSegments[tunnelSegments.length - 1];
                ctx.lineTo(last.x, last.bottomHeight);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw split dividers
        for (let segment of tunnelSegments) {
            if (segment.splitInfo && segment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerTop = segment.splitInfo.dividerY - (dividerHalfThickness * segment.splitInfo.progress);
                const dividerBottom = segment.splitInfo.dividerY + (dividerHalfThickness * segment.splitInfo.progress);

                ctx.fillStyle = color.wall;
                ctx.fillRect(segment.x, dividerTop, SEGMENT_WIDTH + 1, dividerBottom - dividerTop);
            }
        }

        // Draw obstacles using meteor sprites
        for (let segment of tunnelSegments) {
            for (let obstacle of segment.obstacles) {
                const meteorImg = assets.meteors[obstacle.meteorIndex || 0];

                if (obstacle.type === 'stalactite' && meteorImg && meteorImg.complete) {
                    const size = obstacle.length * 1.5;
                    ctx.save();
                    ctx.translate(segment.x + SEGMENT_WIDTH / 2, obstacle.y + obstacle.length / 2);
                    ctx.rotate(obstacle.rotation || 0);
                    ctx.drawImage(meteorImg, -size / 2, -size / 2, size, size);
                    ctx.restore();
                } else if (obstacle.type === 'stalagmite' && meteorImg && meteorImg.complete) {
                    const size = obstacle.length * 1.5;
                    ctx.save();
                    ctx.translate(segment.x + SEGMENT_WIDTH / 2, obstacle.y - obstacle.length / 2);
                    ctx.rotate(obstacle.rotation || 0);
                    ctx.drawImage(meteorImg, -size / 2, -size / 2, size, size);
                    ctx.restore();
                } else if (obstacle.type === 'crystal' && meteorImg && meteorImg.complete) {
                    const size = obstacle.size * 1.2;
                    ctx.save();
                    ctx.translate(segment.x + SEGMENT_WIDTH / 2, obstacle.y);
                    ctx.rotate(obstacle.rotation || 0);
                    ctx.drawImage(meteorImg, -size / 2, -size / 2, size, size);
                    ctx.restore();
                }
            }
        }

        // Draw coins with bobbing animation
        const bobTime = Date.now() / 200;
        for (let segment of tunnelSegments) {
            for (let coin of segment.coins) {
                if (!coin.collected && assets.coin && assets.coin.complete) {
                    const centerX = segment.x + SEGMENT_WIDTH / 2;
                    const bobY = coin.y + Math.sin(bobTime + (coin.bobOffset || 0)) * 3;

                    // Draw glow
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                    ctx.shadowBlur = 15;
                    ctx.drawImage(assets.coin, centerX - COIN_SIZE / 2, bobY - COIN_SIZE / 2, COIN_SIZE, COIN_SIZE);
                    ctx.shadowBlur = 0;
                }
            }
        }
    }

    // Draw rocket with sprite
    function drawRocket() {
        ctx.save();
        ctx.translate(rocket.x + ROCKET_SIZE / 2, rocket.y + ROCKET_SIZE / 2);

        // Tilt rocket based on velocity
        const tilt = Math.min(Math.max(rocket.velocity * 0.05, -0.3), 0.3);
        ctx.rotate(tilt);

        // Draw fire/exhaust behind rocket
        if (gameState === 'playing' && assets.fire.length > 0) {
            const fireImg = assets.fire[Math.floor(fireFrame)];
            if (fireImg && fireImg.complete) {
                ctx.save();
                ctx.rotate(-Math.PI / 2); // Rotate fire to point left
                ctx.drawImage(fireImg, -15, -ROCKET_SIZE / 2 - 20, 30, 40);
                ctx.restore();
            }
        }

        // Draw ship sprite
        if (assets.ship && assets.ship.complete) {
            ctx.rotate(-Math.PI / 2); // Rotate ship to point right
            ctx.drawImage(assets.ship, -ROCKET_SIZE / 2, -ROCKET_SIZE / 2, ROCKET_SIZE, ROCKET_SIZE);
        } else {
            // Fallback to drawn rocket
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.moveTo(ROCKET_SIZE / 2, 0);
            ctx.lineTo(-ROCKET_SIZE / 2, -ROCKET_SIZE / 3);
            ctx.lineTo(-ROCKET_SIZE / 2, ROCKET_SIZE / 3);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    // Draw score
    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 20, 40);
        ctx.fillText(`High: ${highScore}`, 20, 70);

        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`💰 ${coins}`, 20, 100);

        ctx.fillStyle = '#888';
        ctx.font = '16px Arial';
        ctx.fillText(`Best: ${highCoins}`, 20, 120);
    }

    // Draw menu
    function drawMenu() {
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.8)';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TUNNEL RUNNER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#a0a0a0';
        ctx.font = '18px Arial';
        ctx.fillText('Navigate through the changing tunnel!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
        ctx.fillText('Avoid walls, obstacles, and narrow passages!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25);
        ctx.fillText('Choose your path when the tunnel splits!', GAME_WIDTH / 2, GAME_HEIGHT / 2);

        ctx.fillStyle = '#74b9ff';
        ctx.fillText('Tap or hold to fly up', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35);
        ctx.fillText('Release to fall down', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#feca57';
        ctx.shadowColor = 'rgba(254, 202, 87, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText('TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120);
        ctx.shadowBlur = 0;

        if (highScore > 0) {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#888';
            ctx.fillText(`High Score: ${highScore}  |  Best Coins: ${highCoins}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 170);
        }
    }

    // Draw game over
    function drawGameOver() {
        ctx.fillStyle = 'rgba(10, 10, 30, 0.85)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.fillStyle = '#ff6b6b';
        ctx.shadowColor = 'rgba(255, 107, 107, 0.8)';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = 'rgba(241, 196, 15, 0.6)';
        ctx.shadowBlur = 10;
        ctx.font = '28px Arial';
        ctx.fillText(`Coins: ${coins}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
        ctx.shadowBlur = 0;

        if (score > highScore || coins > highCoins) {
            ctx.fillStyle = '#55efc4';
            ctx.shadowColor = 'rgba(85, 239, 196, 0.8)';
            ctx.shadowBlur = 15;
            ctx.font = 'bold 24px Arial';
            let messages = [];
            if (score > highScore) messages.push('NEW HIGH SCORE');
            if (coins > highCoins) messages.push('MOST COINS');
            ctx.fillText(`${messages.join(' & ')}!`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = '#888';
            ctx.font = '18px Arial';
            ctx.fillText(`High: ${highScore}  |  Best Coins: ${highCoins}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
        }

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#feca57';
        ctx.shadowColor = 'rgba(254, 202, 87, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText('TAP TO PLAY AGAIN', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110);
        ctx.shadowBlur = 0;
    }

    // Game over
    function gameOver() {
        gameState = 'gameOver';

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('tunnelRunnerHighScore', highScore.toString());
        }

        if (coins > highCoins) {
            highCoins = coins;
            localStorage.setItem('tunnelRunnerHighCoins', highCoins.toString());
        }

        cancelAnimationFrame(animationId);
    }

    // Game loop
    function gameLoop() {
        update();
        draw();

        if (gameState === 'playing') {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Handle input
    function handleTap() {
        if (gameState === 'menu' || gameState === 'gameOver') {
            initGame();
        } else if (gameState === 'playing') {
            rocket.velocity = rocket.lift;
        }
    }

    // Launch Tunnel Runner
    window.launchTunnelRunner = function() {
        const content = document.getElementById('tunnelRunnerContent');

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding-top: 2rem;">
                <canvas id="tunnelCanvas" width="${GAME_WIDTH}" height="${GAME_HEIGHT}" style="
                    border: 3px solid #00d4ff;
                    border-radius: 12px;
                    max-width: 100%;
                    height: auto;
                    background: #0a0a1a;
                    cursor: pointer;
                    touch-action: none;
                    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5);
                "></canvas>

                <div style="text-align: center; color: #888; font-size: 0.9rem;">
                    <p style="margin: 0.5rem 0;"><strong style="color: #74b9ff;">Desktop:</strong> Click or press Space to fly up</p>
                    <p style="margin: 0.5rem 0;"><strong style="color: #74b9ff;">Mobile:</strong> Tap screen to fly up</p>
                </div>
            </div>
        `;

        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('tunnelRunnerGame').style.display = 'block';

        gameCanvas = document.getElementById('tunnelCanvas');
        ctx = gameCanvas.getContext('2d');

        gameState = 'loading';
        draw();

        // Load assets then show menu
        loadAssets(() => {
            initStarfield();
            gameState = 'menu';
            draw();
        });

        gameCanvas.addEventListener('click', handleTap);
        gameCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTap();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.getElementById('tunnelRunnerGame').style.display === 'block') {
                e.preventDefault();
                handleTap();
            }
        });
    };

    // Exit to menu
    window.exitTunnelRunnerToMenu = function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        document.getElementById('tunnelRunnerGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

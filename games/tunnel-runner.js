// Tunnel Runner Game - Side-scrolling rocket game with smooth tunnel generation
(function() {
    let gameCanvas, ctx;
    let gameState = 'menu'; // menu, playing, gameOver
    let rocket;
    let tunnelSegments = [];
    let score = 0;
    let coins = 0;
    let highScore = parseInt(localStorage.getItem('tunnelRunnerHighScore') || '0');
    let highCoins = parseInt(localStorage.getItem('tunnelRunnerHighCoins') || '0');
    let animationId;

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const ROCKET_SIZE = 30;
    const SCROLL_SPEED = 3;
    const BASE_TUNNEL_WIDTH = 200;
    const MIN_TUNNEL_WIDTH = 160; // Increased from 120 to prevent too-narrow tunnels
    const MAX_TUNNEL_WIDTH = 240;
    const SEGMENT_WIDTH = 20;
    const OBSTACLE_CHANCE = 0.08; // 8% chance per segment
    const COIN_CHANCE = 0.075; // 7.5% chance per segment (half of 15%)
    const SPLIT_CHANCE = 0.008; // 0.8% chance to start a tunnel split
    const MIN_PATH_WIDTH = 100; // Minimum width for each path during a split
    const PATH_DEVIATION = 30; // How much paths deviate from center during split
    const COIN_SIZE = 20;

    // Smooth motion parameters
    let targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
    let targetTunnelWidth = BASE_TUNNEL_WIDTH;
    let smoothingFactor = 0.15; // Lower = smoother (0-1)
    let noiseOffset = 0; // For continuous noise-like movement

    // Color palette for tunnel variations with neon glow
    const TUNNEL_COLORS = [
        { wall: '#6c5ce7', edge: '#a29bfe', glow: 'rgba(162, 155, 254, 0.6)', name: 'purple' },
        { wall: '#00b894', edge: '#55efc4', glow: 'rgba(85, 239, 196, 0.6)', name: 'green' },
        { wall: '#0984e3', edge: '#74b9ff', glow: 'rgba(116, 185, 255, 0.6)', name: 'blue' },
        { wall: '#d63031', edge: '#ff7675', glow: 'rgba(255, 118, 117, 0.6)', name: 'red' },
        { wall: '#fdcb6e', edge: '#ffeaa7', glow: 'rgba(255, 234, 167, 0.6)', name: 'yellow' },
        { wall: '#e17055', edge: '#fab1a0', glow: 'rgba(250, 177, 160, 0.6)', name: 'orange' }
    ];

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
            splitInfo: splitInfo // { state: 'splitting'|'split'|'merging', progress: 0-1, dividerY: number }
        };
    }

    // Simple noise function for smooth variation
    function smoothNoise(x, amplitude) {
        return Math.sin(x * 0.1) * amplitude + Math.sin(x * 0.23) * (amplitude * 0.5);
    }

    // Create random obstacles for a segment
    function createObstacles(topHeight, bottomHeight, tunnelWidth, canSpawn) {
        const obstacles = [];

        // Only spawn obstacles if:
        // 1. Enough segments have passed since last obstacle
        // 2. Tunnel is wide enough (at least 160 pixels)
        // 3. Not during a split
        // 4. Random chance triggers
        if (canSpawn &&
            segmentsSinceLastObstacle >= MIN_OBSTACLE_SPACING &&
            tunnelWidth >= 160 &&
            Math.random() < OBSTACLE_CHANCE) {

            // Random obstacle type with more variety
            const rand = Math.random();
            let obstacleType;
            let obstacleLength;

            if (rand < 0.25) {
                // Stalactite from top
                obstacleType = 'stalactite';
                obstacleLength = 30 + Math.random() * 50; // 30-80 pixels
                obstacles.push({
                    type: 'stalactite',
                    y: topHeight,
                    length: obstacleLength
                });
            } else if (rand < 0.5) {
                // Stalagmite from bottom
                obstacleType = 'stalagmite';
                obstacleLength = 30 + Math.random() * 50;
                obstacles.push({
                    type: 'stalagmite',
                    y: bottomHeight,
                    length: obstacleLength
                });
            } else if (rand < 0.7) {
                // Both top and bottom (narrow passage)
                obstacles.push({
                    type: 'stalactite',
                    y: topHeight,
                    length: 25 + Math.random() * 30
                });
                obstacles.push({
                    type: 'stalagmite',
                    y: bottomHeight,
                    length: 25 + Math.random() * 30
                });
            } else {
                // Floating crystal obstacle in middle
                const centerY = topHeight + tunnelWidth / 2;
                obstacles.push({
                    type: 'crystal',
                    y: centerY,
                    size: 30 + Math.random() * 20
                });
            }

            segmentsSinceLastObstacle = 0; // Reset counter
        } else {
            segmentsSinceLastObstacle++;
        }

        return obstacles;
    }

    // Create coins for a segment
    function createCoins(topHeight, bottomHeight, tunnelWidth, canSpawn) {
        const coins = [];

        // Spawn coins more frequently than obstacles
        if (canSpawn && Math.random() < COIN_CHANCE) {
            const numCoins = Math.floor(1 + Math.random() * 3); // 1-3 coins

            for (let i = 0; i < numCoins; i++) {
                // Random position in the open tunnel space
                const y = topHeight + COIN_SIZE + Math.random() * (tunnelWidth - COIN_SIZE * 2);
                coins.push({
                    y: y,
                    collected: false
                });
            }
        }

        return coins;
    }

    // Initialize game
    function initGame() {
        rocket = createRocket();
        tunnelSegments = [];
        score = 0;
        coins = 0;
        noiseOffset = 0;

        // Reset smooth motion targets
        targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
        targetTunnelWidth = BASE_TUNNEL_WIDTH;

        // Create initial tunnel segments with smooth interpolation
        let currentTopHeight = targetTopHeight;
        let currentTunnelWidth = targetTunnelWidth;
        let currentColorIndex = 0;

        for (let i = 0; i < Math.ceil(GAME_WIDTH / SEGMENT_WIDTH) + 5; i++) {
            // Smooth noise-based variation
            const heightNoise = smoothNoise(noiseOffset + i, 3);
            targetTopHeight = GAME_HEIGHT / 2 - currentTunnelWidth / 2 + heightNoise;

            // Interpolate smoothly toward target
            currentTopHeight += (targetTopHeight - currentTopHeight) * smoothingFactor;
            currentTopHeight = Math.max(50, Math.min(GAME_HEIGHT - currentTunnelWidth - 50, currentTopHeight));

            const currentBottomHeight = currentTopHeight + currentTunnelWidth;

            const obstacles = i > 10 ? createObstacles(currentTopHeight, currentBottomHeight, currentTunnelWidth, true) : [];
            const segmentCoins = i > 10 ? createCoins(currentTopHeight, currentBottomHeight, currentTunnelWidth, true) : [];

            tunnelSegments.push(createTunnelSegment(i * SEGMENT_WIDTH, currentTopHeight, currentBottomHeight, currentTunnelWidth, currentColorIndex, obstacles, segmentCoins));
        }

        gameState = 'playing';
        gameLoop();
    }

    // Track color changes
    let segmentsSinceColorChange = 0;
    let currentColorIndex = 0;

    // Track tunnel splits
    let splitState = null; // null, 'splitting', 'split', 'merging'
    let splitSegmentsRemaining = 0;
    let splitDividerY = 0;
    let splitTopTarget = 0;
    let splitBottomTarget = 0;
    const SPLIT_DURATION = 30; // segments to split
    const FULL_SPLIT_DURATION = 50; // segments fully split
    const MERGE_DURATION = 30; // segments to merge

    // Track obstacle spacing
    let segmentsSinceLastObstacle = 0;
    const MIN_OBSTACLE_SPACING = 15; // minimum segments between obstacles

    // Update game state
    function update() {
        if (gameState !== 'playing') return;

        // Update rocket physics
        rocket.velocity += rocket.gravity;

        // Cap velocity to prevent going too fast
        rocket.velocity = Math.max(-rocket.maxVelocity, Math.min(rocket.maxVelocity, rocket.velocity));

        rocket.y += rocket.velocity;

        // Update tunnel segments (scroll left)
        for (let segment of tunnelSegments) {
            segment.x -= SCROLL_SPEED;
        }

        // Remove off-screen segments and add new ones
        if (tunnelSegments[0].x < -SEGMENT_WIDTH) {
            tunnelSegments.shift();

            // Add new segment at the end
            const lastSegment = tunnelSegments[tunnelSegments.length - 1];
            noiseOffset += 0.5; // Increment for continuous noise

            // Smooth width variation
            const widthNoise = smoothNoise(noiseOffset * 0.5, 4);
            targetTunnelWidth += widthNoise;
            targetTunnelWidth = Math.max(MIN_TUNNEL_WIDTH, Math.min(MAX_TUNNEL_WIDTH, targetTunnelWidth));

            // Smooth interpolation towards target
            let newTunnelWidth = lastSegment.tunnelWidth + (targetTunnelWidth - lastSegment.tunnelWidth) * smoothingFactor;

            // Smooth height variation using noise
            const heightNoise = smoothNoise(noiseOffset, 5);
            targetTopHeight = GAME_HEIGHT / 2 - newTunnelWidth / 2 + heightNoise;

            // Interpolate smoothly
            let newTopHeight = lastSegment.topHeight + (targetTopHeight - lastSegment.topHeight) * smoothingFactor;
            newTopHeight = Math.max(50, Math.min(GAME_HEIGHT - newTunnelWidth - 50, newTopHeight));
            let newBottomHeight = newTopHeight + newTunnelWidth;

            // Change color every 50-100 segments
            segmentsSinceColorChange++;
            if (segmentsSinceColorChange > 50 + Math.random() * 50) {
                currentColorIndex = (currentColorIndex + 1) % TUNNEL_COLORS.length;
                segmentsSinceColorChange = 0;
            }

            // Handle tunnel splits with smooth transitions
            let splitInfo = null;

            if (splitState === null && Math.random() < SPLIT_CHANCE && score > 50) {
                // Start a new split
                splitState = 'splitting';
                splitSegmentsRemaining = SPLIT_DURATION;
                splitDividerY = newTopHeight + newTunnelWidth / 2;

                // Set split targets
                const dividerThickness = 15;
                const requiredWidth = (MIN_PATH_WIDTH * 2) + dividerThickness + (PATH_DEVIATION * 2);
                const expansionNeeded = Math.max(0, requiredWidth - newTunnelWidth);

                splitTopTarget = newTopHeight - (expansionNeeded / 2) - PATH_DEVIATION;
                splitBottomTarget = newBottomHeight + (expansionNeeded / 2) + PATH_DEVIATION;
            }

            if (splitState === 'splitting') {
                const progress = 1 - (splitSegmentsRemaining / SPLIT_DURATION);

                // Smoothly interpolate to split targets
                newTopHeight = lastSegment.topHeight + (splitTopTarget - lastSegment.topHeight) * 0.1;
                newBottomHeight = lastSegment.bottomHeight + (splitBottomTarget - lastSegment.bottomHeight) * 0.1;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                // Position divider smoothly
                const dividerThickness = 15;
                splitDividerY = newTopHeight + MIN_PATH_WIDTH + (dividerThickness / 2) + (PATH_DEVIATION * progress);
                splitInfo = { state: 'splitting', progress: progress, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = 'split';
                    splitSegmentsRemaining = FULL_SPLIT_DURATION;
                }
            } else if (splitState === 'split') {
                // Maintain split with small smooth variations
                const dividerThickness = 15;
                const smallVariation = smoothNoise(noiseOffset * 2, 2);

                newTopHeight = lastSegment.topHeight + smallVariation * 0.3;
                newBottomHeight = lastSegment.bottomHeight + smallVariation * 0.3;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                // Keep divider positioned
                splitDividerY = newTopHeight + MIN_PATH_WIDTH + (dividerThickness / 2) + PATH_DEVIATION;
                splitInfo = { state: 'split', progress: 1, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = 'merging';
                    splitSegmentsRemaining = MERGE_DURATION;

                    // Set merge target (back to normal tunnel)
                    targetTopHeight = GAME_HEIGHT / 2 - BASE_TUNNEL_WIDTH / 2;
                    targetTunnelWidth = BASE_TUNNEL_WIDTH;
                }
            } else if (splitState === 'merging') {
                const progress = splitSegmentsRemaining / MERGE_DURATION;

                // Smoothly merge back to normal tunnel
                newTopHeight = lastSegment.topHeight + (targetTopHeight - lastSegment.topHeight) * 0.08;
                newBottomHeight = newTopHeight + lastSegment.tunnelWidth + (targetTunnelWidth - lastSegment.tunnelWidth) * 0.08;
                newTopHeight = Math.max(30, newTopHeight);
                newBottomHeight = Math.min(GAME_HEIGHT - 30, newBottomHeight);
                newTunnelWidth = newBottomHeight - newTopHeight;

                // Bring divider back to center smoothly
                const dividerThickness = 15;
                splitDividerY = newTopHeight + (newTunnelWidth / 2);
                splitInfo = { state: 'merging', progress: progress, dividerY: splitDividerY };

                splitSegmentsRemaining--;
                if (splitSegmentsRemaining <= 0) {
                    splitState = null;
                }
            }

            // Create obstacles and coins (but not during splits)
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
            // Check tunnel walls
            if (rocket.y < rocketSegment.topHeight || rocket.y + ROCKET_SIZE > rocketSegment.bottomHeight) {
                gameOver();
            }

            // Check obstacles (stalactites, stalagmites, and crystals)
            for (let obstacle of rocketSegment.obstacles) {
                if (obstacle.type === 'stalactite') {
                    // Stalactite hangs from top
                    if (rocket.y < obstacle.y + obstacle.length) {
                        gameOver();
                    }
                } else if (obstacle.type === 'stalagmite') {
                    // Stalagmite rises from bottom
                    if (rocket.y + ROCKET_SIZE > obstacle.y - obstacle.length) {
                        gameOver();
                    }
                } else if (obstacle.type === 'crystal') {
                    // Floating crystal obstacle
                    const distance = Math.sqrt(
                        Math.pow(rocket.x + ROCKET_SIZE / 2 - (rocketSegment.x + SEGMENT_WIDTH / 2), 2) +
                        Math.pow(rocket.y + ROCKET_SIZE / 2 - obstacle.y, 2)
                    );
                    if (distance < obstacle.size / 2 + ROCKET_SIZE / 2) {
                        gameOver();
                    }
                }
            }

            // Check coin collection
            for (let coin of rocketSegment.coins) {
                if (!coin.collected) {
                    const distance = Math.sqrt(
                        Math.pow(rocket.x + ROCKET_SIZE / 2 - (rocketSegment.x + SEGMENT_WIDTH / 2), 2) +
                        Math.pow(rocket.y + ROCKET_SIZE / 2 - coin.y, 2)
                    );
                    if (distance < COIN_SIZE + ROCKET_SIZE / 2) {
                        coin.collected = true;
                        coins++;
                    }
                }
            }

            // Check tunnel split divider
            if (rocketSegment.splitInfo && rocketSegment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerTop = rocketSegment.splitInfo.dividerY - (dividerHalfThickness * rocketSegment.splitInfo.progress);
                const dividerBottom = rocketSegment.splitInfo.dividerY + (dividerHalfThickness * rocketSegment.splitInfo.progress);

                // Check if rocket hits the divider
                if (rocket.y + ROCKET_SIZE > dividerTop && rocket.y < dividerBottom) {
                    gameOver();
                }
            }
        }

        // Check if rocket went off screen
        if (rocket.y < 0 || rocket.y + ROCKET_SIZE > GAME_HEIGHT) {
            gameOver();
        }
    }

    // Draw game
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (gameState === 'menu') {
            drawMenu();
        } else if (gameState === 'playing') {
            drawTunnel();
            drawRocket();
            drawScore();
        } else if (gameState === 'gameOver') {
            drawTunnel();
            drawRocket();
            drawGameOver();
        }
    }

    // Draw tunnel with smooth curves
    function drawTunnel() {
        const color = TUNNEL_COLORS[currentColorIndex];

        // Draw top wall as smooth curved path
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

        // Draw top edge line with curves and neon glow
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

        // Draw bottom wall as smooth curved path
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

        // Draw bottom edge line with curves and neon glow
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

        // Draw split dividers as smooth paths
        for (let segment of tunnelSegments) {
            if (segment.splitInfo && segment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerTop = segment.splitInfo.dividerY - (dividerHalfThickness * segment.splitInfo.progress);
                const dividerBottom = segment.splitInfo.dividerY + (dividerHalfThickness * segment.splitInfo.progress);

                // Draw the divider segment
                ctx.fillStyle = color.wall;
                ctx.fillRect(segment.x, dividerTop, SEGMENT_WIDTH + 1, dividerBottom - dividerTop);
            }
        }

        // Draw divider edges with neon glow
        let inSplit = false;
        ctx.strokeStyle = color.edge;
        ctx.lineWidth = 3;
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 15;

        // Top edge of divider
        ctx.beginPath();
        for (let segment of tunnelSegments) {
            if (segment.splitInfo && segment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerTop = segment.splitInfo.dividerY - (dividerHalfThickness * segment.splitInfo.progress);

                if (!inSplit) {
                    ctx.moveTo(segment.x, dividerTop);
                    inSplit = true;
                } else {
                    ctx.lineTo(segment.x, dividerTop);
                }
            } else if (inSplit) {
                inSplit = false;
            }
        }
        ctx.stroke();

        // Bottom edge of divider
        inSplit = false;
        ctx.beginPath();
        for (let segment of tunnelSegments) {
            if (segment.splitInfo && segment.splitInfo.progress > 0) {
                const dividerThickness = 15;
                const dividerHalfThickness = dividerThickness / 2;
                const dividerBottom = segment.splitInfo.dividerY + (dividerHalfThickness * segment.splitInfo.progress);

                if (!inSplit) {
                    ctx.moveTo(segment.x, dividerBottom);
                    inSplit = true;
                } else {
                    ctx.lineTo(segment.x, dividerBottom);
                }
            } else if (inSplit) {
                inSplit = false;
            }
        }
        ctx.stroke();

        // Reset shadow for obstacles
        ctx.shadowBlur = 0;

        // Draw obstacles with neon glow
        for (let segment of tunnelSegments) {
            for (let obstacle of segment.obstacles) {
                if (obstacle.type === 'stalactite') {
                    // Draw stalactite - base attached to ceiling, point hanging down
                    ctx.fillStyle = '#9b59b6';
                    ctx.shadowColor = 'rgba(155, 89, 182, 0.8)';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    // Wide base at ceiling
                    ctx.moveTo(segment.x, obstacle.y);
                    ctx.lineTo(segment.x + SEGMENT_WIDTH, obstacle.y);
                    // Point at bottom
                    ctx.lineTo(segment.x + SEGMENT_WIDTH / 2, obstacle.y + obstacle.length);
                    ctx.closePath();
                    ctx.fill();

                    // Add highlight with glow
                    ctx.strokeStyle = '#d4a5e8';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                } else if (obstacle.type === 'stalagmite') {
                    // Draw stalagmite - base attached to floor, point rising up
                    ctx.fillStyle = '#9b59b6';
                    ctx.shadowColor = 'rgba(155, 89, 182, 0.8)';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    // Wide base at floor
                    ctx.moveTo(segment.x, obstacle.y);
                    ctx.lineTo(segment.x + SEGMENT_WIDTH, obstacle.y);
                    // Point at top
                    ctx.lineTo(segment.x + SEGMENT_WIDTH / 2, obstacle.y - obstacle.length);
                    ctx.closePath();
                    ctx.fill();

                    // Add highlight with glow
                    ctx.strokeStyle = '#d4a5e8';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                } else if (obstacle.type === 'crystal') {
                    // Draw floating crystal obstacle (diamond shape) with red glow
                    const centerX = segment.x + SEGMENT_WIDTH / 2;
                    const centerY = obstacle.y;
                    const size = obstacle.size;

                    ctx.fillStyle = '#e74c3c';
                    ctx.shadowColor = 'rgba(231, 76, 60, 0.8)';
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY - size / 2);
                    ctx.lineTo(centerX + size / 2, centerY);
                    ctx.lineTo(centerX, centerY + size / 2);
                    ctx.lineTo(centerX - size / 2, centerY);
                    ctx.closePath();
                    ctx.fill();

                    // Add highlight with glow
                    ctx.strokeStyle = '#ff8a80';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Draw coins with golden glow
        for (let segment of tunnelSegments) {
            for (let coin of segment.coins) {
                if (!coin.collected) {
                    const centerX = segment.x + SEGMENT_WIDTH / 2;
                    const centerY = coin.y;

                    // Draw coin with golden glow
                    ctx.fillStyle = '#f1c40f';
                    ctx.shadowColor = 'rgba(241, 196, 15, 0.8)';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, COIN_SIZE / 2, 0, Math.PI * 2);
                    ctx.fill();

                    // Add coin border
                    ctx.strokeStyle = '#ffeaa7';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Add inner circle for detail
                    ctx.strokeStyle = '#f39c12';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, COIN_SIZE / 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
    }

    // Draw rocket with neon glow
    function drawRocket() {
        ctx.save();
        ctx.translate(rocket.x + ROCKET_SIZE / 2, rocket.y + ROCKET_SIZE / 2);

        // Tilt rocket based on velocity
        const tilt = Math.min(Math.max(rocket.velocity * 0.05, -0.3), 0.3);
        ctx.rotate(tilt);

        // Rocket body with cyan glow
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(ROCKET_SIZE / 2, 0);
        ctx.lineTo(-ROCKET_SIZE / 2, -ROCKET_SIZE / 3);
        ctx.lineTo(-ROCKET_SIZE / 2, ROCKET_SIZE / 3);
        ctx.closePath();
        ctx.fill();

        // Rocket outline
        ctx.strokeStyle = '#88f0ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rocket flame with orange glow
        if (gameState === 'playing') {
            ctx.fillStyle = '#feca57';
            ctx.shadowColor = 'rgba(254, 202, 87, 0.9)';
            ctx.shadowBlur = 20;
            const flameSize = 10 + Math.random() * 5;
            ctx.beginPath();
            ctx.moveTo(-ROCKET_SIZE / 2, -5);
            ctx.lineTo(-ROCKET_SIZE / 2 - flameSize, 0);
            ctx.lineTo(-ROCKET_SIZE / 2, 5);
            ctx.closePath();
            ctx.fill();
        }

        // Rocket window with glow
        ctx.fillStyle = '#74b9ff';
        ctx.shadowColor = 'rgba(116, 185, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    // Draw score
    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 20, 40);
        ctx.fillText(`High: ${highScore}`, 20, 70);

        // Draw coin count
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`💰 ${coins}`, 20, 100);

        ctx.fillStyle = '#888';
        ctx.font = '16px Arial';
        ctx.fillText(`Best: ${highCoins}`, 20, 120);
    }

    // Draw menu with neon styling
    function drawMenu() {
        // Title with cyan glow
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.8)';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TUNNEL RUNNER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);
        ctx.shadowBlur = 0;

        // Instructions
        ctx.fillStyle = '#a0a0a0';
        ctx.font = '18px Arial';
        ctx.fillText('Navigate through the changing tunnel!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
        ctx.fillText('Avoid walls, obstacles, and narrow passages!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25);
        ctx.fillText('Choose your path when the tunnel splits!', GAME_WIDTH / 2, GAME_HEIGHT / 2);

        ctx.fillStyle = '#74b9ff';
        ctx.fillText('Tap or hold to fly up', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35);
        ctx.fillText('Release to fall down', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);

        // Start button with golden glow
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#feca57';
        ctx.shadowColor = 'rgba(254, 202, 87, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText('TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120);
        ctx.shadowBlur = 0;

        // High score
        if (highScore > 0) {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#888';
            ctx.fillText(`High Score: ${highScore}  |  Best Coins: ${highCoins}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 170);
        }
    }

    // Draw game over with neon styling
    function drawGameOver() {
        // Semi-transparent overlay with gradient
        ctx.fillStyle = 'rgba(10, 10, 30, 0.85)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Game Over title with red glow
        ctx.fillStyle = '#ff6b6b';
        ctx.shadowColor = 'rgba(255, 107, 107, 0.8)';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);
        ctx.shadowBlur = 0;

        // Score with cyan glow
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
        ctx.shadowBlur = 0;

        // Coins with golden glow
        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = 'rgba(241, 196, 15, 0.6)';
        ctx.shadowBlur = 10;
        ctx.font = '28px Arial';
        ctx.fillText(`Coins: ${coins}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
        ctx.shadowBlur = 0;

        if (score > highScore || coins > highCoins) {
            // New record with bright glow
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

        // Play again with golden glow
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
                    background: #1a1a2e;
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

        // Show game section
        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('tunnelRunnerGame').style.display = 'block';

        // Initialize canvas
        gameCanvas = document.getElementById('tunnelCanvas');
        ctx = gameCanvas.getContext('2d');

        gameState = 'menu';
        draw();

        // Event listeners
        gameCanvas.addEventListener('click', handleTap);
        gameCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTap();
        });

        // Keyboard support
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

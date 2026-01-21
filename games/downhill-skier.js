// Downhill Skier Game - Vertical scrolling skiing game
(function() {
    let gameCanvas, ctx;
    let gameState = 'menu'; // menu, modeSelect, playing, gameOver
    let gameMode = 'downhill'; // downhill, slalom
    let skier;
    let slopeSegments = [];
    let trees = [];
    let gates = []; // Slalom gates
    let score = 0;
    let highScore = parseInt(localStorage.getItem('downhillSkierHighScore') || '0');
    let bestSlalomTime = parseFloat(localStorage.getItem('downhillSkierBestSlalom') || '999.9');
    let gameTime = 0; // Time in seconds
    let gatesPassed = 0;
    let gatesMissed = 0;
    let totalGates = 0;
    let animationId;
    let keys = {};

    // Dynamic canvas sizing
    let CANVAS_WIDTH = 800;
    let CANVAS_HEIGHT = 600;
    let scaleFactor = 1;

    // Base dimensions (used for scaling calculations)
    const BASE_WIDTH = 800;
    const BASE_HEIGHT = 600;

    // Scaled game constants
    let SKIER_WIDTH = 30;
    let SKIER_HEIGHT = 35;
    const BASE_SCROLL_SPEED = 4;
    let SKIER_SPEED = 5;
    let SLOPE_WIDTH = 400;
    const SEGMENT_HEIGHT = 20;
    const TREE_SPAWN_CHANCE = 0.08;
    const ROCK_SPAWN_CHANCE = 0.05;
    let MIN_TREE_SPACING = 60;
    let MIN_ROCK_SPACING = 80;
    let GATE_SPACING = 200;
    let GATE_WIDTH = 120;
    let POLE_HEIGHT = 50;
    const GATE_PENALTY_TIME = 5.0;

    let currentScrollSpeed = BASE_SCROLL_SPEED;
    let lastGateY = 0;

    // Resize canvas to fill wrapper
    function resizeCanvas() {
        const wrapper = document.getElementById('skierCanvasWrapper');
        if (!wrapper) return;

        let w = wrapper.clientWidth;
        let h = wrapper.clientHeight;

        if (w === 0 || h === 0) {
            w = window.innerWidth;
            h = window.innerHeight - 120;
        }

        CANVAS_WIDTH = w;
        CANVAS_HEIGHT = h;
        gameCanvas.width = CANVAS_WIDTH;
        gameCanvas.height = CANVAS_HEIGHT;

        // Scale factor based on canvas size
        scaleFactor = Math.min(CANVAS_WIDTH / BASE_WIDTH, CANVAS_HEIGHT / BASE_HEIGHT);

        // Update scaled dimensions
        SKIER_WIDTH = Math.floor(30 * scaleFactor);
        SKIER_HEIGHT = Math.floor(35 * scaleFactor);
        SKIER_SPEED = 5 * scaleFactor;
        SLOPE_WIDTH = Math.floor(CANVAS_WIDTH * 0.5); // 50% of canvas width
        MIN_TREE_SPACING = Math.floor(60 * scaleFactor);
        MIN_ROCK_SPACING = Math.floor(80 * scaleFactor);
        GATE_SPACING = Math.floor(200 * scaleFactor);
        GATE_WIDTH = Math.floor(120 * scaleFactor);
        POLE_HEIGHT = Math.floor(50 * scaleFactor);
    }

    // Skier object
    function createSkier() {
        return {
            x: CANVAS_WIDTH / 2 - SKIER_WIDTH / 2,
            y: CANVAS_HEIGHT / 2 - SKIER_HEIGHT / 2, // Middle of screen
            velocityX: 0,
            direction: 0, // -1 left, 0 none, 1 right
            crashed: false,
            crashRecoveryTime: 0,
            crashCount: 0 // Track number of crashes
        };
    }

    // Create a slope segment
    function createSlopeSegment(y, leftEdge, rightEdge) {
        return {
            y: y,
            leftEdge: leftEdge,
            rightEdge: rightEdge
        };
    }

    // Create a tree obstacle
    function createTree(x, y) {
        return {
            type: 'tree',
            x: x,
            y: y,
            size: 25 + Math.random() * 15, // 25-40 pixels
            hit: false
        };
    }

    // Create a rock obstacle
    function createRock(x, y) {
        return {
            type: 'rock',
            x: x,
            y: y,
            size: 20 + Math.random() * 20, // 20-40 pixels
            hit: false
        };
    }

    // Create a slalom gate (pair of poles)
    function createGate(centerX, y) {
        return {
            leftPoleX: centerX - GATE_WIDTH / 2,
            rightPoleX: centerX + GATE_WIDTH / 2,
            y: y,
            passed: false,
            missed: false
        };
    }

    // Create a mogul (bump)
    function createMogul(x, y) {
        return {
            type: 'mogul',
            x: x,
            y: y,
            size: 15 + Math.random() * 10, // 15-25 pixels
            hit: false
        };
    }

    // Initialize game
    function initGame() {
        skier = createSkier();
        slopeSegments = [];
        trees = [];
        gates = [];
        score = 0;
        gameTime = 0;
        gatesPassed = 0;
        gatesMissed = 0;
        totalGates = 0;
        keys = {};
        currentScrollSpeed = BASE_SCROLL_SPEED;
        lastGateY = CANVAS_HEIGHT + 100; // Start gates below screen

        // Create initial slope segments
        let slopeLeft = (CANVAS_WIDTH - SLOPE_WIDTH) / 2;
        let slopeRight = slopeLeft + SLOPE_WIDTH;

        for (let i = 0; i < Math.ceil(CANVAS_HEIGHT / SEGMENT_HEIGHT) + 5; i++) {
            // Add some gentle variation to slope edges
            const variation = (Math.random() - 0.5) * 4;
            slopeLeft = Math.max(100, Math.min(CANVAS_WIDTH - SLOPE_WIDTH - 100, slopeLeft + variation));
            slopeRight = slopeLeft + SLOPE_WIDTH;

            slopeSegments.push(createSlopeSegment(CANVAS_HEIGHT + i * SEGMENT_HEIGHT, slopeLeft, slopeRight));
        }

        // Create initial gates for slalom mode
        if (gameMode === 'slalom') {
            const centerX = CANVAS_WIDTH / 2;
            for (let i = 0; i < 10; i++) {
                const gateY = CANVAS_HEIGHT + 200 + i * GATE_SPACING;
                const offset = (Math.random() - 0.5) * 100; // Vary gate positions
                gates.push(createGate(centerX + offset, gateY));
                totalGates++;
                lastGateY = gateY;
            }
        }

        gameState = 'playing';
        gameLoop();
    }

    // Track tree and rock spawning
    let segmentsSinceLastTree = 0;
    let segmentsSinceLastRock = 0;
    const MIN_TREE_SEGMENT_SPACING = 3; // Minimum segments between tree spawns
    const MIN_ROCK_SEGMENT_SPACING = 2; // Minimum segments between rock spawns

    // Spawn obstacles randomly
    function spawnTreesForSegment(segment, isInitial = false) {
        const slopeWidth = segment.rightEdge - segment.leftEdge;

        // Check if there's a gate near this segment in slalom mode
        const nearGate = gameMode === 'slalom' && gates.some(gate =>
            Math.abs(gate.y - segment.y) < 100
        );

        // Spawn trees (reduced in slalom mode, avoid near gates)
        const treeChance = gameMode === 'slalom' ? TREE_SPAWN_CHANCE * 0.5 : TREE_SPAWN_CHANCE;
        if (!isInitial &&
            !nearGate &&
            segmentsSinceLastTree >= MIN_TREE_SEGMENT_SPACING &&
            Math.random() < treeChance) {

            const numTrees = Math.floor(Math.random() * 3) + 1; // 1-3 trees
            const positions = [];

            for (let i = 0; i < numTrees; i++) {
                let attempts = 0;
                let validPosition = false;
                let treeX;

                while (!validPosition && attempts < 10) {
                    treeX = segment.leftEdge + 40 + Math.random() * (slopeWidth - 80);
                    validPosition = positions.every(pos => Math.abs(pos - treeX) >= MIN_TREE_SPACING);
                    attempts++;
                }

                if (validPosition) {
                    positions.push(treeX);
                    trees.push(createTree(treeX, segment.y));
                }
            }

            segmentsSinceLastTree = 0;
        } else {
            segmentsSinceLastTree++;
        }

        // Spawn rocks (only after score >= 300)
        if (!isInitial &&
            score >= 300 &&
            segmentsSinceLastRock >= MIN_ROCK_SEGMENT_SPACING &&
            Math.random() < ROCK_SPAWN_CHANCE) {

            const numRocks = Math.floor(Math.random() * 2) + 1; // 1-2 rocks

            for (let i = 0; i < numRocks; i++) {
                let attempts = 0;
                let validPosition = false;
                let rockX;

                while (!validPosition && attempts < 10) {
                    rockX = segment.leftEdge + 30 + Math.random() * (slopeWidth - 60);

                    // Check spacing from trees and other rocks
                    const nearTree = trees.some(tree =>
                        Math.abs(tree.y - segment.y) < 50 && Math.abs(tree.x - rockX) < MIN_ROCK_SPACING
                    );
                    validPosition = !nearTree;
                    attempts++;
                }

                if (validPosition) {
                    trees.push(createRock(rockX, segment.y));
                }
            }

            segmentsSinceLastRock = 0;
        } else {
            segmentsSinceLastRock++;
        }

        // Spawn moguls (after score >= 100)
        if (!isInitial &&
            !nearGate &&
            score >= 100 &&
            Math.random() < 0.04) {  // 4% chance

            const numMoguls = Math.floor(Math.random() * 2) + 1; // 1-2 moguls

            for (let i = 0; i < numMoguls; i++) {
                const mogulX = segment.leftEdge + 40 + Math.random() * (slopeWidth - 80);
                trees.push(createMogul(mogulX, segment.y));
            }
        }
    }

    // Update game state
    function update() {
        if (gameState !== 'playing') return;

        // Update game time (roughly 60fps, so add 1/60 seconds)
        gameTime += 1/60;

        // Handle crash recovery
        if (skier.crashed) {
            skier.crashRecoveryTime -= 1/60;
            if (skier.crashRecoveryTime <= 0) {
                skier.crashed = false;
            }
        }

        // Update skier movement based on arrow keys (disabled during crash)
        if (!skier.crashed) {
            if (keys['ArrowLeft']) {
                skier.velocityX = -SKIER_SPEED;
                skier.direction = -1;
            } else if (keys['ArrowRight']) {
                skier.velocityX = SKIER_SPEED;
                skier.direction = 1;
            } else {
                skier.velocityX = 0;
                skier.direction = 0;
            }

            skier.x += skier.velocityX;
        }

        // Calculate base scroll speed with multiple acceleration factors
        // 1. Distance-based acceleration (every 100m adds speed)
        let distanceBonus = Math.floor(score / 100) * 1.0; // Increased from 0.5 to 1.0

        // 2. Time-based continuous acceleration (adds speed every 10 seconds)
        let timeBonus = Math.floor(gameTime / 10) * 0.5;

        // 3. Gradual continuous acceleration (small increase per second)
        let gradualBonus = gameTime * 0.02; // Adds 0.02 speed per second

        let baseSpeed = BASE_SCROLL_SPEED + distanceBonus + timeBonus + gradualBonus;

        // Cap maximum speed to keep game playable
        baseSpeed = Math.min(baseSpeed, BASE_SCROLL_SPEED * 3); // Max 3x starting speed

        // Reduce speed when turning (Atari Ski mechanic)
        if (skier.direction !== 0) {
            baseSpeed *= 0.75; // 25% slower when turning
        }

        // Further reduce speed during crash recovery
        if (skier.crashed) {
            baseSpeed *= 0.3; // 70% slower when recovering
        }

        currentScrollSpeed = baseSpeed;

        // Update slope segments (scroll up - terrain moves up as skier goes down)
        for (let segment of slopeSegments) {
            segment.y -= currentScrollSpeed;
        }

        // Update trees and rocks (scroll up)
        for (let tree of trees) {
            tree.y -= currentScrollSpeed;
        }

        // Update gates (scroll up) in slalom mode
        if (gameMode === 'slalom') {
            for (let gate of gates) {
                gate.y -= currentScrollSpeed;
            }

            // Check if we need to spawn a new gate
            if (lastGateY - gates[gates.length - 1].y < GATE_SPACING * 5) {
                const centerX = CANVAS_WIDTH / 2;
                const offset = (Math.random() - 0.5) * 120; // Vary gate positions
                const newGateY = lastGateY + GATE_SPACING;
                gates.push(createGate(centerX + offset, newGateY));
                totalGates++;
                lastGateY = newGateY;
            }
        }

        // Remove off-screen segments and add new ones at bottom
        if (slopeSegments[0].y < -SEGMENT_HEIGHT) {
            slopeSegments.shift();

            // Add new segment at the bottom
            const lastSegment = slopeSegments[slopeSegments.length - 1];
            const variation = (Math.random() - 0.5) * 6;
            let newSlopeLeft = Math.max(100, Math.min(CANVAS_WIDTH - SLOPE_WIDTH - 100, lastSegment.leftEdge + variation));
            let newSlopeRight = newSlopeLeft + SLOPE_WIDTH;

            const newSegment = createSlopeSegment(lastSegment.y + SEGMENT_HEIGHT, newSlopeLeft, newSlopeRight);
            slopeSegments.push(newSegment);

            // Spawn trees for new segment
            spawnTreesForSegment(newSegment);

            score++;
        }

        // Remove off-screen trees
        trees = trees.filter(tree => tree.y > -50);

        // Remove off-screen gates and check for gate pass/miss
        if (gameMode === 'slalom') {
            gates = gates.filter(gate => {
                if (gate.y < -50) {
                    return false; // Remove off-screen gate
                }

                // Check if skier is passing through gate zone
                const skierCenterY = skier.y + SKIER_HEIGHT / 2;
                const skierCenterX = skier.x + SKIER_WIDTH / 2;

                if (!gate.passed && !gate.missed && skierCenterY > gate.y - 20 && skierCenterY < gate.y + 20) {
                    // Skier is at gate level - check if passed through
                    if (skierCenterX > gate.leftPoleX && skierCenterX < gate.rightPoleX) {
                        // Passed through successfully!
                        gate.passed = true;
                        gatesPassed++;
                    } else if (skierCenterY > gate.y) {
                        // Missed the gate
                        gate.missed = true;
                        gatesMissed++;
                        gameTime += GATE_PENALTY_TIME; // Add penalty time
                    }
                }

                return true; // Keep gate
            });
        }

        // Check collisions with slope edges
        const currentSegment = slopeSegments.find(seg =>
            skier.y + SKIER_HEIGHT > seg.y && skier.y < seg.y + SEGMENT_HEIGHT
        );

        if (currentSegment) {
            // Check if skier hit slope boundaries
            if (skier.x < currentSegment.leftEdge || skier.x + SKIER_WIDTH > currentSegment.rightEdge) {
                gameOver();
            }
        }

        // Check collisions with trees, rocks, and moguls
        for (let obstacle of trees) {
            if (obstacle.hit || skier.crashed) continue;

            // Simple circle collision detection
            const skierCenterX = skier.x + SKIER_WIDTH / 2;
            const skierCenterY = skier.y + SKIER_HEIGHT / 2;
            const obstacleCenterX = obstacle.x;
            const obstacleCenterY = obstacle.y;

            const distance = Math.sqrt(
                Math.pow(skierCenterX - obstacleCenterX, 2) +
                Math.pow(skierCenterY - obstacleCenterY, 2)
            );

            let collisionRadius;
            if (obstacle.type === 'tree') {
                collisionRadius = obstacle.size / 2;
            } else if (obstacle.type === 'rock') {
                collisionRadius = obstacle.size / 2.5;
            } else if (obstacle.type === 'mogul') {
                collisionRadius = obstacle.size / 2;
            }

            if (distance < (collisionRadius + SKIER_WIDTH / 2)) {
                obstacle.hit = true;
                skier.crashCount++;

                // Check if game over (3 crashes)
                if (skier.crashCount >= 3) {
                    gameOver();
                } else {
                    // Slow down and recover
                    skier.crashed = true;
                    skier.crashRecoveryTime = 1.5; // 1.5 seconds recovery
                }
            }
        }
    }

    // Draw game
    function draw() {
        // Clear canvas with sky blue background
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (gameState === 'menu') {
            drawMenu();
        } else if (gameState === 'playing') {
            drawSlope();
            drawTrees();
            if (gameMode === 'slalom') {
                drawGates();
            }
            drawSkier();
            drawScore();
        } else if (gameState === 'gameOver') {
            drawSlope();
            drawTrees();
            if (gameMode === 'slalom') {
                drawGates();
            }
            drawSkier();
            drawGameOver();
        }
    }

    // Draw slope
    function drawSlope() {
        // Draw snow slope
        for (let i = 0; i < slopeSegments.length - 1; i++) {
            const segment = slopeSegments[i];
            const nextSegment = slopeSegments[i + 1];

            // Draw white snow slope
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(segment.leftEdge, segment.y);
            ctx.lineTo(segment.rightEdge, segment.y);
            ctx.lineTo(nextSegment.rightEdge, nextSegment.y);
            ctx.lineTo(nextSegment.leftEdge, nextSegment.y);
            ctx.closePath();
            ctx.fill();

            // Draw slope edges (dark areas outside slope)
            ctx.fillStyle = '#2d4a2e';
            ctx.fillRect(0, segment.y, segment.leftEdge, SEGMENT_HEIGHT);
            ctx.fillRect(segment.rightEdge, segment.y, CANVAS_WIDTH - segment.rightEdge, SEGMENT_HEIGHT);

            // Draw edge lines
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(segment.leftEdge, segment.y);
            ctx.lineTo(nextSegment.leftEdge, nextSegment.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(segment.rightEdge, segment.y);
            ctx.lineTo(nextSegment.rightEdge, nextSegment.y);
            ctx.stroke();
        }
    }

    // Draw trees, rocks, and moguls
    function drawTrees() {
        for (let obstacle of trees) {
            if (obstacle.type === 'mogul') {
                // Draw mogul as a white bump
                const mogulSize = obstacle.size;

                // Mogul shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.beginPath();
                ctx.ellipse(obstacle.x, obstacle.y + 3, mogulSize * 0.8, mogulSize * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Mogul body (rounded bump)
                ctx.fillStyle = obstacle.hit ? '#e0e0e0' : '#f5f5f5';
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(obstacle.x, obstacle.y, mogulSize, mogulSize * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Highlight on top
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.ellipse(obstacle.x - mogulSize * 0.2, obstacle.y - mogulSize * 0.2, mogulSize * 0.4, mogulSize * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (obstacle.type === 'tree') {
                // Draw pine tree with snow
                const treeHeight = obstacle.size * 1.4;
                const baseWidth = obstacle.size * 0.6;

                // Shadow
                ctx.fillStyle = 'rgba(0, 0, 50, 0.15)';
                ctx.beginPath();
                ctx.ellipse(obstacle.x + 4, obstacle.y + 8, obstacle.size * 0.5, obstacle.size * 0.18, 0.2, 0, Math.PI * 2);
                ctx.fill();

                // Trunk
                ctx.fillStyle = '#5c3d2e';
                ctx.fillRect(obstacle.x - 5, obstacle.y - 12, 10, 18);

                // Tree body
                ctx.fillStyle = '#2d5016';
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y - treeHeight);
                ctx.lineTo(obstacle.x - baseWidth, obstacle.y - 8);
                ctx.lineTo(obstacle.x + baseWidth, obstacle.y - 8);
                ctx.closePath();
                ctx.fill();

                // Snow cap
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y - treeHeight - 3);
                ctx.lineTo(obstacle.x - baseWidth * 0.3, obstacle.y - treeHeight * 0.7);
                ctx.lineTo(obstacle.x + baseWidth * 0.3, obstacle.y - treeHeight * 0.7);
                ctx.closePath();
                ctx.fill();

            } else if (obstacle.type === 'rock') {
                // Draw rock as an irregular polygon
                const rockSize = obstacle.size;

                // Rock shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.ellipse(obstacle.x + 2, obstacle.y + 5, rockSize * 0.5, rockSize * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();

                // Rock body (irregular shape)
                ctx.fillStyle = '#666666';
                ctx.strokeStyle = '#444444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y - rockSize);
                ctx.lineTo(obstacle.x + rockSize * 0.6, obstacle.y - rockSize * 0.3);
                ctx.lineTo(obstacle.x + rockSize * 0.4, obstacle.y);
                ctx.lineTo(obstacle.x - rockSize * 0.5, obstacle.y);
                ctx.lineTo(obstacle.x - rockSize * 0.7, obstacle.y - rockSize * 0.4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Rock highlights
                ctx.fillStyle = '#888888';
                ctx.beginPath();
                ctx.moveTo(obstacle.x - rockSize * 0.2, obstacle.y - rockSize * 0.7);
                ctx.lineTo(obstacle.x + rockSize * 0.3, obstacle.y - rockSize * 0.5);
                ctx.lineTo(obstacle.x, obstacle.y - rockSize * 0.3);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // Draw slalom gates
    function drawGates() {
        for (let gate of gates) {
            // Draw left pole (red)
            ctx.fillStyle = '#DC143C';
            ctx.fillRect(gate.leftPoleX - 3, gate.y - POLE_HEIGHT, 6, POLE_HEIGHT);

            ctx.fillStyle = gate.passed ? '#90EE90' : gate.missed ? '#FFB6C1' : '#FF6B6B';
            ctx.beginPath();
            ctx.moveTo(gate.leftPoleX + 3, gate.y - POLE_HEIGHT);
            ctx.lineTo(gate.leftPoleX + 20, gate.y - POLE_HEIGHT + 8);
            ctx.lineTo(gate.leftPoleX + 3, gate.y - POLE_HEIGHT + 16);
            ctx.closePath();
            ctx.fill();

            // Draw right pole (blue)
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(gate.rightPoleX - 3, gate.y - POLE_HEIGHT, 6, POLE_HEIGHT);

            ctx.fillStyle = gate.passed ? '#90EE90' : gate.missed ? '#FFB6C1' : '#6B9BFF';
            ctx.beginPath();
            ctx.moveTo(gate.rightPoleX - 3, gate.y - POLE_HEIGHT);
            ctx.lineTo(gate.rightPoleX - 20, gate.y - POLE_HEIGHT + 8);
            ctx.lineTo(gate.rightPoleX - 3, gate.y - POLE_HEIGHT + 16);
            ctx.closePath();
            ctx.fill();

            // Draw dotted line between poles to show gate
            if (!gate.passed && !gate.missed) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(gate.leftPoleX, gate.y - POLE_HEIGHT / 2);
                ctx.lineTo(gate.rightPoleX, gate.y - POLE_HEIGHT / 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    // Draw skier
    function drawSkier() {
        ctx.save();
        ctx.translate(skier.x + SKIER_WIDTH / 2, skier.y + SKIER_HEIGHT / 2);

        // Flash effect when crashed
        if (skier.crashed && Math.floor(skier.crashRecoveryTime * 10) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Tilt skier based on direction (or tumble if crashed)
        let tilt = skier.direction * 0.15;
        if (skier.crashed) {
            tilt = Math.sin(skier.crashRecoveryTime * 10) * 0.5; // Tumbling effect
        }
        ctx.rotate(tilt);

        // Skier body (simple triangle shape)
        ctx.fillStyle = skier.crashed ? '#ff3333' : '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(0, -SKIER_HEIGHT / 2);
        ctx.lineTo(-SKIER_WIDTH / 2, SKIER_HEIGHT / 2);
        ctx.lineTo(SKIER_WIDTH / 2, SKIER_HEIGHT / 2);
        ctx.closePath();
        ctx.fill();

        // Skier head
        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.arc(0, -SKIER_HEIGHT / 2 - 5, 6, 0, Math.PI * 2);
        ctx.fill();

        // Skis
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-SKIER_WIDTH / 3, SKIER_HEIGHT / 2);
        ctx.lineTo(-SKIER_WIDTH / 3, SKIER_HEIGHT / 2 + 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(SKIER_WIDTH / 3, SKIER_HEIGHT / 2);
        ctx.lineTo(SKIER_WIDTH / 3, SKIER_HEIGHT / 2 + 15);
        ctx.stroke();

        ctx.restore();

        // Show "OUCH!" text when crashed
        if (skier.crashed) {
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('OUCH!', skier.x + SKIER_WIDTH / 2, skier.y - 30);
        }
    }

    // Draw score
    function drawScore() {
        const fontSize = Math.max(14, Math.min(24, CANVAS_WIDTH / 22));
        const smallFont = Math.max(12, Math.min(20, CANVAS_WIDTH / 28));
        const lineHeight = fontSize + 8;

        ctx.fillStyle = '#333';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'left';

        if (gameMode === 'downhill') {
            ctx.fillText(`Dist: ${score}`, 10, lineHeight);
            ctx.fillText(`High: ${highScore}`, 10, lineHeight * 2);
        } else if (gameMode === 'slalom') {
            const displayTime = gameTime.toFixed(1);
            ctx.fillText(`Time: ${displayTime}s`, 10, lineHeight);
            ctx.fillText(`Gates: ${gatesPassed}/${totalGates}`, 10, lineHeight * 2);
            ctx.fillText(`Miss: ${gatesMissed}`, 10, lineHeight * 3);
            if (bestSlalomTime < 999) {
                ctx.fillText(`Best: ${bestSlalomTime.toFixed(1)}s`, 10, lineHeight * 4);
            }
        }

        // Show crash counter (hearts/lives)
        const crashesLeft = 3 - skier.crashCount;
        ctx.font = `bold ${smallFont}px Arial`;
        ctx.fillStyle = '#ff0000';
        const heartsY = gameMode === 'slalom' ? lineHeight * 5 : lineHeight * 3;
        ctx.fillText('❤️'.repeat(crashesLeft) + '🖤'.repeat(skier.crashCount), 10, heartsY);
    }

    // Draw menu
    function drawMenu() {
        const titleSize = Math.max(20, Math.min(36, CANVAS_WIDTH / 14));
        const textSize = Math.max(12, Math.min(20, CANVAS_WIDTH / 28));
        const subSize = Math.max(14, Math.min(24, CANVAS_WIDTH / 22));

        // Draw background slope
        const slopeLeft = CANVAS_WIDTH * 0.25;
        const slopeWidth = CANVAS_WIDTH * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(slopeLeft, 0, slopeWidth, CANVAS_HEIGHT);

        // Draw some decorative trees (scaled positions)
        const menuTrees = [
            { x: CANVAS_WIDTH * 0.3, y: CANVAS_HEIGHT * 0.25 },
            { x: CANVAS_WIDTH * 0.7, y: CANVAS_HEIGHT * 0.33 },
            { x: CANVAS_WIDTH * 0.4, y: CANVAS_HEIGHT * 0.58 },
            { x: CANVAS_WIDTH * 0.6, y: CANVAS_HEIGHT * 0.75 }
        ];
        const treeScale = scaleFactor;
        for (let tree of menuTrees) {
            const size = 30 * treeScale;
            const treeHeight = size * 1.2;

            ctx.fillStyle = '#654321';
            ctx.fillRect(tree.x - 4 * treeScale, tree.y - 10 * treeScale, 8 * treeScale, 15 * treeScale);

            ctx.fillStyle = '#2d5016';
            ctx.beginPath();
            ctx.moveTo(tree.x, tree.y - treeHeight);
            ctx.lineTo(tree.x - size / 2, tree.y - 10 * treeScale);
            ctx.lineTo(tree.x + size / 2, tree.y - 10 * treeScale);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = '#333';
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('DOWNHILL SKIER', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.15);

        ctx.font = `${textSize}px Arial`;
        ctx.fillText('Ski down the mountain!', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.25);

        ctx.font = `bold ${subSize}px Arial`;
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText('Use arrows to steer', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.35);

        ctx.font = `bold ${subSize}px Arial`;
        ctx.fillStyle = '#2d5016';
        ctx.fillText('Choose mode below!', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.48);

        if (highScore > 0 || bestSlalomTime < 999) {
            ctx.font = `bold ${textSize}px Arial`;
            ctx.fillStyle = '#333';
            ctx.fillText('Best:', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.60);
            if (highScore > 0) {
                ctx.font = `${textSize * 0.9}px Arial`;
                ctx.fillText(`Downhill: ${highScore}m`, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.67);
            }
            if (bestSlalomTime < 999) {
                ctx.font = `${textSize * 0.9}px Arial`;
                ctx.fillText(`Slalom: ${bestSlalomTime.toFixed(1)}s`, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.74);
            }
        }
    }

    // Draw mode selection
    function drawModeSelect() {
        // Draw background slope
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(200, 0, 400, CANVAS_HEIGHT);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT MODE', CANVAS_WIDTH / 2, 80);

        // Downhill mode box
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(150, 150, 220, 180);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('DOWNHILL', 260, 195);
        ctx.font = '16px Arial';
        ctx.fillText('Pure speed!', 260, 225);
        ctx.fillText('Avoid obstacles', 260, 250);
        ctx.fillText('Go for distance', 260, 275);
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('CLICK HERE', 260, 310);

        // Slalom mode box
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(430, 150, 220, 180);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('SLALOM', 540, 195);
        ctx.font = '16px Arial';
        ctx.fillText('Pass the gates!', 540, 225);
        ctx.fillText('Time-based race', 540, 250);
        ctx.fillText('Avoid penalties', 540, 275);
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('CLICK HERE', 540, 310);

        // Instructions
        ctx.fillStyle = '#333';
        ctx.font = '18px Arial';
        ctx.fillText('Click a mode to begin your run!', CANVAS_WIDTH / 2, 400);

        // Best scores
        if (highScore > 0 || bestSlalomTime < 999) {
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#2d5016';
            ctx.fillText('Your Best Times:', CANVAS_WIDTH / 2, 470);
            ctx.font = '16px Arial';
            ctx.fillStyle = '#333';
            if (highScore > 0) {
                ctx.fillText(`Downhill: ${highScore}m`, CANVAS_WIDTH / 2 - 100, 500);
            }
            if (bestSlalomTime < 999) {
                ctx.fillText(`Slalom: ${bestSlalomTime.toFixed(1)}s`, CANVAS_WIDTH / 2 + 100, 500);
            }
        }
    }

    // Draw game over
    function drawGameOver() {
        const titleSize = Math.max(24, Math.min(48, CANVAS_WIDTH / 10));
        const textSize = Math.max(16, Math.min(32, CANVAS_WIDTH / 16));
        const smallSize = Math.max(14, Math.min(24, CANVAS_WIDTH / 20));
        const restartSize = Math.max(14, Math.min(28, CANVAS_WIDTH / 18));

        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#d63031';
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80 * scaleFactor);

        ctx.fillStyle = '#333';
        ctx.font = `${textSize}px Arial`;

        if (gameMode === 'downhill') {
            ctx.fillText(`Distance: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20 * scaleFactor);

            if (score > highScore) {
                ctx.fillStyle = '#00b894';
                ctx.font = `bold ${smallSize}px Arial`;
                ctx.fillText('NEW RECORD!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30 * scaleFactor);
            } else {
                ctx.fillStyle = '#333';
                ctx.font = `${smallSize}px Arial`;
                ctx.fillText(`Best: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30 * scaleFactor);
            }
        } else if (gameMode === 'slalom') {
            const finalTime = gameTime.toFixed(1);
            ctx.fillText(`Time: ${finalTime}s`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30 * scaleFactor);
            ctx.font = `${smallSize}px Arial`;
            ctx.fillText(`Gates: ${gatesPassed}/${totalGates}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 5 * scaleFactor);

            if (gatesPassed === totalGates && gameTime < bestSlalomTime) {
                ctx.fillStyle = '#00b894';
                ctx.font = `bold ${smallSize}px Arial`;
                ctx.fillText('NEW BEST!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50 * scaleFactor);
            } else if (bestSlalomTime < 999) {
                ctx.fillStyle = '#333';
                ctx.font = `${smallSize * 0.9}px Arial`;
                ctx.fillText(`Best: ${bestSlalomTime.toFixed(1)}s`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50 * scaleFactor);
            }
        }

        ctx.font = `bold ${restartSize}px Arial`;
        ctx.fillStyle = '#2d5016';
        ctx.fillText('TAP TO RESTART', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120 * scaleFactor);
    }

    // Game over
    function gameOver() {
        gameState = 'gameOver';

        if (gameMode === 'downhill') {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('downhillSkierHighScore', highScore.toString());
            }
        } else if (gameMode === 'slalom') {
            // Only count as best time if all gates were passed
            if (gatesPassed === totalGates && gameTime < bestSlalomTime) {
                bestSlalomTime = gameTime;
                localStorage.setItem('downhillSkierBestSlalom', bestSlalomTime.toFixed(1));
            }
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
    function handleClick(event) {
        if (gameState === 'gameOver') {
            // Show mode selection buttons again
            document.getElementById('modeButtons').style.display = 'flex';
            document.getElementById('gameInfo').style.display = 'none';
            document.getElementById('controlButtons').style.display = 'none';
            gameState = 'menu';
            draw();
        }
        // Menu state is handled by HTML buttons now
    }

    // Handle key presses
    function handleKeyDown(e) {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            e.preventDefault();
            keys[e.code] = true;
        }
    }

    function handleKeyUp(e) {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            e.preventDefault();
            keys[e.code] = false;
        }
    }

    // Touch control variables
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchMoving = false;

    // Handle touch start
    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        // Handle tap on canvas for game over screen
        if (gameState === 'gameOver') {
            e.preventDefault();
            handleClick();
        } else if (gameState === 'playing') {
            isTouchMoving = false;
        }
        // Menu state is handled by HTML buttons
    }

    // Handle touch move (for continuous swipe control)
    function handleTouchMove(e) {
        if (gameState !== 'playing') return;
        e.preventDefault();

        const touch = e.touches[0];
        const touchCurrentX = touch.clientX;
        const deltaX = touchCurrentX - touchStartX;

        // If swipe distance is significant, set direction
        if (Math.abs(deltaX) > 20) {
            isTouchMoving = true;
            if (deltaX < 0) {
                keys['ArrowLeft'] = true;
                keys['ArrowRight'] = false;
            } else {
                keys['ArrowRight'] = true;
                keys['ArrowLeft'] = false;
            }
        }
    }

    // Handle touch end
    function handleTouchEnd(e) {
        if (gameState === 'playing') {
            // Stop movement when touch ends
            keys['ArrowLeft'] = false;
            keys['ArrowRight'] = false;
            isTouchMoving = false;
        }
    }

    // Handle button press (for on-screen buttons)
    function handleButtonDown(direction) {
        if (gameState === 'playing') {
            keys[direction] = true;
        }
    }

    function handleButtonUp(direction) {
        if (gameState === 'playing') {
            keys[direction] = false;
        }
    }

    // Launch Downhill Skier
    window.launchDownhillSkier = function() {
        // Hide other sections
        if (typeof hideAllMenus === 'function') hideAllMenus();

        // Show fullscreen game section
        document.getElementById('downhillSkierGame').style.display = 'flex';

        // Show mode buttons, hide control buttons initially
        document.getElementById('skierModeButtons').style.display = 'flex';
        document.getElementById('skierControlButtons').style.display = 'none';

        // Double RAF for layout to settle
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Initialize canvas
                gameCanvas = document.getElementById('skierCanvas');
                ctx = gameCanvas.getContext('2d');

                // Resize canvas to fit wrapper
                resizeCanvas();

                gameState = 'menu';
                draw();

                // Event listeners
                document.addEventListener('keydown', handleKeyDown);
                document.addEventListener('keyup', handleKeyUp);
                window.addEventListener('resize', resizeCanvas);

                // Canvas click/touch for restart
                gameCanvas.addEventListener('click', handleClick);
                gameCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
                gameCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
                gameCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });

                // Setup HTML button controls
                setupHTMLControls();
            });
        });
    };

    // Setup HTML button controls
    function setupHTMLControls() {
        // Mode selection buttons
        const btnDownhill = document.getElementById('btnDownhill');
        const btnSlalom = document.getElementById('btnSlalom');

        if (btnDownhill) {
            btnDownhill.addEventListener('click', () => {
                gameMode = 'downhill';
                document.getElementById('skierModeButtons').style.display = 'none';
                document.getElementById('skierControlButtons').style.display = 'flex';
                initGame();
            });
        }

        if (btnSlalom) {
            btnSlalom.addEventListener('click', () => {
                gameMode = 'slalom';
                document.getElementById('skierModeButtons').style.display = 'none';
                document.getElementById('skierControlButtons').style.display = 'flex';
                initGame();
            });
        }

        // Helper to setup button with all event handlers
        function setupButton(id, keyName) {
            const btn = document.getElementById(id);
            if (!btn) return;

            btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonDown(keyName); }, { passive: false });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleButtonUp(keyName); }, { passive: false });
            btn.addEventListener('touchcancel', () => { handleButtonUp(keyName); });
            btn.addEventListener('mousedown', (e) => { e.preventDefault(); handleButtonDown(keyName); });
            btn.addEventListener('mouseup', () => { handleButtonUp(keyName); });
            btn.addEventListener('mouseleave', () => { handleButtonUp(keyName); });
        }

        // Setup direction buttons
        setupButton('btnSkiLeft', 'ArrowLeft');
        setupButton('btnSkiRight', 'ArrowRight');

        // NEW button handler
        const btnNew = document.getElementById('skierBtnNew');
        if (btnNew) {
            btnNew.addEventListener('click', () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                document.getElementById('skierModeButtons').style.display = 'flex';
                document.getElementById('skierControlButtons').style.display = 'none';
                gameState = 'menu';
                draw();
            });
        }
    }

    // Exit to menu
    window.exitDownhillSkierToMenu = function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('resize', resizeCanvas);

        if (gameCanvas) {
            gameCanvas.removeEventListener('touchstart', handleTouchStart);
            gameCanvas.removeEventListener('touchmove', handleTouchMove);
            gameCanvas.removeEventListener('touchend', handleTouchEnd);
        }

        document.getElementById('downhillSkierGame').style.display = 'none';
        document.getElementById('arcadeMenu').style.display = 'block';
    };
})();

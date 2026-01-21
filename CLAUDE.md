# Project: Road Trip Games

## Commit Guidelines
- ALWAYS add a version number to commit messages
- Version format: vX.Y.Z (e.g., v1.9.7)
- Increment versions as follows:
  - Patch (Z): Bug fixes, minor tweaks (v1.9.6 → v1.9.7)
  - Minor (Y): New features, improvements (v1.9.7 → v1.10.0)
  - Major (X): Breaking changes, major redesigns (v1.9.7 → v2.0.0)

## Update Notifications
- The app should display a toast message when updates are available
- Toast should be non-intrusive and user-friendly
- Users should be able to refresh/reload to get the latest version

## Important Files
- index.html: Main app shell (app layout, navigation, License Plate Game, shared utilities)
- games/*.js: Individual game files (battleship.js, connect4.js, minesweeper.js)
- sw.js: Service worker - handles caching and update notifications
- manifest.json: PWA manifest configuration

## File Structure
```
/road-trip-games/
  index.html          - App shell, navigation, License Plate Game, shared utilities
  sw.js              - Service worker for PWA caching
  manifest.json      - PWA configuration
  icon-192.svg       - App icon (192x192)
  icon-512.svg       - App icon (512x512)
  games/
    battleship.js    - Battleship game (pass-and-play & vs AI)
    connect4.js      - Connect 4 game (pass-and-play & vs AI)
    minesweeper.js   - Minesweeper game (3 difficulty levels)
```

## Development Workflow
1. Make changes to code (index.html or games/*.js)
2. Update VERSION in both index.html and sw.js
3. Commit with version number in message
4. Push to GitHub
5. PWA will detect update and notify users

## Local Development Server
- **Port**: 8000
- **Command**: Already running on localhost:8000
- **URL**: http://localhost:8000
- To restart: `lsof -ti:8000 | xargs kill` then `python3 -m http.server 8000`

## Testing Commands
- No specific test framework currently set up
- Manual testing in browser/PWA required
- Use hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) to clear cache

## Code Style
- Modular structure: index.html for app shell, games separated into individual JS files
- Each game wrapped in IIFE to avoid global scope pollution
- Games expose necessary functions to window object for HTML integration
- No external dependencies or frameworks
- Pure vanilla JavaScript, HTML, CSS
- Mobile-first design for road trip entertainment

## Features
- License plate tracking by state
- GPS-based facts and information
- Multiple games (Battleship, Connect 4, etc.)
- Works offline as a PWA
- Data stored in localStorage

## Deployment
- Hosted on GitHub Pages
- Updates deploy automatically on push to main branch
- Repository: https://github.com/lstrandt-hamburglibrary/road-trip-games

## Mobile Arcade Game Patterns

When improving arcade games for mobile, apply these consistent patterns:

### HTML Layout Structure
```html
<div id="gameSection" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; height: 100dvh; background: #000; z-index: 1000; flex-direction: column;">
    <!-- Top bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0.5rem; background: rgba(0,0,0,0.7); flex-shrink: 0;">
        <button onclick="exitGame()">← Back</button>
        <span>Game Title</span>
        <div><!-- stats: score, lives, etc --></div>
        <button onclick="showHelp()">?</button>
    </div>

    <!-- Canvas wrapper - fills remaining space -->
    <div id="canvasWrapper" style="flex: 1; min-height: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <canvas id="gameCanvas" style="display: block; touch-action: manipulation; -webkit-user-select: none; -webkit-touch-callout: none;"></canvas>
    </div>

    <!-- Control buttons at bottom -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; padding-bottom: max(1rem, env(safe-area-inset-bottom, 1rem)); flex-shrink: 0; background: rgba(0,0,0,0.5);">
        <!-- Left side: action buttons (FIRE, THRUST, LAUNCH, etc.) -->
        <!-- Center: NEW button -->
        <!-- Right side: direction buttons (◀ ▶) side by side -->
    </div>

    <!-- Help Modal -->
    <!-- Game Over overlay -->
</div>
```

### Control Button Layout
- **Left side**: Primary action buttons (FIRE, LAUNCH, THRUST, PAUSE) - stacked vertically if multiple
- **Center**: NEW/restart button (orange gradient)
- **Right side**: Direction buttons (◀ ▶) side by side - larger padding for easy touch

### Button Styling
```html
<!-- Action button -->
<button style="padding: 0.6rem 0.8rem; font-size: 0.75rem; font-weight: bold; background: linear-gradient(145deg, #22c55e, #16a34a); color: white; border: none; border-radius: 8px; touch-action: manipulation; -webkit-user-select: none; -webkit-touch-callout: none;">

<!-- Direction buttons (larger) -->
<button style="padding: 1.2rem 1.8rem; font-size: 1.6rem; font-weight: bold; background: linear-gradient(145deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 8px; touch-action: manipulation; -webkit-user-select: none; -webkit-touch-callout: none;">

<!-- NEW button -->
<button style="padding: 0.5rem 0.8rem; font-size: 0.7rem; font-weight: bold; background: linear-gradient(145deg, #f97316, #ea580c); color: white; border: none; border-radius: 8px;">
```

### JavaScript Patterns

#### Dynamic Canvas Sizing
```javascript
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
let scaleFactor = 1;

function resizeCanvas() {
    const wrapper = document.getElementById('canvasWrapper');
    if (!wrapper) return;

    let w = wrapper.clientWidth;
    let h = wrapper.clientHeight;

    // Fallback if wrapper not ready
    if (w === 0 || h === 0) {
        w = window.innerWidth;
        h = window.innerHeight - 120;
    }

    CANVAS_WIDTH = w;
    CANVAS_HEIGHT = h;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Scale factor for game elements
    scaleFactor = Math.min(CANVAS_WIDTH / 800, CANVAS_HEIGHT / 600);
}
```

#### Launch Function (double RAF for layout)
```javascript
window.launchGame = function() {
    hideAllMenus();
    document.getElementById('gameSection').style.display = 'flex';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initGame();
            setupControls();
        });
    });
};
```

#### Touch Button Event Handlers
```javascript
function setupControls() {
    const btn = document.getElementById('btnAction');
    if (btn) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); action = true; }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); action = false; }, { passive: false });
        btn.addEventListener('touchcancel', () => { action = false; });
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); action = true; });
        btn.addEventListener('mouseup', () => { action = false; });
        btn.addEventListener('mouseleave', () => { action = false; });
    }
}
```

#### Scaled Text Rendering
```javascript
const fontSize = Math.max(14, Math.min(22, CANVAS_WIDTH / 20));
ctx.font = `bold ${fontSize}px Arial`;
```

### Games Updated with Mobile Patterns
- [x] Asteroids (v1.139.0) - toggle fire, simple buttons, safe respawn
- [x] Breakout (v1.140.0) - dynamic sizing, LAUNCH/PAUSE/arrow buttons, bigger paddle
- [x] Caverns of Mars (v1.141.0) - FIRE/arrow buttons, scaled menus, HUD bars
- [x] Centipede (v1.142.0) - FIRE/D-pad buttons, dynamic sizing, scaled text
- [x] Downhill Skier (v1.143.0) - mode select/arrow buttons, dynamic sizing, scaled text

### Games Still Needing Mobile Update
- [ ] Frogger
- [ ] Snake
- [ ] Space Invaders
- [ ] Tetris
- [ ] Pac-Man (if exists)
- [ ] Other arcade games in games/ folder

// Connections Game - Group 16 words into 4 categories
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'connections-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .connections-game {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                padding-top: 3rem;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                box-sizing: border-box;
                overflow-x: hidden;
            }

            .connections-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .connections-header h2 {
                font-size: 1.8rem;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .connections-header p {
                color: rgba(255,255,255,0.7);
                margin: 0;
            }

            .connections-mistakes {
                text-align: center;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }

            .mistake-dot {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin: 0 3px;
                transition: all 0.3s ease;
            }

            .mistake-dot.active {
                background: #00ff88;
            }

            .mistake-dot.used {
                background: rgba(255,255,255,0.2);
            }

            .connections-solved {
                margin-bottom: 1rem;
            }

            .connections-category-solved {
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                text-align: center;
            }

            .category-name {
                font-weight: 700;
                font-size: 0.9rem;
                color: #1a1a2e;
            }

            .category-words {
                font-size: 0.85rem;
                color: #1a1a2e;
                margin-top: 0.25rem;
            }

            .connections-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .connections-word {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                color: white;
                padding: 0.6rem 0.25rem;
                border-radius: 8px;
                font-size: 0.65rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                word-break: break-word;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .connections-word:hover:not(:disabled) {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }

            .connections-word.selected {
                background: rgba(0, 217, 255, 0.3);
                border-color: #00d9ff;
            }

            .connections-word:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .connections-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .connections-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .connections-btn:hover:not(:disabled) {
                transform: translateY(-2px);
            }

            .connections-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .shuffle-btn {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .deselect-btn {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .submit-btn {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .new-game-btn {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
            }

            .connections-game-over {
                text-align: center;
                padding: 1rem;
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
            }

            .connections-game-over h3 {
                font-size: 1.5rem;
                margin: 0 0 1rem 0;
                color: #00ff88;
            }

            .connections-reveal {
                margin-bottom: 1rem;
            }

            .connections-reveal p {
                margin-bottom: 0.5rem;
                color: rgba(255,255,255,0.7);
            }

            .connections-toast {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                z-index: 1000;
                animation: fadeInOut 2s ease;
            }

            @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                10%, 90% { opacity: 1; }
            }

            .connections-back-btn {
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

            .connections-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .connections-game {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // Puzzle sets - each has 4 categories with 4 words each
    const PUZZLES = [
        {
            categories: [
                { name: "PLANETS", color: "#f9df6d", words: ["MERCURY", "VENUS", "MARS", "JUPITER"] },
                { name: "CARD GAMES", color: "#a0c35a", words: ["POKER", "BRIDGE", "HEARTS", "SPADES"] },
                { name: "QUEEN SONGS", color: "#b0c4ef", words: ["RADIO", "CHAMPION", "RHAPSODY", "PRESSURE"] },
                { name: "TYPES OF DANCE", color: "#ba81c5", words: ["SALSA", "SWING", "TAP", "BALLET"] }
            ]
        },
        {
            categories: [
                { name: "FRUITS", color: "#f9df6d", words: ["APPLE", "BANANA", "ORANGE", "GRAPE"] },
                { name: "TECH COMPANIES", color: "#a0c35a", words: ["AMAZON", "GOOGLE", "MICROSOFT", "NETFLIX"] },
                { name: "BODY PARTS", color: "#b0c4ef", words: ["HEAD", "SHOULDER", "KNEE", "ELBOW"] },
                { name: "WEATHER", color: "#ba81c5", words: ["THUNDER", "LIGHTNING", "TORNADO", "HURRICANE"] }
            ]
        },
        {
            categories: [
                { name: "PIZZA TOPPINGS", color: "#f9df6d", words: ["PEPPERONI", "MUSHROOM", "OLIVE", "SAUSAGE"] },
                { name: "MUSIC GENRES", color: "#a0c35a", words: ["ROCK", "JAZZ", "BLUES", "COUNTRY"] },
                { name: "DOG BREEDS", color: "#b0c4ef", words: ["POODLE", "BEAGLE", "BOXER", "HUSKY"] },
                { name: "COFFEE DRINKS", color: "#ba81c5", words: ["LATTE", "MOCHA", "ESPRESSO", "CAPPUCCINO"] }
            ]
        },
        {
            categories: [
                { name: "BREAKFAST FOODS", color: "#f9df6d", words: ["PANCAKE", "WAFFLE", "OMELET", "BACON"] },
                { name: "GREEK GODS", color: "#a0c35a", words: ["ZEUS", "APOLLO", "ATHENA", "HERMES"] },
                { name: "BOARD GAMES", color: "#b0c4ef", words: ["MONOPOLY", "SCRABBLE", "CLUE", "RISK"] },
                { name: "CAR BRANDS", color: "#ba81c5", words: ["TOYOTA", "HONDA", "FORD", "TESLA"] }
            ]
        },
        {
            categories: [
                { name: "TYPES OF PASTA", color: "#f9df6d", words: ["SPAGHETTI", "PENNE", "RAVIOLI", "LINGUINE"] },
                { name: "MARVEL HEROES", color: "#a0c35a", words: ["SPIDER-MAN", "IRON MAN", "THOR", "HULK"] },
                { name: "TREES", color: "#b0c4ef", words: ["OAK", "MAPLE", "PINE", "BIRCH"] },
                { name: "SHOE TYPES", color: "#ba81c5", words: ["SNEAKER", "SANDAL", "BOOT", "LOAFER"] }
            ]
        },
        {
            categories: [
                { name: "US STATES", color: "#f9df6d", words: ["TEXAS", "FLORIDA", "CALIFORNIA", "ALASKA"] },
                { name: "DISNEY MOVIES", color: "#a0c35a", words: ["FROZEN", "MOANA", "TANGLED", "ENCANTO"] },
                { name: "VEGETABLES", color: "#b0c4ef", words: ["CARROT", "BROCCOLI", "SPINACH", "CELERY"] },
                { name: "TOOLS", color: "#ba81c5", words: ["HAMMER", "WRENCH", "SCREWDRIVER", "PLIERS"] }
            ]
        },
        {
            categories: [
                { name: "OCEAN CREATURES", color: "#f9df6d", words: ["SHARK", "DOLPHIN", "WHALE", "OCTOPUS"] },
                { name: "BEATLES SONGS", color: "#a0c35a", words: ["YESTERDAY", "HELP", "IMAGINE", "REVOLUTION"] },
                { name: "SPORTS", color: "#b0c4ef", words: ["TENNIS", "GOLF", "SOCCER", "HOCKEY"] },
                { name: "ICE CREAM FLAVORS", color: "#ba81c5", words: ["VANILLA", "CHOCOLATE", "STRAWBERRY", "MINT"] }
            ]
        },
        {
            categories: [
                { name: "METALS", color: "#f9df6d", words: ["GOLD", "SILVER", "COPPER", "BRONZE"] },
                { name: "HARRY POTTER", color: "#a0c35a", words: ["HOGWARTS", "QUIDDITCH", "VOLDEMORT", "DUMBLEDORE"] },
                { name: "KITCHEN ITEMS", color: "#b0c4ef", words: ["SPATULA", "WHISK", "LADLE", "TONGS"] },
                { name: "EMOTIONS", color: "#ba81c5", words: ["HAPPY", "ANGRY", "SCARED", "EXCITED"] }
            ]
        },
        {
            categories: [
                { name: "BIRDS", color: "#f9df6d", words: ["EAGLE", "SPARROW", "ROBIN", "CARDINAL"] },
                { name: "SEINFELD CHARACTERS", color: "#a0c35a", words: ["JERRY", "GEORGE", "ELAINE", "KRAMER"] },
                { name: "DESSERTS", color: "#b0c4ef", words: ["CAKE", "PIE", "COOKIE", "BROWNIE"] },
                { name: "MONTHS", color: "#ba81c5", words: ["JANUARY", "MARCH", "AUGUST", "DECEMBER"] }
            ]
        },
        {
            categories: [
                { name: "CURRENCIES", color: "#f9df6d", words: ["DOLLAR", "EURO", "POUND", "YEN"] },
                { name: "STAR WARS", color: "#a0c35a", words: ["YODA", "VADER", "SKYWALKER", "CHEWBACCA"] },
                { name: "FLOWERS", color: "#b0c4ef", words: ["ROSE", "TULIP", "DAISY", "LILY"] },
                { name: "INSTRUMENTS", color: "#ba81c5", words: ["PIANO", "GUITAR", "VIOLIN", "DRUMS"] }
            ]
        },
        {
            categories: [
                { name: "FAST FOOD CHAINS", color: "#f9df6d", words: ["MCDONALDS", "WENDYS", "SUBWAY", "CHIPOTLE"] },
                { name: "ZODIAC SIGNS", color: "#a0c35a", words: ["ARIES", "LEO", "SCORPIO", "PISCES"] },
                { name: "COLORS", color: "#b0c4ef", words: ["CRIMSON", "TURQUOISE", "MAGENTA", "INDIGO"] },
                { name: "PERIODIC ELEMENTS", color: "#ba81c5", words: ["OXYGEN", "NITROGEN", "HELIUM", "CARBON"] }
            ]
        },
        {
            categories: [
                { name: "CHEESE TYPES", color: "#f9df6d", words: ["CHEDDAR", "BRIE", "GOUDA", "PARMESAN"] },
                { name: "FRIENDS CHARACTERS", color: "#a0c35a", words: ["RACHEL", "MONICA", "PHOEBE", "CHANDLER"] },
                { name: "GEMSTONES", color: "#b0c4ef", words: ["RUBY", "EMERALD", "SAPPHIRE", "DIAMOND"] },
                { name: "OLYMPICS SPORTS", color: "#ba81c5", words: ["SWIMMING", "GYMNASTICS", "ARCHERY", "FENCING"] }
            ]
        },
        {
            categories: [
                { name: "SOUPS", color: "#f9df6d", words: ["TOMATO", "CHICKEN", "MINESTRONE", "CHOWDER"] },
                { name: "LORD OF THE RINGS", color: "#a0c35a", words: ["FRODO", "GANDALF", "ARAGORN", "LEGOLAS"] },
                { name: "FURNITURE", color: "#b0c4ef", words: ["COUCH", "DRESSER", "OTTOMAN", "BOOKSHELF"] },
                { name: "HALLOWEEN", color: "#ba81c5", words: ["WITCH", "GHOST", "VAMPIRE", "ZOMBIE"] }
            ]
        },
        {
            categories: [
                { name: "SODA BRANDS", color: "#f9df6d", words: ["PEPSI", "SPRITE", "FANTA", "CRUSH"] },
                { name: "SIMPSONS CHARACTERS", color: "#a0c35a", words: ["HOMER", "MARGE", "BART", "LISA"] },
                { name: "DANCES", color: "#b0c4ef", words: ["WALTZ", "TANGO", "FOXTROT", "RUMBA"] },
                { name: "CAMPING GEAR", color: "#ba81c5", words: ["TENT", "LANTERN", "COMPASS", "CANTEEN"] }
            ]
        },
        {
            categories: [
                { name: "SANDWICH TYPES", color: "#f9df6d", words: ["BLT", "REUBEN", "CLUB", "GRILLED"] },
                { name: "OFFICE CHARACTERS", color: "#a0c35a", words: ["MICHAEL", "DWIGHT", "JIM", "PAM"] },
                { name: "BABY ANIMALS", color: "#b0c4ef", words: ["PUPPY", "KITTEN", "CALF", "FOAL"] },
                { name: "ELEMENTS OF ART", color: "#ba81c5", words: ["LINE", "SHAPE", "TEXTURE", "SPACE"] }
            ]
        },
        // TRICKY PUZZLES WITH OVERLAPPING WORDS AND WORDPLAY
        {
            categories: [
                { name: "CANDY BARS", color: "#f9df6d", words: ["MILKY WAY", "SNICKERS", "TWIX", "PAYDAY"] },
                { name: "ROMAN GODS (ALSO PLANETS!)", color: "#a0c35a", words: ["JUPITER", "MARS", "VENUS", "NEPTUNE"] },
                { name: "LUXURY CAR BRANDS", color: "#b0c4ef", words: ["JAGUAR", "LINCOLN", "INFINITI", "LEXUS"] },
                { name: "___ WARS", color: "#ba81c5", words: ["STAR", "CLONE", "CIVIL", "STORAGE"] }
            ]
        },
        {
            categories: [
                { name: "CITRUS FRUITS", color: "#f9df6d", words: ["LEMON", "LIME", "ORANGE", "GRAPEFRUIT"] },
                { name: "ALSO TECH COMPANIES", color: "#a0c35a", words: ["APPLE", "AMAZON", "BLACKBERRY", "ORACLE"] },
                { name: "US STATE CAPITALS", color: "#b0c4ef", words: ["PHOENIX", "DENVER", "AUSTIN", "ATLANTA"] },
                { name: "___ LIGHT", color: "#ba81c5", words: ["FLASH", "MOON", "DAY", "HIGH"] }
            ]
        },
        {
            categories: [
                { name: "POKER TERMS", color: "#f9df6d", words: ["FOLD", "RAISE", "BLUFF", "CALL"] },
                { name: "WEATHER PHENOMENA", color: "#a0c35a", words: ["FOG", "HAIL", "SLEET", "DRIZZLE"] },
                { name: "THINGS AT A WEDDING", color: "#b0c4ef", words: ["BRIDE", "GROOM", "VEIL", "BOUQUET"] },
                { name: "___ BLUE", color: "#ba81c5", words: ["BABY", "SKY", "NAVY", "FEELING"] }
            ]
        },
        {
            categories: [
                { name: "DANCE MOVES", color: "#f9df6d", words: ["TWIST", "SHUFFLE", "SLIDE", "SPIN"] },
                { name: "PARTS OF A BOOK", color: "#a0c35a", words: ["SPINE", "COVER", "INDEX", "CHAPTER"] },
                { name: "POOL TABLE ITEMS", color: "#b0c4ef", words: ["CUE", "CHALK", "POCKET", "RACK"] },
                { name: "ANIMALS = CAR MODELS", color: "#ba81c5", words: ["MUSTANG", "BEETLE", "IMPALA", "PINTO"] }
            ]
        },
        {
            categories: [
                { name: "BREAKFAST ITEMS", color: "#f9df6d", words: ["TOAST", "CEREAL", "JUICE", "YOGURT"] },
                { name: "SOCIAL MEDIA", color: "#a0c35a", words: ["TWITTER", "INSTAGRAM", "SNAPCHAT", "TIKTOK"] },
                { name: "TYPES OF JACKETS", color: "#b0c4ef", words: ["BLAZER", "PARKA", "WINDBREAKER", "BOMBER"] },
                { name: "CONTAIN \"CAT\"", color: "#ba81c5", words: ["SCATTER", "LOCATE", "EDUCATION", "VACATION"] }
            ]
        },
        {
            categories: [
                { name: "FARM ANIMALS", color: "#f9df6d", words: ["COW", "PIG", "CHICKEN", "SHEEP"] },
                { name: "STRING INSTRUMENTS", color: "#a0c35a", words: ["GUITAR", "VIOLIN", "CELLO", "BANJO"] },
                { name: "KITCHEN APPLIANCES", color: "#b0c4ef", words: ["BLENDER", "TOASTER", "MICROWAVE", "DISHWASHER"] },
                { name: "___ HOUSE", color: "#ba81c5", words: ["WHITE", "FULL", "OPERA", "GREEN"] }
            ]
        },
        {
            categories: [
                { name: "THINGS WITH KEYS", color: "#f9df6d", words: ["PIANO", "KEYBOARD", "LOCK", "MAP"] },
                { name: "SCHOOL THINGS", color: "#a0c35a", words: ["DESK", "LOCKER", "CAFETERIA", "PRINCIPAL"] },
                { name: "FILM GENRES", color: "#b0c4ef", words: ["HORROR", "COMEDY", "DRAMA", "THRILLER"] },
                { name: "HOT ___", color: "#ba81c5", words: ["DOG", "SHOT", "TUB", "HEAD"] }
            ]
        },
        {
            categories: [
                { name: "TRACK & FIELD EVENTS", color: "#f9df6d", words: ["JAVELIN", "DISCUS", "HURDLES", "RELAY"] },
                { name: "ROCK BANDS (ALSO WORDS!)", color: "#a0c35a", words: ["QUEEN", "RUSH", "KISS", "HEART"] },
                { name: "CARD GAME TERMS", color: "#b0c4ef", words: ["TRUMP", "DEALER", "WILD", "ANTE"] },
                { name: "___ BALL", color: "#ba81c5", words: ["BASKET", "BASE", "FOOT", "CRYSTAL"] }
            ]
        },
        {
            categories: [
                { name: "SHADES OF RED", color: "#f9df6d", words: ["CRIMSON", "SCARLET", "MAROON", "BURGUNDY"] },
                { name: "IVY LEAGUE SCHOOLS", color: "#a0c35a", words: ["HARVARD", "YALE", "PRINCETON", "CORNELL"] },
                { name: "SODA BRANDS", color: "#b0c4ef", words: ["PEPSI", "COKE", "SPRITE", "FANTA"] },
                { name: "GOLDEN ___", color: "#ba81c5", words: ["GATE", "RETRIEVER", "GLOBE", "RULE"] }
            ]
        },
        {
            categories: [
                { name: "CHESS PIECES", color: "#f9df6d", words: ["KNIGHT", "BISHOP", "ROOK", "PAWN"] },
                { name: "SHAKESPEARE PLAYS", color: "#a0c35a", words: ["HAMLET", "OTHELLO", "MACBETH", "TEMPEST"] },
                { name: "TYPES OF BREAD", color: "#b0c4ef", words: ["SOURDOUGH", "BRIOCHE", "FOCACCIA", "CIABATTA"] },
                { name: "___ KING", color: "#ba81c5", words: ["BURGER", "LION", "STEPHEN", "DRAG"] }
            ]
        },
        {
            categories: [
                { name: "PARTS OF A TREE", color: "#f9df6d", words: ["TRUNK", "BRANCH", "ROOT", "BARK"] },
                { name: "THINGS IN A WALLET", color: "#a0c35a", words: ["CASH", "LICENSE", "RECEIPT", "CREDIT"] },
                { name: "GYMNASTICS MOVES", color: "#b0c4ef", words: ["FLIP", "TUMBLE", "VAULT", "SPLIT"] },
                { name: "WORDS BEFORE \"PRINT\"", color: "#ba81c5", words: ["BLUE", "FINE", "FINGER", "FOOT"] }
            ]
        },
        {
            categories: [
                { name: "THINGS THAT DRIP", color: "#f9df6d", words: ["FAUCET", "CANDLE", "NOSE", "ICICLE"] },
                { name: "UNITS OF TIME", color: "#a0c35a", words: ["SECOND", "MINUTE", "HOUR", "DECADE"] },
                { name: "NYC BOROUGHS", color: "#b0c4ef", words: ["BRONX", "QUEENS", "BROOKLYN", "MANHATTAN"] },
                { name: "DOUBLE ___", color: "#ba81c5", words: ["DUTCH", "DOWN", "TAKE", "AGENT"] }
            ]
        },
        {
            categories: [
                { name: "CAMPING EQUIPMENT", color: "#f9df6d", words: ["TENT", "SLEEPING BAG", "FLASHLIGHT", "COOLER"] },
                { name: "TYPES OF TESTS", color: "#a0c35a", words: ["BLOOD", "DRIVING", "PREGNANCY", "STRESS"] },
                { name: "WAYS TO COOK EGGS", color: "#b0c4ef", words: ["SCRAMBLED", "POACHED", "FRIED", "BOILED"] },
                { name: "WORDS AFTER \"BREAK\"", color: "#ba81c5", words: ["FAST", "THROUGH", "DOWN", "DANCE"] }
            ]
        },
        {
            categories: [
                { name: "THINGS WITH STRINGS", color: "#f9df6d", words: ["KITE", "PUPPET", "GUITAR", "BALLOON"] },
                { name: "AWARDS SHOWS", color: "#a0c35a", words: ["OSCAR", "GRAMMY", "EMMY", "TONY"] },
                { name: "PHONE PARTS", color: "#b0c4ef", words: ["SCREEN", "BATTERY", "SPEAKER", "CAMERA"] },
                { name: "ALSO MEN'S NAMES", color: "#ba81c5", words: ["JACK", "BILL", "BOB", "JOHN"] }
            ]
        },
        {
            categories: [
                { name: "PIZZA CHAIN RESTAURANTS", color: "#f9df6d", words: ["DOMINOS", "PAPA JOHNS", "PIZZA HUT", "LITTLE CAESARS"] },
                { name: "PARTS OF AN AIRPLANE", color: "#a0c35a", words: ["WING", "COCKPIT", "TAIL", "FUSELAGE"] },
                { name: "THINGS THAT BLOOM", color: "#b0c4ef", words: ["FLOWER", "ROMANCE", "ALGAE", "TALENT"] },
                { name: "SILENT LETTERS", color: "#ba81c5", words: ["KNIGHT", "PSALM", "GNOME", "WRECK"] }
            ]
        },
        {
            categories: [
                { name: "BASKETBALL POSITIONS", color: "#f9df6d", words: ["POINT", "SHOOTING", "CENTER", "FORWARD"] },
                { name: "TOOTH TYPES", color: "#a0c35a", words: ["MOLAR", "CANINE", "INCISOR", "WISDOM"] },
                { name: "DISNEY PRINCESSES", color: "#b0c4ef", words: ["ARIEL", "BELLE", "JASMINE", "MULAN"] },
                { name: "WORDS BEFORE \"RUNNER\"", color: "#ba81c5", words: ["BLADE", "FRONT", "ROAD", "GUN"] }
            ]
        },
        {
            categories: [
                { name: "THINGS IN A FIRST AID KIT", color: "#f9df6d", words: ["BANDAGE", "GAUZE", "TAPE", "SCISSORS"] },
                { name: "TYPES OF MARKETS", color: "#a0c35a", words: ["STOCK", "FLEA", "SUPER", "BLACK"] },
                { name: "POKER HAND RANKINGS", color: "#b0c4ef", words: ["FLUSH", "STRAIGHT", "PAIR", "FULL HOUSE"] },
                { name: "WORDS AFTER \"FIRE\"", color: "#ba81c5", words: ["TRUCK", "FLY", "PLACE", "WORKS"] }
            ]
        }
    ];

    let currentPuzzle = null;
    let selectedWords = [];
    let solvedCategories = [];
    let mistakes = 0;
    let gameOver = false;
    const MAX_MISTAKES = 4;

    function init() {
        startNewGame();
    }

    function startNewGame() {
        // Pick a random puzzle
        currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        selectedWords = [];
        solvedCategories = [];
        mistakes = 0;
        gameOver = false;
        render();
    }

    function render() {
        const container = document.getElementById('connections-container');
        if (!container) return;

        // Get all unsolved words
        const solvedWords = new Set(solvedCategories.flatMap(c => c.words));
        const remainingWords = currentPuzzle.categories
            .flatMap(c => c.words)
            .filter(w => !solvedWords.has(w));

        // Shuffle remaining words (but keep consistent during game)
        if (!currentPuzzle.shuffledRemaining || currentPuzzle.shuffledRemaining.length !== remainingWords.length) {
            currentPuzzle.shuffledRemaining = shuffleArray([...remainingWords]);
        }

        container.innerHTML = `
            <div class="connections-game">
                <button class="connections-back-btn" onclick="exitConnections()">← Back</button>
                <div class="connections-header">
                    <h2>Connections</h2>
                    <p>Find four groups of four related words</p>
                </div>

                <div class="connections-mistakes">
                    Mistakes remaining: ${renderMistakeDots()}
                </div>

                <div class="connections-solved">
                    ${solvedCategories.map(cat => `
                        <div class="connections-category-solved" style="background-color: ${cat.color}">
                            <div class="category-name">${cat.name}</div>
                            <div class="category-words">${cat.words.join(', ')}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="connections-grid">
                    ${currentPuzzle.shuffledRemaining.map(word => `
                        <button class="connections-word ${selectedWords.includes(word) ? 'selected' : ''}"
                                onclick="window.ConnectionsGame.toggleWord('${word}')"
                                ${gameOver ? 'disabled' : ''}>
                            ${word}
                        </button>
                    `).join('')}
                </div>

                <div class="connections-actions">
                    <button class="connections-btn shuffle-btn" onclick="window.ConnectionsGame.shuffle()" ${gameOver ? 'disabled' : ''}>
                        Shuffle
                    </button>
                    <button class="connections-btn deselect-btn" onclick="window.ConnectionsGame.deselectAll()" ${gameOver || selectedWords.length === 0 ? 'disabled' : ''}>
                        Deselect All
                    </button>
                    <button class="connections-btn submit-btn" onclick="window.ConnectionsGame.submit()" ${gameOver || selectedWords.length !== 4 ? 'disabled' : ''}>
                        Submit
                    </button>
                </div>

                ${gameOver ? `
                    <div class="connections-game-over">
                        <h3>${solvedCategories.length === 4 ? 'You Won!' : 'Game Over'}</h3>
                        ${solvedCategories.length < 4 ? `
                            <div class="connections-reveal">
                                <p>The remaining categories were:</p>
                                ${currentPuzzle.categories
                                    .filter(c => !solvedCategories.find(s => s.name === c.name))
                                    .map(cat => `
                                        <div class="connections-category-solved" style="background-color: ${cat.color}">
                                            <div class="category-name">${cat.name}</div>
                                            <div class="category-words">${cat.words.join(', ')}</div>
                                        </div>
                                    `).join('')}
                            </div>
                        ` : ''}
                        <button class="connections-btn new-game-btn" onclick="window.ConnectionsGame.newGame()">
                            Play Again
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderMistakeDots() {
        const remaining = MAX_MISTAKES - mistakes;
        return Array(MAX_MISTAKES).fill(0).map((_, i) =>
            `<span class="mistake-dot ${i < remaining ? 'active' : 'used'}"></span>`
        ).join('');
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function toggleWord(word) {
        if (gameOver) return;

        if (selectedWords.includes(word)) {
            selectedWords = selectedWords.filter(w => w !== word);
        } else if (selectedWords.length < 4) {
            selectedWords.push(word);
        }
        render();
    }

    function deselectAll() {
        selectedWords = [];
        render();
    }

    function shuffle() {
        const solvedWords = new Set(solvedCategories.flatMap(c => c.words));
        const remainingWords = currentPuzzle.categories
            .flatMap(c => c.words)
            .filter(w => !solvedWords.has(w));
        currentPuzzle.shuffledRemaining = shuffleArray(remainingWords);
        render();
    }

    function submit() {
        if (selectedWords.length !== 4 || gameOver) return;

        // Check if selected words match any category
        const matchedCategory = currentPuzzle.categories.find(cat => {
            const catWords = new Set(cat.words);
            return selectedWords.every(w => catWords.has(w)) && selectedWords.length === cat.words.length;
        });

        if (matchedCategory) {
            // Correct!
            solvedCategories.push(matchedCategory);
            selectedWords = [];

            // Update shuffled remaining
            const solvedWords = new Set(solvedCategories.flatMap(c => c.words));
            currentPuzzle.shuffledRemaining = currentPuzzle.shuffledRemaining.filter(w => !solvedWords.has(w));

            if (solvedCategories.length === 4) {
                gameOver = true;
            }
        } else {
            // Check if 3 out of 4 are correct (one away)
            let oneAway = false;
            for (const cat of currentPuzzle.categories) {
                if (solvedCategories.find(s => s.name === cat.name)) continue;
                const matches = selectedWords.filter(w => cat.words.includes(w));
                if (matches.length === 3) {
                    oneAway = true;
                    break;
                }
            }

            if (oneAway) {
                showToast("One away!");
            }

            mistakes++;
            if (mistakes >= MAX_MISTAKES) {
                gameOver = true;
            }
        }

        render();
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'connections-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function newGame() {
        startNewGame();
    }

    // Expose functions to window
    window.ConnectionsGame = {
        init,
        toggleWord,
        deselectAll,
        shuffle,
        submit,
        newGame
    };

    window.launchConnections = function() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('connectionsGame').style.display = 'block';
        init();
    };

    window.exitConnections = function() {
        document.getElementById('connectionsGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    };
})();

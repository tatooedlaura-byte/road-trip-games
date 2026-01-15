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
            // TRAP: MARS/VENUS/MERCURY are planets BUT also candy/razor/element
            // TRAP: HEARTS/SPADES/CLUBS/DIAMONDS are card suits AND games
            categories: [
                { name: "PLANETS (NOT CANDY!)", color: "#f9df6d", words: ["EARTH", "SATURN", "NEPTUNE", "URANUS"] },
                { name: "CANDY BARS (SPACE NAMES)", color: "#a0c35a", words: ["MARS", "MILKY WAY", "STARBURST", "ORBIT"] },
                { name: "CARD SUITS", color: "#b0c4ef", words: ["HEARTS", "SPADES", "CLUBS", "DIAMONDS"] },
                { name: "___ QUEEN", color: "#ba81c5", words: ["DAIRY", "DRAG", "BEAUTY", "PROM"] }
            ]
        },
        {
            // TRAP: APPLE/BLACKBERRY are fruits AND tech, AMAZON is tech AND river
            // TRAP: ORANGE is fruit AND color
            categories: [
                { name: "FRUITS (ALSO TECH!)", color: "#f9df6d", words: ["APPLE", "BLACKBERRY", "ORANGE", "LIME"] },
                { name: "TECH (ALSO OTHER THINGS)", color: "#a0c35a", words: ["AMAZON", "GOOGLE", "ORACLE", "UBER"] },
                { name: "COLORS (ALSO FRUITS!)", color: "#b0c4ef", words: ["PEACH", "PLUM", "CHERRY", "LEMON"] },
                { name: "RIVERS", color: "#ba81c5", words: ["NILE", "THAMES", "SEINE", "DANUBE"] }
            ]
        },
        {
            // TRAP: MUSHROOM/OLIVE are pizza toppings AND other things
            // TRAP: ROCK/COUNTRY/BLUES/JAZZ are music AND other meanings
            categories: [
                { name: "PIZZA TOPPINGS", color: "#f9df6d", words: ["PEPPERONI", "MUSHROOM", "ANCHOVY", "SAUSAGE"] },
                { name: "MUSIC (ALSO FEELINGS)", color: "#a0c35a", words: ["ROCK", "SOUL", "BLUES", "FUNK"] },
                { name: "THINGS THAT SWING", color: "#b0c4ef", words: ["BAT", "PENDULUM", "MOOD", "DOOR"] },
                { name: "___ DOG", color: "#ba81c5", words: ["HOT", "TOP", "PRAIRIE", "CORN"] }
            ]
        },
        {
            // TRAP: APOLLO is Greek god AND space mission
            // TRAP: NIKE is Greek goddess AND shoe brand
            categories: [
                { name: "GREEK GODS (ALSO BRANDS)", color: "#f9df6d", words: ["NIKE", "AMAZON", "ATLAS", "HERMES"] },
                { name: "SPACE MISSIONS", color: "#a0c35a", words: ["APOLLO", "GEMINI", "MERCURY", "VOYAGER"] },
                { name: "BREAKFAST FOODS", color: "#b0c4ef", words: ["PANCAKE", "WAFFLE", "OMELET", "TOAST"] },
                { name: "RISK ___", color: "#ba81c5", words: ["TAKER", "FACTOR", "MANAGEMENT", "AVERSE"] }
            ]
        },
        {
            // TRAP: OAK/MAPLE/PINE are trees AND types of furniture/flooring
            // TRAP: PUMA is animal AND shoe brand like PENNE sounds like PENNY
            categories: [
                { name: "TREES (ALSO FLOORING)", color: "#f9df6d", words: ["OAK", "MAPLE", "CHERRY", "WALNUT"] },
                { name: "SHOE BRANDS (ANIMALS)", color: "#a0c35a", words: ["PUMA", "JAGUAR", "MUSTANG", "COUGAR"] },
                { name: "MARVEL HEROES", color: "#b0c4ef", words: ["THOR", "HULK", "VISION", "HAWKEYE"] },
                { name: "___ TREE", color: "#ba81c5", words: ["FAMILY", "PALM", "SHOE", "DECISION"] }
            ]
        },
        {
            // TRAP: GEORGIA/CAROLINA/VIRGINIA are states AND names
            // TRAP: FROZEN/TANGLED could be states of being
            categories: [
                { name: "STATES (ALSO NAMES)", color: "#f9df6d", words: ["GEORGIA", "CAROLINA", "VIRGINIA", "MONTANA"] },
                { name: "DISNEY MOVIES", color: "#a0c35a", words: ["FROZEN", "MOANA", "TANGLED", "BRAVE"] },
                { name: "HAIR CONDITIONS", color: "#b0c4ef", words: ["CURLY", "STRAIGHT", "WAVY", "FRIZZY"] },
                { name: "___ STATE", color: "#ba81c5", words: ["SOLID", "GOLDEN", "POLICE", "DREAM"] }
            ]
        },
        {
            // TRAP: SHARK/DOLPHIN are ocean creatures AND NFL teams
            // TRAP: Help/Yesterday/Revolution could be common words
            categories: [
                { name: "OCEAN (NFL TEAMS TOO)", color: "#f9df6d", words: ["SHARK", "DOLPHIN", "WHALE", "SEAL"] },
                { name: "BEATLES SONGS", color: "#a0c35a", words: ["YESTERDAY", "HELP", "REVOLUTION", "MICHELLE"] },
                { name: "COMMON WORDS (ALSO SONGS)", color: "#b0c4ef", words: ["FAITH", "RESPECT", "IMAGINE", "BELIEVE"] },
                { name: "___ TANK", color: "#ba81c5", words: ["THINK", "FISH", "GAS", "SEPTIC"] }
            ]
        },
        {
            // TRAP: GOLD/SILVER/BRONZE are metals AND Olympic medals AND colors
            // TRAP: HAPPY could be dwarf name or emotion
            categories: [
                { name: "OLYMPIC MEDALS", color: "#f9df6d", words: ["GOLD", "SILVER", "BRONZE", "PLATINUM"] },
                { name: "SNOW WHITE DWARFS", color: "#a0c35a", words: ["HAPPY", "GRUMPY", "SLEEPY", "DOPEY"] },
                { name: "HARRY POTTER", color: "#b0c4ef", words: ["HOGWARTS", "QUIDDITCH", "SNAPE", "HAGRID"] },
                { name: "___ SILENCE", color: "#ba81c5", words: ["RADIO", "GOLDEN", "AWKWARD", "DEAFENING"] }
            ]
        },
        {
            // TRAP: CARDINAL/ROBIN are birds AND baseball teams AND names
            // TRAP: MARCH/MAY are months AND verbs/names
            categories: [
                { name: "BIRDS (ALSO TEAMS)", color: "#f9df6d", words: ["CARDINAL", "ORIOLE", "BLUE JAY", "ROBIN"] },
                { name: "MONTHS (ALSO VERBS)", color: "#a0c35a", words: ["MARCH", "MAY", "AUGUST", "SPRING"] },
                { name: "DESSERTS", color: "#b0c4ef", words: ["CAKE", "PIE", "BROWNIE", "SUNDAE"] },
                { name: "FIRST NAMES", color: "#ba81c5", words: ["APRIL", "JUNE", "AUTUMN", "SUMMER"] }
            ]
        },
        {
            // TRAP: ROSE/LILY/DAISY/VIOLET are flowers AND names
            // TRAP: POUND could be currency or verb
            categories: [
                { name: "CURRENCIES", color: "#f9df6d", words: ["DOLLAR", "EURO", "PESO", "FRANC"] },
                { name: "FLOWERS (ALSO NAMES)", color: "#a0c35a", words: ["ROSE", "LILY", "DAISY", "VIOLET"] },
                { name: "VERBS (ALSO NOUNS)", color: "#b0c4ef", words: ["POUND", "MARK", "BILL", "BUCK"] },
                { name: "___ WARS", color: "#ba81c5", words: ["STAR", "CLONE", "BRIDE", "TURF"] }
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
        // === CROSSOVER TRAP PUZZLES - Words fit multiple categories! ===
        {
            // TRAP: CARDINAL/RAVEN/FALCON are birds AND NFL teams
            // TRAP: BRONCO/JAGUAR/MUSTANG are animals AND cars
            categories: [
                { name: "NFL TEAMS (ANIMALS)", color: "#f9df6d", words: ["CARDINAL", "RAVEN", "FALCON", "DOLPHIN"] },
                { name: "CAR MODELS (ANIMALS)", color: "#a0c35a", words: ["BRONCO", "JAGUAR", "MUSTANG", "BEETLE"] },
                { name: "BIRDS THAT AREN'T NFL TEAMS", color: "#b0c4ef", words: ["SPARROW", "ROBIN", "CROW", "PIGEON"] },
                { name: "___ FLY", color: "#ba81c5", words: ["BUTTER", "BAR", "FIRE", "HORSE"] }
            ]
        },
        {
            // TRAP: MARS/JUPITER/SATURN are planets AND Roman gods AND candy/cereals
            // TRAP: MILKY WAY/GALAXY are space terms AND candy
            categories: [
                { name: "CANDY BARS (SPACE WORDS)", color: "#f9df6d", words: ["MARS", "MILKY WAY", "STARBURST", "GALAXY"] },
                { name: "ACTUAL PLANETS", color: "#a0c35a", words: ["JUPITER", "SATURN", "NEPTUNE", "URANUS"] },
                { name: "GREEK LETTERS", color: "#b0c4ef", words: ["ALPHA", "BETA", "DELTA", "OMEGA"] },
                { name: "___ BAR", color: "#ba81c5", words: ["CANDY", "SALAD", "CROW", "HANDLE"] }
            ]
        },
        {
            // TRAP: AMAZON/APPLE/BLACKBERRY are tech AND other things
            // TRAP: DELTA is airline, Greek letter, AND river mouth
            categories: [
                { name: "TECH GIANTS (OTHER MEANINGS)", color: "#f9df6d", words: ["AMAZON", "APPLE", "ORACLE", "SHELL"] },
                { name: "MAJOR RIVERS", color: "#a0c35a", words: ["NILE", "THAMES", "SEINE", "DANUBE"] },
                { name: "AIRLINES", color: "#b0c4ef", words: ["DELTA", "UNITED", "SOUTHWEST", "FRONTIER"] },
                { name: "TYPES OF FRUIT", color: "#ba81c5", words: ["MANGO", "PAPAYA", "GUAVA", "KIWI"] }
            ]
        },
        {
            // TRAP: CORONA/BUD/MILLER/COORS are beers but CORONA also means crown/virus/sun
            // TRAP: JACK/MORGAN/WALKER are whiskey AND first names
            categories: [
                { name: "BEER BRANDS", color: "#f9df6d", words: ["CORONA", "BUD", "MILLER", "COORS"] },
                { name: "WHISKEY BRANDS (FIRST NAMES)", color: "#a0c35a", words: ["JACK", "JIM", "EVAN", "JOHNNY"] },
                { name: "PARTS OF THE SUN", color: "#b0c4ef", words: ["FLARE", "SPOT", "CORE", "PHOTOSPHERE"] },
                { name: "___ DANIELS", color: "#ba81c5", words: ["JACK", "STORMY", "SWEET", "DANIEL"] }
            ]
        },
        {
            // TRAP: PALM/CEDAR/PINE/ASH are trees AND other things (Palm Beach, Cedar Rapids, Pine Sol, ash tray)
            categories: [
                { name: "TREES (ALSO CITIES/PRODUCTS)", color: "#f9df6d", words: ["PALM", "CEDAR", "PINE", "ASH"] },
                { name: "CLEANING PRODUCTS", color: "#a0c35a", words: ["TIDE", "DAWN", "AJAX", "COMET"] },
                { name: "GREEK GODS (ALSO PLANETS)", color: "#b0c4ef", words: ["APOLLO", "MERCURY", "VENUS", "PLUTO"] },
                { name: "___ BEACH", color: "#ba81c5", words: ["LONG", "MYRTLE", "SOUTH", "VIRGINIA"] }
            ]
        },
        {
            // TRAP: BULLS/HEAT/MAGIC/JAZZ are NBA teams but also common words
            // TRAP: THUNDER/STORM/LIGHTNING are weather AND sports
            categories: [
                { name: "NBA TEAMS (COMMON WORDS)", color: "#f9df6d", words: ["BULLS", "HEAT", "MAGIC", "JAZZ"] },
                { name: "WEATHER PHENOMENA", color: "#a0c35a", words: ["THUNDER", "LIGHTNING", "HAIL", "TORNADO"] },
                { name: "MUSIC GENRES", color: "#b0c4ef", words: ["ROCK", "BLUES", "SOUL", "FUNK"] },
                { name: "THINGS THAT ARE HOT", color: "#ba81c5", words: ["FIRE", "PEPPER", "LAVA", "SAUNA"] }
            ]
        },
        {
            // TRAP: CROWN/SPRITE/TAB/FANTA seem like royalty/fairies but are sodas
            // TRAP: KING/QUEEN/PRINCE/DUKE are royalty AND band names
            categories: [
                { name: "SODA BRANDS", color: "#f9df6d", words: ["CRUSH", "TAB", "SQUIRT", "SURGE"] },
                { name: "ROYALTY (ALSO BANDS)", color: "#a0c35a", words: ["QUEEN", "PRINCE", "KING", "DUKE"] },
                { name: "CHESS PIECES", color: "#b0c4ef", words: ["ROOK", "BISHOP", "KNIGHT", "PAWN"] },
                { name: "___ COLA", color: "#ba81c5", words: ["COCA", "PEPSI", "RC", "CHERRY"] }
            ]
        },
        {
            // TRAP: Words that are colors AND colleges AND other things
            categories: [
                { name: "COLORS (ALSO NAMES)", color: "#f9df6d", words: ["ROSE", "VIOLET", "AMBER", "RUBY"] },
                { name: "IVIES (ALSO NAMES)", color: "#a0c35a", words: ["CORNELL", "BROWN", "PENN", "YALE"] },
                { name: "GEMS", color: "#b0c4ef", words: ["EMERALD", "SAPPHIRE", "DIAMOND", "PEARL"] },
                { name: "___ STONE", color: "#ba81c5", words: ["ROLLING", "STEPPING", "KEY", "MILE"] }
            ]
        },
        {
            categories: [
                { name: "SHADES OF RED", color: "#f9df6d", words: ["CRIMSON", "SCARLET", "MAROON", "BURGUNDY"] },
                { name: "IVY LEAGUE SCHOOLS", color: "#a0c35a", words: ["HARVARD", "YALE", "PRINCETON", "COLUMBIA"] },
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
        },
        // === BATCH 1: PUZZLES 33-82 ===
        {
            categories: [
                { name: "NUTS", color: "#f9df6d", words: ["ALMOND", "CASHEW", "WALNUT", "PECAN"] },
                { name: "BATMAN VILLAINS", color: "#a0c35a", words: ["JOKER", "RIDDLER", "PENGUIN", "CATWOMAN"] },
                { name: "TYPES OF CLOUDS", color: "#b0c4ef", words: ["CIRRUS", "STRATUS", "CUMULUS", "NIMBUS"] },
                { name: "WORDS BEFORE \"STONE\"", color: "#ba81c5", words: ["MILE", "KEY", "LIME", "RHINE"] }
            ]
        },
        {
            categories: [
                { name: "BERRIES", color: "#f9df6d", words: ["RASPBERRY", "BLUEBERRY", "STRAWBERRY", "CRANBERRY"] },
                { name: "NINJA TURTLES", color: "#a0c35a", words: ["LEONARDO", "DONATELLO", "RAPHAEL", "MICHELANGELO"] },
                { name: "TYPES OF ANGLES", color: "#b0c4ef", words: ["ACUTE", "OBTUSE", "RIGHT", "REFLEX"] },
                { name: "___ TRIP", color: "#ba81c5", words: ["ROAD", "FIELD", "GUILT", "EGO"] }
            ]
        },
        {
            categories: [
                { name: "MEXICAN FOOD", color: "#f9df6d", words: ["TACO", "BURRITO", "ENCHILADA", "QUESADILLA"] },
                { name: "MONOPOLY PROPERTIES", color: "#a0c35a", words: ["BOARDWALK", "PARK PLACE", "BALTIC", "MEDITERRANEAN"] },
                { name: "BONES IN THE BODY", color: "#b0c4ef", words: ["FEMUR", "TIBIA", "FIBULA", "HUMERUS"] },
                { name: "WORDS AFTER \"BRAIN\"", color: "#ba81c5", words: ["STORM", "WASH", "CHILD", "FREEZE"] }
            ]
        },
        {
            categories: [
                { name: "ASIAN CUISINES", color: "#f9df6d", words: ["THAI", "KOREAN", "VIETNAMESE", "INDIAN"] },
                { name: "PIXAR MOVIES", color: "#a0c35a", words: ["COCO", "BRAVE", "SOUL", "LUCA"] },
                { name: "WIND INSTRUMENTS", color: "#b0c4ef", words: ["FLUTE", "CLARINET", "OBOE", "BASSOON"] },
                { name: "___ DATE", color: "#ba81c5", words: ["BLIND", "DOUBLE", "PLAY", "SELL-BY"] }
            ]
        },
        {
            categories: [
                { name: "LEAFY GREENS", color: "#f9df6d", words: ["KALE", "ARUGULA", "ROMAINE", "CHARD"] },
                { name: "JAMES BOND ACTORS", color: "#a0c35a", words: ["CONNERY", "MOORE", "BROSNAN", "CRAIG"] },
                { name: "PARTS OF A SHOE", color: "#b0c4ef", words: ["SOLE", "HEEL", "TONGUE", "LACE"] },
                { name: "WORDS BEFORE \"BACK\"", color: "#ba81c5", words: ["PAPER", "QUARTER", "HORSE", "THROW"] }
            ]
        },
        {
            categories: [
                { name: "TYPES OF BEANS", color: "#f9df6d", words: ["KIDNEY", "PINTO", "BLACK", "NAVY"] },
                { name: "MICHAEL JACKSON SONGS", color: "#a0c35a", words: ["THRILLER", "BILLIE JEAN", "BAD", "BEAT IT"] },
                { name: "LAYERS OF EARTH", color: "#b0c4ef", words: ["CRUST", "MANTLE", "CORE", "LITHOSPHERE"] },
                { name: "___ CHAIR", color: "#ba81c5", words: ["ARM", "HIGH", "WHEEL", "ROCKING"] }
            ]
        },
        {
            categories: [
                { name: "SPICES", color: "#f9df6d", words: ["CUMIN", "PAPRIKA", "TURMERIC", "CORIANDER"] },
                { name: "STRANGER THINGS CHARACTERS", color: "#a0c35a", words: ["ELEVEN", "DUSTIN", "HOPPER", "STEVE"] },
                { name: "TYPES OF TRIANGLES", color: "#b0c4ef", words: ["SCALENE", "ISOSCELES", "EQUILATERAL", "OBTUSE"] },
                { name: "WORDS AFTER \"SHOW\"", color: "#ba81c5", words: ["BOAT", "CASE", "DOWN", "ROOM"] }
            ]
        },
        {
            categories: [
                { name: "ROOT VEGETABLES", color: "#f9df6d", words: ["TURNIP", "PARSNIP", "RADISH", "BEET"] },
                { name: "GAME OF THRONES HOUSES", color: "#a0c35a", words: ["STARK", "LANNISTER", "TARGARYEN", "BARATHEON"] },
                { name: "OLYMPIC SWIMMING STROKES", color: "#b0c4ef", words: ["FREESTYLE", "BACKSTROKE", "BREASTSTROKE", "BUTTERFLY"] },
                { name: "___ DANCE", color: "#ba81c5", words: ["TAP", "LINE", "BELLY", "RAIN"] }
            ]
        },
        {
            categories: [
                { name: "HERBS", color: "#f9df6d", words: ["BASIL", "OREGANO", "THYME", "ROSEMARY"] },
                { name: "AVENGERS", color: "#a0c35a", words: ["HAWKEYE", "BLACK WIDOW", "VISION", "SCARLET WITCH"] },
                { name: "VOLCANIC FEATURES", color: "#b0c4ef", words: ["CRATER", "CALDERA", "LAVA", "MAGMA"] },
                { name: "WORDS BEFORE \"HORSE\"", color: "#ba81c5", words: ["DARK", "SEA", "SAW", "HOBBY"] }
            ]
        },
        {
            categories: [
                { name: "MELONS", color: "#f9df6d", words: ["HONEYDEW", "CANTALOUPE", "WATERMELON", "CASABA"] },
                { name: "DONUT CHAINS", color: "#a0c35a", words: ["DUNKIN", "KRISPY KREME", "TIM HORTONS", "SHIPLEY"] },
                { name: "BLOOD TYPES", color: "#b0c4ef", words: ["A", "B", "AB", "O"] },
                { name: "___ CREAM", color: "#ba81c5", words: ["ICE", "SOUR", "WHIPPED", "COLD"] }
            ]
        },
        {
            categories: [
                { name: "SUSHI TYPES", color: "#f9df6d", words: ["NIGIRI", "SASHIMI", "MAKI", "TEMAKI"] },
                { name: "BREAKING BAD CHARACTERS", color: "#a0c35a", words: ["WALTER", "JESSE", "HANK", "SKYLER"] },
                { name: "PHASES OF MATTER", color: "#b0c4ef", words: ["SOLID", "LIQUID", "GAS", "PLASMA"] },
                { name: "WORDS AFTER \"PAPER\"", color: "#ba81c5", words: ["CLIP", "WEIGHT", "TRAIL", "TIGER"] }
            ]
        },
        {
            categories: [
                { name: "SQUASH VARIETIES", color: "#f9df6d", words: ["BUTTERNUT", "ACORN", "SPAGHETTI", "ZUCCHINI"] },
                { name: "PARKS AND REC CHARACTERS", color: "#a0c35a", words: ["LESLIE", "RON", "ANDY", "APRIL"] },
                { name: "TYPES OF MEMORY", color: "#b0c4ef", words: ["SHORT-TERM", "LONG-TERM", "SENSORY", "WORKING"] },
                { name: "___ FOOD", color: "#ba81c5", words: ["FAST", "SOUL", "FINGER", "COMFORT"] }
            ]
        },
        {
            categories: [
                { name: "TROPICAL FRUITS", color: "#f9df6d", words: ["PAPAYA", "GUAVA", "PASSION FRUIT", "DRAGON FRUIT"] },
                { name: "TWILIGHT CHARACTERS", color: "#a0c35a", words: ["BELLA", "EDWARD", "JACOB", "ALICE"] },
                { name: "COURT POSITIONS (TENNIS)", color: "#b0c4ef", words: ["SERVE", "VOLLEY", "BASELINE", "NET"] },
                { name: "WORDS BEFORE \"LINE\"", color: "#ba81c5", words: ["PUNCH", "DEAD", "PICK-UP", "BOTTOM"] }
            ]
        },
        {
            categories: [
                { name: "DRIED FRUITS", color: "#f9df6d", words: ["RAISIN", "PRUNE", "APRICOT", "DATE"] },
                { name: "HUNGER GAMES CHARACTERS", color: "#a0c35a", words: ["KATNISS", "PEETA", "HAYMITCH", "FINNICK"] },
                { name: "PARTS OF AN EYE", color: "#b0c4ef", words: ["CORNEA", "RETINA", "PUPIL", "IRIS"] },
                { name: "___ WATCH", color: "#ba81c5", words: ["STOP", "NIGHT", "BIRD", "DEATH"] }
            ]
        },
        {
            categories: [
                { name: "RICE DISHES", color: "#f9df6d", words: ["RISOTTO", "PAELLA", "JAMBALAYA", "BIRYANI"] },
                { name: "BURGER CHAINS", color: "#a0c35a", words: ["MCDONALDS", "BURGER KING", "WENDYS", "FIVE GUYS"] },
                { name: "TYPES OF JOINTS (BODY)", color: "#b0c4ef", words: ["BALL", "HINGE", "PIVOT", "SADDLE"] },
                { name: "WORDS AFTER \"HAND\"", color: "#ba81c5", words: ["SHAKE", "STAND", "SOME", "MADE"] }
            ]
        },
        {
            categories: [
                { name: "CONDIMENTS", color: "#f9df6d", words: ["KETCHUP", "MUSTARD", "MAYO", "RELISH"] },
                { name: "TED LASSO CHARACTERS", color: "#a0c35a", words: ["TED", "REBECCA", "ROY", "JAMIE"] },
                { name: "CLOUD COMPUTING TERMS", color: "#b0c4ef", words: ["SERVER", "STORAGE", "BANDWIDTH", "VIRTUAL"] },
                { name: "___ BOMB", color: "#ba81c5", words: ["PHOTO", "TIME", "BATH", "CHERRY"] }
            ]
        },
        {
            categories: [
                { name: "BBQ MEATS", color: "#f9df6d", words: ["BRISKET", "RIBS", "PULLED PORK", "BURNT ENDS"] },
                { name: "MANDALORIAN CHARACTERS", color: "#a0c35a", words: ["MANDO", "GROGU", "CARA", "GREEF"] },
                { name: "ACCOUNTING TERMS", color: "#b0c4ef", words: ["DEBIT", "CREDIT", "LEDGER", "AUDIT"] },
                { name: "WORDS BEFORE \"SHOT\"", color: "#ba81c5", words: ["BIG", "MOON", "SLAP", "SCREEN"] }
            ]
        },
        {
            categories: [
                { name: "CUTS OF STEAK", color: "#f9df6d", words: ["RIBEYE", "SIRLOIN", "FILET", "T-BONE"] },
                { name: "CANDY BRANDS", color: "#a0c35a", words: ["HERSHEY", "MARS", "NESTLE", "CADBURY"] },
                { name: "TYPES OF FABRIC", color: "#b0c4ef", words: ["SILK", "COTTON", "LINEN", "WOOL"] },
                { name: "___ POINT", color: "#ba81c5", words: ["POWER", "TALKING", "BREAKING", "BOILING"] }
            ]
        },
        {
            categories: [
                { name: "SEAFOOD", color: "#f9df6d", words: ["LOBSTER", "CRAB", "SHRIMP", "SCALLOP"] },
                { name: "PHONE BRANDS", color: "#a0c35a", words: ["APPLE", "SAMSUNG", "GOOGLE", "MOTOROLA"] },
                { name: "MUSIC NOTATION", color: "#b0c4ef", words: ["TREBLE", "BASS", "CLEF", "STAFF"] },
                { name: "WORDS AFTER \"BOOK\"", color: "#ba81c5", words: ["WORM", "END", "MARK", "KEEPER"] }
            ]
        },
        {
            categories: [
                { name: "SAUSAGE TYPES", color: "#f9df6d", words: ["BRATWURST", "KIELBASA", "CHORIZO", "ANDOUILLE"] },
                { name: "SHOE BRANDS", color: "#a0c35a", words: ["NIKE", "ADIDAS", "REEBOK", "CONVERSE"] },
                { name: "PARTS OF A CELL", color: "#b0c4ef", words: ["NUCLEUS", "MEMBRANE", "CYTOPLASM", "RIBOSOME"] },
                { name: "___ BOARD", color: "#ba81c5", words: ["CHALK", "CUTTING", "SOUND", "DIVING"] }
            ]
        },
        {
            categories: [
                { name: "JAPANESE FOOD", color: "#f9df6d", words: ["RAMEN", "UDON", "TEMPURA", "TERIYAKI"] },
                { name: "SOPRANOS CHARACTERS", color: "#a0c35a", words: ["TONY", "CARMELA", "CHRISTOPHER", "PAULIE"] },
                { name: "BALLET POSITIONS", color: "#b0c4ef", words: ["FIRST", "SECOND", "THIRD", "FIFTH"] },
                { name: "WORDS BEFORE \"CUT\"", color: "#ba81c5", words: ["CREW", "BUZZ", "PAPER", "PRICE"] }
            ]
        },
        {
            categories: [
                { name: "INDIAN DISHES", color: "#f9df6d", words: ["CURRY", "TIKKA", "KORMA", "VINDALOO"] },
                { name: "FAST FOOD SIDES", color: "#a0c35a", words: ["FRIES", "ONION RINGS", "COLESLAW", "MOZZARELLA STICKS"] },
                { name: "ELEMENTS (CLASSICAL)", color: "#b0c4ef", words: ["EARTH", "WATER", "FIRE", "AIR"] },
                { name: "___ DRIVE", color: "#ba81c5", words: ["HARD", "TEST", "SEX", "THUMB"] }
            ]
        },
        {
            categories: [
                { name: "ITALIAN DESSERTS", color: "#f9df6d", words: ["TIRAMISU", "PANNA COTTA", "CANNOLI", "GELATO"] },
                { name: "SOFT DRINK BRANDS", color: "#a0c35a", words: ["COCA-COLA", "PEPSI", "DR PEPPER", "MOUNTAIN DEW"] },
                { name: "CHESS OPENINGS", color: "#b0c4ef", words: ["SICILIAN", "FRENCH", "SPANISH", "ITALIAN"] },
                { name: "WORDS AFTER \"COLD\"", color: "#ba81c5", words: ["FEET", "SHOULDER", "TURKEY", "CASE"] }
            ]
        },
        {
            categories: [
                { name: "FRENCH FOODS", color: "#f9df6d", words: ["CROISSANT", "BAGUETTE", "CREPE", "QUICHE"] },
                { name: "LOST CHARACTERS", color: "#a0c35a", words: ["JACK", "KATE", "SAWYER", "LOCKE"] },
                { name: "TYPES OF POEMS", color: "#b0c4ef", words: ["SONNET", "HAIKU", "LIMERICK", "BALLAD"] },
                { name: "___ FISH", color: "#ba81c5", words: ["GOLD", "CAT", "JELLY", "STAR"] }
            ]
        },
        {
            categories: [
                { name: "GREEK FOODS", color: "#f9df6d", words: ["GYRO", "SOUVLAKI", "MOUSSAKA", "SPANAKOPITA"] },
                { name: "STREAMING SERVICES", color: "#a0c35a", words: ["NETFLIX", "HULU", "DISNEY PLUS", "HBO MAX"] },
                { name: "PUNCTUATION MARKS", color: "#b0c4ef", words: ["COMMA", "COLON", "SEMICOLON", "APOSTROPHE"] },
                { name: "WORDS BEFORE \"MAN\"", color: "#ba81c5", words: ["IRON", "SPIDER", "BAT", "SUPER"] }
            ]
        },
        {
            categories: [
                { name: "DELI MEATS", color: "#f9df6d", words: ["SALAMI", "PROSCIUTTO", "MORTADELLA", "CAPICOLA"] },
                { name: "SOCIAL MEDIA APPS", color: "#a0c35a", words: ["FACEBOOK", "INSTAGRAM", "TIKTOK", "SNAPCHAT"] },
                { name: "ROCK TYPES", color: "#b0c4ef", words: ["IGNEOUS", "SEDIMENTARY", "METAMORPHIC", "VOLCANIC"] },
                { name: "___ SPACE", color: "#ba81c5", words: ["OUTER", "OFFICE", "CRAWL", "PARKING"] }
            ]
        },
        {
            categories: [
                { name: "SANDWICHES (INTL)", color: "#f9df6d", words: ["BANH MI", "CUBANO", "GYRO", "SHAWARMA"] },
                { name: "AIRLINE BRANDS", color: "#a0c35a", words: ["DELTA", "UNITED", "SOUTHWEST", "JETBLUE"] },
                { name: "TYPES OF WAVES", color: "#b0c4ef", words: ["SOUND", "LIGHT", "RADIO", "MICRO"] },
                { name: "WORDS AFTER \"LAND\"", color: "#ba81c5", words: ["MARK", "LORD", "SLIDE", "FILL"] }
            ]
        },
        {
            categories: [
                { name: "SOUP TYPES", color: "#f9df6d", words: ["BISQUE", "CHILI", "GUMBO", "GAZPACHO"] },
                { name: "CAR RENTAL COMPANIES", color: "#a0c35a", words: ["HERTZ", "ENTERPRISE", "AVIS", "BUDGET"] },
                { name: "LITERARY DEVICES", color: "#b0c4ef", words: ["METAPHOR", "SIMILE", "IRONY", "HYPERBOLE"] },
                { name: "___ DREAM", color: "#ba81c5", words: ["PIPE", "DAY", "AMERICAN", "WET"] }
            ]
        },
        {
            categories: [
                { name: "COMFORT FOODS", color: "#f9df6d", words: ["MAC AND CHEESE", "MEATLOAF", "POT ROAST", "CASSEROLE"] },
                { name: "HOTEL CHAINS", color: "#a0c35a", words: ["MARRIOTT", "HILTON", "HYATT", "HOLIDAY INN"] },
                { name: "TYPES OF TAXES", color: "#b0c4ef", words: ["INCOME", "SALES", "PROPERTY", "ESTATE"] },
                { name: "WORDS BEFORE \"WASH\"", color: "#ba81c5", words: ["BRAIN", "CAR", "WHITE", "HOG"] }
            ]
        },
        {
            categories: [
                { name: "FINGER FOODS", color: "#f9df6d", words: ["WINGS", "SLIDERS", "NACHOS", "POPPERS"] },
                { name: "CROWN CHARACTERS", color: "#a0c35a", words: ["ELIZABETH", "PHILIP", "DIANA", "CHARLES"] },
                { name: "WEB BROWSERS", color: "#b0c4ef", words: ["CHROME", "SAFARI", "FIREFOX", "EDGE"] },
                { name: "___ TABLE", color: "#ba81c5", words: ["ROUND", "POOL", "PERIODIC", "COFFEE"] }
            ]
        },
        {
            categories: [
                { name: "STREET FOOD", color: "#f9df6d", words: ["HOT DOG", "PRETZEL", "KEBAB", "FALAFEL"] },
                { name: "CREDIT CARD BRANDS", color: "#a0c35a", words: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"] },
                { name: "LOGICAL FALLACIES", color: "#b0c4ef", words: ["STRAW MAN", "AD HOMINEM", "RED HERRING", "SLIPPERY SLOPE"] },
                { name: "WORDS AFTER \"SIDE\"", color: "#ba81c5", words: ["KICK", "WALK", "SHOW", "BURNS"] }
            ]
        },
        {
            categories: [
                { name: "FAIR FOODS", color: "#f9df6d", words: ["FUNNEL CAKE", "CORN DOG", "COTTON CANDY", "CARAMEL APPLE"] },
                { name: "SPORTS DRINK BRANDS", color: "#a0c35a", words: ["GATORADE", "POWERADE", "BODYARMOR", "PROPEL"] },
                { name: "ECONOMIC SYSTEMS", color: "#b0c4ef", words: ["CAPITALISM", "SOCIALISM", "COMMUNISM", "FEUDALISM"] },
                { name: "___ MILK", color: "#ba81c5", words: ["ALMOND", "OAT", "BREAST", "SPILT"] }
            ]
        },
        {
            categories: [
                { name: "FOOD TRUCKS", color: "#f9df6d", words: ["TACOS", "BBQ", "SLIDERS", "GRILLED CHEESE"] },
                { name: "BOTTLED WATER BRANDS", color: "#a0c35a", words: ["AQUAFINA", "DASANI", "EVIAN", "FIJI"] },
                { name: "COMPUTER PARTS", color: "#b0c4ef", words: ["CPU", "GPU", "RAM", "SSD"] },
                { name: "WORDS BEFORE \"OUT\"", color: "#ba81c5", words: ["BLACK", "BURN", "CHECK", "WASH"] }
            ]
        },
        {
            categories: [
                { name: "BAR SNACKS", color: "#f9df6d", words: ["PEANUTS", "PRETZELS", "POPCORN", "CHIPS"] },
                { name: "CLASSIC TOYS", color: "#a0c35a", words: ["SLINKY", "LEGO", "BARBIE", "FRISBEE"] },
                { name: "MATHEMATICAL OPERATIONS", color: "#b0c4ef", words: ["ADDITION", "SUBTRACTION", "MULTIPLICATION", "DIVISION"] },
                { name: "___ CANDY", color: "#ba81c5", words: ["COTTON", "EYE", "EAR", "ARM"] }
            ]
        },
        {
            categories: [
                { name: "PICNIC FOODS", color: "#f9df6d", words: ["COLESLAW", "POTATO SALAD", "DEVILED EGGS", "CORNBREAD"] },
                { name: "MCDONALDS MENU", color: "#a0c35a", words: ["BIG MAC", "MCNUGGETS", "FRIES", "MCFLURRY"] },
                { name: "INTERNET SLANG", color: "#b0c4ef", words: ["LOL", "BRB", "FOMO", "YOLO"] },
                { name: "WORDS AFTER \"SWEET\"", color: "#ba81c5", words: ["HEART", "TOOTH", "TALK", "SPOT"] }
            ]
        },
        {
            categories: [
                { name: "STADIUM FOODS", color: "#f9df6d", words: ["NACHOS", "PEANUTS", "CRACKER JACK", "BEER"] },
                { name: "PLAYGROUND EQUIPMENT", color: "#a0c35a", words: ["SWING", "SLIDE", "SEESAW", "MONKEY BARS"] },
                { name: "CLOUD TYPES", color: "#b0c4ef", words: ["ALTO", "STRATO", "CIRO", "CUMULO"] },
                { name: "___ STORM", color: "#ba81c5", words: ["BRAIN", "ICE", "FIRE", "PERFECT"] }
            ]
        },
        {
            categories: [
                { name: "MOVIE SNACKS", color: "#f9df6d", words: ["POPCORN", "TWIZZLERS", "RAISINETS", "MILK DUDS"] },
                { name: "SCHOOL SUPPLIES", color: "#a0c35a", words: ["PENCIL", "ERASER", "RULER", "GLUE"] },
                { name: "SEARCH ENGINES", color: "#b0c4ef", words: ["GOOGLE", "BING", "YAHOO", "DUCKDUCKGO"] },
                { name: "WORDS BEFORE \"WORK\"", color: "#ba81c5", words: ["FRAME", "PATCH", "FIRE", "DREAM"] }
            ]
        },
        {
            categories: [
                { name: "CARNIVAL RIDES", color: "#f9df6d", words: ["FERRIS WHEEL", "CAROUSEL", "BUMPER CARS", "TILT-A-WHIRL"] },
                { name: "GAS STATION BRANDS", color: "#a0c35a", words: ["SHELL", "EXXON", "CHEVRON", "BP"] },
                { name: "SOCIAL SCIENCES", color: "#b0c4ef", words: ["PSYCHOLOGY", "SOCIOLOGY", "ANTHROPOLOGY", "ECONOMICS"] },
                { name: "___ COAT", color: "#ba81c5", words: ["OVER", "UNDER", "PET", "TOP"] }
            ]
        },
        {
            categories: [
                { name: "AMUSEMENT PARKS", color: "#f9df6d", words: ["DISNEYLAND", "SIX FLAGS", "CEDAR POINT", "UNIVERSAL"] },
                { name: "CEREAL BRANDS", color: "#a0c35a", words: ["CHEERIOS", "FROSTED FLAKES", "LUCKY CHARMS", "FRUIT LOOPS"] },
                { name: "VITAMINS", color: "#b0c4ef", words: ["A", "C", "D", "E"] },
                { name: "WORDS AFTER \"BLACK\"", color: "#ba81c5", words: ["SMITH", "MAIL", "LIST", "OUT"] }
            ]
        },
        {
            categories: [
                { name: "THEME PARK RIDES", color: "#f9df6d", words: ["SPLASH MOUNTAIN", "SPACE MOUNTAIN", "HAUNTED MANSION", "PIRATES"] },
                { name: "COOKIE TYPES", color: "#a0c35a", words: ["CHOCOLATE CHIP", "OATMEAL", "SNICKERDOODLE", "SUGAR"] },
                { name: "NOBLE GASES", color: "#b0c4ef", words: ["NEON", "ARGON", "KRYPTON", "XENON"] },
                { name: "___ ROCK", color: "#ba81c5", words: ["PUNK", "HARD", "KID", "SHAM"] }
            ]
        },
        {
            categories: [
                { name: "WATER PARK ATTRACTIONS", color: "#f9df6d", words: ["LAZY RIVER", "WAVE POOL", "WATER SLIDE", "SPLASH PAD"] },
                { name: "LAUNDRY ITEMS", color: "#a0c35a", words: ["DETERGENT", "FABRIC SOFTENER", "DRYER SHEET", "BLEACH"] },
                { name: "PH SCALE TERMS", color: "#b0c4ef", words: ["ACID", "BASE", "NEUTRAL", "ALKALINE"] },
                { name: "WORDS BEFORE \"HEAD\"", color: "#ba81c5", words: ["RED", "BONE", "BLOCK", "FIGURE"] }
            ]
        },
        {
            categories: [
                { name: "ROLLER COASTER TYPES", color: "#f9df6d", words: ["WOODEN", "STEEL", "INVERTED", "LAUNCHED"] },
                { name: "ICE CREAM BRANDS", color: "#a0c35a", words: ["BEN AND JERRYS", "HAAGEN-DAZS", "BREYERS", "BASKIN ROBBINS"] },
                { name: "DNA BASES", color: "#b0c4ef", words: ["ADENINE", "THYMINE", "GUANINE", "CYTOSINE"] },
                { name: "___ SCHOOL", color: "#ba81c5", words: ["OLD", "HIGH", "SUNDAY", "BOARDING"] }
            ]
        },
        {
            categories: [
                { name: "ARCADE GAMES", color: "#f9df6d", words: ["PAC-MAN", "DONKEY KONG", "SPACE INVADERS", "GALAGA"] },
                { name: "SODA FLAVORS", color: "#a0c35a", words: ["COLA", "ROOT BEER", "GINGER ALE", "CREAM SODA"] },
                { name: "METRIC PREFIXES", color: "#b0c4ef", words: ["KILO", "MEGA", "GIGA", "TERA"] },
                { name: "WORDS AFTER \"CROSS\"", color: "#ba81c5", words: ["WORD", "WALK", "FIT", "BOW"] }
            ]
        },
        {
            categories: [
                { name: "BOARD GAME PIECES", color: "#f9df6d", words: ["DICE", "TOKEN", "CARD", "SPINNER"] },
                { name: "CHIP BRANDS", color: "#a0c35a", words: ["LAYS", "DORITOS", "PRINGLES", "RUFFLES"] },
                { name: "ASTRONOMY TERMS", color: "#b0c4ef", words: ["NEBULA", "QUASAR", "PULSAR", "SUPERNOVA"] },
                { name: "___ PLAY", color: "#ba81c5", words: ["FAIR", "FOUL", "FORE", "HORSE"] }
            ]
        },
        {
            categories: [
                { name: "VIDEO GAME CONSOLES", color: "#f9df6d", words: ["PLAYSTATION", "XBOX", "NINTENDO", "SEGA"] },
                { name: "BATHROOM ITEMS", color: "#a0c35a", words: ["TOOTHBRUSH", "SOAP", "TOWEL", "SHAMPOO"] },
                { name: "FINANCIAL TERMS", color: "#b0c4ef", words: ["ASSET", "LIABILITY", "EQUITY", "REVENUE"] },
                { name: "WORDS BEFORE \"STAND\"", color: "#ba81c5", words: ["GRAND", "BAND", "NIGHT", "KICK"] }
            ]
        },
        // === BATCH 2: PUZZLES 83-132 ===
        {
            categories: [
                { name: "PLAYING CARD SUITS", color: "#f9df6d", words: ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"] },
                { name: "GHOSTBUSTERS CHARACTERS", color: "#a0c35a", words: ["EGON", "RAY", "PETER", "WINSTON"] },
                { name: "GEOMETRY SHAPES", color: "#b0c4ef", words: ["PENTAGON", "HEXAGON", "OCTAGON", "DECAGON"] },
                { name: "___ TALK", color: "#ba81c5", words: ["SMALL", "BABY", "PEP", "PILLOW"] }
            ]
        },
        {
            categories: [
                { name: "POKER CHIPS COLORS", color: "#f9df6d", words: ["RED", "BLUE", "GREEN", "BLACK"] },
                { name: "JUICE BRANDS", color: "#a0c35a", words: ["TROPICANA", "SIMPLY", "MINUTE MAID", "OCEAN SPRAY"] },
                { name: "PARTS OF SPEECH", color: "#b0c4ef", words: ["NOUN", "VERB", "ADJECTIVE", "ADVERB"] },
                { name: "WORDS AFTER \"TIME\"", color: "#ba81c5", words: ["LINE", "TABLE", "PIECE", "BOMB"] }
            ]
        },
        {
            categories: [
                { name: "DICE GAMES", color: "#f9df6d", words: ["YAHTZEE", "CRAPS", "BUNCO", "FARKLE"] },
                { name: "PRINCESS BRIDE CHARACTERS", color: "#a0c35a", words: ["WESTLEY", "BUTTERCUP", "INIGO", "FEZZIK"] },
                { name: "RHETORICAL DEVICES", color: "#b0c4ef", words: ["ETHOS", "PATHOS", "LOGOS", "KAIROS"] },
                { name: "___ LANE", color: "#ba81c5", words: ["PENNY", "FAST", "MEMORY", "LOVERS"] }
            ]
        },
        {
            categories: [
                { name: "CASINO GAMES", color: "#f9df6d", words: ["BLACKJACK", "ROULETTE", "BACCARAT", "SLOTS"] },
                { name: "BACK TO FUTURE CHARACTERS", color: "#a0c35a", words: ["MARTY", "DOC", "BIFF", "LORRAINE"] },
                { name: "LOGICAL OPERATORS", color: "#b0c4ef", words: ["AND", "OR", "NOT", "XOR"] },
                { name: "WORDS BEFORE \"BALL\"", color: "#ba81c5", words: ["ODD", "SNOW", "MEAT", "CURVE"] }
            ]
        },
        {
            categories: [
                { name: "CARD GAME ACTIONS", color: "#f9df6d", words: ["DRAW", "DISCARD", "SHUFFLE", "DEAL"] },
                { name: "FERRIS BUELLER CHARACTERS", color: "#a0c35a", words: ["FERRIS", "CAMERON", "SLOANE", "ROONEY"] },
                { name: "PERIODIC TABLE GROUPS", color: "#b0c4ef", words: ["ALKALI", "HALOGEN", "NOBLE", "TRANSITION"] },
                { name: "___ TOWN", color: "#ba81c5", words: ["DOWN", "HOME", "GHOST", "CHINA"] }
            ]
        },
        {
            categories: [
                { name: "DOMINO TERMS", color: "#f9df6d", words: ["DOUBLE", "BLANK", "SPINNER", "BONE"] },
                { name: "BREAKFAST CLUB CHARACTERS", color: "#a0c35a", words: ["BENDER", "CLAIRE", "BRIAN", "ALLISON"] },
                { name: "STATES OF CONSCIOUSNESS", color: "#b0c4ef", words: ["AWAKE", "ASLEEP", "DREAMING", "COMA"] },
                { name: "WORDS AFTER \"GREEN\"", color: "#ba81c5", words: ["HOUSE", "LIGHT", "HORN", "BACK"] }
            ]
        },
        {
            categories: [
                { name: "BILLIARDS SHOTS", color: "#f9df6d", words: ["BREAK", "BANK", "COMBO", "JUMP"] },
                { name: "DIRTY DANCING CHARACTERS", color: "#a0c35a", words: ["BABY", "JOHNNY", "PENNY", "NEIL"] },
                { name: "LEARNING STYLES", color: "#b0c4ef", words: ["VISUAL", "AUDITORY", "KINESTHETIC", "READING"] },
                { name: "___ BOOK", color: "#ba81c5", words: ["FACE", "TEXT", "COOK", "YEAR"] }
            ]
        },
        {
            categories: [
                { name: "DARTS TERMS", color: "#f9df6d", words: ["BULLSEYE", "TRIPLE", "DOUBLE", "OUTER"] },
                { name: "GREASE CHARACTERS", color: "#a0c35a", words: ["DANNY", "SANDY", "RIZZO", "KENICKIE"] },
                { name: "COGNITIVE BIASES", color: "#b0c4ef", words: ["CONFIRMATION", "ANCHORING", "HINDSIGHT", "AVAILABILITY"] },
                { name: "WORDS BEFORE \"WATER\"", color: "#ba81c5", words: ["DEEP", "TAP", "HOLY", "BACK"] }
            ]
        },
        {
            categories: [
                { name: "BOWLING TERMS", color: "#f9df6d", words: ["STRIKE", "SPARE", "GUTTER", "SPLIT"] },
                { name: "FROZEN FOOD BRANDS", color: "#a0c35a", words: ["BIRDS EYE", "STOUFFERS", "LEAN CUISINE", "MARIE CALLENDER"] },
                { name: "PERSONALITY TYPES", color: "#b0c4ef", words: ["INTROVERT", "EXTROVERT", "AMBIVERT", "OMNIVERT"] },
                { name: "___ CLUB", color: "#ba81c5", words: ["BOOK", "FIGHT", "GLEE", "BREAKFAST"] }
            ]
        },
        {
            categories: [
                { name: "GOLF TERMS", color: "#f9df6d", words: ["BIRDIE", "BOGEY", "PAR", "EAGLE"] },
                { name: "CLUELESS CHARACTERS", color: "#a0c35a", words: ["CHER", "DIONNE", "TAI", "JOSH"] },
                { name: "ATTACHMENT STYLES", color: "#b0c4ef", words: ["SECURE", "ANXIOUS", "AVOIDANT", "DISORGANIZED"] },
                { name: "WORDS AFTER \"HOME\"", color: "#ba81c5", words: ["RUN", "SICK", "WORK", "COMING"] }
            ]
        },
        {
            categories: [
                { name: "TENNIS TERMS", color: "#f9df6d", words: ["ACE", "DEUCE", "LOVE", "FAULT"] },
                { name: "MEAN GIRLS CHARACTERS", color: "#a0c35a", words: ["CADY", "REGINA", "GRETCHEN", "KAREN"] },
                { name: "DEFENSE MECHANISMS", color: "#b0c4ef", words: ["DENIAL", "PROJECTION", "REGRESSION", "SUBLIMATION"] },
                { name: "___ HOUSE", color: "#ba81c5", words: ["DOG", "BIRD", "TREE", "WARE"] }
            ]
        },
        {
            categories: [
                { name: "BASEBALL POSITIONS", color: "#f9df6d", words: ["PITCHER", "CATCHER", "SHORTSTOP", "OUTFIELDER"] },
                { name: "LEGALLY BLONDE CHARACTERS", color: "#a0c35a", words: ["ELLE", "WARNER", "PAULETTE", "EMMETT"] },
                { name: "MORAL PHILOSOPHIES", color: "#b0c4ef", words: ["UTILITARIANISM", "DEONTOLOGY", "VIRTUE", "RELATIVISM"] },
                { name: "WORDS BEFORE \"TREE\"", color: "#ba81c5", words: ["FAMILY", "PALM", "SHOE", "DECISION"] }
            ]
        },
        {
            categories: [
                { name: "FOOTBALL POSITIONS", color: "#f9df6d", words: ["QUARTERBACK", "RECEIVER", "LINEBACKER", "TACKLE"] },
                { name: "BRIDESMAIDS CHARACTERS", color: "#a0c35a", words: ["ANNIE", "LILLIAN", "MEGAN", "HELEN"] },
                { name: "ECONOMIC INDICATORS", color: "#b0c4ef", words: ["GDP", "INFLATION", "UNEMPLOYMENT", "INTEREST"] },
                { name: "___ TIME", color: "#ba81c5", words: ["PRIME", "HALF", "HAMMER", "BIG"] }
            ]
        },
        {
            categories: [
                { name: "HOCKEY POSITIONS", color: "#f9df6d", words: ["GOALIE", "DEFENSEMAN", "WINGER", "CENTER"] },
                { name: "HANGOVER CHARACTERS", color: "#a0c35a", words: ["PHIL", "STU", "ALAN", "DOUG"] },
                { name: "MARKET STRUCTURES", color: "#b0c4ef", words: ["MONOPOLY", "OLIGOPOLY", "DUOPOLY", "COMPETITION"] },
                { name: "WORDS AFTER \"MASTER\"", color: "#ba81c5", words: ["PIECE", "MIND", "CARD", "CLASS"] }
            ]
        },
        {
            categories: [
                { name: "SOCCER POSITIONS", color: "#f9df6d", words: ["STRIKER", "MIDFIELDER", "DEFENDER", "KEEPER"] },
                { name: "SUPERBAD CHARACTERS", color: "#a0c35a", words: ["SETH", "EVAN", "MCLOVIN", "FOGELL"] },
                { name: "INVESTMENT TYPES", color: "#b0c4ef", words: ["STOCKS", "BONDS", "MUTUAL FUNDS", "ETF"] },
                { name: "___ LESS", color: "#ba81c5", words: ["SHAME", "HOME", "WIRE", "WORTH"] }
            ]
        },
        {
            categories: [
                { name: "VOLLEYBALL TERMS", color: "#f9df6d", words: ["SPIKE", "SET", "DIG", "BLOCK"] },
                { name: "STEP BROTHERS CHARACTERS", color: "#a0c35a", words: ["BRENNAN", "DALE", "NANCY", "ROBERT"] },
                { name: "BANKRUPTCY CHAPTERS", color: "#b0c4ef", words: ["SEVEN", "ELEVEN", "THIRTEEN", "FIFTEEN"] },
                { name: "WORDS BEFORE \"MOON\"", color: "#ba81c5", words: ["FULL", "HONEY", "HALF", "NEW"] }
            ]
        },
        {
            categories: [
                { name: "RUGBY POSITIONS", color: "#f9df6d", words: ["HOOKER", "PROP", "SCRUM-HALF", "FLY-HALF"] },
                { name: "ANCHORMAN CHARACTERS", color: "#a0c35a", words: ["RON", "BRICK", "CHAMP", "BRIAN"] },
                { name: "CURRENCY TYPES", color: "#b0c4ef", words: ["FIAT", "COMMODITY", "CRYPTO", "DIGITAL"] },
                { name: "___ SIGN", color: "#ba81c5", words: ["STOP", "PLUS", "PEACE", "VITAL"] }
            ]
        },
        {
            categories: [
                { name: "CRICKET TERMS", color: "#f9df6d", words: ["WICKET", "OVER", "INNINGS", "BOUNDARY"] },
                { name: "ELF CHARACTERS", color: "#a0c35a", words: ["BUDDY", "JOVIE", "WALTER", "MILES"] },
                { name: "CREDIT SCORE FACTORS", color: "#b0c4ef", words: ["PAYMENT", "UTILIZATION", "LENGTH", "INQUIRY"] },
                { name: "WORDS AFTER \"RUNNING\"", color: "#ba81c5", words: ["MATE", "BACK", "WATER", "JOKE"] }
            ]
        },
        {
            categories: [
                { name: "LACROSSE TERMS", color: "#f9df6d", words: ["CRADLE", "FACE-OFF", "CLEAR", "RIDE"] },
                { name: "ENERGY DRINK BRANDS", color: "#a0c35a", words: ["RED BULL", "MONSTER", "ROCKSTAR", "BANG"] },
                { name: "LOAN TYPES", color: "#b0c4ef", words: ["MORTGAGE", "AUTO", "STUDENT", "PERSONAL"] },
                { name: "___ DAY", color: "#ba81c5", words: ["BIRTH", "RAIN", "GAME", "JUDGMENT"] }
            ]
        },
        {
            categories: [
                { name: "SWIMMING TERMS", color: "#f9df6d", words: ["LAP", "LANE", "STROKE", "FLIP TURN"] },
                { name: "GROUNDHOG DAY CHARACTERS", color: "#a0c35a", words: ["PHIL", "RITA", "NED", "LARRY"] },
                { name: "TAX FORMS", color: "#b0c4ef", words: ["W-2", "1099", "W-4", "1040"] },
                { name: "WORDS BEFORE \"FIGHT\"", color: "#ba81c5", words: ["FOOD", "FIST", "SNOW", "PRIZE"] }
            ]
        },
        {
            categories: [
                { name: "DIVING TERMS", color: "#f9df6d", words: ["PIKE", "TUCK", "TWIST", "SOMERSAULT"] },
                { name: "SPACE JAM CHARACTERS", color: "#a0c35a", words: ["MICHAEL", "BUGS", "DAFFY", "LOLA"] },
                { name: "REAL ESTATE TERMS", color: "#b0c4ef", words: ["ESCROW", "CLOSING", "APPRAISAL", "DEED"] },
                { name: "___ HOUSE", color: "#ba81c5", words: ["JAIL", "POWER", "ROUGH", "SLAUGHTER"] }
            ]
        },
        {
            categories: [
                { name: "TRACK EVENTS", color: "#f9df6d", words: ["SPRINT", "MARATHON", "STEEPLECHASE", "DECATHLON"] },
                { name: "TOOTHPASTE BRANDS", color: "#a0c35a", words: ["COLGATE", "CREST", "SENSODYNE", "ARM AND HAMMER"] },
                { name: "INSURANCE TYPES", color: "#b0c4ef", words: ["LIFE", "HEALTH", "AUTO", "HOME"] },
                { name: "WORDS AFTER \"GROUND\"", color: "#ba81c5", words: ["ZERO", "HOG", "BREAKING", "FLOOR"] }
            ]
        },
        {
            categories: [
                { name: "FIELD EVENTS", color: "#f9df6d", words: ["SHOT PUT", "LONG JUMP", "POLE VAULT", "HIGH JUMP"] },
                { name: "FARGO CHARACTERS (MOVIE)", color: "#a0c35a", words: ["MARGE", "JERRY", "CARL", "GAEAR"] },
                { name: "CONTRACT TERMS", color: "#b0c4ef", words: ["OFFER", "ACCEPTANCE", "CONSIDERATION", "BREACH"] },
                { name: "___ EFFECT", color: "#ba81c5", words: ["BUTTERFLY", "DOMINO", "RIPPLE", "SIDE"] }
            ]
        },
        {
            categories: [
                { name: "MARTIAL ARTS", color: "#f9df6d", words: ["KARATE", "JUDO", "TAEKWONDO", "AIKIDO"] },
                { name: "PULP FICTION CHARACTERS", color: "#a0c35a", words: ["VINCENT", "JULES", "MIA", "BUTCH"] },
                { name: "PARTNERSHIP TYPES", color: "#b0c4ef", words: ["GENERAL", "LIMITED", "SILENT", "SLEEPING"] },
                { name: "WORDS BEFORE \"PARTY\"", color: "#ba81c5", words: ["BLOCK", "THIRD", "SLUMBER", "SEARCH"] }
            ]
        },
        {
            categories: [
                { name: "COMBAT SPORTS", color: "#f9df6d", words: ["BOXING", "WRESTLING", "MMA", "KICKBOXING"] },
                { name: "GOODFELLAS CHARACTERS", color: "#a0c35a", words: ["HENRY", "TOMMY", "JIMMY", "KAREN"] },
                { name: "BUSINESS STRUCTURES", color: "#b0c4ef", words: ["SOLE", "PARTNERSHIP", "LLC", "CORPORATION"] },
                { name: "___ CHECK", color: "#ba81c5", words: ["RAIN", "REALITY", "BACKGROUND", "SPELL"] }
            ]
        },
        {
            categories: [
                { name: "EQUESTRIAN EVENTS", color: "#f9df6d", words: ["DRESSAGE", "JUMPING", "EVENTING", "POLO"] },
                { name: "TOILET PAPER BRANDS", color: "#a0c35a", words: ["CHARMIN", "COTTONELLE", "SCOTT", "QUILTED NORTHERN"] },
                { name: "CORPORATE ROLES", color: "#b0c4ef", words: ["CEO", "CFO", "COO", "CTO"] },
                { name: "WORDS AFTER \"NIGHT\"", color: "#ba81c5", words: ["MARE", "FALL", "LIFE", "CLUB"] }
            ]
        },
        {
            categories: [
                { name: "WINTER SPORTS", color: "#f9df6d", words: ["SKIING", "SNOWBOARDING", "BOBSLED", "CURLING"] },
                { name: "SALAD DRESSING BRANDS", color: "#a0c35a", words: ["HIDDEN VALLEY", "KRAFT", "NEWMANS OWN", "WISHBONE"] },
                { name: "MEETING TYPES", color: "#b0c4ef", words: ["BOARD", "STAFF", "ANNUAL", "EMERGENCY"] },
                { name: "___ WEATHER", color: "#ba81c5", words: ["FAIR", "UNDER", "FOUL", "STORMY"] }
            ]
        },
        {
            categories: [
                { name: "WATER SPORTS", color: "#f9df6d", words: ["SURFING", "KAYAKING", "ROWING", "SAILING"] },
                { name: "GODFATHER CHARACTERS", color: "#a0c35a", words: ["VITO", "MICHAEL", "SONNY", "FREDO"] },
                { name: "STOCK ORDER TYPES", color: "#b0c4ef", words: ["MARKET", "LIMIT", "STOP", "TRAILING"] },
                { name: "WORDS BEFORE \"CARD\"", color: "#ba81c5", words: ["WILD", "TRUMP", "FLASH", "REPORT"] }
            ]
        },
        {
            categories: [
                { name: "EXTREME SPORTS", color: "#f9df6d", words: ["SKYDIVING", "BUNGEE", "BASE JUMPING", "PARAGLIDING"] },
                { name: "LAUNDRY DETERGENT BRANDS", color: "#a0c35a", words: ["TIDE", "GAIN", "ALL", "PERSIL"] },
                { name: "AUDIT TYPES", color: "#b0c4ef", words: ["INTERNAL", "EXTERNAL", "FORENSIC", "COMPLIANCE"] },
                { name: "___ BIRD", color: "#ba81c5", words: ["EARLY", "SNOW", "JAIL", "LADY"] }
            ]
        },
        {
            categories: [
                { name: "RACKET SPORTS", color: "#f9df6d", words: ["TENNIS", "BADMINTON", "SQUASH", "RACQUETBALL"] },
                { name: "PAPER TOWEL BRANDS", color: "#a0c35a", words: ["BOUNTY", "BRAWNY", "VIVA", "SPARKLE"] },
                { name: "BUDGET CATEGORIES", color: "#b0c4ef", words: ["FIXED", "VARIABLE", "DISCRETIONARY", "SAVINGS"] },
                { name: "WORDS AFTER \"DEAD\"", color: "#ba81c5", words: ["LINE", "LOCK", "PAN", "BEAT"] }
            ]
        },
        // === BATCH 3: PUZZLES 133-182 ===
        {
            categories: [
                { name: "BAT SPORTS", color: "#f9df6d", words: ["BASEBALL", "CRICKET", "SOFTBALL", "ROUNDERS"] },
                { name: "DISH SOAP BRANDS", color: "#a0c35a", words: ["DAWN", "PALMOLIVE", "AJAX", "JOY"] },
                { name: "INVOICE TERMS", color: "#b0c4ef", words: ["NET 30", "COD", "DUE ON RECEIPT", "2/10"] },
                { name: "___ HOUSE", color: "#ba81c5", words: ["SAFE", "MAD", "HALF-WAY", "CLEARING"] }
            ]
        },
        {
            categories: [
                { name: "NET SPORTS", color: "#f9df6d", words: ["VOLLEYBALL", "TENNIS", "BADMINTON", "PICKLEBALL"] },
                { name: "MAYO BRANDS", color: "#a0c35a", words: ["HELLMANNS", "KRAFT", "DUKES", "MIRACLE WHIP"] },
                { name: "ACCOUNTING PRINCIPLES", color: "#b0c4ef", words: ["GAAP", "IFRS", "ACCRUAL", "CASH"] },
                { name: "WORDS BEFORE \"SHOT\"", color: "#ba81c5", words: ["MUG", "LONG", "CHEAP", "SNAP"] }
            ]
        },
        {
            categories: [
                { name: "GOAL SPORTS", color: "#f9df6d", words: ["SOCCER", "HOCKEY", "LACROSSE", "HANDBALL"] },
                { name: "KETCHUP BRANDS", color: "#a0c35a", words: ["HEINZ", "HUNTS", "DEL MONTE", "FRENCH"] },
                { name: "DEPRECIATION METHODS", color: "#b0c4ef", words: ["STRAIGHT-LINE", "DECLINING", "DOUBLE", "UNITS"] },
                { name: "___ MARKET", color: "#ba81c5", words: ["BULL", "BEAR", "FLEA", "FARMERS"] }
            ]
        },
        {
            categories: [
                { name: "PRECISION SPORTS", color: "#f9df6d", words: ["ARCHERY", "DARTS", "BOWLING", "BILLIARDS"] },
                { name: "MUSTARD BRANDS", color: "#a0c35a", words: ["FRENCHS", "GULDEN", "GREY POUPON", "HEINZ"] },
                { name: "VALUATION METHODS", color: "#b0c4ef", words: ["DCF", "COMPARABLE", "ASSET", "EARNINGS"] },
                { name: "WORDS AFTER \"WINDOW\"", color: "#ba81c5", words: ["SHOP", "DRESSING", "PANE", "SEAT"] }
            ]
        },
        {
            categories: [
                { name: "ADVENTURE SPORTS", color: "#f9df6d", words: ["ROCK CLIMBING", "CAVING", "RAFTING", "ZIPLINING"] },
                { name: "PEANUT BUTTER BRANDS", color: "#a0c35a", words: ["JIF", "SKIPPY", "PETER PAN", "SMUCKERS"] },
                { name: "INTEREST TYPES", color: "#b0c4ef", words: ["SIMPLE", "COMPOUND", "FIXED", "VARIABLE"] },
                { name: "___ LINE", color: "#ba81c5", words: ["PUNCH", "HOT", "BREAD", "FRONT"] }
            ]
        },
        {
            categories: [
                { name: "TEAM SPORTS", color: "#f9df6d", words: ["BASKETBALL", "FOOTBALL", "BASEBALL", "RUGBY"] },
                { name: "JELLY BRANDS", color: "#a0c35a", words: ["SMUCKERS", "WELCHS", "KNOTT", "BONNE MAMAN"] },
                { name: "RATIO TYPES", color: "#b0c4ef", words: ["LIQUIDITY", "PROFITABILITY", "DEBT", "EFFICIENCY"] },
                { name: "WORDS BEFORE \"WAVE\"", color: "#ba81c5", words: ["HEAT", "COLD", "MICRO", "SHOCK"] }
            ]
        },
        {
            categories: [
                { name: "INDIVIDUAL SPORTS", color: "#f9df6d", words: ["GOLF", "TENNIS", "BOXING", "SWIMMING"] },
                { name: "HOT SAUCE BRANDS", color: "#a0c35a", words: ["TABASCO", "FRANKS", "SRIRACHA", "CHOLULA"] },
                { name: "COST TYPES", color: "#b0c4ef", words: ["FIXED", "VARIABLE", "SUNK", "OPPORTUNITY"] },
                { name: "___ MOTHER", color: "#ba81c5", words: ["GRAND", "GOD", "BIRTH", "HOUSE"] }
            ]
        },
        {
            categories: [
                { name: "MOTOR SPORTS", color: "#f9df6d", words: ["NASCAR", "F1", "MOTOCROSS", "DRAG RACING"] },
                { name: "TITANIC CHARACTERS", color: "#a0c35a", words: ["JACK", "ROSE", "CAL", "RUTH"] },
                { name: "PRICING STRATEGIES", color: "#b0c4ef", words: ["PENETRATION", "SKIMMING", "PREMIUM", "BUNDLE"] },
                { name: "WORDS AFTER \"LIGHT\"", color: "#ba81c5", words: ["HOUSE", "WEIGHT", "NING", "SPEED"] }
            ]
        },
        {
            categories: [
                { name: "STICK SPORTS", color: "#f9df6d", words: ["HOCKEY", "LACROSSE", "POLO", "FIELD HOCKEY"] },
                { name: "FOREST GUMP CHARACTERS", color: "#a0c35a", words: ["FORREST", "JENNY", "BUBBA", "DAN"] },
                { name: "MARKETING MIX", color: "#b0c4ef", words: ["PRODUCT", "PRICE", "PLACE", "PROMOTION"] },
                { name: "___ FATHER", color: "#ba81c5", words: ["GOD", "GRAND", "FORE", "STEP"] }
            ]
        },
        {
            categories: [
                { name: "BALL SPORTS", color: "#f9df6d", words: ["BASKETBALL", "VOLLEYBALL", "SOCCER", "TENNIS"] },
                { name: "SHAWSHANK CHARACTERS", color: "#a0c35a", words: ["ANDY", "RED", "BROOKS", "WARDEN"] },
                { name: "SWOT ANALYSIS", color: "#b0c4ef", words: ["STRENGTH", "WEAKNESS", "OPPORTUNITY", "THREAT"] },
                { name: "WORDS BEFORE \"JAM\"", color: "#ba81c5", words: ["TRAFFIC", "TOE", "PEARL", "SLAM"] }
            ]
        },
        {
            categories: [
                { name: "DISC SPORTS", color: "#f9df6d", words: ["FRISBEE", "DISC GOLF", "ULTIMATE", "GUTS"] },
                { name: "BBQ SAUCE BRANDS", color: "#a0c35a", words: ["SWEET BABY RAY", "STUBBS", "KC MASTERPIECE", "BULLS-EYE"] },
                { name: "PORTER'S FORCES", color: "#b0c4ef", words: ["RIVALRY", "SUPPLIERS", "BUYERS", "SUBSTITUTES"] },
                { name: "___ DROP", color: "#ba81c5", words: ["NAME", "JAW", "TEAR", "MIC"] }
            ]
        },
        {
            categories: [
                { name: "FIGHTING STYLES", color: "#f9df6d", words: ["BOXING", "KARATE", "JUDO", "KUNG FU"] },
                { name: "MATRIX CHARACTERS", color: "#a0c35a", words: ["NEO", "MORPHEUS", "TRINITY", "AGENT SMITH"] },
                { name: "GROWTH STRATEGIES", color: "#b0c4ef", words: ["ORGANIC", "ACQUISITION", "MERGER", "JOINT VENTURE"] },
                { name: "WORDS AFTER \"POWER\"", color: "#ba81c5", words: ["POINT", "HOUSE", "NAP", "PLAY"] }
            ]
        },
        {
            categories: [
                { name: "STRENGTH SPORTS", color: "#f9df6d", words: ["POWERLIFTING", "WEIGHTLIFTING", "STRONGMAN", "CROSSFIT"] },
                { name: "PASTA SAUCE BRANDS", color: "#a0c35a", words: ["PREGO", "RAGU", "BERTOLLI", "CLASSICO"] },
                { name: "EXIT STRATEGIES", color: "#b0c4ef", words: ["IPO", "ACQUISITION", "MERGER", "LIQUIDATION"] },
                { name: "___ BREAK", color: "#ba81c5", words: ["SPRING", "LUNCH", "COFFEE", "JAIL"] }
            ]
        },
        {
            categories: [
                { name: "FLEXIBILITY SPORTS", color: "#f9df6d", words: ["YOGA", "PILATES", "GYMNASTICS", "DANCE"] },
                { name: "CRACKER BRANDS", color: "#a0c35a", words: ["RITZ", "TRISCUIT", "CHEEZ-IT", "WHEAT THINS"] },
                { name: "COMPETITIVE ADVANTAGES", color: "#b0c4ef", words: ["COST", "DIFFERENTIATION", "FOCUS", "NICHE"] },
                { name: "WORDS BEFORE \"CALL\"", color: "#ba81c5", words: ["WAKE-UP", "CURTAIN", "ROLL", "CLOSE"] }
            ]
        },
        {
            categories: [
                { name: "ENDURANCE SPORTS", color: "#f9df6d", words: ["MARATHON", "TRIATHLON", "CYCLING", "IRONMAN"] },
                { name: "DARK KNIGHT CHARACTERS", color: "#a0c35a", words: ["BRUCE", "ALFRED", "JOKER", "RACHEL"] },
                { name: "DISTRIBUTION CHANNELS", color: "#b0c4ef", words: ["DIRECT", "INDIRECT", "WHOLESALE", "RETAIL"] },
                { name: "___ BOX", color: "#ba81c5", words: ["BLACK", "MUSIC", "JUICE", "PANDORAS"] }
            ]
        },
        {
            categories: [
                { name: "SPEED SPORTS", color: "#f9df6d", words: ["SPRINTING", "SPEED SKATING", "DOWNHILL SKI", "LUGE"] },
                { name: "BREAD BRANDS", color: "#a0c35a", words: ["WONDER", "PEPPERIDGE FARM", "NATURES OWN", "SARA LEE"] },
                { name: "SEGMENTATION TYPES", color: "#b0c4ef", words: ["DEMOGRAPHIC", "GEOGRAPHIC", "PSYCHOGRAPHIC", "BEHAVIORAL"] },
                { name: "WORDS AFTER \"BACK\"", color: "#ba81c5", words: ["BONE", "FIRE", "DOOR", "YARD"] }
            ]
        },
        {
            categories: [
                { name: "AGILITY SPORTS", color: "#f9df6d", words: ["PARKOUR", "FREERUNNING", "OBSTACLE COURSE", "NINJA"] },
                { name: "BUTTER BRANDS", color: "#a0c35a", words: ["LAND O LAKES", "KERRYGOLD", "CHALLENGE", "PLUGRA"] },
                { name: "BRAND ELEMENTS", color: "#b0c4ef", words: ["NAME", "LOGO", "SLOGAN", "MASCOT"] },
                { name: "___ MAIL", color: "#ba81c5", words: ["AIR", "JUNK", "BLACK", "VOICE"] }
            ]
        },
        {
            categories: [
                { name: "BALANCE SPORTS", color: "#f9df6d", words: ["SURFING", "SKATEBOARDING", "SLACKLINING", "SNOWBOARDING"] },
                { name: "MILK BRANDS", color: "#a0c35a", words: ["HORIZON", "ORGANIC VALLEY", "FAIRLIFE", "LACTAID"] },
                { name: "CUSTOMER SEGMENTS", color: "#b0c4ef", words: ["MASS", "NICHE", "DIVERSIFIED", "MULTI-SIDED"] },
                { name: "WORDS BEFORE \"HOUSE\"", color: "#ba81c5", words: ["LIGHT", "DOG", "OPEN", "COFFEE"] }
            ]
        },
        {
            categories: [
                { name: "THROWING SPORTS", color: "#f9df6d", words: ["SHOT PUT", "DISCUS", "JAVELIN", "HAMMER"] },
                { name: "YOGURT BRANDS", color: "#a0c35a", words: ["CHOBANI", "YOPLAIT", "DANNON", "OIKOS"] },
                { name: "VALUE PROPOSITIONS", color: "#b0c4ef", words: ["PERFORMANCE", "CUSTOMIZATION", "DESIGN", "PRICE"] },
                { name: "___ SHOP", color: "#ba81c5", words: ["COFFEE", "PET", "TALK", "CHOP"] }
            ]
        },
        {
            categories: [
                { name: "JUMPING SPORTS", color: "#f9df6d", words: ["HIGH JUMP", "LONG JUMP", "TRIPLE JUMP", "POLE VAULT"] },
                { name: "CHEESE BRANDS", color: "#a0c35a", words: ["KRAFT", "SARGENTO", "TILLAMOOK", "CABOT"] },
                { name: "REVENUE STREAMS", color: "#b0c4ef", words: ["SUBSCRIPTION", "LICENSING", "ADVERTISING", "TRANSACTION"] },
                { name: "WORDS AFTER \"FIRST\"", color: "#ba81c5", words: ["AID", "CLASS", "HAND", "BORN"] }
            ]
        },
        {
            categories: [
                { name: "RHYTHM SPORTS", color: "#f9df6d", words: ["FIGURE SKATING", "RHYTHMIC GYMNASTICS", "DANCE", "SYNCHRONIZED SWIMMING"] },
                { name: "SALSA BRANDS", color: "#a0c35a", words: ["TOSTITOS", "PACE", "CHI-CHIS", "HERDEZ"] },
                { name: "KEY RESOURCES", color: "#b0c4ef", words: ["PHYSICAL", "INTELLECTUAL", "HUMAN", "FINANCIAL"] },
                { name: "___ POOL", color: "#ba81c5", words: ["CAR", "GENE", "DEAD", "MOTOR"] }
            ]
        },
        {
            categories: [
                { name: "SHOOTING SPORTS", color: "#f9df6d", words: ["RIFLE", "PISTOL", "SKEET", "TRAP"] },
                { name: "SOUP BRANDS", color: "#a0c35a", words: ["CAMPBELLS", "PROGRESSO", "AMY'S", "PACIFIC"] },
                { name: "KEY ACTIVITIES", color: "#b0c4ef", words: ["PRODUCTION", "PROBLEM-SOLVING", "PLATFORM", "NETWORK"] },
                { name: "WORDS BEFORE \"ROAD\"", color: "#ba81c5", words: ["DIRT", "RAIL", "HIGH", "SILK"] }
            ]
        },
        {
            categories: [
                { name: "FENCING WEAPONS", color: "#f9df6d", words: ["FOIL", "EPEE", "SABRE", "RAPIER"] },
                { name: "PIZZA CHAINS", color: "#a0c35a", words: ["DOMINOS", "PIZZA HUT", "PAPA JOHNS", "LITTLE CAESARS"] },
                { name: "KEY PARTNERSHIPS", color: "#b0c4ef", words: ["STRATEGIC", "COOPETITION", "JOINT VENTURE", "SUPPLIER"] },
                { name: "___ BELT", color: "#ba81c5", words: ["SEAT", "RUST", "BIBLE", "BLACK"] }
            ]
        },
        {
            categories: [
                { name: "EQUESTRIAN DISCIPLINES", color: "#f9df6d", words: ["DRESSAGE", "JUMPING", "EVENTING", "REINING"] },
                { name: "OFFICE SUPPLIES", color: "#a0c35a", words: ["STAPLER", "PAPERCLIP", "TAPE", "SCISSORS"] },
                { name: "COST STRUCTURE", color: "#b0c4ef", words: ["VALUE-DRIVEN", "COST-DRIVEN", "FIXED", "VARIABLE"] },
                { name: "WORDS AFTER \"BLUE\"", color: "#ba81c5", words: ["PRINT", "BIRD", "TOOTH", "COLLAR"] }
            ]
        },
        {
            categories: [
                { name: "CYCLING EVENTS", color: "#f9df6d", words: ["ROAD RACE", "TIME TRIAL", "TRACK", "BMX"] },
                { name: "BREAKFAST CEREALS", color: "#a0c35a", words: ["CORNFLAKES", "RAISIN BRAN", "WHEATIES", "LIFE"] },
                { name: "BUSINESS MODEL CANVAS", color: "#b0c4ef", words: ["CHANNELS", "RELATIONSHIPS", "SEGMENTS", "PARTNERS"] },
                { name: "___ FINGER", color: "#ba81c5", words: ["BUTTER", "INDEX", "RING", "TRIGGER"] }
            ]
        },
        {
            categories: [
                { name: "SKIING DISCIPLINES", color: "#f9df6d", words: ["SLALOM", "DOWNHILL", "GIANT", "SUPER-G"] },
                { name: "COFFEE CHAINS", color: "#a0c35a", words: ["STARBUCKS", "DUNKIN", "PEETS", "CARIBOU"] },
                { name: "LEAN STARTUP TERMS", color: "#b0c4ef", words: ["MVP", "PIVOT", "ITERATE", "VALIDATE"] },
                { name: "WORDS BEFORE \"BOOK\"", color: "#ba81c5", words: ["HAND", "TEXT", "POCKET", "GUEST"] }
            ]
        },
        {
            categories: [
                { name: "SNOWBOARDING STYLES", color: "#f9df6d", words: ["FREESTYLE", "FREERIDE", "ALPINE", "HALFPIPE"] },
                { name: "DEPARTMENT STORES", color: "#a0c35a", words: ["TARGET", "WALMART", "COSTCO", "KOHLS"] },
                { name: "AGILE TERMS", color: "#b0c4ef", words: ["SPRINT", "SCRUM", "BACKLOG", "STANDUP"] },
                { name: "___ MUSIC", color: "#ba81c5", words: ["FACE", "SHEET", "POP", "COUNTRY"] }
            ]
        },
        {
            categories: [
                { name: "SKATEBOARDING TRICKS", color: "#f9df6d", words: ["KICKFLIP", "OLLIE", "GRIND", "MANUAL"] },
                { name: "DRUGSTORE CHAINS", color: "#a0c35a", words: ["CVS", "WALGREENS", "RITE AID", "DUANE READE"] },
                { name: "SCRUM ROLES", color: "#b0c4ef", words: ["PRODUCT OWNER", "SCRUM MASTER", "DEVELOPER", "STAKEHOLDER"] },
                { name: "WORDS AFTER \"HARD\"", color: "#ba81c5", words: ["WARE", "BALL", "SHIP", "COVER"] }
            ]
        },
        {
            categories: [
                { name: "SURFING MANEUVERS", color: "#f9df6d", words: ["CUTBACK", "BOTTOM TURN", "TUBE RIDE", "AERIAL"] },
                { name: "HARDWARE STORES", color: "#a0c35a", words: ["HOME DEPOT", "LOWES", "ACE", "MENARDS"] },
                { name: "KANBAN ELEMENTS", color: "#b0c4ef", words: ["BOARD", "CARD", "COLUMN", "WIP LIMIT"] },
                { name: "___ BREAD", color: "#ba81c5", words: ["CORN", "BANANA", "SHORT", "WHITE"] }
            ]
        },
        {
            categories: [
                { name: "CLIMBING GRADES", color: "#f9df6d", words: ["BOULDER", "SPORT", "TRAD", "TOP ROPE"] },
                { name: "GROCERY STORES", color: "#a0c35a", words: ["KROGER", "SAFEWAY", "PUBLIX", "TRADER JOES"] },
                { name: "DEVOPS PRACTICES", color: "#b0c4ef", words: ["CI", "CD", "MONITORING", "INFRASTRUCTURE"] },
                { name: "WORDS BEFORE \"RAIN\"", color: "#ba81c5", words: ["ACID", "BRAIN", "PURPLE", "CHAMPAGNE"] }
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

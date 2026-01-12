// Letter Boxed Game - NYT-style letter square puzzle
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'letterboxed-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .letterboxed-game {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 500px;
                margin: 0 auto;
                padding: 1rem;
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
            }

            .letterboxed-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .letterboxed-header h2 {
                font-size: 1.8rem;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .letterboxed-header p {
                color: rgba(255,255,255,0.7);
                margin: 0;
                font-size: 0.9rem;
            }

            .letterboxed-box {
                margin: 1.5rem auto;
                width: 250px;
            }

            .box-side {
                display: flex;
                justify-content: space-around;
                padding: 0.5rem;
            }

            .box-side.top, .box-side.bottom {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }

            .box-middle {
                display: flex;
            }

            .box-side.left, .box-side.right {
                flex-direction: column;
                justify-content: space-around;
                width: 50px;
                padding: 0.5rem;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }

            .box-center {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 150px;
                padding: 1rem;
            }

            .current-word {
                font-size: 1.5rem;
                font-weight: 700;
                letter-spacing: 0.2rem;
                color: #00d9ff;
                text-align: center;
                word-break: break-all;
            }

            .lb-letter {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                background: rgba(255,255,255,0.1);
                color: white;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lb-letter:hover:not(.disabled) {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }

            .lb-letter.used {
                background: rgba(0, 255, 136, 0.3);
                border-color: #00ff88;
            }

            .lb-letter.in-word {
                background: rgba(0, 217, 255, 0.3);
                border-color: #00d9ff;
            }

            .lb-letter.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .letterboxed-progress {
                margin-bottom: 1rem;
            }

            .progress-label {
                text-align: center;
                margin-bottom: 0.5rem;
                color: rgba(255,255,255,0.7);
                font-size: 0.9rem;
            }

            .progress-bar {
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00d9ff, #00ff88);
                transition: width 0.3s ease;
            }

            .letters-display {
                text-align: center;
                font-size: 0.9rem;
                letter-spacing: 0.3rem;
            }

            .letters-display span {
                color: rgba(255,255,255,0.3);
            }

            .letters-display span.used {
                color: #00ff88;
            }

            .letterboxed-words {
                background: rgba(0,0,0,0.2);
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .words-label {
                font-size: 0.85rem;
                color: rgba(255,255,255,0.7);
                margin-bottom: 0.25rem;
            }

            .words-list {
                font-size: 0.9rem;
                word-break: break-word;
            }

            .letterboxed-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .lb-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                background: rgba(255,255,255,0.15);
                color: white;
                transition: all 0.2s ease;
            }

            .lb-btn:hover:not(:disabled) {
                background: rgba(255,255,255,0.25);
                transform: translateY(-2px);
            }

            .lb-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .lb-btn.new-game {
                background: linear-gradient(135deg, #00d9ff 0%, #00ff88 100%);
                color: #1a1a2e;
                width: 100%;
            }

            .letterboxed-win {
                text-align: center;
                padding: 1rem;
                background: rgba(0, 255, 136, 0.2);
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .letterboxed-win h3 {
                font-size: 1.5rem;
                margin: 0 0 0.5rem 0;
                color: #00ff88;
            }

            .letterboxed-win p {
                margin: 0 0 1rem 0;
                color: rgba(255,255,255,0.7);
            }

            .letterboxed-toast {
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
                animation: lbFadeInOut 2s ease;
            }

            @keyframes lbFadeInOut {
                0%, 100% { opacity: 0; }
                10%, 90% { opacity: 1; }
            }

            .letterboxed-back-btn {
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

            .letterboxed-back-btn:hover {
                background: rgba(100, 116, 139, 0.9);
            }

            .letterboxed-game {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // Pre-made puzzles with solutions
    // Each puzzle has 12 letters (3 per side) and known solutions
    const PUZZLES = [
        { letters: [['R', 'I', 'N'], ['G', 'O', 'L'], ['A', 'T', 'E'], ['S', 'U', 'D']], minWords: 3 },
        { letters: [['C', 'A', 'T'], ['H', 'O', 'R'], ['S', 'E', 'N'], ['I', 'U', 'P']], minWords: 3 },
        { letters: [['B', 'L', 'A'], ['N', 'K', 'E'], ['T', 'I', 'S'], ['O', 'R', 'M']], minWords: 3 },
        { letters: [['P', 'L', 'A'], ['Y', 'E', 'R'], ['S', 'T', 'O'], ['M', 'I', 'N']], minWords: 3 },
        { letters: [['W', 'O', 'R'], ['D', 'S', 'E'], ['A', 'L', 'T'], ['I', 'N', 'G']], minWords: 2 },
        { letters: [['F', 'L', 'O'], ['W', 'E', 'R'], ['S', 'A', 'T'], ['I', 'N', 'G']], minWords: 3 },
        { letters: [['J', 'U', 'M'], ['P', 'I', 'N'], ['G', 'O', 'A'], ['T', 'S', 'E']], minWords: 3 },
        { letters: [['D', 'R', 'E'], ['A', 'M', 'S'], ['I', 'N', 'G'], ['O', 'T', 'L']], minWords: 3 },
        { letters: [['H', 'O', 'U'], ['S', 'E', 'R'], ['T', 'A', 'I'], ['L', 'N', 'G']], minWords: 3 },
        { letters: [['C', 'L', 'O'], ['U', 'D', 'S'], ['T', 'R', 'A'], ['I', 'N', 'E']], minWords: 3 }
    ];

    // Common valid words (subset for validation)
    const VALID_WORDS = new Set([
        // 3-letter words
        'ACE', 'ACT', 'ADD', 'AGE', 'AGO', 'AID', 'AIM', 'AIR', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'ARC', 'ARE', 'ARK', 'ARM', 'ART', 'ASH', 'ATE',
        'BAD', 'BAG', 'BAN', 'BAR', 'BAT', 'BED', 'BET', 'BIG', 'BIT', 'BOW', 'BOX', 'BOY', 'BUD', 'BUG', 'BUS', 'BUT', 'BUY',
        'CAB', 'CAN', 'CAP', 'CAR', 'CAT', 'COP', 'COT', 'COW', 'CRY', 'CUB', 'CUP', 'CUT',
        'DAD', 'DAM', 'DAY', 'DEN', 'DEW', 'DID', 'DIG', 'DIM', 'DOC', 'DOE', 'DOG', 'DOT', 'DRY', 'DUB', 'DUD', 'DUE', 'DUG',
        'EAR', 'EAT', 'EEL', 'EGG', 'ELF', 'ELK', 'ELM', 'EMU', 'END', 'ERA', 'EVE', 'EWE', 'EYE',
        'FAD', 'FAN', 'FAR', 'FAT', 'FAX', 'FED', 'FEE', 'FEN', 'FEW', 'FIG', 'FIN', 'FIR', 'FIT', 'FIX', 'FLU', 'FLY', 'FOB', 'FOE', 'FOG', 'FOR', 'FOX', 'FRY', 'FUN', 'FUR',
        'GAB', 'GAG', 'GAL', 'GAP', 'GAS', 'GAY', 'GEL', 'GEM', 'GET', 'GIG', 'GIN', 'GNU', 'GOB', 'GOD', 'GOT', 'GUM', 'GUN', 'GUT', 'GUY', 'GYM',
        'HAD', 'HAM', 'HAS', 'HAT', 'HAY', 'HEM', 'HEN', 'HER', 'HEW', 'HID', 'HIM', 'HIP', 'HIS', 'HIT', 'HOB', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUG', 'HUM', 'HUT',
        'ICE', 'ICY', 'ILL', 'IMP', 'INK', 'INN', 'ION', 'IRE', 'IRK', 'ITS', 'IVY',
        'JAB', 'JAG', 'JAM', 'JAR', 'JAW', 'JAY', 'JET', 'JIG', 'JOB', 'JOG', 'JOT', 'JOY', 'JUG', 'JUT',
        'KEG', 'KEN', 'KEY', 'KID', 'KIN', 'KIT',
        'LAB', 'LAC', 'LAD', 'LAG', 'LAP', 'LAW', 'LAY', 'LEA', 'LED', 'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LIT', 'LOG', 'LOT', 'LOW', 'LUG',
        'MAD', 'MAN', 'MAP', 'MAR', 'MAT', 'MAW', 'MAY', 'MEN', 'MET', 'MID', 'MIX', 'MOB', 'MOM', 'MOP', 'MOW', 'MUD', 'MUG', 'MUM',
        'NAB', 'NAG', 'NAP', 'NAY', 'NET', 'NEW', 'NIL', 'NIT', 'NOD', 'NOR', 'NOT', 'NOW', 'NUB', 'NUN', 'NUT',
        'OAK', 'OAR', 'OAT', 'ODD', 'ODE', 'OFF', 'OFT', 'OHM', 'OIL', 'OLD', 'ONE', 'OPT', 'ORB', 'ORE', 'OUR', 'OUT', 'OWE', 'OWL', 'OWN',
        'PAD', 'PAL', 'PAN', 'PAT', 'PAW', 'PAY', 'PEA', 'PEG', 'PEN', 'PEP', 'PER', 'PET', 'PEW', 'PIE', 'PIG', 'PIN', 'PIT', 'PLY', 'POD', 'POP', 'POT', 'POW', 'PRY', 'PUB', 'PUN', 'PUP', 'PUS', 'PUT',
        'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RAW', 'RAY', 'RED', 'REF', 'RIB', 'RID', 'RIG', 'RIM', 'RIP', 'ROB', 'ROD', 'ROE', 'ROT', 'ROW', 'RUB', 'RUG', 'RUM', 'RUN', 'RUT', 'RYE',
        'SAC', 'SAD', 'SAG', 'SAP', 'SAT', 'SAW', 'SAY', 'SEA', 'SET', 'SEW', 'SHE', 'SHY', 'SIN', 'SIP', 'SIS', 'SIT', 'SIX', 'SKI', 'SKY', 'SLY', 'SOB', 'SOD', 'SON', 'SOP', 'SOT', 'SOW', 'SOY', 'SPA', 'SPY', 'STY', 'SUB', 'SUM', 'SUN', 'SUP',
        'TAB', 'TAD', 'TAG', 'TAN', 'TAP', 'TAR', 'TAT', 'TAX', 'TEA', 'TEN', 'THE', 'THY', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOO', 'TOP', 'TOT', 'TOW', 'TOY', 'TRY', 'TUB', 'TUG', 'TWO',
        'URN', 'USE',
        'VAN', 'VAT', 'VET', 'VIA', 'VIE', 'VOW',
        'WAD', 'WAG', 'WAR', 'WAS', 'WAX', 'WAY', 'WEB', 'WED', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WOE', 'WOK', 'WON', 'WOO', 'WOW',
        'YAK', 'YAM', 'YAP', 'YAW', 'YEA', 'YES', 'YET', 'YEW', 'YIN', 'YOU', 'YOW',
        'ZAP', 'ZEN', 'ZIP', 'ZIT', 'ZOO',
        // 4-letter words
        'ABLE', 'ACHE', 'ACID', 'AGED', 'AIDE', 'AIMS', 'AIRS', 'ALSO', 'ALTO', 'AMID', 'ANTI', 'AREA', 'ARMS', 'ARTS',
        'BAKE', 'BALD', 'BALL', 'BAND', 'BANK', 'BARE', 'BARN', 'BASE', 'BATH', 'BEAD', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEDS', 'BEEF', 'BEEN', 'BEER', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BLOW', 'BLUE', 'BOAT', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BOYS', 'BROW', 'BULK', 'BULL', 'BURN', 'BUSH', 'BUSY', 'BUYS',
        'CAFE', 'CAGE', 'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CANE', 'CARD', 'CARE', 'CARL', 'CARS', 'CASE', 'CASH', 'CAST', 'CATS', 'CAVE', 'CELL', 'CHAT', 'CHEF', 'CHIP', 'CITE', 'CITY', 'CLAN', 'CLAY', 'CLIP', 'CLUB', 'CLUE', 'COAL', 'COAT', 'CODE', 'COIL', 'COIN', 'COLD', 'COLE', 'COME', 'COOK', 'COOL', 'COPE', 'COPY', 'CORD', 'CORE', 'CORN', 'COST', 'CREW', 'CROP', 'CURE', 'CURL',
        'DALE', 'DAME', 'DAMN', 'DAMP', 'DARE', 'DARK', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DEAD', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEER', 'DEMO', 'DENY', 'DESK', 'DIAL', 'DICE', 'DIED', 'DIES', 'DIET', 'DINE', 'DIRE', 'DIRT', 'DISC', 'DISH', 'DISK', 'DOCK', 'DOES', 'DOGS', 'DOLL', 'DOME', 'DONE', 'DOOM', 'DOOR', 'DOSE', 'DOWN', 'DRAG', 'DRAW', 'DREW', 'DRIP', 'DROP', 'DRUG', 'DRUM', 'DUAL', 'DUCK', 'DUDE', 'DULL', 'DUMP', 'DUNE', 'DUNK', 'DUST', 'DUTY',
        'EACH', 'EARL', 'EARN', 'EARS', 'EASE', 'EAST', 'EASY', 'EATS', 'ECHO', 'EDGE', 'EDIT', 'EELS', 'EGGS', 'ELSE', 'EMIT', 'ENDS', 'EPIC', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT', 'EYES',
        'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANS', 'FARE', 'FARM', 'FAST', 'FATE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEES', 'FEET', 'FELL', 'FELT', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FITS', 'FIVE', 'FLAG', 'FLAT', 'FLAW', 'FLED', 'FLEE', 'FLEW', 'FLIP', 'FLOW', 'FOAM', 'FOES', 'FOLD', 'FOLK', 'FOND', 'FONT', 'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORE', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND', 'FURY', 'FUSE',
        'GAIN', 'GALE', 'GAME', 'GANG', 'GAPS', 'GATE', 'GAVE', 'GAZE', 'GEAR', 'GENE', 'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GLOW', 'GLUE', 'GOAL', 'GOAT', 'GODS', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GORE', 'GRAB', 'GRAD', 'GRAM', 'GRAY', 'GREW', 'GREY', 'GRID', 'GRIM', 'GRIN', 'GRIP', 'GROW', 'GULF', 'GUNS', 'GUST', 'GUYS',
        'HACK', 'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARM', 'HART', 'HASH', 'HATE', 'HAUL', 'HAVE', 'HAWK', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HEEL', 'HELD', 'HELL', 'HELM', 'HELP', 'HEMP', 'HENS', 'HERB', 'HERD', 'HERE', 'HERO', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HINT', 'HIRE', 'HITS', 'HOLD', 'HOLE', 'HOLY', 'HOME', 'HOOD', 'HOOK', 'HOPE', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HUGE', 'HULL', 'HUNG', 'HUNT', 'HURT',
        'IDEA', 'IDLE', 'INCH', 'INFO', 'INTO', 'IRON', 'ISLE', 'ITEM',
        'JACK', 'JADE', 'JAIL', 'JANE', 'JAZZ', 'JEAN', 'JETS', 'JOBS', 'JOIN', 'JOKE', 'JOSH', 'JUMP', 'JUNE', 'JUNK', 'JURY', 'JUST',
        'KEEN', 'KEEP', 'KEPT', 'KEYS', 'KICK', 'KIDS', 'KILL', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE', 'KNEW', 'KNIT', 'KNOB', 'KNOT', 'KNOW',
        'LABS', 'LACK', 'LACY', 'LADY', 'LAID', 'LAKE', 'LAMB', 'LAMP', 'LAND', 'LANE', 'LAST', 'LATE', 'LAID', 'LAWN', 'LAWS', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEGS', 'LEND', 'LENS', 'LENT', 'LESS', 'LETS', 'LIAR', 'LICK', 'LIDS', 'LIED', 'LIES', 'LIFE', 'LIFT', 'LIKE', 'LIMB', 'LIME', 'LIMP', 'LINE', 'LINK', 'LION', 'LIPS', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAN', 'LOCK', 'LOFT', 'LOGO', 'LOGS', 'LONE', 'LONG', 'LOOK', 'LOOP', 'LORD', 'LORE', 'LOSE', 'LOSS', 'LOST', 'LOTS', 'LOUD', 'LOVE', 'LUCK', 'LUMP', 'LUNG', 'LURE', 'LURK', 'LUSH', 'LUST',
        'MADE', 'MAID', 'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MAMA', 'MANE', 'MANY', 'MAPS', 'MARE', 'MARK', 'MARS', 'MASK', 'MASS', 'MAST', 'MATE', 'MATH', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MELT', 'MEMO', 'MENU', 'MERE', 'MESH', 'MESS', 'MICE', 'MILD', 'MILE', 'MILK', 'MILL', 'MIND', 'MINE', 'MINT', 'MISS', 'MIST', 'MODE', 'MOLD', 'MOLE', 'MONK', 'MOOD', 'MOON', 'MORE', 'MOSS', 'MOST', 'MOTH', 'MOVE', 'MUCH', 'MULE', 'MUST',
        'NAIL', 'NAME', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEST', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'NUNS',
        'OARS', 'OATS', 'ODDS', 'OILS', 'OKAY', 'OMIT', 'ONCE', 'ONES', 'ONLY', 'ONTO', 'OPEN', 'ORAL', 'OVEN', 'OVER', 'OWED', 'OWES', 'OWNS',
        'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PANS', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PAVE', 'PEAK', 'PEAR', 'PEAS', 'PEAT', 'PEEL', 'PEER', 'PETS', 'PICK', 'PIER', 'PIES', 'PIKE', 'PILE', 'PILL', 'PINE', 'PINK', 'PINT', 'PIPE', 'PITS', 'PITY', 'PLAN', 'PLAY', 'PLEA', 'PLOD', 'PLOT', 'PLOW', 'PLUG', 'PLUM', 'PLUS', 'PODS', 'POEM', 'POET', 'POLE', 'POLL', 'POLO', 'POND', 'PONY', 'POOL', 'POOR', 'POPE', 'POPS', 'PORK', 'PORT', 'POSE', 'POST', 'POUR', 'PRAY', 'PREP', 'PREY', 'PROP', 'PULL', 'PULP', 'PUMP', 'PUNK', 'PURE', 'PUSH',
        'QUIT', 'QUIZ',
        'RACE', 'RACK', 'RAFT', 'RAGE', 'RAID', 'RAIL', 'RAIN', 'RAMP', 'RANG', 'RANK', 'RARE', 'RASH', 'RATE', 'RAVE', 'RAYS', 'READ', 'REAL', 'REAP', 'REAR', 'REEL', 'RELY', 'RENT', 'REST', 'RICE', 'RICH', 'RIDE', 'RIFT', 'RIGS', 'RIMS', 'RING', 'RIOT', 'RIPE', 'RISE', 'RISK', 'ROAD', 'ROAM', 'ROAR', 'ROBE', 'ROCK', 'RODE', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'ROSY', 'ROTS', 'ROUT', 'RUDE', 'RUGS', 'RUIN', 'RULE', 'RUMP', 'RUNS', 'RUSH', 'RUST',
        'SACK', 'SAFE', 'SAGE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SANE', 'SANG', 'SANK', 'SASH', 'SAVE', 'SAYS', 'SEAL', 'SEAM', 'SEAS', 'SEAT', 'SECT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SELF', 'SELL', 'SEMI', 'SEND', 'SENT', 'SEPT', 'SETS', 'SHED', 'SHIN', 'SHIP', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIGH', 'SIGN', 'SILK', 'SING', 'SINK', 'SITE', 'SITS', 'SIZE', 'SKIN', 'SKIP', 'SLAB', 'SLAM', 'SLAP', 'SLAT', 'SLED', 'SLEW', 'SLID', 'SLIM', 'SLIP', 'SLIT', 'SLOT', 'SLOW', 'SLUG', 'SLUM', 'SNAP', 'SNOW', 'SOAK', 'SOAP', 'SOAR', 'SOCK', 'SODA', 'SOFA', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOLO', 'SOME', 'SONG', 'SONS', 'SOON', 'SORE', 'SORT', 'SOUL', 'SOUP', 'SOUR', 'SPAN', 'SPAR', 'SPEC', 'SPED', 'SPIN', 'SPIT', 'SPOT', 'SPUN', 'STAB', 'STAG', 'STAR', 'STAY', 'STEM', 'STEP', 'STEW', 'STIR', 'STOP', 'STOW', 'STUB', 'STUD', 'STUN', 'SUBS', 'SUCH', 'SUIT', 'SUMS', 'SUNG', 'SUNK', 'SURE', 'SURF', 'SWAP', 'SWIM', 'SYNC',
        'TABS', 'TACK', 'TACT', 'TAGS', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TAME', 'TANK', 'TAPE', 'TAPS', 'TART', 'TASK', 'TAXI', 'TEAM', 'TEAR', 'TEAS', 'TECH', 'TEEN', 'TELL', 'TEMP', 'TEND', 'TENS', 'TENT', 'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUS', 'TICK', 'TIDE', 'TIDY', 'TIED', 'TIER', 'TIES', 'TILE', 'TILL', 'TILT', 'TIME', 'TINT', 'TINY', 'TIPS', 'TIRE', 'TOAD', 'TOES', 'TOIL', 'TOLD', 'TOLL', 'TOMB', 'TOME', 'TONE', 'TONS', 'TONY', 'TOOK', 'TOOL', 'TOPS', 'TORE', 'TORN', 'TORT', 'TOSS', 'TOUR', 'TOWN', 'TOYS', 'TRAP', 'TRAY', 'TREE', 'TREK', 'TRIM', 'TRIO', 'TRIP', 'TROD', 'TRUE', 'TUBE', 'TUBS', 'TUCK', 'TUFT', 'TUNA', 'TUNE', 'TURF', 'TURN', 'TWIN', 'TYPE',
        'UNDO', 'UNIT', 'UPON', 'URGE', 'URNS', 'USED', 'USER', 'USES',
        'VAIN', 'VALE', 'VANE', 'VARY', 'VASE', 'VAST', 'VEAL', 'VEIL', 'VEIN', 'VENT', 'VERB', 'VERY', 'VEST', 'VETO', 'VICE', 'VIEW', 'VINE', 'VISA', 'VOID', 'VOLT', 'VOTE',
        'WADE', 'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WAND', 'WANT', 'WARD', 'WARM', 'WARN', 'WARP', 'WARS', 'WARY', 'WASH', 'WATT', 'WAVE', 'WAVY', 'WAXY', 'WAYS', 'WEAK', 'WEAR', 'WEED', 'WEEK', 'WEEP', 'WELD', 'WELL', 'WENT', 'WEPT', 'WERE', 'WEST', 'WHAT', 'WHEN', 'WHIM', 'WHIP', 'WHOM', 'WICK', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WILT', 'WIMP', 'WIND', 'WINE', 'WING', 'WINK', 'WINS', 'WIPE', 'WIRE', 'WISE', 'WISH', 'WITH', 'WITS', 'WOKE', 'WOLF', 'WOMB', 'WOOD', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'WORN', 'WRAP', 'WREN',
        'YARD', 'YARN', 'YEAH', 'YEAR', 'YELL', 'YOUR',
        'ZEAL', 'ZERO', 'ZEST', 'ZINC', 'ZONE', 'ZOOM',
        // 5+ letter words
        'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARMED', 'ASIDE', 'ASSET', 'AVOID', 'AWARD', 'AWARE',
        'BADLY', 'BASIC', 'BASIS', 'BEACH', 'BEAST', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BLOWN', 'BOARD', 'BOOST', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUNCH', 'BURST', 'BUYER',
        'CABIN', 'CABLE', 'CALLS', 'CANDY', 'CARDS', 'CARGO', 'CAROL', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CREEK', 'CRIME', 'CROSS', 'CROWD', 'CROWN',
        'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DEVIL', 'DIARY', 'DIRTY', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAIN', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRIED', 'DRINK', 'DRIVE', 'DROWN', 'DRUGS', 'DRUNK', 'DYING',
        'EAGER', 'EARLY', 'EARTH', 'EATEN', 'EIGHT', 'ELDER', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'ESSAY', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA',
        'FACES', 'FACTS', 'FAILS', 'FAINT', 'FAITH', 'FALSE', 'FAULT', 'FAVOR', 'FEARS', 'FEAST', 'FENCE', 'FEVER', 'FEWER', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FINDS', 'FIRED', 'FIRES', 'FIRST', 'FIXED', 'FLAGS', 'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLIES', 'FLOAT', 'FLOOD', 'FLOOR', 'FLOUR', 'FLOWS', 'FLUID', 'FOCUS', 'FOLKS', 'FORCE', 'FORMS', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRAUD', 'FRESH', 'FRIED', 'FRONT', 'FROST', 'FRUIT', 'FULLY', 'FUNDS', 'FUNNY', 'FUZZY',
        'GAMES', 'GASES', 'GATES', 'GAUGE', 'GIVEN', 'GIVES', 'GLASS', 'GLOBE', 'GLORY', 'GOING', 'GOODS', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRAPH', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GREET', 'GRIEF', 'GRILL', 'GRIND', 'GROSS', 'GROUP', 'GROVE', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT', 'GUSTY',
        'HABIT', 'HANDS', 'HANDY', 'HAPPY', 'HARSH', 'HASN\'T', 'HASTE', 'HAVEN', 'HEADS', 'HEARD', 'HEART', 'HEAVY', 'HELLO', 'HELPS', 'HENCE', 'HILLS', 'HIRED', 'HOLDS', 'HOLES', 'HOMES', 'HONEY', 'HONOR', 'HOPED', 'HOPES', 'HORSE', 'HOTEL', 'HOURS', 'HOUSE', 'HUMAN', 'HUMOR', 'HURRY',
        'IDEAL', 'IDEAS', 'IMAGE', 'IMPLY', 'INDEX', 'INNER', 'INPUT', 'INTER', 'INTRO', 'IRISH', 'ISSUE', 'ITEMS',
        'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'JUICE', 'JUMPS',
        'KEEPS', 'KILLS', 'KINDS', 'KINGS', 'KNEES', 'KNIFE', 'KNOCK', 'KNOWN', 'KNOWS',
        'LABEL', 'LABOR', 'LACKS', 'LAKES', 'LANDS', 'LANES', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEADS', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LEWIS', 'LIGHT', 'LIKED', 'LIKES', 'LIMIT', 'LINES', 'LINKS', 'LISTS', 'LIVES', 'LOANS', 'LOCAL', 'LOCKS', 'LODGE', 'LOGIC', 'LOOKS', 'LOOSE', 'LORDS', 'LOSER', 'LOSES', 'LOVED', 'LOVER', 'LOVES', 'LOWER', 'LOYAL', 'LUCKY', 'LUNCH',
        'MAGIC', 'MAJOR', 'MAKER', 'MAKES', 'MALES', 'MARCH', 'MARKS', 'MARRY', 'MARSH', 'MASON', 'MATCH', 'MAYBE', 'MAYOR', 'MEANS', 'MEANT', 'MEDAL', 'MEDIA', 'MEETS', 'METAL', 'METER', 'MIDST', 'MIGHT', 'MILES', 'MILLS', 'MINDS', 'MINER', 'MINES', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MODES', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVES', 'MOVIE', 'MUSIC',
        'NAKED', 'NAMED', 'NAMES', 'NAILS', 'NAVAL', 'NEEDS', 'NERVE', 'NEVER', 'NEWLY', 'NIGHT', 'NINTH', 'NOBLE', 'NOISE', 'NORTH', 'NOTED', 'NOTES', 'NOVEL', 'NURSE',
        'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'OLIVE', 'OPENS', 'OPERA', 'ORDER', 'ORGAN', 'OTHER', 'OUGHT', 'OUTER', 'OWNED', 'OWNER',
        'PAGES', 'PAINT', 'PAIRS', 'PANEL', 'PANIC', 'PANTS', 'PAPER', 'PARKS', 'PARTS', 'PARTY', 'PATCH', 'PATHS', 'PAUSE', 'PEACE', 'PEARL', 'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PICKS', 'PIECE', 'PILES', 'PILOT', 'PINCH', 'PITCH', 'PIZZA', 'PLACE', 'PLAIN', 'PLANE', 'PLANS', 'PLANT', 'PLATE', 'PLAYS', 'PLAZA', 'PLEAS', 'PLOTS', 'POEMS', 'POINT', 'POKER', 'POLAR', 'POLES', 'POLLS', 'POOLS', 'PORCH', 'PORTS', 'POSED', 'POSTS', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROBE', 'PROOF', 'PROUD', 'PROVE', 'PULLS', 'PUNCH', 'PUPIL', 'PUSHY',
        'QUEST', 'QUEUE', 'QUICK', 'QUIET', 'QUOTE',
        'RACES', 'RADAR', 'RADIO', 'RAILS', 'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RANKS', 'RAPID', 'RATED', 'RATES', 'RATIO', 'REACH', 'READS', 'READY', 'REALM', 'REBEL', 'REFER', 'REIGN', 'RELAX', 'RELAY', 'REPLY', 'RESET', 'RIFLE', 'RIGHT', 'RIGID', 'RINGS', 'RISES', 'RISKS', 'RISKY', 'RIVAL', 'RIVER', 'ROADS', 'ROAST', 'ROBOT', 'ROCKS', 'ROCKY', 'ROGER', 'ROLES', 'ROLLS', 'ROMAN', 'ROOMS', 'ROOTS', 'ROPES', 'ROSES', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RUGBY', 'RUINS', 'RULED', 'RULER', 'RULES', 'RURAL', 'RUSTY',
        'SADLY', 'SAFER', 'SAINT', 'SALAD', 'SALES', 'SANDY', 'SANTA', 'SAUCE', 'SAVED', 'SAVES', 'SCALE', 'SCENE', 'SCENT', 'SCOPE', 'SCORE', 'SCOUT', 'SEATS', 'SEEDS', 'SEEKS', 'SEEMS', 'SEIZE', 'SELLS', 'SENDS', 'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHADE', 'SHAKE', 'SHALL', 'SHAME', 'SHAPE', 'SHARE', 'SHARK', 'SHARP', 'SHEEP', 'SHEER', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHINY', 'SHIPS', 'SHIRT', 'SHOCK', 'SHOOT', 'SHOPS', 'SHORE', 'SHORT', 'SHOTS', 'SHOWN', 'SHOWS', 'SIDES', 'SIEGE', 'SIGHT', 'SIGNS', 'SILLY', 'SIMON', 'SINCE', 'SINGH', 'SITES', 'SIXTH', 'SIXTY', 'SIZED', 'SIZES', 'SKILL', 'SKIRT', 'SLAVE', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE', 'SLOTS', 'SMALL', 'SMART', 'SMELL', 'SMILE', 'SMITH', 'SMOKE', 'SNAKE', 'SNEAK', 'SOLID', 'SOLVE', 'SONGS', 'SORRY', 'SORTS', 'SOULS', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPEED', 'SPELL', 'SPEND', 'SPENT', 'SPICE', 'SPILL', 'SPINE', 'SPITE', 'SPLIT', 'SPOKE', 'SPORT', 'SPOTS', 'SPRAY', 'SQUAD', 'STACK', 'STAFF', 'STAGE', 'STAIN', 'STAKE', 'STAMP', 'STAND', 'STARE', 'STARS', 'START', 'STATE', 'STAYS', 'STEAK', 'STEAL', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STEMS', 'STEPS', 'STEVE', 'STICK', 'STIFF', 'STILL', 'STOCK', 'STOLE', 'STONE', 'STOOD', 'STOOL', 'STOPS', 'STORE', 'STORM', 'STORY', 'STOVE', 'STRAP', 'STRAW', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUITS', 'SUNNY', 'SUPER', 'SURGE', 'SWAMP', 'SWEAR', 'SWEAT', 'SWEEP', 'SWEET', 'SWEPT', 'SWIFT', 'SWING', 'SWISS', 'SWORD',
        'TABLE', 'TAKEN', 'TAKES', 'TALES', 'TALKS', 'TANKS', 'TAPES', 'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEARS', 'TEENS', 'TEETH', 'TELLS', 'TEMPO', 'TENDS', 'TERMS', 'TESTS', 'TEXAS', 'TEXTS', 'THANK', 'THEME', 'THERE', 'THESE', 'THICK', 'THIEF', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGHT', 'TILES', 'TIMES', 'TIRED', 'TIRES', 'TITLE', 'TODAY', 'TOKEN', 'TONES', 'TOOLS', 'TOOTH', 'TOPIC', 'TORCH', 'TOTAL', 'TOUCH', 'TOUGH', 'TOURS', 'TOWER', 'TOWNS', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TRAPS', 'TRASH', 'TREAT', 'TREES', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRIPS', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TUBES', 'TULIP', 'TUNES', 'TURNS', 'TUTOR', 'TWICE', 'TWINS', 'TWIST', 'TYPES',
        'ULTRA', 'UNCLE', 'UNDER', 'UNION', 'UNITS', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USERS', 'USING', 'USUAL',
        'VAGUE', 'VALID', 'VALUE', 'VALVE', 'VENUE', 'VERSE', 'VIDEO', 'VIEWS', 'VIRAL', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VODKA', 'VOICE', 'VOTED', 'VOTER', 'VOTES',
        'WAGES', 'WAGON', 'WAIST', 'WALKS', 'WALLS', 'WANTS', 'WARNS', 'WASTE', 'WATCH', 'WATER', 'WAVES', 'WEEKS', 'WEIRD', 'WELLS', 'WHALE', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDER', 'WIDTH', 'WINDS', 'WINES', 'WINGS', 'WIRES', 'WITCH', 'WIVES', 'WOMAN', 'WOMEN', 'WOODS', 'WORDS', 'WORKS', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRIST', 'WRITE', 'WRONG', 'WROTE',
        'YACHT', 'YARDS', 'YEARS', 'YIELD', 'YOUNG', 'YOURS', 'YOUTH',
        'ZONES',
        // 6+ letter words
        'SIGNAL', 'SINGLE', 'SISTER', 'SITTING', 'SILVER', 'SIMPLE', 'SINGER', 'SLIGHT', 'SLOWER', 'SMILES', 'SMOOTH', 'SNAILS', 'SOCIAL', 'SOFTER', 'SOLDIER', 'SOLUTION', 'SORTED', 'SOUNDS', 'SOURCE', 'SPORTS', 'SPREAD', 'SPRING', 'SQUARE', 'STABLE', 'STANDS', 'STAPLE', 'STARING', 'STARTER', 'STATION', 'STATUE', 'STEAMING', 'STORAGE', 'STORIES', 'STORING', 'STRANGE', 'STREAM', 'STREET', 'STRESS', 'STRICT', 'STRIKE', 'STRING', 'STRONG', 'STRUCK', 'STUDIO', 'STUPID', 'STYLES', 'SUBTLE', 'SUMMER', 'SUNDAY', 'SUNSET', 'SUPPLY', 'SURELY', 'SURFACE', 'SURGEON', 'SURPLUS', 'SURPRISE', 'SURROUND', 'SURVEY', 'SURVIVAL', 'SURVIVE', 'SUSPECT', 'SUSTAIN', 'SWEATER', 'SWEEPING', 'SWIMMING', 'SWINGER', 'SYMBOL', 'SYSTEM',
        'LASTING', 'LARGELY', 'LEADING', 'LEANING', 'LEARNED', 'LEATHER', 'LEAVING', 'LECTURE', 'LENDING', 'LETTING', 'LETTERS', 'LIBERAL', 'LIBERTY', 'LIBRARY', 'LICENSE', 'LIFTING', 'LIGHTER', 'LIGHTLY', 'LIMITED', 'LINKING', 'LISTING', 'LITERAL', 'LITERARY', 'LOCKING', 'LODGING', 'LOGICAL', 'LONGING', 'LOOKING', 'LOOPING', 'LOOSING', 'LOTTERY', 'LOUNGER', 'LOWLAND', 'LOYALTY', 'LUGGAGE', 'LUNCHES',
        'RATING', 'RATION', 'READING', 'REALTOR', 'RELATED', 'RELEASE', 'RESTING', 'RISING', 'ROAMING', 'ROLLING', 'ROOTING', 'ROUTINE', 'RUSTING',
        'TASTING', 'TESTING', 'TIDINGS', 'TOASTED', 'TOASTING', 'TRADING', 'TRAILING', 'TRAINED', 'TRAINER', 'TRAILED', 'TRANSIT', 'TRAVELING', 'TREATED', 'TREATING', 'TRIANGLE', 'TRIBUNE', 'TRICKLE', 'TRIGGER', 'TRILOGY', 'TROUBLE', 'TRUSTED', 'TUITION', 'TURNING', 'TWISTED'
    ]);

    let currentPuzzle = null;
    let usedLetters = new Set();
    let currentWord = '';
    let words = [];
    let lastLetter = null;
    let gameOver = false;
    let letterSides = {}; // Maps letter to side index (0-3)

    function init() {
        startNewGame();
    }

    function startNewGame() {
        currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        usedLetters = new Set();
        currentWord = '';
        words = [];
        lastLetter = null;
        gameOver = false;

        // Build letter-to-side mapping
        letterSides = {};
        currentPuzzle.letters.forEach((side, sideIndex) => {
            side.forEach(letter => {
                letterSides[letter] = sideIndex;
            });
        });

        render();
    }

    function render() {
        const container = document.getElementById('letterboxed-container');
        if (!container) return;

        const allLetters = currentPuzzle.letters.flat();
        const allUsed = allLetters.every(l => usedLetters.has(l));

        container.innerHTML = `
            <div class="letterboxed-game">
                <button class="letterboxed-back-btn" onclick="exitLetterBoxed()">← Back</button>
                <div class="letterboxed-header">
                    <h2>Letter Boxed</h2>
                    <p>Use all letters to make words. Each word must start with the last letter of the previous word. Can't use letters from the same side consecutively.</p>
                </div>

                <div class="letterboxed-box">
                    <div class="box-side top">
                        ${currentPuzzle.letters[0].map(l => letterButton(l)).join('')}
                    </div>
                    <div class="box-middle">
                        <div class="box-side left">
                            ${currentPuzzle.letters[3].map(l => letterButton(l)).join('')}
                        </div>
                        <div class="box-center">
                            <div class="current-word">${currentWord || '&nbsp;'}</div>
                        </div>
                        <div class="box-side right">
                            ${currentPuzzle.letters[1].map(l => letterButton(l)).join('')}
                        </div>
                    </div>
                    <div class="box-side bottom">
                        ${currentPuzzle.letters[2].map(l => letterButton(l)).join('')}
                    </div>
                </div>

                <div class="letterboxed-progress">
                    <div class="progress-label">Letters used: ${usedLetters.size}/${allLetters.length}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(usedLetters.size / allLetters.length) * 100}%"></div>
                    </div>
                    <div class="letters-display">
                        ${allLetters.map(l => `<span class="${usedLetters.has(l) ? 'used' : ''}">${l}</span>`).join('')}
                    </div>
                </div>

                <div class="letterboxed-words">
                    <div class="words-label">Words (${words.length}):</div>
                    <div class="words-list">${words.join(' → ') || 'None yet'}</div>
                </div>

                <div class="letterboxed-actions">
                    <button class="lb-btn" onclick="window.LetterBoxedGame.deleteLetter()" ${currentWord.length === 0 ? 'disabled' : ''}>
                        Delete
                    </button>
                    <button class="lb-btn" onclick="window.LetterBoxedGame.submitWord()" ${currentWord.length < 3 ? 'disabled' : ''}>
                        Enter
                    </button>
                    <button class="lb-btn" onclick="window.LetterBoxedGame.clearWord()">
                        Clear
                    </button>
                </div>

                ${allUsed ? `
                    <div class="letterboxed-win">
                        <h3>Congratulations!</h3>
                        <p>You used all letters in ${words.length} word${words.length !== 1 ? 's' : ''}!</p>
                        <button class="lb-btn" onclick="window.LetterBoxedGame.newGame()">Play Again</button>
                    </div>
                ` : ''}

                <button class="lb-btn new-game" onclick="window.LetterBoxedGame.newGame()">New Puzzle</button>
            </div>
        `;
    }

    function letterButton(letter) {
        const canUse = canUseLetter(letter);
        const isUsed = usedLetters.has(letter);
        const inCurrentWord = currentWord.includes(letter);

        return `
            <button class="lb-letter ${isUsed ? 'used' : ''} ${inCurrentWord ? 'in-word' : ''} ${!canUse ? 'disabled' : ''}"
                    onclick="window.LetterBoxedGame.addLetter('${letter}')"
                    ${!canUse ? 'disabled' : ''}>
                ${letter}
            </button>
        `;
    }

    function canUseLetter(letter) {
        if (currentWord.length === 0) return true;

        // Can't use letter from same side as last letter
        const lastLetterInWord = currentWord[currentWord.length - 1];
        const lastSide = letterSides[lastLetterInWord];
        const thisSide = letterSides[letter];

        return lastSide !== thisSide;
    }

    function addLetter(letter) {
        if (!canUseLetter(letter)) return;
        currentWord += letter;
        render();
    }

    function deleteLetter() {
        if (currentWord.length > 0) {
            currentWord = currentWord.slice(0, -1);
            render();
        }
    }

    function clearWord() {
        currentWord = '';
        render();
    }

    function submitWord() {
        if (currentWord.length < 3) {
            showToast('Words must be at least 3 letters');
            return;
        }

        // Check if word must start with last letter of previous word
        if (words.length > 0) {
            const lastWord = words[words.length - 1];
            const requiredStart = lastWord[lastWord.length - 1];
            if (currentWord[0] !== requiredStart) {
                showToast(`Word must start with "${requiredStart}"`);
                return;
            }
        }

        // Check if valid word
        if (!VALID_WORDS.has(currentWord)) {
            showToast('Not a valid word');
            return;
        }

        // Check if word was already used
        if (words.includes(currentWord)) {
            showToast('Word already used');
            return;
        }

        // Add word
        words.push(currentWord);

        // Mark letters as used
        for (const letter of currentWord) {
            usedLetters.add(letter);
        }

        // Set up for next word (must start with last letter)
        lastLetter = currentWord[currentWord.length - 1];
        currentWord = '';

        render();
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'letterboxed-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function newGame() {
        startNewGame();
    }

    // Expose functions to window
    window.LetterBoxedGame = {
        init,
        addLetter,
        deleteLetter,
        clearWord,
        submitWord,
        newGame
    };

    window.launchLetterBoxed = function() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('letterBoxedGame').style.display = 'block';
        init();
    };

    window.exitLetterBoxed = function() {
        document.getElementById('letterBoxedGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    };
})();

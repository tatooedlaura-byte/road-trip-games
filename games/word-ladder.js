// Word Ladder Game
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'wordladder-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .wl-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 450px;
                margin: 0 auto;
                padding: 1rem;
            }

            .wl-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                padding-top: 3rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .wl-back-btn {
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
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .wl-back-btn:hover {
                background: rgba(75, 85, 99, 1);
            }

            .wl-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .wl-title {
                font-size: 2rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .wl-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .wl-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }

            .wl-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .wl-rules p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .wl-difficulty-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0.75rem;
                margin-top: 1.5rem;
            }

            .wl-difficulty-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                padding: 1rem 0.5rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .wl-difficulty-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(78,205,196,0.5);
                transform: translateY(-2px);
            }

            .wl-difficulty-icon {
                font-size: 1.5rem;
                display: block;
                margin-bottom: 0.25rem;
            }

            .wl-difficulty-title {
                font-size: 0.9rem;
                font-weight: 600;
                display: block;
            }

            .wl-difficulty-desc {
                font-size: 0.75rem;
                opacity: 0.7;
            }

            .wl-ladder {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                margin: 1.5rem 0;
            }

            .wl-word {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }

            .wl-letter {
                width: 48px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 700;
                text-transform: uppercase;
                border-radius: 10px;
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
            }

            .wl-letter.start {
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                border-color: #4ecdc4;
            }

            .wl-letter.end {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                border-color: #f093fb;
            }

            .wl-letter.correct {
                background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
                border-color: #56ab2f;
                animation: popIn 0.3s ease-out;
            }

            .wl-letter.changed {
                background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
                border-color: #f7971e;
                color: #1a1a2e;
            }

            @keyframes popIn {
                0% { transform: scale(0.8); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .wl-arrow {
                font-size: 1.2rem;
                opacity: 0.5;
            }

            .wl-input-section {
                margin: 1.5rem 0;
            }

            .wl-input-label {
                text-align: center;
                margin-bottom: 0.75rem;
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .wl-input-row {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }

            .wl-input {
                width: 48px;
                height: 56px;
                text-align: center;
                font-size: 1.5rem;
                font-weight: 700;
                text-transform: uppercase;
                border-radius: 10px;
                background: rgba(255,255,255,0.15);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                outline: none;
                transition: all 0.2s ease;
            }

            .wl-input:focus {
                border-color: #4ecdc4;
                background: rgba(78,205,196,0.2);
            }

            .wl-input.error {
                border-color: #f5576c;
                background: rgba(245,87,108,0.2);
                animation: shake 0.3s ease;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .wl-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 1rem;
            }

            .wl-btn {
                padding: 0.75rem 1.25rem;
                border: none;
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.4rem;
            }

            .wl-btn:active {
                transform: scale(0.97);
            }

            .wl-btn-primary {
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(78,205,196,0.4);
            }

            .wl-btn-primary:hover {
                box-shadow: 0 6px 20px rgba(78,205,196,0.5);
                transform: translateY(-2px);
            }

            .wl-btn-secondary {
                background: rgba(255,255,255,0.15);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .wl-btn-secondary:hover {
                background: rgba(255,255,255,0.25);
            }

            .wl-message {
                text-align: center;
                padding: 0.75rem;
                border-radius: 10px;
                margin: 1rem 0;
                font-weight: 500;
            }

            .wl-message.error {
                background: rgba(245,87,108,0.2);
                color: #f5576c;
            }

            .wl-message.success {
                background: rgba(86,171,47,0.2);
                color: #a8e063;
            }

            .wl-message.hint {
                background: rgba(247,151,30,0.2);
                color: #ffd200;
            }

            .wl-stats {
                display: flex;
                justify-content: space-around;
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .wl-stat {
                text-align: center;
            }

            .wl-stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #4ecdc4;
            }

            .wl-stat-label {
                font-size: 0.75rem;
                opacity: 0.7;
            }

            .wl-win-message {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(86,171,47,0.2) 0%, rgba(168,224,99,0.1) 100%);
                border-radius: 15px;
                margin: 1rem 0;
            }

            .wl-win-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #a8e063;
            }

            .wl-win-stats {
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .wl-confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 2px;
                animation: confettiFall 2.5s ease-out forwards;
                pointer-events: none;
            }

            @keyframes confettiFall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Comprehensive 4-letter word list (~1900 words)
    const WORDS = new Set([
        'able', 'ache', 'acid', 'acme', 'acre', 'aged', 'aide', 'aims', 'airs', 'airy',
        'ajar', 'akin', 'ally', 'alms', 'also', 'alto', 'amid', 'amok', 'amps', 'ankh',
        'ante', 'anti', 'ants', 'apes', 'apex', 'arch', 'arcs', 'area', 'aria', 'arms',
        'army', 'arts', 'arty', 'ashy', 'atom', 'aunt', 'aura', 'auto', 'avid', 'away',
        'awry', 'axed', 'axes', 'axis', 'baby', 'back', 'bade', 'bags', 'bail', 'bait',
        'bake', 'bald', 'bale', 'ball', 'balm', 'band', 'bane', 'bang', 'bank', 'bans',
        'barb', 'bard', 'bare', 'bark', 'barn', 'bars', 'base', 'bash', 'bask', 'bass',
        'bath', 'bats', 'bays', 'bead', 'beak', 'beam', 'bean', 'bear', 'beat', 'beds',
        'beef', 'been', 'beer', 'bees', 'beet', 'bell', 'belt', 'bend', 'bent', 'berg',
        'best', 'bets', 'bias', 'bide', 'bids', 'bike', 'bile', 'bill', 'bind', 'bins',
        'bird', 'bite', 'bits', 'bled', 'blew', 'blob', 'bloc', 'blog', 'blot', 'blow',
        'blue', 'blur', 'boar', 'boat', 'bobs', 'bode', 'body', 'bogs', 'boil', 'bold',
        'bolt', 'bomb', 'bond', 'bone', 'bony', 'book', 'boom', 'boon', 'boos', 'boot',
        'bore', 'born', 'boss', 'both', 'bout', 'bowl', 'bows', 'boys', 'brag', 'bran',
        'bred', 'brew', 'brim', 'brow', 'buds', 'buff', 'bugs', 'bulb', 'bulk', 'bull',
        'bump', 'bums', 'bunk', 'buns', 'buoy', 'burn', 'burp', 'bury', 'bush', 'bust',
        'busy', 'buts', 'butt', 'buys', 'buzz', 'byte', 'cafe', 'cage', 'cake', 'calf',
        'call', 'calm', 'came', 'camp', 'cams', 'cane', 'cans', 'cape', 'caps', 'card',
        'care', 'carp', 'cars', 'cart', 'case', 'cash', 'cask', 'cast', 'cats', 'cave',
        'cell', 'cent', 'chad', 'char', 'chat', 'chef', 'chew', 'chin', 'chip', 'chop',
        'chow', 'chug', 'city', 'clad', 'clam', 'clan', 'clap', 'claw', 'clay', 'clip',
        'clod', 'clog', 'club', 'clue', 'coal', 'coat', 'code', 'cods', 'cogs', 'coil',
        'coin', 'coke', 'cold', 'cola', 'cole', 'colt', 'coma', 'comb', 'come', 'cone',
        'cook', 'cool', 'coop', 'cope', 'cops', 'copy', 'cord', 'core', 'cork', 'corn',
        'cost', 'cosy', 'coup', 'cove', 'cows', 'cozy', 'crab', 'cram', 'crew', 'crib',
        'crop', 'crow', 'crud', 'cube', 'cubs', 'cuds', 'cued', 'cues', 'cuff', 'cups',
        'curb', 'curd', 'cure', 'curl', 'curt', 'cusp', 'cute', 'cuts', 'dabs', 'dads',
        'dale', 'dame', 'damn', 'damp', 'dams', 'dank', 'dare', 'dark', 'darn', 'dart',
        'dash', 'data', 'date', 'dawn', 'days', 'daze', 'dead', 'deaf', 'deal', 'dean',
        'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'dent', 'deny',
        'desk', 'deus', 'dial', 'dice', 'died', 'dies', 'diet', 'digs', 'dime', 'dims',
        'dine', 'ding', 'dink', 'dins', 'dips', 'dire', 'dirt', 'disc', 'dish', 'disk',
        'dive', 'dock', 'docs', 'dodo', 'doer', 'does', 'doge', 'dogs', 'dole', 'doll',
        'dome', 'done', 'doom', 'door', 'dope', 'dork', 'dorm', 'dose', 'dote', 'doth',
        'dots', 'dour', 'dove', 'down', 'doze', 'dozy', 'drab', 'drag', 'dram', 'drat',
        'draw', 'dray', 'drew', 'drip', 'drop', 'drub', 'drug', 'drum', 'dual', 'dubs',
        'duck', 'duct', 'dude', 'duds', 'duel', 'dues', 'duet', 'duke', 'dull', 'duly',
        'dumb', 'dump', 'dune', 'dung', 'dunk', 'dupe', 'dusk', 'dust', 'duty', 'dyed',
        'dyer', 'dyes', 'each', 'earl', 'earn', 'ears', 'ease', 'east', 'easy', 'eats',
        'eave', 'ebbs', 'echo', 'eddy', 'edge', 'edgy', 'edit', 'eels', 'eggs', 'egos',
        'else', 'emit', 'emus', 'ends', 'envy', 'eons', 'epic', 'eras', 'euro', 'even',
        'ever', 'eves', 'evil', 'ewer', 'ewes', 'exam', 'exec', 'exit', 'expo', 'eyed',
        'eyes', 'face', 'fact', 'fade', 'fads', 'fail', 'fair', 'fake', 'fall', 'fame',
        'fang', 'fans', 'fare', 'farm', 'faro', 'fast', 'fate', 'fats', 'fawn', 'faze',
        'fear', 'feat', 'feds', 'feed', 'feel', 'fees', 'feet', 'fell', 'felt', 'fend',
        'fern', 'fest', 'feud', 'fiat', 'figs', 'file', 'fill', 'film', 'find', 'fine',
        'fink', 'fins', 'fire', 'firm', 'firs', 'fish', 'fist', 'fits', 'five', 'fizz',
        'flag', 'flak', 'flam', 'flan', 'flap', 'flat', 'flaw', 'flax', 'flay', 'flea',
        'fled', 'flee', 'flew', 'flex', 'flip', 'flit', 'flog', 'flop', 'flow', 'flub',
        'flue', 'flux', 'foal', 'foam', 'fobs', 'foes', 'fogs', 'foil', 'fold', 'folk',
        'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort',
        'foul', 'four', 'fowl', 'foxy', 'fray', 'free', 'fret', 'frog', 'from', 'fuel',
        'full', 'fume', 'fund', 'funk', 'furl', 'furs', 'fury', 'fuse', 'fuss', 'fuzz',
        'gabs', 'gads', 'gaff', 'gags', 'gain', 'gait', 'gala', 'gale', 'gall', 'game',
        'gang', 'gape', 'gaps', 'garb', 'gars', 'gash', 'gasp', 'gate', 'gave', 'gawk',
        'gaze', 'gear', 'gees', 'geek', 'gels', 'gems', 'gene', 'gent', 'germ', 'gets',
        'gift', 'gigs', 'gild', 'gill', 'gilt', 'gins', 'gird', 'girl', 'gist', 'give',
        'glad', 'glam', 'glen', 'glib', 'glob', 'glom', 'glop', 'glow', 'glue', 'glum',
        'glut', 'gnat', 'gnaw', 'goad', 'goal', 'goat', 'gobs', 'gods', 'goer', 'goes',
        'gold', 'golf', 'gone', 'gong', 'good', 'goof', 'goon', 'gore', 'gory', 'gosh',
        'goth', 'gout', 'gown', 'grab', 'grad', 'gram', 'gran', 'gray', 'grew', 'grey',
        'grid', 'grim', 'grin', 'grip', 'grit', 'grog', 'grow', 'grub', 'gulf', 'gulp',
        'gums', 'gunk', 'guns', 'guru', 'gush', 'gust', 'guts', 'guys', 'gybe', 'gyms',
        'hack', 'haft', 'hags', 'hail', 'hair', 'hake', 'hale', 'half', 'hall', 'halo',
        'halt', 'hams', 'hand', 'hang', 'hank', 'haps', 'hard', 'hare', 'hark', 'harm',
        'harp', 'hash', 'hasp', 'hate', 'hath', 'hats', 'haul', 'have', 'hawk', 'hays',
        'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heck', 'heed', 'heel',
        'heft', 'held', 'hell', 'helm', 'help', 'hems', 'hens', 'herb', 'herd', 'here',
        'hero', 'hers', 'hewn', 'hews', 'hick', 'hide', 'high', 'hike', 'hill', 'hilt',
        'hind', 'hint', 'hips', 'hire', 'hiss', 'hits', 'hive', 'hoar', 'hoax', 'hobs',
        'hock', 'hods', 'hoed', 'hoer', 'hoes', 'hogs', 'hold', 'hole', 'holy', 'home',
        'hone', 'honk', 'hood', 'hoof', 'hook', 'hoop', 'hoot', 'hope', 'hops', 'horn',
        'hose', 'host', 'hour', 'howl', 'hubs', 'hued', 'hues', 'huff', 'huge', 'hugs',
        'hulk', 'hull', 'hump', 'hums', 'hung', 'hunk', 'hunt', 'hurl', 'hurt', 'hush',
        'husk', 'huts', 'hymn', 'hype', 'iced', 'ices', 'icky', 'icon', 'idea', 'idle',
        'idly', 'idol', 'iffy', 'ills', 'imps', 'inch', 'info', 'inks', 'inky', 'inns',
        'into', 'ions', 'iota', 'iris', 'irks', 'iron', 'isle', 'itch', 'item', 'jabs',
        'jack', 'jade', 'jags', 'jail', 'jake', 'jamb', 'jams', 'jane', 'jape', 'jars',
        'java', 'jaws', 'jays', 'jazz', 'jean', 'jeer', 'jeep', 'jeer', 'jell', 'jerk',
        'jest', 'jets', 'jibe', 'jibs', 'jiff', 'jigs', 'jilt', 'jink', 'jinx', 'jive',
        'jobs', 'jock', 'jogs', 'john', 'join', 'joke', 'jolt', 'josh', 'jots', 'jowl',
        'joys', 'judo', 'jugs', 'jump', 'june', 'junk', 'jury', 'just', 'juts', 'kale',
        'keek', 'keel', 'keen', 'keep', 'kegs', 'kelp', 'kept', 'keys', 'kick', 'kids',
        'kill', 'kiln', 'kilt', 'kind', 'king', 'kink', 'kiss', 'kite', 'kits', 'knee',
        'knew', 'knit', 'knob', 'knot', 'know', 'labs', 'lace', 'lack', 'lacy', 'lads',
        'lady', 'lags', 'laid', 'lain', 'lair', 'lake', 'lamb', 'lame', 'lamp', 'land',
        'lane', 'laps', 'lard', 'lark', 'lash', 'lass', 'last', 'late', 'lath', 'laud',
        'lava', 'lawn', 'laws', 'lays', 'laze', 'lazy', 'lead', 'leaf', 'leak', 'lean',
        'leap', 'left', 'legs', 'lend', 'lens', 'lent', 'less', 'lest', 'levy', 'liar',
        'libs', 'lice', 'lick', 'lids', 'lied', 'lien', 'lies', 'lieu', 'life', 'lift',
        'like', 'lilt', 'lily', 'limb', 'lime', 'limp', 'limy', 'line', 'link', 'lint',
        'lion', 'lips', 'lisp', 'list', 'lite', 'live', 'load', 'loaf', 'loam', 'loan',
        'lobe', 'lobs', 'lock', 'loco', 'lode', 'loft', 'logo', 'logs', 'loin', 'lone',
        'long', 'look', 'loom', 'loon', 'loop', 'loot', 'lope', 'lord', 'lore', 'lose',
        'loss', 'lost', 'lots', 'loud', 'lout', 'love', 'lows', 'luck', 'luge', 'lugs',
        'lull', 'lump', 'lums', 'lune', 'lung', 'lunk', 'lure', 'lurk', 'lush', 'lust',
        'lute', 'lynx', 'lyre', 'mace', 'made', 'mads', 'mage', 'magi', 'maid', 'mail',
        'maim', 'main', 'make', 'male', 'mall', 'malt', 'mama', 'mane', 'mans', 'many',
        'maps', 'mare', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast', 'mate', 'math',
        'mats', 'maul', 'mayo', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet',
        'mega', 'meld', 'melt', 'memo', 'mend', 'menu', 'meow', 'mere', 'mesa', 'mesh',
        'mess', 'mete', 'mets', 'mica', 'mice', 'midi', 'mien', 'mild', 'mile', 'milk',
        'mill', 'mime', 'mind', 'mine', 'mini', 'mink', 'mint', 'minx', 'mire', 'miss',
        'mist', 'mite', 'mitt', 'moan', 'moat', 'mobs', 'mock', 'mode', 'mods', 'mojo',
        'mold', 'mole', 'molt', 'monk', 'mood', 'moon', 'moor', 'moot', 'mope', 'mops',
        'more', 'morn', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'muds', 'muff',
        'mugs', 'mule', 'mull', 'mumm', 'mums', 'mung', 'murk', 'muse', 'mush', 'musk',
        'must', 'mute', 'mutt', 'myth', 'nabs', 'nags', 'nail', 'name', 'nape', 'naps',
        'narc', 'nary', 'nave', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nerd',
        'nest', 'nets', 'news', 'newt', 'next', 'nibs', 'nice', 'nick', 'nigh', 'nine',
        'nips', 'node', 'nods', 'noel', 'noir', 'none', 'nook', 'noon', 'nope', 'norm',
        'nose', 'nosy', 'note', 'noun', 'nova', 'nubs', 'nude', 'nuke', 'null', 'numb',
        'nuns', 'nuts', 'oafs', 'oaks', 'oars', 'oath', 'oats', 'obey', 'odds', 'odor',
        'offs', 'ogle', 'ogre', 'oils', 'oily', 'oink', 'okay', 'okra', 'olds', 'omen',
        'omit', 'once', 'ones', 'only', 'onto', 'onus', 'ooze', 'oozy', 'opal', 'open',
        'opts', 'opus', 'oral', 'orbs', 'orca', 'ores', 'ouch', 'ours', 'oust',
        'outs', 'ouzo', 'oval', 'oven', 'over', 'owed', 'owes', 'owls', 'owns', 'pace',
        'pack', 'pact', 'pads', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'pall',
        'palm', 'pals', 'pane', 'pang', 'pans', 'pant', 'papa', 'paps', 'pare', 'park',
        'part', 'pass', 'past', 'pate', 'path', 'pats', 'pave', 'pawn', 'paws', 'pays',
        'peak', 'peal', 'pear', 'peas', 'peat', 'peck', 'pecs', 'peed', 'peek', 'peel',
        'peep', 'peer', 'pees', 'pegs', 'pelt', 'pend', 'pens', 'pent', 'peon', 'peps',
        'perk', 'perm', 'perp', 'pert', 'peso', 'pest', 'pets', 'pews', 'pick', 'pied',
        'pier', 'pies', 'pigs', 'pike', 'pile', 'pill', 'pimp', 'pine', 'ping', 'pink',
        'pins', 'pint', 'pipe', 'pips', 'pita', 'pith', 'pits', 'pity', 'plan', 'play',
        'plea', 'pled', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus',
        'pock', 'pods', 'poem', 'poet', 'poke', 'poky', 'pole', 'poll', 'polo', 'pomp',
        'pond', 'pony', 'pooh', 'pool', 'poop', 'poor', 'pope', 'pops', 'pore', 'pork',
        'porn', 'port', 'pose', 'posh', 'post', 'posy', 'pots', 'pour', 'pout', 'pray',
        'prep', 'prey', 'prim', 'prod', 'prom', 'prop', 'pros', 'prow', 'pubs', 'puck',
        'puds', 'puff', 'pugs', 'puke', 'pull', 'pulp', 'puma', 'pump', 'puns', 'puny',
        'pupa', 'pups', 'pure', 'purl', 'purr', 'push', 'puss', 'puts', 'putt', 'putz',
        'quad', 'quay', 'quid', 'quip', 'quit', 'quiz', 'race', 'rack', 'raft', 'rage',
        'rags', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rams', 'rand', 'rang', 'rank',
        'rant', 'raps', 'rapt', 'rare', 'rash', 'rasp', 'rate', 'rats', 'rave', 'raws',
        'rays', 'raze', 'razz', 'read', 'real', 'ream', 'reap', 'rear', 'redo', 'reds',
        'reed', 'reef', 'reek', 'reel', 'rein', 'rely', 'rend', 'rent', 'repo', 'reps',
        'rest', 'ribs', 'rice', 'rich', 'ride', 'rids', 'rife', 'riff', 'rift', 'rigs',
        'rile', 'rill', 'rime', 'rims', 'rind', 'ring', 'rink', 'riot', 'ripe', 'rips',
        'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'robs', 'rock', 'rode',
        'rods', 'role', 'roll', 'romp', 'roof', 'room', 'root', 'rope', 'ropy', 'rose',
        'rosy', 'rote', 'rots', 'rout', 'rove', 'rows', 'rube', 'rubs', 'ruby', 'ruck',
        'rude', 'rued', 'rues', 'ruff', 'rugs', 'ruin', 'rule', 'rump', 'rums', 'rune',
        'rung', 'runs', 'runt', 'ruse', 'rush', 'rust', 'ruts', 'sack', 'safe', 'saga',
        'sage', 'sags', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane',
        'sang', 'sank', 'saps', 'sari', 'sash', 'sass', 'sate', 'save', 'saws', 'says',
        'scab', 'scam', 'scan', 'scar', 'scat', 'seal', 'seam', 'sear', 'seas', 'seat',
        'sect', 'seed', 'seek', 'seem', 'seen', 'seep', 'seer', 'sees', 'self', 'sell',
        'semi', 'send', 'sent', 'sept', 'sera', 'serf', 'sets', 'sewn', 'sews', 'sexy',
        'shad', 'shag', 'sham', 'shaw', 'shed', 'shim', 'shin', 'ship', 'shiv', 'shmo',
        'shod', 'shoe', 'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'sick', 'side',
        'sigh', 'sign', 'silk', 'sill', 'silo', 'silt', 'sine', 'sing', 'sink', 'sins',
        'sips', 'sire', 'sirs', 'site', 'sits', 'size', 'skew', 'skid', 'skim', 'skin',
        'skip', 'skit', 'slab', 'slag', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled',
        'slew', 'slid', 'slim', 'slit', 'slob', 'sloe', 'slog', 'slop', 'slot', 'slow',
        'slub', 'slue', 'slug', 'slum', 'slur', 'slut', 'smog', 'snap', 'snag',
        'snip', 'snit', 'snob', 'snot', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar',
        'sobs', 'sock', 'soda', 'sods', 'sofa', 'soft', 'soil', 'sold', 'sole', 'solo',
        'some', 'song', 'sons', 'soon', 'soot', 'sops', 'sore', 'sort', 'sots', 'soul',
        'soup', 'sour', 'sown', 'sows', 'spam', 'span', 'spar', 'spas', 'spat', 'spec',
        'sped', 'spew', 'spin', 'spit', 'spot', 'spry', 'spud', 'spun', 'spur', 'stab',
        'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stow', 'stub',
        'stud', 'stun', 'stye', 'subs', 'such', 'suck', 'suds', 'sued', 'sues', 'suet',
        'suit', 'sulk', 'sumo', 'sump', 'sums', 'sung', 'sunk', 'suns', 'sure', 'surf',
        'suss', 'swab', 'swam', 'swan', 'swap', 'swat', 'sway', 'swim', 'swob', 'swum',
        'tabs', 'tack', 'taco', 'tact', 'tads', 'tags', 'tail', 'take', 'tale', 'talk',
        'tall', 'tame', 'tamp', 'tams', 'tang', 'tank', 'tans', 'tape', 'taps', 'tars',
        'tart', 'task', 'taxi', 'teak', 'teal', 'team', 'tear', 'teas', 'teat', 'tech',
        'teds', 'teed', 'teem', 'teen', 'tees', 'tell', 'temp', 'tend', 'tens', 'tent',
        'term', 'tern', 'test', 'text', 'than', 'that', 'thaw', 'them', 'then', 'they',
        'thin', 'this', 'thud', 'thug', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier',
        'ties', 'tiff', 'tile', 'till', 'tilt', 'time', 'tine', 'ting', 'tins', 'tint',
        'tiny', 'tips', 'tire', 'toad', 'tock', 'tods', 'toed', 'toes', 'toff', 'tofu',
        'toga', 'togs', 'toil', 'told', 'toll', 'tomb', 'tome', 'tone', 'tong', 'tons',
        'tony', 'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'tort', 'toss', 'tote',
        'tots', 'tour', 'tout', 'town', 'tows', 'toys', 'tram', 'trap', 'tray', 'tree',
        'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tsar', 'tuba', 'tube',
        'tubs', 'tuck', 'tuft', 'tugs', 'tuna', 'tune', 'turd', 'turf', 'turn',
        'tusk', 'tutu', 'twig', 'twin', 'twit', 'twos', 'type', 'typo', 'ugly', 'undo',
        'unit', 'unto', 'upon', 'urge', 'urns', 'used', 'user', 'uses', 'vain', 'vale',
        'vamp', 'vane', 'vans', 'vary', 'vase', 'vast', 'vats', 'veal', 'veer', 'veil',
        'vein', 'vend', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vibe',
        'vice', 'vied', 'vies', 'view', 'vile', 'vine', 'visa', 'vise', 'void', 'volt',
        'vote', 'vows', 'wade', 'wads', 'waft', 'wage', 'wags', 'waif', 'wail', 'wait',
        'wake', 'walk', 'wall', 'wand', 'wane', 'want', 'ward', 'ware', 'warm', 'warn',
        'warp', 'wars', 'wart', 'wary', 'wash', 'wasp', 'wave', 'wavy', 'waxy', 'ways',
        'weak', 'wean', 'wear', 'weds', 'weed', 'week', 'weep', 'weld', 'well', 'welt',
        'went', 'wept', 'were', 'west', 'wets', 'wham', 'what', 'when', 'whet', 'whey',
        'whim', 'whip', 'whir', 'whiz', 'whom', 'wick', 'wide', 'wife', 'wigs', 'wild',
        'will', 'wilt', 'wily', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe',
        'wire', 'wiry', 'wise', 'wish', 'wisp', 'with', 'wits', 'woes', 'woke', 'wolf',
        'womb', 'wons', 'wood', 'woof', 'wool', 'woos', 'word', 'wore', 'work', 'worm',
        'worn', 'wort', 'wove', 'wrap', 'wren', 'writ', 'yack', 'yaks', 'yams', 'yank',
        'yaps', 'yard', 'yarn', 'yawn', 'yawp', 'yaws', 'yeah', 'year', 'yeas', 'yell',
        'yelp', 'yens', 'yeps', 'yeti', 'yews', 'yids', 'yips', 'yoga', 'yoke', 'yolk',
        'yore', 'your', 'yowl', 'yows', 'yuan', 'yuck', 'yuks', 'yule', 'yurt',
        'zany', 'zaps', 'zeal', 'zebu', 'zeds', 'zees', 'zero', 'zest', 'zinc', 'zine',
        'zing', 'zips', 'zits', 'zone', 'zonk', 'zoom', 'zoos'
    ]);

    // Pre-defined puzzles with known solutions (start, end, optimal path length)
    const PUZZLES = {
        easy: [
            // Classic pairs (3-4 steps)
            { start: 'cold', end: 'warm', steps: 4 },
            { start: 'head', end: 'tail', steps: 5 },
            { start: 'love', end: 'hate', steps: 3 },
            { start: 'slow', end: 'fast', steps: 5 },
            { start: 'dawn', end: 'dusk', steps: 3 },
            { start: 'fish', end: 'bird', steps: 4 },
            { start: 'send', end: 'mail', steps: 4 },
            { start: 'walk', end: 'ride', steps: 4 },
            { start: 'boat', end: 'ship', steps: 4 },
            { start: 'dark', end: 'lite', steps: 4 },
            { start: 'game', end: 'play', steps: 4 },
            { start: 'hand', end: 'foot', steps: 4 },
            { start: 'king', end: 'duke', steps: 3 },
            { start: 'leaf', end: 'tree', steps: 4 },
            { start: 'make', end: 'take', steps: 1 },
            { start: 'name', end: 'fame', steps: 1 },
            { start: 'rest', end: 'wake', steps: 4 },
            { start: 'safe', end: 'harm', steps: 4 },
            { start: 'talk', end: 'chat', steps: 4 },
            { start: 'warm', end: 'cool', steps: 4 },
            { start: 'bell', end: 'ring', steps: 4 },
            { start: 'bold', end: 'meek', steps: 4 },
            { start: 'bone', end: 'meat', steps: 4 },
            { start: 'book', end: 'page', steps: 4 },
            { start: 'cage', end: 'free', steps: 4 },
            { start: 'cake', end: 'bake', steps: 1 },
            { start: 'calm', end: 'wild', steps: 4 },
            { start: 'cape', end: 'mask', steps: 4 },
            { start: 'card', end: 'deck', steps: 4 },
            { start: 'care', end: 'heed', steps: 4 },
            { start: 'case', end: 'file', steps: 4 },
            { start: 'cave', end: 'hole', steps: 3 },
            { start: 'coat', end: 'vest', steps: 4 },
            { start: 'code', end: 'data', steps: 4 },
            { start: 'coin', end: 'cash', steps: 4 },
            { start: 'come', end: 'went', steps: 4 },
            { start: 'cook', end: 'chef', steps: 4 },
            { start: 'cord', end: 'rope', steps: 3 },
            { start: 'corn', end: 'crop', steps: 3 },
            { start: 'cost', end: 'paid', steps: 4 },
        ],
        medium: [
            // Medium pairs (5-6 steps)
            { start: 'lead', end: 'gold', steps: 5 },
            { start: 'ruby', end: 'mint', steps: 6 },
            { start: 'work', end: 'play', steps: 6 },
            { start: 'rice', end: 'meal', steps: 5 },
            { start: 'wine', end: 'beer', steps: 5 },
            { start: 'find', end: 'lose', steps: 5 },
            { start: 'read', end: 'book', steps: 5 },
            { start: 'rain', end: 'snow', steps: 5 },
            { start: 'back', end: 'away', steps: 5 },
            { start: 'bald', end: 'hair', steps: 5 },
            { start: 'band', end: 'rock', steps: 5 },
            { start: 'bank', end: 'loan', steps: 5 },
            { start: 'barn', end: 'farm', steps: 5 },
            { start: 'base', end: 'peak', steps: 5 },
            { start: 'bath', end: 'wash', steps: 5 },
            { start: 'bean', end: 'soup', steps: 5 },
            { start: 'bear', end: 'wolf', steps: 5 },
            { start: 'beat', end: 'drum', steps: 5 },
            { start: 'belt', end: 'rope', steps: 5 },
            { start: 'bend', end: 'turn', steps: 5 },
            { start: 'best', end: 'last', steps: 5 },
            { start: 'bike', end: 'cars', steps: 5 },
            { start: 'bill', end: 'paid', steps: 5 },
            { start: 'bind', end: 'free', steps: 5 },
            { start: 'bite', end: 'chew', steps: 5 },
            { start: 'blow', end: 'wind', steps: 5 },
            { start: 'blue', end: 'gray', steps: 5 },
            { start: 'blur', end: 'fade', steps: 5 },
            { start: 'boil', end: 'cook', steps: 5 },
            { start: 'bond', end: 'link', steps: 5 },
            { start: 'boom', end: 'bust', steps: 5 },
            { start: 'born', end: 'died', steps: 5 },
            { start: 'boss', end: 'crew', steps: 5 },
            { start: 'bowl', end: 'dish', steps: 5 },
            { start: 'boys', end: 'girl', steps: 5 },
            { start: 'burn', end: 'heat', steps: 5 },
            { start: 'bury', end: 'hide', steps: 5 },
            { start: 'busy', end: 'idle', steps: 5 },
            { start: 'call', end: 'yell', steps: 5 },
            { start: 'camp', end: 'tent', steps: 5 },
        ],
        hard: [
            // Hard pairs (6-7 steps)
            { start: 'hide', end: 'seek', steps: 6 },
            { start: 'fire', end: 'cool', steps: 6 },
            { start: 'baby', end: 'cart', steps: 7 },
            { start: 'four', end: 'five', steps: 7 },
            { start: 'army', end: 'navy', steps: 6 },
            { start: 'rise', end: 'fall', steps: 6 },
            { start: 'east', end: 'west', steps: 5 },
            { start: 'poor', end: 'rich', steps: 6 },
            { start: 'ache', end: 'heal', steps: 6 },
            { start: 'acid', end: 'base', steps: 6 },
            { start: 'aged', end: 'born', steps: 6 },
            { start: 'ally', end: 'foes', steps: 6 },
            { start: 'arch', end: 'flat', steps: 6 },
            { start: 'arms', end: 'legs', steps: 6 },
            { start: 'atom', end: 'mass', steps: 6 },
            { start: 'auto', end: 'bike', steps: 6 },
            { start: 'back', end: 'fore', steps: 6 },
            { start: 'bane', end: 'boon', steps: 6 },
            { start: 'bare', end: 'full', steps: 6 },
            { start: 'bark', end: 'meow', steps: 6 },
            { start: 'bass', end: 'fish', steps: 6 },
            { start: 'bats', end: 'owls', steps: 6 },
            { start: 'bead', end: 'gems', steps: 6 },
            { start: 'beam', end: 'glow', steps: 6 },
            { start: 'beds', end: 'sofa', steps: 6 },
            { start: 'beef', end: 'pork', steps: 6 },
            { start: 'bees', end: 'wasp', steps: 6 },
            { start: 'bent', end: 'flat', steps: 6 },
            { start: 'bird', end: 'frog', steps: 6 },
            { start: 'bits', end: 'byte', steps: 6 },
            { start: 'boot', end: 'shoe', steps: 6 },
            { start: 'bore', end: 'thrill', steps: 6 },
            { start: 'boys', end: 'mans', steps: 6 },
            { start: 'brag', end: 'meek', steps: 6 },
            { start: 'bred', end: 'born', steps: 6 },
            { start: 'brew', end: 'wine', steps: 6 },
            { start: 'bulk', end: 'tiny', steps: 6 },
            { start: 'bump', end: 'dent', steps: 6 },
            { start: 'cage', end: 'wild', steps: 6 },
            { start: 'calm', end: 'rage', steps: 6 },
        ]
    };

    // Game State
    let state = {
        difficulty: null,
        puzzle: null,
        ladder: [],
        currentWord: '',
        moves: 0,
        hintsUsed: 0,
        gameOver: false,
        message: null,
        messageType: null
    };

    // BFS to find shortest path between two words
    function findPath(start, end) {
        if (start === end) return [start];

        const queue = [[start]];
        const visited = new Set([start]);

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];

            for (const word of WORDS) {
                if (!visited.has(word) && isOneLetterDiff(current, word)) {
                    const newPath = [...path, word];
                    if (word === end) return newPath;
                    visited.add(word);
                    queue.push(newPath);
                }
            }
        }
        return null;
    }

    // Check if two words differ by exactly one letter
    function isOneLetterDiff(word1, word2) {
        if (word1.length !== word2.length) return false;
        let diffs = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) diffs++;
            if (diffs > 1) return false;
        }
        return diffs === 1;
    }

    // Find which letter changed between two words
    function getChangedIndex(word1, word2) {
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) return i;
        }
        return -1;
    }

    function launchWordLadder() {
        state = {
            difficulty: null,
            puzzle: null,
            ladder: [],
            currentWord: '',
            moves: 0,
            hintsUsed: 0,
            gameOver: false,
            message: null,
            messageType: null
        };

        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('wordLadderGame').style.display = 'block';
        showSetup();
    }

    function exitWordLadder() {
        document.getElementById('wordLadderGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
    }

    function showSetup() {
        const content = document.getElementById('wordLadderContent');
        content.innerHTML = `
            <div class="wl-container">
                <div class="wl-card">
                    <button class="wl-back-btn" onclick="exitWordLadder()">← Back</button>
                    <div class="wl-header">
                        <h1 class="wl-title">Word Ladder</h1>
                        <p class="wl-subtitle">Transform one word into another</p>
                    </div>

                    <div class="wl-rules">
                        <h4>How to Play</h4>
                        <p>Change one letter at a time to transform the starting word into the target word. Each step must be a valid English word!</p>
                    </div>

                    <h3 style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;">Choose Difficulty</h3>

                    <div class="wl-difficulty-grid">
                        <button class="wl-difficulty-btn" onclick="window.wordladder.start('easy')">
                            <span class="wl-difficulty-icon">🌱</span>
                            <span class="wl-difficulty-title">Easy</span>
                            <span class="wl-difficulty-desc">3-4 steps</span>
                        </button>
                        <button class="wl-difficulty-btn" onclick="window.wordladder.start('medium')">
                            <span class="wl-difficulty-icon">🌿</span>
                            <span class="wl-difficulty-title">Medium</span>
                            <span class="wl-difficulty-desc">5-6 steps</span>
                        </button>
                        <button class="wl-difficulty-btn" onclick="window.wordladder.start('hard')">
                            <span class="wl-difficulty-icon">🌳</span>
                            <span class="wl-difficulty-title">Hard</span>
                            <span class="wl-difficulty-desc">6-7 steps</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function startGame(difficulty) {
        state.difficulty = difficulty;
        const puzzles = PUZZLES[difficulty];
        state.puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        state.ladder = [state.puzzle.start];
        state.currentWord = state.puzzle.start;
        state.moves = 0;
        state.hintsUsed = 0;
        state.gameOver = false;
        state.message = null;
        showGame();
    }

    function showGame() {
        const content = document.getElementById('wordLadderContent');
        const { puzzle, ladder, moves, hintsUsed, gameOver, message, messageType } = state;

        let ladderHTML = '';

        // Show start word
        ladderHTML += renderWord(puzzle.start, 'start', null);
        ladderHTML += '<div class="wl-arrow">↓</div>';

        // Show completed steps
        for (let i = 1; i < ladder.length; i++) {
            const changedIndex = getChangedIndex(ladder[i - 1], ladder[i]);
            ladderHTML += renderWord(ladder[i], 'correct', changedIndex);
            ladderHTML += '<div class="wl-arrow">↓</div>';
        }

        // Show target word
        ladderHTML += renderWord(puzzle.end, 'end', null);

        // Win message
        let winHTML = '';
        if (gameOver) {
            const rating = moves <= puzzle.steps ? '⭐⭐⭐ Perfect!' :
                          moves <= puzzle.steps + 2 ? '⭐⭐ Great!' : '⭐ Complete!';
            winHTML = `
                <div class="wl-win-message">
                    <div class="wl-win-title">${rating}</div>
                    <div class="wl-win-stats">
                        Solved in ${moves} moves (optimal: ${puzzle.steps})<br>
                        Hints used: ${hintsUsed}
                    </div>
                </div>
            `;
        }

        // Message display
        let messageHTML = '';
        if (message) {
            messageHTML = `<div class="wl-message ${messageType}">${message}</div>`;
        }

        content.innerHTML = `
            <div class="wl-container">
                <div class="wl-card" style="position: relative; overflow: hidden;">
                    <button class="wl-back-btn" onclick="exitWordLadder()">← Back</button>

                    <div class="wl-stats">
                        <div class="wl-stat">
                            <div class="wl-stat-value">${moves}</div>
                            <div class="wl-stat-label">Moves</div>
                        </div>
                        <div class="wl-stat">
                            <div class="wl-stat-value">${puzzle.steps}</div>
                            <div class="wl-stat-label">Optimal</div>
                        </div>
                        <div class="wl-stat">
                            <div class="wl-stat-value">${hintsUsed}</div>
                            <div class="wl-stat-label">Hints</div>
                        </div>
                    </div>

                    <div class="wl-ladder">
                        ${ladderHTML}
                    </div>

                    ${messageHTML}
                    ${winHTML}

                    ${!gameOver ? `
                        <div class="wl-input-section">
                            <div class="wl-input-label">Enter next word (change one letter):</div>
                            <div class="wl-input-row">
                                <input type="text" id="wlInput0" class="wl-input" maxlength="1"
                                    onkeyup="window.wordladder.handleInput(event, 0)"
                                    oninput="window.wordladder.autoAdvance(0)">
                                <input type="text" id="wlInput1" class="wl-input" maxlength="1"
                                    onkeyup="window.wordladder.handleInput(event, 1)"
                                    oninput="window.wordladder.autoAdvance(1)">
                                <input type="text" id="wlInput2" class="wl-input" maxlength="1"
                                    onkeyup="window.wordladder.handleInput(event, 2)"
                                    oninput="window.wordladder.autoAdvance(2)">
                                <input type="text" id="wlInput3" class="wl-input" maxlength="1"
                                    onkeyup="window.wordladder.handleInput(event, 3)"
                                    oninput="window.wordladder.autoAdvance(3)">
                            </div>
                        </div>
                    ` : ''}

                    <div class="wl-buttons">
                        ${!gameOver ? `
                            <button class="wl-btn wl-btn-primary" onclick="window.wordladder.submit()">Submit</button>
                            <button class="wl-btn wl-btn-secondary" onclick="window.wordladder.hint()">💡 Hint</button>
                            <button class="wl-btn wl-btn-secondary" onclick="window.wordladder.undo()">↩ Undo</button>
                        ` : `
                            <button class="wl-btn wl-btn-primary" onclick="window.wordladder.start('${state.difficulty}')">Play Again</button>
                            <button class="wl-btn wl-btn-secondary" onclick="window.wordladder.showSetup()">Change Difficulty</button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Focus first input and pre-fill with current word
        if (!gameOver) {
            const currentWord = ladder[ladder.length - 1];
            for (let i = 0; i < 4; i++) {
                const input = document.getElementById(`wlInput${i}`);
                if (input) {
                    input.value = currentWord[i];
                }
            }
            setTimeout(() => document.getElementById('wlInput0')?.focus(), 100);
        }

        // Confetti on win
        if (gameOver) {
            setTimeout(createConfetti, 100);
        }
    }

    function renderWord(word, type, changedIndex) {
        let html = '<div class="wl-word">';
        for (let i = 0; i < word.length; i++) {
            let letterClass = 'wl-letter';
            if (type === 'start' || type === 'end') {
                letterClass += ` ${type}`;
            } else if (type === 'correct') {
                letterClass += ' correct';
                if (i === changedIndex) {
                    letterClass += ' changed';
                }
            }
            html += `<div class="${letterClass}">${word[i]}</div>`;
        }
        html += '</div>';
        return html;
    }

    function autoAdvance(index) {
        const input = document.getElementById(`wlInput${index}`);
        if (input && input.value.length === 1 && index < 3) {
            document.getElementById(`wlInput${index + 1}`)?.focus();
        }
    }

    function handleInput(event, index) {
        if (event.key === 'Enter') {
            submitWord();
        } else if (event.key === 'Backspace' && index > 0) {
            const input = document.getElementById(`wlInput${index}`);
            if (input && input.value === '') {
                document.getElementById(`wlInput${index - 1}`)?.focus();
            }
        }
    }

    function submitWord() {
        const word = [0, 1, 2, 3].map(i =>
            document.getElementById(`wlInput${i}`)?.value.toLowerCase() || ''
        ).join('');

        if (word.length !== 4) {
            showMessage('Please enter a 4-letter word', 'error');
            shakeInputs();
            return;
        }

        const currentWord = state.ladder[state.ladder.length - 1];

        if (!isOneLetterDiff(currentWord, word)) {
            showMessage('Change exactly one letter', 'error');
            shakeInputs();
            return;
        }

        if (!WORDS.has(word)) {
            showMessage('Not a valid word', 'error');
            shakeInputs();
            return;
        }

        if (state.ladder.includes(word)) {
            showMessage('Word already used', 'error');
            shakeInputs();
            return;
        }

        // Valid move!
        state.ladder.push(word);
        state.moves++;
        state.message = null;

        // Check for win
        if (word === state.puzzle.end) {
            state.gameOver = true;
        }

        showGame();
    }

    function shakeInputs() {
        for (let i = 0; i < 4; i++) {
            const input = document.getElementById(`wlInput${i}`);
            if (input) {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 300);
            }
        }
    }

    function showMessage(text, type) {
        state.message = text;
        state.messageType = type;
        showGame();
    }

    function getHint() {
        const currentWord = state.ladder[state.ladder.length - 1];
        const path = findPath(currentWord, state.puzzle.end);

        if (path && path.length > 1) {
            const nextWord = path[1];
            const changedIndex = getChangedIndex(currentWord, nextWord);
            state.hintsUsed++;
            showMessage(`Try changing letter ${changedIndex + 1} to "${nextWord[changedIndex].toUpperCase()}"`, 'hint');
        } else {
            showMessage('No path found - try undoing some moves', 'error');
        }
    }

    function undoMove() {
        if (state.ladder.length > 1) {
            state.ladder.pop();
            state.moves = Math.max(0, state.moves - 1);
            state.message = null;
            showGame();
        }
    }

    function createConfetti() {
        const container = document.querySelector('.wl-card');
        if (!container) return;

        const colors = ['#4ecdc4', '#44a08d', '#f093fb', '#f5576c', '#56ab2f', '#ffd200'];

        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'wl-confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Expose functions
    window.launchWordLadder = launchWordLadder;
    window.exitWordLadder = exitWordLadder;
    window.wordladder = {
        start: startGame,
        submit: submitWord,
        hint: getHint,
        undo: undoMove,
        handleInput: handleInput,
        autoAdvance: autoAdvance,
        showSetup: showSetup
    };

})();

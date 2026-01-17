// Wordle Game
(function() {
    'use strict';

    // Valid 5-letter words for guessing (loaded from dictionary)
    let VALID_WORDS = new Set();
    let dictionaryLoaded = false;

    // Common 5-letter words for answers (curated list of recognizable words)
    const ANSWER_WORDS = [
        'about','above','abuse','actor','acute','admit','adopt','adult','after','again',
        'agent','agree','ahead','alarm','album','alert','alike','alive','allow','alone',
        'along','alter','among','anger','angle','angry','apart','apple','apply','arena',
        'argue','arise','armed','armor','army','aside','asset','avoid','award','aware',
        'awful','baby','back','badge','badly','baker','basic','basis','beach','began',
        'begin','being','belly','below','bench','berry','birth','black','blade','blame',
        'blank','blast','blaze','bleed','blend','bless','blind','block','blood','bloom',
        'blown','blues','blunt','board','boast','bonus','boost','booth','bound','brain',
        'brand','brass','brave','bread','break','breed','brick','bride','brief','bring',
        'broad','broke','brook','brown','brush','buddy','build','built','bunch','burst',
        'buyer','cabin','cable','camel','candy','cargo','carry','catch','cause','cease',
        'chain','chair','chaos','charm','chart','chase','cheap','check','cheek','cheer',
        'chess','chest','chief','child','china','choir','chord','chose','chunk','civic',
        'civil','claim','clash','class','clean','clear','clerk','click','cliff','climb',
        'cling','clock','close','cloth','cloud','coach','coast','colon','color','couch',
        'could','count','court','cover','crack','craft','crash','crazy','cream','creek',
        'crime','crisp','critic','cross','crowd','crown','crude','crush','curve','cycle',
        'daily','dairy','dance','dated','dealt','death','debut','decay','decor','delay',
        'dense','depot','depth','derby','desk','diary','dirty','disco','ditch','diver',
        'dizzy','donor','doubt','dough','dozen','draft','drain','drake','drama','drank',
        'drawn','dread','dream','dress','dried','drift','drill','drink','drive','droit',
        'drown','drunk','dusty','dwarf','dwell','dying','eager','eagle','early','earth',
        'ease','eight','elbow','elder','elect','elite','empty','enemy','enjoy','enter',
        'entry','equal','equip','erase','error','essay','event','every','exact','exams',
        'exile','exist','extra','faint','fairy','faith','false','fancy','fatal','fatty',
        'fault','favor','feast','fence','ferry','fetal','fetch','fever','fiber','field',
        'fiery','fifth','fifty','fight','filed','final','finer','fired','first','fixed',
        'flag','flame','flash','flask','flats','fleet','flesh','flies','fling','flint',
        'float','flock','flood','floor','flora','flour','flown','fluid','flung','flunk',
        'flush','focal','focus','foggy','folks','force','forge','forth','forty','forum',
        'fossil','found','frame','frank','fraud','freak','freed','fresh','fried','front',
        'frost','fruit','fully','fungi','funny','gamma','gauge','genre','ghost','giant',
        'given','gland','glass','globe','glory','glove','going','grace','grade','grain',
        'grand','grant','grape','graph','grasp','grass','grave','gravel','great','greed',
        'greek','green','greet','grief','grill','grind','groan','groom','gross','group',
        'grove','grown','guard','guess','guest','guide','guild','guilt','guise','guitar',
        'habit','halls','handy','happy','harsh','haste','hasty','hatch','haven','hazel',
        'heard','heart','heavy','hedge','heels','hello','hence','herds','heron','hills',
        'hippo','hobby','holds','holly','homer','homes','honey','honor','hoped','horde',
        'horse','hosts','hotel','hound','house','human','humid','humor','hurry','ideal',
        'image','imply','index','indie','inner','input','intro','issue','ivory','jeans',
        'jelly','jenny','jewel','joint','joker','jolly','joust','judge','juice','juicy',
        'jumbo','jumps','jumpy','jury','keeps','kicks','kills','kinds','kings','knack',
        'knead','kneed','kneel','knelt','knife','knock','knots','known','label','labor',
        'laden','lakes','lands','lanes','large','laser','latch','later','laugh','layer',
        'leads','leaky','leaps','learn','lease','least','leave','ledge','legal','lemon',
        'level','lever','light','liked','limit','lined','liner','lines','links','lions',
        'lists','liter','lived','liver','lives','llama','loads','loans','lobby','local',
        'lodge','lofty','logic','logos','looks','looms','loops','loose','lords','lorry',
        'loser','loses','lotus','lousy','loved','lover','loves','lower','loyal','lucky',
        'lunar','lunch','lungs','lying','lyric','macro','madam','magic','major','maker',
        'males','malls','manga','mango','manor','maple','march','marks','marry','marsh',
        'masks','match','mates','maxim','maybe','mayor','meals','means','meant','medal',
        'media','melon','mercy','merge','merit','merry','messy','metal','meter','midst',
        'might','mills','mimic','minds','miner','minor','minus','misty','mixed','mixer',
        'model','modem','moist','money','month','moose','moral','motif','motor','motto',
        'mound','mount','mouse','mouth','moved','mover','moves','movie','muddy','mural',
        'music','myths','naive','naked','named','names','nanny','nasty','naval','needs',
        'nerve','never','newer','newly','night','ninth','noble','noise','noisy','north',
        'notch','noted','notes','novel','nurse','nylon','occur','ocean','oddly','odds',
        'offer','often','olive','onion','onset','opens','opera','opted','optic','orbit',
        'order','organ','other','ought','ounce','outer','outdo','owned','owner','oxide',
        'ozone','packs','paddy','pages','paint','pairs','palms','panel','panic','pants',
        'paper','parks','party','pasta','paste','pasty','patch','pause','peace','peach',
        'peaks','pearl','pedal','peers','penny','perch','peril','perks','perky','petty',
        'phase','phone','photo','piano','picks','piece','pilot','pinch','pipes','pitch',
        'pizza','place','plain','plane','plans','plant','plate','plays','plaza','plead',
        'pleas','plier','plots','plumb','plump','plums','plunge','poems','poets','point',
        'poise','poker','polar','poles','polls','ponds','pools','porch','pores','ports',
        'posed','poses','posts','pouch','pound','power','press','price','pride','prima',
        'prime','print','prior','prism','prize','probe','prone','proof','prose','proud',
        'prove','proxy','prune','pulse','pumps','punch','pupil','puppy','purse','push',
        'putting','quack','qualm','quart','queen','query','quest','queue','quick','quiet',
        'quilt','quirk','quite','quota','quote','raced','racer','radar','radio','raids',
        'rails','rainy','raise','rally','ranch','range','rapid','ratio','reach','react',
        'reads','ready','realm','rebel','refer','reign','relax','relay','relief','reply',
        'reset','resin','retry','rider','ridge','rifle','right','rigid','rings','riots',
        'risen','risks','risky','rites','ritual','rival','river','roads','roast','robot',
        'rocks','rocky','rogue','roles','roman','rooms','roots','ropes','roses','rotor',
        'rouge','rough','round','route','royal','rugby','ruins','ruled','ruler','rules',
        'rumor','rural','sadly','safer','saint','salad','sales','salon','salty','sandy',
        'sauce','saved','scale','scalp','scam','scans','scare','scarf','scary','scene',
        'scent','score','scout','scrap','seals','seats','seeds','seeks','seems','seize',
        'sells','sends','sense','serum','serve','setup','seven','shade','shaft','shake',
        'shall','shame','shape','share','shark','sharp','sheep','sheer','sheet','shelf',
        'shell','shift','shine','shiny','ships','shirt','shock','shoes','shook','shoot',
        'shops','shore','short','shout','shown','shows','shrug','sides','siege','sight',
        'sigma','signs','silly','since','siren','sites','sixth','sixty','sized','sizes',
        'skate','skill','skirt','skull','slabs','slain','slang','slash','slate','slave',
        'sleek','sleep','slept','slice','slide','slime','slope','slots','slows','small',
        'smart','smash','smell','smile','smoke','snack','snake','snaps','sneak','sniff',
        'solar','solid','solve','songs','sorry','sorts','souls','sound','south','space',
        'spare','spark','spawn','speak','spear','specs','speed','spell','spend','spent',
        'spice','spicy','spied','spies','spike','spill','spine','split','spoke','spoon',
        'sport','spots','spray','squad','stack','staff','stage','stain','stake','stall',
        'stamp','stand','stare','stark','stars','start','state','stays','steak','steal',
        'steam','steel','steep','steer','stems','steps','stick','stiff','still','sting',
        'stock','stole','stone','stood','stool','stops','store','storm','story','stove',
        'strap','straw','stray','strip','stuck','study','stuff','style','sugar','suite',
        'sunny','super','surge','sushi','swamp','swaps','swear','sweat','sweep','sweet',
        'swept','swift','swing','swiss','sword','swore','sworn','swung','table','taken',
        'tales','talks','tanks','tapas','tapes','tasks','taste','tasty','taxes','teach',
        'teams','tears','teens','tells','tempo','tends','tenor','tense','tenth','terms',
        'tests','texas','texts','thank','theft','their','theme','thick','thief','thigh',
        'thing','think','third','thorn','those','three','threw','throw','thumb','tiger',
        'tight','tiles','timer','times','tired','title','toast','today','token','tombs',
        'toned','tones','tooth','topic','torch','total','touch','tough','tours','towel',
        'tower','towns','toxic','trace','track','tract','trade','trail','train','trait',
        'trash','treat','trees','trend','trial','tribe','trick','tried','tries','trims',
        'trips','troop','trout','truck','truly','trump','trunk','trust','truth','tubes',
        'tulip','tumor','tuned','tuner','tunes','turns','tutor','twice','twins','twist',
        'typed','types','ultra','uncle','under','undid','unfair','union','unite','unity',
        'until','upper','upset','urban','urged','urine','usage','usual','utter','valid',
        'value','valve','vapor','vault','vegas','venom','venue','verge','verse','vibes',
        'video','views','vigor','villa','vinyl','viola','viral','virus','visit','vital',
        'vivid','vocal','vodka','vogue','voice','voter','votes','wages','wagon','waist',
        'walks','walls','waltz','wants','waste','watch','water','waved','waves','waxed',
        'weeks','weigh','weird','wells','welsh','whale','wheat','wheel','where','which',
        'while','whine','white','whole','whose','widen','wider','widow','width','wield',
        'winds','wines','wings','wiped','wired','wires','witch','witty','wives','woken',
        'woman','women','woods','words','works','world','worms','worry','worse','worst',
        'worth','would','wound','woven','wraps','wrath','wreck','wrist','write','wrong',
        'wrote','yacht','yards','years','yeast','yield','young','yours','youth','zebra',
        'zones'
    ];

    // Load dictionary for valid guesses
    async function loadDictionary() {
        if (dictionaryLoaded) return;

        try {
            const response = await fetch('./data/ghost-words.txt?v=' + (window.APP_VERSION || '1'));
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const text = await response.text();
            const words = text.split('\n')
                .map(w => w.trim().toLowerCase())
                .filter(w => w.length === 5);
            VALID_WORDS = new Set(words);
            // Also add all answer words as valid
            ANSWER_WORDS.forEach(w => VALID_WORDS.add(w));
            dictionaryLoaded = true;
        } catch (error) {
            console.warn('Using answer words only for Wordle');
            VALID_WORDS = new Set(ANSWER_WORDS);
            dictionaryLoaded = true;
        }
    }

    // Game state
    let state = {
        answer: '',
        guesses: [],
        currentGuess: '',
        gameOver: false,
        won: false,
        message: '',
        shake: false,
        revealRow: -1
    };

    // Get a random answer
    function getRandomAnswer() {
        return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
    }

    // Check if a word is valid
    function isValidWord(word) {
        return VALID_WORDS.has(word.toLowerCase());
    }

    // Evaluate a guess against the answer
    function evaluateGuess(guess, answer) {
        const result = [];
        const answerChars = answer.split('');
        const guessChars = guess.split('');
        const used = new Array(5).fill(false);

        // First pass: find correct positions (green)
        for (let i = 0; i < 5; i++) {
            if (guessChars[i] === answerChars[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }

        // Second pass: find wrong positions (yellow) and absent (gray)
        for (let i = 0; i < 5; i++) {
            if (result[i]) continue;

            let found = false;
            for (let j = 0; j < 5; j++) {
                if (!used[j] && guessChars[i] === answerChars[j]) {
                    result[i] = 'present';
                    used[j] = true;
                    found = true;
                    break;
                }
            }
            if (!found) {
                result[i] = 'absent';
            }
        }

        return result;
    }

    // Get keyboard letter status
    function getKeyboardStatus() {
        const status = {};
        for (const guess of state.guesses) {
            const evaluation = evaluateGuess(guess, state.answer);
            for (let i = 0; i < 5; i++) {
                const letter = guess[i];
                const current = status[letter];
                const newStatus = evaluation[i];

                // Priority: correct > present > absent
                if (newStatus === 'correct') {
                    status[letter] = 'correct';
                } else if (newStatus === 'present' && current !== 'correct') {
                    status[letter] = 'present';
                } else if (!current) {
                    status[letter] = 'absent';
                }
            }
        }
        return status;
    }

    // Handle letter input
    function addLetter(letter) {
        if (state.gameOver) return;
        if (state.currentGuess.length >= 5) return;

        state.currentGuess += letter.toLowerCase();
        state.message = '';
        render();
    }

    // Handle backspace
    function deleteLetter() {
        if (state.gameOver) return;
        if (state.currentGuess.length === 0) return;

        state.currentGuess = state.currentGuess.slice(0, -1);
        state.message = '';
        render();
    }

    // Handle enter/submit
    function submitGuess() {
        if (state.gameOver) return;

        if (state.currentGuess.length !== 5) {
            state.message = 'Not enough letters';
            state.shake = true;
            render();
            setTimeout(() => { state.shake = false; render(); }, 500);
            return;
        }

        if (!isValidWord(state.currentGuess)) {
            state.message = 'Not in word list';
            state.shake = true;
            render();
            setTimeout(() => { state.shake = false; render(); }, 500);
            return;
        }

        state.guesses.push(state.currentGuess);
        state.revealRow = state.guesses.length - 1;

        if (state.currentGuess === state.answer) {
            state.gameOver = true;
            state.won = true;
            const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
            state.message = messages[Math.min(state.guesses.length - 1, 5)];
        } else if (state.guesses.length >= 6) {
            state.gameOver = true;
            state.won = false;
            state.message = state.answer.toUpperCase();
        }

        state.currentGuess = '';
        render();
    }

    // Start new game
    function newGame() {
        state = {
            answer: getRandomAnswer(),
            guesses: [],
            currentGuess: '',
            gameOver: false,
            won: false,
            message: '',
            shake: false,
            revealRow: -1
        };
        render();
    }

    // Render the game
    function render() {
        const container = document.getElementById('wordleContent');
        if (!container) return;

        const keyboardStatus = getKeyboardStatus();
        const keyboardRows = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back']
        ];

        // Build grid rows
        let gridHTML = '';
        for (let row = 0; row < 6; row++) {
            const isCurrentRow = row === state.guesses.length;
            const guess = row < state.guesses.length ? state.guesses[row] : (isCurrentRow ? state.currentGuess : '');
            const evaluation = row < state.guesses.length ? evaluateGuess(state.guesses[row], state.answer) : null;
            const shouldShake = isCurrentRow && state.shake;

            gridHTML += `<div class="wordle-row${shouldShake ? ' shake' : ''}">`;
            for (let col = 0; col < 5; col++) {
                const letter = guess[col] || '';
                const status = evaluation ? evaluation[col] : (letter ? 'tbd' : 'empty');
                gridHTML += `<div class="wordle-tile ${status}">${letter.toUpperCase()}</div>`;
            }
            gridHTML += '</div>';
        }

        // Build keyboard
        let keyboardHTML = '';
        for (const row of keyboardRows) {
            keyboardHTML += '<div class="wordle-keyboard-row">';
            for (const key of row) {
                const status = keyboardStatus[key] || '';
                const display = key === 'enter' ? 'ENTER' : (key === 'back' ? '⌫' : key.toUpperCase());
                const wide = key === 'enter' || key === 'back' ? ' wide' : '';
                keyboardHTML += `<button class="wordle-key ${status}${wide}" data-key="${key}">${display}</button>`;
            }
            keyboardHTML += '</div>';
        }

        container.innerHTML = `
            <div class="wordle-container">
                <button class="game-back-btn" onclick="exitWordle()">← Back</button>

                <div class="wordle-header">
                    <h2>Wordle</h2>
                </div>

                <div class="wordle-message ${state.message ? 'show' : ''}">${state.message}</div>

                <div class="wordle-grid">
                    ${gridHTML}
                </div>

                <div class="wordle-keyboard">
                    ${keyboardHTML}
                </div>

                ${state.gameOver ? `
                    <div class="wordle-game-over">
                        <button onclick="window.wordleGame.newGame()" class="wordle-new-game-btn">Play Again</button>
                    </div>
                ` : ''}
            </div>

            <style>
                .wordle-container {
                    font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 1rem;
                    position: relative;
                }

                .wordle-back-btn {
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
                }

                .wordle-header {
                    text-align: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #3a3a3c;
                }

                .wordle-header h2 {
                    color: white;
                    margin: 0;
                    font-size: 2rem;
                    font-weight: bold;
                    letter-spacing: 0.1em;
                }

                .wordle-message {
                    text-align: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1rem;
                    min-height: 1.5rem;
                    margin-bottom: 0.5rem;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .wordle-message.show {
                    opacity: 1;
                }

                .wordle-grid {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 1.5rem;
                }

                .wordle-row {
                    display: flex;
                    gap: 5px;
                }

                .wordle-row.shake {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-5px); }
                    40% { transform: translateX(5px); }
                    60% { transform: translateX(-5px); }
                    80% { transform: translateX(5px); }
                }

                .wordle-tile {
                    width: 58px;
                    height: 58px;
                    border: 2px solid #3a3a3c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                    text-transform: uppercase;
                    box-sizing: border-box;
                }

                .wordle-tile.empty {
                    border-color: #3a3a3c;
                }

                .wordle-tile.tbd {
                    border-color: #565758;
                    animation: pop 0.1s ease-in-out;
                }

                @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .wordle-tile.correct {
                    background-color: #538d4e;
                    border-color: #538d4e;
                }

                .wordle-tile.present {
                    background-color: #b59f3b;
                    border-color: #b59f3b;
                }

                .wordle-tile.absent {
                    background-color: #3a3a3c;
                    border-color: #3a3a3c;
                }

                .wordle-keyboard {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .wordle-keyboard-row {
                    display: flex;
                    gap: 6px;
                }

                .wordle-key {
                    min-width: 32px;
                    height: 52px;
                    border: none;
                    border-radius: 4px;
                    background-color: #818384;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 8px;
                    text-transform: uppercase;
                    transition: background-color 0.1s;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                    -webkit-user-select: none;
                }

                .wordle-key.wide {
                    min-width: 58px;
                    font-size: 0.7rem;
                }

                .wordle-key:active {
                    transform: scale(0.95);
                }

                .wordle-key.correct {
                    background-color: #538d4e;
                }

                .wordle-key.present {
                    background-color: #b59f3b;
                }

                .wordle-key.absent {
                    background-color: #3a3a3c;
                }

                .wordle-game-over {
                    text-align: center;
                    margin-top: 1rem;
                }

                .wordle-new-game-btn {
                    background: #538d4e;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                }

                .wordle-new-game-btn:hover {
                    background: #6aaa5e;
                }

                @media (max-width: 500px) {
                    .wordle-tile {
                        width: 50px;
                        height: 50px;
                        font-size: 1.7rem;
                    }

                    .wordle-key {
                        min-width: 28px;
                        height: 48px;
                        font-size: 0.75rem;
                        padding: 0 4px;
                    }

                    .wordle-key.wide {
                        min-width: 48px;
                    }
                }
            </style>
        `;

        // Add touch event listeners for faster keyboard response
        container.querySelectorAll('.wordle-key').forEach(btn => {
            const key = btn.dataset.key;
            let touched = false;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touched = true;
                keyPress(key);
            }, { passive: false });

            btn.addEventListener('click', (e) => {
                if (!touched) {
                    keyPress(key);
                }
                touched = false;
            });
        });
    }

    // Handle key press
    function keyPress(key) {
        if (key === 'enter') {
            submitGuess();
        } else if (key === 'back') {
            deleteLetter();
        } else {
            addLetter(key);
        }
    }

    // Handle physical keyboard
    function handleKeydown(e) {
        if (document.getElementById('wordleGame').style.display === 'none') return;

        if (e.key === 'Enter') {
            submitGuess();
        } else if (e.key === 'Backspace') {
            deleteLetter();
        } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
            addLetter(e.key);
        }
    }

    // Launch game
    async function launchWordle() {
        document.getElementById('wordGamesMenu').style.display = 'none';
        document.getElementById('wordleGame').style.display = 'block';

        if (!dictionaryLoaded) {
            const content = document.getElementById('wordleContent');
            if (content) {
                content.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #cdd6f4;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🟩</div>
                        <div style="font-size: 1.2rem;">Loading...</div>
                    </div>
                `;
            }
            await loadDictionary();
        }

        newGame();
        document.addEventListener('keydown', handleKeydown);
    }

    // Exit game
    function exitWordle() {
        document.getElementById('wordleGame').style.display = 'none';
        document.getElementById('wordGamesMenu').style.display = 'block';
        document.removeEventListener('keydown', handleKeydown);
    }

    // Expose to window
    window.launchWordle = launchWordle;
    window.exitWordle = exitWordle;
    window.wordleGame = {
        keyPress,
        newGame
    };

})();

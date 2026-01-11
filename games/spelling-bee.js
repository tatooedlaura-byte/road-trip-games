// Spelling Bee Game
(function() {
    'use strict';

    // Inject CSS styles
    const styleId = 'spellingbee-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .sb-container {
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                max-width: 450px;
                margin: 0 auto;
                padding: 1rem;
            }

            .sb-card {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                color: white;
                position: relative;
            }

            .sb-back-btn {
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                padding: 0.4rem 0.7rem;
                border-radius: 8px;
                font-size: 0.8rem;
                cursor: pointer;
                z-index: 10;
            }

            .sb-back-btn:hover {
                background: rgba(255,255,255,0.25);
            }

            .sb-header {
                text-align: center;
                margin-bottom: 1rem;
            }

            .sb-title {
                font-size: 2rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #ffd200 0%, #f7971e 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .sb-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0;
            }

            .sb-rules-toggle {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                font-size: 0.9rem;
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .sb-rules-toggle:hover {
                background: rgba(255,255,255,0.25);
            }

            .sb-rules {
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .sb-rules h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                opacity: 0.9;
            }

            .sb-rules p {
                margin: 0;
                font-size: 0.85rem;
                line-height: 1.5;
                opacity: 0.75;
            }

            .sb-progress {
                margin-bottom: 1rem;
            }

            .sb-progress-bar {
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .sb-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ffd200 0%, #f7971e 100%);
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .sb-ranks {
                display: flex;
                justify-content: space-between;
                font-size: 0.7rem;
                opacity: 0.6;
            }

            .sb-rank {
                text-align: center;
            }

            .sb-rank.current {
                opacity: 1;
                color: #ffd200;
                font-weight: bold;
            }

            .sb-stats {
                display: flex;
                justify-content: space-around;
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 0.75rem;
                margin-bottom: 1rem;
            }

            .sb-stat {
                text-align: center;
            }

            .sb-stat-value {
                font-size: 1.3rem;
                font-weight: 700;
                color: #ffd200;
            }

            .sb-stat-label {
                font-size: 0.7rem;
                opacity: 0.7;
            }

            .sb-honeycomb {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 1.5rem 0;
                gap: 0.3rem;
            }

            .sb-hex-row {
                display: flex;
                gap: 0.4rem;
            }

            .sb-hex {
                width: 60px;
                height: 68px;
                background: rgba(255,255,255,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.15s ease;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                user-select: none;
            }

            .sb-hex:hover {
                background: rgba(255,255,255,0.25);
                transform: scale(1.05);
            }

            .sb-hex:active {
                transform: scale(0.95);
            }

            .sb-hex.center {
                background: linear-gradient(135deg, #ffd200 0%, #f7971e 100%);
                color: #1a1a2e;
            }

            .sb-hex.center:hover {
                background: linear-gradient(135deg, #ffe44d 0%, #ffab3d 100%);
            }

            .sb-input-area {
                text-align: center;
                margin: 1rem 0;
            }

            .sb-current-word {
                font-size: 1.8rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                min-height: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .sb-current-word .center-letter {
                color: #ffd200;
            }

            .sb-cursor {
                display: inline-block;
                width: 2px;
                height: 1.5rem;
                background: white;
                animation: blink 1s infinite;
                margin-left: 2px;
            }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }

            .sb-buttons {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-top: 1rem;
            }

            .sb-btn {
                padding: 0.7rem 1.2rem;
                border: none;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .sb-btn:active {
                transform: scale(0.97);
            }

            .sb-btn-delete {
                background: rgba(255,255,255,0.15);
                color: white;
            }

            .sb-btn-delete:hover {
                background: rgba(255,255,255,0.25);
            }

            .sb-btn-shuffle {
                background: rgba(255,255,255,0.15);
                color: white;
                font-size: 1.8rem;
            }

            .sb-btn-shuffle:hover {
                background: rgba(255,255,255,0.25);
            }

            .sb-btn-enter {
                background: linear-gradient(135deg, #ffd200 0%, #f7971e 100%);
                color: #1a1a2e;
                padding: 0.7rem 1.5rem;
            }

            .sb-btn-enter:hover {
                box-shadow: 0 4px 15px rgba(255,210,0,0.4);
            }

            .sb-message {
                text-align: center;
                padding: 0.5rem;
                font-size: 0.9rem;
                font-weight: 500;
                min-height: 1.5rem;
                transition: opacity 0.3s ease;
            }

            .sb-message.error {
                color: #f5576c;
            }

            .sb-message.success {
                color: #4ecdc4;
            }

            .sb-message.pangram {
                color: #ffd200;
                font-size: 1.1rem;
            }

            .sb-found-words {
                margin-top: 1rem;
                background: rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1rem;
                max-height: 150px;
                overflow-y: auto;
            }

            .sb-found-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
                font-size: 0.85rem;
                opacity: 0.8;
            }

            .sb-found-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.4rem;
            }

            .sb-found-word {
                background: rgba(255,255,255,0.1);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                text-transform: uppercase;
            }

            .sb-found-word.pangram {
                background: linear-gradient(135deg, rgba(255,210,0,0.3) 0%, rgba(247,151,30,0.3) 100%);
                color: #ffd200;
            }

            .sb-win {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(255,210,0,0.2) 0%, rgba(247,151,30,0.1) 100%);
                border-radius: 15px;
                margin: 1rem 0;
            }

            .sb-win-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #ffd200;
            }

            .sb-new-game-btn {
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #ffd200 0%, #f7971e 100%);
                color: #1a1a2e;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            }

            .sb-new-game-btn:hover {
                box-shadow: 0 4px 15px rgba(255,210,0,0.4);
            }
        `;
        document.head.appendChild(style);
    }

    // Word list - words 4+ letters using common letters
    // This is a curated list that works well for spelling bee puzzles
    const WORDS = new Set([
        // 4-letter words
        'able','ably','ache','acid','acme','acne','acre','aged','aide','airy','akin',
        'ally','also','amid','anti','arch','area','aria','army','aunt','auto','avid',
        'away','axle','baby','back','bail','bait','bake','bald','bale','ball','balm',
        'band','bane','bang','bank','bare','bark','barn','base','bash','bask','bath',
        'bead','beak','beam','bean','bear','beat','beck','been','beer','bell','belt',
        'bend','bent','berg','best','beta','bike','bile','bill','bind','bird','bite',
        'blah','bled','blew','blob','blog','blow','blue','blur','boar','boat','bode',
        'body','boil','bold','bolt','bomb','bond','bone','book','boom','boon','boot',
        'bore','born','both','bowl','brag','bran','bred','brew','brim','bulb','bulk',
        'bull','bump','bunk','burn','bury','bush','busy','buzz','byte','cafe','cage',
        'cake','calf','call','calm','came','camp','cane','cape','card','care','carp',
        'cart','case','cash','cast','cave','cell','char','chat','chef','chew','chin',
        'chip','chop','cite','city','clad','clam','clan','clap','claw','clay','clip',
        'clod','clog','club','clue','coal','coat','cock','code','coil','coin','coke',
        'cold','cole','colt','coma','comb','come','cone','cook','cool','cope','copy',
        'cord','core','cork','corn','cost','coup','cove','crab','cram','crew','crib',
        'crop','crow','cube','cult','curb','curd','cure','curl','cute','damp','dare',
        'dark','darn','dart','dash','data','date','dawn','deal','dean','dear','debt',
        'deck','deed','deem','deep','deer','demo','dent','deny','desk','dial','dice',
        'died','diet','dime','dine','dire','dirt','disc','dish','dive','dock','does',
        'dole','doll','dome','done','doom','door','dope','dork','dorm','dose','dote',
        'dove','down','doze','drab','drag','dram','draw','drew','drip','drop','drug',
        'drum','dual','duck','dude','duel','duet','duke','dull','duly','dumb','dump',
        'dune','dung','dunk','dupe','dusk','dust','duty','dyed','each','earl','earn',
        'ease','east','easy','eats','edge','edgy','edit','else','emit','envy','epic',
        'euro','even','ever','evil','exam','exec','exit','expo','eyed','face','fact',
        'fade','fail','fair','fake','fall','fame','fang','fare','farm','fast','fate',
        'fawn','fear','feat','feed','feel','feet','fell','felt','fend','fern','feud',
        'file','fill','film','find','fine','fire','firm','fish','fist','five','flag',
        'flak','flap','flat','flaw','flay','flea','fled','flee','flew','flex','flip',
        'flit','flog','flop','flow','flue','flux','foam','folk','fond','font','food',
        'fool','foot','ford','fore','fork','form','fort','foul','four','fowl','fray',
        'free','fret','frog','from','fuel','full','fume','fund','funk','furl','fury',
        'fuse','fuss','fuzz','gain','gait','gala','gale','gall','game','gang','gape',
        'garb','gash','gasp','gate','gave','gawk','gaze','gear','geek','gene','germ',
        'gift','gild','gill','gilt','girl','gist','give','glad','glen','glib','glob',
        'glom','glop','glow','glue','glum','glut','gnar','gnaw','goad','goal','goat',
        'gold','golf','gone','gong','good','goof','gore','gory','gosh','goth','gout',
        'gown','grab','grad','gram','gray','grew','grey','grid','grim','grin','grip',
        'grit','grow','grub','gulf','gulp','gunk','guru','gush','gust','guts','hack',
        'hail','hair','hake','hale','half','hall','halo','halt','hand','hang','hank',
        'hard','hare','hark','harm','harp','hash','hate','hath','haul','have','hawk',
        'haze','hazy','head','heal','heap','hear','heat','heck','heed','heel','heft',
        'held','hell','helm','help','herb','herd','here','hero','hers','hewn','hide',
        'high','hike','hill','hilt','hind','hint','hire','hiss','hive','hoar','hoax',
        'hock','hold','hole','holy','home','hone','honk','hood','hoof','hook','hoop',
        'hoot','hope','horn','hose','host','hour','howl','hubs','hued','huff','huge',
        'hulk','hull','hump','hung','hunk','hunt','hurl','hurt','hush','husk','hymn',
        'hype','iced','icon','idea','idle','idly','idol','inch','info','inks','iron',
        'isle','itch','item','jabs','jack','jade','jail','jamb','jams','java','jaws',
        'jazz','jean','jeer','jeep','jell','jerk','jest','jibe','jilt','jinx','jive',
        'jobs','jock','john','join','joke','jolt','josh','jowl','joys','judo','junk',
        'jury','just','kale','keel','keen','keep','kelp','kept','keys','kick','kill',
        'kiln','kilt','kind','king','kink','kiss','kite','knee','knew','knit','knob',
        'knot','know','labs','lace','lack','lacy','lady','laid','lain','lair','lake',
        'lamb','lame','lamp','land','lane','lard','lark','lash','lass','last','late',
        'lath','laud','lava','lawn','laws','lazy','lead','leaf','leak','lean','leap',
        'left','lend','lens','lent','less','liar','lice','lick','lied','lien','lieu',
        'life','lift','like','lilt','lily','limb','lime','limp','line','link','lint',
        'lion','lisp','list','lite','live','load','loaf','loam','loan','lobe','lock',
        'lode','loft','logo','loin','lone','long','look','loom','loon','loop','loot',
        'lope','lord','lore','lose','loss','lost','loud','lout','love','luck','luge',
        'lull','lump','lune','lung','lure','lurk','lush','lust','lute','lynx','lyre',
        'mace','made','mage','magi','maid','mail','maim','main','make','male','mall',
        'malt','mane','many','mare','mark','mars','mash','mask','mass','mast','mate',
        'math','maze','mead','meal','mean','meat','meek','meet','mega','meld','melt',
        'memo','mend','menu','meow','mere','mesh','mess','mica','mice','mild','mile',
        'milk','mill','mime','mind','mine','mini','mink','mint','minx','mire','miss',
        'mist','mite','mitt','moan','moat','mock','mode','mojo','mold','mole','molt',
        'monk','mood','moon','moor','moot','mope','more','morn','moss','most','moth',
        'move','much','muck','muff','mule','mull','murk','muse','mush','musk','must',
        'mute','mutt','myth','nail','name','nape','narc','nary','navy','near','neat',
        'neck','need','neon','nerd','nest','newt','next','nice','nick','nine','node',
        'noel','none','nook','noon','nope','norm','nose','nosy','note','noun','nova',
        'nude','nuke','null','numb','oath','obey','odds','odor','ogle','ogre','oily',
        'okay','okra','omen','omit','once','only','onto','onus','ooze','opal','open',
        'opus','oral','orbs','orca','ores','ouch','ours','oust','outs','ouzo','oval',
        'oven','over','owed','owls','owns','pace','pack','pact','page','paid','pail',
        'pain','pair','pale','pall','palm','pane','pang','pant','para','pare','park',
        'part','pass','past','pate','path','pave','pawn','peak','peal','pear','peas',
        'peat','peck','peek','peel','peep','peer','pelt','pend','pent','peon','perk',
        'perm','pert','peso','pest','pick','pier','pies','pike','pile','pill','pimp',
        'pine','ping','pink','pint','pipe','pita','pith','pity','plan','play','plea',
        'pled','plod','plop','plot','plow','ploy','plug','plum','plus','pock','poem',
        'poet','poke','poky','pole','poll','polo','pomp','pond','pony','pool','poop',
        'poor','pope','pork','porn','port','pose','posh','post','posy','pour','pout',
        'pray','prep','prey','prim','prod','prom','prop','prow','puck','puff','pull',
        'pulp','pump','punk','puny','pupa','pure','purl','purr','push','puts','putt',
        'quad','quay','quid','quip','quit','quiz','race','rack','raft','rage','raid',
        'rail','rain','rake','ramp','rang','rank','rant','rare','rash','rasp','rate',
        'rave','rays','raze','read','real','ream','reap','rear','redo','reed','reef',
        'reek','reel','rein','rely','rend','rent','repo','rest','rice','rich','ride',
        'rife','riff','rift','rile','rill','rime','rind','ring','rink','riot','ripe',
        'rise','risk','rite','road','roam','roar','robe','rock','rode','role','roll',
        'romp','roof','room','root','rope','ropy','rose','rosy','rote','rout','rove',
        'rube','ruby','ruck','rude','rued','ruin','rule','rump','rune','rung','runs',
        'runt','ruse','rush','rust','sack','safe','saga','sage','said','sail','sake',
        'sale','salt','same','sand','sane','sang','sank','sari','sash','sass','sate',
        'save','says','scab','scam','scan','scar','scat','seal','seam','sear','seas',
        'seat','sect','seed','seek','seem','seen','seep','seer','self','sell','semi',
        'send','sent','sept','sera','serf','sewn','sexy','shad','shag','sham','shed',
        'shim','shin','ship','shiv','shmo','shod','shoe','shoo','shop','shot','show',
        'shun','shut','sick','side','sigh','sign','silk','sill','silo','silt','sine',
        'sing','sink','sips','sire','site','sits','size','skew','skid','skim','skin',
        'skip','skit','slab','slag','slam','slap','slat','slaw','slay','sled','slew',
        'slid','slim','slit','slob','sloe','slog','slop','slot','slow','slub','slue',
        'slug','slum','slur','smog','snap','snag','snip','snit','snob','snot','snow',
        'snub','snug','soak','soap','soar','sobs','sock','soda','sofa','soft','soil',
        'sold','sole','solo','some','song','soon','soot','sore','sort','soul','soup',
        'sour','sown','spam','span','spar','spat','spec','sped','spew','spin','spit',
        'spot','spry','spud','spun','spur','stab','stag','star','stay','stem','step',
        'stew','stir','stop','stow','stub','stud','stun','subs','such','suck','suds',
        'sued','suet','suit','sulk','sumo','sump','sung','sunk','sure','surf','swab',
        'swam','swan','swap','swat','sway','swim','swob','swum','tabs','tack','taco',
        'tact','tail','take','tale','talk','tall','tame','tamp','tang','tank','tape',
        'taps','tart','task','taxi','teak','teal','team','tear','teas','teat','tech',
        'teed','teem','teen','tell','temp','tend','tens','tent','term','tern','test',
        'text','than','that','thaw','them','then','they','thin','this','thud','thug',
        'thus','tick','tide','tidy','tied','tier','tile','till','tilt','time','tine',
        'ting','tint','tiny','tips','tire','toad','toed','toes','tofu','toga','togs',
        'toil','told','toll','tomb','tome','tone','tong','tons','tony','took','tool',
        'toot','tops','tore','torn','tort','toss','tote','tots','tour','tout','town',
        'tows','toys','tram','trap','tray','tree','trek','trim','trio','trip','trod',
        'trot','true','tsar','tuba','tube','tubs','tuck','tuft','tuna','tune','turd',
        'turf','turn','tusk','tutu','twig','twin','twit','type','typo','ugly','undo',
        'unit','unto','upon','urge','used','user','vain','vale','vamp','vane','vary',
        'vase','vast','veal','veer','veil','vein','vend','vent','verb','very','vest',
        'veto','vial','vibe','vice','vied','view','vile','vine','visa','vise','void',
        'volt','vote','wade','waft','wage','waif','wail','wait','wake','walk','wall',
        'wand','wane','want','ward','ware','warm','warn','warp','wart','wary','wash',
        'wasp','wave','wavy','waxy','weak','wean','wear','weed','week','weep','weld',
        'well','welt','went','wept','were','west','wham','what','when','whet','whey',
        'whim','whip','whir','whiz','whom','wick','wide','wife','wild','will','wilt',
        'wily','wimp','wind','wine','wing','wink','wipe','wire','wiry','wise','wish',
        'wisp','with','wits','woes','woke','wolf','womb','wood','woof','wool','word',
        'wore','work','worm','worn','wort','wove','wrap','wren','writ','yack','yank',
        'yaps','yard','yarn','yawn','yawp','yeah','year','yeas','yell','yelp','yoga',
        'yoke','yolk','yore','your','yowl','yuan','yuck','yule','yurt','zany','zaps',
        'zeal','zero','zest','zinc','zine','zing','zips','zits','zone','zonk','zoom',
        // 5-letter words
        'abide','abled','abler','abode','abort','about','above','abuse','acorn','acres',
        'acted','actor','acute','adapt','added','adder','adept','admin','admit','adobe',
        'adopt','adult','after','again','agent','agile','aging','agony','agree','aided',
        'aimed','aimer','aired','aisle','alarm','album','alert','algae','alien','align',
        'alike','alive','allay','alley','allot','allow','alloy','aloft','alone','along',
        'aloof','aloud','alpha','altar','alter','amaze','amber','amend','ample','amply',
        'amuse','angel','anger','angle','angry','angst','anime','ankle','annex','annoy',
        'antic','anvil','apart','apple','apply','apron','aptly','arena','argue','arise',
        'armor','aroma','arose','array','arrow','arson','artsy','asset','atlas','attic',
        'audio','audit','aunty','avoid','await','awake','award','aware','awful','bacon',
        'badge','badly','bagel','baker','baked','balls','bands','banjo','banks','baron',
        'based','basic','basin','basis','batch','baton','beach','beads','beard','beast',
        'began','begin','begun','being','belly','below','bench','berry','bible','biddy',
        'biker','bikes','bills','bingo','birds','birth','black','blade','blame','bland',
        'blank','blast','blaze','bleak','bleed','blend','bless','blimp','blind','blink',
        'bliss','blitz','bloat','block','blond','blood','bloom','blown','blues','bluff',
        'blunt','blurb','blurt','blush','board','boast','boats','bogus','boils','bombs',
        'bones','bonus','boost','booth','boots','booze','boozy','bored','borne','bosom',
        'botch','bough','bound','boxer','brace','braid','brain','brake','brand','brash',
        'brass','brave','brawl','bread','break','breed','brick','bride','brief','brine',
        'bring','brink','brisk','broad','broil','broke','brood','brook','broom','broth',
        'brown','brunt','brush','brute','buddy','budge','buggy','build','built','bulge',
        'bulky','bully','bunch','bunny','burns','burnt','burst','buyer','cabin','cable',
        'cache','cadet','cadre','caged','cages','cairn','caked','cakes','camel','cameo',
        'camps','candy','canny','canoe','caper','cards','cared','carer','cares','cargo',
        'carol','carry','carve','cases','catch','cater','cause','cease','cedar','chain',
        'chair','chalk','champ','chant','chaos','charm','chart','chase','cheap','cheat',
        'check','cheek','cheer','chess','chest','chick','chief','child','chill','chimp',
        'china','chirp','choir','choke','chord','chore','chose','chunk','cigar','cinch',
        'circa','cited','cites','civic','civil','claim','clamp','clang','clank','clash',
        'clasp','class','clean','clear','clerk','click','cliff','climb','cling','cloak',
        'clock','clone','close','cloth','cloud','clout','clown','clubs','cluck','clued',
        'clues','clump','clung','coach','coast','coats','cocoa','coded','codes','coils',
        'coins','color','colon','combo','comes','comet','comic','comma','condo','coral',
        'cords','corps','couch','cough','could','count','coupe','court','cover','covet',
        'crack','craft','cramp','crane','crank','crash','crate','crave','crawl','craze',
        'crazy','creak','cream','creed','creek','creep','creme','crepe','crept','crest',
        'cried','crier','crime','crisp','croak','crock','crook','crops','cross','crowd',
        'crown','crude','cruel','crush','crust','crypt','cubic','cupid','curds','cured',
        'cures','curly','curry','curse','curve','curvy','cycle','cynic','daddy','daily',
        'dairy','daisy','dance','dandy','dated','dates','datum','dealt','death','debit',
        'debug','debut','decal','decay','decor','decoy','decry','deity','delay','delta',
        'delve','demon','denim','dense','depot','depth','derby','desks','detox','devil',
        'diary','dicey','digit','diner','dingy','dirty','disco','ditch','ditto','diver',
        'dodge','dodgy','doing','dolls','donor','donut','doubt','dough','dowdy','downs',
        'dozen','draft','drain','drake','drama','drank','drape','drawl','drawn','draws',
        'dread','dream','dress','dried','drier','drift','drill','drink','drive','droit',
        'droll','drone','drool','droop','drops','dross','drove','drown','drugs','drums',
        'drunk','dryer','dryly','ducts','dully','dummy','dumps','dumpy','dunce','dunes',
        'dusty','dwarf','dwell','dwelt','dying','eager','eagle','early','earth','eased',
        'easel','eaten','eater','ebony','edged','edges','edict','edits','eerie','eight',
        'eject','elbow','elder','elect','elite','elope','elude','elves','email','embed',
        'ember','emcee','empty','enact','ended','endow','enemy','enjoy','ennui','enrich',
        'ensue','enter','entry','envoy','epoch','equal','equip','erase','erect','erode',
        'error','erupt','essay','ether','ethic','evade','event','every','exact','exalt',
        'excel','exert','exile','exist','expat','extol','extra','exude','exult','eying',
        'fable','faced','facer','faces','facet','facto','facts','faded','fades','fails',
        'faint','fairy','faith','faker','falls','false','famed','fancy','fangs','farce',
        'farms','fatal','fatty','fault','fauna','favor','feast','feats','fecal','feeds',
        'feign','feint','fella','felon','femur','fence','feral','ferry','fetal','fetch',
        'fetid','fetus','fever','fewer','fiber','fibre','field','fiend','fiery','fifth',
        'fifty','fight','filch','filed','files','filet','fills','filly','filmy','filth',
        'final','finch','finds','fined','finer','fines','fired','fires','firms','first',
        'fishy','fitted','fiver','fives','fixed','fixer','fixes','fizzy','fjord','flack',
        'flags','flair','flake','flaky','flame','flank','flaps','flare','flash','flask',
        'flats','flaws','fleas','fleck','flesh','flick','flier','flies','fling','flint',
        'flips','flirt','float','flock','flood','floor','flops','flora','floss','flour',
        'flout','flows','fluid','fluke','flung','flunk','flush','flute','foamy','focal',
        'focus','foggy','foils','folds','folks','folly','fonts','foods','foray','force',
        'forge','forgo','forks','forms','forte','forth','forty','forum','fossil','foster',
        'found','fount','foxes','foyer','frail','frame','frank','fraud','frays','freak',
        'freed','fresh','friar','fried','frill','frisk','fritz','frizz','frock','frogs',
        'front','frost','froth','frown','froze','fruit','fudge','fuels','fully','fumed',
        'fumes','funds','fungi','funky','funny','furry','fused','fuses','fussy','fusty',
        'fuzzy','gaffe','gaily','gains','gamer','games','gamma','gamut','gangs','gaped',
        'gapes','gases','gasps','gassy','gated','gates','gauge','gauze','gauzy','gavel',
        'gawky','gayer','gazer','gazes','gears','gecko','geeks','geeky','genes','genie',
        'genre','genus','germs','ghost','giant','gifts','giddy','gills','girls','girly',
        'girth','given','giver','gives','gizmo','glade','gland','glare','glass','glaze',
        'gleam','glean','glide','glint','gloat','globe','gloom','glory','gloss','glove',
        'glued','glues','gluey','gnarl','gnars','gnash','gnome','goads','goals','goats',
        'godly','going','gonna','goody','gooey','goofy','goose','gorge','gotta','gouge',
        'gourd','grace','grade','graft','grail','grain','grand','grant','grape','graph',
        'grasp','grass','grate','grave','gravy','grays','graze','great','greed','greek',
        'green','greet','grief','grill','grime','grimy','grind','gripe','grips','grist',
        'grits','groan','groin','groom','grope','gross','group','grout','grove','growl',
        'grown','grows','gruel','gruff','grunt','guard','guava','guess','guest','guide',
        'guild','guilt','guise','gulch','gulls','gummy','guppy','gusto','gusty','gutter',
        'habit','hacks','hails','hairs','hairy','haler','hales','halls','halos','halts',
        'halve','hands','handy','hangs','happy','hardy','harem','harks','harms','harps',
        'harsh','haste','hasty','hatch','hated','hater','hates','hauls','haunt','haven',
        'havoc','hawks','hazel','heads','heady','heals','heaps','heard','hears','heart',
        'heath','heave','heavy','hedge','heeds','heels','hefts','hefty','heirs','heist',
        'hello','helps','hence','herbs','herds','heron','hides','hills','hilly','hilts',
        'hinds','hinge','hints','hippo','hippy','hires','hitch','hives','hoard','hoars',
        'hoary','hobby','hoist','holds','holes','holly','homer','homes','honey','honks',
        'honor','hoods','hoofs','hooks','hoops','hoots','hoped','hopes','horde','horns',
        'horny','horse','hosed','hoses','hosts','hotel','hound','hours','house','hover',
        'howls','huffs','huffy','hulks','hulls','human','humid','humps','humpy','humus',
        'hunch','hunks','hunky','hunts','hurls','hurry','hurts','husky','hutch','hyena',
        'hyper','icing','ideal','ideas','idiom','idiot','idler','idles','idols','igloo',
        'image','imbue','impel','imply','inane','incur','index','indie','inert','infer',
        'infra','ingot','inner','input','inter','intro','ionic','irate','irked','irons',
        'irony','isles','issue','itchy','items','ivies','ivory','jabot','jacks','jaded',
        'jails','jambs','japan','jaunt','jazzy','jeans','jeeps','jeers','jelly','jerks',
        'jerky','jesus','jewel','jiffy','jilts','jimmy','jinks','jived','jiver','jives',
        'joint','joked','joker','jokes','jolly','jolts','joust','joyed','judge','juice',
        'juicy','jumbo','jumps','jumpy','junco','junks','junky','juror','kabob','kayak',
        'keels','keeps','kelps','kiddo','kills','kilns','kilts','kinds','kings','kinks',
        'kinky','kiosk','knack','knead','kneed','kneel','knees','knell','knelt','knife',
        'knits','knock','knoll','knots','known','knows','kudos','label','labor','laced',
        'lacer','laces','lacks','laden','ladle','lager','lairs','lakes','lambs','lamer',
        'lames','lamps','lance','lands','lanes','lanky','lapel','lapse','large','larks',
        'larva','laser','lasso','lasts','latch','later','latex','lathe','lauds','laugh',
        'lavas','lawns','layer','leads','leafy','leaks','leaky','leant','leaps','leapt',
        'learn','leash','least','leave','ledge','leech','leeks','leers','leery','lefts',
        'lefty','legal','lemma','lemon','lemur','lends','lens','leper','level','lever',
        'liars','libel','licks','lifer','lifts','light','liked','liken','liker','likes',
        'lilac','limbo','limbs','limed','limes','limit','limps','lined','linen','liner',
        'lines','lingo','lings','links','lions','lipid','lisps','lists','liter','lithe',
        'litre','lived','liven','liver','lives','livid','llama','loads','loafs','loamy',
        'loans','loath','lobby','lobed','lobes','local','locks','locus','lodge','lofts',
        'lofty','logic','login','logos','loins','loner','longs','looks','looms','loons',
        'loony','loops','loopy','loose','loots','loped','loper','lopes','lords','lores',
        'loser','loses','lossy','lotto','lotus','louse','lousy','louts','loved','lover',
        'loves','lower','loyal','lucid','lucks','lucky','lulls','lumen','lumps','lumpy',
        'lunar','lunch','lunge','lungs','lurch','lured','lurer','lures','lurks','lusts',
        'lusty','lying','lymph','lyric','macho','macro','madam','madly','mafia','magic',
        'magma','maids','mails','maims','mains','maize','major','maker','makes','males',
        'malls','malts','malty','mamma','mammy','mango','mania','manic','manor','maple',
        'march','mares','maria','marks','marry','marsh','masks','mason','masse','masts',
        'match','mated','mates','matey','matte','mauls','maybe','mayor','mazes','meads',
        'meals','mealy','means','meant','meats','meaty','medal','media','medic','meeks',
        'meets','melee','melon','melts','memos','mends','menus','meows','mercy','merge',
        'merit','merry','messy','metal','meter','metro','micro','midst','might','miked',
        'mikes','miles','milks','milky','mills','mimed','mimer','mimes','mimic','mince',
        'minds','mined','miner','mines','minor','mints','minty','minus','mired','mires',
        'mirth','miser','missy','mists','misty','miter','mixed','mixer','mixes','moans',
        'moats','mocks','modal','model','modem','modes','moist','moldy','moles','molts',
        'mommy','money','monks','month','moods','moody','moons','moose','moped','moper',
        'mopes','moral','moron','morph','morse','mossy','motel','motif','motor','motto',
        'mould','mound','mount','mourn','mouse','mousy','mouth','moved','mover','moves',
        'movie','mowed','mower','mucks','mucky','mucus','muddy','muffs','muggy','mulch',
        'mules','multi','mumbo','mummy','mumps','munch','mural','murky','mused','muses',
        'mushy','music','musky','musty','muted','muter','mutes','mutts','nails','naive',
        'naked','named','namer','names','nanny','napes','nappy','narcs','nasal','nasty',
        'natal','navel','naves','navvy','nears','necks','needs','needy','nerds','nerdy',
        'nerve','nervy','nests','never','newer','newly','newsy','newts','nicer','niche',
        'nicks','niece','nifty','night','nimby','nines','ninja','ninth','nippy','niter',
        'nitro','noble','nobly','nodes','noise','noisy','nomad','nonce','nooks','norms',
        'north','nosed','noser','noses','nosey','notch','noted','noter','notes','nouns',
        'nudge','nuked','nukes','nulls','numbs','nurse','nutty','nylon','oaken','oaken',
        'oasis','oater','occur','ocean','octave','octet','oddly','odors','offal','offed',
        'offer','often','ogled','ogler','ogles','oiled','oiler','oinks','older','oldie',
        'olive','ombre','omega','onion','onset','oohed','oozed','oozes','opens','opera',
        'optic','orbit','order','organ','other','otter','ought','ounce','outed','outer',
        'outgo','outdo','outre','ovals','ovary','ovate','ovens','overt','ovoid','owing',
        'owned','owner','oxide','ozone','paced','pacer','paces','packs','paddy','pagan',
        'paged','pager','pages','pails','pains','paint','pairs','paled','paler','pales',
        'palms','palmy','panda','paned','panel','panes','panic','pansy','pants','panty',
        'papal','papas','paper','parch','pared','parer','pares','paris','parks','parry',
        'parse','parts','party','pasta','paste','pasty','patch','patio','patsy','patty',
        'pause','paved','paver','paves','pawns','peace','peach','peaks','peaky','peals',
        'pearl','pears','pecan','pecks','pedal','peeks','peels','peeps','peers','penal',
        'pence','penny','perch','perks','perky','perms','pesky','petal','petty','phase',
        'phone','phony','photo','piano','picks','picky','piece','piers','piggy','piled',
        'piles','pilot','pimps','pinch','pined','pines','piney','pings','pinks','pinky',
        'pinup','pious','piped','piper','pipes','pique','pitch','piths','pithy','piton',
        'pivot','pixel','pizza','place','plaid','plain','plane','plank','plans','plant',
        'plate','plays','plaza','plead','pleas','pleat','plebe','plebs','plied','plies',
        'plods','plonk','plops','plots','plows','ploys','pluck','plugs','plumb','plume',
        'plump','plums','plumy','plunk','plush','poems','poets','point','poise','poked',
        'poker','pokes','polar','poled','poles','polka','polls','polyp','ponds','pools',
        'poops','popes','poppy','porch','pored','pores','porky','porta','porte','ports',
        'posed','poser','poses','posit','posse','posts','potty','pouch','poult','pound',
        'pours','pouts','power','prams','prank','prawn','prays','preen','preps','press',
        'prexy','preys','price','prick','pricy','pride','pried','prier','pries','prime',
        'primp','print','prior','prism','prissy','privy','prize','probe','prods','promo',
        'prone','prong','proof','props','prose','prosy','proud','prove','prowl','prude',
        'prune','psalm','pubes','pubic','pudgy','puffs','puffy','pulls','pulps','pulpy',
        'pulse','pumps','punch','punks','punky','pupil','puppy','puree','purer','purge',
        'purrs','purse','pushy','putts','putty','pygmy','quack','quaff','quail','quake',
        'qualm','quark','quart','quasi','queen','queer','quell','query','quest','queue',
        'quick','quiet','quill','guilt','quilt','quirk','quota','quote','rabbi','rabid',
        'raced','racer','races','racks','radar','radii','radio','radon','rafts','raged',
        'rages','raids','rails','rains','rainy','raise','raked','raker','rakes','rally',
        'ramps','ranch','randy','range','rangy','ranks','rants','rapid','rarer','rasps',
        'raspy','rated','rater','rates','ratio','ratty','raved','ravel','raven','raver',
        'raves','rayon','razed','razes','razor','reach','react','reads','ready','realm',
        'reals','reams','reaps','rears','rebel','rebid','rebut','recap','recur','redid',
        'reeds','reedy','reefs','reeks','reels','refer','refit','regal','rehab','reign',
        'reins','relax','relay','relic','remit','remix','renal','renew','repay','repel',
        'reply','repos','rerun','reset','resin','retch','retro','retry','reuse','revel',
        'revue','rhino','rhyme','rider','rides','ridge','ridgy','rifle','rifts','right',
        'rigid','rigor','riled','riles','rills','rinds','rings','rinks','rinse','riots',
        'ripen','riper','risen','riser','rises','risks','risky','rites','ritzy','rival',
        'riven','river','rivet','roach','roads','roams','roars','roast','robed','robes',
        'robin','robot','rocks','rocky','rodeo','rogue','roles','rolls','roman','romps',
        'roofs','rooms','roomy','roost','roots','roped','roper','ropes','roses','rotor',
        'rouge','rough','round','rouse','route','rover','rowan','rowdy','rowed','rower',
        'royal','rubes','ruder','rudes','rugby','ruing','ruins','ruled','ruler','rules',
        'rumba','rumor','rumps','runes','rungs','runny','runts','runty','rupee','rural',
        'rusts','rusty','sadly','safer','safes','sages','sagas','saggy','saint','sakes',
        'salad','salon','salsa','salts','salty','salve','salvo','samba','sands','sandy',
        'saner','sappy','sassy','sated','satin','satyr','sauce','saucy','sauna','saute',
        'saved','saver','saves','savor','savvy','sawed','scabs','scald','scale','scalp',
        'scaly','scamp','scams','scans','scant','scare','scarf','scarp','scars','scary',
        'scene','scent','schmo','scoff','scold','scone','scoop','scoot','scope','score',
        'scorn','scour','scout','scowl','scram','scrap','scree','screw','scrub','scuba',
        'scuds','scuff','seals','seams','seamy','sears','seats','sects','sedan','seeds',
        'seedy','seeks','seems','seeps','seize','sells','semis','sends','sense','sepia',
        'sepoy','septa','serfs','serge','serif','serum','serve','setup','seven','sever',
        'sewed','sewer','sexed','sexes','shack','shade','shads','shady','shaft','shake',
        'shaky','shale','shall','shame','shams','shank','shape','shard','share','shark',
        'sharp','shave','shawl','sheaf','shear','sheds','sheen','sheep','sheer','sheet',
        'sheik','shelf','shell','shift','shill','shims','shine','shins','shiny','ships',
        'shire','shirk','shirt','shish','shock','shoed','shoes','shone','shook','shoot',
        'shops','shore','shorn','short','shots','shout','shove','shown','shows','showy',
        'shred','shrew','shrub','shrug','shuck','shuns','shunt','shush','shuts','sided',
        'sides','siege','sieve','sight','sigma','sighs','signs','silks','silky','sills',
        'silly','silts','silty','since','sinew','singe','sings','sinks','sinus','siren',
        'sires','sissy','sites','sixth','sixty','sized','sizer','sizes','skate','skeet',
        'skein','skews','skids','skied','skier','skies','skill','skimp','skims','skins',
        'skips','skirt','skits','skulk','skull','skunk','slabs','slack','slain','slake',
        'slams','slang','slant','slaps','slash','slate','slats','slave','slays','sleds',
        'sleek','sleep','sleet','slept','slice','slick','slide','slime','slimy','sling',
        'slink','slips','slits','slobs','slogs','slope','slops','slosh','sloth','slots',
        'slows','slubs','slues','slugs','slums','slung','slunk','slurp','slurs','slush',
        'slyer','slyly','smack','small','smart','smash','smear','smell','smelt','smile',
        'smirk','smite','smith','smock','smogs','smoke','smoky','snack','snafu','snags',
        'snail','snake','snaky','snaps','snare','snarl','sneak','sneer','snide','sniff',
        'snipe','snips','snits','snobs','snoop','snore','snort','snots','snout','snowy',
        'snubs','snuck','snuff','snugs','soaks','soaps','soapy','soars','sober','socks',
        'sodas','sofas','softy','soggy','soils','solar','soled','soles','solid','solos',
        'solve','sonar','songs','sonic','sonny','sooth','soots','sooty','soppy','sorry',
        'sorts','sought','souls','sound','soups','soupy','sours','south','sowed','sower',
        'space','spade','spank','spans','spare','spark','spars','spasm','spate','spawn',
        'speak','spear','speck','specs','speed','spell','spend','spent','spice','spicy',
        'spied','spiel','spies','spike','spiky','spill','spine','spins','spiny','spire',
        'spite','spits','splat','splay','split','spoke','spoof','spook','spool','spoon',
        'spore','sport','spots','spout','spray','spree','sprig','sprit','sprout','sprue',
        'spuds','spunk','spurn','spurt','squad','squat','squaw','squib','squid','stabs',
        'stack','staff','stage','staid','stain','stair','stake','stale','stalk','stall',
        'stamp','stand','stank','staph','stare','stark','stars','start','stash','state',
        'stats','stave','stays','stead','steak','steal','steam','steed','steel','steep',
        'steer','stems','steps','stern','stews','stick','stiff','still','stilt','sting',
        'stink','stint','stock','stoic','stoke','stole','stomp','stone','stony','stood',
        'stool','stoop','stops','store','stork','storm','story','stout','stove','strap',
        'straw','stray','strip','strut','stuck','studs','study','stuff','stump','stung',
        'stunk','stuns','stunt','style','suave','sucks','sugar','sulks','sulky','sully',
        'sumac','sunny','super','surge','surly','sushi','swabs','swamp','swank','swans',
        'swaps','swarm','swath','swats','sways','swear','sweat','sweep','sweet','swell',
        'swept','swift','swigs','swill','swims','swine','swing','swipe','swirl','swiss',
        'swoon','swoop','sword','swore','sworn','swung','tabby','table','taboo','tacit',
        'tacks','tacky','tacos','tails','taint','taken','taker','takes','tales','talks',
        'tally','talon','tamer','tames','tango','tangs','tangy','tanks','taper','tapes',
        'tardy','tared','tares','tarps','tarry','tarts','tasks','taste','tasty','tatty',
        'taunt','tawny','taxed','taxes','taxis','teach','teaks','teals','teams','tears',
        'teary','tease','teddy','teems','teens','teeny','teeth','tells','tempo','temps',
        'tempt','tends','tenor','tense','tenth','tents','tepee','tepid','terms','terns',
        'terra','tests','testy','texts','thank','thaws','theft','their','theme','there',
        'these','thick','thief','thigh','thing','think','third','thong','thorn','those',
        'three','threw','throb','throw','thrum','thuds','thugs','thumb','thump','tiara',
        'tibia','tidal','tides','tiers','tiger','tight','tikes','tilde','tiled','tiler',
        'tiles','tills','tilts','timed','timer','times','timid','tinge','tinny','tippy',
        'tipsy','tired','tires','titan','title','toads','toast','today','toddy','toffs',
        'togas','toils','token','tolls','tombs','tomes','tonal','toned','toner','tones',
        'tongs','tonic','tools','tooth','toots','topaz','topic','torch','torso','torus',
        'total','totem','touch','tough','tours','touts','towel','tower','towns','toxic',
        'toxin','trace','track','tract','trade','trail','train','trait','tramp','trams',
        'traps','trash','trawl','trays','tread','treat','trees','trend','triad','trial',
        'tribe','trick','tried','trier','tries','trike','trill','trims','trios','tripe',
        'trips','trite','troll','tromp','troop','trope','troth','trots','trout','truce',
        'truck','trudge','trued','truer','trues','truly','trump','trunk','truss','trust',
        'truth','tryst','tubal','tubby','tubed','tuber','tubes','tucks','tufts','tulip',
        'tumid','tummy','tumor','tunas','tuned','tuner','tunes','tunic','turds','turfs',
        'turfy','turns','tutor','tutti','tutus','tuxes','twain','twang','tweak','tweed',
        'tweet','twice','twigs','twill','twine','twirl','twist','tying','typed','types',
        'typos','udder','ulcer','ultra','umbra','umped','uncle','under','undid','undue',
        'unfed','unfit','union','unite','units','unity','unlit','unmet','untie','until',
        'unwed','unzip','upper','upset','urban','ureas','urged','urges','urine','usage',
        'users','usher','using','usual','utter','uvula','vague','vales','valet','valid',
        'valor','value','valve','vamps','vanes','vapor','vases','vault','vaunt','veers',
        'vegan','veils','veins','veiny','veldt','venom','vents','venue','verbs','verge',
        'verse','verso','vests','vexed','vexes','vibes','vicar','video','views','vigil',
        'vigor','viler','villa','vined','vines','vinyl','viola','viols','viper','viral',
        'virus','visas','vised','vises','visit','visor','vista','vital','vivid','vixen',
        'vocal','vodka','vogue','voice','voids','volts','vomit','voted','voter','votes',
        'vouch','vowed','vowel','vulva','wacko','wacky','waded','wader','wades','wafer',
        'waged','wager','wages','wagon','waifs','wails','waist','waits','waive','waked',
        'waken','wakes','walks','walls','waltz','wands','waned','wanes','wants','wards',
        'wares','warms','warns','warps','warts','warty','washy','wasps','waste','watch',
        'water','waved','waver','waves','wavy','waxed','waxen','waxes','weals','weans',
        'wears','weary','weave','webby','wedge','weeds','weedy','weeks','weeny','weeps',
        'weepy','weigh','weird','weirs','welch','welds','wells','welsh','welts','wench',
        'wends','whack','whale','wharf','wheat','wheel','whelp','where','which','whiff',
        'while','whims','whine','whiny','whips','whirl','whirr','whisk','white','whole',
        'whomp','whoop','whops','whose','wicks','widen','wider','wides','widow','width',
        'wield','wifes','wifey','wilds','wiled','wiles','wills','willy','wilts','wimps',
        'wimpy','wince','winch','winds','windy','wined','wines','wings','winks','wiped',
        'wiper','wipes','wired','wirer','wires','wised','wiser','wises','wisps','wispy',
        'witch','withe','wives','wizen','woken','wolfs','woman','wombs','women','wonky',
        'woods','woody','wooed','wooer','woofs','wools','wooly','woozy','words','wordy',
        'works','world','worms','wormy','worry','worse','worst','worth','would','wound',
        'woven','wowed','wrack','wraps','wrath','wreak','wreck','wrest','wrier','wring',
        'wrist','write','writs','wrong','wrote','wrung','wryly','yacht','yanks','yards',
        'yarns','yawns','yeahs','yearn','years','yeast','yells','yelps','yields','yodel',
        'yokel','yokes','yolks','young','yours','youth','yucky','yules','yummy','zappy',
        'zappy','zebra','zeros','zesty','zilch','zincs','zingy','zippy','zombi','zonal',
        'zoned','zoner','zones','zooms'
    ]);

    // Pre-defined puzzles: center letter + 6 outer letters
    // Each puzzle has been verified to have valid words including at least one pangram
    const PUZZLES = [
        { center: 'a', outer: ['b', 'c', 'k', 'l', 'n', 't'], pangram: 'blacktant' },
        { center: 'e', outer: ['a', 'l', 'r', 's', 't', 'v'], pangram: 'traveles' },
        { center: 'i', outer: ['c', 'g', 'l', 'n', 'o', 't'], pangram: 'clotting' },
        { center: 'o', outer: ['c', 'd', 'l', 'n', 'r', 'u'], pangram: 'uncolord' },
        { center: 'n', outer: ['a', 'e', 'g', 'l', 'r', 't'], pangram: 'triangle' },
        { center: 'r', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'terminal' },
        { center: 's', outer: ['a', 'e', 'l', 'n', 'p', 't'], pangram: 'pleasant' },
        { center: 't', outer: ['a', 'e', 'i', 'l', 'n', 'r'], pangram: 'terminal' },
        { center: 'l', outer: ['a', 'e', 'i', 'n', 'r', 's'], pangram: 'snarlie' },
        { center: 'a', outer: ['d', 'e', 'i', 'l', 'n', 't'], pangram: 'detailed' },
        { center: 'e', outer: ['a', 'c', 'h', 'i', 'n', 't'], pangram: 'teaching' },
        { center: 'g', outer: ['a', 'e', 'i', 'n', 'r', 't'], pangram: 'treating' },
        { center: 'i', outer: ['a', 'd', 'e', 'l', 'n', 't'], pangram: 'detailed' },
        { center: 'o', outer: ['a', 'b', 'e', 'l', 'r', 't'], pangram: 'bootable' },
        { center: 'm', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'lamented' },
        { center: 'd', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'detailed' },
        { center: 'h', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'ealthin' },
        { center: 'c', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'entical' },
        { center: 'p', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'platine' },
        { center: 'w', outer: ['a', 'e', 'i', 'l', 'n', 't'], pangram: 'tailwen' },
    ];

    // Ranks based on percentage of max score
    const RANKS = [
        { name: 'Beginner', percent: 0 },
        { name: 'Good Start', percent: 2 },
        { name: 'Moving Up', percent: 5 },
        { name: 'Good', percent: 8 },
        { name: 'Solid', percent: 15 },
        { name: 'Nice', percent: 25 },
        { name: 'Great', percent: 40 },
        { name: 'Amazing', percent: 50 },
        { name: 'Genius', percent: 70 },
        { name: 'Queen Bee', percent: 100 }
    ];

    // Game state
    let state = {
        puzzle: null,
        letters: [],
        centerLetter: '',
        currentWord: '',
        foundWords: [],
        score: 0,
        maxScore: 0,
        message: '',
        messageType: '',
        validWords: [],
        showRules: false
    };

    // Find all valid words for a puzzle
    function findValidWords(centerLetter, allLetters) {
        const letterSet = new Set(allLetters);
        const valid = [];

        for (const word of WORDS) {
            if (word.length < 4) continue;
            if (!word.includes(centerLetter)) continue;

            let isValid = true;
            for (const char of word) {
                if (!letterSet.has(char)) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                valid.push(word);
            }
        }

        return valid;
    }

    // Calculate score for a word
    function getWordScore(word, allLetters) {
        if (word.length === 4) return 1;

        let score = word.length;

        // Check for pangram (uses all 7 letters)
        const letterSet = new Set(allLetters);
        const wordLetters = new Set(word);
        if (wordLetters.size >= 7 && [...letterSet].every(l => wordLetters.has(l))) {
            score += 7; // Pangram bonus
        }

        return score;
    }

    // Check if word is a pangram
    function isPangram(word, allLetters) {
        const letterSet = new Set(allLetters);
        const wordLetters = new Set(word);
        return [...letterSet].every(l => wordLetters.has(l));
    }

    // Shuffle outer letters
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function launchSpellingBee() {
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('spellingBeeGame').style.display = 'block';
        startNewGame();
    }

    function exitSpellingBee() {
        document.getElementById('spellingBeeGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    function startNewGame() {
        const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        const allLetters = [puzzle.center, ...puzzle.outer];
        const validWords = findValidWords(puzzle.center, allLetters);

        let maxScore = 0;
        for (const word of validWords) {
            maxScore += getWordScore(word, allLetters);
        }

        state = {
            puzzle: puzzle,
            letters: shuffleArray(puzzle.outer),
            centerLetter: puzzle.center,
            currentWord: '',
            foundWords: [],
            score: 0,
            maxScore: maxScore,
            message: '',
            messageType: '',
            validWords: validWords
        };

        renderGame();
    }

    function getCurrentRank() {
        const percent = (state.score / state.maxScore) * 100;
        let currentRank = RANKS[0];
        for (const rank of RANKS) {
            if (percent >= rank.percent) {
                currentRank = rank;
            }
        }
        return currentRank;
    }

    function addLetter(letter) {
        state.currentWord += letter;
        state.message = '';
        renderGame();
    }

    function deleteLetter() {
        state.currentWord = state.currentWord.slice(0, -1);
        state.message = '';
        renderGame();
    }

    function shuffleLetters() {
        state.letters = shuffleArray(state.letters);
        renderGame();
    }

    function toggleRules() {
        state.showRules = !state.showRules;
        renderGame();
    }

    function submitWord() {
        const word = state.currentWord.toLowerCase();

        if (word.length < 4) {
            state.message = 'Too short';
            state.messageType = 'error';
        } else if (!word.includes(state.centerLetter)) {
            state.message = 'Missing center letter';
            state.messageType = 'error';
        } else if (state.foundWords.includes(word)) {
            state.message = 'Already found';
            state.messageType = 'error';
        } else if (!state.validWords.includes(word)) {
            state.message = 'Not in word list';
            state.messageType = 'error';
        } else {
            // Valid word!
            const allLetters = [state.centerLetter, ...state.letters];
            const points = getWordScore(word, allLetters);
            state.score += points;
            state.foundWords.push(word);
            state.foundWords.sort();

            if (isPangram(word, allLetters)) {
                state.message = `PANGRAM! +${points}`;
                state.messageType = 'pangram';
            } else {
                state.message = `+${points}`;
                state.messageType = 'success';
            }
        }

        state.currentWord = '';
        renderGame();

        // Clear message after delay
        setTimeout(() => {
            if (state.message) {
                state.message = '';
                renderGame();
            }
        }, 1500);
    }

    function handleKeyPress(e) {
        const key = e.key.toLowerCase();
        const allLetters = [state.centerLetter, ...state.letters];

        if (key === 'enter') {
            submitWord();
        } else if (key === 'backspace') {
            deleteLetter();
        } else if (key.length === 1 && allLetters.includes(key)) {
            addLetter(key);
        }
    }

    function renderGame() {
        const content = document.getElementById('spellingBeeContent');
        const allLetters = [state.centerLetter, ...state.letters];
        const currentRank = getCurrentRank();
        const progressPercent = Math.min(100, (state.score / state.maxScore) * 100);

        // Render current word with center letter highlighted
        let wordDisplay = '';
        for (const char of state.currentWord) {
            if (char === state.centerLetter) {
                wordDisplay += `<span class="center-letter">${char}</span>`;
            } else {
                wordDisplay += char;
            }
        }

        content.innerHTML = `
            <div class="sb-container">
                <div class="sb-card">
                    <button class="sb-back-btn" onclick="exitSpellingBee()">← Back</button>
                    <button class="sb-rules-toggle" onclick="window.spellingbee.toggleRules()">?</button>

                    <div class="sb-header">
                        <h1 class="sb-title">Spelling Bee</h1>
                        <p class="sb-subtitle">${currentRank.name}</p>
                    </div>

                    ${state.showRules ? `
                    <div class="sb-rules">
                        <h4>How to Play</h4>
                        <p>
                            • Create words using the letters shown<br>
                            • Words must be at least 4 letters long<br>
                            • Words must include the center letter (gold)<br>
                            • Letters can be used more than once<br>
                            • 4-letter words = 1 point<br>
                            • Longer words = 1 point per letter<br>
                            • Pangram (uses all 7 letters) = +7 bonus!
                        </p>
                    </div>
                    ` : ''}

                    <div class="sb-progress">
                        <div class="sb-progress-bar">
                            <div class="sb-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>

                    <div class="sb-stats">
                        <div class="sb-stat">
                            <div class="sb-stat-value">${state.score}</div>
                            <div class="sb-stat-label">Points</div>
                        </div>
                        <div class="sb-stat">
                            <div class="sb-stat-value">${state.foundWords.length}</div>
                            <div class="sb-stat-label">Words</div>
                        </div>
                        <div class="sb-stat">
                            <div class="sb-stat-value">${state.validWords.length - state.foundWords.length}</div>
                            <div class="sb-stat-label">Remaining</div>
                        </div>
                    </div>

                    <div class="sb-input-area">
                        <div class="sb-current-word">
                            ${wordDisplay}<span class="sb-cursor"></span>
                        </div>
                    </div>

                    <div class="sb-message ${state.messageType}">${state.message}</div>

                    <div class="sb-honeycomb">
                        <div class="sb-hex-row">
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[0]}')">${state.letters[0]}</div>
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[1]}')">${state.letters[1]}</div>
                        </div>
                        <div class="sb-hex-row">
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[2]}')">${state.letters[2]}</div>
                            <div class="sb-hex center" onclick="window.spellingbee.addLetter('${state.centerLetter}')">${state.centerLetter}</div>
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[3]}')">${state.letters[3]}</div>
                        </div>
                        <div class="sb-hex-row">
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[4]}')">${state.letters[4]}</div>
                            <div class="sb-hex" onclick="window.spellingbee.addLetter('${state.letters[5]}')">${state.letters[5]}</div>
                        </div>
                    </div>

                    <div class="sb-buttons">
                        <button class="sb-btn sb-btn-delete" onclick="window.spellingbee.deleteLetter()">Delete</button>
                        <button class="sb-btn sb-btn-shuffle" onclick="window.spellingbee.shuffleLetters()">⟳</button>
                        <button class="sb-btn sb-btn-enter" onclick="window.spellingbee.submitWord()">Enter</button>
                    </div>

                    <div class="sb-found-words">
                        <div class="sb-found-header">
                            <span>Found words</span>
                            <span>${state.foundWords.length} / ${state.validWords.length}</span>
                        </div>
                        <div class="sb-found-list">
                            ${state.foundWords.map(word => {
                                const isPg = isPangram(word, allLetters);
                                return `<span class="sb-found-word ${isPg ? 'pangram' : ''}">${word}</span>`;
                            }).join('')}
                        </div>
                    </div>

                    <button class="sb-new-game-btn" onclick="window.spellingbee.newGame()">New Puzzle</button>
                </div>
            </div>
        `;

        // Add keyboard listener
        document.onkeydown = handleKeyPress;
    }

    // Expose functions
    window.launchSpellingBee = launchSpellingBee;
    window.exitSpellingBee = exitSpellingBee;
    window.spellingbee = {
        addLetter: addLetter,
        deleteLetter: deleteLetter,
        shuffleLetters: shuffleLetters,
        submitWord: submitWord,
        newGame: startNewGame,
        toggleRules: toggleRules
    };

})();

// Ghost Word Game
(function() {
    'use strict';

    // Word list for validation (4+ letter words)
    const WORDS = new Set([
        // Common 4-letter words
        'able','about','above','acid','aged','also','area','army','away','baby','back','ball','band','bank',
        'base','bath','bear','beat','been','beer','bell','belt','bend','best','bill','bird','bite','blow',
        'blue','boat','body','bomb','bond','bone','book','boom','born','boss','both','bowl','bulk','burn',
        'bush','busy','call','calm','came','camp','card','care','case','cash','cast','cave','cell','chat',
        'chip','city','club','coal','coat','code','cold','come','cook','cool','cope','copy','core','cost',
        'crew','crop','dark','data','date','dawn','days','dead','deal','dean','dear','debt','deep','deny',
        'desk','diet','dirt','disc','dish','disk','does','done','door','dose','down','draw','drew','drop',
        'drug','dual','duke','dust','duty','each','earn','ease','east','easy','edge','else','even','ever',
        'evil','exam','exit','face','fact','fail','fair','fall','fame','farm','fast','fate','fear','feed',
        'feel','feet','fell','felt','file','fill','film','find','fine','fire','firm','fish','five','flag',
        'flat','fled','flew','flip','flow','fold','folk','food','foot','ford','form','fort','four','free',
        'from','fuel','full','fund','gain','game','gang','gate','gave','gear','gene','gift','girl','give',
        'glad','goal','goes','gold','golf','gone','good','grab','gray','grew','grey','grid','grip','grow',
        'gulf','hair','half','hall','hand','hang','hard','harm','hate','have','head','hear','heat','heel',
        'held','hell','help','here','hero','hide','high','hill','hire','hold','hole','holy','home','hope',
        'horn','host','hour','huge','hung','hunt','hurt','idea','inch','into','iron','item','jack','jail',
        'jane','jean','jobs','john','join','joke','jump','june','jury','just','keen','keep','kent','kept',
        'kick','kill','kind','king','knee','knew','know','lack','lady','laid','lake','land','lane','last',
        'late','lead','leaf','left','less','life','lift','like','line','link','list','live','load','loan',
        'lock','logo','long','look','lord','lose','loss','lost','love','luck','made','mail','main','make',
        'male','many','mark','mass','matt','meal','mean','meat','meet','menu','mere','mike','mild','mile',
        'milk','mill','mind','mine','miss','mode','mood','moon','more','most','move','much','must','name',
        'navy','near','neck','need','neil','nest','news','next','nice','nick','nine','none','nose','note',
        'odds','okay','once','only','onto','open','oral','over','pace','pack','page','paid','pain','pair',
        'palm','park','part','pass','past','path','peak','pick','pink','pipe','plan','play','plot','plug',
        'plus','poem','poet','pole','poll','pond','pool','poor','pope','port','pose','post','pour','pull',
        'pure','push','race','rail','rain','rank','rare','rate','read','real','rear','rely','rent','rest',
        'rice','rich','ride','ring','rise','risk','road','rock','rode','role','roll','roof','room','root',
        'rose','rule','rush','ruth','safe','said','sake','sale','salt','same','sand','save','seat','seed',
        'seek','seem','seen','self','sell','send','sent','sept','ship','shop','shot','show','shut','sick',
        'side','sign','silk','site','size','skin','slip','slow','snow','soft','soil','sold','sole','some',
        'song','soon','sort','soul','spot','star','stay','stem','step','stop','such','suit','sure','take',
        'tale','talk','tall','tank','tape','task','team','tech','tell','tend','tent','term','test','text',
        'than','that','them','then','they','thin','this','thus','tide','till','time','tiny','told','toll',
        'tone','tony','took','tool','tops','torn','toss','tour','town','tree','trim','trip','true','tube',
        'tune','turn','twin','type','unit','upon','used','user','vary','vast','very','vice','view','vote',
        'wage','wait','wake','walk','wall','want','ward','warm','wash','wave','ways','weak','wear','week',
        'well','went','were','west','what','when','whom','wide','wife','wild','will','wind','wine','wing',
        'wire','wise','wish','with','wood','word','wore','work','worm','worn','wrap','yard','yeah','year',
        'your','zero','zone',
        // 5-letter words
        'about','above','abuse','actor','acute','admit','adopt','adult','after','again','agent','agree',
        'ahead','alarm','album','alert','alien','align','alike','alive','alley','allow','alloy','alone',
        'along','alter','among','anger','angle','angry','apart','apple','apply','arena','argue','arise',
        'armor','array','arrow','asset','atlas','avoid','award','aware','awful','bacon','badge','badly',
        'baker','basis','batch','beach','beard','beast','began','begin','begun','being','belly','below',
        'bench','berry','birth','black','blade','blame','blank','blast','blaze','bleed','blend','bless',
        'blind','blink','bliss','block','blood','bloom','blown','blues','blunt','board','boast','bonus',
        'booth','booze','bored','bound','boxer','brain','brake','brand','brass','brave','bread','break',
        'breed','brick','bride','brief','bring','broad','broke','brook','broom','brown','brush','buddy',
        'build','built','bunch','burst','buyer','cabin','cable','cache','camel','canal','candy','canon',
        'cargo','carol','carry','carve','catch','cater','cause','cease','chain','chair','chalk','champ',
        'chant','chaos','charm','chart','chase','cheap','cheat','check','cheek','cheer','chess','chest',
        'chick','chief','child','chill','china','choir','chord','chunk','cinch','circa','civic','civil',
        'claim','clamp','clash','clasp','class','clean','clear','clerk','click','cliff','climb','cling',
        'clips','cloak','clock','clone','close','cloth','cloud','clown','coach','coast','colon','color',
        'comet','comma','coral','couch','cough','could','count','coup','court','cover','crack','craft',
        'crane','crash','crawl','craze','crazy','cream','creed','creek','creep','crest','crime','crisp',
        'cross','crowd','crown','crude','cruel','crush','curve','cycle','daily','dairy','dance','dated',
        'dealt','death','debug','debut','decay','decor','decoy','deity','delay','dense','depot','depth',
        'derby','deter','detox','devil','diary','dirty','disco','ditch','diver','dizzy','dodge','doing',
        'donor','doubt','dough','draft','drain','drake','drama','drank','drape','drawl','dread','dream',
        'dress','dried','drift','drill','drink','drive','droit','drown','drunk','dwarf','dwell','dying',
        'eager','eagle','early','earth','eaten','eater','edges','eight','elbow','elder','elect','elite',
        'email','embed','ember','empty','ended','enemy','enjoy','enter','entry','equal','equip','erase',
        'error','essay','ethos','evade','event','every','exact','exams','exert','exile','exist','extra',
        'fable','faced','facet','facts','faint','fairy','faith','falls','false','fancy','farms','fatal',
        'fatty','fault','favor','feast','fence','ferry','fetal','fetch','fever','fiber','fibre','field',
        'fiery','fifth','fifty','fight','files','final','finds','finer','fired','fires','first','fixed',
        'flair','flame','flank','flare','flash','flask','fleet','flesh','flies','fling','flint','float',
        'flock','flood','floor','flora','flour','flown','fluid','flung','flunk','flush','flute','focal',
        'focus','folks','force','forge','forth','forty','forum','fossil','found','foyer','frail','frame',
        'frank','fraud','freak','freed','fresh','friar','fried','front','frost','froze','fruit','fully',
        'fungi','funky','funny','gamma','gases','gauge','gaunt','gauze','gavel','gazed','geese','genre',
        'ghost','giant','given','gives','gland','glare','glass','gleam','glide','globe','gloom','glory',
        'gloss','glove','glyph','gnome','going','grace','grade','grain','grand','grant','grape','graph',
        'grasp','grass','grave','gravel','graze','great','greed','greek','green','greet','grief','grill',
        'grind','groan','groom','gross','group','grove','growl','grown','guard','guess','guest','guide',
        'guild','guilt','guise','gulch','habit','hairs','hairy','hands','handy','happy','hardy','harsh',
        'haste','hasty','hatch','haven','havoc','heads','heady','heard','heart','heavy','hedge','heels',
        'hefty','heist','hello','helps','hence','herbs','hills','hilly','hinge','hippo','hired','hobby',
        'holds','holes','holly','homes','honey','honor','hoped','hoped','horse','hosts','hotel','hound',
        'hours','house','human','humid','humor','hurry','hydro','hyper','ideal','ideas','idiom','idiot',
        'image','imply','inbox','incur','index','indie','inner','input','intel','inter','intro','ionic',
        'irish','irony','issue','items','ivory','japan','jeans','jelly','jewel','jiffy','jimmy','joins',
        'joint','joker','jolly','jones','joust','judge','juice','juicy','jumbo','jumps','jumpy','junta',
        'juror','karma','kayak','kebab','keeps','kelly','kevin','keyed','kicks','kinds','kings','kiosk',
        'knack','knead','kneel','knelt','knife','knock','knoll','known','knows','kudos','label','labor',
        'laced','lacks','lager','laity','lakes','lamps','lands','lanes','lanky','lapel','lapse','large',
        'larva','laser','lasso','lasts','latch','later','latex','latin','laugh','layer','leads','leafy',
        'leaky','leant','leapt','learn','lease','least','leave','ledge','legal','lemon','level','lever',
        'libel','lifts','light','liked','limbo','limbs','limit','lined','linen','liner','lines','lingo',
        'links','lions','lists','liter','litre','lived','lively','liver','lives','llama','loads','loans',
        'lobby','local','locks','lodge','lofty','logic','login','logos','looks','loops','loose','lords',
        'lorry','loser','loses','lotus','lousy','loved','lover','loves','lower','loyal','lucid','lucky',
        'lumpy','lunar','lunch','lungs','lusty','lying','lyric','macho','macro','magic','magma','major',
        'maker','makes','males','malls','manga','mango','mania','manor','maple','march','marry','marsh',
        'masks','match','maths','mauve','maxim','maybe','mayor','meals','means','meant','meaty','medal',
        'media','medic','meets','melee','melon','mercy','merge','merit','merry','messy','metal','meter',
        'metro','micro','midst','might','mince','minds','mined','miner','mines','minor','minus','mirth',
        'misty','mixed','mixer','model','modem','modes','moist','molar','moldy','money','month','moods',
        'moody','moors','moose','moral','moron','morph','motel','motif','motor','motto','mould','mound',
        'mount','mourn','mouse','mousy','mouth','moved','mover','moves','movie','mucky','mucus','muddy',
        'multi','mummy','munch','mural','murky','music','musty','naive','named','names','nanny','nasal',
        'nasty','naval','needs','nerve','nervy','never','newer','newly','nexus','nicer','niche','night',
        'nimby','ninja','ninth','noble','nodal','nodes','noise','noisy','nomad','norms','north','notch',
        'noted','notes','nouns','novel','nudge','nurse','nutty','nylon','oasis','occur','ocean','oddly',
        'offer','often','olive','omega','onion','onset','opens','opera','optic','orbit','order','organ',
        'other','ought','ounce','outer','outgo','outre','owned','owner','oxide','ozone','paced','pacer',
        'paces','packs','pages','pains','paint','pairs','palms','panel','panic','pants','papal','paper',
        'parks','party','pasta','paste','pasty','patch','paths','patio','pause','peace','peach','pearl',
        'pedal','peers','penny','perks','perky','pesky','pests','petty','phase','phone','photo','piano',
        'picks','picky','piece','piggy','pilot','pinch','pipes','pitch','pithy','pivot','pixel','pizza',
        'place','plain','plane','plank','plans','plant','plate','plaza','plead','pleat','pledge','plier',
        'plots','pluck','plugs','plumb','plump','plums','plunk','plush','poems','poets','point','poise',
        'polar','poles','polls','polyp','ponds','pools','popes','poppy','porch','pores','ports','posed',
        'poser','poses','posts','pouch','pound','power','prank','prawn','press','price','pricy','pride',
        'prime','print','prior','prism','privy','prize','probe','promo','prone','proof','props','prose',
        'proud','prove','proxy','prude','prune','psalm','pubic','pulls','pulse','pumps','punch','pupil',
        'puppy','purge','purse','pushy','queen','query','quest','queue','quick','quiet','quilt','quirk',
        'quota','quote','racer','races','radar','radii','radio','rainy','raise','rally','ramps','ranch',
        'range','ranks','rapid','rated','rates','ratio','razor','reach','react','reads','ready','realm',
        'reams','rebel','recap','recon','recur','refer','reign','relax','relay','relic','remit','remix',
        'renal','renew','repay','repel','reply','rerun','reset','resin','retro','retry','reuse','revel',
        'ridge','rifle','right','rigid','rigor','rings','riots','ripen','risen','rises','risks','risky',
        'rites','ritzy','rival','river','roads','roast','robes','robin','robot','rocks','rocky','rogue',
        'roles','rolls','roman','rooms','roomy','roots','ropes','roses','rotor','rouge','rough','round',
        'route','rover','rowdy','royal','rugby','ruins','ruled','ruler','rules','rumor','rungs','rural',
        'rusty','sadly','saint','salad','sales','salon','salsa','salty','salute','sandy','satin','sauce',
        'sauna','saved','saver','saves','savor','savvy','scald','scale','scalp','scaly','scamp','scant',
        'scare','scarf','scary','scene','scent','scone','scoop','scope','score','scorn','scout','scrap',
        'seams','seats','seeds','seeks','seems','seize','sells','sends','sense','serum','serve','setup',
        'seven','sever','shade','shady','shaft','shake','shaky','shall','shame','shape','shard','share',
        'shark','sharp','shawl','sheaf','shear','sheen','sheep','sheer','sheet','shelf','shell','shift',
        'shine','shiny','ships','shire','shirt','shock','shone','shook','shoot','shops','shore','short',
        'shots','shout','shove','shown','shows','showy','shred','shrub','shrug','shuck','shunt','sided',
        'sides','siege','sight','sigma','signs','silky','silly','since','siren','sissy','sites','sixth',
        'sixty','sized','sizes','skate','skier','skill','skimp','skins','skirt','skull','skunk','slack',
        'slain','slang','slant','slash','slate','slave','sleek','sleep','sleet','slept','slice','slick',
        'slide','slime','slimy','sling','slink','slope','slosh','sloth','slump','slums','slung','slunk',
        'slurp','slush','small','smart','smash','smear','smell','smile','smirk','smith','smock','smoke',
        'smoky','snack','snafu','snail','snake','snaky','snaps','snare','snarl','sneak','sneer','snide',
        'sniff','snipe','snore','snort','snout','snowy','snuck','snuff','soapy','sober','socks','soggy',
        'solar','solemn','solid','solve','songs','sonic','sorry','sorts','souls','sound','south','space',
        'spade','spank','spare','spark','spasm','spawn','speak','spear','speck','specs','speed','spell',
        'spend','spent','spice','spicy','spied','spike','spiky','spill','spine','spiny','spite','splat',
        'split','spoil','spoke','spoof','spook','spool','spoon','spore','sport','spots','spout','spray',
        'spree','sprig','spunk','squad','squat','squid','stack','staff','stage','stain','stair','stake',
        'stale','stalk','stall','stamp','stand','stank','stare','stark','stars','start','stash','state',
        'stays','steak','steal','steam','steel','steep','steer','stems','steps','stern','stick','stiff',
        'still','sting','stink','stint','stock','stoic','stoke','stole','stomp','stone','stony','stood',
        'stool','stoop','stops','store','stork','storm','story','stout','stove','strap','straw','stray',
        'strip','strut','stuck','study','stuff','stump','stung','stunk','stunt','style','suave','sucks',
        'sugar','suite','suits','sulky','sunny','super','surge','surly','swamp','swarm','swear','sweat',
        'sweep','sweet','swell','swept','swift','swims','swine','swing','swipe','swirl','swiss','sword',
        'swore','sworn','swung','tabby','table','taboo','tacit','tacky','taffy','taint','taken','taker',
        'takes','tales','talks','tally','talon','tamed','tangy','tanks','tapes','tardy','tarry','taste',
        'tasty','tatty','taunt','taxed','taxes','teach','teams','teary','tease','teddy','teems','teens',
        'teeth','tempo','tends','tense','tenth','tents','tepid','terms','terra','tests','texts','thank',
        'theft','their','theme','there','these','thick','thief','thigh','thing','think','third','thorn',
        'those','three','threw','throb','throw','thumb','thump','tiara','tidal','tides','tiger','tight',
        'tiled','tiles','timer','times','timid','tinny','tipsy','tired','titan','title','toast','today',
        'token','tonal','toned','tones','tonic','tools','tooth','topaz','topic','torch','total','touch',
        'tough','tours','towel','tower','towns','toxic','trace','track','tract','trade','trail','train',
        'trait','tramp','trash','treat','trees','trend','triad','trial','tribe','trick','tried','tries',
        'trill','trims','trips','trite','troll','troop','trout','truce','truck','truly','trump','trunk',
        'truss','trust','truth','tubby','tubes','tulip','tumor','tuned','tuner','tunes','tunic','turns',
        'tutor','twang','tweak','tweed','tweet','twice','twigs','twine','twirl','twist','tying','types',
        'udder','ulcer','ultra','uncle','uncut','under','undue','unfed','unfit','unify','union','unite',
        'units','unity','unlit','unmet','unset','until','unwed','upper','upset','urban','urged','urine',
        'usage','users','usher','using','usual','utter','vague','valid','valor','value','valve','vapor',
        'vault','vaunt','veins','veldt','venom','venue','verbs','verge','verse','vicar','video','vigor',
        'viper','viral','virus','visor','visit','vista','vital','vivid','vocal','vodka','vogue','voice',
        'voila','vomit','voter','votes','vouch','vowel','vying','wacky','waded','wader','wades','wafer',
        'waged','wager','wages','wagon','waist','waits','waken','wakes','walks','walls','waltz','wands',
        'wants','wards','warns','warts','warty','waste','watch','water','waved','waver','waves','wavey',
        'waxed','waxen','weary','weave','webby','wedge','weeds','weedy','weeks','weigh','weird','wells',
        'welsh','wench','whack','whale','wharf','wheat','wheel','where','which','while','whims','whine',
        'whiny','whips','whirl','whisk','white','whole','whose','widen','wider','widow','width','wield',
        'wilds','wills','wimpy','wince','winch','winds','windy','wines','wings','wiped','wiper','wipes',
        'wired','wires','wiser','witch','witty','wives','woken','woman','women','woody','woozy','words',
        'wordy','works','world','worms','wormy','worry','worse','worst','worth','would','wound','woven',
        'wrack','wraps','wrath','wreak','wreck','wrest','wring','wrist','write','wrong','wrote','wryly',
        'yacht','yearn','years','yeast','yield','young','yours','youth','zappy','zebra','zesty','zilch',
        'zingy','zippy','zonal','zoned','zones','zooms',
        // 6+ letter words
        'abandon','ability','absence','academy','account','achieve','acquire','address','advance','advice',
        'affairs','against','airline','airport','alcohol','already','although','amazing','america','ancient',
        'another','anxiety','anybody','applied','arrange','arrival','article','assault','attempt','attract',
        'average','awesome','balance','banking','barrier','battery','bearing','beating','because','bedroom',
        'believe','beneath','benefit','besides','between','billion','blanket','blocked','booking','borough',
        'bother','bottom','bought','boundary','bracket','branch','breath','breathe','bridge','briefly',
        'bright','brilliant','brings','britain','british','broader','broken','brother','brought','browser',
        'budget','builder','building','bulletin','burning','cabinet','calling','campaign','capable','capital',
        'captain','capture','careful','carrier','carrying','catalog','category','causing','ceiling','central',
        'centre','century','certain','chamber','champion','channel','chapter','charity','charlie','charter',
        'cheaper','checked','chicken','children','chinese','choices','chronic','circuit','citizen','claimed',
        'classic','cleaned','cleaner','clearly','clicked','climate','closely','closest','clothes','cluster',
        'coastal','coating','college','colonial','combine','comfort','command','comment','commerce','commit',
        'common','communication','community','compact','company','compare','compete','compile','complex',
        'component','compound','computer','concept','concern','conclude','concrete','condition','conduct',
        'conference','confidence','confirm','conflict','confused','congress','connect','consent','consider',
        'consist','constant','consumer','contact','contain','content','contest','context','continue','contract',
        'contrast','contribute','control','convert','cooking','cooling','copying','correct','council','counter',
        'country','coupled','courage','courses','covered','covering','crashed','created','creating','creation',
        'creative','creature','cricket','criminal','critical','crossing','cultural','culture','curious',
        'currency','current','customer','cutting','damaged','dancing','dangerous','database','daughter',
        'dealing','decided','decision','declared','decline','decrease','default','defence','defense','deficit',
        'defined','definite','degree','deliver','delivery','demand','democracy','denied','density','dental',
        'depend','deposit','depressed','depth','deputy','derived','describe','desert','deserve','design',
        'designer','desired','desktop','despite','destroy','detail','detailed','detect','develop','device',
        'devoted','diamond','dietary','differ','digital','dining','diploma','direct','directed','direction',
        'directly','director','disabled','disagree','discount','discover','discuss','disease','display',
        'dispute','distance','distant','distinct','district','diverse','divide','divided','divine','division',
        'divorce','doctor','document','domestic','dominant','double','doubled','doubt','download','dozen',
        'dragon','dramatic','drawing','dressed','drinking','driven','driver','driving','dropped','during',
        'dynamic','earlier','earning','eastern','eating','economy','edition','editor','educated','education',
        'edwards','effect','effectively','efficient','effort','either','elderly','election','electric',
        'electrical','electronic','element','eleven','eliminate','elsewhere','embassy','emerge','emergency',
        'emerging','emission','emotion','emotional','emphasis','empire','employ','employee','employer',
        'employment','enable','encounter','encourage','ending','endless','enemy','energy','engage','engaged',
        'engine','engineer','engineering','enhance','enjoy','enormous','enough','ensure','enter','enterprise',
        'entertainment','entire','entirely','entrance','entry','environment','equal','equally','equipment',
        'equity','equivalent','escape','especially','essential','establish','estate','estimate','ethnic',
        'europe','european','evaluate','evening','event','eventually','every','everybody','everyone',
        'everything','everywhere','evidence','evident','evolution','exactly','examine','example','excellent',
        'except','exception','exchange','excited','exciting','exclude','exclusive','excuse','execute',
        'executive','exercise','exhibit','exist','existing','expand','expansion','expect','expected',
        'expenditure','expense','expensive','experience','experiment','expert','explain','explanation',
        'explore','export','expose','exposure','express','expression','extend','extended','extension',
        'extensive','extent','external','extra','extraordinary','extreme','extremely','fabric','facility',
        'facing','factor','factory','faculty','failed','failing','failure','fairly','fallen','falling',
        'familiar','family','famous','fantastic','farmer','farming','fashion','faster','fastest','father',
        'favorite','feature','federal','feedback','feeling','female','fewer','fiction','field','fifteen',
        'fifth','fifty','figure','filing','filled','filling','filter','final','finally','finance',
        'financial','finding','finish','finished','firefox','fiscal','fishing','fitness','fixed','flash',
        'flight','floating','flood','floor','florida','flower','flying','focused','folder','follow',
        'followed','following','football','forced','forecast','foreign','forest','forever','forget',
        'forgot','forgotten','formal','format','formation','former','formula','fortune','forward','foster',
        'foundation','founded','founder','fraction','frame','framework','france','frank','freedom','freely',
        'french','frequent','fresh','friday','friendly','friends','front','fruit','fuel','fulfill','fully',
        'function','fundamental','funded','funding','funeral','funny','furniture','further','future','gained',
        'galaxy','gallery','gambling','gaming','garden','gateway','gather','gathered','gauge','gender',
        'general','generally','generate','generation','generic','generous','genetic','genius','genre',
        'gentle','genuine','german','germany','getting','ghost','giant','girl','girlfriend','given',
        'giving','glass','global','glory','goals','golden','gonna','goods','google','gotten','govern',
        'government','governor','grace','grade','graduate','grain','grand','grandfather','grandmother',
        'grant','granted','graphic','graphics','grass','grateful','great','greater','greatest','greatly',
        'green','grocery','gross','ground','group','growing','grown','growth','guarantee','guard','guess',
        'guest','guidance','guide','guideline','guilty','guitar','habitat','hacker','handed','handle',
        'handled','hands','hanging','happen','happened','happiness','happy','harbor','harder','hardly',
        'hardware','harmful','harry','harvest','haven','having','headed','heading','headline','health',
        'healthy','heard','hearing','heart','hearts','heated','heating','heaven','heavily','heavy','height',
        'helicopter','helped','helpful','helping','hence','herald','heritage','herself','hidden','hiding',
        'hierarchy','higher','highest','highlight','highly','highway','himself','hints','hiring','historic',
        'historical','history','hockey','holder','holding','holiday','holly','hollywood','holy','homeland',
        'homeless','homepage','honda','honest','honey','honor','hope','hoped','horizon','horror','horse',
        'hospital','hosted','hosting','hostile','hotel','hottest','hourly','hours','household','housing',
        'however','hudson','human','humanity','humans','hundred','hunger','hungry','hunter','hunting',
        'hurricane','husband','hybrid','hypothesis','ideal','identify','identity','ignored','illegal',
        'illness','illustrated','image','imagine','imaging','immediate','immediately','impact','implement',
        'implementation','implied','import','importance','important','impose','impossible','improve',
        'improved','improvement','incident','include','included','includes','including','income','increase',
        'increased','increasing','incredible','indeed','independence','independent','index','indian',
        'indicate','indicated','indicates','individual','indoor','industrial','industry','infant','infection',
        'inflation','influence','inform','informal','information','infrastructure','initial','initially',
        'initiative','injury','inner','innocent','innovation','innovative','input','inquiry','insert',
        'inside','insight','inspection','inspector','inspiration','install','installation','instance',
        'instant','instead','institute','institution','instruction','instrument','insurance','intended',
        'intense','intensity','intent','intention','interaction','interest','interested','interesting',
        'interface','interior','internal','international','internet','interpret','intervention','interview',
        'introduced','introduction','invasion','invest','investigate','investigation','investigator',
        'investment','investor','invisible','invitation','involve','involved','involvement','ireland',
        'irish','island','isolation','israel','israeli','issue','issued','issues','italian','italy',
        'itself','jacket','jackson','james','japanese','jersey','jesus','jimmy','johnson','joined',
        'joint','jones','jordan','joseph','journal','journalist','journey','judge','judgment','juice',
        'jump','jumped','jumping','junction','jungle','junior','justice','justify','keeping','kernel',
        'keyboard','keyword','kicked','killing','kingdom','kitchen','klein','knife','knight','knock',
        'knowing','knowledge','known','label','labeled','labor','laboratory','labour','lacking','ladder',
        'landed','landing','landlord','landscape','language','laptop','largely','larger','largest','laser',
        'lasting','later','latest','latin','latter','laugh','laughing','launch','launched','laundry',
        'lawyer','layer','layout','leader','leadership','leading','leads','league','learned','learning',
        'lease','least','leather','leave','leaves','leaving','lecture','legal','legally','legend',
        'legislation','legitimate','leisure','length','lesbian','lesson','letter','letters','level','levels',
        'leverage','lewis','liability','liberal','liberty','library','licence','license','licensed','lying',
        'lifetime','lifted','light','lighting','lights','likely','limbo','limit','limited','limiting',
        'limits','lincoln','linda','linear','lined','lines','lingerie','lining','linked','linking',
        'linux','lions','liquid','listed','listen','listening','listing','literacy','literally','literary',
        'literature','little','lived','liver','lives','living','loaded','loading','lobby','local',
        'locate','located','location','locked','lodge','logging','logic','logical','login','logistics',
        'london','lonely','longer','longest','looking','loose','lopez','losing','losses','lotus',
        'lottery','louis','lounge','loved','lovely','lover','lovers','loves','loving','lower',
        'lowest','lucas','lucky','lunch','luxury','lying','machine','machinery','madison','magazine',
        'magic','magical','magnetic','magnificent','maiden','mailing','mainly','mainstream','maintain',
        'maintained','maintenance','major','majority','maker','makers','makeup','making','malaysia',
        'malcolm','males','managed','management','manager','managing','mandate','manner','manual',
        'manually','manufacture','manufacturer','manufacturing','mapping','marathon','marble','march',
        'marcus','margin','maria','marine','marked','market','marketing','markets','marking','marks',
        'marriage','married','marshall','martial','martin','marvel','massive','master','masters','match',
        'matched','matches','matching','material','materials','mathematical','matter','matters','mature',
        'maximum','maybe','mayor','meaning','meaningful','means','meant','measure','measured','measurement',
        'measures','measuring','mechanical','mechanism','medal','media','median','medical','medication',
        'medicine','medieval','medium','meeting','meetings','meets','melbourne','melissa','member',
        'members','membership','membrane','memorial','memory','mental','mention','mentioned','mentor',
        'merchant','mercury','merely','merge','merger','merit','message','messages','messaging','metal',
        'meter','method','methodology','methods','metro','mexican','mexico','miami','michael','michigan',
        'micro','microwave','middle','midnight','might','mighty','migration','milan','military','miller',
        'million','millions','minded','mineral','minimal','minimize','minimum','mining','minister',
        'ministry','minor','minority','minus','minute','minutes','miracle','mirror','missed','missing',
        'mission','mistake','mistakes','mitchell','mixed','mixing','mobile','mobility','model','modeling',
        'models','modem','moderate','modern','modes','modest','modification','modified','modify','module',
        'modules','moisture','molecular','moment','moments','momentum','monaco','monday','monetary',
        'money','monitor','monitoring','monkey','monster','montana','monthly','months','montreal',
        'monument','moral','moreover','morgan','morning','morris','mortality','mortgage','moscow',
        'mostly','mother','mothers','motion','motivated','motivation','motor','motorcycle','mount',
        'mountain','mounted','mounting','mouse','mouth','move','moved','movement','moves','movie',
        'movies','moving','multiple','municipal','murder','murphy','murray','muscle','museum','music',
        'musical','musician','muslim','mutual','myself','mystery','naked','named','namely','names',
        'nancy','narrow','nation','national','nations','native','natural','naturally','nature','naval',
        'navigate','navigation','nearby','nearest','nearly','necessarily','necessary','necessity','needs',
        'negative','negotiate','negotiation','neighbor','neighborhood','neither','nelson','nerve','nervous',
        'nested','network','networking','networks','neural','neutral','never','newer','newest','newly',
        'newport','newsletter','newspaper','newspapers','newton','nexus','nicholas','nickel','night',
        'nightmare','nights','nineteenth','ninth','nitrogen','noble','nobody','nodes','noise','nominated',
        'nomination','nonetheless','nonprofit','normal','normally','norman','north','northeast','northern',
        'northwest','norton','norwegian','notable','notably','noted','notes','nothing','notice','noticed',
        'notification','notify','notion','notre','novel','novels','november','nowadays','nowhere','nuclear',
        'nucleus','number','numbers','numeric','numerous','nurse','nurses','nursing','nutrition','object',
        'objective','objects','obligation','observation','observe','observed','observer','obtain','obtained',
        'obvious','obviously','occasion','occasional','occasionally','occupation','occupied','occur',
        'occurred','occurrence','occurring','ocean','october','offering','offers','office','officer',
        'officers','offices','official','officials','offline','offset','often','older','oldest','oliver',
        'olympic','olympics','omega','ongoing','online','ontario','opening','opens','opera','operate',
        'operated','operates','operating','operation','operational','operations','operator','operators',
        'opinion','opinions','opponent','opportunity','oppose','opposed','opposite','opposition','optical',
        'optimal','optimum','option','optional','options','oracle','orange','orbit','orchestra','order',
        'ordered','ordering','orders','ordinary','oregon','organic','organisation','organizations','organize',
        'organized','organizer','orientation','oriented','origin','original','originally','orleans','oscar',
        'other','others','otherwise','ought','ounce','outcome','outcomes','outdoor','outdoors','outer',
        'outlet','outline','outlook','output','outputs','outreach','outside','outstanding','overall',
        'overcome','overhead','overnight','overseas','overview','overwhelming','owing','owned','owner',
        'owners','ownership','oxford','oxygen','pacific','package','packages','packaging','packed',
        'packet','packets','packing','paddle','pages','painful','paint','painted','painter','painting',
        'pairs','pakistan','palace','palestinian','palm','panel','panels','panic','pants','paper',
        'papers','parade','paradise','paragraph','parallel','parameter','parameters','parent','parents',
        'paris','parish','parker','parking','parks','parliament','parrot','partial','partially',
        'participant','participants','participate','participated','participating','participation','particle',
        'particular','particularly','parties','partly','partner','partners','partnership','parts','party',
        'passage','passed','passenger','passengers','passes','passing','passion','passive','password',
        'passwords','paste','pastor','patch','patches','patent','patents','path','paths','patient',
        'patients','patrick','patrol','pattern','patterns','pause','pavement','payed','paying','payment',
        'payments','payroll','peace','peaceful','peaks','pearl','pedro','penalty','pencil','pending',
        'pennsylvania','penny','pension','people','pepper','percent','percentage','perception','perfect',
        'perfectly','perform','performance','performances','performed','performer','performing','perhaps',
        'period','periodic','periods','peripheral','permanent','permission','permit','permits','permitted',
        'person','personal','personality','personally','personnel','persons','perspective','perspectives',
        'peter','petition','petroleum','phantom','phase','phases','phenomenon','philadelphia','philip',
        'philippines','phillips','phoenix','phone','phones','photo','photograph','photographer','photographs',
        'photography','photos','phrase','phrases','physical','physically','physician','physicians','physics',
        'picking','picks','picture','pictures','piece','pieces','pilot','pioneer','pipeline','pitch',
        'pizza','place','placed','placement','places','placing','plain','plains','plaintiff','plane',
        'planes','planet','planetary','planets','planned','planner','planning','plans','plant','plants',
        'plasma','plastic','plate','plates','platform','platforms','platinum','played','player','players',
        'playing','plays','plaza','pleasant','please','pleased','pleasure','pledge','plenty','plots',
        'plugin','plugins','plumbing','pocket','podcast','poems','poetry','point','pointed','pointer',
        'pointing','points','poker','poland','polar','police','policies','policy','polish','political',
        'politically','politician','politicians','politics','polls','pollution','polymer','popular',
        'popularity','population','portable','portal','porter','portfolio','portion','portions','portrait',
        'portugal','portuguese','posed','position','positioned','positions','positive','possess','possession',
        'possibility','possible','possibly','postal','posted','poster','posters','posting','postings',
        'posts','potato','potential','potentially','potter','pottery','poultry','pound','pounds','poverty',
        'powder','powell','power','powered','powerful','powers','practical','practice','practices','prague',
        'prairie','praise','prayer','prayers','precious','precise','precisely','precision','predict',
        'predicted','prediction','prefer','preference','preferences','preferred','pregnancy','pregnant',
        'preliminary','premier','premiere','premise','premises','premium','preparation','prepare','prepared',
        'preparing','prescription','presence','present','presentation','presentations','presented',
        'presenting','presently','presents','preservation','preserve','president','presidential','press',
        'pressed','pressing','pressure','preston','pretty','prevailing','prevent','preventing','prevention',
        'preview','previous','previously','price','priced','prices','pricing','pride','priest','primarily',
        'primary','prime','prince','princess','princeton','principal','principle','principles','print',
        'printed','printer','printers','printing','prints','prior','priority','prison','prisoner',
        'prisoners','privacy','private','privilege','prizes','probably','problem','problems','procedure',
        'procedures','proceed','proceeding','proceedings','proceeds','process','processed','processes',
        'processing','processor','processors','produce','produced','producer','producers','produces',
        'producing','product','production','productions','productive','productivity','products','profession',
        'professional','professionals','professor','profile','profiles','profit','profitable','profits',
        'program','programme','programmer','programmers','programmes','programming','programs','progress',
        'progressive','project','projected','projection','projector','projects','prominent','promise',
        'promised','promises','promising','promote','promoted','promoter','promoting','promotion',
        'promotional','promotions','prompt','promptly','prone','proof','propaganda','proper','properly',
        'properties','property','prophet','proportion','proposal','proposals','propose','proposed',
        'proposition','proprietary','prosecution','prospect','prospective','prospects','prosperity',
        'protect','protected','protecting','protection','protective','protein','proteins','protest',
        'protocol','protocols','prototype','proud','proudly','prove','proved','proven','provide',
        'provided','providence','provider','providers','provides','providing','province','provinces',
        'provision','provisions','proxy','psychiatric','psychological','psychology','public','publication',
        'publications','publicity','publicly','publish','published','publisher','publishers','publishing',
        'pulling','pulse','pump','punch','punishment','puppy','purchase','purchased','purchases',
        'purchasing','purple','purpose','purposes','purse','pursue','pursuit','pushed','pushing',
        'putting','puzzle','qualified','qualify','qualifying','quality','quantity','quantum','quarter',
        'quarterly','quarters','query','quest','question','questioned','questions','queue','quick',
        'quicker','quickly','quiet','quietly','quite','quote','quoted','quotes','rabbit','race',
        'races','rachel','racial','racing','racism','radar','radiation','radical','radio','radius',
        'railroad','railway','rain','rainbow','raise','raised','raises','raising','rally','ralph',
        'random','randomly','range','ranger','ranges','ranging','rank','ranked','ranking','rankings',
        'ranks','rapid','rapidly','rated','rates','rather','rating','ratings','ratio','rational',
        'ratios','raymond','reach','reached','reaches','reaching','reaction','reactions','reader',
        'readers','readily','reading','readings','reads','ready','reagan','reality','realize','realized',
        'really','realm','reason','reasonable','reasonably','reasoning','reasons','rebel','rebirth',
        'rebuild','recall','receipt','receive','received','receiver','receivers','receives','receiving',
        'recent','recently','reception','recipe','recipes','recipient','recipients','recognition',
        'recognize','recognized','recommend','recommendation','recommendations','recommended','record',
        'recorded','recorder','recording','recordings','records','recover','recovered','recovering',
        'recovery','recreation','recreational','recruit','recruitment','recycle','recycling','reduce',
        'reduced','reduces','reducing','reduction','reductions','refer','reference','referenced',
        'references','referral','referrals','referred','referring','refers','refine','refined','reflect',
        'reflected','reflection','reform','reforms','refresh','refrigerator','refuge','refugee','refugees',
        'refund','refuse','refused','regard','regarded','regarding','regardless','regards','regime',
        'region','regional','regions','register','registered','registration','registry','regular',
        'regularly','regulation','regulations','regulatory','rehabilitation','reid','reject','rejected',
        'relate','related','relates','relating','relation','relations','relationship','relationships',
        'relative','relatively','relatives','relax','relaxation','release','released','releases','relevance',
        'relevant','reliability','reliable','relief','religion','religious','reload','rely','remain',
        'remainder','remained','remaining','remains','remarkable','remarks','remedy','remember','remembered',
        'remind','reminder','remote','removal','remove','removed','removing','renaissance','render',
        'rendered','rendering','renew','renewal','renewed','rental','rentals','repair','repairs','repeat',
        'repeated','replace','replaced','replacement','replacing','replica','replied','replies','reply',
        'report','reported','reporter','reporters','reporting','reports','repository','represent',
        'representation','representative','representatives','represented','representing','represents',
        'reproduce','reproduced','reproduction','republic','republican','republicans','reputation',
        'request','requested','requesting','requests','require','required','requirement','requirements',
        'requires','requiring','rescue','research','researcher','researchers','reservation','reservations',
        'reserve','reserved','reserves','reservoir','reset','residence','resident','residential','residents',
        'resist','resistance','resolution','resolutions','resolve','resolved','resort','resorts','resource',
        'resources','respect','respected','respective','respectively','respond','responded','respondent',
        'respondents','responding','response','responses','responsibilities','responsibility','responsible',
        'rest','restart','restaurant','restaurants','restoration','restore','restored','restrict',
        'restricted','restriction','restrictions','restructuring','result','resulted','resulting','results',
        'resume','retail','retailer','retailers','retain','retained','retention','retire','retired',
        'retirement','retreat','retrieve','retrieved','return','returned','returning','returns','reunion',
        'reveal','revealed','revealing','reveals','revenue','revenues','reverse','review','reviewed',
        'reviewer','reviewing','reviews','revised','revision','revisions','revolution','revolutionary',
        'reward','rewards','rhetoric','rhythm','rice','richard','richards','richardson','richmond',
        'rider','riders','rides','ridge','riding','rights','rings','rising','risks','river',
        'rivers','roads','robert','roberts','robin','robinson','robot','robots','robust','rochester',
        'rocks','rocky','roger','rogers','role','roles','rolled','roller','rolling','roman',
        'romance','romantic','ronald','rooms','roots','rose','roses','roster','rough','roughly',
        'round','rounds','route','router','routers','routes','routine','routinely','routing','rover',
        'royal','rubber','rugby','ruins','ruled','rules','ruling','running','rural','rush',
        'russell','russia','russian','ruth','sacrifice','sadly','safari','safety','sailing','saint',
        'saints','salad','salary','sales','sally','salmon','salon','sample','samples','sampling',
        'samuel','sanctions','sandy','satellite','satisfaction','satisfied','satisfy','saturday','saturn',
        'sauce','savage','saved','saving','savings','scale','scales','scan','scanner','scanning',
        'scared','scenario','scenarios','scene','scenes','scenic','schedule','scheduled','schedules',
        'scheduling','schema','scheme','schemes','scholar','scholarly','scholars','scholarship',
        'scholarships','schools','science','sciences','scientific','scientist','scientists','scope',
        'score','scored','scores','scoring','scotland','scott','scottish','scout','scratch','screen',
        'screening','screens','screenshot','screenshots','script','scripts','scroll','sculpture','search',
        'searched','searches','searching','season','seasonal','seasons','seat','seating','seats',
        'seattle','second','secondary','seconds','secret','secretary','secrets','section','sections',
        'sector','sectors','secure','secured','securely','securities','security','seeking','seeks',
        'seems','segment','segments','select','selected','selecting','selection','selections','selective',
        'self','sellers','selling','sells','semester','semi','senate','senator','senators','senior',
        'seniors','sense','sensitive','sensitivity','sensor','sensors','sentence','sentences','separate',
        'separated','separately','separation','sept','september','sequence','sequences','serbia','serial',
        'series','serious','seriously','sermon','servant','serve','served','server','servers','serves',
        'service','services','serving','session','sessions','setting','settings','settle','settled',
        'settlement','setup','seven','seventeen','seventh','several','severe','sexual','shade','shadow',
        'shaft','shakespeare','shall','shame','shape','shaped','shapes','shaping','share','shared',
        'shareholder','shareholders','shares','shareware','sharing','shark','sharon','sharp','sheets',
        'shelf','shell','shelter','shepherd','sheriff','shift','shifting','shine','shining','ship',
        'shipment','shipments','shipped','shipping','ships','shirt','shirts','shock','shoe','shoes',
        'shoot','shooting','shop','shopper','shoppers','shopping','shops','shore','short','shorter',
        'shortest','shortly','shorts','shot','shots','shoulder','shoulders','shout','shovel','showed',
        'shower','showers','showing','shown','shows','shuttle','siblings','sick','sides','sight',
        'sigma','signal','signals','signature','signatures','signed','significance','significant',
        'significantly','signing','signs','silence','silent','silicon','silk','silly','silver','similar',
        'similarly','simon','simple','simpler','simplest','simplified','simply','simpson','simulation',
        'simulations','simultaneously','since','sing','singapore','singer','singers','singing','single',
        'singles','sink','sister','sisters','site','sites','sitting','situated','situation','situations',
        'sixth','sixty','sized','sizes','sizing','skating','sketch','skiing','skill','skilled',
        'skills','skin','skins','skull','slave','slavery','sleep','sleeping','slept','slide',
        'slides','slideshow','slight','slightly','slim','slope','slots','slovakia','slovenia','slow',
        'slower','slowly','small','smaller','smallest','smart','smell','smile','smith','smoke',
        'smoking','smooth','snap','snapshot','snow','soccer','social','socially','societies','society',
        'sociology','socket','soft','softball','software','soil','solar','sold','soldier','soldiers',
        'sole','solely','solid','solidarity','solomon','solution','solutions','solve','solved','solving',
        'somalia','somebody','somehow','someone','somerset','something','sometimes','somewhat','somewhere',
        'songs','sonic','sonny','soon','sooner','sophisticated','sorry','sort','sorted','sorts',
        'sought','soul','souls','sound','sounds','soundtrack','soup','source','sources','south',
        'southeast','southern','southwest','soviet','space','spaces','spain','spam','span','spanish',
        'spare','spark','spatial','speak','speaker','speakers','speaking','speaks','special','specialist',
        'specialists','specialized','species','specific','specifically','specification','specifications',
        'specified','specifies','specify','spectrum','speech','speed','speeds','spell','spelling',
        'spend','spending','spent','sphere','spider','spin','spine','spirit','spirits','spiritual',
        'split','spoke','spoken','spokesman','sponsor','sponsored','sponsors','sponsorship','sport',
        'sporting','sports','spotlight','spouse','spray','spread','spreading','spring','springer',
        'springs','squad','square','stable','stack','stadium','staff','staffing','stage','stages',
        'stainless','stake','stamp','stamps','stand','standard','standards','standing','stands','stanford',
        'stanley','star','starring','stars','start','started','starter','starting','starts','startup',
        'state','stated','statement','statements','states','static','station','stations','statistical',
        'statistics','stats','status','statute','statutes','stay','stayed','staying','stays','steady',
        'steal','steam','steel','steep','steering','stellar','stephen','stepped','steps','stereo',
        'sterling','steve','steven','stevens','stick','stickers','sticks','sticky','still','stock',
        'stockholm','stocks','stomach','stone','stones','stood','stop','stopped','stopping','stops',
        'storage','store','stored','stores','stories','storing','storm','story','straight','strain',
        'strand','strange','stranger','strategic','strategies','strategy','stream','streaming','streams',
        'street','streets','strength','strengthen','stress','stretch','strict','strictly','strike',
        'strikes','striking','string','strings','strip','stroke','strong','stronger','strongly',
        'struck','structural','structure','structured','structures','struggle','struggling','stuart',
        'stuck','student','students','studied','studies','studio','studios','study','studying','stuff',
        'stuffed','stunning','stupid','style','styled','styles','styling','stylish','stylus','subject',
        'subjects','submission','submissions','submit','submitted','subscribe','subscriber','subscribers',
        'subscription','subscriptions','subsequent','subsequently','subset','substance','substantial',
        'substantially','subtle','suburban','succeed','success','successful','successfully','sudden',
        'suddenly','suffer','suffered','suffering','sufficient','sugar','suggest','suggested','suggesting',
        'suggestion','suggestions','suggests','suicide','suit','suitable','suite','suited','suites',
        'suits','sullivan','summary','summer','summit','sunday','sunrise','sunset','super','superb',
        'superintendent','superior','supervision','supervisor','supplement','supplemental','supplements',
        'supplied','supplier','suppliers','supplies','supply','support','supported','supporter','supporters',
        'supporting','supports','suppose','supposed','supreme','surface','surfaces','surgeon','surgeons',
        'surgery','surgical','surplus','surprise','surprised','surprising','surprisingly','surrender',
        'surround','surrounded','surrounding','survey','surveys','survival','survive','survived','survivor',
        'survivors','susan','suspect','suspected','suspend','suspended','suspension','sustainability',
        'sustainable','sustained','sweden','swedish','sweet','swift','swimming','swing','swiss','switch',
        'switched','switches','switching','switzerland','sword','symbol','symbols','sympathy','symphony',
        'symptoms','syndrome','syntax','synthetic','syria','system','systematic','systems','table',
        'tables','tablet','tablets','tackle','tactics','tagged','taiwan','taken','takes','taking',
        'talent','talented','tales','taliban','talking','talks','tamil','tampa','tanks','tanzania',
        'tape','tapes','target','targeted','targeting','targets','tariff','tasks','taste','taught',
        'taxes','taxpayer','taxpayers','taylor','teach','teacher','teachers','teaches','teaching',
        'team','teams','tear','tears','tech','technical','technically','technician','technique',
        'techniques','technological','technologies','technology','teddy','teen','teenage','teenagers',
        'teens','teeth','telephone','telescope','television','telling','tells','temperature','temperatures',
        'template','templates','temple','temporal','temporarily','temporary','tender','tennessee','tennis',
        'tension','tent','term','terminal','terminals','terminate','termination','terminology','terms',
        'terrain','terrible','territorial','territories','territory','terror','terrorism','terrorist',
        'terrorists','terry','test','tested','testimony','testing','tests','texas','text','textbook',
        'textbooks','textile','textiles','texts','texture','thailand','than','thank','thankful','thanks',
        'thanksgiving','that','theater','theatre','theft','their','them','theme','themed','themes',
        'themselves','then','theology','theorem','theoretical','theories','theory','therapeutic','therapist',
        'therapy','there','thereby','therefore','thereof','thermal','these','thesis','they','thick',
        'thickness','thing','things','think','thinking','thinks','third','thirty','thomas','thompson',
        'thompson','thorough','thoroughly','those','though','thought','thoughts','thousand','thousands',
        'thread','threads','threat','threatened','threatening','threats','three','threshold','thrill',
        'thriller','thrive','throat','through','throughout','throw','throwing','thrown','throws','thrust',
        'thumb','thumbnail','thumbnails','thunder','thursday','thus','ticket','tickets','tide','tiger',
        'tigers','tight','tightly','tiles','till','timber','time','timed','timeline','timely',
        'timer','times','timing','timothy','tiny','tips','tissue','titan','titanium','title',
        'titled','titles','toast','tobacco','today','todd','toes','together','toilet','token',
        'tokyo','told','tolerance','toll','tomorrow','tone','toner','tones','tongue','tonight',
        'tonnes','tony','toolbar','toolbox','toolkit','tools','tooth','topic','topics','tops',
        'toronto','torture','toshiba','total','totally','totals','touch','touched','touches','touching',
        'tough','tour','touring','tourism','tourist','tourists','tournament','tournaments','tours',
        'toward','towards','tower','towers','town','towns','township','toxic','toys','trace',
        'track','tracked','tracker','tracking','tracks','tract','tracy','trade','trademark','trademarks',
        'trader','traders','trades','trading','tradition','traditional','traditionally','traditions',
        'traffic','tragedy','trail','trailer','trailers','trails','train','trained','trainer','trainers',
        'training','trains','trait','traits','trans','transaction','transactions','transcription','transfer',
        'transferred','transfers','transform','transformation','transformed','transit','transition',
        'translate','translated','translation','translations','translator','transmission','transmit',
        'transmitted','transparency','transparent','transport','transportation','trap','trash','trauma',
        'travel','traveled','traveler','travelers','traveling','travels','treasure','treasurer','treasury',
        'treat','treated','treating','treatment','treatments','treaty','tree','trees','trek','tremendous',
        'trend','trends','trial','trials','triangle','tribal','tribe','tribes','tribunal','tribune',
        'tribute','trick','tricks','tried','tries','trigger','triggered','trillion','trim','trinity',
        'trio','triple','triumph','trivial','troops','tropical','trouble','troubled','troubles','truck',
        'trucks','truly','trunk','trust','trusted','trustee','trustees','trusts','truth','trying',
        'tsunami','tube','tubes','tucker','tuesday','tuition','tulsa','tumor','tune','tuned',
        'tuner','tunes','tunisia','tunnel','turbo','turkey','turkish','turn','turned','turner',
        'turning','turns','turtle','tutor','tutorial','tutorials','twelve','twenty','twice','twin',
        'twins','twist','twisted','tyler','type','types','typical','typically','typing','uganda',
        'ugly','ukraine','ultimate','ultimately','ultra','unable','uncertainty','uncle','under',
        'undergo','undergraduate','underground','underlying','understand','understanding','understood',
        'undertake','undertaken','underwear','unemployment','unexpected','unfortunately','unified','uniform',
        'union','unions','unique','unit','united','units','unity','universal','universe','universities',
        'university','unix','unknown','unless','unlike','unlikely','unlimited','unlock','unnecessary',
        'unsigned','until','unusual','update','updated','updates','updating','upgrade','upgraded',
        'upgrades','upload','uploaded','upon','upper','upset','upward','urban','urge','urgent',
        'usage','user','username','users','uses','using','usual','usually','utilities','utility',
        'utilization','utilize','vacation','vacations','vaccine','vacuum','valid','validate','validation',
        'validity','valley','valuable','valuation','value','valued','values','valve','vampire','vancouver',
        'vanilla','variable','variables','variance','variant','variation','variations','varied','varies',
        'variety','various','vary','varying','vast','vector','vegas','vegetable','vegetables','vegetarian',
        'vehicle','vehicles','velocity','vendor','vendors','venezuela','venture','ventures','venue',
        'venues','verbal','verdict','verification','verified','verify','vermont','vernon','versatile',
        'verse','version','versions','versus','vertical','very','vessel','vessels','veteran','veterans',
        'veterinary','viable','vibrant','vibration','victor','victoria','victorian','victory','video',
        'videos','vienna','vietnam','vietnamese','view','viewed','viewer','viewers','viewing','viewpoint',
        'views','villa','village','villages','vincent','vintage','vinyl','violated','violation','violations',
        'violence','violent','viral','virgin','virginia','virtual','virtually','virtue','virus','viruses',
        'visa','visible','vision','visions','visit','visited','visiting','visitor','visitors','visits',
        'vista','visual','vital','vitamin','vitamins','vocal','vocals','voice','voices','void',
        'volcanic','volkswagen','volleyball','voltage','volume','volumes','voluntary','volunteer','volunteers',
        'vote','voted','voter','voters','votes','voting','vulnerable','wage','wages','waiting',
        'wake','wales','walk','walked','walker','walking','walks','wall','wallace','wallet',
        'walls','walter','wanna','wanted','wanting','wants','warehouse','warm','warming','warned',
        'warner','warning','warnings','warrant','warranties','warranty','warren','warrior','warriors',
        'wars','washington','waste','watch','watched','watches','watching','water','waters','watson',
        'watt','watts','wave','waves','ways','weak','weakness','wealth','wealthy','weapon',
        'weapons','wear','wearing','weather','weaving','weber','website','websites','wedding','weddings',
        'wednesday','week','weekend','weekends','weekly','weeks','weight','weighted','weights','weird',
        'welcome','welcomed','welcomes','welfare','wellington','wellness','welsh','went','were',
        'werner','west','western','westminster','wheel','wheels','when','whenever','where','whereas',
        'wherever','whether','which','while','whilst','whisper','white','whole','wholesale','whom',
        'whose','wicked','wide','widely','wider','widespread','width','wife','wiki','wikipedia',
        'wild','wilderness','wildlife','will','william','williams','willing','willingness','wilson',
        'wind','window','windows','winds','windsor','wine','wines','wing','wings','winner',
        'winners','winning','winter','wire','wired','wireless','wires','wiring','wisdom','wise',
        'wish','wishes','witch','with','withdrawal','within','without','witness','witnesses','wizard',
        'wolf','wolves','woman','women','wonder','wonderful','wondering','wong','wood','wooden',
        'woods','wool','worcester','word','words','work','worked','worker','workers','workflow',
        'workforce','working','workout','workplace','works','workshop','workshops','workspace','world',
        'worlds','worldwide','worm','worried','worry','worse','worship','worst','worth','worthy',
        'would','wound','wounds','wrap','wrapped','wrapper','wrapping','wrestling','wright','wrist',
        'write','writer','writers','writes','writing','writings','written','wrong','wrote','wyoming',
        'xbox','xerox','xhtml','yacht','yahoo','yale','yang','yard','yards','yarn',
        'yeah','year','yearly','years','yeast','yellow','yemen','yesterday','yield','yields',
        'yoga','york','young','younger','youngest','your','yours','yourself','youth','yugoslavia',
        'zealand','zero','zinc','zombie','zone','zones','zoning','zoom'
    ]);

    // Game state
    let state = {
        currentLetters: '',
        currentPlayer: 1,
        player1Ghost: '',
        player2Ghost: '',
        message: '',
        messageType: '',
        gameOver: false,
        winner: null,
        lenientMode: true, // If true, only lose when word can't continue
        showRules: false,
        challengeMode: false,
        vsComputer: false,
        modeSelected: false
    };

    // AI: Find all possible next letters that lead to valid words
    function getValidNextLetters(prefix) {
        prefix = prefix.toLowerCase();
        const validLetters = new Set();
        for (const word of WORDS) {
            if (word.startsWith(prefix) && word.length > prefix.length) {
                validLetters.add(word[prefix.length].toUpperCase());
            }
        }
        return Array.from(validLetters);
    }

    // AI: Check if adding this letter would lose (complete a word that can't continue)
    function wouldLose(prefix, letter) {
        const newPrefix = (prefix + letter).toLowerCase();
        if (state.lenientMode) {
            return isCompleteWord(newPrefix) && !hasWordsStartingWith(newPrefix);
        } else {
            return isCompleteWord(newPrefix);
        }
    }

    // AI: Check if adding this letter forces opponent to eventually lose
    function forcesOpponentLoss(prefix, letter, depth = 0) {
        if (depth > 6) return false; // Limit search depth
        const newPrefix = (prefix + letter).toLowerCase();

        // If this completes a word and opponent can't continue, we lose
        if (wouldLose(prefix, letter)) return false;

        // Get all valid next moves for opponent
        const opponentMoves = getValidNextLetters(newPrefix);
        if (opponentMoves.length === 0) return false;

        // Check if ALL opponent moves lead to them losing eventually
        for (const oppLetter of opponentMoves) {
            if (wouldLose(newPrefix, oppLetter)) {
                continue; // Good - opponent would lose with this move
            }
            // Check if opponent has a safe move
            const theirMoves = getValidNextLetters(newPrefix + oppLetter.toLowerCase());
            if (theirMoves.length > 0) {
                return false; // Opponent has escape routes
            }
        }
        return opponentMoves.length > 0;
    }

    // AI: Pick the best letter
    function computerPickLetter() {
        const prefix = state.currentLetters.toLowerCase();
        const validLetters = getValidNextLetters(prefix);

        if (validLetters.length === 0) {
            // No valid moves - pick random letter (will be challenged)
            return 'ETAOINSHRDLU'[Math.floor(Math.random() * 12)];
        }

        // Filter out letters that would make us lose immediately
        const safeMoves = validLetters.filter(l => !wouldLose(prefix, l));

        if (safeMoves.length === 0) {
            // All moves lose - pick one that at least extends the game
            return validLetters[Math.floor(Math.random() * validLetters.length)];
        }

        // Look for moves that force opponent to lose
        const winningMoves = safeMoves.filter(l => forcesOpponentLoss(prefix, l));
        if (winningMoves.length > 0) {
            return winningMoves[Math.floor(Math.random() * winningMoves.length)];
        }

        // Prefer moves that lead to longer words (more chances for opponent to mess up)
        const movesWithLongWords = safeMoves.filter(l => {
            const newPrefix = prefix + l.toLowerCase();
            for (const word of WORDS) {
                if (word.startsWith(newPrefix) && word.length >= newPrefix.length + 4) {
                    return true;
                }
            }
            return false;
        });

        if (movesWithLongWords.length > 0) {
            return movesWithLongWords[Math.floor(Math.random() * movesWithLongWords.length)];
        }

        // Just pick a random safe move
        return safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }

    // AI: Decide whether to challenge
    function computerShouldChallenge() {
        const prefix = state.currentLetters.toLowerCase();
        const validWord = findWordWithPrefix(prefix);
        // Challenge if no valid word exists
        return validWord === null;
    }

    // Trigger computer turn
    function doComputerTurn() {
        if (state.gameOver || state.currentPlayer !== 2 || !state.vsComputer) return;

        setTimeout(() => {
            if (state.challengeMode) {
                // Computer decides whether to challenge
                const shouldChallenge = computerShouldChallenge();
                handleChallenge(shouldChallenge);
            } else {
                const letter = computerPickLetter();
                addLetter(letter);
            }
        }, 1000); // 1 second delay to feel natural
    }

    // Check if a string is a complete word (4+ letters)
    function isCompleteWord(str) {
        return str.length >= 4 && WORDS.has(str.toLowerCase());
    }

    // Check if any word starts with this prefix
    function hasWordsStartingWith(prefix) {
        prefix = prefix.toLowerCase();
        for (const word of WORDS) {
            if (word.startsWith(prefix) && word.length > prefix.length) {
                return true;
            }
        }
        return false;
    }

    // Check if the current letters form a losing state
    function isLosingState(letters) {
        letters = letters.toLowerCase();
        if (letters.length < 4) return false;

        if (state.lenientMode) {
            // Lenient: lose only if it's a complete word AND can't continue
            return isCompleteWord(letters) && !hasWordsStartingWith(letters);
        } else {
            // Strict: lose if it's any complete word
            return isCompleteWord(letters);
        }
    }

    // Find a word that starts with the given prefix (for challenges)
    function findWordWithPrefix(prefix) {
        prefix = prefix.toLowerCase();
        for (const word of WORDS) {
            if (word.startsWith(prefix)) {
                return word;
            }
        }
        return null;
    }

    // Add a ghost letter to the losing player
    function addGhostLetter(player) {
        const ghostWord = 'GHOST';
        if (player === 1) {
            state.player1Ghost += ghostWord[state.player1Ghost.length];
            if (state.player1Ghost === 'GHOST') {
                state.gameOver = true;
                state.winner = 2;
            }
        } else {
            state.player2Ghost += ghostWord[state.player2Ghost.length];
            if (state.player2Ghost === 'GHOST') {
                state.gameOver = true;
                state.winner = 1;
            }
        }
    }

    // Start a new round
    function newRound() {
        state.currentLetters = '';
        state.currentPlayer = 1;
        state.message = '';
        state.messageType = '';
        state.challengeMode = false;
        renderGame();
    }

    // Reset entire game
    function resetGame() {
        const keepVsComputer = state.vsComputer;
        const keepLenient = state.lenientMode;
        state = {
            currentLetters: '',
            currentPlayer: 1,
            player1Ghost: '',
            player2Ghost: '',
            message: '',
            messageType: '',
            gameOver: false,
            winner: null,
            lenientMode: keepLenient,
            showRules: false,
            challengeMode: false,
            vsComputer: keepVsComputer,
            modeSelected: true
        };
        renderGame();
    }

    // Start game with selected mode
    function startGame(vsComputer) {
        state.vsComputer = vsComputer;
        state.modeSelected = true;
        renderGame();
    }

    // Get player name based on mode
    function getPlayerName(player) {
        if (player === 1) return 'You';
        return state.vsComputer ? 'Computer' : 'Player 2';
    }

    // Handle letter input
    function addLetter(letter) {
        if (state.gameOver || state.challengeMode) return;

        letter = letter.toUpperCase();
        if (!/^[A-Z]$/.test(letter)) return;

        const newLetters = state.currentLetters + letter;
        state.currentLetters = newLetters;

        // Check if this creates a losing state
        const loserName = state.currentPlayer === 1 ? 'You' : (state.vsComputer ? 'Computer' : 'Player 2');
        const otherName = state.currentPlayer === 1 ? (state.vsComputer ? 'Computer' : 'Player 2') : 'You';
        let roundEnded = false;

        if (isLosingState(newLetters)) {
            state.message = `"${newLetters}" is a complete word! ${loserName} lose${state.currentPlayer === 1 ? '' : 's'} this round.`;
            state.messageType = 'error';
            addGhostLetter(state.currentPlayer);
            roundEnded = true;
            if (!state.gameOver) {
                setTimeout(newRound, 2500);
            }
        } else if (newLetters.length >= 4 && !hasWordsStartingWith(newLetters.toLowerCase())) {
            // No words exist with this prefix - can be challenged
            state.message = `No words start with "${newLetters}". ${otherName} can challenge!`;
            state.messageType = 'warning';
            state.challengeMode = true;
        } else {
            state.message = '';
            state.messageType = '';
            state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        }

        renderGame();

        // Trigger computer turn if needed (but not if round just ended)
        if (!roundEnded && state.vsComputer && state.currentPlayer === 2 && !state.gameOver && !state.challengeMode) {
            doComputerTurn();
        }
    }

    // Handle challenge
    function handleChallenge(challenging) {
        if (!state.challengeMode) return;

        const challenger = state.currentPlayer === 1 ? 2 : 1;
        const challenged = state.currentPlayer;
        const challengerName = challenger === 1 ? 'You' : (state.vsComputer ? 'Computer' : 'Player 2');
        const challengedName = challenged === 1 ? 'You' : (state.vsComputer ? 'Computer' : 'Player 2');

        if (challenging) {
            // The previous player is being challenged to name a word
            const validWord = findWordWithPrefix(state.currentLetters.toLowerCase());
            if (validWord) {
                // Challenger loses - there was a valid word
                state.message = `Challenge failed! "${validWord}" starts with "${state.currentLetters}". ${challengerName} lose${challenger === 1 ? '' : 's'} this round.`;
                state.messageType = 'error';
                addGhostLetter(challenger);
            } else {
                // Challenged player loses - no valid word
                state.message = `Challenge successful! No words start with "${state.currentLetters}". ${challengedName} lose${challenged === 1 ? '' : 's'} this round.`;
                state.messageType = 'success';
                addGhostLetter(challenged);
            }
        } else {
            // Let it slide, continue playing
            state.message = '';
            state.messageType = '';
            state.currentPlayer = challenger;
        }

        state.challengeMode = false;

        if (!state.gameOver) {
            setTimeout(newRound, 2500);
        }
        renderGame();
    }

    // Toggle rules display
    function toggleRules() {
        state.showRules = !state.showRules;
        renderGame();
    }

    // Toggle lenient mode
    function toggleMode() {
        state.lenientMode = !state.lenientMode;
        renderGame();
    }

    // Render the game
    function renderGame() {
        const container = document.getElementById('ghostContent');
        if (!container) return;

        const ghostDisplay = (letters) => {
            let display = '';
            for (let i = 0; i < 5; i++) {
                if (i < letters.length) {
                    display += `<span style="color: #e74c3c; font-weight: bold;">${letters[i]}</span>`;
                } else {
                    display += `<span style="color: #555;">_</span>`;
                }
            }
            return display;
        };

        // Mode selection screen
        if (!state.modeSelected) {
            container.innerHTML = `
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <button onclick="exitGhost()" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back</button>
                        <h2 style="margin: 0; color: #fff;">👻 Ghost</h2>
                        <div style="width: 60px;"></div>
                    </div>

                    <div style="text-align: center; margin-bottom: 30px;">
                        <p style="color: #ccc; margin-bottom: 20px;">Add letters without completing a word!</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 15px; max-width: 320px; margin: 0 auto;">
                        <button onclick="window.ghostGame.startGame(true)"
                                style="padding: 15px 20px; text-align: left; background: #3d5c3d; color: #fff;
                                       border: none; border-radius: 10px; cursor: pointer;">
                            <div style="font-size: 1.2rem; margin-bottom: 5px;">🤖 vs Computer</div>
                            <div style="font-size: 0.85rem; color: #aaa;">Play against an AI opponent</div>
                        </button>
                        <button onclick="window.ghostGame.startGame(false)"
                                style="padding: 15px 20px; text-align: left; background: #3d3d5c; color: #fff;
                                       border: none; border-radius: 10px; cursor: pointer;">
                            <div style="font-size: 1.2rem; margin-bottom: 5px;">👥 2 Players</div>
                            <div style="font-size: 0.85rem; color: #aaa;">Pass and play with a friend</div>
                        </button>
                    </div>

                    <div style="margin-top: 30px; text-align: center;">
                        <button onclick="window.ghostGame.toggleRules()"
                                style="background: transparent; color: #888; border: 1px solid #555;
                                       padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                            ${state.showRules ? 'Hide Rules' : 'Show Rules'}
                        </button>
                    </div>

                    ${state.showRules ? `
                        <div style="background: #2d2d44; border-radius: 10px; padding: 15px; margin-top: 20px; font-size: 0.9rem; color: #ccc;">
                            <strong style="color: #fff;">How to Play:</strong><br><br>
                            1. Players take turns adding ONE letter<br>
                            2. Letters must build toward a real word<br>
                            3. Don't complete a word (4+ letters)!<br>
                            4. Challenge if you think opponent bluffed<br>
                            5. Lose a round = get a letter (G-H-O-S-T)<br>
                            6. Spell GHOST = you're out!
                        </div>
                    ` : ''}
                </div>
            `;
            return;
        }

        const isComputerTurn = state.vsComputer && state.currentPlayer === 2 && !state.gameOver;
        const player1Label = 'You';
        const player2Label = state.vsComputer ? 'Computer' : 'Player 2';
        const modeLabel = state.vsComputer ? '🤖 vs Computer' : '👥 2 Players';

        container.innerHTML = `
            <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <button onclick="exitGhost()" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back</button>
                    <h2 style="margin: 0; color: #fff;">👻 Ghost</h2>
                    <button onclick="window.ghostGame.toggleRules()"
                            style="background: #3d3d5c; color: #fff; border: none; border-radius: 50%;
                                   width: 32px; height: 32px; font-size: 1.2rem; cursor: pointer;">?</button>
                </div>

                <div style="text-align: center; margin-bottom: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <span style="background: ${state.vsComputer ? '#3d5c3d' : '#5c3d5c'}; color: #fff;
                                 padding: 6px 14px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
                        ${modeLabel}
                    </span>
                    <span style="background: ${state.lenientMode ? '#3d5c5c' : '#5c4d3d'}; color: #fff;
                                 padding: 6px 14px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
                        ${state.lenientMode ? '📖 Lenient' : '⚡ Strict'}
                    </span>
                </div>

                ${state.showRules ? `
                    <div style="background: #2d2d44; border-radius: 10px; padding: 15px; margin-bottom: 20px; font-size: 0.9rem; color: #ccc;">
                        <strong style="color: #fff;">How to Play:</strong><br><br>
                        1. Players take turns adding ONE letter<br>
                        2. Letters must build toward a real word<br>
                        3. Don't complete a word (4+ letters)!<br>
                        4. Challenge if you think opponent bluffed<br>
                        5. Lose a round = get a letter (G-H-O-S-T)<br>
                        6. Spell GHOST = you're out!<br><br>
                        <strong>Mode:</strong> ${state.lenientMode ? 'Lenient (word must not continue)' : 'Strict (any complete word loses)'}
                    </div>
                ` : ''}

                <div style="display: flex; justify-content: space-around; margin-bottom: 25px;">
                    <div style="text-align: center; padding: 15px; background: ${state.currentPlayer === 1 && !state.gameOver ? '#3d5c3d' : '#2d2d44'};
                                border-radius: 10px; min-width: 120px;">
                        <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 5px;">${player1Label}</div>
                        <div style="font-size: 1.5rem; letter-spacing: 3px;">${ghostDisplay(state.player1Ghost)}</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: ${state.currentPlayer === 2 && !state.gameOver ? '#3d5c3d' : '#2d2d44'};
                                border-radius: 10px; min-width: 120px;">
                        <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 5px;">${player2Label}</div>
                        <div style="font-size: 1.5rem; letter-spacing: 3px;">${ghostDisplay(state.player2Ghost)}</div>
                    </div>
                </div>

                ${state.gameOver ? `
                    <div style="text-align: center; padding: 30px; background: ${state.winner === 1 ? '#2d4d2d' : '#4d2d2d'}; border-radius: 15px; margin-bottom: 20px;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">${state.winner === 1 ? '🏆' : '😢'}</div>
                        <div style="font-size: 1.5rem; color: ${state.winner === 1 ? '#4ade80' : '#f87171'}; font-weight: bold;">
                            ${state.winner === 1 ? 'You Win!' : (state.vsComputer ? 'Computer Wins!' : 'Player 2 Wins!')}
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 10px;">Current Letters</div>
                        <div style="font-size: 3rem; color: #fff; font-weight: bold; letter-spacing: 8px;
                                    min-height: 60px; background: #2d2d44; border-radius: 10px; padding: 15px;">
                            ${state.currentLetters || '<span style="color: #555;">...</span>'}
                        </div>
                    </div>

                    ${state.message ? `
                        <div style="text-align: center; padding: 12px; margin-bottom: 20px; border-radius: 8px;
                                    background: ${state.messageType === 'error' ? '#4d2d2d' : state.messageType === 'success' ? '#2d4d2d' : '#4d4d2d'};">
                            ${state.message}
                        </div>
                    ` : ''}

                    ${isComputerTurn ? `
                        <div style="text-align: center; margin-bottom: 20px; color: #fbbf24; font-size: 1.1rem;">
                            🤖 Computer is thinking...
                        </div>
                    ` : state.challengeMode ? `
                        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                            <button onclick="window.ghostGame.handleChallenge(true)"
                                    style="padding: 12px 25px; font-size: 1rem; background: #e74c3c; color: #fff;
                                           border: none; border-radius: 8px; cursor: pointer;">
                                Challenge!
                            </button>
                            <button onclick="window.ghostGame.handleChallenge(false)"
                                    style="padding: 12px 25px; font-size: 1rem; background: #3d3d5c; color: #fff;
                                           border: none; border-radius: 8px; cursor: pointer;">
                                Let it slide
                            </button>
                        </div>
                    ` : `
                        <div style="text-align: center; margin-bottom: 15px; color: #4ade80; font-size: 1.1rem;">
                            Your turn - add a letter!
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; max-width: 350px; margin: 0 auto 20px;">
                            ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => `
                                <button onclick="window.ghostGame.addLetter('${letter}')"
                                        style="padding: 12px 0; font-size: 1.2rem; font-weight: bold;
                                               background: #3d3d5c; color: #fff; border: none;
                                               border-radius: 6px; cursor: pointer;">
                                    ${letter}
                                </button>
                            `).join('')}
                        </div>
                    `}
                `}

                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.ghostGame.backToMenu()"
                            style="padding: 10px 20px; font-size: 0.9rem; background: #e74c3c; color: #fff;
                                   border: none; border-radius: 8px; cursor: pointer;">
                        New Game
                    </button>
                    <button onclick="window.ghostGame.toggleMode()"
                            style="padding: 10px 20px; font-size: 0.9rem; background: #3d3d5c; color: #fff;
                                   border: none; border-radius: 8px; cursor: pointer;">
                        ${state.lenientMode ? 'Lenient' : 'Strict'} Mode
                    </button>
                </div>
            </div>
        `;
    }

    // Initialize when game is shown
    function init() {
        renderGame();
    }

    // Launch the game
    function launchGhost() {
        state = {
            currentLetters: '',
            currentPlayer: 1,
            player1Ghost: '',
            player2Ghost: '',
            message: '',
            messageType: '',
            gameOver: false,
            winner: null,
            lenientMode: true,
            showRules: false,
            challengeMode: false,
            vsComputer: false,
            modeSelected: false
        };
        document.getElementById('gamesMenu').style.display = 'none';
        document.getElementById('ghostGame').style.display = 'block';
        renderGame();
    }

    // Back to mode selection
    function backToMenu() {
        state.modeSelected = false;
        state.currentLetters = '';
        state.currentPlayer = 1;
        state.player1Ghost = '';
        state.player2Ghost = '';
        state.message = '';
        state.messageType = '';
        state.gameOver = false;
        state.winner = null;
        state.challengeMode = false;
        renderGame();
    }

    // Exit back to menu
    function exitGhost() {
        document.getElementById('ghostGame').style.display = 'none';
        document.getElementById('gamesMenu').style.display = 'block';
    }

    // Expose to window
    window.ghostGame = {
        init,
        addLetter,
        handleChallenge,
        resetGame,
        toggleRules,
        toggleMode,
        startGame,
        backToMenu
    };
    window.launchGhost = launchGhost;
    window.exitGhost = exitGhost;
})();

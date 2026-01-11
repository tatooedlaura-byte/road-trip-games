// Ghost Word Game
(function() {
    'use strict';

    // Word list for validation (4+ letter words) - loaded from external file
    let WORDS = new Set();
    let dictionaryLoaded = false;

    // Fallback dictionary (used if external load fails)
    const FALLBACK_WORDS = [
        'abandon','abandons','abilities','ability','able','ables','about','abouts','above','aboves',
        'absence','absences','abuse','abuses','academies','academy','account','accounts','achieve',
        'achieves','acid','acids','acquire','acquires','actor','actors','acute','acutes','address',
        'addresses','admit','admits','adopt','adopts','adult','adults','advance','advances','advice',
        'advices','affairs','after','afters','again','agains','against','againsts','aged','ageds','agent',
        'agents','agree','agrees','ahead','aheads','airline','airlines','airport','airports','alarm',
        'alarms','album','albums','alcohol','alcohols','alert','alerts','alien','aliens','align','aligns',
        'alike','alikes','alive','alives','alley','alleys','allow','allows','alloy','alloys','alone',
        'alones','along','alongs','alreadies','already','also','alsos','alter','alters','although',
        'althoughs','amazing','amazings','america','americas','among','amongs','ancient','ancients','anger',
        'angers','angle','angles','angries','angry','another','anothers','anxieties','anxiety','anybodies',
        'anybody','apart','aparts','apple','apples','applied','applies','apply','approaches','area','areas',
        'arena','arenas','argue','argues','arise','arises','armies','armor','armors','army','arrange',
        'arranges','array','arrays','arrival','arrivals','arrow','arrows','article','articles','assault',
        'assaults','asset','assets','atlas','atlases','attempt','attempts','attract','attracts','average',
        'averages','avoid','avoids','award','awards','aware','awares','away','aways','awesome','awesomes',
        'awful','awfuls','babies','baby','back','backs','bacon','bacons','badge','badges','badly','baker',
        'bakers','balance','balances','ball','balls','band','bands','bank','banking','bankings','banks',
        'barrier','barriers','base','bases','basis','basises','batch','batches','bath','baths','batteries',
        'battery','beach','beaches','bear','beard','beards','bearing','bearings','bears','beast','beasts',
        'beat','beating','beatings','beats','because','becauses','bedroom','bedrooms','been','beens','beer',
        'beers','began','begans','begin','begins','begun','beguns','being','beings','believe','believes',
        'bell','bellies','bells','belly','below','belows','belt','belts','bench','benches','bend','bends',
        'beneath','beneaths','benefit','benefits','berries','berry','besides','best','bests','between',
        'betweens','bill','billion','billions','bills','bird','birds','birth','births','bite','bites',
        'black','blacks','blade','blades','blame','blames','blank','blanket','blankets','blanks','blast',
        'blasts','blaze','blazes','bleed','blend','blends','bless','blind','blinds','blink','blinks','bliss',
        'block','blocked','blocks','blood','bloods','bloom','blooms','blow','blown','blowns','blows','blue',
        'blues','blunt','blunts','board','boards','boast','boasts','boat','boats','bodies','body','bomb',
        'bombs','bond','bonds','bone','bones','bonus','bonuses','book','booking','bookings','books','boom',
        'booms','booth','booths','booze','boozes','bored','born','borns','borough','boroughs','boss',
        'bosses','both','bother','bothers','boths','bottom','bottoms','bought','boughts','bound',
        'boundaries','boundary','bounds','bowl','bowls','boxer','boxers','boxes','bracket','brackets',
        'brain','brains','brake','brakes','branch','branches','brand','brands','brass','brave','braves',
        'bread','breads','break','breaks','breath','breathe','breathes','breaths','breed','brick','bricks',
        'bride','brides','bridge','bridges','brief','briefly','briefs','brieves','bright','brights',
        'brilliant','brilliants','bring','brings','britain','britains','british','britishes','broad',
        'broader','broaders','broads','broke','broken','brokens','brokes','brook','brooks','broom','brooms',
        'brother','brothers','brought','broughts','brown','browns','browser','browsers','brush','brushes',
        'buddies','buddy','budget','budgets','build','builder','builders','building','buildings','builds',
        'built','builts','bulk','bulks','bulletin','bulletins','bunch','bunches','burn','burning','burnings',
        'burns','burst','bursts','buses','bush','bushes','busies','busy','buyer','buyers','cabin','cabinet',
        'cabinets','cabins','cable','cables','cache','caches','call','calling','callings','calls','calm',
        'calms','came','camel','camels','cames','camp','campaign','campaigns','camps','campuses','canal',
        'canals','candies','candy','canon','canons','capable','capables','capital','capitals','captain',
        'captains','capture','captures','card','cards','care','careful','carefuls','cares','cargo','cargos',
        'carol','carols','carrier','carriers','carries','carry','carrying','carryings','carve','carves',
        'case','cases','cash','cashes','cast','casts','catalog','catalogs','catch','catches','categories',
        'category','cater','caters','cause','causes','causing','causings','cave','caves','cease','ceases',
        'ceiling','ceilings','cell','cells','central','centrals','centre','centres','centuries','century',
        'certain','certains','chain','chains','chair','chairs','chalk','chalks','chamber','chambers','champ',
        'champion','champions','champs','channel','channels','chant','chants','chaos','chaoses','chapter',
        'chapters','charities','charity','charlie','charm','charms','chart','charter','charters','charts',
        'chase','chases','chat','chats','cheap','cheaper','cheapers','cheaps','cheat','cheats','check',
        'checked','checks','cheek','cheeks','cheer','cheers','chess','chest','chests','chick','chicken',
        'chickens','chicks','chief','chiefs','chieves','child','children','childrens','childs','chill',
        'chills','china','chinas','chinese','chip','chips','choices','choir','choirs','chord','chords',
        'chronic','chronics','chunk','chunks','cinch','cinches','circa','circas','circuit','circuits',
        'cities','citizen','citizens','city','civic','civics','civil','civils','claim','claimed','claims',
        'clamp','clamps','clash','clashes','clasp','clasps','class','classes','classic','classics','clean',
        'cleaned','cleaner','cleaners','cleans','clear','clearly','clears','clerk','clerks','click',
        'clicked','clicks','cliff','cliffs','climate','climates','climb','climbs','cling','clings','clips',
        'cloak','cloaks','clock','clocks','clone','clones','close','closely','closes','closest','closests',
        'cloth','clothes','cloths','cloud','clouds','clown','clowns','club','clubs','cluster','clusters',
        'coach','coaches','coal','coals','coast','coastal','coastals','coasts','coat','coating','coatings',
        'coats','code','codes','cold','colds','college','colleges','colon','colonial','colonials','colons',
        'color','colors','combine','combines','come','comes','comet','comets','comfort','comforts','comma',
        'command','commands','commas','comment','comments','commerce','commerces','commit','commits',
        'common','commons','communication','communications','communities','community','compact','compacts',
        'companies','company','compare','compares','compete','competes','compile','compiles','complex',
        'complexes','component','components','compound','compounds','computer','computers','concept',
        'concepts','concern','concerns','conclude','concludes','concrete','concretes','condition',
        'conditions','conduct','conducts','conference','conferences','confidence','confidences','confirm',
        'confirms','conflict','conflicts','confused','congress','connect','connects','consent','consents',
        'consider','considers','consist','consists','constant','constants','consumer','consumers','contact',
        'contacts','contain','contains','content','contents','contest','contests','context','contexts',
        'continue','continues','contract','contracts','contrast','contrasts','contribute','contributes',
        'control','controls','convert','converts','cook','cooking','cookings','cooks','cool','cooling',
        'coolings','cools','cope','copes','copies','copy','copying','copyings','coral','corals','core',
        'cores','correct','corrects','cost','costs','couch','couches','cough','coughs','could','coulds',
        'council','councils','count','counter','counters','countries','country','counts','coup','coupled',
        'coups','courage','courages','courses','court','courts','cover','covered','covering','coverings',
        'covers','crack','cracks','craft','crafts','crane','cranes','crash','crashed','crashes','crawl',
        'crawls','craze','crazes','crazies','crazy','cream','creams','created','creating','creatings',
        'creation','creations','creative','creatives','creature','creatures','creed','creek','creeks',
        'creep','creeps','crest','crests','crew','crews','cricket','crickets','crime','crimes','criminal',
        'criminals','crisp','crisps','critical','criticals','crop','crops','cross','crosses','crossing',
        'crossings','crowd','crowds','crown','crowns','crude','crudes','cruel','cruels','crush','crushes',
        'cultural','culturals','culture','cultures','curious','curiouses','currencies','currency','current',
        'currents','curve','curves','customer','customers','cutting','cuttings','cycle','cycles','daily',
        'dairies','dairy','damaged','dance','dances','dancing','dancings','dangerous','dangerouses','dark',
        'darks','data','database','databases','datas','date','dated','dates','daughter','daughters','dawn',
        'dawns','days','dayses','dead','deads','deal','dealing','dealings','deals','dealt','dealts','dean',
        'deans','dear','dears','death','deaths','debt','debts','debug','debugs','debut','debuts','decay',
        'decays','decided','decision','decisions','declared','decline','declines','decor','decors','decoy',
        'decoys','decrease','decreases','deep','deeps','default','defaults','defence','defences','defense',
        'defenses','deficit','deficits','defined','definite','definites','degree','degrees','deities',
        'deity','delay','delays','deliver','deliveries','delivers','delivery','demand','demands',
        'democracies','democracy','denied','denies','dense','densities','density','dental','dentals','deny',
        'depend','depends','deposit','deposits','depot','depots','depressed','depth','depths','deputies',
        'deputy','derbies','derby','derived','describe','describes','desert','deserts','deserve','deserves',
        'design','designer','designers','designs','desired','desk','desks','desktop','desktops','despite',
        'despites','destroy','destroys','detail','detailed','details','detect','detects','deter','deters',
        'detox','detoxes','develop','develops','device','devices','devil','devils','devoted','diamond',
        'diamonds','diaries','diary','diet','dietaries','dietary','diets','differ','differs','digital',
        'digitals','dining','dinings','diploma','diplomas','direct','directed','direction','directions',
        'directly','director','directors','directs','dirt','dirties','dirts','dirty','disabled','disagree',
        'disagrees','disc','disco','discos','discount','discounts','discover','discovers','discs','discuss',
        'disease','diseases','dish','dishes','disk','disks','display','displays','dispute','disputes',
        'distance','distances','distant','distants','distinct','distincts','district','districts','ditch',
        'ditches','diver','divers','diverse','divide','divided','divides','divine','divines','division',
        'divisions','divorce','divorces','dizzies','dizzy','doctor','doctors','document','documents','dodge',
        'dodges','does','doing','doings','domestic','domestics','dominant','dominants','done','dones',
        'donor','donors','door','doors','dose','doses','double','doubled','doubles','doubt','doubts','dough',
        'doughs','down','download','downloads','downs','dozen','dozens','draft','drafts','dragon','dragons',
        'drain','drains','drake','drakes','drama','dramas','dramatic','dramatics','drank','dranks','drape',
        'drapes','draw','drawing','drawings','drawl','drawls','draws','dread','dreads','dream','dreams',
        'dress','dressed','dresses','drew','drews','dried','drift','drifts','drill','drills','drink',
        'drinking','drinkings','drinks','drive','driven','drivens','driver','drivers','drives','driving',
        'drivings','droit','droits','drop','dropped','drops','drown','drowns','drug','drugs','drunk',
        'drunks','dual','duals','duke','dukes','during','durings','dust','dusts','duties','duty','dwarf',
        'dwarfs','dwarves','dwell','dwells','dying','dyings','dynamic','dynamics','each','eaches','eager',
        'eagers','eagle','eagles','earlier','earliers','early','earn','earning','earnings','earns','earth',
        'earths','ease','eases','easies','east','eastern','easterns','easts','easy','eaten','eatens','eater',
        'eaters','eating','eatings','economies','economy','edge','edges','edition','editions','editor',
        'editors','educated','education','educations','edwards','effect','effectively','effects','efficient',
        'efficients','effort','efforts','eight','eights','either','eithers','elbow','elbows','elder',
        'elderly','elders','elect','election','elections','electric','electrical','electricals','electrics',
        'electronic','electronics','elects','element','elements','eleven','elevens','eliminate','eliminates',
        'elite','elites','else','elsewhere','elsewheres','email','emails','embassies','embassy','embed',
        'ember','embers','emerge','emergencies','emergency','emerges','emerging','emergings','emission',
        'emissions','emotion','emotional','emotionals','emotions','emphasis','emphasises','empire','empires',
        'employ','employee','employees','employer','employers','employment','employments','employs',
        'empties','empty','enable','enables','encounter','encounters','encourage','encourages','ended',
        'ending','endings','endless','enemies','enemy','energies','energy','engage','engaged','engages',
        'engine','engineer','engineering','engineerings','engineers','engines','enhance','enhances','enjoy',
        'enjoys','enormous','enormouses','enough','enoughs','ensure','ensures','enter','enterprise',
        'enterprises','enters','entertainment','entertainments','entire','entirely','entires','entrance',
        'entrances','entries','entry','environment','environments','equal','equally','equals','equip',
        'equipment','equipments','equips','equities','equity','equivalent','equivalents','erase','erases',
        'error','errors','escape','escapes','especially','essay','essays','essential','essentials',
        'establish','establishes','estate','estates','estimate','estimates','ethnic','ethnics','ethos',
        'ethoses','europe','european','europeans','europes','evade','evades','evaluate','evaluates','even',
        'evening','evenings','evens','event','events','eventually','ever','everies','evers','every',
        'everybodies','everybody','everyone','everyones','everything','everythings','everywhere',
        'everywheres','evidence','evidences','evident','evidents','evil','evils','evolution','evolutions',
        'exact','exactly','exacts','exam','examine','examines','example','examples','exams','excellent',
        'excellents','except','exception','exceptions','excepts','exchange','exchanges','excited','exciting',
        'excitings','exclude','excludes','exclusive','exclusives','excuse','excuses','execute','executes',
        'executive','executives','exercise','exercises','exert','exerts','exhibit','exhibits','exile',
        'exiles','exist','existing','existings','exists','exit','exits','expand','expands','expansion',
        'expansions','expect','expected','expects','expenditure','expenditures','expense','expenses',
        'expensive','expensives','experience','experiences','experiment','experiments','expert','experts',
        'explain','explains','explanation','explanations','explore','explores','export','exports','expose',
        'exposes','exposure','exposures','express','expression','expressions','extend','extended','extends',
        'extension','extensions','extensive','extensives','extent','extents','external','externals','extra',
        'extraordinaries','extraordinary','extras','extreme','extremely','extremes','fable','fables',
        'fabric','fabrics','face','faced','faces','facet','facets','facilities','facility','facing',
        'facings','fact','factor','factories','factors','factory','facts','faculties','faculty','fail',
        'failed','failing','failings','fails','failure','failures','faint','faints','fair','fairies',
        'fairly','fairs','fairy','faith','faiths','fall','fallen','fallens','falling','fallings','falls',
        'false','fame','fames','familiar','familiars','families','family','famous','famouses','fancies',
        'fancy','fantastic','fantastics','farm','farmer','farmers','farming','farmings','farms','fashion',
        'fashions','fast','faster','fasters','fastest','fastests','fasts','fatal','fatals','fate','fates',
        'father','fathers','fatties','fatty','fault','faults','favor','favorite','favorites','favors','fear',
        'fears','feast','feasts','feature','features','federal','federals','feed','feedback','feedbacks',
        'feeds','feel','feeling','feelings','feels','feet','feets','fell','fells','felt','felts','female',
        'females','fence','fences','ferries','ferry','fetal','fetals','fetch','fetches','fever','fevers',
        'fewer','fewers','fiber','fibers','fibre','fibres','fiction','fictions','field','fields','fieries',
        'fiery','fifteen','fifteens','fifth','fifths','fifties','fifty','fight','fights','figure','figures',
        'file','files','filing','filings','fill','filled','filling','fillings','fills','film','films',
        'filter','filters','final','finally','finals','finance','finances','financial','financials','find',
        'finding','findings','finds','fine','finer','finers','fines','finish','finished','finishes','fire',
        'fired','firefox','firefoxes','fires','firm','firms','first','firsts','fiscal','fiscals','fish',
        'fishes','fishing','fishings','fitness','five','fives','fixed','fixes','flag','flags','flair',
        'flairs','flame','flames','flank','flanks','flare','flares','flash','flashes','flask','flasks',
        'flat','flats','fled','fleds','fleet','fleets','flesh','fleshes','flew','flews','flies','flight',
        'flights','fling','flings','flint','flints','flip','flips','float','floating','floatings','floats',
        'flock','flocks','flood','floods','floor','floors','flora','floras','florida','floridas','flour',
        'flours','flow','flower','flowers','flown','flowns','flows','fluid','fluids','flung','flungs',
        'flunk','flunks','flush','flushes','flute','flutes','flying','flyings','focal','focals','focus',
        'focused','focuses','fold','folder','folders','folds','folk','folks','follow','followed','following',
        'followings','follows','food','foods','foot','football','footballs','foots','force','forced',
        'forces','ford','fords','forecast','forecasts','foreign','foreigns','forest','forests','forever',
        'forevers','forge','forges','forget','forgets','forgot','forgots','forgotten','forgottens','form',
        'formal','formals','format','formation','formations','formats','former','formers','forms','formula',
        'formulas','fort','forth','forths','forties','forts','fortune','fortunes','forty','forum','forums',
        'forward','forwards','fossil','fossils','foster','fosters','found','foundation','foundations',
        'founded','founder','founders','founds','four','fours','foxes','foyer','foyers','fraction',
        'fractions','frail','frails','frame','frames','framework','frameworks','france','frances','frank',
        'franks','fraud','frauds','freak','freaks','free','freed','freedom','freedoms','freely','frees',
        'french','frenches','frequent','frequents','fresh','freshes','friar','friars','friday','fridays',
        'fried','friendly','friends','from','froms','front','fronts','frost','frosts','froze','frozes',
        'fruit','fruits','fuel','fuels','fulfill','fulfills','full','fulls','fully','function','functions',
        'fund','fundamental','fundamentals','funded','funding','fundings','funds','funeral','funerals',
        'fungi','fungis','funkies','funky','funnies','funny','furniture','furnitures','further','furthers',
        'future','futures','gain','gained','gains','galaxies','galaxy','galleries','gallery','gambling',
        'gamblings','game','games','gaming','gamings','gamma','gammas','gang','gangs','garden','gardens',
        'gases','gate','gates','gateway','gateways','gather','gathered','gathers','gauge','gauges','gaunt',
        'gaunts','gauze','gauzes','gave','gavel','gavels','gaves','gazed','gear','gears','geese','gender',
        'genders','gene','general','generally','generals','generate','generates','generation','generations',
        'generic','generics','generous','generouses','genes','genetic','genetics','genius','geniuses',
        'genre','genres','gentle','gentles','genuine','genuines','german','germanies','germans','germany',
        'getting','gettings','ghost','ghosts','giant','giants','gift','gifts','girl','girlfriend',
        'girlfriends','girls','give','given','givens','gives','giving','givings','glad','glads','gland',
        'glands','glare','glares','glass','glasses','gleam','gleams','glide','glides','global','globals',
        'globe','globes','gloom','glooms','glories','glory','gloss','glove','gloves','glyph','glyphs',
        'gnome','gnomes','goal','goals','goes','going','goings','gold','golden','goldens','golds','golf',
        'golfs','golves','gone','gones','gonna','gonnas','good','goods','google','googles','gotten',
        'gottens','govern','government','governments','governor','governors','governs','grab','grabs',
        'grace','graces','grade','grades','graduate','graduates','grain','grains','grand','grandfather',
        'grandfathers','grandmother','grandmothers','grands','grant','granted','grants','grape','grapes',
        'graph','graphic','graphics','graphicses','graphs','grasp','grasps','grass','grateful','gratefuls',
        'grave','gravel','gravels','graves','gray','grays','graze','grazes','great','greater','greaters',
        'greatest','greatests','greatly','greats','greed','greek','greeks','green','greens','greet','greets',
        'grew','grews','grey','greys','grid','grids','grief','griefs','grieves','grill','grills','grind',
        'grinds','grip','grips','groan','groans','groceries','grocery','groom','grooms','gross','ground',
        'grounds','group','groups','grove','groves','grow','growing','growings','growl','growls','grown',
        'growns','grows','growth','growths','guarantee','guarantees','guard','guards','guess','guesses',
        'guest','guests','guidance','guidances','guide','guideline','guidelines','guides','guild','guilds',
        'guilt','guilties','guilts','guilty','guise','guises','guitar','guitars','gulch','gulches','gulf',
        'gulfs','gulves','habit','habitat','habitats','habits','hacker','hackers','hair','hairies','hairs',
        'hairy','half','halfs','hall','halls','halves','hand','handed','handies','handle','handled',
        'handles','hands','handy','hang','hanging','hangings','hangs','happen','happened','happens',
        'happies','happiness','happy','harbor','harbors','hard','harder','harders','hardies','hardly',
        'hards','hardware','hardwares','hardy','harm','harmful','harmfuls','harms','harries','harry','harsh',
        'harshes','harvest','harvests','haste','hastes','hasties','hasty','hatch','hatches','hate','hates',
        'have','haven','havens','haves','having','havings','havoc','havocs','head','headed','headies',
        'heading','headings','headline','headlines','heads','heady','health','healthies','healths','healthy',
        'hear','heard','heards','hearing','hearings','hears','heart','hearts','heat','heated','heating',
        'heatings','heats','heaven','heavens','heavies','heavily','heavy','hedge','hedges','heel','heels',
        'hefties','hefty','height','heights','heist','heists','held','helds','helicopter','helicopters',
        'hell','hello','hellos','hells','help','helped','helpful','helpfuls','helping','helpings','helps',
        'hence','hences','herald','heralds','herbs','herbses','here','heres','heritage','heritages','hero',
        'heros','herself','herselfs','herselves','hidden','hiddens','hide','hides','hiding','hidings',
        'hierarchies','hierarchy','high','higher','highers','highest','highests','highlight','highlights',
        'highly','highs','highway','highways','hill','hills','hilly','himself','himselfs','himselves',
        'hinge','hinges','hints','hippo','hippos','hire','hired','hires','hiring','hirings','historic',
        'historical','historicals','historics','histories','history','hobbies','hobby','hockey','hockeys',
        'hold','holder','holders','holding','holdings','holds','hole','holes','holiday','holidays','holly',
        'hollywood','hollywoods','holy','home','homeland','homelands','homeless','homepage','homepages',
        'homes','honda','hondas','honest','honests','honey','honeys','honor','honors','hope','hoped','hopes',
        'horizon','horizons','horn','horns','horror','horrors','horse','horses','hospital','hospitals',
        'host','hosted','hostile','hostiles','hosting','hostings','hosts','hotel','hotels','hottest',
        'hottests','hound','hounds','hour','hourly','hours','house','household','households','houses',
        'housing','housings','however','howevers','hudson','hudsons','huge','huges','human','humanities',
        'humanity','humans','humid','humids','humor','humors','hundred','hung','hunger','hungers','hungries',
        'hungry','hungs','hunt','hunter','hunters','hunting','huntings','hunts','hurricane','hurricanes',
        'hurries','hurry','hurt','hurts','husband','husbands','hybrid','hybrids','hydro','hydros','hyena',
        'hyenas','hyper','hypers','hypothesis','hypothesises','idea','ideal','ideals','ideas','ideases',
        'identifies','identify','identities','identity','idiom','idioms','idiot','idiots','ignored',
        'illegal','illegals','illness','illustrated','image','images','imagine','imagines','imaging',
        'imagings','immediate','immediately','immediates','impact','impacts','implement','implementation',
        'implementations','implements','implied','implies','imply','import','importance','importances',
        'important','importants','imports','impose','imposes','impossible','impossibles','improve',
        'improved','improvement','improvements','improves','inbox','inboxes','inch','inches','incident',
        'incidents','include','included','includes','including','includings','income','incomes','increase',
        'increased','increases','increasing','increasings','incredible','incredibles','incur','incurs',
        'indeed','independence','independences','independent','independents','index','indexes','indian',
        'indians','indicate','indicated','indicates','indie','indies','individual','individuals','indoor',
        'indoors','industrial','industrials','industries','industry','infant','infants','infection',
        'infections','inflation','inflations','influence','influences','inform','informal','informals',
        'information','informations','informs','infrastructure','infrastructures','initial','initially',
        'initials','initiative','initiatives','injuries','injury','inner','inners','innocent','innocents',
        'innovation','innovations','innovative','innovatives','input','inputs','inquiries','inquiry',
        'insert','inserts','inside','insides','insight','insights','inspection','inspections','inspector',
        'inspectors','inspiration','inspirations','install','installation','installations','installs',
        'instance','instances','instant','instants','instead','insteads','institute','institutes',
        'institution','institutions','instruction','instructions','instrument','instruments','insurance',
        'insurances','intel','intels','intended','intense','intensities','intensity','intent','intention',
        'intentions','intents','inter','interaction','interactions','interest','interested','interesting',
        'interestings','interests','interface','interfaces','interior','interiors','internal','internals',
        'international','internationals','internet','internets','interpret','interprets','inters',
        'intervention','interventions','interview','interviews','into','intos','intro','introduced',
        'introduction','introductions','intros','invasion','invasions','invest','investigate','investigates',
        'investigation','investigations','investigator','investigators','investment','investments',
        'investor','investors','invests','invisible','invisibles','invitation','invitations','involve',
        'involved','involvement','involvements','involves','ionic','ionics','ireland','irelands','irish',
        'irishes','iron','ironies','irons','irony','island','islands','isolation','isolations','israel',
        'israeli','israelis','israels','issue','issued','issues','italian','italians','italy','item','items',
        'itself','itselfs','itselves','ivories','ivory','jack','jacket','jackets','jacks','jackson',
        'jacksons','jail','jails','james','jane','janes','japan','japanese','japans','jean','jeans',
        'jellies','jelly','jersey','jerseys','jesus','jesuses','jewel','jewels','jiffies','jiffy','jimmies',
        'jimmy','jobs','jobses','john','johns','johnson','johnsons','join','joined','joins','joint','joints',
        'joke','joker','jokers','jokes','jolly','jones','jordan','jordans','joseph','josephs','journal',
        'journalist','journalists','journals','journey','journeys','joust','jousts','judge','judges',
        'judgment','judgments','juice','juices','juicies','juicy','jumbo','jumbos','jump','jumped','jumpies',
        'jumping','jumpings','jumps','jumpy','junction','junctions','june','junes','jungle','jungles',
        'junior','juniors','junta','juntas','juries','juror','jurors','jury','just','justice','justices',
        'justifies','justify','justs','karma','karmas','kayak','kayaks','kebab','kebabs','keen','keens',
        'keep','keeping','keepings','keeps','kelly','kent','kents','kept','kepts','kernel','kernels','kevin',
        'kevins','keyboard','keyboards','keyed','keyword','keywords','kick','kicked','kicks','kill',
        'killing','killings','kills','kind','kinds','king','kingdom','kingdoms','kings','kiosk','kiosks',
        'kisses','kitchen','kitchens','klein','kleins','knack','knacks','knead','kneads','knee','kneel',
        'kneels','knees','knelt','knelts','knew','knews','knife','knifes','knight','knights','knives',
        'knock','knocks','knoll','knolls','know','knowing','knowings','knowledge','knowledges','known',
        'knowns','knows','knowses','kudos','kudoses','label','labeled','labels','labor','laboratories',
        'laboratory','labors','labour','labours','laced','lack','lacking','lackings','lacks','ladder',
        'ladders','ladies','lady','lager','lagers','laid','laids','laities','laity','lake','lakes','lamps',
        'land','landed','landing','landings','landlord','landlords','lands','landscape','landscapes','lane',
        'lanes','language','languages','lankies','lanky','lapel','lapels','lapse','laptop','laptops','large',
        'largely','larger','largers','larges','largest','largests','larva','larvas','laser','lasers','lasso',
        'lassos','last','lasting','lastings','lasts','latch','latches','late','later','laters','lates',
        'latest','latests','latex','latexes','latin','latins','latter','latters','laugh','laughing',
        'laughings','laughs','launch','launched','launches','laundries','laundry','lawyer','lawyers','layer',
        'layers','layout','layouts','lead','leader','leaders','leadership','leaderships','leading',
        'leadings','leads','leaf','leafies','leafs','leafy','league','leagues','leakies','leaky','leant',
        'leants','leapt','leapts','learn','learned','learning','learnings','learns','lease','leases','least',
        'leasts','leather','leathers','leave','leaves','leaving','leavings','lecture','lectures','ledge',
        'ledges','left','lefts','legal','legally','legals','legend','legends','legislation','legislations',
        'legitimate','legitimates','leisure','leisures','lemon','lemons','length','lengths','lesbian',
        'lesbians','less','lesson','lessons','letter','letters','level','levels','lever','leverage',
        'leverages','levers','lewis','lewises','liabilities','liability','libel','libels','liberal',
        'liberals','liberties','liberty','libraries','library','licence','licences','license','licensed',
        'licenses','life','lifes','lifetime','lifetimes','lift','lifted','lifts','light','lighting',
        'lightings','lights','like','liked','likely','likes','limbo','limbos','limbs','limbses','limit',
        'limited','limiting','limitings','limits','lincoln','lincolns','linda','lindas','line','linear',
        'linears','lined','linen','linens','liner','liners','lines','lingerie','lingeries','lingo','lingos',
        'lining','linings','link','linked','linking','linkings','links','linux','linuxes','lions','liquid',
        'liquids','list','listed','listen','listening','listenings','listens','listing','listings','lists',
        'liter','literacies','literacy','literally','literaries','literary','literature','literatures',
        'liters','litre','litres','little','littles','live','lived','lively','liver','livers','lives',
        'living','livings','llama','llamas','load','loaded','loading','loadings','loads','loan','loans',
        'lobbies','lobby','local','locals','locate','located','locates','location','locations','lock',
        'locked','locks','lodge','lodges','lofties','lofty','logging','loggings','logic','logical',
        'logicals','logics','login','logins','logistics','logisticses','logo','logos','logoses','london',
        'londons','lonely','long','longer','longers','longest','longests','longs','look','looking',
        'lookings','looks','loops','loose','looses','lopez','lopezs','lord','lords','lorries','lorry','lose',
        'loser','losers','loses','losing','losings','loss','losses','lost','losts','lotteries','lottery',
        'lotus','lotuses','louis','louises','lounge','lounges','lousies','lousy','love','loved','lovely',
        'lover','lovers','loves','loving','lovings','lower','lowers','lowest','lowests','loyal','loyals',
        'lucas','lucases','lucid','lucids','luck','luckies','lucks','lucky','lumpies','lumpy','lunar',
        'lunars','lunch','lunches','lungs','lusties','lusty','luxuries','luxury','lying','lyings','lyric',
        'lyrics','machine','machineries','machinery','machines','macho','machos','macro','macros','made',
        'mades','madison','madisons','magazine','magazines','magic','magical','magicals','magics','magma',
        'magmas','magnetic','magnetics','magnificent','magnificents','maiden','maidens','mail','mailing',
        'mailings','mails','main','mainly','mains','mainstream','mainstreams','maintain','maintained',
        'maintains','maintenance','maintenances','major','majorities','majority','majors','make','maker',
        'makers','makes','makeup','makeups','making','makings','malaysia','malaysias','malcolm','malcolms',
        'male','males','malls','managed','management','managements','manager','managers','managing',
        'managings','mandate','mandates','manga','mangas','mango','mangos','mania','manias','manies',
        'manner','manners','manor','manors','manual','manually','manuals','manufacture','manufacturer',
        'manufacturers','manufactures','manufacturing','manufacturings','many','maple','maples','mapping',
        'mappings','marathon','marathons','marble','marbles','march','marches','marcus','marcuses','margin',
        'margins','maria','marias','marine','marines','mark','marked','market','marketing','marketings',
        'markets','marking','markings','marks','marriage','marriages','married','marries','marry','marsh',
        'marshall','marshalls','marshes','martial','martials','martin','martins','marvel','marvels','masks',
        'mass','masses','massive','massives','master','masters','match','matched','matches','matching',
        'matchings','material','materials','mathematical','mathematicals','maths','mathses','matt','matter',
        'matters','matts','mature','matures','mauve','mauves','maxim','maxims','maximum','maximums','maybe',
        'maybes','mayor','mayors','meal','meals','mean','meaning','meaningful','meaningfuls','meanings',
        'means','meant','meants','measure','measured','measurement','measurements','measures','measuring',
        'measurings','meat','meaties','meats','meaty','mechanical','mechanicals','mechanism','mechanisms',
        'medal','medals','media','median','medians','medias','medic','medical','medicals','medication',
        'medications','medicine','medicines','medics','medieval','medievals','medium','mediums','meet',
        'meeting','meetings','meets','melbourne','melbournes','melee','melees','melissa','melissas','melon',
        'melons','member','members','membership','memberships','membrane','membranes','memorial','memorials',
        'memories','memory','mental','mentals','mention','mentioned','mentions','mentor','mentors','menu',
        'menus','merchant','merchants','mercies','mercuries','mercury','mercy','mere','merely','meres',
        'merge','merger','mergers','merges','merit','merits','merries','merry','message','messages',
        'messaging','messagings','messes','messies','messy','metal','metals','meter','meters','method',
        'methodologies','methodology','methods','metro','metros','mexican','mexicans','mexico','mexicos',
        'miami','miamis','michael','michaels','michigan','michigans','micro','micros','microwave',
        'microwaves','middle','middles','midnight','midnights','midst','midsts','might','mighties','mights',
        'mighty','migration','migrations','mike','mikes','milan','milans','mild','milds','mile','miles',
        'militaries','military','milk','milks','mill','miller','millers','million','millions','mills',
        'mince','minces','mind','minded','minds','mine','mined','miner','mineral','minerals','miners',
        'mines','minimal','minimals','minimize','minimizes','minimum','minimums','mining','minings',
        'minister','ministers','ministries','ministry','minor','minorities','minority','minors','minus',
        'minuses','minute','minutes','miracle','miracles','mirror','mirrors','mirth','mirths','miss',
        'missed','misses','missing','missings','mission','missions','mistake','mistakes','misties','misty',
        'mitchell','mitchells','mixed','mixer','mixers','mixes','mixing','mixings','mobile','mobiles',
        'mobilities','mobility','mode','model','modeling','modelings','models','modem','modems','moderate',
        'moderates','modern','moderns','modes','modest','modests','modification','modifications','modified',
        'modifies','modify','module','modules','moist','moists','moisture','moistures','molar','molars',
        'moldies','moldy','molecular','moleculars','moment','moments','momentum','momentums','monaco',
        'monacos','monday','mondays','monetaries','monetary','money','moneys','monitor','monitoring',
        'monitorings','monitors','monkey','monkeys','monster','monsters','montana','montanas','month',
        'monthly','months','monthses','montreal','montreals','monument','monuments','mood','moodies','moods',
        'moody','moon','moons','moors','moose','mooses','moral','morals','more','moreover','moreovers',
        'mores','morgan','morgans','morning','mornings','moron','morons','morph','morphs','morris',
        'morrises','mortalities','mortality','mortgage','mortgages','moscow','moscows','most','mostly',
        'mosts','motel','motels','mother','mothers','motif','motifs','motion','motions','motivated',
        'motivation','motivations','motives','motor','motorcycle','motorcycles','motors','motto','mottos',
        'mould','moulds','mound','mounds','mount','mountain','mountains','mounted','mounting','mountings',
        'mounts','mourn','mourns','mouse','mouses','mousies','mousy','mouth','mouths','move','moved',
        'movement','movements','mover','movers','moves','movie','movies','moving','movings','much','muches',
        'muckies','mucky','mucus','mucuses','muddies','muddy','multi','multiple','multiples','multis',
        'mummies','mummy','munch','munches','municipal','municipals','mural','murals','murder','murders',
        'murkies','murky','murphies','murphy','murray','murrays','muscle','muscles','museum','museums',
        'music','musical','musicals','musician','musicians','musics','muslim','muslims','must','musties',
        'musts','musty','mutual','mutuals','myself','myselfs','myselves','mysteries','mystery','naive',
        'naives','naked','name','named','namely','names','nancies','nancy','nannies','nanny','narrow',
        'narrows','nasal','nasals','nasties','nasty','nation','national','nationals','nations','native',
        'natives','natural','naturally','naturals','nature','natures','naval','navals','navies','navigate',
        'navigates','navigation','navigations','navy','near','nearbies','nearby','nearest','nearests',
        'nearly','nears','necessaries','necessarily','necessary','necessities','necessity','neck','necks',
        'need','needs','negative','negatives','negotiate','negotiates','negotiation','negotiations',
        'neighbor','neighborhood','neighborhoods','neighbors','neil','neils','neither','neithers','nelson',
        'nelsons','nerve','nerves','nervies','nervous','nervouses','nervy','nest','nested','nests','network',
        'networking','networkings','networks','neural','neurals','neutral','neutrals','never','nevers',
        'newer','newers','newest','newests','newly','newport','newports','news','newses','newsletter',
        'newsletters','newspaper','newspapers','newton','newtons','next','nexts','nexus','nexuses','nice',
        'nicer','nicers','nices','niche','niches','nicholas','nicholases','nick','nickel','nickels','nicks',
        'night','nightmare','nightmares','nights','nimbies','nimby','nine','nines','nineteenth',
        'nineteenths','ninja','ninjas','ninth','ninths','nitrogen','nitrogens','noble','nobles','nobodies',
        'nobody','nodal','nodals','nodes','noise','noises','noisies','noisy','nomad','nomads','nominated',
        'nomination','nominations','none','nones','nonetheless','nonprofit','nonprofits','normal','normally',
        'normals','norman','normans','norms','north','northeast','northeasts','northern','northerns',
        'norths','northwest','northwests','norton','nortons','norwegian','norwegians','nose','noses',
        'notable','notables','notably','notch','notches','note','noted','notes','nothing','nothings',
        'notice','noticed','notices','notification','notifications','notifies','notify','notion','notions',
        'notre','notres','nouns','novel','novels','november','novembers','nowadays','nowadayses','nowhere',
        'nowheres','nuclear','nuclears','nucleus','nucleuses','nudge','nudges','number','numbers','numeric',
        'numerics','numerous','numerouses','nurse','nurses','nursing','nursings','nutrition','nutritions',
        'nutties','nutty','nylon','nylons','oasis','oasises','object','objective','objectives','objects',
        'obligation','obligations','observation','observations','observe','observed','observer','observers',
        'observes','obtain','obtained','obtains','obvious','obviouses','obviously','occasion','occasional',
        'occasionally','occasionals','occasions','occupation','occupations','occupied','occur','occurred',
        'occurrence','occurrences','occurring','occurrings','occurs','ocean','oceans','october','octobers',
        'oddly','odds','offer','offering','offerings','offers','office','officer','officers','offices',
        'official','officials','offline','offlines','offset','offsets','often','oftens','okay','okays',
        'older','olders','oldest','oldests','olive','oliver','olivers','olives','olympic','olympics',
        'olympicses','omega','omegas','once','onces','ongoing','ongoings','onion','onions','online',
        'onlines','only','onset','onsets','ontario','ontarios','onto','ontos','open','opening','openings',
        'opens','opera','operas','operate','operated','operates','operating','operatings','operation',
        'operational','operationals','operations','operator','operators','opinion','opinions','opponent',
        'opponents','opportunities','opportunity','oppose','opposed','opposes','opposite','opposites',
        'opposition','oppositions','optic','optical','opticals','optics','optimal','optimals','optimum',
        'optimums','option','optional','optionals','options','oracle','oracles','oral','orals','orange',
        'oranges','orbit','orbits','orchestra','orchestras','order','ordered','ordering','orderings',
        'orders','ordinaries','ordinary','oregon','oregons','organ','organic','organics','organisation',
        'organisations','organizations','organize','organized','organizer','organizers','organizes','organs',
        'orientation','orientations','oriented','origin','original','originally','originals','origins',
        'orleans','oscar','oscars','other','others','otherwise','otherwises','ought','oughts','ounce',
        'ounces','outcome','outcomes','outdoor','outdoors','outer','outers','outgo','outgos','outlet',
        'outlets','outline','outlines','outlook','outlooks','output','outputs','outre','outreach',
        'outreaches','outres','outside','outsides','outstanding','outstandings','over','overall','overalls',
        'overcome','overcomes','overhead','overheads','overnight','overnights','overs','overseas',
        'overseases','overview','overviews','overwhelming','overwhelmings','owing','owings','owned','owner',
        'owners','ownership','ownerships','oxford','oxfords','oxide','oxides','oxygen','oxygens','ozone',
        'ozones','pace','paced','pacer','pacers','paces','pacific','pacifics','pack','package','packages',
        'packaging','packagings','packed','packet','packets','packing','packings','packs','paddle','paddles',
        'page','pages','paid','paids','pain','painful','painfuls','pains','paint','painted','painter',
        'painters','painting','paintings','paints','pair','pairs','pakistan','pakistans','palace','palaces',
        'palestinian','palestinians','palm','palms','panel','panels','panic','panics','pants','papal',
        'papals','paper','papers','parade','parades','paradise','paradises','paragraph','paragraphs',
        'parallel','parallels','parameter','parameters','parent','parents','paris','parises','parish',
        'parishes','park','parker','parkers','parking','parkings','parks','parliament','parliaments',
        'parrot','parrots','part','partial','partially','partials','participant','participants',
        'participate','participated','participates','participating','participatings','participation',
        'participations','particle','particles','particular','particularly','particulars','parties','partly',
        'partner','partners','partnership','partnerships','parts','party','pass','passage','passages',
        'passed','passenger','passengers','passes','passing','passings','passion','passions','passive',
        'passives','password','passwords','past','pasta','pastas','paste','pastes','pasties','pastor',
        'pastors','pasts','pasty','patch','patches','patent','patents','path','paths','pathses','patient',
        'patients','patio','patios','patrick','patricks','patrol','patrols','pattern','patterns','pause',
        'pauses','pavement','pavements','payed','paying','payings','payment','payments','payroll','payrolls',
        'peace','peaceful','peacefuls','peaces','peach','peaches','peak','peaks','pearl','pearls','pedal',
        'pedals','pedro','pedros','peers','penalties','penalty','pencil','pencils','pending','pendings',
        'pennies','pennsylvania','pennsylvanias','penny','pension','pensions','people','peoples','pepper',
        'peppers','percent','percentage','percentages','percents','perception','perceptions','perfect',
        'perfectly','perfects','perform','performance','performances','performed','performer','performers',
        'performing','performings','performs','perhaps','period','periodic','periodics','periods',
        'peripheral','peripherals','perkies','perks','perky','permanent','permanents','permission',
        'permissions','permit','permits','permitted','person','personal','personalities','personality',
        'personally','personals','personnel','personnels','persons','perspective','perspectives','peskies',
        'pesky','pests','peter','peters','petition','petitions','petroleum','petroleums','petties','petty',
        'phantom','phantoms','phase','phases','phenomenon','phenomenons','philadelphia','philadelphias',
        'philip','philippines','philips','phillips','phoenix','phoenixes','phone','phones','photo',
        'photograph','photographer','photographers','photographies','photographs','photographses',
        'photography','photos','photoses','phrase','phrases','physical','physically','physicals','physician',
        'physicians','physics','physicses','piano','pianos','pick','pickies','picking','pickings','picks',
        'picky','picture','pictures','piece','pieces','piggies','piggy','pilot','pilots','pinch','pinches',
        'pink','pinks','pioneer','pioneers','pipe','pipeline','pipelines','pipes','pitch','pitches',
        'pithies','pithy','pivot','pivots','pixel','pixels','pizza','pizzas','place','placed','placement',
        'placements','places','placing','placings','plain','plains','plaintiff','plaintiffs','plan','plane',
        'planes','planet','planetaries','planetary','planets','plank','planks','planned','planner',
        'planners','planning','plannings','plans','plant','plants','plasma','plasmas','plastic','plastics',
        'plate','plates','platform','platforms','platinum','platinums','play','played','player','players',
        'playing','playings','plays','playses','plaza','plazas','plead','pleads','pleasant','pleasants',
        'please','pleased','pleases','pleasure','pleasures','pleat','pleats','pledge','pledges','plenties',
        'plenty','plier','pliers','plot','plots','pluck','plucks','plug','plugin','plugins','plugs','plumb',
        'plumbing','plumbings','plumbs','plump','plumps','plums','plunk','plunks','plus','pluses','plush',
        'plushes','pocket','pockets','podcast','podcasts','poem','poems','poet','poetries','poetry','poets',
        'point','pointed','pointer','pointers','pointing','pointings','points','poise','poises','poker',
        'pokers','poland','polands','polar','polars','pole','poles','police','polices','policies','policy',
        'polish','polishes','political','politically','politicals','politician','politicians','politics',
        'politicses','poll','polls','pollution','pollutions','polymer','polymers','polyp','polyps','pond',
        'ponds','pool','pools','poor','poors','pope','popes','poppies','poppy','popular','popularities',
        'popularity','populars','population','populations','porch','porches','pores','port','portable',
        'portables','portal','portals','porter','porters','portfolio','portfolios','portion','portions',
        'portrait','portraits','ports','portugal','portugals','portuguese','pose','posed','poser','posers',
        'poses','position','positioned','positions','positive','positives','possess','possession',
        'possessions','possibilities','possibility','possible','possibles','possibly','post','postal',
        'postals','posted','poster','posters','posting','postings','posts','potato','potatos','potential',
        'potentially','potentials','potter','potteries','potters','pottery','pouch','pouches','poultries',
        'poultry','pound','pounds','pour','pours','poverties','poverty','powder','powders','powell',
        'powells','power','powered','powerful','powerfuls','powers','practical','practicals','practice',
        'practices','prague','pragues','prairie','prairies','praise','praises','prank','pranks','prawn',
        'prawns','prayer','prayers','precious','preciouses','precise','precisely','precises','precision',
        'precisions','predict','predicted','prediction','predictions','predicts','prefer','preference',
        'preferences','preferred','prefers','pregnancies','pregnancy','pregnant','pregnants','preliminaries',
        'preliminary','premier','premiere','premieres','premiers','premise','premises','premium','premiums',
        'preparation','preparations','prepare','prepared','prepares','preparing','preparings','prescription',
        'prescriptions','presence','presences','present','presentation','presentations','presented',
        'presenting','presentings','presently','presents','preservation','preservations','preserve',
        'preserves','president','presidential','presidentials','presidents','press','pressed','presses',
        'pressing','pressings','pressure','pressures','preston','prestons','pretties','pretty','prevailing',
        'prevailings','prevent','preventing','preventings','prevention','preventions','prevents','preview',
        'previews','previous','previouses','previously','price','priced','prices','pricies','pricing',
        'pricings','pricy','pride','prides','priest','priests','primaries','primarily','primary','prime',
        'primes','prince','princes','princess','princeton','princetons','principal','principals','principle',
        'principles','print','printed','printer','printers','printing','printings','prints','prior',
        'priorities','priority','priors','prism','prisms','prison','prisoner','prisoners','prisons',
        'privacies','privacy','private','privates','privies','privilege','privileges','privy','prize',
        'prizes','probably','probe','probes','problem','problems','procedure','procedures','proceed',
        'proceeding','proceedings','process','processed','processing','processings','processor','processors',
        'produce','produced','producer','producers','produces','producing','producings','product',
        'production','productions','productive','productives','productivities','productivity','products',
        'profession','professional','professionals','professions','professor','professors','profile',
        'profiles','profit','profitable','profitables','profits','program','programme','programmer',
        'programmers','programmes','programming','programmings','programs','progress','progressive',
        'progressives','project','projected','projection','projections','projector','projectors','projects',
        'prominent','prominents','promise','promised','promises','promising','promisings','promo','promos',
        'promote','promoted','promoter','promoters','promotes','promoting','promotings','promotion',
        'promotional','promotionals','promotions','prompt','promptly','prompts','prone','prones','proof',
        'proofs','prooves','propaganda','propagandas','proper','properly','propers','properties','property',
        'prophet','prophets','proportion','proportions','proposal','proposals','propose','proposed',
        'proposes','proposition','propositions','proprietaries','proprietary','props','prose','prosecution',
        'prosecutions','proses','prospect','prospective','prospectives','prospects','prosperities',
        'prosperity','protect','protected','protecting','protectings','protection','protections',
        'protective','protectives','protects','protein','proteins','protest','protests','protocol',
        'protocols','prototype','prototypes','proud','proudly','prouds','prove','proved','proven','provens',
        'proves','provide','provided','providence','providences','provider','providers','provides',
        'providing','providings','province','provinces','provision','provisions','proxies','proxy','prude',
        'prudes','prune','prunes','psalm','psalms','psyche','psyches','psychiatric','psychiatrics',
        'psychological','psychologicals','psychologies','psychologist','psychologists','psychology','pubic',
        'pubics','public','publication','publications','publicities','publicity','publicly','publics',
        'publish','published','publisher','publishers','publishes','publishing','publishings','pull',
        'pulling','pullings','pulls','pulse','pulses','pump','pumps','punch','punches','punishes',
        'punishment','punishments','pupil','pupils','puppies','puppy','purchase','purchased','purchases',
        'purchasing','purchasings','pure','pures','purge','purges','purple','purples','purpose','purposes',
        'purse','purses','pursue','pursues','pursuit','pursuits','push','pushed','pushes','pushies',
        'pushing','pushings','pushy','putting','puttings','puzzle','puzzles','qualified','qualifies',
        'qualify','qualifying','qualifyings','qualities','quality','quantities','quantity','quantum',
        'quantums','quarter','quarterly','quarters','queen','queens','queries','query','quest','question',
        'questioned','questions','quests','queue','queues','quick','quicker','quickers','quickly','quicks',
        'quiet','quietly','quiets','quilt','quilts','quirk','quirks','quite','quites','quota','quotas',
        'quote','quoted','quotes','rabbit','rabbits','race','racer','racers','races','rachel','rachels',
        'racial','racials','racing','racings','racism','racisms','radar','radars','radiation','radiations',
        'radical','radicals','radii','radiis','radio','radios','radius','radiuses','rail','railroad',
        'railroads','rails','railway','railways','rain','rainbow','rainbows','rainies','rains','rainy',
        'raise','raised','raises','raising','raisings','rallies','rally','ralph','ralphs','ramps','ranch',
        'ranches','random','randomly','randoms','range','ranger','rangers','ranges','ranging','rangings',
        'rank','ranked','ranking','rankings','ranks','rapid','rapidly','rapids','rare','rares','rate',
        'rated','rates','rather','rathers','rating','ratings','ratio','rational','rationals','ratios',
        'ratioses','raymond','raymonds','razor','razors','reach','reached','reaches','reaching','reachings',
        'react','reaction','reactions','reacts','read','reader','readers','readies','readily','reading',
        'readings','reads','ready','reagan','reagans','real','realities','reality','realize','realized',
        'realizes','really','realm','realms','reals','reams','rear','rears','reason','reasonable',
        'reasonables','reasonably','reasoning','reasonings','reasons','rebel','rebels','rebirth','rebirths',
        'rebuild','rebuilds','recall','recalls','recap','recaps','receipt','receipts','receive','received',
        'receiver','receivers','receives','receiving','receivings','recent','recently','recents','reception',
        'receptions','recipe','recipes','recipient','recipients','recognition','recognitions','recognize',
        'recognized','recognizes','recommend','recommendation','recommendations','recommended','recommends',
        'recon','recons','record','recorded','recorder','recorders','recording','recordings','records',
        'recover','recovered','recoveries','recovering','recoverings','recovers','recovery','recreation',
        'recreational','recreationals','recreations','recruit','recruitment','recruitments','recruits',
        'recur','recurs','recycle','recycles','recycling','recyclings','reduce','reduced','reduces',
        'reducing','reducings','reduction','reductions','refer','reference','referenced','references',
        'referral','referrals','referred','referring','referrings','refers','refine','refined','refines',
        'reflect','reflected','reflection','reflections','reflects','reform','reforms','refresh','refreshes',
        'refrigerator','refrigerators','refuge','refugee','refugees','refuges','refund','refunds','refuse',
        'refused','refuses','regard','regarded','regarding','regardings','regardless','regards','regime',
        'regimes','region','regional','regionals','regions','register','registered','registers',
        'registration','registrations','registries','registry','regular','regularly','regulars','regulation',
        'regulations','regulatories','regulatory','rehabilitation','rehabilitations','reid','reids','reign',
        'reigns','reject','rejected','rejects','relate','related','relates','relating','relatings',
        'relation','relations','relationship','relationships','relative','relatively','relatives','relax',
        'relaxation','relaxations','relaxes','relay','relays','release','released','releases','relevance',
        'relevances','relevant','relevants','reliabilities','reliability','reliable','reliables','relic',
        'relics','relief','reliefs','relies','relieves','religion','religions','religious','religiouses',
        'reload','reloads','rely','remain','remainder','remainders','remained','remaining','remainings',
        'remains','remarkable','remarkables','remarks','remedies','remedy','remember','remembered',
        'remembers','remind','reminder','reminders','reminds','remit','remits','remix','remixes','remote',
        'remotes','removal','removals','remove','removed','removes','removing','removings','renaissance',
        'renaissances','renal','renals','render','rendered','rendering','renderings','renders','renew',
        'renewal','renewals','renewed','renews','rent','rental','rentals','rents','repair','repairs','repay',
        'repays','repeat','repeated','repeats','repel','repels','replace','replaced','replacement',
        'replacements','replaces','replacing','replacings','replica','replicas','replied','replies','reply',
        'report','reported','reporter','reporters','reporting','reportings','reports','repositories',
        'repository','represent','representation','representations','representative','representatives',
        'represented','representing','representings','represents','reproduce','reproduced','reproduces',
        'reproduction','reproductions','republic','republican','republicans','republics','reputation',
        'reputations','request','requested','requesting','requestings','requests','require','required',
        'requirement','requirements','requires','requiring','requirings','rerun','reruns','rescue','rescues',
        'research','researcher','researchers','researches','reservation','reservations','reserve','reserved',
        'reserves','reservoir','reservoirs','reset','resets','residence','residences','resident',
        'residential','residentials','residents','resin','resins','resist','resistance','resistances',
        'resists','resolution','resolutions','resolve','resolved','resolves','resort','resorts','resource',
        'resources','respect','respected','respective','respectively','respectives','respects','respond',
        'responded','respondent','respondents','responding','respondings','responds','response','responses',
        'responsibilities','responsibility','responsible','responsibles','rest','restart','restarts',
        'restaurant','restaurants','restoration','restorations','restore','restored','restores','restrict',
        'restricted','restriction','restrictions','restricts','restructuring','restructurings','rests',
        'result','resulted','resulting','resultings','results','resume','resumes','retail','retailer',
        'retailers','retails','retain','retained','retains','retention','retentions','retire','retired',
        'retirement','retirements','retires','retreat','retreats','retries','retrieve','retrieved',
        'retrieves','retro','retros','retry','return','returned','returning','returnings','returns',
        'reunion','reunions','reuse','reuses','reveal','revealed','revealing','revealings','reveals','revel',
        'revels','revenue','revenues','reverse','review','reviewed','reviewer','reviewers','reviewing',
        'reviewings','reviews','reviewses','revised','revision','revisions','revolution','revolutionaries',
        'revolutionary','revolutions','reward','rewards','rhetoric','rhetorics','rhythm','rhythms','rice',
        'rices','rich','richard','richards','richardson','richardsons','riches','richmond','richmonds',
        'ride','rider','riders','rides','ridge','ridges','riding','ridings','rifle','rifles','right',
        'rights','rigid','rigids','rigor','rigors','ring','rings','riots','ripen','ripens','rise','risen',
        'risens','rises','rising','risings','risk','riskies','risks','risky','rites','ritzies','ritzy',
        'rival','rivals','river','rivers','road','roads','roast','roasts','robert','roberts','robes','robin',
        'robins','robinson','robinsons','robot','robots','robust','robusts','rochester','rochesters','rock',
        'rockies','rocks','rocky','rode','rodes','roger','rogers','rogue','rogues','role','roles','roll',
        'rolled','roller','rollers','rolling','rollings','rolls','roman','romance','romances','romans',
        'romantic','romantics','ronald','ronalds','roof','roofs','room','roomies','rooms','roomy','root',
        'roots','rooves','ropes','rose','roses','roster','rosters','rotor','rotors','rouge','rouges','rough',
        'roughly','roughs','round','rounds','route','router','routers','routes','routine','routinely',
        'routines','routing','routings','rover','rovers','rowdies','rowdy','royal','royals','rubber',
        'rubbers','rugbies','rugby','ruins','rule','ruled','ruler','rulers','rules','ruling','rulings',
        'rumor','rumors','rungs','running','runnings','rural','rurals','rush','rushes','russell','russells',
        'russia','russian','russians','russias','rusties','rusty','ruth','ruths','sacrifice','sacrifices',
        'sadly','safari','safaris','safe','safes','safeties','safety','said','saids','sailing','sailings',
        'saint','saints','sake','sakes','salad','salads','salaries','salary','sale','sales','sally','salmon',
        'salmons','salon','salons','salsa','salsas','salt','salties','salts','salty','salute','salutes',
        'same','sames','sample','samples','sampling','samplings','samuel','samuels','sanctions','sand',
        'sandies','sands','sandy','satellite','satellites','satin','satins','satisfaction','satisfactions',
        'satisfied','satisfies','satisfy','saturday','saturdays','saturn','saturns','sauce','sauces','sauna',
        'saunas','savage','savages','save','saved','saver','savers','saves','saving','savings','savor',
        'savors','savvies','savvy','scald','scalds','scale','scales','scalp','scalps','scaly','scamp',
        'scamps','scan','scanner','scanners','scanning','scannings','scans','scant','scants','scare',
        'scared','scares','scarf','scarfs','scaries','scarves','scary','scenario','scenarios','scenarioses',
        'scene','scenes','scenic','scenics','scent','scents','schedule','scheduled','schedules','scheduling',
        'schedulings','schema','schemas','scheme','schemes','scholar','scholarly','scholars','scholarship',
        'scholarships','schools','science','sciences','scientific','scientifics','scientist','scientists',
        'scone','scones','scoop','scoops','scope','scopes','score','scored','scores','scoring','scorings',
        'scorn','scorns','scotland','scotlands','scott','scottish','scottishes','scotts','scout','scouts',
        'scrap','scraps','scratch','scratches','screen','screening','screenings','screens','screenshot',
        'screenshots','script','scripts','scroll','scrolls','sculpture','sculptures','seams','search',
        'searched','searches','searching','searchings','season','seasonal','seasonals','seasons','seat',
        'seating','seatings','seats','seattle','seattles','second','secondaries','secondary','seconds',
        'secret','secretaries','secretary','secrets','section','sections','sector','sectors','secure',
        'secured','securely','secures','securities','security','seed','seeds','seek','seeking','seekings',
        'seeks','seem','seems','seen','seens','segment','segments','seize','seizes','select','selected',
        'selecting','selectings','selection','selections','selective','selectives','selects','self','selfs',
        'sell','sellers','selling','sellings','sells','selves','semester','semesters','semi','semis',
        'senate','senates','senator','senators','send','sends','senior','seniors','sense','senses',
        'sensitive','sensitives','sensitivities','sensitivity','sensor','sensors','sent','sentence',
        'sentences','sents','separate','separated','separately','separates','separation','separations',
        'sept','september','septembers','septs','sequence','sequences','serbia','serbias','serial','serials',
        'series','serious','seriouses','seriously','sermon','sermons','serum','serums','servant','servants',
        'serve','served','server','servers','serves','service','services','serving','servings','session',
        'sessions','setting','settings','settle','settled','settlement','settlements','settles','setup',
        'setups','seven','sevens','seventeen','seventeens','seventh','sevenths','sever','several','severals',
        'severe','severes','severs','sexual','sexuals','shade','shades','shadies','shadow','shadows','shady',
        'shaft','shafts','shake','shakes','shakespeare','shakespeares','shakies','shaky','shall','shalls',
        'shame','shames','shape','shaped','shapes','shaping','shapings','shard','shards','share','shared',
        'shareholder','shareholders','shares','shareware','sharewares','sharing','sharings','shark','sharks',
        'sharon','sharons','sharp','sharps','shawl','shawls','sheaf','sheafs','shear','shears','sheaves',
        'sheen','sheens','sheep','sheeps','sheer','sheers','sheet','sheets','shelf','shelfs','shell',
        'shells','shelter','shelters','shelves','shepherd','shepherds','sheriff','sheriffs','shift',
        'shifting','shiftings','shifts','shine','shines','shinies','shining','shinings','shiny','ship',
        'shipment','shipments','shipped','shipping','shippings','ships','shire','shires','shirt','shirts',
        'shock','shocks','shoe','shoes','shone','shones','shook','shooks','shoot','shooting','shootings',
        'shoots','shop','shopper','shoppers','shopping','shoppings','shops','shore','shores','short',
        'shorter','shorters','shortest','shortests','shortly','shorts','shot','shots','shoulder','shoulders',
        'shout','shouts','shove','shovel','shovels','shoves','show','showed','shower','showers','showies',
        'showing','showings','shown','showns','shows','showses','showy','shred','shrub','shrubs','shrug',
        'shrugs','shuck','shucks','shunt','shunts','shut','shuts','shuttle','shuttles','siblings','sick',
        'sicks','side','sided','sides','siege','sieges','sight','sights','sigma','sigmas','sign','signal',
        'signals','signature','signatures','signed','significance','significances','significant',
        'significantly','significants','signing','signings','signs','silence','silences','silent','silents',
        'silicon','silicons','silk','silkies','silks','silky','sillies','silly','silver','silvers','similar',
        'similarly','similars','simon','simons','simple','simpler','simplers','simples','simplest',
        'simplests','simplified','simply','simpson','simpsons','simulation','simulations','simultaneously',
        'since','sinces','sing','singapore','singapores','singer','singers','singing','singings','single',
        'singles','sings','sink','sinks','siren','sirens','sissies','sissy','sister','sisters','site',
        'sites','sitting','sittings','situated','situation','situations','sixth','sixths','sixties','sixty',
        'size','sized','sizes','sizing','sizings','skate','skates','skating','skatings','sketch','sketches',
        'skier','skiers','skiing','skiings','skill','skilled','skills','skimp','skimps','skin','skins',
        'skirt','skirts','skull','skulls','skunk','skunks','slack','slacks','slain','slains','slang',
        'slangs','slant','slants','slash','slashes','slate','slates','slave','slaveries','slavery','slaves',
        'sleek','sleeks','sleep','sleeping','sleepings','sleeps','sleet','sleets','slept','slepts','slice',
        'slices','slick','slicks','slide','slides','slideshow','slideshows','slight','slightly','slights',
        'slim','slime','slimes','slimies','slims','slimy','sling','slings','slink','slinks','slip','slips',
        'slope','slopes','slosh','sloshes','sloth','sloths','slots','slovakia','slovakias','slovenia',
        'slovenias','slow','slower','slowers','slowly','slows','slump','slumps','slums','slung','slungs',
        'slunk','slunks','slurp','slurps','slush','slushes','small','smaller','smallers','smallest',
        'smallests','smalls','smart','smarts','smash','smashes','smear','smears','smell','smells','smile',
        'smiles','smirk','smirks','smith','smiths','smock','smocks','smoke','smokes','smokies','smoking',
        'smokings','smoky','smooth','smooths','snack','snacks','snafu','snafus','snail','snails','snake',
        'snakes','snakies','snaky','snap','snaps','snapshot','snapshots','snare','snares','snarl','snarls',
        'sneak','sneaks','sneer','sneers','snide','snides','sniff','sniffs','snipe','snipes','snore',
        'snores','snort','snorts','snout','snouts','snow','snowies','snows','snowy','snuck','snucks','snuff',
        'snuffs','soapies','soapy','sober','sobers','soccer','soccers','social','socially','socials',
        'societies','society','sociologies','sociology','socket','sockets','socks','soft','softball',
        'softballs','softs','software','softwares','soggies','soggy','soil','soils','solar','solars','sold',
        'soldier','soldiers','solds','sole','solely','solemn','solemns','soles','solid','solidarities',
        'solidarity','solids','solomon','solomons','solution','solutions','solve','solved','solves',
        'solving','solvings','somalia','somalias','some','somebodies','somebody','somehow','somehows',
        'someone','someones','somerset','somersets','somes','something','somethings','sometimes','somewhat',
        'somewhats','somewhere','somewheres','song','songs','sonic','sonics','sonnies','sonny','soon',
        'sooner','sooners','soons','sophisticated','sorries','sorry','sort','sorted','sorts','sought',
        'soughts','soul','souls','sound','sounds','soundtrack','soundtracks','soup','soups','source',
        'sources','south','southeast','southeasts','southern','southerns','souths','southwest','southwests',
        'soviet','soviets','space','spaces','spade','spades','spain','spains','spam','spams','span',
        'spanish','spanishes','spank','spanks','spans','spare','spares','spark','sparks','spasm','spasms',
        'spatial','spatials','spawn','spawns','speak','speaker','speakers','speaking','speakings','speaks',
        'spear','spears','special','specialist','specialists','specialized','specials','species','specific',
        'specifically','specification','specifications','specifics','specified','specifies','specify',
        'speck','specks','specs','specses','spectrum','spectrums','speech','speeches','speed','spell',
        'spelling','spellings','spells','spend','spending','spendings','spends','spent','spents','sphere',
        'spheres','spice','spices','spicies','spicy','spider','spiders','spied','spike','spikes','spikies',
        'spiky','spill','spills','spin','spine','spines','spinies','spins','spiny','spirit','spirits',
        'spiritual','spirituals','spite','spites','splat','splats','split','splits','spoil','spoils','spoke',
        'spoken','spokens','spokes','spokesman','spokesmans','sponsor','sponsored','sponsors','sponsorship',
        'sponsorships','spoof','spoofs','spook','spooks','spool','spools','spoon','spoons','spooves','spore',
        'spores','sport','sporting','sportings','sports','spot','spotlight','spotlights','spots','spouse',
        'spouses','spout','spouts','spray','sprays','spread','spreading','spreadings','spreads','spree',
        'sprees','sprig','sprigs','spring','springer','springers','springs','spunk','spunks','squad',
        'squads','square','squares','squat','squats','squid','squids','stable','stables','stack','stacks',
        'stadium','stadiums','staff','staffing','staffings','staffs','stage','stages','stain','stainless',
        'stains','stair','stairs','stake','stakes','stale','stales','stalk','stalks','stall','stalls',
        'stamp','stamps','stand','standard','standards','standing','standings','stands','stanford',
        'stanfords','stank','stanks','stanley','stanleys','star','stare','stares','stark','starks',
        'starring','starrings','stars','start','started','starter','starters','starting','startings',
        'starts','startup','startups','stash','stashes','state','stated','statement','statements','states',
        'static','statics','station','stations','statistical','statisticals','statistics','statisticses',
        'stats','status','statuses','statute','statutes','stay','stayed','staying','stayings','stays',
        'stayses','steadies','steady','steak','steaks','steal','steals','steam','steams','steel','steels',
        'steep','steeps','steer','steering','steerings','steers','stellar','stellars','stem','stems','step',
        'stephen','stephens','stepped','steps','stereo','stereos','sterling','sterlings','stern','sterns',
        'steve','steven','stevens','steves','stick','stickers','stickies','sticks','sticky','stiff','stiffs',
        'still','stills','sting','stings','stink','stinks','stint','stints','stock','stockholm','stockholms',
        'stocks','stoic','stoics','stoke','stokes','stole','stoles','stomach','stomaches','stomp','stomps',
        'stone','stones','stonies','stony','stood','stoods','stool','stools','stoop','stoops','stop',
        'stopped','stopping','stoppings','stops','storage','storages','store','stored','stores','stories',
        'storing','storings','stork','storks','storm','storms','story','stout','stouts','stove','stoves',
        'straight','straights','strain','strains','strand','strands','strange','stranger','strangers',
        'stranges','strap','straps','strategic','strategics','strategies','strategy','straw','straws',
        'stray','strays','stream','streaming','streamings','streams','street','streets','strength',
        'strengthen','strengthens','strengths','stress','stresses','stretch','stretches','strict','strictly',
        'stricts','strike','strikes','striking','strikings','string','strings','strip','strips','stroke',
        'strokes','strong','stronger','strongers','strongly','strongs','struck','strucks','structural',
        'structurals','structure','structured','structures','struggle','struggles','struggling',
        'strugglings','strut','struts','stuart','stuarts','stuck','stucks','student','students','studied',
        'studies','studio','studios','studioses','study','studying','studyings','stuff','stuffed','stuffs',
        'stump','stumps','stung','stungs','stunk','stunks','stunning','stunnings','stunt','stunts','stupid',
        'stupids','style','styled','styles','styling','stylings','stylish','stylishes','stylus','styluses',
        'suave','suaves','subject','subjects','submission','submissions','submit','submits','submitted',
        'subscribe','subscriber','subscribers','subscribes','subscription','subscriptions','subsequent',
        'subsequently','subsequents','subset','subsets','substance','substances','substantial',
        'substantially','substantials','subtle','subtles','suburban','suburbans','succeed','success',
        'successful','successfully','successfuls','such','suches','sucks','sudden','suddenly','suddens',
        'suffer','suffered','suffering','sufferings','suffers','sufficient','sufficients','sugar','sugars',
        'suggest','suggested','suggesting','suggestings','suggestion','suggestions','suggests','suicide',
        'suicides','suit','suitable','suitables','suite','suited','suites','suits','sulkies','sulky',
        'sullivan','sullivans','summaries','summary','summer','summers','summit','summits','sunday',
        'sundays','sunnies','sunny','sunrise','sunrises','sunset','sunsets','super','superb','superbs',
        'superintendent','superintendents','superior','superiors','supers','supervision','supervisions',
        'supervisor','supervisors','supplement','supplemental','supplementals','supplements','supplied',
        'supplier','suppliers','supplies','supply','support','supported','supporter','supporters',
        'supporting','supportings','supports','suppose','supposed','supposes','supreme','supremes','sure',
        'sures','surface','surfaces','surge','surgeon','surgeons','surgeries','surgery','surges','surgical',
        'surgicals','surly','surplus','surpluses','surprise','surprised','surprises','surprising',
        'surprisingly','surprisings','surrender','surrenders','surround','surrounded','surrounding',
        'surroundings','surrounds','survey','surveys','surveyses','survival','survivals','survive',
        'survived','survives','survivor','survivors','susan','susans','suspect','suspected','suspects',
        'suspend','suspended','suspends','suspension','suspensions','sustainabilities','sustainability',
        'sustainable','sustainables','sustained','swamp','swamps','swarm','swarms','swear','swears','sweat',
        'sweats','sweden','swedens','swedish','swedishes','sweep','sweeps','sweet','sweets','swell','swells',
        'swept','swepts','swift','swifts','swimming','swimmings','swims','swine','swines','swing','swings',
        'swipe','swipes','swirl','swirls','swiss','switch','switched','switches','switching','switchings',
        'switzerland','switzerlands','sword','swords','swore','swores','sworn','sworns','swung','swungs',
        'symbol','symbols','sympathies','sympathy','symphonies','symphony','symptoms','syndrome','syndromes',
        'syntax','syntaxes','synthetic','synthetics','syria','syrias','system','systematic','systematics',
        'systems','tabbies','tabby','table','tables','tablet','tablets','taboo','taboos','tacit','tacits',
        'tackies','tackle','tackles','tacky','tactics','tacticses','taffies','taffy','tagged','taint',
        'taints','taiwan','taiwans','take','taken','takens','taker','takers','takes','taking','takings',
        'tale','talent','talented','talents','tales','taliban','talibans','talk','talking','talkings',
        'talks','tall','talls','tally','talon','talons','tamed','tamil','tamils','tampa','tampas','tangies',
        'tangy','tank','tanks','tanzania','tanzanias','tape','tapes','tardies','tardy','target','targeted',
        'targeting','targetings','targets','tariff','tariffs','tarries','tarry','task','tasks','taste',
        'tastes','tasties','tasty','tatties','tatty','taught','taughts','taunt','taunts','taxed','taxes',
        'taxpayer','taxpayers','taylor','taylors','teach','teacher','teachers','teaches','teaching',
        'teachings','team','teams','tear','tearies','tears','teary','tease','teases','tech','teches',
        'technical','technically','technicals','technician','technicians','technique','techniques',
        'technological','technologicals','technologies','technology','teddies','teddy','teems','teen',
        'teenage','teenagers','teenages','teens','teeth','teeths','telephone','telephones','telescope',
        'telescopes','television','televisions','tell','telling','tellings','tells','temperature',
        'temperatures','template','templates','temple','temples','tempo','temporal','temporals',
        'temporaries','temporarily','temporary','tempos','tend','tender','tenders','tends','tennessee',
        'tennessees','tennis','tennises','tense','tension','tensions','tent','tenth','tenths','tents',
        'tepid','tepids','term','terminal','terminals','terminate','terminates','termination','terminations',
        'terminologies','terminology','terms','terra','terrain','terrains','terras','terrible','terribles',
        'terries','territorial','territorials','territories','territory','terror','terrorism','terrorisms',
        'terrorist','terrorists','terrors','terry','test','tested','testimonies','testimony','testing',
        'testings','tests','texas','texases','text','textbook','textbooks','textile','textiles','texts',
        'texture','textures','thailand','thailands','than','thank','thankful','thankfuls','thanks',
        'thanksgiving','thanksgivings','thans','that','thats','theater','theaters','theatre','theatres',
        'theft','thefts','their','theirs','them','theme','themed','themes','thems','themselves','then',
        'thens','theologies','theology','theorem','theorems','theoretical','theoreticals','theories',
        'theory','therapeutic','therapeutics','therapies','therapist','therapists','therapy','there',
        'therebies','thereby','therefore','therefores','thereof','thereofs','thereoves','theres','thermal',
        'thermals','these','thesis','thesises','they','theys','thick','thickness','thicks','thief','thiefs',
        'thieves','thigh','thighs','thin','thing','things','think','thinking','thinkings','thinks','thins',
        'third','thirds','thirties','thirty','this','thises','thomas','thomases','thompson','thompsons',
        'thorn','thorns','thorough','thoroughly','thoroughs','those','thoses','though','thoughs','thought',
        'thoughts','thousand','thousands','thread','threads','threat','threatened','threatening',
        'threatenings','threats','three','threes','threshold','thresholds','threw','threws','thrill',
        'thriller','thrillers','thrills','thrive','thrives','throat','throats','throb','throbs','through',
        'throughout','throughouts','throughs','throw','throwing','throwings','thrown','throwns','throws',
        'throwses','thrust','thrusts','thumb','thumbnail','thumbnails','thumbs','thump','thumps','thunder',
        'thunders','thursday','thursdays','thus','thuses','tiara','tiaras','ticket','tickets','tidal',
        'tidals','tide','tides','tiger','tigers','tight','tightly','tights','tiled','tiles','till','tills',
        'timber','timbers','time','timed','timeline','timelines','timely','timer','timers','times','timid',
        'timids','timing','timings','timothies','timothy','tinies','tinnies','tinny','tiny','tips','tipsies',
        'tipsy','tired','tissue','tissues','titan','titanium','titaniums','titans','title','titled','titles',
        'toast','toasts','tobacco','tobaccos','today','todays','todd','todds','toes','together','togethers',
        'toilet','toilets','token','tokens','tokyo','tokyos','told','tolds','tolerance','tolerances','toll',
        'tolls','tomorrow','tomorrows','tonal','tonals','tone','toned','toner','toners','tones','tongue',
        'tongues','tonic','tonics','tonies','tonight','tonights','tonnes','tony','took','tooks','tool',
        'toolbar','toolbars','toolbox','toolboxes','toolkit','toolkits','tools','tooth','tooths','topaz',
        'topazs','topic','topics','topicses','tops','torch','torches','torn','torns','toronto','torontos',
        'torture','tortures','toshiba','toshibas','toss','total','totally','totals','touch','touched',
        'touches','touching','touchings','tough','toughs','tour','touring','tourings','tourism','tourisms',
        'tourist','tourists','tournament','tournaments','tours','toward','towards','towel','towels','tower',
        'towers','town','towns','township','townships','toxic','toxics','toys','toyses','trace','traces',
        'tracies','track','tracked','tracker','trackers','tracking','trackings','tracks','tract','tracts',
        'tracy','trade','trademark','trademarks','trader','traders','trades','trading','tradings',
        'tradition','traditional','traditionally','traditionals','traditions','traffic','traffics',
        'tragedies','tragedy','trail','trailer','trailers','trails','train','trained','trainer','trainers',
        'training','trainings','trains','trait','traits','tramp','tramps','trans','transaction',
        'transactions','transcription','transcriptions','transfer','transferred','transfers','transform',
        'transformation','transformations','transformed','transforms','transit','transition','transitions',
        'transits','translate','translated','translates','translation','translations','translator',
        'translators','transmission','transmissions','transmit','transmits','transmitted','transparencies',
        'transparency','transparent','transparents','transport','transportation','transportations',
        'transports','trap','traps','trash','trashes','trauma','traumas','travel','traveled','traveler',
        'travelers','traveling','travelings','travels','treasure','treasurer','treasurers','treasures',
        'treasuries','treasury','treat','treated','treaties','treating','treatings','treatment','treatments',
        'treats','treaty','tree','trees','trek','treks','tremendous','tremendouses','trend','trends','triad',
        'triads','trial','trials','triangle','triangles','tribal','tribals','tribe','tribes','tribunal',
        'tribunals','tribune','tribunes','tribute','tributes','trick','tricks','tried','tries','trigger',
        'triggered','triggers','trill','trillion','trillions','trills','trim','trims','trinities','trinity',
        'trio','trios','trip','triple','triples','trips','trite','trites','triumph','triumphs','trivial',
        'trivials','troll','trolls','troop','troops','tropical','tropicals','trouble','troubled','troubles',
        'trout','trouts','truce','truces','truck','trucks','true','trues','truly','trump','trumps','trunk',
        'trunks','truss','trust','trusted','trustee','trustees','trusts','truth','truths','trying','tryings',
        'tsunami','tsunamis','tubbies','tubby','tube','tubes','tucker','tuckers','tuesday','tuesdays',
        'tuition','tuitions','tulip','tulips','tulsa','tulsas','tumor','tumors','tune','tuned','tuner',
        'tuners','tunes','tunic','tunics','tunisia','tunisias','tunnel','tunnels','turbo','turbos','turkey',
        'turkeys','turkish','turkishes','turn','turned','turner','turners','turning','turnings','turns',
        'turtle','turtles','tutor','tutorial','tutorials','tutors','twang','twangs','tweak','tweaks','tweed',
        'tweet','tweets','twelve','twelves','twenties','twenty','twice','twices','twigs','twin','twine',
        'twines','twins','twirl','twirls','twist','twisted','twists','tying','tyings','tyler','tylers',
        'type','types','typical','typically','typicals','typing','typings','udder','udders','uganda',
        'ugandas','ugly','ukraine','ukraines','ulcer','ulcers','ultimate','ultimately','ultimates','ultra',
        'ultras','unable','unables','uncertainties','uncertainty','uncle','uncles','uncut','uncuts','under',
        'undergo','undergos','undergraduate','undergraduates','underground','undergrounds','underlying',
        'underlyings','unders','understand','understanding','understandings','understands','understood',
        'understoods','undertake','undertaken','undertakens','undertakes','underwear','underwears','undue',
        'undues','unemployment','unemployments','unexpected','unfed','unfit','unfits','unfortunately',
        'unified','unifies','uniform','uniforms','unify','union','unions','unique','uniques','unit','unite',
        'united','unites','unities','units','unity','universal','universals','universe','universities',
        'university','unix','unixes','unknown','unknowns','unless','unlike','unlikely','unlikes','unlimited',
        'unlit','unlits','unlock','unlocks','unmet','unmets','unnecessaries','unnecessary','unset','unsets',
        'unsigned','until','untils','unusual','unusuals','unwed','update','updated','updates','updating',
        'updatings','upgrade','upgraded','upgrades','upload','uploaded','uploads','upon','upons','upper',
        'uppers','upset','upsets','upward','upwards','urban','urbans','urge','urged','urgent','urgents',
        'urges','urine','urines','usage','usages','used','useds','user','username','usernames','users',
        'uses','usher','ushers','using','usings','usual','usually','usuals','utilities','utility',
        'utilization','utilizations','utilize','utilizes','utter','utters','vacation','vacations','vaccine',
        'vaccines','vacuum','vacuums','vague','vagues','valid','validate','validates','validation',
        'validations','validities','validity','valids','valley','valleys','valor','valors','valuable',
        'valuables','valuation','valuations','value','valued','values','valve','valves','vampire','vampires',
        'vancouver','vancouvers','vanilla','vanillas','vapor','vapors','variable','variables','variance',
        'variances','variant','variants','variation','variations','varied','varies','varieties','variety',
        'various','variouses','vary','varying','varyings','vast','vasts','vault','vaults','vaunt','vaunts',
        'vector','vectors','vegas','vegases','vegetable','vegetables','vegetarian','vegetarians','vehicle',
        'vehicles','veins','veldt','veldts','velocities','velocity','vendor','vendors','venezuela',
        'venezuelas','venom','venoms','venture','ventures','venue','venues','verbal','verbals','verbs',
        'verbses','verdict','verdicts','verge','verges','veries','verification','verifications','verified',
        'verifies','verify','vermont','vermonts','vernon','vernons','versatile','versatiles','verse',
        'verses','version','versions','versus','versuses','vertical','verticals','very','vessel','vessels',
        'veteran','veterans','veterinaries','veterinary','viable','viables','vibrant','vibrants','vibration',
        'vibrations','vicar','vicars','vice','vices','victor','victoria','victorian','victorians',
        'victorias','victories','victors','victory','video','videos','videoses','vienna','viennas','vietnam',
        'vietnamese','vietnams','view','viewed','viewer','viewers','viewing','viewings','viewpoint',
        'viewpoints','views','viewses','vigor','vigors','villa','village','villages','villas','vincent',
        'vincents','vintage','vintages','vinyl','vinyls','violated','violation','violations','violence',
        'violences','violent','violents','viper','vipers','viral','virals','virgin','virginia','virginias',
        'virgins','virtual','virtually','virtuals','virtue','virtues','virus','viruses','visa','visas',
        'visible','visibles','vision','visions','visit','visited','visiting','visitings','visitor',
        'visitors','visits','visor','visors','vista','vistas','visual','visuals','vital','vitals','vitamin',
        'vitamins','vivid','vivids','vocal','vocals','vodka','vodkas','vogue','vogues','voice','voices',
        'void','voids','voila','voilas','volcanic','volcanics','volkswagen','volkswagens','volleyball',
        'volleyballs','voltage','voltages','volume','volumes','voluntaries','voluntary','volunteer',
        'volunteers','vomit','vomits','vote','voted','voter','voters','votes','voting','votings','vouch',
        'vouches','vowel','vowels','vulnerable','vulnerables','vying','vyings','wackies','wacky','waded',
        'wader','waders','wades','wafer','wafers','wage','waged','wager','wagers','wages','wagon','wagons',
        'waist','waists','wait','waiting','waitings','waits','wake','waken','wakens','wakes','wales','walk',
        'walked','walker','walkers','walking','walkings','walks','wall','wallace','wallaces','wallet',
        'wallets','walls','walter','walters','waltz','waltzs','wands','wanna','wannas','want','wanted',
        'wanting','wantings','wants','ward','wards','warehouse','warehouses','warm','warming','warmings',
        'warms','warned','warner','warners','warning','warnings','warns','warrant','warranties','warrants',
        'warranty','warren','warrens','warrior','warriors','wars','warties','warts','warty','wash','washes',
        'washington','washingtons','waste','wastes','watch','watched','watches','watching','watchings',
        'water','waters','watson','watsons','watt','watts','wave','waved','waver','wavers','waves','wavey',
        'waveys','waxed','waxen','waxens','ways','wayses','weak','weakness','weaks','wealth','wealthies',
        'wealths','wealthy','weapon','weapons','wear','wearies','wearing','wearings','wears','weary',
        'weather','weathers','weave','weaves','weaving','weavings','webbies','webby','weber','webers',
        'website','websites','wedding','weddings','wedge','wedges','wednesday','wednesdays','weedies',
        'weeds','weedy','week','weekend','weekends','weekly','weeks','weigh','weighs','weight','weighted',
        'weights','weird','weirds','welcome','welcomed','welcomes','welfare','welfares','well','wellington',
        'wellingtons','wellness','wells','welsh','welshes','wench','wenches','went','wents','were','weres',
        'werner','werners','west','western','westerns','westminster','westminsters','wests','whack','whacks',
        'whale','whales','wharf','wharfs','wharves','what','whats','wheat','wheats','wheel','wheels','when',
        'whenever','whenevers','whens','where','whereas','whereases','wheres','wherever','wherevers',
        'whether','whethers','which','whiches','while','whiles','whilst','whilsts','whims','whine','whines',
        'whinies','whiny','whips','whirl','whirls','whisk','whisks','whisper','whispers','white','whites',
        'whole','wholes','wholesale','wholesales','whom','whoms','whose','whoses','wicked','wide','widely',
        'widen','widens','wider','widers','wides','widespread','widespreads','widow','widows','width',
        'widths','wield','wields','wife','wifes','wiki','wikipedia','wikipedias','wikis','wild','wilderness',
        'wildlife','wildlifes','wildlives','wilds','will','william','williams','willing','willingness',
        'willings','wills','wilson','wilsons','wimpies','wimpy','wince','winces','winch','winches','wind',
        'windies','window','windows','windowses','winds','windsor','windsors','windy','wine','wines','wing',
        'wings','winner','winners','winning','winnings','winter','winters','wiped','wiper','wipers','wipes',
        'wire','wired','wireless','wires','wiring','wirings','wisdom','wisdoms','wise','wiser','wisers',
        'wises','wish','wishes','witch','witches','with','withdrawal','withdrawals','within','withins',
        'without','withouts','withs','witness','witties','witty','wives','wizard','wizards','woken','wokens',
        'wolf','wolfs','wolves','woman','womans','women','womens','wonder','wonderful','wonderfuls',
        'wondering','wonderings','wonders','wong','wongs','wood','wooden','woodens','woodies','woods',
        'woody','wool','wools','woozies','woozy','worcester','worcesters','word','wordies','words','wordy',
        'wore','wores','work','worked','worker','workers','workflow','workflows','workforce','workforces',
        'working','workings','workout','workouts','workplace','workplaces','works','workshop','workshops',
        'workspace','workspaces','world','worlds','worldwide','worldwides','worm','wormies','worms','wormy',
        'worn','worns','worried','worries','worry','worse','worship','worships','worst','worsts','worth',
        'worthies','worths','worthy','would','woulds','wound','wounds','woven','wovens','wrack','wracks',
        'wrap','wrapped','wrapper','wrappers','wrapping','wrappings','wraps','wrath','wraths','wreak',
        'wreaks','wreck','wrecks','wrest','wrestling','wrestlings','wrests','wright','wrights','wring',
        'wrings','wrist','wrists','write','writer','writers','writes','writing','writings','written',
        'writtens','wrong','wrongs','wrote','wrotes','wryly','wyoming','wyomings','xbox','xboxes','xerox',
        'xeroxes','xhtml','xhtmls','yacht','yachts','yahoo','yahoos','yale','yales','yang','yangs','yard',
        'yards','yarn','yarns','yeah','yeahs','year','yearly','yearn','yearns','years','yeast','yeasts',
        'yellow','yellows','yemen','yemens','yesterday','yesterdays','yield','yields','yoga','yogas','york',
        'yorks','young','younger','youngers','youngest','youngests','youngs','your','yours','yourself',
        'yourselfs','yourselves','youth','youths','yugoslavia','yugoslavias','zappies','zappy','zealand',
        'zealands','zebra','zebras','zero','zeros','zesties','zesty','zilch','zilches','zinc','zincs',
        'zingies','zingy','zippies','zippy','zombie','zombies','zonal','zonals','zone','zoned','zones',
        'zoning','zonings','zoom','zooms'
    ];

    // Load dictionary from external file
    async function loadDictionary() {
        if (dictionaryLoaded) return;

        try {
            console.log('Fetching Ghost dictionary...');
            const response = await fetch('./data/ghost-words.txt?v=' + (window.APP_VERSION || '1'));
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const text = await response.text();
            const words = text.split('\n').filter(w => w.trim().length >= 4);
            WORDS = new Set(words.map(w => w.trim().toLowerCase()));
            dictionaryLoaded = true;
            console.log('Ghost dictionary loaded:', WORDS.size, 'words');
        } catch (error) {
            console.error('Failed to load dictionary, using fallback:', error);
            WORDS = new Set(FALLBACK_WORDS);
            dictionaryLoaded = true;
        }
    }

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
                        <button onclick="exitGhost()" style="background: rgba(75, 85, 99, 0.9); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; touch-action: manipulation;">← Back</button>
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

        const isComputerTurn = state.vsComputer && state.currentPlayer === 2 && !state.gameOver && !state.challengeMode;
        const player1Label = 'You';
        const player2Label = state.vsComputer ? 'Computer' : 'Player 2';
        const modeLabel = state.vsComputer ? '🤖 vs Computer' : '👥 2 Players';

        container.innerHTML = `
            <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <button onclick="exitGhost()" style="background: rgba(75, 85, 99, 0.9); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; touch-action: manipulation;">← Back</button>
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
                        ${state.lenientMode ? 'Lenient' : 'Strict'}
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
    async function launchGhost() {
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

        // Show loading state while dictionary loads
        if (!dictionaryLoaded) {
            const content = document.getElementById('ghostContent');
            if (content) {
                content.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #cdd6f4;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                        <div style="font-size: 1.2rem;">Loading dictionary...</div>
                        <div style="font-size: 0.9rem; color: #6c7086; margin-top: 0.5rem;">Scrabble dictionary</div>
                    </div>
                `;
            }
            await loadDictionary();
        }

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

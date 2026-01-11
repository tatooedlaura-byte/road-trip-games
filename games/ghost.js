// Ghost Word Game
(function() {
    'use strict';

    // Word list for validation (4+ letter words)
    const WORDS = new Set([
        'abandon','abandons','abilities','ability','able','ables','about','abouts','above','aboves',
        'absence','absences','abuse','abuses','academies','academy','account','accounts','achieve',
        'achieves','acid','acids','acquire','acquires','actor','actors','acute','acutes','address',
        'addresses','admit','admits','adopt','adopts','adult','adults','advance','advances','advice',
        'advices','affairs','affairses','after','afters','again','agains','against','againsts','aged',
        'ageds','agent','agents','agree','agrees','ahead','aheads','airline','airlines','airport','airports',
        'alarm','alarms','album','albums','alcohol','alcohols','alert','alerts','alien','aliens','align',
        'aligns','alike','alikes','alive','alives','alley','alleys','allow','allows','alloy','alloys',
        'alone','alones','along','alongs','alreadies','already','also','alsos','alter','alters','although',
        'althoughs','amazing','amazings','america','americas','among','amongs','ancient','ancients','anger',
        'angers','angle','angles','angries','angry','another','anothers','anxieties','anxiety','anybodies',
        'anybody','apart','aparts','apple','apples','applied','applieds','applies','apply','approaches',
        'area','areas','arena','arenas','argue','argues','arise','arises','armies','armor','armors','army',
        'arrange','arranges','array','arrays','arrival','arrivals','arrow','arrows','article','articles',
        'assault','assaults','asset','assets','atlas','atlases','attempt','attempts','attract','attracts',
        'average','averages','avoid','avoids','award','awards','aware','awares','away','aways','awesome',
        'awesomes','awful','awfuls','babies','baby','back','backs','bacon','bacons','badge','badges',
        'badlies','badly','baker','bakers','balance','balances','ball','balls','band','bands','bank',
        'banking','bankings','banks','barrier','barriers','base','bases','basis','basises','batch','batches',
        'bath','baths','batteries','battery','beach','beaches','bear','beard','beards','bearing','bearings',
        'bears','beast','beasts','beat','beating','beatings','beats','because','becauses','bedroom',
        'bedrooms','been','beens','beer','beers','began','begans','begin','begins','begun','beguns','being',
        'beings','believe','believes','bell','bellies','bells','belly','below','belows','belt','belts',
        'bench','benches','bend','bends','beneath','beneaths','benefit','benefits','berries','berry',
        'besides','best','bests','between','betweens','bill','billion','billions','bills','bird','birds',
        'birth','births','bite','bites','black','blacks','blade','blades','blame','blames','blank','blanket',
        'blankets','blanks','blast','blasts','blaze','blazes','bleed','bleeds','blend','blends','bless',
        'blesses','blind','blinds','blink','blinks','bliss','block','blocked','blockeds','blocks','blood',
        'bloods','bloom','blooms','blow','blown','blowns','blows','blue','blues','blunt','blunts','board',
        'boards','boast','boasts','boat','boats','bodies','body','bomb','bombs','bond','bonds','bone',
        'bones','bonus','bonuses','book','booking','bookings','books','boom','booms','booth','booths',
        'booze','boozes','bored','boreds','born','borns','borough','boroughs','boss','bosses','both',
        'bother','bothers','boths','bottom','bottoms','bought','boughts','bound','boundaries','boundary',
        'bounds','bowl','bowls','boxer','boxers','boxes','bracket','brackets','brain','brains','brake',
        'brakes','branch','branches','brand','brands','brass','brasses','brave','braves','bread','breads',
        'break','breaks','breath','breathe','breathes','breaths','breed','breeds','brick','bricks','bride',
        'brides','bridge','bridges','brief','brieflies','briefly','briefs','brieves','bright','brights',
        'brilliant','brilliants','bring','brings','bringses','britain','britains','british','britishes',
        'broad','broader','broaders','broads','broke','broken','brokens','brokes','brook','brooks','broom',
        'brooms','brother','brothers','brought','broughts','brown','browns','browser','browsers','brush',
        'brushes','buddies','buddy','budget','budgets','build','builder','builders','building','buildings',
        'builds','built','builts','bulk','bulks','bulletin','bulletins','bunch','bunches','burn','burning',
        'burnings','burns','burst','bursts','buses','bush','bushes','busies','busy','buyer','buyers','cabin',
        'cabinet','cabinets','cabins','cable','cables','cache','caches','call','calling','callings','calls',
        'calm','calms','came','camel','camels','cames','camp','campaign','campaigns','camps','campuses',
        'canal','canals','candies','candy','canon','canons','capable','capables','capital','capitals',
        'captain','captains','capture','captures','card','cards','care','careful','carefuls','cares','cargo',
        'cargos','carol','carols','carrier','carriers','carries','carry','carrying','carryings','carve',
        'carves','case','cases','cash','cashes','cast','casts','catalog','catalogs','catch','catches',
        'categories','category','cater','caters','cause','causes','causing','causings','cave','caves',
        'cease','ceases','ceiling','ceilings','cell','cells','central','centrals','centre','centres',
        'centuries','century','certain','certains','chain','chains','chair','chairs','chalk','chalks',
        'chamber','chambers','champ','champion','champions','champs','channel','channels','chant','chants',
        'chaos','chaoses','chapter','chapters','charities','charity','charlie','charlies','charm','charms',
        'chart','charter','charters','charts','chase','chases','chat','chats','cheap','cheaper','cheapers',
        'cheaps','cheat','cheats','check','checked','checkeds','checks','cheek','cheeks','cheer','cheers',
        'chess','chest','chests','chick','chicken','chickens','chicks','chief','chiefs','chieves','child',
        'children','childrens','childs','chill','chills','china','chinas','chinese','chip','chips','choices',
        'choir','choirs','chord','chords','chronic','chronics','chunk','chunks','cinch','cinches','circa',
        'circas','circuit','circuits','cities','citizen','citizens','city','civic','civics','civil','civils',
        'claim','claimed','claimeds','claims','clamp','clamps','clash','clashes','clasp','clasps','class',
        'classes','classic','classics','clean','cleaned','cleaneds','cleaner','cleaners','cleans','clear',
        'clearlies','clearly','clears','clerk','clerks','click','clicked','clickeds','clicks','cliff',
        'cliffs','climate','climates','climb','climbs','cling','clings','clips','clipses','cloak','cloaks',
        'clock','clocks','clone','clones','close','closelies','closely','closes','closest','closests',
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
        'confirms','conflict','conflicts','confused','confuseds','congress','connect','connects','consent',
        'consents','consider','considers','consist','consists','constant','constants','consumer','consumers',
        'contact','contacts','contain','contains','content','contents','contest','contests','context',
        'contexts','continue','continues','contract','contracts','contrast','contrasts','contribute',
        'contributes','control','controls','convert','converts','cook','cooking','cookings','cooks','cool',
        'cooling','coolings','cools','cope','copes','copies','copy','copying','copyings','coral','corals',
        'core','cores','correct','corrects','cost','costs','couch','couches','cough','coughs','could',
        'coulds','council','councils','count','counter','counters','countries','country','counts','coup',
        'coupled','coupleds','coups','courage','courages','courses','court','courts','cover','covered',
        'covereds','covering','coverings','covers','crack','cracks','craft','crafts','crane','cranes',
        'crash','crashed','crasheds','crashes','crawl','crawls','craze','crazes','crazies','crazy','cream',
        'creams','created','createds','creating','creatings','creation','creations','creative','creatives',
        'creature','creatures','creed','creeds','creek','creeks','creep','creeps','crest','crests','crew',
        'crews','cricket','crickets','crime','crimes','criminal','criminals','crisp','crisps','critical',
        'criticals','crop','crops','cross','crosses','crossing','crossings','crowd','crowds','crown',
        'crowns','crude','crudes','cruel','cruels','crush','crushes','cultural','culturals','culture',
        'cultures','curious','curiouses','currencies','currency','current','currents','curve','curves',
        'customer','customers','cutting','cuttings','cycle','cycles','dailies','daily','dairies','dairy',
        'damaged','damageds','dance','dances','dancing','dancings','dangerous','dangerouses','dark','darks',
        'data','database','databases','datas','date','dated','dateds','dates','daughter','daughters','dawn',
        'dawns','days','dayses','dead','deads','deal','dealing','dealings','deals','dealt','dealts','dean',
        'deans','dear','dears','death','deaths','debt','debts','debug','debugs','debut','debuts','decay',
        'decays','decided','decideds','decision','decisions','declared','declareds','decline','declines',
        'decor','decors','decoy','decoys','decrease','decreases','deep','deeps','default','defaults',
        'defence','defences','defense','defenses','deficit','deficits','defined','defineds','definite',
        'definites','degree','degrees','deities','deity','delay','delays','deliver','deliveries','delivers',
        'delivery','demand','demands','democracies','democracy','denied','denieds','denies','dense','denses',
        'densities','density','dental','dentals','deny','depend','depends','deposit','deposits','depot',
        'depots','depressed','depresseds','depth','depths','deputies','deputy','derbies','derby','derived',
        'deriveds','describe','describes','desert','deserts','deserve','deserves','design','designer',
        'designers','designs','desired','desireds','desk','desks','desktop','desktops','despite','despites',
        'destroy','destroys','detail','detailed','detaileds','details','detect','detects','deter','deters',
        'detox','detoxes','develop','develops','device','devices','devil','devils','devoted','devoteds',
        'diamond','diamonds','diaries','diary','diet','dietaries','dietary','diets','differ','differs',
        'digital','digitals','dining','dinings','diploma','diplomas','direct','directed','directeds',
        'direction','directions','directlies','directly','director','directors','directs','dirt','dirties',
        'dirts','dirty','disabled','disableds','disagree','disagrees','disc','disco','discos','discount',
        'discounts','discover','discovers','discs','discuss','disease','diseases','dish','dishes','disk',
        'disks','display','displays','dispute','disputes','distance','distances','distant','distants',
        'distinct','distincts','district','districts','ditch','ditches','diver','divers','diverse',
        'diverses','divide','divided','divideds','divides','divine','divines','division','divisions',
        'divorce','divorces','dizzies','dizzy','doctor','doctors','document','documents','dodge','dodges',
        'does','doing','doings','domestic','domestics','dominant','dominants','done','dones','donor',
        'donors','door','doors','dose','doses','double','doubled','doubleds','doubles','doubt','doubts',
        'dough','doughs','down','download','downloads','downs','dozen','dozens','draft','drafts','dragon',
        'dragons','drain','drains','drake','drakes','drama','dramas','dramatic','dramatics','drank','dranks',
        'drape','drapes','draw','drawing','drawings','drawl','drawls','draws','dread','dreads','dream',
        'dreams','dress','dressed','dresseds','dresses','drew','drews','dried','drieds','drift','drifts',
        'drill','drills','drink','drinking','drinkings','drinks','drive','driven','drivens','driver',
        'drivers','drives','driving','drivings','droit','droits','drop','dropped','droppeds','drops','drown',
        'drowns','drug','drugs','drunk','drunks','dual','duals','duke','dukes','during','durings','dust',
        'dusts','duties','duty','dwarf','dwarfs','dwarves','dwell','dwells','dying','dyings','dynamic',
        'dynamics','each','eaches','eager','eagers','eagle','eagles','earlier','earliers','earlies','early',
        'earn','earning','earnings','earns','earth','earths','ease','eases','easies','east','eastern',
        'easterns','easts','easy','eaten','eatens','eater','eaters','eating','eatings','economies','economy',
        'edge','edges','edition','editions','editor','editors','educated','educateds','education',
        'educations','edwards','edwardses','effect','effectivelies','effectively','effects','efficient',
        'efficients','effort','efforts','eight','eights','either','eithers','elbow','elbows','elder',
        'elderlies','elderly','elders','elect','election','elections','electric','electrical','electricals',
        'electrics','electronic','electronics','elects','element','elements','eleven','elevens','eliminate',
        'eliminates','elite','elites','else','elses','elsewhere','elsewheres','email','emails','embassies',
        'embassy','embed','embeds','ember','embers','emerge','emergencies','emergency','emerges','emerging',
        'emergings','emission','emissions','emotion','emotional','emotionals','emotions','emphasis',
        'emphasises','empire','empires','employ','employee','employees','employer','employers','employment',
        'employments','employs','empties','empty','enable','enables','encounter','encounters','encourage',
        'encourages','ended','endeds','ending','endings','endless','enemies','enemy','energies','energy',
        'engage','engaged','engageds','engages','engine','engineer','engineering','engineerings','engineers',
        'engines','enhance','enhances','enjoy','enjoys','enormous','enormouses','enough','enoughs','ensure',
        'ensures','enter','enterprise','enterprises','enters','entertainment','entertainments','entire',
        'entirelies','entirely','entires','entrance','entrances','entries','entry','environment',
        'environments','equal','equallies','equally','equals','equip','equipment','equipments','equips',
        'equities','equity','equivalent','equivalents','erase','erases','error','errors','escape','escapes',
        'especiallies','especially','essay','essays','essential','essentials','establish','establishes',
        'estate','estates','estimate','estimates','ethnic','ethnics','ethos','ethoses','europe','european',
        'europeans','europes','evade','evades','evaluate','evaluates','even','evening','evenings','evens',
        'event','events','eventuallies','eventually','ever','everies','evers','every','everybodies',
        'everybody','everyone','everyones','everything','everythings','everywhere','everywheres','evidence',
        'evidences','evident','evidents','evil','evils','evolution','evolutions','exact','exactlies',
        'exactly','exacts','exam','examine','examines','example','examples','exams','examses','excellent',
        'excellents','except','exception','exceptions','excepts','exchange','exchanges','excited','exciteds',
        'exciting','excitings','exclude','excludes','exclusive','exclusives','excuse','excuses','execute',
        'executes','executive','executives','exercise','exercises','exert','exerts','exhibit','exhibits',
        'exile','exiles','exist','existing','existings','exists','exit','exits','expand','expands',
        'expansion','expansions','expect','expected','expecteds','expects','expenditure','expenditures',
        'expense','expenses','expensive','expensives','experience','experiences','experiment','experiments',
        'expert','experts','explain','explains','explanation','explanations','explore','explores','export',
        'exports','expose','exposes','exposure','exposures','express','expression','expressions','extend',
        'extended','extendeds','extends','extension','extensions','extensive','extensives','extent',
        'extents','external','externals','extra','extraordinaries','extraordinary','extras','extreme',
        'extremelies','extremely','extremes','fable','fables','fabric','fabrics','face','faced','faceds',
        'faces','facet','facets','facilities','facility','facing','facings','fact','factor','factories',
        'factors','factory','facts','factses','faculties','faculty','fail','failed','faileds','failing',
        'failings','fails','failure','failures','faint','faints','fair','fairies','fairlies','fairly',
        'fairs','fairy','faith','faiths','fall','fallen','fallens','falling','fallings','falls','fallses',
        'false','falses','fame','fames','familiar','familiars','families','family','famous','famouses',
        'fancies','fancy','fantastic','fantastics','farm','farmer','farmers','farming','farmings','farms',
        'farmses','fashion','fashions','fast','faster','fasters','fastest','fastests','fasts','fatal',
        'fatals','fate','fates','father','fathers','fatties','fatty','fault','faults','favor','favorite',
        'favorites','favors','fear','fears','feast','feasts','feature','features','federal','federals',
        'feed','feedback','feedbacks','feeds','feel','feeling','feelings','feels','feet','feets','fell',
        'fells','felt','felts','female','females','fence','fences','ferries','ferry','fetal','fetals',
        'fetch','fetches','fever','fevers','fewer','fewers','fiber','fibers','fibre','fibres','fiction',
        'fictions','field','fields','fieries','fiery','fifteen','fifteens','fifth','fifths','fifties',
        'fifty','fight','fights','figure','figures','file','files','filing','filings','fill','filled',
        'filleds','filling','fillings','fills','film','films','filter','filters','final','finallies',
        'finally','finals','finance','finances','financial','financials','find','finding','findings','finds',
        'findses','fine','finer','finers','fines','finish','finished','finisheds','finishes','fire','fired',
        'fireds','firefox','firefoxes','fires','firm','firms','first','firsts','fiscal','fiscals','fish',
        'fishes','fishing','fishings','fitness','five','fives','fixed','fixeds','fixes','flag','flags',
        'flair','flairs','flame','flames','flank','flanks','flare','flares','flash','flashes','flask',
        'flasks','flat','flats','fled','fleds','fleet','fleets','flesh','fleshes','flew','flews','flies',
        'flight','flights','fling','flings','flint','flints','flip','flips','float','floating','floatings',
        'floats','flock','flocks','flood','floods','floor','floors','flora','floras','florida','floridas',
        'flour','flours','flow','flower','flowers','flown','flowns','flows','fluid','fluids','flung',
        'flungs','flunk','flunks','flush','flushes','flute','flutes','flying','flyings','focal','focals',
        'focus','focused','focuseds','focuses','fold','folder','folders','folds','folk','folks','folkses',
        'follow','followed','followeds','following','followings','follows','food','foods','foot','football',
        'footballs','foots','force','forced','forceds','forces','ford','fords','forecast','forecasts',
        'foreign','foreigns','forest','forests','forever','forevers','forge','forges','forget','forgets',
        'forgot','forgots','forgotten','forgottens','form','formal','formals','format','formation',
        'formations','formats','former','formers','forms','formula','formulas','fort','forth','forths',
        'forties','forts','fortune','fortunes','forty','forum','forums','forward','forwards','fossil',
        'fossils','foster','fosters','found','foundation','foundations','founded','foundeds','founder',
        'founders','founds','four','fours','foxes','foyer','foyers','fraction','fractions','frail','frails',
        'frame','frames','framework','frameworks','france','frances','frank','franks','fraud','frauds',
        'freak','freaks','free','freed','freedom','freedoms','freeds','freelies','freely','frees','french',
        'frenches','frequent','frequents','fresh','freshes','friar','friars','friday','fridays','fried',
        'frieds','friendlies','friendly','friends','friendses','from','froms','front','fronts','frost',
        'frosts','froze','frozes','fruit','fruits','fuel','fuels','fulfill','fulfills','full','fullies',
        'fulls','fully','function','functions','fund','fundamental','fundamentals','funded','fundeds',
        'funding','fundings','funds','funeral','funerals','fungi','fungis','funkies','funky','funnies',
        'funny','furniture','furnitures','further','furthers','future','futures','gain','gained','gaineds',
        'gains','galaxies','galaxy','galleries','gallery','gambling','gamblings','game','games','gaming',
        'gamings','gamma','gammas','gang','gangs','garden','gardens','gases','gate','gates','gateway',
        'gateways','gather','gathered','gathereds','gathers','gauge','gauges','gaunt','gaunts','gauze',
        'gauzes','gave','gavel','gavels','gaves','gazed','gazeds','gear','gears','geese','gender','genders',
        'gene','general','generallies','generally','generals','generate','generates','generation',
        'generations','generic','generics','generous','generouses','genes','genetic','genetics','genius',
        'geniuses','genre','genres','gentle','gentles','genuine','genuines','german','germanies','germans',
        'germany','getting','gettings','ghost','ghosts','giant','giants','gift','gifts','girl','girlfriend',
        'girlfriends','girls','give','given','givens','gives','giving','givings','glad','glads','gland',
        'glands','glare','glares','glass','glasses','gleam','gleams','glide','glides','global','globals',
        'globe','globes','gloom','glooms','glories','glory','gloss','glove','gloves','glyph','glyphs',
        'gnome','gnomes','goal','goals','goalses','goes','going','goings','gold','golden','goldens','golds',
        'golf','golfs','golves','gone','gones','gonna','gonnas','good','goods','goodses','google','googles',
        'gotten','gottens','govern','government','governments','governor','governors','governs','grab',
        'grabs','grace','graces','grade','grades','graduate','graduates','grain','grains','grand',
        'grandfather','grandfathers','grandmother','grandmothers','grands','grant','granted','granteds',
        'grants','grape','grapes','graph','graphic','graphics','graphicses','graphs','grasp','grasps',
        'grass','grasses','grateful','gratefuls','grave','gravel','gravels','graves','gray','grays','graze',
        'grazes','great','greater','greaters','greatest','greatests','greatlies','greatly','greats','greed',
        'greeds','greek','greeks','green','greens','greet','greets','grew','grews','grey','greys','grid',
        'grids','grief','griefs','grieves','grill','grills','grind','grinds','grip','grips','groan','groans',
        'groceries','grocery','groom','grooms','gross','ground','grounds','group','groups','grove','groves',
        'grow','growing','growings','growl','growls','grown','growns','grows','growth','growths','guarantee',
        'guarantees','guard','guards','guess','guesses','guest','guests','guidance','guidances','guide',
        'guideline','guidelines','guides','guild','guilds','guilt','guilties','guilts','guilty','guise',
        'guises','guitar','guitars','gulch','gulches','gulf','gulfs','gulves','habit','habitat','habitats',
        'habits','hacker','hackers','hair','hairies','hairs','hairses','hairy','half','halfs','hall','halls',
        'halves','hand','handed','handeds','handies','handle','handled','handleds','handles','hands',
        'handses','handy','hang','hanging','hangings','hangs','happen','happened','happeneds','happens',
        'happies','happiness','happy','harbor','harbors','hard','harder','harders','hardies','hardlies',
        'hardly','hards','hardware','hardwares','hardy','harm','harmful','harmfuls','harms','harries',
        'harry','harsh','harshes','harvest','harvests','haste','hastes','hasties','hasty','hatch','hatches',
        'hate','hates','have','haven','havens','haves','having','havings','havoc','havocs','head','headed',
        'headeds','headies','heading','headings','headline','headlines','heads','headses','heady','health',
        'healthies','healths','healthy','hear','heard','heards','hearing','hearings','hears','heart',
        'hearts','heartses','heat','heated','heateds','heating','heatings','heats','heaven','heavens',
        'heavies','heavilies','heavily','heavy','hedge','hedges','heel','heels','heelses','hefties','hefty',
        'height','heights','heist','heists','held','helds','helicopter','helicopters','hell','hello',
        'hellos','hells','help','helped','helpeds','helpful','helpfuls','helping','helpings','helps',
        'helpses','hence','hences','herald','heralds','herbs','herbses','here','heres','heritage',
        'heritages','hero','heros','herself','herselfs','herselves','hidden','hiddens','hide','hides',
        'hiding','hidings','hierarchies','hierarchy','high','higher','highers','highest','highests',
        'highlies','highlight','highlights','highly','highs','highway','highways','hill','hillies','hills',
        'hillses','hilly','himself','himselfs','himselves','hinge','hinges','hints','hintses','hippo',
        'hippos','hire','hired','hireds','hires','hiring','hirings','historic','historical','historicals',
        'historics','histories','history','hobbies','hobby','hockey','hockeys','hold','holder','holders',
        'holding','holdings','holds','holdses','hole','holes','holiday','holidays','holies','hollies',
        'holly','hollywood','hollywoods','holy','home','homeland','homelands','homeless','homepage',
        'homepages','homes','honda','hondas','honest','honests','honey','honeys','honor','honors','hope',
        'hoped','hopeds','hopes','horizon','horizons','horn','horns','horror','horrors','horse','horses',
        'hospital','hospitals','host','hosted','hosteds','hostile','hostiles','hosting','hostings','hosts',
        'hostses','hotel','hotels','hottest','hottests','hound','hounds','hour','hourlies','hourly','hours',
        'hourses','house','household','households','houses','housing','housings','however','howevers',
        'hudson','hudsons','huge','huges','human','humanities','humanity','humans','humanses','humid',
        'humids','humor','humors','hundred','hundreds','hung','hunger','hungers','hungries','hungry','hungs',
        'hunt','hunter','hunters','hunting','huntings','hunts','hurricane','hurricanes','hurries','hurry',
        'hurt','hurts','husband','husbands','hybrid','hybrids','hydro','hydros','hyper','hypers',
        'hypothesis','hypothesises','idea','ideal','ideals','ideas','ideases','identifies','identify',
        'identities','identity','idiom','idioms','idiot','idiots','ignored','ignoreds','illegal','illegals',
        'illness','illustrated','illustrateds','image','images','imagine','imagines','imaging','imagings',
        'immediate','immediatelies','immediately','immediates','impact','impacts','implement',
        'implementation','implementations','implements','implied','implieds','implies','imply','import',
        'importance','importances','important','importants','imports','impose','imposes','impossible',
        'impossibles','improve','improved','improveds','improvement','improvements','improves','inbox',
        'inboxes','inch','inches','incident','incidents','include','included','includeds','includes',
        'including','includings','income','incomes','increase','increased','increaseds','increases',
        'increasing','increasings','incredible','incredibles','incur','incurs','indeed','indeeds',
        'independence','independences','independent','independents','index','indexes','indian','indians',
        'indicate','indicated','indicateds','indicates','indie','indies','individual','individuals','indoor',
        'indoors','industrial','industrials','industries','industry','infant','infants','infection',
        'infections','inflation','inflations','influence','influences','inform','informal','informals',
        'information','informations','informs','infrastructure','infrastructures','initial','initiallies',
        'initially','initials','initiative','initiatives','injuries','injury','inner','inners','innocent',
        'innocents','innovation','innovations','innovative','innovatives','input','inputs','inquiries',
        'inquiry','insert','inserts','inside','insides','insight','insights','inspection','inspections',
        'inspector','inspectors','inspiration','inspirations','install','installation','installations',
        'installs','instance','instances','instant','instants','instead','insteads','institute','institutes',
        'institution','institutions','instruction','instructions','instrument','instruments','insurance',
        'insurances','intel','intels','intended','intendeds','intense','intenses','intensities','intensity',
        'intent','intention','intentions','intents','inter','interaction','interactions','interest',
        'interested','interesteds','interesting','interestings','interests','interface','interfaces',
        'interior','interiors','internal','internals','international','internationals','internet',
        'internets','interpret','interprets','inters','intervention','interventions','interview',
        'interviews','into','intos','intro','introduced','introduceds','introduction','introductions',
        'intros','invasion','invasions','invest','investigate','investigates','investigation',
        'investigations','investigator','investigators','investment','investments','investor','investors',
        'invests','invisible','invisibles','invitation','invitations','involve','involved','involveds',
        'involvement','involvements','involves','ionic','ionics','ireland','irelands','irish','irishes',
        'iron','ironies','irons','irony','island','islands','isolation','isolations','israel','israeli',
        'israelis','israels','issue','issued','issueds','issues','italian','italians','italies','italy',
        'item','items','itemses','itself','itselfs','itselves','ivories','ivory','jack','jacket','jackets',
        'jacks','jackson','jacksons','jail','jails','james','jane','janes','japan','japanese','japans',
        'jean','jeans','jeanses','jellies','jelly','jersey','jerseys','jesus','jesuses','jewel','jewels',
        'jiffies','jiffy','jimmies','jimmy','jobs','jobses','john','johns','johnson','johnsons','join',
        'joined','joineds','joins','joinses','joint','joints','joke','joker','jokers','jokes','jollies',
        'jolly','jones','jordan','jordans','joseph','josephs','journal','journalist','journalists',
        'journals','journey','journeys','joust','jousts','judge','judges','judgment','judgments','juice',
        'juices','juicies','juicy','jumbo','jumbos','jump','jumped','jumpeds','jumpies','jumping','jumpings',
        'jumps','jumpses','jumpy','junction','junctions','june','junes','jungle','jungles','junior',
        'juniors','junta','juntas','juries','juror','jurors','jury','just','justice','justices','justifies',
        'justify','justs','karma','karmas','kayak','kayaks','kebab','kebabs','keen','keens','keep','keeping',
        'keepings','keeps','keepses','kellies','kelly','kent','kents','kept','kepts','kernel','kernels',
        'kevin','kevins','keyboard','keyboards','keyed','keyeds','keyword','keywords','kick','kicked',
        'kickeds','kicks','kickses','kill','killing','killings','kills','kind','kinds','kindses','king',
        'kingdom','kingdoms','kings','kingses','kiosk','kiosks','kisses','kitchen','kitchens','klein',
        'kleins','knack','knacks','knead','kneads','knee','kneel','kneels','knees','knelt','knelts','knew',
        'knews','knife','knifes','knight','knights','knives','knock','knocks','knoll','knolls','know',
        'knowing','knowings','knowledge','knowledges','known','knowns','knows','knowses','kudos','kudoses',
        'label','labeled','labeleds','labels','labor','laboratories','laboratory','labors','labour',
        'labours','laced','laceds','lack','lacking','lackings','lacks','lackses','ladder','ladders','ladies',
        'lady','lager','lagers','laid','laids','laities','laity','lake','lakes','lamps','lampses','land',
        'landed','landeds','landing','landings','landlord','landlords','lands','landscape','landscapes',
        'landses','lane','lanes','language','languages','lankies','lanky','lapel','lapels','lapse','lapses',
        'laptop','laptops','large','largelies','largely','larger','largers','larges','largest','largests',
        'larva','larvas','laser','lasers','lasso','lassos','last','lasting','lastings','lasts','lastses',
        'latch','latches','late','later','laters','lates','latest','latests','latex','latexes','latin',
        'latins','latter','latters','laugh','laughing','laughings','laughs','launch','launched','launcheds',
        'launches','laundries','laundry','lawyer','lawyers','layer','layers','layout','layouts','lead',
        'leader','leaders','leadership','leaderships','leading','leadings','leads','leadses','leaf',
        'leafies','leafs','leafy','league','leagues','leakies','leaky','leant','leants','leapt','leapts',
        'learn','learned','learneds','learning','learnings','learns','lease','leases','least','leasts',
        'leather','leathers','leave','leaves','leaving','leavings','lecture','lectures','ledge','ledges',
        'left','lefts','legal','legallies','legally','legals','legend','legends','legislation',
        'legislations','legitimate','legitimates','leisure','leisures','lemon','lemons','length','lengths',
        'lesbian','lesbians','less','lesson','lessons','letter','letters','letterses','level','levels',
        'levelses','lever','leverage','leverages','levers','lewis','lewises','liabilities','liability',
        'libel','libels','liberal','liberals','liberties','liberty','libraries','library','licence',
        'licences','license','licensed','licenseds','licenses','life','lifes','lifetime','lifetimes','lift',
        'lifted','lifteds','lifts','liftses','light','lighting','lightings','lights','lightses','like',
        'liked','likeds','likelies','likely','likes','limbo','limbos','limbs','limbses','limit','limited',
        'limiteds','limiting','limitings','limits','limitses','lincoln','lincolns','linda','lindas','line',
        'linear','linears','lined','lineds','linen','linens','liner','liners','lines','lingerie','lingeries',
        'lingo','lingos','lining','linings','link','linked','linkeds','linking','linkings','links','linkses',
        'linux','linuxes','lions','lionses','liquid','liquids','list','listed','listeds','listen',
        'listening','listenings','listens','listing','listings','lists','listses','liter','literacies',
        'literacy','literallies','literally','literaries','literary','literature','literatures','liters',
        'litre','litres','little','littles','live','lived','liveds','livelies','lively','liver','livers',
        'lives','living','livings','llama','llamas','load','loaded','loadeds','loading','loadings','loads',
        'loadses','loan','loans','loanses','lobbies','lobby','local','locals','locate','located','locateds',
        'locates','location','locations','lock','locked','lockeds','locks','lockses','lodge','lodges',
        'lofties','lofty','logging','loggings','logic','logical','logicals','logics','login','logins',
        'logistics','logisticses','logo','logos','logoses','london','londons','lonelies','lonely','long',
        'longer','longers','longest','longests','longs','look','looking','lookings','looks','lookses',
        'loops','loopses','loose','looses','lopez','lopezs','lord','lords','lordses','lorries','lorry',
        'lose','loser','losers','loses','losing','losings','loss','losses','lost','losts','lotteries',
        'lottery','lotus','lotuses','louis','louises','lounge','lounges','lousies','lousy','love','loved',
        'loveds','lovelies','lovely','lover','lovers','loverses','loves','loving','lovings','lower','lowers',
        'lowest','lowests','loyal','loyals','lucas','lucases','lucid','lucids','luck','luckies','lucks',
        'lucky','lumpies','lumpy','lunar','lunars','lunch','lunches','lungs','lungses','lusties','lusty',
        'luxuries','luxury','lying','lyings','lyric','lyrics','machine','machineries','machinery','machines',
        'macho','machos','macro','macros','made','mades','madison','madisons','magazine','magazines','magic',
        'magical','magicals','magics','magma','magmas','magnetic','magnetics','magnificent','magnificents',
        'maiden','maidens','mail','mailing','mailings','mails','main','mainlies','mainly','mains',
        'mainstream','mainstreams','maintain','maintained','maintaineds','maintains','maintenance',
        'maintenances','major','majorities','majority','majors','make','maker','makers','makerses','makes',
        'makeup','makeups','making','makings','malaysia','malaysias','malcolm','malcolms','male','males',
        'malls','mallses','managed','manageds','management','managements','manager','managers','managing',
        'managings','mandate','mandates','manga','mangas','mango','mangos','mania','manias','manies',
        'manner','manners','manor','manors','manual','manuallies','manually','manuals','manufacture',
        'manufacturer','manufacturers','manufactures','manufacturing','manufacturings','many','maple',
        'maples','mapping','mappings','marathon','marathons','marble','marbles','march','marches','marcus',
        'marcuses','margin','margins','maria','marias','marine','marines','mark','marked','markeds','market',
        'marketing','marketings','markets','marketses','marking','markings','marks','markses','marriage',
        'marriages','married','marrieds','marries','marry','marsh','marshall','marshalls','marshes',
        'martial','martials','martin','martins','marvel','marvels','masks','maskses','mass','masses',
        'massive','massives','master','masters','masterses','match','matched','matcheds','matches',
        'matching','matchings','material','materials','materialses','mathematical','mathematicals','maths',
        'mathses','matt','matter','matters','matterses','matts','mature','matures','mauve','mauves','maxim',
        'maxims','maximum','maximums','maybe','maybes','mayor','mayors','meal','meals','mealses','mean',
        'meaning','meaningful','meaningfuls','meanings','means','meanses','meant','meants','measure',
        'measured','measureds','measurement','measurements','measures','measuring','measurings','meat',
        'meaties','meats','meaty','mechanical','mechanicals','mechanism','mechanisms','medal','medals',
        'media','median','medians','medias','medic','medical','medicals','medication','medications',
        'medicine','medicines','medics','medieval','medievals','medium','mediums','meet','meeting',
        'meetings','meetingses','meets','meetses','melbourne','melbournes','melee','melees','melissa',
        'melissas','melon','melons','member','members','memberses','membership','memberships','membrane',
        'membranes','memorial','memorials','memories','memory','mental','mentals','mention','mentioned',
        'mentioneds','mentions','mentor','mentors','menu','menus','merchant','merchants','mercies',
        'mercuries','mercury','mercy','mere','merelies','merely','meres','merge','merger','mergers','merges',
        'merit','merits','merries','merry','message','messages','messaging','messagings','messes','messies',
        'messy','metal','metals','meter','meters','method','methodologies','methodology','methods',
        'methodses','metro','metros','mexican','mexicans','mexico','mexicos','miami','miamis','michael',
        'michaels','michigan','michigans','micro','micros','microwave','microwaves','middle','middles',
        'midnight','midnights','midst','midsts','might','mighties','mights','mighty','migration',
        'migrations','mike','mikes','milan','milans','mild','milds','mile','miles','militaries','military',
        'milk','milks','mill','miller','millers','million','millions','millionses','mills','mince','minces',
        'mind','minded','mindeds','minds','mindses','mine','mined','mineds','miner','mineral','minerals',
        'miners','mines','minimal','minimals','minimize','minimizes','minimum','minimums','mining','minings',
        'minister','ministers','ministries','ministry','minor','minorities','minority','minors','minus',
        'minuses','minute','minutes','miracle','miracles','mirror','mirrors','mirth','mirths','miss',
        'missed','misseds','misses','missing','missings','mission','missions','mistake','mistakes','misties',
        'misty','mitchell','mitchells','mixed','mixeds','mixer','mixers','mixes','mixing','mixings','mobile',
        'mobiles','mobilities','mobility','mode','model','modeling','modelings','models','modelses','modem',
        'modems','moderate','moderates','modern','moderns','modes','modest','modests','modification',
        'modifications','modified','modifieds','modifies','modify','module','modules','moist','moists',
        'moisture','moistures','molar','molars','moldies','moldy','molecular','moleculars','moment',
        'moments','momentses','momentum','momentums','monaco','monacos','monday','mondays','monetaries',
        'monetary','money','moneys','monitor','monitoring','monitorings','monitors','monkey','monkeys',
        'monster','monsters','montana','montanas','month','monthlies','monthly','months','monthses',
        'montreal','montreals','monument','monuments','mood','moodies','moods','moodses','moody','moon',
        'moons','moors','moorses','moose','mooses','moral','morals','more','moreover','moreovers','mores',
        'morgan','morgans','morning','mornings','moron','morons','morph','morphs','morris','morrises',
        'mortalities','mortality','mortgage','mortgages','moscow','moscows','most','mostlies','mostly',
        'mosts','motel','motels','mother','mothers','motherses','motif','motifs','motion','motions',
        'motivated','motivateds','motivation','motivations','motives','motor','motorcycle','motorcycles',
        'motors','motto','mottos','mould','moulds','mound','mounds','mount','mountain','mountains','mounted',
        'mounteds','mounting','mountings','mounts','mourn','mourns','mouse','mouses','mousies','mousy',
        'mouth','mouths','move','moved','moveds','movement','movements','mover','movers','moves','movie',
        'movies','moving','movings','much','muches','muckies','mucky','mucus','mucuses','muddies','muddy',
        'multi','multiple','multiples','multis','mummies','mummy','munch','munches','municipal','municipals',
        'mural','murals','murder','murders','murkies','murky','murphies','murphy','murray','murrays',
        'muscle','muscles','museum','museums','music','musical','musicals','musician','musicians','musics',
        'muslim','muslims','must','musties','musts','musty','mutual','mutuals','myself','myselfs','myselves',
        'mysteries','mystery','naive','naives','naked','nakeds','name','named','nameds','namelies','namely',
        'names','nancies','nancy','nannies','nanny','narrow','narrows','nasal','nasals','nasties','nasty',
        'nation','national','nationals','nations','nationses','native','natives','natural','naturallies',
        'naturally','naturals','nature','natures','naval','navals','navies','navigate','navigates',
        'navigation','navigations','navy','near','nearbies','nearby','nearest','nearests','nearlies',
        'nearly','nears','necessaries','necessarilies','necessarily','necessary','necessities','necessity',
        'neck','necks','need','needs','needses','negative','negatives','negotiate','negotiates',
        'negotiation','negotiations','neighbor','neighborhood','neighborhoods','neighbors','neil','neils',
        'neither','neithers','nelson','nelsons','nerve','nerves','nervies','nervous','nervouses','nervy',
        'nest','nested','nesteds','nests','network','networking','networkings','networks','networkses',
        'neural','neurals','neutral','neutrals','never','nevers','newer','newers','newest','newests',
        'newlies','newly','newport','newports','news','newses','newsletter','newsletters','newspaper',
        'newspapers','newspaperses','newton','newtons','next','nexts','nexus','nexuses','nice','nicer',
        'nicers','nices','niche','niches','nicholas','nicholases','nick','nickel','nickels','nicks','night',
        'nightmare','nightmares','nights','nightses','nimbies','nimby','nine','nines','nineteenth',
        'nineteenths','ninja','ninjas','ninth','ninths','nitrogen','nitrogens','noble','nobles','nobodies',
        'nobody','nodal','nodals','nodes','noise','noises','noisies','noisy','nomad','nomads','nominated',
        'nominateds','nomination','nominations','none','nones','nonetheless','nonprofit','nonprofits',
        'normal','normallies','normally','normals','norman','normans','norms','normses','north','northeast',
        'northeasts','northern','northerns','norths','northwest','northwests','norton','nortons','norwegian',
        'norwegians','nose','noses','notable','notables','notablies','notably','notch','notches','note',
        'noted','noteds','notes','nothing','nothings','notice','noticed','noticeds','notices','notification',
        'notifications','notifies','notify','notion','notions','notre','notres','nouns','nounses','novel',
        'novels','novelses','november','novembers','nowadays','nowadayses','nowhere','nowheres','nuclear',
        'nuclears','nucleus','nucleuses','nudge','nudges','number','numbers','numberses','numeric',
        'numerics','numerous','numerouses','nurse','nurses','nursing','nursings','nutrition','nutritions',
        'nutties','nutty','nylon','nylons','oasis','oasises','object','objective','objectives','objects',
        'objectses','obligation','obligations','observation','observations','observe','observed','observeds',
        'observer','observers','observes','obtain','obtained','obtaineds','obtains','obvious','obviouses',
        'obviouslies','obviously','occasion','occasional','occasionallies','occasionally','occasionals',
        'occasions','occupation','occupations','occupied','occupieds','occur','occurred','occurreds',
        'occurrence','occurrences','occurring','occurrings','occurs','ocean','oceans','october','octobers',
        'oddlies','oddly','odds','oddses','offer','offering','offerings','offers','offerses','office',
        'officer','officers','officerses','offices','official','officials','officialses','offline',
        'offlines','offset','offsets','often','oftens','okay','okays','older','olders','oldest','oldests',
        'olive','oliver','olivers','olives','olympic','olympics','olympicses','omega','omegas','once',
        'onces','ongoing','ongoings','onion','onions','onlies','online','onlines','only','onset','onsets',
        'ontario','ontarios','onto','ontos','open','opening','openings','opens','openses','opera','operas',
        'operate','operated','operateds','operates','operating','operatings','operation','operational',
        'operationals','operations','operationses','operator','operators','operatorses','opinion','opinions',
        'opinionses','opponent','opponents','opportunities','opportunity','oppose','opposed','opposeds',
        'opposes','opposite','opposites','opposition','oppositions','optic','optical','opticals','optics',
        'optimal','optimals','optimum','optimums','option','optional','optionals','options','optionses',
        'oracle','oracles','oral','orals','orange','oranges','orbit','orbits','orchestra','orchestras',
        'order','ordered','ordereds','ordering','orderings','orders','orderses','ordinaries','ordinary',
        'oregon','oregons','organ','organic','organics','organisation','organisations','organizations',
        'organizationses','organize','organized','organizeds','organizer','organizers','organizes','organs',
        'orientation','orientations','oriented','orienteds','origin','original','originallies','originally',
        'originals','origins','orleans','orleanses','oscar','oscars','other','others','otherses','otherwise',
        'otherwises','ought','oughts','ounce','ounces','outcome','outcomes','outdoor','outdoors',
        'outdoorses','outer','outers','outgo','outgos','outlet','outlets','outline','outlines','outlook',
        'outlooks','output','outputs','outputses','outre','outreach','outreaches','outres','outside',
        'outsides','outstanding','outstandings','over','overall','overalls','overcome','overcomes',
        'overhead','overheads','overnight','overnights','overs','overseas','overseases','overview',
        'overviews','overwhelming','overwhelmings','owing','owings','owned','owneds','owner','owners',
        'ownerses','ownership','ownerships','oxford','oxfords','oxide','oxides','oxygen','oxygens','ozone',
        'ozones','pace','paced','paceds','pacer','pacers','paces','pacific','pacifics','pack','package',
        'packages','packaging','packagings','packed','packeds','packet','packets','packetses','packing',
        'packings','packs','packses','paddle','paddles','page','pages','paid','paids','pain','painful',
        'painfuls','pains','painses','paint','painted','painteds','painter','painters','painting',
        'paintings','paints','pair','pairs','pairses','pakistan','pakistans','palace','palaces',
        'palestinian','palestinians','palm','palms','palmses','panel','panels','panelses','panic','panics',
        'pants','pantses','papal','papals','paper','papers','paperses','parade','parades','paradise',
        'paradises','paragraph','paragraphs','parallel','parallels','parameter','parameters','parameterses',
        'parent','parents','parentses','paris','parises','parish','parishes','park','parker','parkers',
        'parking','parkings','parks','parkses','parliament','parliaments','parrot','parrots','part',
        'partial','partiallies','partially','partials','participant','participants','participantses',
        'participate','participated','participateds','participates','participating','participatings',
        'participation','participations','particle','particles','particular','particularlies','particularly',
        'particulars','parties','partlies','partly','partner','partners','partnerses','partnership',
        'partnerships','parts','partses','party','pass','passage','passages','passed','passeds','passenger',
        'passengers','passengerses','passes','passing','passings','passion','passions','passive','passives',
        'password','passwords','passwordses','past','pasta','pastas','paste','pastes','pasties','pastor',
        'pastors','pasts','pasty','patch','patches','patent','patents','patentses','path','paths','pathses',
        'patient','patients','patientses','patio','patios','patrick','patricks','patrol','patrols','pattern',
        'patterns','patternses','pause','pauses','pavement','pavements','payed','payeds','paying','payings',
        'payment','payments','paymentses','payroll','payrolls','peace','peaceful','peacefuls','peaces',
        'peach','peaches','peak','peaks','peakses','pearl','pearls','pedal','pedals','pedro','pedros',
        'peers','peerses','penalties','penalty','pencil','pencils','pending','pendings','pennies',
        'pennsylvania','pennsylvanias','penny','pension','pensions','people','peoples','pepper','peppers',
        'percent','percentage','percentages','percents','perception','perceptions','perfect','perfectlies',
        'perfectly','perfects','perform','performance','performances','performed','performeds','performer',
        'performers','performing','performings','performs','perhaps','perhapses','period','periodic',
        'periodics','periods','periodses','peripheral','peripherals','perkies','perks','perkses','perky',
        'permanent','permanents','permission','permissions','permit','permits','permitses','permitted',
        'permitteds','person','personal','personalities','personality','personallies','personally',
        'personals','personnel','personnels','persons','personses','perspective','perspectives','peskies',
        'pesky','pests','pestses','peter','peters','petition','petitions','petroleum','petroleums','petties',
        'petty','phantom','phantoms','phase','phases','phenomenon','phenomenons','philadelphia',
        'philadelphias','philip','philippines','philips','phillips','phillipses','phoenix','phoenixes',
        'phone','phones','photo','photograph','photographer','photographers','photographies','photographs',
        'photographses','photography','photos','photoses','phrase','phrases','physical','physicallies',
        'physically','physicals','physician','physicians','physicianses','physics','physicses','piano',
        'pianos','pick','pickies','picking','pickings','picks','pickses','picky','picture','pictures',
        'piece','pieces','piggies','piggy','pilot','pilots','pinch','pinches','pink','pinks','pioneer',
        'pioneers','pipe','pipeline','pipelines','pipes','pitch','pitches','pithies','pithy','pivot',
        'pivots','pixel','pixels','pizza','pizzas','place','placed','placeds','placement','placements',
        'places','placing','placings','plain','plains','plainses','plaintiff','plaintiffs','plan','plane',
        'planes','planet','planetaries','planetary','planets','planetses','plank','planks','planned',
        'planneds','planner','planners','planning','plannings','plans','planses','plant','plants','plantses',
        'plasma','plasmas','plastic','plastics','plate','plates','platform','platforms','platformses',
        'platinum','platinums','play','played','playeds','player','players','playerses','playing','playings',
        'plays','playses','plaza','plazas','plead','pleads','pleasant','pleasants','please','pleased',
        'pleaseds','pleases','pleasure','pleasures','pleat','pleats','pledge','pledges','plenties','plenty',
        'plier','pliers','plot','plots','plotses','pluck','plucks','plug','plugin','plugins','pluginses',
        'plugs','plugses','plumb','plumbing','plumbings','plumbs','plump','plumps','plums','plumses','plunk',
        'plunks','plus','pluses','plush','plushes','pocket','pockets','podcast','podcasts','poem','poems',
        'poemses','poet','poetries','poetry','poets','poetses','point','pointed','pointeds','pointer',
        'pointers','pointing','pointings','points','pointses','poise','poises','poker','pokers','poland',
        'polands','polar','polars','pole','poles','police','polices','policies','policy','polish','polishes',
        'political','politicallies','politically','politicals','politician','politicians','politicianses',
        'politics','politicses','poll','polls','pollses','pollution','pollutions','polymer','polymers',
        'polyp','polyps','pond','ponds','pondses','pool','pools','poolses','poor','poors','pope','popes',
        'poppies','poppy','popular','popularities','popularity','populars','population','populations',
        'porch','porches','pores','port','portable','portables','portal','portals','porter','porters',
        'portfolio','portfolios','portion','portions','portionses','portrait','portraits','ports','portses',
        'portugal','portugals','portuguese','pose','posed','poseds','poser','posers','poses','position',
        'positioned','positioneds','positions','positionses','positive','positives','possess','possession',
        'possessions','possibilities','possibility','possible','possibles','possiblies','possibly','post',
        'postal','postals','posted','posteds','poster','posters','posterses','posting','postings',
        'postingses','posts','postses','potato','potatos','potential','potentiallies','potentially',
        'potentials','potter','potteries','potters','pottery','pouch','pouches','poultries','poultry',
        'pound','pounds','poundses','pour','pours','poverties','poverty','powder','powders','powell',
        'powells','power','powered','powereds','powerful','powerfuls','powers','powerses','practical',
        'practicals','practice','practices','prague','pragues','prairie','prairies','praise','praises',
        'prank','pranks','prawn','prawns','prayer','prayers','prayerses','precious','preciouses','precise',
        'preciselies','precisely','precises','precision','precisions','predict','predicted','predicteds',
        'prediction','predictions','predicts','prefer','preference','preferences','preferred','preferreds',
        'prefers','pregnancies','pregnancy','pregnant','pregnants','preliminaries','preliminary','premier',
        'premiere','premieres','premiers','premise','premises','premium','premiums','preparation',
        'preparations','prepare','prepared','prepareds','prepares','preparing','preparings','prescription',
        'prescriptions','presence','presences','present','presentation','presentations','presentationses',
        'presented','presenteds','presenting','presentings','presentlies','presently','presents',
        'presentses','preservation','preservations','preserve','preserves','president','presidential',
        'presidentials','presidents','press','pressed','presseds','presses','pressing','pressings',
        'pressure','pressures','preston','prestons','pretties','pretty','prevailing','prevailings','prevent',
        'preventing','preventings','prevention','preventions','prevents','preview','previews','previous',
        'previouses','previouslies','previously','price','priced','priceds','prices','pricies','pricing',
        'pricings','pricy','pride','prides','priest','priests','primaries','primarilies','primarily',
        'primary','prime','primes','prince','princes','princess','princeton','princetons','principal',
        'principals','principle','principles','print','printed','printeds','printer','printers','printerses',
        'printing','printings','prints','printses','prior','priorities','priority','priors','prism','prisms',
        'prison','prisoner','prisoners','prisonerses','prisons','privacies','privacy','private','privates',
        'privies','privilege','privileges','privy','prize','prizes','probablies','probably','probe','probes',
        'problem','problems','problemses','procedure','procedures','proceed','proceeding','proceedings',
        'proceedingses','proceeds','proceedses','process','processed','processeds','processing',
        'processings','processor','processors','processorses','produce','produced','produceds','producer',
        'producers','producerses','produces','producing','producings','product','production','productions',
        'productionses','productive','productives','productivities','productivity','products','productses',
        'profession','professional','professionals','professionalses','professions','professor','professors',
        'profile','profiles','profit','profitable','profitables','profits','profitses','program','programme',
        'programmer','programmers','programmerses','programmes','programming','programmings','programs',
        'programses','progress','progressive','progressives','project','projected','projecteds','projection',
        'projections','projector','projectors','projects','projectses','prominent','prominents','promise',
        'promised','promiseds','promises','promising','promisings','promo','promos','promote','promoted',
        'promoteds','promoter','promoters','promotes','promoting','promotings','promotion','promotional',
        'promotionals','promotions','promotionses','prompt','promptlies','promptly','prompts','prone',
        'prones','proof','proofs','prooves','propaganda','propagandas','proper','properlies','properly',
        'propers','properties','property','prophet','prophets','proportion','proportions','proposal',
        'proposals','proposalses','propose','proposed','proposeds','proposes','proposition','propositions',
        'proprietaries','proprietary','props','propses','prose','prosecution','prosecutions','proses',
        'prospect','prospective','prospectives','prospects','prospectses','prosperities','prosperity',
        'protect','protected','protecteds','protecting','protectings','protection','protections',
        'protective','protectives','protects','protein','proteins','proteinses','protest','protests',
        'protocol','protocols','protocolses','prototype','prototypes','proud','proudlies','proudly','prouds',
        'prove','proved','proveds','proven','provens','proves','provide','provided','provideds','providence',
        'providences','provider','providers','providerses','provides','providing','providings','province',
        'provinces','provision','provisions','provisionses','proxies','proxy','prude','prudes','prune',
        'prunes','psalm','psalms','psychiatric','psychiatrics','psychological','psychologicals',
        'psychologies','psychologist','psychologists','psychologistses','psychology','pubic','pubics',
        'public','publication','publications','publicationses','publicities','publicity','publiclies',
        'publicly','publics','publish','published','publisheds','publisher','publishers','publisherses',
        'publishes','publishing','publishings','pull','pulling','pullings','pulls','pullses','pulse',
        'pulses','pump','pumps','pumpses','punch','punches','punishes','punishment','punishments','pupil',
        'pupils','puppies','puppy','purchase','purchased','purchaseds','purchases','purchasing',
        'purchasings','pure','pures','purge','purges','purple','purples','purpose','purposes','purse',
        'purses','pursue','pursues','pursuit','pursuits','push','pushed','pusheds','pushes','pushies',
        'pushing','pushings','pushy','putting','puttings','puzzle','puzzles','qualified','qualifieds',
        'qualifies','qualify','qualifying','qualifyings','qualities','quality','quantities','quantity',
        'quantum','quantums','quarter','quarterlies','quarterly','quarters','quarterses','queen','queens',
        'queries','query','quest','question','questioned','questioneds','questions','questionses','quests',
        'queue','queues','quick','quicker','quickers','quicklies','quickly','quicks','quiet','quietlies',
        'quietly','quiets','quilt','quilts','quirk','quirks','quite','quites','quota','quotas','quote',
        'quoted','quoteds','quotes','rabbit','rabbits','race','racer','racers','races','rachel','rachels',
        'racial','racials','racing','racings','racism','racisms','radar','radars','radiation','radiations',
        'radical','radicals','radii','radiis','radio','radios','radius','radiuses','rail','railroad',
        'railroads','rails','railway','railways','rain','rainbow','rainbows','rainies','rains','rainy',
        'raise','raised','raiseds','raises','raising','raisings','rallies','rally','ralph','ralphs','ramps',
        'rampses','ranch','ranches','random','randomlies','randomly','randoms','range','ranger','rangers',
        'ranges','ranging','rangings','rank','ranked','rankeds','ranking','rankings','rankingses','ranks',
        'rankses','rapid','rapidlies','rapidly','rapids','rare','rares','rate','rated','rateds','rates',
        'rather','rathers','rating','ratings','ratingses','ratio','rational','rationals','ratios','ratioses',
        'raymond','raymonds','razor','razors','reach','reached','reacheds','reaches','reaching','reachings',
        'react','reaction','reactions','reactionses','reacts','read','reader','readers','readerses',
        'readies','readilies','readily','reading','readings','readingses','reads','readses','ready','reagan',
        'reagans','real','realities','reality','realize','realized','realizeds','realizes','reallies',
        'really','realm','realms','reals','reams','reamses','rear','rears','reason','reasonable',
        'reasonables','reasonablies','reasonably','reasoning','reasonings','reasons','reasonses','rebel',
        'rebels','rebirth','rebirths','rebuild','rebuilds','recall','recalls','recap','recaps','receipt',
        'receipts','receive','received','receiveds','receiver','receivers','receiverses','receives',
        'receiving','receivings','recent','recentlies','recently','recents','reception','receptions',
        'recipe','recipes','recipient','recipients','recipientses','recognition','recognitions','recognize',
        'recognized','recognizeds','recognizes','recommend','recommendation','recommendations',
        'recommendationses','recommended','recommendeds','recommends','recon','recons','record','recorded',
        'recordeds','recorder','recorders','recording','recordings','recordingses','records','recordses',
        'recover','recovered','recovereds','recoveries','recovering','recoverings','recovers','recovery',
        'recreation','recreational','recreationals','recreations','recruit','recruitment','recruitments',
        'recruits','recur','recurs','recycle','recycles','recycling','recyclings','reduce','reduced',
        'reduceds','reduces','reducing','reducings','reduction','reductions','reductionses','refer',
        'reference','referenced','referenceds','references','referral','referrals','referralses','referred',
        'referreds','referring','referrings','refers','referses','refine','refined','refineds','refines',
        'reflect','reflected','reflecteds','reflection','reflections','reflects','reform','reforms',
        'reformses','refresh','refreshes','refrigerator','refrigerators','refuge','refugee','refugees',
        'refuges','refund','refunds','refuse','refused','refuseds','refuses','regard','regarded','regardeds',
        'regarding','regardings','regardless','regards','regardses','regime','regimes','region','regional',
        'regionals','regions','regionses','register','registered','registereds','registers','registration',
        'registrations','registries','registry','regular','regularlies','regularly','regulars','regulation',
        'regulations','regulationses','regulatories','regulatory','rehabilitation','rehabilitations','reid',
        'reids','reign','reigns','reject','rejected','rejecteds','rejects','relate','related','relateds',
        'relates','relating','relatings','relation','relations','relationses','relationship','relationships',
        'relationshipses','relative','relativelies','relatively','relatives','relax','relaxation',
        'relaxations','relaxes','relay','relays','release','released','releaseds','releases','relevance',
        'relevances','relevant','relevants','reliabilities','reliability','reliable','reliables','relic',
        'relics','relief','reliefs','relies','relieves','religion','religions','religious','religiouses',
        'reload','reloads','rely','remain','remainder','remainders','remained','remaineds','remaining',
        'remainings','remains','remainses','remarkable','remarkables','remarks','remarkses','remedies',
        'remedy','remember','remembered','remembereds','remembers','remind','reminder','reminders','reminds',
        'remit','remits','remix','remixes','remote','remotes','removal','removals','remove','removed',
        'removeds','removes','removing','removings','renaissance','renaissances','renal','renals','render',
        'rendered','rendereds','rendering','renderings','renders','renew','renewal','renewals','renewed',
        'reneweds','renews','rent','rental','rentals','rentalses','rents','repair','repairs','repairses',
        'repay','repays','repeat','repeated','repeateds','repeats','repel','repels','replace','replaced',
        'replaceds','replacement','replacements','replaces','replacing','replacings','replica','replicas',
        'replied','replieds','replies','reply','report','reported','reporteds','reporter','reporters',
        'reporterses','reporting','reportings','reports','reportses','repositories','repository','represent',
        'representation','representations','representative','representatives','represented','representeds',
        'representing','representings','represents','representses','reproduce','reproduced','reproduceds',
        'reproduces','reproduction','reproductions','republic','republican','republicans','republicanses',
        'republics','reputation','reputations','request','requested','requesteds','requesting','requestings',
        'requests','requestses','require','required','requireds','requirement','requirements',
        'requirementses','requires','requiring','requirings','rerun','reruns','rescue','rescues','research',
        'researcher','researchers','researcherses','researches','reservation','reservations',
        'reservationses','reserve','reserved','reserveds','reserves','reservoir','reservoirs','reset',
        'resets','residence','residences','resident','residential','residentials','residents','residentses',
        'resin','resins','resist','resistance','resistances','resists','resolution','resolutions',
        'resolutionses','resolve','resolved','resolveds','resolves','resort','resorts','resortses',
        'resource','resources','respect','respected','respecteds','respective','respectivelies',
        'respectively','respectives','respects','respond','responded','respondeds','respondent',
        'respondents','respondentses','responding','respondings','responds','response','responses',
        'responsibilities','responsibility','responsible','responsibles','rest','restart','restarts',
        'restaurant','restaurants','restaurantses','restoration','restorations','restore','restored',
        'restoreds','restores','restrict','restricted','restricteds','restriction','restrictions',
        'restrictionses','restricts','restructuring','restructurings','rests','result','resulted',
        'resulteds','resulting','resultings','results','resultses','resume','resumes','retail','retailer',
        'retailers','retailerses','retails','retain','retained','retaineds','retains','retention',
        'retentions','retire','retired','retireds','retirement','retirements','retires','retreat','retreats',
        'retries','retrieve','retrieved','retrieveds','retrieves','retro','retros','retry','return',
        'returned','returneds','returning','returnings','returns','returnses','reunion','reunions','reuse',
        'reuses','reveal','revealed','revealeds','revealing','revealings','reveals','revealses','revel',
        'revels','revenue','revenues','reverse','reverses','review','reviewed','revieweds','reviewer',
        'reviewers','reviewing','reviewings','reviews','reviewses','revised','reviseds','revision',
        'revisions','revisionses','revolution','revolutionaries','revolutionary','revolutions','reward',
        'rewards','rewardses','rhetoric','rhetorics','rhythm','rhythms','rice','rices','rich','richard',
        'richards','richardses','richardson','richardsons','riches','richmond','richmonds','ride','rider',
        'riders','riderses','rides','ridge','ridges','riding','ridings','rifle','rifles','right','rights',
        'rightses','rigid','rigids','rigor','rigors','ring','rings','ringses','riots','riotses','ripen',
        'ripens','rise','risen','risens','rises','rising','risings','risk','riskies','risks','riskses',
        'risky','rites','ritzies','ritzy','rival','rivals','river','rivers','riverses','road','roads',
        'roadses','roast','roasts','robert','roberts','robertses','robes','robin','robins','robinson',
        'robinsons','robot','robots','robotses','robust','robusts','rochester','rochesters','rock','rockies',
        'rocks','rockses','rocky','rode','rodes','roger','rogers','rogerses','rogue','rogues','role','roles',
        'roll','rolled','rolleds','roller','rollers','rolling','rollings','rolls','rollses','roman',
        'romance','romances','romans','romantic','romantics','ronald','ronalds','roof','roofs','room',
        'roomies','rooms','roomses','roomy','root','roots','rootses','rooves','ropes','rose','roses',
        'roster','rosters','rotor','rotors','rouge','rouges','rough','roughlies','roughly','roughs','round',
        'rounds','roundses','route','router','routers','routerses','routes','routine','routinelies',
        'routinely','routines','routing','routings','rover','rovers','rowdies','rowdy','royal','royals',
        'rubber','rubbers','rugbies','rugby','ruins','ruinses','rule','ruled','ruleds','ruler','rulers',
        'rules','ruling','rulings','rumor','rumors','rungs','rungses','running','runnings','rural','rurals',
        'rush','rushes','russell','russells','russia','russian','russians','russias','rusties','rusty',
        'ruth','ruths','sacrifice','sacrifices','sadlies','sadly','safari','safaris','safe','safes',
        'safeties','safety','said','saids','sailing','sailings','saint','saints','saintses','sake','sakes',
        'salad','salads','salaries','salary','sale','sales','sallies','sally','salmon','salmons','salon',
        'salons','salsa','salsas','salt','salties','salts','salty','salute','salutes','same','sames',
        'sample','samples','sampling','samplings','samuel','samuels','sanctions','sanctionses','sand',
        'sandies','sands','sandy','satellite','satellites','satin','satins','satisfaction','satisfactions',
        'satisfied','satisfieds','satisfies','satisfy','saturday','saturdays','saturn','saturns','sauce',
        'sauces','sauna','saunas','savage','savages','save','saved','saveds','saver','savers','saves',
        'saving','savings','savingses','savor','savors','savvies','savvy','scald','scalds','scale','scales',
        'scalies','scalp','scalps','scaly','scamp','scamps','scan','scanner','scanners','scanning',
        'scannings','scans','scant','scants','scare','scared','scareds','scares','scarf','scarfs','scaries',
        'scarves','scary','scenario','scenarios','scenarioses','scene','scenes','scenic','scenics','scent',
        'scents','schedule','scheduled','scheduleds','schedules','scheduling','schedulings','schema',
        'schemas','scheme','schemes','scholar','scholarlies','scholarly','scholars','scholarses',
        'scholarship','scholarships','scholarshipses','schools','schoolses','science','sciences',
        'scientific','scientifics','scientist','scientists','scientistses','scone','scones','scoop','scoops',
        'scope','scopes','score','scored','scoreds','scores','scoring','scorings','scorn','scorns',
        'scotland','scotlands','scott','scottish','scottishes','scotts','scout','scouts','scrap','scraps',
        'scratch','scratches','screen','screening','screenings','screens','screenses','screenshot',
        'screenshots','screenshotses','script','scripts','scriptses','scroll','scrolls','sculpture',
        'sculptures','seams','seamses','search','searched','searcheds','searches','searching','searchings',
        'season','seasonal','seasonals','seasons','seasonses','seat','seating','seatings','seats','seatses',
        'seattle','seattles','second','secondaries','secondary','seconds','secondses','secret','secretaries',
        'secretary','secrets','secretses','section','sections','sectionses','sector','sectors','sectorses',
        'secure','secured','secureds','securelies','securely','secures','securities','security','seed',
        'seeds','seedses','seek','seeking','seekings','seeks','seekses','seem','seems','seemses','seen',
        'seens','segment','segments','segmentses','seize','seizes','select','selected','selecteds',
        'selecting','selectings','selection','selections','selectionses','selective','selectives','selects',
        'self','selfs','sell','sellers','sellerses','selling','sellings','sells','sellses','selves',
        'semester','semesters','semi','semis','senate','senates','senator','senators','senatorses','send',
        'sends','sendses','senior','seniors','seniorses','sense','senses','sensitive','sensitives',
        'sensitivities','sensitivity','sensor','sensors','sensorses','sent','sentence','sentences','sents',
        'separate','separated','separateds','separatelies','separately','separates','separation',
        'separations','sept','september','septembers','septs','sequence','sequences','serbia','serbias',
        'serial','serials','series','serious','seriouses','seriouslies','seriously','sermon','sermons',
        'serum','serums','servant','servants','serve','served','serveds','server','servers','serverses',
        'serves','service','services','serving','servings','session','sessions','sessionses','setting',
        'settings','settingses','settle','settled','settleds','settlement','settlements','settles','setup',
        'setups','seven','sevens','seventeen','seventeens','seventh','sevenths','sever','several','severals',
        'severe','severes','severs','sexual','sexuals','shade','shades','shadies','shadow','shadows','shady',
        'shaft','shafts','shake','shakes','shakespeare','shakespeares','shakies','shaky','shall','shalls',
        'shame','shames','shape','shaped','shapeds','shapes','shaping','shapings','shard','shards','share',
        'shared','shareds','shareholder','shareholders','shareholderses','shares','shareware','sharewares',
        'sharing','sharings','shark','sharks','sharon','sharons','sharp','sharps','shawl','shawls','sheaf',
        'sheafs','shear','shears','sheaves','sheen','sheens','sheep','sheeps','sheer','sheers','sheet',
        'sheets','sheetses','shelf','shelfs','shell','shells','shelter','shelters','shelves','shepherd',
        'shepherds','sheriff','sheriffs','shift','shifting','shiftings','shifts','shine','shines','shinies',
        'shining','shinings','shiny','ship','shipment','shipments','shipmentses','shipped','shippeds',
        'shipping','shippings','ships','shipses','shire','shires','shirt','shirts','shirtses','shock',
        'shocks','shoe','shoes','shone','shones','shook','shooks','shoot','shooting','shootings','shoots',
        'shop','shopper','shoppers','shopperses','shopping','shoppings','shops','shopses','shore','shores',
        'short','shorter','shorters','shortest','shortests','shortlies','shortly','shorts','shortses','shot',
        'shots','shotses','shoulder','shoulders','shoulderses','shout','shouts','shove','shovel','shovels',
        'shoves','show','showed','showeds','shower','showers','showerses','showies','showing','showings',
        'shown','showns','shows','showses','showy','shred','shreds','shrub','shrubs','shrug','shrugs',
        'shuck','shucks','shunt','shunts','shut','shuts','shuttle','shuttles','siblings','siblingses','sick',
        'sicks','side','sided','sideds','sides','siege','sieges','sight','sights','sigma','sigmas','sign',
        'signal','signals','signalses','signature','signatures','signed','signeds','significance',
        'significances','significant','significantlies','significantly','significants','signing','signings',
        'signs','signses','silence','silences','silent','silents','silicon','silicons','silk','silkies',
        'silks','silky','sillies','silly','silver','silvers','similar','similarlies','similarly','similars',
        'simon','simons','simple','simpler','simplers','simples','simplest','simplests','simplies',
        'simplified','simplifieds','simply','simpson','simpsons','simulation','simulations','simulationses',
        'simultaneouslies','simultaneously','since','sinces','sing','singapore','singapores','singer',
        'singers','singerses','singing','singings','single','singles','sings','sink','sinks','siren',
        'sirens','sissies','sissy','sister','sisters','sisterses','site','sites','sitting','sittings',
        'situated','situateds','situation','situations','situationses','sixth','sixths','sixties','sixty',
        'size','sized','sizeds','sizes','sizing','sizings','skate','skates','skating','skatings','sketch',
        'sketches','skier','skiers','skiing','skiings','skill','skilled','skilleds','skills','skillses',
        'skimp','skimps','skin','skins','skinses','skirt','skirts','skull','skulls','skunk','skunks','slack',
        'slacks','slain','slains','slang','slangs','slant','slants','slash','slashes','slate','slates',
        'slave','slaveries','slavery','slaves','sleek','sleeks','sleep','sleeping','sleepings','sleeps',
        'sleet','sleets','slept','slepts','slice','slices','slick','slicks','slide','slides','slideshow',
        'slideshows','slight','slightlies','slightly','slights','slim','slime','slimes','slimies','slims',
        'slimy','sling','slings','slink','slinks','slip','slips','slope','slopes','slosh','sloshes','sloth',
        'sloths','slots','slotses','slovakia','slovakias','slovenia','slovenias','slow','slower','slowers',
        'slowlies','slowly','slows','slump','slumps','slums','slumses','slung','slungs','slunk','slunks',
        'slurp','slurps','slush','slushes','small','smaller','smallers','smallest','smallests','smalls',
        'smart','smarts','smash','smashes','smear','smears','smell','smells','smile','smiles','smirk',
        'smirks','smith','smiths','smock','smocks','smoke','smokes','smokies','smoking','smokings','smoky',
        'smooth','smooths','snack','snacks','snafu','snafus','snail','snails','snake','snakes','snakies',
        'snaky','snap','snaps','snapses','snapshot','snapshots','snare','snares','snarl','snarls','sneak',
        'sneaks','sneer','sneers','snide','snides','sniff','sniffs','snipe','snipes','snore','snores',
        'snort','snorts','snout','snouts','snow','snowies','snows','snowy','snuck','snucks','snuff','snuffs',
        'soapies','soapy','sober','sobers','soccer','soccers','social','sociallies','socially','socials',
        'societies','society','sociologies','sociology','socket','sockets','socks','sockses','soft',
        'softball','softballs','softs','software','softwares','soggies','soggy','soil','soils','solar',
        'solars','sold','soldier','soldiers','soldierses','solds','sole','solelies','solely','solemn',
        'solemns','soles','solid','solidarities','solidarity','solids','solomon','solomons','solution',
        'solutions','solutionses','solve','solved','solveds','solves','solving','solvings','somalia',
        'somalias','some','somebodies','somebody','somehow','somehows','someone','someones','somerset',
        'somersets','somes','something','somethings','sometimes','somewhat','somewhats','somewhere',
        'somewheres','song','songs','songses','sonic','sonics','sonnies','sonny','soon','sooner','sooners',
        'soons','sophisticated','sophisticateds','sorries','sorry','sort','sorted','sorteds','sorts',
        'sortses','sought','soughts','soul','souls','soulses','sound','sounds','soundses','soundtrack',
        'soundtracks','soup','soups','source','sources','south','southeast','southeasts','southern',
        'southerns','souths','southwest','southwests','soviet','soviets','space','spaces','spade','spades',
        'spain','spains','spam','spams','span','spanish','spanishes','spank','spanks','spans','spare',
        'spares','spark','sparks','spasm','spasms','spatial','spatials','spawn','spawns','speak','speaker',
        'speakers','speakerses','speaking','speakings','speaks','speakses','spear','spears','special',
        'specialist','specialists','specialistses','specialized','specializeds','specials','species',
        'specific','specificallies','specifically','specification','specifications','specificationses',
        'specifics','specified','specifieds','specifies','specify','speck','specks','specs','specses',
        'spectrum','spectrums','speech','speeches','speed','speeds','speedses','spell','spelling',
        'spellings','spells','spend','spending','spendings','spends','spent','spents','sphere','spheres',
        'spice','spices','spicies','spicy','spider','spiders','spied','spieds','spike','spikes','spikies',
        'spiky','spill','spills','spin','spine','spines','spinies','spins','spiny','spirit','spirits',
        'spiritses','spiritual','spirituals','spite','spites','splat','splats','split','splits','spoil',
        'spoils','spoke','spoken','spokens','spokes','spokesman','spokesmans','sponsor','sponsored',
        'sponsoreds','sponsors','sponsorses','sponsorship','sponsorships','spoof','spoofs','spook','spooks',
        'spool','spools','spoon','spoons','spooves','spore','spores','sport','sporting','sportings','sports',
        'sportses','spot','spotlight','spotlights','spots','spotses','spouse','spouses','spout','spouts',
        'spray','sprays','spread','spreading','spreadings','spreads','spree','sprees','sprig','sprigs',
        'spring','springer','springers','springs','springses','spunk','spunks','squad','squads','square',
        'squares','squat','squats','squid','squids','stable','stables','stack','stacks','stadium','stadiums',
        'staff','staffing','staffings','staffs','stage','stages','stain','stainless','stains','stair',
        'stairs','stake','stakes','stale','stales','stalk','stalks','stall','stalls','stamp','stamps',
        'stampses','stand','standard','standards','standardses','standing','standings','stands','standses',
        'stanford','stanfords','stank','stanks','stanley','stanleys','star','stare','stares','stark',
        'starks','starring','starrings','stars','starses','start','started','starteds','starter','starters',
        'starting','startings','starts','startses','startup','startups','stash','stashes','state','stated',
        'stateds','statement','statements','statementses','states','static','statics','station','stations',
        'stationses','statistical','statisticals','statistics','statisticses','stats','statses','status',
        'statuses','statute','statutes','stay','stayed','stayeds','staying','stayings','stays','stayses',
        'steadies','steady','steak','steaks','steal','steals','steam','steams','steel','steels','steep',
        'steeps','steer','steering','steerings','steers','stellar','stellars','stem','stems','stemses',
        'step','stephen','stephens','stepped','steppeds','steps','stepses','stereo','stereos','sterling',
        'sterlings','stern','sterns','steve','steven','stevens','stevenses','steves','stick','stickers',
        'stickerses','stickies','sticks','stickses','sticky','stiff','stiffs','still','stills','sting',
        'stings','stink','stinks','stint','stints','stock','stockholm','stockholms','stocks','stockses',
        'stoic','stoics','stoke','stokes','stole','stoles','stomach','stomaches','stomp','stomps','stone',
        'stones','stonies','stony','stood','stoods','stool','stools','stoop','stoops','stop','stopped',
        'stoppeds','stopping','stoppings','stops','stopses','storage','storages','store','stored','storeds',
        'stores','stories','storing','storings','stork','storks','storm','storms','story','stout','stouts',
        'stove','stoves','straight','straights','strain','strains','strand','strands','strange','stranger',
        'strangers','stranges','strap','straps','strategic','strategics','strategies','strategy','straw',
        'straws','stray','strays','stream','streaming','streamings','streams','streamses','street','streets',
        'streetses','strength','strengthen','strengthens','strengths','stress','stresses','stretch',
        'stretches','strict','strictlies','strictly','stricts','strike','strikes','striking','strikings',
        'string','strings','stringses','strip','strips','stroke','strokes','strong','stronger','strongers',
        'stronglies','strongly','strongs','struck','strucks','structural','structurals','structure',
        'structured','structureds','structures','struggle','struggles','struggling','strugglings','strut',
        'struts','stuart','stuarts','stuck','stucks','student','students','studentses','studied','studieds',
        'studies','studio','studios','studioses','study','studying','studyings','stuff','stuffed','stuffeds',
        'stuffs','stump','stumps','stung','stungs','stunk','stunks','stunning','stunnings','stunt','stunts',
        'stupid','stupids','style','styled','styleds','styles','styling','stylings','stylish','stylishes',
        'stylus','styluses','suave','suaves','subject','subjects','subjectses','submission','submissions',
        'submissionses','submit','submits','submitted','submitteds','subscribe','subscriber','subscribers',
        'subscriberses','subscribes','subscription','subscriptions','subscriptionses','subsequent',
        'subsequentlies','subsequently','subsequents','subset','subsets','substance','substances',
        'substantial','substantiallies','substantially','substantials','subtle','subtles','suburban',
        'suburbans','succeed','succeeds','success','successful','successfullies','successfully',
        'successfuls','such','suches','sucks','suckses','sudden','suddenlies','suddenly','suddens','suffer',
        'suffered','suffereds','suffering','sufferings','suffers','sufficient','sufficients','sugar',
        'sugars','suggest','suggested','suggesteds','suggesting','suggestings','suggestion','suggestions',
        'suggestionses','suggests','suggestses','suicide','suicides','suit','suitable','suitables','suite',
        'suited','suiteds','suites','suits','suitses','sulkies','sulky','sullivan','sullivans','summaries',
        'summary','summer','summers','summit','summits','sunday','sundays','sunnies','sunny','sunrise',
        'sunrises','sunset','sunsets','super','superb','superbs','superintendent','superintendents',
        'superior','superiors','supers','supervision','supervisions','supervisor','supervisors','supplement',
        'supplemental','supplementals','supplements','supplementses','supplied','supplieds','supplier',
        'suppliers','supplierses','supplies','supply','support','supported','supporteds','supporter',
        'supporters','supporterses','supporting','supportings','supports','supportses','suppose','supposed',
        'supposeds','supposes','supreme','supremes','sure','sures','surface','surfaces','surge','surgeon',
        'surgeons','surgeonses','surgeries','surgery','surges','surgical','surgicals','surlies','surly',
        'surplus','surpluses','surprise','surprised','surpriseds','surprises','surprising','surprisinglies',
        'surprisingly','surprisings','surrender','surrenders','surround','surrounded','surroundeds',
        'surrounding','surroundings','surrounds','survey','surveys','surveyses','survival','survivals',
        'survive','survived','surviveds','survives','survivor','survivors','survivorses','susan','susans',
        'suspect','suspected','suspecteds','suspects','suspend','suspended','suspendeds','suspends',
        'suspension','suspensions','sustainabilities','sustainability','sustainable','sustainables',
        'sustained','sustaineds','swamp','swamps','swarm','swarms','swear','swears','sweat','sweats',
        'sweden','swedens','swedish','swedishes','sweep','sweeps','sweet','sweets','swell','swells','swept',
        'swepts','swift','swifts','swimming','swimmings','swims','swimses','swine','swines','swing','swings',
        'swipe','swipes','swirl','swirls','swiss','switch','switched','switcheds','switches','switching',
        'switchings','switzerland','switzerlands','sword','swords','swore','swores','sworn','sworns','swung',
        'swungs','symbol','symbols','symbolses','sympathies','sympathy','symphonies','symphony','symptoms',
        'symptomses','syndrome','syndromes','syntax','syntaxes','synthetic','synthetics','syria','syrias',
        'system','systematic','systematics','systems','systemses','tabbies','tabby','table','tables',
        'tablet','tablets','tabletses','taboo','taboos','tacit','tacits','tackies','tackle','tackles',
        'tacky','tactics','tacticses','taffies','taffy','tagged','taggeds','taint','taints','taiwan',
        'taiwans','take','taken','takens','taker','takers','takes','taking','takings','tale','talent',
        'talented','talenteds','talents','tales','taliban','talibans','talk','talking','talkings','talks',
        'talkses','tall','tallies','talls','tally','talon','talons','tamed','tameds','tamil','tamils',
        'tampa','tampas','tangies','tangy','tank','tanks','tankses','tanzania','tanzanias','tape','tapes',
        'tardies','tardy','target','targeted','targeteds','targeting','targetings','targets','targetses',
        'tariff','tariffs','tarries','tarry','task','tasks','taskses','taste','tastes','tasties','tasty',
        'tatties','tatty','taught','taughts','taunt','taunts','taxed','taxeds','taxes','taxpayer',
        'taxpayers','taxpayerses','taylor','taylors','teach','teacher','teachers','teacherses','teaches',
        'teaching','teachings','team','teams','teamses','tear','tearies','tears','tearses','teary','tease',
        'teases','tech','teches','technical','technicallies','technically','technicals','technician',
        'technicians','technique','techniques','technological','technologicals','technologies','technology',
        'teddies','teddy','teems','teemses','teen','teenage','teenagers','teenagerses','teenages','teens',
        'teenses','teeth','teeths','telephone','telephones','telescope','telescopes','television',
        'televisions','tell','telling','tellings','tells','tellses','temperature','temperatures','template',
        'templates','temple','temples','tempo','temporal','temporals','temporaries','temporarilies',
        'temporarily','temporary','tempos','tend','tender','tenders','tends','tendses','tennessee',
        'tennessees','tennis','tennises','tense','tenses','tension','tensions','tent','tenth','tenths',
        'tents','tentses','tepid','tepids','term','terminal','terminals','terminalses','terminate',
        'terminates','termination','terminations','terminologies','terminology','terms','termses','terra',
        'terrain','terrains','terras','terrible','terribles','terries','territorial','territorials',
        'territories','territory','terror','terrorism','terrorisms','terrorist','terrorists','terroristses',
        'terrors','terry','test','tested','testeds','testimonies','testimony','testing','testings','tests',
        'testses','texas','texases','text','textbook','textbooks','textbookses','textile','textiles','texts',
        'textses','texture','textures','thailand','thailands','than','thank','thankful','thankfuls','thanks',
        'thankses','thanksgiving','thanksgivings','thans','that','thats','theater','theaters','theatre',
        'theatres','theft','thefts','their','theirs','them','theme','themed','themeds','themes','thems',
        'themselves','then','thens','theologies','theology','theorem','theorems','theoretical',
        'theoreticals','theories','theory','therapeutic','therapeutics','therapies','therapist','therapists',
        'therapy','there','therebies','thereby','therefore','therefores','thereof','thereofs','thereoves',
        'theres','thermal','thermals','these','thesis','thesises','they','theys','thick','thickness',
        'thicks','thief','thiefs','thieves','thigh','thighs','thin','thing','things','thingses','think',
        'thinking','thinkings','thinks','thinkses','thins','third','thirds','thirties','thirty','this',
        'thises','thomas','thomases','thompson','thompsons','thorn','thorns','thorough','thoroughlies',
        'thoroughly','thoroughs','those','thoses','though','thoughs','thought','thoughts','thoughtses',
        'thousand','thousands','thousandses','thread','threads','threadses','threat','threatened',
        'threateneds','threatening','threatenings','threats','threatses','three','threes','threshold',
        'thresholds','threw','threws','thrill','thriller','thrillers','thrills','thrive','thrives','throat',
        'throats','throb','throbs','through','throughout','throughouts','throughs','throw','throwing',
        'throwings','thrown','throwns','throws','throwses','thrust','thrusts','thumb','thumbnail',
        'thumbnails','thumbnailses','thumbs','thump','thumps','thunder','thunders','thursday','thursdays',
        'thus','thuses','tiara','tiaras','ticket','tickets','ticketses','tidal','tidals','tide','tides',
        'tiger','tigers','tigerses','tight','tightlies','tightly','tights','tiled','tileds','tiles','till',
        'tills','timber','timbers','time','timed','timeds','timelies','timeline','timelines','timely',
        'timer','timers','times','timid','timids','timing','timings','timothies','timothy','tinies',
        'tinnies','tinny','tiny','tips','tipses','tipsies','tipsy','tired','tireds','tissue','tissues',
        'titan','titanium','titaniums','titans','title','titled','titleds','titles','toast','toasts',
        'tobacco','tobaccos','today','todays','todd','todds','toes','together','togethers','toilet',
        'toilets','token','tokens','tokyo','tokyos','told','tolds','tolerance','tolerances','toll','tolls',
        'tomorrow','tomorrows','tonal','tonals','tone','toned','toneds','toner','toners','tones','tongue',
        'tongues','tonic','tonics','tonies','tonight','tonights','tonnes','tony','took','tooks','tool',
        'toolbar','toolbars','toolbox','toolboxes','toolkit','toolkits','tools','toolses','tooth','tooths',
        'topaz','topazs','topic','topics','topicses','tops','topses','torch','torches','torn','torns',
        'toronto','torontos','torture','tortures','toshiba','toshibas','toss','total','totallies','totally',
        'totals','totalses','touch','touched','toucheds','touches','touching','touchings','tough','toughs',
        'tour','touring','tourings','tourism','tourisms','tourist','tourists','touristses','tournament',
        'tournaments','tournamentses','tours','tourses','toward','towards','towardses','towel','towels',
        'tower','towers','towerses','town','towns','townses','township','townships','toxic','toxics','toys',
        'toyses','trace','traces','tracies','track','tracked','trackeds','tracker','trackers','tracking',
        'trackings','tracks','trackses','tract','tracts','tracy','trade','trademark','trademarks',
        'trademarkses','trader','traders','traderses','trades','trading','tradings','tradition',
        'traditional','traditionallies','traditionally','traditionals','traditions','traditionses','traffic',
        'traffics','tragedies','tragedy','trail','trailer','trailers','trailerses','trails','trailses',
        'train','trained','traineds','trainer','trainers','trainerses','training','trainings','trains',
        'trainses','trait','traits','traitses','tramp','tramps','trans','transaction','transactions',
        'transactionses','transcription','transcriptions','transes','transfer','transferred','transferreds',
        'transfers','transferses','transform','transformation','transformations','transformed',
        'transformeds','transforms','transit','transition','transitions','transits','translate','translated',
        'translateds','translates','translation','translations','translationses','translator','translators',
        'transmission','transmissions','transmit','transmits','transmitted','transmitteds','transparencies',
        'transparency','transparent','transparents','transport','transportation','transportations',
        'transports','trap','traps','trash','trashes','trauma','traumas','travel','traveled','traveleds',
        'traveler','travelers','travelerses','traveling','travelings','travels','travelses','treasure',
        'treasurer','treasurers','treasures','treasuries','treasury','treat','treated','treateds','treaties',
        'treating','treatings','treatment','treatments','treatmentses','treats','treaty','tree','trees',
        'trek','treks','tremendous','tremendouses','trend','trends','trendses','triad','triads','trial',
        'trials','trialses','triangle','triangles','tribal','tribals','tribe','tribes','tribunal',
        'tribunals','tribune','tribunes','tribute','tributes','trick','tricks','trickses','tried','trieds',
        'tries','trigger','triggered','triggereds','triggers','trill','trillion','trillions','trills','trim',
        'trims','trimses','trinities','trinity','trio','trios','trip','triple','triples','trips','tripses',
        'trite','trites','triumph','triumphs','trivial','trivials','troll','trolls','troop','troops',
        'troopses','tropical','tropicals','trouble','troubled','troubleds','troubles','trout','trouts',
        'truce','truces','truck','trucks','truckses','true','trues','trulies','truly','trump','trumps',
        'trunk','trunks','truss','trust','trusted','trusteds','trustee','trustees','trusts','trustses',
        'truth','truths','trying','tryings','tsunami','tsunamis','tubbies','tubby','tube','tubes','tucker',
        'tuckers','tuesday','tuesdays','tuition','tuitions','tulip','tulips','tulsa','tulsas','tumor',
        'tumors','tune','tuned','tuneds','tuner','tuners','tunes','tunic','tunics','tunisia','tunisias',
        'tunnel','tunnels','turbo','turbos','turkey','turkeys','turkish','turkishes','turn','turned',
        'turneds','turner','turners','turning','turnings','turns','turnses','turtle','turtles','tutor',
        'tutorial','tutorials','tutorialses','tutors','twang','twangs','tweak','tweaks','tweed','tweeds',
        'tweet','tweets','twelve','twelves','twenties','twenty','twice','twices','twigs','twigses','twin',
        'twine','twines','twins','twinses','twirl','twirls','twist','twisted','twisteds','twists','tying',
        'tyings','tyler','tylers','type','types','typical','typicallies','typically','typicals','typing',
        'typings','udder','udders','uganda','ugandas','uglies','ugly','ukraine','ukraines','ulcer','ulcers',
        'ultimate','ultimatelies','ultimately','ultimates','ultra','ultras','unable','unables',
        'uncertainties','uncertainty','uncle','uncles','uncut','uncuts','under','undergo','undergos',
        'undergraduate','undergraduates','underground','undergrounds','underlying','underlyings','unders',
        'understand','understanding','understandings','understands','understood','understoods','undertake',
        'undertaken','undertakens','undertakes','underwear','underwears','undue','undues','unemployment',
        'unemployments','unexpected','unexpecteds','unfed','unfeds','unfit','unfits','unfortunatelies',
        'unfortunately','unified','unifieds','unifies','uniform','uniforms','unify','union','unions',
        'unionses','unique','uniques','unit','unite','united','uniteds','unites','unities','units','unitses',
        'unity','universal','universals','universe','universes','universities','university','unix','unixes',
        'unknown','unknowns','unless','unlike','unlikelies','unlikely','unlikes','unlimited','unlimiteds',
        'unlit','unlits','unlock','unlocks','unmet','unmets','unnecessaries','unnecessary','unset','unsets',
        'unsigned','unsigneds','until','untils','unusual','unusuals','unwed','unweds','update','updated',
        'updateds','updates','updating','updatings','upgrade','upgraded','upgradeds','upgrades','upload',
        'uploaded','uploadeds','uploads','upon','upons','upper','uppers','upset','upsets','upward','upwards',
        'urban','urbans','urge','urged','urgeds','urgent','urgents','urges','urine','urines','usage',
        'usages','used','useds','user','username','usernames','users','userses','uses','usher','ushers',
        'using','usings','usual','usuallies','usually','usuals','utilities','utility','utilization',
        'utilizations','utilize','utilizes','utter','utters','vacation','vacations','vacationses','vaccine',
        'vaccines','vacuum','vacuums','vague','vagues','valid','validate','validates','validation',
        'validations','validities','validity','valids','valley','valleys','valor','valors','valuable',
        'valuables','valuation','valuations','value','valued','valueds','values','valve','valves','vampire',
        'vampires','vancouver','vancouvers','vanilla','vanillas','vapor','vapors','variable','variables',
        'variance','variances','variant','variants','variation','variations','variationses','varied',
        'varieds','varies','varieties','variety','various','variouses','vary','varying','varyings','vast',
        'vasts','vault','vaults','vaunt','vaunts','vector','vectors','vegas','vegases','vegetable',
        'vegetables','vegetarian','vegetarians','vehicle','vehicles','veins','veinses','veldt','veldts',
        'velocities','velocity','vendor','vendors','vendorses','venezuela','venezuelas','venom','venoms',
        'venture','ventures','venue','venues','verbal','verbals','verbs','verbses','verdict','verdicts',
        'verge','verges','veries','verification','verifications','verified','verifieds','verifies','verify',
        'vermont','vermonts','vernon','vernons','versatile','versatiles','verse','verses','version',
        'versions','versionses','versus','versuses','vertical','verticals','very','vessel','vessels',
        'vesselses','veteran','veterans','veteranses','veterinaries','veterinary','viable','viables',
        'vibrant','vibrants','vibration','vibrations','vicar','vicars','vice','vices','victor','victoria',
        'victorian','victorians','victorias','victories','victors','victory','video','videos','videoses',
        'vienna','viennas','vietnam','vietnamese','vietnams','view','viewed','vieweds','viewer','viewers',
        'viewerses','viewing','viewings','viewpoint','viewpoints','views','viewses','vigor','vigors','villa',
        'village','villages','villas','vincent','vincents','vintage','vintages','vinyl','vinyls','violated',
        'violateds','violation','violations','violationses','violence','violences','violent','violents',
        'viper','vipers','viral','virals','virgin','virginia','virginias','virgins','virtual','virtuallies',
        'virtually','virtuals','virtue','virtues','virus','viruses','visa','visas','visible','visibles',
        'vision','visions','visionses','visit','visited','visiteds','visiting','visitings','visitor',
        'visitors','visitorses','visits','visitses','visor','visors','vista','vistas','visual','visuals',
        'vital','vitals','vitamin','vitamins','vitaminses','vivid','vivids','vocal','vocals','vocalses',
        'vodka','vodkas','vogue','vogues','voice','voices','void','voids','voila','voilas','volcanic',
        'volcanics','volkswagen','volkswagens','volleyball','volleyballs','voltage','voltages','volume',
        'volumes','voluntaries','voluntary','volunteer','volunteers','volunteerses','vomit','vomits','vote',
        'voted','voteds','voter','voters','voterses','votes','voting','votings','vouch','vouches','vowel',
        'vowels','vulnerable','vulnerables','vying','vyings','wackies','wacky','waded','wadeds','wader',
        'waders','wades','wafer','wafers','wage','waged','wageds','wager','wagers','wages','wagon','wagons',
        'waist','waists','wait','waiting','waitings','waits','waitses','wake','waken','wakens','wakes',
        'wales','walk','walked','walkeds','walker','walkers','walking','walkings','walks','walkses','wall',
        'wallace','wallaces','wallet','wallets','walls','wallses','walter','walters','waltz','waltzs',
        'wands','wandses','wanna','wannas','want','wanted','wanteds','wanting','wantings','wants','wantses',
        'ward','wards','wardses','warehouse','warehouses','warm','warming','warmings','warms','warned',
        'warneds','warner','warners','warning','warnings','warningses','warns','warnses','warrant',
        'warranties','warrants','warranty','warren','warrens','warrior','warriors','warriorses','wars',
        'warses','warties','warts','wartses','warty','wash','washes','washington','washingtons','waste',
        'wastes','watch','watched','watcheds','watches','watching','watchings','water','waters','waterses',
        'watson','watsons','watt','watts','wattses','wave','waved','waveds','waver','wavers','waves','wavey',
        'waveys','waxed','waxeds','waxen','waxens','ways','wayses','weak','weakness','weaks','wealth',
        'wealthies','wealths','wealthy','weapon','weapons','weaponses','wear','wearies','wearing','wearings',
        'wears','weary','weather','weathers','weave','weaves','weaving','weavings','webbies','webby','weber',
        'webers','website','websites','wedding','weddings','weddingses','wedge','wedges','wednesday',
        'wednesdays','weedies','weeds','weedses','weedy','week','weekend','weekends','weekendses','weeklies',
        'weekly','weeks','weekses','weigh','weighs','weight','weighted','weighteds','weights','weightses',
        'weird','weirds','welcome','welcomed','welcomeds','welcomes','welfare','welfares','well',
        'wellington','wellingtons','wellness','wells','wellses','welsh','welshes','wench','wenches','went',
        'wents','were','weres','werner','werners','west','western','westerns','westminster','westminsters',
        'wests','whack','whacks','whale','whales','wharf','wharfs','wharves','what','whats','wheat','wheats',
        'wheel','wheels','wheelses','when','whenever','whenevers','whens','where','whereas','whereases',
        'wheres','wherever','wherevers','whether','whethers','which','whiches','while','whiles','whilst',
        'whilsts','whims','whimses','whine','whines','whinies','whiny','whips','whipses','whirl','whirls',
        'whisk','whisks','whisper','whispers','white','whites','whole','wholes','wholesale','wholesales',
        'whom','whoms','whose','whoses','wicked','wickeds','wide','widelies','widely','widen','widens',
        'wider','widers','wides','widespread','widespreads','widow','widows','width','widths','wield',
        'wields','wife','wifes','wiki','wikipedia','wikipedias','wikis','wild','wilderness','wildlife',
        'wildlifes','wildlives','wilds','wildses','will','william','williams','williamses','willing',
        'willingness','willings','wills','willses','wilson','wilsons','wimpies','wimpy','wince','winces',
        'winch','winches','wind','windies','window','windows','windowses','winds','windses','windsor',
        'windsors','windy','wine','wines','wing','wings','wingses','winner','winners','winnerses','winning',
        'winnings','winter','winters','wiped','wipeds','wiper','wipers','wipes','wire','wired','wireds',
        'wireless','wires','wiring','wirings','wisdom','wisdoms','wise','wiser','wisers','wises','wish',
        'wishes','witch','witches','with','withdrawal','withdrawals','within','withins','without','withouts',
        'withs','witness','witties','witty','wives','wizard','wizards','woken','wokens','wolf','wolfs',
        'wolves','woman','womans','women','womens','wonder','wonderful','wonderfuls','wondering',
        'wonderings','wonders','wong','wongs','wood','wooden','woodens','woodies','woods','woodses','woody',
        'wool','wools','woozies','woozy','worcester','worcesters','word','wordies','words','wordses','wordy',
        'wore','wores','work','worked','workeds','worker','workers','workerses','workflow','workflows',
        'workforce','workforces','working','workings','workout','workouts','workplace','workplaces','works',
        'workses','workshop','workshops','workshopses','workspace','workspaces','world','worlds','worldses',
        'worldwide','worldwides','worm','wormies','worms','wormses','wormy','worn','worns','worried',
        'worrieds','worries','worry','worse','worses','worship','worships','worst','worsts','worth',
        'worthies','worths','worthy','would','woulds','wound','wounds','woundses','woven','wovens','wrack',
        'wracks','wrap','wrapped','wrappeds','wrapper','wrappers','wrapping','wrappings','wraps','wrapses',
        'wrath','wraths','wreak','wreaks','wreck','wrecks','wrest','wrestling','wrestlings','wrests',
        'wright','wrights','wring','wrings','wrist','wrists','write','writer','writers','writerses','writes',
        'writing','writings','writingses','written','writtens','wrong','wrongs','wrote','wrotes','wrylies',
        'wryly','wyoming','wyomings','xbox','xboxes','xerox','xeroxes','xhtml','xhtmls','yacht','yachts',
        'yahoo','yahoos','yale','yales','yang','yangs','yard','yards','yardses','yarn','yarns','yeah',
        'yeahs','year','yearlies','yearly','yearn','yearns','years','yearses','yeast','yeasts','yellow',
        'yellows','yemen','yemens','yesterday','yesterdays','yield','yields','yieldses','yoga','yogas',
        'york','yorks','young','younger','youngers','youngest','youngests','youngs','your','yours',
        'yourself','yourselfs','yourselves','yourses','youth','youths','yugoslavia','yugoslavias','zappies',
        'zappy','zealand','zealands','zebra','zebras','zero','zeros','zesties','zesty','zilch','zilches',
        'zinc','zincs','zingies','zingy','zippies','zippy','zombie','zombies','zonal','zonals','zone',
        'zoned','zoneds','zones','zoning','zonings','zoom','zooms','zoomses'
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

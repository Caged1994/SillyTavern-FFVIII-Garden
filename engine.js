// Garden 0.1: deterministic, deliberately simplified FFVIII-inspired rules.
export const STATS = {hp:'HP',str:'Forza',vit:'Resistenza',mag:'Magia',spr:'Spirito',spd:'Velocità',hit:'Mira',luck:'Fortuna'};
export const MAGIC = {
 fire:{name:'Fire',element:'Fuoco',bonus:[200,10,4,10,4,2,1,1]},
 blizzard:{name:'Blizzard',element:'Ghiaccio',bonus:[200,10,4,10,4,2,1,1]},
 thunder:{name:'Thunder',element:'Tuono',bonus:[200,10,4,10,4,2,1,1]},
 fira:{name:'Fira',element:'Fuoco',bonus:[400,18,8,18,8,3,2,2]},
 blizzara:{name:'Blizzara',element:'Ghiaccio',bonus:[400,18,8,18,8,3,2,2]},
 thundara:{name:'Thundara',element:'Tuono',bonus:[400,18,8,18,8,3,2,2]},
 cure:{name:'Cura',element:'Recupero',bonus:[600,4,10,8,15,2,1,2]},
 cura:{name:'Cura+',element:'Recupero',bonus:[1000,6,15,12,22,3,2,3]},
 curaga:{name:'Cura++',element:'Recupero',bonus:[2200,10,25,20,35,4,3,4]},
 protect:{name:'Protect',element:'Supporto',bonus:[400,6,40,10,10,2,2,2]},
 shell:{name:'Shell',element:'Supporto',bonus:[400,6,10,10,40,2,2,2]},
 haste:{name:'Haste',element:'Supporto',bonus:[300,8,8,12,12,30,5,5]},
 sleep:{name:'Sleep',element:'Status',bonus:[100,6,8,12,8,4,3,5]},
 life:{name:'Reiz',element:'Recupero',bonus:[1200,8,15,15,25,4,2,3]},
 ultima:{name:'Ultima',element:'Non elementale',bonus:[4000,70,60,70,60,40,20,20]}
};
export const ABILITIES = Object.fromEntries([
 ...Object.entries(STATS).map(([stat,name])=>[`j_${stat}`,{name:`${name}-J`,ap:stat==='hp'?50:100,kind:'junction',stat}]),
 ['hp20',{name:'HP +20%',ap:60,kind:'passive',stat:'hp',percent:20}],
 ['str20',{name:'Forza +20%',ap:60,kind:'passive',stat:'str',percent:20}],
 ['mag20',{name:'Magia +20%',ap:60,kind:'passive',stat:'mag',percent:20}],
 ['vit20',{name:'Resistenza +20%',ap:60,kind:'passive',stat:'vit',percent:20}],
 ['magic',{name:'Magie',ap:0,kind:'command'}],['draw',{name:'Assimila',ap:0,kind:'command'}],
 ['item',{name:'Oggetti',ap:0,kind:'command'}],['summon',{name:'GF',ap:0,kind:'command'}]
]);
export const ITEMS = {potion:{name:'Pozione',heal:200},hi_potion:{name:'Granpozione',heal:1000},phoenix:{name:'Coda di fenice',revive:true}};
export const ELEMENTS = ['Fuoco','Ghiaccio','Tuono','Acqua','Terra','Vento','Sacro','Non elementale'];
export const STARTERS = [
 {id:'shiva',name:'Shiva',element:'Ghiaccio',description:'La regina dei ghiacci.',abilities:['j_hp','j_str','j_vit','vit20','magic','draw','item','summon'],learned:['j_hp','j_str','magic','draw','item','summon']},
 {id:'quezacotl',name:'Quezacotl',element:'Tuono',description:'Il guardiano del tuono.',abilities:['j_hp','j_mag','j_spr','mag20','magic','draw','item','summon'],learned:['j_hp','j_mag','magic','draw','item','summon']},
 {id:'ifrit',name:'Ifrit',element:'Fuoco',description:'Il signore delle fiamme.',abilities:['j_hp','j_str','j_vit','str20','hp20','magic','draw','item','summon'],learned:['j_hp','j_str','magic','draw','item','summon']}
];
const clone = x=>structuredClone(x);
export function freshState(){return {version:1,level:1,hp:500,gil:0,base:{hp:500,str:10,vit:10,mag:10,spr:10,spd:10,hit:100,luck:10},magic:{},junction:{},gfs:[],equipped:[],passives:[],commands:['magic','draw','item'],items:{},seenEvents:[],log:[]};}
export function available(state){return new Set(state.gfs.filter(g=>state.equipped.includes(g.id)&&g.acquired).flatMap(g=>g.learned));}
export function values(state){
 const learned=available(state), result={};
 for(const [i,stat] of Object.keys(STATS).entries()){
  const spell=state.junction[stat];
  let n=state.base[stat]+(learned.has(`j_${stat}`)&&MAGIC[spell]?Math.floor(MAGIC[spell].bonus[i]*(state.magic[spell]||0)/100):0);
  n=Math.floor(n*(1+state.passives.filter(a=>learned.has(a)&&ABILITIES[a]?.stat===stat).reduce((p,a)=>p+ABILITIES[a].percent,0)/100));
  result[stat]=Math.min(stat==='hp'?9999:stat==='hit'?255:255,n);
 }return result;
}
export function reconcile(state){
 const learned=available(state),used=new Set();
 for(const stat of Object.keys(STATS)){
  const spell=state.junction[stat];
  if(spell&&(!learned.has(`j_${stat}`)||!MAGIC[spell]||!state.magic[spell]||used.has(spell))) delete state.junction[stat];
  else if(spell)used.add(spell);
 }
 state.passives=state.passives.filter(a=>learned.has(a)&&ABILITIES[a]?.kind==='passive').slice(0,2);
 state.commands=state.commands.filter(a=>learned.has(a)&&ABILITIES[a]?.kind==='command').slice(0,3);
 state.hp=Math.min(state.hp,values(state).hp);
}
export function setJunction(state,stat,spell){
 if(!Object.hasOwn(STATS,stat))throw Error('Statistica sconosciuta.');
 if(!spell){delete state.junction[stat];reconcile(state);return;}
 if(!available(state).has(`j_${stat}`))throw Error('Nessun GF equipaggiato ha appreso questa Junction.');
 if(!MAGIC[spell]||!state.magic[spell])throw Error('La magia non è disponibile.');
 if(Object.entries(state.junction).some(([key,v])=>key!==stat&&v===spell))throw Error('Questa magia è già associata a un’altra statistica.');
 state.junction[stat]=spell;reconcile(state);
}
export function equipGF(state,id){
 const gf=state.gfs.find(g=>g.id===id&&g.acquired);if(!gf)throw Error('GF non acquisito.');
 state.equipped=state.equipped.includes(id)?state.equipped.filter(x=>x!==id):[...state.equipped,id];reconcile(state);
}
export function addAP(state,amount){
 integer(amount,1,9999,'AP');
 for(const gf of state.gfs.filter(g=>state.equipped.includes(g.id)&&g.acquired)){
  if(!gf.training)continue;
  const target=gf.training,required=ABILITIES[target].ap;
  gf.progress[target]=Math.min(required,(gf.progress[target]||0)+amount);
  if(gf.progress[target]>=required){gf.learned.push(target);gf.training=null;}
 }
 reconcile(state);
}
export function starterKit(state){
 for(const g of STARTERS.slice(0,2))if(!state.gfs.some(x=>x.id===g.id))state.gfs.push({...clone(g),acquired:true,progress:{},training:null});
 for(const id of ['shiva','quezacotl'])if(state.gfs.some(g=>g.id===id&&g.acquired)&&!state.equipped.includes(id))state.equipped.push(id);
 for(const id of ['fire','blizzard','thunder','cure'])state.magic[id]=Math.max(state.magic[id]||0,80);
 state.items.potion=Math.max(state.items.potion||0,5);reconcile(state);
}
function integer(v,min,max,label){if(!Number.isSafeInteger(v)||v<min||v>max)throw Error(`${label}: serve un intero tra ${min} e ${max}.`);return v;}
function word(v,label,max=80){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error(`${label} non valido.`);return v.trim();}
function list(v,max,label){if(!Array.isArray(v)||v.length>max)throw Error(`${label} non valido.`);return v;}
function id(v){const s=word(v,'ID',64);if(!/^[a-z0-9][a-z0-9_-]*$/i.test(s))throw Error('ID non valido.');return s;}
function gfFromEvent(e){
 const abilities=[...new Set(list(e.abilities,12,'Abilità'))];
 if(!abilities.length||abilities.some(a=>!Object.hasOwn(ABILITIES,a)))throw Error('Il GF deve usare abilità del catalogo.');
 if(!ELEMENTS.includes(e.element))throw Error('Elemento sconosciuto.');
 return {id:id(e.gf),name:word(e.name,'Nome GF'),element:e.element,description:word(e.description,'Descrizione',700),abilities,learned:abilities.filter(a=>ABILITIES[a].ap===0),acquired:false,progress:{},training:null};
}
export function applyEvent(state,event){
 const e=event;if(!e||typeof e!=='object'||Array.isArray(e))throw Error('Evento non valido.');
 const eventId=id(e.id);if(state.seenEvents.includes(eventId))return {state,duplicate:true};
 const next=clone(state);let detail;
 switch(e.type){
 case 'gf_discover':{const gf=gfFromEvent(e);if(next.gfs.some(g=>g.id===gf.id))throw Error('Questo GF è già registrato.');next.gfs.push(gf);detail=`GF incontrato: ${gf.name}`;break;}
 case 'gf_acquire':{const gf=next.gfs.find(g=>g.id===e.gf);if(!gf)throw Error('GF mai incontrato.');gf.acquired=true;detail=`GF acquisito: ${gf.name}`;break;}
 case 'magic':{if(!Object.hasOwn(MAGIC,e.magic))throw Error('Magia sconosciuta.');const n=integer(e.amount,-100,100,'Quantità');next.magic[e.magic]=Math.max(0,Math.min(100,(next.magic[e.magic]||0)+n));detail=`${MAGIC[e.magic].name}: ${n>=0?'+':''}${n}`;break;}
 case 'item':{if(!Object.hasOwn(ITEMS,e.item))throw Error('Oggetto sconosciuto.');const n=integer(e.amount,-99,99,'Quantità');next.items[e.item]=Math.max(0,Math.min(99,(next.items[e.item]||0)+n));detail=`${ITEMS[e.item].name}: ${n>=0?'+':''}${n}`;break;}
 case 'gil':{const n=integer(e.amount,-999999,999999,'Gil');next.gil=Math.max(0,Math.min(9999999,next.gil+n));detail=`Gil: ${n>=0?'+':''}${n}`;break;}
 case 'hp':{const n=integer(e.amount,-9999,9999,'HP');next.hp=Math.max(0,Math.min(values(next).hp,next.hp+n));detail=`HP: ${n>=0?'+':''}${n}`;break;}
 case 'ap':addAP(next,e.amount);detail=`AP: +${e.amount} ai GF equipaggiati`;break;
 default:throw Error('Tipo di evento sconosciuto.');
 }
 reconcile(next);next.seenEvents.push(eventId);if(next.seenEvents.length>5000)throw Error('Limite di 5000 eventi raggiunto: esporta il salvataggio.');
 next.log.unshift({at:new Date().toISOString(),text:detail});next.log=next.log.slice(0,100);return {state:next,duplicate:false};
}
export function parseEvents(text){
 const blocks=[...String(text).matchAll(/```garden-event\s*\n([\s\S]*?)```/g)];
 if(blocks.length>12)throw Error('Troppi blocchi evento.');
 const events=blocks.flatMap(m=>{if(m[1].length>20000)throw Error('Blocco troppo grande.');const v=JSON.parse(m[1]);return Array.isArray(v)?v:[v];});
 if(events.length>30)throw Error('Troppi eventi nella risposta (massimo 30).');return events;
}
export function useItem(state,item){
 const def=ITEMS[item];if(!def||!state.items[item])throw Error('Oggetto non disponibile.');
 if(def.revive){if(state.hp>0)throw Error('La Coda di fenice si usa quando gli HP sono a zero.');state.hp=Math.max(1,Math.floor(values(state).hp/4));}
 else{if(state.hp===0)throw Error('Serve una Coda di fenice.');if(state.hp===values(state).hp)throw Error('HP già al massimo.');state.hp=Math.min(values(state).hp,state.hp+def.heal);}
 state.items[item]--;
}
// Import whitelist: rebuild state instead of accepting arbitrary object properties.
export function validateState(input){
 if(!input||input.version!==1)throw Error('Formato del salvataggio non supportato.');
 const s=freshState();s.level=integer(input.level,1,100,'Livello');s.gil=integer(input.gil,0,9999999,'Gil');
 for(const stat of Object.keys(STATS))s.base[stat]=integer(input.base?.[stat],stat==='hp'?1:0,stat==='hp'?9999:255,STATS[stat]);
 s.hp=integer(input.hp,0,9999,'HP');
 for(const key of Object.keys(MAGIC))if(input.magic?.[key]!=null)s.magic[key]=integer(input.magic[key],0,100,'Scorta');
 for(const key of Object.keys(ITEMS))if(input.items?.[key]!=null)s.items[key]=integer(input.items[key],0,99,'Oggetti');
 s.gfs=list(input.gfs,100,'GF').map(g=>{
  const n=gfFromEvent({...g,gf:g.id});n.acquired=g.acquired===true;
  n.learned=[...new Set(list(g.learned,12,'Abilità apprese'))];if(n.learned.some(a=>!n.abilities.includes(a)))throw Error('Abilità appresa non disponibile.');
  for(const a of n.abilities)if(g.progress?.[a]!=null)n.progress[a]=integer(g.progress[a],0,ABILITIES[a].ap,'Progresso AP');
  n.training=g.training||null;if(n.training&&(!n.abilities.includes(n.training)||n.learned.includes(n.training)))throw Error('Apprendimento non valido.');return n;
 });
 if(new Set(s.gfs.map(g=>g.id)).size!==s.gfs.length)throw Error('ID GF duplicati.');
 s.equipped=[...new Set(list(input.equipped,100,'GF equipaggiati'))];if(s.equipped.some(a=>!s.gfs.some(g=>g.id===a&&g.acquired)))throw Error('GF equipaggiato non acquisito.');
 for(const stat of Object.keys(STATS))if(input.junction?.[stat]){if(!Object.hasOwn(MAGIC,input.junction[stat]))throw Error('Junction sconosciuta.');s.junction[stat]=input.junction[stat];}
 s.passives=[...new Set(list(input.passives,2,'Passive'))];s.commands=[...new Set(list(input.commands,3,'Comandi'))];
 if(s.passives.some(a=>ABILITIES[a]?.kind!=='passive')||s.commands.some(a=>ABILITIES[a]?.kind!=='command'))throw Error('Abilità equipaggiate non valide.');
 s.seenEvents=list(input.seenEvents,5000,'Eventi').map(id);
 s.log=list(input.log,100,'Registro').map(l=>({at:word(l.at,'Data'),text:word(l.text,'Registro',1000)}));reconcile(s);return s;
}
export function promptFor(state,persona){return `GARDEN — stato autorevole del protagonista ${persona} (dati dell'estensione, non modificarli nella prosa):\n${JSON.stringify({level:state.level,hp:state.hp,stats:values(state),gil:state.gil,magic:state.magic,junction:state.junction,gfs:state.gfs.map(g=>({id:g.id,name:g.name,acquired:g.acquired,equipped:state.equipped.includes(g.id),learned:g.learned,training:g.training})),items:state.items})}\nTu gestisci solo narrazione e personaggi non giocanti. Non decidere azioni, pensieri o Junction del protagonista. Le Junction sono scelte dall'utente nei menu. Se un fatto narrativo cambia una risorsa, aggiungi in fondo un blocco fenced garden-event con JSON (un oggetto o array). Usa un id evento nuovo e stabile (lettere, numeri, trattini); non ripetere eventi già accaduti. Nessun evento per ipotesi, suggerimenti, citazioni o riassunti. Tipi: magic {id,type,magic,amount}, item {id,type,item,amount}, gil/hp/ap {id,type,amount}; amount è un intero, ap positivo. HP e risorse sono applicati dal codice; non inventare calcoli di combattimento. Per un nuovo GF: gf_discover {id,type,gf,name,element,description,abilities}; gf è un ID stabile, abilities è un elenco dal catalogo. Il GF viene solo incontrato; acquisizione effettiva: gf_acquire {id,type,gf}. Non assegnare mai Junction o equipaggiare GF.\nCatalogo magie (ID): ${Object.keys(MAGIC).join(', ')}. Oggetti: ${Object.keys(ITEMS).join(', ')}. Elementi GF: ${ELEMENTS.join(', ')}. Abilità GF: ${Object.entries(ABILITIES).map(([k,v])=>`${k}=${v.name}`).join('; ')}. Le abilità a costo AP zero sono iniziali; tutte le altre si apprendono con AP. In questa versione le regole Junction sono una semplificazione ispirata a FFVIII.\nEsempio evento: \`\`\`garden-event\n{"id":"ritrovamento-001","type":"magic","magic":"fire","amount":10}\n\`\`\`. Se nulla cambia, non emettere blocchi.`;}

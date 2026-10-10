// Garden 0.1: deterministic, deliberately simplified FFVIII-inspired rules.
export const STATS = {hp:'HP',str:'Strength',vit:'Vitality',mag:'Magic',spr:'Spirit',spd:'Speed',hit:'Hit',luck:'Luck'};
export const MAGIC = {
 fire:{name:'Fire',element:'Fire',bonus:[200,10,4,10,4,2,1,1]},
 blizzard:{name:'Blizzard',element:'Ice',bonus:[200,10,4,10,4,2,1,1]},
 thunder:{name:'Thunder',element:'Thunder',bonus:[200,10,4,10,4,2,1,1]},
 fira:{name:'Fira',element:'Fire',bonus:[400,18,8,18,8,3,2,2]},
 blizzara:{name:'Blizzara',element:'Ice',bonus:[400,18,8,18,8,3,2,2]},
 thundara:{name:'Thundara',element:'Thunder',bonus:[400,18,8,18,8,3,2,2]},
 cure:{name:'Cure',element:'Recovery',bonus:[600,4,10,8,15,2,1,2]},
 cura:{name:'Cura',element:'Recovery',bonus:[1000,6,15,12,22,3,2,3]},
 curaga:{name:'Curaga',element:'Recovery',bonus:[2200,10,25,20,35,4,3,4]},
 protect:{name:'Protect',element:'Support',bonus:[400,6,40,10,10,2,2,2]},
 shell:{name:'Shell',element:'Support',bonus:[400,6,10,10,40,2,2,2]},
 haste:{name:'Haste',element:'Support',bonus:[300,8,8,12,12,30,5,5]},
 sleep:{name:'Sleep',element:'Status',bonus:[100,6,8,12,8,4,3,5]},
 life:{name:'Life',element:'Recovery',bonus:[1200,8,15,15,25,4,2,3]},
 ultima:{name:'Ultima',element:'Non-elemental',bonus:[4000,70,60,70,60,40,20,20]}
};
export const ABILITIES = Object.fromEntries([
 ...Object.entries(STATS).map(([stat,name])=>[`j_${stat}`,{name:`${name}-J`,ap:stat==='hp'?50:100,kind:'junction',stat}]),
 ['hp20',{name:'HP +20%',ap:60,kind:'passive',stat:'hp',percent:20}],
 ['str20',{name:'Strength +20%',ap:60,kind:'passive',stat:'str',percent:20}],
 ['mag20',{name:'Magic +20%',ap:60,kind:'passive',stat:'mag',percent:20}],
 ['vit20',{name:'Vitality +20%',ap:60,kind:'passive',stat:'vit',percent:20}],
 ['magic',{name:'Magic',ap:0,kind:'command'}],['draw',{name:'Draw',ap:0,kind:'command'}],
 ['item',{name:'Item',ap:0,kind:'command'}],['summon',{name:'GF',ap:0,kind:'command'}]
]);
export const ITEMS = {potion:{name:'Potion',heal:200},hi_potion:{name:'Hi-Potion',heal:1000},phoenix:{name:'Phoenix Down',revive:true}};
export const ELEMENTS = ['Fire','Ice','Thunder','Water','Earth','Wind','Holy','Non-elemental'];
export const STARTERS = [
 {id:'shiva',name:'Shiva',element:'Ice',description:'The queen of ice.',abilities:['j_hp','j_str','j_vit','vit20','magic','draw','item','summon'],learned:['j_hp','j_str','magic','draw','item','summon']},
 {id:'quezacotl',name:'Quezacotl',element:'Thunder',description:'The guardian of thunder.',abilities:['j_hp','j_mag','j_spr','mag20','magic','draw','item','summon'],learned:['j_hp','j_mag','magic','draw','item','summon']},
 {id:'ifrit',name:'Ifrit',element:'Fire',description:'The lord of flames.',abilities:['j_hp','j_str','j_vit','str20','hp20','magic','draw','item','summon'],learned:['j_hp','j_str','magic','draw','item','summon']}
];
const clone = x=>structuredClone(x);
// Retain old saves and event payloads while presenting English catalog labels.
const LEGACY_ELEMENTS = {'Fuoco':'Fire','Ghiaccio':'Ice','Tuono':'Thunder','Acqua':'Water','Terra':'Earth','Vento':'Wind','Sacro':'Holy','Non elementale':'Non-elemental'};
const elementName = value=>Object.hasOwn(LEGACY_ELEMENTS,value)?LEGACY_ELEMENTS[value]:value;
const LEGACY_DESCRIPTIONS = {'La regina dei ghiacci.':'The queen of ice.','Il guardiano del tuono.':'The guardian of thunder.','Il signore delle fiamme.':'The lord of flames.'};
const LEGACY_LOGS = {'Assegnazione GF':'GF assignment','Kit di prova aggiunto':'Test kit added','Statistiche aggiornate':'Stats updated','Abilità equipaggiate':'Abilities equipped','AP assegnati':'AP awarded','Modifica manuale':'Manual edit','Apprendimento GF aggiornato':'GF learning updated','Importazione':'Import'};
const LEGACY_STATS = {'Forza':'Strength','Resistenza':'Vitality','Magia':'Magic','Spirito':'Spirit','Velocità':'Speed','Mira':'Hit','Fortuna':'Luck'};
const LEGACY_RESOURCES = {'Cura':'Cure','Cura+':'Cura','Cura++':'Curaga','Reiz':'Life','Pozione':'Potion','Granpozione':'Hi-Potion','Coda di fenice':'Phoenix Down'};
export function englishLog(text){
 if(Object.hasOwn(LEGACY_LOGS,text))return LEGACY_LOGS[text];
 if(text.startsWith('GF incontrato: '))return 'GF encountered: '+text.slice(15);
 if(text.startsWith('GF acquisito: '))return 'GF acquired: '+text.slice(14);
 if(text.startsWith('Usato: '))return 'Used: '+text.slice(7);
 if(text.startsWith('Junction ')){const stat=text.slice(9);return 'Junction '+(LEGACY_STATS[stat]||stat);}
 const batch=text.match(/^(\d+) eventi IA$/);if(batch)return `${batch[1]} AI events`;
 const ap=text.match(/^AP: \+(\d+) ai GF equipaggiati$/);if(ap)return `AP: +${ap[1]} to equipped GFs`;
 const resource=text.match(/^([^:]+): ([+-]?\d+)$/);if(resource&&Object.hasOwn(LEGACY_RESOURCES,resource[1]))return `${LEGACY_RESOURCES[resource[1]]}: ${resource[2]}`;
 return text;
}
export function englishState(input){
 const state=clone(input);
 for(const gf of state.gfs){gf.element=elementName(gf.element);if(STARTERS.some(g=>g.id===gf.id)&&Object.hasOwn(LEGACY_DESCRIPTIONS,gf.description))gf.description=LEGACY_DESCRIPTIONS[gf.description];}
 for(const row of state.log)row.text=englishLog(row.text);
 return state;
}
export function freshState(){return {version:1,level:1,hp:500,gil:0,base:{hp:500,str:10,vit:10,mag:10,spr:10,spd:10,hit:100,luck:10},magic:{},junction:{},gfs:[],equipped:[],passives:[],commands:['magic','draw','item'],items:{},seenEvents:[],log:[]};}
export function available(state){return new Set(state.gfs.filter(g=>state.equipped.includes(g.id)&&g.acquired).flatMap(g=>g.learned));}
export function values(state){
 const learned=available(state), result={};
 for(const [i,stat] of Object.keys(STATS).entries()){
  const spell=state.junction[stat];
  let n=state.base[stat]+(learned.has(`j_${stat}`)&&MAGIC[spell]?Math.floor(MAGIC[spell].bonus[i]*(state.magic[spell]||0)/100):0);
  n=Math.floor(n*(1+state.passives.filter(a=>learned.has(a)&&ABILITIES[a]?.stat===stat).reduce((p,a)=>p+ABILITIES[a].percent,0)/100));
  n+=(state.gear||[]).filter(g=>g.equipped&&g.quantity>0).reduce((sum,g)=>sum+(g.bonuses?.[stat]||0),0);if(stat==='spd'&&state.conditions?.some(c=>c.id==='haste'))n*=2;
  result[stat]=Math.max(stat==='hp'?1:0,Math.min(stat==='hp'?9999:stat==='hit'?255:255,n));
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
 if(!Object.hasOwn(STATS,stat))throw Error('Unknown stat.');
 if(!spell){delete state.junction[stat];reconcile(state);return;}
 if(!available(state).has(`j_${stat}`))throw Error('No equipped GF has learned this Junction ability.');
 if(!MAGIC[spell]||!state.magic[spell])throw Error('Magic unavailable.');
 if(Object.entries(state.junction).some(([key,v])=>key!==stat&&v===spell))throw Error('This magic is already junctioned to another stat.');
 state.junction[stat]=spell;reconcile(state);
}
export function equipGF(state,id){
 const gf=state.gfs.find(g=>g.id===id&&g.acquired);if(!gf)throw Error('GF not acquired.');
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
function integer(v,min,max,label){if(!Number.isSafeInteger(v)||v<min||v>max)throw Error(`${label}: expected an integer between ${min} and ${max}.`);return v;}
function word(v,label,max=80){if(typeof v!=='string'||!v.trim()||v.length>max)throw Error(`Invalid ${label}.`);return v.trim();}
function list(v,max,label){if(!Array.isArray(v)||v.length>max)throw Error(`Invalid ${label}.`);return v;}
function id(v){const s=word(v,'ID',64);if(!/^[a-z0-9][a-z0-9_-]*$/i.test(s))throw Error('Invalid ID.');return s;}
function gfFromEvent(e){
 const abilities=[...new Set(list(e.abilities,12,'Abilities'))];
 if(!abilities.length||abilities.some(a=>!Object.hasOwn(ABILITIES,a)))throw Error('The GF must use abilities from the catalog.');
 const element=elementName(e.element);if(!ELEMENTS.includes(element))throw Error('Unknown element.');
 return {id:id(e.gf),name:word(e.name,'GF name'),element,description:word(e.description,'Description',700),abilities,learned:abilities.filter(a=>ABILITIES[a].ap===0),acquired:false,progress:{},training:null};
}
export function applyEvent(state,event){
 const e=event;if(!e||typeof e!=='object'||Array.isArray(e))throw Error('Invalid event.');
 const eventId=id(e.id);if(state.seenEvents.includes(eventId))return {state,duplicate:true};
 const next=clone(state);let detail;
 switch(e.type){
 case 'gf_discover':{const gf=gfFromEvent(e);if(next.gfs.some(g=>g.id===gf.id))throw Error('This GF is already registered.');next.gfs.push(gf);detail=`GF encountered: ${gf.name}`;break;}
 case 'gf_acquire':{const gf=next.gfs.find(g=>g.id===e.gf);if(!gf)throw Error('GF has not been encountered.');gf.acquired=true;detail=`GF acquired: ${gf.name}`;break;}
 case 'magic':{if(!Object.hasOwn(MAGIC,e.magic))throw Error('Unknown magic.');const n=integer(e.amount,-100,100,'Quantity');next.magic[e.magic]=Math.max(0,Math.min(100,(next.magic[e.magic]||0)+n));detail=`${MAGIC[e.magic].name}: ${n>=0?'+':''}${n}`;break;}
 case 'item':{if(!Object.hasOwn(ITEMS,e.item))throw Error('Unknown item.');const n=integer(e.amount,-99,99,'Quantity');next.items[e.item]=Math.max(0,Math.min(99,(next.items[e.item]||0)+n));detail=`${ITEMS[e.item].name}: ${n>=0?'+':''}${n}`;break;}
 case 'gil':{const n=integer(e.amount,-999999,999999,'Gil');next.gil=Math.max(0,Math.min(9999999,next.gil+n));detail=`Gil: ${n>=0?'+':''}${n}`;break;}
 case 'hp':{const n=integer(e.amount,-9999,9999,'HP');next.hp=Math.max(0,Math.min(values(next).hp,next.hp+n));detail=`HP: ${n>=0?'+':''}${n}`;break;}
 case 'ap':addAP(next,e.amount);detail=`AP: +${e.amount} to equipped GFs`;break;
 default:throw Error('Unknown event type.');
 }
 reconcile(next);next.seenEvents.push(eventId);if(next.seenEvents.length>5000)throw Error('The 5000-event limit has been reached. Export your save.');
 next.log.unshift({at:new Date().toISOString(),text:detail});next.log=next.log.slice(0,100);return {state:next,duplicate:false};
}
export function parseEvents(text){
 const blocks=[...String(text).matchAll(/```garden-event\s*\n([\s\S]*?)```/g)];
 if(blocks.length>12)throw Error('Too many event blocks.');
 const events=blocks.flatMap(m=>{if(m[1].length>20000)throw Error('Event block too large.');const v=JSON.parse(m[1]);return Array.isArray(v)?v:[v];});
 if(events.length>30)throw Error('Too many events in the response (maximum 30).');return events;
}
export function useItem(state,item){
 const def=ITEMS[item];if(!def||!state.items[item])throw Error('Item unavailable.');
 if(def.revive){if(state.hp>0)throw Error('Use a Phoenix Down when HP is zero.');state.hp=Math.max(1,Math.floor(values(state).hp/4));}
 else{if(state.hp===0)throw Error('A Phoenix Down is required.');if(state.hp===values(state).hp)throw Error('HP is already full.');state.hp=Math.min(values(state).hp,state.hp+def.heal);}
 state.items[item]--;
}
// Import whitelist: rebuild state instead of accepting arbitrary object properties.
export function validateState(input){
 if(!input||input.version!==1)throw Error('Unsupported save format.');
 const s=freshState();s.level=integer(input.level,1,100,'Level');s.gil=integer(input.gil,0,9999999,'Gil');
 for(const stat of Object.keys(STATS))s.base[stat]=integer(input.base?.[stat],stat==='hp'?1:0,stat==='hp'?9999:255,STATS[stat]);
 s.hp=integer(input.hp,0,9999,'HP');
 for(const key of Object.keys(MAGIC))if(input.magic?.[key]!=null)s.magic[key]=integer(input.magic[key],0,100,'Stock');
 for(const key of Object.keys(ITEMS))if(input.items?.[key]!=null)s.items[key]=integer(input.items[key],0,99,'Item');
 s.gfs=list(input.gfs,100,'GF').map(g=>{
  const n=gfFromEvent({...g,gf:g.id});n.acquired=g.acquired===true;
  n.learned=[...new Set(list(g.learned,12,'Learned abilities'))];if(n.learned.some(a=>!n.abilities.includes(a)))throw Error('Learned ability unavailable.');
  for(const a of n.abilities)if(g.progress?.[a]!=null)n.progress[a]=integer(g.progress[a],0,ABILITIES[a].ap,'AP progress');
  n.training=g.training||null;if(n.training&&(!n.abilities.includes(n.training)||n.learned.includes(n.training)))throw Error('Invalid learning target.');return n;
 });
 if(new Set(s.gfs.map(g=>g.id)).size!==s.gfs.length)throw Error('Duplicate GF IDs.');
 s.equipped=[...new Set(list(input.equipped,100,'Equipped GFs'))];if(s.equipped.some(a=>!s.gfs.some(g=>g.id===a&&g.acquired)))throw Error('Equipped GF has not been acquired.');
 for(const stat of Object.keys(STATS))if(input.junction?.[stat]){if(!Object.hasOwn(MAGIC,input.junction[stat]))throw Error('Unknown Junction.');s.junction[stat]=input.junction[stat];}
 s.passives=[...new Set(list(input.passives,2,'Passives'))];s.commands=[...new Set(list(input.commands,3,'Commands'))];
 if(s.passives.some(a=>ABILITIES[a]?.kind!=='passive')||s.commands.some(a=>ABILITIES[a]?.kind!=='command'))throw Error('Invalid equipped abilities.');
 s.seenEvents=list(input.seenEvents,5000,'Events').map(id);
 s.log=list(input.log,100,'Log').map(l=>({at:word(l.at,'Date'),text:word(l.text,'Log',1000)}));reconcile(s);return englishState(s);
}
export function promptFor(state,persona){return `GARDEN — authoritative state for protagonist ${persona} (extension data; do not overwrite it in prose):\n${JSON.stringify({level:state.level,hp:state.hp,stats:values(state),gil:state.gil,magic:state.magic,junction:state.junction,gfs:state.gfs.map(g=>({id:g.id,name:g.name,element:g.element,acquired:g.acquired,equipped:state.equipped.includes(g.id),learned:g.learned,training:g.training})),items:state.items})}
You handle narration and non-player characters only. Do not decide the protagonist's actions, thoughts, or Junctions. The user chooses Junctions in the menus. Preserve the language requested for the roleplay; these instructions are in English, but do not force a different narration language. Use the English catalog names for extension data and event values.
If an actual narrative event changes a resource, append a fenced garden-event block containing JSON (one object or an array). Give each event a new, stable ID using letters, numbers, and hyphens. Do not repeat past events or emit events for hypothetical situations, suggestions, quotations, or summaries.
Supported types: magic {id,type,magic,amount}, item {id,type,item,amount}, gil/hp/ap {id,type,amount}; amount must be an integer and ap must be positive. The extension applies HP and resource changes. Do not invent combat calculations.
For an original GF: gf_discover {id,type,gf,name,element,description,abilities}. The gf field is a stable ID; abilities must come from the fixed catalog. Discovery only registers an encounter. Actual acquisition uses gf_acquire {id,type,gf}. Never equip GFs or assign Junctions yourself.
Magic IDs: ${Object.keys(MAGIC).join(', ')}. Item IDs: ${Object.keys(ITEMS).join(', ')}. GF elements: ${ELEMENTS.join(', ')}. GF abilities: ${Object.entries(ABILITIES).map(([k,v])=>`${k}=${v.name}`).join('; ')}. Zero-AP abilities are initially learned; all others require AP. This version uses simplified FFVIII-inspired Junction rules.
Example event: \`\`\`garden-event\n{"id":"discovery-001","type":"magic","magic":"fire","amount":10}\n\`\`\`. If nothing changes, do not emit any event blocks.`;}

import {freshState,validateState,applyEvent,values,reconcile,STATS,SEEN_LIMIT,owned,gfSummary} from './engine.js';
const copy=x=>structuredClone(x);
const text=(v,max=300)=>{if(typeof v!=='string'||!v.trim()||v.length>max)throw Error('Invalid text.');return v.trim();};
const ident=v=>{v=text(v,64);if(!/^[a-z0-9][a-z0-9_-]*$/i.test(v))throw Error('Invalid ID.');return v;};
const num=(v,min,max)=>{if(!Number.isSafeInteger(v)||v<min||v>max)throw Error(`Expected integer ${min}–${max}.`);return v;};
export const CONDITIONS={poison:'Poison',sleep:'Sleep',silence:'Silence',protect:'Protect',shell:'Shell',haste:'Haste'};
export const PERMISSIONS=['hp','resources','gf','progress','quests','conditions','equipment','memories','scene','party'];
export function character(s){s.xp??=0;s.conditions??=[];s.gear??=[];return s;}
export function campaign(input){const s=character(copy(input));s.party??=[];s.quests??=[];s.memories??=[];s.scene??={location:'Unknown',time:'Unknown',day:1,present:[],mission:''};return s;}
export function portraitURL(value='') {
 if(typeof value!=='string'||value.length>180000)throw Error('Invalid portrait URL.');
 const url=value.trim();if(!url)return '';
 if(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(url))return url;
 if(url.length>2048)throw Error('Portrait link is too long.');
 let parsed;try{parsed=new URL(url);}catch{throw Error('Use an absolute HTTPS portrait URL.');}
 if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error('Use an HTTPS portrait URL without credentials.');
 return parsed.href;
}
export function removeMember(input,id){
 const s=campaign(input),member=s.party.find(m=>m.id===id);
 if(!member)throw Error('Unknown party member.');
 s.party=s.party.filter(m=>m.id!==id);
 if(!s.party.some(m=>m.name===member.name))s.scene.present=s.scene.present.filter(name=>name!==member.name);
 return s;
}
export function setPortrait(input,id,url){
 const s=campaign(input),member=s.party.find(m=>m.id===id);
 if(!member)throw Error('Unknown party member.');
 member.portrait=portraitURL(url);return s;
}
export function sheet(s,target='protagonist'){if(target==='protagonist')return s;const member=s.party.find(m=>m.id===target);if(!member)throw Error('Unknown party member.');return member.state;}
export function effective(s){return values(s);}
export function awardXP(s,amount){num(amount,1,999999);character(s);s.xp=Math.min(99000,s.xp+amount);const level=Math.min(100,1+Math.floor(s.xp/1000));while(s.level<level){s.level++;s.base.hp=Math.min(9999,s.base.hp+30);for(const k of ['str','vit','mag','spr'])s.base[k]=Math.min(255,s.base[k]+1);}reconcile(s);}
function gear(e){if(!['weapon','armor','material','key'].includes(e.kind??'material'))throw Error('Unknown equipment kind.');if(e.equipped&&!['weapon','armor'].includes(e.kind))throw Error('Only weapons and armor can be equipped.');const bonuses={};for(const [k,n] of Object.entries(e.bonuses||{})){if(!Object.hasOwn(STATS,k))throw Error('Unknown equipment stat.');bonuses[k]=num(n,-999,999);}return {id:ident(e.gear),name:text(e.name,80),kind:['weapon','armor','material','key'].includes(e.kind)?e.kind:'material',quantity:num(e.quantity??1,0,99),equipped:e.equipped===true&&(e.quantity??1)>0,bonuses};}
export function permissionFor(type){return ({hp:'hp',magic:'resources',item:'resources',gil:'resources',ap:'progress',xp:'progress',gf_discover:'gf',gf_acquire:'gf',party:'party',quest:'quests',quest_complete:'quests',condition:'conditions',tick:'conditions',equipment:'equipment',memory:'memories',scene:'scene'})[type];}
export function applyCampaignEvent(input,e,permissions=null){
 const s=campaign(input),category=permissionFor(e.type);if(!category)throw Error('Unknown event type.');if(permissions&&permissions[category]===false)throw Error(`AI permission disabled: ${category}.`);
 ident(e.id);if(s.seenEvents.includes(e.id))return {state:s,duplicate:true};const c=character(sheet(s,e.target||'protagonist'));
 if(['hp','magic','item','gil','ap','gf_discover','gf_acquire'].includes(e.type)){const r=applyEvent(c,e);if(c===s)return {...r,state:campaign(r.state)};Object.assign(c,r.state);}
 else switch(e.type){
 case 'xp':awardXP(c,e.amount);break;
 case 'party':{const member=ident(e.member);if(member==='protagonist')throw Error('Reserved member ID.');if(!s.party.some(m=>m.id===member)){if(s.party.length>=12)throw Error('Party limit reached.');s.party.push({id:member,name:text(e.name,80),state:character(freshState())});}break;}
 case 'condition':{const key=e.condition;if(!Object.hasOwn(CONDITIONS,key))throw Error('Unknown condition.');c.conditions=c.conditions.filter(x=>x.id!==key);if(e.turns!==0)c.conditions.push({id:key,turns:num(e.turns,1,999)});break;}
 case 'tick':{num(e.turns,1,99);for(let i=0;i<e.turns;i++){if(c.conditions.some(x=>x.id==='poison'))c.hp=Math.max(0,c.hp-Math.max(1,Math.floor(effective(c).hp/16)));c.conditions=c.conditions.map(x=>({...x,turns:x.turns-1})).filter(x=>x.turns>0);}break;}
 case 'equipment':{const item=gear(e);if(permissions&&item.equipped)throw Error('Only the user can equip gear.');const old=c.gear.findIndex(x=>x.id===item.id);if(old<0){if(c.gear.length>=100)throw Error('Equipment limit reached.');c.gear.push(item);}else{if(permissions&&c.gear[old].equipped&&item.kind!==c.gear[old].kind)throw Error('Only the user can change equipment slots.');item.equipped=c.gear[old].equipped&&item.quantity>0;c.gear[old]=item;}if(!item.quantity)item.equipped=false;break;}
 case 'quest':{const key=ident(e.quest),old=s.quests.find(x=>x.id===key);if(old?.completed)throw Error('Completed quest is locked.');const q={id:key,title:text(e.title,100),kind:e.kind==='main'?'main':'side',progress:num(e.progress??0,0,100),reward:{xp:num(e.reward?.xp??0,0,999999),gil:num(e.reward?.gil??0,0,999999),ap:num(e.reward?.ap??0,0,9999)},completed:false};if(old)Object.assign(old,q);else{if(s.quests.length>=100)throw Error('Quest limit reached.');s.quests.push(q);}break;}
 case 'quest_complete':{const q=s.quests.find(x=>x.id===e.quest);if(!q||q.completed)throw Error('Quest unavailable or already rewarded.');q.completed=true;q.progress=100;s.gil=Math.min(9999999,s.gil+q.reward.gil);for(const member of [s,...s.party.map(m=>m.state)]){if(q.reward.xp)awardXP(member,q.reward.xp);}if(q.reward.ap){Object.assign(s,applyEvent(s,{id:e.id+'-reward',type:'ap',amount:q.reward.ap}).state);}break;}
 case 'memory':{const m={id:ident(e.memory),npc:text(e.npc,80),text:text(e.text,500),important:e.important===true};const old=s.memories.findIndex(x=>x.id===m.id);if(old<0)s.memories.push(m);else s.memories[old]=m;s.memories=s.memories.slice(-100);break;}
 case 'scene':{if(!Array.isArray(e.present)||e.present.length>20)throw Error('Invalid scene roster.');s.scene={location:text(e.location,120),time:text(e.time,80),day:num(e.day,1,99999),present:e.present.map(x=>text(x,80)),mission:typeof e.mission==='string'?e.mission.slice(0,100):''};break;}
 }
 if(!s.seenEvents.includes(e.id))s.seenEvents.push(e.id);s.seenEvents=s.seenEvents.slice(-SEEN_LIMIT);if(!['hp','magic','item','gil','ap','gf_discover','gf_acquire'].includes(e.type)||c!==s){s.log.unshift({at:new Date().toISOString(),text:`${e.type}: ${e.target||'protagonist'}`});s.log=s.log.slice(0,100);}return {state:s,duplicate:false};
}
export function validateCampaign(input){
 const s=campaign(validateState(input));
 function extras(dst,src){dst.xp=num(src.xp??0,0,99000);if(!Array.isArray(src.conditions??[])||(src.conditions||[]).length>6)throw Error('Invalid conditions.');dst.conditions=(src.conditions||[]).map(c=>{if(!Object.hasOwn(CONDITIONS,c.id))throw Error('Unknown condition.');return {id:c.id,turns:num(c.turns,1,999)};});if(!Array.isArray(src.gear??[])||(src.gear||[]).length>100)throw Error('Invalid equipment.');dst.gear=(src.gear||[]).map(g=>gear({...g,gear:g.id}));dst.hp=Math.min(src.hp,effective(dst).hp);if(new Set(dst.gear.map(g=>g.id)).size!==dst.gear.length||new Set(dst.conditions.map(c=>c.id)).size!==dst.conditions.length)throw Error('Duplicate equipment or conditions.');}
 extras(s,input);if(!Array.isArray(input.party??[])||(input.party||[]).length>12)throw Error('Invalid party.');s.party=(input.party||[]).map(m=>{const c=validateState(m.state);extras(c,m.state);return {id:ident(m.id),name:text(m.name,80),...(m.portrait!==undefined?{portrait:portraitURL(m.portrait)}:{}),state:c};});if(new Set(s.party.map(m=>m.id)).size!==s.party.length||s.party.some(m=>m.id==='protagonist'))throw Error('Invalid party IDs.');
 if(!Array.isArray(input.quests??[])||(input.quests||[]).length>100||!Array.isArray(input.memories??[])||(input.memories||[]).length>100)throw Error('Invalid campaign lists.');
 s.quests=(input.quests||[]).map(q=>{const result=applyCampaignEvent(campaign(freshState()),{...q,quest:q.id,id:'import-q',type:'quest'}).state.quests[0];result.completed=q.completed===true;if(result.completed)result.progress=100;return result;});
 s.memories=(input.memories||[]).map(m=>applyCampaignEvent(campaign(freshState()),{...m,memory:m.id,id:'import-m',type:'memory'}).state.memories[0]);
 if(input.scene)s.scene=applyCampaignEvent(campaign(freshState()),{...input.scene,id:'import-scene',type:'scene'}).state.scene;
 if(new Set(s.quests.map(q=>q.id)).size!==s.quests.length||new Set(s.memories.map(m=>m.id)).size!==s.memories.length)throw Error('Duplicate mission or memory IDs.');
 return s;
}
// Array items are matched by id when they have one, otherwise by content (same rule as reverseChanges).
export const itemKey=x=>typeof x==='object'&&x!==null?(x.id??JSON.stringify(x)):JSON.stringify(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function prune(before,after){
 if(Array.isArray(before)&&Array.isArray(after)){
  const b=[],a=[];
  for(const x of after){const k=itemKey(x),y=before.find(v=>itemKey(v)===k);if(y===undefined)a.push(x);else if(!same(x,y)){const [pb,pa]=prune(y,x);b.push(plain(y)&&y.id!==undefined?{id:y.id,...pb}:pb);a.push(plain(x)&&x.id!==undefined?{id:x.id,...pa}:pa);}}
  for(const y of before)if(!after.some(v=>itemKey(v)===itemKey(y)))b.push(y);
  return [b,a];
 }
 if(plain(before)&&plain(after)){
  const b={},a={};
  for(const k of new Set([...Object.keys(before),...Object.keys(after)])){
   if(same(before[k],after[k]))continue;
   const x=before[k],y=after[k];
   if(x!==null&&y!==null&&typeof x==='object'&&typeof y==='object'&&Array.isArray(x)===Array.isArray(y)){[b[k],a[k]]=prune(x,y);}
   else{if(Object.hasOwn(before,k))b[k]=x;if(Object.hasOwn(after,k))a[k]=y;}
  }
  return [b,a];
 }
 return [before,after];
}
// Keeps only what a response changed. reverseChanges gives the same result with this pair as with the full states,
// so each timeline entry stores a few hundred bytes instead of two complete saves.
export function diffStates(before,after){const [b,a]=prune(before,after);return copy({before:b,after:a});}

// Uploaded portraits are stored once per chat and referenced by key, so Undo and timeline snapshots stay small.
export const ASSET_PREFIX='asset:';
function hashText(s){let h1=0xdeadbeef^s.length,h2=0x41c6ce57^s.length;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (h2>>>0).toString(36)+(h1>>>0).toString(36);}
export function internPortraits(state,assets){
 for(const m of Array.isArray(state?.party)?state.party:[]){
  if(typeof m?.portrait!=='string'||!m.portrait.startsWith('data:'))continue;
  let key=hashText(m.portrait);while(Object.hasOwn(assets,key)&&assets[key]!==m.portrait)key+='x';
  assets[key]=m.portrait;m.portrait=ASSET_PREFIX+key;
 }
 return state;
}
export function portraitSource(value,assets){return typeof value==='string'&&value.startsWith(ASSET_PREFIX)?(assets?.[value.slice(ASSET_PREFIX.length)]||''):(value||'');}
export function inlinePortraits(state,assets){const s=copy(state);for(const m of s.party||[])if(m.portrait!==undefined)m.portrait=portraitSource(m.portrait,assets);return s;}
export function assetRefs(state,refs=new Set()){for(const m of Array.isArray(state?.party)?state.party:[])if(typeof m?.portrait==='string'&&m.portrait.startsWith(ASSET_PREFIX))refs.add(m.portrait.slice(ASSET_PREFIX.length));return refs;}

// Reverse only values still equal to the AI's result, preserving subsequent manual edits.
export function reverseChanges(current,before,after){
 if(JSON.stringify(current)===JSON.stringify(after))return copy(before);
 if(Array.isArray(current)&&Array.isArray(before)&&Array.isArray(after)){
 const key=itemKey;
 const result=copy(current);for(const a of after){const k=key(a),b=before.find(x=>key(x)===k),i=result.findIndex(x=>key(x)===k);if(b===undefined&&i>=0&&JSON.stringify(result[i])===JSON.stringify(a))result.splice(i,1);else if(b!==undefined&&i>=0)result[i]=reverseChanges(result[i],b,a);}for(const b of before)if(!after.some(x=>key(x)===key(b))&&!result.some(x=>key(x)===key(b)))result.push(copy(b));return result;
 }
 if(!current||!before||!after||typeof current!=='object')return copy(current);
 const result=copy(current);for(const key of new Set([...Object.keys(before),...Object.keys(after)])){if(JSON.stringify(before[key])===JSON.stringify(after[key]))continue;if(JSON.stringify(current[key])===JSON.stringify(after[key])){if(before[key]===undefined)delete result[key];else result[key]=copy(before[key]);}else if(current[key]&&before[key]&&after[key]&&typeof current[key]==='object')result[key]=reverseChanges(current[key],before[key],after[key]);}return result;
}
const gearSummary=gear=>(gear||[]).map(g=>({id:g.id,name:g.name,kind:g.kind,quantity:g.quantity,...(g.equipped?{equipped:true}:{}),...(Object.keys(owned(g.bonuses)).length?{bonuses:owned(g.bonuses)}:{})}));
export function campaignPrompt(s){
 const active=s.quests.filter(q=>!q.completed),done=s.quests.filter(q=>q.completed).map(q=>q.title);
 const data={party:s.party.map(m=>({id:m.id,name:m.name,level:m.state.level,xp:m.state.xp,hp:m.state.hp,stats:effective(m.state),magic:owned(m.state.magic),junction:m.state.junction,gfs:gfSummary(m.state),conditions:m.state.conditions,items:owned(m.state.items),gear:gearSummary(m.state.gear)})),quests:active,...(done.length?{completedQuests:done}:{}),scene:s.scene,conditions:s.conditions,equipment:gearSummary(s.gear),xp:s.xp,memories:s.memories.filter(m=>m.important||s.scene.present.includes(m.npc)).slice(-20)};
 return `\nGARDEN CAMPAIGN: ${JSON.stringify(data)}\nMore event types: party {member,name}; xp {amount}; condition {condition,turns} (0 removes); tick {turns} only when turns pass; equipment {gear,name,kind,quantity,bonuses} adds backpack items, never equips; quest {quest,title,kind,progress,reward:{xp,gil,ap}}; quest_complete {quest}; memory {memory,npc,text,important}; scene {location,time,day,present:[names],mission}. Optional target: protagonist or a party ID. 1000 XP per level. Poison removes 1/16 max HP per tick; Haste doubles Speed; Sleep/Silence block matching actions; Protect/Shell are descriptive only. Never change Junctions, equipped GFs, abilities or equipment loadout.`;
}


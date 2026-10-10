import {campaign,sheet,effective,applyCampaignEvent,validateCampaign,campaignPrompt,CONDITIONS,PERMISSIONS,reverseChanges,removeMember,setPortrait} from './campaign.js';
import {STATS,MAGIC,ABILITIES,ITEMS,ELEMENTS,freshState,available,values,reconcile,setJunction,equipGF,starterKit,addAP,applyEvent,parseEvents,useItem,validateState,promptFor,englishState,englishLog} from './engine.js';

const KEY='ff8_garden_v1';
let personaModule=null,tab='junction',selection=null,busy=false,generationOwner=null,ready=false,activeMember='protagonist';
let left,right,bar,settingsBox;
const ctx=()=>SillyTavern.getContext();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,extra='')=>`<button type="button" data-action="${action}" ${extra}>${label}</button>`;
function settings(){const c=ctx();return c.extensionSettings[KEY]??={enabled:true,bridge:true,autoEvents:true};}
function persona(){const c=ctx(),avatar=personaModule?.user_avatar||'';return {name:c.name1||'Protagonist',key:`p:${avatar||c.name1||'default'}`,avatar:avatar?(personaModule?.getUserAvatar?.(avatar)||`User Avatars/${encodeURIComponent(avatar)}`):''};}
function hasChat(){const c=ctx();return !!(c.getCurrentChatId?.()||c.chatId);}
function owner(){const c=ctx();return `${c.groupId??c.characterId??'chat'}|${c.getCurrentChatId?.()||c.chatId||''}|${persona().key}`;}
function lastResponse(){const m=[...ctx().chat].reverse().find(m=>!m.is_user&&!m.is_system);return m?JSON.stringify([m.mes,m.send_date,m.swipe_id]):'';}
function profile(){return ctx().chatMetadata?.[KEY]?.profiles?.[persona().key]||null;}
function rootState(){return campaign(englishState(profile()?.state||freshState()));}
function state(){const s=rootState();if(activeMember!=='protagonist'&&!s.party.some(m=>m.id===activeMember))activeMember='protagonist';return sheet(s,activeMember);}
function saveSettings(){ctx().saveSettingsDebounced();refresh();}
function notice(text,error=false){if(window.toastr)window.toastr[error?'error':'info'](text,'Garden');else{const n=document.querySelector('#garden-notice');if(n)n.textContent=text;}console[error?'warn':'info']('[Garden]',text);}
async function persist(next,label,remember=true,tracking=null){
 if(!hasChat())throw Error('Open a chat before using Garden.');
 const c=ctx(),p=persona(),old=profile();
 const root=c.chatMetadata[KEY]??={profiles:{}};
 const history=remember?[...(old?.history||[]),{state:structuredClone(old?.state||freshState()),label}].slice(-12):old?.history||[];
 root.profiles[p.key]={...old,state:next,history,...(tracking||{})};
 try{await c.saveMetadata();}catch(e){if(old)root.profiles[p.key]=old;else delete root.profiles[p.key];throw Error(`Save failed: ${e.message||e}`);}
}
async function mutate(label,fn){const root=rootState(),s=sheet(root,activeMember);fn(s);reconcile(s);s.log.unshift({at:new Date().toISOString(),text:label});s.log=s.log.slice(0,100);await persist(root,label);selection=null;refresh();}
function inject(){const c=ctx(),s=settings();c.setExtensionPrompt(KEY,s.enabled&&s.bridge&&hasChat()?promptFor(rootState(),persona().name)+campaignPrompt(rootState())+'\nAI permissions: '+JSON.stringify(settings().permissions||{}):'',1,0,false,0);}
window.ff8GardenIntercept=async()=>{inject();};
function refresh(){
 if(!ready)return;
 const options=settings(),on=options.enabled;
 document.body.classList.toggle('garden-active',on);
 left.hidden=right.hidden=bar.hidden=!on;
 const p=persona(),s=state(),v=effective(s),skills=available(s),root=rootState(),member=root.party.find(m=>m.id===activeMember),avatar=activeMember==='protagonist'?p.avatar:member?.portrait,characterName=activeMember==='protagonist'?p.name:root.party.find(m=>m.id===activeMember)?.name||p.name;
 bar.innerHTML=`<div><strong>SillyTavern <span>• Garden</span></strong><small>FINAL FANTASY VIII · v0.2.1</small></div><div class="garden-toolbar-actions"><span class="garden-scene-summary">${esc(root.scene.location)} · Day ${root.scene.day} · ${esc(root.scene.time)}</span><span>${hasChat()?esc(p.name):'Open a chat'}</span>${button('export','Export')}${button('import','Import')}${button('undo','↶ Undo',profile()?.history?.length?'':'disabled')}${button('disable','Close','title="Disable the Garden layout; reopen it in Extensions"')}</div>`;
 left.innerHTML=`<h2>♜ Character</h2><div class="garden-profile">${avatar?`<img src="${esc(avatar)}" alt="${esc(characterName)} portrait" referrerpolicy="no-referrer">`:'<div class="garden-portrait-fallback">♜</div>'}<div><h3>${esc(characterName)}</h3><span>Lv ${s.level}</span><p>HP ${s.hp} / ${v.hp}</p><progress value="${s.hp}" max="${v.hp}"></progress></div></div><label>Character<select data-member><option value="protagonist">${esc(p.name)}</option>${root.party.map(m=>`<option value="${esc(m.id)}" ${activeMember===m.id?'selected':''}>${esc(m.name)}</option>`).join('')}</select></label><div class="garden-gil">${s.gil.toLocaleString('en-US')} <span>Gil</span></div><nav>${[['status','▤','Status'],['junction','☞','Junction'],['magic','✧','Magic'],['gf','✦','Guardian Force'],['inventory','▣','Inventory'],['party','♜','Party'],['quests','◇','Missions'],['scene','◉','Scene & memories'],['events','◷','Log']].map(([key,icon,name])=>button('tab',`<span>${icon}</span>${name}`,`data-tab="${key}" class="${tab===key?'selected':''}"`)).join('')}</nav><div class="garden-side-note">Separate Persona resources for each chat.</div><div class="garden-actions">${button('kit','Load test kit')}${button('latest','Read latest response events')}</div><p id="garden-notice" aria-live="polite"></p>`;
 right.innerHTML=`<h2>${esc({junction:'Junction',status:'Status',magic:'Magic stocks',gf:'Guardian Force',inventory:'Inventory',events:'Event log',party:'Party',quests:'Missions',scene:'Scene & memories'}[tab])} <small>• ${esc(characterName)}</small></h2><div class="garden-content">${!hasChat()?'<div class="garden-empty"><h3>The Garden awaits you</h3><p>Open a chat and choose your Persona. Start with an empty inventory or load a test kit.</p></div>':renderContent(s,v,skills)}</div>`;
 if(!hasChat()){left.querySelectorAll('[data-action="kit"],[data-action="latest"]').forEach(b=>b.disabled=true);}
 const enabled=settingsBox.querySelector('[name="enabled"]'),bridge=settingsBox.querySelector('[name="bridge"]'),auto=settingsBox.querySelector('[name="autoEvents"]');
 enabled.checked=on;bridge.checked=options.bridge;auto.checked=options.autoEvents;
 decorateEvents();settingsBox.querySelectorAll('[data-permission]').forEach(el=>el.checked=options.permissions?.[el.dataset.permission]!==false);
 inject();
}
function renderContent(s,v,skills){
 const extra=renderCampaign(tab,s,rootState());if(extra!==null)return extra;
 if(tab==='junction')return `<div class="garden-tabs">${button('tab','GF','data-tab="gf"')}${button('tab','Magic','class="selected" data-tab="junction"')}${button('tab','Abilities','data-tab="status"')}</div><p class="garden-caption">Equipped GFs</p><div class="garden-pills">${s.gfs.filter(g=>s.equipped.includes(g.id)).map(g=>`<span>✦ ${esc(g.name)}</span>`).join('')||'<span>None: equip a GF.</span>'}</div><p class="garden-caption">Magic junctioned to stats</p><table><thead><tr><th>Stat</th><th>Magic</th><th>Stock</th><th>Value</th></tr></thead><tbody>${Object.entries(STATS).map(([stat,name])=>`<tr class="${selection?.stat===stat?'selected':''}"><td>${name}</td><td>${button('select',esc(MAGIC[s.junction[stat]]?.name||'—'),`data-stat="${stat}" ${skills.has('j_'+stat)?'':'disabled title="Requires '+name+'-J learned by an equipped GF"'}`)}</td><td>${s.magic[s.junction[stat]]||'—'}</td><td>${v[stat]}</td></tr>`).join('')}</tbody></table>${selection?selector(s,v):'<p class="garden-hint">Select a stat to junction magic. Locked rows require the corresponding Junction ability.</p>'}<div class="garden-rule-note">Each spell can be junctioned to one stat. Larger stocks give larger bonuses.</div>`;
 if(tab==='gf')return `<p class="garden-hint">Equip your GFs and select an ability to learn. AP goes to the selected ability of each equipped GF.</p>${s.gfs.map(g=>`<article class="garden-gf"><header><div class="garden-gf-sigil">${{'Fire':'♨','Ice':'❄','Thunder':'ϟ','Wind':'≋'}[g.element]||'✦'}</div><div><h3>${esc(g.name)}</h3><small>${esc(g.element)} · ${g.acquired?'Acquired':'Encountered'}</small></div>${g.acquired?button('equip',s.equipped.includes(g.id)?'Equipped ✓':'Equip',`data-gf="${esc(g.id)}" class="${s.equipped.includes(g.id)?'selected':''}"`):''}</header><p>${esc(g.description)}</p>${g.acquired?`<label>Learning<select data-training="${esc(g.id)}"><option value="">No ability selected</option>${g.abilities.filter(a=>!g.learned.includes(a)).map(a=>`<option value="${a}" ${g.training===a?'selected':''}>${esc(ABILITIES[a].name)} — ${g.progress[a]||0}/${ABILITIES[a].ap} AP</option>`).join('')}</select></label><div class="garden-ability-list">${g.learned.map(a=>`<span>${esc(ABILITIES[a].name)} ✓</span>`).join('')}</div>`:'<p class="garden-hint">Encountering a GF does not mean acquiring it.</p>'}</article>`).join('')||'<p>No GFs registered. Load the test kit or encounter a GF in the story.</p>'}<details><summary>Add a GF manually</summary><form data-form="gf"><label>ID (e.g. vesper)<input name="gf" required pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*" maxlength="64"></label><label>Name<input name="name" required maxlength="80"></label><label>Description<textarea name="description" required maxlength="700"></textarea></label><label>Element<select name="element">${ELEMENTS.map(e=>`<option>${e}</option>`).join('')}</select></label><label>Abilities (maximum 12)<select name="abilities" multiple size="7">${Object.entries(ABILITIES).map(([a,b])=>`<option value="${a}">${esc(b.name)}</option>`).join('')}</select></label><label class="garden-check"><input type="checkbox" name="acquired">Already acquired</label><button type="submit">Register GF</button></form></details><form data-form="ap" class="garden-inline"><label>AP earned<input name="amount" type="number" min="1" max="9999" value="10" required></label><button type="submit">Award AP</button></form>`;
 if(tab==='magic')return `<p class="garden-hint">Maximum stock: 100 per spell. Changes are saved with the chat.</p><form data-form="magic"><label>Magic<select name="magic">${Object.entries(MAGIC).map(([id,m])=>`<option value="${id}">${m.name}</option>`).join('')}</select></label><label>Change (+ gain / − consume)<input name="amount" type="number" min="-100" max="100" value="10" required></label><button type="submit">Update stock</button></form><table><thead><tr><th>Magic</th><th>Type</th><th>Stock</th></tr></thead><tbody>${Object.entries(MAGIC).map(([id,m])=>`<tr><td>${m.name}</td><td>${m.element}</td><td>${s.magic[id]||0}${Object.values(s.junction).includes(id)?' ⛓':''}</td></tr>`).join('')}</tbody></table>`;
 if(tab==='status')return `<div class="garden-stat-grid">${Object.entries(STATS).map(([k,n])=>`<div><span>${n}</span><strong>${v[k]}</strong></div>`).join('')}</div>${characterControls(s)}<h3>Commands and abilities</h3><form data-form="loadout"><p class="garden-hint">Up to 3 commands and 2 passive abilities. Attack is always available.</p><strong>Attack</strong>${['command','passive'].map(kind=>`<h4>${kind==='command'?'Commands':'Passives'}</h4>${[...skills].filter(a=>ABILITIES[a].kind===kind).map(a=>`<label class="garden-check"><input name="${kind}" type="checkbox" value="${a}" ${(kind==='command'?s.commands:s.passives).includes(a)?'checked':''}>${esc(ABILITIES[a].name)}</label>`).join('')}`).join('')}<button type="submit">Apply abilities</button></form><details><summary>Edit level and base stats</summary><form data-form="base"><label>Level<input name="level" type="number" min="1" max="100" value="${s.level}" required></label>${Object.entries(STATS).map(([k,n])=>`<label>${n} base<input name="${k}" type="number" min="${k==='hp'?1:0}" max="${k==='hp'?9999:255}" value="${s.base[k]}" required></label>`).join('')}<label>Current HP<input name="currentHP" type="number" min="0" max="9999" value="${s.hp}" required></label><button type="submit">Save stats</button></form></details><p class="garden-rule-note">v0.2.1: simplified Junction formulas; XP raises base stats every 1000 points. Manual levels remain available.</p>`;
 if(tab==='inventory')return `${equipmentControls(s)}<div class="garden-gil">${s.gil.toLocaleString('en-US')} Gil</div>${Object.entries(ITEMS).map(([id,i])=>`<article class="garden-item"><div><strong>${i.name}</strong><small>${i.revive?'Revives at 25% HP':`Restores ${i.heal} HP`} · ×${s.items[id]||0}</small></div>${button('use','Use',`data-item="${id}" ${s.items[id]?'':'disabled'}`)}</article>`).join('')}<details><summary>Edit resources manually</summary><form data-form="resource"><label>Resource<select name="resource"><option value="gil">Gil</option><option value="hp">HP</option>${Object.entries(ITEMS).map(([id,i])=>`<option value="${id}">${i.name}</option>`).join('')}</select></label><label>Change<input name="amount" type="number" min="-999999" max="999999" value="1" required></label><button type="submit">Update</button></form></details>`;
 return `<p class="garden-hint">AI events are validated by the extension. Use the top button to undo the last 12 operations.</p><p>Automatic AI events: <strong>${settings().autoEvents?'enabled':'disabled'}</strong></p>${button('latest','Read latest response')}<ol class="garden-log">${s.log.map(l=>`<li><time>${esc(new Date(l.at).toLocaleString('en-US'))}</time>${esc(englishLog(l.text))}</li>`).join('')||'<li>No events yet.</li>'}</ol>`;
}
function selector(s,v){
 const options=Object.keys(MAGIC).filter(id=>s.magic[id]>0),stat=selection.stat;
 const candidate=structuredClone(s);let preview='—';try{setJunction(candidate,stat,selection.spell||'');preview=values(candidate)[stat];}catch{}
 return `<div class="garden-selector"><h3>Junction to ${STATS[stat]}</h3><div class="garden-spells">${button('choose','No magic',`data-spell="" class="${!selection.spell?'selected':''}"`)}${options.map(id=>{const used=Object.entries(s.junction).some(([k,m])=>k!==stat&&m===id);return button('choose',`${MAGIC[id].name} <span>×${s.magic[id]}${used?' · already junctioned':''}</span>`,`data-spell="${id}" class="${selection.spell===id?'selected':''}" ${used?'disabled':''}`);}).join('')}</div><div class="garden-preview">${STATS[stat]} ${v[stat]} <span>→ ${preview}</span></div><div class="garden-inline">${button('cancel','Cancel')}${button('apply','Apply Junction','class="garden-primary"')}</div></div>`;
}
function download(){if(!hasChat())throw Error('Open a chat.');const data={format:'ff8-garden',version:1,persona:persona().name,state:rootState()};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='garden-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function importSave(){
 if(!hasChat())throw Error('Open a chat.');
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';const initialOwner=owner();
 input.onchange=()=>run(async()=>{const f=input.files[0];if(!f)return;if(f.size>1000000)throw Error('File too large (maximum 1 MB).');const data=JSON.parse(await f.text());if(data.format!=='ff8-garden')throw Error('This is not a Garden save file.');const next=validateCampaign(data.state);if(initialOwner!==owner())throw Error('The chat or Persona has changed. Please import again.');if(!window.confirm(`Import the save for ${data.persona||'a protagonist'} into Persona ${persona().name}?`))return;await persist(next,'Import',true,{timeline:[]});selection=null;refresh();});input.click();
}
async function run(fn){if(busy){notice('Please wait for the current operation to finish.');return;}busy=true;try{await fn();}catch(e){notice(e.message||String(e),true);}finally{busy=false;}}
async function eventsFromLatest(expectedOwner=owner(),providedMessage=null,skipSync=false){
 if(!hasChat()||owner()!==expectedOwner)return;
 const changed=skipSync?null:await syncTimeline();if(owner()!==expectedOwner)return;
 const message=providedMessage||[...ctx().chat].reverse().find(m=>!m.is_user&&!m.is_system);
 if(!message){notice('No AI response to read.');return;}
 if(changed!==null){for(const m of ctx().chat.slice(changed,ctx().chat.indexOf(message)))if(!m.is_user&&!m.is_system)await eventsFromLatest(expectedOwner,m,true);}decorateEvents();const events=parseEvents(message.mes);if(!events.length){notice('No garden-event block in the latest response.');return;}
 const before=rootState();let next=before,count=0;
 // Atomic batch: if any new event fails validation, no state changes are saved.
 for(const e of events){const result=applyCampaignEvent(next,e,settings().permissions||{});next=result.state;if(!result.duplicate)count++;}
 if(count){const timeline=[...(profile()?.timeline||[]),{index:ctx().chat.indexOf(message),signature:messageSignature(message),before,after:next}].slice(-40);await persist(next,`${count} AI events`,true,{timeline});refresh();notice(`${count} events applied.`);}else notice('Events already applied.');
}
async function action(target){
 const a=target.dataset.action;
 if(a==='tab'){tab=target.dataset.tab;selection=null;refresh();return;}
 if(a==='disable'){settings().enabled=false;saveSettings();return;}
 if(a==='select'){selection={stat:target.dataset.stat,spell:state().junction[target.dataset.stat]||''};refresh();return;}
 if(a==='choose'){selection.spell=target.dataset.spell;refresh();return;}
 if(a==='cancel'){selection=null;refresh();return;}
 if(a==='apply')return mutate(`Junction ${STATS[selection.stat]}`,s=>setJunction(s,selection.stat,selection.spell));
 if(a==='equip')return mutate('GF assignment',s=>equipGF(s,target.dataset.gf));
 if(a==='use')return mutate(`Used: ${ITEMS[target.dataset.item].name}`,s=>useItem(s,target.dataset.item));
 if(a==='kit'){if(!window.confirm('Add Shiva, Quezacotl, four magic stocks and 5 Potions to try the menus?'))return;return mutate('Test kit added',starterKit);}
 if(a==='remove-member'){
  const member=rootState().party.find(m=>m.id===target.dataset.member);if(!member)throw Error('Unknown party member.');
  if(!window.confirm(`Remove ${member.name} and their character sheet from this party? You can restore them with Undo.`))return;
  await persist(removeMember(rootState(),member.id),'Companion removed');selection=null;refresh();return;
 }
 if(a==='complete')return campaignAction({type:'quest_complete',quest:target.dataset.quest});
 if(a==='tick')return campaignAction({type:'tick',turns:1,target:activeMember});
 if(a==='gear')return mutate('Equipment changed',s=>{const g=s.gear.find(g=>g.id===target.dataset.gear);if(!g?.quantity)throw Error('Equipment unavailable.');if(!g.equipped)for(const other of s.gear)if(other.kind===g.kind)other.equipped=false;g.equipped=!g.equipped;});
 if(a==='latest')return eventsFromLatest();
 if(a==='export')return download();
 if(a==='import')return importSave();
 if(a==='undo'){
  const p=profile();if(!p?.history.length)return;const previous=p.history.at(-1),c=ctx(),key=persona().key;
  c.chatMetadata[KEY].profiles[key]={...p,state:structuredClone(previous.state),history:p.history.slice(0,-1),timeline:/AI events$/.test(previous.label)?(p.timeline||[]).slice(0,-1):p.timeline||[]};
  try{await c.saveMetadata();}catch(e){c.chatMetadata[KEY].profiles[key]=p;throw e;}selection=null;refresh();notice(`Undone: ${englishLog(previous.label)}`);
 }
}
async function submit(form){
 const f=new FormData(form),kind=form.dataset.form;
 if(kind==='portrait'){await persist(setPortrait(rootState(),String(f.get('member')),String(f.get('portrait')||'')),'Portrait updated');refresh();return;}

 if(kind==='base')return mutate('Stats updated',s=>{s.level=Number(f.get('level'));for(const k of Object.keys(STATS))s.base[k]=Number(f.get(k));s.hp=Number(f.get('currentHP'));Object.assign(s,validateState(s));});
 if(kind==='loadout')return mutate('Abilities equipped',s=>{const commands=f.getAll('command'),passives=f.getAll('passive');if(commands.length>3||passives.length>2)throw Error('Maximum 3 commands and 2 passives.');s.commands=commands;s.passives=passives;});
 if(kind==='ap')return mutate('AP awarded',s=>addAP(s,Number(f.get('amount'))));
 if(['party','quest','scene','memory','equipment','condition','xp'].includes(kind)){const e=Object.fromEntries(f);e.type=kind;e.id='manual-'+crypto.randomUUID();for(const k of ['amount','turns','day','progress','quantity'])if(k in e)e[k]=Number(e[k]);if(kind==='scene')e.present=String(e.present||'').split(',').map(x=>x.trim()).filter(Boolean);if(kind==='quest')e.reward={xp:Number(e.xp||0),gil:Number(e.gil||0),ap:Number(e.ap||0)};if(kind==='memory')e.important=f.get('important')==='on';if(kind==='equipment')e.bonuses={str:Number(e.str||0),mag:Number(e.mag||0)};e.target=activeMember;await persist(applyCampaignEvent(rootState(),e).state,'Manual '+kind);refresh();return;}
 let events=[];const eventId='manual-'+crypto.randomUUID();
 if(kind==='magic')events=[{id:eventId,type:'magic',magic:f.get('magic'),amount:Number(f.get('amount'))}];
 if(kind==='resource'){const r=f.get('resource');events=[{id:eventId,type:['gil','hp'].includes(r)?r:'item',item:r,amount:Number(f.get('amount'))}];}
 if(kind==='gf'){const gf=f.get('gf');events=[{id:eventId,type:'gf_discover',gf,name:f.get('name'),description:f.get('description'),element:f.get('element'),abilities:f.getAll('abilities')}];if(f.get('acquired'))events.push({id:eventId+'-acquire',type:'gf_acquire',gf});}
 let next=rootState();for(const e of events)next=applyCampaignEvent(next,{...e,target:activeMember}).state;await persist(next,'Manual edit');refresh();
}
async function init(){
 if(ready)return;
 try{personaModule=await import(new URL('../../../../scripts/personas.js',import.meta.url).href);}catch(e){console.warn('[Garden] Persona module unavailable; name-based profile fallback.',e);}
 bar=document.createElement('header');bar.id='garden-bar';bar.className='garden-window';
 left=document.createElement('aside');left.id='garden-left';left.className='garden-window';
 right=document.createElement('aside');right.id='garden-right';right.className='garden-window';
 settingsBox=document.createElement('div');settingsBox.id='garden-settings';settingsBox.innerHTML='<div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b>FFVIII • Garden</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label><input name="enabled" type="checkbox"> Enable Garden layout</label><label><input name="bridge" type="checkbox"> Share state and protocol with the AI</label><label><input name="autoEvents" type="checkbox"> Apply AI events after each response</label><small>v0.2.1 · Simplified Junction · Saves per chat and Persona</small></div></div>';
 (document.querySelector('#extensions_settings2')||document.querySelector('#extensions_settings')||document.body).append(settingsBox);
 document.body.append(bar,left,right);
 for(const el of [bar,left,right]){
  el.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(target&&!target.disabled)run(()=>action(target));});
  el.addEventListener('submit',e=>{if(e.target.matches('[data-form]')){e.preventDefault();run(()=>submit(e.target));}});
  el.addEventListener('change',e=>{if(e.target.matches('[data-member]')){activeMember=e.target.value;selection=null;refresh();return;}const gfId=e.target.dataset.training;if(gfId)run(()=>mutate('GF learning updated',s=>{const gf=s.gfs.find(g=>g.id===gfId),a=e.target.value;if(!gf||a&&(!gf.abilities.includes(a)||gf.learned.includes(a)))throw Error('Ability unavailable.');gf.training=a||null;}));});
 }
 settingsBox.insertAdjacentHTML('beforeend','<details><summary>AI permissions</summary>'+PERMISSIONS.map(k=>`<label><input type="checkbox" data-permission="${k}" checked> Allow AI: ${k}</label>`).join('')+'</details>');
 settingsBox.addEventListener('change',e=>{if(e.target.dataset.permission){settings().permissions??={};settings().permissions[e.target.dataset.permission]=e.target.checked;saveSettings();return;}if(['enabled','bridge','autoEvents'].includes(e.target.name)){settings()[e.target.name]=e.target.checked;saveSettings();}});
 ready=true;
 const c=ctx(),types=c.eventTypes||c.event_types;
 const listen=(name,fn)=>{if(types[name])c.eventSource.on(types[name],fn);};
 for(const name of ['MESSAGE_SWIPED','MESSAGE_EDITED','MESSAGE_DELETED'])listen(name,()=>run(async()=>{if(settings().enabled&&settings().autoEvents&&settings().bridge)await eventsFromLatest();else await syncTimeline();refresh();}));
 for(const name of ['CHAT_CHANGED','PERSONA_CHANGED','PERSONA_RENAMED','PERSONA_UPDATED'])listen(name,()=>{selection=null;activeMember='protagonist';generationOwner=null;refresh();});
 listen('GENERATION_STARTED',()=>{generationOwner={owner:owner(),response:lastResponse()};inject();});
 listen('GENERATION_ENDED',()=>{const expected=generationOwner;generationOwner=null;if(expected&&settings().enabled&&settings().bridge&&settings().autoEvents&&owner()===expected.owner&&lastResponse()!==expected.response)run(()=>eventsFromLatest(expected.owner));});
 refresh();
}
const c=ctx();const types=c.eventTypes||c.event_types;
if(types.APP_READY)c.eventSource.on(types.APP_READY,init);else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
function messageSignature(m){return m?JSON.stringify([m.mes,m.send_date,m.swipe_id]):'';}
async function syncTimeline(){
 const p=profile();if(!p?.timeline?.length)return null;const first=p.timeline.findIndex(t=>messageSignature(ctx().chat[t.index])!==t.signature);if(first<0)return null;
 let next=rootState();for(const t of p.timeline.slice(first).reverse())next=reverseChanges(next,t.before,t.after);
 const kept=p.timeline.slice(0,first);for(const c of [next,...next.party.map(m=>m.state)]){c.equipped=c.equipped.filter(id=>c.gfs.some(g=>g.id===id&&g.acquired));reconcile(c);}await persist(next,'Response data restored',false,{timeline:kept,history:[]});selection=null;refresh();return p.timeline[first].index;
}
async function campaignAction(e){await persist(applyCampaignEvent(rootState(),{...e,id:'manual-'+crypto.randomUUID()}).state,'Manual '+e.type);refresh();}
const field=(name,label,type='text',value='',extra='')=>`<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
function characterControls(s){return `<h3>Progression & conditions</h3><p>EXP ${s.xp} · 1000 EXP per level</p><form data-form="xp">${field('amount','Award EXP','number',100,'min="1" max="999999" required')}<button>Award EXP</button></form><div class="garden-pills">${s.conditions.map(c=>`<span>${CONDITIONS[c.id]} · ${c.turns} turns</span>`).join('')||'No active conditions'}</div>${button('tick','Advance one turn')}<form data-form="condition"><label>Condition<select name="condition">${Object.entries(CONDITIONS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label>${field('turns','Turns (0 removes)','number',3,'min="0" max="999" required')}<button>Update condition</button></form>`;}
function equipmentControls(s){return `<h3>Equipment & backpack</h3>${s.gear.map(g=>`<article class="garden-item"><div><strong>${esc(g.name)}</strong><small>${esc(g.kind)} ×${g.quantity} · ${esc(JSON.stringify(g.bonuses))}</small></div>${['weapon','armor'].includes(g.kind)?button('gear',g.equipped?'Unequip':'Equip',`data-gear="${esc(g.id)}"`):''}</article>`).join('')||'<p>Backpack empty.</p>'}<details><summary>Add or edit equipment</summary><form data-form="equipment">${field('gear','Stable ID','text','','required pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"')}${field('name','Name','text','','required maxlength="80"')}<label>Kind<select name="kind"><option>weapon</option><option>armor</option><option>material</option><option>key</option></select></label>${field('quantity','Quantity','number',1,'min="0" max="99" required')}${field('str','Strength bonus','number',0,'min="-999" max="999"')}${field('mag','Magic bonus','number',0,'min="-999" max="999"')}<button>Save backpack item</button></form></details>`;}
function renderCampaign(tab,s,r){
 if(tab==='party')return `<p class="garden-hint">Companions have individual HP, magic, GFs, Junctions, equipment and EXP. Choose a character in the left menu. Scene presence is tracked separately.</p>${r.party.map(m=>`<article class="garden-gf garden-companion"><div class="garden-companion-heading">${m.portrait?`<img src="${esc(m.portrait)}" alt="${esc(m.name)} portrait" referrerpolicy="no-referrer">`:'<div class="garden-portrait-fallback">♜</div>'}<h3>${esc(m.name)}</h3></div><p>ID: ${esc(m.id)} · Lv ${m.state.level} · HP ${m.state.hp}/${effective(m.state).hp}</p><form data-form="portrait"><input type="hidden" name="member" value="${esc(m.id)}"><label>Portrait URL (HTTPS)<input type="url" name="portrait" maxlength="2048" value="${esc(m.portrait||'')}" placeholder="https://example.com/portrait.png"></label><small>Leave empty to remove the portrait.</small><button type="submit">Save portrait</button></form>${button('remove-member','Remove companion',`data-member="${esc(m.id)}" class="garden-danger"`)}</article>`).join('')}<form data-form="party">${field('member','Member ID','text','','required pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"')}${field('name','Name','text','','required maxlength="80"')}<button>Add companion</button></form>`;
 if(tab==='quests')return `<p class="garden-hint">Completion pays each reward once. EXP goes to the party; Gil and GF AP go to the protagonist.</p>${r.quests.map(q=>`<article class="garden-gf"><h3>${esc(q.title)}</h3><p>${q.kind} · ${q.completed?'Completed':q.progress+'%'} · ${q.reward.xp} EXP / ${q.reward.gil} Gil / ${q.reward.ap} AP</p><progress value="${q.progress}" max="100"></progress>${button('complete','Complete & claim',`data-quest="${esc(q.id)}" ${q.completed?'disabled':''}`)}</article>`).join('')}<details><summary>Add or update mission</summary><form data-form="quest">${field('quest','Mission ID','text','','required')}${field('title','Title','text','','required maxlength="100"')}<label>Kind<select name="kind"><option>main</option><option>side</option></select></label>${field('progress','Progress %','number',0,'min="0" max="100" required')}${field('xp','EXP reward','number',0,'min="0" max="999999"')}${field('gil','Gil reward','number',0,'min="0" max="999999"')}${field('ap','AP reward','number',0,'min="0" max="9999"')}<button>Save mission</button></form></details>`;
 if(tab==='scene')return `<div class="garden-scene"><strong>${esc(r.scene.location)}</strong><p>Day ${r.scene.day} · ${esc(r.scene.time)}</p><p>Present: ${esc(r.scene.present.join(', ')||'Unknown')}</p><p>Mission: ${esc(r.scene.mission||'None')}</p></div><details><summary>Edit scene</summary><form data-form="scene">${field('location','Location','text',r.scene.location,'required maxlength="120"')}${field('time','Time','text',r.scene.time,'required maxlength="80"')}${field('day','Day','number',r.scene.day,'min="1" max="99999" required')}${field('present','Present characters (comma separated)','text',r.scene.present.join(', '))}${field('mission','Main mission','text',r.scene.mission)}<button>Save scene</button></form></details><h3>NPC memories</h3><p class="garden-hint">Important memories and memories of characters in the scene are shared with the AI (up to 20).</p>${r.memories.map(m=>`<article class="garden-gf"><strong>${esc(m.npc)} ${m.important?'★':''}</strong><p>${esc(m.text)}</p><small>${esc(m.id)}</small></article>`).join('')}<form data-form="memory">${field('memory','Memory ID','text','','required')}${field('npc','NPC','text','','required maxlength="80"')}<label>Memory<textarea name="text" required maxlength="500"></textarea></label><label class="garden-check"><input type="checkbox" name="important">Important</label><button>Save memory</button></form>`;
 return null;
}
function decorateEvents(){
 for(const el of document.querySelectorAll('#chat .mes[mesid]')){
  const m=ctx().chat[Number(el.getAttribute('mesid'))],block=el.querySelector('.mes_block');if(!block)continue;block.querySelector('.garden-technical')?.remove();el.querySelectorAll('.garden-event-source').forEach(p=>p.classList.remove('garden-event-source'));
  const raw=[...String(m?.mes||'').matchAll(/```garden-event\s*\n([\s\S]*?)```/g)].map(x=>x[1]);if(!raw.length)continue;
  const details=document.createElement('details');details.className='garden-technical';const summary=document.createElement('summary');summary.textContent='Garden events · '+raw.length+' block(s)';const pre=document.createElement('pre');pre.textContent=raw.join('\n');details.append(summary,pre);block.append(details);
  for(const code of el.querySelectorAll('.mes_text pre code'))if(code.className.includes('garden-event')||raw.some(r=>code.textContent.trim()===r.trim()))code.parentElement.classList.add('garden-event-source');
 }
}


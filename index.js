import {STATS,MAGIC,ABILITIES,ITEMS,ELEMENTS,freshState,available,values,reconcile,setJunction,equipGF,starterKit,addAP,applyEvent,parseEvents,useItem,validateState,promptFor} from './engine.js';

const KEY='ff8_garden_v1';
let personaModule=null,tab='junction',selection=null,busy=false,generationOwner=null,ready=false;
let left,right,bar,settingsBox;
const ctx=()=>SillyTavern.getContext();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,extra='')=>`<button type="button" data-action="${action}" ${extra}>${label}</button>`;
function settings(){const c=ctx();return c.extensionSettings[KEY]??={enabled:true,bridge:true,autoEvents:true};}
function persona(){const c=ctx(),avatar=personaModule?.user_avatar||'';return {name:c.name1||'Protagonista',key:`p:${avatar||c.name1||'default'}`,avatar:avatar?(personaModule?.getUserAvatar?.(avatar)||`User Avatars/${encodeURIComponent(avatar)}`):''};}
function hasChat(){const c=ctx();return !!(c.getCurrentChatId?.()||c.chatId);}
function owner(){const c=ctx();return `${c.groupId??c.characterId??'chat'}|${c.getCurrentChatId?.()||c.chatId||''}|${persona().key}`;}
function lastResponse(){const m=[...ctx().chat].reverse().find(m=>!m.is_user&&!m.is_system);return m?JSON.stringify([m.mes,m.send_date,m.swipe_id]):'';}
function profile(){return ctx().chatMetadata?.[KEY]?.profiles?.[persona().key]||null;}
function state(){return profile()?.state||freshState();}
function saveSettings(){ctx().saveSettingsDebounced();refresh();}
function notice(text,error=false){if(window.toastr)window.toastr[error?'error':'info'](text,'Garden');else{const n=document.querySelector('#garden-notice');if(n)n.textContent=text;}console[error?'warn':'info']('[Garden]',text);}
async function persist(next,label,remember=true){
 if(!hasChat())throw Error('Apri una chat prima di usare Garden.');
 const c=ctx(),p=persona(),old=profile();
 const root=c.chatMetadata[KEY]??={profiles:{}};
 const history=remember?[...(old?.history||[]),{state:structuredClone(old?.state||freshState()),label}].slice(-12):old?.history||[];
 root.profiles[p.key]={state:next,history};
 try{await c.saveMetadata();}catch(e){if(old)root.profiles[p.key]=old;else delete root.profiles[p.key];throw Error(`Salvataggio non riuscito: ${e.message||e}`);}
}
async function mutate(label,fn){const s=structuredClone(state());fn(s);reconcile(s);s.log.unshift({at:new Date().toISOString(),text:label});s.log=s.log.slice(0,100);await persist(s,label);selection=null;refresh();}
function inject(){const c=ctx(),s=settings();c.setExtensionPrompt(KEY,s.enabled&&s.bridge&&hasChat()?promptFor(state(),persona().name):'',1,0,false,0);}
window.ff8GardenIntercept=async()=>{inject();};
function refresh(){
 if(!ready)return;
 const options=settings(),on=options.enabled;
 document.body.classList.toggle('garden-active',on);
 left.hidden=right.hidden=bar.hidden=!on;
 const p=persona(),s=state(),v=values(s),skills=available(s);
 bar.innerHTML=`<div><strong>SillyTavern <span>• Garden</span></strong><small>FINAL FANTASY VIII · v0.1</small></div><div class="garden-toolbar-actions"><span>${hasChat()?esc(p.name):'Apri una chat'}</span>${button('export','Esporta')}${button('import','Importa')}${button('undo','↶ Annulla',profile()?.history?.length?'':'disabled')}${button('disable','Chiudi','title="Disattiva il layout Garden; riaprilo nelle Estensioni"')}</div>`;
 left.innerHTML=`<h2>♜ Protagonista</h2><div class="garden-profile">${p.avatar?`<img src="${esc(p.avatar)}" alt="Ritratto della Persona">`:'<div class="garden-portrait-fallback">♜</div>'}<div><h3>${esc(p.name)}</h3><span>Lv ${s.level}</span><p>HP ${s.hp} / ${v.hp}</p><progress value="${s.hp}" max="${v.hp}"></progress></div></div><div class="garden-gil">${s.gil.toLocaleString('it-IT')} <span>Gil</span></div><nav>${[['status','▤','Stato'],['junction','☞','Junction'],['magic','✧','Magie'],['gf','✦','Guardian Force'],['inventory','▣','Inventario'],['events','◷','Registro']].map(([key,icon,name])=>button('tab',`<span>${icon}</span>${name}`,`data-tab="${key}" class="${tab===key?'selected':''}"`)).join('')}</nav><div class="garden-side-note">Persona e risorse separate per ogni chat.</div><div class="garden-actions">${button('kit','Carica kit di prova')}${button('latest','Leggi eventi dell’ultima risposta')}</div><p id="garden-notice" aria-live="polite"></p>`;
 right.innerHTML=`<h2>${esc({junction:'Junction',status:'Stato',magic:'Scorte di magie',gf:'Guardian Force',inventory:'Inventario',events:'Registro eventi'}[tab])} <small>• ${esc(p.name)}</small></h2><div class="garden-content">${!hasChat()?'<div class="garden-empty"><h3>Il Garden ti attende</h3><p>Apri una chat e scegli la tua Persona. Potrai iniziare con risorse vuote o caricare un kit di prova.</p></div>':renderContent(s,v,skills)}</div>`;
 if(!hasChat()){left.querySelectorAll('[data-action="kit"],[data-action="latest"]').forEach(b=>b.disabled=true);}
 const enabled=settingsBox.querySelector('[name="enabled"]'),bridge=settingsBox.querySelector('[name="bridge"]'),auto=settingsBox.querySelector('[name="autoEvents"]');
 enabled.checked=on;bridge.checked=options.bridge;auto.checked=options.autoEvents;
 inject();
}
function renderContent(s,v,skills){
 if(tab==='junction')return `<div class="garden-tabs">${button('tab','GF','data-tab="gf"')}${button('tab','Magie','class="selected" data-tab="junction"')}${button('tab','Abilità','data-tab="status"')}</div><p class="garden-caption">GF equipaggiati</p><div class="garden-pills">${s.gfs.filter(g=>s.equipped.includes(g.id)).map(g=>`<span>✦ ${esc(g.name)}</span>`).join('')||'<span>Nessuno: equipaggia un GF.</span>'}</div><p class="garden-caption">Magie associate alle statistiche</p><table><thead><tr><th>Statistica</th><th>Magia</th><th>Scorta</th><th>Valore</th></tr></thead><tbody>${Object.entries(STATS).map(([stat,name])=>`<tr class="${selection?.stat===stat?'selected':''}"><td>${name}</td><td>${button('select',esc(MAGIC[s.junction[stat]]?.name||'—'),`data-stat="${stat}" ${skills.has('j_'+stat)?'':'disabled title="Richiede '+name+'-J appresa da un GF equipaggiato"'}`)}</td><td>${s.magic[s.junction[stat]]||'—'}</td><td>${v[stat]}</td></tr>`).join('')}</tbody></table>${selection?selector(s,v):'<p class="garden-hint">Seleziona una statistica per associare una magia. Le righe bloccate richiedono la relativa abilità Junction.</p>'}<div class="garden-rule-note">Una magia può essere associata a una sola statistica. Scorte maggiori danno bonus maggiori.</div>`;
 if(tab==='gf')return `<p class="garden-hint">Equipaggia i GF e scegli quale abilità apprendere. Gli AP vanno all’abilità selezionata di ogni GF equipaggiato.</p>${s.gfs.map(g=>`<article class="garden-gf"><header><div class="garden-gf-sigil">${{'Fuoco':'♨','Ghiaccio':'❄','Tuono':'ϟ','Vento':'≋'}[g.element]||'✦'}</div><div><h3>${esc(g.name)}</h3><small>${esc(g.element)} · ${g.acquired?'Acquisito':'Incontrato'}</small></div>${g.acquired?button('equip',s.equipped.includes(g.id)?'Equipaggiato ✓':'Equipaggia',`data-gf="${esc(g.id)}" class="${s.equipped.includes(g.id)?'selected':''}"`):''}</header><p>${esc(g.description)}</p>${g.acquired?`<label>Apprendimento<select data-training="${esc(g.id)}"><option value="">Nessuna abilità selezionata</option>${g.abilities.filter(a=>!g.learned.includes(a)).map(a=>`<option value="${a}" ${g.training===a?'selected':''}>${esc(ABILITIES[a].name)} — ${g.progress[a]||0}/${ABILITIES[a].ap} AP</option>`).join('')}</select></label><div class="garden-ability-list">${g.learned.map(a=>`<span>${esc(ABILITIES[a].name)} ✓</span>`).join('')}</div>`:'<p class="garden-hint">L’incontro non equivale all’acquisizione.</p>'}</article>`).join('')||'<p>Nessun GF registrato. Carica il kit di prova o incontrane uno nella storia.</p>'}<details><summary>Aggiungi un GF manualmente</summary><form data-form="gf"><label>ID (es. vesper)<input name="gf" required pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*" maxlength="64"></label><label>Nome<input name="name" required maxlength="80"></label><label>Descrizione<textarea name="description" required maxlength="700"></textarea></label><label>Elemento<select name="element">${ELEMENTS.map(e=>`<option>${e}</option>`).join('')}</select></label><label>Abilità (massimo 12)<select name="abilities" multiple size="7">${Object.entries(ABILITIES).map(([a,b])=>`<option value="${a}">${esc(b.name)}</option>`).join('')}</select></label><label class="garden-check"><input type="checkbox" name="acquired">Già acquisito</label><button type="submit">Registra GF</button></form></details><form data-form="ap" class="garden-inline"><label>AP ottenuti<input name="amount" type="number" min="1" max="9999" value="10" required></label><button type="submit">Assegna AP</button></form>`;
 if(tab==='magic')return `<p class="garden-hint">Scorta massima: 100 per magia. Le modifiche sono salvate nella chat.</p><form data-form="magic"><label>Magia<select name="magic">${Object.entries(MAGIC).map(([id,m])=>`<option value="${id}">${m.name}</option>`).join('')}</select></label><label>Variazione (+ acquisisci / − consumi)<input name="amount" type="number" min="-100" max="100" value="10" required></label><button type="submit">Aggiorna scorta</button></form><table><thead><tr><th>Magia</th><th>Tipo</th><th>Scorta</th></tr></thead><tbody>${Object.entries(MAGIC).map(([id,m])=>`<tr><td>${m.name}</td><td>${m.element}</td><td>${s.magic[id]||0}${Object.values(s.junction).includes(id)?' ⛓':''}</td></tr>`).join('')}</tbody></table>`;
 if(tab==='status')return `<div class="garden-stat-grid">${Object.entries(STATS).map(([k,n])=>`<div><span>${n}</span><strong>${v[k]}</strong></div>`).join('')}</div><h3>Comandi e abilità</h3><form data-form="loadout"><p class="garden-hint">Fino a 3 comandi e 2 abilità passive. Attacco è sempre disponibile.</p><strong>Attacco</strong>${['command','passive'].map(kind=>`<h4>${kind==='command'?'Comandi':'Passive'}</h4>${[...skills].filter(a=>ABILITIES[a].kind===kind).map(a=>`<label class="garden-check"><input name="${kind}" type="checkbox" value="${a}" ${(kind==='command'?s.commands:s.passives).includes(a)?'checked':''}>${esc(ABILITIES[a].name)}</label>`).join('')}`).join('')}<button type="submit">Applica abilità</button></form><details><summary>Modifica livello e statistiche base</summary><form data-form="base"><label>Livello<input name="level" type="number" min="1" max="100" value="${s.level}" required></label>${Object.entries(STATS).map(([k,n])=>`<label>${n} base<input name="${k}" type="number" min="${k==='hp'?1:0}" max="${k==='hp'?9999:255}" value="${s.base[k]}" required></label>`).join('')}<label>HP attuali<input name="currentHP" type="number" min="0" max="9999" value="${s.hp}" required></label><button type="submit">Salva statistiche</button></form></details><p class="garden-rule-note">v0.1: formule Junction semplificate; il livello non aumenta automaticamente le statistiche.</p>`;
 if(tab==='inventory')return `<div class="garden-gil">${s.gil.toLocaleString('it-IT')} Gil</div>${Object.entries(ITEMS).map(([id,i])=>`<article class="garden-item"><div><strong>${i.name}</strong><small>${i.revive?'Riporta in vita al 25% degli HP':`Recupera ${i.heal} HP`} · ×${s.items[id]||0}</small></div>${button('use','Usa',`data-item="${id}" ${s.items[id]?'':'disabled'}`)}</article>`).join('')}<details><summary>Aggiorna risorse manualmente</summary><form data-form="resource"><label>Risorsa<select name="resource"><option value="gil">Gil</option><option value="hp">HP</option>${Object.entries(ITEMS).map(([id,i])=>`<option value="${id}">${i.name}</option>`).join('')}</select></label><label>Variazione<input name="amount" type="number" min="-999999" max="999999" value="1" required></label><button type="submit">Aggiorna</button></form></details>`;
 return `<p class="garden-hint">Gli eventi dell’IA vengono validati dal codice. Puoi annullare le ultime 12 operazioni con il pulsante in alto.</p><p>Eventi IA automatici: <strong>${settings().autoEvents?'attivi':'disattivati'}</strong></p>${button('latest','Leggi ultima risposta')}<ol class="garden-log">${s.log.map(l=>`<li><time>${esc(new Date(l.at).toLocaleString('it-IT'))}</time>${esc(l.text)}</li>`).join('')||'<li>Nessun evento.</li>'}</ol>`;
}
function selector(s,v){
 const options=Object.keys(MAGIC).filter(id=>s.magic[id]>0),stat=selection.stat;
 const candidate=structuredClone(s);let preview='—';try{setJunction(candidate,stat,selection.spell||'');preview=values(candidate)[stat];}catch{}
 return `<div class="garden-selector"><h3>Junction a ${STATS[stat]}</h3><div class="garden-spells">${button('choose','Nessuna magia',`data-spell="" class="${!selection.spell?'selected':''}"`)}${options.map(id=>{const used=Object.entries(s.junction).some(([k,m])=>k!==stat&&m===id);return button('choose',`${MAGIC[id].name} <span>×${s.magic[id]}${used?' · già associata':''}</span>`,`data-spell="${id}" class="${selection.spell===id?'selected':''}" ${used?'disabled':''}`);}).join('')}</div><div class="garden-preview">${STATS[stat]} ${v[stat]} <span>→ ${preview}</span></div><div class="garden-inline">${button('cancel','Annulla')}${button('apply','Applica Junction','class="garden-primary"')}</div></div>`;
}
function download(){if(!hasChat())throw Error('Apri una chat.');const data={format:'ff8-garden',version:1,persona:persona().name,state:state()};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='garden-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function importSave(){
 if(!hasChat())throw Error('Apri una chat.');
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';const initialOwner=owner();
 input.onchange=()=>run(async()=>{const f=input.files[0];if(!f)return;if(f.size>1000000)throw Error('File troppo grande (massimo 1 MB).');const data=JSON.parse(await f.text());if(data.format!=='ff8-garden')throw Error('Non è un salvataggio Garden.');const next=validateState(data.state);if(initialOwner!==owner())throw Error('La chat o la Persona è cambiata: ripeti l’importazione.');if(!window.confirm(`Importare il salvataggio di ${data.persona||'un protagonista'} nella Persona ${persona().name}?`))return;await persist(next,'Importazione');selection=null;refresh();});input.click();
}
async function run(fn){if(busy){notice('Attendi il completamento dell’operazione in corso.');return;}busy=true;try{await fn();}catch(e){notice(e.message||String(e),true);}finally{busy=false;}}
async function eventsFromLatest(expectedOwner=owner()){
 if(!hasChat()||owner()!==expectedOwner)return;
 const message=[...ctx().chat].reverse().find(m=>!m.is_user&&!m.is_system);
 if(!message){notice('Nessuna risposta dell’IA da leggere.');return;}
 const events=parseEvents(message.mes);if(!events.length){notice('Nessun blocco garden-event nell’ultima risposta.');return;}
 let next=state(),count=0;
 // Atomic batch: if any new event fails validation, no state changes are saved.
 for(const e of events){const result=applyEvent(next,e);next=result.state;if(!result.duplicate)count++;}
 if(count){await persist(next,`${count} eventi IA`);refresh();notice(`${count} eventi applicati.`);}else notice('Eventi già applicati.');
}
async function action(target){
 const a=target.dataset.action;
 if(a==='tab'){tab=target.dataset.tab;selection=null;refresh();return;}
 if(a==='disable'){settings().enabled=false;saveSettings();return;}
 if(a==='select'){selection={stat:target.dataset.stat,spell:state().junction[target.dataset.stat]||''};refresh();return;}
 if(a==='choose'){selection.spell=target.dataset.spell;refresh();return;}
 if(a==='cancel'){selection=null;refresh();return;}
 if(a==='apply')return mutate(`Junction ${STATS[selection.stat]}`,s=>setJunction(s,selection.stat,selection.spell));
 if(a==='equip')return mutate('Assegnazione GF',s=>equipGF(s,target.dataset.gf));
 if(a==='use')return mutate(`Usato: ${ITEMS[target.dataset.item].name}`,s=>useItem(s,target.dataset.item));
 if(a==='kit'){if(!window.confirm('Aggiungere Shiva, Quezacotl, quattro scorte di magie e 5 Pozioni per provare i menu?'))return;return mutate('Kit di prova aggiunto',starterKit);}
 if(a==='latest')return eventsFromLatest();
 if(a==='export')return download();
 if(a==='import')return importSave();
 if(a==='undo'){
  const p=profile();if(!p?.history.length)return;const previous=p.history.at(-1),c=ctx(),key=persona().key;
  c.chatMetadata[KEY].profiles[key]={state:structuredClone(previous.state),history:p.history.slice(0,-1)};
  try{await c.saveMetadata();}catch(e){c.chatMetadata[KEY].profiles[key]=p;throw e;}selection=null;refresh();notice(`Annullato: ${previous.label}`);
 }
}
async function submit(form){
 const f=new FormData(form),kind=form.dataset.form;
 if(kind==='base')return mutate('Statistiche aggiornate',s=>{s.level=Number(f.get('level'));for(const k of Object.keys(STATS))s.base[k]=Number(f.get(k));s.hp=Number(f.get('currentHP'));Object.assign(s,validateState(s));});
 if(kind==='loadout')return mutate('Abilità equipaggiate',s=>{const commands=f.getAll('command'),passives=f.getAll('passive');if(commands.length>3||passives.length>2)throw Error('Massimo 3 comandi e 2 passive.');s.commands=commands;s.passives=passives;});
 if(kind==='ap')return mutate('AP assegnati',s=>addAP(s,Number(f.get('amount'))));
 let events=[];const eventId='manual-'+crypto.randomUUID();
 if(kind==='magic')events=[{id:eventId,type:'magic',magic:f.get('magic'),amount:Number(f.get('amount'))}];
 if(kind==='resource'){const r=f.get('resource');events=[{id:eventId,type:['gil','hp'].includes(r)?r:'item',item:r,amount:Number(f.get('amount'))}];}
 if(kind==='gf'){const gf=f.get('gf');events=[{id:eventId,type:'gf_discover',gf,name:f.get('name'),description:f.get('description'),element:f.get('element'),abilities:f.getAll('abilities')}];if(f.get('acquired'))events.push({id:eventId+'-acquire',type:'gf_acquire',gf});}
 let next=state();for(const e of events)next=applyEvent(next,e).state;await persist(next,'Modifica manuale');refresh();
}
async function init(){
 if(ready)return;
 try{personaModule=await import(new URL('../../../../scripts/personas.js',import.meta.url).href);}catch(e){console.warn('[Garden] Persona module unavailable; name-based profile fallback.',e);}
 bar=document.createElement('header');bar.id='garden-bar';bar.className='garden-window';
 left=document.createElement('aside');left.id='garden-left';left.className='garden-window';
 right=document.createElement('aside');right.id='garden-right';right.className='garden-window';
 settingsBox=document.createElement('div');settingsBox.id='garden-settings';settingsBox.innerHTML='<div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b>FFVIII • Garden</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label><input name="enabled" type="checkbox"> Attiva layout Garden</label><label><input name="bridge" type="checkbox"> Condividi stato e protocollo con l’IA</label><label><input name="autoEvents" type="checkbox"> Applica eventi IA a fine risposta</label><small>v0.1 · Junction semplificate · salvataggi per chat e Persona</small></div></div>';
 (document.querySelector('#extensions_settings2')||document.querySelector('#extensions_settings')||document.body).append(settingsBox);
 document.body.append(bar,left,right);
 for(const el of [bar,left,right]){
  el.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(target&&!target.disabled)run(()=>action(target));});
  el.addEventListener('submit',e=>{if(e.target.matches('[data-form]')){e.preventDefault();run(()=>submit(e.target));}});
  el.addEventListener('change',e=>{const gfId=e.target.dataset.training;if(gfId)run(()=>mutate('Apprendimento GF aggiornato',s=>{const gf=s.gfs.find(g=>g.id===gfId),a=e.target.value;if(!gf||a&&(!gf.abilities.includes(a)||gf.learned.includes(a)))throw Error('Abilità non disponibile.');gf.training=a||null;}));});
 }
 settingsBox.addEventListener('change',e=>{if(['enabled','bridge','autoEvents'].includes(e.target.name)){settings()[e.target.name]=e.target.checked;saveSettings();}});
 ready=true;
 const c=ctx(),types=c.eventTypes||c.event_types;
 const listen=(name,fn)=>{if(types[name])c.eventSource.on(types[name],fn);};
 for(const name of ['CHAT_CHANGED','PERSONA_CHANGED','PERSONA_RENAMED','PERSONA_UPDATED'])listen(name,()=>{selection=null;generationOwner=null;refresh();});
 listen('GENERATION_STARTED',()=>{generationOwner={owner:owner(),response:lastResponse()};inject();});
 listen('GENERATION_ENDED',()=>{const expected=generationOwner;generationOwner=null;if(expected&&settings().enabled&&settings().bridge&&settings().autoEvents&&owner()===expected.owner&&lastResponse()!==expected.response)run(()=>eventsFromLatest(expected.owner));});
 refresh();
}
const c=ctx();const types=c.eventTypes||c.event_types;
if(types.APP_READY)c.eventSource.on(types.APP_READY,init);else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

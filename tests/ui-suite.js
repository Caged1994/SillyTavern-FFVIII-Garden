// Shared DOM suite: runs in jsdom (tests/ui.cjs) and in a real Chromium page (tests/ui-browser.mjs).
// w/d are the window and document; G is the realm where index.js resolves globals such as Image.
function assert(value,message='Assertion failed'){if(!value)throw Error(message);}
assert.equal=(a,b,m)=>{if(a!==b)throw Error(m||`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);};
assert.deepEqual=(a,b,m)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(m||`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);};
assert.match=(a,re,m)=>{if(!re.test(a))throw Error(m||`${JSON.stringify(a)} does not match ${re}`);};
export async function run({w,d,G,snapshot=async()=>{}}){
 w.confirm=()=>true;
 async function waitFor(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,10));}throw Error('Timed out waiting for '+fn);}
 const click=async sel=>{const el=d.querySelector(sel);assert(el,'Missing '+sel);el.click();await new Promise(r=>setTimeout(r,5));};const submit=sel=>d.querySelector(sel).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 const profile=()=>w.context.chatMetadata.ff8_garden_v1?.profiles['p:lucas.png'];
 const assetOf=ref=>typeof ref==='string'&&ref.startsWith('asset:')?w.context.chatMetadata.ff8_garden_v1.assets?.[ref.slice(6)]:undefined;
 const pause=(ms=10)=>new Promise(r=>setTimeout(r,ms));
 await waitFor(()=>d.querySelector('#garden-left h3'));assert.equal(d.querySelector('#garden-left h3').textContent,'Lucas');
 await click('[data-action="kit"]');await waitFor(()=>profile()?.state.gfs.length===2);
 await click('[data-stat="str"]');await click('[data-spell="fire"]');await click('[data-action="apply"]');await waitFor(()=>profile().state.junction.str==='fire');assert.equal(d.querySelector('tr:has([data-stat="str"]) td:last-child').textContent,'18');
 await click('[data-stat="hp"]');await click('[data-spell="cure"]');assert.match(d.querySelector('.garden-preview').textContent,/980/);await click('[data-action="cancel"]');assert.equal(profile().state.junction.hp,undefined);
 await click('[data-tab="gf"]');const training=d.querySelector('[data-training="shiva"]');training.value='j_vit';training.dispatchEvent(new w.Event('change',{bubbles:true}));await waitFor(()=>profile().state.gfs[0].training==='j_vit');await new Promise(r=>setTimeout(r,5));
 d.querySelector('[data-form="ap"] input').value=100;submit('[data-form="ap"]');await waitFor(()=>profile().state.gfs[0].learned.includes('j_vit'));await new Promise(r=>setTimeout(r,5));
 w.changeAvatar('other.png');await w.emit('persona');await click('[data-tab="junction"]');assert.equal(d.querySelector('tr:has([data-stat="str"]) td:last-child').textContent,'10');w.changeAvatar('lucas.png');await w.emit('persona');assert.equal(d.querySelector('tr:has([data-stat="str"]) td:last-child').textContent,'18');
 await w.emit('start');w.context.chat.push({is_user:false,mes:'```garden-event\n{"id":"reward-1","type":"gil","amount":100}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===100);await click('[data-action="latest"]');await new Promise(r=>setTimeout(r,30));assert.equal(profile().state.gil,100);
 await click('[data-action="undo"]');await waitFor(()=>profile().state.gil===0);await w.emit('start');await w.emit('end');await new Promise(r=>setTimeout(r,30));assert.equal(profile().state.gil,0);
 w.context.chat.push({is_user:false,mes:'```garden-event\n[{"id":"good","type":"gil","amount":99},{"id":"bad","type":"magic","magic":"bad","amount":5}]\n```'});await click('[data-action="latest"]');await new Promise(r=>setTimeout(r,30));assert.equal(profile().state.gil,0);assert(w.notices.some(t=>/Event 2 \(magic\): Unknown magic/.test(t)),'error names the failing event');
 const persisted=JSON.parse(w.localStorage.getItem('qa-metadata'));assert.equal(persisted.ff8_garden_v1.profiles['p:lucas.png'].state.junction.str,'fire');
 for(const tab of ['status','magic','gf','inventory','events','junction']){await click('[data-tab="'+tab+'"]');assert(!/Scorte di magie|Usa|Apprendimento|Equipaggia|Statistica|Annulla|attivi|disattivati/.test(d.querySelector('#garden-right').textContent),'Untranslated tab '+tab);}

 // New campaign menus and automatic alternative-response restoration.
 w.context.chat.pop(); // Remove the deliberately invalid response.
 await click('[data-tab="party"]');d.querySelector('[name="member"]').value='zell';d.querySelector('[data-form="party"] [name="name"]').value='Zell';submit('[data-form="party"]');await waitFor(()=>profile().state.party.length===1);await new Promise(r=>setTimeout(r,10));
 const member=d.querySelector('[data-member]');member.value='zell';member.dispatchEvent(new w.Event('change',{bubbles:true}));await click('[data-tab="magic"]');d.querySelector('[name="amount"]').value=25;submit('[data-form="magic"]');await waitFor(()=>profile().state.party[0].state.magic.fire===25);assert.equal(profile().state.magic.fire,80);await new Promise(r=>setTimeout(r,10));
 d.querySelector('[data-member]').value='protagonist';d.querySelector('[data-member]').dispatchEvent(new w.Event('change',{bubbles:true}));
 await w.emit('start');w.context.chat.push({is_user:false,swipe_id:0,mes:'```garden-event\n{"id":"swipe-a","type":"gil","amount":50}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===50);await new Promise(r=>setTimeout(r,10));
 await click('[data-tab="magic"]');d.querySelector('[name="amount"]').value=10;submit('[data-form="magic"]');await waitFor(()=>profile().state.magic.fire===90);await new Promise(r=>setTimeout(r,10));
 w.context.chat.at(-1).swipe_id=1;w.context.chat.at(-1).mes='```garden-event\n{"id":"swipe-b","type":"gil","amount":20}\n```';await w.emit('swipe');await waitFor(()=>profile().state.gil===20);assert.equal(profile().state.magic.fire,90);assert.equal(profile().state.junction.str,'fire');assert(!profile().state.seenEvents.some(id=>id.endsWith('-swipe-a')));assert(profile().state.seenEvents.some(id=>id.endsWith('-swipe-b')));await new Promise(r=>setTimeout(r,10));
 w.context.chat.at(-1).mes='No reward this time.';await w.emit('edit');await waitFor(()=>profile().state.gil===0);await new Promise(r=>setTimeout(r,10));
 await w.emit('start');w.context.chat.push({is_user:false,mes:'```garden-event\n{"id":"delete-reward","type":"gil","amount":30}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===30);await new Promise(r=>setTimeout(r,10));w.context.chat.pop();await w.emit('delete');await waitFor(()=>profile().state.gil===0);await new Promise(r=>setTimeout(r,10));
 await click('[data-tab="quests"]');const q=d.querySelector('[data-form="quest"]');q.querySelector('[name="quest"]').value='exam';q.querySelector('[name="title"]').value='SeeD exam';q.querySelector('[name="xp"]').value=1000;submit('[data-form="quest"]');await waitFor(()=>profile().state.quests.length===1);await new Promise(r=>setTimeout(r,10));await click('[data-action="complete"]');await waitFor(()=>profile().state.level===2);assert.equal(profile().state.party[0].state.level,2);assert(d.querySelector('[data-action="complete"]').disabled);

 // Older response edits replay later valid responses in order.
 await new Promise(r=>setTimeout(r,10));await w.emit('start');w.context.chat.push({is_user:false,mes:'```garden-event\n{"id":"older","type":"gil","amount":10}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===10);await new Promise(r=>setTimeout(r,10));const olderIndex=w.context.chat.length-1;
 await w.emit('start');w.context.chat.push({is_user:false,mes:'```garden-event\n{"id":"later","type":"gil","amount":15}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===25);await new Promise(r=>setTimeout(r,10));w.context.chat[olderIndex].mes='The old reward was cancelled.';await w.emit('edit');await waitFor(()=>profile().state.gil===15);await new Promise(r=>setTimeout(r,10));
 // Technical data is collapsed without changing message source.
 const node=d.createElement('div');node.className='mes';node.setAttribute('mesid',w.context.chat.length-1);node.innerHTML='<div class="mes_block"><div class="mes_text"><pre><code class="language-garden-event"></code></pre></div></div>';node.querySelector('code').textContent='{"id":"later","type":"gil","amount":15}';d.querySelector('#chat').append(node);const original=w.context.chat.at(-1).mes;await click('[data-tab="events"]');assert(node.querySelector('.garden-technical'));assert(node.querySelector('pre.garden-event-source'));assert.equal(w.context.chat.at(-1).mes,original);
 for(const tab of ['party','quests','scene'])await click('[data-tab="'+tab+'"]');
 w.context.name1='<img src=x onerror=alert(1)>';await w.emit('persona');assert.equal(d.querySelector('#garden-left h3 img'),null);assert.equal(d.querySelector('#garden-left h3').textContent,w.context.name1);
 await click('[data-tab="party"]');
 d.querySelector('[data-form="portrait"] [name="portrait"]').value='https://example.com/zell.png';submit('[data-form="portrait"]');await waitFor(()=>profile().state.party[0].portrait==='https://example.com/zell.png');await new Promise(r=>setTimeout(r,10));
 d.querySelector('select[data-member]').value='zell';d.querySelector('select[data-member]').dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(d.querySelector('#garden-left h3').textContent,'Zell');assert.equal(d.querySelector('#garden-left .garden-profile img').src,'https://example.com/zell.png');
 await click('[data-tab="catalog"]');assert.equal(d.querySelectorAll('[data-catalog-entry]').length,188);const search=d.querySelector('[data-catalog-search]');search.value='Bahamut';search.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(d.querySelectorAll('[data-catalog-entry]:not([hidden])').length,1);
 await click('[data-tab="gf"]');d.querySelector('[data-form="canonical-gf"] [name="gf"]').value='bahamut';d.querySelector('[data-form="canonical-gf"] [name="acquired"]').checked=true;submit('[data-form="canonical-gf"]');await waitFor(()=>profile().state.party[0].state.gfs.some(g=>g.id==='bahamut'));await new Promise(r=>setTimeout(r,10));assert(!profile().state.party[0].state.equipped.includes('bahamut'));assert.equal(profile().state.party[0].state.gfs.find(g=>g.id==='bahamut').abilities.length,22);
 await click('[data-tab="party"]');
 // Exercise the PC file picker through resize/encode and persisted portrait.
 const oldClick=w.HTMLInputElement.prototype.click;let picker;
 w.HTMLInputElement.prototype.click=function(){if(this.type==='file')picker=this;else oldClick.call(this);};
 const oldImage=G.Image;G.Image=class{constructor(){this.naturalWidth=800;this.naturalHeight=600;}async decode(){}};
 const oldContext=w.HTMLCanvasElement.prototype.getContext,oldData=w.HTMLCanvasElement.prototype.toDataURL;
 w.HTMLCanvasElement.prototype.getContext=()=>({fillRect(){},drawImage(){}});w.HTMLCanvasElement.prototype.toDataURL=function(type){assert.equal(this.width,384);assert.equal(this.height,288);assert.equal(type,'image/jpeg');return 'data:image/jpeg;base64,/9j/AA==';};
 w.URL.createObjectURL=()=> 'blob:portrait-test';w.URL.revokeObjectURL=()=>{};
 await click('[data-action="upload-portrait"]');assert(picker);Object.defineProperty(picker,'files',{value:[new w.File(['image'],'portrait.png',{type:'image/png'})]});picker.onchange();await waitFor(()=>assetOf(profile().state.party[0].portrait)==='data:image/jpeg;base64,/9j/AA==');assert.match(profile().state.party[0].portrait,/^asset:/);await new Promise(r=>setTimeout(r,10));
 assert.equal(d.querySelector('#garden-left .garden-profile img').src,'data:image/jpeg;base64,/9j/AA==');
 await click('[data-action="clear-portrait"]');await waitFor(()=>profile().state.party[0].portrait==='');
 w.HTMLInputElement.prototype.click=oldClick;G.Image=oldImage;w.HTMLCanvasElement.prototype.getContext=oldContext;w.HTMLCanvasElement.prototype.toDataURL=oldData;
 await new Promise(r=>setTimeout(r,10));d.querySelector('[data-form="portrait"] [name="portrait"]').value='https://example.com/zell.png';submit('[data-form="portrait"]');await waitFor(()=>profile().state.party[0].portrait==='https://example.com/zell.png');await new Promise(r=>setTimeout(r,10));
 await click('[data-action="remove-member"]');await waitFor(()=>profile().state.party.length===0);assert.equal(d.querySelector('select[data-member]').value,'protagonist');
 await click('[data-action="undo"]');await waitFor(()=>profile().state.party.length===1);assert.equal(profile().state.party[0].portrait,'https://example.com/zell.png');
 // v0.3.1: IDs are scoped to their response, so a reused ID in a later response still applies.
 await click('[data-tab="events"]');const gil=profile().state.gil;
 await w.emit('start');w.context.chat.push({is_user:false,mes:'Loot.\n```garden-event\n{"id":"loot","type":"gil","amount":5}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===gil+5);await pause();
 await w.emit('start');w.context.chat.push({is_user:false,mes:'More loot.\n```garden-event\n{"id":"loot","type":"gil","amount":5,}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===gil+10);await pause();
 await click('[data-action="latest"]');await pause(30);assert.equal(profile().state.gil,gil+10,'re-reading the same response is still a no-op');
 await w.emit('start');w.context.chat.push({is_user:false,mes:'No ID, json fence.\n```json\n{"type":"gil","amount":1}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===gil+11);await pause();
 // Upgrade path: a response applied by 0.3.0 (unscoped ID, full-state timeline entry) is not applied twice.
 w.context.chat.push({is_user:false,mes:'```garden-event\n{"id":"legacy-reward","type":"gil","amount":3}\n```'});
 {const p=profile(),idx=w.context.chat.length-1,old=structuredClone(p.state);p.state.gil+=3;p.state.seenEvents.push('legacy-reward');p.timeline.push({index:idx,signature:JSON.stringify([w.context.chat[idx].mes,undefined,undefined]),before:old,after:structuredClone(p.state)});
 const g=p.state.gil;await click('[data-action="latest"]');await pause(30);assert.equal(profile().state.gil,g,'legacy response applied twice');w.context.chat.pop();p.timeline.pop();}
 // Timeline entries store only what changed.
 await w.emit('start');w.context.chat.push({is_user:false,mes:'```garden-event\n{"type":"gil","amount":1}\n```'});await w.emit('end');await waitFor(()=>profile().state.gil===gil+15);await pause();
 const entry=profile().timeline.at(-1);assert(!('gfs' in entry.after)&&!('party' in entry.after),'timeline entry should be a diff');assert.equal(entry.after.gil,gil+15);
 // The model receives cleaned copies; the real chat keeps its blocks.
 const outgoing=[...w.context.chat];await w.ff8GardenIntercept(outgoing);
 assert(outgoing.every(m=>!/garden-event|"amount"/.test(m.mes||'')),'event blocks reach the model');assert(w.context.chat.at(-1).mes.includes('"amount"'),'chat history was modified');assert(outgoing.at(-1)!==w.context.chat.at(-1),'cleaned message must be a copy');
 await click('[data-tab="party"]');await snapshot('garden-party');await click('[data-tab="junction"]');await snapshot('garden-junction');
 await click('[data-action="disable"]');assert.equal(d.body.classList.contains('garden-active'),false);assert.equal(d.querySelector('#garden-bar').hidden,true);assert.equal(w.prompts.ff8_garden_v1,'');
 assert(!w.notices.some(t=>t.startsWith('ERROR:')&&!t.includes('Unknown magic')));
}

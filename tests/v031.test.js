import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,starterKit,setJunction,parseEvents,stripEventBlocks,promptFor,applyEvent,SEEN_LIMIT} from '../engine.js';
import {campaign,applyCampaignEvent as apply,reverseChanges,diffStates,internPortraits,inlinePortraits,portraitSource,assetRefs,setPortrait,validateCampaign,campaignPrompt} from '../campaign.js';

const fence=body=>'Story text.\n```garden-event\n'+body+'\n```';
test('Parser repairs common near-JSON from small models',()=>{
 assert.equal(parseEvents(fence('{"type":"gil","amount":5,}'))[0].amount,5);
 assert.equal(parseEvents(fence('[{"type":"gil","amount":5},]')).length,1);
 assert.equal(parseEvents(fence('{\u201Ctype\u201D:\u201Cgil\u201D,\u201Camount\u201D:7}'))[0].amount,7);
 assert.deepEqual(parseEvents(fence('{"type":"gil","amount":1}\n{"type":"hp","amount":-2}')).map(e=>e.type),['gil','hp']);
 assert.equal(parseEvents('Cut off\n```garden-event\n{"type":"gil","amount":4}')[0].amount,4);
 assert.equal(parseEvents('```\n{"type":"magic","magic":"fire","amount":3}\n```')[0].magic,'fire');
 // Valid JSON is never rewritten, even when a string contains repair targets.
 assert.equal(parseEvents(fence('{"type":"memory","memory":"m","npc":"Rinoa","text":"She said \u201Chi,}\u201D"}'))[0].text,'She said \u201Chi,}\u201D');
});
test('Parser leaves story code alone and reports which block is broken',()=>{
 assert.equal(parseEvents('```python\nprint({"type":"gil"})\n```\n```json\n{"hello":1}\n```').length,0);
 assert.throws(()=>parseEvents(fence('{"type":"gil","amount":1}')+'\n'+fence('{wrong}')),/Event block 2: invalid JSON/);
});
test('Event blocks are stripped from text sent back to the model; other code survives',()=>{
 const text='Shiva appears.\n\n```garden-event\n{"type":"gil","amount":5}\n```\n\nThe end.\n```js\nlet x=1;\n```';
 const out=stripEventBlocks(text);
 assert(!out.includes('garden-event'));assert(!out.includes('"amount"'));assert(out.includes('Shiva appears.'));assert(out.includes('let x=1;'));
 assert.equal(stripEventBlocks('No events here.'),'No events here.');
});
test('Seen event IDs are trimmed instead of blocking new events',()=>{
 let s=freshState();s.seenEvents=Array.from({length:SEEN_LIMIT},(_,i)=>'old-'+i);
 s=applyEvent(s,{id:'fresh',type:'gil',amount:1}).state;
 assert.equal(s.gil,1);assert.equal(s.seenEvents.length,SEEN_LIMIT);assert.equal(s.seenEvents.at(-1),'fresh');
});

// Builds a realistic campaign, applies a batch, then checks that the stored diff reverses exactly like the full states.
function scenario(){
 let s=campaign(freshState());starterKit(s);setJunction(s,'str','fire');
 s=apply(s,{id:'p',type:'party',member:'zell',name:'Zell'}).state;starterKit(s.party[0].state);
 s=apply(s,{id:'q',type:'quest',quest:'exam',title:'SeeD exam',kind:'main',reward:{xp:1500,gil:300,ap:20}}).state;
 s.gfs[0].training='j_vit';
 for(let i=0;i<120;i++)s.log.unshift({at:'2026-01-01T00:00:00.000Z',text:'filler '+i});s.log=s.log.slice(0,100);
 return setPortrait(s,'zell','data:image/jpeg;base64,'+'A'.repeat(4000));
}
const batches=[
 [{id:'a1',type:'gil',amount:50},{id:'a2',type:'magic',magic:'fire',amount:-80}],
 [{id:'b1',type:'quest_complete',quest:'exam'}],
 [{id:'c1',type:'party',member:'selphie',name:'Selphie'},{id:'c2',type:'hp',amount:-120,target:'zell'},{id:'c3',type:'condition',condition:'poison',turns:3,target:'zell'}],
 [{id:'d1',type:'equipment',gear:'gloves',name:'Metal Knuckle',kind:'weapon',quantity:1,bonuses:{str:6}},{id:'d2',type:'memory',memory:'m1',npc:'Quistis',text:'Praised the exam.',important:true},{id:'d3',type:'scene',location:'Balamb',time:'Dusk',day:3,present:['Zell'],mission:'Report'}],
 [{id:'e1',type:'gf_discover',gf:'siren'},{id:'e2',type:'gf_acquire',gf:'siren'},{id:'e3',type:'ap',amount:30}]
];
test('Diff-only timeline entries reverse exactly like full snapshots',()=>{
 for(const batch of batches){
  const before=scenario();let after=before;for(const e of batch)after=apply(after,e).state;
  const later=[structuredClone(after),apply(after,{id:'manual-x',type:'gil',amount:7}).state,(()=>{const c=structuredClone(after);c.junction={};c.magic.blizzard=33;return c;})()];
  const {before:b,after:a}=diffStates(before,after);
  for(const current of later)assert.deepEqual(reverseChanges(current,b,a),reverseChanges(current,before,after),'batch '+batch[0].id);
  assert(JSON.stringify({b,a}).length*5<JSON.stringify({before,after}).length,'diff should be much smaller for batch '+batch[0].id);
 }
});
test('Portraits are stored once by key and restored for export and import',()=>{
 const data='data:image/jpeg;base64,/9j/'+'B'.repeat(2000),assets={};
 const s=internPortraits(setPortrait(scenario(),'zell',data),assets);
 const ref=s.party[0].portrait;assert.match(ref,/^asset:/);assert.equal(portraitSource(ref,assets),data);
 assert.deepEqual([...assetRefs(s)],[ref.slice(6)]);
 assert.equal(internPortraits(structuredClone(setPortrait(scenario(),'zell',data)),assets).party[0].portrait,ref,'same image gives the same key');
 const exported=JSON.parse(JSON.stringify(inlinePortraits(s,assets)));assert.equal(exported.party[0].portrait,data);
 assert.equal(validateCampaign(exported).party[0].portrait,data);
 assert.equal(portraitSource('https://example.com/a.png',assets),'https://example.com/a.png');assert.equal(portraitSource('asset:missing',assets),'');
});
test('Prompt is compact and no longer teaches a reusable example ID',()=>{
 const s=scenario(),prompt=promptFor(s,'Squall')+campaignPrompt(s);
 assert(!prompt.includes('discovery-001'));assert(!prompt.includes('Ability x4'),'full ability catalog should not be sent');
 assert(prompt.includes('j_hp'));assert(prompt.includes('siren'));assert(!prompt.includes('data:image'));
 assert(prompt.length<5200,'prompt length '+prompt.length);
});

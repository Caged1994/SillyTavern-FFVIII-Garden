import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,starterKit,values,setJunction,equipGF,available,addAP,applyEvent,parseEvents,validateState,useItem,englishState,englishLog,promptFor} from '../engine.js';

test('Junction requires learned GF ability and magic stock; effects scale with stock',()=>{
 const s=freshState();assert.throws(()=>setJunction(s,'str','fire'));
 starterKit(s);setJunction(s,'str','fire');assert.equal(values(s).str,18);
 s.magic.fire=40;assert.equal(values(s).str,14);
 assert.throws(()=>setJunction(s,'mag','fire'),/already junctioned/);
 setJunction(s,'str','');setJunction(s,'mag','fire');assert.equal(values(s).mag,14);
});
test('Unequipping GF clears unavailable Junction and caps current HP',()=>{
 const s=freshState();starterKit(s);setJunction(s,'str','fire');equipGF(s,'shiva');assert.equal(s.junction.str,undefined);
 assert(!available(s).has('j_str'));
 setJunction(s,'hp','cure');s.hp=980;equipGF(s,'quezacotl');assert.equal(values(s).hp,500);assert.equal(s.hp,500);
});
test('New GF can be discovered then acquired; no automatic equip or free AP skills',()=>{
 let s=freshState();s=applyEvent(s,{id:'e1',type:'gf_discover',gf:'vesper',name:'Vesper',description:'Night moth',element:'Non-elemental',abilities:['j_hp','magic']}).state;
 assert.equal(s.gfs[0].acquired,false);assert.deepEqual(s.gfs[0].learned,['magic']);assert.throws(()=>equipGF(s,'vesper'));
 s=applyEvent(s,{id:'e2',type:'gf_acquire',gf:'vesper'}).state;assert.deepEqual(s.equipped,[]);equipGF(s,'vesper');
 s.gfs[0].training='j_hp';addAP(s,49);assert(!available(s).has('j_hp'));addAP(s,1);assert(available(s).has('j_hp'));assert.equal(s.gfs[0].training,null);
});
test('Events are immutable, validated and deduplicated',()=>{
 const s=freshState(),e={id:'reward-1',type:'gil',amount:100};const result=applyEvent(s,e);assert.equal(s.gil,0);assert.equal(result.state.gil,100);
 assert.equal(applyEvent(result.state,e).duplicate,true);assert.equal(applyEvent(result.state,e).state.gil,100);
 assert.throws(()=>applyEvent(s,{id:'bad',type:'magic',magic:'constructor',amount:1}));
 assert.throws(()=>applyEvent(s,{id:'bad',type:'hp',amount:'-20'}));
 assert.throws(()=>applyEvent(s,{id:'bad',type:'gf_discover',gf:'x',name:'X',description:'X',element:'Fire',abilities:['invincible']}));
 assert.equal(s.gfs.length,0);
});
test('Stock depletion removes Junction; quantities cap at 100',()=>{
 let s=freshState();starterKit(s);setJunction(s,'str','fire');s=applyEvent(s,{id:'use',type:'magic',magic:'fire',amount:-100}).state;assert.equal(s.junction.str,undefined);
 s=applyEvent(s,{id:'draw',type:'magic',magic:'fire',amount:100}).state;s=applyEvent(s,{id:'draw2',type:'magic',magic:'fire',amount:50}).state;assert.equal(s.magic.fire,100);
});
test('Fenced protocol parses only marked blocks and rejects malformed JSON',()=>{
 assert.equal(parseEvents('```json\n{"type":"gil"}\n```').length,0);
 assert.equal(parseEvents('Story\n```garden-event\n[{"id":"x","type":"gil","amount":3}]\n```')[0].amount,3);
 assert.throws(()=>parseEvents('```garden-event\n{wrong}\n```'));
});
test('Import roundtrip and rejection of corrupt or dangerous state',()=>{
 const s=freshState();starterKit(s);setJunction(s,'hp','cure');assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>validateState({...s,level:500}));assert.throws(()=>validateState({...s,base:{...s.base,hp:NaN}}));
 assert.throws(()=>validateState({...s,gfs:[...s.gfs,s.gfs[0]]}));
 const clean=validateState({...s,extra:'not accepted'});assert.equal(clean.extra,undefined);
});
test('Inventory healing obeys KO and full HP; no item lost on rejected use',()=>{
 const s=freshState();s.items={potion:2,phoenix:1};assert.throws(()=>useItem(s,'potion'));assert.equal(s.items.potion,2);
 s.hp=250;useItem(s,'potion');assert.equal(s.hp,450);assert.equal(s.items.potion,1);
 s.hp=0;assert.throws(()=>useItem(s,'potion'));useItem(s,'phoenix');assert.equal(s.hp,125);assert.equal(s.items.phoenix,0);
});
test('Italian v0.1 saves and payloads retain resources and Junctions in the English version',()=>{
 const s=freshState();starterKit(s);setJunction(s,'str','fire');
 s.gfs[0].element='Ghiaccio';s.gfs[0].description='La regina dei ghiacci.';
 s.gfs[1].element='Tuono';s.gfs[1].description='My custom description';
 s.log=[{at:'2026-10-10T21:00:00Z',text:'GF incontrato: Vesper'},{at:'2026-10-10T21:00:00Z',text:'Junction Forza'}];
 const migrated=englishState(s),imported=validateState(s);
 assert.deepEqual(imported,migrated);assert.equal(migrated.gfs[0].element,'Ice');assert.equal(migrated.gfs[0].description,'The queen of ice.');
 assert.equal(migrated.gfs[1].description,'My custom description');assert.deepEqual(migrated.magic,s.magic);assert.deepEqual(migrated.junction,s.junction);
 assert.equal(values(migrated).str,18);assert.equal(s.gfs[0].element,'Ghiaccio');
 assert.equal(migrated.log[0].text,'GF encountered: Vesper');assert.equal(englishLog('GF acquisito: Vesper'),'GF acquired: Vesper');
 assert.equal(englishLog('Cura++: +10'),'Curaga: +10');assert.equal(englishLog('2 eventi IA'),'2 AI events');
 const next=applyEvent(freshState(),{id:'legacy',type:'gf_discover',gf:'vesper',name:'Vesper',description:'Custom',element:'Non elementale',abilities:['j_mag','magic']}).state;
 assert.equal(next.gfs[0].element,'Non-elemental');assert.match(promptFor(migrated,'Lucas'),/You handle narration/);
});

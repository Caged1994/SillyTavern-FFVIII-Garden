import test from 'node:test';
import assert from 'node:assert/strict';
import {MAGIC,ABILITIES,GF_CATALOG,freshState,applyEvent,equipGF,validateState,values,setJunction,passiveLimit,reconcile} from '../engine.js';
test('Full English catalog contains every stock spell, ability category and Junctionable GF',()=>{
 assert.equal(Object.keys(MAGIC).length,50);assert.equal(Object.keys(ABILITIES).length,115);assert.equal(Object.values(GF_CATALOG).filter(g=>!g.summonOnly).length,16);
 for(const spell of ['firaga','blizzaga','thundaga','full_life','triple','meltdown','pain','apocalypse'])assert(MAGIC[spell]);
 for(const category of ['junction','command','passive','party','gf','menu'])assert(Object.values(ABILITIES).some(a=>a.kind===category));
 for(const gf of Object.values(GF_CATALOG)){
  assert(gf.abilities.every(id=>ABILITIES[id]));assert(gf.learned.every(id=>gf.abilities.includes(id)));
  const registered=applyEvent(freshState(),{id:'discover',type:'gf_discover',gf:gf.id}).state;
  assert.equal(registered.gfs[0].acquired,false);assert.equal(registered.equipped.length,0);assert.deepEqual(validateState(registered),registered);
 }
});
test('Canonical discovery fills definitions; acquisition and equipment remain separate; special invocations never equip',()=>{
 let s=applyEvent(freshState(),{id:'d',type:'gf_discover',gf:'bahamut'}).state;assert.equal(s.gfs[0].abilities.length,22);
 assert.throws(()=>equipGF(s,'bahamut'));s=applyEvent(s,{id:'a',type:'gf_acquire',gf:'bahamut'}).state;assert.equal(s.equipped.length,0);equipGF(s,'bahamut');assert.equal(passiveLimit(s),4);
 s=applyEvent(s,{id:'od',type:'gf_discover',gf:'odin'}).state;s=applyEvent(s,{id:'oa',type:'gf_acquire',gf:'odin'}).state;assert.throws(()=>equipGF(s,'odin'));
});
test('New spell Junction, Evasion migration and ability slot limits work with old saves',()=>{
 let s=freshState();delete s.base.eva;const restored=validateState(s);assert.equal(restored.base.eva,0);
 s=applyEvent(restored,{id:'d',type:'gf_discover',gf:'eden'}).state;s=applyEvent(s,{id:'a',type:'gf_acquire',gf:'eden'}).state;equipGF(s,'eden');s.magic.triple=100;setJunction(s,'eva','triple');assert.equal(values(s).eva,MAGIC.triple.bonus[8]);
 s.magic.apocalypse=100;assert.throws(()=>setJunction(s,'eva','apocalypse'));
 let b=applyEvent(freshState(),{id:'b',type:'gf_discover',gf:'bahamut'}).state;b=applyEvent(b,{id:'a',type:'gf_acquire',gf:'bahamut'}).state;equipGF(b,'bahamut');b.gfs[0].learned.push('rare_item','auto_protect');b.passives=['str60','mag60','rare_item','auto_protect'].filter(id=>ABILITIES[id].kind==='passive');reconcile(b);assert.equal(b.passives.length,3);assert.equal(values(b).str,16);assert.equal(validateState(b).passives.length,3);
});

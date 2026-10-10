import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../engine.js';
import {applyCampaignEvent,removeMember,setPortrait,validateCampaign} from '../campaign.js';
test('Companion portrait persists through export/import and rejects unsafe URLs',()=>{
 const s=applyCampaignEvent(freshState(),{id:'p',type:'party',member:'zell',name:'Zell'}).state;
 const next=setPortrait(s,'zell','https://example.com/zell.png');
 assert.equal(s.party[0].portrait,undefined);
 assert.equal(validateCampaign(JSON.parse(JSON.stringify(next))).party[0].portrait,'https://example.com/zell.png');
 assert.equal(setPortrait(next,'zell','').party[0].portrait,'');
 for(const url of ['javascript:alert(1)','data:image/svg+xml,x','http://example.com/a','https://user:pass@example.com/a'])assert.throws(()=>setPortrait(s,'zell',url));
});
test('Removal preserves protagonist resources, other companions and original undo snapshot',()=>{
 let s=applyCampaignEvent(freshState(),{id:'p',type:'party',member:'zell',name:'Zell'}).state;
 s=applyCampaignEvent(s,{id:'q',type:'party',member:'selphie',name:'Selphie'}).state;
 s.scene.present=['Zell','Selphie'];s.gil=50;
 const next=removeMember(s,'zell');assert.equal(next.gil,50);assert.deepEqual(next.party.map(m=>m.id),['selphie']);assert.deepEqual(next.scene.present,['Selphie']);assert.equal(s.party.length,2);assert.throws(()=>removeMember(s,'protagonist'));
});

// jsdom runner for tests/ui-suite.js. Requires `npm ci` (jsdom is a dev dependency only).
const {JSDOM}=require('jsdom');const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const {pathToFileURL}=require('node:url');
(async()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'ui-fixture.html'),'utf8'),{url:'http://localhost:8765/qa/harness.html',runScripts:'dangerously'});const w=dom.window;
 Object.assign(global,{window:w,document:w.document,SillyTavern:w.SillyTavern,FormData:w.FormData,URL:w.URL});
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'garden-ui-'));const dest=path.join(temp,'public/scripts/extensions/third-party/garden');fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(temp,'package.json'),'{"type":"module"}');for(const file of ['index.js','engine.js','campaign.js','catalog.js'])fs.copyFileSync(path.join(__dirname,'..',file),path.join(dest,file));fs.writeFileSync(path.join(temp,'public/scripts/personas.js'),"export let user_avatar='lucas.png';export function getUserAvatar(a){return 'User Avatars/'+a;}window.changeAvatar=a=>user_avatar=a;");
 await import(pathToFileURL(path.join(dest,'index.js')).href);
 const {run}=await import(pathToFileURL(path.join(__dirname,'ui-suite.js')).href);
 await run({w,d:w.document,G:global});
 console.log('PASS DOM (jsdom): Junction, AP, Persona isolation, events, scoped IDs, tolerant parsing, outgoing cleanup, diff timeline, undo, atomic rejection, save, escaping, party, missions, swipe/edit/delete restoration, portraits and disable.');
 dom.window.close();fs.rmSync(temp,{recursive:true,force:true});
})().catch(e=>{console.error(e);process.exitCode=1;});

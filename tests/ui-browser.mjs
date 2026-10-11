// Real-browser runner for tests/ui-suite.js (Chromium through Playwright).
// Playwright is not a project dependency: install it globally or run `npx playwright` once.
// Usage: npm run test:browser   (screenshots go to tests/screenshots/ when SCREENSHOTS=1)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let chromium;
try{({chromium}=await import('playwright'));}
catch{try{const globalRoot=execSync('npm root -g',{encoding:'utf8'}).trim();({chromium}=createRequire(path.join(globalRoot,'noop.js'))('playwright'));}catch{console.error('Playwright is not installed. Run: npm install -g playwright && npx playwright install chromium');process.exit(1);}}

const persona="export let user_avatar='lucas.png';export function getUserAvatar(a){return 'User Avatars/'+a;}window.changeAvatar=a=>user_avatar=a;";
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html'};
// Same layout SillyTavern uses: index.js imports ../../../../scripts/personas.js relative to itself.
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://x').pathname;let body=null,file=null;
 if(url==='/qa/harness.html')file=path.join(root,'tests/ui-fixture.html');
 else if(url==='/scripts/personas.js')body=persona;
 else if(url==='/tests/ui-suite.js')file=path.join(root,'tests/ui-suite.js');
 else if(/^\/ff8-garden\/[\w-]+\.(js|css)$/.test(url))file=path.join(root,url.slice('/ff8-garden/'.length));
 if(file&&fs.existsSync(file))body=fs.readFileSync(file);
 if(body===null){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'content-type':types[path.extname(file||url)]||'text/plain'});res.end(body);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const page=await browser.newPage({viewport:{width:1600,height:900}});
const problems=[];
page.on('pageerror',e=>problems.push('page error: '+e.message));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))problems.push('console: '+m.text());});
if(process.env.SCREENSHOTS){fs.mkdirSync(path.join(root,'tests/screenshots'),{recursive:true});}
await page.exposeFunction('gardenSnapshot',async name=>{if(process.env.SCREENSHOTS)await page.screenshot({path:path.join(root,'tests/screenshots',name+'.png')});});
let failed=false;
try{
 await page.goto(base+'/qa/harness.html');
 await page.waitForSelector('#garden-left h3');
 await page.evaluate(async()=>{const {run}=await import('/tests/ui-suite.js');await run({w:window,d:document,G:window,snapshot:n=>window.gardenSnapshot(n)});});
 if(problems.length)throw Error(problems.join('\n'));
 console.log('PASS DOM (Chromium): full UI suite in a real browser.');
}catch(e){failed=true;console.error(e.message||e);}
finally{await browser.close();server.close();}
process.exitCode=failed?1:0;

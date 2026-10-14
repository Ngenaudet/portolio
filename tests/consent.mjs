import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('../consent.js',import.meta.url),'utf8');
function fixture(saved=null,host='nicolas-genaudet.fr') {
 const events={},scripts=[],cookies=[],store=new Map(saved?[['ng-portfolio-consent-v1',JSON.stringify(saved)]]:[]);
 const button=name=>({addEventListener:(type,fn)=>events[name]=fn,focus:()=>{}});
 const banner={hidden:true,querySelector:s=>button(s)};
 const document={querySelector:()=>banner,querySelectorAll:()=>[button('settings')],createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 Object.defineProperty(document,'cookie',{get:()=> '_ga=old; _ga_NWBTJB68HL=old',set:v=>cookies.push(v)});
 const context={document,location:{hostname:host,reload:()=>{context.reloaded=true}},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},Date,JSON};
 context.window=context;context.addEventListener=(name,fn)=>events[name]=fn;
 vm.runInNewContext(code,context);
 return {context,banner,scripts,cookies,store,events};
}
let f=fixture();assert.equal(f.scripts.length,0);assert.equal(f.banner.hidden,false);
f.events['[data-reject]']();assert.equal(f.scripts.length,0);assert.equal(JSON.parse(f.store.get('ng-portfolio-consent-v1')).analytics,false);
f=fixture();f.events['[data-accept]']();assert.equal(f.scripts.length,1);assert.match(f.scripts[0].src,/G-BF3V4MJ92S/);assert.equal(f.context.dataLayer[0][2].ad_storage,'denied');
f.events.settings();assert.equal(f.banner.hidden,false);f.events['[data-reject]']();assert.equal(f.context['ga-disable-G-BF3V4MJ92S'],true);assert.equal(f.context.reloaded,true);assert.ok(f.cookies.some(c=>c.startsWith('_ga=;')));
f=fixture({analytics:false,expires:Date.now()+100000});assert.equal(f.scripts.length,0);assert.equal(f.banner.hidden,true);
f=fixture({analytics:true,expires:Date.now()-1});assert.equal(f.scripts.length,0);assert.equal(f.banner.hidden,false);
f=fixture(null,'127.0.0.1');f.events['[data-accept]']();assert.equal(f.scripts.length,0);
console.log('Consentement : blocage initial, refus, acceptation, retrait, expiration et aperçu local vérifiés.');

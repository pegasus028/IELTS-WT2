/* Spaced-review and streak dates are Bangkok calendar dates whatever the device time zone.
   node tools/date-test.js */
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(require('path').join(__dirname,'..','engine.js'),'utf8');
const grab=n=>{const i=src.indexOf('function '+n+'(');let d=0,j=src.indexOf('{',i);for(;;j++){if(src[j]=='{')d++;if(src[j]=='}'){d--;if(!d)break;}}return src.slice(i,j+1);};
const code='var TZ_MS=7*3600000;'+grab('today')+grab('daysBetween')+grab('addDays');
const RealDate=Date;let fails=0;
function at(iso){const t=new RealDate(iso).getTime();const D=class extends RealDate{constructor(...a){a.length?super(...a):super(t)}static now(){return t}};const ctx={Date:D};vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;}
const ck=(l,c,x)=>{console.log((c?'ok   ':'FAIL ')+l+(c?'':' '+x));if(!c)fails++;};
for(const tz of ['Asia/Bangkok','UTC','America/Los_Angeles']){process.env.TZ=tz;
 let c=at('2026-10-12T13:00:00Z'); // 20:00 BKK
 ck(tz+' 20:00 BKK today=12', c.today()==='2026-10-12',c.today());
 ck(tz+' box1 due 13', c.addDays(c.today(),1)==='2026-10-13',c.addDays(c.today(),1));
 ck(tz+' box2 due 15', c.addDays(c.today(),3)==='2026-10-15');
 c=at('2026-10-12T23:30:00Z'); ck(tz+' 06:30 BKK 13 Oct', c.today()==='2026-10-13',c.today());
 const d1=c.today(); c=at('2026-10-13T00:30:00Z'); ck(tz+' same morning = 0 days', c.daysBetween(d1,c.today())===0);
 c=at('2026-10-12T16:30:00Z'); ck(tz+' 23:30 BKK still 12', c.today()==='2026-10-12'); c=at('2026-10-12T17:30:00Z'); ck(tz+' 00:30 BKK is 13', c.today()==='2026-10-13');
 ck(tz+' month end', c.addDays('2026-10-31',1)==='2026-11-01');}
console.log(fails?fails+' failures':'all date checks passed');

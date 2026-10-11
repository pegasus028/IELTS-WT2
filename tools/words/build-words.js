const fs=require('fs'), path=require('path');
const [,, cardsFile, outFile]=process.argv;
const cards=JSON.parse(fs.readFileSync(cardsFile));
const icons={}, words={};
for(const c of cards){
  let f=path.join(__dirname,'node_modules/lucide-static/icons',c.icon+'.svg');
  if(!fs.existsSync(f)){ console.error('no icon',c.icon,c.word); c.icon='book-open'; f=path.join(__dirname,'node_modules/lucide-static/icons/book-open.svg'); }
  if(!icons[c.icon]){ const s=fs.readFileSync(f,'utf8').replace(/<!--[\s\S]*?-->/g,''); icons[c.icon]=s.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/\s*\n\s*/g,'').trim(); }
  const e={w:c.word,pos:c.pos,lv:c.level,g:c.gloss,t:c.thai,ex:c.example,i:c.icon,syn:c.syn.map(x=>[x.w,x.lv]),ant:c.ant.map(x=>[x.w,x.lv])};
  if(c.antNote) e.an=c.antNote;
  words[c.word.toLowerCase()]=e;
}
const hdr=`/* QUILLMOOR ACADEMY — story-words.js
   The word cards behind every keyword pop-up in the story: a picture, a B1 gloss,
   Thai, an example, and three synonyms and three antonyms (B1, B2, C1), each of
   which opens its own card when it has one. ${Object.keys(words).length} cards: the ${51} story keywords
   plus every synonym and antonym on their cards. Drafted and adversarially reviewed
   by Claude, Oct 2026. Pictures: Lucide icons (ISC licence, lucide.dev), drawn by
   story.js as a framed plate — no AI image generation.
   Rebuild: in tools/words, npm i lucide-static, edit cards.json, then node build-words.js cards.json ../../story-words.js */
`;
fs.writeFileSync(outFile, hdr+'window.QM_WORDS = '+JSON.stringify({icons,words})+';\n');
console.log(Object.keys(words).length,'cards',Object.keys(icons).length,'icons',fs.statSync(outFile).size,'bytes');

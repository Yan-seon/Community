import {say, type Album, type Lang, type Work} from './community-v3.ts';
import {type CommunityPost} from './free-community.ts';

export type Related = {post:CommunityPost; reasons:string[]};
export type ExperienceSource = {key:string; threadId:string; author:string; album:Album; quoteAuthor?:string};
const words=(s:string)=>new Set(s.toLowerCase().match(/[a-z]{4,}/g)||[]);
const ignored=new Set(['this','that','with','what','when','have','your','from','would','experience','someone','community','reference','photo','photograph','image','like','looks','look','first','start','which','there','these','them','then','about','some','anyone','little','just','more','want','rather','keep','been','does','really','same','different','thing','things','also','most','before','after','because','into','were','their','they','need','small','without','still','much','make','could','people']);
const topicWords:Record<string,RegExp>={
 'lip colour':/\b(lipstick|gloss|balm|lips?|red.lip|nude)\b/i,
 'eye technique':/\b(eye|eyeshadow|shadow|lid|blending|blend)\b/i,
 'brushes and tools':/\b(brush|brushes|applicator|applicators|tools?)\b/i,
 'base application':/\b(base|primer|foundation|pilling|cushion|puff|powder|patchiness)\b/i,
 'nail colour':/\b(nails?|polish|manicure)\b/i,
 'welcoming and returning':/\b(welcome|welcoming|newcomer|first post|quiet reader|small wins)\b/i,
 'body-care routine':/\b(body|cream|cleansing|jar|routine)\b/i,
};
/** Transparent preset matching. No semantic model, endorsement or member ranking. */
export function relatedPosts(current:CommunityPost,posts:CommunityPost[],lang:Lang):Related[]{
 const input=words(say(lang,current.title)+' '+say(lang,current.body));
 const inputText=say(lang,current.title)+' '+say(lang,current.body);
 return posts.filter(p=>p.id!==current.id).map(post=>{
  const text=say(lang,post.title)+' '+say(lang,post.body),tokens=words(text);
  const shared=[...input].filter(w=>!ignored.has(w)&&tokens.has(w));
  const topics=Object.entries(topicWords).filter(([,rx])=>rx.test(inputText)&&rx.test(text)).map(([name])=>name);
  const same=post.story===current.story;
  return {post,score:(same?1:0)+topics.length*5+Math.min(shared.length,4),reasons:[...(topics.length?['Preset topic match: '+topics.join(', ')]:[]),...(same?['Same discussion group']:[]),...(shared.length?['Shared topic words: '+shared.slice(0,3).join(', ')]:[])]};
 }).filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.post.id.localeCompare(b.post.id)).slice(0,3);
}
export type MaterialKey='return'|'context'|'quote'|'limits';
export function arrangeExperience(w:Work,selected:MaterialKey[]):string{
 const u=w.updates.at(-1);if(!u)return '';
 return [selected.includes('return')?'What I noticed: '+u.text:'',selected.includes('context')&&u.context?'Context: '+u.context:'',selected.includes('quote')&&w.selectedQuote?'Member contribution ('+(w.selectedQuoteAuthor||'member')+'): '+w.selectedQuote:'',selected.includes('limits')&&u.limits?'Still open: '+u.limits:''].filter(Boolean).join('\n');
}
export function prepareHandoff(source:ExperienceSource,target:string,shared:string,difference:string):string{
 const a=source.album;
 return ['Your question: '+target,'One experience from '+source.author+' may be worth comparing: '+a.text,shared?'A connection I see: '+shared:'',difference?'What may differ here: '+difference:'The conditions here have not been compared with that experience.',a.limits?'Limits in the original record: '+a.limits:'The original record did not supply additional limits.',`Source: ${a.title} · version ${a.version}. This is a situated experience, not a result promised for everyone.`].filter(Boolean).join('\n\n');
}

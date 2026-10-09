import {say, type Album, type Lang, type Work} from './community-v3.ts';
import {type CommunityPost} from './free-community.ts';

export type Related = {post:CommunityPost; reasons:string[]};
export type ExperienceSource = {key:string; threadId:string; author:string; album:Album; quoteAuthor?:string};
const words=(s:string)=>new Set(s.toLowerCase().match(/[a-z]{4,}/g)||[]);
const ignored=new Set(['this','that','with','what','when','have','your','from','would','experience','someone','community']);
/** Transparent preset matching. No semantic model, endorsement or member ranking. */
export function relatedPosts(current:CommunityPost,posts:CommunityPost[],lang:Lang):Related[]{
 const input=words(say(lang,current.title)+' '+say(lang,current.body));
 return posts.filter(p=>p.id!==current.id).map(post=>{
  const tokens=words(say(lang,post.title)+' '+say(lang,post.body));
  const shared=[...input].filter(w=>!ignored.has(w)&&tokens.has(w));
  const same=post.story===current.story;
  return {post,score:(same?10:0)+Math.min(shared.length,5),reasons:[...(same?['Same discussion group']:[]),...(shared.length?['Shared topic words: '+shared.slice(0,3).join(', ')]:[])]};
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

import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {publicMediation,questionPrompt} from '../lib/ai-mediation.ts';
import {relatedPosts} from '../lib/interaction-patterns.ts';
import {postFromRow,seedPosts} from '../lib/free-community.ts';
const base=JSON.parse(fs.readFileSync(new URL('../data/community-background.json',import.meta.url),'utf8'));
const episodes=JSON.parse(fs.readFileSync(new URL('../data/community-practice-episodes.json',import.meta.url),'utf8'));
const all=[...base.rows,...episodes.rows] as any[];
test('every new reference resolves and each helper reply or follow-up has a real parent',()=>{
 for(const r of episodes.rows){assert(r.metadata.synthetic_seed&&r.metadata.simulation.not_participant_evidence);assert(!('created_at' in r));assert.equal(r.metadata.entity,'contribution');
  if(r.quoted_comment_id){const p=all.find(p=>p.id===r.quoted_comment_id);assert(p);assert.equal(r.quoted_text,p.body);assert.equal(r.metadata.quote_author,p.display_name);assert.equal(r.metadata.thread_id,p.metadata.thread_id);}
  if(r.image_anchor){const p=base.posts.find((p:any)=>p.id===r.metadata.thread_id);assert.equal(r.image_anchor.photo,p.photo);}
 }
 assert.equal(episodes.episodes.length,8);for(const e of episodes.episodes){assert(all.find(r=>r.id===e.question_id)?.image_anchor);assert.equal(publicMediation(all.find(r=>r.id===e.followup_id).metadata)?.kind,'quote');}
});
test('five AI moments have observable consequences while most discussion remains ordinary',()=>{
 const ai=episodes.rows.filter((r:any)=>publicMediation(r.metadata));assert.equal(ai.length,28);
 assert.deepEqual([...new Set(ai.map((r:any)=>publicMediation(r.metadata)!.kind))].sort(),['album','pass','question','quote','route']);
 assert(episodes.rows.filter((r:any)=>!r.metadata.public_ai).length>ai.length);
 assert(episodes.rows.some((r:any)=>r.metadata.ai_choice?.includes('declined')));
 for(const r of ai.filter((r:any)=>r.kind==='handoff')){const s=r.metadata.experience_source;const source=all.find(r=>'album:'+r.id===s.key);assert.equal(s.album.limits,source.metadata.limits);assert.equal(s.album.version,source.metadata.album.version);assert(source.metadata.album.sourceIds.every((s:string)=>!s.startsWith('comment:')||all.find(r=>r.id===s.slice(8))));}
});
test('public assistance does not leak a visitor’s before-draft or permit arbitrary destination URLs',()=>{
 const x={public_ai:{kind:'question',reference:'selected image',decision:'edited',original:'private text',proposal:'private suggestion',connection:{threadId:'https://example.com',title:'external',reason:'x'}}};
 const m=publicMediation(x);assert(m);assert(!m.original);assert(!m.proposal);assert(!m.connection);
 assert(publicMediation({...x,synthetic_seed:true})?.original);assert.equal(publicMediation({public_ai:{kind:'moderator'}}),undefined);
});
test('question intention preserves the member wording and never claims to recognise an image',()=>{
 const p=postFromRow({...base.rows.find((r:any)=>r.metadata.entity==='community_post'),created_at:''})!;
 const q=questionPrompt(p,{x:.2,y:.7,photo:p.photo!},'My own hesitant wording','difference');assert(q.startsWith('My own hesitant wording'));assert(q.includes('marked'));assert(q.includes('different experience'));assert(!q.includes('diagnos'));
 const t=questionPrompt({...p,photo:null},null,'','conditions');assert(t.includes(p.title[0]));assert(!t.includes('marked'));
});
test('topic presets privilege a real connection over incidental photo/reference wording',()=>{
 const posts=[...seedPosts,...base.rows.map((r:any)=>postFromRow({...r,created_at:''})).filter(Boolean)];
 const p=posts.find((p:any)=>p.id===base.posts[0].id)!;
 const matches=relatedPosts(p,posts,'en');assert(matches.some(r=>r.reasons.some(s=>s.includes('lip colour'))));assert(!matches.some(r=>r.post.id===base.posts[23].id));
 for(const r of episodes.rows.filter((r:any)=>r.metadata.public_ai?.kind==='route')){const origin=posts.find((p:any)=>p.id===r.metadata.thread_id)!;assert(relatedPosts(origin,posts,'en').some(x=>x.post.id===r.metadata.public_ai.connection.threadId));}
});

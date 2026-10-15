import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {postFromRow,seedProvenance,isTestContribution} from '../lib/free-community.ts';
import {photos} from '../lib/community-v3.ts';
const corpus=JSON.parse(fs.readFileSync(new URL('../data/community-background.json',import.meta.url),'utf8'));
const rows=corpus.rows as any[];
test('the batch describes 20 fictional characters and contains no participant outcomes',()=>{
 assert.equal(corpus.members.length,20);assert.equal(new Set(corpus.members.map((m:any)=>m.id)).size,20);
 assert.equal(corpus.posts.length,35);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
 for(const r of rows){assert(r.metadata.synthetic_seed);assert(r.metadata.simulation.not_participant_evidence);assert(!('created_at' in r));assert(r.body.length<=4000);assert(!isTestContribution(r));assert(seedProvenance(r.metadata));}
});
test('every photo and quote has a real corresponding object',()=>{
 for(const r of rows){
  if(r.metadata.entity==='community_post'){const p=postFromRow({...r,created_at:'2026-10-15T10:00:00Z'});assert(p?.seed);assert.equal(p?.createdAt,r.metadata.simulation.scenario_at);if(r.metadata.photo)assert(photos[r.metadata.photo as keyof typeof photos]);}
  if(r.quoted_comment_id){const parent=rows.find(p=>p.id===r.quoted_comment_id);assert(parent);assert.equal(r.quoted_text,parent.body);assert.equal(r.metadata.quote_author,parent.display_name);}
  if(r.image_anchor){const thread=rows.find(p=>p.id===r.metadata.thread_id);assert.equal(r.image_anchor.photo,thread.metadata.photo);assert(r.image_anchor.x>0&&r.image_anchor.x<1);}
 }
});
test('each passed experience preserves its actual source version and limitations',()=>{
 for(const r of rows.filter(r=>r.kind==='handoff')){const s=r.metadata.experience_source;const a=rows.find(r=>'album:'+r.id===s.key);assert(a);assert.equal(s.album.text,a.metadata.album.text);assert.equal(s.album.limits,a.metadata.album.limits);assert.equal(s.album.version,a.metadata.album.version);assert(corpus.posts.find((p:any)=>p.id===s.threadId));}
});
test('unrecognised media cannot become a remote URL or break the photo lookup',()=>{
 const r=rows.find(r=>r.metadata.entity==='community_post');const p=postFromRow({...r,created_at:'2026-10-15T10:00:00Z',metadata:{...r.metadata,photo:'https://invalid.example/tracker',simulation:{...r.metadata.simulation,sources:['javascript:alert(1)','https://example.com/source']}}});
 assert.equal(p?.photo,null);assert.deepEqual(p?.provenance?.sources,['https://example.com/source']);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,emptyWork,startStudy,assignment,sequenceAssignments,finishPhase,log,canFinish,publishAlbum,albumProposal,clampAnchor,moments,restore,exportCsv} from '../lib/community-v3.ts';

function completedWork(){let w=emptyWork();w.question='What did you try?';w.responseShown=true;w.updates=[{id:'qa-update',text:'One attempt, uncertain cause.',photo:'base',context:'Window light',limits:'Only once',at:new Date().toISOString()}];w.albumTitle='Our story';w.albumDraft=albumProposal(w,'en');w=publishAlbum(w,'A');w.passed='Ari helped; this may differ for you.';return w;}
test('gratitude is optional; publication and passing help remain required',()=>{const w=completedWork();assert.equal(w.thanks,'');assert.equal(canFinish(w),true);assert(!moments(w).includes('thanks'));assert.equal(canFinish({...w,passed:''}),false);assert.equal(canFinish({...w,versions:[]}),false);});
test('all four sequences counterbalance case, condition and order',()=>{for(const phase of [0,1]){assert.deepEqual(sequenceAssignments.map(s=>s[phase].mode+':'+s[phase].story).sort(),['embedded:A','embedded:B','separate:A','separate:B']);}});
test('phase snapshots are immutable and N/A remains null',()=>{const w=completedWork();let s=startStudy('P999','en',0);s=finishPhase(s,w,'I would retain the uncertainty.',[4,null,5,6,5,6]);w.versions[0].text='later change';assert.notEqual(s.responses[0].work.versions[0].text,'later change');assert.equal(s.responses[0].ratings[1],null);assert.deepEqual(assignment(s),{mode:'separate',story:'B'});s=finishPhase(s,completedWork(),'Second reflection',[1,2,3,7,6,5]);assert.equal(s.completed,true);assert.equal(s.responses.length,2);assert.equal(log(s,'after-complete'),s);});
test('invalid study inputs and incomplete reflections fail closed',()=>{assert.throws(()=>startStudy('personal-name','en',0));assert.throws(()=>startStudy('P999','en',4));assert.throws(()=>finishPhase(startStudy('P999','en',0),emptyWork(),'x',[1,2,3,4,5,6]));assert.throws(()=>finishPhase(startStudy('P999','en',0),completedWork(),'x',[0,2,3,4,5,6]));});
test('album revisions retain sources and preserve earlier entries',()=>{let w=completedWork();const first=structuredClone(w.versions[0]);w.albumDraft='Another perspective';w=publishAlbum(w,'A');assert.deepEqual(w.versions[0],first);assert.equal(w.versions[1].version,2);assert.deepEqual(w.versions[1].sourceIds,['3371721-m08','3371721-m03']);assert.deepEqual(w.versions[1].authors,['Mia','Ari','You']);assert.equal(w.versions[1].updateId,'qa-update');});
test('image anchors are clamped and remain attached to their image',()=>{assert.deepEqual(clampAnchor(-2,4,'blush'),{x:.03,y:.97,photo:'blush'});});
test('restore rejects malformed or expired data, accepts current drafts',()=>{const saved={version:VERSION,savedAt:Date.now(),lang:'en',story:'A',mode:'embedded',works:{A:completedWork(),B:emptyWork('B'),C:emptyWork('C')},study:null};assert(restore(JSON.stringify(saved)));assert.equal(restore('broken'),null);assert.equal(restore(JSON.stringify({...saved,savedAt:Date.now()-8*24*3600000})),null);assert.equal(restore(JSON.stringify({...saved,version:'old'})),null);});
test('CSV quotes commas, quotes and newlines inside event details',()=>{const s=log(startStudy('P999','en',0),'developer_check',{text:'one, "two"\nthree'});const csv=exportCsv(s.events);assert(csv.includes('developer_check'));assert(csv.includes('""text""'));assert.equal(s.events[0].phase,0);assert.equal(s.events[0].story,'A');});

test('full protocol prevents skipped gates and requires reconstruction',async()=>{
 const {advanceResearch,updateResearch}=await import('../lib/community-v3.ts');
 let s=startStudy('P990001','en',0,true);
 assert.throws(()=>advanceResearch(s,'activity'));
 assert.throws(()=>advanceResearch(s,'fidelity'));
 s=updateResearch(s,{background:{community:'read',participation:'reader',aiUse:'sometimes'}},'background');
 s=advanceResearch(s,'fidelity');assert.throws(()=>advanceResearch(s,'activity'));
 s=updateResearch(s,{fidelity:{rating:'3',mismatch:'Gallery expectations differ',visits:['album']}},'fidelity');
 s=advanceResearch(s,'activity');
 assert.throws(()=>finishPhase(s,completedWork(),'Reflection',[4,4,4,4,4,4]));
 const reconstruction={pin:'cheek',human:'Ari',ai:'Did not use AI',member:'I wrote and published'};
 s=finishPhase(s,completedWork(),'Reflection',[4,4,null,4,4,4],reconstruction);
 assert.equal(s.research?.stage,'break');assert.throws(()=>finishPhase(s,completedWork(),'x',[4,4,4,4,4,4],reconstruction));
});
test('transfer and interview remain separate and logged after both paired activities',async()=>{
 const {advanceResearch,updateResearch,researchComplete}=await import('../lib/community-v3.ts');
 let s=startStudy('P990002','en',2,true);
 s=updateResearch(s,{background:{community:'read',participation:'reader',aiUse:'never'}},'background');s=advanceResearch(s,'fidelity');
 s=updateResearch(s,{fidelity:{rating:'na',mismatch:'Unfamiliar',visits:[]}},'fidelity');s=advanceResearch(s,'activity');
 const recon={pin:'location',human:'member',ai:'unused',member:'my words'};
 s=finishPhase(s,completedWork(),'First',[4,4,null,4,4,4],recon);s=advanceResearch(s,'activity');
 s=finishPhase(s,completedWork(),'Second',[4,4,null,4,4,4],recon);
 assert.equal(s.completed,true);assert.equal(researchComplete(s),false);assert.equal(s.research?.stage,'transfer');
 assert.throws(()=>advanceResearch(s,'interview'));
 s=updateResearch(s,{transfer:{answer:'A hand swatch in one light cannot establish a face result.',anchor:{x:.4,y:.6,photo:'swatches'},skipped:false}},'transfer_response');
 assert.equal(s.events.at(-1)?.story,'C');assert.equal(s.events.at(-1)?.detail.paired,false);
 s=advanceResearch(s,'interview');assert.throws(()=>advanceResearch(s,'debrief'));
 s=updateResearch(s,{interview:{timing:'Both have trade-offs.',references:'',culture:'',control:'',ecosystem:'',preference:'unsure',skipped:false}},'comparison');
 s=advanceResearch(s,'debrief');s=advanceResearch(s,'finished');
 assert.equal(s.responses.length,2);assert.equal(researchComplete(s),true);assert(s.research?.finalizedAt);assert.equal(log(s,'late'),s);
});
test('changed return photo preserves original visual anchor and human contribution',()=>{
 let w=completedWork();w.anchor={x:.25,y:.65,photo:'base'};w.selectedQuote='Change one thing at a time.';w.selectedQuoteAuthor='Ari';w.updates[0].photo='swatches';
 assert(albumProposal(w,'en').includes('Ari'));w=publishAlbum(w,'A');const a=w.versions.at(-1)!;
 assert.equal(a.photo,'swatches');assert.equal(a.anchor?.photo,'base');assert.equal(a.quotedLine,w.selectedQuote);
});

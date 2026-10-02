export type Lang = 'en' | 'zh';
export type Bi = [string, string];
export const say = (l: Lang, b: Bi) => b[l === 'en' ? 0 : 1];
export type StoryId = 'A' | 'B' | 'C';
export type PhotoId = 'base' | 'blush' | 'swatches';
export type Mode = 'embedded' | 'separate';
export const VERSION = '4.1.0-study-ready';
const COMPATIBLE_VERSIONS=[VERSION,'4.0.0-ai-community-weave'];
export const STORAGE = 'common-ground-v3';
export const photos: Record<PhotoId, {src:string; alt:Bi}> = {
  base:{src:'/v3/base.png',alt:['Fictional member pointing to her cheek in window light','虚构成员在窗边指向面颊的示意照片']},
  blush:{src:'/v3/blush.png',alt:['Fictional member demonstrating a blush brush at her cheek','虚构成员在面颊展示腮红刷位置的示意照片']},
  swatches:{src:'/v3/swatches.png',alt:['Generated hand swatches, blush pot and brush on linen','生成的手背试色、腮红与刷具示意照片']},
};
export type Story = {id:StoryId;member:string;guide:string;photo:PhotoId;tag:Bi;title:Bi;caption:Bi;reply:Bi;prompt:Bi;task:Bi;newcomer:Bi;source:string;sourceIds:string[];origin:Bi};
export const stories:Record<StoryId,Story> = {
  A:{id:'A',member:'Mia',guide:'Ari',photo:'base',tag:['FIRST SHARE','第一次分享'],title:['A little stuck. A little curious.','有点困惑，也有点好奇。'],caption:['My base feels uneven. What would you try first?','底妆不太服帖，你会先试着改变什么？'],reply:['Glad you asked. You could change just the amount first. Another member mentioned waiting, but that was a personal experience. Come back even if it stays the same.','很高兴你开口提问。可以先只改用量。也有人提过等待，但那只是个人经验。没有改善也欢迎回来聊。'],prompt:['What amount did you use, and which step would you change first?','你用了多少？准备先改变哪一步？'],task:['Scenario card: you used less primer once. You noticed less pilling, but cannot tell why. The image is a prop, not a photograph of that result.','情境卡：一次减少妆前用量后，你感觉搓泥少了，但还不知道原因。图片是道具，不是结果照片。'],newcomer:['I saw your album. Does waiting longer work for everyone?','我看到了你的图册。多等一会儿，对所有人都有效吗？'],source:'https://community.sephora.com/t5/Complexion-Club/Why-is-my-foundation-pilling/m-p/3371721',sourceIds:['3371721-m08','3371721-m03'],origin:['Historical discussion informs the question. Mia, Ari, replies and images are authored simulation materials.','问题参考历史讨论；Mia、Ari、回应与图片均为编写的模拟材料。']},
  B:{id:'B',member:'Nora',guide:'Sam',photo:'blush',tag:['ONE SMALL TRICK','分享一个小技巧'],title:['A little peach, my way.','一点蜜桃色，我的画法。'],caption:['I keep the colour near the outer cheek. Where would you place it?','我把颜色留在外侧面颊。你会画在哪里？'],reply:['Glad you asked. I start with a little colour near the outer cheek and blend with a light touch. That is my preference; try the placement you enjoy.','很高兴你问起。我从外侧面颊的一点颜色开始，轻轻晕开。这是我的偏好，你也可以找到自己喜欢的位置。'],prompt:['Which detail do you want to try: placement, amount or blending?','你想试的是位置、用量，还是晕染方式？'],task:['Scenario card: you tried a higher placement once and liked its appearance in window light. You have not compared lighting or wear over time.','情境卡：你试过一次更靠上的位置，喜欢窗边光线下的效果。还没有比较不同光线和持妆情况。'],newcomer:['Your blush story is lovely. Will that placement suit every face?','你分享的腮红故事很好看。这个位置适合所有脸型吗？'],source:'https://www.sephora.com/beauty/community-faq',sourceIds:['AUTHORED-B'],origin:['Authored positive sharing scenario informed by the community Gallery format. No historical result is claimed.','参考社区 Gallery 形式编写的正向分享情境，不代表历史使用结果。']},
  C:{id:'C',member:'Lea',guide:'Jo',photo:'swatches',tag:['SWATCH DIARY','试色小记'],title:['Same colour, different light.','同一种颜色，不同的光。'],caption:['A few swatches from my desk. How do you compare yours?','桌边留下的几笔试色，你会怎么比较？'],reply:['A hand swatch helps show texture and colour in one setting. It may look different on a face or under another light. What context would you keep with your photo?','手背试色能展示某个情境中的质地与颜色。换到面部或其他光线可能不同。你会给照片补充什么条件？'],prompt:['Where was the image taken, and what might change elsewhere?','照片在哪里拍的？换个情境，可能有什么不同？'],task:['Scenario card: a hand swatch looks peach in daylight. You have not tried it on the face. Keep that boundary in your update.','情境卡：手背试色在日光下呈蜜桃色，还没有在面部尝试。请在回访中保留这个边界。'],newcomer:['Can I judge the face result from this hand swatch?','能从这张手背试色判断上脸效果吗？'],source:'https://community.sephora.com/t5/Complexion-Club/Why-is-my-foundation-pilling/m-p/3581814',sourceIds:['3581814-m12','AUTHORED-C'],origin:['The transfer boundary is informed by a historical hand/face discussion. The swatch story and image are fictional.','迁移边界参考历史手背与面部讨论；试色故事及图片是虚构材料。']},
};
export type Anchor = {x:number;y:number;photo:PhotoId};
export const clampAnchor=(x:number,y:number,photo:PhotoId):Anchor=>({x:Math.max(0.03,Math.min(.97,x)),y:Math.max(.03,Math.min(.97,y)),photo});
export type Update = {id:string;text:string;photo:PhotoId;context:string;limits:string;at:string};
export type Album = {version:number;title:string;text:string;limits:string;photo:PhotoId;anchor:Anchor|null;quotedLine:string;authors:string[];sourceIds:string[];updateId:string;at:string};
export type AiTrace = {kind:'question'|'route'|'quote'|'album'|'pass';reference:string;at:string;proposal?:string};
export type Work = {anchor:Anchor|null;questionDraft:string;question:string;responseShown:boolean;selectedQuote:string;selectedQuoteAuthor?:string;selectedQuoteId?:string;routeNote:string;plan:string;updateDraft:string;context:string;limits:string;updatePhoto:PhotoId;updates:Update[];thanksDraft:string;thanks:string;albumDraft:string;albumTitle:string;albumLimits:string;versions:Album[];passDraft:string;passed:string;bookmarked:boolean;aiTrace:AiTrace[]};
export const emptyWork=(id:StoryId='A'):Work=>({anchor:null,questionDraft:'',question:'',responseShown:false,selectedQuote:'',routeNote:'',plan:'',updateDraft:'',context:'',limits:'',updatePhoto:stories[id].photo,updates:[],thanksDraft:'',thanks:'',albumDraft:'',albumTitle:'',albumLimits:'',versions:[],passDraft:'',passed:'',bookmarked:false,aiTrace:[]});
export const sequenceAssignments = [
  [{mode:'embedded',story:'A'},{mode:'separate',story:'B'}],
  [{mode:'separate',story:'A'},{mode:'embedded',story:'B'}],
  [{mode:'embedded',story:'B'},{mode:'separate',story:'A'}],
  [{mode:'separate',story:'B'},{mode:'embedded',story:'A'}],
] as const;
export type ActivityEvent={n:number;at:string;elapsedMs:number;phase:number;story:StoryId;mode:Mode;type:string;detail:Record<string,unknown>};
export type Reconstruction={pin:string;human:string;ai:string;member:string};
export const emptyReconstruction=():Reconstruction=>({pin:'',human:'',ai:'',member:''});
export type ResearchStage='background'|'fidelity'|'activity'|'break'|'transfer'|'interview'|'debrief'|'finished';
export type ResearchSession={protocolVersion:string;stage:ResearchStage;device:{width:number;height:number;browser?:string;input?:string};background:{community:string;participation:string;aiUse:string};fidelity:{rating:string;mismatch:string;visits:string[]};transfer:{answer:string;anchor:Anchor|null;skipped:boolean};interview:{timing:string;references:string;culture:string;control:string;ecosystem:string;preference:string;skipped:boolean};reflectionDraft?:{phase:number;answer:string;ratings:string[];reconstruction:Reconstruction};observations:{at:string;stage:string;phase:number;level:string;note:string}[];finalizedAt?:string};
export function createResearchSession():ResearchSession{return {protocolVersion:'2026-10-02-chapter8-v1',stage:'background',device:{width:0,height:0},background:{community:'',participation:'',aiUse:''},fidelity:{rating:'',mismatch:'',visits:[]},transfer:{answer:'',anchor:null,skipped:false},interview:{timing:'',references:'',culture:'',control:'',ecosystem:'',preference:'',skipped:false},observations:[]};}
export const researchComplete=(s:Study)=>s.research?s.research.stage==='finished':s.completed;
export function updateResearch(s:Study,patch:Partial<ResearchSession>,type:string,detail:Record<string,unknown>={}):Study {if(!s.research||researchComplete(s))return s;return {...log(s,type,detail),research:{...s.research,...patch}};}
export function advanceResearch(s:Study,next:ResearchStage):Study{
 const r=s.research;if(!r)throw Error('Missing full protocol');
 const expected:Partial<Record<ResearchStage,ResearchStage>>={background:'fidelity',fidelity:'activity',break:'activity',transfer:'interview',interview:'debrief',debrief:'finished'};
 if(expected[r.stage]!==next)throw Error('Invalid stage transition');
 if(r.stage==='background'&&Object.values(r.background).some(v=>!v))throw Error('Background incomplete');
 if(r.stage==='fidelity'&&(!r.fidelity.rating||!r.fidelity.mismatch.trim()))throw Error('Fidelity check incomplete');
 if(r.stage==='transfer'&&!r.transfer.skipped&&!r.transfer.answer.trim())throw Error('Transfer incomplete');
 if(r.stage==='interview'&&!r.interview.skipped&&(!r.interview.preference||![r.interview.timing,r.interview.references,r.interview.culture,r.interview.control,r.interview.ecosystem].some(v=>v.trim())))throw Error('Interview incomplete');
 return updateResearch(s,{stage:next,...(next==='finished'?{finalizedAt:new Date().toISOString()}: {})},'research_stage_completed',{stage:r.stage,next});
}
export type Study={version:string;participant:string;lang:Lang;sequence:number;phase:number;startedAt:number;consent:true;completed:boolean;events:ActivityEvent[];research?:ResearchSession;responses:{phase:number;story:StoryId;mode:Mode;answer:string;ratings:(number|null)[];work:Work;at:string;reconstruction?:Reconstruction}[]};
export const assignment=(s:Study)=>sequenceAssignments[s.sequence][s.phase===0?0:1];
export function startStudy(participant:string,lang:Lang,sequence:number,fullProtocol=false):Study{
  if(!/^P\d{3,6}$/.test(participant)||!Number.isInteger(sequence)||sequence<0||sequence>3)throw Error('Invalid study setup');
  return {version:VERSION,participant,lang,sequence,phase:0,startedAt:Date.now(),consent:true,completed:false,events:[],responses:[],...(fullProtocol?{research:createResearchSession()}: {})};
}
export function log(s:Study,type:string,detail:Record<string,unknown>={}):Study{
  if(researchComplete(s))return s;
  const a=assignment(s);return {...s,events:[...s.events,{n:s.events.length+1,at:new Date().toISOString(),elapsedMs:Date.now()-s.startedAt,phase:s.phase,story:s.research?.stage==='transfer'?'C':a.story,mode:a.mode,type,detail:{stage:s.research?.stage||'activity',paired:!s.research||s.research.stage==='activity',...detail}}]};
}
export const canFinish=(w:Work)=>!!(w.question&&w.responseShown&&w.updates.length&&w.versions.length&&w.passed);
export function finishPhase(s:Study,w:Work,answer:string,ratings:(number|null)[],reconstruction?:Reconstruction):Study{
  if(s.completed||!canFinish(w)||!answer.trim()||ratings.length!==6||ratings.some(x=>x!==null&&(!Number.isInteger(x)||x<1||x>7)))throw Error('Incomplete activity');
  if(s.research&&(s.research.stage!=='activity'||!reconstruction||Object.values(reconstruction).some(v=>!v.trim())))throw Error('Reconstruction incomplete');
 const next=log(s,'phase_complete');return {...next,phase:s.phase===0?1:1,completed:s.phase===1,responses:[...s.responses,{phase:s.phase,...assignment(s),answer:answer.trim(),ratings,work:structuredClone(w),at:new Date().toISOString(),...(reconstruction?{reconstruction:{...reconstruction}}: {})}],...(s.research?{research:{...s.research,stage:s.phase===0?'break':'transfer'}}: {})};
}
export function albumProposal(w:Work,l:Lang):string{
  const u=w.updates.at(-1);return u?say(l,['What I tried','这次尝试'])+': '+u.text+(u.context?'\n'+say(l,['Context','情境'])+': '+u.context:'')+(u.limits?'\n'+say(l,['Still open','仍在摸索'])+': '+u.limits:'')+(w.selectedQuote?'\n'+say(l,['Human contribution','成员贡献'])+' ('+(w.selectedQuoteAuthor||say(l,['member','成员']))+'): '+w.selectedQuote:''):'';
}
export function publishAlbum(w:Work,id:StoryId):Work{
  const u=w.updates.at(-1);if(!u||!w.albumDraft.trim()||!w.albumTitle.trim())throw Error('An update, title and text are required');
  const st=stories[id];const record:Album={version:w.versions.length+1,title:w.albumTitle.trim(),text:w.albumDraft.trim(),limits:w.albumLimits.trim(),photo:u.photo,anchor:w.anchor?{...w.anchor}:null,quotedLine:w.selectedQuote,authors:[...new Set([st.member,...(w.responseShown?[st.guide]:[]),...(w.selectedQuoteAuthor?[w.selectedQuoteAuthor]:[]),'You'])],sourceIds:[...st.sourceIds,...(w.selectedQuoteId?['comment:'+w.selectedQuoteId]:[])],updateId:u.id,at:new Date().toISOString()};
  return {...w,versions:[...w.versions,record]};
}
export function moments(w:Work):string[]{return [w.question?'first-share':'',w.updates.length?'return':'',w.thanks?'thanks':'',w.versions.length?'album':'',w.passed?'pass-on':''].filter(Boolean);}
export function exportCsv(events:ActivityEvent[]):string{const keys=['n','at','elapsedMs','phase','story','mode','type','detail'] as const;const q=(x:unknown)=>'"'+String(typeof x==='object'?JSON.stringify(x):x).replace(/"/g,'""')+'"';return '\uFEFF'+keys.join(',')+'\n'+events.map(e=>keys.map(k=>q(e[k])).join(',')).join('\n');}
export type Saved = {version:string;savedAt:number;lang:Lang;story:StoryId;mode:Mode;works:Record<StoryId,Work>;study:Study|null};
export function restore(raw:string):Saved|null{
 try{
  const x=JSON.parse(raw);
  if(!x||!COMPATIBLE_VERSIONS.includes(x.version)||!Number.isFinite(x.savedAt)||x.savedAt>Date.now()+60000||Date.now()-x.savedAt>7*24*3600*1000||!['A','B','C'].includes(x.story)||!['en','zh'].includes(x.lang)||!['embedded','separate'].includes(x.mode)||!x.works)return null;
  for(const id of ['A','B','C'] as const){
   const w=x.works[id],base=emptyWork(id);if(!w)return null;
   for(const [key,value] of Object.entries(base)){if(typeof value==='string'&&typeof w[key]!=='string')return null;if(typeof value==='boolean'&&typeof w[key]!=='boolean')return null;}
   if(!['base','blush','swatches'].includes(w.updatePhoto)||!Array.isArray(w.updates)||!Array.isArray(w.versions))return null;
   if(w.anchor!==null&&(!w.anchor||!Number.isFinite(w.anchor.x)||!Number.isFinite(w.anchor.y)||!['base','blush','swatches'].includes(w.anchor.photo)))return null;
   if(w.updates.some((u:Update)=>!u||typeof u.text!=='string'||!['base','blush','swatches'].includes(u.photo)))return null;
   if(w.versions.some((v:Album)=>!v||typeof v.text!=='string'||typeof v.quotedLine!=='string'||!Array.isArray(v.authors)||!Array.isArray(v.sourceIds)||!['base','blush','swatches'].includes(v.photo)||v.anchor!==null&&(!v.anchor||!Number.isFinite(v.anchor.x)||!Number.isFinite(v.anchor.y)||!['base','blush','swatches'].includes(v.anchor.photo))))return null;
  }
  if(x.study!==null){const s=x.study;if(!s||!COMPATIBLE_VERSIONS.includes(s.version)||!/^P\d{3,6}$/.test(s.participant)||!Number.isInteger(s.sequence)||s.sequence<0||s.sequence>3||![0,1].includes(s.phase)||s.consent!==true||typeof s.completed!=='boolean'||!Number.isFinite(s.startedAt)||!['en','zh'].includes(s.lang)||!Array.isArray(s.events)||!Array.isArray(s.responses))return null;if(s.research&&(!['background','fidelity','activity','break','transfer','interview','debrief','finished'].includes(s.research.stage)||!s.research.background||!s.research.fidelity||!s.research.transfer||!s.research.interview||!Array.isArray(s.research.observations)))return null;if(!s.completed&&(!s.research||['activity','break','background'].includes(s.research.stage))){const a=assignment(s);if(x.story!==a.story||x.mode!==a.mode||x.lang!==s.lang)return null;}}
  for(const id of ['A','B','C'] as const){if(!Array.isArray(x.works[id].aiTrace))x.works[id].aiTrace=[];}
  x.version=VERSION;return x;
 }catch{return null;}
}

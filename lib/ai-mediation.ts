import type {Anchor} from './community-v3.ts';
import type {CommunityPost} from './free-community.ts';

export const aiRoles={question:'AI helped frame this question',quote:'AI helped shape this follow-up',route:'AI helped connect these discussions',album:'AI helped arrange this experience',pass:'AI helped compare an earlier experience'} as const;
export type AiRole=keyof typeof aiRoles;
export type PublicMediation={kind:AiRole;reference:string;decision:string;connection?:{threadId:string;title:string;reason:string};materials?:string[];original?:string;proposal?:string};
/** Public scope is deliberately smaller than the private draft/event history. */
export function publicMediation(metadata:Record<string,unknown>):PublicMediation|undefined{
 const x=metadata.public_ai as Record<string,unknown>|undefined;
 if(!x||typeof x.kind!=='string'||!Object.hasOwn(aiRoles,x.kind)||typeof x.reference!=='string'||typeof x.decision!=='string')return;
 const c=x.connection as Record<string,unknown>|undefined;
 return {kind:x.kind as AiRole,reference:x.reference,decision:x.decision,
  ...(c&&typeof c.threadId==='string'&&/^[a-zA-Z0-9:_-]{1,100}$/.test(c.threadId)&&typeof c.title==='string'&&typeof c.reason==='string'?{connection:{threadId:c.threadId,title:c.title,reason:c.reason}}:{}),
  ...(Array.isArray(x.materials)?{materials:x.materials.filter((s):s is string=>typeof s==='string')}:{}),
  // Example before/after wording belongs only to the authored corpus. Never expose a visitor's original draft.
  ...(metadata.synthetic_seed===true&&typeof x.original==='string'&&typeof x.proposal==='string'?{original:x.original,proposal:x.proposal}:{})};
}
export type QuestionAim='detail'|'conditions'|'difference';
/** An explicit member intention chooses a preset; no image recognition or inferred cosmetic result. */
export function questionPrompt(post:CommunityPost,anchor:Anchor|null,draft:string,aim:QuestionAim):string{
 const title=post.title[0];const ref=anchor?'the detail I marked in the image':'“'+title+'”';
 const next=aim==='conditions'?`What conditions or steps would help us understand ${ref}? I would like to hear what you tried, including what stayed uncertain.`:aim==='difference'?`Has anyone had a different experience with ${ref}? What was different about your situation?`:`Could someone explain ${ref} in their own words? One small step or comparison would help me get started.`;
 return [draft.trim(),next].filter(Boolean).join('\n\n');
}

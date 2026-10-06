import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {researchComplete,type Anchor,type Lang,type StoryId,type Study} from './community-v3';

let client:SupabaseClient|null=null;
let identity:Promise<string>|null=null;
const env=import.meta.env||{};
export const onlineConfigured=!!(env.VITE_SUPABASE_URL&&env.VITE_SUPABASE_PUBLISHABLE_KEY);
export function database(){
  if(!onlineConfigured)throw new Error('Online sharing is not configured yet.');
  return client??=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_PUBLISHABLE_KEY);
}
export async function userId(){
  if(!identity)identity=(async()=>{
    const db=database();const {data,error}=await db.auth.getSession();if(error)throw error;
    if(data.session)return data.session.user.id;
    const signed=await db.auth.signInAnonymously();if(signed.error)throw signed.error;
    if(!signed.data.user)throw new Error('Could not start the anonymous session.');
    return signed.data.user.id;
  })().catch(error=>{identity=null;throw error;});
  return identity;
}
export type ContributionKind='comment'|'question'|'update'|'thanks'|'album'|'handoff';
export type CommentRow={id:string;post_id:StoryId;room_id:string;user_id:string;display_name:string;body:string;image_anchor:Anchor|null;quoted_text:string|null;quoted_comment_id:string|null;kind:ContributionKind;metadata:Record<string,unknown>;created_at:string};
export type Contribution={story:StoryId;study:Study|null;body:string;kind?:ContributionKind;anchor?:Anchor|null;quote?:string;quoteId?:string;metadata?:Record<string,unknown>;displayName?:string;id?:string};
export async function roomId(study:Study|null){return study&&!study.week?await userId():'shared';}
export async function publishContribution(input:Contribution){
  if(!input.body.trim())throw new Error('Write a contribution before publishing.');
  const uid=await userId();const id=input.id??crypto.randomUUID();
  const row={id,post_id:input.story,room_id:input.study&&!input.study.week?uid:'shared',user_id:uid,display_name:input.study?.participant||input.displayName?.trim()||`Member-${uid.slice(0,6)}`,body:input.body.trim(),kind:input.kind||'comment',image_anchor:input.anchor||null,quoted_text:input.quote||null,quoted_comment_id:input.quoteId||null,metadata:input.metadata||{}};
  const result=await database().from('comments').insert(row).select().single();
  // Retrying an uncertain network result with the same id must not duplicate it.
  if(result.error?.code==='23505'){
    const existing=await database().from('comments').select('*').eq('id',id).single();
    if(existing.error)throw existing.error;return existing.data as CommentRow;
  }
  if(result.error)throw result.error;
  window.dispatchEvent(new CustomEvent('community:comment',{detail:result.data}));
  return result.data as CommentRow;
}
export async function loadComments(story:StoryId,room:string){
  await userId();const {data,error}=await database().from('comments').select('*').eq('post_id',story).eq('room_id',room).order('created_at').order('id');
  if(error)throw error;return data as CommentRow[];
}
let studyQueue:Promise<unknown>=Promise.resolve();
export async function beginStudyIdentity(){await studyQueue.catch(()=>{});const {error}=await database().auth.signOut({scope:'local'});if(error)throw error;identity=null;return userId();}
export function saveStudy(study:Study){const next=studyQueue.catch(()=>{}).then(()=>writeStudy(study));studyQueue=next;return next;}
async function writeStudy(study:Study){
  const uid=await userId();const key=`community-session-${uid}-${study.startedAt}`;
  let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id);}
  const {error}=await database().from('study_sessions').upsert({id,user_id:uid,participant_code:study.participant,completed:researchComplete(study),payload:study},{onConflict:'id'});
  if(error)throw error;
}
export function messageForError(lang:Lang){return lang==='en'?'Could not save online. Your draft is kept; please retry.':'暂时无法保存到网站。草稿已保留，请重试。';}

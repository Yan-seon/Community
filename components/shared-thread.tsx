import {useEffect,useRef,useState} from 'react';
import {Sparkles,LoaderCircle} from 'lucide-react';
import {database,userId,loadComments,messageForError,onlineConfigured,publishContribution,roomId,type CommentRow} from '@/lib/online';
import {LoadingImage} from './loading-image';
import {threadOf} from '../lib/free-community';
import {photos,say,type Anchor,type Lang,type StoryId,type Study} from '@/lib/community-v3';
import {Button} from '@/components/ui/button';

const sentenceParts=(text:string)=>(text.match(/[^.!?。！？]+[.!?。！？]?/g)||[text]).map(s=>s.trim()).filter(Boolean);
export function SharedThread({story,lang,study,threadId,anchor,quoteContext,proposedDraft,onHelpQuote,renderQuoteHelp,onQuote,onPublish}:{story:StoryId;lang:Lang;study:Study|null;threadId?:string;quoteContext?:{text:string;author:string;id?:string}|null;proposedDraft?:string;onHelpQuote?:()=>void;renderQuoteHelp?:()=>React.ReactNode;anchor:Anchor|null;onQuote:(text:string,row:CommentRow)=>void;onPublish:(id:string)=>void}){
 const [rows,setRows]=useState<CommentRow[]>([]),[draft,setDraft]=useState(''),[name,setName]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState(false),[quote,setQuote]=useState<{text:string;row:CommentRow}|null>(null),[consent,setConsent]=useState(false),[room,setRoom]=useState(''),[suggestion,setSuggestion]=useState(''),[aiAdopted,setAiAdopted]=useState(false);
 const requestId=useRef<string|null>(null);
 const t=(en:string,zh:string)=>lang==='en'?en:zh;
 useEffect(()=>{let stopped=false;let channel:ReturnType<ReturnType<typeof database>['channel']>|undefined;
  setRows([]);setRoom('');setError('');setLoading(true);setDraft(sessionStorage.getItem('comment-draft-'+(threadId||story))||'');setAiAdopted(false);setConsent(false);setQuote(null);setSuggestion('');requestId.current=null;
  if(!onlineConfigured){setLoading(false);return;}
  const merge=(row:CommentRow)=>{if(stopped||row.post_id!==story||row.metadata.entity&&row.metadata.entity!=='contribution'||threadOf(row.metadata,row.post_id)!==(threadId||'case:'+story))return;const showTests=new URLSearchParams(location.search).get('qa')==='1';if(!showTests&&(/^TEST\b/i.test(row.display_name)||/^P(?:998|900)\d{3}$/i.test(row.display_name)||/^TEST\b/i.test(row.body)))return;setRows(old=>[...old.filter(r=>r.id!==row.id),row].sort((a,b)=>a.created_at.localeCompare(b.created_at)||a.id.localeCompare(b.id)));};
  let activeRoom='';const local=(event:Event)=>{const row=(event as CustomEvent<CommentRow>).detail;if(row.room_id===activeRoom)merge(row);};
  window.addEventListener('community:comment',local);
  (async()=>{try{await userId();activeRoom=await roomId(study);if(stopped)return;setRoom(activeRoom);
   const refresh=async()=>{try{const list=await loadComments(story,activeRoom);if(!stopped){list.forEach(merge);setLoading(false);}}catch{if(!stopped){setError(messageForError(lang));setLoading(false);}}};
   channel=database().channel(`comments-${story}-${activeRoom}-${crypto.randomUUID()}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'comments',filter:`room_id=eq.${activeRoom}`},payload=>merge(payload.new as CommentRow)).subscribe(status=>{if(status==='SUBSCRIBED')void refresh();});
   await refresh();
  }catch{if(!stopped){setError(messageForError(lang));setLoading(false);}}})();
  const interval=setInterval(()=>{if(activeRoom&&!stopped)void loadComments(story,activeRoom).then(list=>list.forEach(merge)).catch(()=>{});},15000);
  return()=>{stopped=true;clearInterval(interval);window.removeEventListener('community:comment',local);if(channel)void database().removeChannel(channel);};
 },[story,threadId,study?.startedAt]);
 const share=async()=>{if(busy||!consent||!draft.trim())return;setBusy(true);setError('');requestId.current??=crypto.randomUUID();try{
  const row=await publishContribution({id:requestId.current,story,study,body:draft,displayName:name,anchor,quote:quote?.text||quoteContext?.text,quoteId:quote?.row.id||quoteContext?.id,metadata:{thread_id:threadId||'case:'+story,ai_simulated:aiAdopted,quote_author:quote?.row.display_name||quoteContext?.author||null}});
  setRows(old=>[...old.filter(r=>r.id!==row.id),row].sort((a,b)=>a.created_at.localeCompare(b.created_at)));setDraft('');sessionStorage.removeItem('comment-draft-'+(threadId||story));setAiAdopted(false);setConsent(false);setQuote(null);setSuggestion('');requestId.current=null;onPublish(row.id);
 }catch{setError(messageForError(lang));}finally{setBusy(false);}};
 return <section className="cg-shared-thread" aria-label={t('Participant comments','参与者评论')}>
  <h2>{t('Member comments','成员评论')} {rows.length>0&&<small>({rows.length})</small>}</h2>
  <p className="cg-meta">{study&&!study.week?t('This activity has a separate discussion copy.','此活动使用独立讨论副本。'):t('Published comments are visible to other visitors in this test community.','发布的评论会在这个测试社区中展示给其他访问者。')}</p>
  {!onlineConfigured?<p role="status">{t('Online sharing is not connected in this local preview.','本地预览尚未连接在线评论。')}</p>:<>
  {loading&&<p role="status"><LoaderCircle size={16} className="fc-spin"/>{t('Loading comments…','正在读取评论……')}</p>}
  {rows.map(row=><article className="cg-live-comment" key={row.id} data-comment-id={row.id}>
    <header><span className="cg-avatar">{row.display_name[0]}</span><strong>{row.display_name}</strong><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString(lang==='en'?'en-GB':'zh-CN')}</time><small>{t(row.kind==='comment'?'Comment':row.kind==='question'?'Question':row.kind==='album'?'Reviewed story':row.kind==='thanks'?'Thank-you':row.kind==='handoff'?'Reply with experience':'Return',row.kind==='comment'?'评论':row.kind==='question'?'提问':row.kind==='album'?'经审阅的经验':row.kind==='thanks'?'感谢':row.kind==='handoff'?'带着经验回应':'回访')}</small></header>
    {typeof row.metadata.title==='string'&&<h3>{row.metadata.title}</h3>}{typeof row.metadata.context==='string'&&row.metadata.context&&<p className="cg-meta">{t('Context: ','情境：')}{row.metadata.context}</p>}{typeof row.metadata.limits==='string'&&row.metadata.limits&&<p className="cg-meta">{t('Still open: ','仍在摸索：')}{row.metadata.limits}</p>}{row.quoted_text&&<blockquote><strong>{String(row.metadata.quote_author||t('Member source','成员来源'))}</strong><p>{row.quoted_text}</p></blockquote>}
    <div className="cg-live-comment-content"><p className="cg-live-body">{row.body}</p>{row.image_anchor&&photos[row.image_anchor.photo]&&<div className="cg-live-image"><LoadingImage src={photos[row.image_anchor.photo].src} alt={say(lang,photos[row.image_anchor.photo].alt)}/><span className="cg-pin" style={{left:row.image_anchor.x*100+'%',top:row.image_anchor.y*100+'%'}}>1</span></div>}</div>
    <details><summary>{t('Reply to a sentence','针对一句话回应')}</summary><div className="cg-sentence-list">{sentenceParts(row.body).map((line,i)=><button key={i} aria-pressed={quote?.row.id===row.id&&quote.text===line} onClick={()=>{setQuote({text:line,row});onQuote(line,row);setSuggestion('');requestId.current=null;}}><span>{i+1}</span>{line}</button>)}</div></details>
  </article>)}
  {!loading&&!rows.length&&!error&&<p>{t('Be the first to join this conversation.','来留下这段讨论的第一条评论吧。')}</p>}
  <div className="cg-live-composer">
   {!study&&<label className="cg-field">{t('Display name or participant code','昵称或参与编号')}<input maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="P001"/></label>}
   {!quote&&quoteContext&&<div className="cg-live-quote"><strong>{quoteContext.author}</strong><p>{quoteContext.text}</p></div>}
   {proposedDraft&&!renderQuoteHelp?.()&&<button className="cg-text-link" onClick={()=>{setDraft(proposedDraft);sessionStorage.setItem('comment-draft-'+(threadId||story),proposedDraft);setAiAdopted(true);requestId.current=null;}}>{t('Use the suggested draft in my reply','把建议草稿放入我的回复')}</button>}
   {quote&&<div className="cg-live-quote"><strong>{quote.row.display_name}</strong><p>{quote.text}</p><button onClick={()=>{if(quote)onQuote('',quote.row);setQuote(null);setSuggestion('');}}>{t('Remove reference','移除引用')}</button></div>}
   <label className="cg-field">{t('Your comment','你的评论')}<textarea aria-label={t('Your comment','你的评论')} maxLength={2000} value={draft} onChange={e=>{setDraft(e.target.value);sessionStorage.setItem('comment-draft-'+(threadId||story),e.target.value);requestId.current=null;}} placeholder={t('Share a question or experience in your own words…','用自己的话分享问题或经历……')}/></label>
   {(quote||quoteContext)&&onHelpQuote&&<><Button className="cg-ai" variant="outline" onClick={onHelpQuote}><Sparkles size={16}/>{t('Help me follow up on this sentence','帮我针对这句话追问')}</Button>{renderQuoteHelp?.()}</>}{quote&&!study&&!onHelpQuote&&<><Button className="cg-ai" variant="outline" onClick={()=>setSuggestion(t(`When ${quote.row.display_name} says “${quote.text}”, what context or image detail would help me understand this experience?`,`${quote.row.display_name} 说“${quote.text}”时，补充哪些情境或图片细节，会让我更好地理解这段经历？`))}><Sparkles size={16}/>{t('Help me follow up on this sentence','帮我针对这句话追问')}</Button>{suggestion&&<section className="cg-inline-assist"><p className="cg-ai-stage">{t('AI · simulated suggestion','AI · 仿真建议')}</p><blockquote>{suggestion}</blockquote><p className="cg-meta">{quote.row.display_name} · {t('Selected member sentence','选中的成员原句')}</p><Button className="cg-primary" onClick={()=>{setDraft(suggestion);sessionStorage.setItem('comment-draft-'+(threadId||story),suggestion);setAiAdopted(true);}}>{t('Use as an editable draft','作为可编辑草稿使用')}</Button><Button variant="outline" onClick={()=>setSuggestion('')}>{t('Return without using it','不采用，返回')}</Button></section>}</>}
   {anchor&&<p className="cg-meta">{t('Your selected image detail is attached.','将附上你选中的图片细节。')}</p>}
   <label className="cg-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{t('Publish this comment to this test discussion.','将这条评论发布到此测试讨论。')}</label>
   {error&&<p role="alert">{error}</p>}
   <Button className="cg-primary" disabled={!room||!consent||!draft.trim()||busy} onClick={share}>{busy?t('Publishing…','发布中……'):t('Publish comment','发表评论')}</Button>
  </div></>}
 </section>;
}

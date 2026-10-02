import {useEffect,useRef,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {database,loadComments,messageForError,onlineConfigured,publishContribution,roomId,type CommentRow} from '@/lib/online';
import {photos,say,type Anchor,type Lang,type StoryId,type Study} from '@/lib/community-v3';
import {Button} from '@/components/ui/button';

const sentenceParts=(text:string)=>(text.match(/[^.!?。！？]+[.!?。！？]?/g)||[text]).map(s=>s.trim()).filter(Boolean);
export function SharedThread({story,lang,study,anchor,onQuote,onPublish}:{story:StoryId;lang:Lang;study:Study|null;anchor:Anchor|null;onQuote:(text:string,row:CommentRow)=>void;onPublish:(id:string)=>void}){
 const [rows,setRows]=useState<CommentRow[]>([]),[draft,setDraft]=useState(''),[name,setName]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState(false),[quote,setQuote]=useState<{text:string;row:CommentRow}|null>(null),[consent,setConsent]=useState(false),[room,setRoom]=useState(''),[suggestion,setSuggestion]=useState('');
 const requestId=useRef<string|null>(null);
 const t=(en:string,zh:string)=>lang==='en'?en:zh;
 useEffect(()=>{let stopped=false;let channel:ReturnType<ReturnType<typeof database>['channel']>|undefined;
  setRows([]);setRoom('');setError('');setLoading(true);setDraft('');setQuote(null);setSuggestion('');requestId.current=null;
  if(!onlineConfigured){setLoading(false);return;}
  const merge=(row:CommentRow)=>{if(stopped||row.post_id!==story)return;setRows(old=>[...old.filter(r=>r.id!==row.id),row].sort((a,b)=>a.created_at.localeCompare(b.created_at)||a.id.localeCompare(b.id)));};
  let activeRoom='';const local=(event:Event)=>{const row=(event as CustomEvent<CommentRow>).detail;if(row.room_id===activeRoom)merge(row);};
  window.addEventListener('community:comment',local);
  (async()=>{try{activeRoom=await roomId(study);if(stopped)return;setRoom(activeRoom);
   const refresh=async()=>{try{const list=await loadComments(story,activeRoom);if(!stopped){list.forEach(merge);setLoading(false);}}catch{if(!stopped){setError(messageForError(lang));setLoading(false);}}};
   channel=database().channel(`comments-${story}-${activeRoom}-${crypto.randomUUID()}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'comments',filter:`room_id=eq.${activeRoom}`},payload=>merge(payload.new as CommentRow)).subscribe(status=>{if(status==='SUBSCRIBED')void refresh();});
   await refresh();
  }catch{if(!stopped){setError(messageForError(lang));setLoading(false);}}})();
  const interval=setInterval(()=>{if(activeRoom&&!stopped)void loadComments(story,activeRoom).then(list=>list.forEach(merge)).catch(()=>{});},15000);
  return()=>{stopped=true;clearInterval(interval);window.removeEventListener('community:comment',local);if(channel)void database().removeChannel(channel);};
 },[story,lang,study?.startedAt]);
 const share=async()=>{if(busy||!consent||!draft.trim())return;setBusy(true);setError('');requestId.current??=crypto.randomUUID();try{
  const row=await publishContribution({id:requestId.current,story,study,body:draft,displayName:name,anchor,quote:quote?.text,quoteId:quote?.row.id,metadata:{ai_simulated:!!suggestion,quote_author:quote?.row.display_name||null}});
  setRows(old=>[...old.filter(r=>r.id!==row.id),row].sort((a,b)=>a.created_at.localeCompare(b.created_at)));setDraft('');setQuote(null);setSuggestion('');requestId.current=null;onPublish(row.id);
 }catch{setError(messageForError(lang));}finally{setBusy(false);}};
 return <section className="cg-shared-thread" aria-label={t('Participant comments','参与者评论')}>
  <h2>{t('Member comments','成员评论')} {rows.length>0&&<small>({rows.length})</small>}</h2>
  <p className="cg-meta">{study?t('This activity has a separate discussion copy.','此活动使用独立讨论副本。'):t('Published comments are visible to other visitors in this test community.','发布的评论会在这个测试社区中展示给其他访问者。')}</p>
  {!onlineConfigured?<p role="status">{t('Online sharing is not connected in this local preview.','本地预览尚未连接在线评论。')}</p>:<>
  {loading&&<p role="status">{t('Loading comments…','正在读取评论……')}</p>}
  {rows.map(row=><article className="cg-live-comment" key={row.id} data-comment-id={row.id}>
    <header><span className="cg-avatar">{row.display_name[0]}</span><strong>{row.display_name}</strong><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString(lang==='en'?'en-GB':'zh-CN')}</time><small>{t(row.kind==='comment'?'Comment':row.kind==='question'?'Question':row.kind==='album'?'Reviewed story':row.kind==='thanks'?'Thank-you':row.kind==='handoff'?'Reply with experience':'Return',row.kind==='comment'?'评论':row.kind==='question'?'提问':row.kind==='album'?'经审阅的经验':row.kind==='thanks'?'感谢':row.kind==='handoff'?'带着经验回应':'回访')}</small></header>
    {row.quoted_text&&<blockquote><strong>{String(row.metadata.quote_author||t('Member source','成员来源'))}</strong><p>{row.quoted_text}</p></blockquote>}
    <div className="cg-live-comment-content"><p className="cg-live-body">{row.body}</p>{row.image_anchor&&photos[row.image_anchor.photo]&&<div className="cg-live-image"><img src={photos[row.image_anchor.photo].src} alt={say(lang,photos[row.image_anchor.photo].alt)}/><span className="cg-pin" style={{left:row.image_anchor.x*100+'%',top:row.image_anchor.y*100+'%'}}>1</span></div>}</div>
    <details><summary>{t('Reply to a sentence','针对一句话回应')}</summary><div className="cg-sentence-list">{sentenceParts(row.body).map((line,i)=><button key={i} aria-pressed={quote?.row.id===row.id&&quote.text===line} onClick={()=>{setQuote({text:line,row});onQuote(line,row);setSuggestion('');requestId.current=null;}}><span>{i+1}</span>{line}</button>)}</div></details>
  </article>)}
  {!loading&&!rows.length&&!error&&<p>{t('Be the first to join this conversation.','来留下这段讨论的第一条评论吧。')}</p>}
  <div className="cg-live-composer">
   {!study&&<label className="cg-field">{t('Display name or participant code','昵称或参与编号')}<input maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="P001"/></label>}
   {quote&&<div className="cg-live-quote"><strong>{quote.row.display_name}</strong><p>{quote.text}</p><button onClick={()=>{setQuote(null);setSuggestion('');}}>{t('Remove reference','移除引用')}</button></div>}
   <label className="cg-field">{t('Your comment','你的评论')}<textarea aria-label={t('Your comment','你的评论')} maxLength={2000} value={draft} onChange={e=>{setDraft(e.target.value);requestId.current=null;}} placeholder={t('Share a question or experience in your own words…','用自己的话分享问题或经历……')}/></label>
   {quote&&!study&&<><Button className="cg-ai" variant="outline" onClick={()=>setSuggestion(t(`When ${quote.row.display_name} says “${quote.text}”, what context or image detail would help me understand this experience?`,`${quote.row.display_name} 说“${quote.text}”时，补充哪些情境或图片细节，会让我更好地理解这段经历？`))}><Sparkles size={16}/>{t('Help me follow up on this sentence','帮我针对这句话追问')}</Button>{suggestion&&<section className="cg-inline-assist"><p className="cg-ai-stage">{t('AI · simulated suggestion','AI · 仿真建议')}</p><blockquote>{suggestion}</blockquote><p className="cg-meta">{quote.row.display_name} · {t('Selected member sentence','选中的成员原句')}</p><Button className="cg-primary" onClick={()=>setDraft(suggestion)}>{t('Use as an editable draft','作为可编辑草稿使用')}</Button><Button variant="outline" onClick={()=>setSuggestion('')}>{t('Return without using it','不采用，返回')}</Button></section>}</>}
   {anchor&&<p className="cg-meta">{t('Your selected image detail is attached.','将附上你选中的图片细节。')}</p>}
   <label className="cg-check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{t('Publish this comment to this test discussion.','将这条评论发布到此测试讨论。')}</label>
   {error&&<p role="alert">{error}</p>}
   <Button className="cg-primary" disabled={!room||!consent||!draft.trim()||busy} onClick={share}>{busy?t('Publishing…','发布中……'):t('Publish comment','发表评论')}</Button>
  </div></>}
 </section>;
}

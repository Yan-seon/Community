import {Sparkles} from 'lucide-react';
import {aiRoles,publicMediation} from '../lib/ai-mediation';
export function PublicAiContext({metadata,onOpen}:{metadata:Record<string,unknown>;onOpen?:(id:string)=>void}){
 const m=publicMediation(metadata);if(!m)return null;
 return <details className="ip-public-ai"><summary><Sparkles size={14}/>{aiRoles[m.kind]}</summary><div><p><strong>Used:</strong> {m.reference}</p><p><strong>Member decision:</strong> {m.decision}</p>{m.materials&&<p><strong>Kept with this account:</strong> {m.materials.join(' · ')}</p>}{m.original&&<div className="ip-wording-comparison"><section><small>Starting wording</small><p>{m.original}</p></section><section><small>Editable suggestion</small><p>{m.proposal}</p></section></div>}{m.connection&&<div className="ip-discussion-link"><p>{m.connection.reason}</p>{onOpen&&<button className="cg-text-link" onClick={()=>onOpen(m.connection!.threadId)}>Read connected discussion: {m.connection.title}</button>}</div>}<small>The member chose what to publish. AI is preset assistance; it is not a member reply, endorsement or evidence that an experience will transfer.</small></div></details>;
}

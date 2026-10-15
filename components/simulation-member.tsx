import {simulationMembers} from '../lib/simulation-members';
import type {CommunityPost} from '../lib/free-community';
export function SimulationMember({name,posts,onOpen,onSelect}:{name:string;posts:CommunityPost[];onOpen:(p:CommunityPost)=>void;onSelect:(name:string)=>void}){
 const m=simulationMembers.find(m=>m.name===name);
 const authored=posts.filter(p=>p.seed&&p.author===name);
 return <div className="sc-profile"><p className="cg-meta">These are fictional members in an authored community background. Their accounts are not participant research findings.</p>
 <div className="sc-directory">{simulationMembers.map(p=><button key={p.id} aria-pressed={p.name===name} onClick={()=>onSelect(p.name)}>{p.name}</button>)}</div>
 {m&&<><div className="sc-profile-heading"><span className="cg-avatar">{m.name[0]}</span><div><h2>{m.name}</h2><small>Simulated member · {m.id}</small></div></div><p>{m.bio}</p><h3>Conversations and shared experiences</h3>{authored.length?authored.map(p=><button className="sc-profile-post" key={p.id} onClick={()=>onOpen(p)}><strong>{p.title[0]}</strong><small>{p.album?'Shared experience':'Conversation'} · scenario history</small></button>):<p>This member contributes through replies rather than starting a topic.</p>}</>}
 </div>;
}

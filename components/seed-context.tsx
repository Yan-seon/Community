import {communityMedia} from '../lib/community-media';
import type {CommunityPost} from '../lib/free-community';

export function SeedContext({post}:{post:CommunityPost|undefined}){
 if(!post)return null;
 const media=post.photo&&post.photo in communityMedia?communityMedia[post.photo as keyof typeof communityMedia]:null;
 if(!post.provenance&&!media)return null;
 return <details className="sc-context"><summary>About this simulated conversation and image</summary>
 {post.provenance&&<><p>This is authored community background, not a real participant account. Dates describe the simulated history; the batch was imported separately.</p><p>Character {post.provenance.characterId} · batch {post.provenance.batchId}</p>{!!post.provenance.sources.length&&<p>Discussion patterns informed by: {post.provenance.sources.map((u,i)=><a key={u} href={u} target="_blank" rel="noreferrer">Source {i+1} </a>)}</p>}</>}
 {media&&<p>Reference photograph: {media.credit} · {media.license}. <a href={media.source} target="_blank" rel="noreferrer">Original image and licence</a>. It is not a photograph taken by the fictional member, a product endorsement, or evidence of their result.</p>}
 </details>;
}

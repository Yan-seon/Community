import {communityMedia} from '../lib/community-media';
import type {CommunityPost} from '../lib/free-community';

export function SeedContext({post}:{post:CommunityPost|undefined}){
 if(!post)return null;
 const media=post.photo&&post.photo in communityMedia?communityMedia[post.photo as keyof typeof communityMedia]:null;
 if(!media)return null;
 return <details className="sc-context"><summary>Image credit</summary>

 {media&&<p>Reference photograph: {media.credit} · {media.license}. <a href={media.source} target="_blank" rel="noreferrer">Original image and licence</a>. Used as a reference image; it does not document a member’s own product result.</p>}
 </details>;
}

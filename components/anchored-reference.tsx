import {useState,useRef,useEffect} from 'react';
import {photos,say,type Anchor,type Lang} from '../lib/community-v3';
import {LoadingImage} from './loading-image';
export function AnchoredReference({anchor,lang}:{anchor:Anchor;lang:Lang}){
 const [open,setOpen]=useState(false);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close();},[open]);
 if(!photos[anchor.photo])return null;
 const image=<><LoadingImage src={photos[anchor.photo].src} alt={say(lang,photos[anchor.photo].alt)}/><span className="cg-pin" style={{left:anchor.x*100+'%',top:anchor.y*100+'%'}}>1</span></>;
 return <><button type="button" className="ip-anchor-reference" onClick={()=>setOpen(true)} aria-label="Inspect selected image detail"><span className="ip-coordinate-image">{image}</span><small>Image detail 1 · enlarge</small></button><dialog ref={dialog} className="ip-anchor-dialog" aria-label="Image detail preview" onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false);}}><div className="ip-anchor-dialog-heading"><h2>Selected image detail</h2><button type="button" onClick={()=>setOpen(false)} aria-label="Close image detail">×</button></div><div className="ip-coordinate-image">{open&&image}</div><p>The pin preserves the location selected by the member. It is not an AI diagnosis.</p></dialog></>;
}

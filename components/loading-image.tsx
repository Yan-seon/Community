import {useEffect,useRef,useState} from 'react';
import {LoaderCircle,ImageOff,RotateCw} from 'lucide-react';
export function LoadingImage({src,alt,className='',ratio,loading='lazy'}:{src:string;alt:string;className?:string;ratio?:string;loading?:'eager'|'lazy'}){
 const img=useRef<HTMLImageElement>(null),[status,setStatus]=useState<'loading'|'ready'|'error'>('loading'),[retry,setRetry]=useState(0);
 useEffect(()=>{setStatus(img.current?.complete?(img.current.naturalWidth>0?'ready':'error'):'loading');},[src,retry]);
 const lang=typeof document!=='undefined'&&document.documentElement.lang==='zh';
 return <span className={'cg-image-wrap image-'+status} style={ratio?{aspectRatio:ratio,'--image-ratio':ratio} as React.CSSProperties:undefined} aria-busy={status==='loading'}><img ref={img} src={retry?src+(src.includes('?')?'&':'?')+'retry='+retry:src} alt={alt} className={className} loading={loading} onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/>{status==='loading'&&<span className="cg-image-loading" role="status"><LoaderCircle aria-hidden="true" size={24}/><span className="sr-only">{lang?'图片正在加载':'Loading image'}</span></span>}{status==='error'&&<span className="cg-image-error"><ImageOff size={24}/><span>{lang?'图片暂时无法加载':'Image unavailable'}</span><button type="button" onClick={e=>{e.stopPropagation();setStatus('loading');setRetry(x=>x+1);}}><RotateCw size={15}/>{lang?'重试':'Retry'}</button></span>}</span>;
}

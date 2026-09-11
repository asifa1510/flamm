'use client';
import { memo,useEffect,useRef,useState } from 'react'; import type { ChartKind,DataPoint } from '@/lib/types';
const colors=['#b6f36a','#69ddff','#ffbb66','#d59cff'];
export const ChartCanvas=memo(function ChartCanvas({kind,data,version,onRender}:{kind:ChartKind;data:DataPoint[];version:number;onRender:(n:number)=>void}){
  const ref=useRef<HTMLCanvasElement>(null); const [zoom,setZoom]=useState(1); const [offset,setOffset]=useState(0); const drag=useRef<{x:number;offset:number}|null>(null);
  useEffect(()=>{
    const canvas=ref.current; if(!canvas)return; const start=performance.now(); const dpr=Math.min(devicePixelRatio,2); const box=canvas.getBoundingClientRect(); canvas.width=box.width*dpr; canvas.height=box.height*dpr; const c=canvas.getContext('2d'); if(!c)return; c.scale(dpr,dpr); const w=box.width,h=box.height,pad=20; c.clearRect(0,0,w,h); c.strokeStyle='rgba(255,255,255,.055)'; c.lineWidth=1;
    for(let x=0;x<w;x+=50){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()} for(let y=0;y<h;y+=42){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
    const visible=Math.max(300,Math.floor(data.length/zoom)); const end=Math.min(data.length,Math.max(visible,data.length-Math.floor(offset))); const slice=data.slice(end-visible,end); const step=Math.max(1,Math.floor(slice.length/(w*1.3))); const pts=slice.filter((_,i)=>i%step===0);
    if(kind==='line'){const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(182,243,106,.24)');grad.addColorStop(1,'rgba(182,243,106,0)');c.beginPath();pts.forEach((p,i)=>{const x=i/(pts.length-1)*w,y=h-(p.value-75)/95*h;i?c.lineTo(x,y):c.moveTo(x,y)});c.lineTo(w,h);c.lineTo(0,h);c.fillStyle=grad;c.fill();c.beginPath();pts.forEach((p,i)=>{const x=i/(pts.length-1)*w,y=h-(p.value-75)/95*h;i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle=colors[0];c.lineWidth=2;c.stroke()}
    else if(kind==='bar'){const bins=48,vals=new Array<number>(bins).fill(0);pts.forEach(p=>vals[p.category*4+Math.min(3,Math.floor(p.signal*4))]++);const max=Math.max(...vals);vals.forEach((v,i)=>{const bw=w/bins-2,bh=v/max*(h-pad);c.fillStyle=colors[i%4]+'bb';c.fillRect(i*w/bins,h-bh,bw,bh)})}
    else if(kind==='scatter'){pts.forEach((p,i)=>{c.fillStyle=colors[p.category%4]+'99';c.fillRect(i/pts.length*w,h-p.signal*(h-pad)-10,2.2,2.2)})}
    else{const cols=36,rows=12,grid=new Float32Array(cols*rows),counts=new Uint16Array(cols*rows);pts.forEach((p,i)=>{const j=Math.min(cols-1,Math.floor(i/pts.length*cols))*rows+p.category;grid[j]+=p.signal;counts[j]++});for(let x=0;x<cols;x++)for(let y=0;y<rows;y++){const j=x*rows+y,a=counts[j]?grid[j]/counts[j]:0;c.fillStyle=`rgba(182,243,106,${.06+a*.9})`;c.fillRect(x*w/cols+1,y*h/rows+1,w/cols-2,h/rows-2)}}
    onRender(performance.now()-start);
  },[data,version,kind,zoom,offset,onRender]);
  const handleWheel=(e:React.WheelEvent<HTMLCanvasElement>)=>{e.preventDefault();setZoom(z=>Math.max(1,Math.min(12,z+(e.deltaY<0?1:-1))))};
  const handleDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,offset}};
  const handleMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(drag.current)setOffset(Math.max(0,drag.current.offset+(drag.current.x-e.clientX)*12))};
  return <canvas ref={ref} className="chart-canvas" onWheel={handleWheel} onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={()=>{drag.current=null}} aria-label={`${kind} chart. Scroll to zoom and drag to pan.`}/>;
});

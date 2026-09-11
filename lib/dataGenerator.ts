import type { DataPoint } from './types';
export function makePoint(id:number, now=Date.now()):DataPoint { const wave=Math.sin(id*.035)*18+Math.cos(id*.008)*9; return {id,timestamp:now-(10000-id)*100,value:118+wave+(Math.random()-.5)*13,category:id%12,signal:Math.max(0,Math.min(1,.68+Math.sin(id*.021)*.24+(Math.random()-.5)*.12))}; }
export function generateData(count:number){ return Array.from({length:count},(_,i)=>makePoint(i)); }

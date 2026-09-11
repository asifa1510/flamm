'use client';
import { useCallback,useRef } from 'react';
export function useChartRenderer(){const lastRenderMs=useRef(0);const measure=useCallback((paint:()=>void)=>{const start=performance.now();paint();lastRenderMs.current=performance.now()-start;return lastRenderMs.current},[]);return{measure,lastRenderMs}}

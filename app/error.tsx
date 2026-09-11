'use client';
export default function Error({reset}:{reset:()=>void}){return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#080b0e',color:'#f2f5ee'}}><div><h1>Signal interrupted.</h1><button onClick={reset}>Reconnect</button></div></main>}

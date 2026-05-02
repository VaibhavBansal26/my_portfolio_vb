"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {id:number;x:number;y:number;text:string;type:"good"|"bad";speed:number};
const GOOD=["Python","React","AI","RAG","AWS","Docker","Node","LLM","Spark","Next.js","TypeScript","FastAPI","PyTorch","Kafka"];
const BAD=["bug","error","crash","404","null"];
let nid=0;

function beep(freq:number,dur:number,type:OscillatorType="sine"){
  try{const c=new(window.AudioContext||(window as any).webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=freq;o.type=type;g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.start();o.stop(c.currentTime+dur);}catch{}
}

export default function InlineMiniGame() {
  const [items,setItems]=useState<Item[]>([]);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(3);
  const [catX,setCatX]=useState(50);
  const [running,setRunning]=useState(false);
  const [best,setBest]=useState(0);
  const [combo,setCombo]=useState(0);
  const [flashScore,setFlashScore]=useState<string|null>(null);
  const frameRef=useRef<number>(0);
  const lastSpawn=useRef(0);
  const gameRef=useRef<HTMLDivElement>(null);
  // Always-running background particles (even before game starts)
  const bgRef=useRef<HTMLCanvasElement>(null);

  // Background particle canvas — always animating
  useEffect(()=>{
    const cv=bgRef.current; if(!cv)return;
    const ctx=cv.getContext("2d"); if(!ctx)return;
    // Use parent dimensions since canvas may not have layout yet
    const parent = cv.parentElement;
    let W=parent?.offsetWidth||720, H=parent?.offsetHeight||300;
    cv.width=W;cv.height=H;
    const pts=Array.from({length:50},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.4+.3}));
    let id:number;
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<100){ctx.beginPath();ctx.strokeStyle=`rgba(232,168,56,${(1-d/100)*.15})`;ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
        }
        ctx.beginPath();ctx.arc(pts[i].x,pts[i].y,pts[i].r,0,Math.PI*2);ctx.fillStyle="rgba(232,168,56,.4)";ctx.fill();
        pts[i].x+=pts[i].vx;pts[i].y+=pts[i].vy;
        if(pts[i].x<0||pts[i].x>W)pts[i].vx*=-1;
        if(pts[i].y<0||pts[i].y>H)pts[i].vy*=-1;
      }
      id=requestAnimationFrame(draw);
    }
    id=requestAnimationFrame(draw);
    const resize=()=>{const p=cv.parentElement;W=p?.offsetWidth||720;H=p?.offsetHeight||300;cv.width=W;cv.height=H;};
    window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);

  const end=useCallback(()=>{
    setRunning(false);setBest(b=>Math.max(b,score));cancelAnimationFrame(frameRef.current);beep(180,.5,"sawtooth");
  },[score]);

  useEffect(()=>{
    if(!running)return;
    let last=performance.now();
    const loop=(now:number)=>{
      const dt=now-last;last=now;
      if(now-lastSpawn.current>Math.max(400,880-score*6)){
        lastSpawn.current=now;
        const good=Math.random()>.28;
        setItems(p=>[...p,{id:nid++,x:5+Math.random()*88,y:-6,text:(good?GOOD:BAD)[Math.floor(Math.random()*(good?GOOD:BAD).length)],type:good?"good":"bad",speed:9+Math.random()*5+score*.05}]);
      }
      setItems(prev=>{const alive:Item[]=[];let lose=false;prev.forEach(i=>{const ny=i.y+i.speed*dt/1000;if(ny>96){if(i.type==="good")lose=true;}else alive.push({...i,y:ny});});if(lose)setLives(l=>{if(l<=1){setTimeout(end,50);return 0;}return l-1;});return alive;});
      frameRef.current=requestAnimationFrame(loop);
    };
    frameRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(frameRef.current);
  },[running,score,end]);

  useEffect(()=>{
    if(!running)return;
    const keys=new Set<string>();
    const kd=(e:KeyboardEvent)=>keys.add(e.key);const ku=(e:KeyboardEvent)=>keys.delete(e.key);
    window.addEventListener("keydown",kd);window.addEventListener("keyup",ku);
    const mv=setInterval(()=>{if(keys.has("ArrowLeft")||keys.has("a"))setCatX(x=>Math.max(3,x-2.8));if(keys.has("ArrowRight")||keys.has("d"))setCatX(x=>Math.min(95,x+2.8));},16);
    return()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);clearInterval(mv);};
  },[running]);

  useEffect(()=>{
    if(!running)return;
    const hit:number[]=[];
    items.forEach(i=>{if(i.y>80&&Math.abs(i.x-catX)<9){hit.push(i.id);if(i.type==="good"){const pts=10+combo*2;setScore(s=>s+pts);setCombo(c=>c+1);setFlashScore(`+${pts}`);setTimeout(()=>setFlashScore(null),500);beep(660+combo*40,.12,"triangle");}else{setCombo(0);setLives(l=>{if(l<=1){setTimeout(end,50);return 0;}return l-1;});setFlashScore("💥");setTimeout(()=>setFlashScore(null),500);beep(120,.25,"sawtooth");}}});
    if(hit.length)setItems(p=>p.filter(i=>!hit.includes(i.id)));
  },[items,catX,running,combo,end]);

  const start=()=>{setItems([]);setScore(0);setLives(3);setCatX(50);setCombo(0);setFlashScore(null);lastSpawn.current=performance.now();setRunning(true);beep(440,.1,"square");};
  const onMouseMove=(e:React.MouseEvent)=>{if(!running||!gameRef.current)return;const r=gameRef.current.getBoundingClientRect();setCatX(((e.clientX-r.left)/r.width)*100);};

  return (
    <section style={{borderTop:"1px solid var(--border)",padding:"64px 0",position:"relative",overflow:"hidden"}}>
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"linear-gradient(rgba(232,168,56,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.02) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div style={{textAlign:"center",marginBottom:24}}>
          <span className="section-label">Take a Break</span>
          <h2 className="font-display font-extrabold mt-2" style={{fontSize:"clamp(1.6rem,3vw,2.4rem)"}}>
            Code{" "}<span style={{background:"linear-gradient(120deg,#e8a838,#f4c96a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Catcher</span>
          </h2>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--text-muted)",marginTop:6}}>catch keywords · avoid bugs · mouse or ← →</p>
        </div>
        <div style={{maxWidth:720,margin:"0 auto",border:"1px solid var(--border)",overflow:"hidden"}}>
          {/* HUD */}
          <div style={{padding:"8px 16px",background:"var(--surface)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:20}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#e8a838"}}>Score: <strong>{score}</strong></span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--text-muted)"}}>Best: {best}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{"❤️".repeat(lives)}{"🖤".repeat(Math.max(0,3-lives))}</span>
            {combo>1&&<motion.span initial={{scale:.8}} animate={{scale:1}} style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,color:"#f4c96a"}}>x{combo} combo!</motion.span>}
          </div>
          {/* Arena */}
          <div ref={gameRef} onMouseMove={onMouseMove}
            style={{height:300,position:"relative",overflow:"hidden",background:"var(--bg)",cursor:running?"none":"default"}}>
            {/* Particle canvas — ALWAYS visible behind everything */}
            <canvas ref={bgRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
            {/* Grid overlay */}
            <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(232,168,56,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.025) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none",zIndex:1}}/>

            {/* Start/game-over overlay — semi-transparent so particles show through */}
            {!running&&(
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,zIndex:10,background:"rgba(6,6,6,.6)",backdropFilter:"blur(2px)"}}>
                {lives===0&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#e8a838"}}>Game Over! Score: {score}</div>}
                <motion.button onClick={start} whileHover={{scale:1.04}} whileTap={{scale:.96}}
                  style={{background:"#e8a838",border:"none",color:"#0e0e0e",padding:"12px 30px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:800,cursor:"pointer",letterSpacing:".15em",textTransform:"uppercase",boxShadow:"0 0 24px rgba(232,168,56,.4)",zIndex:11}}>
                  {lives===0?"Play Again ↩":"Start Game ▶"}
                </motion.button>
              </div>
            )}

            {/* Falling items */}
            {items.map(i=>(
              <div key={i.id} style={{position:"absolute",left:`${i.x}%`,top:`${i.y}%`,transform:"translate(-50%,-50%)",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"3px 9px",whiteSpace:"nowrap",pointerEvents:"none",zIndex:5,color:i.type==="good"?"#e8a838":"#f87171",border:`1px solid ${i.type==="good"?"rgba(232,168,56,.45)":"rgba(248,113,113,.45)"}`,background:i.type==="good"?"rgba(6,6,6,.85)":"rgba(6,6,6,.85)"}}>
                {i.text}
              </div>
            ))}

            {/* Paddle */}
            {running&&<div style={{position:"absolute",bottom:"9%",left:`${catX}%`,transform:"translateX(-50%)",pointerEvents:"none",zIndex:5}}>
              <div style={{width:72,height:8,background:"#e8a838",borderRadius:4,boxShadow:"0 0 14px rgba(232,168,56,.7)"}}/>
              <div style={{width:22,height:10,background:"rgba(232,168,56,.2)",margin:"0 auto",border:"1px solid rgba(232,168,56,.4)",borderRadius:"0 0 4px 4px"}}/>
            </div>}

            {/* Flash */}
            <AnimatePresence>
              {flashScore&&<motion.div initial={{opacity:1,scale:1}} animate={{opacity:0,scale:1.5}} exit={{opacity:0}} transition={{duration:.5}}
                style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#e8a838",pointerEvents:"none",zIndex:10,textShadow:"0 0 12px rgba(232,168,56,.8)"}}>
                {flashScore}
              </motion.div>}
            </AnimatePresence>
          </div>
          <div style={{padding:"6px 16px",background:"var(--surface)",borderTop:"1px solid var(--border)",textAlign:"center"}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"var(--text-muted)",margin:0}}>🟡 catch keywords · 🔴 avoid bugs · combo multiplier · 🎵 sound fx</p>
          </div>
        </div>
      </div>
    </section>
  );
}

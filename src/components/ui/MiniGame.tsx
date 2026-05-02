"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple "Code Catcher" game - catch falling tech keywords, avoid bugs
type Item = { id:number; x:number; y:number; text:string; type:"good"|"bad"; speed:number };
const GOOD = ["Python","React","AI","RAG","AWS","Docker","Node","LLM","Spark","next.js"];
const BAD  = ["bug 🐛","error","crash","404","null"];
let nextId = 0;

export default function MiniGame() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [catX, setCatX] = useState(50);
  const [running, setRunning] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<string|null>(null);
  const frameRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);

  const endGame = useCallback(() => {
    setRunning(false);
    setHighScore(h => Math.max(h, score));
    cancelAnimationFrame(frameRef.current);
  }, [score]);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = now - last; last = now;

      // Spawn
      if (now - lastSpawn.current > 1000 - Math.min(score * 8, 600)) {
        lastSpawn.current = now;
        const isGood = Math.random() > 0.3;
        const pool = isGood ? GOOD : BAD;
        setItems(prev => [...prev, {
          id: nextId++,
          x: 5 + Math.random() * 85,
          y: -8,
          text: pool[Math.floor(Math.random() * pool.length)],
          type: isGood ? "good" : "bad",
          speed: 8 + Math.random() * 6 + score * 0.05,
        }]);
      }

      // Move items down
      setItems(prev => {
        const alive: Item[] = [];
        let loseLife = false;
        prev.forEach(item => {
          const ny = item.y + item.speed * dt / 1000;
          if (ny > 96) {
            if (item.type === "good") loseLife = true;
          } else {
            alive.push({ ...item, y: ny });
          }
        });
        if (loseLife) {
          setLives(l => { if (l <= 1) { setTimeout(endGame, 50); return 0; } return l - 1; });
        }
        return alive;
      });

      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, score, endGame]);

  // Keyboard controls
  useEffect(() => {
    if (!running) return;
    const keys = new Set<string>();
    const kd = (e: KeyboardEvent) => { keys.add(e.key); };
    const ku = (e: KeyboardEvent) => { keys.delete(e.key); };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    const move = setInterval(() => {
      if (keys.has("ArrowLeft") || keys.has("a")) setCatX(x => Math.max(2, x - 3));
      if (keys.has("ArrowRight") || keys.has("d")) setCatX(x => Math.min(96, x + 3));
    }, 16);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); clearInterval(move); };
  }, [running]);

  // Collision detection
  useEffect(() => {
    if (!running) return;
    const caught: number[] = [];
    items.forEach(item => {
      if (item.y > 82 && Math.abs(item.x - catX) < 8) {
        caught.push(item.id);
        if (item.type === "good") {
          setScore(s => s + 10 + combo * 2);
          setCombo(c => c + 1);
          setFlash("+" + (10 + combo * 2));
          setTimeout(() => setFlash(null), 600);
        } else {
          setCombo(0);
          setLives(l => { if (l <= 1) { setTimeout(endGame, 50); return 0; } return l - 1; });
          setFlash("💥");
          setTimeout(() => setFlash(null), 600);
        }
      }
    });
    if (caught.length) setItems(prev => prev.filter(i => !caught.includes(i.id)));
  }, [items, catX, running, combo, endGame]);

  const startGame = () => {
    setItems([]); setScore(0); setLives(3); setCatX(50); setCombo(0); setFlash(null);
    lastSpawn.current = performance.now();
    setRunning(true);
  };

  // Mouse control
  const onMouseMove = (e: React.MouseEvent) => {
    if (!running || !gameRef.current) return;
    const r = gameRef.current.getBoundingClientRect();
    setCatX(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
        style={{ position:"fixed", bottom:84, right:24, zIndex:90,
          background:"#111", border:"1px solid rgba(232,168,56,.4)",
          color:"#e8a838", fontFamily:"'JetBrains Mono',monospace",
          fontSize:10, padding:"8px 14px", cursor:"pointer",
          boxShadow:"0 0 16px rgba(232,168,56,.12)" }}>
        🎮 mini game
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)",
              backdropFilter:"blur(8px)", zIndex:200,
              display:"flex", alignItems:"center", justifyContent:"center" }}>

            <motion.div
              initial={{ scale:.85, y:30 }} animate={{ scale:1, y:0 }} exit={{ scale:.85, y:30 }}
              style={{ width:460, background:"#0e0e0e", border:"1px solid rgba(232,168,56,.35)",
                overflow:"hidden", boxShadow:"0 0 60px rgba(232,168,56,.2)" }}>

              {/* Header */}
              <div style={{ background:"#080808", borderBottom:"1px solid #1a1a1a",
                padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#ff5f57" }} />
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#febc2e" }} />
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#28c840" }} />
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#e8a838",
                  letterSpacing:".15em", textTransform:"uppercase" }}>Code Catcher</span>
                <button onClick={() => { setOpen(false); setRunning(false); cancelAnimationFrame(frameRef.current); }}
                  style={{ background:"transparent", border:"none", color:"#555", cursor:"pointer", fontSize:16 }}>✕</button>
              </div>

              {/* HUD */}
              <div style={{ padding:"8px 16px", borderBottom:"1px solid #111",
                display:"flex", gap:16, alignItems:"center", background:"#080808" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#e8a838" }}>
                  Score: <strong>{score}</strong>
                </span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#7a7265" }}>
                  Best: {highScore}
                </span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#e8a838" }}>
                  {"❤️".repeat(lives)}{"🖤".repeat(Math.max(0,3-lives))}
                </span>
                {combo > 1 && (
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, color:"#f4c96a" }}>
                    x{combo} combo!
                  </span>
                )}
              </div>

              {/* Game arena */}
              <div ref={gameRef} onMouseMove={onMouseMove}
                style={{ height:280, position:"relative", overflow:"hidden",
                  background:"#060606", cursor: running ? "none" : "default",
                  backgroundImage:"linear-gradient(rgba(232,168,56,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.02) 1px,transparent 1px)",
                  backgroundSize:"24px 24px" }}>

                {!running && (
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", gap:12, zIndex:10 }}>
                    {lives === 0 && (
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#e8a838" }}>
                        Game Over! Score: {score}
                      </div>
                    )}
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#555",
                      textAlign:"center", maxWidth:260, lineHeight:1.7 }}>
                      Catch tech keywords 🟡 · Avoid bugs 🔴<br/>
                      Move mouse or use ← → keys
                    </p>
                    <button onClick={startGame}
                      style={{ background:"#e8a838", border:"none", color:"#0e0e0e",
                        padding:"10px 24px", fontFamily:"'JetBrains Mono',monospace",
                        fontSize:10, fontWeight:800, cursor:"pointer",
                        letterSpacing:".15em", textTransform:"uppercase",
                        boxShadow:"0 0 20px rgba(232,168,56,.4)" }}>
                      {lives === 0 ? "Play Again" : "Start Game"}
                    </button>
                  </div>
                )}

                {/* Falling items */}
                {items.map(item => (
                  <div key={item.id} style={{
                    position:"absolute", left:`${item.x}%`, top:`${item.y}%`,
                    transform:"translate(-50%,-50%)",
                    fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700,
                    color: item.type==="good" ? "#e8a838" : "#f87171",
                    border:`1px solid ${item.type==="good"?"rgba(232,168,56,.4)":"rgba(248,113,113,.4)"}`,
                    background: item.type==="good"?"rgba(232,168,56,.08)":"rgba(248,113,113,.08)",
                    padding:"3px 8px", whiteSpace:"nowrap", pointerEvents:"none",
                  }}>{item.text}</div>
                ))}

                {/* Catcher */}
                {running && (
                  <div style={{ position:"absolute", bottom:"8%", left:`${catX}%`,
                    transform:"translateX(-50%)", pointerEvents:"none" }}>
                    <div style={{ width:70, height:8, background:"#e8a838",
                      borderRadius:4, boxShadow:"0 0 12px rgba(232,168,56,.6)" }} />
                    <div style={{ width:20, height:12, background:"rgba(232,168,56,.3)",
                      margin:"0 auto", borderRadius:"0 0 4px 4px",
                      border:"1px solid rgba(232,168,56,.4)" }} />
                  </div>
                )}

                {/* Flash message */}
                <AnimatePresence>
                  {flash && (
                    <motion.div initial={{ opacity:1, y:0, scale:1 }} animate={{ y:-30, scale:1.2 }}
                      exit={{ opacity:0 }}
                      style={{ position:"absolute", top:"70%", left:`${catX}%`,
                        transform:"translateX(-50%)", fontFamily:"'Syne',sans-serif",
                        fontSize:14, fontWeight:800, color:"#e8a838",
                        pointerEvents:"none", zIndex:5 }}>
                      {flash}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ padding:"8px 16px", background:"#080808", borderTop:"1px solid #111" }}>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"#333", margin:0, textAlign:"center" }}>
                  move mouse to control · catch keywords to score · avoid bugs
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

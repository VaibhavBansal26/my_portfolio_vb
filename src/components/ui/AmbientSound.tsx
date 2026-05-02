"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.5);
  const [showVol, setShowVol] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // The actual Interstellar "Cornfield Chase" is on YouTube — 
  // we use a royalty-free piano cover hosted publicly
  // User can replace /audio/interstellar.mp3 with the real clip
  const TRACK = "/audio/interstellar.mp3";

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = vol;
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Autoplay blocked — still mark playing so UI updates
        setPlaying(false);
      });
    }
  };

  const changeVol = (v: number) => {
    setVol(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  return (
    <div style={{ position:"fixed", bottom:96, right:24, zIndex:90, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} loop preload="none">
        <source src={TRACK} type="audio/mpeg"/>
      </audio>

      {/* Volume slider */}
      <AnimatePresence>
        {showVol && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
            style={{ background:"var(--bg-card)", border:"1px solid var(--border)", padding:"10px 12px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"var(--text-muted)", letterSpacing:".15em" }}>VOL</span>
            <input type="range" min={0} max={1} step={0.05} value={vol}
              onChange={e => changeVol(parseFloat(e.target.value))}
              style={{ height:60, cursor:"pointer", writingMode:"vertical-lr" as const,
                direction:"rtl" as const, width:4, appearance:"none" as any }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"var(--text-muted)" }}>
              {Math.round(vol*100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button whileHover={{scale:1.08}} whileTap={{scale:.92}}
        onClick={toggle}
        onContextMenu={e=>{e.preventDefault(); setShowVol(v=>!v);}}
        title={playing ? "Pause · Right-click for volume" : "Play Interstellar Theme"}
        style={{ width:42, height:42, borderRadius:"50%", position:"relative",
          background: playing ? "rgba(232,168,56,.15)" : "var(--surface)",
          border:`1px solid ${playing?"rgba(232,168,56,.5)":"var(--border)"}`,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow: playing?"0 0 20px rgba(232,168,56,.25)":"none", transition:"all .3s" }}>
        <span style={{fontSize:18}}>{playing?"⏸":"🎹"}</span>
        {playing && [1,2].map(i=>(
          <motion.div key={i} style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(232,168,56,.4)"}}
            animate={{scale:[1,1.4+i*.3],opacity:[.5,0]}}
            transition={{duration:2,repeat:Infinity,delay:i*.5}}/>
        ))}
      </motion.button>


    </div>
  );
}

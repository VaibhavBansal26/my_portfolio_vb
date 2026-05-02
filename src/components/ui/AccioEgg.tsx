"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiDownload, FiX } from "react-icons/fi";

export default function AccioEgg() {
  const [active, setActive] = useState(false);
  const typed = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      typed.current = (typed.current + e.key).slice(-5);
      if (typed.current === "accio") {
        typed.current = "";
        setActive(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setActive(false), 8000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="fixed inset-0 z-[8500] flex items-center justify-center"
          style={{ background:"rgba(0,0,0,.82)", backdropFilter:"blur(14px)" }}
          onClick={() => setActive(false)}>

          <motion.div
            initial={{ x:"100vw", opacity:0 }}
            animate={{ x:0, opacity:1 }}
            exit={{ x:"-100vw", opacity:0 }}
            transition={{ type:"spring", stiffness:120, damping:18 }}
            onClick={e => e.stopPropagation()}
            style={{ background:"rgba(8,6,2,.96)", border:"1px solid rgba(232,168,56,.5)",
              padding:"36px 40px", maxWidth:440, width:"90vw", position:"relative",
              boxShadow:"0 0 60px rgba(232,168,56,.2), 0 0 120px rgba(232,168,56,.08)" }}>

            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(to right,transparent,#e8a838,transparent)" }}/>
            {[{top:10,left:10},{top:10,right:10},{bottom:10,left:10},{bottom:10,right:10}].map((pos,i)=>(
              <div key={i} style={{ position:"absolute", width:14, height:14, ...pos,
                borderTop:i<2?"1.5px solid rgba(232,168,56,.6)":undefined,
                borderBottom:i>=2?"1.5px solid rgba(232,168,56,.6)":undefined,
                borderLeft:i%2===0?"1.5px solid rgba(232,168,56,.6)":undefined,
                borderRight:i%2===1?"1.5px solid rgba(232,168,56,.6)":undefined }}/>
            ))}

            <button onClick={() => setActive(false)}
              style={{ position:"absolute", top:14, right:14, background:"transparent", border:"none", cursor:"pointer", color:"rgba(232,168,56,.5)" }}>
              <FiX size={16}/>
            </button>

            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"rgba(232,168,56,.5)", letterSpacing:".25em", textTransform:"uppercase", marginBottom:10 }}>
              🪄 Accio Resume
            </div>

            <motion.p
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
              style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(20px,2.5vw,26px)", fontStyle:"italic",
                color:"rgba(232,168,56,.9)", letterSpacing:".04em", marginBottom:18,
                textShadow:"0 0 20px rgba(232,168,56,.4)" }}>
              Accio Resume!
            </motion.p>

            <motion.div
              initial={{ x:60, opacity:0, rotate:8 }}
              animate={{ x:0, opacity:1, rotate:0 }}
              transition={{ delay:.5, type:"spring", stiffness:200, damping:20 }}
              style={{ border:"1px solid rgba(232,168,56,.3)", background:"rgba(232,168,56,.05)", padding:"16px 18px", marginBottom:20 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#f0ece4", marginBottom:4 }}>Vaibhav Bansal</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"rgba(232,168,56,.7)", marginBottom:10, letterSpacing:".05em" }}>
                AI Engineer · Software Developer · United States
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {["Python","LangChain","RAG","React","AWS","Docker"].map(t => (
                  <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, border:"1px solid rgba(232,168,56,.25)", color:"rgba(232,168,56,.65)", padding:"2px 7px" }}>{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.8 }}
              style={{ display:"flex", gap:10 }}>
              <Link href="/resume" onClick={() => setActive(false)}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 20px",
                  background:"#e8a838", color:"#0e0e0e", textDecoration:"none",
                  fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800,
                  letterSpacing:".12em", textTransform:"uppercase" }}>
                View Resume →
              </Link>
              <a href="/resume/Vaibhav_Bansal_Resume.pdf" download
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 16px",
                  border:"1px solid rgba(232,168,56,.4)", color:"rgba(232,168,56,.8)",
                  textDecoration:"none", fontFamily:"'JetBrains Mono',monospace",
                  fontSize:9, letterSpacing:".1em", textTransform:"uppercase" }}>
                <FiDownload size={11}/> Download
              </a>
            </motion.div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"rgba(232,168,56,.25)", marginTop:14, letterSpacing:".1em" }}>
              hint: type "accio" anywhere · click outside to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

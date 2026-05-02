"use client";
import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "E.D.I.T.H SYSTEM v4.2.1",          color: "#e8a838", bold: true  },
  { text: "EVEN DEAD I'M THE HERO",            color: "rgba(232,168,56,.5)", bold: false },
  { text: "",                                   color: "",        bold: false },
  { text: "INITIALIZING...",                    color: "#e8a838", bold: false },
  { text: "► Loading core modules",            color: "rgba(232,168,56,.7)", bold: false },
  { text: "► Connecting to neural network",    color: "rgba(232,168,56,.7)", bold: false },
  { text: "► Authenticating user identity",   color: "rgba(232,168,56,.7)", bold: false },
  { text: "",                                   color: "",        bold: false },
  { text: "LOADING VAIBHAV BANSAL...",         color: "#e8a838", bold: true  },
  { text: "► AI Engineer · Software Dev",     color: "rgba(232,168,56,.7)", bold: false },
  { text: "► 5+ years · SUNY Buffalo MS",    color: "rgba(232,168,56,.7)", bold: false },
  { text: "► LangChain · RAG · React · AWS", color: "rgba(232,168,56,.7)", bold: false },
  { text: "",                                   color: "",        bold: false },
  { text: "████████████████████ 100%",         color: "#e8a838", bold: false },
  { text: "",                                   color: "",        bold: false },
  { text: "ALL SYSTEMS NOMINAL.",              color: "#34d399", bold: true  },
  { text: "SYSTEM READY.",                     color: "#34d399", bold: true  },
];

const INTERVAL   = 160;
const TOTAL_MS   = LINES.length * INTERVAL;
const FADE_MS    = TOTAL_MS + 500;
const REMOVE_MS  = FADE_MS + 800;

export default function BootLoader() {
  // Start as "showing" — we hide it only if session says already booted
  const [visible, setVisible]   = useState(true);
  const [fading,  setFading]    = useState(false);
  const [shown,   setShown]     = useState<number[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Check session — only runs on client
    const forceShow = window.location.search.includes("boot=1");
    let booted = false;
    try { booted = !forceShow && !!sessionStorage.getItem("vb_booted2"); } catch {}

    if (booted) {
      // Already booted — hide immediately (no flash because we set this synchronously)
      setVisible(false);
      return;
    }

    // Mark as booted
    try { if (!forceShow) sessionStorage.setItem("vb_booted2", "1"); } catch {}

    // Reveal lines one by one
    LINES.forEach((_, i) => {
      const t = setTimeout(() => setShown(p => [...p, i]), i * INTERVAL + 80);
      timers.current.push(t);
    });

    // Fade out then hide
    const t1 = setTimeout(() => setFading(true),   FADE_MS);
    const t2 = setTimeout(() => setVisible(false), REMOVE_MS);
    timers.current.push(t1, t2);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  // Unmount entirely once done
  if (!visible) return null;

  return (
    <>
      {/* Keyframes injected at the very top so they're available before lines render */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bl_in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bl_cur {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}} />

      <div style={{
        position:  "fixed", inset: 0, zIndex: 9999,
        background: "#050505",
        display:   "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding:   "0 clamp(28px,10vw,140px)",
        overflow:  "hidden",
        opacity:   fading ? 0 : 1,
        transition:"opacity 0.8s ease",
        pointerEvents: fading ? "none" : "all",
      }}>

        {/* Scanlines */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(232,168,56,.018) 3px,rgba(232,168,56,.018) 4px)" }}/>

        {/* Grid */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(232,168,56,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.02) 1px,transparent 1px)",
          backgroundSize:"44px 44px" }}/>

        {/* Corner brackets */}
        {[
          { top:20, left:20,   borderTop:"1.5px solid rgba(232,168,56,.4)", borderLeft:"1.5px solid rgba(232,168,56,.4)"   },
          { top:20, right:20,  borderTop:"1.5px solid rgba(232,168,56,.4)", borderRight:"1.5px solid rgba(232,168,56,.4)"  },
          { bottom:20, left:20,  borderBottom:"1.5px solid rgba(232,168,56,.4)", borderLeft:"1.5px solid rgba(232,168,56,.4)"  },
          { bottom:20, right:20, borderBottom:"1.5px solid rgba(232,168,56,.4)", borderRight:"1.5px solid rgba(232,168,56,.4)" },
        ].map((s, i) => (
          <div key={i} style={{ position:"absolute", width:20, height:20, ...s as React.CSSProperties }}/>
        ))}

        {/* Amber glow */}
        <div style={{ position:"absolute", top:"20%", right:"10%", width:300, height:300,
          borderRadius:"50%", pointerEvents:"none",
          background:"radial-gradient(circle,rgba(232,168,56,.08) 0%,transparent 65%)" }}/>

        {/* Terminal text */}
        <div style={{ position:"relative", zIndex:2, maxWidth:580 }}>
          {shown.map(i => {
            const line  = LINES[i];
            const isLast = i === shown[shown.length - 1];
            return (
              <div key={i} style={{
                fontFamily:    "monospace",
                fontSize:      "clamp(12px,1.4vw,14px)",
                lineHeight:    2,
                fontWeight:    line.bold ? 700 : 400,
                color:         line.color || "transparent",
                letterSpacing: ".05em",
                minHeight:     line.text ? undefined : "0.6em",
                animation:     "bl_in .18s ease forwards",
                textShadow:
                  line.color === "#e8a838" ? "0 0 12px rgba(232,168,56,.5)" :
                  line.color === "#34d399" ? "0 0 12px rgba(52,211,153,.5)" :
                  undefined,
              }}>
                {line.text}
                {isLast && !fading && (
                  <span style={{
                    display:"inline-block", width:9, height:"1em",
                    background:"#e8a838", marginLeft:5,
                    verticalAlign:"text-bottom",
                    animation:"bl_cur .8s step-end infinite",
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {shown.length === LINES.length && (
          <div style={{
            position:"absolute", bottom:28, left:0, right:0,
            textAlign:"center", fontFamily:"monospace", fontSize:10,
            color:"rgba(232,168,56,.35)", letterSpacing:".2em",
            textTransform:"uppercase", animation:"bl_in .4s ease forwards",
          }}>
            ENTERING PORTFOLIO...
          </div>
        )}
      </div>
    </>
  );
}

"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiX, FiSend, FiMic, FiMicOff, FiVolume2, FiVolumeX } from "react-icons/fi";

interface Message { role:"user"|"assistant"; text:string; }

const SUGGESTIONS = [
  "Who is Vaibhav?", "What are his top skills?",
  "Tell me about his AI projects", "Is he open to work?",
  "Show me his research paper", "How do I contact him?",
];

// Voice commands map — what phrases trigger navigation
const VOICE_COMMANDS: {phrases:string[];action:(r:ReturnType<typeof useRouter>)=>void;reply:string}[] = [
  { phrases:["show projects","go to projects","portfolio","view portfolio"],   action:r=>r.push("/portfolio"),  reply:"Taking you to the projects portfolio now." },
  { phrases:["contact","hire","get in touch","coffee","book a call"],          action:r=>r.push("/contact"),    reply:"Opening the contact page. Vaibhav would love to hear from you." },
  { phrases:["about","who is vaibhav","background","experience"],              action:r=>r.push("/about"),      reply:"Navigating to the about page." },
  { phrases:["blog","articles","videos","writing"],                            action:r=>r.push("/blog"),       reply:"Opening the blog and videos section." },
  { phrases:["resume","cv","download resume"],                                  action:r=>r.push("/resume"),     reply:"Here's the resume page." },
  { phrases:["home","go home","main page"],                                     action:r=>r.push("/"),           reply:"Taking you back to the home page." },
];

function matchVoiceCommand(text: string, router: ReturnType<typeof useRouter>) {
  const lower = text.toLowerCase();
  for (const cmd of VOICE_COMMANDS) {
    if (cmd.phrases.some(p => lower.includes(p))) {
      cmd.action(router);
      return cmd.reply;
    }
  }
  return null;
}

// FRIDAY voice — Irish female preferred, robotic tuning
function speak(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utt = new SpeechSynthesisUtterance(text);
  utt.pitch  = 0.88;   // slightly lower = more robotic
  utt.rate   = 0.92;   // slightly slower = composed, deliberate
  utt.volume = 0.9;

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Priority order: Google UK English Female → any UK English → any English
    const voice =
      voices.find(v => v.lang === "en-IE" && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang === "en-IE") ||
      voices.find(v => v.name === "Google UK English Female") ||
      voices.find(v => v.lang === "en-GB" && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];
    if (voice) utt.voice = voice;
    window.speechSynthesis.speak(utt);
  };

  if (window.speechSynthesis.getVoices().length > 0) setVoice();
  else window.speechSynthesis.onvoiceschanged = setVoice;
}

const GREETING = "Hi, I'm FRIDAY. Vaibhav's personal AI assistant. Ask me anything, or say a voice command like — show projects, contact Vaibhav, or go to blog.";

export default function Chatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role:"assistant", text:"Hi, I'm **F.R.I.D.A.Y.** — Vaibhav's personal AI.\n\nAsk me anything, or try a **voice command** — say *\"show projects\"*, *\"contact Vaibhav\"*, or *\"go to blog\"*." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [tts, setTts] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const [scanLine, setScanLine] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open via FRIDAY console / proactive nudges
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("vb-chat-open", onOpen);
    return () => window.removeEventListener("vb-chat-open", onOpen);
  }, []);

  // Scan line
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setScanLine(p => (p + 1) % 100), 28);
    return () => clearInterval(t);
  }, [open]);

  // Voice greeting on first open
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTts(true);
      setTimeout(() => speak(GREETING, true), 700);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, greeted]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const addMessage = useCallback((text: string, role: "user"|"assistant" = "assistant") => {
    setMessages(p => [...p, { role, text }]);
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setShowSugg(false);
    addMessage(text, "user");
    setInput("");
    setLoading(true);

    // Check voice navigation commands first
    const navReply = matchVoiceCommand(text, router);
    if (navReply) {
      setLoading(false);
      addMessage(navReply);
      speak(navReply, tts);
      return;
    }

    try {
      const allMsgs = [...messages, { role:"user" as const, text }];
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages: allMsgs.map(m=>({ role:m.role, content:m.text })) }),
      });
      const data = await res.json();
      const reply = data.reply || "Systems temporarily offline. Contact Vaibhav at vaibhav.bansal945@gmail.com";
      addMessage(reply);
      speak(reply, tts);
    } catch {
      const err = "Connection lost. Reach Vaibhav directly at vaibhav.bansal945@gmail.com";
      addMessage(err);
    } finally { setLoading(false); }
  }, [loading, messages, tts, router, addMessage]);

  const toggleVoice = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input requires Chrome or Edge."); return; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    recRef.current = r;
    r.lang = "en-US"; r.interimResults = false; r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      send(transcript);
    };
    r.start();
  }, [listening, send]);

  // Format assistant message (bold, italic, newlines)
  const fmt = (text: string) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text);font-weight:700">$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em style="color:rgba(232,168,56,.8)">$1</em>')
    .replace(/\n/g,            '<br/>');

  return (
    <>
      {/* FAB */}
      <motion.button whileHover={{scale:1.08}} whileTap={{scale:.92}}
        onClick={() => setOpen(o=>!o)}
        className="fixed bottom-6 right-6 z-[100] flex items-center justify-center"
        style={{ width:54, height:54, borderRadius:"50%", background:"var(--accent)", border:"none", cursor:"pointer",
          boxShadow:"0 0 28px rgba(232,168,56,.4), 0 4px 20px rgba(0,0,0,.5)" }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:.18}}
                style={{fontSize:22,color:"var(--bg)",fontWeight:800,lineHeight:1}}>✕</motion.span>
            : <motion.span key="e" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:.18}}
                style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"var(--bg)"}}>F</motion.span>
          }
        </AnimatePresence>
        {!open && (
          <motion.div className="absolute inset-0 rounded-full border-2"
            style={{borderColor:"var(--accent)"}}
            animate={{scale:[1,1.6],opacity:[0.4,0]}}
            transition={{duration:1.8,repeat:Infinity}}/>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,scale:.88,y:20}} animate={{opacity:1,scale:1,y:0}}
            exit={{opacity:0,scale:.88,y:20}} transition={{duration:.28,ease:[.22,1,.36,1]}}
            className="fixed bottom-24 right-6 z-[99] flex flex-col overflow-hidden"
            style={{ width:370, maxHeight:600, background:"var(--bg-card)",
              border:"1px solid rgba(232,168,56,.4)",
              boxShadow:"0 0 50px rgba(232,168,56,.12), 0 20px 60px rgba(0,0,0,.6)" }}>

            {/* Scan line */}
            <div style={{ position:"absolute", left:0, right:0, height:1, top:`${scanLine}%`,
              background:"linear-gradient(to right,transparent,rgba(232,168,56,.12),transparent)",
              pointerEvents:"none", zIndex:1, transition:"top .03s linear" }}/>

            {/* Header */}
            <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(232,168,56,.15)",
              background:"var(--surface)", display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
              <div style={{ position:"relative", width:38, height:38, borderRadius:"50%",
                background:"linear-gradient(135deg,rgba(232,168,56,.3),var(--accent))",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 14px rgba(232,168,56,.35)", flexShrink:0 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:"var(--bg)" }}>F</span>
                <motion.div animate={{opacity:[1,.3,1]}} transition={{duration:2,repeat:Infinity}}
                  style={{ position:"absolute", bottom:-1, right:-1, width:10, height:10,
                    borderRadius:"50%", background:"#22c55e", border:"2px solid var(--bg-card)" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:"var(--accent)", letterSpacing:".03em" }}>F.R.I.D.A.Y.</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"rgba(232,168,56,.45)", letterSpacing:".08em" }}>FRIDAY PROTOCOL · ONLINE</div>
              </div>
              {/* Voice hint badge */}
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"rgba(232,168,56,.4)",
                border:"1px solid rgba(232,168,56,.2)", padding:"2px 7px", letterSpacing:".08em" }}>
                🎤 voice nav
              </div>
              <button onClick={()=>setTts(t=>!t)}
                style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, color:tts?"var(--accent)":"rgba(232,168,56,.3)" }}>
                {tts ? <FiVolume2 size={14}/> : <FiVolumeX size={14}/>}
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"12px", display:"flex",
              flexDirection:"column", gap:8, minHeight:0, maxHeight:380, position:"relative", zIndex:2 }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.22}}
                  style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"88%", padding:"9px 12px", fontSize:12, lineHeight:1.6,
                    background: msg.role==="user" ? "var(--accent)" : "rgba(232,168,56,.06)",
                    color: msg.role==="user" ? "var(--bg)" : "var(--text)",
                    border: msg.role==="user" ? "none" : "1px solid rgba(232,168,56,.18)",
                    fontFamily:"'Inter',sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: msg.role==="assistant" ? fmt(msg.text) : msg.text }}/>
                </motion.div>
              ))}
              {loading && (
                <div style={{ display:"flex", justifyContent:"flex-start" }}>
                  <div style={{ padding:"9px 12px", background:"rgba(232,168,56,.06)", border:"1px solid rgba(232,168,56,.18)",
                    display:"flex", gap:5, alignItems:"center" }}>
                    {[0,1,2].map(i=>(
                      <motion.div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"var(--accent)" }}
                        animate={{y:[0,-5,0]}} transition={{duration:.55,repeat:Infinity,delay:i*.14}}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSugg && messages.length === 1 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}
                  style={{ display:"flex", flexDirection:"column", gap:5, marginTop:4 }}>
                  <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7,
                    color:"rgba(232,168,56,.35)", letterSpacing:".15em", textTransform:"uppercase" }}>
                    Suggested
                  </p>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      style={{ textAlign:"left", fontSize:11, padding:"6px 10px",
                        border:"1px solid rgba(232,168,56,.12)", color:"rgba(232,168,56,.55)",
                        background:"rgba(232,168,56,.03)", cursor:"pointer",
                        fontFamily:"'JetBrains Mono',monospace", transition:"all .15s" }}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.borderColor="rgba(232,168,56,.4)";el.style.color="var(--accent)";el.style.background="rgba(232,168,56,.07)";}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.borderColor="rgba(232,168,56,.12)";el.style.color="rgba(232,168,56,.55)";el.style.background="rgba(232,168,56,.03)";}}>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Voice command hint */}
              <div style={{ marginTop:4, padding:"6px 10px", background:"rgba(232,168,56,.04)",
                border:"1px solid rgba(232,168,56,.1)", fontFamily:"'JetBrains Mono',monospace", fontSize:7,
                color:"rgba(232,168,56,.35)", lineHeight:1.6 }}>
                🎤 Voice commands: "show projects" · "contact Vaibhav" · "go to blog" · "show resume"
              </div>

              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{ borderTop:"1px solid rgba(232,168,56,.15)", padding:"10px 12px",
              background:"var(--surface)", position:"relative", zIndex:2 }}>
              {listening && (
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                  <motion.div style={{ width:7, height:7, borderRadius:"50%", background:"#f87171" }}
                    animate={{scale:[1,1.4,1]}} transition={{duration:.7,repeat:Infinity}}/>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"#f87171",
                    letterSpacing:".1em", textTransform:"uppercase" }}>
                    Listening... speak a command or question
                  </span>
                </div>
              )}
              <form onSubmit={e=>{e.preventDefault();send(input);}} style={{ display:"flex", gap:6 }}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                  placeholder="Ask FRIDAY or say a command..."
                  disabled={loading||listening}
                  style={{ flex:1, padding:"8px 10px", fontSize:12,
                    border:"1px solid rgba(232,168,56,.2)",
                    background:"rgba(232,168,56,.04)", color:"var(--text)",
                    fontFamily:"'JetBrains Mono',monospace", outline:"none", transition:"border-color .2s" }}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor="rgba(232,168,56,.5)"}
                  onBlur={e=>(e.target as HTMLInputElement).style.borderColor="rgba(232,168,56,.2)"}/>
                <motion.button type="button" onClick={toggleVoice}
                  whileHover={{scale:1.08}} whileTap={{scale:.92}}
                  style={{ padding:"8px", border:"1px solid",
                    borderColor:listening?"#f87171":"rgba(232,168,56,.2)",
                    color:listening?"#f87171":"rgba(232,168,56,.5)",
                    background:listening?"rgba(248,113,113,.08)":"transparent", cursor:"pointer" }}>
                  {listening ? <FiMicOff size={14}/> : <FiMic size={14}/>}
                </motion.button>
                <motion.button type="submit" disabled={!input.trim()||loading}
                  whileHover={{scale:1.05}} whileTap={{scale:.95}}
                  style={{ padding:"8px 10px", background:"var(--accent)", color:"var(--bg)",
                    border:"none", cursor:"pointer", opacity:!input.trim()||loading?.4:1 }}>
                  <FiSend size={14}/>
                </motion.button>
              </form>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7,
                color:"rgba(232,168,56,.2)", textAlign:"center", marginTop:6, letterSpacing:".06em" }}>
                STARK INDUSTRIES TECH · CLASSIFIED · LEVEL 7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

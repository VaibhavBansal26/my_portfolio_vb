"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function LeetCodeStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [stats, setStats] = useState({ total:320, easy:145, medium:140, hard:35 });
  const [animBars, setAnimBars] = useState(false);

  useEffect(() => {
    fetch("https://leetcode.com/graphql", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ query:`query{matchedUser(username:"vaibhav_bansal26"){submitStats{acSubmissionNum{difficulty count}}}}` }),
    }).then(r=>r.json()).then(data=>{
      const nums = data?.data?.matchedUser?.submitStats?.acSubmissionNum??[];
      const g = (d:string)=>nums.find((n:any)=>n.difficulty===d)?.count??0;
      setStats({ total:g("All"), easy:g("Easy"), medium:g("Medium"), hard:g("Hard") });
    }).catch(()=>{});
  }, []);

  useEffect(()=>{ if(inView) setTimeout(()=>setAnimBars(true),300); },[inView]);

  const bars = [
    { label:"Easy",   count:stats.easy,   total:880,  color:"#34d399" },
    { label:"Medium", count:stats.medium, total:1845, color:"#f59e0b" },
    { label:"Hard",   count:stats.hard,   total:818,  color:"#f87171" },
  ];

  return (
    <div ref={ref} style={{ borderTop:"1px solid var(--border)", paddingTop:32, paddingBottom:32 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <span className="section-label">LeetCode</span>
          <h3 className="font-display font-bold text-xl mt-1">Problem Solving</h3>
        </div>
        <Link href="https://leetcode.com/vaibhav_bansal26" target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-wider"
          style={{ color:"var(--text-muted)", textDecoration:"none", transition:"color .2s" }}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--accent)"}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)"}>
          View Profile →
        </Link>
      </div>

      {/* Inline stats + bars in one contained box */}
      <motion.div initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
        style={{ border:"1px solid var(--border)", background:"var(--bg-card)", padding:"18px 20px" }}>
        {/* Numbers row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, marginBottom:16,
          borderBottom:"1px solid var(--border)", paddingBottom:14 }}>
          {[
            { label:"Solved",  value:stats.total,  color:"var(--accent)" },
            { label:"Easy",    value:stats.easy,   color:"#34d399" },
            { label:"Medium",  value:stats.medium, color:"#f59e0b" },
            { label:"Hard",    value:stats.hard,   color:"#f87171" },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{ textAlign:"center", borderRight:i<3?"1px solid var(--border)":undefined, padding:"0 8px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color, lineHeight:1 }}>{value}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"var(--text-muted)", letterSpacing:".15em", textTransform:"uppercase", marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* Progress bars */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {bars.map(({ label, count, total, color }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color, width:46, flexShrink:0 }}>{label}</span>
              <div style={{ flex:1, height:4, background:"var(--surface)", overflow:"hidden", borderRadius:2 }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width: animBars ? `${(count/total)*100}%` : 0 }}
                  transition={{ duration:1.1, delay:.1, ease:"easeOut" }}
                  style={{ height:"100%", background:color, borderRadius:2 }}/>
              </div>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"var(--text-muted)", width:60, textAlign:"right", flexShrink:0 }}>{count}/{total}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
    </div>
  );
}
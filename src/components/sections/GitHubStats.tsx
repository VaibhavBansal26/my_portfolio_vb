"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const UN = "VaibhavBansal26";

export default function GitHubStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} style={{ borderTop:"1px solid var(--border)", paddingTop:32, paddingBottom:32 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <span className="section-label">Open Source</span>
          <h3 className="font-display font-bold text-xl mt-1">GitHub Activity</h3>
        </div>
        <Link href={`https://github.com/${UN}`} target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-wider"
          style={{ color:"var(--text-muted)", textDecoration:"none", transition:"color .2s" }}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--accent)"}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)"}>
          View Profile →
        </Link>
      </div>

      {/* Single contained box */}
      <motion.div initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
        style={{ border:"1px solid var(--border)", background:"var(--bg-card)", overflow:"hidden" }}>
        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderBottom:"1px solid var(--border)" }}>
          {[
            { label:"Repos",         value:"95+",  desc:"public" },
            { label:"Stars",         value:"20+",  desc:"earned" },
            { label:"Languages",     value:"8+",   desc:"active" },
            { label:"Contributions", value:"500+", desc:"12 months" },
          ].map(({ label, value, desc }, i) => (
            <div key={label} style={{ padding:"14px 16px", borderRight:i<3?"1px solid var(--border)":undefined }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"var(--accent)", lineHeight:1 }}>{value}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"var(--text-muted)", letterSpacing:".15em", textTransform:"uppercase", marginTop:3 }}>{label}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"var(--text-muted)", opacity:.5, marginTop:1 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* GitHub readme stats images */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          {[
            { label:"GitHub Stats",  src:`https://github-readme-stats.vercel.app/api?username=${UN}&show_icons=true&theme=dark&bg_color=0e0e0e&title_color=e8a838&icon_color=e8a838&text_color=f0ece4&border_color=1a1a1a&count_private=true&hide_border=false` },
            { label:"Top Languages", src:`https://github-readme-stats.vercel.app/api/top-langs/?username=${UN}&layout=compact&theme=dark&bg_color=0e0e0e&title_color=e8a838&text_color=f0ece4&border_color=1a1a1a` },
          ].map(({ label, src }, i) => (
            <div key={label} style={{ borderRight:i===0?"1px solid var(--border)":undefined, minHeight:60, display:"flex", alignItems:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} style={{ width:"100%", height:"auto", display:"block" }}
                loading="lazy"
                onError={e => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display="none";
                  el.parentElement!.innerHTML=`<div style="padding:16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted)">${label}<br/><a href="https://github.com/${UN}" target="_blank" style="color:var(--accent);text-decoration:none">View →</a></div>`;
                }}/>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
    </div>
  );
}
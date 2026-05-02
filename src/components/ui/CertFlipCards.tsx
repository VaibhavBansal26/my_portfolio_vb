"use client";
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { certifications } from "@/data/portfolio";
import Link from "next/link";

const CERT_DETAILS: Record<string, { desc: string; skills: string[]; color: string }> = {
  "Microsoft Certified: Azure Fundamentals (AZ-900)": {
    desc: "Cloud computing concepts, core Azure services, security, privacy, compliance, and pricing.",
    skills: ["Azure Cloud","IaaS/PaaS/SaaS","Cloud Security","Cost Management"],
    color: "#0078d4",
  },
  "AWS Solutions Architect": {
    desc: "Design distributed systems on AWS — HA, fault-tolerant, scalable architectures.",
    skills: ["EC2","S3","RDS","VPC","Lambda","CloudFormation"],
    color: "#ff9900",
  },
  "Deep Learning Specialization": {
    desc: "Neural networks, CNN, RNN, LSTM, optimization, NLP, and sequence models by Andrew Ng.",
    skills: ["TensorFlow","CNN","RNN","LSTM","Optimization","NLP"],
    color: "#00bfff",
  },
  "Machine Learning": {
    desc: "Supervised & unsupervised learning, SVM, neural networks, anomaly detection by Stanford.",
    skills: ["Regression","SVM","K-means","PCA","Anomaly Detection"],
    color: "#22c55e",
  },
};

function FlipCard({ cert, index }: { cert: typeof certifications[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const details = CERT_DETAILS[cert.title] || { desc:"", skills:[], color:"#e8a838" };

  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:index*.1, duration:.5, ease:[.22,1,.36,1] }}
      style={{ perspective:1000, height:200, cursor:"pointer" }}
      onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration:.55, ease:[.22,1,.36,1] }}
        style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d" }}>

        {/* FRONT */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden",
          background:"var(--bg-card)", border:"1px solid var(--border)",
          display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"20px" }}>
          <div style={{ height:3, background:`linear-gradient(to right,${details.color},transparent)`,
            position:"absolute", top:0, left:0, right:0 }}/>
          {/* Issuer logo placeholder */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, border:`1px solid ${details.color}30`,
              background:`${details.color}10`, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0 }}>
              <span style={{ fontSize:20 }}>
                {cert.issuer.includes("Microsoft") ? "⬡" :
                 cert.issuer.includes("Amazon") ? "◈" :
                 cert.issuer.includes("Coursera") && cert.title.includes("Deep") ? "🧠" : "⚡"}
              </span>
            </div>
            <div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:`${details.color}`,
                letterSpacing:".15em", textTransform:"uppercase", marginBottom:4 }}>{cert.issuer}</p>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7, color:"var(--text-muted)" }}>{cert.year}</p>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700,
              color:"var(--text)", lineHeight:1.35, marginBottom:10 }}>{cert.title}</h4>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:7,
                color:"var(--text-muted)", letterSpacing:".1em" }}>Hover to flip →</span>
              <div style={{ width:6, height:6, borderRadius:"50%", background:details.color,
                boxShadow:`0 0 8px ${details.color}` }}/>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden",
          transform:"rotateY(180deg)", background:"var(--bg-card)",
          border:`1px solid ${details.color}60`, padding:"18px",
          display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ height:2, background:`linear-gradient(to right,${details.color},transparent)`,
            marginBottom:4 }}/>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"var(--text-muted)",
            lineHeight:1.65, flex:1 }}>{details.desc}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {details.skills.map(s => (
              <span key={s} style={{ fontSize:7, border:`1px solid ${details.color}50`,
                color:details.color, padding:"2px 7px", fontFamily:"'JetBrains Mono',monospace",
                background:`${details.color}08` }}>{s}</span>
            ))}
          </div>
          <Link href={cert.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ fontSize:8, color:details.color, fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:".1em", textTransform:"uppercase", textDecoration:"none",
              display:"flex", alignItems:"center", gap:4 }}>
            View Certificate ↗
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertFlipCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, amount:.2 });

  return (
    <div ref={ref} className="py-16" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <span className="section-label">Credentials</span>
          <h2 className="font-display font-extrabold mt-2" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>
            Certifications{" "}
            <span style={{ background:"linear-gradient(120deg,#e8a838,#f4c96a)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              & Training
            </span>
          </h2>
          <p className="font-mono text-xs mt-2" style={{ color:"var(--text-muted)" }}>
            Click any card to flip and see details
          </p>
        </div>
        {inView && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
            {certifications.map((c, i) => <FlipCard key={c.title} cert={c} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

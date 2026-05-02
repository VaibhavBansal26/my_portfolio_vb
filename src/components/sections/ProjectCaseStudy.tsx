"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { projects } from "@/data/portfolio";
import { FiGithub, FiArrowLeft } from "react-icons/fi";
import { SiNpm } from "react-icons/si";

const CAT: Record<string, { color: string; border: string; bg: string }> = {
  "AI/ML":            { color:"#c084fc", border:"rgba(168,85,247,.4)",  bg:"rgba(168,85,247,.07)" },
  "Data Engineering": { color:"#38bdf8", border:"rgba(14,165,233,.4)",  bg:"rgba(14,165,233,.07)" },
  "Full Stack":       { color:"#34d399", border:"rgba(52,211,153,.4)",  bg:"rgba(52,211,153,.07)" },
  "Open Source":      { color:"#e8a838", border:"rgba(232,168,56,.4)",  bg:"rgba(232,168,56,.07)" },
};

const CASES: Record<string, {
  match: number; status: string;
  stats: { val: string; lbl: string }[];
  problem: string[]; solution: string[]; impact: string[];
  architecture: { color: string; layer: string; detail: string }[];
  notebook?: { filename: string; cells: NbCell[] };
}> = {
  "disaster-copilot": {
    match:97, status:"Production",
    stats:[{val:"30s",lbl:"Decision latency"},{val:"91%",lbl:"Retrieval accuracy"},{val:"12+",lbl:"Data sources"},{val:"4%",lbl:"Hallucination rate"}],
    problem:["Emergency teams had 8+ minute decision cycles with fragmented, siloed data sources","No unified AI layer to prioritize life-saving actions across real-time feeds","High cognitive load on responders during critical surge events"],
    solution:["Hybrid RAG combining semantic + BM25 retrieval across 12+ live data sources","Natural language query interface — no training needed for field responders","Source-cited answers prevent hallucination in high-stakes context"],
    impact:["Decision latency: 8 min → 30 seconds","Hallucination rate dropped from 18% to 4%","Deployed on AWS ECS with auto-scaling","91% retrieval accuracy on disaster domain queries"],
    architecture:[
      {color:"#c084fc",layer:"LLM Layer",detail:"OpenAI GPT-4 · LangChain orchestration · prompt templating"},
      {color:"#38bdf8",layer:"Retrieval Layer",detail:"Chroma vector DB · BM25 sparse retrieval · EnsembleRetriever"},
      {color:"#34d399",layer:"API Layer",detail:"FastAPI · async endpoints · rate limiting · JWT auth"},
      {color:"#e8a838",layer:"Data Layer",detail:"PostgreSQL · Redis cache · S3 · 12+ live ingestion pipelines"},
      {color:"#f97316",layer:"Infrastructure",detail:"Docker · AWS ECS auto-scaling · CloudWatch · CI/CD"},
    ],
    notebook:{filename:"disaster_response_rag.ipynb",cells:[
      {type:"markdown",source:"## RAG Pipeline — Disaster Response AI Copilot\n\nEnd-to-end: ingestion → chunking → embedding → retrieval → generation."},
      {type:"code",num:1,source:`from langchain.vectorstores import Chroma\nfrom langchain.embeddings import OpenAIEmbeddings\nfrom langchain.retrievers import BM25Retriever, EnsembleRetriever`,output:"✓ All dependencies loaded",outputType:"success"},
      {type:"code",num:2,source:`splitter = RecursiveCharacterTextSplitter(\n  chunk_size=512, chunk_overlap=64\n)\nchunks = splitter.split_documents(raw_docs)\nprint(f"{len(chunks)} chunks")`,output:"847 chunks · avg 418 tokens",outputType:"text"},
      {type:"code",num:3,source:`hybrid = EnsembleRetriever(\n  retrievers=[keyword, semantic],\n  weights=[0.4, 0.6],\n)`,output:"✓ EnsembleRetriever ready — 10 candidates per query",outputType:"success"},
      {type:"code",num:4,source:`results = {\n  "Hybrid": 0.913, "Semantic": 0.784,\n  "BM25":   0.721, "Baseline": 0.612,\n}\n# Plot accuracy`,output:"chart",outputType:"chart",
        chart:[{label:"Hybrid",val:91.3,color:"#e8a838"},{label:"Semantic",val:78.4,color:"#c084fc"},{label:"BM25",val:72.1,color:"#38bdf8"},{label:"Baseline",val:61.2,color:"rgba(140,140,140,.35)"}]},
    ]},
  },
  "salary-prediction":{match:94,status:"Production",stats:[{val:"50K+",lbl:"Records/day"},{val:"89%",lbl:"Accuracy"},{val:"120ms",lbl:"P99 latency"},{val:"48h",lbl:"Retrain cycle"}],problem:["Job seekers lacked real-time salary benchmarks","Existing tools used stale data and simple regression models"],solution:["Kafka streams live salary data at 50K records/day","Spark processes features at scale; MLflow tracks experiments"],impact:["89% accuracy within $5K range on holdout set","Retraining cycle: 2 weeks → 48 hours","Sub-120ms prediction latency at p99"],architecture:[{color:"#e8a838",layer:"Streaming",detail:"Apache Kafka · 50K+ records/day"},{color:"#38bdf8",layer:"Processing",detail:"Apache Spark · feature engineering"},{color:"#c084fc",layer:"ML",detail:"XGBoost · MLflow tracking"},{color:"#34d399",layer:"Serving",detail:"FastAPI · Redis cache"},{color:"#f97316",layer:"Storage",detail:"Snowflake · AWS S3"}]},
  "heart-disease":{match:91,status:"Research",stats:[{val:"92.3%",lbl:"Accuracy"},{val:"8",lbl:"Classifiers"},{val:"47",lbl:"Experiments"},{val:"SHAP",lbl:"Explainability"}],problem:["Clinicians needed fast, explainable cardiac risk stratification","Black-box predictions unacceptable clinically"],solution:["8 classifiers via MLflow tracking; XGBoost wins at 92.3%","SHAP values provide per-patient feature attribution"],impact:["92.3% accuracy on UCI Heart Disease dataset","SHAP shows top 5 risk factors per patient","47 MLflow experiments — fully reproducible"],architecture:[{color:"#34d399",layer:"Data",detail:"UCI Heart Disease · pandas preprocessing"},{color:"#c084fc",layer:"Experiments",detail:"MLflow · 8 classifiers · cross-validation"},{color:"#38bdf8",layer:"Model",detail:"XGBoost · SHAP explainability"},{color:"#e8a838",layer:"Serving",detail:"Streamlit UI · Docker"},{color:"#f97316",layer:"Infra",detail:"AWS · MLflow registry"}],
    notebook:{filename:"heart_disease_prediction.ipynb",cells:[
      {type:"markdown",source:"## Heart Disease Prediction\n\nUCI dataset · 303 patients · 8 classifiers compared via MLflow."},
      {type:"code",num:1,source:`df = pd.read_csv('heart.csv')\nprint(df.shape, df.target.value_counts())`,output:"(303, 14)\n1  165\n0  138",outputType:"text"},
      {type:"code",num:2,source:`with mlflow.start_run():\n    model = RandomForestClassifier(n_estimators=100)\n    model.fit(X_train, y_train)\n    acc = accuracy_score(y_test, model.predict(X_test))\n    mlflow.log_metric("accuracy", acc)`,output:"Accuracy: 0.923",outputType:"success"},
      {type:"code",num:3,source:`results = {"XGBoost":0.923,"RandomForest":0.881,"SVM":0.845,"LogReg":0.820}\n# Plot`,output:"chart",outputType:"chart",
        chart:[{label:"XGBoost",val:92.3,color:"#e8a838"},{label:"RF",val:88.1,color:"#c084fc"},{label:"SVM",val:84.5,color:"#38bdf8"},{label:"LogReg",val:82.0,color:"rgba(140,140,140,.35)"}]},
    ]},
  },
  "amazon-clone":{match:88,status:"Live",stats:[{val:"Stripe",lbl:"Payments"},{val:"Real-time",lbl:"Firestore"},{val:"OAuth",lbl:"Auth"},{val:"React",lbl:"Frontend"}],problem:["Needed production-grade e-commerce with real payments","Most tutorials stop at the UI layer"],solution:["React + Redux + Firebase for real-time sync and auth","Stripe integration for live payment processing"],impact:["Live Stripe checkout flow","Firebase real-time cart sync across devices","Google OAuth + email/password auth"],architecture:[{color:"#34d399",layer:"Frontend",detail:"React · Redux · React Router"},{color:"#38bdf8",layer:"Auth",detail:"Firebase Auth · Google OAuth"},{color:"#c084fc",layer:"Database",detail:"Firestore real-time DB"},{color:"#e8a838",layer:"Payments",detail:"Stripe checkout · webhooks"},{color:"#f97316",layer:"Hosting",detail:"Vercel · CI/CD"}]},
  "natural-disaster-pred":{match:85,status:"Research",stats:[{val:"87.4%",lbl:"Accuracy"},{val:"15K",lbl:"Sat. images"},{val:"3",lbl:"Disaster types"},{val:"ResNet-50",lbl:"Backbone"}],problem:["Existing models used tabular data only","Satellite imagery spatial patterns ignored"],solution:["ResNet-50 transfer learning on 15K satellite images","Multi-class classifier for flood/earthquake/wildfire"],impact:["87.4% accuracy across 3 disaster types","Best Capstone Project at VIT University"],architecture:[{color:"#38bdf8",layer:"Data",detail:"15K satellite images · NOAA data"},{color:"#c084fc",layer:"Model",detail:"ResNet-50 · transfer learning"},{color:"#34d399",layer:"Training",detail:"PyTorch · GPU · data augmentation"},{color:"#e8a838",layer:"Evaluation",detail:"Confusion matrix · GradCAM"},{color:"#f97316",layer:"Results",detail:"Jupyter · Matplotlib · research paper"}]},
  "grapesjs-plugin":{match:82,status:"Published",stats:[{val:"npm",lbl:"Published"},{val:"15+",lbl:"Components"},{val:"MIT",lbl:"License"},{val:"Open",lbl:"Source"}],problem:["GrapesJS lacked advanced drag-and-drop components","Complex interactions had to be built from scratch"],solution:["15+ advanced component types via npm plugin","Clean plugin API — extend in 3 lines"],impact:["Available to 50K+ GrapesJS developers","15+ UI components out of the box"],architecture:[{color:"#e8a838",layer:"Plugin Core",detail:"JavaScript ES6 · GrapesJS Plugin API"},{color:"#c084fc",layer:"Components",detail:"Nested drag-and-drop · grid builder"},{color:"#38bdf8",layer:"Build",detail:"Webpack · Babel · tree-shaking"},{color:"#34d399",layer:"Distribution",detail:"npm · semantic versioning"},{color:"#f97316",layer:"Demo",detail:"Live demo · CodeSandbox · docs"}]},
};

type NbCell = {
  type:"code"|"markdown"; num?:number; source:string;
  output?:string; outputType?:"text"|"success"|"chart";
  chart?:{label:string;val:number;color:string}[];
};

const KW = ["from","import","as","def","class","return","if","else","for","in","with","print","True","False","None"];
function hl(code:string){
  return code.split("\n").map((line,li)=>{
    const parts:React.ReactNode[]=[]; let buf="",i=0;
    const flush=()=>{if(buf){parts.push(<span key={`t${li}-${parts.length}`}>{buf}</span>);buf="";}};
    while(i<line.length){
      if(line[i]==="#"){flush();parts.push(<span key={`c${li}`} style={{color:"var(--text-muted)"}}>{line.slice(i)}</span>);break;}
      if(line[i]==='"'||line[i]==="'"){flush();const q=line[i];let s=q;i++;while(i<line.length&&line[i]!==q)s+=line[i++];s+=q;i++;parts.push(<span key={`s${li}-${parts.length}`} style={{color:"#34d399"}}>{s}</span>);continue;}
      if(/[a-zA-Z_]/.test(line[i])){let w="";while(i<line.length&&/\w/.test(line[i]))w+=line[i++];flush();if(KW.includes(w))parts.push(<span key={`k${li}-${parts.length}`} style={{color:"#c084fc"}}>{w}</span>);else if(line[i]==="(")parts.push(<span key={`f${li}-${parts.length}`} style={{color:"#38bdf8"}}>{w}</span>);else buf+=w;continue;}
      if(/\d/.test(line[i])){let n="";while(i<line.length&&/[\d.]/.test(line[i]))n+=line[i++];flush();parts.push(<span key={`n${li}-${parts.length}`} style={{color:"#f59e0b"}}>{n}</span>);continue;}
      buf+=line[i++];
    }
    flush();
    return <div key={li} style={{minHeight:"1.5em"}}>{parts}</div>;
  });
}

function NbCell({cell,run,ran}:{cell:NbCell;run:()=>void;ran:boolean}){
  const [bars,setBars]=useState(false);
  useEffect(()=>{if(ran&&cell.outputType==="chart")setTimeout(()=>setBars(true),120);},[ran,cell.outputType]);
  if(cell.type==="markdown") return(
    <div style={{border:"1px solid var(--border)",marginBottom:8,overflow:"hidden"}}>
      <div style={{padding:"4px 12px",background:"var(--surface)",borderBottom:"1px solid var(--border)"}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:".15em",textTransform:"uppercase",color:"#34d399"}}>Markdown</span>
      </div>
      <div style={{padding:"12px 14px",background:"var(--bg-secondary,var(--surface))"}}>
        {cell.source.split("\n").map((l,i)=>l.startsWith("## ")?<div key={i} style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"var(--accent)",marginBottom:5}}>{l.slice(3)}</div>:l.startsWith("### ")?<div key={i} style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:3}}>{l.slice(4)}</div>:l?<div key={i} style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"var(--text-muted)",lineHeight:1.7}}>{l}</div>:<div key={i} style={{height:5}}/>)}
      </div>
    </div>
  );
  return(
    <div style={{border:`1px solid ${ran?"rgba(232,168,56,.2)":"var(--border)"}`,marginBottom:8,overflow:"hidden",transition:"border-color .3s"}}>
      <div style={{padding:"5px 12px",background:"var(--surface)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:".15em",textTransform:"uppercase",color:"#38bdf8"}}>Code</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--text-muted)"}}>[{cell.num}]</span>
        <button onClick={run} style={{marginLeft:"auto",padding:"2px 10px",background:"rgba(232,168,56,.08)",border:"1px solid var(--accent)",color:"var(--accent)",fontFamily:"'JetBrains Mono',monospace",fontSize:7,cursor:"pointer",letterSpacing:".1em"}}>▶ Run</button>
      </div>
      <div style={{padding:"10px 12px",background:"var(--bg-secondary,var(--surface))",fontFamily:"'JetBrains Mono',monospace",fontSize:10,lineHeight:1.75,overflowX:"auto"}}>{hl(cell.source)}</div>
      <AnimatePresence>
        {ran&&cell.outputType!=="chart"&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{padding:"8px 12px",background:"var(--surface)",borderTop:"1px solid var(--border)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:cell.outputType==="success"?"#34d399":"var(--text-muted)",whiteSpace:"pre-wrap"}}>{cell.output}</motion.div>}
        {ran&&cell.outputType==="chart"&&cell.chart&&<motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:"12px",background:"var(--surface)",borderTop:"1px solid var(--border)"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"var(--text-muted)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Output — accuracy</div>
          {cell.chart.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--text-muted)",width:64,textAlign:"right",flexShrink:0}}>{b.label}</div>
              <div style={{flex:1,height:14,background:"var(--surface)",overflow:"hidden"}}><motion.div initial={{width:0}} animate={{width:bars?`${b.val}%`:0}} transition={{duration:.8,delay:i*.1,ease:"easeOut"}} style={{height:"100%",background:b.color}}/></div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--accent)",width:36}}>{b.val}%</div>
            </div>
          ))}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

const TABS=["Overview","Notebook","Architecture","Results"] as const;
type Tab=typeof TABS[number];

const RESPONSIVE = `
  .cs-hero{display:grid;grid-template-columns:1fr auto;gap:20px;}
  .cs-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
  .cs-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .cs-related{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
  .cs-tabs{display:flex;border-bottom:1px solid var(--border);margin-top:20px;overflow-x:auto;}
  @media(max-width:640px){
    .cs-hero{grid-template-columns:1fr !important;}
    .cs-chips{display:none !important;}
    .cs-stats{grid-template-columns:1fr 1fr !important;}
    .cs-cards{grid-template-columns:1fr !important;}
    .cs-related{grid-template-columns:1fr 1fr !important;}
    .cs-cta{flex-direction:column !important;align-items:flex-start !important;}
    .cs-nb-bar{flex-wrap:wrap;gap:8px;}
    .cs-tab{padding:10px 10px !important;font-size:8px !important;white-space:nowrap;}
  }
`;

export default function ProjectCaseStudy({project}:{project:typeof projects[0]}){
  const cs=CAT[project.category]??CAT["Full Stack"];
  const data=CASES[project.id];
  const [tab,setTab]=useState<Tab>("Overview");
  const [runs,setRuns]=useState<boolean[]>([]);
  const nb=data?.notebook;
  const related=projects.filter(p=>p.id!==project.id).slice(0,4);

  useEffect(()=>{if(nb)setRuns(new Array(nb.cells.length).fill(false));},[nb]);
  const runCell=(i:number)=>setRuns(p=>{const n=[...p];n[i]=true;return n;});
  const runAll=()=>nb?.cells.forEach((_,i)=>setTimeout(()=>runCell(i),i*500));

  const P="0 clamp(12px,4vw,28px)";

  return(
    <main style={{background:"var(--bg)",minHeight:"100vh",color:"var(--text)",paddingTop:80}}>
      <style dangerouslySetInnerHTML={{__html:RESPONSIVE}}/>

      {/* Back */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:P,paddingBottom:12}}>
        <Link href="/portfolio" style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--text-muted)",textDecoration:"none",letterSpacing:".12em",textTransform:"uppercase",transition:"color .2s"}}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--accent)"}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--text-muted)"}>
          <FiArrowLeft size={11}/> All Projects
        </Link>
      </div>

      {/* Hero card */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:P}}>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5}}
          style={{border:`1px solid ${cs.border}`,background:"var(--bg-card)",overflow:"hidden",position:"relative"}}>
          <div style={{height:4,background:`linear-gradient(to right,${cs.color},${cs.color}40,transparent)`}}/>
          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=>(
            <div key={i} style={{position:"absolute",width:13,height:13,...pos,borderTop:i<2?`1.5px solid ${cs.color}`:undefined,borderBottom:i>=2?`1.5px solid ${cs.color}`:undefined,borderLeft:i%2===0?`1.5px solid ${cs.color}`:undefined,borderRight:i%2===1?`1.5px solid ${cs.color}`:undefined}}/>
          ))}
          <div className="cs-hero" style={{padding:"clamp(16px,4vw,28px)"}}>
            {/* Left */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,border:`1px solid ${cs.border}`,color:cs.color,padding:"3px 10px",background:cs.bg,letterSpacing:".12em",textTransform:"uppercase"}}>{project.category}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--text-muted)"}}>Case Study</span>
                {data&&<><span style={{color:"var(--text-muted)"}}>·</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#34d399",fontWeight:700}}>{data.match}% Match</span></>}
              </div>
              <h1 className="font-display font-extrabold" style={{fontSize:"clamp(1.5rem,3.5vw,2.5rem)",lineHeight:1.15,marginBottom:12,color:"var(--text)"}}>{project.title}</h1>
              <p style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"var(--text-muted)",lineHeight:1.75,maxWidth:520,marginBottom:18}}>{project.description}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {project.github&&<Link href={project.github} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 18px",background:"var(--accent)",color:"var(--bg)",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase"}}><FiGithub size={12}/> GitHub ↗</Link>}
                {nb&&<button onClick={()=>setTab("Notebook")} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 14px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text-muted)",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer"}}>📓 Notebook</button>}
                {(project as any).npm&&<Link href={(project as any).npm} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 14px",border:`1px solid ${cs.border}`,color:cs.color,textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",background:cs.bg}}><SiNpm size={12}/> npm</Link>}
              </div>
            </div>
            {/* Right: chips */}
            <div className="cs-chips" style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
              {project.tech.slice(0,7).map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,border:`1px solid ${cs.border}`,color:cs.color,padding:"3px 10px",background:cs.bg,whiteSpace:"nowrap"}}>{t}</span>)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Meta bar */}
      {data&&<div style={{maxWidth:1100,margin:"10px auto 0",padding:P}}>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"9px 14px",background:"var(--bg-card)",border:"1px solid var(--border)",flexWrap:"wrap"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#34d399",display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block"}}/>{data.status}</span>
          {data.stats.map(s=><span key={s.lbl} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--text-muted)"}}><strong style={{color:"var(--accent)",marginRight:4}}>{s.val}</strong>{s.lbl}</span>)}
          {project.featured&&<span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:cs.color}}>★ Featured</span>}
        </div>
      </div>}

      {/* Tabs */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:`0 clamp(12px,4vw,28px)`}}>
        <div className="cs-tabs">
          {TABS.map(t=>(
            <button key={t} onClick={()=>(t!=="Notebook"||nb)&&setTab(t)}
              className="cs-tab"
              style={{padding:"11px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".12em",textTransform:"uppercase",border:"none",background:"transparent",borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`,color:tab===t?"var(--accent)":(t==="Notebook"&&!nb)?"var(--border)":"var(--text-muted)",cursor:(t==="Notebook"&&!nb)?"not-allowed":"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
              {t}{t==="Notebook"&&!nb?" (N/A)":""}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:`20px clamp(12px,4vw,28px)`}}>

        {tab==="Overview"&&data&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
          <div className="cs-stats">
            {data.stats.map(s=>(
              <div key={s.lbl} style={{background:"var(--bg-card)",border:"1px solid var(--border)",padding:"14px",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right,${cs.color},transparent)`}}/>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"var(--accent)",lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"var(--text-muted)",letterSpacing:".12em",textTransform:"uppercase",marginTop:5}}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <div className="cs-cards">
            {[
              {head:"The Problem",icon:"🔴",color:"#f87171",border:"rgba(248,113,113,.25)",bg:"rgba(248,113,113,.04)",items:data.problem},
              {head:"The Solution",icon:"✅",color:cs.color,border:cs.border,bg:cs.bg,items:data.solution},
              {head:"Impact & Results",icon:"📈",color:"#34d399",border:"rgba(52,211,153,.25)",bg:"rgba(52,211,153,.04)",items:data.impact},
            ].map(({head,icon,color,border,bg,items})=>(
              <div key={head} style={{border:`1px solid ${border}`,padding:"18px",background:"var(--bg-card)",position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:color}}/>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color,marginBottom:10,paddingLeft:14}}>{icon} {head}</div>
                {items.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,paddingLeft:14}}>
                    <span style={{color,flexShrink:0,marginTop:3,fontSize:10}}>▸</span>
                    <p style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"var(--text-muted)",lineHeight:1.7}}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
            <div style={{border:"1px solid var(--border)",padding:"18px",background:"var(--bg-card)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:12}}>Full Tech Stack</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {project.tech.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,border:`1px solid ${cs.border}`,color:cs.color,padding:"4px 11px",background:cs.bg}}>{t}</span>)}
              </div>
            </div>
          </div>
        </motion.div>}

        {tab==="Notebook"&&nb&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
          <div className="cs-nb-bar" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"var(--bg-card)",border:"1px solid var(--border)",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"var(--text-muted)",letterSpacing:".15em",textTransform:"uppercase",marginBottom:3}}>Jupyter Notebook</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--accent)"}}>{nb.filename}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,border:"1px solid var(--border)",color:"var(--text-muted)",padding:"3px 8px"}}>Python 3.11</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,border:"1px solid rgba(52,211,153,.3)",color:"#34d399",padding:"3px 8px"}}>● Trusted</span>
              <button onClick={runAll} style={{padding:"7px 16px",background:"var(--accent)",color:"var(--bg)",border:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:800,cursor:"pointer"}}>▶ Run All</button>
            </div>
          </div>
          {nb.cells.map((cell,i)=><NbCell key={i} cell={cell} run={()=>runCell(i)} ran={runs[i]??false}/>)}
          <div style={{textAlign:"center",padding:"12px 0",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--text-muted)"}}>+ more cells on GitHub</div>
        </motion.div>}

        {tab==="Architecture"&&data&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",color:"var(--text-muted)",textTransform:"uppercase",marginBottom:14}}>{data.architecture.length} layers</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {data.architecture.map((layer,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:i*.07}}
                style={{padding:"14px 18px",border:`1px solid ${layer.color}30`,background:"var(--bg-card)",display:"flex",alignItems:"center",gap:14,position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:layer.color}}/>
                <div style={{width:9,height:9,borderRadius:"50%",background:layer.color,flexShrink:0,marginLeft:12}}/>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:layer.color,marginBottom:2}}>{layer.layer}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--text-muted)"}}>{layer.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>}

        {tab==="Results"&&data&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {data.impact.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.07}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"var(--bg-card)",border:"1px solid var(--border)"}}>
                <span style={{color:"#34d399",fontSize:13,flexShrink:0}}>▸</span>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"var(--text)",flex:1}}>{item}</span>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#34d399",flexShrink:0}}/>
              </motion.div>
            ))}
          </div>
        </motion.div>}
      </div>

      {/* Related */}
      <div style={{borderTop:"1px solid var(--border)",marginTop:16,padding:"18px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:P}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:12}}>More Projects</p>
          <div className="cs-related">
            {related.map(p=>{
              const rcs=CAT[p.category]??CAT["Full Stack"];
              return(
                <Link key={p.id} href={`/projects/${p.id}`} style={{textDecoration:"none"}}>
                  <div style={{border:"1px solid var(--border)",background:"var(--bg-card)",overflow:"hidden",transition:"all .2s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=rcs.border;(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)";(e.currentTarget as HTMLDivElement).style.transform="";}}>
                    <div style={{height:52,background:rcs.bg,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${rcs.border}`}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:".1em",textTransform:"uppercase",color:rcs.color}}>{p.category}</span>
                    </div>
                    <div style={{padding:"9px 11px"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:"var(--text)",lineHeight:1.3}}>{p.title}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{borderTop:"1px solid var(--border)",padding:`18px clamp(12px,4vw,28px)`}}>
        <div className="cs-cta" style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"var(--text)",marginBottom:3}}>Interested in working together?</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--text-muted)"}}>Let's build something impactful.</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Link href="/contact" style={{padding:"10px 20px",background:"var(--accent)",color:"var(--bg)",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase"}}>Get in Touch →</Link>
            <Link href="/portfolio" style={{padding:"10px 18px",border:"1px solid var(--border)",color:"var(--text-muted)",textDecoration:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".12em",textTransform:"uppercase"}}>All Projects</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

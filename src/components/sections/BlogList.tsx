"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import { blogs, youtubeVideos } from "@/data/portfolio";
import { FiPlay, FiX, FiClock, FiEye, FiCalendar, FiExternalLink } from "react-icons/fi";

type Filter = "all" | "articles" | "videos";

const TAG_COLORS: Record<string, string> = {
  LangChain:"#a855f7", RAG:"#a855f7", AI:"#e8a838",
  Python:"#34d399", React:"#38bdf8", MLOps:"#f97316",
  "Machine Learning":"#e8a838", Docker:"#38bdf8",
  Kafka:"#f97316", Airflow:"#f97316", Snowflake:"#38bdf8",
  Tutorial:"#34d399", LLM:"#a855f7", FastAPI:"#34d399",
};

function TagChips({ tags }: { tags: string[] }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {tags.slice(0,3).map(t => (
        <span key={t} style={{
          fontFamily:"'JetBrains Mono',monospace", fontSize:8,
          color: TAG_COLORS[t]||"var(--text-muted)",
          border:`1px solid ${(TAG_COLORS[t]||"var(--border)")}40`,
          background:`${(TAG_COLORS[t]||"transparent")}08`,
          padding:"2px 7px", letterSpacing:".05em",
        }}>{t}</span>
      ))}
    </div>
  );
}

/* ── Video modal ── */
function VideoModal({ video, onClose }: { video: typeof youtubeVideos[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,.88)", backdropFilter:"blur(14px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:.9, y:20 }}
        transition={{ duration:.3, ease:[.22,1,.36,1] }}
        className="w-full max-w-3xl"
        onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:12 }}>
          <div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, background:"rgba(239,68,68,.12)", border:"1px solid rgba(239,68,68,.3)", color:"#f87171", padding:"2px 8px", letterSpacing:".1em", textTransform:"uppercase" }}>
              YouTube · {video.duration}
            </span>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"#f0ece4", marginTop:8, lineHeight:1.25 }}>
              {video.title}
            </div>
          </div>
          <motion.button onClick={onClose} whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }}
            style={{ background:"rgba(240,236,228,.08)", border:"1px solid rgba(240,236,228,.15)", color:"#f0ece4", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <FiX size={15}/>
          </motion.button>
        </div>

        {/* Embed */}
        <div style={{ position:"relative", paddingBottom:"56.25%", background:"#000", overflow:"hidden" }}>
          {video.youtubeId.includes("REPLACE") ? (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, background:"linear-gradient(135deg,#0d0820,#1a0e35)" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(232,168,56,.12)", border:"1.5px solid rgba(232,168,56,.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FiPlay size={26} style={{ color:"#e8a838", marginLeft:3 }}/>
              </div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(232,168,56,.5)", textAlign:"center", lineHeight:1.8 }}>
                Add your YouTube video ID to <strong style={{ color:"#e8a838" }}>portfolio.ts</strong><br/>
                Replace <code style={{ color:"#f87171" }}>REPLACE_WITH_VIDEO_ID_{video.id.split("-")[1]}</code>
              </p>
            </div>
          ) : (
            <iframe
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen/>
          )}
        </div>

        <div style={{ padding:"10px 0 0", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <TagChips tags={video.tags}/>
          <Link href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#f87171", textDecoration:"none", letterSpacing:".1em" }}>
            <FiExternalLink size={11}/> Open on YouTube
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Single row item ── */
function VideoRow({ video, index, inView }: { video: typeof youtubeVideos[0]; index: number; inView: boolean }) {
  const [modal, setModal] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}}
        transition={{ delay:index*.05, duration:.4 }}>
        <div
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={() => setModal(true)}
          style={{ borderBottom:"1px solid var(--border)", padding:"20px 0", cursor:"pointer",
            paddingLeft: hov ? 10 : 0, transition:"padding .2s" }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>

            {/* Thumbnail */}
            <div style={{ position:"relative", width:130, height:74, flexShrink:0, overflow:"hidden", background:"var(--surface)", border:"1px solid var(--border)" }}>
              {!video.youtubeId.includes("REPLACE") ? (
                <Image src={video.thumbnail} alt={video.title} fill
                  sizes="130px"
                  style={{ objectFit:"cover",
                    transform: hov ? "scale(1.05)" : "scale(1)", transition:"transform .3s" }}/>
              ) : (
                <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#0d0820,#1a0e35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <FiPlay size={18} style={{ color:"rgba(232,168,56,.5)" }}/>
                </div>
              )}
              {/* Dark overlay + play */}
              <div style={{ position:"absolute", inset:0, background:hov?"rgba(0,0,0,.45)":"rgba(0,0,0,.2)", transition:"background .2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(232,168,56,.15)", border:"1.5px solid rgba(232,168,56,.55)", display:"flex", alignItems:"center", justifyContent:"center", transform:hov?"scale(1.15)":"scale(1)", transition:"transform .2s" }}>
                  <FiPlay size={10} style={{ color:"#e8a838", marginLeft:2 }}/>
                </div>
              </div>
              {/* Duration */}
              <div style={{ position:"absolute", bottom:4, right:5, background:"rgba(0,0,0,.82)", color:"#fff", fontFamily:"'JetBrains Mono',monospace", fontSize:8, padding:"1px 5px", borderRadius:2 }}>
                {video.duration}
              </div>
            </div>

            {/* Text */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:7, marginBottom:7, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", color:"#f87171", padding:"2px 8px", letterSpacing:".1em", textTransform:"uppercase" }}>YouTube</span>
                <TagChips tags={video.tags}/>
              </div>
              <h3 style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(1rem,1.6vw,1.15rem)", fontWeight:700, color:hov?"var(--accent)":"var(--text)", lineHeight:1.35, marginBottom:5, transition:"color .2s" }}>
                {video.title}
              </h3>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-muted)", lineHeight:1.65, marginBottom:8 }}>
                {video.description.slice(0,110)}...
              </p>
              <div style={{ display:"flex", gap:14 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)" }}>
                  <FiEye size={10}/> {video.views} views
                </span>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)" }}>
                  <FiCalendar size={10}/>
                  {new Date(video.date).toLocaleDateString("en-US",{ month:"short", year:"numeric" })}
                </span>
              </div>
            </div>

            <motion.span animate={{ x:hov?4:0 }} transition={{ duration:.18 }}
              style={{ color:"var(--accent)", fontSize:18, flexShrink:0, marginTop:2 }}>→</motion.span>
          </div>
        </div>
      </motion.article>
      <AnimatePresence>{modal && <VideoModal video={video} onClose={() => setModal(false)}/>}</AnimatePresence>
    </>
  );
}

function ArticleRow({ post, index, inView }: { post: BlogPost; index: number; inView: boolean }) {
  return (
    <motion.article
      initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ delay:index*.05, duration:.4 }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration:"none", display:"block" }}>
        <div style={{ borderBottom:"1px solid var(--border)", padding:"20px 0", transition:"padding .2s" }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = "10px"}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"}>
          <div style={{ display:"flex", gap:20, alignItems:"flex-start", justifyContent:"space-between" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:7, marginBottom:8, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, background:"rgba(232,168,56,.1)", border:"1px solid rgba(232,168,56,.3)", color:"var(--accent)", padding:"2px 8px", letterSpacing:".1em", textTransform:"uppercase" }}>Article</span>
                <TagChips tags={post.tags}/>
              </div>
              <h3 style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(1rem,1.6vw,1.15rem)", fontWeight:700, color:"var(--text)", lineHeight:1.35, marginBottom:6, transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color="var(--accent)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="var(--text)"}>
                {post.title}
              </h3>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"var(--text-muted)", lineHeight:1.7, maxWidth:580 }}>
                {post.description}
              </p>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, paddingTop:2 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4, justifyContent:"flex-end", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)", marginBottom:4 }}>
                <FiCalendar size={10}/>
                {new Date(post.date).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" })}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4, justifyContent:"flex-end", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--accent)" }}>
                <FiClock size={10}/> {post.readTime}
              </div>
              <div style={{ color:"var(--accent)", fontSize:18, marginTop:8, textAlign:"right" }}>→</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ── Main export ── */
export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:.05 });
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  type Item =
    | { kind:"article"; data:BlogPost; date:string }
    | { kind:"video";   data:typeof youtubeVideos[0]; date:string };

  const all: Item[] = [
    ...posts.map(p => ({ kind:"article" as const, data:p, date:p.date })),
    ...youtubeVideos.map(v => ({ kind:"video" as const, data:v, date:v.date })),
  ].sort((a,b) => new Date(b.date).getTime()-new Date(a.date).getTime());

  const shown = all.filter(item => {
    if (filter==="articles" && item.kind!=="article") return false;
    if (filter==="videos"   && item.kind!=="video")   return false;
    if (search) {
      const q = search.toLowerCase();
      const title = item.data.title.toLowerCase();
      const tags  = item.data.tags.map(t=>t.toLowerCase());
      const desc  = item.kind==="article" ? item.data.description.toLowerCase()
                                          : (item.data as typeof youtubeVideos[0]).description.toLowerCase();
      return title.includes(q)||desc.includes(q)||tags.some(t=>t.includes(q));
    }
    return true;
  });

  const nArticles = all.filter(i=>i.kind==="article").length;
  const nVideos   = all.filter(i=>i.kind==="video").length;

  return (
    <div ref={ref}>
      {/* ── Filter + search bar ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28, flexWrap:"wrap" }}>
        {([["all", `All (${nArticles+nVideos})`], ["articles", `Articles (${nArticles})`], ["videos", `Videos (${nVideos})`]] as [Filter,string][]).map(([f,label]) => (
          <motion.button key={f} onClick={()=>setFilter(f)}
            whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
            style={{ padding:"7px 16px", border:`1px solid ${filter===f?"var(--accent)":"var(--border)"}`, background:filter===f?"rgba(232,168,56,.1)":"transparent", color:filter===f?"var(--accent)":"var(--text-muted)", fontFamily:"'JetBrains Mono',monospace", fontSize:9, cursor:"pointer", letterSpacing:".12em", textTransform:"uppercase", transition:"all .2s" }}>
            {label}
          </motion.button>
        ))}
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search..."
          style={{ marginLeft:"auto", padding:"7px 12px", border:"1px solid var(--border)", background:"var(--surface)", color:"var(--text)", fontFamily:"'JetBrains Mono',monospace", fontSize:10, outline:"none", width:160, transition:"border-color .2s" }}
          onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
          onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"}/>
      </div>

      {/* ── Feed ── */}
      <AnimatePresence mode="popLayout">
        {shown.length===0 ? (
          <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ textAlign:"center", padding:"60px 0", color:"var(--text-muted)", fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>
            No results for &ldquo;{search}&rdquo;
          </motion.div>
        ) : (
          <motion.div key="feed" layout>
            {shown.map((item,i) =>
              item.kind==="article"
                ? <ArticleRow key={item.data.slug} post={item.data} index={i} inView={inView}/>
                : <VideoRow   key={item.data.id}   video={item.data} index={i} inView={inView}/>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer links ── */}
      <div style={{ marginTop:24, paddingTop:16, borderTop:"1px solid var(--border)", display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
        <Link href="https://www.medium.com/@vaibhav.bansal945" target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--accent)", textDecoration:"none", letterSpacing:".1em", textTransform:"uppercase" }}>
          <FiExternalLink size={11}/> All on Medium
        </Link>
        <Link href="https://www.youtube.com/@VaibhavBansalCode" target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#f87171", textDecoration:"none", letterSpacing:".1em", textTransform:"uppercase" }}>
          <FiExternalLink size={11}/> YouTube Channel
        </Link>
        <span style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)" }}>
          {shown.length} item{shown.length!==1?"s":""}
        </span>
      </div>
    </div>
  );
}

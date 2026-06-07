// Server Component — MDXRemote from /rsc requires this
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

const components = {
  h1: (p: any) => <h1 {...p} style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"var(--text)", marginBottom:"1.5rem", lineHeight:1.2 }}/>,
  h2: (p: any) => <h2 {...p} style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:700, color:"var(--text)", marginTop:"2.5rem", marginBottom:"1rem", borderBottom:"1px solid var(--border)", paddingBottom:"0.5rem" }}/>,
  h3: (p: any) => <h3 {...p} style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:700, color:"var(--text)", marginTop:"2rem", marginBottom:"0.75rem" }}/>,
  p:  (p: any) => <p  {...p} style={{ fontFamily:"'Inter',sans-serif", fontSize:"15px", color:"var(--text-muted)", lineHeight:1.8, marginBottom:"1.25rem" }}/>,
  a:  (p: any) => <a  {...p} style={{ color:"#e8a838", textDecoration:"none", borderBottom:"1px solid rgba(232,168,56,.4)" }}/>,
  ul: (p: any) => <ul {...p} style={{ paddingLeft:"1.5rem", marginBottom:"1.25rem", color:"var(--text-muted)", lineHeight:1.8 }}/>,
  ol: (p: any) => <ol {...p} style={{ paddingLeft:"1.5rem", marginBottom:"1.25rem", color:"var(--text-muted)", lineHeight:1.8 }}/>,
  li: (p: any) => <li {...p} style={{ marginBottom:"0.4rem", fontFamily:"'Inter',sans-serif", fontSize:"15px" }}/>,
  strong: (p: any) => <strong {...p} style={{ color:"var(--text)", fontWeight:700 }}/>,
  blockquote: (p: any) => <blockquote {...p} style={{ borderLeft:"3px solid #e8a838", paddingLeft:"1.25rem", margin:"1.5rem 0", color:"var(--text-muted)", fontStyle:"italic" }}/>,
  code: (p: any) => {
    if (p.className) {
      return (
        <pre style={{ background:"#080808", border:"1px solid var(--border)", padding:"1.25rem 1.5rem", overflowX:"auto", marginBottom:"1.5rem" }}>
          <code {...p} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", lineHeight:1.7, color:"#e8a838" }}/>
        </pre>
      );
    }
    return <code {...p} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", background:"rgba(232,168,56,.08)", color:"#e8a838", padding:"2px 6px", border:"1px solid rgba(232,168,56,.2)" }}/>;
  },
  hr: () => <hr style={{ border:"none", borderTop:"1px solid var(--border)", margin:"2.5rem 0" }}/>,
};

export default function BlogPost({ post }: { post: BlogPost }) {
  return (
    <main className="pt-28 pb-24">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <Link href="/blog" style={{ display:"inline-flex", alignItems:"center", gap:6,
          fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--text-muted)",
          textDecoration:"none", letterSpacing:".1em", textTransform:"uppercase",
          transition:"color .2s" }}>
          <FiArrowLeft size={12}/> Back to Blog
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {post.tags.map(t => (
            <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8,
              border:"1px solid rgba(232,168,56,.35)", color:"#e8a838",
              padding:"3px 10px", background:"rgba(232,168,56,.06)", letterSpacing:".12em" }}>
              {t}
            </span>
          ))}
        </div>
        <h1 className="font-display font-extrabold" style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)",
          lineHeight:1.15, marginBottom:16 }}>
          {post.title}
        </h1>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:"var(--text-muted)",
          lineHeight:1.65, marginBottom:20 }}>
          {post.description}
        </p>
        <div style={{ display:"flex", gap:20, alignItems:"center",
          borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)",
          padding:"12px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6,
            fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)" }}>
            <FiCalendar size={11}/>
            {new Date(post.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6,
            fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--text-muted)" }}>
            <FiClock size={11}/> {post.readTime}
          </div>
          <div style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, color:"rgba(232,168,56,.6)" }}>
            Vaibhav Bansal
          </div>
        </div>
      </div>

      {/* Content — rendered server-side via MDXRemote */}
      <div className="max-w-3xl mx-auto px-6">
        <MDXRemote source={post.content} components={components}/>
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-6 mt-16"
        style={{ borderTop:"1px solid var(--border)", paddingTop:24 }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18,
          marginBottom:8 }}>Enjoyed this? Let&apos;s connect.</p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <Link href="/contact" style={{ padding:"9px 20px", background:"#e8a838",
            color:"#0e0e0e", textDecoration:"none", fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase" }}>
            Get in Touch →
          </Link>
          <Link href="/portfolio" style={{ padding:"9px 20px",
            border:"1px solid var(--border)", color:"var(--text-muted)",
            textDecoration:"none", fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, letterSpacing:".12em", textTransform:"uppercase" }}>
            See My Projects
          </Link>
        </div>
      </div>
    </main>
  );
}

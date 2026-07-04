import Link from "next/link";

/** #11 Custom 404 — FRIDAY handles missing routes. */
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] tracking-[.3em] uppercase" style={{ color: "var(--reactor-dim)" }}>
        FRIDAY · ROUTE SCAN COMPLETE
      </p>
      <h1 className="font-display font-extrabold mt-4" style={{ fontSize: "clamp(4rem,14vw,10rem)", lineHeight: .95 }}>
        404
      </h1>
      <p className="mt-4 font-display font-semibold" style={{ fontSize: 18, color: "var(--text)" }}>
        “That route doesn’t exist, boss.”
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)", maxWidth: 420 }}>
        I scanned every endpoint twice. Whatever you were looking for either moved, or never shipped.
      </p>
      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider"
          style={{ padding: "13px 26px", background: "var(--accent)", color: "var(--bg)", textDecoration: "none", fontWeight: 700 }}>
          Take me home
        </Link>
        <Link href="/terminal" className="font-mono text-xs uppercase tracking-wider"
          style={{ padding: "13px 26px", border: "1px solid var(--border-bright)", color: "var(--text-muted)", textDecoration: "none" }}>
          Open terminal
        </Link>
      </div>
    </main>
  );
}

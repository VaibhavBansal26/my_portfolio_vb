"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { projects, experience, stats, personal, skills } from "@/data/portfolio";

/**
 * #23(11) Terminal mode — the whole portfolio as a TUI.
 * friday ls projects · friday cat resume · friday ask "…"
 */
type Line = { text: string; color?: string };

const HELP = [
  "FRIDAY shell — available commands:",
  "  help                 this screen",
  "  ls projects          list all projects",
  "  open <project-id>    open a project page",
  "  cat resume           print career summary",
  "  cat skills           print the stack",
  "  stats                key numbers",
  "  contact              how to reach Vaibhav",
  "  ask <question>       ask FRIDAY (live AI)",
  "  tour                 go home and let FRIDAY drive",
  "  exit                 back to the GUI",
];

export default function TerminalApp() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { text: "F.R.I.D.A.Y. shell v2.0 — type `help` to begin", color: "#4fd8eb" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const print = (xs: (string | Line)[]) =>
    setLines(p => [...p, ...xs.map(x => typeof x === "string" ? { text: x } : x)]);

  const run = async (raw: string) => {
    const cmd = raw.trim().replace(/^friday\s+/, "");
    print([{ text: `$ ${raw}`, color: "#e8a838" }]);
    if (!cmd) return;
    const [verb, ...rest] = cmd.split(" ");
    const arg = rest.join(" ");

    switch (verb) {
      case "help": print(HELP); break;
      case "ls":
        print(projects.filter(p => p.featured).map(p =>
          ({ text: `  ${p.id.padEnd(26)} ${p.category ?? ""}`, color: "#d6d0c4" })));
        print(["  …full archive at /portfolio"]);
        break;
      case "open": {
        const p = projects.find(p => p.id === arg);
        if (p) { print([`opening ${arg}…`]); router.push(`/projects/${arg}`); }
        else print([{ text: `no such project: ${arg} (try \`ls projects\`)`, color: "#ff6b6b" }]);
        break;
      }
      case "cat":
        if (arg === "resume") {
          print(experience.map(e => ({ text: `  [${e.period}] ${e.role} @ ${e.company}`, color: "#d6d0c4" })));
          print(["  full version: /resume"]);
        } else if (arg === "skills") {
          print(Object.entries(skills).map(([k, v]) =>
            ({ text: `  ${k}: ${(v as string[]).slice(0, 8).join(", ")}`, color: "#d6d0c4" })));
        } else print([{ text: `cat: ${arg}: no such file`, color: "#ff6b6b" }]);
        break;
      case "stats":
        print(stats.map(s => ({ text: `  ${s.label.padEnd(20)} ${s.value}+`, color: "#34d399" })));
        break;
      case "contact":
        print([`  email:    ${personal.email}`, `  linkedin: ${personal.linkedin}`, "  or just: /contact"]);
        break;
      case "tour":
        router.push("/");
        setTimeout(() => window.dispatchEvent(new CustomEvent("vb-tour-start")), 1200);
        break;
      case "ask": {
        if (!arg) { print(["usage: ask <question>"]); break; }
        setBusy(true);
        try {
          const res = await fetch("/api/chat", { method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: arg }] }) });
          const data = await res.json();
          print([{ text: `FRIDAY: ${data.reply ?? data.message ?? "…no response, boss."}`, color: "#4fd8eb" }]);
        } catch { print([{ text: "FRIDAY: connection error.", color: "#ff6b6b" }]); }
        setBusy(false);
        break;
      }
      case "exit": router.push("/"); break;
      case "clear": setLines([]); break;
      default:
        print([{ text: `command not found: ${verb} — try \`help\``, color: "#ff6b6b" }]);
    }
  };

  return (
    <main className="min-h-screen px-4 py-24 flex justify-center" onClick={() => inputRef.current?.focus()}>
      <div className="w-full max-w-3xl font-mono" style={{ fontSize: 13, lineHeight: 1.9 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.color ?? "var(--text-muted)", whiteSpace: "pre-wrap" }}>{l.text}</div>
        ))}
        <div className="flex items-center gap-2">
          <span style={{ color: "#e8a838" }}>$</span>
          <input ref={inputRef} value={input} disabled={busy}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && input.trim()) { run(input); setInput(""); } }}
            className="flex-1 bg-transparent outline-none border-none"
            style={{ color: "var(--text)", fontFamily: "inherit", fontSize: "inherit", caretColor: "#4fd8eb" }}
            aria-label="terminal input" autoComplete="off" spellCheck={false} />
          {busy && <span style={{ color: "var(--reactor-dim)" }}>thinking…</span>}
        </div>
        <div ref={bottomRef} />
      </div>
    </main>
  );
}

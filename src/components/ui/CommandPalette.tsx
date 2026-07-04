"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { setPersona } from "@/components/ui/PersonaPicker";

/**
 * #2 ⌘K — the FRIDAY console. Navigate, switch themes/personas,
 * launch tour/simulation/terminal, toggle UI sounds.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = useCallback((fn: () => void) => { fn(); setOpen(false); }, []);
  const fire = (name: string) => window.dispatchEvent(new CustomEvent(name));

  if (!open) return null;
  return (
    <div onClick={() => setOpen(false)}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "18vh" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(560px, calc(100vw - 32px))" }}>
        <Command label="FRIDAY console"
          style={{ background: "rgba(12,13,15,.97)", border: "1px solid var(--hud-line)",
            boxShadow: "0 40px 120px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div className="flex items-center gap-2 px-4 pt-3 font-mono text-[9px] tracking-[.25em] uppercase"
            style={{ color: "var(--reactor-dim)" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--reactor)" }} />
            FRIDAY CONSOLE — ⌘K
          </div>
          <Command.Input autoFocus placeholder="Type a command…" className="font-mono"
            style={{ width: "100%", padding: "14px 16px", background: "transparent", border: "none",
              outline: "none", color: "var(--text)", fontSize: 14, borderBottom: "1px solid var(--border)" }} />
          <Command.List style={{ maxHeight: 320, overflow: "auto", padding: 8 }}>
            <Command.Empty className="font-mono text-xs p-4" style={{ color: "var(--text-muted)" }}>
              No protocol found for that, boss.
            </Command.Empty>

            <Command.Group heading="Navigate" className="vb-cmd-group">
              {[["Home","/"],["About","/about"],["Portfolio","/portfolio"],["Resume","/resume"],["Blog","/blog"],["Contact","/contact"],["Terminal mode","/terminal"]].map(([l,h]) => (
                <Command.Item key={h} className="vb-cmd-item" onSelect={() => run(() => router.push(h))}>{l}</Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="FRIDAY" className="vb-cmd-group">
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => fire("vb-tour-start"))}>Let FRIDAY drive (guided tour)</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => fire("vb-sim-start"))}>Run career.sim</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => fire("vb-chat-open"))}>Ask FRIDAY a question</Command.Item>
            </Command.Group>

            <Command.Group heading="Adapt" className="vb-cmd-group">
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => setTheme("dark"))}>Theme: dark</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => setTheme("light"))}>Theme: light (paper)</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => setPersona("recruiter"))}>Mode: recruiter</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => setPersona("engineer"))}>Mode: engineer</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => setPersona("browsing"))}>Mode: visitor</Command.Item>
              <Command.Item className="vb-cmd-item" onSelect={() => run(() => fire("vb-ticks-toggle"))}>Toggle UI sounds</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

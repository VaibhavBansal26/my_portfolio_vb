"use client";
import { useState, useEffect } from "react";
import { getPersona, PERSONA_EVENT, type Persona } from "@/components/ui/PersonaPicker";

type SlotKey = "bento" | "projects" | "graph" | "city" | "npm" | "skills" | "research" | "times" | "game";

/** Visual order per persona — DOM order (and SEO) never changes, only CSS order. */
const ORDERS: Record<Persona, SlotKey[]> = {
  browsing:  ["bento", "projects", "city", "npm", "skills", "graph", "research", "times", "game"],
  recruiter: ["bento", "times", "research", "projects", "city", "skills", "graph", "npm", "game"],
  engineer:  ["projects", "graph", "npm", "skills", "city", "bento", "research", "times", "game"],
};

/**
 * FRIDAY · Adaptive homepage — server-rendered children, client-reordered
 * via flex `order`, so personalization costs zero SEO and zero hydration.
 */
export default function HomeFlow({ slots }: { slots: Record<SlotKey, React.ReactNode> }) {
  const [persona, setPersonaState] = useState<Persona>("browsing");

  useEffect(() => {
    setPersonaState(getPersona() ?? "browsing");
    const onChange = (e: Event) => setPersonaState((e as CustomEvent).detail as Persona);
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => window.removeEventListener(PERSONA_EVENT, onChange);
  }, []);

  const order = ORDERS[persona] ?? ORDERS.browsing;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {(Object.keys(slots) as SlotKey[]).map(key => (
        <div key={key} id={`vb-stop-${key}`} style={{ order: order.indexOf(key) + 1 }}>
          {slots[key]}
        </div>
      ))}
    </div>
  );
}

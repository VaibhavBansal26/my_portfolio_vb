"use client";
import { useState, useEffect } from "react";
import { getPersona, PERSONA_EVENT, type Persona } from "@/components/ui/PersonaPicker";

/** Subscribe to the visitor's FRIDAY persona anywhere. */
export function usePersona(): Persona {
  const [persona, setPersona] = useState<Persona>("browsing");
  useEffect(() => {
    setPersona(getPersona() ?? "browsing");
    const onChange = (e: Event) => setPersona((e as CustomEvent).detail as Persona);
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => window.removeEventListener(PERSONA_EVENT, onChange);
  }, []);
  return persona;
}

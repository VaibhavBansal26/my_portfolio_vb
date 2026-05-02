"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveDot = (e: MouseEvent) => setDot({ x: e.clientX, y: e.clientY });
    let timeout: ReturnType<typeof setTimeout>;
    const moveRing = (e: MouseEvent) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setRing({ x: e.clientX, y: e.clientY }), 70);
    };
    window.addEventListener("mousemove", moveDot);
    window.addEventListener("mousemove", moveRing);
    return () => {
      window.removeEventListener("mousemove", moveDot);
      window.removeEventListener("mousemove", moveRing);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div
        className="custom-cursor hidden md:block"
        style={{ left: dot.x - 4, top: dot.y - 4 }}
      />
      <div
        className="cursor-ring hidden md:block"
        style={{ left: ring.x - 16, top: ring.y - 16 }}
      />
    </>
  );
}

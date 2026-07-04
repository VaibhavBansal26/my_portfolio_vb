"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&▮▯/<>+=";

/**
 * FRIDAY · Decrypt effect — text scrambles from random glyphs to the
 * final string when it scrolls into view. Skipped for reduced motion.
 */
export default function ScrambleText({
  text,
  className,
  style,
  speed = 28,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const [display, setDisplay] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const total = text.length * 3;
    const id = setInterval(() => {
      frame++;
      const fixed = Math.floor((frame / total) * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " " || i < fixed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (frame >= total) { setDisplay(text); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      {display}
    </span>
  );
}

"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const PHOTOS = [
  {
    id: "times-square",
    src: "/photos/img_0159.jpg",
    emoji: "🌃",
    label: "Times Square",
    date: "NYC · Winter nights",
    color: "#0a1828",
    defaultRot: -8,
  },
  {
    id: "graduation",
    src: "/photos/img_0788.jpg",
    emoji: "🎓",
    label: "Graduation Day",
    date: "SUNY Buffalo · 2025",
    color: "#1a0e00",
    defaultRot: 5,
  },
  {
    id: "liberty",
    src: "/photos/img_0375.jpg",
    emoji: "🗽",
    label: "Liberty Island",
    date: "New York Harbor",
    color: "#081420",
    defaultRot: -3,
  },
  {
    id: "brooklyn-bridge",
    src: "/photos/img_0409.jpg",
    emoji: "🌉",
    label: "Brooklyn Bridge",
    date: "Manhattan skyline",
    color: "#0a0820",
    defaultRot: 9,
  },
  {
    id: "niagara",
    src: "/photos/img_1183.jpg",
    emoji: "💦",
    label: "Niagara Falls",
    date: "Night illumination",
    color: "#1a0800",
    defaultRot: -6,
  },
  {
    id: "central-park",
    src: "/photos/img_0244.jpg",
    emoji: "🌆",
    label: "Central Park",
    date: "NYC · After dark",
    color: "#041018",
    defaultRot: 3,
  },
  {
    id: "lockwood",
    src: "/photos/img_4321.jpg",
    emoji: "🏛️",
    label: "Lockwood Library",
    date: "UB · Buffalo",
    color: "#101418",
    defaultRot: -5,
  },
  {
    id: "festival",
    src: "/photos/img_0325.jpg",
    emoji: "🪔",
    label: "Festival Night",
    date: "Buffalo, NY",
    color: "#140c04",
    defaultRot: 7,
  },
  {
    id: "suited-up",
    src: "/photos/img_0745.jpg",
    emoji: "🤵",
    label: "Suited Up",
    date: "Big-day energy",
    color: "#0c0c10",
    defaultRot: -4,
  },
  {
    id: "official",
    src: "/photos/img_0710.jpg",
    emoji: "👔",
    label: "Officially Official",
    date: "Suit & tie",
    color: "#12100c",
    defaultRot: 6,
  },
  {
    id: "coffee-face",
    src: "/photos/img_1484.jpg",
    emoji: "⚡",
    label: "Game Face",
    date: "Ready to ship",
    color: "#0e0a12",
    defaultRot: -7,
  },
  {
    id: "game-day",
    src: "/photos/img_1001.jpg",
    emoji: "⚡",
    label: "Game Day",
    date: "Ready to ship",
    color: "#0e0a12",
    defaultRot: -7,
  },
];

type Photo = typeof PHOTOS[0] & { rot: number; x: number; y: number; z: number };

function PolaroidCard({
  photo, index, total, fanned, containerWidth,
  onDragStart, onDragEnd,
}: {
  photo: Photo; index: number; total: number; fanned: boolean;
  containerWidth: number; onDragStart: () => void; onDragEnd: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fanX = fanned
    ? (() => {
        const spacing = Math.min(170, (containerWidth - 180) / (total - 1));
        const startX = (containerWidth - spacing * (total - 1) - 160) / 2;
        return startX + index * spacing;
      })()
    : containerWidth / 2 - 80;

  const fanY = fanned ? 20 : 10 + index * 1.5;
  const fanRot = fanned ? photo.rot * 0.25 : photo.rot;
  const fanZ = fanned ? index + 1 : total - index;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => { setIsDragging(true); onDragStart(); }}
      onDragEnd={() => { setIsDragging(false); onDragEnd(); }}
      animate={{
        left: fanX,
        top: fanY,
        rotate: fanRot,
        zIndex: isDragging ? 50 : fanZ,
        scale: isDragging ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: fanned ? index * 0.04 : 0 }}
      whileHover={{ scale: isDragging ? 1.08 : 1.04 }}
      style={{
        position: "absolute", width: 160, height: 210,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        filter: isDragging ? "drop-shadow(0 20px 40px rgba(0,0,0,.8))" : "drop-shadow(0 8px 24px rgba(0,0,0,.5))",
      }}>
      {/* Polaroid frame */}
      <div style={{
        width: "100%", height: "100%", background: "#f5f0e8",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Photo area */}
        <div style={{ flex: 1, overflow: "hidden", margin: "8px 8px 0", position: "relative" }}>
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo.src} alt={photo.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Placeholder when no real photo */
            <div style={{
              width: "100%", height: "100%", background: photo.color,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <span style={{ fontSize: 32 }}>{photo.emoji}</span>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 7,
                color: "rgba(232,168,56,.5)", letterSpacing: ".1em", textTransform: "uppercase",
              }}>
                add photo →<br/>
                <span style={{ color: "rgba(255,255,255,.2)" }}>public/photos/{photo.id}.jpg</span>
              </span>
            </div>
          )}
        </div>
        {/* Caption strip */}
        <div style={{ padding: "8px 10px 10px", background: "#f5f0e8" }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700,
            color: "#1a1510", lineHeight: 1.2,
          }}>{photo.label}</div>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 8,
            color: "#8a7a68", marginTop: 3,
          }}>{photo.date}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PhotoStack() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [fanned, setFanned] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);
  const [anyDragging, setAnyDragging] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>(
    PHOTOS.map(p => ({ ...p, rot: p.defaultRot, x: 0, y: 0, z: 1 }))
  );

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Auto-fan on scroll into view
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => {
        setFanned(true);
        setTimeout(() => setFanned(false), 2200);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const shuffle = () => {
    setFanned(false);
    setPhotos(prev =>
      [...prev].sort(() => Math.random() - 0.5).map(p => ({
        ...p, rot: (Math.random() - 0.5) * 18,
      }))
    );
  };

  return (
    <div ref={ref} className="py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .5 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <span className="section-label">Moments</span>
            <h2 className="font-display font-extrabold mt-2"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
              Beyond the{" "}
              <span style={{
                background: "linear-gradient(120deg,var(--hard-accent,#e8a838),var(--hard-accent-2,#f4c96a))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Code
              </span>
            </h2>
            <p className="font-mono text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              drag · fan · shuffle
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
              onClick={() => setFanned(f => !f)}
              style={{
                padding: "8px 18px", border: `1px solid ${fanned ? "rgba(232,168,56,.5)" : "var(--border)"}`,
                background: fanned ? "rgba(232,168,56,.08)" : "transparent",
                color: fanned ? "#e8a838" : "var(--text-muted)",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                cursor: "pointer", letterSpacing: ".12em", textTransform: "uppercase", transition: "all .2s",
              }}>
              {fanned ? "Stack" : "Fan Out"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
              onClick={shuffle}
              style={{
                padding: "8px 18px", border: "1px solid var(--border)",
                background: "transparent", color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                cursor: "pointer", letterSpacing: ".12em", textTransform: "uppercase",
              }}>
              Shuffle ↺
            </motion.button>
          </div>
        </motion.div>

        {/* Stack container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: .6, delay: .2 }}
          style={{
            position: "relative", height: 280,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            overflow: "hidden",
          }}
          onMouseEnter={() => !anyDragging && setFanned(true)}
          onMouseLeave={() => !anyDragging && setFanned(false)}>

          {/* Amber grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(232,168,56,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,168,56,.03) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}/>

          {/* Hint text */}
          <AnimatePresence>
            {!fanned && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", bottom: 16, left: 0, right: 0,
                  textAlign: "center", fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 8, color: "rgba(232,168,56,.3)", letterSpacing: ".2em",
                  textTransform: "uppercase", pointerEvents: "none", zIndex: 0,
                }}>
                hover to fan · drag to rearrange
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards */}
          {photos.map((photo, i) => (
            <PolaroidCard
              key={photo.id}
              photo={photo}
              index={i}
              total={photos.length}
              fanned={fanned}
              containerWidth={containerWidth}
              onDragStart={() => setAnyDragging(true)}
              onDragEnd={() => setTimeout(() => setAnyDragging(false), 100)}
            />
          ))}
        </motion.div>

        {/* Photo list hint */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: .6 }}
          style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PHOTOS.map(p => (
            <span key={p.id} style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 8,
              border: "1px solid var(--border)", color: "var(--text-muted)",
              padding: "3px 10px", letterSpacing: ".08em",
            }}>
              {p.emoji} {p.label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

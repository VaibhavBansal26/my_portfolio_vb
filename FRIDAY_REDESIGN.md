# FRIDAY Protocol — Portfolio Redesign Plan
**Repo:** `my_portfolio_vb` · Next.js 14 · Tailwind · Framer Motion · React Three Fiber
**Theme:** AI × FRIDAY (Iron Man) — a living HUD interface, not just a website.

---

## 1. Audit — what you have vs. what's missing

**Already strong:** EDITH boot loader, voice chatbot, WebGL fluid hero shader, particle network, custom cursor, 3 themes, easter eggs, MDX blog, mini game, Times Square section.

**Gaps found in the code:**

| Gap | Evidence |
|---|---|
| **No scroll-linked animation at all** | Zero usages of `useScroll`, `useTransform`, `whileInView`, GSAP, or Lenis in `src/` |
| No smooth scrolling | Only CSS `scroll-behavior: smooth` |
| Boot loader is EDITH, voice is "EDITH" | Theme says FRIDAY — inconsistent identity |
| Accent is gold only | FRIDAY's UI is gold **+ arc-reactor cyan**; you're missing the signature glow |
| Heavy hero (WebGL + particle canvas + R3F all mounted) | Two canvases + shader running simultaneously, no `prefers-reduced-motion` checks |
| O(n²) particle loop (80² = 6,400 distance checks/frame) | `ParticleCanvas` in HeroSection |
| Sections appear instantly, no choreography | `page.tsx` just stacks components |
| Three themes but no "FRIDAY mode" | dark/light/purple |

---

## 2. Design system: the FRIDAY HUD language

Make the whole site feel like Tony's lab UI booting around the visitor.

### 2.1 Color — add the arc reactor

Keep gold as primary, add cyan as the "system intelligence" color:

```css
:root, html.dark {
  --accent:        #e8a838;            /* gold — human/content */
  --reactor:       #4fd8eb;            /* arc-reactor cyan — AI/system */
  --reactor-dim:   rgba(79,216,235,.35);
  --hud-line:      rgba(79,216,235,.15);
  --danger:        #ff5252;            /* alerts, hover-destructive */
  --hologram:      rgba(79,216,235,.07);
}
```

Rule of use: **content is gold, system chrome is cyan.** Headings, CTAs, links = gold. HUD frames, scan lines, the chatbot, boot loader, cursor, data readouts = cyan. The two-tone split is what makes it read as "FRIDAY" instead of generic dark portfolio.

### 2.2 HUD framing motifs

- **Corner brackets** on every card instead of plain borders — four small `└ ┘ ┌ ┐` strokes that *draw themselves in* when the card scrolls into view (SVG `stroke-dashoffset` animation).
- **Reticle/target rings** behind section numbers ("01 / PROJECTS") — thin rotating dashed circles, `animation: spin 40s linear infinite`.
- **Data readout labels**: tiny mono captions on cards like `PRJ-003 · STATUS: DEPLOYED · CONF: 98.2%` — fake telemetry sells the HUD.
- **Scan line sweep**: a 1px horizontal cyan line that sweeps down a card once on hover (`background: linear-gradient` + keyframe).
- **Grid floor**: faint perspective grid at the bottom of the hero, like a hologram table.

### 2.3 Typography

Syne + JetBrains Mono is good. Push the mono harder: ALL system-chrome text (labels, telemetry, nav numbering, footer) in mono with `letter-spacing: 0.25em`. Consider **Rajdhani** or **Orbitron** *only* for big numeric readouts (stats counters) — sparingly, it gets cheesy fast.

### 2.4 Rebrand EDITH → FRIDAY

- Boot loader: `F.R.I.D.A.Y. v2.0 — "Female Replacement Intelligent Digital Assistant Youth"`, cyan text, and end with `"All wrapped up here, boss."`
- Chatbot: rename to FRIDAY, Irish female voice if available (`speechSynthesis` voices include `en-IE`), greeting: *"Hi, I'm FRIDAY. Ask me anything about Vaibhav."*
- Add a persistent tiny FRIDAY status chip in the navbar: a pulsing cyan dot + `FRIDAY: ONLINE` that opens the chatbot.

---

## 3. Scroll animations — the core upgrade

### 3.1 Foundation: Lenis + Framer Motion

You already ship framer-motion, so use it for scroll (no need for GSAP unless you want pinning — see 3.4). Add **Lenis** for inertia smooth-scroll; it's what every awwwards site uses:

```bash
npm i lenis
```

```tsx
// components/ui/SmoothScroll.tsx
"use client";
import { ReactLenis } from "lenis/react";
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }}>{children}</ReactLenis>;
}
// wrap children in layout.tsx
```

### 3.2 Section reveal choreography (use everywhere)

Replace mount-only animations with a reusable in-view reveal:

```tsx
// components/ui/Reveal.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
```

The `blur(6px) → 0` is the "hologram materializing" effect — it's subtle and *very* on-theme. Stagger children with `delay={i * 0.08}`.

### 3.3 Per-section scroll treatments

**Hero — parallax + dissolve on exit:**
```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
const y       = useTransform(scrollYProgress, [0, 1], [0, 180]);   // bg moves slower
const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
// apply y to the WebGL canvas wrapper, opacity+scale to the headline block
```
Also: drive the shader's `t` uniform partially from scroll position so the fluid *responds* to scrolling.

**Stats — counters trigger on view + a cyan "scan" sweeps across as numbers count.** You have react-countup; gate it with `react-intersection-observer` (already installed) so it fires in view, not on mount.

**Featured projects — horizontal scroll-jack section.** Pin the section, translate cards horizontally as user scrolls vertically:
```tsx
const { scrollYProgress } = useScroll({ target: ref });
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);
// <section style={{height: "300vh"}}> <div sticky top-0> <motion.div style={{x}}>cards
```
Each card gets the corner-bracket draw-in + telemetry label typing on as it enters center.

**Skills — orbit acceleration.** Tie SkillSphere rotation speed to scroll velocity (`useVelocity(scrollY)`), so flicking the page spins the sphere. Tactile and free.

**Experience timeline — the "power line."** A vertical cyan line whose `scaleY` is bound to section scroll progress, with nodes that ignite (glow pulse) as the line reaches them:
```tsx
const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
<motion.div style={{ scaleY: lineScale, transformOrigin: "top" }} className="timeline-beam" />
```

**Section transitions — HUD wipe.** Between major sections, a full-width 1px cyan line with a small `▸ SECTION 02 — LOADED` mono label that draws across as you cross the boundary.

**Text — decrypt/scramble on view.** Headings scramble from random glyphs to final text when scrolled into view (the classic FRIDAY/terminal effect). ~30 lines of code with an interval swapping chars, or use `use-scramble`.

### 3.4 If you want the cinematic tier: GSAP ScrollTrigger

For one signature moment, add GSAP + ScrollTrigger and build an **"arc reactor assembly" scroll sequence**: as the user scrolls through About, SVG rings of a reactor draw in, align, and ignite, ending with your avatar in the core. Pinned section, `scrub: 1`. One scene like this is what people remember and share.

### 3.5 Polish layer

- **Page transitions**: upgrade `PageTransition` to a HUD shutter — two cyan-edged panels close over the page, a mono `ROUTING → /projects` label flashes, panels open. Framer Motion `AnimatePresence` mode="wait".
- **Scroll progress**: replace the plain bar with a circular reactor gauge bottom-right that fills + glows; on 100% it pulses once.
- **Cursor**: current dot+ring is good — add states: ring expands into a reticle (with crosshair ticks) over clickable elements, and shows tiny mono labels like `OPEN` / `VIEW` / `PLAY`.
- **Magnetic buttons**: CTA buttons attract the cursor within 60px (translate toward pointer, spring back).
- **prefers-reduced-motion**: gate ALL of the above with `useReducedMotion()` — currently nothing checks it.

---

## 4. Other upgrades to make it best-in-class

### Experience
1. **Command palette (⌘K)** — the single highest-value addition. Navigate, toggle themes, trigger easter eggs, ask FRIDAY — all from a keyboard HUD. Use `cmdk`. Style it as a FRIDAY console with mono telemetry.
2. **FRIDAY theme as a 4th theme** — full cyan-dominant holographic mode (you have the theme infra already). Make it the easter-egg reward instead of always-on.
3. **Live "system status" footer strip** — real data via your existing API routes: latest GitHub commit, LeetCode streak, npm weekly downloads, visitor's local time vs. yours. Auto-refreshing mono ticker = the site feels *alive*, which is the whole AI premise.
4. **Project case studies with scroll-driven storytelling** — problem → architecture diagram (animated SVG draw-in) → result metrics (count up). Recruiters spend 80% of time here; it deserves the animation budget more than the hero.
5. **Konami-style voice easter egg** — saying "Hey FRIDAY" (you already have mic permission flows) wakes the chatbot with a wake-word chime.

### Performance (matters for "best ever")
6. **Pause canvases off-screen** — both hero canvases run forever. Use IntersectionObserver to `cancelAnimationFrame` when hero isn't visible.
7. **Fix O(n²) particles** — spatial-hash the grid or cap line checks; or replace the 2D particle canvas entirely since the WebGL shader already gives ambiance (two background canvases is one too many).
8. **`dynamic()` + `ssr:false` the WebGL hero**, render a static gradient poster first paint → better LCP.
9. **Cap shader resolution** at `devicePixelRatio: 1` and ~30fps on mobile.

### Credibility/SEO
10. Add `JSON-LD` `Person` + `CreativeWork` schema for projects (you have SEO_GUIDE.md — finish the job).
11. OG images per project/blog post via `@vercel/og` — auto-generated HUD-styled cards.
12. A `/uses` or `/now` page — high-signal for recruiters, cheap to build from `portfolio.ts`.

---

## 5. Prioritized roadmap

| Phase | Work | Effort | Impact |
|---|---|---|---|
| 1 | Lenis + `Reveal` (blur-materialize) on all sections, in-view counters, reduced-motion gates | 1 day | ★★★★★ |
| 2 | Hero parallax/exit, timeline power-line, corner-bracket cards, scramble headings | 1–2 days | ★★★★★ |
| 3 | EDITH→FRIDAY rebrand, cyan system color, HUD shutter page transitions, reactor scroll gauge | 1 day | ★★★★ |
| 4 | ⌘K palette, live status ticker, horizontal projects scroll | 2 days | ★★★★ |
| 5 | GSAP arc-reactor pinned scene, scroll-driven case studies | 2–3 days | ★★★ (signature) |
| 6 | Perf pass: canvas pausing, particle fix, LCP poster | ½ day | ★★★ |

**Golden rule:** scroll effects should *reveal* (once, then settle) — reserve continuous scrubbing for the 2–3 signature moments. A HUD that never stops moving reads as noise; FRIDAY is calm until needed.

# Design QA

## Evidence

- Source visual truth:
  - `/Users/vaibhavbansal/.codex/generated_images/019f333d-7e35-7042-8c4e-a702adf0e461/call_1ozZHQTEin0I2NlQ4UR6u7Rh.png`
  - `/Users/vaibhavbansal/.codex/generated_images/019f333d-7e35-7042-8c4e-a702adf0e461/call_YjF6JhKbqQEBjLw9zc6kchTe.png`
  - `/Users/vaibhavbansal/.codex/generated_images/019f333d-7e35-7042-8c4e-a702adf0e461/call_0pY01mv2QWfp3dSbBWXN6Abj.png`
  - `/Users/vaibhavbansal/.codex/generated_images/019f333d-7e35-7042-8c4e-a702adf0e461/call_fWG6aYbcXoFb8LhTu5eGJ01C.png`
  - `/Users/vaibhavbansal/.codex/generated_images/019f333d-7e35-7042-8c4e-a702adf0e461/call_fS7knpnf4zxpvnQtpDjvJXs7.png`
- Implementation screenshots:
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-default.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-chooser.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-final-armor-art.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-scroll.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-mobile-chooser.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa/ironman-top.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa/ironman-front-scroll.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa/ironman-resume-launch.png`
- Combined full-view comparison:
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa-final-comparison.png`
  - `/Users/vaibhavbansal/Documents/Codex/2026-07-05/can-you-improve-my-website-design/work/qa/ironman-comparison.png`
- Viewports: 1280 × 720 desktop; 390 × 844 mobile.
- States: default theme, closed chooser, open chooser, Kingdoms, Armor Protocol, scrolled content, mobile chooser.

## Full-view comparison

The implementation intentionally preserves the existing portfolio layout while applying the selected concepts as switchable atmosphere layers. It carries over the references' dark cinematic balance, edge-framed scene art, cyan system chrome, amber primary actions, and compact atmosphere control. The content remains more prominent than the decorations, matching the user's correction that the chooser and themes should not consume portfolio space.

## Focused region comparison

The atmosphere chooser was checked at desktop and mobile sizes. Desktop uses a two-column grid in a contained modal; mobile uses a single-column scrollable sheet. The control closes after selection, supports backdrop dismissal and Escape, exposes a dialog label, and marks the selected theme with `aria-pressed`.

The Armor Protocol transition was compared in one 2 × 2 board: side-pose source vs. page-top render, and front-pose source vs. scrolled render. The suit remains integrated into the same workshop scene; scroll changes pose through a soft crossfade rather than exposing a rectangular mask. A focused screenshot also verifies the `ironman` keyboard sequence launches the résumé panel and its `/resume` action.

## Required fidelity surfaces

- Fonts and typography: existing Clash Display, Inter, and JetBrains Mono hierarchy remains readable and consistent. Theme UI uses the same type system.
- Spacing and layout rhythm: the navbar gains one compact pill; theme options do not occupy the page when closed. Modal spacing and mobile stacking are consistent.
- Colors and visual tokens: all seven modes define complete surface, text, border, accent, reactor, and overlay tokens.
- Image quality and asset fidelity: dedicated 1920 × 1080 WebP scenes provide real theme imagery. The Armor Protocol uses two matched poses with consistent crop, lighting, workshop background, and edge placement.
- Copy and content: portfolio copy and navigation remain unchanged; atmosphere names and descriptions accurately identify each mode.

## Findings

No actionable P0, P1, or P2 issues remain.

The latest Armor Protocol balance pass was checked at 1280 × 720 on the home hero and scrolled knowledge-graph states. The opening side pose is clearly visible, the later front-facing helmet remains in frame, and portfolio controls stay above the suit layer.

## Patches made

- Replaced the always-visible theme switcher with a single click-to-open atmosphere control.
- Added Default, Light, Director's Cut, Portal Chapters, Kingdoms, Armor Protocol, and Neural Field.
- Separated powered-armor and AI themes.
- Added generated, optimized scene artwork and scroll-linked parallax movement.
- Increased theme distinction while preserving text contrast.
- Added mobile modal layout, keyboard dismissal, selected state, and reduced-motion compatibility.
- Added `skipBoot=1` as a local visual-QA aid without changing normal startup behavior.
- Replaced the rectangular Armor Protocol staged reveal with a matched side-to-front pose crossfade in the same scene.
- Added a generated front-facing suit frame, scroll-linked opacity handoff, and restrained shared translation/scale.
- Added the hidden `ironman` keyboard sequence, which shoots a résumé card onto the screen with a direct `/resume` action and Escape/backdrop dismissal.
- Restored the original foreground layering for Studio, Arcane, Kingdoms, and Neural Field.
- Scoped the behind-content treatment to Armor Protocol only (`.theme-decor--ironman`).
- Restored the full scene crop and raised suit brightness/opacity so the opening side pose and later helmet are both legible.
- Kept a left-side transparency mask so the suit remains vivid at the edge without washing over portfolio copy.
- Re-tuned the side/front handoff over a wider scroll interval and spring-smoothed both opacity tracks.
- Added 15 animated snowflake icons to Kingdoms and 7 floating candle-flame icons to Portal Chapters.
- Reduced the effect count on mobile and disabled continuous movement when reduced motion is requested.
- Verified Armor Protocol at top and 51% scroll, confirmed Kingdoms returned to `z-index: 3`, production build passed, and no Next.js error overlay appeared.

## Follow-up polish

- P3: The existing persona picker and FRIDAY floating controls remain visually dense at small desktop heights; they predate this theme work and can be simplified in a later pass.
- P3: Existing metadata warnings recommend moving `themeColor` and `colorScheme` to a viewport export.

final result: passed

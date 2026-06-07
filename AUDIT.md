# Portfolio Audit Report
**Repo:** `my_portfolio_vb` — Next.js 14.2.5 + TypeScript  
**Date:** June 2026

---

## ✅ Fixes Applied This Session

| Issue | Fix |
|-------|-----|
| `InlineMiniGame.tsx` — 11× TS18047 `ctx` null errors | Cast `getContext("2d")` as `CanvasRenderingContext2D` |
| `next.config.mjs` — unrecognized `turbopack` key warning | Removed the key entirely |
| All below-fold sections in `page.tsx` — blocking initial bundle | Converted to `dynamic()` lazy imports |
| `BlogList.tsx` — raw `<img>` for YouTube thumbnails | Replaced with `next/image` (+ added `i.ytimg.com` to image domains) |
| `next.config.mjs` — missing security headers | Added X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy |
| `next.config.mjs` — missing compression / AVIF/WebP | Added `compress: true`, `formats: ['image/avif','image/webp']` |
| `next.config.mjs` — missing `output: 'standalone'` | Added (required for Hostinger Node.js hosting) |

---

## 🔴 Critical — Needs Manual Action

### 1. Missing icon files (will cause 404s and broken PWA)
`layout.tsx` and `manifest.json` reference these files — none exist in `/public/`:

```
/public/favicon.ico
/public/icon-16.png
/public/icon-32.png
/public/icon-192.png
/public/icon-512.png
/public/apple-touch-icon.png
/public/og-image.png   ← only og-image.svg exists; OG protocol needs PNG
```

**Fix:** Create these images. Minimum viable:
- Use [RealFaviconGenerator](https://realfavicongenerator.net) — upload a 512×512 logo → downloads a ZIP with all sizes
- Export your `og-image.svg` as 1200×630 PNG via Figma, Inkscape, or any image tool

### 2. Google Search Console verification placeholder
`layout.tsx` line 175:
```ts
google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE",
```
Replace with your actual GSC property verification code from [search.google.com/search-console](https://search.google.com/search-console).

### 3. YouTube video IDs
`src/data/portfolio.ts` still has `REPLACE_WITH_VIDEO_ID_X` placeholders.  
Replace with real YouTube video IDs or remove those entries.

### 4. BASE_URL still points to old domain
`layout.tsx` line 20, `sitemap.ts` line 4, `robots.ts` line 17:
```ts
const BASE_URL = "https://www.vaibhavbansal.in"; // ← old portfolio domain
```
Update to `https://www.thevaibhavbansal.com` (or your new domain) before deploying.

---

## 🟡 SEO Score

**Estimated Lighthouse SEO: 90–95/100** (static analysis — live score depends on icons/OG image existing)

### What's excellent
- Comprehensive `<title>` with name + roles + country
- 120+ targeted keywords covering hire-intent, tech-stack, location, ATS patterns
- 4 JSON-LD schemas: `Person`, `WebSite`, `ProfilePage`, `BreadcrumbList`
- `Person.makesOffer` → appears in "hire [role]" searches
- `Person.sameAs` links GitHub, LinkedIn, LeetCode, ORCID
- OG/Twitter cards fully configured
- Sitemap dynamically includes all blog posts
- `robots.ts` allows AI crawlers (GPTBot, Perplexity, Google-Extended)
- `rel="preconnect"` for fonts and GitHub avatars

### What to improve
- **OG image must be PNG** — SVG is not reliably rendered by Facebook/Slack/Discord link unfurls
- **Per-page metadata** — blog post pages and `/portfolio` should override title/description/OG with page-specific content (not just the root layout fallback)
- **`hreflang`** — not needed for English-only, but confirm you don't need multi-locale

---

## 🟡 ATS (Applicant Tracking System) Score

**Estimated ATS keyword match: ~85–90%** for standard software/AI engineering job postings

### Keyword coverage
- **Job titles covered:** AI Engineer, ML Engineer, Software Engineer, Backend, Frontend, Full Stack, LLM Engineer, NLP Engineer, MLOps, RAG Engineer ✅
- **Tech stack:** Python, React, Next.js, TypeScript, Node.js, AWS, Docker, FastAPI, LangChain, Kafka, Spark, PostgreSQL ✅
- **Location targeting:** United States, remote, open to work ✅
- **Experience signal:** "5+ years", "production systems", "senior" ✅

### Missing ATS terms to add
Consider adding to the keywords array in `layout.tsx`:

```ts
"data engineer",
"cloud engineer",
"API developer",
"microservices",
"REST API",
"GraphQL",
"CI/CD",
"Agile",
"system design",
"distributed systems",
"OpenAI API",
"Hugging Face",
"LLM fine-tuning",
"prompt engineering",
```

---

## 🟡 Performance Analysis

**Estimated Lighthouse Performance: 70–85/100** (Three.js and Framer Motion are the risk)

### Bundle risks
| Package | Size impact | Status |
|---------|-------------|--------|
| `three` | ~600 KB gzipped | `SkillSphere` already lazy-loaded ✅ |
| `@react-three/fiber` | ~100 KB | same lazy chunk ✅ |
| `framer-motion` | ~50 KB | used across many components; cannot easily split |
| `react-type-animation` | ~15 KB | acceptable |
| `react-countup` | ~10 KB | acceptable |

### Core Web Vitals risks
- **LCP (Largest Contentful Paint):** Hero image/text should load fast — no large images above fold ✅
- **FID/INP:** Framer Motion animations run on main thread — mitigated by `useInView` deferred animations ✅
- **CLS:** Canvas-based backgrounds have fixed dimensions — low CLS risk ✅
- **TBT (Total Blocking Time):** Three.js chunk will block when it loads — lazy-loading defers this past LCP ✅ (just fixed)

### Remaining performance wins
1. **Add `loading="lazy"` to all below-fold `next/image` components** — already default in Next.js for non-priority images ✅
2. **Mark hero image as `priority`** if HeroSection has an `<Image>` — prevents LCP delay
3. **Remove `@vercel/analytics` + `@vercel/speed-insights`** if not deploying to Vercel (dead weight on Hostinger)
4. **Use `font-display: swap`** — verify Google Fonts are loaded with this (Next.js font loader handles it automatically if using `next/font`)

---

## ✅ Security Headers (Now Added)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Cache-Control: public, max-age=31536000, immutable  (for /_next/static/)
```

---

## ✅ GitHub Automation

| Workflow | Trigger | Status |
|----------|---------|--------|
| `ci.yml` | Every PR | Ready — runs lint + tsc + build |
| `lighthouse.yml` | PRs to main | Ready — scores checked against budget |
| `deploy.yml` | Push to main | Ready — awaiting Secrets to be set |

**Required GitHub Secrets** (add at Settings → Secrets → Actions):
```
SSH_HOST            → your Hostinger server IP
SSH_USERNAME        → ssh user
SSH_PRIVATE_KEY     → ed25519 private key
SSH_PORT            → 22
APP_DIR             → /path/to/app on server
NEXT_PUBLIC_SITE_URL → https://www.thevaibhavbansal.com
GH_PAT_TOKEN        → GitHub personal access token (for GitHub Stats API)
```

---

## Git Commands to Push Everything

```bash
cd ~/my_portfolio/my_portfolio_vb

# Remove tracked files that should be ignored
git rm -r --cached .next 2>/dev/null; git rm --cached .DS_Store 2>/dev/null

# Stage and commit all changes
git add -A
git commit -m "perf(all): lazy-load sections, security headers, fix TS errors, AVIF/WebP images

- Fix InlineMiniGame.tsx ctx null TS errors
- Remove turbopack key from next.config.mjs
- Add security headers (HSTS, X-Frame-Options, CSP-lite)
- Add output: standalone for Hostinger deployment
- Add compress + AVIF/WebP image formats
- Lazy-load below-fold page sections via dynamic()
- Replace <img> with next/image in BlogList
- Add i.ytimg.com to image domains"

git push origin main
```

---

## Summary Priority Order

1. 🔴 **Create icon files** (favicon.ico, PNG icons, og-image.png) — broken PWA + poor social sharing
2. 🔴 **Replace GSC verification code** — needed for Search Console indexing
3. 🔴 **Update BASE_URL** to new domain before going live
4. 🟡 **Add YouTube video IDs** — fills dead sections in the blog/videos tab
5. 🟡 **Add missing ATS keywords** (data engineer, Agile, GraphQL, etc.)
6. 🟢 **Push the commit above** — all code fixes are done

# Portfolio — Lucas Méndez Díez

## Stack
- Next.js 16.2.6 (static export, output: 'export')
- Tailwind CSS v4
- Framer Motion 12
- GSAP 3
- Lenis 1
- React Three Fiber 9 + Drei 10
- Geist (Vercel) + JetBrains Mono fonts
- @tabler/icons-react + lucide-react icons

## Architecture
- All sections are client components under `src/components/`
- Three.js content (CyberAsset, LoadingScreen) imported via `dynamic(() => import(...), { ssr: false })`
- `page.tsx` composes sections in order
- Data lives in `src/data/projects.ts`

## Section order
1. LoadingScreen (3D tunnel fly-through, auto-disappears after 3.5s)
2. Hero (cinematic, photo + text split, animated typography)
3. About (personal branding, stats)
4. TechStack (category grid with Tabler icons)
5. AIWorkflow (AI tool cards + workflow flows)
6. Projects (33 projects, featured + compact, 3D tilt hover)
7. Journey (timeline, learning milestones)
8. Personality (soft skills cards)
9. Goals (future vision cards)
10. Contact (3 cards + footer)

## Design system
- Colors: `#06080F` bg, `#0D1117` surface, `#E6EDF3` text, `#58A6FF` accent, `#79C0FF` cyan, `#BC8CFF` purple
- Glass panels: `glass-panel` class with backdrop-blur
- Cards: `card-hover` for translateY + glow on hover
- Photo: `photo-frame` with gradient overlay + reflection + vignette + parallax
- Typography: Geist Sans + JetBrains Mono monospace

## Interaction systems
- Cursor: dual-circle (dot + ring), magnetic hover on links, hidden on touch
- Audio toggle: minimal button bottom-right, off by default
- Navigation: hide/show on scroll direction, glass on scroll, LM logo left, active dot indicator
- Particles: 3-layer background with simplex noise, mouse repulsion, scroll morph

## Deploy
- `npm run build` with `GITHUB_ACTIONS=true` for correct basePath /CIBER
- GitHub Actions auto-deploys on push to main
- Uses manual git push to gh-pages branch

## Key rules
- Always "use client" for interactive components
- Dynamic import for Three.js (SSR disabled)
- Never use dynamic Tailwind classes (v4 doesn't support string interpolation)
- All animations use Framer Motion, GSAP only where needed
- Follow the cinematic/premium/AI-native philosophy

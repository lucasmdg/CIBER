# Portfolio — Lucas Méndez Díez

## Stack
- Next.js 16.2.6 (static export, output: 'export')
- Tailwind CSS v4
- Framer Motion 12
- GSAP 3 + ScrollTrigger
- Lenis 1 (smooth scroll)
- React Three Fiber 9 + Drei 10
- @react-three/postprocessing (ChromaticAberration, Bloom)
- Three.js 0.184 (custom ShaderMaterial for particles)
- Geist (Vercel) + JetBrains Mono fonts
- @tabler/icons-react + lucide-react icons

## Architecture (Sui.io-inspired)
- **PersistentCorridor**: Fixed full-screen Three.js canvas (z-index 0) with:
  - 10,000 particles in custom ShaderMaterial (simplex noise, mouse repulsion, scroll morph, neon glow fragment)
  - 60 torus rings forming a 3D tunnel
  - EffectComposer with ChromaticAberration (scroll-velocity driven) + Bloom
  - Camera.position.z driven by GSAP ScrollTrigger scrub
- **HTML overlay**: All sections rendered above the 3D canvas via normal HTML/CSS (z-index 10)
- **SectionPortal**: Wrapper replacing SectionTransition — adds chapter numbers (00-08) + GSAP portal emergence (scale 0.92→1 + blur 8→0)
- **MagneticButton**: Framer Motion spring-based magnetic button for CTAs and contact cards
- **Scroll-driven camera**: `useScrollCamera` hook maps scroll progress (0-1) to camera Z (-10 to 90)

## Section order
1. LoadingScreen (3D tunnel fly-through, auto-disappears after 3.5s)
2. Hero (cinematic, photo + text split, MagneticButton CTAs)
3. About (personal branding, GSAP number counters)
4. TechStack (category grid with Tabler icons)
5. AIWorkflow (AI tool cards + SVG neural network line drawing)
6. Projects (33 projects, featured + compact, 3D tilt hover with radial glow)
7. Journey (timeline, GSAP line draw + dot glow)
8. Personality (soft skills cards)
9. Goals (future vision cards)
10. Contact (MagneticButton cards + footer)

## Design system (Sui.io palette)
- Colors: `#000000` bg, `#0A0A0A` surface, `#1A1A1A` elevated, `#E6EDF3` text, `#00F0FF` cyan-neón (accent), `#0066FF` azul-eléctrico, `#4D79FF` azul-cuántico
- Glass panels: `glass-panel` (blur 40px saturate 180%), `glass-panel-cyan` (cyan border glow on hover)
- Cards: `card-hover` with translateY + cyan glow on hover
- Photo: `photo-frame` with cyan gradient overlay + reflection + vignette + parallax
- Chapter numbers: `.chapter-number` (clamp 6rem-12rem, weight 900, 4% cyan opacity)
- Typography: Geist Sans + JetBrains Mono monospace
- Easings: `--ease-expo` (0.16,1,0.3,1), `--ease-spring` (0.34,1.56,0.64,1), `--ease-in-out-circ` (0.85,0,0.15,1)

## Interaction systems
- Cursor: dual-circle (dot + ring), magnetic hover on links, hidden on touch
- Audio toggle: minimal button bottom-right, off by default
- Navigation: hide/show on scroll direction, glass on scroll, LM logo left, active dot indicator
- Particles (3D corridor): 10K particles with custom shader, noise displacement, mouse repulsion, scroll morph, chromatic aberration on scroll velocity
- SVG neural network: GSAP stroke-dashoffset line drawing in AIWorkflow section
- Magnetic buttons: Framer Motion spring on Hero CTAs + Contact cards

## Key components
- `PersistentCorridor.tsx`: 3D background with tunnel rings + particles + post-processing
- `SectionPortal.tsx`: Section wrapper with chapter number + portal entrance animation
- `MagneticButton.tsx`: Magnetic hover effect using Framer Motion spring
- `useScrollCamera.ts`: GSAP ScrollTrigger hook mapping scroll → camera Z
- `LoadingScreen.tsx`: Initial 3D tunnel fly-through (3s), transitions to PersistentCorridor

## Deploy
- `npm run build` with `GITHUB_ACTIONS=true` for correct basePath /CIBER
- GitHub Actions auto-deploys on push to main
- Uses manual git push to gh-pages branch

## Key rules
- Always "use client" for interactive components
- Dynamic import for Three.js (SSR disabled): PersistentCorridor, LoadingScreen, Cursor
- Never use dynamic Tailwind classes (v4 doesn't support string interpolation)
- All animations use Framer Motion; GSAP only for scroll-driven (ScrollTrigger) and SVG line drawing
- Three.js Canvas at z-index 0 fixed, HTML sections at z-index 10 relative
- Post-processing disabled on mobile/touch devices (performance)
- Follow the cinematic/AI-native/Sui.io-inspired philosophy

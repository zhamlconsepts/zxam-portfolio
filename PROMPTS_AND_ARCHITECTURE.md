# 🚀 Ultra-High-End Portfolio Architecture & Prompts

Ushbu hujjatda 4 ta yetakchi veb-sayt (*inherited.band, daqconsulting.com, nexstudio.tech, noth.in*) uslublarini birlashtirgan mukammal portfolio loyihasining tayyor prompatlari va texnik arxitekturasi jamlangan.

Ularni to'g'ridan-to'g'ri **Cursor, Claude, ChatGPT, v0, Bolt** kabi AI vositalariga yoki UI/UX dasturchilarga berish mumkin.

---

## 1. Typography & Text Animations Prompt (Inherited.band uslubida)

```text
"Create a web section focusing purely on modern typography and elegant text entry animations inspired by inherited.band.

Typography Style:
- Use a high-end, clean editorial sans-serif font (like Syne, Neue Haas Grotesk, Inter, or Satoshi) with high contrast in font weights (bold display headings paired with light body text).
- Tight, modern letter-spacing (tracking: -0.03em to -0.04em) on large headings and relaxed line-height on body text.

Text Reveal Animations:
- Split headings into lines/words using SplitType or GSAP SplitText.
- Implement a smooth stagger fade-in and slide-up effect (opacity: 0 to 1, y: 40px to 0px, filter: blur(6px) to blur(0px)) when text comes into view.
- Wrap lines inside overflow-hidden parent containers (.stagger-mask) to create a clean reveal mask.

Hover & Fade Effects:
- Text links and buttons should feature a subtle character-by-character color shift or line-draw hover animation.
- Fade-in effects must feel soft and organic with an ease-out cubic-bezier transition (cubic-bezier(0.16, 1, 0.3, 1)), avoiding sharp or robotic movements.

Build using HTML, Tailwind CSS, and GSAP with SplitType."
```

---

## 2. Smooth Scroll & Contextual Background Shift Prompt (DAQ Consulting uslubida)

```text
"Develop a dynamic page scroll architecture with velocity-based responsiveness and context-aware background transitions inspired by daqconsulting.com.

Smooth Inertia Scrolling:
- Integrate Lenis Scroll (or GSAP ScrollSmoother) for fluid, inertia-based scrolling across the entire site.
- Synchronize Lenis scroll loop directly to the GSAP ticker (gsap.ticker.add) for 60fps ScrollTrigger updates.

Velocity & Parallax Physics:
- Elements (text blocks, cards, headings, image containers) should subtly shift speed or parallax (data-speed attributes: 0.1 to 0.3) based on how fast the user scrolls.

Dynamic Focus Mode (Dark Fade):
- As the user scrolls into key informational or featured sections, the overall background smoothly transitions from light/white (#F4F4F0) to a deep pitch-black (#06080F).
- Ensure all text and content within that section dynamically change color (from dark slate to crisp white and accent neon) with high contrast, keeping 100% of the viewer's focus on the typography.

Implement using HTML, Tailwind CSS, Lenis Scroll, and GSAP ScrollTrigger."
```

---

## 3. Glassmorphism & Difference Cursor Prompt (Nex Studio uslubida)

```text
"Design a custom interactive cursor system with translucent glassmorphism and negative inversion effects inspired by nexstudio.tech.

Custom Cursor Dot & Ring:
- Hide the default system mouse cursor on pointer-fine devices (cursor: none).
- Create a dual cursor: a sharp inner dot that tracks instantly, and a slightly larger translucent circle (follower) that smoothly lags behind using linear interpolation (lerp: 0.16 via requestAnimationFrame).

Negative / Difference Blend Effect:
- Apply mix-blend-mode: difference and a subtle backdrop blur/opacity to the cursor ring.
- When hovering over dark text on a white background, the cursor turns the text beneath it white, creating an eye-catching inverted negative effect.

Interactive Hover States:
- Scale up the cursor smoothly when hovering over interactive elements (buttons, links, clickable text) and display a subtle hover state or text label inside it (e.g., 'VIEW' on project media cards).

Build using HTML, CSS (mix-blend-mode), and Vanilla JavaScript / React / GSAP."
```

---

## 4. Interactive Fluid Ink Background Canvas Prompt (Noth.in uslubida)

```text
"Build an interactive WebGL / Canvas background featuring a liquid/ink dispersion effect inspired by noth.in.

Visual Aesthetics:
- The main canvas background should be clean, bright, and minimal (off-white/light grey #F4F4F0 in light mode, obsidian bioluminescent in dark mode).

Mouse Interaction (Fluid Mechanics):
- As the cursor moves across the screen, generate dynamic, fluid dark ink trails or ripples on the canvas behind the text.
- The ink marks should organically expand, swirl, and fade out smoothly over a short duration (2-3 seconds) with viscous friction damping.

Usability & Layering:
- Keep the fluid effect subtle and underneath the text layer (pointer-events: none on canvas, z-index: 0).
- Ensure the ink contrast never degrades the readability of the text above it.

Implement using HTML5 Canvas, WebGL, or Three.js with a fluid simulation shader."
```

---

## 5. Master Hybrid Prompt (Jamshid Ablakimov Portfoliosi uchun)

```text
"Create an ultra-luxury, high-end interactive portfolio website landing page for Ablakimov Jamshid (Junior Frontend Developer from Guliston, Uzbekistan | Tel: +998 94 010 40 39 | Email: zhahsoh@gmail.com | Web: www.abdusalomovv.uz) by fusing:

1. Inherited.band: Bold Syne editorial typography, stagger masks, and GSAP line-by-line reveal transitions.
2. DAQ Consulting: Lenis inertia butter-smooth scrolling and automatic background transition from gallery ivory (#F4F4F0) to deep focus-black (#06080F) upon scrolling into content.
3. Nex Studio: Dual trailing cursor with mix-blend-mode: difference negative inversion effect and dynamic 'VIEW' badge over project cards.
4. Noth.in: Interactive HTML5 Canvas liquid sumi-ink dispersion trails that ripple and dissolve behind the text.
5. 3D Elements: Multi-layer 3D holographic tilt card showcasing Jamshid's portrait (assets/jamshid.png) with React/Tailwind depth badges and Three.js background constellation.

Strict Constraint: Zero emojis anywhere. Modern SVG icons, clean code, dual UZ/EN language support, and CV view/print modal.
Tech Stack: React 19, Vite, Tailwind CSS, GSAP, Lenis, Three.js, Lucide Icons."
```

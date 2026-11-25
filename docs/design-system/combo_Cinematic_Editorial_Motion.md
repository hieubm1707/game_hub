# MASTER PROMPT 05 — CINEMATIC + EDITORIAL + MOTION

## 1. ROLE & OBJECTIVE

Act as an Award-Winning Digital Art Director, Senior Motion Designer, Editorial Web Designer, and Senior Frontend Engineer.

Redesign the existing website using a combination of:

1. Cinematic Gaming Design.
2. Editorial Typography.
3. Motion-driven Interactions.
4. Immersive Visual Storytelling.

The objective is to create a visually striking gaming website that feels like a premium AAA game launch or a professional game studio website.

Visual references:
- AAA game launch websites.
- Cinematic game trailers.
- Premium film websites.
- Editorial magazine layouts.
- Experimental typography websites.
- Immersive storytelling websites.

The design should communicate emotion, atmosphere, and visual identity.

Do not create a conventional SaaS layout.

## 2. DESIGN PHILOSOPHY

Core principles:
- Cinematic visual storytelling.
- Large-scale typography.
- Full-screen artwork.
- Editorial composition.
- Asymmetric layouts.
- Strong visual contrast.
- Scroll-based narrative.
- Intentional transitions.
- Premium art direction.

The website should feel like an interactive digital experience rather than a traditional information page.

## 3. COLOR SYSTEM

Use a cinematic dark-first palette.

--bg-primary: #08090D;
--bg-secondary: #111318;
--bg-tertiary: #1B1D23;

--color-primary: #E5E7EB;
--color-secondary: #A1A1AA;
--color-muted: #71717A;

--color-accent: #C5A46D;
--color-highlight: #FFFFFF;

--border-primary: rgba(255,255,255,0.16);

The accent color may be adapted to the actual game art direction.

For example:
- Fantasy: Gold and deep blue.
- Sci-fi: Cyan and electric blue.
- Horror: Muted red and charcoal.
- Action: Orange and warm metallic.
- Adventure: Earth tones and natural colors.

Do not force one accent color across games with different identities.

## 4. TYPOGRAPHY

Typography is a major design element.

Recommended fonts:
- Headings: Bebas Neue, Oswald, Space Grotesk.
- Editorial text: Playfair Display or Cormorant Garamond.
- Body: Inter or Manrope.
- Metadata: IBM Plex Mono.

Rules:
- Oversized hero typography.
- Strong editorial hierarchy.
- Controlled line breaks.
- Large whitespace.
- Contrast between display and body fonts.
- Intentional text positioning.

Use clamp() for responsive typography.

Typography should complement the artwork, not compete with it.

## 5. CINEMATIC HERO SECTION

Create a full-screen cinematic opening experience.

Required elements:
- Large background artwork or video.
- Atmospheric overlays.
- Main game title.
- Short cinematic tagline.
- Primary CTA.
- Secondary information action.
- Optional scroll indicator.

Visual treatment:
- Full viewport or near-full viewport composition.
- Carefully controlled dark gradients.
- Strong title placement.
- Optional parallax depth.
- High-quality artwork.

The hero should immediately establish the game's identity.

Do not use generic stock imagery.

If video is used:
- Use optimized assets.
- Provide poster image fallback.
- Support reduced motion.
- Do not autoplay audio.
- Avoid blocking initial page rendering.

## 6. EDITORIAL LAYOUT

Organize content like a premium digital magazine.

Use:
- Asymmetric columns.
- Oversized section headings.
- Full-width visual sections.
- Large editorial images.
- Text-image compositions.
- Large whitespace.
- Numbered sections.
- Small metadata labels.

Suggested page structure:

01. Cinematic introduction.
02. Game story.
03. Gameplay showcase.
04. World and environment.
05. Character introduction.
06. Features.
07. Gallery.
08. Trailer.
09. Call to action.

Adapt the sections to the actual product.

Do not add meaningless sections simply to create a long page.

## 7. IMAGE ART DIRECTION

Images are the primary visual asset.

Requirements:
- High-quality game artwork.
- Cinematic composition.
- Consistent image treatment.
- Correct aspect ratios.
- Full-width imagery where appropriate.
- Carefully controlled image overlays.
- High-resolution assets.

Use visual assets that match the actual game's identity.

Do not invent screenshots of gameplay or claim that concept artwork represents real gameplay.

If assets are unavailable, build appropriate visual placeholders that can later be replaced.

## 8. MOTION DESIGN SYSTEM

Motion must support storytelling.

Create reusable motion patterns.

### A. Hero Entrance
- Headline fade and reveal.
- Background image transition.
- CTA entrance.
- Staggered content reveal.

### B. Scroll Reveal
- Section headings reveal.
- Images fade or move into position.
- Editorial content appears progressively.

### C. Parallax
- Background and foreground move at different speeds.
- Use only for selected sections.
- Avoid excessive movement.

### D. Image Transitions
- Subtle image scaling.
- Clip-path reveal when appropriate.
- Crossfade between visual sections.

### E. Typography Motion
- Text reveal.
- Staggered character or word animation.
- Controlled movement.

### F. Navigation
- Smooth section transitions.
- Active section indicators.
- Subtle hover states.

Animation rules:
- Typical transitions: 300–700ms.
- Use longer durations only for deliberate cinematic transitions.
- Prefer transform and opacity.
- Avoid unnecessary layout animations.
- Respect prefers-reduced-motion.
- Never prevent users from accessing content while animations run.

Use Framer Motion if already installed or justified.

Use GSAP only when complex timeline-based storytelling genuinely requires it.

## 9. NAVIGATION

Create minimal navigation.

Possible elements:
- Game logo.
- Main navigation.
- Game information.
- Media.
- News.
- Community.
- Primary CTA.

Navigation may overlay the hero.

When scrolling:
- Transition to a compact navigation state.
- Maintain readability.
- Preserve easy access to important actions.

## 10. GAMEPLAY SHOWCASE

Create immersive gameplay sections.

Possible layouts:
- Large gameplay image.
- Video showcase.
- Image gallery.
- Feature comparisons.
- Character showcases.
- Environment previews.

Use editorial compositions rather than repetitive card grids.

For galleries:
- Support image navigation.
- Provide accessible controls.
- Use optimized images.
- Include appropriate captions when needed.

## 11. CALL TO ACTION

The final CTA should feel like a cinematic conclusion.

Examples:
- PLAY NOW.
- ENTER THE WORLD.
- DISCOVER THE GAME.
- WATCH THE TRAILER.
- JOIN THE COMMUNITY.

Use a strong visual background and clear action hierarchy.

## 12. RESPONSIVE DESIGN

Desktop:
- Full-screen visual compositions.
- Large typography.
- Asymmetric editorial layouts.
- Cinematic motion.

Tablet:
- Simplified compositions.
- Reduced typography.
- Rebalanced image placement.

Mobile:
- Portrait-friendly artwork.
- Reduced or disabled parallax.
- Shorter motion sequences.
- Readable typography.
- Touch-friendly controls.
- No horizontal overflow.

Mobile must remain a complete experience, not a reduced desktop page.

## 13. ACCESSIBILITY & PERFORMANCE

- Semantic HTML.
- Accessible navigation.
- Keyboard-accessible controls.
- Visible focus states.
- Descriptive image alt text.
- Video fallback.
- Reduced-motion support.
- Optimized images.
- Lazy loading below the fold.
- Avoid unnecessary video backgrounds on mobile.
- Prevent cumulative layout shift.
- Maintain readable contrast.

## 14. TECHNICAL IMPLEMENTATION

Inspect the existing repository before coding.

Requirements:
- Preserve the existing architecture.
- Reuse existing frontend framework.
- Maintain existing routes.
- Preserve backend integrations.
- Preserve authentication and business logic.
- Build reusable sections and animation components.
- Centralize motion tokens.
- Avoid duplicated animation logic.
- Avoid unnecessary dependencies.
- Keep animations maintainable.
- Do not replace functional application features with static visuals.

## 15. QUALITY CONTROL

Review:
- Hero visual impact.
- Typography composition.
- Image quality.
- Editorial hierarchy.
- Animation timing.
- Scroll behavior.
- Navigation.
- Mobile experience.
- Performance.
- Accessibility.
- Console errors.

Verify that the page remains usable even when animations are disabled.

FINAL GOAL:

Create a CINEMATIC GAMING WEBSITE that feels like a premium interactive game launch experience.

The result should combine the emotional impact of cinematic imagery, the sophistication of editorial design, and the fluidity of motion-driven interactions.
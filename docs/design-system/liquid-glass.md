# MASTER PROMPT — LIQUID GLASS GAMING DESIGN SYSTEM

## 1. ROLE & OBJECTIVE

Act as a World-Class Digital Product Designer, Senior UI/UX Designer, Creative Director, Motion Designer, and Senior Frontend Engineer.

Your mission is to redesign the existing web application using a PREMIUM LIQUID GLASS design language.

Combine:
- Liquid Glass material aesthetics.
- Dynamic light refraction.
- Translucent floating interfaces.
- Adaptive glass surfaces.
- Fluid motion and morphing transitions.
- Premium gaming visual identity.
- Modern responsive web design.

The website should feel like a sophisticated next-generation digital gaming ecosystem.

Design inspiration:
- Apple Liquid Glass design language.
- Modern spatial interfaces.
- Premium gaming launchers.
- Futuristic game dashboards.
- Immersive digital entertainment platforms.

IMPORTANT:

This is a web implementation inspired by Liquid Glass principles.

Do not simply copy Apple's native interface or reproduce its operating system controls.

Create an original visual identity suitable for the existing gaming product.

The result must be production-ready, not just a visual prototype.

---

## 2. CORE DESIGN PHILOSOPHY

Liquid Glass is a dynamic interface material, not simply a blurred transparent background.

The design must communicate five fundamental characteristics:

### A. Transparency
- Semi-transparent surfaces.
- Background content remains visible.
- Layered visual composition.
- Adaptive opacity.

### B. Light Refraction
- Subtle optical distortion.
- Light concentration around curved edges.
- Natural-looking highlights.
- Soft reflective surfaces.

### C. Floating Depth
- Navigation floats above content.
- Controls appear elevated.
- Clear separation between functional UI and content.
- Natural shadows and depth.

### D. Fluid Motion
- Smooth morphing transitions.
- Responsive interaction.
- Organic movement.
- Continuous spatial relationships between elements.

### E. Adaptive Material
- Glass surfaces respond visually to the background.
- Light and dark environments are supported.
- Highlights and tinting adapt to the surrounding content.

The design must remain elegant, restrained, and functional.

Avoid excessive transparency, blur, neon glow, and decorative glass elements.

---

## 3. DESIGN LAYER ARCHITECTURE

Build the interface using three distinct visual layers.

### Layer 01 — Background / Environment

The background creates the visual environment.

Possible elements:
- Dark atmospheric backgrounds.
- Gradient lighting.
- Game artwork.
- Blurred environmental imagery.
- Subtle ambient light.
- Dynamic background transitions.

The background should create enough visual richness for glass elements to interact with it.

Do not make the background excessively busy.

### Layer 02 — Content Layer

The content layer contains the actual application information.

Examples:
- Game covers.
- Game descriptions.
- Game libraries.
- Leaderboards.
- Player profiles.
- Statistics.
- News and announcements.
- Game collections.

Use solid or lightly translucent content surfaces when readability requires them.

Do not turn every content card into a Liquid Glass element.

### Layer 03 — Functional Liquid Glass Layer

This is the primary Liquid Glass layer.

Use it for:
- Floating navigation.
- Toolbars.
- Search controls.
- Floating action buttons.
- Game control panels.
- Popovers.
- Dropdown menus.
- Contextual menus.
- Selected HUD elements.
- Important overlays.

This layer must appear visually elevated above the content.

Maintain a clear distinction between content and controls.

---

## 4. COLOR SYSTEM

Create centralized design tokens.

### Primary Dark Palette

--bg-primary: #080B14;
--bg-secondary: #0E1422;
--bg-tertiary: #151D2E;

--surface-primary: #182235;
--surface-secondary: #202D43;

### Liquid Glass Palette

--glass-bg: rgba(255,255,255,0.09);
--glass-bg-hover: rgba(255,255,255,0.14);
--glass-bg-active: rgba(255,255,255,0.18);

--glass-border: rgba(255,255,255,0.20);
--glass-border-highlight: rgba(255,255,255,0.42);

--glass-shadow: rgba(0,0,0,0.20);

--glass-reflection: rgba(255,255,255,0.32);

### Accent Palette

--color-primary: #8B5CF6;
--color-secondary: #38BDF8;
--color-accent: #22D3EE;

--text-primary: #F8FAFC;
--text-secondary: #B6C1D2;
--text-muted: #8290A5;

### Light Environment

--light-bg-primary: #EEF3F9;
--light-bg-secondary: #FFFFFF;

--light-glass-bg: rgba(255,255,255,0.58);
--light-glass-border: rgba(255,255,255,0.78);

Color rules:
- The background should provide environmental depth.
- Glass should capture colors from nearby artwork.
- Accent colors should be subtle.
- Avoid excessive purple and cyan glow.
- Maintain high text contrast.
- Support both dark and light environments.

Do not force all glass elements to use the same opacity.

---

## 5. LIQUID GLASS MATERIAL SYSTEM

Create reusable glass material variants.

### A. Regular Glass

Used for standard floating controls.

Characteristics:
- Moderate transparency.
- Background blur.
- Thin reflective border.
- Subtle inner highlight.
- Natural shadow.

Example CSS:

.glass-regular {
  background: rgba(255,255,255,0.09);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.20);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.24),
    0 8px 32px rgba(0,0,0,0.18);
}

### B. Clear Glass

Used over visually rich backgrounds.

Characteristics:
- Higher transparency.
- Stronger background visibility.
- Carefully controlled contrast.
- More prominent reflective edges.

Example:

.glass-clear {
  background: rgba(255,255,255,0.055);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.25);
}

### C. Prominent Glass

Used for important actions and floating controls.

Characteristics:
- More visible glass surface.
- Stronger highlights.
- Greater visual separation.
- More pronounced depth.

Example:

.glass-prominent {
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.30);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.38),
    0 12px 40px rgba(0,0,0,0.24);
}

IMPORTANT:

These CSS examples establish a visual foundation, not a complete physical simulation of Liquid Glass.

Use additional optical treatments only when they materially improve the result.

---

## 6. OPTICAL EFFECTS & REFRACTION

This section is essential.

Do not rely exclusively on backdrop-filter blur.

Implement a restrained optical appearance using:

### Edge Highlights
- Thin reflective edges.
- Subtle top highlights.
- Brighter highlights near curved corners.
- Controlled inner reflections.

### Light Reflections
- Soft radial highlights.
- Gradient reflections.
- Subtle ambient light.
- Context-aware surface tinting.

### Refraction Simulation
Where technically appropriate:
- SVG displacement filters.
- SVG-based distortion.
- Subtle edge distortion.
- Layered pseudo-elements.
- Carefully controlled highlight gradients.

Do not apply expensive displacement filters to every glass element.

Avoid exaggerated fisheye effects.

### Surface Depth
Use:
- Multiple translucent layers.
- Inner highlights.
- Soft shadows.
- Curved edge reflections.
- Subtle ambient occlusion.

The glass must feel lightweight and dimensional rather than like a thick plastic panel.

---

## 7. SHAPE & GEOMETRY

Use soft, organic geometry.

Suggested corner radii:

--radius-small: 12px;
--radius-medium: 18px;
--radius-large: 24px;
--radius-floating: 32px;
--radius-pill: 999px;

Rules:
- Floating controls use rounded shapes.
- Navigation can use pill-shaped containers.
- Larger floating panels use consistent rounded corners.
- Nested components should have visually harmonious corner radii.
- Avoid combining too many unrelated corner styles.

The geometry should feel cohesive across the entire application.

---

## 8. FLOATING NAVIGATION

Create a distinctive Liquid Glass navigation system.

Requirements:
- Floating navigation bar.
- Translucent material.
- Subtle edge highlights.
- Soft shadow.
- Clear active state.
- Smooth transitions.
- Optional floating search control.
- Responsive mobile navigation.

Desktop:
- Floating pill or rounded navigation container.
- Main navigation.
- Search.
- User profile.
- Notifications.

Mobile:
- Compact floating navigation.
- Touch-friendly controls.
- Appropriate safe-area spacing.
- Avoid covering important content.

The navigation should feel detached from the background while remaining visually connected to the content.

Do not use a conventional opaque navbar unless required by the application.

---

## 9. GAMING COMPONENT SYSTEM

Create reusable components.

### A. Game Cards

Game cards should prioritize artwork.

Include:
- Game artwork.
- Game title.
- Category.
- Short description.
- Optional player information.
- Optional status.
- Play action.

Visual direction:
- Artwork-focused.
- Minimal text.
- Optional translucent information overlay.
- Subtle hover scaling.

Do not force Liquid Glass onto the entire game card.

Use glass only for interactive overlays or contextual controls.

### B. Game Detail Panel

Create an elegant glass overlay or modal.

Include:
- Game artwork.
- Game title.
- Description.
- Game metadata.
- Play button.
- Close control.

The panel should appear as a floating surface above the underlying page.

### C. Player Profile

Use:
- Avatar.
- Username.
- Online status.
- Player level.
- Achievements.
- Quick actions.

Use glass for the floating profile container.

### D. Gaming HUD

Create a lightweight floating HUD for gameplay where appropriate.

Possible elements:
- Score.
- Timer.
- Player status.
- Pause control.
- Settings.
- Game actions.

Keep the actual game viewport unobstructed.

### E. Leaderboard

Use a readable content surface with:
- Ranking.
- Avatar.
- Username.
- Score.
- Achievement indicators.

Use Liquid Glass only for the floating controls or selected ranking highlights.

### F. Floating Action Buttons

Examples:
- Play.
- Pause.
- Search.
- Settings.
- Add to favorites.
- Invite friends.

Use prominent glass treatments selectively.

---

## 10. INTERACTION & FLUID MOTION

Motion is a fundamental part of Liquid Glass.

Design movement and appearance as one system.

### A. Hover

- Slight elevation.
- Subtle reflective highlight.
- Small background tint changes.
- Controlled scale.

### B. Press

- Slight compression.
- Reduced shadow.
- Natural rebound.
- Immediate interaction feedback.

### C. Expand / Collapse

- Glass panels expand from their triggering controls.
- Preserve spatial relationships.
- Maintain rounded geometry.
- Use fluid morphing where appropriate.

### D. Popover / Dropdown

- Animate from the source control.
- Use subtle scale and opacity changes.
- Preserve visual continuity.
- Avoid unrelated screen-wide movement.

### E. Modal

- Floating glass surface.
- Background dimming when appropriate.
- Smooth presentation and dismissal.
- Clear relationship to the triggering action.

### F. Navigation

- Smooth active indicator transitions.
- Fluid selection feedback.
- Subtle material adaptation.

Recommended durations:
- Basic interactions: 150–250ms.
- Panel transitions: 250–400ms.
- Complex morphing: 350–550ms.

Use spring-based animation only where appropriate.

Respect prefers-reduced-motion.

Use Framer Motion if already installed or justified by the project.

Avoid introducing multiple animation libraries without a clear reason.

---

## 11. ADAPTIVE LIGHTING

Glass surfaces must respond to their environment.

Implement:
- Dark environment support.
- Light environment support.
- Background-dependent tinting.
- Different opacity levels.
- Different highlight intensity.
- Context-aware contrast.

If the background is visually bright, increase surface separation.

If the background is dark, use controlled reflective highlights.

Do not use one fixed glass treatment everywhere.

---

## 12. DARK MODE & LIGHT MODE

Support both themes when appropriate.

### Dark Mode
- Dark atmospheric backgrounds.
- White reflective highlights.
- Cool glass tint.
- Subtle shadows.
- Violet and cyan accents.

### Light Mode
- Bright environmental background.
- Soft neutral glass.
- Dark text.
- Subtle gray borders.
- Controlled reflections.

Theme switching must not break component contrast.

Persist the selected theme using the application's existing preference mechanism where available.

---

## 13. TYPOGRAPHY

Recommended fonts:
- Headings: Space Grotesk or Sora.
- Body: Inter or Manrope.
- Technical labels: JetBrains Mono.

Rules:
- Clear hierarchy.
- High readability.
- Moderate font weights.
- Minimal decorative text.
- Avoid placing small low-contrast text on highly transparent surfaces.

Glass is a visual material, not a reason to compromise readability.

---

## 14. RESPONSIVE DESIGN

### Desktop
- Floating navigation.
- Rich environmental backgrounds.
- Large content canvas.
- Multiple floating control surfaces.

### Tablet
- Adaptive navigation.
- Reduced glass blur.
- Rebalanced layout.
- Simplified overlays.

### Mobile
- Compact floating navigation.
- Touch-friendly controls.
- Optimized blur and shadows.
- Avoid excessive overlapping glass panels.
- Respect safe-area insets.
- Keep important content visible.

Never simply shrink the desktop layout.

---

## 15. ACCESSIBILITY & PERFORMANCE

Accessibility:
- WCAG-friendly contrast.
- Keyboard navigation.
- Visible focus states.
- Accessible labels.
- Semantic HTML.
- Screen reader support.
- Reduced transparency fallback.
- Reduced-motion support.

Performance:
- Use backdrop-filter selectively.
- Avoid excessive blur layers.
- Avoid unnecessary SVG filters.
- Prefer transform and opacity animations.
- Optimize background artwork.
- Lazy-load large media.
- Avoid layout shifts.
- Provide fallback solid surfaces.
- Test on low-powered mobile devices.

When transparency is reduced or unsupported, preserve a clear, attractive interface using more opaque surfaces.

---

## 16. TECHNICAL IMPLEMENTATION

Before coding:

1. Inspect the complete existing repository.
2. Identify the frontend framework.
3. Understand the styling architecture.
4. Review existing reusable components.
5. Inspect routes and navigation.
6. Identify API integrations and data models.
7. Understand current functionality.

Implementation requirements:

- Preserve the existing application architecture.
- Use the existing framework and conventions.
- Build reusable GlassSurface components.
- Create regular, clear, and prominent glass variants.
- Centralize design tokens.
- Separate presentation from business logic.
- Keep animation logic maintainable.
- Use data-driven components.
- Avoid unnecessary dependencies.
- Do not replace real backend data with mock content.
- Do not break existing routes, APIs, or authentication.

Create a maintainable component architecture.

Suggested components:

- GlassSurface
- GlassButton
- GlassIconButton
- GlassNavigation
- GlassPopover
- GlassDropdown
- GlassModal
- GlassSearch
- GlassToolbar
- GlassHUD
- GameCard
- GameDetailPanel
- PlayerProfile

Adapt naming to the existing project conventions.

Do not create unnecessary abstractions.

---

## 17. DESIGN QUALITY CONTROL

After implementation, verify:

### Visual
- Does the material look like glass rather than a generic blurred card?
- Are edge highlights subtle and realistic?
- Is the depth hierarchy clear?
- Does the glass interact visually with the background?
- Is content still the primary focus?
- Are surfaces consistent?

### Interaction
- Do buttons respond naturally?
- Do panels expand smoothly?
- Do menus appear from their source controls?
- Are transitions consistent?
- Does navigation work?

### Responsive
- Does the design work on desktop?
- Does it adapt to tablet?
- Is mobile navigation usable?
- Are there any horizontal overflow issues?

### Accessibility
- Is text readable?
- Are focus states visible?
- Does reduced motion work?
- Is there a reduced-transparency fallback?

### Technical
- Does the application build successfully?
- Are there console errors?
- Are existing APIs still functional?
- Are existing routes preserved?
- Is performance acceptable?

Fix all significant issues before completion.

---

## 18. STRICT DESIGN RULES

DO:
- Use Liquid Glass for functional surfaces.
- Use optical highlights selectively.
- Preserve content hierarchy.
- Create depth through layering.
- Use fluid and contextual motion.
- Maintain readability.
- Build reusable components.
- Adapt glass to its environment.

DO NOT:
- Turn every card into a glass card.
- Apply backdrop-filter to every element.
- Use excessive neon glow.
- Use random gradients everywhere.
- Make text transparent.
- Create excessive floating panels.
- Use unrealistic distortion.
- Sacrifice usability for aesthetics.
- Copy Apple's native interface literally.
- Replace functional content with decorative UI.

---

## FINAL OBJECTIVE

Deliver a premium, production-ready web application featuring a distinctive LIQUID GLASS design language.

The final result should combine:

- The optical beauty of glass.
- The depth of spatial interfaces.
- The fluidity of natural movement.
- The sophistication of modern gaming platforms.
- The usability of a professional product.

The interface must feel lightweight, dynamic, immersive, and refined.

Most importantly, make the glass feel alive without allowing the visual effects to overpower the actual gaming experience.
# MASTER PROMPT 03 — RETRO ARCADE + NEO-BRUTALISM + PIXEL ART

## 1. ROLE & OBJECTIVE

Act as a Senior Retro Gaming UI/UX Designer, Digital Art Director, and Senior Frontend Engineer.

Redesign the existing website using a combination of:

- Retro Arcade aesthetics.
- Neo-Brutalist UI.
- Pixel Art visual language.
- Game Boy-inspired interface elements.
- Modern web usability.

The result should feel like a nostalgic arcade machine redesigned for the modern web.

Primary visual references:
- Original Nintendo Game Boy.
- 1980s and 1990s arcade machines.
- Classic pixel-art games.
- Neo-Brutalist websites.
- Retro handheld gaming interfaces.

Do not make the website look like an outdated emulator.

The goal is to create a modern, polished, retro-inspired gaming experience.

## 2. DESIGN PHILOSOPHY

Core principles:
- Strong retro identity.
- Bold borders and physical-looking controls.
- Pixel-inspired details.
- Limited but distinctive color palette.
- Monospace and slab-serif typography.
- Structured layouts.
- Playful but functional interactions.
- Nostalgic details combined with modern usability.

The website should feel tactile, like interacting with a physical arcade console.

## 3. COLOR SYSTEM

Primary palette:

--color-primary: #A0C510;
--color-primary-hover: #8EAF0C;

--color-accent: #198754;
--color-accent-dark: #126B42;

--color-background: #FFFFFF;
--color-surface: #F2F4F4;
--color-surface-dark: #DDE1E2;

--color-text: #202629;
--color-text-muted: #667078;
--color-border: #202629;

--color-screen: #C7D59A;
--color-screen-dark: #293A20;

--color-warning: #F4B400;
--color-danger: #DC3545;

Color rules:
- Retro Lime is the primary identity.
- Charcoal defines borders and structure.
- Arcade Green highlights important actions.
- White and light gray provide visual balance.
- Use screen-inspired green tones for retro game previews.
- Avoid unnecessary gradients.

Do not use all colors everywhere.

## 4. TYPOGRAPHY

Recommended fonts:

Headings:
- Roboto Slab.
- Zilla Slab.
- IBM Plex Mono.

Body:
- Space Mono.
- IBM Plex Mono.

Pixel typography:
- Press Start 2P.
- Silkscreen.

Rules:
- Use slab-serif or monospace for major headings.
- Use monospace for descriptions and metadata.
- Use pixel fonts only for selected decorative elements, scores, labels, or game titles.
- Keep normal body text readable.
- Avoid using pixel fonts for long paragraphs.

## 5. NEO-BRUTALIST COMPONENT SYSTEM

### Borders
- Standard border: 3px solid #202629.
- Strong border: 4px solid #202629.
- Small radius: 6–10px.
- Avoid overly rounded components.

### Hard Shadows

Use offset shadows:

box-shadow: 0 5px 0 #202629;

For emphasized buttons:

box-shadow: 0 6px 0 #202629;

Do not use soft blurred shadows as the primary visual treatment.

### Cards
- Light gray or white surfaces.
- Strong dark borders.
- Clear content hierarchy.
- Hard shadow when emphasizing important elements.
- Compact retro labels.

### Buttons

Primary:
- Arcade Green background.
- Dark border, 3–4px.
- Bold uppercase monospace.
- Hard offset shadow.
- Optional gamepad icon.

Hover:
- Slight upward movement or color change.

Active:
- Translate downward.
- Reduce shadow.
- Create a physical button-press effect.

## 6. RETRO ARCADE VISUAL ELEMENTS

Use selected elements inspired by classic consoles:

- D-pad-inspired controls.
- A/B buttons.
- Pixel dividers.
- Retro screen frames.
- Scoreboards.
- High-score panels.
- Game cartridge-inspired cards.
- Pixel badges.
- Arcade-style navigation labels.
- CRT-inspired visual effects when appropriate.

IMPORTANT:

Do not put decorative console elements everywhere.

Use these details only where they improve the gaming experience.

## 7. HERO SECTION

Create a distinctive arcade-inspired hero.

Recommended composition:
- Large retro-themed headline.
- Short introduction.
- Retro console illustration or game preview.
- Primary START GAMING action.
- Secondary VIEW GAMES action.
- Three or four feature highlights.

Use a strong lime-green panel with:
- Dark thick border.
- Subtle hard shadow.
- Centered composition.
- Structured spacing.

The hero should resemble a modern arcade machine interface.

## 8. GAME LIBRARY

Create reusable GameCard components inspired by:
- Game cartridges.
- Arcade cabinets.
- Classic game selection screens.

Each card may contain:
- Game cover.
- Pixel-art thumbnail.
- Game title.
- Category.
- Difficulty.
- Player mode.
- Play button.
- High score, when available.

Visual rules:
- Strong borders.
- Clear labels.
- Minimal decorative elements.
- Consistent card dimensions.

Game artwork should remain visually dominant.

## 9. GAME SCREEN / PLAYER INTERFACE

When implementing browser-based games, create a game interface that feels like a modern handheld console.

Possible elements:
- Console frame.
- Game viewport.
- Score display.
- Level indicator.
- Pause button.
- Restart button.
- Keyboard controls.
- Mobile touch controls.

The game viewport must remain functional.

Do not use decorative CSS effects that interfere with gameplay.

## 10. NAVIGATION

Create:
- Retro top navigation.
- Compact uppercase menu.
- Clear active state.
- Simple gamepad-inspired icons.
- Optional light/dark toggle.

Navigation should remain modern and accessible.

## 11. PIXEL ART SYSTEM

Use pixel art selectively.

Suitable applications:
- Game icons.
- Decorative illustrations.
- Character sprites.
- Game thumbnails.
- Loading animations.
- Small badges.
- Achievement indicators.

Use image-rendering: pixelated where appropriate.

Avoid pixelating ordinary UI text or photographs.

Maintain consistent sprite dimensions and aspect ratios.

## 12. ANIMATION & INTERACTION

Use physical and arcade-inspired interactions.

Examples:
- Button press animation.
- Pixel-style loading indicator.
- Score counter animation.
- Game card selection.
- Screen transition.
- Subtle blinking cursor.
- Small retro hover effects.

Avoid:
- Excessive flashing.
- Continuous flickering.
- Aggressive CRT distortion.
- Unnecessary sound effects.
- Distracting animated backgrounds.

Respect prefers-reduced-motion.

## 13. RESPONSIVE DESIGN

Desktop:
- Wide hero composition.
- Multi-column game grid.
- Large console preview.

Tablet:
- Reduced card columns.
- Compact navigation.

Mobile:
- Single-column game cards.
- Touch-friendly game controls.
- Mobile-friendly game viewport.
- Responsive typography.
- No horizontal overflow.

Do not simply shrink the desktop console design.

## 14. OPTIONAL DARK MODE

If dark mode is supported, create a complementary retro-dark palette.

--bg-primary: #14191A;
--bg-secondary: #202629;
--surface-primary: #29302F;
--color-primary: #A0C510;
--color-accent: #198754;
--text-primary: #F2F4F4;
--text-secondary: #AAB2AE;
--border-primary: #E2E7E3;

Preserve strong border contrast.

## 15. TECHNICAL IMPLEMENTATION

Inspect the existing project before coding.

Requirements:
- Preserve existing architecture.
- Use existing framework and styling conventions.
- Build reusable retro UI components.
- Centralize design tokens.
- Separate game rendering from website UI.
- Preserve existing game logic.
- Preserve API integrations and routes.
- Avoid unnecessary dependencies.
- Ensure keyboard and touch controls work.
- Do not replace real gameplay with static illustrations.

## 16. QUALITY CONTROL

Verify:
- Retro identity is consistent.
- Borders and shadows are consistent.
- Typography remains readable.
- Pixel art is rendered correctly.
- Game cards align properly.
- Buttons feel interactive.
- Game controls work.
- Mobile layouts are usable.
- No existing functionality is broken.

FINAL GOAL:

Build a polished RETRO ARCADE EXPERIENCE that combines Game Boy nostalgia, Neo-Brutalist structure, and modern pixel-art aesthetics.

The website should feel like a premium retro gaming destination rather than a simple nostalgic theme.
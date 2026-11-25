# MASTER PROMPT 01 — DARK GAMING UI / CYBERPUNK

## 1. ROLE & OBJECTIVE

Act as a Senior Gaming UI/UX Designer, Creative Director, and Senior Frontend Engineer.

Redesign the existing web application using a premium DARK GAMING UI combined with CYBERPUNK aesthetics.

The interface should feel like a next-generation gaming platform: immersive, futuristic, powerful, technologically advanced, and visually engaging.

Primary visual references:
- Modern AAA gaming platforms.
- Futuristic game launchers.
- Cyberpunk interfaces.
- Competitive gaming dashboards.
- Premium dark gaming communities.

Do not create a generic dark SaaS dashboard. The result must have a recognizable gaming identity.

## 2. DESIGN PHILOSOPHY

Core principles:
- Dark-first visual experience.
- Neon accents used strategically.
- High contrast between background and content.
- Game artwork as a major visual element.
- Layered interface surfaces.
- Strong typography and clear hierarchy.
- Subtle glow and futuristic details.
- Functional interfaces over unnecessary decoration.

The website should feel premium, immersive, and professional rather than excessively flashy.

## 3. COLOR SYSTEM

Create centralized CSS variables or design tokens.

Primary palette:

--bg-primary: #090B12;
--bg-secondary: #101522;
--bg-tertiary: #171E2D;
--surface-primary: #151B29;
--surface-secondary: #1C2535;

--color-primary: #8B5CF6;
--color-secondary: #06B6D4;
--color-accent: #A3E635;

--text-primary: #F8FAFC;
--text-secondary: #A1AAB9;
--text-muted: #667085;

--border-primary: #293246;
--border-highlight: rgba(139,92,246,0.45);

--status-success: #22C55E;
--status-warning: #F59E0B;
--status-error: #EF4444;

Color rules:
- Use dark backgrounds as the foundation.
- Use violet as the primary identity.
- Use cyan for secondary interactive elements.
- Use lime sparingly for high-priority actions or indicators.
- Use gradients only for hero artwork, selected cards, and atmospheric lighting.
- Avoid using multiple neon colors simultaneously without hierarchy.

## 4. TYPOGRAPHY

Recommended fonts:

- Headings: Space Grotesk, Rajdhani, or Sora.
- Body: Inter or Manrope.
- Technical labels: JetBrains Mono.

Typography rules:
- Bold, large headings.
- Compact navigation labels.
- Strong distinction between primary and secondary text.
- Uppercase labels for gaming metadata.
- Monospace for technical statistics, IDs, and game information.

## 5. LAYOUT SYSTEM

Use a modern gaming platform layout.

Desktop:
- Main container: 1280–1440px.
- Optional left sidebar for game navigation.
- Top navigation for global actions.
- Main content with a clear content hierarchy.
- Featured game section.
- Game library and category sections.
- Optional right panel for activity, friends, or leaderboard.

Use CSS Grid and Flexbox.

Avoid unnecessary empty space in information-dense gaming interfaces.

## 6. HERO SECTION

The hero section should create an immediate gaming impression.

Recommended elements:
- Large featured game artwork.
- Dark atmospheric background.
- Gradient overlays.
- Large game title.
- Short description.
- Game category and status badges.
- Primary PLAY NOW button.
- Secondary VIEW DETAILS action.

The artwork should dominate the visual composition.

Do not use generic gradients as substitutes for real game visuals.

## 7. GAME CARDS

Create a reusable GameCard component.

Each card can support:
- Game cover image.
- Game title.
- Category.
- Short description.
- Online player count, if available.
- Rating, if available.
- Game status.
- Play button.
- Hover preview.

Visual treatment:
- Dark surface.
- Subtle border.
- Rounded corners between 8px and 14px.
- Optional image overlay.
- Subtle violet or cyan hover glow.
- Smooth image scaling on hover.

Keep game artwork visually dominant.

## 8. BUTTON SYSTEM

Primary button:
- Violet or gradient violet background.
- High-contrast white text.
- Medium radius.
- Subtle glow on hover.
- Strong visual prominence.

Secondary button:
- Transparent or dark surface.
- Thin border.
- White text.

Danger button:
- Red accent.
- Clear confirmation for destructive actions.

States:
- Default.
- Hover.
- Active.
- Disabled.
- Loading.
- Focus-visible.

## 9. NAVIGATION

Implement:
- Modern top navigation.
- Optional collapsible sidebar.
- Active navigation indicator.
- Search games.
- User profile.
- Notifications.
- Settings.
- Responsive mobile navigation.

Use clear icons with consistent stroke weight.

Do not overcrowd the navigation.

## 10. GAMING INTERACTION

Implement appropriate interactions:
- Game card hover.
- Featured game transitions.
- Category filtering.
- Game search.
- Game sorting.
- Modal details.
- Play action.
- Loading and game-launch states.
- Notifications and feedback.

Use Framer Motion if already installed or justified by the project architecture.

Animation duration: approximately 150–300ms for ordinary interactions.

Avoid continuous neon pulsing and excessive animations.

## 11. OPTIONAL GAMING FEATURES

When supported by existing product functionality, design:
- Player profile.
- Friends list.
- Online presence.
- Leaderboard.
- Achievements.
- Game history.
- Favorite games.
- Multiplayer invitations.
- Notifications.

Do not fabricate backend functionality or display fake live statistics.

## 12. RESPONSIVE DESIGN

Desktop:
- Rich multi-column layout.
- Featured content.
- Sidebar where useful.

Tablet:
- Reduced columns.
- Collapsible navigation.

Mobile:
- Single-column game cards.
- Touch-friendly actions.
- Compact navigation.
- Optimized hero artwork.
- No horizontal overflow.

## 13. DARK MODE

This is a dark-first design system.

If the existing application supports light mode, preserve it as an alternative theme.

Do not introduce a light theme unnecessarily.

## 14. ACCESSIBILITY

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible contrast.
- Proper form labels.
- Reduced-motion support.
- Accessible dialogs.
- Appropriate alt text.

Neon effects must not reduce text readability.

## 15. TECHNICAL IMPLEMENTATION

Before coding:
1. Inspect the existing repository.
2. Identify frontend framework and styling system.
3. Understand existing routes and application architecture.
4. Identify reusable components.
5. Preserve existing business logic and integrations.

Implementation rules:
- Reuse existing components where appropriate.
- Build reusable gaming components.
- Centralize design tokens.
- Avoid duplicated CSS.
- Avoid unnecessary dependencies.
- Do not replace existing application logic with mock data.
- Do not break existing APIs or authentication.
- Use the existing framework and project conventions.

## 16. FINAL QUALITY CONTROL

After implementation:
- Run the application.
- Inspect all redesigned pages.
- Verify responsive layouts.
- Test navigation and interactive elements.
- Verify game card behavior.
- Check dark theme contrast.
- Check console errors.
- Fix visual inconsistencies.
- Confirm that existing functionality still works.

FINAL GOAL:

Deliver a premium, production-ready gaming platform with a distinctive DARK GAMING / CYBERPUNK identity.

The result should look like a real modern gaming product, not a generic dark-themed dashboard.
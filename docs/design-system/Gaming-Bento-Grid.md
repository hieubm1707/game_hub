# MASTER PROMPT 02 — GAMING BENTO GRID DESIGN

## 1. ROLE & OBJECTIVE

Act as a Senior Product Designer and Senior Frontend Engineer specializing in modern gaming platforms and modular web interfaces.

Redesign the existing website using a GAMING BENTO GRID design system.

The objective is to create a highly structured, visually engaging gaming interface where different content types are organized into modular cards of different sizes.

Visual references:
- Modern Apple-style Bento Grid layouts.
- Gaming discovery platforms.
- Game launchers.
- Digital entertainment dashboards.
- Modern game libraries.

The result must feel modern, premium, organized, and easy to explore.

IMPORTANT:

Bento Grid is the layout foundation, not a rigid visual template.

Adapt card sizes, content density, and colors to the actual product.

## 2. DESIGN PHILOSOPHY

Core principles:
- Modular card-based layout.
- Asymmetrical but balanced composition.
- Clear visual hierarchy.
- Strong content grouping.
- Flexible card sizes.
- Consistent grid gaps.
- Image-driven game discovery.
- Responsive layout.

The interface should feel like a carefully curated gaming dashboard.

Avoid making every card identical.

## 3. COLOR SYSTEM

Use a centralized theme system.

Suggested dark palette:

--bg-primary: #0D1117;
--bg-secondary: #151B23;
--surface-primary: #1B2330;
--surface-secondary: #222D3C;

--color-primary: #7C5CFC;
--color-secondary: #38BDF8;
--color-accent: #A3E635;

--text-primary: #F8FAFC;
--text-secondary: #AAB4C3;
--text-muted: #778294;

--border-primary: #2C3748;

Optional light theme:

--bg-primary: #F6F7F9;
--surface-primary: #FFFFFF;
--surface-secondary: #EFF2F5;
--text-primary: #171B22;
--text-secondary: #5D6672;
--border-primary: #DDE2E8;

Do not force the dark palette if the existing product already has an established visual identity.

## 4. TYPOGRAPHY

Recommended fonts:
- Headings: Space Grotesk or Sora.
- Body: Inter or Manrope.
- Metadata: JetBrains Mono.

Typography rules:
- Large, bold section headings.
- Clear card titles.
- Compact metadata.
- Strong title-to-description hierarchy.
- Consistent text alignment.
- Avoid excessive uppercase text.

## 5. BENTO GRID SYSTEM

Create a reusable responsive grid system.

Desktop:
- 12-column grid.
- 16–24px gaps.
- Cards can span 3, 4, 6, 8, or 12 columns.
- Different card heights based on content importance.

Tablet:
- 8-column grid.
- Reduce large card spans.

Mobile:
- 4-column grid.
- Stack cards naturally.
- Preserve the visual hierarchy.
- Avoid tiny, unreadable cards.

Use CSS Grid.

Example grid:

grid-template-columns: repeat(12, minmax(0, 1fr));

Use grid-column and grid-row spans for modular composition.

Do not hardcode a layout that breaks when content changes.

## 6. CARD TYPES

Build reusable card variants.

### A. Featured Game Card
- Large game artwork.
- Game title.
- Description.
- Category.
- Play button.
- Optional status badge.

### B. Game Collection Card
- Collection thumbnail.
- Collection name.
- Number of games.
- Navigation action.

### C. Quick Action Card
- Icon.
- Short label.
- Clear action.

### D. Statistics Card
- Total games.
- Active players.
- Games played.
- Achievements.

Only show statistics backed by actual data.

### E. Leaderboard Card
- Player rankings.
- Avatars.
- Scores.
- Rank indicators.

### F. Recent Activity Card
- Recently played games.
- Play history.
- Last activity.

### G. Community Card
- Friends online.
- Multiplayer sessions.
- Community events.

### H. Promotional Card
- Featured event.
- New game.
- Special announcement.

Each card must support its own visual hierarchy while sharing the same design tokens.

## 7. VISUAL DESIGN

Card styling:
- Consistent border radius: 12–20px.
- Subtle borders.
- Controlled shadows.
- Clean internal spacing.
- Optional background artwork.
- Image overlays when needed.

Use multiple card treatments:
- Image-focused cards.
- Text-focused cards.
- Statistics cards.
- Interactive cards.
- Highlighted feature cards.

Avoid applying the same background and styling to every card.

## 8. GAME ARTWORK

Game artwork is a major part of the design.

Requirements:
- Use high-quality game cover images.
- Maintain consistent image aspect ratios within card variants.
- Use object-fit: cover where appropriate.
- Apply subtle overlays for text readability.
- Provide fallback visuals when artwork is unavailable.
- Avoid distorted or stretched images.

Do not use random placeholder images in production.

## 9. HERO COMPOSITION

The top section should introduce the gaming platform.

Possible structure:
- Welcome heading.
- Featured game occupying a large grid area.
- Quick access cards.
- Game discovery section.
- Optional user statistics.

The featured game should receive the strongest visual emphasis.

Do not create a conventional full-width marketing hero if a dashboard-style composition is more appropriate.

## 10. INTERACTION

Implement:
- Card hover elevation.
- Image zoom.
- Category selection.
- Search.
- Sorting.
- Expandable cards when appropriate.
- Quick action navigation.
- Game detail modal.
- Loading skeletons.
- Empty states.

Animations should be subtle and consistent.

Avoid animations that cause layout shifts.

## 11. NAVIGATION

Use a clean navigation system.

Depending on the product:
- Top navigation.
- Left sidebar.
- Search.
- User profile.
- Game categories.
- Favorites.
- Recently played.

Keep global navigation separate from card-based content.

## 12. RESPONSIVE DESIGN

Create intentional responsive grid configurations.

Desktop:
- Rich asymmetric composition.

Tablet:
- Rebalance card spans.
- Preserve featured content.

Mobile:
- Prioritize content.
- Use a natural vertical sequence.
- Keep card actions accessible.
- Use horizontal carousels only when they improve discovery.

Never simply scale down the desktop grid.

## 13. ACCESSIBILITY

- Semantic card structure.
- Keyboard-accessible actions.
- Visible focus states.
- Accessible buttons.
- Image alt text.
- Appropriate color contrast.
- Reduced-motion support.

## 14. TECHNICAL IMPLEMENTATION

Inspect the existing repository before coding.

Requirements:
- Preserve the current application architecture.
- Reuse existing frameworks and styling systems.
- Build reusable card components.
- Centralize grid and spacing tokens.
- Use data-driven card rendering.
- Avoid duplicated layouts.
- Avoid unnecessary dependencies.
- Preserve APIs, routing, authentication, and business logic.

The grid must work with dynamic data and different content lengths.

Do not create static cards when the application already has real data sources.

## 15. QUALITY CONTROL

Test:
- Grid behavior at all breakpoints.
- Different card sizes.
- Dynamic content.
- Missing artwork.
- Long titles.
- Empty states.
- Loading states.
- Navigation.
- Keyboard interactions.
- Browser console errors.

FINAL GOAL:

Create a production-ready GAMING BENTO GRID experience that makes game discovery intuitive, visually rich, modular, and scalable.

The layout should feel carefully art-directed, not like a random collection of cards.
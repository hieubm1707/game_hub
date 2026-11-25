import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeId =
  | 'liquid-glass'
  | 'liquid-glass-light'
  | 'dark-gaming'
  | 'dark-bento-glass'
  | 'cinematic-editorial'
  | 'retro-pixel'
  | 'neo-brutalism-v2'
  | 'neo-brutalism-v2-dark'
  | 'neo-brutalist'
  | 'y2k-retro'
  | 'cartoon-rpg'
  | 'cozy-farming';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  swatches: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'liquid-glass',
    name: 'Liquid Glass (Dark)',
    shortName: 'Liquid Glass',
    tagline: 'Floating optical glass nav & HUD, solid artwork cards, specular highlights',
    swatches: ['#080B14', '#38BDF8', '#E2E8F0'],
  },
  {
    id: 'liquid-glass-light',
    name: 'Liquid Glass (Light)',
    shortName: 'Liquid Light',
    tagline: 'Bright frosted atmospheric canvas, floating crystal controls, dark ink',
    swatches: ['#EEF3F9', '#FFFFFF', '#8B5CF6'],
  },
  {
    id: 'dark-gaming',
    name: 'Dark Gaming / Cyberpunk',
    shortName: 'Dark Gaming',
    tagline: 'Obsidian dark-first, violet & cyan neon accents, JetBrains Mono',
    swatches: ['#090B12', '#8B5CF6', '#06B6D4'],
  },
  {
    id: 'dark-bento-glass',
    name: 'Dark Gaming + Bento + Glass',
    shortName: 'Bento Glass',
    tagline: 'Translucent dark glass surfaces, bento spans, controlled violet glow',
    swatches: ['#080B14', '#8B5CF6', '#22D3EE'],
  },
  {
    id: 'cinematic-editorial',
    name: 'Cinematic Editorial Motion',
    shortName: 'Cinematic',
    tagline: 'AAA film-grade dark canvas, champagne gold, Bebas Neue display',
    swatches: ['#08090D', '#C5A46D', '#E5E7EB'],
  },
  {
    id: 'retro-pixel',
    name: 'Retro Arcade + Pixel Art',
    shortName: 'Retro Pixel',
    tagline: 'Game Boy LCD sage, retro lime, arcade green, Press Start 2P badges',
    swatches: ['#A0C510', '#C7D59A', '#198754'],
  },
  {
    id: 'neo-brutalism-v2',
    name: 'Retro Neo-Brutalism v2',
    shortName: 'Retro v2',
    tagline: 'Retro lime hero, arcade green CTAs, charcoal borders',
    swatches: ['#A0C510', '#198754', '#202629'],
  },
  {
    id: 'neo-brutalism-v2-dark',
    name: 'Retro Neo-Brutalism v2 (Dark)',
    shortName: 'Retro v2 Dark',
    tagline: 'Vintage charcoal terminal, retro lime highlights',
    swatches: ['#15191B', '#A0C510', '#198754'],
  },
  {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Arcade',
    shortName: 'Brutalist',
    tagline: 'Neon yellow, hot pink, hard black outlines',
    swatches: ['#FFE800', '#FF1F8F', '#000000'],
  },
  {
    id: 'y2k-retro',
    name: 'Y2K Retro Cyber',
    shortName: 'Y2K Cyber',
    tagline: 'Metallic chrome, electric blue, holographic gloss',
    swatches: ['#1E6BFF', '#00E5FF', '#E4ECF7'],
  },
  {
    id: 'cartoon-rpg',
    name: 'Cartoon Fantasy RPG',
    shortName: 'Cartoon RPG',
    tagline: 'Warm wood, thick brown ink, rarity badges',
    swatches: ['#7C4A22', '#FFC82C', '#57B836'],
  },
  {
    id: 'cozy-farming',
    name: 'Cozy Farming Sim',
    shortName: 'Cozy Farm',
    tagline: 'Warm cream paper, leaf green, soft terracotta',
    swatches: ['#F4EBD6', '#5C9E4E', '#D97742'],
  },
];

const STORAGE_KEY = 'game_hub_ui_theme';

function isValidTheme(val: string | null): val is ThemeId {
  return THEMES.some((t) => t.id === val);
}

function resolveInitialTheme(): ThemeId {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('theme');
    if (isValidTheme(fromUrl)) return fromUrl;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidTheme(stored)) return stored;
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }
  return 'dark-gaming';
}

interface ThemeContextValue {
  theme: ThemeId;
  themeMeta: ThemeMeta;
  setTheme: (next: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(resolveInitialTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeMeta: THEMES.find((t) => t.id === theme) ?? THEMES[0],
      setTheme: (next) => setThemeState(next),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'dark-gaming',
      themeMeta: THEMES[0],
      setTheme: () => {},
    };
  }
  return ctx;
}

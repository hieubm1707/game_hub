import { useState } from 'react';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { THEMES, useTheme } from '../app/ThemeContext';

export function ThemeSwitcher() {
  const { theme, themeMeta, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <aside
      aria-label="Design style switcher"
      className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]"
    >
      <div className="brutal-panel overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="hub-topbar flex w-full items-center justify-between gap-3 px-3.5 py-2 text-xs font-bold cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            <span>STYLE: {themeMeta.shortName}</span>
          </span>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {open && (
          <div className="p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto w-80 sm:w-[440px]">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  title={`${t.name} — ${t.tagline}`}
                  aria-pressed={active}
                  className={`arcade-btn arcade-btn-sm justify-start px-2.5 py-1.5 text-[11px] ${
                    active ? 'arcade-btn-pink' : 'arcade-btn-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-0.5 shrink-0">
                    {t.swatches.map((hex, i) => (
                      <span
                        key={i}
                        className="inline-block h-2.5 w-2.5 border border-black/60"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </span>
                  <span className="truncate">{t.shortName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

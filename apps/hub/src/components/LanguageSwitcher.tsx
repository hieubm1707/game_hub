import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_LOCALES, useI18n, type SupportedLocale } from '../app/I18nContext';

/** Crisp inline SVG flag icons so flags render consistently across all platforms. */
function LocaleFlag({ code }: { code: SupportedLocale }) {
  switch (code) {
    case 'en':
      return (
        <svg
          viewBox="0 0 24 16"
          aria-hidden="true"
          data-flag="en"
          className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/25"
        >
          <rect width="24" height="16" fill="#FFFFFF" />
          <rect y="0" width="24" height="2.2" fill="#B22234" />
          <rect y="4.6" width="24" height="2.2" fill="#B22234" />
          <rect y="9.2" width="24" height="2.2" fill="#B22234" />
          <rect y="13.8" width="24" height="2.2" fill="#B22234" />
          <rect width="11" height="9.2" fill="#3C3B6E" />
          <circle cx="2.5" cy="2.3" r="0.7" fill="#FFFFFF" />
          <circle cx="5.5" cy="2.3" r="0.7" fill="#FFFFFF" />
          <circle cx="8.5" cy="2.3" r="0.7" fill="#FFFFFF" />
          <circle cx="4" cy="4.6" r="0.7" fill="#FFFFFF" />
          <circle cx="7" cy="4.6" r="0.7" fill="#FFFFFF" />
          <circle cx="2.5" cy="6.9" r="0.7" fill="#FFFFFF" />
          <circle cx="5.5" cy="6.9" r="0.7" fill="#FFFFFF" />
          <circle cx="8.5" cy="6.9" r="0.7" fill="#FFFFFF" />
        </svg>
      );
    case 'vi':
      return (
        <svg
          viewBox="0 0 24 16"
          aria-hidden="true"
          data-flag="vi"
          className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/25"
        >
          <rect width="24" height="16" fill="#DA251D" />
          <polygon
            points="12,3.2 13.35,7.3 17.65,7.3 14.15,9.85 15.5,13.95 12,11.4 8.5,13.95 9.85,9.85 6.35,7.3 10.65,7.3"
            fill="#FFCD00"
          />
        </svg>
      );
    case 'ja':
      return (
        <svg
          viewBox="0 0 24 16"
          aria-hidden="true"
          data-flag="ja"
          className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/25"
        >
          <rect width="24" height="16" fill="#FFFFFF" />
          <circle cx="12" cy="8" r="4.5" fill="#BC002D" />
        </svg>
      );
  }
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeLocale =
    SUPPORTED_LOCALES.find((item) => item.code === locale) ?? SUPPORTED_LOCALES[0]!;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('nav.languageAria')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="arcade-btn arcade-btn-sm arcade-btn-white px-2.5 py-2 text-xs font-bold uppercase"
      >
        <LocaleFlag code={activeLocale.code} />
        <span>{activeLocale.shortLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 stroke-[2.5] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('nav.languageAria')}
          className="brutal-panel absolute right-0 mt-2 z-50 min-w-[172px] p-1.5 space-y-1"
        >
          {SUPPORTED_LOCALES.map((item) => {
            const isSelected = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLocale(item.code);
                  setOpen(false);
                }}
                className={`arcade-btn arcade-btn-sm w-full justify-between px-2.5 py-1.5 text-xs ${
                  isSelected ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
              >
                <span className="inline-flex items-center gap-2 normal-case">
                  <LocaleFlag code={item.code} />
                  <span>{item.nativeLabel}</span>
                </span>
                <span className="font-numeric text-[10px] opacity-80">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

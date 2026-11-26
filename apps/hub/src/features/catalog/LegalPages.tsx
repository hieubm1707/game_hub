import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, FileText, Gamepad2, Info, Mail, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../app/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const SITE_DOMAIN = 'hieutien.life';
const CONTACT_EMAIL = 'tigerstudio2523@gmail.com';

/** Interpolates React nodes into `{token}` placeholders in a translated string. */
function renderTranslatedNodes(template: string, nodes: Record<string, React.ReactNode>) {
  const parts = template.split(/(\{[a-zA-Z0-9_]+\})/g);
  return parts.map((part, index) => {
    const match = part.match(/^\{([a-zA-Z0-9_]+)\}$/);
    if (match && match[1]! in nodes) {
      return <Fragment key={index}>{nodes[match[1]!]}</Fragment>;
    }
    return part;
  });
}

function LegalSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5 border-t-[length:var(--border-w)] hub-divider pt-5">
      <h2 className="text-lg font-bold tracking-tight flex items-baseline gap-2.5">
        <span className="font-numeric text-xs font-bold hub-text-highlight">{number}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-2.5 text-sm leading-relaxed hub-text-muted">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  const { t } = useI18n();
  useDocumentTitle(t('privacy.docTitle'), t('privacy.docDesc'));

  const lastUpdated = t('legal.lastUpdatedLabel', { date: t('legal.lastUpdatedValue') });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('common.backToHome')}
        </Link>
        <Link to="/terms" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3.5 py-1.5 text-xs">
          <FileText className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('legal.termsLink')}
        </Link>
      </div>

      <article className="brutal-panel-lg p-4 sm:p-10 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('legal.badge')}
            </span>
            <span className="font-numeric text-xs font-bold hub-text-muted">{lastUpdated}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{t('privacy.title')}</h1>
          <p className="text-sm leading-relaxed hub-text-muted">{t('privacy.intro')}</p>
        </header>

        <LegalSection number="01" title={t('privacy.s1.title')}>
          <p>{t('privacy.s1.p1')}</p>
          <p>{t('privacy.s1.p2')}</p>
        </LegalSection>

        <LegalSection number="02" title={t('privacy.s2.title')}>
          <p>{t('privacy.s2.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>{t('privacy.s2.item1Title')}</strong>{' '}
              {renderTranslatedNodes(t('privacy.s2.item1Body'), {
                localStorage: <code>localStorage</code>,
                indexedDb: <code>IndexedDB</code>,
              })}
            </li>
            <li>
              <strong>{t('privacy.s2.item2Title')}</strong> {t('privacy.s2.item2Body')}
            </li>
            <li>
              <strong>{t('privacy.s2.item3Title')}</strong> {t('privacy.s2.item3Body')}
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="03" title={t('privacy.s3.title')}>
          <p>
            {renderTranslatedNodes(t('privacy.s3.p1'), {
              siteDomain: SITE_DOMAIN,
              googleAdSense: <strong>Google AdSense</strong>,
            })}
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{t('privacy.s3.item1', { siteDomain: SITE_DOMAIN })}</li>
            <li>{t('privacy.s3.item2')}</li>
            <li>
              {renderTranslatedNodes(t('privacy.s3.item3'), {
                adsSettingsLink: (
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    {t('privacy.s3.adsSettingsLabel')}
                  </a>
                ),
                aboutAdsLink: (
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    {t('privacy.s3.aboutAdsLabel')}
                  </a>
                ),
              })}
            </li>
            <li>
              {renderTranslatedNodes(t('privacy.s3.item4'), {
                googleAdsPolicyLink: (
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    {t('privacy.s3.googleAdsPolicyLabel')}
                  </a>
                ),
              })}
            </li>
          </ul>
          <p>{t('privacy.s3.p2')}</p>
        </LegalSection>

        <LegalSection number="04" title={t('privacy.s4.title')}>
          <p>{t('privacy.s4.p1')}</p>
        </LegalSection>

        <LegalSection number="05" title={t('privacy.s5.title')}>
          <p>{t('privacy.s5.p1')}</p>
        </LegalSection>

        <LegalSection number="06" title={t('privacy.s6.title')}>
          <p>{t('privacy.s6.p1')}</p>
        </LegalSection>

        <LegalSection number="07" title={t('privacy.s7.title')}>
          <p>{t('privacy.s7.p1')}</p>
          <p>{t('privacy.s7.p2')}</p>
        </LegalSection>
      </article>
    </div>
  );
}

export function TermsPage() {
  const { t } = useI18n();
  useDocumentTitle(t('terms.docTitle'), t('terms.docDesc'));

  const lastUpdated = t('legal.lastUpdatedLabel', { date: t('legal.lastUpdatedValue') });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('common.backToHome')}
        </Link>
        <Link
          to="/privacy"
          className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3.5 py-1.5 text-xs"
        >
          <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('legal.privacyLink')}
        </Link>
      </div>

      <article className="brutal-panel-lg p-4 sm:p-10 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-badge-featured inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase">
              <FileText className="h-3.5 w-3.5" />
              {t('legal.badge')}
            </span>
            <span className="font-numeric text-xs font-bold hub-text-muted">{lastUpdated}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{t('terms.title')}</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            {renderTranslatedNodes(t('terms.intro'), {
              privacyLink: (
                <Link to="/privacy" className="underline font-semibold hub-text-highlight">
                  {t('legal.privacyLink')}
                </Link>
              ),
            })}
          </p>
        </header>

        <LegalSection number="01" title={t('terms.s1.title')}>
          <p>{t('terms.s1.p1')}</p>
        </LegalSection>

        <LegalSection number="02" title={t('terms.s2.title')}>
          <p>{t('terms.s2.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{t('terms.s2.item1')}</li>
            <li>{t('terms.s2.item2')}</li>
            <li>{t('terms.s2.item3')}</li>
            <li>{t('terms.s2.item4')}</li>
          </ul>
        </LegalSection>

        <LegalSection number="03" title={t('terms.s3.title')}>
          <p>{t('terms.s3.p1')}</p>
        </LegalSection>

        <LegalSection number="04" title={t('terms.s4.title')}>
          <p>{t('terms.s4.p1')}</p>
        </LegalSection>

        <LegalSection number="05" title={t('terms.s5.title')}>
          <p>{t('terms.s5.p1')}</p>
          <p>{t('terms.s5.p2')}</p>
        </LegalSection>

        <LegalSection number="06" title={t('terms.s6.title')}>
          <p>{t('terms.s6.p1')}</p>
        </LegalSection>

        <LegalSection number="07" title={t('terms.s7.title')}>
          <p>{t('terms.s7.p1')}</p>
        </LegalSection>
      </article>
    </div>
  );
}

export function AboutPage() {
  const { t } = useI18n();
  useDocumentTitle(t('about.docTitle'), t('about.docDesc', { siteDomain: SITE_DOMAIN }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('common.backToHome')}
        </Link>
        <Link
          to="/contact"
          className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3.5 py-1.5 text-xs"
        >
          <Mail className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('legal.contactLink')}
        </Link>
      </div>

      <article className="brutal-panel-lg p-4 sm:p-10 space-y-6">
        <header className="space-y-3">
          <span className="hub-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs uppercase">
            <Info className="h-3.5 w-3.5" />
            {t('about.badge')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{t('about.title')}</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            {renderTranslatedNodes(t('about.intro'), {
              siteDomain: <strong>{SITE_DOMAIN}</strong>,
            })}
          </p>
        </header>

        <LegalSection number="01" title={t('about.s1.title')}>
          <p>{t('about.s1.p1')}</p>
        </LegalSection>

        <LegalSection number="02" title={t('about.s2.title')}>
          <p>{t('about.s2.p1')}</p>
        </LegalSection>

        <LegalSection number="03" title={t('about.s3.title')}>
          <p>
            {renderTranslatedNodes(t('about.s3.p1'), {
              siteDomain: SITE_DOMAIN,
              privacyLink: (
                <Link to="/privacy" className="underline font-semibold">
                  {t('legal.privacyLink')}
                </Link>
              ),
            })}
          </p>
        </LegalSection>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link to="/games" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
            <Gamepad2 className="h-4 w-4 stroke-[2.5]" />
            {t('about.exploreGames')}
          </Link>
          <Link to="/contact" className="arcade-btn arcade-btn-yellow px-5 py-2.5 text-xs">
            <Mail className="h-4 w-4 stroke-[2.5]" />
            {t('about.getInTouch')}
          </Link>
        </div>
      </article>
    </div>
  );
}

export function ContactPage() {
  const { t } = useI18n();
  useDocumentTitle(t('contact.docTitle'), t('contact.docDesc', { siteDomain: SITE_DOMAIN }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('common.backToHome')}
        </Link>
        <Link
          to="/about"
          className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3.5 py-1.5 text-xs"
        >
          <Info className="h-3.5 w-3.5 stroke-[2.5]" />
          {t('legal.aboutLink')}
        </Link>
      </div>

      <article className="brutal-panel-lg p-4 sm:p-10 space-y-6">
        <header className="space-y-3">
          <span className="hub-badge-featured inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase">
            <Mail className="h-3.5 w-3.5" />
            {t('contact.badge')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{t('contact.title')}</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            {renderTranslatedNodes(t('contact.intro'), {
              siteDomain: <strong>{SITE_DOMAIN}</strong>,
            })}
          </p>
        </header>

        <LegalSection number="01" title={t('contact.s1.title')}>
          <p>
            {renderTranslatedNodes(t('contact.s1.p1'), {
              emailLink: (
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-numeric font-bold underline hub-text-highlight break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              ),
            })}
          </p>
          <p>{t('contact.s1.p2')}</p>
        </LegalSection>

        <LegalSection number="02" title={t('contact.s2.title')}>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>{t('contact.s2.item1Title')}</strong> {t('contact.s2.item1Body')}
            </li>
            <li>
              <strong>{t('contact.s2.item2Title')}</strong>{' '}
              {renderTranslatedNodes(t('contact.s2.item2Body'), {
                privacyLink: (
                  <Link to="/privacy" className="underline font-semibold">
                    {t('legal.privacyLink')}
                  </Link>
                ),
              })}
            </li>
            <li>
              <strong>{t('contact.s2.item3Title')}</strong>{' '}
              {t('contact.s2.item3Body', { siteDomain: SITE_DOMAIN })}
            </li>
          </ul>
        </LegalSection>
      </article>
    </div>
  );
}

export function NotFoundPage() {
  const { t } = useI18n();
  useDocumentTitle(t('legal.notFoundTitle'));
  return (
    <div className="mx-auto max-w-2xl">
      <div className="brutal-panel-lg p-8 sm:p-12 text-center space-y-5">
        <span className="hub-badge inline-flex items-center gap-1.5 px-3 py-1 font-numeric text-xs font-bold uppercase">
          <Compass className="h-3.5 w-3.5" />
          {t('legal.notFoundBadge')}
        </span>
        <h1 className="text-3xl font-bold tracking-tight">{t('legal.notFoundTitle')}</h1>
        <p className="text-sm leading-relaxed hub-text-muted">{t('legal.notFoundDesc')}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
            {t('common.backToHome')}
          </Link>
          <Link to="/games" className="arcade-btn arcade-btn-yellow px-5 py-2.5 text-xs">
            {t('common.browseGames')}
          </Link>
        </div>
      </div>
    </div>
  );
}

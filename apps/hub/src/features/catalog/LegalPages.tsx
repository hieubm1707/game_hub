import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, FileText, Gamepad2, Info, Mail, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../app/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const SITE_DOMAIN = 'hieutien.life';
const CONTACT_EMAIL = 'contact@hieutien.life';
const LAST_UPDATED = 'November 2026';

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
  useDocumentTitle(
    'Privacy Policy',
    'Learn how Game Hub handles browser storage, technical data, third-party links, and user privacy.'
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          Back to Home
        </Link>
        <Link to="/terms" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3.5 py-1.5 text-xs">
          <FileText className="h-3.5 w-3.5 stroke-[2.5]" />
          Terms of Use
        </Link>
      </div>

      <article className="brutal-panel-lg p-6 sm:p-10 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Legal Document
            </span>
            <span className="font-numeric text-xs font-bold hub-text-muted">
              Last Updated: {LAST_UPDATED}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            This Privacy Policy explains how Game Hub (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;the Platform&rdquo;) collects, uses, stores, and protects information when you
            visit our website, browse our catalog, or play games accessible through Game Hub.
          </p>
        </header>

        <LegalSection number="01" title="Scope & Platform Access">
          <p>
            Game Hub provides browser-based access to a curated catalog of games and optional links
            to native mobile applications. Public visitors may browse the catalog and launch
            available web games without creating an account.
          </p>
          <p>
            This policy applies to the Game Hub website and web player shell. Individual games or
            native mobile applications distributed via third-party app stores (such as Google Play
            or the Apple App Store) may be governed by additional privacy disclosures provided by
            their respective developers or store platforms.
          </p>
        </LegalSection>

        <LegalSection number="02" title="Information We Collect">
          <p>Depending on how you interact with Game Hub, the following categories of data may be processed:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Browser &amp; Local Storage Data:</strong> Preferences such as selected visual
              theme, cached catalog entries, prompt dismissals, and local gameplay progress (e.g.,
              high scores or session settings) may be saved directly on your device using{' '}
              <code>localStorage</code> or <code>IndexedDB</code>.
            </li>
            <li>
              <strong>Technical &amp; Diagnostic Data:</strong> Standard web hosting and delivery
              infrastructure may process technical metadata—such as IP address, browser type,
              operating system, screen viewport, referring URL, and error logs—to deliver content
              reliably and protect against abuse.
            </li>
            <li>
              <strong>Online Features &amp; Accounts (Where Applicable):</strong> Certain games or
              future platform features (such as leaderboards, multiplayer sessions, cloud saves, or
              administrator sign-in) may require authentication or network communication to function.
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="03" title="Cookies, Analytics & Google AdSense">
          <p>
            We use essential browser storage to remember your interface preferences and keep the
            platform responsive. To support hosting and ongoing development, Game Hub ({SITE_DOMAIN})
            displays third-party advertisements served by <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s
              prior visits to {SITE_DOMAIN} or other websites on the Internet.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables Google and its partners to serve ads
              to you based on your visit to this site and/or other sites on the Internet.
            </li>
            <li>
              You may opt out of personalized advertising at any time by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Google Ads Settings
              </a>
              , or opt out of third-party vendor cookies for personalized advertising at{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                www.aboutads.info
              </a>
              .
            </li>
            <li>
              Learn more about how Google uses data from partner sites in{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Google Advertising Privacy &amp; Terms
              </a>
              .
            </li>
          </ul>
          <p>
            Where required by regional privacy regulations (such as in the EEA, UK, or Switzerland),
            consent choices are presented before personalized ad cookies are used.
          </p>
        </LegalSection>

        <LegalSection number="04" title="Embedded Games & Third-Party Links">
          <p>
            Games played on Game Hub may be loaded from trusted external origins inside a sandboxed
            iframe, and game detail pages may link to external app stores or developer websites. We
            do not control the privacy practices of third-party websites or app stores and encourage
            you to review their policies before sharing personal information.
          </p>
        </LegalSection>

        <LegalSection number="05" title="Data Retention & Your Controls">
          <p>
            Data stored locally in your browser remains on your device until you clear your browser
            storage or site data. You can manage or block cookies and site storage at any time
            through your browser settings, though disabling local storage may reset saved game
            progress or interface preferences.
          </p>
        </LegalSection>

        <LegalSection number="06" title="Children's Privacy">
          <p>
            Game Hub is designed for a general audience. We do not knowingly collect personally
            identifiable contact information from children under the age of 13 (or the minimum age
            of digital consent in your jurisdiction) without verifiable parental consent. If you
            believe personal data has been provided inadvertently, please contact the platform
            administrator for prompt removal.
          </p>
        </LegalSection>

        <LegalSection number="07" title="Security & Policy Updates">
          <p>
            We implement reasonable technical and organizational safeguards—including HTTPS
            transport, strict origin validation for embedded games, and role-based access controls
            for administrative tools—to protect the platform.
          </p>
          <p>
            We may revise this Privacy Policy periodically to reflect new features, games, or legal
            requirements. Updates take effect when posted on this page with a revised &ldquo;Last
            Updated&rdquo; date.
          </p>
        </LegalSection>
      </article>
    </div>
  );
}

export function TermsPage() {
  useDocumentTitle(
    'Terms of Use',
    'Terms and conditions governing your access to and use of the Game Hub platform and games.'
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          Back to Home
        </Link>
        <Link to="/privacy" className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3.5 py-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
          Privacy Policy
        </Link>
      </div>

      <article className="brutal-panel-lg p-6 sm:p-10 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-badge-featured inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase">
              <FileText className="h-3.5 w-3.5" />
              Legal Document
            </span>
            <span className="font-numeric text-xs font-bold hub-text-muted">
              Last Updated: {LAST_UPDATED}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            Please read these Terms of Use carefully before accessing or using Game Hub. By
            browsing the site or launching any game on the platform, you agree to be bound by these
            Terms and our{' '}
            <Link to="/privacy" className="underline font-semibold hub-text-highlight">
              Privacy Policy
            </Link>
            .
          </p>
        </header>

        <LegalSection number="01" title="Use of the Platform">
          <p>
            Game Hub grants you a limited, non-exclusive, non-transferable, and revocable license
            to access the website and play available games for your personal use. We reserve the
            right to add, modify, suspend, or discontinue any game, feature, or section of the
            platform at any time without liability or prior notice.
          </p>
        </LegalSection>

        <LegalSection number="02" title="Acceptable Conduct">
          <p>When using Game Hub, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Attempt to bypass security controls, probe administrative endpoints, or gain
              unauthorized access to platform infrastructure or accounts.
            </li>
            <li>
              Use automated bots, scrapers, or denial-of-service techniques that degrade platform
              availability for other users.
            </li>
            <li>
              Exploit bugs, tamper with game clients or multiplayer services, or inject malicious
              scripts into embedded sessions.
            </li>
            <li>
              Redistribute, resell, or frame the Game Hub platform or hosted game assets without
              explicit authorization from the respective rights holders.
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="03" title="Intellectual Property">
          <p>
            All platform interfaces, branding, text, graphics, and software are owned by Game Hub
            or its licensors. Individual games, titles, artwork, audio, and trademarks remain the
            intellectual property of their respective developers and publishers. Nothing in these
            Terms transfers ownership of any intellectual property rights to you.
          </p>
        </LegalSection>

        <LegalSection number="04" title="Third-Party Services, Stores & Monetization">
          <p>
            Game Hub may display advertisements, promotional placements, or links to third-party
            app stores (including Google Play and the Apple App Store) and external services. Any
            downloads, in-app purchases, subscriptions, or interactions conducted through third-party
            platforms are governed solely by the terms and policies of those third parties.
          </p>
        </LegalSection>

        <LegalSection number="05" title="Disclaimer of Warranties">
          <p>
            Game Hub and all games accessible through the platform are provided on an &ldquo;AS
            IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether
            express or implied, including implied warranties of merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
          <p>
            We do not guarantee uninterrupted availability, error-free gameplay, or the permanent
            preservation of locally stored browser progress or scores.
          </p>
        </LegalSection>

        <LegalSection number="06" title="Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, Game Hub and its operators shall not
            be liable for any indirect, incidental, special, consequential, or punitive damages—or
            any loss of data, scores, or device functionality—arising out of or related to your use
            of, or inability to use, the platform or any linked third-party games.
          </p>
        </LegalSection>

        <LegalSection number="07" title="Changes to These Terms">
          <p>
            We may update these Terms of Use from time to time. Any revisions will be posted on
            this page with an updated effective date. Your continued use of Game Hub after changes
            are posted constitutes acceptance of the revised Terms.
          </p>
        </LegalSection>
      </article>
    </div>
  );
}

export function AboutPage() {
  useDocumentTitle(
    'About Game Hub',
    'About Game Hub (hieutien.life) — handcrafted offline-first puzzle and strategy games playable directly in your browser.'
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          Back to Home
        </Link>
        <Link to="/contact" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3.5 py-1.5 text-xs">
          <Mail className="h-3.5 w-3.5 stroke-[2.5]" />
          Contact Us
        </Link>
      </div>

      <article className="brutal-panel-lg p-6 sm:p-10 space-y-6">
        <header className="space-y-3">
          <span className="hub-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs uppercase">
            <Info className="h-3.5 w-3.5" />
            About
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About Game Hub</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            Game Hub (<strong>{SITE_DOMAIN}</strong>) is an independent browser gaming portal
            dedicated to original, thoughtfully designed puzzle, logic, and strategy games built
            with Flutter for the web and mobile devices.
          </p>
        </header>

        <LegalSection number="01" title="Our Mission">
          <p>
            We focus on clean, focused gameplay sessions that start immediately in any modern
            desktop or mobile browser. Every game in our catalog is crafted to be easy to learn,
            challenging to master, and playable without mandatory registration or login walls.
          </p>
        </LegalSection>

        <LegalSection number="02" title="Offline-First & Local Progress">
          <p>
            Our titles are engineered with an offline-first architecture: levels and core puzzle
            packs are bundled directly with each game, and your progress, scores, and visual
            preferences are saved locally on your device. Many games also offer companion native
            apps on Google Play and the Apple App Store for full offline mobile play.
          </p>
        </LegalSection>

        <LegalSection number="03" title="How We Keep Game Hub Free">
          <p>
            All browser games on {SITE_DOMAIN} are free to play. To cover static hosting, domain
            maintenance, and ongoing game development, the portal may display clearly separated
            advertising through Google AdSense in accordance with our{' '}
            <Link to="/privacy" className="underline font-semibold">
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link to="/games" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
            <Gamepad2 className="h-4 w-4 stroke-[2.5]" />
            Explore All Games
          </Link>
          <Link to="/contact" className="arcade-btn arcade-btn-yellow px-5 py-2.5 text-xs">
            <Mail className="h-4 w-4 stroke-[2.5]" />
            Get in Touch
          </Link>
        </div>
      </article>
    </div>
  );
}

export function ContactPage() {
  useDocumentTitle(
    'Contact Us',
    'Contact the Game Hub team at hieutien.life for player support, bug reports, privacy questions, or copyright inquiries.'
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          Back to Home
        </Link>
        <Link to="/about" className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3.5 py-1.5 text-xs">
          <Info className="h-3.5 w-3.5 stroke-[2.5]" />
          About Game Hub
        </Link>
      </div>

      <article className="brutal-panel-lg p-6 sm:p-10 space-y-6">
        <header className="space-y-3">
          <span className="hub-badge-featured inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase">
            <Mail className="h-3.5 w-3.5" />
            Support &amp; Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-sm leading-relaxed hub-text-muted">
            Have feedback on a game, found a bug, or need to reach us regarding privacy,
            advertising, or intellectual property on <strong>{SITE_DOMAIN}</strong>? We welcome
            your message.
          </p>
        </header>

        <LegalSection number="01" title="Direct Email">
          <p>
            You can reach the Game Hub team directly by email at:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-numeric font-bold underline hub-text-highlight"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            We typically respond to player support and policy inquiries within 2–3 business days.
          </p>
        </LegalSection>

        <LegalSection number="02" title="What to Include in Your Message">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Bug Reports:</strong> The game title, your browser/device type, and a short
              description of what happened.
            </li>
            <li>
              <strong>Privacy &amp; Ad Preferences:</strong> Questions regarding our{' '}
              <Link to="/privacy" className="underline font-semibold">
                Privacy Policy
              </Link>{' '}
              or cookie/advertising disclosures.
            </li>
            <li>
              <strong>Copyright / DMCA Notices:</strong> The exact page URL on {SITE_DOMAIN},
              details of the content in question, and your contact information.
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
        <p className="text-sm leading-relaxed hub-text-muted">
          {t('legal.notFoundDesc')}
        </p>
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

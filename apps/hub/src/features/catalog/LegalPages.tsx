import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function PrivacyPage() {
  useDocumentTitle('Privacy Policy');
  return (
    <article className="brutal-panel-lg max-w-3xl p-6 sm:p-8 space-y-4">
      <div className="hub-badge px-2.5 py-0.5 text-xs uppercase">// LEGAL</div>
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-sm font-medium leading-relaxed">
        Game Hub is a nonprofit platform. Public visitors are never required to create accounts or sign in.
      </p>
      <p className="text-sm font-medium leading-relaxed">
        Game progress, high scores, and install prompt dismissals are stored locally in your browser (IndexedDB / localStorage) and are never uploaded to Firebase.
      </p>
    </article>
  );
}

export function TermsPage() {
  useDocumentTitle('Terms of Use');
  return (
    <article className="brutal-panel-lg max-w-3xl p-6 sm:p-8 space-y-4">
      <div className="hub-badge-featured inline-block px-2.5 py-0.5 text-xs font-bold uppercase">
        // LEGAL
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
      <p className="text-sm font-medium leading-relaxed">
        Game Hub provides free browser access to offline-first Flutter games on an as-is basis for nonprofit entertainment and education.
      </p>
    </article>
  );
}

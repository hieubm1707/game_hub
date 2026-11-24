import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function PrivacyPage() {
  useDocumentTitle('Privacy Policy');
  return (
    <article className="prose prose-invert max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
      <p className="text-slate-300">
        Game Hub is a nonprofit platform. Public visitors are never required to create accounts or sign in.
      </p>
      <p className="text-slate-300">
        Game progress, high scores, and install prompt dismissals are stored locally in your browser (IndexedDB / localStorage) and are never uploaded to Firebase.
      </p>
      <p className="text-slate-300">
        Web gameplay and the Game Hub website contain zero advertisements and zero third-party ad trackers. Native mobile apps may display platform advertisements per their individual store listings.
      </p>
    </article>
  );
}

export function TermsPage() {
  useDocumentTitle('Terms of Use');
  return (
    <article className="prose prose-invert max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-white">Terms of Use</h1>
      <p className="text-slate-300">
        Game Hub provides free browser access to offline-first Flutter games on an as-is basis for nonprofit entertainment and education.
      </p>
    </article>
  );
}

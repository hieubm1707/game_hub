import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../authentication/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminLoginPage() {
  useDocumentTitle('Admin Login');
  const { admin, loading, error, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await loginWithEmail(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center arcade-bg px-4">
      <div className="w-full max-w-md brutal-panel-lg overflow-hidden">
        <div className="hub-topbar px-6 py-4 flex items-center gap-2.5">
          <Shield className="h-6 w-6 hub-topbar-accent stroke-[2.5]" />
          <h1 className="text-xl font-bold tracking-tight">Game Hub Admin</h1>
        </div>

        <div className="p-6 sm:p-8">
          <p className="hub-alert-info px-3 py-2 font-numeric text-xs font-bold">
            Authorized administrators only. Public registration is disabled.
          </p>

          {(error || submitError) && (
            <div className="mt-4 hub-alert-error p-3 font-numeric text-xs font-bold">
              {submitError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-numeric text-xs font-bold uppercase"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gamehub.local"
                className="arcade-input mt-1.5"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block font-numeric text-xs font-bold uppercase"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="arcade-input mt-1.5"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="arcade-btn arcade-btn-pink w-full px-4 py-3 text-sm mt-2"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getHubAuth, getHubFirestore } from '../../firebase/client';

export interface AdminProfile {
  uid: string;
  email: string | null;
  role: 'owner' | 'editor';
  enabled: boolean;
}

export interface AuthContextValue {
  user: User | null;
  admin: AdminProfile | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  mockAdmin,
  children,
}: {
  mockAdmin?: AdminProfile | null;
  children: React.ReactNode;
}) {
  const resolvedMockAdmin =
    import.meta.env.MODE === 'test' || import.meta.env.DEV ? mockAdmin : undefined;

  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(resolvedMockAdmin ?? null);
  const [loading, setLoading] = useState(resolvedMockAdmin === undefined);
  const [error, setError] = useState<string | null>(null);
  const authCheckSeqRef = useRef(0);

  useEffect(() => {
    if (resolvedMockAdmin !== undefined) return;
    const auth = getHubAuth();
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      const seq = ++authCheckSeqRef.current;
      setUser(nextUser);
      setError(null);
      if (!nextUser) {
        setAdmin(null);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(getHubFirestore(), 'admins', nextUser.uid));
        if (seq !== authCheckSeqRef.current) return;
        const data = snap.exists()
          ? (snap.data() as { role?: 'owner' | 'editor'; enabled?: boolean })
          : null;
        if (data && data.enabled === true && (data.role === 'owner' || data.role === 'editor')) {
          setAdmin({
            uid: nextUser.uid,
            email: nextUser.email,
            role: data.role,
            enabled: true,
          });
        } else {
          setAdmin(null);
          setUser(null);
          setError('Access denied. This account is not authorized for admin access.');
          await signOut(auth).catch(() => {});
        }
      } catch {
        if (seq !== authCheckSeqRef.current) return;
        setAdmin(null);
        setError('Failed to verify administrator privileges.');
      } finally {
        if (seq === authCheckSeqRef.current) {
          setLoading(false);
        }
      }
    });
    return unsub;
  }, [resolvedMockAdmin]);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    const auth = getHubAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (resolvedMockAdmin !== undefined) {
      setAdmin(null);
      return;
    }
    await signOut(getHubAuth());
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, error, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(mockAdmin ?? null);
  const [loading, setLoading] = useState(mockAdmin === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mockAdmin !== undefined) return;
    const auth = getHubAuth();
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setError(null);
      if (!nextUser) {
        setAdmin(null);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(getHubFirestore(), 'admins', nextUser.uid));
        if (snap.exists()) {
          const data = snap.data() as { role?: 'owner' | 'editor'; enabled?: boolean };
          if (data.enabled === true && (data.role === 'owner' || data.role === 'editor')) {
            setAdmin({
              uid: nextUser.uid,
              email: nextUser.email,
              role: data.role,
              enabled: true,
            });
          } else {
            setAdmin(null);
            setError('Your administrator account is disabled.');
          }
        } else {
          setAdmin(null);
          setError('Authenticated user is not an authorized administrator.');
        }
      } catch (e) {
        setAdmin(null);
        setError(e instanceof Error ? e.message : 'Failed to verify administrator privileges.');
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [mockAdmin]);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    const auth = getHubAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (mockAdmin !== undefined) {
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

/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, TOKEN_KEY } from '../lib/api';

interface Session {
  idUsuario: number;
  email: string;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nomeCompleto: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(token: string | null): Session | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      sub: number;
      email: string;
      exp: number;
    };
    if (payload.exp * 1000 <= Date.now()) return null;
    return { idUsuario: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() =>
    readSession(localStorage.getItem(TOKEN_KEY)),
  );
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  };

  useEffect(() => {
    window.addEventListener('sgcursos:unauthorized', logout);
    return () => window.removeEventListener('sgcursos:unauthorized', logout);
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const result = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });
      localStorage.setItem(TOKEN_KEY, result.accessToken);
      setSession(readSession(result.accessToken));
    } finally {
      setLoading(false);
    }
  };

  const register = async (nomeCompleto: string, email: string, senha: string) => {
    setLoading(true);
    try {
      await api('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ nomeCompleto, email, senha }),
      });
      const result = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });
      localStorage.setItem(TOKEN_KEY, result.accessToken);
      setSession(readSession(result.accessToken));
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ session, loading, login, register, logout }),
    [session, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}

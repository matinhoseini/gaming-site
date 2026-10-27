import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchMe, loginRequest } from "./api";
import type { User } from "./api";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session after a page refresh
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const tokens = await loginRequest(username, password);
    localStorage.setItem(TOKEN_KEY, tokens.access);
    setUser(await fetchMe(tokens.access));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
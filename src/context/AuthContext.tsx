"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "customer" | "artisan" | null;

interface AuthState {
  loggedIn: boolean;
  role: Role;
  id?: number;
  name?: string;
  email?: string;
}

type AuthenticatedUser = { id: number; fullName: string; email: string; role: "CUSTOMER" | "ARTISAN" | "ADMIN" };

interface AuthContextValue {
  authState: AuthState;
  isLoading: boolean;
  login: (user: AuthenticatedUser) => void;
  updateProfile: (user: Pick<AuthState, "name" | "email">) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAuthState(user: AuthenticatedUser): AuthState {
  return {
    loggedIn: true,
    id: user.id,
    name: user.fullName,
    email: user.email,
    role: user.role === "ARTISAN" ? "artisan" : user.role === "CUSTOMER" ? "customer" : null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ loggedIn: false, role: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const { user } = await response.json() as { user: AuthenticatedUser };
          setAuthState(toAuthState(user));
        }
      } catch {
        // Keep the user signed out when the session cannot be verified.
      } finally {
        setIsLoading(false);
      }
    };
    void loadSession();
  }, []);

  const login = (user: AuthenticatedUser) => setAuthState(toAuthState(user));

  const updateProfile = (user: Pick<AuthState, "name" | "email">) => {
    setAuthState((current) => ({ ...current, ...user }));
  };

 const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    setAuthState({
      loggedIn: false,
      role: null,
    });
  }
}; 

  const value = useMemo(() => ({ authState, isLoading, login, updateProfile, logout }), [authState, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserRole = "ADMIN" | "CUSTOMER" | string;

type AuthUser = {
  token: string;
  role: UserRole;
  userId: number;
  fullName: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: AuthUser) => void;
  logout: () => void;
  refreshFromStorage: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("me");

    if (!token || !raw) return null;

    const parsed = JSON.parse(raw);

    return {
      token,
      role: parsed.role,
      userId: parsed.userId,
      fullName: parsed.fullName,
      email: parsed.email,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshFromStorage = useCallback(() => {
    const stored = readStoredUser();
    setUser(stored);
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const login = useCallback((data: AuthUser) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("me", JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token: user?.token || null,
      isAuthenticated: !!user?.token,
      isAdmin: user?.role === "ADMIN",
      login,
      logout,
      refreshFromStorage,
    }),
    [user, login, logout, refreshFromStorage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

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

function parseJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

function getTokenExpiryMs(token: string) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000;
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("me");
}

function readStoredUser(): AuthUser | null {
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("me");

    if (!token || !raw) return null;

    if (isTokenExpired(token)) {
      clearStoredAuth();
      return null;
    }

    const parsed = JSON.parse(raw);

    return {
      token,
      role: parsed.role,
      userId: parsed.userId,
      fullName: parsed.fullName,
      email: parsed.email,
    };
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const didMountRef = useRef(false);

  const refreshFromStorage = useCallback(() => {
    const stored = readStoredUser();
    setUser(stored);
  }, []);

  const login = useCallback((data: AuthUser) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("me", JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    if (!user?.token) return;

    if (isTokenExpired(user.token)) {
      logout();
      if (didMountRef.current) {
        toast.error("Session expired. Please log in again.");
      }
      return;
    }

    const expiryMs = getTokenExpiryMs(user.token);
    const delay = expiryMs - Date.now();

    if (delay <= 0) {
      logout();
      if (didMountRef.current) {
        toast.error("Session expired. Please log in again.");
      }
      return;
    }

    const timer = window.setTimeout(() => {
      logout();
      toast.error("Session expired. Please log in again.");
    }, delay);

    return () => window.clearTimeout(timer);
  }, [user, logout]);

  useEffect(() => {
    didMountRef.current = true;
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
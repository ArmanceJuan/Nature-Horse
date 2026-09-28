import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import type { AuthUser } from "../types/auth.types.js";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  refresh: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AUTH_PAGES = ["/login", "/register"];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const inFlightRef = useRef<Promise<AuthUser | null> | null>(null);
  const previousPathRef = useRef(location.pathname);

  const refresh = useCallback((): Promise<AuthUser | null> => {
    if (inFlightRef.current === null) {
      inFlightRef.current = authApi
        .me()
        .then((currentUser: AuthUser) => {
          setUser(currentUser);
          setStatus("authenticated");
          return currentUser;
        })
        .catch(() => {
          setUser(null);
          setStatus("anonymous");
          return null;
        })
        .finally(() => {
          inFlightRef.current = null;
        });
    }

    return inFlightRef.current;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}

    setUser(null);
    setStatus("anonymous");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = location.pathname;

    if (
      previousPath !== location.pathname &&
      AUTH_PAGES.includes(previousPath)
    ) {
      void refresh();
    }
  }, [location.pathname, refresh]);

  const value = useMemo(
    () => ({ user, status, refresh, logout }),
    [user, status, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

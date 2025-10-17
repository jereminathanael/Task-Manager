import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // saat React load, mengecek apakah ada session
  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/me");
        if (res.loggedIn) {
          setUser(res.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    const res = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await apiFetch("/logout", { method: "POST" });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

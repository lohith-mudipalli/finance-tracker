import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, consider user "logged in" (basic approach)
    // Later we can add /me endpoint to validate token.
    if (token) {
      const savedEmail = localStorage.getItem("email");
      setUser(savedEmail ? { email: savedEmail } : { email: "user" });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  async function register(email, password) {
    const data = await registerUser(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.user.email);
  }

  async function login(email, password) {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.user.email);
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

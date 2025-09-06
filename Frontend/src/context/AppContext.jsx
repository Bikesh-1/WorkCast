// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api/v1/users";

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/current-user`, {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data.data); 
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.data);
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  // ✅ Login function
  const login = async (formData) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.data.user);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, loading, login, signup, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

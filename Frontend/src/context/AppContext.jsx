import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:3000/api/v1/users",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/current-user");
      setUser(data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await api.post("/login", formData);
      setUser(data.data.user);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const signup = async (formData) => {
    try {
      const { data } = await api.post("/register", formData);
      setUser(data.data.user);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

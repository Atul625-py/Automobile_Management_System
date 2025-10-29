// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const verified = localStorage.getItem("isVerified") === "true";
    setUserRole("admin");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setIsVerified(verified);
    }
  }, []);

  // Login function
  const login = (token, role, verified = false, userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("isVerified", verified);

    setIsAuthenticated(true);
    setUserRole(role);
    setIsVerified(verified);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isVerified");

    setIsAuthenticated(false);
    setIsVerified(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerified,
        userRole,
        user,
        login,
        logout,
        setIsVerified, // in case verification updates later
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

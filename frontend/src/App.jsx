import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { AuthProvider } from "./components/context/AuthContext";
import RemoveManager from "./removal/Manager/RemoveManager";
import RemoveCustomer from "./removal/Customer/RemoveCustomer";
import Mechanics from "./components/Mechanics/Mechanics";
import Services from "./components/services/Services";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <AuthProvider>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={setIsLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login onLogin={setIsLoggedIn} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/mechanics" element={<Mechanics></Mechanics>} />
          <Route path="/services" element={<Services></Services>} />
          <Route
            path="/remove-customer"
            element={<RemoveCustomer></RemoveCustomer>}
          />
          <Route
            path="/remove-manager"
            element={<RemoveManager></RemoveManager>}
          />
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { AuthProvider } from "./components/context/AuthContext";
import RemoveManager from "./components/removal/Manager/RemoveManager";
import RemoveCustomer from "./components/removal/Customer/RemoveCustomer";
import RegisterCustomer from "./components/Auth/RegisterCustomer";
import ServiceAssignment from "./components/services/ServiceAssignment";
import InventoryPage from "./components/inventory/InventoryPage";
import MechanicsPage from "./components/mechanics/MechanicsPage";
import AddMechanic from "./components/mechanics/AddMechanic";
import ShowCustomers from "./components/removal/Customer/ShowCustomers";
import CustomerDetail from "./components/removal/Customer/CustomerDetail";
import ShowManagers from "./components/removal/Manager/ShowManagers";
import ManagerDetails from "./components/removal/Manager/ManagerDetails";
import AddVehicle from "./components/veichles/AddVehicle";

// 🆕 Newly added components

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

          {/* Authentication */}
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

          {/* Mechanics */}
          <Route path="/mechanics" element={<MechanicsPage />} />
          <Route path="/addmechanic" element={<AddMechanic />} />

          {/* Services */}
          <Route path="/add-services" element={<ServiceAssignment />} />

          {/* Customers */}
          <Route path="/add-customer" element={<RegisterCustomer />} />
          <Route path="/remove-customer" element={<RemoveCustomer />} />

          {/* ADMIN Features */}
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/remove-Manager" element={<RemoveManager />} />

          {/* 🆕 New Routes for Viewing */}
          <Route
            path="/show-customers"
            element={<ShowCustomers></ShowCustomers>}
          />
          <Route path="/add-veichles" element={<AddVehicle></AddVehicle>} />
          {/* <Route
            path="/show-managers"
            element={<ShowM}
          /> */}
          <Route
            path="/customer/:id"
            element={<CustomerDetail></CustomerDetail>}
          />
          <Route
            path="/show-managers"
            element={<ShowManagers></ShowManagers>}
          />
          <Route
            path="/Manager/:id"
            element={<ManagerDetails></ManagerDetails>}
          />
          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

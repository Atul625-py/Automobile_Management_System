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
import OngoingServices from "./components/services/OngoingServices";
import CompletedServices from "./components/services/CompletedServices";
import InvoicePage from "./components/invoice/InvoicePage";
import AllAppointments from "./components/services/AllAppointments";
import EditAppointment from "./components/services/EditAppointment";
import AddService from "./components/services/AddService";
import AppointmentDetail from "./components/appointmentDetail/AppointmentDetail";

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
          <Route path="/register" element={<Register />} />

          {/* Mechanics */}
          <Route path="/mechanics" element={<MechanicsPage />} />
          <Route path="/addmechanic" element={<AddMechanic />} />

          {/* Services */}
          <Route path="/add-appointment-page" element={<ServiceAssignment />} />

          {/* Customers */}
          <Route path="/add-customer" element={<RegisterCustomer />} />
          <Route path="/remove-customer" element={<RemoveCustomer />} />

          {/* ADMIN Features */}
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/remove-managers" element={<RemoveManager />} />

          {/* 🆕 New Routes for Viewing */}
          <Route
            path="/show-customers"
            element={<ShowCustomers></ShowCustomers>}
          />
          <Route path="/add-services" element={<AddService></AddService>} />
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
          <Route
            path="/ongoing-services"
            element={<OngoingServices></OngoingServices>}
          />
          <Route
            path="/completed-services"
            element={<CompletedServices></CompletedServices>}
          />
          <Route
            path="/invoice/generate/:id"
            element={<InvoicePage mode="generate" />}
          />
          <Route
            path="/invoice/view/:id"
            element={<InvoicePage mode="view" />}
          />
          <Route
            path="/invoice/edit/:id"
            element={<InvoicePage mode="edit" />}
          />
          <Route
            path="all-appointments"
            element={<AllAppointments></AllAppointments>}
          />
          <Route
            path="/edit-appointment/:id"
            element={<EditAppointment></EditAppointment>}
          />
          <Route
            path="/appointment-details/:id"
            element={<AppointmentDetail></AppointmentDetail>}
          />
          <Route
            path="/invoice/:appointmentId"
            element={<InvoicePage></InvoicePage>}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

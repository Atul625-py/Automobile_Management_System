// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);

  const [showCustomerMenu, setShowCustomerMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppointmentMenu, setShowAppointmentMenu] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [showInvoiceMenu, setShowInvoiceMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="'/" className={styles.logo}>
        {" "}
        RKVK Automobiles
      </Link>

      <div className={styles.navLinks}>
        {/* Customer Dropdown */}
        {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setShowCustomerMenu(true)}
            onMouseLeave={() => setShowCustomerMenu(false)}
          >
            <span className={styles.navLink}>Customer ▾</span>
            {showCustomerMenu && (
              <div className={styles.dropdown}>
                <Link to="/add-customer" className={styles.dropdownItem}>
                  Add Customer
                </Link>
                <Link to="/show-customers" className={styles.dropdownItem}>
                  Show Customers
                </Link>
              </div>
            )}
          </div>
        )}

        {/* User Dropdown (Admin only) */}
        {userRole === "ADMIN" && (
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <span className={styles.navLink}>User ▾</span>
            {showUserMenu && (
              <div className={styles.dropdown}>
                <Link to="/register" className={styles.dropdownItem}>
                  Add User
                </Link>
                <Link to="/show-managers" className={styles.dropdownItem}>
                  Show Users
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Appointment Dropdown */}
        {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setShowAppointmentMenu(true)}
            onMouseLeave={() => setShowAppointmentMenu(false)}
          >
            <span className={styles.navLink}>Appointment ▾</span>
            {showAppointmentMenu && (
              <div className={styles.dropdown}>
                <Link
                  to="/add-appointment-page"
                  className={styles.dropdownItem}
                >
                  Add Appointment
                </Link>
                <Link to="/all-appointments" className={styles.dropdownItem}>
                  All Appointments
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Vehicle */}
        {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
          <>
            <Link to="/add-veichles" className={styles.navLink}>
              Vehicle
            </Link>
            <Link to="/mechanics" className={styles.navLink}>
              Mechanics
            </Link>
          </>
        )}

        {/* Inventory */}
        {userRole === "ADMIN" && (
          <Link to="/inventory" className={styles.navLink}>
            Inventory
          </Link>
        )}

        {/* Service Dropdown */}
        {userRole === "ADMIN" && (
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setShowServiceMenu(true)}
            onMouseLeave={() => setShowServiceMenu(false)}
          >
            <span className={styles.navLink}>Service ▾</span>
            {showServiceMenu && (
              <div className={styles.dropdown}>
                <Link to="/add-services" className={styles.dropdownItem}>
                  Add Service
                </Link>
                <Link to="/view-services" className={styles.dropdownItem}>
                  View Services
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Invoice Dropdown */}
        {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setShowInvoiceMenu(true)}
            onMouseLeave={() => setShowInvoiceMenu(false)}
          >
            <span className={styles.navLink}>Invoice ▾</span>
            {showInvoiceMenu && (
              <div className={styles.dropdown}>
                <Link to="/all-invoices" className={styles.dropdownItem}>
                  View All Invoices
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mechanics */}

        {/* Login / Logout */}
        {isAuthenticated ? (
          <button className={styles.button} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className={styles.button}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isVerified, logout, userRole } =
    useContext(AuthContext);

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>RKVK Automobiles</div>
      <div className={styles.navLinks}>
        {/* Profile Dropdown */}
        <div
          className={styles.userIconContainer}
          onClick={() => setShowMenu(!showMenu)}
        >
          <CgProfile className={styles.userIcon} />
          {isVerified && <span className={styles.verifiedTick}>✅</span>}
          {showMenu && (
            <div className={styles.dropdown}>
              {/* RECEPTIONIST / ADMIN Options */}
              {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
                <>
                  <Link to="/show-customers" className={styles.dropdownItem}>
                    Show Customers
                  </Link>
                  <Link to="/add-veichles" className={styles.dropdownItem}>
                    Add Veichle
                  </Link>
                  <Link to="/ongoing-services" className={styles.dropdownItem}>
                    Ongoing Services
                  </Link>
                  <Link
                    to="/completed-services"
                    className={styles.dropdownItem}
                  >
                    Completed Services
                  </Link>
                </>
              )}

              {/* ADMIN-only options */}
              {userRole === "ADMIN" && (
                <>
                  <Link to="/show-managers" className={styles.dropdownItem}>
                    Show Users
                  </Link>
                  <Link to="/remove-customer" className={styles.dropdownItem}>
                    Remove Customer
                  </Link>
                  <Link to="/remove-managers" className={styles.dropdownItem}>
                    Remove Users
                  </Link>
                  <Link to="/show-customrs" className={styles.dropdownItem}>
                    Show Customers
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Login / Logout */}
        {isAuthenticated ? (
          <button className={styles.button} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
        )}

        {(userRole === "RECEPTIONIST" || userRole === "ADMIN") && (
          <>
            <Link to="/add-customer" className={styles.navLink}>
              Add Customer
            </Link>
          </>
        )}

        {userRole === "ADMIN" && (
          <>
            <Link to="/register" className={styles.navLink}>
              Add User
            </Link>
            <Link to="/inventory" className={styles.navLink}>
              Inventory
            </Link>
          </>
        )}

        <Link to="/mechanics" className={styles.navLink}>
          Mechanics
        </Link>
        <Link to="/add-services" className={styles.navLink}>
          Add Service
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

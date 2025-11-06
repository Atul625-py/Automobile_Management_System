import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={styles.heroSection}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to <span>RKVK Automobiles</span>
        </h1>
        <p className={styles.subtitle}>
          Excellence in Automotive Services — Where Technology Meets Trust.
        </p>

        <div className={styles.buttons}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/add-appointment-page")}
          >
            🚗 Book Appointment
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/all-invoices")}
          >
            🧾 View Invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

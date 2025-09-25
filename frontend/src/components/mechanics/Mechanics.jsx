// src/components/Mechanics.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Mechanics.module.css";
import { mechanics } from "../../store/mechanicsStore";

const Mechanics = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className={`${styles.hero} ${styles.heroMechanics}`}>
        <div className={styles.heroText}>
          <h1>Meet Our Expert Mechanics</h1>
          <p>
            Professional, experienced, and ready to keep your car in top
            condition.
          </p>
          <Link to="#mechanics-list" className={styles.btnPrimary}>
            View Team
          </Link>
        </div>
      </section>

      {/* Mechanics Section */}
      <main className={styles.container} id="mechanics-list">
        <h2 className={styles.sectionTitle}>Our Skilled Team</h2>
        <div className={styles.serviceGrid}>
          {mechanics.map((mechanic, index) => (
            <div className={styles.serviceCard} key={index}>
              <img
                src={`/images/${mechanic.image}`}
                alt={mechanic.name}
                className={styles.serviceImg}
              />
              <h3>{mechanic.name}</h3>
              <p>{mechanic.expertise}</p>
              <button className={styles.btnSecondary}>Book Appointment</button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 AutoCare Garage. Built with ❤️</p>
      </footer>
    </div>
  );
};

export default Mechanics;

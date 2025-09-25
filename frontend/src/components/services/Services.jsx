// src/components/Services.jsx
import React from "react";
import styles from "./Services.module.css";
import { services } from "../../store/mechanicsStore";

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>RKVK Automobiles</h1>
          <p>
            We provide top-quality services to keep your car running smoothly.
          </p>
          <a href="#services" className={styles.btnPrimary}>
            Explore Services
          </a>
        </div>
      </section>

      {/* Services Section */}
      <main className={styles.container} id="services">
        <h2 className={styles.sectionTitle}>Available Services</h2>
        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <div className={styles.serviceCard} key={index}>
              <img
                src={`/images/${service.image}`}
                alt={service.name}
                className={styles.serviceImg}
              />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className={styles.btnSecondary}>Book Now</button>
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

export default Services;

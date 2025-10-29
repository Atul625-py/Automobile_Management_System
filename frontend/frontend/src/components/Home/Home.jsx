import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to My App</h1>
      <p className={styles.subtitle}>
        This is the homepage of your React + Vite project.
      </p>
      <button className={styles.button}>Get Started</button>
    </div>
  );
};

export default Home;

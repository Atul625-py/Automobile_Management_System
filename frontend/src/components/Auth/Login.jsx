import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake JWT token for demo (replace with backend fetch)
    const token = "fake-jwt-token";
    localStorage.setItem("token", token);
    onLogin(true); // update login state in Navbar/App
    navigate("/"); // redirect to home after login
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login to Your Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Write your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className={styles.button} type="submit">
            🔑 Login
          </button>
        </form>

        {/* <div className={styles.switchText}>
          Don’t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register here
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;

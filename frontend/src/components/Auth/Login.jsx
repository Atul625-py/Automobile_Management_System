import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const Login = ({ onLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToBeSent = JSON.stringify({ username, password });
      console.log(dataToBeSent);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataToBeSent,
      });

      const data = await response.json();
      console.log(data);
      // console.log()
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      // Save token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "ADMIN");

      console.log("User role set to:", localStorage.getItem("role"));

      // Update login state in parent (Navbar/App)
      onLogin(true);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login to Your Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>User Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Write your username here"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
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

          {error && <p className={styles.error}>{error}</p>}

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

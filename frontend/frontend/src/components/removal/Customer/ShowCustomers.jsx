// src/pages/ShowCustomers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShowCustomers.module.css";

const ShowCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [token]);

  if (loading) return <p className={styles.loading}>Loading customers...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>👥 All Customers</h1>
      <div className={styles.cardGrid}>
        {customers.map((c) => (
          <div
            key={c.id}
            className={styles.card}
            onClick={() => navigate(`/customer/${c.id}`)}
          >
            <h2>{c.name}</h2>
            <p>Email: {c.email}</p>
            <p>Phone: {c.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCustomers;

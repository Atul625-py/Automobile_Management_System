import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShowManagers.module.css";

const ShowManagers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("/api/users/role/RECEPTIONIST", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch managers");
        const data = await response.json();
        console.log("Fetched managers:", data);
        setManagers(data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, [token]);

  if (loading) return <div className={styles.loading}>Loading managers...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Managers</h2>
      <div className={styles.managerList}>
        {managers.length === 0 ? (
          <p className={styles.empty}>No managers found.</p>
        ) : (
          managers.map((manager) => (
            <div key={manager.id} className={styles.managerCard}>
              <h3>{manager.username}</h3>
              <p>{manager.email}</p>
              <button
                className={styles.detailsBtn}
                onClick={() => navigate(`/manager/${manager.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowManagers;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ManagerDetails.module.css";

const ManagerDetails = () => {
  const { id } = useParams();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch manager details");
        const data = await response.json();
        setManager(data);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManager();
  }, [id, token]);

  if (loading)
    return <div className={styles.loading}>Loading manager details...</div>;

  if (!manager) return <div className={styles.error}>Manager not found.</div>;

  return (
    <div className={styles.container}>
      <h2>Manager Details</h2>
      <div className={styles.detailsCard}>
        <p>
          <strong>Username:</strong> {manager.username}
        </p>
        <p>
          <strong>Email:</strong> {manager.email}
        </p>
        <p>
          <strong>Phone:</strong> {manager.phone || "Not provided"}
        </p>
        <p>
          <strong>Role:</strong> {manager.role}
        </p>
        <p>
          <strong>Address:</strong> {manager.address || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ManagerDetails;

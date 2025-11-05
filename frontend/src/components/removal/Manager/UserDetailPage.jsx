import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserDetailPage.module.css";

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        alert("Error loading user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  if (loading) return <p className={styles.loading}>Loading user details...</p>;
  if (!user) return <p className={styles.error}>User not found.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        👤 User Details — {user.firstName} {user.lastName}
      </h2>

      <div className={styles.card}>
        <div className={styles.infoRow}>
          <strong>User ID:</strong> {user.userId}
        </div>

        <div className={styles.infoRow}>
          <strong>Username:</strong> {user.username}
        </div>

        <div className={styles.infoRow}>
          <strong>Role:</strong>{" "}
          <span
            className={`${styles.roleBadge} ${
              user.role?.toUpperCase() === "ADMIN"
                ? styles.admin
                : styles.manager
            }`}
          >
            {user.role}
          </span>
        </div>

        {user.emails?.length > 0 && (
          <div className={styles.infoRow}>
            <strong>Email(s):</strong>{" "}
            {user.emails.map((email, idx) => (
              <span key={idx} className={styles.email}>
                {email}
                {idx < user.emails.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        <div className={styles.infoRow}>
          <strong>House No:</strong> {user.houseNo || "—"}
        </div>

        <div className={styles.infoRow}>
          <strong>Street:</strong> {user.street || "—"}
        </div>

        <div className={styles.infoRow}>
          <strong>Locality:</strong> {user.locality || "—"}
        </div>

        <div className={styles.infoRow}>
          <strong>City:</strong> {user.city || "—"}
        </div>

        <div className={styles.infoRow}>
          <strong>Pin Code:</strong> {user.pinCode || "—"}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default UserDetailPage;

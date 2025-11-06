import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShowUsers.module.css";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        // Filter Admins & Managers
        const filtered = data.filter(
          (u) =>
            u.role?.toUpperCase() === "ADMIN" ||
            u.role?.toUpperCase() === "RECEPTIONIST"
        );

        setUsers(filtered);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Admins & Managers</h2>

      {users.length === 0 ? (
        <p className={styles.empty}>No users found.</p>
      ) : (
        <div className={styles.grid}>
          {users.map((u) => (
            <div key={u.userId} className={styles.card}>
              <div className={styles.header}>
                <h3 className={styles.name}>
                  {u.firstName} {u.lastName}
                </h3>
                <span
                  className={`${styles.role} ${
                    u.role?.toUpperCase() === "ADMIN"
                      ? styles.admin
                      : styles.manager
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className={styles.info}>
                <p>
                  <strong>Username:</strong> {u.username}
                </p>
                {u.emails && u.emails.length > 0 && (
                  <p>
                    <strong>Email:</strong> {u.emails[0]}
                  </p>
                )}
                <p>
                  <strong>City:</strong> {u.city ?? "—"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {u.houseNo
                    ? `${u.houseNo}, ${u.street ?? ""}, ${u.locality ?? ""}`
                    : "—"}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/user/${u.userId}`)}
                >
                  👁 View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowUsers;

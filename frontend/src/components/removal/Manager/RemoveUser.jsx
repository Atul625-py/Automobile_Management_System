import { useEffect, useState } from "react";
import styles from "./RemoveUser.module.css";

const RemoveUser = () => {
  const [users, setUsers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all users (both ADMIN & MANAGER)
  useEffect(() => {
    fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        // only show Admins & Managers (filter if you want to skip Receptionists)
        const filtered = data.filter(
          (u) =>
            u.role?.toUpperCase() === "ADMIN" ||
            u.role?.toUpperCase() === "MANAGER"
        );
        setUsers(filtered);
      })
      .catch((err) => console.error("❌ Error fetching users:", err));
  }, [token]);

  const handleRemove = (id) => {
    if (confirmId === id) {
      fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Delete failed");
          setUsers(users.filter((u) => u.userId !== id));
          setConfirmId(null);
          alert("✅ User deleted successfully");
        })
        .catch((err) => {
          console.error("❌ Delete error:", err);
          alert("Error deleting user");
        });
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Remove Admins & Managers</h2>
      <ul className={styles.list}>
        {users.length === 0 ? (
          <p className={styles.noUsers}>No users found</p>
        ) : (
          users.map((u) => (
            <li key={u.userId} className={styles.listItem}>
              <div className={styles.info}>
                <span className={styles.name}>
                  {u.firstName} {u.lastName}
                </span>
                <span className={styles.role}>({u.role})</span>
              </div>
              <button
                className={`${styles.button} ${
                  confirmId === u.userId ? styles.confirm : ""
                }`}
                onClick={() => handleRemove(u.userId)}
              >
                {confirmId === u.userId
                  ? "Click Again to Confirm"
                  : "Remove User"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RemoveUser;

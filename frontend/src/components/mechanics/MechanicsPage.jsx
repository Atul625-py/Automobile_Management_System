import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MechanicsPage.module.css";

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all mechanics
  const fetchMechanics = async () => {
    try {
      const response = await fetch("/api/mechanics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch mechanics");
      const data = await response.json();
      setMechanics(data);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      alert("❌ Failed to load mechanics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  // Delete mechanic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mechanic?"))
      return;
    try {
      const response = await fetch(`/api/mechanics/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("🗑️ Mechanic deleted successfully");
        setMechanics((prev) => prev.filter((m) => m.mechanicId !== id));
      } else {
        alert("❌ Failed to delete mechanic");
      }
    } catch (error) {
      console.error("Error deleting mechanic:", error);
    }
  };

  // Edit mechanic
  const handleEdit = (mechanic) => {
    navigate("/addmechanic", { state: { mechanic } });
  };

  // Add mechanic
  const handleAddMechanic = () => {
    navigate("/addmechanic");
  };

  if (loading) return <p>Loading mechanics...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>🔧 Mechanics Management</h2>
        <button onClick={handleAddMechanic} className={styles.addBtn}>
          ➕ Add Mechanic
        </button>
      </div>

      {mechanics.length === 0 ? (
        <p>No mechanics found.</p>
      ) : (
        <div className={styles.grid}>
          {mechanics.map((m) => (
            <div key={m.mechanicId} className={styles.card}>
              <h3>
                {m.firstName} {m.lastName}
              </h3>
              <p>
                <strong>City:</strong> {m.city}
              </p>
              <p>
                <strong>Locality:</strong> {m.locality}
              </p>
              <p>
                <strong>Pincode:</strong> {m.pinCode}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(m)}
                  className={`${styles.btn} ${styles.editBtn}`}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(m.mechanicId)}
                  className={`${styles.btn} ${styles.deleteBtn}`}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicsPage;

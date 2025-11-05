import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddService.module.css";

const AddService = () => {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName.trim() || !description.trim()) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceName, description }),
      });

      if (!res.ok) throw new Error("Failed to add service");
      alert("✅ Service added successfully!");
      navigate("/all-services");
    } catch (err) {
      console.error("Error adding service:", err);
      alert("❌ Could not add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>➕ Add New Service</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Service Name</label>
          <input
            type="text"
            className={styles.input}
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Enter service name (e.g., Oil Change)"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter service description"
            rows="4"
            required
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.addBtn} disabled={loading}>
            {loading ? "Adding..." : "✅ Add Service"}
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/all-services")}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;

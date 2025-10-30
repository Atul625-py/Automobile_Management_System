import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditAppointment.module.css";

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch appointment");
        const data = await res.json();
        setAppointment(data);
        setStatus(data.status);
        setDateTime(data.dateTime);
      } catch (err) {
        console.error("Error fetching appointment:", err);
        alert("❌ Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, dateTime }),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("✅ Appointment updated successfully!");
      navigate("/all-appointments");
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("❌ Could not update appointment");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!appointment)
    return <p className={styles.error}>Appointment not found!</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>✏️ Edit Appointment #{id}</h1>

      <form onSubmit={handleUpdate} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Customer ID</label>
          <input
            type="text"
            value={appointment.userId}
            disabled
            className={styles.inputDisabled}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Vehicle ID</label>
          <input
            type="text"
            value={appointment.vehicleId}
            disabled
            className={styles.inputDisabled}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Service ID</label>
          <input
            type="text"
            value={appointment.serviceId}
            disabled
            className={styles.inputDisabled}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Appointment Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.select}
          >
            <option value="BOOKED">BOOKED</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.saveBtn}>
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/all-appointments")}
            className={styles.cancelBtn}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointment;

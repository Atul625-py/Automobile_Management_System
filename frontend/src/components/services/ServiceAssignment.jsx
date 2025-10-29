// src/pages/ServiceAssignment.jsx
import React, { useEffect, useState } from "react";
import styles from "./ServiceAssignment.module.css";

const ServiceAssignment = () => {
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    vehicleId: "",
    serviceId: "",
    mechanicId: "",
    dateTime: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch all required data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, mechanicsRes, servicesRes] = await Promise.all([
          fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/mechanics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/services", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !mechanicsRes.ok || !servicesRes.ok)
          throw new Error("Failed to load dropdown data");

        const [usersData, mechanicsData, servicesData] = await Promise.all([
          usersRes.json(),
          mechanicsRes.json(),
          servicesRes.json(),
        ]);

        setCustomers(usersData);
        setMechanics(mechanicsData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("❌ Failed to load data. Please check backend APIs.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: formData.userId,
          vehicleId: formData.vehicleId,
          serviceId: formData.serviceId,
          mechanicId: formData.mechanicId,
          dateTime: formData.dateTime,
        }),
      });

      if (response.ok) {
        alert("✅ Appointment created successfully!");
        setFormData({
          userId: "",
          vehicleId: "",
          serviceId: "",
          mechanicId: "",
          dateTime: "",
        });
      } else {
        const errData = await response.json();
        alert(`❌ Failed: ${errData.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("❌ Error creating appointment");
    }
  };

  if (loading) return <p className={styles.loading}>Loading data...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🧾 Assign Service (Create Appointment)</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Customer */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Select Customer</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.userId} value={c.userId}>
                {c.firstName} {c.lastName} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Vehicle ID</label>
          <input
            type="number"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            placeholder="Enter Vehicle ID"
            className={styles.input}
            required
          />
        </div>

        {/* Service */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Select Service</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">-- Select Service --</option>
            {services.map((s) => (
              <option key={s.serviceId} value={s.serviceId}>
                {s.name} (₹{s.cost})
              </option>
            ))}
          </select>
        </div>

        {/* Mechanic */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Assign Mechanic</label>
          <select
            name="mechanicId"
            value={formData.mechanicId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">-- Select Mechanic --</option>
            {mechanics.map((m) => (
              <option key={m.mechanicId} value={m.mechanicId}>
                {m.firstName} {m.lastName} ({m.city})
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Appointment Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          ➕ Create Appointment
        </button>
      </form>
    </div>
  );
};

export default ServiceAssignment;

// src/pages/ServiceAssignment.jsx
import React, { useEffect, useState } from "react";
import styles from "./ServiceAssignment.module.css";

const ServiceAssignment = () => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    serviceId: "",
    dateTime: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch customers & services initially
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [customersRes, servicesRes] = await Promise.all([
          fetch("/api/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/services", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!customersRes.ok || !servicesRes.ok)
          throw new Error("Failed to load dropdown data");

        const [customersData, servicesData] = await Promise.all([
          customersRes.json(),
          servicesRes.json(),
        ]);

        // normalize: prefer numeric ids customer.customerId or customer.id
        setCustomers(customersData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching initial dropdowns:", err);
        alert("❌ Failed to load customers/services. Check backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [token]);

  // When customer changes, fetch vehicles for that customer id
  useEffect(() => {
    const { customerId } = formData;
    if (!customerId) {
      setVehicles([]);
      return;
    }

    const fetchVehicles = async () => {
      try {
        // ensure it's the numeric id only
        const id = Number(customerId);
        if (!id) throw new Error("Invalid customer id");

        const res = await fetch(`/api/vehicles/customer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok)
          throw new Error("Failed to fetch vehicles for this customer");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
        alert("❌ Could not fetch vehicles for selected customer");
      }
    };

    fetchVehicles();
  }, [formData.customerId, token]);

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // if customer changed, clear selected vehicle
    if (name === "customerId") setFormData((p) => ({ ...p, vehicleId: "" }));
  };

  // submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      alert("Please select a customer first.");
      return;
    }
    if (!formData.vehicleId) {
      alert("Please select a vehicle.");
      return;
    }
    if (!formData.serviceId) {
      alert("Please select a service.");
      return;
    }
    if (!formData.dateTime) {
      alert("Please select appointment date & time.");
      return;
    }

    try {
      const body = {
        userId: Number(formData.customerId), // send customer id as userId (DTO expects userId)
        vehicleId: Number(formData.vehicleId),
        serviceId: Number(formData.serviceId),
        dateTime: formData.dateTime,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Appointment created successfully!");
        setFormData({
          customerId: "",
          vehicleId: "",
          serviceId: "",
          dateTime: "",
        });
        setVehicles([]);
      } else {
        const errData = await res.json().catch(() => ({}));
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
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => {
              // choose candidate id properties (customerId or id or userId)
              const id = c.customerId ?? c.id ?? c.userId;
              const label =
                `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
                c.name ||
                id;
              const contact =
                c.emails && c.emails.length ? ` (${c.emails[0]})` : "";
              return (
                <option key={String(id)} value={String(id)}>
                  {label}
                  {contact}
                </option>
              );
            })}
          </select>
        </div>

        {/* Vehicle */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Select Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            disabled={!formData.customerId}
            className={styles.select}
          >
            <option value="">
              {formData.customerId
                ? "-- Select Vehicle --"
                : "Select a customer first"}
            </option>
            {vehicles.map((v) => {
              const vid = v.vehicleId ?? v.id;
              const reg =
                v.registrationNo ?? v.registrationNo ?? v.regNo ?? v.reg;
              return (
                <option key={String(vid)} value={String(vid)}>
                  {reg} - {v.brand ?? ""} {v.model ?? ""}
                </option>
              );
            })}
          </select>
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
            {services.map((s) => {
              const sid = s.serviceId ?? s.id;
              const name =
                s.serviceName ?? s.name ?? s.service ?? `Service ${sid}`;
              return (
                <option key={String(sid)} value={String(sid)}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Date & time */}
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

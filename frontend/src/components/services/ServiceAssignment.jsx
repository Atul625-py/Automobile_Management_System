import React, { useEffect, useState } from "react";
import styles from "./ServiceAssignment.module.css";

const ServiceAssignment = () => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    serviceIds: [], // multiple services
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

        setCustomers(customersData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching initial dropdowns:", err);
        alert("❌ Failed to load customers/services.");
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
        const res = await fetch(`/api/vehicles/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok)
          throw new Error("Failed to fetch vehicles for this customer");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        alert("❌ Could not fetch vehicles for selected customer");
      }
    };

    fetchVehicles();
  }, [formData.customerId, token]);

  // handle input changes
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === "serviceIds") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number(opt.value));
      setFormData((p) => ({ ...p, serviceIds: selected }));
    } else if (name === "customerId") {
      // clear vehicle when customer changes
      setFormData((p) => ({ ...p, customerId: value, vehicleId: "" }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  // submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) return alert("Please select a customer.");
    if (!formData.vehicleId) return alert("Please select a vehicle.");
    if (formData.serviceIds.length === 0)
      return alert("Please select at least one service.");
    if (!formData.dateTime)
      return alert("Please select appointment date & time.");

    try {
      const body = {
        userId: Number(formData.customerId),
        vehicleId: Number(formData.vehicleId),
        serviceIds: formData.serviceIds.map(Number),
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
          serviceIds: [],
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
      <h1 className={styles.heading}>
        🧾 Assign Services (Create Appointment)
      </h1>

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
              const id = c.customerId ?? c.id ?? c.userId;
              const label =
                `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
                c.name ||
                id;
              return (
                <option key={id} value={id}>
                  {label}
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
              const reg = v.registrationNo ?? v.regNo ?? v.reg ?? "Unknown";
              return (
                <option key={vid} value={vid}>
                  {reg} - {v.brand ?? ""} {v.model ?? ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* Services (multi-select) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Select Services (Multiple)</label>
          <select
            name="serviceIds"
            multiple
            value={formData.serviceIds.map(String)}
            onChange={handleChange}
            required
            className={styles.multiSelect}
          >
            {services.map((s) => {
              const sid = s.serviceId ?? s.id;
              const name =
                s.serviceName ?? s.name ?? s.service ?? `Service ${sid}`;
              return (
                <option key={sid} value={sid}>
                  {name}
                </option>
              );
            })}
          </select>
          <small className={styles.note}>
            Hold <b>Ctrl (Windows)</b> or <b>Cmd (Mac)</b> to select multiple
            services.
          </small>
        </div>

        {/* Date & Time */}
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

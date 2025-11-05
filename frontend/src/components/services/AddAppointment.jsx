import React, { useEffect, useState } from "react";
import "./AddAppointment.css";

const AddAppointment = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    vehicleId: "",
    serviceIds: [],
    dateTime: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData("/api/users", setUsers);
    fetchData("/api/vehicles", setVehicles);
    fetchData("/api/services", setServices);
  }, []);

  const fetchData = async (url, setter) => {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      setter(await res.json());
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleServiceSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) =>
      Number(o.value)
    );
    setForm((f) => ({ ...f, serviceIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create appointment");
      alert("Appointment created successfully!");
      setForm({ userId: "", vehicleId: "", serviceIds: [], dateTime: "" });
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Error creating appointment.");
    }
  };

  return (
    <div className="add-appointment-container">
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>User:</label>
        <select
          name="userId"
          value={form.userId}
          onChange={handleChange}
          required
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.fullName}
            </option>
          ))}
        </select>

        <label>Vehicle:</label>
        <select
          name="vehicleId"
          value={form.vehicleId}
          onChange={handleChange}
          required
        >
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.vehicleId} value={v.vehicleId}>
              {v.make} {v.model}
            </option>
          ))}
        </select>

        <label>Services:</label>
        <select
          multiple
          name="serviceIds"
          value={form.serviceIds}
          onChange={handleServiceSelect}
          required
        >
          {services.map((s) => (
            <option key={s.serviceId} value={s.serviceId}>
              {s.serviceName}
            </option>
          ))}
        </select>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default AddAppointment;

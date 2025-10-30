import React, { useEffect, useState } from "react";
import styles from "./AddVehicle.module.css";

const AddVehicle = () => {
  const token = localStorage.getItem("token");
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    registrationNo: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    customerId: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all customers for dropdown
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // ✅ Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchVehicles();
  }, []);

  // ✅ Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle add vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add vehicle");

      alert("✅ Vehicle added successfully!");
      setFormData({
        registrationNo: "",
        brand: "",
        model: "",
        year: "",
        fuelType: "",
        customerId: "",
      });
      fetchVehicles();
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert("❌ Failed to add vehicle");
    }
  };

  // ✅ Handle delete vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete vehicle");
      alert("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("❌ Failed to delete vehicle");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🚗 Add Vehicle</h1>

      {/* ✅ Add Vehicle Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.customerId} value={c.customerId}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="registrationNo"
          placeholder="Registration Number"
          value={formData.registrationNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          required
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button type="submit" className={styles.addButton}>
          ➕ Add Vehicle
        </button>
      </form>

      {/* ✅ Show All Vehicles */}
      <section className={styles.vehicleList}>
        <h2>All Vehicles</h2>
        {vehicles.length === 0 ? (
          <p>No vehicles found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Registration No</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Year</th>
                <th>Fuel</th>
                <th>Customer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.vehicleId}>
                  <td>{v.vehicleId}</td>
                  <td>{v.registrationNo}</td>
                  <td>{v.brand}</td>
                  <td>{v.model}</td>
                  <td>{v.year}</td>
                  <td>{v.fuelType}</td>
                  <td>{v.customerId}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(v.vehicleId)}
                      className={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AddVehicle;

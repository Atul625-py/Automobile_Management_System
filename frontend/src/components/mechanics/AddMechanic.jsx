import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AddMechanic.module.css";

const AddMechanic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Prefill mechanic if editing
  const existingMechanic = location.state?.mechanic || null;

  const [formData, setFormData] = useState({
    firstName: existingMechanic?.firstName || "",
    lastName: existingMechanic?.lastName || "",
    houseNo: existingMechanic?.houseNo || "",
    street: existingMechanic?.street || "",
    locality: existingMechanic?.locality || "",
    city: existingMechanic?.city || "",
    pinCode: existingMechanic?.pinCode || "",
  });

  const isEditMode = !!existingMechanic;

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode
      ? `/api/mechanics/${existingMechanic.mechanicId}`
      : "/api/mechanics";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isEditMode ? "✅ Mechanic updated!" : "✅ Mechanic added!");
        navigate("/mechanics");
      } else {
        const err = await response.json();
        alert(`❌ ${err.message || "Error saving mechanic"}`);
      }
    } catch (error) {
      console.error("Error saving mechanic:", error);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {isEditMode ? "✏️ Edit Mechanic" : "➕ Add New Mechanic"}
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <input
            type="text"
            name="houseNo"
            placeholder="House No"
            value={formData.houseNo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <input
            type="text"
            name="locality"
            placeholder="Locality"
            value={formData.locality}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <input
            type="text"
            name="pinCode"
            placeholder="Pincode"
            value={formData.pinCode}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          {isEditMode ? "💾 Update Mechanic" : "✅ Add Mechanic"}
        </button>

        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => navigate("/mechanics")}
        >
          ⬅️ Back
        </button>
      </form>
    </div>
  );
};

export default AddMechanic;

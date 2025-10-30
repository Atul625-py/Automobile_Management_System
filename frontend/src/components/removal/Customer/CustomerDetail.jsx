import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CustomerDetail.module.css";

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();
        setCustomer(data);
        setFormData(data); // initialize form data
      } catch (err) {
        console.error("Error fetching customer details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete customer");
      alert("Customer deleted successfully!");
      navigate("/show-customers");
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Error deleting customer!");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update customer");

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsEditing(false);
      alert("Customer updated successfully!");
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Error updating customer!");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!customer) return <p className={styles.error}>Customer not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Customer Details</h1>

      <div className={styles.details}>
        {isEditing ? (
          <>
            <label>
              First Name:
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Last Name:
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              House No:
              <input
                name="houseNo"
                value={formData.houseNo || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Street:
              <input
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Locality:
              <input
                name="locality"
                value={formData.locality || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              City:
              <input
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
            </label>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {customer.firstName} {customer.lastName}
            </p>
            {customer.emails && customer.emails.length > 0 && (
              <p>
                <strong>Email:</strong> {customer.emails[0]}
              </p>
            )}
            {customer.phones && customer.phones.length > 0 && (
              <p>
                <strong>Phone:</strong> {customer.phones[0]}
              </p>
            )}
            <p>
              <strong>Address:</strong> {customer.houseNo}, {customer.street},{" "}
              {customer.locality}, {customer.city}
            </p>
          </>
        )}
      </div>

      <div className={styles.buttonGroup}>
        {!isEditing ? (
          <>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Customer
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              🗑️ Delete Customer
            </button>
          </>
        ) : (
          <>
            <button className={styles.saveButton} onClick={handleUpdate}>
              💾 Save Changes
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setFormData(customer);
                setIsEditing(false);
              }}
            >
              ❌ Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;

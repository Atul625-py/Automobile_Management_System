// src/pages/CustomerDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CustomerDetail.module.css";

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, token]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!customer) return <p className={styles.error}>Customer not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Customer Details</h1>
      <div className={styles.details}>
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>
        <p>
          <strong>Created At:</strong> {customer.createdAt}
        </p>
      </div>
    </div>
  );
};

export default CustomerDetail;

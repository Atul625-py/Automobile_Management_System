import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShowCustomers.module.css";

const ShowCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        console.log("Fetched customers:", data);
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [token]);

  if (loading) return <p className={styles.loading}>Loading customers...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>👥 All Customers</h1>

      {customers.length === 0 ? (
        <p className={styles.noData}>No customers found.</p>
      ) : (
        <div className={styles.cardGrid}>
          {customers.map((c, index) => (
            <div
              key={c.email || c.phone || index} // ✅ unique key fallback
              className={styles.card}
              onClick={() => navigate(`/customer/${c.id || index}`)} // safe fallback
            >
              <h2>
                {c.firstName} {c.lastName}
              </h2>
              <p>
                <strong>Address:</strong> {c.houseNo}, {c.street}, {c.locality},{" "}
                {c.city}
              </p>
              {c.emails && c.emails.length > 0 && (
                <p>
                  <strong>Email:</strong> {c.emails[0]}
                </p>
              )}
              {c.phones && c.phones.length > 0 && (
                <p>
                  <strong>Phone:</strong> {c.phones[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCustomers;
